# ⚡ Life OS Backend - Quick Reference Card

## 🚀 Start Backend

```bash
cd backend

# Install dependencies (already done)
npm install

# Setup database
npx prisma migrate deploy

# Start development server
npm run dev

# Run tests
npm test

# Production build
npm start
```

---

## 🔗 API Base URL

**Development**: `http://localhost:5000/api`  
**Production**: `https://life-os-api.onrender.com/api`

---

## 🔐 Authentication

### Register
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response 201:
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-..."
    }
  }
}
```

### Login
```bash
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Protected Requests
```bash
GET /tasks
Authorization: Bearer <token>
```

---

## 📡 19 API Endpoints

### Tasks (CRUD + Filters)
```
GET    /tasks              List (filters: ?status=todo&priority=high)
POST   /tasks              Create
PUT    /tasks/:id          Update
DELETE /tasks/:id          Delete
```

### Events (CRUD + Date Filter)
```
GET    /events             List (filters: ?from=2024-01-01&to=2024-12-31)
POST   /events             Create
PUT    /events/:id         Update
DELETE /events/:id         Delete
```

### Goals (CRUD + Progress)
```
GET    /goals              List
POST   /goals              Create
PATCH  /goals/:id/progress Update progress
DELETE /goals/:id          Delete
```

### Mood (Log & History)
```
GET    /mood               Get history
POST   /mood               Log entry
```

### Focus (Record & List)
```
GET    /focus              List sessions
POST   /focus              Record session
```

### AI (Suggestions & Report)
```
GET    /ai/suggestions     Daily suggestions
GET    /ai/weekly-report   Weekly report
```

### Auth (Register, Login, Profile)
```
POST   /auth/register      Register
POST   /auth/login         Login
GET    /auth/me            Profile (protected)
```

---

## 📝 Request/Response Examples

### Create Task
```json
POST /tasks
Authorization: Bearer <token>

Request:
{
  "title": "Complete project",
  "description": "Finish backend API",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59Z"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Complete project",
    "description": "Finish backend API",
    "priority": "high",
    "status": "todo",
    "dueDate": "2024-12-31T23:59:59Z",
    "userId": "uuid",
    "createdAt": "2024-05-20T...",
    "updatedAt": "2024-05-20T..."
  }
}
```

### Get Tasks with Filter
```
GET /tasks?status=todo&priority=high
Response 200: { success: true, data: [...] }
```

### Update Task
```json
PUT /tasks/:id
Authorization: Bearer <token>

Request:
{
  "status": "in_progress",
  "priority": "medium"
}

Response 200: { success: true, data: {...} }
```

### Delete Task
```
DELETE /tasks/:id
Authorization: Bearer <token>

Response 204: No Content
```

---

## ✔️ Validation Rules

### Task
```
title:       Required, string
description: Optional, string
priority:    Enum: [low, medium, high]
status:      Enum: [todo, in_progress, done]
dueDate:     Optional, ISO8601 datetime
```

### Event
```
title:       Required, string
description: Optional, string
startAt:     Required, ISO8601 datetime
endAt:       Required, ISO8601 datetime
```

### Goal
```
title:       Required, string
description: Optional, string
targetDate:  Optional, ISO8601 date
progress:    Optional, 0-100
```

### Mood
```
score:       Required, 1-10
note:        Optional, string
```

### Focus Session
```
durationMinutes: Required, positive integer
taskId:          Optional, UUID
```

---

## 🔴 HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | GET request success |
| 201 | Created | POST success |
| 204 | No Content | DELETE success |
| 400 | Bad Request | Invalid request |
| 401 | Unauthorized | Missing/invalid token |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email |
| 422 | Validation Error | Invalid input |
| 500 | Server Error | Internal error |

---

## 📋 Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": [...]  // Optional, for validation errors
}
```

### Examples
```json
// Validation Error (422)
{
  "success": false,
  "message": "Données invalides",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "value": "invalid@",
      "msg": "Invalid value",
      "param": "email",
      "location": "body"
    }
  ]
}

// Not Found (404)
{
  "success": false,
  "message": "Tâche introuvable",
  "code": "NOT_FOUND"
}

// Conflict (409)
{
  "success": false,
  "message": "Email déjà utilisé",
  "code": "CONFLICT"
}
```

---

## 🔑 Environment Variables

```bash
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/lifeos_db
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=optional
```

---

## 🧪 Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Specific test file
npm test -- auth.test.js

# With coverage
npm test -- --coverage
```

