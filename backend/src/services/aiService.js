const prisma = require('../models/prismaClient');

const aiService = {
  async getDailySuggestions(userId) {
    const suggestions = await prisma.aiSuggestion.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return suggestions;
  },

  async generateWeeklyReport(userId) {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [tasksCompleted, moodAverage, focusSessions, goals] = await Promise.all([
      prisma.task.count({
        where: {
          userId,
          status: 'done',
          updatedAt: { gte: oneWeekAgo },
        },
      }),
      prisma.moodEntry.aggregate({
        where: {
          userId,
          recordedAt: { gte: oneWeekAgo },
        },
        _avg: { score: true },
      }),
      prisma.focusSession.aggregate({
        where: {
          userId,
          completedAt: { gte: oneWeekAgo },
        },
        _sum: { durationMinutes: true },
      }),
      prisma.goal.findMany({
        where: { userId },
        orderBy: { progress: 'desc' },
        take: 3,
      }),
    ]);

    const moodScore = moodAverage._avg.score || 0;
    const totalFocusMinutes = focusSessions._sum.durationMinutes || 0;
    const focusHours = Math.round(totalFocusMinutes / 60);

    const report = {
      period: 'last_week',
      generatedAt: new Date().toISOString(),
      statistics: {
        tasksCompleted,
        averageMood: Math.round(moodScore * 10) / 10,
        focusHours,
        topGoals: goals.map((g) => ({
          id: g.id,
          title: g.title,
          progress: g.progress,
        })),
      },
      summary: `Vous avez complété ${tasksCompleted} tâche${tasksCompleted > 1 ? 's' : ''} cette semaine et passé ${focusHours}h en sessions de focus. Votre humeur moyenne est ${moodScore.toFixed(1)}/10.`,
    };

    return report;
  },
};

module.exports = aiService;
