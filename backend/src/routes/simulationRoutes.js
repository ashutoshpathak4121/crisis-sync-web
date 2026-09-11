const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');

// Open to trigger from Command Center during live demo
router.post('/start-surge', simulationController.startSurge);
router.post('/reset', simulationController.reset);
router.post('/trigger-incident', simulationController.triggerIncident);

module.exports = router;
