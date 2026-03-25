# Climber Trade — Mémoire Projet

## Description
Climber Trade est une application de trading. Ce fichier sert de mémoire projet pour Claude Code.

## Structure prévue
```
climber-trade/
├── CLAUDE.md                    ← mémoire projet (lu automatiquement par Claude Code)
├── .gitignore
├── docs/                        ← documents légaux (règlement, CGV, etc.)
├── developer-exchanges/         ← suivi des echanges avec Alex (developpeur)
│   ├── INDEX.md                 ← index central de tous les echanges
│   ├── _TEMPLATE.md             ← template pour nouvel echange
│   ├── scoring/                 ← questions notation / CLIMB Score
│   ├── pool-liquidite/          ← questions pool de liquidite
│   ├── trading-rules/           ← questions regles de trading
│   ├── technique/               ← questions DB, API, infra
│   ├── ui-ux/                   ← questions interface
│   ├── legal-compliance/        ← questions juridiques
│   └── business/                ← questions tarifs, splits, affiliation
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── MyStats.tsx
│   │   └── ...
│   └── ...
└── package.json
```

## Notes
- Claude Code lit ce fichier automatiquement à chaque session.
- Ajouter ici toute information contextuelle importante pour le projet.
- Les echanges avec Alex (developpeur) sont suivis dans `developer-exchanges/` — voir INDEX.md pour le recap complet.
# 🏔️ CLIMBER TRADE — MÉMOIRE COMPLÈTE DU PROJET

> **Fichier de référence exhaustif — Toutes décisions, spécifications, documents légaux et livrables**
> Dernière mise à jour : Mars 2026 — Intègre tous les documents officiels

---

## TABLE DES MATIÈRES

