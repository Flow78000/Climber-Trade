# BRIEF COMPLET YOUTRACK — Issues CLM-1 a CLM-52

- **Date :** 2026-03-25
- **Source :** YouTrack (climbrr.youtrack.cloud)
- **Statut :** Document de reference

---

## Legende statuts

| Statut | Signification |
|--------|---------------|
| DONE | Implemente, en attente de validation |
| IN_PROGRESS | En cours de dev |
| TODO | A faire |
| NEED_INFO | Bloque, en attente de reponse |
| CRITICAL | Priorite critique |

---

## Recap par priorite

### Critical / Bloquant
- **CLM-24** — Page Affiliate complete (IN_PROGRESS)
- **CLM-9** — Consistency Style + metriques regle 5 jours (NEED_INFO)

### Prioritaire
- **CLM-11** — Knowledge Hub onglets + contenu 16 metriques (NEED_INFO)
- **CLM-23** — Page My Profile design de reference (TODO)
- **CLM-48** — Page confirmation paiement brandee (TODO)

### In Progress
- **CLM-4** — Gestion annulation abonnement
- **CLM-5** — Message echec + flow reabonnement
- **CLM-6** — Scoring bloque si compte failed

### To Do
- **CLM-20** — Score evolution chart (barres verticales)
- **CLM-21** — Selection avatar trader
- **CLM-22** — Current Equity / Live Balance sans compte live
- **CLM-25** — Page RISE
- **CLM-34** — Reset Leaderboard
- **CLM-35** — Wallet regles de retrait
- **CLM-36** — DevOps et GitHub documentation
- **CLM-52** — Annulation datafeeds a l'annulation abonnement principal

### Done (a valider)
- **CLM-1** — Message "active account" supprime
- **CLM-2** — Nouveau dashboard single-user
- **CLM-3** — Identifiants Deepchart affiches
- **CLM-12** — Label LIVE remplace par last update
- **CLM-28** — Liens sociaux Community page
- **CLM-33** — Level 2 Datafeeds

### Bloque / Need Info
- **CLM-50** — 2 comptes VT crees au lieu de 1 (attente support VT)
- **CLM-9** — Metriques affichage avant J+5 (a definir)
- **CLM-11** — KB format HTML des 16 metriques (Alex attend output)

---

## Detail complet par domaine

### 1. Authentification et Abonnement

**CLM-1 — Message "You already have an active account"** (DONE)
Avec la nouvelle architecture, l'utilisateur ne voit plus la page signup. Si l'abonnement est perdu ou incomplet, la page de commande s'affiche directement dans le dashboard. Seules les pages profil, helpdesk et affiliation restent accessibles dans cet etat. Resolu, aucune action requise.

**CLM-4 — Gestion de l'annulation d'abonnement** (IN_PROGRESS)
Permettre a l'utilisateur d'annuler son abonnement depuis le dashboard. A l'annulation : supprimer le compte de trading (conserver l'historique en BDD). Passer l'abonnement aMember en statut "expired". Prevoir en BDD la conservation des resultats du dernier compte annule/failed pour un futur onglet "History".

**CLM-5 — Absence de message d'echec + impossibilite de se reabonner** (IN_PROGRESS)
Quand un compte est blown (Max Drawdown depasse), aucun message n'informe l'utilisateur. Implementer : message d'echec clair avec raison, puis 3 options : (1) Reset du compte (paiement independant), (2) Annulation abonnement, (3) Maintien jusqu'a l'anniversaire avec remplacement auto.

**CLM-52 — Annulation abonnement principal -> annuler aussi les datafeeds** (TODO)
Lors de l'annulation de l'abonnement principal, declencher automatiquement l'annulation de tous les abonnements datafeeds actifs de l'utilisateur.

**CLM-50 — 2 comptes de trading crees sur VT au lieu de 1** (NEED_INFO)
Lors de la creation d'un utilisateur sur Volumetric, 2 comptes sont crees alors qu'aMember n'en demande qu'un seul. En attente de reponse du support VT.

### 2. Dashboard et Metriques

**CLM-2 — Nouveau dashboard single-user** (DONE)
Fonctionnalites aMember portees dans le nouveau dashboard. Redirection depuis l'ancienne URL. Resolu.

**CLM-3 — Affichage des identifiants Deepchart** (DONE)
Icone info ajoutee a cote de l'Account ID. Modal "Account Details" avec Account ID, Username, Password (masque + toggle). Resolu, a valider visuellement.

**CLM-6 — Scoring incorrect sur un compte failed le meme jour** (IN_PROGRESS)
Un compte ayant failli le jour meme recevait quand meme un score (100/100 sur Initial Net Profit). Regle : avant toute attribution de score journalier, verifier le statut du compte. Si failed -> suspendre le scoring de cette journee.

