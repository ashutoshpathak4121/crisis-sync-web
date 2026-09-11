const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const env = require('../config/env');
const logger = require('../utils/logger');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      hospitalId: user.hospitalId
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
};

const authService = {
  async register({ name, email, password, role = 'PARAMEDIC', hospitalId = null }) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      const err = new Error('A user with this email address already exists');
      err.statusCode = 409;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        hospitalId: role === 'HOSPITAL' ? hospitalId : null
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        hospitalId: true,
        createdAt: true
      }
    });

    const token = generateToken(user);
    logger.info(`New user registered: ${user.email} (${user.role})`);

    return { user, token };
  },

  async login({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        hospital: {
          select: { id: true, name: true, emergencyStatus: true }
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

    const token = generateToken(user);
    logger.info(`User logged in successfully: ${user.email} (${user.role})`);

    const userSafe = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
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
        role: true,
        hospitalId: true,
        hospital: {
          select: { id: true, name: true, emergencyStatus: true }
        }
      }
    });

    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    return user;
  }
};

module.exports = authService;
