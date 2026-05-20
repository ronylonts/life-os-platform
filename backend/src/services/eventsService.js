const prisma = require('../models/prismaClient');
const { NotFoundError } = require('../utils/errors');

const eventsService = {
  async getEvents(userId, filters = {}) {
    const where = { userId };

    if (filters.from || filters.to) {
      where.startAt = {};
      if (filters.from) {
        where.startAt.gte = new Date(filters.from);
      }
      if (filters.to) {
        where.startAt.lte = new Date(filters.to);
      }
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startAt: 'asc' },
    });

    return events;
  },

  async createEvent(userId, data) {
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startAt: new Date(data.startAt),
        endAt: new Date(data.endAt),
        userId,
      },
    });

    return event;
  },

  async updateEvent(userId, eventId, data) {
    const event = await prisma.event.findFirst({
      where: { id: eventId, userId },
    });

    if (!event) {
      throw new NotFoundError('Événement introuvable');
    }

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: data.title !== undefined ? data.title : event.title,
        description: data.description !== undefined ? data.description : event.description,
        startAt: data.startAt !== undefined ? new Date(data.startAt) : event.startAt,
        endAt: data.endAt !== undefined ? new Date(data.endAt) : event.endAt,
      },
    });

    return updated;
  },

  async deleteEvent(userId, eventId) {
    const event = await prisma.event.findFirst({
      where: { id: eventId, userId },
    });

    if (!event) {
      throw new NotFoundError('Événement introuvable');
    }

    await prisma.event.delete({ where: { id: eventId } });

    return { success: true };
  },
};

module.exports = eventsService;
