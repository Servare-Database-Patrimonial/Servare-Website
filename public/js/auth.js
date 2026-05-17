// Auth integration para landing servare.cloud — Logto JS SDK via esm.sh.
//
// Por qué un módulo ESM en CDN y no @logto/browser via bundler:
//   - El landing es HTML+CSS+vanilla JS, sin build step. Mantenerlo así.
//   - esm.sh sirve @logto/browser ya transpilado a ESM browser-nativo.
//
// Patrón:
//   - Page load: chequea si hay tokens locales (`isAuthenticated()`). Sin
//     tokens locales, NO hacemos silent SSO cross-subdomain todavía (sería
//     una segunda fase con iframe). En este MVP: si tiene tokens → render
//     auth-aware; si no → render anónimo (que es lo que el HTML ya muestra).
//   - URL con `?code=...&state=...` → es el callback de Logto. Procesamos
//     y limpiamos la URL.
//   - `signIn(returnTo)` → guarda returnTo y redirige a Logto.
//   - `signOut()` → end_session contra Logto + vuelve a la home.
//
// Logto SPA app: `a7lt3drdkrisl3be7ly54` (la misma que app y biblioteca usan).
// Redirect URI: `https://servare.cloud` exact (whitelisted en Fase C2). El
// callback se procesa en la home y el JS limpia los query params.

import LogtoClient from "https://esm.sh/@logto/browser@3?bundle";

// ─────────────────────────────────────────────────────────────────────
// Workaround Mixed Content: Logto 1.38 detrás de Traefik NO confía en
// X-Forwarded-Proto, así que el discovery doc devuelve URLs http:// para
// el endpoint público. El SDK browser respeta esas URLs y dispara fetch
// HTTP desde una página HTTPS → bloqueado por Mixed Content del browser.
//
// Fix: interceptamos window.fetch ANTES del primer uso del SDK y reescribimos
// http://auth.servare.cloud → https://... en respuestas del well-known.
// Patch contenido (solo afecta requests al discovery, no las demás del site).
// Cuando Logto soporte trust-proxy nativo, sacar este wrapper.
// ─────────────────────────────────────────────────────────────────────
(function patchFetchForLogtoMixedContent() {
  const PUBLIC_HOST = "auth.servare.cloud";
  const _origFetch = window.fetch.bind(window);
  window.fetch = async function (input, init) {
    const url = typeof input === "string" ? input : (input && input.url) || "";
    const response = await _origFetch(input, init);
    if (url.includes(PUBLIC_HOST) && url.includes("/.well-known/openid-configuration")) {
      const text = await response.clone().text();
      const fixed = text.replace(
        new RegExp(`http://${PUBLIC_HOST}`, "g"),
        `https://${PUBLIC_HOST}`
      );
      return new Response(fixed, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }
    return response;
  };
})();

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

let client = null;
function getClient() {
  if (!client) client = new LogtoClient(LOGTO_CONFIG);
  return client;
}

// Heurística: detecta si la URL actual es un callback OIDC.
function isCallbackUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.has("code") && params.has("state");
}

// Procesa el callback de Logto y limpia la URL.
async function handleCallback() {
  const c = getClient();
  const currentUrl = window.location.href;
  try {
    await c.handleSignInCallback(currentUrl);
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

// Inicia el flow OIDC. returnTo es path relativo o URL absoluta dentro
// del ecosistema Servare; lo guardamos en sessionStorage porque la
// redirect_uri es siempre la home (whitelisted exact).
async function signIn(returnTo) {
  const r = returnTo || (window.location.pathname + window.location.search);
  sessionStorage.setItem(RETURN_PATH_KEY, r);
  await getClient().signIn(LANDING_ORIGIN);
}

async function signOut() {
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
    const list = slot.parentElement;
    if (!list.querySelector(".menu-auth-greeting")) {
      const greeting = document.createElement("li");
      greeting.className = "menu-auth-greeting";
      greeting.innerHTML = `<span>Hola, <strong>${escapeHtml(firstName || "")}</strong></span>`;
      list.insertBefore(greeting, list.firstElementChild);
    }
    // Reemplazar el slot por los CTAs autenticados.
    slot.outerHTML = `
      <li><a href="https://app.servare.cloud" class="menu-cta" onclick="typeof toggleMenu==='function' && toggleMenu()">Ir a la app</a></li>
      <li><a href="https://biblioteca.servare.cloud" onclick="typeof toggleMenu==='function' && toggleMenu()">Ir a la biblioteca</a></li>
      <li><button type="button" class="menu-auth-logout" onclick="typeof toggleMenu==='function' && toggleMenu(); window.__servareAuth.signOut()">Cerrar sesión</button></li>
    `;
  } else {
    // Anónimo: "Iniciar sesión" reemplaza el slot.
    slot.outerHTML = `
      <li><a href="#" class="menu-cta" onclick="event.preventDefault(); typeof toggleMenu==='function' && toggleMenu(); window.__servareAuth.signIn();">Iniciar sesión</a></li>
    `;
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

async function init() {
  // Si es callback, procesarlo primero antes de pintar el nav.
  if (isCallbackUrl()) {
    await handleCallback();
  }

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
