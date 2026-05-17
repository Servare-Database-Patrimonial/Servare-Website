// Auth integration para landing servare.cloud — Logto JS SDK via esm.sh.
//
// Por qué un módulo ESM en CDN y no @logto/browser via bundler:
//   - El landing es HTML+CSS+vanilla JS, sin build step. Mantenerlo así.
//   - esm.sh sirve @logto/browser ya transpilado a ESM browser-nativo.
//
// Patrón:
//   - Page load: chequea si hay tokens locales (`isAuthenticated()`).
//   - Sin tokens locales: intentamos silent SSO redirect-based contra Logto
//     con `prompt=none` (1 vez por session/tab). Si hay sesión OP en
//     auth.servare.cloud (porque el user inició en biblioteca o en la app),
//     volvemos con `?code=...` y render auth. Si no, Logto redirige con
//     `?error=login_required` y marcamos el flag para no reintentar en esta
//     pestaña. Iframe silent SSO no es posible: Logto manda
//     X-Frame-Options: SAMEORIGIN + CSP frame-ancestors 'self' hardcoded
//     en koa-security-headers.ts.
//   - URL con `?code=...&state=...` → callback OIDC OK. Procesamos y
//     limpiamos la URL. Limpiamos también el flag silent_attempted (la
//     próxima vez que vuelva sin sesión podemos reintentar fresh).
//   - URL con `?error=...&state=...` → callback con error. Si veníamos del
//     silent attempt, lo damos por terminado (NO mostrar error al user).
//   - `signIn(returnTo)` → guarda returnTo y redirige a Logto (top-level,
//     sin prompt, flujo interactivo normal).
//   - `signOut()` → end_session contra Logto + vuelve a la home. Limpia el
//     flag silent_attempted para que en la próxima visita podamos detectar
//     una eventual nueva sesión.
//
// Logto SPA app: `a7lt3drdkrisl3be7ly54` (la misma que app y biblioteca usan).
// Redirect URI: `https://servare.cloud` exact (whitelisted en Fase C2). El
// callback se procesa en la home y el JS limpia los query params.

import LogtoClient from "https://esm.sh/@logto/browser@3?bundle";

const LOGTO_CONFIG = {
  endpoint: "https://auth.servare.cloud",
  appId: "a7lt3drdkrisl3be7ly54",
  resources: ["https://api.servare.cloud"],
  scopes: ["openid", "profile", "email"],
};

// Origin público del website. Logto valida exact-match contra la whitelist,
// así que esto debe coincidir EXACTO con lo registrado en la SPA.
const LANDING_ORIGIN = "https://servare.cloud";

// Key para guardar el path de retorno post-callback en sessionStorage.
const RETURN_PATH_KEY = "servare_auth_return_path";

// Key sessionStorage para el guardrail anti-loop del silent SSO. Se setea
// ANTES de redirigir a Logto con prompt=none y se limpia al recibir un
// callback OK o al hacer signOut. Mientras esté seteado, init() no intenta
// silent SSO de nuevo en esta tab.
const SILENT_ATTEMPTED_KEY = "servare_silent_sso_attempted";

let client = null;
function getClient() {
  if (!client) client = new LogtoClient(LOGTO_CONFIG);
  return client;
}

// Heurística: detecta si la URL actual es un callback OIDC con code OK.
function isCallbackUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.has("code") && params.has("state");
}

// Detecta callback de error (típicamente `login_required` del silent SSO).
function isCallbackError() {
  const params = new URLSearchParams(window.location.search);
  return params.has("error") && params.has("state");
}

// Procesa el callback de Logto y limpia la URL.
async function handleCallback() {
  const c = getClient();
  const currentUrl = window.location.href;
  try {
    await c.handleSignInCallback(currentUrl);
    // Callback exitoso → la próxima vez podemos reintentar silent fresh.
    sessionStorage.removeItem(SILENT_ATTEMPTED_KEY);
  } catch (err) {
    console.error("[servare-auth] callback failed:", err);
    // Limpiamos la URL igual para no quedar atrapado en un loop.
  }
  // Recuperar path de retorno guardado antes del signIn.
  const returnPath = sessionStorage.getItem(RETURN_PATH_KEY) || "/";
  sessionStorage.removeItem(RETURN_PATH_KEY);
  // Reemplazar la URL sin recargar (limpia los query params).
  // Si returnPath es absoluto (otro subdomain) usamos replace, sino history.
  if (returnPath.startsWith("/")) {
    window.history.replaceState({}, "", returnPath);
  } else {
    window.location.replace(returnPath);
  }
}

// Limpia los query params de un callback con error (silent SSO fallido o
// usuario canceló). No invoca al SDK porque no hay code para canjear; eso
// dejaría state corrupto en su storage.
function handleErrorCallback() {
  window.history.replaceState({}, "", "/");
}

// Dispara silent SSO redirect-based. Solo debe llamarse cuando:
//   - el user NO tiene tokens locales,
//   - NO es callback URL (ni OK ni error),
//   - NO se intentó ya en esta tab.
// El SDK genera state + PKCE verifier internamente y los guarda; al volver
// con code, handleSignInCallback() los lee. Esta función NO retorna: el
// navigate top-level abandona la página.
async function attemptSilentSSO() {
  sessionStorage.setItem(SILENT_ATTEMPTED_KEY, "1");
  try {
    await getClient().signIn({
      redirectUri: LANDING_ORIGIN,
      prompt: "none",
    });
  } catch (err) {
    // Si el SDK falla antes del navigate (ej. config rota), no queremos
    // quedar atascados — limpiar el flag y dejar caer en render anónimo.
    console.error("[servare-auth] silent SSO trigger failed:", err);
    sessionStorage.removeItem(SILENT_ATTEMPTED_KEY);
  }
}

