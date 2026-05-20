const aiService = require('../services/aiService');
const { sendSuccess, sendError } = require('../utils/response');

const aiController = {
  async getDailySuggestions(req, res) {
    try {
      const { userId } = req.user;
      const suggestions = await aiService.getDailySuggestions(userId);
      return sendSuccess(res, suggestions, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },

  async getWeeklyReport(req, res) {
    try {
      const { userId } = req.user;
      const report = await aiService.generateWeeklyReport(userId);
      return sendSuccess(res, report, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },
};

module.exports = aiController;
