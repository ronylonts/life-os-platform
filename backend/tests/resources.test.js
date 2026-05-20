const request = require('supertest');
const app = require('../src/server');
const prisma = require('../src/models/prismaClient');

describe('Goals, Mood, and Focus Endpoints', () => {
  let token;
  let userId;
  let goalId;

  beforeAll(async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'resources@lifeos.com',
        password: 'password123',
        name: 'Resource Tester',
      });

    token = registerRes.body.data.token;
    userId = registerRes.body.data.user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  describe('Goals', () => {
    describe('POST /api/goals', () => {
      it('should create a goal successfully', async () => {
        const response = await request(app)
          .post('/api/goals')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'Learn TypeScript',
            description: 'Master TypeScript for better development',
            targetDate: '2024-12-31',
          });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe('Learn TypeScript');
        expect(response.body.data.progress).toBe(0);

        goalId = response.body.data.id;
      });

      it('should fail without title', async () => {
        const response = await request(app)
          .post('/api/goals')
          .set('Authorization', `Bearer ${token}`)
          .send({
            description: 'No title goal',
          });

        expect(response.status).toBe(422);
        expect(response.body.success).toBe(false);
      });
    });

    describe('GET /api/goals', () => {
      it('should list all goals for user', async () => {
        const response = await request(app)
          .get('/api/goals')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });

    describe('PATCH /api/goals/:id/progress', () => {
      it('should update goal progress successfully', async () => {
        const response = await request(app)
          .patch(`/api/goals/${goalId}/progress`)
          .set('Authorization', `Bearer ${token}`)
          .send({ progress: 50 });

        expect(response.status).toBe(200);
        expect(response.body.data.progress).toBe(50);
      });

      it('should fail with invalid progress value', async () => {
        const response = await request(app)
          .patch(`/api/goals/${goalId}/progress`)
          .set('Authorization', `Bearer ${token}`)
          .send({ progress: 150 });

        expect(response.status).toBe(422);
        expect(response.body.success).toBe(false);
      });

      it('should fail with progress < 0', async () => {
        const response = await request(app)
          .patch(`/api/goals/${goalId}/progress`)
          .set('Authorization', `Bearer ${token}`)
          .send({ progress: -10 });

        expect(response.status).toBe(422);
        expect(response.body.success).toBe(false);
      });
    });
  });

  describe('Mood', () => {
    describe('POST /api/mood', () => {
      it('should record mood successfully', async () => {
        const response = await request(app)
          .post('/api/mood')
          .set('Authorization', `Bearer ${token}`)
          .send({
            score: 8,
            note: 'Great day!',
          });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.score).toBe(8);
        expect(response.body.data.note).toBe('Great day!');
      });

      it('should fail with invalid score', async () => {
        const response = await request(app)
          .post('/api/mood')
          .set('Authorization', `Bearer ${token}`)
          .send({ score: 15 });

        expect(response.status).toBe(422);
        expect(response.body.success).toBe(false);
      });

      it('should fail with score < 1', async () => {
        const response = await request(app)
          .post('/api/mood')
          .set('Authorization', `Bearer ${token}`)
          .send({ score: 0 });

        expect(response.status).toBe(422);
        expect(response.body.success).toBe(false);
      });

      it('should fail without score', async () => {
        const response = await request(app)
          .post('/api/mood')
          .set('Authorization', `Bearer ${token}`)
          .send({
            note: 'No score provided',
          });

        expect(response.status).toBe(422);
        expect(response.body.success).toBe(false);
      });
    });

    describe('GET /api/mood', () => {
      it('should list mood history for user', async () => {
        const response = await request(app)
          .get('/api/mood')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });
  });

  describe('Focus Sessions', () => {
    describe('POST /api/focus', () => {
      it('should record focus session successfully', async () => {
        const response = await request(app)
          .post('/api/focus')
          .set('Authorization', `Bearer ${token}`)
          .send({
            durationMinutes: 25,
          });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.durationMinutes).toBe(25);
      });

      it('should fail with invalid duration', async () => {
        const response = await request(app)
          .post('/api/focus')
          .set('Authorization', `Bearer ${token}`)
          .send({
            durationMinutes: 0,
          });

        expect(response.status).toBe(422);
        expect(response.body.success).toBe(false);
      });

      it('should fail without duration', async () => {
        const response = await request(app)
          .post('/api/focus')
          .set('Authorization', `Bearer ${token}`)
          .send({});

        expect(response.status).toBe(422);
        expect(response.body.success).toBe(false);
      });

      it('should accept optional taskId', async () => {
        // First create a task
        const taskRes = await request(app)
          .post('/api/tasks')
          .set('Authorization', `Bearer ${token}`)
          .send({ title: 'Focus task' });

        const response = await request(app)
          .post('/api/focus')
          .set('Authorization', `Bearer ${token}`)
          .send({
            durationMinutes: 30,
            taskId: taskRes.body.data.id,
          });

        expect(response.status).toBe(201);
        expect(response.body.data.taskId).toBe(taskRes.body.data.id);
      });
    });

    describe('GET /api/focus', () => {
      it('should list focus sessions for user', async () => {
        const response = await request(app)
          .get('/api/focus')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });
  });
});
