/* ===================================================================
   AUGURE Capital — Propfirm de prédiction (mode test)
   Multi-comptes (max 5) · Phase 1 paper · Phase 2 financée simulée
   Polymarket Gamma + CLOB via /api/polymarket et /api/clob
   =================================================================== */

// -------------------- CONFIG --------------------
const TIERS = {
  discovery:  { id:'discovery',  name:'Discovery',  size:1000,   fee:29,  positionMax:0.25, minMarkets:5  },
  foundation: { id:'foundation', name:'Foundation', size:5000,   fee:69,  positionMax:0.25, minMarkets:5  },
  standard:   { id:'standard',   name:'Standard',   size:25000,  fee:169, positionMax:0.25, minMarkets:8  },
  pro:        { id:'pro',        name:'Pro',        size:100000, fee:499, positionMax:0.20, minMarkets:10 },
  master:     { id:'master',     name:'Master',     size:250000, fee:999, positionMax:0.20, minMarkets:12 },
};

const RULES = {
  profitTarget:        0.10,
  maxOverallDD:        0.05,
  maxDailyDDP1:        0.02,
  maxDailyDDP2:        0.02,
  maxDailyDDScaled:    0.015,
  maxTotalExposure:    0.80,
  minMarketVolume:     1_000_000,
  minTimeToResolution: 48 * 3600 * 1000,
  minTradesGate:       30,
  maxBrier:            0.22,
  minMeanROI:          0.03,
  minSharpe:           1.0,
  minCategories:       3,
  splitTrader:         0.95,
  splitFirm:           0.05,
  payoutCadenceDays:   14,
  minPayout:           50,
  scaleAfterPayouts:   2,
  scaleIncrementPct:   0.25,
  maxScaleMultiplier:  5,
  poolFeeShare:        0.50,         // 50% of each fee feeds the pool
  maxAccountsPerUser:  5,
};

const POLYMARKET_API = '/api/polymarket/markets';
const CLOB_BOOK = '/api/clob/book';
const STORAGE_KEY = 'augure-state-v1';
const POOL_INITIAL = 500_000;

const CATEGORY_LABELS_FR = {
  geopolitics:   'Géopolitique',
  politics:      'Politique',
  economics:     'Économie',
  crypto:        'Crypto',
  sports:        'Sport',
  tech:          'Tech',
  entertainment: 'Divertissement',
  science:       'Science',
  misc:          'Divers',
};

const CATEGORY_KEYWORDS = [
  ['geopolitics',['ukraine','russia','putin','zelensky','israel','gaza','iran','tehran','china','taiwan','war','ceasefire','nato','sanction','hostage','syria','venezuela']],
  ['politics',   ['election','president','senator','congress','vote','biden','trump','harris','primary','democrat','republican','prime minister','presidential','impeach','referendum','party leader']],
  ['economics',  ['fed','rate cut','interest rate','inflation','recession','gdp','cpi','fomc','unemployment','tariff','treasury','yield','jobs report']],
  ['crypto',     ['bitcoin','btc','ethereum','eth','solana',' sol ','cryptocurrency','dogecoin','memecoin',' xrp ','blockchain']],
  ['sports',     ['fifa','world cup','nba','nfl','mlb','nhl','soccer','tennis','olympic','champions league','playoffs','super bowl','wins ','beat ',' vs ']],
  ['tech',       ['openai','google','apple','tesla','meta','microsoft','nvidia','ai ',' gpt','llm','iphone','spacex','starlink']],
  ['entertainment',['movie','album','song','oscar','grammy','concert','gta vi','taylor swift','rihanna','box office','netflix','spotify','album release']],
  ['science',    ['nasa','mars mission','moon landing','vaccine','climate','antarctic','asteroid']],
];

// -------------------- STATE --------------------
let state = null;

function defaultState() {
  return {
    accounts: {},          // map id -> account
    activeAccountId: null,
    pool: {
      cash: POOL_INITIAL,
      allocated: 0,
      events: [{ type:'seed', amount: POOL_INITIAL, ts: Date.now(), note:'Seed initial du pool (simulé)' }],
    },
    markets: [],
    lastFetch: 0,
    activeTab: 'markets',
    activeCategory: 'all',
    kyc: { identity:false, address:false, wallet:false },
    showOverview: true,    // start on the dashboard
  };
}

function defaultAccount(tierId, name) {
  const tier = TIERS[tierId];
  const id = 'A' + Date.now() + Math.floor(Math.random()*1000);
  return {
    id,
    name: name || `Compte ${tier.name}`,
    tier: tierId,
    size: tier.size,
    initialAllocation: tier.size,
    balance: tier.size,
    hwm: tier.size,
    balanceStartOfDay: tier.size,
    lastDayKey: todayKey(),
    breach: false,
    breachReason: null,
    openTrades: [],
    closedTrades: [],
    closedTradesArchive: [],
    phase: 1,
    fundedAt: null,
    scalingLevel: 0,
    consecutivePayouts: 0,
    payouts: [],
    lastPayoutAt: null,
    createdAt: Date.now(),
    phase1Stats: null,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return Object.assign(defaultState(), JSON.parse(raw));
  } catch(e) { console.warn('state load failed', e); }
  return defaultState();
}
function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {} }

function getActiveAccount() { return state.activeAccountId ? state.accounts[state.activeAccountId] : null; }
function listAccounts() { return Object.values(state.accounts).sort((a,b) => a.createdAt - b.createdAt); }

// -------------------- POLYMARKET API --------------------
const Polymarket = {
  async fetchMarkets({ limit = 60 } = {}) {
    const url = `${POLYMARKET_API}?limit=${limit}&active=true&closed=false&order=volume24hr&ascending=false`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return data.map(this.normalize).filter(Boolean);
  },
  async fetchOrderbook(tokenId) {
    const res = await fetch(`${CLOB_BOOK}?token_id=${encodeURIComponent(tokenId)}`);
    if (!res.ok) throw new Error(`CLOB ${res.status}`);
    return res.json();
  },
  normalize(m) {
    if (!m) return null;
    let outcomes = m.outcomes;
    let prices = m.outcomePrices;
    let clobIds = m.clobTokenIds;
    try { if (typeof outcomes === 'string') outcomes = JSON.parse(outcomes); } catch {}
    try { if (typeof prices === 'string') prices = JSON.parse(prices); } catch {}
    try { if (typeof clobIds === 'string') clobIds = JSON.parse(clobIds); } catch {}
    if (!Array.isArray(outcomes) || !Array.isArray(prices)) return null;
    const yesIdx = outcomes.findIndex(o => /yes/i.test(o));
    const noIdx  = outcomes.findIndex(o => /no/i.test(o));
    if (yesIdx === -1 || noIdx === -1) return null;
    const yesPrice = parseFloat(prices[yesIdx]);
    const noPrice  = parseFloat(prices[noIdx]);
    if (Number.isNaN(yesPrice) || Number.isNaN(noPrice)) return null;
    const text = `${m.question || ''} ${m.slug || ''}`.toLowerCase();
    return {
      id: String(m.id),
      slug: m.slug,
      question: m.question,
      category: categorize(text),
      tags: m.tags || [],
      volume: m.volumeNum ?? parseFloat(m.volume) ?? 0,
      liquidity: m.liquidityNum ?? parseFloat(m.liquidity) ?? 0,
      endDate: m.endDate,
      yesPrice, noPrice,
      icon: m.icon,
      enableOrderBook: m.enableOrderBook,
      yesTokenId: Array.isArray(clobIds) ? clobIds[yesIdx] : null,
      noTokenId:  Array.isArray(clobIds) ? clobIds[noIdx]  : null,
    };
  },
};

function categorize(text) {
  for (const [cat, kws] of CATEGORY_KEYWORDS) {
    for (const kw of kws) if (text.includes(kw)) return cat;
  }
  return 'misc';
}

