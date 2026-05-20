const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/response');

const authController = {
  async register(req, res) {
    try {
      const { email, password, name } = req.body;
      const result = await authService.register(email, password, name);
      return sendSuccess(res, result, 201);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return sendSuccess(res, result, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },

  async getProfile(req, res) {
    try {
      const { userId } = req.user;
      const user = await authService.getProfile(userId);
      return sendSuccess(res, user, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },
};

module.exports = authController;
