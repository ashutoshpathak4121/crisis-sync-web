const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const env = require('../config/env');
const logger = require('../utils/logger');
const { normalizeRole } = require('../middleware/authMiddleware');

const generateToken = (user) => {
  const normalizedRole = normalizeRole(user.role, user.email);
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: normalizedRole,
      hospitalId: user.hospitalId
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
};

const authService = {
  async register({ name, email, password, phone = null, role = 'USER', hospitalId = null }) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      const err = new Error('A user with this email address already exists');
      err.statusCode = 409;
      throw err;
    }

    let finalRole = role;
    if (env.SUPER_ADMIN_EMAIL && email.toLowerCase() === env.SUPER_ADMIN_EMAIL.toLowerCase()) {
      finalRole = 'SUPER_ADMIN';
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role: finalRole,
        hospitalId: ['HOSPITAL_ADMIN', 'HOSPITAL_STAFF', 'HOSPITAL'].includes(finalRole) ? hospitalId : null
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        hospitalId: true,
        createdAt: true
      }
    });

    user.role = normalizeRole(user.role, user.email);
    const token = generateToken(user);
    logger.info(`New user registered: ${user.email} (${user.role})`);

    return { user, token };
  },

  async login({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        hospital: {
          select: { id: true, name: true, emergencyStatus: true, verificationStatus: true }
        }
      }
    });

    if (!user) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      logger.warn(`Failed login attempt for email: ${email}`);
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const normalizedRole = normalizeRole(user.role, user.email);
    const token = generateToken({ ...user, role: normalizedRole });
    logger.info(`User logged in successfully: ${user.email} (${normalizedRole})`);

    const userSafe = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: normalizedRole,
      hospitalId: user.hospitalId,
      hospital: user.hospital
    };

    return { user: userSafe, token };
  },

  async getMe(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        hospitalId: true,
        hospital: {
          select: { id: true, name: true, emergencyStatus: true, verificationStatus: true }
        }
      }
    });

    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    user.role = normalizeRole(user.role, user.email);
    return user;
  }
};

module.exports = authService;
