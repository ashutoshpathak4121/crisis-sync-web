const express = require('express');
const router = express.Router();
const ambulanceController = require('../controllers/ambulanceController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validationMiddleware');
const { ambulanceLocationSchema, ambulanceStatusSchema } = require('../validators/schemas');

router.get('/', ambulanceController.getAllAmbulances);
router.get('/:id', ambulanceController.getAmbulanceById);

// Paramedics & Admins can update location and status
router.put(
  '/:id/location',
  authenticate,
  authorize(['PARAMEDIC', 'ADMIN']),
  validateBody(ambulanceLocationSchema),
  ambulanceController.updateLocation
);

router.put(
  '/:id/status',
  authenticate,
  authorize(['PARAMEDIC', 'ADMIN']),
  validateBody(ambulanceStatusSchema),
  ambulanceController.updateStatus
);

module.exports = router;
