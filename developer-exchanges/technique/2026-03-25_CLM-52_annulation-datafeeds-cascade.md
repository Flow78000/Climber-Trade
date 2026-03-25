# CLM-52 — Annulation datafeeds en cascade

- **Date :** 2026-03-25
- **Statut :** `PENDING`
- **Priorite :** Moyenne
- **Theme :** technique
- **YouTrack :** CLM-52

---

## Contexte

Quand l'utilisateur annule son abonnement principal depuis le dashboard, les datafeeds Level 2 associes ne sont pas annules automatiquement.

---

## Ce qui a ete demande a Alex

Lors de l'annulation de l'abonnement principal, declencher automatiquement l'annulation de tous les abonnements datafeeds actifs de l'utilisateur.

---

## Reponse d'Alex

_En attente._

**Date reponse :** —

---

## Donnees importantes a retenir

- Les datafeeds sont des produits aMember separes (CLM-33)
- L'annulation doit etre en cascade : principal -> tous les datafeeds
- Les datafeeds L2 ne contribuent pas au Climber Pool
- Lie a CLM-4 (annulation abonnement) et CLM-33 (datafeeds)

---

## Actions a suivre

- [ ] Attendre l'implementation
- [ ] Tester : annuler abonnement principal -> verifier que tous les datafeeds sont annules
