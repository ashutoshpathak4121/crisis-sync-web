const routeService = require('../services/routeService');
const recommendationService = require('../services/recommendationService');
const { sendSuccess } = require('../utils/responseHandler');

const routeController = {
  async calculateRoute(req, res, next) {
    try {
      const { ambulanceId, hospitalId } = req.body;
      const result = await routeService.calculateRoute(ambulanceId, hospitalId);
      return sendSuccess(res, result, 'Route and ETA calculated successfully');
    } catch (err) {
      next(err);
    }
  },

  async getRecommendations(req, res, next) {
    try {
      const { lat, lng, requiresIcu, requiresVentilator } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({
          success: false,
          message: 'Latitude (lat) and Longitude (lng) query parameters are required'
        });
      }

      const recommendations = await recommendationService.getRecommendations({
        latitude: lat,
        longitude: lng,
        requiresIcu: requiresIcu === 'true',
        requiresVentilator: requiresVentilator === 'true'
      });

      return sendSuccess(res, { recommendations, count: recommendations.length });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = routeController;
