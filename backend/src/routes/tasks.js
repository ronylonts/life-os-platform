const express = require('express');
const tasksController = require('../controllers/tasksController');
const authMiddleware = require('../middlewares/auth');
const { validateCreateTask, validateUpdateTask } = require('../middlewares/validators');

const router = express.Router();

router.use(authMiddleware);

router.get('/', tasksController.getTasks);
router.post('/', validateCreateTask, tasksController.createTask);
router.put('/:id', validateUpdateTask, tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

module.exports = router;
