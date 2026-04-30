const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Protected route (Admin only)
router.get('/stats', protect, adminOnly, dashboardController.getStats);

module.exports = router;
