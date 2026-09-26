const express = require('express');
const userPortalController = require('../controllers/userPortalController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Publicly accessible directory of verified hospitals
router.get('/hospitals', userPortalController.getVerifiedHospitals);
router.get('/hospitals/:id', userPortalController.getHospitalById);

// Protected patient/citizen admission and emergency requests
router.post('/requests', authenticate, userPortalController.createAdmissionRequest);
router.get('/requests', authenticate, userPortalController.getUserAdmissionRequests);

router.post('/emergency', authenticate, userPortalController.createEmergencyRequest);
router.get('/emergency', authenticate, userPortalController.getUserEmergencyRequests);

router.get('/profile', authenticate, userPortalController.getProfile);
router.put('/profile', authenticate, userPortalController.updateProfile);

module.exports = router;
