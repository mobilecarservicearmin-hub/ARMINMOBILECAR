/* ═══════════════════════════════════════════════════
   ARMIN SERVICE — main.js
   Handles: sticky nav · mobile menu · scroll reveals
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Sticky Header ────────────────────────────── */
  const header = document.getElementById('header');

  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load


  /* ─── Mobile Menu ──────────────────────────────── */
  const toggle    = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta-btn');

  function openMenu() {
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    mobileMenu.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    if (toggle.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });

  // Close when clicking outside menu content
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });


  /* ─── Smooth Scroll ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = header.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });


  /* ─── Scroll Reveal (IntersectionObserver) ─────── */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -48px 0px',
      }
    );

    document.querySelectorAll('[data-reveal]').forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all immediately
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.classList.add('is-visible');
    });
  }


  /* ─── Active Nav Link on Scroll ────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.style.color = 'var(--c-gold-light)';
            } else {
              link.style.color = '';
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(section => sectionObserver.observe(section));


  /* ─── Hero: Entrance animations on load ────────── */
  window.addEventListener('DOMContentLoaded', () => {
    // Badge and hero content are driven by CSS transitions
    // triggered by IntersectionObserver above.
    // For the hero (already visible), trigger immediately:
    const heroElements = document.querySelectorAll('.hero [data-reveal]');
    heroElements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('is-visible');
      }, 100 + i * 90);
    });
  });

  /* ─── SVG Line Draw Animation (Anime.js) ───────── */
  window.addEventListener('load', () => {
    if (typeof anime !== 'undefined') {
      anime({
        targets: [
          '.category-icon svg path', '.category-icon svg circle', '.category-icon svg polyline', '.category-icon svg rect', '.category-icon svg polygon', '.category-icon svg line',
          '.service-card-icon svg path', '.service-card-icon svg circle', '.service-card-icon svg polyline', '.service-card-icon svg rect', '.service-card-icon svg polygon', '.service-card-icon svg line',
          '.feature-icon svg path', '.feature-icon svg circle', '.feature-icon svg polyline', '.feature-icon svg rect', '.feature-icon svg polygon', '.feature-icon svg line',
          '.step-icon svg path', '.step-icon svg circle', '.step-icon svg polyline', '.step-icon svg rect', '.step-icon svg polygon', '.step-icon svg line'
        ].join(', '),
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 1500,
        delay: function(el, i) { return i * 30; },
        direction: 'alternate',
        loop: true
      });
    }
  });

})();
