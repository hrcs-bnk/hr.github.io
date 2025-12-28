/**
 * =========================================================
 * script.js
 * Smooth scrolling + Active navigation highlighting
 * No accordion / no show-hide behavior
 * Desktop and mobile show full content always
 * =========================================================
 */

'use strict';

(function () {

  /* -------------------------------------------------------
     Smooth scrolling for internal navigation links
  -------------------------------------------------------- */
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        e.preventDefault();

        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Update URL hash without abrupt jump
        try {
          history.pushState(null, '', targetId);
        } catch (err) {
          // Fallback for restricted environments (e.g., file://)
          location.hash = targetId;
        }
      }
    });
  });

  /* -------------------------------------------------------
     Active navigation highlight on scroll
  -------------------------------------------------------- */
  const sections = Array.from(document.querySelectorAll('main section'));
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));

  function updateActiveNav() {
    if (!sections.length) return;

    const scrollPosition = window.scrollY + window.innerHeight * 0.25;
    let currentSectionId = sections[0].id;

    for (const section of sections) {
      const sectionTop = section.offsetTop;
      if (scrollPosition >= sectionTop) {
        currentSectionId = section.id;
      }
    }

    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${currentSectionId}`;
      link.classList.toggle('active', isActive);
    });
  }

  /* -------------------------------------------------------
     Throttled scroll handler using requestAnimationFrame
  -------------------------------------------------------- */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateActiveNav);

  /* -------------------------------------------------------
     Initialize on DOM ready
  -------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    updateActiveNav();

    // Smooth scroll if page loaded with a hash
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 60);
      }
    }
  });

})();
