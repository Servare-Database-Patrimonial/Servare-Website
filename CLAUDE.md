# CLAUDE.md — Servare Website

Static corporate website for **Servare**, a heritage management platform.
Served from a Docker container (Nginx) on the Oracle Cloud VM, fronted by Traefik + Cloudflare.

The infra-level config (docker-compose, Traefik labels, env) lives in the sibling repo `app-web/docker-compose.yml` (deployed to `~/servare/` on the VM).

---

## Development Commands

```bash
npm install
npm run dev        # local dev server at http://localhost:3001
npm run preview    # preview build
```

Deploy to the VM (from `~/servare/` on the VM, where docker-compose lives):
```bash
docker compose up -d --build website
docker compose logs -f website
```

**Source of truth is `public/`.** Edit there, commit, pull on the VM, rebuild.

> Legacy: `sync-docs.sh` and `docs/` are leftovers from the GitHub Pages era. Not part of the current deploy. Don't update them.

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
  biblioteca.html          # curated heritage library
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

### App Redirect
`redirectToApp()` in `public/js/config.js` → `https://app.servare.cloud` (same VM, Traefik route).

### EmailJS Contact Form
`public/js/contact.js`. Credentials:
```
SERVICE_ID:  service_ben531s
TEMPLATE_ID: template_j2qufea
PUBLIC_KEY:  ywSkpDeLSkQmNjMxF
```
Requires `https://api.emailjs.com` in CSP `connect-src`.

### Theme Toggle
`body.dark` class, persisted in `localStorage('servare-theme')`.

### Cloudflare CSP
Configured in Cloudflare Transform Rules (zone `servare.cloud`). `connect-src` must include:
`'self'`, `https://api.servare.cloud`, `https://auth.servare.cloud`, `https://api.emailjs.com`.

When adding external API calls or script CDNs, update the Transform Rule in the Cloudflare dashboard — not just the origin nginx config (Cloudflare's rule overrides origin headers).

---

## Deployment

```
Cloudflare (DNS + proxy)
  └── servare.cloud → Oracle VM (146.235.242.138)
        └── Traefik (reverse proxy)
              ├── servare.cloud         → servare-website (nginx + public/)
              ├── app.servare.cloud     → servare-frontend
              ├── api.servare.cloud     → servare-api
              └── auth.servare.cloud    → servare-logto
```

- **VM**: Oracle Cloud Ampere A1 Always Free, Santiago region
- **SSL**: Traefik with Cloudflare DNS challenge (token in VM `.env`)
- **Traefik dashboard**: NOT exposed publicly
- **Cutover from GitHub Pages → VM**: completed 6-May-2026

---

## Landing Page Sections
1. **Hero** — full-screen photo + title
2. **Por qué Servare** — quote + 3 flip cards
3. **Lo que hace Servare** — 6 capabilities + phone mockup
4. **Herramientas** — 3x2 feature grid
5. **Equipo** — team photo + All in Chile badge
6. **CTA** — call to action with access button
7. **Contacto** — info + EmailJS form

## Additional Pages
- `biblioteca.html` — curated heritage library
- `repositorio.html` — public object repository

## Contact
- Email: `servare@management.cloud`
- LinkedIn: `@servare-database-patrimonial`
- Location: Santiago, Chile
