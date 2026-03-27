/* ═══════════════════════════════════════════
   CLIMBER TRADE — SHARED JS v2
   Navbar · Mobile menu · Scroll animations · Accordions
   Form handler · Scroll-to-top · ARIA
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── NAVBAR SCROLL STATE ───
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ─── MOBILE MENU ───
  const toggle = document.querySelector('.nav-toggle');
  const mobile = document.querySelector('.nav-mobile');
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const isOpen = !mobile.classList.contains('open');
      toggle.classList.toggle('open');
      mobile.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobile.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobile.classList.contains('open')) {
        toggle.classList.remove('open');
        mobile.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  // ─── SCROLL ANIMATIONS (fade-up) ───
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // ─── ACCORDION (with ARIA) ───
  document.querySelectorAll('.accordion-item').forEach((item, i) => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    if (!trigger || !content) return;

    const id = `accordion-content-${i}`;
    content.setAttribute('id', id);
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', `accordion-trigger-${i}`);
    trigger.setAttribute('id', `accordion-trigger-${i}`);
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', id);

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all in same accordion group
      const parent = item.closest('.accordion') || item.parentElement;
      parent.querySelectorAll('.accordion-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        openItem.querySelector('.accordion-content').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // ─── ACTIVE NAV LINK (robust) ───
  const path = window.location.pathname;
  const page = path.split('/').pop().split('?')[0].split('#')[0] || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('?')[0].split('#')[0];
    const hrefPage = href.split('/').pop();
    if (hrefPage === page || (page === '' && hrefPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ─── ANIMATED COUNTERS ───
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    let start = null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = prefix + current.toLocaleString('en-US') + suffix;
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(el);
  });

  // ─── SCROLL TO TOP BUTTON ───
  const scrollBtn = document.createElement('button');
  scrollBtn.className = 'scroll-top';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  scrollBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
  document.body.appendChild(scrollBtn);

  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── CONTACT FORM HANDLER ───
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    const successMsg = contactForm.querySelector('.form-success');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Validate required fields
      contactForm.querySelectorAll('[required]').forEach(field => {
        const error = field.parentElement.querySelector('.form-error');
        if (!field.value.trim()) {
          field.classList.add('error');
          if (error) error.classList.add('show');
          valid = false;
        } else {
          field.classList.remove('error');
          if (error) error.classList.remove('show');
        }
      });

      // Validate email
      const emailField = contactForm.querySelector('input[type="email"]');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.classList.add('error');
        const error = emailField.parentElement.querySelector('.form-error');
        if (error) { error.textContent = 'Please enter a valid email'; error.classList.add('show'); }
        valid = false;
      }

      if (!valid) return;

      // Simulate submission
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        if (successMsg) {
          successMsg.classList.add('show');
          setTimeout(() => successMsg.classList.remove('show'), 5000);
        }
      }, 1200);
    });

    // Clear error on input
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        const error = field.parentElement.querySelector('.form-error');
        if (error) error.classList.remove('show');
      });
    });
  }

  // ─── SVG ARIA LABELS ───
  document.querySelectorAll('.nav-logo-icon svg, .feature-icon svg, .why-icon svg, .diff-icon svg').forEach(svg => {
    if (!svg.getAttribute('aria-label')) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-hidden', 'true');
    }
  });

  // ─── NEWSLETTER BAR (injected before footer-bottom) ───
  const footerBottom = document.querySelector('.footer-bottom');
  if (footerBottom && !document.querySelector('.newsletter-bar')) {
    const newsletter = document.createElement('div');
    newsletter.className = 'newsletter-bar';
    newsletter.innerHTML = `
      <h4>Stay in the Loop</h4>
      <form class="newsletter-form" action="#" onsubmit="return false">
        <input type="email" placeholder="Enter your email" required>
        <button type="submit">Subscribe</button>
      </form>
      <p class="newsletter-sub">Join 1,200+ traders getting weekly insights</p>
    `;
    footerBottom.parentNode.insertBefore(newsletter, footerBottom);
  }

  // ─── COOKIE CONSENT BANNER ───
  if (!localStorage.getItem('cookie-consent')) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <p class="cookie-text">We use cookies to improve your experience and analyze site traffic. By continuing, you agree to our <a href="${window.location.pathname.includes('/legal/') || window.location.pathname.includes('/education/') ? '../legal/privacy.html' : 'legal/privacy.html'}">Privacy Policy</a>.</p>
      <div class="cookie-btns">
        <button class="cookie-accept">Accept</button>
        <button class="cookie-decline">Decline</button>
      </div>
    `;
    document.body.appendChild(banner);

    setTimeout(() => {
      banner.classList.add('visible');
    }, 2000);

    banner.querySelector('.cookie-accept').addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'accepted');
      banner.classList.remove('visible');
      setTimeout(() => banner.classList.add('hidden'), 400);
    });

    banner.querySelector('.cookie-decline').addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'declined');
      banner.classList.remove('visible');
      setTimeout(() => banner.classList.add('hidden'), 400);
    });
  }

});
