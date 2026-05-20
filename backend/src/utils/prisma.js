const { PrismaClient } = require('@prisma/client')

// On crée une seule instance de PrismaClient
// Une seule connexion à la base de données pour toute l'application
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn']
})

module.exports = prisma