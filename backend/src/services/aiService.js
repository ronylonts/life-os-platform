const prisma = require('../models/prismaClient')

const aiService = {

  async getDailySuggestions(userId) {
    await aiService.generateAndSaveSuggestions(userId)

    const suggestions = await prisma.aiSuggestion.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    return suggestions
  },

  async generateAndSaveSuggestions(userId) {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const [pendingTasks, moodAverage, focusSessions, goals] = await Promise.all([
      prisma.task.findMany({
        where: { userId, status: { in: ['todo', 'in_progress'] } },
        orderBy: { priority: 'desc' },
        take: 3,
      }),
      prisma.moodEntry.aggregate({
        where: { userId, recordedAt: { gte: oneWeekAgo } },
        _avg: { score: true },
      }),
      prisma.focusSession.aggregate({
        where: { userId, completedAt: { gte: oneWeekAgo } },
        _sum: { durationMinutes: true },
      }),
      prisma.goal.findMany({
        where: { userId, progress: { lt: 100 } },
        orderBy: { progress: 'asc' },
        take: 2,
      }),
    ])

    const suggestions = []
    const moodScore = moodAverage._avg.score || 0
    const totalFocusMinutes = focusSessions._sum.durationMinutes || 0

    if (pendingTasks.length > 0) {
      const topTask = pendingTasks[0]
      suggestions.push({
        type: 'task',
        content: `Vous avez ${pendingTasks.length} tâche(s) en cours. Commencez par "${topTask.title}" qui est de priorité ${topTask.priority === 'high' ? 'haute' : topTask.priority === 'medium' ? 'moyenne' : 'basse'}.`,
        userId,
      })
    }

    if (moodScore > 0 && moodScore < 5) {
      suggestions.push({
        type: 'mood',
        content: `Votre humeur moyenne est de ${moodScore.toFixed(1)}/10 cette semaine. Pensez à faire une pause, pratiquer une activité relaxante ou parler à quelqu un de confiance.`,
        userId,
      })
    } else if (moodScore >= 7) {
      suggestions.push({
        type: 'mood',
        content: `Excellente humeur cette semaine avec ${moodScore.toFixed(1)}/10. Profitez de cette énergie positive pour avancer sur vos objectifs prioritaires.`,
        userId,
      })
    } else if (moodScore === 0) {
      suggestions.push({
        type: 'mood',
        content: `Pensez à enregistrer votre humeur quotidiennement. Cela vous permettra de mieux comprendre vos cycles de productivité et bien-être.`,
        userId,
      })
    }

    if (totalFocusMinutes < 60) {
      suggestions.push({
        type: 'schedule',
        content: `Vous avez passé moins d une heure en sessions focus cette semaine. Essayez la technique Pomodoro — 25 minutes de travail concentré suivi de 5 minutes de pause.`,
        userId,
      })
    } else {
      const focusHours = Math.round(totalFocusMinutes / 60)
      suggestions.push({
        type: 'schedule',
        content: `Bravo — vous avez accumulé ${focusHours}h de focus cette semaine. Maintenez ce rythme pour maximiser votre productivité.`,
        userId,
      })
    }

    if (goals.length > 0) {
      const topGoal = goals[0]
      suggestions.push({
        type: 'goal',
        content: `Votre objectif "${topGoal.title}" est à ${topGoal.progress}% de progression. Définissez une action concrète aujourd hui pour avancer vers cet objectif.`,
        userId,
      })
    } else {
      suggestions.push({
        type: 'goal',
        content: `Vous n avez pas encore défini d objectifs de vie. Prenez 5 minutes pour en créer un — même petit. Les objectifs clairs augmentent la motivation de 40%.`,
        userId,
      })
    }

    if (suggestions.length > 0) {
      await prisma.aiSuggestion.deleteMany({ where: { userId } })
      await prisma.aiSuggestion.createMany({ data: suggestions })
    }
  },

  async generateWeeklyReport(userId) {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

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
    ])

    const moodScore = moodAverage._avg.score || 0
    const totalFocusMinutes = focusSessions._sum.durationMinutes || 0
    const focusHours = Math.round(totalFocusMinutes / 60)

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
    }

    return report
  },
}

module.exports = aiService