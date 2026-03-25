# CLM-48 — Page de confirmation de paiement brandee

- **Date :** 2026-03-25
- **Statut :** `PENDING`
- **Priorite :** Haute
- **Theme :** technique
- **YouTrack :** CLM-48

---

## Contexte

La page de succes de paiement aMember est totalement non-brandee.

---

## Ce qui a ete demande a Alex

Remplacer la page de succes par le fichier climber_payment_confirmation_v2.html. Methode : soit injection dans le systeme de templates aMember (thanks.phtml ou Admin -> Appearance -> Templates), soit redirect post-paiement vers une page standalone. Variables dynamiques aMember a injecter : order reference, transaction ID, date/heure, nom du produit, montant. Bouton "Access My Dashboard" redirigeant vers app.climbertrade.com/dashboard. Bouton "Download Receipt" declenchant le telechargement de l'invoice PDF aMember.

---

## Reponse d'Alex

_En attente._

**Date reponse :** —

---

## Donnees importantes a retenir

- Fichier source : climber_payment_confirmation_v2.html
- Integration aMember : thanks.phtml ou redirect
- Variables dynamiques : order ref, transaction ID, date, produit, montant
- 2 boutons : "Access My Dashboard" + "Download Receipt"
- Design de reference : artifact Claude (lien dans YouTrack)

---

## Actions a suivre

- [ ] Envoyer le fichier HTML a Alex si pas deja fait
- [ ] Attendre l'implementation
- [ ] Tester les variables dynamiques (montant, ID, etc.)
- [ ] Verifier les 2 boutons fonctionnels
