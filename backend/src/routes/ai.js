const express = require('express');
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/suggestions', aiController.getDailySuggestions);
router.get('/weekly-report', aiController.getWeeklyReport);

module.exports = router;
