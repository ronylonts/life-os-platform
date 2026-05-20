# User Stories — Life OS Platform

## Informations générales

- Projet : Life OS Platform
- Utilisateur unique : toute personne souhaitant optimiser sa vie personnelle
- Date : Mai 2026
- Auteurs : Ronylonts (Backend) — arthur (Frontend)

---

## MODULE 1 — AUTHENTIFICATION

### US-01 — Créer un compte

**En tant que** visiteur
**Je veux** créer un compte sur Life OS
**Afin d** accéder à mon tableau de bord personnel

#### Critères d'acceptation

- L email doit être au format valide exemple rony@lifeos.com
- Le mot de passe doit contenir minimum 8 caractères
- Le nom est obligatoire
- Si l email existe déjà un message d erreur s affiche
- Si les données sont invalides une erreur 422 est renvoyée
- Après inscription l utilisateur reçoit un token JWT
- Le mot de passe est stocké chiffré avec bcrypt en base de données
- L utilisateur est redirigé vers son tableau de bord après inscription

---

### US-02 — Se connecter

**En tant que** utilisateur inscrit
**Je veux** me connecter avec mon email et mon mot de passe
**Afin d** accéder à mes données personnelles

#### Critères d'acceptation

- L email et le mot de passe sont obligatoires
- Si les identifiants sont incorrects une erreur 401 est renvoyée
- Si la connexion réussit un token JWT valide 7 jours est retourné
- Le token est stocké côté frontend pour les prochaines requêtes
- L utilisateur est redirigé vers son tableau de bord après connexion

---

### US-03 — Consulter son profil

**En tant que** utilisateur connecté
**Je veux** consulter mon profil
**Afin de** vérifier mes informations personnelles

#### Critères d'acceptation

- L utilisateur doit être connecté avec un token valide
- Le profil affiche le nom et l email
- Le mot de passe n est jamais retourné dans la réponse
- Si le token est invalide une erreur 401 est renvoyée

---

## MODULE 2 — GESTION DES TACHES

### US-04 — Créer une tâche

**En tant que** utilisateur connecté
**Je veux** créer une tâche avec un titre et une priorité
**Afin d** organiser mon travail par ordre d importance

#### Critères d'acceptation

- Le titre est obligatoire
- La priorité peut être low medium ou high — medium par défaut
- La date d échéance est optionnelle
- La tâche est créée avec le statut todo par défaut
- La tâche est associée uniquement à l utilisateur connecté
- Une erreur 422 est renvoyée si le titre est manquant

---

### US-05 — Filtrer ses tâches

**En tant que** utilisateur connecté
**Je veux** filtrer mes tâches par statut ou par priorité
**Afin de** me concentrer sur ce qui est urgent

#### Critères d'acceptation

- L utilisateur peut filtrer par statut — todo in_progress done
- L utilisateur peut filtrer par priorité — low medium high
- Sans filtre toutes les tâches de l utilisateur sont retournées
- Les tâches des autres utilisateurs ne sont jamais visibles
- La réponse est une liste JSON des tâches correspondantes

---

### US-06 — Modifier le statut d une tâche

**En tant que** utilisateur connecté
**Je veux** modifier le statut d une tâche
**Afin de** suivre ma progression

#### Critères d'acceptation

- L utilisateur peut changer le statut vers todo in_progress ou done
- Seul le propriétaire de la tâche peut la modifier
- Si la tâche n existe pas une erreur 404 est renvoyée
- La date de modification est mise à jour automatiquement

---

## MODULE 3 — AGENDA

### US-07 — Créer un événement

**En tant que** utilisateur connecté
**Je veux** créer un événement dans mon agenda
**Afin de** planifier mes activités

#### Critères d'acceptation

- Le titre la date de début et la date de fin sont obligatoires
- La date de fin doit être après la date de début
- L événement est associé uniquement à l utilisateur connecté
- Une erreur 422 est renvoyée si les dates sont manquantes
- L événement apparaît dans la liste après création

---

## MODULE 4 — OBJECTIFS DE VIE

### US-08 — Créer un objectif de vie

**En tant que** utilisateur connecté
**Je veux** créer un objectif de vie avec une date cible
**Afin de** suivre mes ambitions personnelles

#### Critères d'acceptation

- Le titre est obligatoire
- La description et la date cible sont optionnelles
- La progression est initialisée à 0 par défaut
- L objectif est associé uniquement à l utilisateur connecté

---

### US-09 — Mettre à jour la progression d un objectif

**En tant que** utilisateur connecté
**Je veux** mettre à jour la progression de mon objectif
**Afin de** visualiser mon avancement

#### Critères d'acceptation

- La progression doit être un entier entre 0 et 100
- Si la valeur est hors de cette plage une erreur 422 est renvoyée
- Seul le propriétaire de l objectif peut le modifier
- Si l objectif n existe pas une erreur 404 est renvoyée

---

