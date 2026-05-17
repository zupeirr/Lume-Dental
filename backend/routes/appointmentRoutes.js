const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect, adminOnly, staffOnly, clinicalOnly } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

// Public route (Handles Guest AND Logged-in internally)
router.post('/', [
  body('name').notEmpty().withMessage('Name is required').trim().escape(),
  body('phone').notEmpty().withMessage('Phone is required').trim().escape(),
  body('appointment_date').isISO8601().withMessage('Valid appointment date is required'),
  body('service_id').isInt().withMessage('Valid service ID is required'),
  body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
  validate
], appointmentController.bookAppointment);

// Protected routes (Staff access)
router.get('/', protect, staffOnly, appointmentController.getAppointments);
router.patch('/:id', protect, staffOnly, appointmentController.updateAppointment);

module.exports = router;
