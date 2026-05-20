const request = require('supertest');
const app = require('../src/server');
const prisma = require('../src/models/prismaClient');

describe('Events Endpoints', () => {
  let token;
  let userId;
  let eventId;

  beforeAll(async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'events@lifeos.com',
        password: 'password123',
        name: 'Event Tester',
      });

    token = registerRes.body.data.token;
    userId = registerRes.body.data.user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  describe('POST /api/events', () => {
    it('should create an event successfully', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Team Meeting',
          description: 'Weekly sync',
          startAt: '2024-12-20T10:00:00Z',
          endAt: '2024-12-20T11:00:00Z',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Team Meeting');
      expect(response.body.data.description).toBe('Weekly sync');

      eventId = response.body.data.id;
    });

    it('should fail without required fields', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Incomplete event',
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid datetime', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Event with bad date',
          startAt: 'not-a-date',
          endAt: '2024-12-20T11:00:00Z',
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/events', () => {
    it('should list all events for user', async () => {
      const response = await request(app)
        .get('/api/events')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter events by date range', async () => {
      const response = await request(app)
        .get('/api/events?from=2024-12-01&to=2024-12-31')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('PUT /api/events/:id', () => {
    it('should update event successfully', async () => {
      const response = await request(app)
        .put(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Meeting',
          startAt: '2024-12-20T14:00:00Z',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Updated Meeting');
    });

    it('should fail with nonexistent event', async () => {
      const response = await request(app)
        .put('/api/events/nonexistent-id')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete event successfully', async () => {
      const createRes = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Event to delete',
          startAt: '2024-12-25T09:00:00Z',
          endAt: '2024-12-25T10:00:00Z',
        });

      const response = await request(app)
        .delete(`/api/events/${createRes.body.data.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
    });
  });
});
