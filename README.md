# Life OS Platform

Application web fullstack d'optimisation de vie personnelle pilotée par IA.

## Stack technique

- Frontend : Next.js — Vercel
- Backend : Node.js + Express.js
- Base de données : PostgreSQL
- IA : OpenAI API
- DevOps : Docker, GitHub Actions

## Modules

- Agenda intelligent
- Gestion des tâches
- Suivi santé mentale
- Objectifs de vie
- Productivité et focus timer
- Suggestions IA hebdomadaires

## Equipe

- Backend : Rony
- Frontend : [prénom de ton ami]

## Liens de déploiement

- Frontend : Vercel (Root Directory : `frontend`)
- API Backend : https://life-os-platform.onrender.com
- Health Check : https://life-os-platform.onrender.com/api/health

## Structure du projet

```
life-os-platform/
├── frontend/          # Next.js (Vercel)
├── backend/           # Node.js + Express + Prisma
├── docs/              # Documentation & OpenAPI
├── docker-compose.yml
└── README.md
```

## Installation locale

### Prérequis
- Node.js 20+
- Docker Desktop

### Lancer le frontend en développement

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Voir [frontend/README.md](frontend/README.md) pour le détail.

### Lancer le projet avec Docker

```bash
docker compose up -d
```

### Lancer le backend en développement

```bash
cd backend
npm install
npm run dev
```

### Lancer les tests

```bash
cd backend
npm test
```

### Lancer les tests avec couverture

```bash
cd backend
npm run test:coverage
```

## Variables d environnement backend

| Variable | Description |
|----------|-------------|
| DATABASE_URL | URL de connexion PostgreSQL |
| JWT_SECRET | Clé secrète pour les tokens JWT |
| JWT_EXPIRES_IN | Durée de validité du token |
| NODE_ENV | Environnement development ou production |
| PORT | Port du serveur |

## API Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/auth/register | Créer un compte |
| POST | /api/auth/login | Connexion |
| GET | /api/auth/me | Profil utilisateur |
| GET | /api/tasks | Lister les tâches |
| POST | /api/tasks | Créer une tâche |
| PUT | /api/tasks/:id | Modifier une tâche |
| DELETE | /api/tasks/:id | Supprimer une tâche |
| GET | /api/events | Lister les événements |
| POST | /api/events | Créer un événement |
| GET | /api/goals | Lister les objectifs |
| POST | /api/goals | Créer un objectif |
| PATCH | /api/goals/:id/progress | Mettre à jour la progression |
| GET | /api/mood | Historique humeur |
| POST | /api/mood | Enregistrer humeur |
| GET | /api/focus | Lister les sessions focus |
| POST | /api/focus | Enregistrer une session |
| GET | /api/ai/suggestions | Suggestions IA |
| GET | /api/ai/weekly-report | Rapport hebdomadaire |
| GET | /api/health | Santé du serveur |

## Documentation

- Contrat API : docs/api/openapi.yml
- Documentation backend : docs/IMPLEMENTATION_COMPLETE.md