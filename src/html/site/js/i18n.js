/* ═══════════════════════════════════════════
   CLIMBER TRADE — i18n Language Dropdown
   Reads/saves language preference in localStorage
   Auto-applies saved language on page load
   ═══════════════════════════════════════════ */

const STORAGE_KEY = 'climber-lang';
const DEFAULT_LANG = 'en';
const SUPPORTED = ['en', 'fr', 'es'];
const LANG_LABELS = { en: 'EN', fr: 'FR', es: 'ES' };
const LANG_FLAGS = { en: '🌐', fr: '🇫🇷', es: '🇪🇸' };

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
  if (typeof TRANSLATIONS === 'undefined') return;
  const dict = TRANSLATIONS[lang];
  if (!dict) return;
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    const key = el.getAttribute('data-i18n');
    if (!dict[key]) return;
    if (el.hasAttribute('data-i18n-placeholder')) {
      el.setAttribute('placeholder', dict[key]);
      return;
    }
    el.textContent = dict[key];
  });
  document.documentElement.setAttribute('lang', lang);
}

function updateDropdownUI(lang) {
  document.querySelectorAll('.lang-dropdown').forEach(function (dd) {
    // Update current button text
    const cur = dd.querySelector('.lang-current');
    if (cur) {
      const flag = cur.querySelector('.lang-flag');
      if (flag) flag.textContent = LANG_FLAGS[lang] || '🌐';
      // Update the text node (between flag and chevron)
      const nodes = cur.childNodes;
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType === 3 && nodes[i].textContent.trim()) {
          nodes[i].textContent = LANG_LABELS[lang] || 'EN';
        }
      }
    }
    // Update active state in menu
    dd.querySelectorAll('.lang-option').forEach(function (opt) {
      opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });
    // Close dropdown
    dd.classList.remove('open');
  });
}

// Global function called by onclick
function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  saveLang(lang);
  applyTranslations(lang);
  updateDropdownUI(lang);
}

// Close dropdown when clicking outside
document.addEventListener('click', function (e) {
  if (!e.target.closest('.lang-dropdown')) {
    document.querySelectorAll('.lang-dropdown.open').forEach(function (dd) {
      dd.classList.remove('open');
    });
  }
});

// Init on load
(function () {
  function init() {
    const lang = getSavedLang();
    applyTranslations(lang);
    updateDropdownUI(lang);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
