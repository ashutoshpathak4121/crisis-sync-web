const logger = require('../utils/logger');
const { sendError } = require('../utils/responseHandler');

const notFoundHandler = (req, res) => {
  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled Server Error:', err.message, err.stack);

  if (err.name === 'UnauthorizedError') {
    return sendError(res, 'Invalid or missing authentication credentials', 401);
  }

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Internal Server Error'
    : err.message || 'Internal Server Error';

  return sendError(res, message, statusCode);
};

module.exports = {
  notFoundHandler,
  errorHandler
};