## MODULE 5 — SANTE MENTALE

### US-10 — Enregistrer son humeur du jour

**En tant que** utilisateur connecté
**Je veux** enregistrer mon humeur avec un score de 1 à 10
**Afin de** suivre mon bien-être mental dans le temps

#### Critères d'acceptation

- Le score est obligatoire et doit être entre 1 et 10
- La note est optionnelle
- La date et l heure sont enregistrées automatiquement
- L utilisateur doit être connecté pour enregistrer une humeur
- Si le score est hors de la plage une erreur 422 est renvoyée

---

## MODULE 6 — PRODUCTIVITE

### US-11 — Enregistrer une session focus

**En tant que** utilisateur connecté
**Je veux** enregistrer une session de travail concentré
**Afin de** suivre ma productivité quotidienne

#### Critères d'acceptation

- La durée en minutes est obligatoire
- La tâche associée est optionnelle
- La date de fin est enregistrée automatiquement
- L utilisateur doit être connecté
- Une erreur 422 est renvoyée si la durée est manquante

---

## MODULE 7 — INTELLIGENCE ARTIFICIELLE

### US-12 — Recevoir des suggestions IA

**En tant que** utilisateur connecté
**Je veux** recevoir des suggestions personnalisées générées par l IA
**Afin d** améliorer mon organisation et mon bien-être

#### Critères d'acceptation

- L utilisateur doit être connecté
- Les suggestions sont basées sur ses tâches humeurs et objectifs
- Les suggestions sont catégorisées — task schedule mood goal
- Une erreur 401 est renvoyée si l utilisateur n est pas connecté

---

## SCENARIOS BDD EN GHERKIN

### Scénario 1 — Inscription réussie

```gherkin
Feature: Authentification

  Scenario: Inscription réussie
    Given un visiteur n a pas encore de compte sur Life OS
    When il saisit email "rony@lifeos.com" mot de passe "password123" et nom "Rony"
    Then son compte est créé avec succès
    And il reçoit un token JWT valide
    And il est redirigé vers son tableau de bord
```

### Scénario 2 — Inscription avec email déjà utilisé

```gherkin
Feature: Authentification

  Scenario: Inscription échouée avec email existant
    Given un utilisateur avec email "rony@lifeos.com" existe déjà dans la base
    When un visiteur essaie de s inscrire avec le même email "rony@lifeos.com"
    Then il reçoit une erreur 409
    And le message "Email déjà utilisé" s affiche
    And aucun nouveau compte n est créé
```

### Scénario 3 — Création d une tâche

```gherkin
Feature: Gestion des tâches

  Scenario: Création d une tâche avec priorité haute
    Given un utilisateur est connecté sur Life OS avec un token valide
    When il crée une tâche avec titre "Finir le rapport" et priorité "high"
    Then la tâche est enregistrée dans la base de données
    And elle apparaît dans sa liste avec le statut "todo"
    And la priorité est bien "high"
```

### Scénario 4 — Enregistrement d une humeur

```gherkin
Feature: Suivi de l humeur

  Scenario: Enregistrement d une humeur valide
    Given un utilisateur est connecté sur Life OS
    When il enregistre un score d humeur de 8 avec la note "Très bonne journée"
    Then l entrée est sauvegardée avec la date et l heure actuelles
    And elle apparaît dans son historique d humeur

  Scenario: Score d humeur invalide
    Given un utilisateur est connecté sur Life OS
    When il essaie d enregistrer un score de 15
    Then il reçoit une erreur 422
    And le message indique que le score doit être entre 1 et 10
```

### Scénario 5 — Mise à jour de la progression d un objectif

```gherkin
Feature: Objectifs de vie

  Scenario: Mise à jour de la progression réussie
    Given un utilisateur connecté a un objectif "Apprendre Node.js" avec progression 0
    When il met à jour la progression à 75
    Then la progression est mise à jour à 75 en base de données
    And la nouvelle valeur est retournée dans la réponse

  Scenario: Progression invalide
    Given un utilisateur connecté a un objectif dans sa liste
    When il essaie de mettre la progression à 150
    Then il reçoit une erreur 422
    And le message indique que la valeur doit être entre 0 et 100
```

### Scénario 6 — Connexion échouée

```gherkin
Feature: Authentification

  Scenario: Connexion avec mauvais mot de passe
    Given un utilisateur avec email "rony@lifeos.com" existe dans la base
    When il saisit le mot de passe incorrect "mauvaismdp"
    Then il reçoit une erreur 401
    And le message "Identifiants invalides" s affiche
    And aucun token n est généré
```

### Scénario 7 — Accès sans token

```gherkin
Feature: Sécurité

  Scenario: Accès à une route protégée sans token
    Given un visiteur n est pas connecté
    When il essaie d accéder à la liste de ses tâches sans token
    Then il reçoit une erreur 401
    And le message "Token manquant ou invalide" s affiche
```