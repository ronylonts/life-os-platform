const prisma = require('../models/prismaClient');

const focusService = {
  async getFocusSessions(userId) {
    const sessions = await prisma.focusSession.findMany({
      where: { userId },
      include: { task: true },
      orderBy: { completedAt: 'desc' },
    });

    return sessions;
  },

  async recordFocusSession(userId, data) {
    const session = await prisma.focusSession.create({
      data: {
        durationMinutes: data.durationMinutes,
        taskId: data.taskId || null,
        userId,
      },
      include: { task: true },
    });

    return session;
  },
};

module.exports = focusService;
