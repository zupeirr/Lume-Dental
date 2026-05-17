const express = require('express');
const router = express.Router();
const { addPatient, getPatients } = require('../controllers/userController');
const { protect, adminOnly, staffOnly, clinicalOnly } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/patients', staffOnly, addPatient);
router.get('/patients', staffOnly, getPatients);
router.get('/patients/:id', clinicalOnly, require('../controllers/userController').getPatientProfile);
router.put('/patients/:id/record', clinicalOnly, require('../controllers/userController').updatePatientRecord);

module.exports = router;
