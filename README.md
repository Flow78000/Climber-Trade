# 🏔 Climber Trade

> **Your Trading Partner For Success. Get Funded Without Limits.**

Revolutionary prop firm that identifies, evaluates, and funds talented traders through the CLIMB Score — a 100-point algorithmic rating across 14 metrics and 4 pillars.

[![Last Commit](https://img.shields.io/github/last-commit/Flow78000/Climber-Trade)](https://github.com/Flow78000/Climber-Trade)

---

## 🌐 Live Preview (Development)

| Site | URL | Status |
|------|-----|--------|
| **Public Website** | `src/html/site/index.html` | ✅ 19 pages |
| **Legal Document Center** | `src/html/legal-internal/index.html` | ✅ 5 contracts |
| **Data Dashboards** | `src/html/` | ✅ 5 tools |

> Open any `.html` file directly in your browser, or serve with `python -m http.server 9100 --directory src/html/site`

---

## 📁 Project Structure

```
src/
├── html/
│   ├── site/                    ← PUBLIC WEBSITE (19 pages)
│   │   ├── index.html               Home — hero, counters, 4 steps, why us
│   │   ├── how-it-works.html        4-step flow, CLIMB Score, Go Live criteria
│   │   ├── pricing.html             Standard ($199/mo) + Discovery ($49)
│   │   ├── rules.html               Trading rules + 14 KB metrics + margins
│   │   ├── faq.html                 33 questions, 8 categories, search
│   │   ├── about.html               Values, pool model, profit splits, scaling
│   │   ├── contact.html             Form, Discord, response times
│   │   ├── referral.html            Referral + Premium Affiliation programs
│   │   ├── ranks.html               6 rank tiers (No Rank → Diamond)
│   │   ├── pool.html                Public pool dashboard (Bloomberg-style)
│   │   ├── instruments.html         5 asset classes, leverage guide
│   │   ├── academy.html             3 learning tracks, CLIMB Score simulator
│   │   ├── leaderboard.html         Top traders, challenges, Hall of Fame
│   │   ├── compare.html             Honest comparison vs traditional prop firms
│   │   ├── login.html               Login form
│   │   ├── signup.html              Registration with plan selector
│   │   ├── css/shared.css           Design system tokens + components
│   │   ├── js/shared.js             Nav, scroll animations, accordions, counters
│   │   ├── js/translations.js       EN/FR/ES translations (500+ keys)
│   │   ├── js/i18n.js              Language switcher controller
│   │   └── legal/                   PUBLIC legal pages
│   │       ├── index.html               Legal hub (5 documents)
│   │       ├── cgv.html                 Terms & Conditions
│   │       ├── privacy.html             Privacy Policy
│   │       ├── mentions.html            Legal Notice
│   │       ├── nda.html                 NDA Beta Testers
│   │       └── trading-rules.html       Trading Regulations
│   │
│   ├── legal-internal/          ← INTERNAL LEGAL CENTER (not public)
│   │   ├── index.html               Document hub with view + download
│   │   └── docs/
│   │       ├── trader-contract.html     Professional Trader Contract
│   │       ├── trading-rules.html       Complete Trading Regulations
│   │       ├── nda.html                 NDA Beta Testers
│   │       ├── referral-program.html    Referral & Affiliation Terms
│   │       └── pool-spec.html           Liquidity Pool Technical Spec
│   │
│   ├── scoring-data-v2.html     ← SCORING REFERENCE (14 metrics, all barèmes)
│   ├── kb-items-v2.html         ← KNOWLEDGE BASE (educational metric guides)
│   ├── trader-guide-v2.html     ← TRADER GUIDE (targets, profiles, checklist)
│   ├── margin-data-v2.html      ← MARGIN REFERENCE (108 products, 5 exchanges)
│   └── trading-rules-v2.html    ← RULES MOCKUP (standalone sidebar version)
│
├── CLAUDE.md                    ← PROJECT MEMORY (complete specs)
└── README.md                    ← This file
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0A0A0A` | Global background |
| Card | `#131313` | Cards, panels |
| Teal | `#00D4FF` | Primary accent (used sparingly) |
| Green | `#10B981` | Success states |
| Red | `#EF4444` | Errors, alerts |
| Amber | `#F59E0B` | Warnings |
| Purple | `#8B5CF6` | Elite, special |

**Typography:** Outfit (300-800) + JetBrains Mono (data)
**Style:** Institutional fintech dark theme — no glow, no neon

---

## 🌍 Multilingual

The site supports **EN / FR / ES** via a dropdown language switcher:
- 500+ translation keys in `translations.js`
- Language persists across pages via `localStorage`
- Legal documents also have integrated EN/FR/ES switcher

---

## 📊 CLIMB Score System

**4 Pillars · 14 Metrics · Score /100**

| Pillar | Coefficient | Metrics |
|--------|-------------|---------|
| Risk Management | ×4 | ABS_NPL, INPL, R_T_AFD, CT4 |
| Performance | ×4 | Profit Factor, Sharpe, Yield |
| Consistency & Style | ×3 | Win Rate, Days in Gain, LSR |
| Quality Execution | ×2 (multiplier) | Skew, Kurtosis, Extreme Day, Best/Worst |

**Formula:** `Score = [(Risk×4 + Perf×4 + Cons×3) / 11] × (1 + (Quality-50)/500)`

---

## 💰 Business Model

| Plan | Price | Capital | Live Access |
|------|-------|---------|-------------|
| Standard | $199/mo | $1,000,000 | ✅ When qualified |
| Discovery | $49 one-time | $1,000,000 | ❌ |

**Live Threshold:** Score ≥ 85 · 7 consecutive days · 30 calendar days

**Profit Splits:** 50/50 (Score 85-89) → 60/40 (Score 95+)

**Payouts:** 5th & 20th monthly + daily on request · Min $500 · Via RISE WORKS

---

## 🔗 Social Media

- [Instagram](https://www.instagram.com/climber.trade/) · [Facebook](https://www.facebook.com/profile.php?id=61588421365977) · [X/Twitter](https://x.com/ClimberTrade) · [LinkedIn](https://www.linkedin.com/in/climber-trade-5144323b1/) · [YouTube](http://www.youtube.com/@ClimberTrade) · [TikTok](https://www.tiktok.com/@climber_trade.funding)

---

## 👥 Team

| Person | Role |
|--------|------|
| **Flo** | Founder / Product Owner |
| **Alex** | Lead Developer |

**Contact:** contact@climbertrade.com
**Website:** [www.climbertrade.com](https://www.climbertrade.com)

---

*Built with HTML/CSS/JS · React TSX dashboards · Volumetrica trading platform · aMember payments · RISE WORKS payouts*