// -------------------- RULES --------------------
const Rules = {
  maxDailyDD(account) {
    if (!account) return RULES.maxDailyDDP1;
    if (account.phase === 1) return RULES.maxDailyDDP1;
    return account.scalingLevel > 0 ? RULES.maxDailyDDScaled : RULES.maxDailyDDP2;
  },
  validateTrade({ market, side, amount, account }) {
    const errors = [];
    if (!market || !account) return ['invalid'];
    if (account.breach) errors.push('Compte liquidé (DD dépassé)');
    if (market.volume < RULES.minMarketVolume) errors.push(`Volume du marché < $${(RULES.minMarketVolume/1_000_000).toFixed(1)}M`);
    if (market.endDate) {
      const ttr = new Date(market.endDate).getTime() - Date.now();
      if (ttr < RULES.minTimeToResolution) errors.push(`Résolution < 48h (dans ${formatDuration(ttr)})`);
    }
    if (amount <= 0) errors.push('Mise > 0 requise');
    const price = side === 'YES' ? market.yesPrice : market.noPrice;
    if (price <= 0 || price >= 1) errors.push('Prix marché invalide');
    const tier = TIERS[account.tier];
    if (amount / account.size > tier.positionMax) errors.push(`Position > ${(tier.positionMax*100).toFixed(0)}% (max ${tier.name})`);
    const openExposure = account.openTrades.reduce((s,t) => s + t.cost, 0);
    if ((openExposure + amount) > account.size * RULES.maxTotalExposure) errors.push(`Exposition totale > ${(RULES.maxTotalExposure*100).toFixed(0)}%`);
    if (amount > market.volume * 0.10) errors.push('Position > 10% du volume du marché');
    return errors;
  },
  computeDD(account) {
    const balance = computeBalance(account);
    const overallDD = (account.hwm - balance) / account.size;
    const dailyDD = (account.balanceStartOfDay - balance) / account.size;
    return { overallDD, dailyDD, balance };
  },
  enforceDD(account) {
    if (account.breach) return;
    const { overallDD, dailyDD } = Rules.computeDD(account);
    const dailyMax = Rules.maxDailyDD(account);
    if (dailyDD > dailyMax) {
      account.breach = true;
      account.breachReason = `DD journalier ${(dailyDD*100).toFixed(2)}% > ${(dailyMax*100).toFixed(1)}%`;
      Phase2.handleBreach(account);
    } else if (overallDD > RULES.maxOverallDD) {
      account.breach = true;
      account.breachReason = `DD global ${(overallDD*100).toFixed(2)}% > ${(RULES.maxOverallDD*100).toFixed(0)}%`;
      Phase2.handleBreach(account);
    }
  },
  evaluateGate(account) {
    const trades = account.closedTrades || [];
    const n = trades.length;
    const realizedPnL = trades.reduce((s,t) => s + t.pnl, 0);
    const pnlPct = realizedPnL / account.size;
    const rois = trades.map(t => t.pnl / Math.max(t.cost, 1e-6));
    const meanRoi = rois.length ? mean(rois) : 0;
    const sd = rois.length > 1 ? stdev(rois) : 0;
    const sharpe = sd > 0 ? (meanRoi / sd) : 0;
    const brier = computeBrier(trades);
    const categories = new Set(trades.map(t => t.category || 'misc'));
    const { overallDD } = Rules.computeDD(account);
    const gates = {
      pnl:       { label:'Objectif profit ≥ 10%',           pass: pnlPct >= RULES.profitTarget, value: `${(pnlPct*100).toFixed(2)}%` },
      n_trades:  { label:`Trades clos ≥ ${RULES.minTradesGate}`, pass: n >= RULES.minTradesGate, value: `${n}` },
      brier:     { label:`Brier ≤ ${RULES.maxBrier}`,        pass: n>0 && brier <= RULES.maxBrier, value: n>0 ? brier.toFixed(3) : '—' },
      roi:       { label:`ROI moyen ≥ ${(RULES.minMeanROI*100).toFixed(0)}%`, pass: meanRoi >= RULES.minMeanROI, value: `${(meanRoi*100).toFixed(2)}%` },
      sharpe:    { label:`Sharpe-eq ≥ ${RULES.minSharpe.toFixed(1)}`, pass: sharpe >= RULES.minSharpe, value: sharpe.toFixed(2) },
      max_dd:    { label:'DD max ≤ 5%',                       pass: overallDD <= RULES.maxOverallDD, value: `${(overallDD*100).toFixed(2)}%` },
      diversity: { label:`Diversité ≥ ${RULES.minCategories} catégories`, pass: categories.size >= RULES.minCategories, value: `${categories.size}` },
      no_breach: { label:'Aucune liquidation',                pass: !account.breach, value: account.breach ? 'liquidé' : 'OK' },
    };
    return { passed: Object.values(gates).every(g => g.pass), gates };
  },
};

// -------------------- POOL --------------------
const Pool = {
  recordFee(amount, note) {
    // 50% to the pool, 50% retained by the firm (ignored in this ledger)
    const poolShare = amount * RULES.poolFeeShare;
    state.pool.cash += poolShare;
    state.pool.events.unshift({ type:'fee', amount: poolShare, ts: Date.now(), note: `${note} · 50% pool · 50% firme` });
  },
  recordAllocation(amount, note) {
    state.pool.cash -= amount;
    state.pool.allocated += amount;
    state.pool.events.unshift({ type:'allocation', amount: -amount, ts: Date.now(), note });
  },
  recordPayout(traderShare, firmShare, note) {
    state.pool.cash += firmShare;
    state.pool.events.unshift({ type:'payout', amount: firmShare, ts: Date.now(), note: `${note} · trader ${formatUSD(traderShare)} / firme ${formatUSD(firmShare)}` });
  },
  recordRecovery(amount, note) {
    state.pool.cash += amount;
    state.pool.allocated -= amount;
    state.pool.events.unshift({ type:'recovery', amount, ts: Date.now(), note });
  },
  recordLoss(amount, note) {
    state.pool.allocated -= amount;
    state.pool.events.unshift({ type:'loss', amount: -amount, ts: Date.now(), note });
  },
};

// -------------------- PHASE 2 --------------------
const Phase2 = {
  promote(account) {
    if (account.phase !== 1) return { ok:false, error:'Déjà financé' };
    const { passed } = Rules.evaluateGate(account);
    if (!passed) return { ok:false, error:'Validation Phase 1 incomplète' };
    if (!isKycComplete()) return { ok:false, error:'KYC incomplet (Paramètres)' };
    return Phase2._fund(account, 'Financement Phase 2');
  },
  forcePromote(account) {
    if (account.phase !== 1) return { ok:false, error:'Déjà financé' };
    if (!isKycComplete()) return { ok:false, error:'KYC incomplet' };
    return Phase2._fund(account, 'Financement Phase 2 (admin)');
  },
  _fund(account, label) {
    const tier = TIERS[account.tier];
    const allocation = tier.size;
    if (state.pool.cash < allocation) return { ok:false, error:'Pool insuffisant' };
    account.phase1Stats = {
      closedAt: Date.now(),
      totalRealized: account.closedTrades.reduce((s,t) => s + t.pnl, 0),
      brier: computeBrier(account.closedTrades),
      tradeCount: account.closedTrades.length,
    };
    Pool.recordAllocation(allocation, `${label} — ${tier.name} (${account.name})`);
    account.phase = 2;
    account.fundedAt = Date.now();
    account.size = allocation;
    account.initialAllocation = allocation;
    account.scalingLevel = 0;
    account.consecutivePayouts = 0;
    account.payouts = [];
    account.lastPayoutAt = null;
    account.openTrades = [];
    account.closedTradesArchive = (account.closedTradesArchive||[]).concat(account.closedTrades);
    account.closedTrades = [];
    account.balance = allocation;
    account.hwm = allocation;
    account.balanceStartOfDay = allocation;
    account.lastDayKey = todayKey();
    account.breach = false;
    account.breachReason = null;
    return { ok:true };
  },
  available(account) {
    if (account.phase !== 2) return 0;
    const profit = computeBalance(account) - account.size;
    return profit > 0 ? profit * RULES.splitTrader : 0;
  },
  realized(account) {
    if (account.phase !== 2) return 0;
    return computeBalance(account) - account.size;
  },
  isPayoutEligible(account) {
    if (account.phase !== 2) return { ok:false, reason:'Pas en Phase 2' };
    if (account.breach) return { ok:false, reason:'Compte liquidé' };
    const profit = Phase2.realized(account);
    if (profit < (RULES.minPayout / RULES.splitTrader)) return { ok:false, reason:`Profit ≥ $${(RULES.minPayout / RULES.splitTrader).toFixed(2)} requis` };
    if (account.openTrades.length > 0) return { ok:false, reason:'Clôturer toutes les positions ouvertes' };
    return { ok:true };
  },
  requestPayout(account) {
    const elig = Phase2.isPayoutEligible(account);
    if (!elig.ok) return { ok:false, error:elig.reason };
    const profit = Phase2.realized(account);
    const traderShare = profit * RULES.splitTrader;
    const firmShare = profit * RULES.splitFirm;
    const tier = TIERS[account.tier];
    Pool.recordPayout(traderShare, firmShare, `Retrait ${tier.name} (${account.name})`);
    account.payouts.unshift({ id:'P'+Date.now(), ts:Date.now(), profit, traderShare, firmShare, sizeAtPayout: account.size });
    account.lastPayoutAt = Date.now();
    account.consecutivePayouts++;
    account.closedTradesArchive = (account.closedTradesArchive||[]).concat(account.closedTrades);
    account.closedTrades = [];
    account.balance = account.size;
    account.hwm = account.size;
    account.balanceStartOfDay = account.size;
    account.lastDayKey = todayKey();
    if (account.consecutivePayouts >= RULES.scaleAfterPayouts) Phase2.tryScale(account);
    return { ok:true, traderShare, firmShare };
  },
  tryScale(account) {
    const baseMax = account.initialAllocation * RULES.maxScaleMultiplier;
    const nextSize = account.size + (account.initialAllocation * RULES.scaleIncrementPct);
    if (nextSize > baseMax) return { ok:false };
    const additional = nextSize - account.size;
    if (state.pool.cash < additional) return { ok:false };
    Pool.recordAllocation(additional, `Scale-up L${account.scalingLevel + 1} — ${TIERS[account.tier].name} (${account.name})`);
    account.scalingLevel++;
    account.consecutivePayouts = 0;
    account.size = nextSize;
    account.balance = nextSize;
    account.hwm = nextSize;
    account.balanceStartOfDay = nextSize;
    toast(`Compte mis à l'échelle ${formatUSD(nextSize)} (L${account.scalingLevel})`, 'success');
    return { ok:true };
  },
  handleBreach(account) {
    if (account.phase !== 2) return;
    const balance = Math.max(0, computeBalance(account));
    const total = account.size;
    const recovered = Math.min(balance, total);
    const lost = total - recovered;
    const tier = TIERS[account.tier];
    if (recovered > 0) Pool.recordRecovery(recovered, `Récupération — ${tier.name} (${account.name}) liquidé`);
    if (lost > 0) Pool.recordLoss(lost, `Perte absorbée — ${tier.name} (${account.name}) liquidé`);
  },
};

