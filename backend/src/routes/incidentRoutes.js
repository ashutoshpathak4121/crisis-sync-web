const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validationMiddleware');
const { incidentCreateSchema, incidentUpdateSchema } = require('../validators/schemas');

router.get('/', incidentController.getAllIncidents);
router.get('/:id', incidentController.getIncidentById);

// Any authenticated role (Paramedic, Hospital, Admin) can report an incident
router.post(
  '/',
  authenticate,
  validateBody(incidentCreateSchema),
  incidentController.createIncident
);

router.put(
  '/:id',
  authenticate,
  authorize(['PARAMEDIC', 'ADMIN']),
  validateBody(incidentUpdateSchema),
  incidentController.updateIncident
);

module.exports = router;