**CLM-9 — Consistency Style absent du calcul des metriques** (NEED_INFO, CRITICAL)
Metriques "Stability Lot" et "Average Leverage" n'affichent rien. Decision : toutes les metriques commencent apres 5 jours de trading (min 1 trade/jour). Avant ce seuil : icone horloge, sections non cliquables. Point ouvert : definir ce qui s'affiche pendant les 5 premiers jours.

**CLM-12 — Label "LIVE" trompeur sur les metriques** (DONE)
Supprime et remplace par heure de derniere mise a jour. Auto-refresh : dashboard 120s, trading 60s. Resolu.

**CLM-20 — Score evolution chart a refaire** (TODO)
Chart barres verticales : une barre par jour trade. Jours non trades : meme hauteur que veille. Jours futurs : aucune barre. Ligne reliant les tops de barres.

**CLM-22 — Current Equity / Live Balance sans compte live actif** (TODO)
Sans compte live : afficher "Not activated" montant zero. Avec compte live : solde courant + a chaque anniversaire mensuel, montant potentiel si maintien du compte.

### 3. Profil Utilisateur

**CLM-23 — Page "My Profile"** (TODO, PRIORITAIRE)
Prerequis pour avatar, infos personnelles, parametres. Implementee par Alex Scott hors avatar. Rendu visuel doit correspondre au design de reference. Contenu : infos personnelles, selection avatar, parametres compte, historique abonnements.

**CLM-21 — Selection d'avatar trader** (TODO)
Permettre au trader de choisir parmi une selection predefinie OU d'uploader un avatar personnalise depuis la page profil.

### 4. Knowledge Hub

**CLM-11 — Onglets non fonctionnels dans le Knowledge Hub** (NEED_INFO, PRIORITAIRE)
Onglets Performance, Consistency Style et Quality Execution non cliquables. Page KB implementee mais attend le contenu complet. Florian a fourni un fichier kb-items.tsx avec 16 metriques. Probleme : Alex indique que le format genere par Claude n'est pas conforme au fichier original. Il demande un output HTML dans le meme format et les memes types que kb-items.tsx. Action : lire kb-items.tsx existant, generer le contenu des 16 metriques manquantes dans le bon format, rendre tous les onglets cliquables.

### 5. Pages a developper

**CLM-24 — Page Affiliate** (IN_PROGRESS, CRITICAL)
Deployee avec 4 widgets basiques mais incomplete. Alex confirme 2-3 jours de dev pour le design complet. A implementer : page complete selon design de reference, systeme de tracking + liens de parrainage, dashboard affilie, gestion payouts et stats.

**CLM-25 — Page RISE non implementee** (TODO)
Flow : trader clique "Complete Setup" -> popup email + RISE account key -> si non enregistre, invitation auto via RISE API -> redirection RISE.

### 6. Community

**CLM-28 — Liens sociaux Community page** (DONE)
Liens implementes, cliquables, ouverture nouvel onglet. URLs : Instagram (climber.trade), Facebook, X (@ClimberTrade), LinkedIn, YouTube (@ClimberTrade), TikTok (climber_trade.funding). Resolu.

### 7. Donnees et Datafeeds

**CLM-33 — Level 2 Datafeeds pour actifs futures** (DONE)
Implementes comme produits aMember separes (1 produit par datafeed). Upgrade/Downgrade configurable. Important : abonnements datafeeds L2 ne contribuent PAS au Climber Pool. Gestion des datafeeds corrigee + formulaire d'achat integre dans onglet "Additional Data Feeds" de la page profil. Resolu.

### 8. Wallet et Retraits

**CLM-35 — Module Wallet / Retraits** (TODO)
Regles : commissions selon score trader. Retrait possible a tout moment si solde > solde initial. Sans demande trader : societe peut effectuer 2 retraits/mois (15 et 30) pour commission selon profit split. Si solde < solde initial : aucun retrait obligatoire.

### 9. Leaderboard

**CLM-34 — Reset du Leaderboard** (TODO)
Purger toutes les donnees de test avant launch officiel.

### 10. Paiement

**CLM-48 — Page de confirmation de paiement brandee** (TODO, PRIORITAIRE)
Remplacer la page de succes aMember par climber_payment_confirmation_v2.html. Variables dynamiques : order reference, transaction ID, date/heure, nom produit, montant. Boutons "Access My Dashboard" et "Download Receipt".

### 11. DevOps et Infrastructure

**CLM-36 — DevOps et Documentation** (TODO)
Creer un repository GitHub entierement documente. Documentation : architecture, codebase existant, dependances, procedures de deploiement.