// -------------------- HELPERS --------------------
function mean(arr) { return arr.reduce((s,x) => s+x, 0) / arr.length; }
function stdev(arr) { const m = mean(arr); return Math.sqrt(arr.reduce((s,x) => s + (x-m)**2, 0) / arr.length); }
function computeBrier(trades) {
  const valid = trades.filter(t => t.outcome === 0 || t.outcome === 1);
  if (!valid.length) return 1;
  const sum = valid.reduce((s,t) => {
    const yesProb = t.side === 'YES' ? t.entryPrice : (1 - t.entryPrice);
    return s + (yesProb - t.outcome) ** 2;
  }, 0);
  return sum / valid.length;
}
function computeBalance(account) {
  const realized = account.closedTrades.reduce((s,t) => s + t.pnl, 0);
  const mtm = account.openTrades.reduce((s,t) => s + (t.shares * t.currentPrice - t.cost), 0);
  return account.size + realized + mtm;
}
function formatUSD(n) {
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  return `${sign}$${abs.toLocaleString('fr-FR',{ maximumFractionDigits: 2 })}`;
}
function formatShort(n) {
  if (n >= 1e9) return (n/1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n/1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n/1e3).toFixed(1) + 'k';
  return n.toFixed(0);
}
function formatPct(n, digits=2) { return `${(n*100).toFixed(digits)}%`; }
function formatDuration(ms) {
  if (ms < 0) return 'expiré';
  const h = ms / 3600_000;
  if (h < 24) return `${h.toFixed(1)}h`;
  return `${(h/24).toFixed(1)}j`;
}
function todayKey() { return new Date().toISOString().slice(0,10); }
function escapeHTML(s) {
  return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function isKycComplete() { return state.kyc.identity && state.kyc.address && state.kyc.wallet; }
function maybeRolloverDay(account) {
  if (!account) return;
  const today = todayKey();
  if (account.lastDayKey !== today) {
    account.lastDayKey = today;
    account.balanceStartOfDay = computeBalance(account);
    saveState();
  }
}

// -------------------- ACCOUNT ACTIONS --------------------
function createAccount(tierId) {
  const list = listAccounts();
  if (list.length >= RULES.maxAccountsPerUser) {
    toast(`Maximum ${RULES.maxAccountsPerUser} comptes simultanés`, 'error'); return;
  }
  const tier = TIERS[tierId];
  if (!tier) return;
  // suggest a unique name
  const baseName = `Compte ${tier.name}`;
  let name = baseName;
  let i = 2;
  while (list.some(a => a.name === name)) name = `${baseName} #${i++}`;
  const account = defaultAccount(tierId, name);
  state.accounts[account.id] = account;
  state.activeAccountId = account.id;
  state.showOverview = false;
  Pool.recordFee(tier.fee, `Frais challenge — ${tier.name} (${name})`);
  saveState();
  toast(`${name} créé — Phase 1 active`, 'success');
}

function switchAccount(id) {
  if (!state.accounts[id]) return;
  state.activeAccountId = id;
  state.showOverview = false;
  state.activeTab = 'markets';
  saveState();
  render();
}

function deleteAccount(id) {
  const a = state.accounts[id];
  if (!a) return;
  if (!confirm(`Supprimer ${a.name} ? Toutes les données seront perdues.`)) return;
  if (a.phase === 2 && !a.breach) Phase2.handleBreach(a);
  delete state.accounts[id];
  if (state.activeAccountId === id) {
    state.activeAccountId = listAccounts()[0]?.id || null;
    state.showOverview = !state.activeAccountId;
  }
  saveState();
  render();
  toast('Compte supprimé', 'info');
}

function resetPool() {
  if (!confirm('Réinitialiser le pool ? Historique et allocations effacés.')) return;
  state.pool = defaultState().pool;
  saveState(); render(); toast('Pool réinitialisé', 'info');
}
function resetAll() {
  if (!confirm('TOUT réinitialiser (comptes + pool + KYC) ?')) return;
  state = defaultState();
  saveState(); render(); toast('Réinitialisation complète', 'info');
}

// -------------------- TRADING --------------------
function placeTrade({ market, side, amount }) {
  const account = getActiveAccount();
  if (!account) return { ok:false, errors:['Pas de compte actif'] };
  const errors = Rules.validateTrade({ market, side, amount, account });
  if (errors.length) return { ok:false, errors };
  const price = side === 'YES' ? market.yesPrice : market.noPrice;
  const shares = amount / price;
  account.openTrades.push({
    id: 'T' + Date.now() + '-' + Math.floor(Math.random()*1e4),
    marketId: market.id, slug: market.slug, question: market.question, category: market.category,
    side, entryPrice: price, currentPrice: price, shares, cost: amount,
    openedAt: Date.now(), endDate: market.endDate, marketVolumeAtEntry: market.volume,
    closed: false, closedAt: null, exitPrice: null, pnl: null, outcome: null,
  });
  saveState();
  toast(`${side === 'YES' ? 'OUI' : 'NON'} ${shares.toFixed(2)} parts @ ${price.toFixed(3)}`, 'success');
  return { ok:true };
}

function closeTrade(tradeId) {
  const account = getActiveAccount();
  if (!account) return;
  const idx = account.openTrades.findIndex(t => t.id === tradeId);
  if (idx === -1) return;
  const t = account.openTrades[idx];
  const m = state.markets.find(mm => mm.id === t.marketId);
  const exit = m ? (t.side === 'YES' ? m.yesPrice : m.noPrice) : t.currentPrice;
  const proceeds = t.shares * exit;
  const pnl = proceeds - t.cost;
  account.openTrades.splice(idx, 1);
  account.closedTrades.unshift({ ...t, closed:true, closedAt: Date.now(), exitPrice: exit, pnl, outcome: null, manual: true });
  account.hwm = Math.max(account.hwm, computeBalance(account));
  Rules.enforceDD(account);
  saveState();
  toast(`Clôture — P&L ${formatUSD(pnl)}`, pnl >= 0 ? 'success' : 'error');
}

function resolveTrade(tradeId, outcome, opts={}) {
  const account = getActiveAccount();
  if (!account) return;
  const idx = account.openTrades.findIndex(t => t.id === tradeId);
  if (idx === -1) return;
  const t = account.openTrades[idx];
  const winning = (t.side === 'YES' && outcome === 1) || (t.side === 'NO' && outcome === 0);
  const exit = winning ? 1 : 0;
  const pnl = (t.shares * exit) - t.cost;
  account.openTrades.splice(idx, 1);
  account.closedTrades.unshift({ ...t, closed:true, closedAt: Date.now(), exitPrice: exit, pnl, outcome, manual:false, auto: !!opts.auto });
  account.hwm = Math.max(account.hwm, computeBalance(account));
  Rules.enforceDD(account);
  saveState();
  if (!opts.silent) toast(`Résolu ${outcome === 1 ? 'OUI' : 'NON'} — P&L ${formatUSD(pnl)}`, pnl >= 0 ? 'success' : 'error');
}

function autoResolveExpired({ silent } = {}) {
  const account = getActiveAccount();
  if (!account) return 0;
  let count = 0;
  for (const t of [...account.openTrades]) {
    if (t.endDate && new Date(t.endDate).getTime() < Date.now()) {
      const m = state.markets.find(mm => mm.id === t.marketId);
      const yesProb = m ? m.yesPrice : (t.side === 'YES' ? t.currentPrice : 1 - t.currentPrice);
      const outcome = Math.random() < yesProb ? 1 : 0;
      resolveTrade(t.id, outcome, { auto:true, silent:true });
      count++;
    }
  }
  if (count > 0 && !silent) toast(`${count} position${count>1?'s':''} expirée${count>1?'s':''} résolue${count>1?'s':''}`, 'info');
  return count;
}

// -------------------- SIM --------------------
function simRandomTrades(n=60) {
  const account = getActiveAccount();
  if (!account) return;
  const byCat = {};
  for (const m of state.markets) {
    if (m.volume < RULES.minMarketVolume) continue;
    if (!m.endDate) continue;
    const ttr = new Date(m.endDate).getTime() - Date.now();
    if (ttr < RULES.minTimeToResolution) continue;
    const yesP = m.yesPrice;
    if (!((yesP >= 0.55 && yesP <= 0.97) || (yesP >= 0.03 && yesP <= 0.45))) continue;
    (byCat[m.category] = byCat[m.category] || []).push(m);
  }
  const cats = Object.keys(byCat);
  if (cats.length < RULES.minCategories) {
    toast(`Catégories tradables insuffisantes (${cats.length}/${RULES.minCategories})`, 'error'); return;
  }
  let placed = 0, attempts = 0;
  while (placed < n && attempts < n * 5) {
    attempts++;
    const cat = cats[placed % cats.length];
    const m = byCat[cat][Math.floor(Math.random() * byCat[cat].length)];
    const yesIsFavorite = m.yesPrice >= 0.5;
    const side = yesIsFavorite ? 'YES' : 'NO';
    const stake = Math.max(20, Math.min(Math.floor(account.size * 0.008), Math.floor(m.volume * 0.05)));
    const errors = Rules.validateTrade({ market:m, side, amount:stake, account });
    if (errors.length) continue;
    const r = placeTrade({ market:m, side, amount:stake });
    if (!r.ok) continue;
    placed++;
    const trade = account.openTrades[account.openTrades.length - 1];
    const winProb = yesIsFavorite ? m.yesPrice : (1 - m.yesPrice);
    const traderRight = Math.random() < Math.min(0.98, winProb + 0.40);
    const outcome = ((side === 'YES') === traderRight) ? 1 : 0;
    resolveTrade(trade.id, outcome, { auto:true, silent:true });
    if (placed % 5 === 0) account.balanceStartOfDay = computeBalance(account);
  }
  saveState();
  render();
  toast(`${placed}/${n} trades simulés placés`, placed >= n ? 'success' : 'info');
}

function simClearTrades() {
  const account = getActiveAccount();
  if (!account) return;
  if (!confirm("Effacer l'historique des trades clos ?")) return;
  account.closedTradesArchive = [...(account.closedTradesArchive||[]), ...account.closedTrades];
  account.closedTrades = [];
  saveState(); render();
  toast('Historique effacé (archivé)', 'info');
}

// -------------------- MARKETS --------------------
async function refreshMarkets({ silent } = {}) {
  const status = $('#marketStatus');
  if (!silent && status) status.textContent = 'Chargement…';
  try {
    const list = await Polymarket.fetchMarkets({ limit: 60 });
    state.markets = list;
    state.lastFetch = Date.now();
    saveState();
    const a = getActiveAccount();
    if (a) {
      for (const t of a.openTrades) {
        const m = list.find(mm => mm.id === t.marketId);
        if (m) t.currentPrice = (t.side === 'YES' ? m.yesPrice : m.noPrice);
      }
      autoResolveExpired({ silent: true });
      Rules.enforceDD(a);
      saveState();
    }
    if (status) status.textContent = `${list.length} marchés · ${new Date().toLocaleTimeString('fr-FR')}`;
    render();
  } catch (e) {
    if (status) status.textContent = 'API erreur — réessayer';
    if (!silent) toast('Erreur API: ' + e.message, 'error');
  }
}

// -------------------- UI --------------------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
function toast(msg, kind='info') {
  const el = $('#toast');
  el.className = `toast ${kind} fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-2xl text-sm`;
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.add('hidden'), 3200);
}

