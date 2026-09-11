const prisma = require('../config/db');
const redisService = require('./redisService');
const { calculateDistanceKm, estimateEtaMinutes } = require('../utils/geo');
const { emitHospitalStatusUpdated } = require('../sockets/socketEmitter');
const logger = require('../utils/logger');

const hospitalService = {
  async getAllHospitals(options = {}) {
    const { userLat, userLng, status } = options;

    const where = {};
    if (status) {
      where.emergencyStatus = status;
    }

    const hospitals = await prisma.hospital.findMany({
      where,
      include: {
        resources: true
      },
      orderBy: { name: 'asc' }
    });

    // If user / ambulance coordinates provided, calculate distance and ETA
    if (userLat !== undefined && userLng !== undefined) {
      const lat = parseFloat(userLat);
      const lng = parseFloat(userLng);

      const withDistances = hospitals.map((h) => {
        const distanceKm = calculateDistanceKm(lat, lng, h.latitude, h.longitude);
        const etaMinutes = estimateEtaMinutes(distanceKm);
        return {
          ...h,
          distanceKm,
          etaMinutes
        };
      });

      withDistances.sort((a, b) => a.distanceKm - b.distanceKm);
      return withDistances;
    }

    return hospitals;
  },

  async getHospitalById(id) {
    // Attempt cache read for resources
    const cachedResources = await redisService.getHospitalResources(id);

    const hospital = await prisma.hospital.findUnique({
      where: { id },
      include: {
        resources: true,
        auditLogs: {
          take: 10,
          orderBy: { timestamp: 'desc' },
          include: {
            user: { select: { id: true, name: true, role: true } }
          }
        }
      }
    });

    if (!hospital) {
      const err = new Error(`Hospital with ID ${id} not found`);
      err.statusCode = 404;
      throw err;
    }

    if (cachedResources && hospital.resources) {
      hospital.resources = cachedResources;
    }

    return hospital;
  },

  async createHospital(data) {
    const { resources, ...hospitalData } = data;

    const hospital = await prisma.hospital.create({
      data: {
        ...hospitalData,
        resources: {
          create: resources || {
            emergencyBedsTotal: 20,
            emergencyBedsAvailable: 10,
            icuBedsTotal: 10,
            icuBedsAvailable: 3,
            ventilatorsTotal: 6,
            ventilatorsAvailable: 4,
            operatingRoomsTotal: 4,
            operatingRoomsAvailable: 2,
            bloodUnitsAvailable: 40,
            traumaTeamAvailable: true
          }
        }
      },
      include: { resources: true }
    });

    logger.info(`Hospital created: ${hospital.name} (${hospital.id})`);
    return hospital;
  },

  async updateHospital(id, data) {
    const hospital = await prisma.hospital.update({
      where: { id },
      data,
      include: { resources: true }
    });

    return hospital;
  },

  async updateHospitalStatus(id, emergencyStatus) {
    const hospital = await prisma.hospital.update({
      where: { id },
      data: { emergencyStatus },
      include: { resources: true }
    });

    // Invalidate / update Redis cache
    if (hospital.resources) {
      hospital.resources.hospital = {
        id: hospital.id,
        name: hospital.name,
        emergencyStatus
      };
      await redisService.setHospitalResources(id, hospital.resources);
    }

    emitHospitalStatusUpdated({
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      emergencyStatus: hospital.emergencyStatus
    });

    logger.info(`Hospital ${hospital.name} status updated to ${emergencyStatus}`);
    return hospital;
  },

  async getHospitalAuditLogs(hospitalId) {
    return prisma.resourceUpdateLog.findMany({
      where: { hospitalId },
      orderBy: { timestamp: 'desc' },
      take: 50,
      include: {
        user: { select: { id: true, name: true, role: true } }
      }
    });
  }
};

module.exports = hospitalService;
