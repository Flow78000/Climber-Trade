# CLM-20 — Score evolution chart a refaire

- **Date :** 2026-03-25
- **Statut :** `PENDING`
- **Priorite :** Moyenne
- **Theme :** ui-ux
- **YouTrack :** CLM-20

---

## Contexte

Le graphique d'evolution du score est completement plat et ne reflete pas les variations jour par jour.

---

## Ce qui a ete demande a Alex

Remplacer par un chart a barres verticales avec une barre par jour trade. Les jours non trades maintiennent la meme hauteur de barre que la veille. Les jours futurs n'ont aucune barre. Ajouter une ligne reliant les tops de barres pour visualiser l'evolution en line chart.

---

## Reponse d'Alex

_En attente._

**Date reponse :** —

---

## Donnees importantes a retenir

- Type de chart : barres verticales + line chart superpose
- Jours non trades : maintien hauteur veille (pas de trou)
- Jours futurs : pas de barre
- Stack technique : Charts.js / D3.js / Recharts

---

## Actions a suivre

- [ ] Attendre l'implementation d'Alex
- [ ] Valider le rendu visuel
- [ ] Tester avec des donnees sur plusieurs semaines
