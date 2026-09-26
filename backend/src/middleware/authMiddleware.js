const jwt = require('jsonwebtoken');
const env = require('../config/env');
const prisma = require('../config/db');
const { sendError } = require('../utils/responseHandler');

// Role normalization helper to seamlessly support both new and legacy roles
const normalizeRole = (role, email = '') => {
  if (email && env.SUPER_ADMIN_EMAIL && email.toLowerCase() === env.SUPER_ADMIN_EMAIL.toLowerCase()) {
    return 'SUPER_ADMIN';
  }
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') return 'SUPER_ADMIN';
  if (role === 'HOSPITAL' || role === 'HOSPITAL_ADMIN') return 'HOSPITAL_ADMIN';
  if (role === 'HOSPITAL_STAFF' || role === 'PARAMEDIC') return 'HOSPITAL_STAFF';
  return 'USER';
};

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. Please provide a valid Bearer token.', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendError(res, 'Authentication token missing', 401);
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        hospitalId: true,
        hospital: {
          select: { id: true, name: true, emergencyStatus: true, verificationStatus: true }
        }
      }
    });

    if (!user) {
      return sendError(res, 'User session invalid or account not found', 401);
    }

    // Normalized role based on database role and SUPER_ADMIN_EMAIL configuration
    user.normalizedRole = normalizeRole(user.role, user.email);

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Session expired. Please log in again', 401);
    }
    return sendError(res, 'Invalid or corrupted authentication token', 401);
  }
};

const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    const userRole = req.user.normalizedRole || normalizeRole(req.user.role, req.user.email);

    // SUPER_ADMIN has master privileges over all operations
    if (userRole === 'SUPER_ADMIN') {
      return next();
    }

    // Role hierarchy checking
    const meetsRequirement = allowedRoles.some((role) => {
      if (role === userRole) return true;
      if (role === 'HOSPITAL_STAFF' && userRole === 'HOSPITAL_ADMIN') return true;
      if (role === 'USER') return true; // Hospital staff/admins can also perform user actions
      return false;
    });

    if (!meetsRequirement) {
      return sendError(
        res,
        'Forbidden: You do not have the required permissions to access this healthcare portal area.',
        403
      );
    }

    next();
  };
};

// Check if user is Super Admin or assigned to this specific hospital
const checkHospitalAccess = (req, res, next) => {
  const hospitalId = req.params.id || req.params.hospitalId || req.body.hospitalId;
  if (!req.user) {
    return sendError(res, 'Authentication required', 401);
  }

  const userRole = req.user.normalizedRole || normalizeRole(req.user.role, req.user.email);

  if (userRole === 'SUPER_ADMIN') {
    return next();
  }

  if (userRole === 'HOSPITAL_ADMIN' || userRole === 'HOSPITAL_STAFF') {
    if (hospitalId && req.user.hospitalId && req.user.hospitalId !== hospitalId) {
      return sendError(res, 'Forbidden: You can only view and manage your assigned hospital facility', 403);
    }
    return next();
  }

  return sendError(res, 'Forbidden: Hospital staff authorization required', 403);
};

module.exports = {
  authenticate,
  authorize,
  normalizeRole,
  checkHospitalAccess
};

