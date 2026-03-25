# CLM-6 — Scoring incorrect sur un compte failed le meme jour

- **Date :** 2026-03-25
- **Statut :** `ACTION`
- **Priorite :** Haute
- **Theme :** scoring
- **YouTrack :** CLM-6

---

## Contexte

Apres mise a jour des donnees Rithmic, un compte ayant failli le jour meme (Max Drawdown 100K depasse) recevait quand meme un score, dont 100/100 sur Initial Net Profit. C'est un bug critique car un compte failed ne doit jamais recevoir de score.

---

## Ce qui a ete demande a Alex

Avant toute attribution de score journalier, verifier le statut du compte. Si le compte est en statut "failed" pour la journee en cours, suspendre ou annuler le scoring de cette journee. Regle absolue : un compte failed ne doit jamais recevoir de score.

---

## Reponse d'Alex

_En cours d'implementation._

**Date reponse :** —

---

## Analyse / Comprehension

C'est un bug de logique dans le pipeline de scoring. La verification du statut du compte doit etre la premiere etape avant tout calcul. Le cas specifique : un compte qui fail en intraday doit voir son scoring stoppe immediatement, pas seulement le lendemain.

---

## Donnees importantes a retenir

- Regle : compte failed = ZERO score, jamais d'exception
- La verification doit etre en amont de tout calcul de score
- Concerne le pipeline de scoring journalier (MariaDB / procedures SQL)
- Le bug est apparu apres mise a jour des donnees Rithmic

---

## Actions a suivre

- [ ] Valider le fix d'Alex
- [ ] Tester avec un scenario de compte qui fail en intraday
- [ ] Verifier qu'aucun score residuel n'est attribue
