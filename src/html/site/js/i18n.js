/* ═══════════════════════════════════════════
   CLIMBER TRADE — i18n Language Switcher
   Reads/saves language preference in localStorage
   Auto-applies saved language on page load
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  const STORAGE_KEY = 'climber-lang';
  const DEFAULT_LANG = 'en';
  const SUPPORTED = ['en', 'fr', 'es'];

  /* ── Get saved or default language ── */
  function getSavedLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.includes(saved)) return saved;
    } catch (e) { /* localStorage unavailable */ }
    return DEFAULT_LANG;
  }

  /* ── Save language preference ── */
  function saveLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* noop */ }
  }

  /* ── Apply translations to all [data-i18n] elements ── */
  function applyTranslations(lang) {
    if (typeof TRANSLATIONS === 'undefined') return;
    const dict = TRANSLATIONS[lang];
    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!dict[key]) return; // no translation for this key

      // Handle placeholder attributes
      if (el.hasAttribute('data-i18n-placeholder')) {
        el.setAttribute('placeholder', dict[key]);
        return;
      }

      // Handle aria-label
      if (el.hasAttribute('data-i18n-aria')) {
        el.setAttribute('aria-label', dict[key]);
        return;
      }

      // Default: replace text content
      el.textContent = dict[key];
    });

    // Update html lang attribute
    document.documentElement.setAttribute('lang', lang);

    // Update active state on language buttons
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  /* ── Initialize on DOM ready ── */
  function init() {
    var currentLang = getSavedLang();

    // Bind click events on language buttons
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        if (!lang || !SUPPORTED.includes(lang)) return;
        currentLang = lang;
        saveLang(lang);
        applyTranslations(lang);
      });
    });

    // Apply saved language on load
    applyTranslations(currentLang);
  }

  // Run on DOMContentLoaded or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
