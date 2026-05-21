# CLAUDE.md — Servare Website

Corporate website for **Servare**, a heritage management platform.

> ## ⚠️ POST-CUTOVER (21-May-2026) — el sitio live YA NO se sirve desde este repo
>
> Issue **#8** migró `servare.cloud` de HTML estático (nginx) a **SSR Fastify+EJS**
> dentro del container **`servare-api`** del repo **`app-web`** (mismo stack que
> `biblioteca.servare.cloud`). El container nginx `servare-website` fue **deprecado
> y removido**.
>
> **Qué vive AHORA en `app-web` (la fuente de verdad del sitio):**
> - Templates EJS: `app-web/backend/src/views/website/` (`_layout.ejs`, `index.ejs`,
>   `repositorio.ejs`, `en-desarrollo.ejs`).
> - Rutas: `app-web/backend/src/routes/website-public.js` (páginas + redirects legacy
>   `.html` + `featuredDocs`) y `website-auth.js` (OIDC server-side).
> - Plugins: `plugins/website-view.js` (EJS) y `plugins/website-auth.js` (sesión).
> - Assets (css/js/images): copiados a `app-web/backend/public/website/`, servidos por
>   `@fastify/static` bajo `/website/*`.
> - Routing: Traefik `Host(servare.cloud)` → `api` con middleware `addprefix /website`
>   (ver `app-web/docker-compose.yml`, service `api`).
>
> **Qué queda en ESTE repo:** la **fuente de los assets** (`public/css`, `public/js`,
> `public/images`) que se copia a `app-web/backend/public/website/`. Los `public/*.html`
> son **legacy/referencia** (el live son los `.ejs` de app-web). Si editás un asset acá,
> hay que copiarlo a app-web y rebuildear el `api`. (Pendiente: decidir un único home
> para los assets — ver #8.)

---

## Development Commands (assets / referencia)

```bash
npm install
npm run dev        # preview estático de public/ en http://localhost:3001
                   # OJO: muestra los HTML legacy, NO el SSR live. Para el sitio
                   # real corré el backend de app-web (ver app-web/CLAUDE.md).
```

## Deploy (= rebuild del `api` de app-web)

El sitio se despliega rebuildando `servare-api` en la VM. **No hay container `website`.**

```bash
# 1. Sincronizar el cambio a app-web:
#    - assets (css/js/images): copiar public/<x> → app-web/backend/public/website/<x>
#    - contenido/markup/lógica: editar los .ejs/rutas en app-web/backend/src/...
#    Commit + push en app-web (repo ServareApp).
# 2. En la VM:
ssh -i ~/.ssh/servare-oracle ubuntu@146.235.242.138
cd ~/servare && git pull origin main          # ~/servare = checkout de app-web
docker compose up -d --build api               # rebuild del SSR (afecta brevemente biblioteca/api)
docker compose logs -f api
```

> Legacy: `sync-docs.sh` y `docs/` son leftovers de la era GitHub Pages — borrables.
> El antiguo deploy del container nginx (`docker compose up --build website`,
> `~/Servare-website_servidor`) ya no aplica post-cutover #8.

---

## Project Overview

- **Website** (`servare.cloud`) — marketing landing.
- **App** (`app.servare.cloud`) — React Native Web app served from the same VM (different container).

Design: **Model K** — Immersive Gallery with dark/light mode toggle. Reference mockups in `/mockups/`.

---

## Architecture

### File Structure
```
public/                    # source of truth, served by nginx
  index.html               # landing
  biblioteca.html          # redirect a https://biblioteca.servare.cloud (canonical + meta refresh + JS)
  repositorio.html         # public object repository
  css/
    variables.css          # theme variables (light/dark)
    base.css               # reset, typography, buttons, animations
    nav.css                # floating nav, hamburger, overlay, side dots
    sections.css           # hero, propuesta, solucion, herramientas, equipo, CTA
    contact.css            # contact section + form
    footer.css
  js/
    config.js              # URL config (APP_URL, WEBSITE_URL, contact)
    nav.js                 # nav scroll, theme toggle, menu toggle
    main.js                # side dots, fade-in observers
    contact.js             # EmailJS integration
  images/
mockups/                   # design references (A-K)
Dockerfile                 # nginx:alpine + public/
nginx.conf                 # nginx site config
```

### Design System
- **Font**: DM Sans (400, 500, 700) — 1.125rem body, line-height 1.8
- **Light**: bg `#F2E8DE`, alt sections white
- **Dark**: bg `#1A1816` (warm museum-at-night)
- **Accents from logo**: `#F2E8DE`, `#B7F5BF`, `#71DEA0`, `#9EDEFB`, `#FFA6AD`
- **Brand palette**: blue `#1E3A8A`, green `#059669`, amber `#D97706`
- **Breakpoints**: 320px, 520px, 768px, 1200px
- **Target audience**: users 45+ — large text, high contrast, clear navigation

### Mobile Responsive
- Scroll snap disabled on `< 768px`
- Side dots hidden on `< 520px`
- Hero h1 scales: 2.5rem → 2rem → 1.7rem
- Footer stacks centered on mobile

### Navigation Pattern
- Hamburger menu always visible
- Full-screen overlay menu with page links + theme toggle
- Floating nav: transparent on hero, solid on scroll
- Side dots for section navigation

---

## Key Integrations

### App / nav unificado
El nav server-side (`_layout.ejs` de app-web) tiene el **mismo set de links en todas las páginas** (website + biblioteca): Inicio · Biblioteca · Repositorio · **App** (`https://app.servare.cloud`) · sesión · theme. Así se llega a la app desde cualquier lado. `redirectToApp()` en `public/js/config.js` queda como helper legacy.

> El viejo `location /app` 301 del nginx ya no existe (nginx removido en #8). Si hace falta, agregarlo como ruta en `website-public.js`.

### Biblioteca pública
Vive en `biblioteca.servare.cloud` (subdomain separado, SSR Fastify+EJS desde el container `servare-api` con middleware Traefik que inyecta prefijo `/biblioteca`). NO está en este repo — código en `app-web/backend/src/views/library/` y `app-web/backend/src/routes/library-public.js`. El archivo `public/biblioteca.html` de este repo solo redirige a ese subdomain.

### EmailJS Contact Form
`public/js/contact.js`. Credentials:
```
SERVICE_ID:  service_ben531s
TEMPLATE_ID: template_j2qufea
PUBLIC_KEY:  ywSkpDeLSkQmNjMxF
```
Requires `https://api.emailjs.com` in CSP `connect-src`.

### Theme Toggle (claro/oscuro)
Clase `body.dark`, persistida en una **cookie `servare-theme` con `Domain=.servare.cloud`** (compartida entre `servare.cloud`, `biblioteca`, `app`) + `localStorage` (fallback/migración legacy). El **SSR lee la cookie y renderiza `<body class="dark">`** desde la primera respuesta (`reply.locals.themeDark`, hook por scope en `buildApp.js`) → sin flash, persiste entre páginas y subdominios. Toggle en `public/js/nav.js` (`toggleTheme`).

> El HTML SSR sale con `Cache-Control: no-store` (varía por cookie tema/sesión) — sin esto el browser cacheaba el HTML y el tema quedaba "pegado". `app.servare.cloud` (RN Web) maneja su tema aparte: para unificarlo también, leer la misma cookie.

### Auth — portal login server-side (#7 + #8)
Landing auth-aware **server-side**: cookie de sesión `web_sess` (logto_sub firmado, HMAC), OIDC PKCE contra Logto. Rutas `app-web/backend/src/routes/website-auth.js` (`/iniciar-sesion`, `/callback`, `/cerrar-sesion`); plugin `plugins/website-auth.js` (**degrada con gracia** si falta `WEBSITE_SESSION_SECRET` — no tumba el boot del api). El nav renderiza "Hola, X" + Cerrar sesión / Iniciar sesión **sin flicker**. Logto SPA `a7lt3drdkrisl3be7ly54`: redirect `https://servare.cloud/callback` + post-logout `https://servare.cloud/` (ya whitelisteados). El viejo `public/js/auth.js` client-side quedó **deprecado**.

### Cloudflare headers
Verificado al cutover (17 may 2026): **NO hay Transform Rule de CSP activa** en la zona. EmailJS y demás integraciones funcionan sin policy explícita. Post-#8 los security headers (`X-Frame-Options`, etc.) los pone el middleware Traefik `security-headers@docker` (aplicado al router `website-public`) + `@fastify/helmet` en el api — ya no nginx.

Si en el futuro hay que activar CSP, hacerlo en la Transform Rule de CF (`connect-src` debería incluir `'self'`, `https://api.servare.cloud`, `https://auth.servare.cloud`, `https://api.emailjs.com`). Cloudflare's rule overrides origin headers.

---

## Deployment

```
Cloudflare (DNS + proxy)
  └── servare.cloud → Oracle VM (146.235.242.138)
        └── Traefik (reverse proxy)
              ├── servare.cloud              → servare-api (HTML SSR, addprefix /website)  ← #8 (era nginx servare-website)
              ├── www.servare.cloud          → CF Redirect Rule 301 → servare.cloud
              ├── app.servare.cloud          → servare-frontend
              ├── api.servare.cloud          → servare-api (JSON)
              ├── auth.servare.cloud         → servare-logto
              └── biblioteca.servare.cloud   → servare-api (HTML SSR, addprefix /biblioteca)
```

- **VM**: Oracle Cloud Ampere A1 Always Free, Santiago region
- **SSL**: Traefik with Cloudflare DNS challenge (token in VM `.env`)
- **Traefik dashboard**: NOT exposed publicly
- **Cutover from GitHub Pages → VM**: completed **17-May-2026** (la nota previa decía 6-May pero solo se había completado el cutover de `app.`; el del apex `servare.cloud` quedó pendiente y se ejecutó el 17 — DNS apex CNAME→GH Pages cambió a A record→VM IP, junto con DELETE de Redirect Rule CF `/app→Firebase`).

---

## Landing Page Sections (home → `views/website/index.ejs`)
1. **Hero** — full-screen photo + title
2. **Por qué Servare** — quote + 3 flip cards
3. **Lo que hace Servare** — 6 capabilities + phone mockup
4. **Herramientas** — 3x2 feature grid
5. **Equipo** — team photo + All in Chile badge
6. **Desde la Biblioteca** — franja dinámica `featuredDocs` (últimos docs published/cc de la biblioteca; query en `website-public.js`, oculta si no hay docs) ← #8
7. **CTA** — call to action with access button
8. **Contacto** — info + EmailJS form

## Additional Pages (rutas SSR)
- `/repositorio` — repositorio público de objetos (hoy **data mock**; `repositorio.ejs`). Nav "Repositorio" apunta acá.
- `/en-desarrollo` — placeholder (`noindex`).
- Biblioteca vive en `biblioteca.servare.cloud` (subdomain). Redirects legacy `.html` → ruta SSR en `website-public.js`.

## Contact
- Email: `servare@management.cloud`
- LinkedIn: `@servare-database-patrimonial`
- Location: Santiago, Chile
