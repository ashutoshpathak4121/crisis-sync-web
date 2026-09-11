const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const resourceController = require('../controllers/resourceController');
const { authenticate, authorize, checkHospitalAccess } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validationMiddleware');
const { resourceUpdateSchema, hospitalStatusSchema } = require('../validators/schemas');

// Public read access for hospital status & resource awareness
router.get('/', hospitalController.getAllHospitals);
router.get('/:id', hospitalController.getHospitalById);
router.get('/:id/resources', resourceController.getResources);
router.get('/:id/audit-logs', hospitalController.getHospitalAuditLogs);

// Admin-only management
router.post('/', authenticate, authorize(['ADMIN']), hospitalController.createHospital);
router.put('/:id', authenticate, authorize(['ADMIN']), hospitalController.updateHospital);

// Hospital Staff & Admin resource editing
router.put(
  '/:id/resources',
  authenticate,
  checkHospitalAccess,
  validateBody(resourceUpdateSchema),
  resourceController.updateResources
);

// Hospital status toggling
router.put(
  '/:id/status',
  authenticate,
  checkHospitalAccess,
  validateBody(hospitalStatusSchema),
  hospitalController.updateHospitalStatus
);

module.exports = router;
