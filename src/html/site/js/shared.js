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

  // ─── FOOTER PAYMENT METHODS BAR ───
  const fpayBottom = document.querySelector('.footer-bottom');
  if (fpayBottom && !document.querySelector('.footer-payments')) {
    const isDeep = /\/(education|legal)\//.test(window.location.pathname);
    const faqLink = (isDeep ? '../' : '') + 'faq.html?ref=payment#payment-methods';
    const payBar = document.createElement('div');
    payBar.className = 'footer-payments';
    payBar.innerHTML =
      '<span class="footer-pay-label">Secure payments</span>' +
      /* ── Visa — logo officiel blanc/bleu ── */
      '<a href="' + faqLink + '" class="footer-pay-icon" title="Visa — View payment FAQ" aria-label="Visa" style="padding:0 8px;height:30px;background:#fff;border-color:#e0e0e0;">' +
        '<svg viewBox="0 0 780 500" width="44" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
          '<path fill="#1A1F71" d="M293 348.5L328.4 152h55.8L348.8 348.5z"/>' +
          '<path fill="#1A1F71" d="M524.3 157.2c-11.1-4.1-28.5-8.5-50.2-8.5-55.3 0-94.3 27.9-94.6 67.8-.3 29.5 27.9 46 49.2 55.8 21.9 10.1 29.2 16.5 29.1 25.5-.1 13.8-17.5 20.1-33.6 20.1-22.5 0-34.4-3.1-52.8-10.8l-7.2-3.3-7.9 46.1c13.1 5.7 37.4 10.7 62.6 11 59 0 97.2-27.6 97.7-70.3.2-23.4-14.8-41.2-47.2-55.9-19.7-9.5-31.7-15.9-31.6-25.5 0-8.5 10.2-17.7 32.3-17.7 18.4-.3 31.8 3.7 42.1 7.9l5.1 2.4 7.9-45.6z"/>' +
          '<path fill="#1A1F71" d="M635.8 152h-43.2c-13.4 0-23.4 3.6-29.3 16.9L484 348.5h59s9.6-25.2 11.8-30.7h72.1c1.7 7.2 6.9 30.7 6.9 30.7h52.1L635.8 152zm-69.2 122.4c4.7-12 22.5-57.8 22.5-57.8s4.6-11.9 7.5-19.6l3.8 17.7s10.8 49.4 13 59.7h-46.8z"/>' +
          '<path fill="#1A1F71" d="M241.8 152l-54.8 133.5-5.8-28.4c-10.2-32.7-41.9-68.2-77.4-85.9l50.1 177.3h59.5L315.6 152h-73.8z"/>' +
          '<path fill="#F2AE14" d="M134.1 152H46.6l-.7 4.1c67.9 16.4 113.0 56.1 131.6 103.8L158.2 169c-3.4-13-13.2-16.6-25.4-17z"/>' +
        '</svg>' +
      '</a>' +
      /* ── Mastercard — cercles rouge/orange avec intersection ── */
      '<a href="' + faqLink + '" class="footer-pay-icon" title="Mastercard accepted" aria-label="Mastercard" style="padding:0 8px;">' +
        '<svg viewBox="0 0 50 32" width="50" height="32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
          '<rect width="50" height="32" rx="5" fill="#252525"/>' +
          '<circle cx="19" cy="16" r="11" fill="#EB001B"/>' +
          '<circle cx="31" cy="16" r="11" fill="#F79E1B"/>' +
          '<path d="M25 6.78A11 11 0 0 1 25 25.22A11 11 0 0 0 25 6.78Z" fill="#FF5F00"/>' +
        '</svg>' +
      '</a>' +
      '<span class="footer-pay-sep" aria-hidden="true"></span>' +
      /* ── RISE WORKS — badge payout ── */
      '<a href="' + faqLink + '" class="footer-pay-payout" title="Trader payouts via RISE WORKS — View payment FAQ">' +
        '<svg viewBox="0 0 20 20" width="15" height="15" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0" aria-hidden="true">' +
          '<rect width="20" height="20" rx="4" fill="#1a2e1a"/>' +
          '<path d="M10 14V7M7 10l3-3 3 3" stroke="#4ade80" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
        'Payouts via <strong>RISE WORKS</strong>' +
      '</a>';
    fpayBottom.parentNode.insertBefore(payBar, fpayBottom);
  }

  // ─── DISCORD SOCIAL ICON (injection sur toutes les pages) ───
  const footerSocials = document.querySelector('.footer-socials');
  if (footerSocials && !footerSocials.querySelector('.footer-social-discord')) {
    const dc = document.createElement('a');
    dc.href = '#discord'; // lien à remplacer quand disponible
    dc.className = 'footer-social footer-social-discord';
    dc.target = '_blank';
    dc.rel = 'noopener';
    dc.title = 'Discord';
    dc.setAttribute('aria-label', 'Discord');
    dc.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">' +
        '<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 13.79 13.79 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>' +
      '</svg>';
    footerSocials.appendChild(dc);
  }

  // ─── FOOTER LEGAL DISCLOSURES (CFTC) ───
  const fdiscBottom = document.querySelector('.footer-bottom');
  if (fdiscBottom && !document.querySelector('.footer-disclosures')) {
    const discEl = document.createElement('div');
    discEl.className = 'footer-disclosures';
    discEl.innerHTML =
      '<button class="footer-disclosures-toggle" id="footerDiscToggle" aria-expanded="false">' +
        'Legal Disclosures' +
        '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="2 4 6 8 10 4"/></svg>' +
      '</button>' +
      '<div class="footer-disc-body" id="footerDiscBody">' +
        '<div>' +
          '<div class="footer-disc-title">CFTC Required Disclaimer</div>' +
          '<p class="footer-disc-text">Trading futures and options presents great potential rewards, but also great potential risk. You need to be aware of the risks and be willing to accept them to invest in the futures markets. Don\u2019t trade with money you can\u2019t afford to lose. This is neither a solicitation nor an offer to buy or sell futures contracts, shares or options thereon. No representation is made that any account will or is likely to realize profits or losses similar to those discussed on this website. Past performance of any trading system or methodology is not necessarily indicative of future results.</p>' +
        '</div>' +
        '<div>' +
          '<div class="footer-disc-title">CFTC Rule 4.41</div>' +
          '<p class="footer-disc-text">Hypothetical or simulated performance results have certain limitations. Unlike an actual performance record, simulated results do not represent actual trades. Furthermore, since the trades have not been executed, the results may have under- or over-compensated for the impact, if any, of certain market factors, such as lack of liquidity. Simulated trading programs in general are also subject to the fact that they are designed with hindsight. No representation is made that any account will or is likely to generate profits or losses similar to those shown. Our courses, products and services are to be used as learning aids only and are not to be used to invest real money. If you decide to invest real money, all business decisions must be your own.</p>' +
        '</div>' +
        '<div>' +
          '<div class="footer-disc-title">Testimonial Disclosure</div>' +
          '<p class="footer-disc-text">Testimonials appearing on this website may not be representative of other customers and do not constitute a guarantee of future performance or success.</p>' +
        '</div>' +
      '</div>';
    fdiscBottom.insertAdjacentElement('afterend', discEl);
    const discToggle = discEl.querySelector('#footerDiscToggle');
    const discBody = discEl.querySelector('#footerDiscBody');
    discToggle.addEventListener('click', function() {
      const open = discBody.classList.toggle('open');
      discToggle.classList.toggle('open', open);
      discToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
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
