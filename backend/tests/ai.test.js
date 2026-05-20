const request = require('supertest');
const app = require('../src/server');
const prisma = require('../src/models/prismaClient');

describe('AI Endpoints', () => {
  let token;
  let userId;

  beforeAll(async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'ai@lifeos.com',
        password: 'password123',
        name: 'AI Tester',
      });

    token = registerRes.body.data.token;
    userId = registerRes.body.data.user.id;

    // Create some test data for better report
    await Promise.all([
      request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Task 1',
          status: 'done',
        }),
      request(app)
        .post('/api/mood')
        .set('Authorization', `Bearer ${token}`)
        .send({ score: 8 }),
      request(app)
        .post('/api/focus')
        .set('Authorization', `Bearer ${token}`)
        .send({ durationMinutes: 60 }),
    ]);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  describe('GET /api/ai/suggestions', () => {
    it('should get daily suggestions', async () => {
      const response = await request(app)
        .get('/api/ai/suggestions')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should fail without authorization', async () => {
      const response = await request(app).get('/api/ai/suggestions');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/ai/weekly-report', () => {
    it('should get weekly report', async () => {
      const response = await request(app)
        .get('/api/ai/weekly-report')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('period');
      expect(response.body.data).toHaveProperty('generatedAt');
      expect(response.body.data).toHaveProperty('statistics');
      expect(response.body.data).toHaveProperty('summary');
    });

    it('should include statistics in report', async () => {
      const response = await request(app)
        .get('/api/ai/weekly-report')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.statistics).toHaveProperty('tasksCompleted');
      expect(response.body.data.statistics).toHaveProperty('averageMood');
      expect(response.body.data.statistics).toHaveProperty('focusHours');
      expect(response.body.data.statistics).toHaveProperty('topGoals');
    });

    it('should fail without authorization', async () => {
      const response = await request(app).get('/api/ai/weekly-report');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
