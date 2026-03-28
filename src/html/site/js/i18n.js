/* ═══════════════════════════════════════════
   CLIMBER TRADE — i18n Language Dropdown
   Event delegation version — works regardless
   of when DOM elements are created or replaced.
   ═══════════════════════════════════════════ */

var STORAGE_KEY = 'climber-lang';
var DEFAULT_LANG = 'en';
var SUPPORTED = ['en', 'fr', 'es'];
var LANG_LABELS = { en: 'EN', fr: 'FR', es: 'ES' };
var LANG_FLAGS = { en: '\u{1F310}', fr: '\u{1F1EB}\u{1F1F7}', es: '\u{1F1EA}\u{1F1F8}' };

function getSavedLang() {
  try {
    var s = localStorage.getItem(STORAGE_KEY);
    if (s && SUPPORTED.indexOf(s) !== -1) return s;
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
  if (SUPPORTED.indexOf(lang) === -1) return;
  saveLang(lang);
  applyTranslations(lang);
  updateDropdownUI(lang);
}

// Expose switchLanguage globally for any external callers
var switchLanguage = setLang;

// ─── EVENT DELEGATION ───────────────────────────
// A single listener on document handles all lang-dropdown interactions.
// This works even if the dropdown HTML is inserted or replaced after page load
// (e.g. by shared.js, a nav component, or any dynamic rendering).
document.addEventListener('click', function(e) {

  // 1. Toggle dropdown when clicking .lang-current (or a child of it)
  var langCurrent = e.target.closest('.lang-current');
  if (langCurrent) {
    e.stopPropagation();
    var dd = langCurrent.closest('.lang-dropdown');
    // Close every other open dropdown first
    document.querySelectorAll('.lang-dropdown.open').forEach(function(d) {
      if (d !== dd) d.classList.remove('open');
    });
    dd.classList.toggle('open');
    return;
  }

  // 2. Select a language option
  var langOption = e.target.closest('.lang-option');
  if (langOption) {
    e.stopPropagation();
    var lang = langOption.getAttribute('data-lang');
    if (lang) setLang(lang);
    return;
  }

  // 3. Click anywhere else — close all open dropdowns
  document.querySelectorAll('.lang-dropdown.open').forEach(function(dd) {
    dd.classList.remove('open');
  });
});

// Close dropdown on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.lang-dropdown.open').forEach(function(dd) {
      dd.classList.remove('open');
    });
  }
});

// ─── INIT ────────────────────────────────────────
// Apply saved language as soon as the DOM is ready.
// No bindLangEvents() needed — delegation handles everything.
(function () {
  function init() {
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
