// Side dots navigation and fade-in scroll animations

document.addEventListener('DOMContentLoaded', function() {
  // Side dots
  var sections = document.querySelectorAll('.snap-section');
  var dots = document.querySelectorAll('.side-dots .dot');

  window.scrollToSection = function(i) {
    sections[i].scrollIntoView({ behavior: 'smooth' });
  };

  var sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var idx = Array.from(sections).indexOf(entry.target);
        dots.forEach(function(d, j) {
          d.classList.toggle('active', j === idx);
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(function(s) { sectionObserver.observe(s); });

  // Fade-in on scroll
  var fadeEls = document.querySelectorAll('.fade-in');
  var fadeObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach(function(el) { fadeObserver.observe(el); });
});
