#!/bin/bash
# ──────────────────────────────────────────────────────────────────
# docker-entrypoint.sh
# Script exécuté DANS le conteneur Docker
# ──────────────────────────────────────────────────────────────────
set -e
set -o pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_step() { echo -e "\n${BLUE}  $1${NC}"; }
log_ok()   { echo -e "${GREEN}  $1${NC}"; }
log_warn() { echo -e "${YELLOW}  $1${NC}"; }
log_err()  { echo -e "${RED}  $1${NC}"; exit 1; }

# ──────────────────────────────────────────────────────────────────
# ÉTAPE 1 — Installer les dépendances Node.js
# ──────────────────────────────────────────────────────────────────
log_step "Installation des dépendances Node.js..."
cd /workspace/frontend
# Suppression des anciens node_modules pour éviter les conflits de permissions
rm -rf node_modules 2>/dev/null || true
npm install --prefer-offline 2>/dev/null || npm install
npm install fs-extra
log_ok "Dépendances installées"

# ──────────────────────────────────────────────────────────────────
# ÉTAPE 2 — Build Next.js (export statique)
# ──────────────────────────────────────────────────────────────────
log_step "Build Next.js en mode export statique..."
npm run build
log_ok "Build Next.js terminé — dossier out/ généré"
sync

log_step "Vérification du dossier out/..."
ls -la out/ 2>&1 | head -10
if [ ! -f "out/index.html" ]; then
  log_err "Le fichier out/index.html est manquant"
fi

# ──────────────────────────────────────────────────────────────────
# ÉTAPE 3 — Ajouter la plateforme Android à Capacitor
# ──────────────────────────────────────────────────────────────────
log_step "Ajout de la plateforme Android..."
if [ -d "android" ]; then
  log_warn "Ancien dossier android/ détecté, suppression..."
  rm -rf android
fi
npx cap add android
log_ok "Plateforme Android ajoutée"

# ──────────────────────────────────────────────────────────────────
# ÉTAPE 4 — Synchroniser le build web avec Android
# ──────────────────────────────────────────────────────────────────
log_step "Synchronisation des assets web vers Android..."
npx cap sync android
log_ok "Synchronisation terminée"

# ──────────────────────────────────────────────────────────────────
# ÉTAPE 5 — Compiler l'APK avec Gradle
# ──────────────────────────────────────────────────────────────────
log_step "Compilation de l'APK Android..."
cd /workspace/frontend/android
chmod +x gradlew
./gradlew assembleDebug \
  --no-daemon \
  --stacktrace \
  -Dorg.gradle.jvmargs="-Xmx2g"
log_ok "Compilation terminée"

# ──────────────────────────────────────────────────────────────────
# ÉTAPE 6 — Copier l'APK dans le dossier de sortie
# ──────────────────────────────────────────────────────────────────
log_step "Déplacement de l'APK..."
APK_SOURCE="/workspace/frontend/android/app/build/outputs/apk/debug/app-debug.apk"
APK_DEST="/workspace/generated/builds/apk"
SOURCE_DEST="/workspace/generated/source"

mkdir -p "$APK_DEST"
mkdir -p "$SOURCE_DEST"

cp "$APK_SOURCE" "$APK_DEST/app-debug.apk"
cp -r /workspace/frontend/android "$SOURCE_DEST/"

log_ok "APK disponible dans : generated/builds/apk/app-debug.apk"

# ──────────────────────────────────────────────────────────────────
# Résumé final
# ──────────────────────────────────────────────────────────────────
APK_SIZE=$(du -sh "$APK_DEST/app-debug.apk" | cut -f1)
echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}  BUILD ANDROID TERMINÉ AVEC SUCCÈS${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "  APK    : generated/builds/apk/app-debug.apk"
echo -e "  Taille : $APK_SIZE"
echo -e "  Source : generated/source/android/"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