### Test Files
- `auth.test.js` - 7 tests
- `tasks.test.js` - 12 tests
- `events.test.js` - 8 tests
- `resources.test.js` - 18 tests
- `ai.test.js` - 6 tests

**Total: 51+ tests**

---

## 🛡️ Security Headers

Automatically added by Helmet:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security
- Content-Security-Policy

---

## 📊 Database Models

```prisma
User {
  id, email*, password, name, createdAt, updatedAt
  Relations: tasks, events, goals, moodEntries, focusSessions, aiSuggestions
}

Task {
  id, title*, description, status, priority, dueDate, userId, createdAt, updatedAt
}

Event {
  id, title*, description, startAt*, endAt*, userId, createdAt, updatedAt
}

Goal {
  id, title*, description, targetDate, progress, userId, createdAt, updatedAt
}

MoodEntry {
  id, score*, note, recordedAt, userId
}

FocusSession {
  id, durationMinutes*, completedAt, userId, taskId?
}

AiSuggestion {
  id, type*, content*, createdAt, userId
}

* = Required field
```

---

## 🔄 Data Flow

### Registration → Login → Use API
```
1. POST /auth/register
   ↓
2. Receive { token, user }
3. Store token
   ↓
4. POST /auth/login
   ↓
5. Receive { token, user }
   ↓
6. Add Authorization: Bearer token to requests
   ↓
7. GET /tasks (protected)
   ↓
8. Token expires after 7 days
9. User must login again
```

---

## 📚 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| EXECUTIVE_SUMMARY.md | Overview | Managers |
| BACKEND_IMPLEMENTATION.md | Technical guide | Developers |
| VALIDATION_CHECKLIST.md | Verification | QA |
| README_BACKEND.md | Quick start | Frontend devs |
| FILES_REFERENCE.md | Code reference | Architects |
| PROJECT_STRUCTURE.md | Structure | Everyone |
| DOCUMENTATION_INDEX.md | Map | Everyone |

---

## 🎯 Common Tasks

### Verify Backend is Running
```bash
curl http://localhost:5000/api/health

Response:
{
  "status": "OK",
  "message": "Life OS API is running",
  "environment": "development",
  "timestamp": "2024-05-20T..."
}
```

### Register a Test User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Get User Profile
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### Create a Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My task",
    "priority": "high"
  }'
```

---

## 🚀 Deploy to Production

1. **Update .env**
   ```
   NODE_ENV=production
   JWT_SECRET=<random-strong-secret>
   DATABASE_URL=<production-db>
   FRONTEND_URL=<production-frontend>
   ```

2. **Run migrations**
   ```bash
   npx prisma migrate deploy
   ```

3. **Start server**
   ```bash
   npm start
   ```

4. **Verify health**
   ```bash
   curl https://your-domain.com/api/health
   ```

---

## 🐛 Debugging

### Check Logs
```bash
# Server logs appear in terminal when npm run dev
# Look for errors with [ERROR] or [ERR] prefix
```

### Database Issues
```bash
# Verify connection
npx prisma db push

# Open Prisma Studio
npx prisma studio

# Check migrations
npx prisma migrate status
```

### JWT Issues
```bash
# Token invalid → Regenerate with login
# Token expired → Has 7-day expiry, must re-login
# Missing token → Add Authorization header
```

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change PORT in .env |
| Database connection fails | Check DATABASE_URL |
| Auth fails | Verify JWT_SECRET matches |
| Tests fail | Run `npm test` or check individual test |
| CORS error | Check FRONTEND_URL in .env |
| Password hashing fails | Check bcryptjs installed |
| Tokens not working | Verify Authorization header format |

---

## ✅ Pre-Launch Checklist

- [ ] Database migrated (`npx prisma migrate deploy`)
- [ ] Tests passing (`npm test`)
- [ ] Health check working (`GET /api/health`)
- [ ] Registration working (`POST /auth/register`)
- [ ] Login working (`POST /auth/login`)
- [ ] Protected endpoint working with token
- [ ] CORS configured for frontend
- [ ] Environment variables set
- [ ] JWT_SECRET changed (production)
- [ ] NODE_ENV=production (production)

---

**Backend is ready! Start with `npm run dev` 🚀**
