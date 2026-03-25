# CLM-5 — Message d'echec + flow de reabonnement

- **Date :** 2026-03-25
- **Statut :** `ACTION`
- **Priorite :** Haute
- **Theme :** technique
- **YouTrack :** CLM-5

---

## Contexte

Quand un compte est blown (Max Drawdown depasse), aucun message n'informe l'utilisateur. Aucun flow de reabonnement n'est propose.

---

## Ce qui a ete demande a Alex

Afficher un message d'echec clair avec la raison (ex : "Max Drawdown exceeded"). Proposer immediatement 3 options depuis le dashboard : (1) Reset du compte, paiement independant de l'abonnement, remplace le compte failed par un nouveau compte. (2) Annulation de l'abonnement, annule compte + abonnement, l'utilisateur peut ensuite souscrire un nouveau. (3) Maintien jusqu'a l'anniversaire, le compte failed reste tel quel jusqu'a la date de renouvellement, a laquelle il est automatiquement remplace par un nouveau compte.

---

## Reponse d'Alex

_En cours d'implementation._

**Date reponse :** —

---

## Analyse / Comprehension

Les 3 options couvrent tous les scenarios :
- Option 1 (Reset) : pour les traders qui veulent recommencer immediatement
- Option 2 (Annulation) : pour ceux qui veulent changer de formule ou arreter
- Option 3 (Maintien) : pour ceux qui veulent attendre le renouvellement auto

Le reset est un paiement independant (cf tarification : 99$ standard, 79$ si score 80-84).

---

## Donnees importantes a retenir

- Message d'echec doit etre explicite avec la raison exacte
- 3 options obligatoires : Reset / Annulation / Maintien
- Reset : paiement independant (99$ ou 79$ selon score)
- Option 3 : remplacement automatique a la date anniversaire
- Lie a CLM-4 (annulation) et au systeme de pricing des resets

---

## Actions a suivre

- [ ] Valider les 3 flows d'Alex
- [ ] Tester le message d'echec (texte + design)
- [ ] Tester chaque option de bout en bout
- [ ] Verifier l'integration avec le pricing des resets
