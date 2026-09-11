const prisma = require('../config/db');
const {
  emitAmbulanceLocationUpdated,
  emitAmbulanceStatusUpdated
} = require('../sockets/socketEmitter');
const logger = require('../utils/logger');

const ambulanceService = {
  async getAllAmbulances() {
    return prisma.ambulance.findMany({
      include: {
        paramedic: { select: { id: true, name: true, email: true } },
        destinationHospital: { select: { id: true, name: true, emergencyStatus: true, latitude: true, longitude: true } },
        currentIncident: { select: { id: true, type: true, severity: true, latitude: true, longitude: true } }
      },
      orderBy: { vehicleNumber: 'asc' }
    });
  },

  async getAmbulanceById(id) {
    const ambulance = await prisma.ambulance.findUnique({
      where: { id },
      include: {
        paramedic: { select: { id: true, name: true, email: true } },
        destinationHospital: {
          select: {
            id: true,
            name: true,
            emergencyStatus: true,
            latitude: true,
            longitude: true,
            resources: true
          }
        },
        currentIncident: true,
        routes: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!ambulance) {
      const err = new Error(`Ambulance with ID ${id} not found`);
      err.statusCode = 404;
      throw err;
    }

    return ambulance;
  },

  async updateLocation(id, latitude, longitude) {
    const ambulance = await prisma.ambulance.update({
      where: { id },
      data: { latitude, longitude }
    });

    emitAmbulanceLocationUpdated({
      ambulanceId: ambulance.id,
      latitude: ambulance.latitude,
      longitude: ambulance.longitude
    });

    return ambulance;
  },

  async updateStatus(id, status, destinationHospitalId = null) {
    const data = { status };
    if (destinationHospitalId !== undefined) {
      data.destinationHospitalId = destinationHospitalId;
    }

    const ambulance = await prisma.ambulance.update({
      where: { id },
      data,
      include: {
        destinationHospital: { select: { id: true, name: true, emergencyStatus: true } }
      }
    });

    emitAmbulanceStatusUpdated({
      ambulanceId: ambulance.id,
      status: ambulance.status,
      destinationHospitalId: ambulance.destinationHospitalId,
      hospitalName: ambulance.destinationHospital ? ambulance.destinationHospital.name : null
    });

    logger.info(`Ambulance ${ambulance.vehicleNumber} status updated to ${status}`);
    return ambulance;
  }
};

module.exports = ambulanceService;
