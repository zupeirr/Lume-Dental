const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, deleteNotification } = require('../controllers/notificationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
