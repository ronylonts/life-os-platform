const { test, expect, request } = require('@playwright/test')

const BASE_URL = 'https://life-os-platform.onrender.com/api'
const timestamp = Date.now()
const testEmail = `e2e${timestamp}@lifeos.com`
const testPassword = 'password123'
const testName = 'E2E User'

test.describe('Life OS — Tests E2E API', () => {

  let token
  let taskId

  test('01 — Inscription réussie', async () => {
    const context = await request.newContext()
    const response = await context.post(`${BASE_URL}/auth/register`, {
      data: {
        email: testEmail,
        password: testPassword,
        name: testName
      }
    })

    expect(response.status()).toBe(201)
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.data.token).toBeDefined()
    expect(body.data.user.email).toBe(testEmail)
    token = body.data.token
  })

  test('02 — Connexion réussie', async () => {
    const context = await request.newContext()
    const response = await context.post(`${BASE_URL}/auth/login`, {
      data: {
        email: testEmail,
        password: testPassword
      }
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.data.token).toBeDefined()
    token = body.data.token
  })

  test('03 — Connexion échouée avec mauvais mot de passe', async () => {
    const context = await request.newContext()
    const response = await context.post(`${BASE_URL}/auth/login`, {
      data: {
        email: testEmail,
        password: 'mauvaismdp'
      }
    })

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body.success).toBe(false)
  })

  test('04 — Accès route protégée sans token refusé', async () => {
    const context = await request.newContext()
    const response = await context.get(`${BASE_URL}/tasks`)

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body.success).toBe(false)
  })

  test('05 — Créer une tâche après connexion', async () => {
    const context = await request.newContext()
    const response = await context.post(`${BASE_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        title: 'Tâche E2E test',
        priority: 'high'
      }
    })

    expect(response.status()).toBe(201)
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.data.title).toBe('Tâche E2E test')
    taskId = body.data.id
  })

  test('06 — Lister les tâches après création', async () => {
    const context = await request.newContext()
    const response = await context.get(`${BASE_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data)).toBe(true)
  })

  test('07 — Enregistrer une humeur', async () => {
    const context = await request.newContext()
    const response = await context.post(`${BASE_URL}/mood`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        score: 8,
        note: 'Test E2E humeur'
      }
    })

    expect(response.status()).toBe(201)
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.data.score).toBe(8)
  })

  test('08 — Créer un objectif de vie', async () => {
    const context = await request.newContext()
    const response = await context.post(`${BASE_URL}/goals`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        title: 'Objectif E2E',
        description: 'Test E2E objectif'
      }
    })

    expect(response.status()).toBe(201)
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.data.title).toBe('Objectif E2E')
  })

})