// Inicia el flow OIDC interactivo. returnTo es path relativo o URL absoluta
// dentro del ecosistema Servare; lo guardamos en sessionStorage porque la
// redirect_uri es siempre la home (whitelisted exact).
async function signIn(returnTo) {
  const r = returnTo || (window.location.pathname + window.location.search);
  sessionStorage.setItem(RETURN_PATH_KEY, r);
  // Limpiar el guardrail de silent: el user pidió login interactivo, si
  // vuelve y luego cierra sesión, queremos que el próximo silent funcione.
  sessionStorage.removeItem(SILENT_ATTEMPTED_KEY);
  await getClient().signIn(LANDING_ORIGIN);
}

async function signOut() {
  // Limpiar el guardrail: si vuelve a entrar después de loguearse en otro
  // subdominio, queremos que el silent dispare fresh.
  sessionStorage.removeItem(SILENT_ATTEMPTED_KEY);
  try {
    await getClient().signOut(LANDING_ORIGIN);
  } catch (err) {
    console.error("[servare-auth] signOut failed:", err);
    // Fallback: forzamos navegación a la home (sin limpiar Logto session).
    window.location.href = LANDING_ORIGIN;
  }
}

// Extrae el primer nombre razonable a partir de claims o email.
function firstNameFrom(claims) {
  if (!claims) return "";
  if (claims.name) return String(claims.name).split(/\s+/)[0];
  if (claims.username) return String(claims.username).split(/[\s@.]+/)[0];
  if (claims.email) return String(claims.email).split(/[@.]+/)[0];
  return "";
}

// Reemplaza el <li> con `data-auth-slot` por items auth-aware.
// Si no encuentra el slot, no hace nada (página sin nav).
function renderAuthNav({ authenticated, firstName }) {
  const slot = document.querySelector("[data-auth-slot]");
  if (!slot) return;

  if (authenticated) {
    // Insertar "Hola, X" como hermano ANTES del primer link de navegación,
    // si no existe ya. Mantiene patrón "saludo primero" que biblioteca usa.
    // Usamos un <a> sin href para que herede automáticamente .menu-links a
    // (font-size 2rem, weight 700, color #fff) y se vea idéntico al resto.
    const list = slot.parentElement;
    if (!list.querySelector(".menu-auth-greeting")) {
      const greeting = document.createElement("li");
      greeting.className = "menu-auth-greeting";
      greeting.innerHTML = `<a>Hola, ${escapeHtml(firstName || "")}</a>`;
      list.insertBefore(greeting, list.firstElementChild);
    }
    // Reemplazar el slot por los CTAs autenticados — todo como <a> para
    // heredar el mismo tipografía/tamaño que los links del nav.
    slot.outerHTML = `
      <li><a href="https://app.servare.cloud" onclick="typeof toggleMenu==='function' && toggleMenu()">Ir a la app</a></li>
      <li><a href="https://biblioteca.servare.cloud" onclick="typeof toggleMenu==='function' && toggleMenu()">Ir a la biblioteca</a></li>
      <li><a href="#" onclick="event.preventDefault(); typeof toggleMenu==='function' && toggleMenu(); window.__servareAuth.signOut();">Cerrar sesión</a></li>
    `;
  } else {
    // Anónimo: "Iniciar sesión" reemplaza el slot. Mismo styling que los
    // demás links (sin clase menu-cta pill) para consistencia visual.
    slot.outerHTML = `
      <li><a href="#" onclick="event.preventDefault(); typeof toggleMenu==='function' && toggleMenu(); window.__servareAuth.signIn();">Iniciar sesión</a></li>
    `;
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

async function init() {
  // 1. Callback OK con `?code=...` → procesar y limpiar URL.
  if (isCallbackUrl()) {
    await handleCallback();
  } else if (isCallbackError()) {
    // 2. Callback error (típicamente login_required del silent SSO) →
    //    SOLO limpiar URL. No invocamos SDK porque no hay code que canjear.
    //    El flag SILENT_ATTEMPTED_KEY ya está seteado, así que init() no
    //    reintentará en este page load ni en cargas siguientes en esta tab.
    handleErrorCallback();
  }

  // 3. Chequear estado actual de auth (post-callback si hubo).
  let authenticated = false;
  let firstName = "";
  try {
    const c = getClient();
    authenticated = await c.isAuthenticated();
    if (authenticated) {
      const claims = await c.getIdTokenClaims();
      firstName = firstNameFrom(claims);
    }
  } catch (err) {
    console.error("[servare-auth] init failed:", err);
    authenticated = false;
  }

  // 4. Si no autenticado y todavía no probamos silent SSO en esta tab,
  //    dispararlo. Esto navega top-level — la función no retorna en el
  //    happy path; el render del nav que sigue solo corre si el SDK falló
  //    antes del navigate.
  if (!authenticated && !sessionStorage.getItem(SILENT_ATTEMPTED_KEY)) {
    await attemptSilentSSO();
    return;
  }

  // 5. Render nav según estado final.
  renderAuthNav({ authenticated, firstName });
}

// Exponemos signIn / signOut para usar desde onclick inline (los inline
// handlers no ven el scope del module). Namespace bajo __servareAuth para
// no colisionar con otros globals del site.
window.__servareAuth = { signIn, signOut };

// Lanzar init en DOMContentLoaded. Si el DOM ya está listo (script con
// `defer` después del body), corre inmediatamente.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