// -------------------- RENDER --------------------
function render() {
  const a = getActiveAccount();
  const showOverview = state.showOverview || (!a && listAccounts().length > 0);

  // Hide all sections first
  $('#overview').classList.add('hidden');
  $('#dashboard').classList.add('hidden');
  $('#onboarding').classList.add('hidden');
  $('#accountSwitcher').classList.add('hidden');

  if (state.showOnboarding) {
    $('#onboarding').classList.remove('hidden');
    renderTierGrid();
    return;
  }

  if (showOverview || !a) {
    if (listAccounts().length === 0) {
      $('#onboarding').classList.remove('hidden');
      renderTierGrid();
    } else {
      $('#overview').classList.remove('hidden');
      $('#accountSwitcher').classList.remove('hidden');
      renderOverview();
      renderAccountSwitcher();
    }
    return;
  }

  $('#dashboard').classList.remove('hidden');
  $('#accountSwitcher').classList.remove('hidden');
  maybeRolloverDay(a);
  renderAccountSwitcher();
  renderKPIs(a);
  renderBreach(a);
  renderTabs();
  renderActiveTab();
  $('#fundedTabBtn').classList.toggle('hidden', a.phase !== 2);
}

function renderAccountSwitcher() {
  const list = listAccounts();
  const a = getActiveAccount();
  const sw = $('#accountSwitcher');
  if (list.length === 0) { sw.classList.add('hidden'); return; }
  sw.classList.remove('hidden');
  $('#acctLabel').textContent = a ? `${a.name} · ${TIERS[a.tier].name}` : 'Choisir';
}

function renderAccountMenu() {
  const list = listAccounts();
  const html = list.map(a => {
    const phase = a.breach ? 'Liquidé' : (a.phase === 2 ? `Financé L${a.scalingLevel}` : 'Phase 1');
    const phaseColor = a.breach ? 'text-rose-400' : (a.phase === 2 ? 'text-emerald-400' : 'text-slate-400');
    const balance = computeBalance(a);
    const isActive = a.id === state.activeAccountId;
    return `
      <button class="acct-menu-item w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 ${isActive ? 'bg-slate-800/60 border border-slate-700' : ''}" data-id="${a.id}">
        <div class="flex items-center justify-between">
          <span class="font-medium text-sm">${escapeHTML(a.name)}</span>
          <span class="text-xs ${phaseColor}">${phase}</span>
        </div>
        <div class="text-xs text-slate-500 font-mono mt-0.5">${TIERS[a.tier].name} · ${formatUSD(balance)}</div>
      </button>`;
  }).join('');
  const canAdd = list.length < RULES.maxAccountsPerUser;
  return html + `
    <div class="border-t border-slate-800 mt-1 pt-1">
      <button id="acctMenuOverview" class="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-sm">📊 Tableau de bord</button>
      ${canAdd ? `<button id="acctMenuNew" class="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-sm text-emerald-400">+ Nouveau compte (${list.length}/${RULES.maxAccountsPerUser})</button>` : `<div class="px-3 py-2 text-xs text-slate-500">Maximum ${RULES.maxAccountsPerUser} comptes atteint</div>`}
    </div>
  `;
}

