const { sendError } = require('../utils/responseHandler');

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map((d) => d.message.replace(/['"]/g, ''));
      return sendError(res, 'Validation failed', 422, details);
    }

    req.body = value;
    next();
  };
};

module.exports = {
  validateBody
};
