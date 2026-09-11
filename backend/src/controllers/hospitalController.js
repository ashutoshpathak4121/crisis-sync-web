const hospitalService = require('../services/hospitalService');
const { sendSuccess } = require('../utils/responseHandler');

const hospitalController = {
  async getAllHospitals(req, res, next) {
    try {
      const { lat, lng, status } = req.query;
      const hospitals = await hospitalService.getAllHospitals({
        userLat: lat,
        userLng: lng,
        status
      });
      return sendSuccess(res, { hospitals, count: hospitals.length });
    } catch (err) {
      next(err);
    }
  },

  async getHospitalById(req, res, next) {
    try {
      const hospital = await hospitalService.getHospitalById(req.params.id);
      return sendSuccess(res, { hospital });
    } catch (err) {
      next(err);
    }
  },

  async createHospital(req, res, next) {
    try {
      const hospital = await hospitalService.createHospital(req.body);
      return sendSuccess(res, { hospital }, 'Hospital created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async updateHospital(req, res, next) {
    try {
      const hospital = await hospitalService.updateHospital(req.params.id, req.body);
      return sendSuccess(res, { hospital }, 'Hospital updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async updateHospitalStatus(req, res, next) {
    try {
      const hospital = await hospitalService.updateHospitalStatus(
        req.params.id,
        req.body.emergencyStatus
      );
      return sendSuccess(res, { hospital }, `Hospital status updated to ${hospital.emergencyStatus}`);
    } catch (err) {
      next(err);
    }
  },

  async getHospitalAuditLogs(req, res, next) {
    try {
      const logs = await hospitalService.getHospitalAuditLogs(req.params.id);
      return sendSuccess(res, { logs, count: logs.length });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = hospitalController;
