/* ═══════════════════════════════════════════
   CLIMBER TRADE — i18n Language Dropdown
   ═══════════════════════════════════════════ */

const STORAGE_KEY = 'climber-lang';
const DEFAULT_LANG = 'en';
const SUPPORTED = ['en', 'fr', 'es'];
const LANG_LABELS = { en: 'EN', fr: 'FR', es: 'ES' };
const LANG_FLAGS = { en: '\u{1F310}', fr: '\u{1F1EB}\u{1F1F7}', es: '\u{1F1EA}\u{1F1F8}' };

function getSavedLang() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s && SUPPORTED.includes(s)) return s;
  } catch (e) {}
  return DEFAULT_LANG;
}

function saveLang(lang) {
  try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
}

function applyTranslations(lang) {
  if (typeof TRANSLATIONS === 'undefined') {
    console.warn('[i18n] TRANSLATIONS not defined — is translations.js loaded?');
    return;
  }
  var dict = TRANSLATIONS[lang];
  if (!dict) {
    console.warn('[i18n] No dictionary for lang:', lang);
    return;
  }
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (!dict[key]) return;
    if (el.hasAttribute('data-i18n-placeholder')) {
      el.setAttribute('placeholder', dict[key]);
      return;
    }
    // Use innerHTML when element has data-i18n-html attribute (for tags inside)
    if (el.hasAttribute('data-i18n-html')) {
      el.innerHTML = dict[key];
    } else {
      el.textContent = dict[key];
    }
  });
  document.documentElement.setAttribute('lang', lang);
}

function updateDropdownUI(lang) {
  document.querySelectorAll('.lang-dropdown').forEach(function (dd) {
    var cur = dd.querySelector('.lang-current');
    if (cur) {
      var flag = cur.querySelector('.lang-flag');
      if (flag) flag.textContent = LANG_FLAGS[lang] || '\u{1F310}';
      cur.childNodes.forEach(function(n) {
        if (n.nodeType === 3 && n.textContent.trim()) n.textContent = LANG_LABELS[lang] || 'EN';
      });
    }
    dd.querySelectorAll('.lang-option').forEach(function (opt) {
      opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });
    dd.classList.remove('open');
  });
}

function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  saveLang(lang);
  applyTranslations(lang);
  updateDropdownUI(lang);
}

// Bind all events via JS (not inline onclick — which can be blocked by CSP)
function bindLangEvents() {
  // Toggle dropdowns
  document.querySelectorAll('.lang-current').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var dd = btn.closest('.lang-dropdown');
      // Close all other dropdowns
      document.querySelectorAll('.lang-dropdown.open').forEach(function(d) {
        if (d !== dd) d.classList.remove('open');
      });
      dd.classList.toggle('open');
    });
  });

  // Language options
  document.querySelectorAll('.lang-option').forEach(function(opt) {
    opt.addEventListener('click', function(e) {
      e.stopPropagation();
      var lang = opt.getAttribute('data-lang');
      if (lang) setLang(lang);
    });
  });

  // Close on outside click
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.lang-dropdown')) {
      document.querySelectorAll('.lang-dropdown.open').forEach(function(dd) {
        dd.classList.remove('open');
      });
    }
  });
}

// Init
(function () {
  function init() {
    bindLangEvents();
    var lang = getSavedLang();
    applyTranslations(lang);
    updateDropdownUI(lang);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
