# CLM-35 — Module Wallet / Regles de retrait

- **Date :** 2026-03-25
- **Statut :** `PENDING`
- **Priorite :** Moyenne
- **Theme :** business
- **YouTrack :** CLM-35

---

## Contexte

Les regles de retrait ne sont pas implementees dans le module Wallet.

---

## Ce qui a ete demande a Alex

Les commissions sont calculees selon le score du trader (voir CLAUDE.md section 16). Le trader peut demander un retrait a tout moment si son solde est superieur au solde initial. Sans demande du trader, la societe peut effectuer 2 demandes de retrait par mois (le 15 et le 30) pour le montant de commission selon le profit split, uniquement si le solde est superieur au solde initial. Si le solde est inferieur au solde initial, aucun retrait obligatoire possible.

---

## Reponse d'Alex

_En attente._

**Date reponse :** —

---

## Donnees importantes a retenir

- Retrait trader : a tout moment si solde > solde initial
- Retrait societe : 2x/mois (15 et 30), automatique, si solde > solde initial
- Minimum par retrait : 500$
- Methode : Wallet Climber + RISE WORKS
- Seules les operations closes sont retirables (pas les positions ouvertes)
- Ref CLAUDE.md : section 19 (Systeme de Retraits & Paiements)

---

## Actions a suivre

- [ ] Attendre l'implementation d'Alex
- [ ] Tester le flow de retrait trader
- [ ] Tester le retrait automatique societe (15 et 30 du mois)
- [ ] Verifier la condition solde > solde initial
