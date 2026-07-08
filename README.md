# AgroSen — Frontend

Interface React de l'application AgroSen, une plateforme de gestion agricole intelligente.

## Stack technique

- **React 19** — Framework UI
- **React Router DOM v7** — Navigation SPA
- **Axios** — Requêtes HTTP vers l'API backend

## Prérequis

- Node.js >= 18
- npm >= 9

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env` à la racine du dossier :

```env
VITE_API_URL=http://localhost:5000
```

En production, remplacer par l'URL de votre backend déployé, par exemple :

```env
VITE_API_URL=https://your-backend.railway.app
```

## Lancer en développement

```bash
npm start
```

L'app sera disponible sur [http://localhost:3000](http://localhost:3000).

## Build de production

```bash
npm run build
```

## Structure du projet

```
src/
├── components/        # Composants réutilisables (MeteoWidget, PremiumModal…)
├── pages/             # Pages principales (Dashboard, Parcelles, Diagnostic…)
├── services/          # Configuration Axios (api.js)
├── App.js             # Routeur principal
└── index.js           # Point d'entrée
```

## Lien avec le backend

Ce frontend communique avec le repo **AgroSen-backend** via une API REST.  
Assurez-vous que le backend est démarré avant de lancer le frontend.

---

> Repo lié : [AgroSen-backend](../AgroSen-backend)
