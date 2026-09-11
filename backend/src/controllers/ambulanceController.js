const ambulanceService = require('../services/ambulanceService');
const { sendSuccess } = require('../utils/responseHandler');

const ambulanceController = {
  async getAllAmbulances(req, res, next) {
    try {
      const ambulances = await ambulanceService.getAllAmbulances();
      return sendSuccess(res, { ambulances, count: ambulances.length });
    } catch (err) {
      next(err);
    }
  },

  async getAmbulanceById(req, res, next) {
    try {
      const ambulance = await ambulanceService.getAmbulanceById(req.params.id);
      return sendSuccess(res, { ambulance });
    } catch (err) {
      next(err);
    }
  },

  async updateLocation(req, res, next) {
    try {
      const { latitude, longitude } = req.body;
      const ambulance = await ambulanceService.updateLocation(req.params.id, latitude, longitude);
      return sendSuccess(res, { ambulance }, 'Location updated');
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { status, destinationHospitalId } = req.body;
      const ambulance = await ambulanceService.updateStatus(req.params.id, status, destinationHospitalId);
      return sendSuccess(res, { ambulance }, 'Status updated');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ambulanceController;
