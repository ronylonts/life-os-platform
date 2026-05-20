const goalsService = require('../services/goalsService');
const { sendSuccess, sendError } = require('../utils/response');

const goalsController = {
  async getGoals(req, res) {
    try {
      const { userId } = req.user;
      const goals = await goalsService.getGoals(userId);
      return sendSuccess(res, goals, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },

  async createGoal(req, res) {
    try {
      const { userId } = req.user;
      const { title, description, targetDate } = req.body;
      const goal = await goalsService.createGoal(userId, {
        title,
        description,
        targetDate,
      });
      return sendSuccess(res, goal, 201);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },

  async updateProgress(req, res) {
    try {
      const { userId } = req.user;
      const { id } = req.params;
      const { progress } = req.body;
      const goal = await goalsService.updateProgress(userId, id, progress);
      return sendSuccess(res, goal, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },

  async deleteGoal(req, res) {
    try {
      const { userId } = req.user;
      const { id } = req.params;
      await goalsService.deleteGoal(userId, id);
      return res.status(204).send();
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },
};

module.exports = goalsController;
