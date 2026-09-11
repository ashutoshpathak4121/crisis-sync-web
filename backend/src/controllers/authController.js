const authService = require('../services/authService');
const { sendSuccess } = require('../utils/responseHandler');

const authController = {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return sendSuccess(res, result, 'User registered successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      return sendSuccess(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.id);
      return sendSuccess(res, { user }, 'User profile fetched');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = authController;