1. [Vision & Positionnement](#1-vision--positionnement)
2. [Design System & Charte Graphique](#2-design-system--charte-graphique)
3. [Architecture de la Plateforme (Onglets)](#3-architecture-de-la-plateforme-onglets)
4. [Système de Rangs](#4-système-de-rangs)
5. [Tarification & Offres](#5-tarification--offres)
6. [Parcours Trader — 5 Étapes](#6-parcours-trader--5-étapes)
7. [Système de Notation — Vue d'Ensemble](#7-système-de-notation--vue-densemble)
8. [Pilier 1 — RISK MANAGEMENT (x4)](#8-pilier-1--risk-management-x4)
9. [Pilier 2 — PERFORMANCE (x4)](#9-pilier-2--performance-x4)
10. [Pilier 3 — CONSISTENCY & TRADING STYLE (x3)](#10-pilier-3--consistency--trading-style-x3)
11. [Pilier 4 — QUALITY EXECUTION (x2)](#11-pilier-4--quality-execution-x2)
12. [Fiabilité & Ratio de Confiance](#12-fiabilité--ratio-de-confiance)
13. [Classification du Risque Trader](#13-classification-du-risque-trader)
14. [Passage en Live — Critères & Processus](#14-passage-en-live--critères--processus)
15. [Modèle de Pool de Liquidité (Cohorte)](#15-modèle-de-pool-de-liquidité-cohorte)
16. [Profit Splits & Capital Alloué](#16-profit-splits--capital-alloué)
17. [Règles de Trading — Phase Évaluation](#17-règles-de-trading--phase-évaluation)
18. [Règles de Trading — Phase Live](#18-règles-de-trading--phase-live)
19. [Système de Retraits & Paiements](#19-système-de-retraits--paiements)
20. [Programme Parrainage & Affiliation](#20-programme-parrainage--affiliation)
21. [Documents Légaux](#21-documents-légaux)
22. [Modules UI Développés](#22-modules-ui-développés)
23. [Livrables Réalisés](#23-livrables-réalisés)
24. [Stack Technique](#24-stack-technique)
25. [Équipe & Collaborateurs](#25-équipe--collaborateurs)
26. [Roadmap & Chantiers à Venir](#26-roadmap--chantiers-à-venir)
27. [Prompts Système Configurés](#27-prompts-système-configurés)
28. [Principes Non-Négociables](#28-principes-non-négociables)

---

## 1. VISION & POSITIONNEMENT

**Climber Trade** est une **prop firm nouvelle génération** qui identifie, évalue et finance les traders talentueux.

> **Mission :** Transformer votre talent en carrière professionnelle rentable — détecter, évaluer et propulser les meilleurs traders retail grâce à une notation professionnelle et une allocation de capital méritée.

**Différences clés :**
- Transparence totale — pool de liquidité public, métriques ouvertes
- Méritocratie pure — seules les performances comptent
- Financement réel — accès à du capital live, pas des promesses
- Évolution continue — capital qui grandit avec les résultats

**Valeurs fondatrices :**
- Sérieux, rigueur, approche cartésienne
- Aucun marketing mensonger
- Éducation & progression continue des traders
- Professionnaliser les traders, pas vendre des rêves

**Modèle économique :**
- Accès via évaluation payante (modèle type Darwinex Zero)
- Capital réel alloué aux meilleurs selon leur score
- Gamification : challenges communautaires avec leaderboard
- Système d'affiliation avec rémunération récurrente

**Cible :** Traders retail (focus principal), institutionnels et particuliers
**Scope :** Mondial, sans contraintes géographiques
**Plateforme de trading :** Volumetrica
**Intégration paiements :** aMember
**Paiements traders :** RISE WORKS
**Contact :** contact@climbertrade.com
**Site :** www.climbertrade.com

---

## 2. DESIGN SYSTEM & CHARTE GRAPHIQUE

### Tokens couleur
| Token | Valeur | Usage |
|-------|--------|-------|
| Background principal | `#0A0A0A` | Fond global |
| Cards / surfaces | `#1A1A1A` | Cartes, panels |
| Accent teal | `#00D4FF` | Accents — utiliser avec parcimonie |
| Success green | `#10B981` | États de succès |
| Danger red | `#EF4444` | Erreurs, alertes |

### Typographie
- **Font :** Outfit (Google Fonts)
- Style général : interface fintech dark premium, restrained et institutionnel

### Règles de design
- Pas d'effets glow (rejetés comme "trop cyberpunk")
- Teal `#00D4FF` utilisé avec grande parcimonie — accentuation uniquement
- Style sobre, niveau institutionnel Goldman Sachs / Bloomberg
- Badges : hexagonaux, effet de profondeur layeré "DA", progression visuelle claire par rang

---

## 3. ARCHITECTURE DE LA PLATEFORME (ONGLETS)

- **Dashboard / Trade Desk** — Vue d'ensemble du compte, métriques clés
- **My Stats** — Toutes les métriques de notation avec infobulles éducatives
- **Performance Lab** — Analyse avancée. Métriques supprimées : "Respect Risk Management", "Sessions conformes au plan", "Z-Score régularité"
- **Challenges** — Challenges communautaires gamifiés liés au score
- **Leaderboard** — Classement des traders par score avec badges
- **Community & Affiliés** — Affiliation, création de contenu, ambassadeurs
- **Knowledge Hub** — Base de connaissances éducatives + infobulles par métrique
- **My Profile** — Avatar personnalisable (preset + drag-and-drop), persistance uniquement à la sauvegarde
- **Support Center** — Centre d'aide (chat 9h-18h CET, email 24h, Discord urgences live, tickets)
- **Wallet & Liquidity Pool** — Gains, paiements, profit splits, solde pool temps réel

---

## 4. SYSTÈME DE RANGS

| Rang | Score | Accès |
|------|-------|-------|
| No Rank | 0–29 | Évaluation uniquement |
| Bronze | 30–49 | Évaluation uniquement |
| Silver | 50–69 | Évaluation (entre dans la cohorte statistique) |
| Gold | 70–84 | Évaluation (surveillance si Live) |
| Platinum | 85–94 | Eligible Live — Standard/Expert |
| Diamond | 95–100 | Eligible Live Elite |

**Seuil Live :** Score >= 85 + 7 jours consécutifs + 30 jours depuis création + KYC

### Badges SVG
- Format : 160x178px
- Style : hexagones layerés avec effet de profondeur progressive
- Progression visuelle : épaisseur de bordure + ornements aux vertices
- Livrés en SVGs individuels + showcase HTML (`Badges_Climber_Trade_-_Showcase.html`)

---

## 5. TARIFICATION & OFFRES

### Challenge d'Évaluation
| Formule | Prix | Durée | Capital fictif | Notes |
|---------|------|-------|----------------|-------|
| Standard | 199$/mois | Renouvelable auto | 1 000 000 USD | Accès complet + live possible |
| Découverte | 49$ | 30 jours, non renouvelable | 1 000 000 USD | Pas d'accès live, note conservée si passage en Standard |

### Reset de Compte
| Type | Prix | Condition |
|------|------|-----------|
| Gratuit | 0$ | 1 par mois calendaire, si solde 0$ et pas encore live |
| Standard | 99$ | À tout moment |
| Échec proche | 79$ | Si score 80–84 |

**Effets du Reset :** Capital restauré à 1M USD, CLIMB Score réinitialisé, historique archivé, métriques vierges, date d'abonnement inchangée.

### Paiement
- Carte bancaire (Visa, Mastercard) uniquement
- Devise USD exclusivement
- Prélèvement immédiat, renouvellement auto, notification 3 jours avant
- Annulation possible à tout moment, effet fin de période payée
- Pas de remboursement (droit de rétractation renoncé à la souscription)

### Limites comptes
- 1 compte max par personne physique
- +1 si détention d'une société (preuve requise)
- Interdiction absolue comptes multiples non déclarés + copy trading entre comptes

---

## 6. PARCOURS TRADER — 5 ÉTAPES

1. **Inscription** (5 min) — Compte + formule + KYC + accès immédiat
2. **Phase d'Évaluation** (30 jours min, illimité) — 1M USD simulés, notation algorithmique en temps réel
3. **Validation** — Automatique dès : Score >= 85 + 7 jours consécutifs + 30 jours + KYC
4. **Trading Live** — Capital % pool selon score, profit split dynamique, retraits disponibles
5. **Croissance Continue** — Scaling mensuel, pas de plafond de capital, statut Elite à 95+

---

## 7. SYSTÈME DE NOTATION — VUE D'ENSEMBLE

Le **CLIMB Score** est un système de notation sur 100 points selon 4 piliers :

| Pilier | Coefficient | Contenu |
|--------|-------------|---------|
| 1. Risk Management | x4 | Contrôle du risque, drawdown, sizing |
| 2. Performance | x4 | Rentabilité, Profit Factor, Sharpe, Yield |
| 3. Consistency & Style | x3 | Régularité, win rate, cohérence sizing |
| 4. Quality Execution | multiplicateur | Ajuste la note finale de +-10% |

**Formule finale :**
```
Moyenne = [(Risk x 4) + (Performance x 4) + (Consistency x 3)] / 11
Note finale = Moyenne x (1 + ((Quality Execution - 50) / 500))
```

Le dénominateur est **11** (= 4+4+3, somme des coefficients des 3 premiers piliers).
Quality Execution génère un **ratio multiplicateur entre 0.90 et 1.10**.

**Mise à jour :** temps réel en continu + consolidation quotidienne fin de journée.
**Notes négatives :** incluses en calcul, plancher à 0 en affichage.

---

## 8. PILIER 1 — RISK MANAGEMENT (x4)

### ABS_NPL — Absolute Net Profit/Loss
Note journalière, moyenne cumulée. Notes négatives incluses en calcul, affichage plancher 0.

Barème (extrait) :
- `-10.0%` = -100 pts | `-5.0%` = 20 pts | `0.0%` = 0 pts
- `+1.0%` = 100 pts (pic maximum)
- Après +1% la note décroît (pénalité sur-performance journalière)
- `+5.0%` = 45 pts | `+8.2%` = 0 pts | `>+9.0%` = remontée légère (10-21 pts)

### INPL — Initial Net PnL Drawdown
- Prendre la valeur la plus élevée de la perte pour attribuer les points
- Conserver les points perdus jusqu'au rétablissement de la balance au max equity
- Pas de points négatifs. Perte > 10% = 0 points (en test : envisager 20%)
- Note sur /100

### R_T_AFD — Recovery Time After Drawdown (version granulaire màj 01.09.2025)
Note selon le % de drawdown ET le nombre de jours pour récupérer depuis le high equity :

| Tranche DD | Jour 0 | Jour 5 | Jour 10 | Jour 15 | Jour 20 | Jour 30 | 61+ |
|-----------|--------|--------|---------|---------|---------|---------|-----|
| < 0.25% | 100 | 90 | 76 | 66 | 54 | 32 | 0 |
| 0.25–0.5% | 100 | 85 | 68 | 54 | 39 | 19 | 0 |
| 0.5–1% | 100 | 78 | 58 | 43 | 26 | 4 | 0 |
| 1–2% | 95 | 66 | 47 | 32 | 17 | 1 | 0 |
| 2–3% | 92 | 62 | 43 | 28 | 13 | 0 | 0 |
| 3–5% | 88 | 57 | 38 | 24 | 9 | 0 | 0 |
| 5–7.5% | 80 | 49 | 33 | 20 | 8 | 0 | 0 |
| 7.5–10% | 70 | 43 | 29 | 16 | 6 | 0 | 0 |

### CT4 — Average Lot Number — Levier intraday
Zone optimale x2 à x5 = 100 pts. Barème levier -> note :

| Levier | Note | Levier | Note |
|--------|------|--------|------|
| 0x | 60 | 10x | 60 |
| 1x | 80 | 15x | 20 |
| 2x–5x | 100 (optimal) | 17x | 4 |
| 6x | 92 | >=18x | 0 et négatif |
| 7x | 84 | 25x+ | -100 |

Formule notionnel : `Notionnel = Valeur du point x Prix de l'actif`
Ex. NQ : 20$ x 25 576 = 511 520$ — Lots recommandés = Capital x Levier / Notionnel

### Métriques informatives uniquement (non notées)
MDD, VAR, IMDD — affichées en information secondaire pour le trader.

---

## 9. PILIER 2 — PERFORMANCE (x4)

### PI3 — Profit Factor (note sur 100 x coefficient fiabilité)

| Profit Factor | Score brut |
|---------------|------------|
| < 0.50 | 0 |
| 0.50–0.59 | 5 |
| 0.70–0.79 | 20 |
| 1.00–1.09 | 45 |
| 1.10–1.19 | 50 |
| 1.50–1.59 | 70 |
| 1.90–1.99 | 85 |
| 2.50–2.99 | 95 |
| >= 4.00 | 100 |

Coefficient fiabilité : >= 200 trades = x1.00 | 100–199 = x0.75 | 50–99 = x0.50 | < 50 = x0.25
`Score final = Score brut x Coefficient fiabilité`

### PI1 — Sharpe Ratio (bonus jusqu'à +10 pts, max note 100)

| Sharpe | Bonus | Sharpe | Bonus |
|--------|-------|--------|-------|
| < 1.00 | 0 | 2.00–2.09 | 8.3 |
| 1.50–1.59 | 6 | 2.50–2.59 | 9.4 |
| 1.90–1.99 | 8 | >= 2.90 | 10 |

Calcul sigma : `sigma = sqrt[(1/n) x sum(ri - r_bar)^2]` — Rf = 0 (taux sans risque nul)

### PI2 — YIELD_Y (Rendement annualisé, note sur 100)

```javascript
const BENCHMARK_ANNUEL = 0.08;   // 8%
const JOURS_CONFIANCE_MAX = 180;
const perfAnnualisee = Math.pow(1 + perf, 252 / joursTrading) - 1;
const facteurConfiance = Math.min(1, joursTrading / 180);
const note = Math.min(100, Math.max(0, 50 + ((perfAnnualisee * facteurConfiance - 0.08) / 0.4 * 100)));
```

Note 50/100 = benchmark marché (8%). 180 jours pour pleine confiance.
Tableau référence : `50/100 <-> 8%` | `75/100 <-> 18%` | `100/100 <-> 28%` | `0/100 <-> -12%`

---

## 10. PILIER 3 — CONSISTENCY & TRADING STYLE (x3)

### Win Rate / CT1 (facteur de confiance 22 jours)
```javascript
const indiceConfiance = Math.min(1, joursTotal / 22);
note = scoreBrut * indiceConfiance;
```

| Win Rate | Score brut | Win Rate | Score brut |
|----------|-----------|----------|-----------|
| 0%–3% | -100 | 60% | +35.0 |
| 45% | -1.0 | 70% | +58.3 |
| 50% | +11.0 | 80% | +72.3 |
| 55% | +23.0 | 100% | +100.0 |

### GAIN_DAYS / CT2
Score linéaire = % jours gagnants = score /100

### LSR — Lot Stability Ratio / CT5
```
LSR = Moyenne des lots par trade / Écart-type des lots par trade
sigma = sqrt[(1/n) x sum(xi - x_bar)^2]
```

| LSR | Note | LSR | Note |
|-----|------|-----|------|
| >= 4.00 | 100 | 2.00–2.09 | 60 |
| 3.50–3.59 | 90 | 1.50–1.59 | 40 |
| 3.00–3.09 | 80 | 1.00–1.09 | 20 |
| 2.50–2.59 | 70 | < 0.50 | 0 |

Standardisation : Mini = 1 lot, Micro = 0.1 lot.

---

## 11. PILIER 4 — QUALITY EXECUTION (x2)

Ratio multiplicateur (0.90 à 1.10) appliqué à la moyenne des 3 premiers piliers.

```
Pondération = 1 + ((score_quality - 50) / 500)
Note finale = Moyenne(Piliers 1+2+3) x Pondération
Ex : Moyenne 78.5, QE = 85 -> 78.5 x 1.07 = 83.9
```

### OF1 — Skew / Asymétrie (démarrage 100/100)
`0.0–0.1` = 100 | `0.5–0.6` = 90 | `1.0–1.1` = 80 | `1.5–1.6` = 70 | `2.0–2.1` = 60 | `3.5–5.0` = 30->0

### OF2 — Kurtosis (démarrage 100/100)
`0.0–0.1` = 100 | `1.0–1.1` = 80 | `2.0–2.1` = 60 | `3.5–3.6` = 30 | `> 5.0` = 0

### OF3 — Max/Min Extreme Performance Ratio
`ratio = max(|Best Day|, |Worst Day|) / AvgAbsPnL`
`1.0–1.1` = 100 | `2.0–2.2` = 80 | `5.0–5.5` = 50 | `> 15.0` = 0

### OF4 — Best/Worst Trading Day Ratio
`Ratio = Best Day / |Worst Day|`
`< 0.50` = 0 | `1.00` = 60 | `2.00` = 80 | `3.00` = 95 | `>= 4.30` = 100

---

## 12. FIABILITÉ & RATIO DE CONFIANCE

| Durée | Statut score |
|-------|-------------|
| < 30 jours | Score indicatif (*) |
| 30–120 jours | Score fiable |
| 120+ jours | Score certifié |
| 180+ jours | Score certifié MAX (facteur confiance 1/1) |

Des performances exceptionnelles au démarrage sont moins valorisées qu'un trader actif 200+ jours.

---

## 13. CLASSIFICATION DU RISQUE TRADER

Basée sur les 4 piliers — de Ultra Aggressive à Ultra Safe. Le pilier Risk Management est **prioritaire** pour déterminer le profil de risque global.

---

## 14. PASSAGE EN LIVE — CRITÈRES & PROCESSUS

### Critères d'éligibilité (tous cumulatifs obligatoires)
1. CLIMB Score >= 85/100
2. Score maintenu **7 jours consécutifs de trading** (jours avec au moins 1 trade exécuté)
3. **30 jours calendaires minimum** depuis création du compte
4. KYC validé

> Note : La condition "Top 1% des traders" est à **supprimer** (décision confirmée règlement).

### Processus
1. Détection automatique par le système
2. Notification email + dashboard
3. Validation KYC documents
4. Activation sous 24–48h (semaine uniquement, hors vendredi soir et week-end)
5. Capital initial selon classement et pool disponible

### Passage individuel et instantané
- Chaque trader passe en Live indépendamment des autres
- Instantané dès critères validés
- Sans attendre une date mensuelle

### Retour en évaluation
- Score < 75 pendant 7 jours -> Retour scoring + consolidation note >= 85 pendant 7 jours
- Drawdown > 80% du capital -> Pause 5 jours + retour scoring (30 jours consolidation)
- Score < 50 -> Gel compte live + retour évaluation obligatoire

---

## 15. MODÈLE DE POOL DE LIQUIDITÉ (COHORTE)

### Financement du Pool
1. **50% des revenus d'abonnements** (comptes d'évaluation)
2. **50% de la commission Climber Trade** sur les profits des traders Live

Cycle : trader Live retire 1 000$, Climber reçoit 500$ (split 50/50), et 250$ (50% de la part Climber) alimentent le pool.

Note Alex : Le % exact dépend du point mort calculé en amont — si abonnement 199$ et coût par compte 99$, la marge disponible est différente.

### Cohorte Statistique
```
N_cohorte = Nombre total de traders avec Score >= 50
```
Inclut à la fois traders en évaluation ET traders Live (comptés comme 1 part normale chacun).

### Facteur Cohorte (FC) — protection automatique
```
FC = 1 / (1 + (N_cohorte / 50))
```
- N_cohorte faible -> FC proche de 1 -> allocations fortes
- N_cohorte élevé -> FC diminue -> allocations réduites
- Empêche le pool d'être surexposé à toute échelle

### %Score — Part du pool selon la note
```
%Score(S) = 1% + ((S - 85) / 15) x 1%
```
Score 85 = 1.00% | Score 90 = 1.33% | Score 95 = 1.67% | Score 100 = 2.00%

### Prime évolutive (85 -> 95, plafonnée +10%)
```
Prime(S) = min(10%, max(0, (S - 85) x 1%))
```
Score 85 = 0% | Score 90 = 5% | Score 94 = 9% | Score >= 95 = 10% (MAX)

### Bonus de Seniority
Bonus mensuel incrémental, plafonné à **3% après 6 mois** en Live.

### Formule d'allocation finale (complète)
```
Alloc_finale(S) = Pool_total x %Score(S) x FC x (1 + Prime(S) + Seniority_Bonus)
```

### Structure Elite/Standard
- Pool Elite (10%) : traders >= 95/100
- Pool Standard (90%) : traders >= 85/100
- Les traders Elite reçoivent une double allocation (Elite + Standard)

### Pool Public
Dashboard public visible par tous : taille totale, nombre de traders, distribution anonymisée, historique.

---

## 16. PROFIT SPLITS & CAPITAL ALLOUÉ

### Grille officielle (contrat trader Live)

| CLIMB Score | Part Trader | Part Climber | Statut |
|-------------|-------------|--------------|--------|
| 95–100 | 60% | 40% | Elite |
| 90–94 | 55% | 45% | Expert |
| 85–89 | 50% | 50% | Standard |
| 80–84 | 45% | 55% | Surveillance |
| 75–79 | 40% | 60% | Avertissement |
| < 75 | 0% | 0% | 7 jours pour remonter |
| < 50 | Gel compte | — | Retour évaluation |

> Note : Une seconde grille existe dans l'Annexe Règles (99-100 = 80/20, 96-98 = 75/25, etc.) — **à arbitrer avec Flo**. La grille ci-dessus (contrat Live) est la version officielle actuelle.

### Conditions de maintien Live
- CLIMB Score >= 75 minimum pour conserver le split
- Activité régulière : minimum 4 jours/30
- 7 jours en Live avant éligibilité au premier payout (nouveaux arrivants)

### Scaling automatique mensuel
| Score | Mécanisme |
|-------|-----------|
| 100 (60j+) | Conditions à définir — performance exceptionnelle |
| >= 95 | +10% partagé entre traders rang 95+ |
| 85–99 | Partage des 90% du pool entre traders même rang |
| < 85 | 0% — aucune augmentation |

---

## 17. RÈGLES DE TRADING — PHASE ÉVALUATION

### Capital & Compte
- Capital fictif fixe : 1 000 000 USD pour tous
- Devise compte : USD exclusivement

### Instruments autorisés

**FUTURES (CME/CBOT/NYMEX/COMEX/EUREX)**
Indices : ES, NQ, YM, RTY, FDAX, FESX — Devises : 6E, 6B, 6J, 6A, 6C
Matières premières : CL, GC, SI, NG — Taux : ZN, ZB, ZF, ZT

**FOREX** — 28 paires majeures et mineures

**ACTIONS**
US : NYSE, NASDAQ (cap > 500M$) — ETF : SPY, QQQ, TLT, GLD
Commissions : 0.005$/action (min 1$) — à confirmer

**CFD** — Indices globaux, matières premières, Crypto (BTC, ETH uniquement)

**OPTIONS & OBLIGATIONS SPOT** — à voir

### Styles autorisés
Scalping, Day trading, Swing trading, Position trading, Algo/HFT, Hedging, Arbitrage, News trading, IA, Multi-stratégies

### Interdits
Copy trading entre comptes, informations privilégiées, trading en groupe coordonné, manipulation de marché, arbitrage de latence

### Positions
- Overnight : autorisé si exposition <= 5:1 notionnel
- Weekend : autorisé si exposition <= 1:1 notionnel + solde >= 50k$
- Activité minimale : 4 jours de trading sur 30

---

## 18. RÈGLES DE TRADING — PHASE LIVE

### Limites de risque strictes

| Paramètre | Limite | Action automatique |
|-----------|--------|--------------------|
| DD journalier > 15% | Alerte | Mail automatique de prévention |
| DD total > 20% | Alerte VAR | Infraction notifiée |
| DD intraday > 50% | Stop | 24h forcé |
| DD total > 80% | Pause | 5 jours trading + retour scoring (30j consolidation) |
| Score < 75 pendant 7j | Retour | Scoring + consolidation >= 85 pendant 7j |
| Score < 50 | Gel | Compte live gelé, retour évaluation |

### Suppléments Live vs évaluation
- Exposition overnight : 5:1 max notionnel
- Exposition weekend : 1:1 max notionnel + solde >= 50k$

---

## 19. SYSTÈME DE RETRAITS & PAIEMENTS

### Calendrier
- 5 du mois : Premier cycle automatique
- 20 du mois : Deuxième cycle automatique
- Retrait à la demande : chaque jour (préavis 24h avant)

### Mécanisme
- Minimum par retrait : 500$
- Calcul : J+1 — Virement J+3 à J+5 ouvrés
- Méthode : Wallet Climber + RISE WORKS uniquement
- Seules les opérations closes et consolidées sont retirables (positions ouvertes positives non incluses)

**Avec demande :** Part trader versée si >= 500$, part Climber retirée automatiquement
**Sans demande :** Part trader reste sur le compte (augmente le capital), part Climber retirée automatiquement

### Fiscalité
- Statut : Revenus professionnels non salariés
- Déclaration fiscale : responsabilité du trader
- Attestations : via RISE WORKS

---

## 20. PROGRAMME PARRAINAGE & AFFILIATION

### Parrainage (tous traders inscrits)

**Pour le parrain :** -10$/mois par filleul actif (6 mois fixes)
- Cumulable jusqu'à 20 filleuls = **abonnement GRATUIT** (-200$/mois)
- Au-delà de 20 : crédit stocké sur compte

**Pour le filleul :** -20% sur le premier mois (Standard 199$ -> 159$)

**Codes :** Format `CLIMB-XXXXX` / Lien : `climbertrade.com/ref/XXXXX`
**Non cumulable** avec programme affiliation.

### Affiliation Premium (formateurs, créateurs, gérants de communautés)

- **15% récurrents** sur chaque abonnement de l'affilié (à vie)
- **1% sur chaque payout** de l'affilié (payé par Climber depuis sa part)

Exemple : Trader génère 10 000$ profit, split 60% -> reçoit 6 000$ -> affilieur = 60$ (1%)

Pas de plafond. Croissance avec le succès des affiliés. Non cumulable avec parrainage.

---

## 21. DOCUMENTS LÉGAUX

### NDA Beta Testeurs (deux versions : PDF signable + DOCX HTML)
- Confidentialité indéfinie sur tout ce qui concerne la plateforme
- Communication uniquement par email : contact@climbertrade.com
- Sanctions : exclusion + poursuites civiles/pénales + dommages et intérêts

### CGV Challenge d'Évaluation & Reset
- Capital 100% fictif — pas de perte réelle possible
- Accès immédiat après paiement (renonciation au droit de rétractation 14j)
- Critères de réussite : CLIMB Score >= 85 + 30 jours minimum
- Résiliation : annulation à tout moment, aucun remboursement

### Contrat de Trader Professionnel (Programme Live Trading)
- Relation qualifiée de **prestation de service** (non salariale, non exclusive)
- Le trader est considéré comme **analyste** pour Climber Trade
- Stratégies du trader : propriété exclusive du trader (accord de confidentialité)
- Métriques/données : propriété de Climber Trade
- KYC et informations à maintenir à jour
- Déclaration fiscale : responsabilité du trader

### Règlement de Trading (Évaluation & Live)
- Document de référence complet : règles, critères, procédures
- Échelle des sanctions : Avertissement (48h correction) -> Suspension 7-30j -> Définitive
- Processus d'appel : demande sous 7j, décision sous 14j, résultat définitif et sans appel

### Formation & Support (issu du règlement)
- Academy Climber : formations vidéo
- Webinaires live : 2x/mois
- Chat live : 9h-18h CET (lun-ven)
- Email : réponse sous 24h (hors week-end)
- Discord dédiée : urgences traders live
- Tickets : système de suivi

---

## 22. MODULES UI DÉVELOPPÉS

| Fichier TSX | Onglet |
|-------------|--------|
| `Dashboard__Climber_and_Trade_Desk__1_.tsx` | Dashboard / Trade Desk |
| `Dashboard_Climber_My_Stats__1_.tsx` | My Stats |
| `Dashboard_Climber_Performance_Lab__1_.tsx` | Performance Lab |
| `Dashboard_Climber_Challenges__1_.tsx` | Challenges |
| `Dashboard_Climber_Leaderboard__1_.tsx` | Leaderboard |
| `Climber_community__1_.tsx` | Community |
| `Climber_Knowledge_Hub__1_.tsx` | Knowledge Hub |
| `climber_My_profil__1_.tsx` | My Profile |
| `climber_Support_center__1_.tsx` | Support Center |
| `climber_Wallet__1_.tsx` | Wallet & Pool |

---

## 23. LIVRABLES RÉALISÉS

- Badges SVG — 6 badges (160x178px), hexagones layerés, showcase HTML
- Page confirmation paiement — `climber_payment_confirmation_v2.html` (remplace aMember)
- Spécification technique institutionnelle — `climber_trade_Technical_Specification__1_.html` (BlackRock, français)
- Framework classification risque — livré à Alex
- NDA Beta Testeurs — PDF + DOCX
- CGV Challenge & Reset — DOCX complet
- Contrat Trader Live — DOCX complet
- Règlement Trading — DOCX complet
- Programme Parrainage & Affiliation — DOCX complet
- Fiche technique Pool de Liquidité — DOCX complet (FR)
- Technical Specification Liquidity Pool EN (aMember) — DOCX version anglaise
- Ce fichier mémoire — `CLIMBER_TRADE_MEMORY.md`

---

## 24. STACK TECHNIQUE

| Composant | Technologie |
|-----------|-------------|
| Frontend | React TypeScript (TSX) |
| Plateforme trading | Volumetrica |
| Intégration paiements | aMember |
| Paiements traders | RISE WORKS |
| Documents Word | Node.js `docx` library |
| Extraction contenu | Pandoc |
| Charts | Charts.js / D3.js / Recharts |
| CSS | Tailwind CSS |
| Base de données | MariaDB (procédures `30-param-calc.sql`) |
| Schema DB | Prisma (`ptw_param_value`) |
| Design UI | SVG (badges), HTML/CSS (pages standalone) |

---

## 25. ÉQUIPE & COLLABORATEURS

| Personne | Rôle |
|----------|------|
| Flo | Fondateur / Product Owner — architecture business, notation, design system |
| Alex | Développeur principal — implémentation technique de toutes les specs |

**Communication avec Alex :** Tickets en français, prose concise (un paragraphe), sans tableaux ni listes.

---

## 26. ROADMAP & CHANTIERS À VENIR

### À arbitrer en priorité
- Réconcilier les deux grilles de profit splits (Contrat Live vs Annexe Règles)
- Confirmer suppression condition "Top 1%"
- Confirmer commissions actions (0.005$/action min 1$)
- Finaliser instruments options & obligations SPOT
- Calculer le break-even exact pour calibrer % allocation pool

### Court terme
- Intégration page confirmation paiement aMember
- Automatisation des barèmes de notation dans les évaluations
- Tests et calibration système de notation sur données réelles

### Moyen terme
- API export des métriques
- Module profil psychologique & comportemental
- Backtests du scoring (corrélation note <-> PnL futur)
- Academy Climber (formations vidéo + webinaires 2x/mois)
- Tableau complet des marges par instrument

### Long terme
- IPO / levée de fonds Série A+
- Documentation institutionnelle complète
- Offres personnalisées selon profil (coaching, scaling, etc.)

### Documentation à produire
- Customer Metrics Guide (PDF client)
- Barème de notation (PDF client)
- FAQ clients
- Tableau des marges complet par instrument

---

## 27. PROMPTS SYSTÈME CONFIGURÉS

### Chief Advisory Officer (CAO)
Conseil stratégique niveau Goldman Sachs/McKinsey. Marketing (CMO Meta/Apple) + Tech (CTO Google/Amazon) + Structuration juridique/fiscale + levée de fonds + mathématiques financières. Protocole : Analyse préliminaire -> Validation -> Exécution mondiale. Standards : actionnable 48h, vision scale-up, ROI mesurable.

### Expert Audit Métriques Financières
Vérifier cohérence entre specs textuelles et implémentation SQL (MariaDB / `30-param-calc.sql`). Source : `ptw_param_value` (Prisma). Livrables : rapports audit, PDFs clients.

### Template Documentation Métrique (7 sections obligatoires)
1. Header + TL;DR + jauge circulaire
2. Présentation métrique + formule
3. Benchmark 3 profils (Débutant/Intermédiaire/Expert)
4. Corrélations inter-métriques
5. Tableau scoring avec actions par niveau
6. Profils concrets + Timeline 30/60/90 jours
7. FAQ technique + Footer

---

## 28. PRINCIPES NON-NÉGOCIABLES

1. **Le pool de liquidité ne peut pas être épuisé** — mécanisme FC auto-régulateur à toute échelle
2. **Distinction FC (calibration) vs N_cohorte (traders >= 50)** — deux concepts distincts, ne pas confondre
3. **Taux de passage Live très faible** — réalisme financier central au modèle
4. **Passage en Live individuel et instantané** — jamais en batch mensuel
5. **Design sobre, pas cyberpunk** — pas de glow, pas de néon excessif
6. **Notes négatives en calcul = acceptées / en affichage = plancher à 0**
7. **Barèmes testables et ajustables** — tous les coefficients peuvent être recalibrés après tests
8. **Infobulles éducatives sur chaque métrique** — non-négociable pour la plateforme
9. **Tickets à Alex = prose concise en français** — pas de tableaux ni listes structurées
10. **1 compte maximum par personne** — sauf justification société avec preuve
11. **Capital réel Live = toujours via le pool** — pas de capital garanti fixe à l'avance
12. **Transparence publique du pool** — dashboard visible par tous les traders

---

*Ce fichier constitue la mémoire de référence complète du projet Climber Trade.*
*Sources : règlement de trading, CGV, contrat trader live, fiche pool liquidité, specs techniques EN/FR, programme parrainage, NDA, barèmes notation, specs UI/UX.*
*A mettre à jour à chaque décision structurante.*
