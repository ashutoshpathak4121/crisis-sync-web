const redis = require('../config/redis');
const logger = require('../utils/logger');

const RESOURCE_CACHE_TTL_SEC = 300; // 5 minutes cache TTL

const getHospitalResourceKey = (hospitalId) => `hospital:${hospitalId}:resources`;

const redisService = {
  async getHospitalResources(hospitalId) {
    try {
      const data = await redis.get(getHospitalResourceKey(hospitalId));
      if (!data) return null;
      return JSON.parse(data);
    } catch (err) {
      logger.warn(`Redis get error for hospital ${hospitalId}: ${err.message}`);
      return null;
    }
  },

  async setHospitalResources(hospitalId, resources) {
    try {
      await redis.set(
        getHospitalResourceKey(hospitalId),
        JSON.stringify(resources),
        'EX',
        RESOURCE_CACHE_TTL_SEC
      );
    } catch (err) {
      logger.warn(`Redis set error for hospital ${hospitalId}: ${err.message}`);
    }
  },

  async invalidateHospitalResources(hospitalId) {
    try {
      await redis.del(getHospitalResourceKey(hospitalId));
    } catch (err) {
      logger.warn(`Redis del error for hospital ${hospitalId}: ${err.message}`);
    }
  },

  async clearAll() {
    try {
      await redis.flushall();
    } catch (err) {
      logger.warn(`Redis flush error: ${err.message}`);
    }
  }
};

module.exports = redisService;
