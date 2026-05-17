const db = require('../config/db');

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private (Admin only)
exports.getNotifications = async (req, res) => {
  try {
    const [notifications] = await db.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20');
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private (Admin only)
exports.markAsRead = async (req, res) => {
  try {
    await db.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private (Admin only)
exports.deleteNotification = async (req, res) => {
  try {
    await db.query('DELETE FROM notifications WHERE id = ?', [req.params.id]);
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
