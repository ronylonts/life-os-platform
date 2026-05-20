const express = require('express');
const eventsController = require('../controllers/eventsController');
const authMiddleware = require('../middlewares/auth');
const { validateCreateEvent, validateUpdateEvent } = require('../middlewares/validators');

const router = express.Router();

router.use(authMiddleware);

router.get('/', eventsController.getEvents);
router.post('/', validateCreateEvent, eventsController.createEvent);
router.put('/:id', validateUpdateEvent, eventsController.updateEvent);
router.delete('/:id', eventsController.deleteEvent);

module.exports = router;
