# Guide de déploiement

## 1. Build APK Android

### Avec Docker (recommandé)

```bash
./scripts/build-android.sh
```

Étapes exécutées dans le conteneur Docker :

1. **Build Next.js** : export statique dans `frontend/out/`
2. **Capacitor** : `npx cap add android` puis `npx cap sync android`
3. **Gradle** : `./gradlew assembleDebug`
4. **Sortie** : `generated/builds/apk/app-debug.apk`

Le conteneur utilise **Ubuntu 24.04** avec :

| Logiciel | Version |
|---|---|
| Java | OpenJDK 21 |
| Node.js | 22.x |
| Android SDK | platform 34 + 36, build-tools 34 + 35 |

### Optimisation

Si le dossier `frontend/out/` existe déjà (build préalable sur l'hôte), Docker saute les étapes `npm install` et `next build`, réduisant le temps de build à ~5 minutes (contre 20+ minutes).

### Installation sur téléphone

```bash
adb install generated/builds/apk/app-debug.apk
```

## 2. Pipeline CI/CD (GitHub Actions)

### Workflow Android (`.github/workflows/build-android.yml`)

| Déclencheur | Action |
|---|---|
| Push sur `main` ou `develop` | Build + upload APK |
| Pull Request vers `main` | Build + upload APK |
| `workflow_dispatch` | Build manuel |

Étapes :

1. Setup Node.js 22 + Java 21 + Android SDK
2. Cache Gradle
3. `npm ci` + `npm run build`
4. `npx cap add android` + `npx cap sync android`
5. `./gradlew assembleDebug`
6. Upload APK (artifact, 30 jours)

### Workflow CI (`.github/workflows/ci.yml`)

| Déclencheur | Action |
|---|---|
| Push sur `main`/`develop`/`feature/*` | Tests + build |
| PR vers `main`/`develop` | Tests + build |

Étapes :

1. PostgreSQL 16 (service container)
2. `npm ci` + Prisma generate + migrate
3. `npm run test:coverage`
4. Build image Docker backend

## 3. Déploiement production

### Backend (Render)

- **URL** : `https://life-os-platform.onrender.com`
- **Déploiement automatique** depuis GitHub (branche `main`)
- **Base de données** : Render PostgreSQL
- Variable requise : `DATABASE_URL`, `JWT_SECRET`

### Frontend (Vercel)

- Déploiement automatique depuis GitHub
- Variable requise : `NEXT_PUBLIC_API_URL`
- `vercel.json` déjà configuré

### Docker Compose (local)

```bash
docker compose up --build
```

| Service | Image | Port |
|---|---|---|
| `postgres` | postgres:16-alpine | 5433 |
| `backend` | Build local | 5000 |
| `frontend` | Build local | 3001 |
| `pgadmin` | dpage/pgadmin4 | 5050 |

## 4. Configuration Android

### Capacitor (`frontend/capacitor.config.ts`)

```typescript
const config: CapacitorConfig = {
  appId: 'com.lifeos.app',
  appName: 'Life OS',
  webDir: 'out',
  server: { androidScheme: 'https' }
};
```

- `androidScheme: 'https'` nécessaire pour l'authentification (compatible `https://localhost`)

### Permissions Android

Déclarées dans `android/app/src/main/AndroidManifest.xml` (généré par Capacitor) :

- `INTERNET` — Appels API
- `ACCESS_NETWORK_STATE` — Vérification réseau

## 5. Variables d'environnement

### Backend

| Variable | Description | Requis |
|---|---|---|
| `DATABASE_URL` | URL PostgreSQL | Oui |
| `JWT_SECRET` | Clé JWT (min 32 caractères) | Oui |
| `JWT_EXPIRES_IN` | Expiration des tokens | Non (défaut: 7d) |
| `PORT` | Port du serveur | Non (défaut: 5000) |
| `NODE_ENV` | `development` ou `production` | Non |

### Frontend

| Variable | Description | Défaut |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL de l'API backend | `http://localhost:5000/api` |

### Docker APK

| Variable | Description | Défaut |
|---|---|---|
| `APP_NAME` | Nom de l'application | Life OS |
| `APP_ID` | Identifiant Android | com.lifeos.app |
