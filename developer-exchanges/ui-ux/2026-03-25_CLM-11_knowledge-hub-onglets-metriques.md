# CLM-11 — Knowledge Hub onglets + contenu 16 metriques

- **Date :** 2026-03-25
- **Statut :** `BLOCKER`
- **Priorite :** Haute
- **Theme :** ui-ux
- **YouTrack :** CLM-11

---

## Contexte

Les onglets Performance, Consistency Style et Quality Execution ne sont pas cliquables dans le Knowledge Hub. La page est implementee mais attend le contenu complet des metriques dans le bon format.

---

## Ce qui a ete fourni a Alex

Un fichier kb-items.tsx complet avec les 16 metriques : Risk (4), Performance (4), Consistency (5), Quality (3). Chaque metrique couvre 6 sections : description, reveals, formula, examples, improve, thresholds.

---

## Probleme bloquant

Alex indique que Claude a genere des donnees dans un format non conforme au fichier original (kb-items.tsx). Il demande un output HTML du contenu des metriques dans le meme format et les memes types que le fichier original kb-items.tsx.

---

## Reponse d'Alex

Alex attend un output conforme au format du fichier original kb-items.tsx. Format actuel rejete.

**Date reponse :** 2026-03-25

---

## Analyse / Comprehension

Le probleme est un probleme de format, pas de contenu. Le contenu des 16 metriques existe, mais il faut :
1. Lire le fichier kb-items.tsx existant pour comprendre la structure exacte (types TypeScript)
2. Regenerer le contenu dans ce format exact
3. Rendre les onglets cliquables

C'est un sujet ou Claude Code peut aider directement : lire le fichier original, comprendre les types, et produire l'output conforme.

---

## Donnees importantes a retenir

- 16 metriques a couvrir dans 4 piliers
- Fichiers de reference dans YouTrack : kb-items (6).tsx (47 kB), scoring-data.tsx (49 kB), trader-guide-data.tsx (25 kB), margin-data.tsx (26 kB)
- Format requis : TypeScript conforme aux types du fichier original
- 6 sections par metrique : description, reveals, formula, examples, improve, thresholds
- Exception : Best Daily Performance = informationnelle, pas de thresholds

---

## Actions a suivre

- [ ] Recuperer le fichier kb-items.tsx original depuis Alex ou YouTrack
- [ ] Analyser la structure TypeScript exacte
- [ ] Generer le contenu des 16 metriques dans le bon format
- [ ] Envoyer a Alex pour validation
- [ ] Tester les onglets une fois implementes
