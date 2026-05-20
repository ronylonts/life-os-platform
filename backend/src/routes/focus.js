const express = require('express');
const focusController = require('../controllers/focusController');
const authMiddleware = require('../middlewares/auth');
const { validateFocusSession } = require('../middlewares/validators');

const router = express.Router();

router.use(authMiddleware);

router.get('/', focusController.getFocusSessions);
router.post('/', validateFocusSession, focusController.recordFocusSession);

module.exports = router;
