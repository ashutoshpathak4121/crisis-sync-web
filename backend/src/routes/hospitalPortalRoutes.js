const express = require('express');
const hospitalPortalController = require('../controllers/hospitalPortalController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All hospital portal routes strictly require authentication and hospital authorization
router.use(authenticate);
router.use(authorize(['HOSPITAL_STAFF', 'HOSPITAL_ADMIN', 'SUPER_ADMIN']));

// 1. Dashboard metrics
router.get('/dashboard', hospitalPortalController.getDashboard);

// 2. Capacity management
router.put('/capacity', hospitalPortalController.updateCapacity);

// 3. Admission requests queue
router.get('/requests', hospitalPortalController.getAdmissionRequests);
router.put('/requests/:id', hospitalPortalController.updateAdmissionRequest);

// 4. In-hospital patient registry
router.get('/patients', hospitalPortalController.getPatients);
router.post('/patients', hospitalPortalController.createPatient);

// 5. Hospital staff management (Hospital Admin or Super Admin only)
router.get('/staff', authorize(['HOSPITAL_ADMIN', 'SUPER_ADMIN']), hospitalPortalController.getStaff);

// 6. Hospital audit logs
router.get('/audit-logs', hospitalPortalController.getAuditLogs);

// 7. Hospital settings (Hospital Admin or Super Admin only)
router.put('/settings', authorize(['HOSPITAL_ADMIN', 'SUPER_ADMIN']), hospitalPortalController.updateSettings);

module.exports = router;
