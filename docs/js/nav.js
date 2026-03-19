// Navigation, theme toggle, and scroll effects

// Apply saved theme immediately (prevent flash)
(function() {
  var saved = localStorage.getItem('servare-theme');
  if (saved === 'dark') {
    document.body.classList.add('dark');
  }
})();

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle('dark');
  var isDark = document.body.classList.contains('dark');
  localStorage.setItem('servare-theme', isDark ? 'dark' : 'light');
}

// Menu toggle
function toggleMenu() {
  document.getElementById('hamburgerBtn').classList.toggle('active');
  document.getElementById('menuOverlay').classList.toggle('active');
  document.body.style.overflow =
    document.getElementById('menuOverlay').classList.contains('active') ? 'hidden' : '';
}

// Navbar scroll effect (deferred until DOM ready)
document.addEventListener('DOMContentLoaded', function() {
  var nav = document.querySelector('.floating-nav');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
});
