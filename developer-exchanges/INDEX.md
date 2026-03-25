# INDEX - Echanges Developpeur Alex

> Derniere mise a jour : 2026-03-25
> Source : YouTrack (climbrr.youtrack.cloud) — Issues CLM-1 a CLM-52

## Statistiques

| Total | Pending | Action | Blocker | Done (a valider) |
|-------|---------|--------|---------|------------------|
| 19    | 8       | 4      | 3       | 6                |

---

## Document de reference

| Fichier | Description |
|---------|-------------|
| [Brief complet YouTrack](technique/2026-03-25_brief-complet-youtrack-CLM1-CLM52.md) | Toutes les issues CLM-1 a CLM-52, detail complet |

---

## Par theme

### Scoring (Systeme de notation)
| Date | Issue | Sujet | Statut | Fichier |
|------|-------|-------|--------|---------|
| 2026-03-25 | — | Reconciliation grilles profit split | `PENDING` | [Lien](scoring/2026-03-25_reconciliation-grilles-profit-split.md) |
| 2026-03-25 | CLM-6 | Scoring bloque si compte failed | `ACTION` | [Lien](scoring/2026-03-25_CLM-6_scoring-compte-failed.md) |
| 2026-03-25 | CLM-9 | Consistency Style + regle 5 jours | `BLOCKER` | [Lien](scoring/2026-03-25_CLM-9_consistency-style-regle-5-jours.md) |

### Pool de Liquidite
_Aucun echange pour le moment._

### Regles de Trading
_Aucun echange pour le moment._

### Technique (DB, API, Infra)
| Date | Issue | Sujet | Statut | Fichier |
|------|-------|-------|--------|---------|
| 2026-03-25 | CLM-4 | Gestion annulation abonnement | `ACTION` | [Lien](technique/2026-03-25_CLM-4_annulation-abonnement.md) |
| 2026-03-25 | CLM-5 | Message echec + flow reabonnement | `ACTION` | [Lien](technique/2026-03-25_CLM-5_message-echec-reabonnement.md) |
| 2026-03-25 | CLM-25 | Page RISE | `PENDING` | [Lien](technique/2026-03-25_CLM-25_page-rise.md) |
| 2026-03-25 | CLM-34 | Reset Leaderboard | `PENDING` | [Lien](technique/2026-03-25_CLM-34_reset-leaderboard.md) |
| 2026-03-25 | CLM-36 | DevOps et Documentation | `PENDING` | [Lien](technique/2026-03-25_CLM-36_devops-documentation.md) |
| 2026-03-25 | CLM-48 | Page confirmation paiement brandee | `PENDING` | [Lien](technique/2026-03-25_CLM-48_page-confirmation-paiement.md) |
| 2026-03-25 | CLM-50 | 2 comptes VT au lieu de 1 | `BLOCKER` | [Lien](technique/2026-03-25_CLM-50_double-compte-VT.md) |
| 2026-03-25 | CLM-52 | Annulation datafeeds en cascade | `PENDING` | [Lien](technique/2026-03-25_CLM-52_annulation-datafeeds-cascade.md) |

### UI / UX
| Date | Issue | Sujet | Statut | Fichier |
|------|-------|-------|--------|---------|
| 2026-03-25 | CLM-11 | Knowledge Hub onglets + 16 metriques | `BLOCKER` | [Lien](ui-ux/2026-03-25_CLM-11_knowledge-hub-onglets-metriques.md) |
| 2026-03-25 | CLM-20 | Score evolution chart | `PENDING` | [Lien](ui-ux/2026-03-25_CLM-20_score-evolution-chart.md) |
| 2026-03-25 | CLM-21 | Avatar trader | `PENDING` | [Lien](ui-ux/2026-03-25_CLM-21_avatar-trader.md) |
| 2026-03-25 | CLM-22 | Equity / Live Balance sans compte live | `PENDING` | [Lien](ui-ux/2026-03-25_CLM-22_equity-live-balance.md) |
| 2026-03-25 | CLM-23 | Page My Profile | `PENDING` | [Lien](ui-ux/2026-03-25_CLM-23_page-my-profile.md) |
| 2026-03-25 | CLM-24 | Page Affiliate complete | `ACTION` | [Lien](ui-ux/2026-03-25_CLM-24_page-affiliate.md) |

### Legal & Compliance
_Aucun echange pour le moment._

### Business (Tarifs, Splits, Affiliation)
| Date | Issue | Sujet | Statut | Fichier |
|------|-------|-------|--------|---------|
| 2026-03-25 | CLM-35 | Wallet regles de retrait | `PENDING` | [Lien](business/2026-03-25_CLM-35_wallet-regles-retrait.md) |

---

## Issues Done (a valider visuellement)

| Issue | Sujet | Resolution |
|-------|-------|------------|
| CLM-1 | Message "active account" | Supprime — nouvelle archi, plus de page signup |
| CLM-2 | Dashboard single-user | Migre, redirection OK |
| CLM-3 | Identifiants Deepchart | Modal avec Account ID, Username, Password + copie |
| CLM-12 | Label "LIVE" | Remplace par heure de derniere maj (auto-refresh 60-120s) |
| CLM-28 | Liens sociaux Community | Implementes et cliquables (Instagram, FB, X, LinkedIn, YT, TikTok) |
| CLM-33 | Level 2 Datafeeds | Produits aMember separes, formulaire achat integre dans profil |

---

## Decisions importantes (recap rapide)

| Date | Sujet | Decision | Fichier |
|------|-------|----------|---------|
| 2026-03-25 | Grilles profit split | En attente — 2 grilles coexistent | [Lien](scoring/2026-03-25_reconciliation-grilles-profit-split.md) |
| 2026-03-25 | Affichage pre-5-jours | En attente — a trancher par Flo | [Lien](scoring/2026-03-25_CLM-9_consistency-style-regle-5-jours.md) |
| 2026-03-25 | Format KB metriques | Alex attend output HTML conforme a kb-items.tsx | [Lien](ui-ux/2026-03-25_CLM-11_knowledge-hub-onglets-metriques.md) |

---

## Donnees cles stockees

| Date | Donnee | Valeur | Source |
|------|--------|--------|--------|
| 2026-03-25 | Auto-refresh dashboard | 120 secondes | CLM-12 |
| 2026-03-25 | Auto-refresh trading | 60 secondes | CLM-12 |
| 2026-03-25 | Seuil metriques | 5 jours de trading min | CLM-9 |
| 2026-03-25 | Datafeeds L2 | Ne contribuent PAS au Climber Pool | CLM-33 |
| 2026-03-25 | Retraits societe | 2x/mois (15 et 30) | CLM-35 |
| 2026-03-25 | Retrait minimum | 500$ | CLM-35 |
