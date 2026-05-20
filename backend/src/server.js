const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000



// Helmet ajoute des headers de sécurité automatiquement
app.use(helmet())

// Cors autorise le frontend à communiquer avec ce backend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Permet à Express de lire le JSON envoyé par le frontend
app.use(express.json())

// Morgan affiche chaque requête dans le terminal
app.use(morgan('dev'))

// -----------------------------------
// ROUTE DE TEST
// -----------------------------------

// Cette route sert uniquement à vérifier que le serveur fonctionne
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Life OS API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  })
})

// -----------------------------------
// GESTION DES ERREURS
// -----------------------------------

// Cette fonction intercepte toutes les erreurs de l'application
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Erreur interne du serveur',
    code: err.code || 'INTERNAL_ERROR'
  })
})

// -----------------------------------
// DÉMARRAGE DU SERVEUR
// -----------------------------------

app.listen(PORT, () => {
  console.log(`✓ Serveur démarré sur le port ${PORT}`)
  console.log(`✓ Environnement : ${process.env.NODE_ENV}`)
  console.log(`✓ URL : http://localhost:${PORT}/api/health`)
})

module.exports = app