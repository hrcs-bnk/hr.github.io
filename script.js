/* ==========================================
   script.js — Smooth scrolling + Active nav
   No accordion/show-hide behavior anywhere.
   Keeps desktop and mobile content visible.
   ========================================== */

(function () {
  // Smooth scrolling for internal nav links
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // update hash without jumping
        history.pushState(null, '', targetId);
      }
    });
  });

  // Active navigation highlight
  const sections = Array.from(document.querySelectorAll('main section'));
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));

  function updateActiveNav() {
    const offset = window.innerHeight * 0.22; // conservative offset for detection
    let currentId = sections.length ? sections[0].id : '';

    for (const sec of sections) {
      const top = sec.getBoundingClientRect().top + window.scrollY;
      if ((window.scrollY + offset) >= top) {
        currentId = sec.id;
      }
    }

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }

  // Optimize scroll handling
  let rafId = null;
  function onScroll() {
    if (rafId) return;
    rafId = window.requestAnimationFrame(() => {
      updateActiveNav();
      rafId = null;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateActiveNav);

  // Initialize on load
  document.addEventListener('DOMContentLoaded', () => {
    updateActiveNav();
    // if user opens with hash, scroll smoothly to that section
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();
