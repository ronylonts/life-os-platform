const request = require('supertest');
const app = require('../src/server');
const prisma = require('../src/models/prismaClient');

describe('Tasks Endpoints', () => {
  let token;
  let userId;
  let taskId;

  beforeAll(async () => {
    // Create and login a test user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'tasks@lifeos.com',
        password: 'password123',
        name: 'Task Tester',
      });

    token = registerRes.body.data.token;
    userId = registerRes.body.data.user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  describe('POST /api/tasks', () => {
    it('should create a task successfully', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'My first task',
          description: 'This is a test task',
          priority: 'high',
          dueDate: '2024-12-31T23:59:59Z',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('My first task');
      expect(response.body.data.priority).toBe('high');
      expect(response.body.data.status).toBe('todo');

      taskId = response.body.data.id;
    });

    it('should fail without title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'No title task',
          priority: 'medium',
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid priority', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Invalid priority task',
          priority: 'super-high',
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });

    it('should set default priority to medium', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Default priority task',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.priority).toBe('medium');
    });
  });

  describe('GET /api/tasks', () => {
    it('should list all tasks for user', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/api/tasks?status=todo')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.every((t) => t.status === 'todo')).toBe(true);
    });

    it('should filter tasks by priority', async () => {
      const response = await request(app)
        .get('/api/tasks?priority=high')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.every((t) => t.priority === 'high')).toBe(true);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update task successfully', async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'in_progress',
          priority: 'low',
          title: 'Updated task title',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('in_progress');
      expect(response.body.data.priority).toBe('low');
      expect(response.body.data.title).toBe('Updated task title');
    });

    it('should fail with invalid task id', async () => {
      const response = await request(app)
        .put('/api/tasks/invalid-id')
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'done' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid status', async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'invalid-status' });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete task successfully', async () => {
      // Create a task to delete
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task to delete' });

      const taskToDelete = createRes.body.data.id;

      const response = await request(app)
        .delete(`/api/tasks/${taskToDelete}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
    });

    it('should fail with nonexistent task', async () => {
      const response = await request(app)
        .delete('/api/tasks/nonexistent-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
