const { body, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Données invalides',
      code: 'VALIDATION_ERROR',
      details: errors.array(),
    });
  }
  next();
};

const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .toLowerCase()
    .trim(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit faire au moins 8 caractères'),
  body('name')
    .notEmpty()
    .withMessage('Le nom est requis')
    .trim(),
  handleValidationErrors,
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .toLowerCase()
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis'),
  handleValidationErrors,
];

const validateCreateTask = [
  body('title')
    .notEmpty()
    .withMessage('Le titre est requis')
    .trim(),
  body('description')
    .optional()
    .trim(),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priorité invalide'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Date invalide'),
  handleValidationErrors,
];

const validateUpdateTask = [
  body('title')
    .optional()
    .trim(),
  body('description')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'done'])
    .withMessage('Statut invalide'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priorité invalide'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Date invalide'),
  handleValidationErrors,
];

const validateCreateEvent = [
  body('title')
    .notEmpty()
    .withMessage('Le titre est requis')
    .trim(),
  body('description')
    .optional()
    .trim(),
  body('startAt')
    .notEmpty()
    .isISO8601()
    .withMessage('Date de début requise et invalide'),
  body('endAt')
    .notEmpty()
    .isISO8601()
    .withMessage('Date de fin requise et invalide'),
  handleValidationErrors,
];

const validateUpdateEvent = [
  body('title')
    .optional()
    .trim(),
  body('description')
    .optional()
    .trim(),
  body('startAt')
    .optional()
    .isISO8601()
    .withMessage('Date invalide'),
  body('endAt')
    .optional()
    .isISO8601()
    .withMessage('Date invalide'),
  handleValidationErrors,
];

const validateCreateGoal = [
  body('title')
    .notEmpty()
    .withMessage('Le titre est requis')
    .trim(),
  body('description')
    .optional()
    .trim(),
  body('targetDate')
    .optional()
    .isISO8601()
    .withMessage('Date invalide'),
  handleValidationErrors,
];

const validateUpdateProgress = [
  body('progress')
    .isInt({ min: 0, max: 100 })
    .withMessage('Progression doit être entre 0 et 100'),
  handleValidationErrors,
];

const validateMoodEntry = [
  body('score')
    .isInt({ min: 1, max: 10 })
    .withMessage('Score doit être entre 1 et 10'),
  body('note')
    .optional()
    .trim(),
  handleValidationErrors,
];

const validateFocusSession = [
  body('durationMinutes')
    .isInt({ min: 1 })
    .withMessage('Durée doit être un nombre positif'),
  body('taskId')
    .optional()
    .isUUID()
    .withMessage('ID de tâche invalide'),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateTask,
  validateUpdateTask,
  validateCreateEvent,
  validateUpdateEvent,
  validateCreateGoal,
  validateUpdateProgress,
  validateMoodEntry,
  validateFocusSession,
};
