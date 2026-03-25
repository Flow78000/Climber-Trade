# Reconciliation des deux grilles de Profit Split

- **Date :** 2026-03-25
- **Statut :** `PENDING`
- **Priorite :** Haute
- **Theme :** scoring / business

---

## Contexte

Deux grilles de profit split coexistent dans la documentation : celle du contrat trader Live (50/50 a 60/40) et celle de l'Annexe Regles (jusqu'a 80/20). Il faut trancher quelle grille s'applique pour l'implementation dans le systeme.

---

## Question posee a Alex

Salut Alex, on a un point a clarifier sur les profit splits. Dans le contrat Live on a une grille qui va de 50/50 (score 85-89) jusqu'a 60/40 (score 95-100), mais dans l'annexe du reglement il y a une autre grille qui monte jusqu'a 80/20 pour les scores 99-100. Il faut qu'on decide laquelle on implemente. Pour l'instant, pars sur la grille du contrat Live (la plus conservative) et prevois un parametre configurable pour qu'on puisse ajuster les paliers sans toucher au code. Je te confirmerai la grille finale des que j'aurai tranche.

---

## Reponse d'Alex

_En attente._

**Date reponse :** —

---

## Analyse / Comprehension

A completer apres reponse d'Alex.

---

## Decision prise

_En attente._

---

## Donnees importantes a retenir

**Grille Contrat Live (version conservative) :**
- 95-100 : 60/40 (trader/Climber)
- 90-94 : 55/45
- 85-89 : 50/50
- 80-84 : 45/55
- 75-79 : 40/60

**Grille Annexe Regles (version genereuse) :**
- 99-100 : 80/20
- 96-98 : 75/25
- (paliers intermediaires a documenter)

---

## Actions a suivre

- [ ] Trancher la grille definitive
- [ ] Confirmer a Alex la grille retenue
- [ ] Verifier l'implementation parametrable

---

## References

- CLAUDE.md section 16 (Profit Splits & Capital Alloue)
- Contrat Trader Live
- Annexe Reglement de Trading
