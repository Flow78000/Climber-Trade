# Developer Exchanges - Suivi des echanges avec Alex

## Objectif

Ce dossier centralise tous les echanges techniques avec Alex (developpeur principal).
Il sert de :
- **Suivi de comprehension** pour Flo (questions posees, reponses recues)
- **Aide a la decision** pour formuler les bonnes reponses sur le projet
- **Base de connaissances** pour stocker les informations techniques importantes
- **Historique** pour retrouver les decisions passees et leur contexte

## Structure

```
developer-exchanges/
├── README.md                  ← Ce fichier
├── INDEX.md                   ← Index central de tous les echanges
├── _TEMPLATE.md               ← Template pour nouvel echange
├── scoring/                   ← Echanges sur le systeme de notation
├── pool-liquidite/            ← Echanges sur le pool de liquidite
├── trading-rules/             ← Echanges sur les regles de trading
├── technique/                 ← Echanges techniques (DB, API, infra)
├── ui-ux/                     ← Echanges sur l'interface utilisateur
├── legal-compliance/          ← Echanges juridiques et conformite
└── business/                  ← Echanges business (tarifs, splits, etc.)
```

## Statuts

| Tag | Signification |
|-----|---------------|
| `PENDING` | Question envoyee, en attente de reponse d'Alex |
| `ANSWERED` | Alex a repondu, reponse documentee |
| `RESOLVED` | Sujet clos, decision prise |
| `ACTION` | Action requise suite a l'echange |
| `IMPORTANT` | Information critique a retenir |
| `BLOCKER` | Bloque l'avancement, prioritaire |

## Comment utiliser

1. Copier `_TEMPLATE.md` dans le dossier thematique adapte
2. Nommer le fichier : `YYYY-MM-DD_sujet-court.md`
3. Remplir le template avec la question et le contexte
4. Mettre a jour `INDEX.md` avec le lien vers le fichier
5. Completer avec la reponse d'Alex quand elle arrive
6. Mettre a jour le statut

## Convention de nommage

- Fichiers : `YYYY-MM-DD_description-courte.md`
- Exemple : `2026-03-25_calcul-profit-factor.md`

## Rappel

Les tickets a Alex doivent etre rediges en **francais**, en **prose concise** (un paragraphe), **sans tableaux ni listes structurees**.
