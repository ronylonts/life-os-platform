const moodService = require('../services/moodService');
const { sendSuccess, sendError } = require('../utils/response');

const moodController = {
  async getMoodHistory(req, res) {
    try {
      const { userId } = req.user;
      const entries = await moodService.getMoodHistory(userId);
      return sendSuccess(res, entries, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },

  async recordMood(req, res) {
    try {
      const { userId } = req.user;
      const { score, note } = req.body;
      const entry = await moodService.recordMood(userId, { score, note });
      return sendSuccess(res, entry, 201);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },
};

module.exports = moodController;
