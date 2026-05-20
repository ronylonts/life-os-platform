const tasksService = require('../services/tasksService');
const { sendSuccess, sendError } = require('../utils/response');

const tasksController = {
  async getTasks(req, res) {
    try {
      const { userId } = req.user;
      const { status, priority } = req.query;
      const tasks = await tasksService.getTasks(userId, { status, priority });
      return sendSuccess(res, tasks, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },

  async createTask(req, res) {
    try {
      const { userId } = req.user;
      const { title, description, priority, dueDate } = req.body;
      const task = await tasksService.createTask(userId, {
        title,
        description,
        priority,
        dueDate,
      });
      return sendSuccess(res, task, 201);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },

  async updateTask(req, res) {
    try {
      const { userId } = req.user;
      const { id } = req.params;
      const task = await tasksService.updateTask(userId, id, req.body);
      return sendSuccess(res, task, 200);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },

  async deleteTask(req, res) {
    try {
      const { userId } = req.user;
      const { id } = req.params;
      await tasksService.deleteTask(userId, id);
      return res.status(204).send();
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const code = error.code || 'ERROR';
      return sendError(res, error.message, statusCode, code);
    }
  },
};

module.exports = tasksController;
