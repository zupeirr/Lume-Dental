const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public route (Handles Guest AND Logged-in internally)
router.post('/', appointmentController.bookAppointment);

// Protected routes (Admin only)
router.get('/', protect, adminOnly, appointmentController.getAppointments);
router.patch('/:id', protect, adminOnly, appointmentController.updateAppointmentStatus);

module.exports = router;
