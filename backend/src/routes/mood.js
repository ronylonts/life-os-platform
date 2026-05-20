const express = require('express');
const moodController = require('../controllers/moodController');
const authMiddleware = require('../middlewares/auth');
const { validateMoodEntry } = require('../middlewares/validators');

const router = express.Router();

router.use(authMiddleware);

router.get('/', moodController.getMoodHistory);
router.post('/', validateMoodEntry, moodController.recordMood);

module.exports = router;
