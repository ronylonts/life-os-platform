# Guide Frontend

## Architecture

L'application est construite avec **Next.js 15** (App Router) en **export statique** pour compatibilité avec Capacitor (Android). L'état est géré via React Context. Le style utilise Tailwind CSS v4 avec des variables CSS personnalisées pour le thème dark/light.

```
frontend/
├── src/
│   ├── app/                    # Pages (App Router)
│   │   ├── layout.tsx          # Layout racine
│   │   ├── page.tsx            # Redirection vers /dashboard
│   │   ├── globals.css         # Styles globaux + animations
│   │   ├── (auth)/             # Pages non connectées
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   └── dashboard/          # Pages connectées
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── tasks/page.tsx
│   │       ├── calendar/page.tsx
│   │       ├── goals/page.tsx
│   │       ├── mood/page.tsx
│   │       ├── focus/page.tsx
│   │       └── ai/page.tsx
│   ├── components/
│   │   ├── auth/               # Formulaires + illustration
│   │   ├── calendar/           # Grille calendrier
│   │   ├── layout/             # Sidebar, header, transitions
│   │   ├── mood/               # Tracker + graphique
│   │   ├── tasks/              # Kanban + gestionnaire
│   │   └── ui/                 # Boutons, cartes, inputs, etc.
│   ├── contexts/
│   │   ├── auth-context.tsx    # Authentification
│   │   ├── theme-context.tsx   # Thème dark/light
│   │   └── toast-context.tsx   # Notifications toast
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts       # Client HTTP générique
│   │   │   ├── services.ts     # Services API typés
│   │   │   └── auth-response.ts
│   │   └── auth/
│   │       └── storage.ts     # Token + user localStorage
│   └── types/
│       └── api.ts             # Types TypeScript
├── capacitor.config.ts        # Configuration Capacitor
├── next.config.ts             # Configuration Next.js
├── tailwind.config.ts
└── tsconfig.json
```

## Routing

L'application utilise le **App Router** de Next.js avec deux groupes de routes :

### Groupe `(auth)` — Pages publiques

| Route | Page | Description |
|---|---|---|
| `/login` | `login/page.tsx` | Connexion |
| `/register` | `register/page.tsx` | Inscription |

### Groupe `dashboard` — Pages protégées

| Route | Page | Description |
|---|---|---|
| `/dashboard` | `page.tsx` | Vue d'ensemble |
| `/dashboard/tasks` | `tasks/page.tsx` | Gestion des tâches |
| `/dashboard/calendar` | `calendar/page.tsx` | Agenda |
| `/dashboard/goals` | `goals/page.tsx` | Objectifs |
| `/dashboard/mood` | `mood/page.tsx` | Bien-être |
| `/dashboard/focus` | `focus/page.tsx` | Sessions focus |
| `/dashboard/ai` | `ai/page.tsx` | Suggestions IA |

## Composants

### Layout

| Composant | Rôle |
|---|---|
| `AppBackground` | Fond dégradé avec bulles flottantes animées |
| `DashboardShell` | Barrière d'auth + sidebar responsive + contenu |
| `Sidebar` | Navigation latérale (7 entrées) avec thème et déconnexion |
| `PageHeader` | Titre + description de chaque page |
| `PageTransition` | Animation d'entrée/sortie entre les pages |
| `AppLogo` | Logo SVG animé |

### UI

| Composant | Props | Variantes |
|---|---|---|
| `Button` | `variant`, `loading` | `primary \| secondary \| ghost \| danger` |
| `Card` | `title`, `description`, `className` | Thème dark/light |
| `Input` | `label`, `error`, `type` | Avec validation |
| `Alert` | `variant` | `error \| success \| warning \| info` |
| `LoadingSpinner` | `label` | Plein écran |
| `ViewToggle` | `options`, `active` | Boutons segmentés |
| `ToastContainer` | — | Notifications auto-dissolvantes |

### Fonctionnalités

| Composant | Module | Description |
|---|---|---|
| `LoginForm` | Auth | Email + mot de passe |
| `RegisterForm` | Auth | Nom + email + mot de passe |
| `CalendarGrid` | Calendrier | Grille mensuelle avec événements |
| `MoodTracker` | Bien-être | Curseur 1-10 + historique |
| `MoodChart` | Bien-être | Graphique SVG 7/30 jours |
| `TaskManager` | Tâches | CRUD + filtres + vue liste/Kanban |
| `TaskKanban` | Tâches | Colonnes todo/in_progress/done |

## État global (Contextes)

### AuthContext

Gère l'authentification utilisateur.

```typescript
const { user, loading, login, register, logout } = useAuth();
```

- `login(payload)` : appel API → stockage token → redirection `/dashboard`
- `register(payload)` : appel API → stockage token → redirection `/dashboard`
- `logout()` : nettoyage token → redirection `/login`
- Au montage : validation du token via `GET /auth/me`

### ThemeContext

Gère le thème dark/light.

```typescript
const { theme, toggleTheme, setTheme } = useTheme();
```

- Stockage dans `localStorage` (clé : `life_os_theme`)
- Applique `data-theme` sur `<html>`
- Valeur par défaut : `dark`

### ToastContext

Système de notifications temporaires.

```typescript
const { showToast } = useToast();
showToast("Message", "success"); // success | error | info
```

- Auto-dissolution après 4 secondes
- Position : coin supérieur droit

## Client API

```typescript
// client.ts — Client HTTP générique
apiRequest<T>(path, options): Promise<T>
```

| Option | Type | Défaut | Description |
|---|---|---|---|
| `method` | `string` | `GET` | Méthode HTTP |
| `body` | `object` | — | Corps de la requête |
| `auth` | `boolean` | `false` | Ajoute le token JWT |
| `params` | `object` | — | Paramètres d'URL |

### Services disponibles

```typescript
authApi    : register, login, me
tasksApi   : list, create, update, delete
eventsApi  : list, create
goalsApi   : list, create, updateProgress
moodApi    : list, create
focusApi   : list, create
aiApi      : suggestions, weeklyReport
```

## Responsive design

L'interface s'adapte aux mobiles grâce à :

- **Sidebar** : tiroir latéral overlay avec bouton hamburger sur mobile (`< lg`)
- **Grilles** : collapse en colonne unique sur mobile (`sm:grid-cols-1`)
- **Calendrier** : scroll horizontal sur les petits écrans (`overflow-x-auto`)
- **Formulaires** : passage en colonne sur mobile (`flex-col sm:flex-row`)
- **Padding** : `p-4 pt-16 md:p-6 lg:p-8` sur le contenu principal

## Thème dark/light

Variables CSS définies dans `globals.css` :

```css
:root, [data-theme="dark"]   { --background: #0a0f1a; --foreground: #f1f5f9; ... }
[data-theme="light"]         { --background: #f1f5f9; --foreground: #0f172a; ... }
```

Classes utilitaires : `.theme-text`, `.theme-muted`, `.theme-card`, `.theme-input`, `.theme-sidebar`
