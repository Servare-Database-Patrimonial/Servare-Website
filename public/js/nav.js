// Navigation, theme toggle, and scroll effects.

// Tema (claro/oscuro): persistido en una cookie `servare-theme` con
// Domain=.servare.cloud para compartirlo entre subdominios (servare.cloud,
// biblioteca.servare.cloud, app.servare.cloud). El SSR ya renderiza
// <body class="dark"> leyendo esa cookie, así que NO hay flash. Acá solo:
//   - migramos usuarios legacy que tenían el tema en localStorage (per-origen)
//     sembrando la cookie compartida,
//   - sincronizamos en runtime (no-op en páginas SSR, fallback en otras),
//   - escribimos cookie + localStorage al togglear.
// Antes esto fallaba: el IIFE corría en <head> y document.body era null.

function writeThemeCookie(value) {
  // El punto inicial del domain lo hace válido para todos los subdominios.
  var domain = location.hostname.indexOf('servare.cloud') !== -1 ? '; domain=.servare.cloud' : '';
  document.cookie = 'servare-theme=' + value + '; path=/' + domain + '; max-age=31536000; samesite=lax';
}

function readThemeStore() {
  var m = ('; ' + document.cookie).split('; servare-theme=')[1];
  if (m) return m.split(';')[0];
  try { return localStorage.getItem('servare-theme'); } catch (e) { return null; }
}

// Migración legacy (corre en <head>, solo usa document.cookie/localStorage — no
// necesita body): si no hay cookie pero sí preferencia vieja, sembrar la cookie.
(function () {
  var hasCookie = ('; ' + document.cookie).indexOf('; servare-theme=') !== -1;
  if (!hasCookie) {
    var ls = null;
    try { ls = localStorage.getItem('servare-theme'); } catch (e) {}
    if (ls === 'dark' || ls === 'light') writeThemeCookie(ls);
  }
})();

function applyThemeFromStore() {
  var value = readThemeStore();
  if (value === 'dark') document.body.classList.add('dark');
  else if (value === 'light') document.body.classList.remove('dark');
}

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle('dark');
  var value = document.body.classList.contains('dark') ? 'dark' : 'light';
  writeThemeCookie(value);
  try { localStorage.setItem('servare-theme', value); } catch (e) {}
}

// Menu toggle
function toggleMenu() {
  document.getElementById('hamburgerBtn').classList.toggle('active');
  document.getElementById('menuOverlay').classList.toggle('active');
  document.body.style.overflow =
    document.getElementById('menuOverlay').classList.contains('active') ? 'hidden' : '';
}

document.addEventListener('DOMContentLoaded', function() {
  // Sync runtime: en SSR el <body> ya viene con la clase (no-op); en contextos
  // sin SSR aplica la preferencia (con un flash mínimo, aceptable como fallback).
  applyThemeFromStore();

  // Navbar scroll effect
  var nav = document.querySelector('.floating-nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }
});
