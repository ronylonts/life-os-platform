const prisma = require('../models/prismaClient');
const { NotFoundError } = require('../utils/errors');

const goalsService = {
  async getGoals(userId) {
    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return goals;
  },

  async createGoal(userId, data) {
    const goal = await prisma.goal.create({
      data: {
        title: data.title,
        description: data.description,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
        userId,
      },
    });

    return goal;
  },

  async updateProgress(userId, goalId, progress) {
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new NotFoundError('Objectif introuvable');
    }

    const updated = await prisma.goal.update({
      where: { id: goalId },
      data: { progress },
    });

    return updated;
  },

  async deleteGoal(userId, goalId) {
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new NotFoundError('Objectif introuvable');
    }

    await prisma.goal.delete({ where: { id: goalId } });

    return { success: true };
  },
};

module.exports = goalsService;
