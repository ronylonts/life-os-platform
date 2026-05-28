# Architecture — Life OS Platform

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────────┐
│                        UTILISATEUR                                   │
│          Navigateur Web (desktop)  ·  App Android (mobile)           │
└─────────────────────────┬───────────────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 15)                             │
│                    Vercel / Capacitor Android                        │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │                    App Router (Next.js)                     │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │     │
│  │  │   Auth   │  │Dashboard │  │  Tasks   │  │Calendar  │  │     │
│  │  │(auth)/   │  │dashboard/│  │tasks/    │  │calendar/ │  │     │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │     │
│  │  │  Goals   │  │   Mood   │  │  Focus   │  │    AI    │  │     │
│  │  │goals/    │  │mood/     │  │focus/     │  │ai/       │  │     │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │     │
│  └───────────────────────────────────────────────────────────┘     │
│                                                                     │
│  ┌─────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │  Contextes  │  │    Composants     │  │  Client API          │  │
│  │  (React)    │  │  UI · Layout ·    │  │  apiRequest()        │  │
│  │  Auth ·     │  │  Auth · Tasks ·   │  │  Services typés      │  │
│  │  Theme ·    │  │  Mood · Calendar  │  │  Gestion d'erreurs   │  │
│  │  Toast      │  │  AI · Focus       │  │  Token JWT           │  │
│  └─────────────┘  └──────────────────┘  └──────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │  Tailwind CSS v4 · Thème dark/light · Animations CSS       │     │
│  └───────────────────────────────────────────────────────────┘     │
└─────────────────────────┬───────────────────────────────────────────┘
                          │ REST API (JSON)
                          │ Authorization: Bearer <JWT>
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js 5)                            │
│                    Render · Port 5000                                │
│                                                                     │
│  ┌─────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │   Routes    │  │   Middlewares     │  │    Controllers        │  │
│  │  /api/auth  │  │  JWT (auth)       │  │  auth · tasks ·      │  │
│  │  /api/tasks │  │  Validators       │  │  events · goals ·    │  │
│  │  /api/events│  │  Helmet (sécu)    │  │  mood · focus · ai   │  │
│  │  /api/goals │  │  CORS             │  │                       │  │
│  │  /api/mood  │  │  Morgan (logs)    │  └──────────────────────┘  │
│  │  /api/focus │  └──────────────────┘                             │
│  │  /api/ai    │                                                   │
│  └─────────────┘                                                   │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │                    Services (logique métier)                │     │
│  │  authService · tasksService · eventsService · goalsService │     │
│  │  moodService · focusService · aiService (règles-métier)    │     │
│  └─────────────────────────┬─────────────────────────────────┘     │
└────────────────────────────┼───────────────────────────────────────┘
                             │ Prisma ORM
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BASE DE DONNÉES                                   │
│                    PostgreSQL 16 (Render)                            │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  users   │  │  tasks   │  │  events  │  │  goals            │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘  │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐       │
│  │ mood_entries │  │ focus_sessions│  │ ai_suggestions   │       │
│  └──────────────┘  └───────────────┘  └──────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
```

## Flux d'une requête typique

```
1. Utilisateur clique sur "Créer une tâche"
2. Frontend → POST /api/tasks (Authorization: Bearer <token>)
3. Middleware JWT vérifie le token → req.user = { userId }
4. Middleware Validator vérifie le titre
5. Controller Tasks appelle TasksService
6. TasksService appelle Prisma → INSERT dans PostgreSQL
7. Réponse remonte au frontend
8. Frontend met à jour l'affichage
```

## Flux d'authentification

```
INSCRIPTION :
  RegisterForm → authApi.register(payload)
  → POST /api/auth/register
  → Backend : hash bcrypt + INSERT user + JWT
  → Frontend : token → localStorage, user → sessionStorage
  → Redirection /dashboard

CONNEXION :
  LoginForm → authApi.login(payload)
  → POST /api/auth/login
  → Backend : vérifie bcrypt + JWT
  → Frontend : token → localStorage, user → sessionStorage
  → Redirection /dashboard

PERSISTANCE :
  AuthProvider mount → getToken() depuis localStorage
  → GET /api/auth/me (validation token)
  → Succès : user mis à jour
  → Échec : fallback sessionStorage → JWT decode → null
```

## Build APK Android

```
Hôte                              Docker / CI
─────                             ───────────
next build (export statique)
  → frontend/out/
                                    npm install (si out/ absent)
                                    next build (si out/ absent)
                                    npx cap add android
                                    npx cap sync android
                                    gradlew assembleDebug
                                    → app-debug.apk
```

## Stack technique

| Couche | Technologie | Version | Rôle |
|---|---|---|---|
| Frontend | Next.js | 15 | Framework React (App Router) |
| Frontend mobile | Capacitor | 8 | Wrapper Android natif |
| UI | React | 19 | Bibliothèque d'interface |
| Style | Tailwind CSS | 4 | CSS utilitaire |
| Backend | Express.js | 5 | Serveur HTTP |
| Base de données | PostgreSQL | 16 | Stockage |
| ORM | Prisma | 5 | Accès BDD |
| Auth | JWT + bcrypt | — | Sessions sécurisées |
| Validation | express-validator | 7 | Validation entrées |
| Tests backend | Jest + Supertest | 30 / 7 | Tests automatisés |
| Conteneurisation | Docker | — | Build + déploiement |
| CI/CD | GitHub Actions | — | Pipeline automatisé |
| Hébergement API | Render | — | Backend production |
| Hébergement web | Vercel | — | Frontend production |

## Sécurité

- **JWT** : tokens avec expiration configurable (7 jours par défaut)
- **bcrypt** : 10 rounds de hash pour les mots de passe
- **Helmet** : en-têtes de sécurité HTTP
- **CORS** : origines autorisées limitées (localhost, Vercel, Capacitor)
- **Validation** : toutes les entrées validées avec express-validator
- **Isolation** : chaque utilisateur ne voit que ses données
- **Variables sensibles** : .env jamais versionné

## Évolutions possibles

- Synchronisation temps réel (WebSockets)
- Notifications push (Firebase Cloud Messaging)
- Mode hors-ligne (Service Worker + IndexedDB)
- Thèmes personnalisables
- Collaboration multi-utilisateur
- Véritable IA (intégration OpenAI / Anthropic)
