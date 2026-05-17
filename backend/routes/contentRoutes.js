const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public — frontend reads these
router.get('/', contentController.getAllContent);
router.get('/:section', contentController.getSection);

// Admin only — dashboard edits these
router.put('/:section', protect, adminOnly, contentController.updateSection);

module.exports = router;
