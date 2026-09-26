const express = require('express');
const adminPortalController = require('../controllers/adminPortalController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// STRICT SECURITY: All Admin routes require valid authentication AND SUPER_ADMIN role
router.use(authenticate);
router.use(authorize(['SUPER_ADMIN']));

// 1. Command center metrics
router.get('/dashboard', adminPortalController.getDashboard);

// 2. Hospital management & verification
router.get('/hospitals', adminPortalController.getHospitals);
router.put('/hospitals/:id/verify', adminPortalController.verifyHospital);

// 3. User management & role assignment
router.get('/users', adminPortalController.getUsers);
router.put('/users/:id/role', adminPortalController.updateUserRole);

// 4. Crisis management
router.get('/crisis', adminPortalController.getCrisisEvents);
router.post('/crisis', adminPortalController.createCrisisEvent);
router.put('/crisis/:id', adminPortalController.updateCrisisStatus);

// 5. Global audit logs
router.get('/audit-logs', adminPortalController.getAuditLogs);

// 6. System health & telemetry
router.get('/system', adminPortalController.getSystemTelemetry);

module.exports = router;
