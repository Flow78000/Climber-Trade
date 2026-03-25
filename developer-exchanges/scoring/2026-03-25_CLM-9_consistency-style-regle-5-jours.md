# CLM-9 — Consistency Style absent + regle des 5 jours

- **Date :** 2026-03-25
- **Statut :** `BLOCKER`
- **Priorite :** Critique
- **Theme :** scoring
- **YouTrack :** CLM-9

---

## Contexte

Le metric "Consistency Style" n'est pas calcule. Les metriques "Stability Lot" et "Average Leverage" n'affichent aucune donnee. C'est un des 4 piliers du CLIMB Score, donc critique.

---

## Ce qui a ete demande a Alex

Toutes les metriques ne commencent a s'afficher qu'apres 5 jours de trading avec au moins 1 trade par jour. Avant ce seuil : afficher une icone horloge sur toutes les sections, sections non cliquables (pas d'ouverture de details).

---

## Reponse d'Alex

_En attente. Alex a besoin de clarification sur ce qui s'affiche pendant les 5 premiers jours._

**Date reponse :** —

---

## Analyse / Comprehension

Point ouvert a trancher : que montrer exactement pendant les 5 premiers jours ?

Options possibles :
1. **Rien du tout** — icone horloge partout, aucune donnee
2. **Metriques partielles** — afficher ce qui est calculable (ex: PnL journalier) mais pas les ratios
3. **Score indicatif** — afficher les valeurs avec un badge "indicatif" ou "provisoire"

Ma recommandation : option 1 (rien) pour la simplicite et la coherence. Un score partiel pourrait etre trompeur.

---

## Donnees importantes a retenir

- Seuil : 5 jours de trading avec min 1 trade/jour
- Avant seuil : icone horloge, sections non cliquables
- Apres seuil : toutes les metriques s'affichent normalement
- Concerne les 4 piliers (pas seulement Consistency)
- Reference CLAUDE.md : section 10 (Pilier 3 — Consistency & Trading Style)

---

## Decision a prendre par Flo

- [ ] Trancher : que montrer pendant les 5 premiers jours ? (option 1, 2 ou 3)
- [ ] Communiquer la decision a Alex pour debloquer

---

## Actions a suivre

- [ ] Decider de l'affichage pre-5-jours
- [ ] Repondre a Alex avec la decision
- [ ] Valider l'implementation du Consistency Style
- [ ] Tester Stability Lot et Average Leverage
