#!/bin/bash
# ──────────────────────────────────────────────────────────────────
# build-android.sh
# Script principal — lancé depuis la machine hôte
# Usage : ./scripts/build-android.sh
# ──────────────────────────────────────────────────────────────────
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║  BUILD ANDROID — Docker local             ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# ──────────────────────────────────────────────────────────────────
# Vérification que Docker est en marche
# ──────────────────────────────────────────────────────────────────
if ! docker info > /dev/null 2>&1; then
  echo "  Docker n'est pas démarré. Lancez Docker Desktop puis réessayez."
  exit 1
fi
echo "  Docker est actif"

# ──────────────────────────────────────────────────────────────────
# Charger les variables d'environnement
# ──────────────────────────────────────────────────────────────────
if [ -f ".env" ]; then
  # Corriger les fins de ligne Windows (CRLF -> LF) pour éviter les erreurs bash
  sed -i 's/\r$//' .env 2>/dev/null
  set -a
  source .env
  set +a
  echo "  Variables .env chargées"
fi

# ──────────────────────────────────────────────────────────────────
# Créer les dossiers de sortie
# ──────────────────────────────────────────────────────────────────
mkdir -p generated/builds/apk
mkdir -p generated/source/android

# ──────────────────────────────────────────────────────────────────
# Lancer le build Docker
# ──────────────────────────────────────────────────────────────────
echo ""
echo "  Lancement du build Docker..."
echo ""

docker compose -f docker/docker-compose.yml run --rm --build android-builder

echo ""
echo "  Build terminé ! Votre APK est dans : generated/builds/apk/"
echo ""
