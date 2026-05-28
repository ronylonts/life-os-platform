# Référence API

Base URL : `http://localhost:5000/api` (développement) ou `https://life-os-platform.onrender.com/api` (production)

Authentification : `Authorization: Bearer <token>`

## Santé

### `GET /api/health`

Vérification que le serveur est opérationnel.

**Réponse :**

```json
{
  "success": true,
  "data": {
    "status": "OK",
    "environment": "development",
    "timestamp": "2026-05-28T10:00:00.000Z"
  }
}
```

## Authentification

### `POST /api/auth/register`

Créer un compte.

**Corps :**

| Champ | Type | Requis | Contrainte |
|---|---|---|---|
| `email` | string | Oui | Format email valide |
| `password` | string | Oui | Minimum 8 caractères |
| `name` | string | Oui | Non vide |

**Réponse (201) :**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": "uuid", "email": "user@example.com", "name": "User", "createdAt": "..." }
  }
}
```

**Erreurs :** 409 (email déjà utilisé), 422 (validation)

---

### `POST /api/auth/login`

Connecter un utilisateur.

**Corps :**

| Champ | Type | Requis |
|---|---|---|
| `email` | string | Oui |
| `password` | string | Oui |

**Réponse (200) :** Identique à `register`

**Erreurs :** 401 (identifiants invalides), 422 (champs manquants)

---

### `GET /api/auth/me`

Récupérer le profil de l'utilisateur connecté.

**Headers :** `Authorization: Bearer <token>`

**Réponse (200) :**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

**Erreurs :** 401 (token invalide)

## Tâches

### `GET /api/tasks`

Lister les tâches.

**Headers :** `Authorization: Bearer <token>`

**Paramètres optionnels :**

| Paramètre | Type | Valeurs |
|---|---|---|
| `status` | string | `todo`, `in_progress`, `done` |
| `priority` | string | `low`, `medium`, `high` |

**Réponse (200) :**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Finir le rapport",
      "description": null,
      "status": "todo",
      "priority": "high",
      "dueDate": null,
      "userId": "uuid",
      "createdAt": "2026-05-28T10:00:00.000Z",
      "updatedAt": "2026-05-28T10:00:00.000Z"
    }
  ]
}
```

---

### `POST /api/tasks`

Créer une tâche.

**Corps :**

| Champ | Type | Requis | Défaut |
|---|---|---|---|
| `title` | string | Oui | — |
| `description` | string | Non | `null` |
| `priority` | enum | Non | `medium` |
| `dueDate` | ISO8601 | Non | `null` |

**Réponse (201) :** Objet tâche créé

---

### `PUT /api/tasks/:id`

Modifier une tâche.

**Corps :** Tous les champs optionnels

| Champ | Type |
|---|---|
| `title` | string |
| `description` | string |
| `status` | enum (`todo`, `in_progress`, `done`) |
| `priority` | enum |
| `dueDate` | ISO8601 |

**Erreurs :** 404 (tâche inexistante)

---

### `DELETE /api/tasks/:id`

Supprimer une tâche.

**Réponse (200) :**

```json
{ "success": true, "data": { "message": "Tâche supprimée" } }
```

## Événements (Agenda)

### `GET /api/events`

Lister les événements.

**Paramètres optionnels :**

| Paramètre | Type | Description |
|---|---|---|
| `from` | ISO8601 | Date de début (filtre) |
| `to` | ISO8601 | Date de fin (filtre) |

**Réponse (200) :**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Réunion",
      "description": null,
      "startAt": "2026-05-28T14:00:00.000Z",
      "endAt": "2026-05-28T15:00:00.000Z",
      "userId": "uuid",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### `POST /api/events`

Créer un événement.

**Corps :**

| Champ | Type | Requis |
|---|---|---|
| `title` | string | Oui |
| `description` | string | Non |
| `startAt` | ISO8601 | Oui |
| `endAt` | ISO8601 | Oui (doit être > startAt) |

---

### `PUT /api/events/:id`

Modifier un événement.

---

### `DELETE /api/events/:id`

Supprimer un événement.

## Objectifs

### `GET /api/goals`

Lister les objectifs.

---

### `POST /api/goals`

Créer un objectif.

**Corps :**

| Champ | Type | Requis |
|---|---|---|
| `title` | string | Oui |
| `description` | string | Non |
| `targetDate` | date ISO | Non |

`progress` est initialisé à 0 automatiquement.

---

### `PATCH /api/goals/:id/progress`

Mettre à jour la progression.

**Corps :**

| Champ | Type | Contrainte |
|---|---|---|
| `progress` | integer | 0-100 |

---

### `DELETE /api/goals/:id`

Supprimer un objectif.

## Humeur

### `GET /api/mood`

Lister les entrées d'humeur (triées par `recordedAt` descendant).

---

### `POST /api/mood`

Enregistrer une humeur.

**Corps :**

| Champ | Type | Requis | Contrainte |
|---|---|---|---|
| `score` | integer | Oui | 1-10 |
| `note` | string | Non | — |

## Sessions Focus

### `GET /api/focus`

Lister les sessions focus.

---

### `POST /api/focus`

Enregistrer une session.

**Corps :**

| Champ | Type | Requis |
|---|---|---|
| `durationMinutes` | integer | Oui (≥ 1) |
| `taskId` | UUID | Non |

## IA

### `GET /api/ai/suggestions`

Obtenir des suggestions personnalisées.

**Réponse (200) :**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "task",
      "content": "Vous avez 3 tâches en attente. Commencez par la priorité haute.",
      "createdAt": "2026-05-28T10:00:00.000Z"
    }
  ]
}
```

Types disponibles : `task`, `schedule`, `mood`, `goal`

---

### `GET /api/ai/weekly-report`

Générer un rapport hebdomadaire.

**Réponse (200) :**

```json
{
  "success": true,
  "data": {
    "report": "Cette semaine, vous avez complété 5 tâches sur 12...",
    "generatedAt": "2026-05-28T10:00:00.000Z"
  }
}
```

## Codes d'erreur

| Code HTTP | Signification |
|---|---|
| 200 | Succès |
| 201 | Créé |
| 400 | Requête invalide |
| 401 | Non authentifié (token manquant ou invalide) |
| 403 | Accès interdit |
| 404 | Ressource non trouvée |
| 409 | Conflit (email déjà utilisé) |
| 422 | Données de validation invalides |
| 500 | Erreur interne du serveur |

## Format de réponse standard

```json
// Succès
{ "success": true, "data": { ... } }

// Erreur
{ "success": false, "message": "Description de l'erreur", "code": "ERROR_CODE" }

// Liste
{ "success": true, "data": [ ... ] }
```
