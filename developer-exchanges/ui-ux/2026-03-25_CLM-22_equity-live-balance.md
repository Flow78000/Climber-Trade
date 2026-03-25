# CLM-22 — Current Equity / Live Balance sans compte live

- **Date :** 2026-03-25
- **Statut :** `PENDING`
- **Priorite :** Moyenne
- **Theme :** ui-ux
- **YouTrack :** CLM-22

---

## Contexte

La section "Current Equity / Live Balance" affiche des donnees incorrectes quand aucun compte live n'est actif.

---

## Ce qui a ete demande a Alex

Sans compte live actif : afficher "Not activated" avec le montant a zero. Avec compte live actif : afficher le solde courant, et a chaque anniversaire mensuel indiquer le montant que le trader recevrait s'il maintient son compte live actif.

---

## Reponse d'Alex

_En attente._

---

## Donnees importantes a retenir

- 2 etats : sans compte live ("Not activated", 0$) / avec compte live (solde + projection anniversaire)
- La projection a l'anniversaire = montant potentiel selon profit split actuel

---

## Actions a suivre

- [ ] Attendre l'implementation
- [ ] Tester les 2 etats (avec et sans compte live)
