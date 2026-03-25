# Mockups & Prototypes — Climber Trade

## Objectif

Espace de visualisation des maquettes et prototypes a montrer aux developpeurs.
Ouvrir `index.html` dans un navigateur pour visualiser le catalogue complet.

## Structure

```
mockups/
├── index.html              ← Viewer principal (ouvrir dans le navigateur)
├── README.md               ← Ce fichier
├── dashboard/              ← Maquettes Dashboard / Trade Desk
├── scoring/                ← Maquettes Scoring & Metriques
├── wallet/                 ← Maquettes Wallet & Retraits
├── profile/                ← Maquettes My Profile
├── affiliate/              ← Maquettes Affiliate & Parrainage
├── knowledge-hub/          ← Maquettes Knowledge Hub
├── leaderboard/            ← Maquettes Leaderboard
├── community/              ← Maquettes Community
├── support/                ← Maquettes Support Center
└── assets/                 ← Images partagees (logos, icones, etc.)
```

## Comment ajouter un mockup

### 1. Placer le fichier dans le bon dossier

Formats acceptes :
- `.html` / `.htm` — Pages interactives, prototypes complets
- `.png` / `.jpg` / `.svg` — Captures, designs statiques
- `.tsx` — Composants React (reference uniquement)

### 2. Enregistrer dans le catalogue

Ouvrir `index.html` et ajouter une entree dans la variable `MOCKUPS` :

```javascript
{
  id: "dashboard-trade-desk",          // Identifiant unique
  title: "Trade Desk — Dashboard",     // Titre affiche
  description: "Vue d'ensemble...",    // Description courte
  section: "dashboard",               // Dossier / section
  file: "dashboard/trade-desk.html",  // Chemin relatif vers le fichier
  type: "html",                        // html | image
  status: "ready",                     // ready | wip | draft
  issue: "CLM-2",                      // Issue YouTrack liee (optionnel)
  date: "2026-03-25"                   // Date de creation
}
```

### 3. Ouvrir dans le navigateur

```bash
# Depuis la racine du projet
open mockups/index.html

# Ou avec un serveur local pour eviter les problemes CORS avec les iframes
npx serve mockups/
```

## Statuts

| Statut | Usage |
|--------|-------|
| `ready` | Valide, pret a envoyer au dev |
| `wip` | En cours de travail, pas encore final |
| `draft` | Brouillon, idee a affiner |

## Convention de nommage

- Fichiers : `nom-descriptif-v1.html` ou `nom-descriptif.png`
- Incrementer la version si mise a jour : `-v1`, `-v2`, etc.
- Pas d'espaces ni de caracteres speciaux dans les noms de fichiers
