const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Protected route (Admin only)
router.get('/stats', protect, adminOnly, dashboardController.getStats);
router.get('/patients', protect, adminOnly, dashboardController.getPatientList);

module.exports = router;
