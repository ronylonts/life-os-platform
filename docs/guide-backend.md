# Guide Backend

## Architecture

API REST construite avec **Express.js 5** et **Prisma ORM** sur **PostgreSQL 16**. Architecture en couches : Routes → Middlewares → Controllers → Services → Prisma.

```
backend/
├── src/
│   ├── server.js              # Point d'entrée
│   ├── routes/                # Définition des routes
│   │   ├── auth.routes.js
│   │   ├── tasks.routes.js
│   │   ├── events.routes.js
│   │   ├── goals.routes.js
│   │   ├── mood.routes.js
│   │   ├── focus.routes.js
│   │   └── ai.routes.js
│   ├── controllers/           # Gestion des requêtes/réponses
│   │   ├── auth.controller.js
│   │   ├── tasks.controller.js
│   │   ├── events.controller.js
│   │   ├── goals.controller.js
│   │   ├── mood.controller.js
│   │   ├── focus.controller.js
│   │   └── ai.controller.js
│   ├── services/              # Logique métier
│   │   ├── auth.service.js
│   │   ├── tasks.service.js
│   │   ├── events.service.js
│   │   ├── goals.service.js
│   │   ├── mood.service.js
│   │   ├── focus.service.js
│   │   └── ai.service.js
│   ├── middlewares/
│   │   ├── auth.middleware.js  # Vérification JWT
│   │   └── validators.js      # Validation des entrées
│   ├── models/
│   │   └── prisma.js          # Client Prisma singleton
│   └── utils/
│       ├── jwt.js             # Génération/vérification tokens
│       ├── password.js        # Hash bcrypt
│       ├── errors.js          # Classes d'erreur personnalisées
│       └── response.js        # Formatage des réponses
├── prisma/
│   └── schema.prisma          # Schéma de la base de données
├── tests/                     # Tests Jest
└── package.json
```

## Middleware d'authentification

Vérifie le token JWT sur les routes protégées :

```javascript
// Header requis
Authorization: Bearer <token>

// Succès → req.user = { userId }
// Échec → 401 { success: false, message, code: 'UNAUTHORIZED' }
```

## Services métier

### AuthService

| Méthode | Description |
|---|---|
| `register(email, password, name)` | Vérifie unicité → hash password → crée user → retourne JWT + user |
| `login(email, password)` | Trouve user → vérifie password → retourne JWT + user |
| `getProfile(userId)` | Trouve user par ID → retourne profil (sans password) |

### TasksService

CRUD complet avec isolation par utilisateur (toutes les requêtes filtrent par `userId`).

### EventsService

CRUD complet avec filtres optionnels par période (`from`, `to`).

### GoalsService

CRUD avec mise à jour de progression (`updateProgress` valide 0-100).

### MoodService

Enregistrement et historique des entrées d'humeur.

### FocusService

Enregistrement des sessions de travail.

### AiService

Moteur de suggestions **règles-métier** (pas d'IA externe). Analyser :

| Métrique | Condition | Suggestion |
|---|---|---|
| Tâches en attente | > 0 | Priorité haute, nombre total |
| Humeur moyenne | < 5 | Suggestion bien-être |
| Humeur moyenne | ≥ 7 | Encouragement |
| Minutes focus | < 60 | Suggestion Pomodoro |
| Minutes focus | ≥ 60 | Félicitations |
| Objectifs | < 100% | Action ciblée |
| Aucun objectif | — | Invitation à créer |

## Modèle de données

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks      Task[]
  events     Event[]
  goals      Goal[]
  moodEntries MoodEntry[]
  focusSessions FocusSession[]
  aiSuggestions AiSuggestion[]
}

model Task {
  id          String    @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(todo)
  priority    Priority   @default(medium)
  dueDate     DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  userId      String
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Event {
  id          String   @id @default(uuid())
  title       String
  description String?
  startAt     DateTime
  endAt       DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Goal {
  id          String   @id @default(uuid())
  title       String
  description String?
  targetDate  DateTime?
  progress    Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model MoodEntry {
  id          String   @id @default(uuid())
  score       Int
  note        String?
  recordedAt  DateTime @default(now())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model FocusSession {
  id              String   @id @default(uuid())
  durationMinutes Int
  completedAt     DateTime @default(now())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  taskId          String?
  task            Task?    @relation(fields: [taskId], references: [id], onDelete: SetNull)
}

model AiSuggestion {
  id        String   @id @default(uuid())
  type      AiSuggestionType
  content   String
  createdAt DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum TaskStatus { todo in_progress done }
enum Priority { low medium high }
enum AiSuggestionType { task schedule mood goal }
```

## Gestion des erreurs

| Classe | Code HTTP | Usage |
|---|---|---|
| `ValidationError` | 422 | Données invalides |
| `AuthenticationError` | 401 | Token manquant/invalide |
| `AuthorizationError` | 403 | Accès interdit |
| `NotFoundError` | 404 | Ressource inexistante |
| `ConflictError` | 409 | Conflit (email déjà utilisé) |
| `InternalServerError` | 500 | Erreur interne |

## Réponse API

Toutes les réponses suivent le format :

```json
// Succès
{ "success": true, "data": { ... } }

// Erreur
{ "success": false, "message": "...", "code": "ERROR_CODE" }
```

## Tests

```bash
# Exécuter tous les tests
npm test

# Avec couverture
npm run test:coverage
```

Suites de tests : auth, tasks, events, goals (resources), AI, et tests e2e.
