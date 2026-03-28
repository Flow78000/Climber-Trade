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
      '<a href="' + faqLink + '" class="footer-pay-icon" title="Visa — View payment FAQ" aria-label="Visa">' +
        '<svg viewBox="0 0 46 15" width="46" height="15" aria-hidden="true">' +
          '<text x="1" y="13" font-family="\'Arial Black\',Arial,sans-serif" font-weight="900" font-size="13" fill="#fff" font-style="italic" letter-spacing="0.5">VISA</text>' +
        '</svg>' +
      '</a>' +
      '<a href="' + faqLink + '" class="footer-pay-icon" title="Mastercard accepted" aria-label="Mastercard">' +
        '<svg viewBox="0 0 36 22" width="36" height="22" aria-hidden="true">' +
          '<circle cx="13" cy="11" r="9" fill="#EB001B"/>' +
          '<circle cx="23" cy="11" r="9" fill="#F79E1B" opacity="0.88"/>' +
        '</svg>' +
      '</a>' +
      '<span class="footer-pay-sep" aria-hidden="true"></span>' +
      '<a href="' + faqLink + '" class="footer-pay-payout" title="Trader payouts — View payment FAQ">' +
        'Payouts via <strong>RISE WORKS</strong>' +
      '</a>';
    fpayBottom.parentNode.insertBefore(payBar, fpayBottom);
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
