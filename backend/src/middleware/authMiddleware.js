const jwt = require('jsonwebtoken');
const env = require('../config/env');
const prisma = require('../config/db');
const { sendError } = require('../utils/responseHandler');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // In demo/development environments, gracefully fallback to demo paramedic
      if (process.env.NODE_ENV !== 'production') {
        const demoUser = await prisma.user.findFirst({
          where: { role: 'PARAMEDIC' },
          select: { id: true, name: true, email: true, role: true, hospitalId: true }
        });
        if (demoUser) {
          req.user = demoUser;
          return next();
        }
      }
      return sendError(res, 'Authentication token missing or invalid', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, hospitalId: true }
    });

    if (!user) {
      return sendError(res, 'User associated with token not found', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Session expired. Please log in again', 401);
    }
    return sendError(res, 'Invalid authentication token', 401);
  }
};

const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Unauthorized access', 401);
    }

    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return sendError(res, `Forbidden: Requires one of [${allowedRoles.join(', ')}] roles`, 403);
    }

    next();
  };
};

// Check if user is Admin or is hospital staff assigned to this specific hospital
const checkHospitalAccess = (req, res, next) => {
  const hospitalId = req.params.id || req.params.hospitalId;
  if (!req.user) {
    return sendError(res, 'Unauthorized access', 401);
  }

  if (req.user.role === 'ADMIN') {
    return next();
  }

  if (req.user.role === 'HOSPITAL') {
    if (req.user.hospitalId && req.user.hospitalId !== hospitalId) {
      return sendError(res, 'Forbidden: You can only manage your assigned hospital', 403);
    }
    return next();
  }

  return sendError(res, 'Forbidden: Hospital staff or Admin privileges required', 403);
};

module.exports = {
  authenticate,
  authorize,
  checkHospitalAccess
};
