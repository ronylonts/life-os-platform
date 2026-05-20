const prisma = require('../models/prismaClient');
const { NotFoundError } = require('../utils/errors');

const tasksService = {
  async getTasks(userId, filters = {}) {
    const where = { userId };

    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.priority) {
      where.priority = filters.priority;
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return tasks;
  },

  async createTask(userId, data) {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || 'medium',
        dueDate: data.dueDate,
        userId,
      },
    });

    return task;
  },

  async updateTask(userId, taskId, data) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new NotFoundError('Tâche introuvable');
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: data.title !== undefined ? data.title : task.title,
        description: data.description !== undefined ? data.description : task.description,
        status: data.status !== undefined ? data.status : task.status,
        priority: data.priority !== undefined ? data.priority : task.priority,
        dueDate: data.dueDate !== undefined ? data.dueDate : task.dueDate,
      },
    });

    return updated;
  },

  async deleteTask(userId, taskId) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new NotFoundError('Tâche introuvable');
    }

    await prisma.task.delete({ where: { id: taskId } });

    return { success: true };
  },
};

module.exports = tasksService;
