const eventsService = require('../services/eventsService');
const { sendSuccess, sendError } = require('../utils/response');

const eventsController = {
  async getEvents(req, res) {
    try {
      const { userId } = req.user;
      const { from, to } = req.query;
      const events = await eventsService.getEvents(userId, { from, to });
      return sendSuccess(res, events, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },

  async createEvent(req, res) {
    try {
      const { userId } = req.user;
      const { title, description, startAt, endAt } = req.body;
      const event = await eventsService.createEvent(userId, {
        title,
        description,
        startAt,
        endAt,
      });
      return sendSuccess(res, event, 201);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },

  async updateEvent(req, res) {
    try {
      const { userId } = req.user;
      const { id } = req.params;
      const event = await eventsService.updateEvent(userId, id, req.body);
      return sendSuccess(res, event, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },

  async deleteEvent(req, res) {
    try {
      const { userId } = req.user;
      const { id } = req.params;
      await eventsService.deleteEvent(userId, id);
      return res.status(204).send();
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },
};

module.exports = eventsController;
