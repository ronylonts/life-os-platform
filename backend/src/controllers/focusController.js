const focusService = require('../services/focusService');
const { sendSuccess, sendError } = require('../utils/response');

const focusController = {
  async getFocusSessions(req, res) {
    try {
      const { userId } = req.user;
      const sessions = await focusService.getFocusSessions(userId);
      return sendSuccess(res, sessions, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },

  async recordFocusSession(req, res) {
    try {
      const { userId } = req.user;
      const { durationMinutes, taskId } = req.body;
      const session = await focusService.recordFocusSession(userId, {
        durationMinutes,
        taskId,
      });
      return sendSuccess(res, session, 201);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },
};

module.exports = focusController;
