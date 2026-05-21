markdown# Architecture — Life OS Platform

## Vue d ensemble
┌─────────────────────────────────────────────────────────────┐
│                        UTILISATEUR                          │
└─────────────────────────┬───────────────────────────────────┘
│ HTTPS
▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                        │
│                    Vercel — Port 3000                        │
│                                                             │
│  - Pages : Login, Dashboard, Tasks, Goals, Mood, Focus      │
│  - State : Zustand                                          │
│  - API Client : Axios + React Query                         │
└─────────────────────────┬───────────────────────────────────┘
│ REST API (JSON)
│ Authorization: Bearer JWT
▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)               │
│                    Render — Port 5000                        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Routes    │  │ Middlewares │  │ Controllers │        │
│  │  /api/auth  │  │     JWT     │  │    Auth     │        │
│  │  /api/tasks │  │  Validator  │  │    Tasks    │        │
│  │  /api/goals │  │   Helmet    │  │    Goals    │        │
│  │  /api/mood  │  │    CORS     │  │    Mood     │        │
│  │  /api/focus │  │   Morgan    │  │    Focus    │        │
│  │  /api/ai    │  └─────────────┘  │    AI       │        │
│  └─────────────┘                   └─────────────┘        │
│                                                             │
│  ┌─────────────────────────────────────────────────┐       │
│  │                   Services                       │       │
│  │  authService  tasksService  goalsService         │       │
│  │  moodService  focusService  aiService            │       │
│  └─────────────────────────┬───────────────────────┘       │
└────────────────────────────┼────────────────────────────────┘
│ Prisma ORM
▼
┌─────────────────────────────────────────────────────────────┐
│                    BASE DE DONNEES                           │
│                    PostgreSQL 16                             │
│                    Render PostgreSQL                         │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │  users   │  │  tasks   │  │  events  │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐        │
│  │  goals   │  │ mood_entries │  │ focus_sessions│        │
│  └──────────┘  └──────────────┘  └───────────────┘        │
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│                    API EXTERNE                               │
│                    OpenAI API                                │
│                    GPT pour suggestions et rapports IA       │
└─────────────────────────────────────────────────────────────┘

---

## Flux d une requête typique

Utilisateur clique sur "Créer une tâche" dans le frontend
Frontend envoie POST /api/tasks avec le token JWT dans le header
Backend reçoit la requête
Middleware JWT vérifie le token et identifie l utilisateur
Middleware Validator vérifie que le titre est présent
Controller Tasks appelle le Service Tasks
Service Tasks appelle Prisma pour insérer en base de données
Prisma exécute le SQL dans PostgreSQL
La tâche créée remonte jusqu au frontend
Frontend affiche la nouvelle tâche dans la liste


---

## Modèle de données
users
├── id          UUID (clé primaire)
├── email       STRING (unique)
├── password    STRING (hashé bcrypt)
├── name        STRING
├── createdAt   DATETIME
└── updatedAt   DATETIME
tasks
├── id          UUID (clé primaire)
├── title       STRING
├── description STRING (optionnel)
├── status      ENUM (todo, in_progress, done)
├── priority    ENUM (low, medium, high)
├── dueDate     DATETIME (optionnel)
├── userId      UUID (clé étrangère → users)
├── createdAt   DATETIME
└── updatedAt   DATETIME
events
├── id          UUID (clé primaire)
├── title       STRING
├── description STRING (optionnel)
├── startAt     DATETIME
├── endAt       DATETIME
├── userId      UUID (clé étrangère → users)
├── createdAt   DATETIME
└── updatedAt   DATETIME
goals
├── id          UUID (clé primaire)
├── title       STRING
├── description STRING (optionnel)
├── targetDate  DATE (optionnel)
├── progress    INTEGER (0-100)
├── userId      UUID (clé étrangère → users)
├── createdAt   DATETIME
└── updatedAt   DATETIME
mood_entries
├── id          UUID (clé primaire)
├── score       INTEGER (1-10)
├── note        STRING (optionnel)
├── recordedAt  DATETIME
└── userId      UUID (clé étrangère → users)
focus_sessions
├── id              UUID (clé primaire)
├── durationMinutes INTEGER
├── completedAt     DATETIME
├── userId          UUID (clé étrangère → users)
└── taskId          UUID (clé étrangère → tasks, optionnel)

---

## Stack technique complète

| Couche | Technologie | Version | Rôle |
|--------|-------------|---------|------|
| Frontend | Next.js | 14 | Interface utilisateur |
| Backend | Node.js | 20 | Serveur API |
| Framework | Express.js | 5 | Routing HTTP |
| ORM | Prisma | 5 | Accès base de données |
| Base de données | PostgreSQL | 16 | Stockage des données |
| Authentification | JWT | - | Sécurisation des routes |
| Chiffrement | bcryptjs | - | Hash des mots de passe |
| Validation | express-validator | - | Validation des entrées |
| Tests | Jest + Supertest | - | Tests automatisés |
| Conteneurisation | Docker | - | Isolation des services |
| CI/CD | GitHub Actions | - | Pipeline automatisé |
| Déploiement Backend | Render | - | Hébergement API |
| Déploiement Frontend | Vercel | - | Hébergement interface |

---

## Sécurité

- Authentification JWT avec expiration 7 jours
- Mots de passe hashés avec bcrypt 10 rounds
- Headers de sécurité avec Helmet
- CORS configuré pour le domaine frontend uniquement
- Validation de toutes les entrées avec express-validator
- Isolation des données par utilisateur
- Variables sensibles dans fichier .env non versionné

---

## Déploiement
GitHub (code source)
│
│ push sur main
▼
GitHub Actions (CI/CD)
│
├── Installation dépendances
├── Génération client Prisma
├── Migration base de données
├── Exécution 51 tests
└── Build image Docker
│
│ si tout est vert
▼
Render (déploiement automatique)
│
├── Backend API : https://life-os-platform.onrender.com
└── Base de données PostgreSQL : Render PostgreSQL

