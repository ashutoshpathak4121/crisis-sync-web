const resourceService = require('../services/resourceService');
const { sendSuccess } = require('../utils/responseHandler');

const resourceController = {
  async getResources(req, res, next) {
    try {
      const resources = await resourceService.getResourcesByHospitalId(req.params.id);
      return sendSuccess(res, { resources });
    } catch (err) {
      next(err);
    }
  },

  async updateResources(req, res, next) {
    try {
      const userId = req.user ? req.user.id : null;
      const resources = await resourceService.updateHospitalResources(
        req.params.id,
        req.body,
        userId
      );
      return sendSuccess(res, { resources }, 'Hospital resources updated successfully');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = resourceController;
