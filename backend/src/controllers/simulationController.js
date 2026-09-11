const simulationService = require('../services/simulationService');
const { sendSuccess } = require('../utils/responseHandler');

const simulationController = {
  async startSurge(req, res, next) {
    try {
      const result = await simulationService.startSurgeSimulation();
      return sendSuccess(res, result, 'Emergency surge simulation started. Broadcasting live capacity updates.');
    } catch (err) {
      next(err);
    }
  },

  async reset(req, res, next) {
    try {
      const result = await simulationService.resetSimulation();
      return sendSuccess(res, result, 'All simulation data reset to normal baseline.');
    } catch (err) {
      next(err);
    }
  },

  async triggerIncident(req, res, next) {
    try {
      const incident = await simulationService.triggerEmergencyIncident();
      return sendSuccess(res, { incident }, 'Mass casualty emergency incident triggered in real time.');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = simulationController;
