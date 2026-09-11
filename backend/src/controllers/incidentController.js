const incidentService = require('../services/incidentService');
const { sendSuccess } = require('../utils/responseHandler');

const incidentController = {
  async getAllIncidents(req, res, next) {
    try {
      const incidents = await incidentService.getAllIncidents();
      return sendSuccess(res, { incidents, count: incidents.length });
    } catch (err) {
      next(err);
    }
  },

  async getIncidentById(req, res, next) {
    try {
      const incident = await incidentService.getIncidentById(req.params.id);
      return sendSuccess(res, { incident });
    } catch (err) {
      next(err);
    }
  },

  async createIncident(req, res, next) {
    try {
      const incident = await incidentService.createIncident(req.body);
      return sendSuccess(res, { incident }, 'Emergency incident reported', 201);
    } catch (err) {
      next(err);
    }
  },

  async updateIncident(req, res, next) {
    try {
      const incident = await incidentService.updateIncident(req.params.id, req.body);
      return sendSuccess(res, { incident }, 'Incident updated');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = incidentController;