function renderOverview() {
  const list = listAccounts();
  const totalCap = list.reduce((s,a) => s + computeBalance(a), 0);
  const totalPnl = list.reduce((s,a) => s + (computeBalance(a) - a.size), 0);
  const funded = list.filter(a => a.phase === 2).length;
  const totalPayouts = list.reduce((s,a) => s + a.payouts.reduce((sm,p) => sm + p.traderShare, 0), 0);

  $('#ovActive').textContent = `${list.length} / ${RULES.maxAccountsPerUser}`;
  $('#ovCapital').textContent = formatUSD(totalCap);
  const pnlEl = $('#ovPnl');
  pnlEl.textContent = `${totalPnl >= 0 ? '+' : ''}${formatUSD(totalPnl)}`;
  pnlEl.className = `text-xl font-bold font-mono ${totalPnl >= 0 ? 'pnl-pos' : 'pnl-neg'}`;
  $('#ovFunded').textContent = `${funded}`;
  $('#ovPayouts').textContent = formatUSD(totalPayouts);

  $('#overviewAccounts').innerHTML = list.map(a => {
    const tier = TIERS[a.tier];
    const balance = computeBalance(a);
    const pnl = balance - a.size;
    const pnlPct = pnl / a.size;
    const status = a.breach ? { label:'Liquidé', cls:'bg-rose-950/50 text-rose-300 border-rose-900' }
                  : a.phase === 2 ? { label:`Financé L${a.scalingLevel}`, cls:'bg-emerald-950/50 text-emerald-300 border-emerald-900' }
                  : { label:'Phase 1', cls:'bg-slate-800 text-slate-300 border-slate-700' };
    const isActive = a.id === state.activeAccountId;
    return `
      <div class="overview-card ${isActive ? 'ring-2 ring-accent' : ''}" data-id="${a.id}">
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="font-bold">${escapeHTML(a.name)}</div>
            <div class="text-xs text-slate-500 mt-0.5">${tier.name} · $${tier.size.toLocaleString('fr-FR')} notionnel</div>
          </div>
          <div class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.cls}">${status.label}</div>
        </div>
        <div class="font-mono text-2xl font-bold mb-1">${formatUSD(balance)}</div>
        <div class="text-xs font-mono mb-3 ${pnl >= 0 ? 'pnl-pos' : 'pnl-neg'}">${pnl >= 0 ? '+' : ''}${formatUSD(pnl)} (${formatPct(pnlPct)})</div>
        <div class="grid grid-cols-3 gap-2 text-[11px] font-mono pt-3 border-t border-slate-800">
          <div><div class="text-slate-500">Pos.</div><div>${a.openTrades.length}</div></div>
          <div><div class="text-slate-500">Trades</div><div>${a.closedTrades.length}</div></div>
          <div><div class="text-slate-500">Retraits</div><div>${a.payouts.length}</div></div>
        </div>
        <div class="flex gap-2 mt-3">
          <button data-act="open" data-id="${a.id}" class="flex-1 text-xs py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700">Ouvrir</button>
          <button data-act="del" data-id="${a.id}" class="text-xs px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-900/50 hover:bg-rose-900/40">×</button>
        </div>
      </div>`;
  }).join('') || `<div class="md:col-span-3 text-center py-12 text-slate-500">Aucun compte. Cliquez sur "+ Nouveau compte" pour commencer.</div>`;

  $$('#overviewAccounts [data-act="open"]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); switchAccount(b.dataset.id); }));
  $$('#overviewAccounts [data-act="del"]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); deleteAccount(b.dataset.id); }));
  $$('#overviewAccounts .overview-card').forEach(c => c.addEventListener('click', () => switchAccount(c.dataset.id)));
}

function renderTierGrid() {
  const grid = $('#tierGrid');
  grid.innerHTML = Object.values(TIERS).map(t => `
    <div class="tier-card" data-tier="${t.id}">
      <div class="text-xs uppercase tracking-widest text-slate-500">${t.name}</div>
      <div class="text-2xl font-bold font-mono mt-2">$${t.size.toLocaleString('fr-FR')}</div>
      <div class="text-xs text-slate-400 mt-1">Notionnel</div>
      <div class="mt-3 pt-3 border-t border-slate-800 text-xs space-y-1">
        <div class="flex justify-between"><span class="text-slate-500">Frais</span><span class="font-mono">€${t.fee}</span></div>
        <div class="flex justify-between"><span class="text-slate-500">Objectif</span><span class="font-mono">+10%</span></div>
        <div class="flex justify-between"><span class="text-slate-500">DD max</span><span class="font-mono">5%</span></div>
        <div class="flex justify-between"><span class="text-slate-500">Plafond pos.</span><span class="font-mono">${(t.positionMax*100).toFixed(0)}%</span></div>
      </div>
      <button class="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-accent to-accent2 text-slate-900 text-sm font-bold">Démarrer ${t.name}</button>
    </div>
  `).join('');
  grid.querySelectorAll('.tier-card').forEach(card => {
    card.addEventListener('click', () => { createAccount(card.dataset.tier); state.showOnboarding = false; render(); });
  });
}

function renderKPIs(a) {
  const tier = TIERS[a.tier];
  const balance = computeBalance(a);
  const pnl = balance - a.size;
  const pnlPct = pnl / a.size;
  const { overallDD, dailyDD } = Rules.computeDD(a);
  const exposure = a.openTrades.reduce((s,t) => s + t.cost, 0);
  const exposurePct = exposure / a.size;
  const targetProgress = Math.max(0, Math.min(100, (pnlPct / RULES.profitTarget) * 100));

  $('#kpiBalance').textContent = formatUSD(balance);
  const pnlEl = $('#kpiPnl');
  pnlEl.textContent = `${pnl >= 0 ? '+' : ''}${formatUSD(pnl)} (${formatPct(pnlPct)})`;
  pnlEl.className = `text-xs font-mono mt-1 ${pnl >= 0 ? 'pnl-pos' : 'pnl-neg'}`;

  if (a.phase === 1) $('#kpiTarget').textContent = `${(pnlPct*100).toFixed(2)}% / 10%`;
  else $('#kpiTarget').textContent = a.scalingLevel > 0 ? `Échelle L${a.scalingLevel}` : 'Financé';
  $('#kpiTargetBar').style.width = (a.phase === 1 ? targetProgress : Math.min(100, (a.scalingLevel/16)*100)) + '%';

  const dailyMax = Rules.maxDailyDD(a);
  $('#kpiDailyDDLimit').textContent = `limite ${(dailyMax*100).toFixed(1)}%`;
  const dEl = $('#kpiDailyDD');
  dEl.textContent = formatPct(Math.max(0, dailyDD));
  dEl.className = `text-xl font-bold font-mono ${dailyDD > dailyMax ? 'pnl-neg' : ''}`;
  const oEl = $('#kpiOverallDD');
  oEl.textContent = formatPct(Math.max(0, overallDD));
  oEl.className = `text-xl font-bold font-mono ${overallDD > RULES.maxOverallDD ? 'pnl-neg' : ''}`;
  const eEl = $('#kpiExposure');
  eEl.textContent = formatPct(exposurePct);
  eEl.className = `text-xl font-bold font-mono ${exposurePct > RULES.maxTotalExposure ? 'pnl-neg' : ''}`;

  $('#posCount').textContent = a.openTrades.length ? `(${a.openTrades.length})` : '';
}

function renderBreach(a) {
  const banner = $('#breachBanner');
  if (a.breach) {
    banner.classList.remove('hidden');
    $('#breachReason').textContent = a.breachReason || '';
  } else banner.classList.add('hidden');
}

function renderTabs() {
  $$('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === state.activeTab));
  $$('.tab-panel').forEach(p => p.classList.add('hidden'));
  const panel = document.getElementById('tab-' + state.activeTab);
  if (panel) panel.classList.remove('hidden');
}

function renderActiveTab() {
  switch (state.activeTab) {
    case 'markets':   return renderMarkets();
    case 'positions': return renderPositions();
    case 'history':   return renderHistory();
    case 'gate':      return renderGate();
    case 'funded':    return renderFunded();
    case 'pool':      return renderPool();
    case 'settings':  return renderSettings();
  }
}

function renderCategoryChips() {
  // Counts per category among loaded markets
  const counts = { all: 0 };
  for (const m of state.markets) {
    counts[m.category] = (counts[m.category] || 0) + 1;
    counts.all++;
  }
  const cats = ['all', ...Object.keys(CATEGORY_LABELS_FR).filter(c => counts[c])];
  $('#categoryChips').innerHTML = cats.map(c => {
    const label = c === 'all' ? 'Tous' : CATEGORY_LABELS_FR[c];
    const isActive = state.activeCategory === c;
    return `<button class="category-chip ${isActive ? 'active' : ''}" data-cat="${c}">${label} <span class="text-[10px] text-slate-500 ml-1">${counts[c] || 0}</span></button>`;
  }).join('');
  $$('#categoryChips .category-chip').forEach(b => {
    b.addEventListener('click', () => {
      state.activeCategory = b.dataset.cat;
      saveState();
      renderCategoryChips();
      renderMarkets();
    });
  });
}

function renderMarkets() {
  renderCategoryChips();
  const search = $('#marketSearch').value.toLowerCase();
  const sortBy = $('#marketSort').value;
  let list = [...state.markets];
  if (search) list = list.filter(m => m.question.toLowerCase().includes(search));
  if (state.activeCategory !== 'all') list = list.filter(m => m.category === state.activeCategory);
  list.sort((a,b) => {
    if (sortBy === 'volume')    return b.volume - a.volume;
    if (sortBy === 'liquidity') return (b.liquidity||0) - (a.liquidity||0);
    if (sortBy === 'endDate')   return new Date(a.endDate) - new Date(b.endDate);
    return 0;
  });

  const html = list.slice(0, 36).map(m => {
    const ttr = m.endDate ? new Date(m.endDate).getTime() - Date.now() : null;
    const tradable = m.volume >= RULES.minMarketVolume && (ttr === null || ttr >= RULES.minTimeToResolution);
    const yesPct = Math.round(m.yesPrice * 100);
    const noPct = 100 - yesPct;
    const catLabel = CATEGORY_LABELS_FR[m.category] || m.category;
    return `
      <div class="market-card" data-id="${escapeHTML(m.id)}">
        <div class="flex items-start gap-2">
          ${m.icon ? `<img src="${escapeHTML(m.icon)}" class="w-9 h-9 rounded-lg object-cover bg-slate-800 flex-shrink-0" onerror="this.style.display='none'" />` : ''}
          <div class="flex-1 min-w-0">
            <div class="text-[10px] uppercase tracking-widest text-slate-500">${escapeHTML(catLabel)}</div>
            <div class="question">${escapeHTML(m.question)}</div>
          </div>
        </div>
        <div class="flex items-center justify-between text-xs font-mono">
          <span class="text-emerald-400">OUI ${yesPct}¢</span>
          <span class="text-rose-400">NON ${noPct}¢</span>
        </div>
        <div class="price-bar"><div class="yes" style="width:${yesPct}%"></div><div class="no" style="width:${noPct}%"></div></div>
        <div class="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Vol $${formatShort(m.volume)}</span>
          <span>${ttr === null ? '—' : formatDuration(ttr)}</span>
          ${tradable ? '<span class="text-emerald-500">● ouvert</span>' : '<span class="text-slate-600">● bloqué</span>'}
        </div>
      </div>
    `;
  }).join('');
  $('#marketsList').innerHTML = html || '<div class="text-slate-500 text-sm col-span-full text-center py-12">Aucun marché.</div>';
  $$('#marketsList .market-card').forEach(c => c.addEventListener('click', () => openTradeModal(c.dataset.id)));
}

function renderPositions() {
  const a = getActiveAccount();
  const list = a.openTrades;
  $('#positionsEmpty').classList.toggle('hidden', list.length > 0);
  $('#positionsList').innerHTML = list.map(t => {
    const mtm = t.shares * t.currentPrice;
    const pnl = mtm - t.cost;
    const pnlPct = pnl / t.cost;
    const ttr = t.endDate ? new Date(t.endDate).getTime() - Date.now() : null;
    return `
      <div class="position-card">
        <div class="flex justify-between items-start gap-3 mb-3">
          <div class="font-medium text-sm pr-4">${escapeHTML(t.question)}</div>
          <div class="text-right flex-shrink-0">
            <div class="text-xs text-slate-500">P&L</div>
            <div class="font-mono font-bold ${pnl >= 0 ? 'pnl-pos' : 'pnl-neg'}">${formatUSD(pnl)} (${formatPct(pnlPct)})</div>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs font-mono mb-3">
          <div><div class="text-slate-500">Côté</div><div class="font-bold ${t.side==='YES'?'text-emerald-400':'text-rose-400'}">${t.side === 'YES' ? 'OUI' : 'NON'}</div></div>
          <div><div class="text-slate-500">Entrée</div><div>${t.entryPrice.toFixed(3)}</div></div>
          <div><div class="text-slate-500">Actuel</div><div>${t.currentPrice.toFixed(3)}</div></div>
          <div><div class="text-slate-500">Parts</div><div>${t.shares.toFixed(2)}</div></div>
          <div><div class="text-slate-500">Résolution</div><div>${ttr === null ? '—' : formatDuration(ttr)}</div></div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button data-act="close" data-id="${t.id}" class="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg">Clôturer</button>
          <button data-act="resolve-yes" data-id="${t.id}" class="text-xs px-3 py-1.5 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-800 rounded-lg">Sim. OUI gagne</button>
          <button data-act="resolve-no" data-id="${t.id}" class="text-xs px-3 py-1.5 bg-rose-900/40 hover:bg-rose-900/60 border border-rose-800 rounded-lg">Sim. NON gagne</button>
        </div>
      </div>`;
  }).join('');
  $$('#positionsList button[data-act]').forEach(b => {
    b.addEventListener('click', () => {
      if (b.dataset.act === 'close')        closeTrade(b.dataset.id);
      if (b.dataset.act === 'resolve-yes')  resolveTrade(b.dataset.id, 1);
      if (b.dataset.act === 'resolve-no')   resolveTrade(b.dataset.id, 0);
      render();
    });
  });
}

function renderHistory() {
  const a = getActiveAccount();
  const list = a.closedTrades;
  $('#historyEmpty').classList.toggle('hidden', list.length > 0);
  $('#historyList').innerHTML = list.map(t => {
    const date = new Date(t.closedAt).toLocaleString('fr-FR');
    const pnlClass = t.pnl >= 0 ? 'pnl-pos' : 'pnl-neg';
    const tag = t.outcome === null ? 'Clôturé' : (t.outcome === 1 ? 'Résolu OUI' : 'Résolu NON');
    return `
      <div class="position-card flex items-center justify-between gap-3 py-3">
        <div class="flex-1 min-w-0">
          <div class="text-sm truncate">${escapeHTML(t.question)}</div>
          <div class="text-[11px] text-slate-500 font-mono mt-1">${date} · ${tag} · ${t.side === 'YES' ? 'OUI' : 'NON'} · ${t.shares.toFixed(2)} parts @ ${t.entryPrice.toFixed(3)} → ${t.exitPrice?.toFixed(3) ?? '—'}</div>
        </div>
        <div class="text-right flex-shrink-0">
          <div class="font-mono font-bold ${pnlClass}">${formatUSD(t.pnl)}</div>
          <div class="text-[11px] text-slate-500 font-mono">${formatPct(t.pnl / t.cost)}</div>
        </div>
      </div>`;
  }).join('');
}

function renderGate() {
  const a = getActiveAccount();
  const { passed, gates } = Rules.evaluateGate(a);
  const status = $('#gateStatus');
  const grid = $('#gateGrid');

  if (a.phase === 2) {
    status.textContent = 'Phase 2 active';
    status.className = 'px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/40 text-emerald-300 border border-emerald-700';
    grid.innerHTML = `
      <div class="md:col-span-2 text-sm text-slate-400 py-4">
        Validation passée à la promotion. Stats Phase 1 archivées.
        <div class="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div class="bg-bg border border-slate-800 rounded-lg p-3"><div class="text-slate-500">Promu le</div><div class="font-mono">${a.fundedAt ? new Date(a.fundedAt).toLocaleDateString('fr-FR') : '—'}</div></div>
          <div class="bg-bg border border-slate-800 rounded-lg p-3"><div class="text-slate-500">Trades P1</div><div class="font-mono">${a.phase1Stats?.tradeCount ?? '—'}</div></div>
          <div class="bg-bg border border-slate-800 rounded-lg p-3"><div class="text-slate-500">P&L P1</div><div class="font-mono">${a.phase1Stats ? formatUSD(a.phase1Stats.totalRealized) : '—'}</div></div>
          <div class="bg-bg border border-slate-800 rounded-lg p-3"><div class="text-slate-500">Brier P1</div><div class="font-mono">${a.phase1Stats?.brier?.toFixed(3) ?? '—'}</div></div>
        </div>
      </div>`;
    return;
  }

  status.textContent = passed ? 'VALIDÉ — éligible Phase 2' : 'En cours';
  status.className = passed
    ? 'px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/40 text-emerald-300 border border-emerald-700'
    : 'px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700';

  const gatesHtml = Object.entries(gates).map(([k,g]) => `
    <div class="gate-card ${g.pass ? 'pass' : 'fail'}">
      <div class="flex items-center gap-3 min-w-0">
        <div class="dot ${g.pass ? 'green' : 'red'}"></div>
        <div class="text-sm">${escapeHTML(g.label)}</div>
      </div>
      <div class="text-sm font-mono ${g.pass ? 'text-emerald-300' : 'text-slate-300'}">${escapeHTML(g.value)}</div>
    </div>`).join('');

  const promote = passed ? `
    <div class="md:col-span-2 mt-2 p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-xl flex items-center justify-between gap-4">
      <div>
        <div class="font-bold text-emerald-300">Prêt pour Phase 2</div>
        <div class="text-xs text-emerald-400/70">${isKycComplete() ? 'KYC complet — éligible.' : 'Complétez le KYC dans Paramètres.'}</div>
      </div>
      <button id="promoteBtn" class="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-bold text-sm" ${isKycComplete() ? '' : 'disabled style="opacity:0.4;cursor:not-allowed"'}>Passer en Phase 2</button>
    </div>` : '';
  grid.innerHTML = gatesHtml + promote;

  const promoteBtn = document.getElementById('promoteBtn');
  if (promoteBtn) promoteBtn.addEventListener('click', () => {
    const r = Phase2.promote(getActiveAccount());
    if (!r.ok) { toast(r.error, 'error'); return; }
    saveState();
    state.activeTab = 'funded';
    toast(`Phase 2 active — ${formatUSD(getActiveAccount().size)} alloués`, 'success');
    render();
  });
}

function renderFunded() {
  const a = getActiveAccount();
  if (a.phase !== 2) { $('#tab-funded').classList.add('hidden'); return; }
  $('#fundedAlloc').textContent = formatUSD(a.size);
  $('#fundedScale').textContent = a.scalingLevel === 0 ? 'Base · L0' : `L${a.scalingLevel} · ${(1 + a.scalingLevel*RULES.scaleIncrementPct).toFixed(2)}× initial`;
  const realized = Phase2.realized(a);
  const realizedEl = $('#fundedRealizedPnl');
  realizedEl.textContent = formatUSD(realized);
  realizedEl.className = `text-2xl font-bold font-mono ${realized >= 0 ? 'pnl-pos' : 'pnl-neg'}`;
  $('#fundedAvailable').textContent = formatUSD(Phase2.available(a));
  const left = RULES.scaleAfterPayouts - a.consecutivePayouts;
  const baseMax = a.initialAllocation * RULES.maxScaleMultiplier;
  $('#fundedScalingProgress').textContent = a.size >= baseMax ? 'MAX' : `${left} retrait${left===1?'':'s'} restant${left===1?'':'s'}`;

  const elig = Phase2.isPayoutEligible(a);
  $('#payoutBtn').disabled = !elig.ok;
  $('#payoutEligibility').textContent = elig.ok
    ? `Éligible — trader ${formatUSD(Phase2.available(a))}, firme ${formatUSD(realized * RULES.splitFirm)}`
    : `Non éligible : ${elig.reason}`;

  $('#payoutsEmpty').classList.toggle('hidden', a.payouts.length > 0);
  $('#payoutsList').innerHTML = a.payouts.map(p => `
    <div class="position-card flex items-center justify-between gap-3 py-3">
      <div>
        <div class="text-sm font-medium">Retrait · ${new Date(p.ts).toLocaleString('fr-FR')}</div>
        <div class="text-[11px] text-slate-500 font-mono mt-1">Profit ${formatUSD(p.profit)} · taille du compte ${formatUSD(p.sizeAtPayout)}</div>
      </div>
      <div class="text-right">
        <div class="font-mono font-bold pnl-pos">${formatUSD(p.traderShare)}</div>
        <div class="text-[11px] text-slate-500 font-mono">firme ${formatUSD(p.firmShare)}</div>
      </div>
    </div>`).join('');
}

function renderPool() {
  $('#poolCash').textContent = formatUSD(state.pool.cash);
  $('#poolAllocated').textContent = formatUSD(state.pool.allocated);
  const burn = Math.max(state.pool.allocated * 0.05, 1000);
  $('#poolRunway').textContent = `${(state.pool.cash / burn).toFixed(1)} mois`;

  $('#poolEvents').innerHTML = state.pool.events.slice(0, 80).map(e => {
    const sign = e.amount >= 0 ? '+' : '';
    const color = e.amount >= 0 ? 'pnl-pos' : 'pnl-neg';
    const date = new Date(e.ts).toLocaleString('fr-FR');
    return `
      <div class="flex justify-between items-center py-2 border-b border-slate-800/60">
        <div>
          <div class="text-slate-300">${escapeHTML(e.note || e.type)}</div>
          <div class="text-[10px] text-slate-500">${date} · ${e.type}</div>
        </div>
        <div class="${color} font-bold">${sign}${formatUSD(e.amount)}</div>
      </div>`;
  }).join('');
}

function renderSettings() {
  const k = state.kyc;
  const setStatus = (id, ok) => {
    const el = $(id);
    el.textContent = ok ? 'vérifié' : 'en attente';
    el.className = `px-2 py-0.5 rounded text-xs font-mono ${ok ? 'bg-emerald-900/40 text-emerald-300' : 'bg-slate-800 text-slate-400'}`;
  };
  setStatus('#kycIdentity', k.identity);
  setStatus('#kycAddress', k.address);
  setStatus('#kycWallet', k.wallet);
}

// -------------------- TRADE MODAL --------------------
let modalCtx = null;
async function openTradeModal(marketId) {
  const m = state.markets.find(mm => mm.id === marketId);
  const a = getActiveAccount();
  if (!m || !a) return;
  modalCtx = { market: m, side: 'YES' };
  $('#modalQuestion').textContent = m.question;
  const ttr = m.endDate ? new Date(m.endDate).getTime() - Date.now() : null;
  const catLabel = CATEGORY_LABELS_FR[m.category] || m.category;
  $('#modalMeta').textContent = `${catLabel} · Vol $${formatShort(m.volume)} · résolution ${ttr === null ? '—' : formatDuration(ttr)}`;
  $('#modalYesPrice').textContent = m.yesPrice.toFixed(3);
  $('#modalNoPrice').textContent  = m.noPrice.toFixed(3);
  $('#modalAmount').value = Math.min(100, Math.floor(a.size * 0.01));
  selectSide('YES');
  renderModalOpenPositions();
  $('#tradeModal').classList.remove('hidden');
  fetchAndRenderDepth();
}

function closeTradeModal() { $('#tradeModal').classList.add('hidden'); modalCtx = null; }

function selectSide(side) {
  if (!modalCtx) return;
  modalCtx.side = side;
  $('#sideYes').classList.toggle('border-emerald-500', side === 'YES');
  $('#sideYes').classList.toggle('bg-emerald-900/20', side === 'YES');
  $('#sideNo').classList.toggle('border-rose-500', side === 'NO');
  $('#sideNo').classList.toggle('bg-rose-900/20', side === 'NO');
  recalcModal();
  fetchAndRenderDepth();
}

function recalcModal() {
  if (!modalCtx) return;
  const a = getActiveAccount();
  const { market, side } = modalCtx;
  const amount = parseFloat($('#modalAmount').value) || 0;
  const price = side === 'YES' ? market.yesPrice : market.noPrice;
  const shares = amount / price;
  $('#modalSide').textContent = side === 'YES' ? 'OUI' : 'NON';
  $('#modalPrice').textContent = price.toFixed(3);
  $('#modalShares').textContent = shares.toFixed(2);
  $('#modalPayout').textContent = formatUSD(shares * 1);
  $('#modalAccountPct').textContent = formatPct(amount / a.size);
  const errors = Rules.validateTrade({ market, side, amount, account: a });
  const errEl = $('#modalErrors');
  const btn = $('#modalConfirm');
  if (errors.length) {
    errEl.classList.remove('hidden');
    errEl.innerHTML = errors.map(e => `• ${escapeHTML(e)}`).join('<br>');
    btn.disabled = true;
  } else {
    errEl.classList.add('hidden');
    btn.disabled = false;
  }
}

function renderModalOpenPositions() {
  const a = getActiveAccount();
  const list = a.openTrades;
  $('#modalOpenEmpty').classList.toggle('hidden', list.length > 0);
  $('#modalOpenPositions').innerHTML = list.map(t => {
    const pnl = t.shares * t.currentPrice - t.cost;
    return `
      <div class="flex items-center justify-between gap-2 px-2 py-1.5 bg-slate-900/50 rounded">
        <div class="flex-1 min-w-0">
          <div class="truncate font-medium">${escapeHTML(t.question)}</div>
          <div class="text-[10px] text-slate-500 font-mono">${t.side === 'YES' ? 'OUI' : 'NON'} ${t.shares.toFixed(1)}p @ ${t.entryPrice.toFixed(3)}</div>
        </div>
        <div class="text-right font-mono">
          <div class="${pnl >= 0 ? 'pnl-pos' : 'pnl-neg'} text-xs font-bold">${formatUSD(pnl)}</div>
        </div>
      </div>`;
  }).join('');
}

async function fetchAndRenderDepth() {
  if (!modalCtx) return;
  const { market, side } = modalCtx;
  const tokenId = side === 'YES' ? market.yesTokenId : market.noTokenId;
  const sideLabel = side === 'YES' ? 'OUI' : 'NON';
  $('#depthSide').textContent = sideLabel;
  const body = $('#depthBody');
  const loading = $('#depthLoading');
  const err = $('#depthError');
  body.innerHTML = '';
  err.classList.add('hidden');
  if (!tokenId) {
    err.classList.remove('hidden');
    err.textContent = 'Token ID indisponible';
    return;
  }
  loading.classList.remove('hidden');
  try {
    const book = await Polymarket.fetchOrderbook(tokenId);
    loading.classList.add('hidden');
    const asks = (book.asks || []).map(o => ({ price: parseFloat(o.price), size: parseFloat(o.size) }))
      .sort((a,b) => a.price - b.price).slice(0, 5).reverse();
    const bids = (book.bids || []).map(o => ({ price: parseFloat(o.price), size: parseFloat(o.size) }))
      .sort((a,b) => b.price - a.price).slice(0, 5);
    let cumA = 0;
    const askRows = asks.map(o => { cumA += o.size; return `<tr class="text-rose-400"><td class="py-0.5">${o.price.toFixed(3)}</td><td class="text-right">${o.size.toFixed(0)}</td><td class="text-right text-slate-500">${cumA.toFixed(0)}</td></tr>`; }).join('');
    let cumB = 0;
    const bidRows = bids.map(o => { cumB += o.size; return `<tr class="text-emerald-400"><td class="py-0.5">${o.price.toFixed(3)}</td><td class="text-right">${o.size.toFixed(0)}</td><td class="text-right text-slate-500">${cumB.toFixed(0)}</td></tr>`; }).join('');
    body.innerHTML = askRows + (asks.length && bids.length ? `<tr><td colspan="3" class="border-t border-slate-800 py-1"></td></tr>` : '') + bidRows
      || '<tr><td colspan="3" class="text-center py-3 text-slate-500">Carnet vide</td></tr>';
  } catch (e) {
    loading.classList.add('hidden');
    err.classList.remove('hidden');
    err.textContent = `Indisponible (${e.message})`;
  }
}

function confirmTrade() {
  if (!modalCtx) return;
  const amount = parseFloat($('#modalAmount').value) || 0;
  const r = placeTrade({ market: modalCtx.market, side: modalCtx.side, amount });
  if (r.ok) {
    renderModalOpenPositions();
    render();
  } else toast(r.errors[0] || 'Trade rejeté', 'error');
}

// -------------------- WIRING --------------------
function wire() {
  $('#brandBtn').addEventListener('click', () => { state.showOverview = true; saveState(); render(); });
  $('#dashboardBtn').addEventListener('click', () => { state.showOverview = true; saveState(); render(); });

  $('#newAccountBtn').addEventListener('click', () => { state.showOnboarding = true; render(); });
  $('#cancelOnboarding').addEventListener('click', () => { state.showOnboarding = false; render(); });

  // Account switcher dropdown
  $('#acctBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    const menu = $('#acctMenu');
    if (menu.classList.contains('hidden')) {
      menu.innerHTML = renderAccountMenu();
      menu.classList.remove('hidden');
      menu.querySelectorAll('.acct-menu-item').forEach(b => {
        b.addEventListener('click', () => { switchAccount(b.dataset.id); menu.classList.add('hidden'); });
      });
      const ovBtn = document.getElementById('acctMenuOverview');
      if (ovBtn) ovBtn.addEventListener('click', () => { state.showOverview = true; saveState(); render(); menu.classList.add('hidden'); });
      const newBtn = document.getElementById('acctMenuNew');
      if (newBtn) newBtn.addEventListener('click', () => { state.showOnboarding = true; render(); menu.classList.add('hidden'); });
    } else {
      menu.classList.add('hidden');
    }
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#accountSwitcher')) $('#acctMenu').classList.add('hidden');
  });

  $('#refreshMarkets').addEventListener('click', () => refreshMarkets());

  $$('#tabsNav .tab-btn').forEach(b => {
    b.addEventListener('click', () => {
      state.activeTab = b.dataset.tab;
      saveState();
      renderTabs();
      renderActiveTab();
    });
  });

  $('#marketSearch').addEventListener('input', renderMarkets);
  $('#marketSort').addEventListener('change', renderMarkets);

  $('#modalClose').addEventListener('click', closeTradeModal);
  $('#tradeModal').addEventListener('click', (e) => { if (e.target.id === 'tradeModal') closeTradeModal(); });
  $('#sideYes').addEventListener('click', () => selectSide('YES'));
  $('#sideNo').addEventListener('click',  () => selectSide('NO'));
  $('#modalAmount').addEventListener('input', recalcModal);
  $('#modalConfirm').addEventListener('click', confirmTrade);
  $$('.amt-quick').forEach(b => {
    b.addEventListener('click', () => {
      const a = getActiveAccount();
      const pct = parseFloat(b.dataset.pct);
      $('#modalAmount').value = Math.floor(a.size * pct);
      recalcModal();
    });
  });

  $('#payoutBtn').addEventListener('click', () => {
    const a = getActiveAccount();
    if (!a) return;
    const r = Phase2.requestPayout(a);
    if (!r.ok) { toast(r.error, 'error'); return; }
    saveState(); render();
  });

  $('#kycToggle').addEventListener('click', () => {
    const allOn = state.kyc.identity && state.kyc.address && state.kyc.wallet;
    state.kyc = { identity: !allOn, address: !allOn, wallet: !allOn };
    saveState(); renderSettings();
    toast(!allOn ? 'KYC vérifié (mock)' : 'KYC réinitialisé', 'info');
  });
  $('#simAutoResolve').addEventListener('click', () => { autoResolveExpired(); render(); });
  $('#simRandomTrades').addEventListener('click', () => simRandomTrades(60));
  $('#simClearTrades').addEventListener('click', simClearTrades);
  $('#simForcePromote').addEventListener('click', () => {
    const a = getActiveAccount();
    if (!a) return;
    const r = Phase2.forcePromote(a);
    if (!r.ok) { toast(r.error, 'error'); return; }
    saveState();
    state.activeTab = 'funded';
    render();
    toast('Phase 2 forcée (admin)', 'success');
  });
  $('#dangerResetAccount').addEventListener('click', () => { const a = getActiveAccount(); if (a) deleteAccount(a.id); });
  $('#dangerResetPool').addEventListener('click', resetPool);
  $('#dangerResetAll').addEventListener('click', resetAll);

  setInterval(() => refreshMarkets({ silent: true }), 60_000);
}

// -------------------- BOOT --------------------
async function boot() {
  state = loadState();
  wire();
  render();
  await refreshMarkets();
}
document.addEventListener('DOMContentLoaded', boot);
