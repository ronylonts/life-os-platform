# Guide de démarrage

## Prérequis

- **Node.js** ≥ 22
- **npm** ≥ 10
- **PostgreSQL** 16 (local ou Render)
- **Docker Desktop** (optionnel, pour le build APK)
- **Git**

## Installation

### 1. Cloner le dépôt

```bash
git clone <url-du-depot>
cd life-os-platform
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Éditer `.env` avec vos valeurs :

| Variable | Description | Valeur par défaut |
|---|---|---|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://user:pass@localhost:5432/life_os` |
| `JWT_SECRET` | Clé secrète pour les tokens JWT | À générer |
| `JWT_EXPIRES_IN` | Durée de validité des tokens | `7d` |
| `PORT` | Port du serveur backend | `5000` |

### 3. Backend

```bash
cd backend
npm install
cp .env.example .env        # Configurer DATABASE_URL
npx prisma migrate dev      # Appliquer les migrations
npm run dev                  # Démarre sur http://localhost:5000
```

### 4. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # Configurer NEXT_PUBLIC_API_URL
npm run dev                  # Démarre sur http://localhost:3000
```

### 5. Avec Docker (tout-en-un)

```bash
docker compose up --build
```

Services :

| Service | Accès |
|---|---|
| Frontend | http://localhost:3001 |
| Backend | http://localhost:5000 |
| PostgreSQL | localhost:5433 |
| pgAdmin | http://localhost:5050 |

## Scripts disponibles

### Backend

| Commande | Description |
|---|---|
| `npm run dev` | Démarrage avec rechargement automatique |
| `npm start` | Démarrage production |
| `npm test` | Exécution des tests Jest |
| `npm run test:coverage` | Tests avec rapport de couverture |
| `npx prisma studio` | Interface d'administration de la base de données |
| `npx prisma migrate dev` | Appliquer les migrations |
| `npx prisma generate` | Régénérer le client Prisma |

### Frontend

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production (export statique) |
| `npm start` | Serveur de prévisualisation du build |
| `npm run lint` | Vérification ESLint |
| `npx tsc --noEmit` | Vérification TypeScript |

### APK Android

```bash
# Via Docker (recommandé)
./scripts/build-android.sh

# Sortie : generated/builds/apk/app-debug.apk

# Installation sur téléphone
adb install generated/builds/apk/app-debug.apk
```
