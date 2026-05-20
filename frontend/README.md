# Life OS — Frontend

Application Next.js (App Router) pour la plateforme Life OS.

## Installation

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL de l'API (ex: `http://localhost:5000/api` ou Render en prod) |
| `NEXT_PUBLIC_MOCK_AUTH` | `true` = auth locale sans backend, `false` = API réelle |

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run start` | Lancer le build |
| `npm run lint` | ESLint |

## Déploiement Vercel

Dans les paramètres du projet Vercel :

- **Root Directory :** `frontend`
- **Framework :** Next.js

Variables de production :

```
NEXT_PUBLIC_API_URL=https://life-os-platform.onrender.com/api
NEXT_PUBLIC_MOCK_AUTH=false
```

Le backend doit autoriser l'URL Vercel via `FRONTEND_URL` (CORS).

## Structure

```
frontend/
├── src/
│   ├── app/           # Pages (auth, dashboard)
│   ├── components/    # UI
│   ├── contexts/      # Auth
│   ├── lib/api/       # Client HTTP
│   └── types/         # Types TypeScript
├── package.json
└── next.config.ts
```

Contrat API : `../docs/api/openapi.yml`
