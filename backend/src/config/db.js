const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'test' ? [] : ['warn', 'error']
});

prisma.$connect()
  .then(() => {
    logger.info('Database connected successfully via Prisma Client');
  })
  .catch((err) => {
    logger.error('Failed to connect database via Prisma:', err);
  });

module.exports = prisma;
