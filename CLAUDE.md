# CLAUDE.md — Servare Website

## Development Commands

```bash
npm install        # Install dependencies
npm run dev        # Dev server at http://localhost:3001
npm run preview    # Preview build
```

## Project Overview

Static corporate website for **Servare**, a heritage management platform.
- **Website** (`/`) — Marketing landing page (GitHub Pages)
- **App** (`/app`) — Compiled React Native Web app (Firebase Hosting)

Design: **Model K** — Immersive Gallery with dark/light mode toggle.
Reference mockups in `/mockups/`.

## Architecture

### File Structure
```
public/
  index.html                 # Landing page
  css/
    variables.css            # Theme variables (light/dark)
    base.css                 # Reset, typography, buttons, animations
    nav.css                  # Floating nav, hamburger, menu overlay, side dots
    sections.css             # Hero, propuesta, solucion, herramientas, equipo, CTA
    contact.css              # Contact section + form
    footer.css               # Footer
  js/
    config.js                # URL configuration (dev/prod)
    nav.js                   # Nav scroll, theme toggle, menu toggle
    main.js                  # Side dots, fade-in observers
    contact.js               # EmailJS integration
  images/                    # Website assets
  app/                       # React Native Web build (deployed separately)
mockups/                     # Design references (A-K)
```

### Design System
- **Font**: DM Sans (400, 500, 700) — 1.125rem body, line-height 1.8
- **Light**: Bg #F2E8DE, alt sections white
- **Dark**: Bg #1A1816 (warm museum-at-night)
- **Accents from logo**: #F2E8DE, #B7F5BF, #71DEA0, #9EDEFB, #FFA6AD
- **Brand palette**: Blue #1E3A8A, Green #059669, Amber #D97706
- **Breakpoints**: 320px, 768px, 1200px
- **Target audience**: Users 45+ — large text, high contrast, clear navigation

### Navigation Pattern
- Hamburger menu always visible (no horizontal nav links)
- Full-screen overlay menu with page links + theme toggle
- Floating nav: transparent on hero, solid on scroll
- Side dots for section navigation

### Key Integrations

**App Redirect** — All "Solicitar Acceso" / "App" buttons call `redirectToApp()` from `config.js`.
Redirects to `https://servare-91966.web.app` in production, `http://localhost:3000` in dev.

**EmailJS Contact Form** — `contact.js` handles form submission with categorized labels.
```
SERVICE_ID: 'service_ben531s'
TEMPLATE_ID: 'template_j2qufea'
PUBLIC_KEY: 'ywSkpDeLSkQmNjMxF'
```

**Theme Toggle** — `body.dark` class, stored in `localStorage('servare-theme')`.

## Deployment

**Website**: Push to `main` branch → GitHub Pages → `servare.cloud` (via Cloudflare DNS)
**App**: Separate deploy from Servare App-Web → Firebase Hosting → `servare-91966.web.app`
**Cloudflare**: `servare.cloud/app` redirects to Firebase app hosting

## Landing Page Sections
1. **Hero** — Full-screen photo + title + CTA
2. **Por qué Servare** — Quote + 3 problem cards
3. **Lo que hace Servare** — 6 capabilities + phone mockup
4. **Herramientas** — 3x2 feature grid
5. **Equipo** — Team photo + All in Chile badge
6. **CTA** — Call to action with access button
7. **Contacto** — Info + EmailJS form

## Future Pages (planned)
- `biblioteca.html` — Curated heritage library (mockup-k-biblioteca.html)
- `repositorio.html` — Public object repository (mockup-k-repositorio.html)

## Contact
- Email: servare.dp@gmail.com
- LinkedIn: @servare-database-patrimonial
- Location: Santiago, Chile
