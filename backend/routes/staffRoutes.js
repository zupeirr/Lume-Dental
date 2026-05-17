const express = require('express');
const router = express.Router();
const { getDentists, getWorkload } = require('../controllers/staffController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getDentists);
router.get('/workload', protect, adminOnly, getWorkload);

module.exports = router;
