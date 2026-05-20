const express = require('express');
const goalsController = require('../controllers/goalsController');
const authMiddleware = require('../middlewares/auth');
const { validateCreateGoal, validateUpdateProgress } = require('../middlewares/validators');

const router = express.Router();

router.use(authMiddleware);

router.get('/', goalsController.getGoals);
router.post('/', validateCreateGoal, goalsController.createGoal);
router.patch('/:id/progress', validateUpdateProgress, goalsController.updateProgress);
router.delete('/:id', goalsController.deleteGoal);

module.exports = router;
