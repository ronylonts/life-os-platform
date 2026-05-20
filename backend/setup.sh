#!/bin/bash
# Life OS Backend - Installation & Setup Script

echo "🚀 Life OS Backend Setup"
echo "========================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Checking Prerequisites${NC}"
echo "- Node.js version:"
node --version

echo "- npm version:"
npm --version

echo ""
echo -e "${BLUE}Step 2: Installing Dependencies${NC}"
cd backend
npm install

echo ""
echo -e "${BLUE}Step 3: Setting up Database${NC}"
echo "Applying Prisma migrations..."
npx prisma migrate deploy

echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Run tests to verify:"
echo "   npm test"
echo ""
echo "3. Backend will run at: http://localhost:5000/api"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo "- Start with: START_HERE.md"
echo "- Quick reference: QUICK_REFERENCE.md"
echo "- Full guide: BACKEND_IMPLEMENTATION.md"
echo ""
