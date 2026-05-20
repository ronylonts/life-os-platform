const prisma = require('../models/prismaClient');

const moodService = {
  async getMoodHistory(userId) {
    const entries = await prisma.moodEntry.findMany({
      where: { userId },
      orderBy: { recordedAt: 'desc' },
    });

    return entries;
  },

  async recordMood(userId, data) {
    const entry = await prisma.moodEntry.create({
      data: {
        score: data.score,
        note: data.note,
        userId,
      },
    });

    return entry;
  },
};

module.exports = moodService;
