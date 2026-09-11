const prisma = require('../config/db');
const {
  emitIncidentCreated,
  emitIncidentUpdated,
  emitAlert
} = require('../sockets/socketEmitter');
const logger = require('../utils/logger');

const incidentService = {
  async getAllIncidents() {
    return prisma.incident.findMany({
      include: {
        ambulances: {
          select: { id: true, vehicleNumber: true, status: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async getIncidentById(id) {
    const incident = await prisma.incident.findUnique({
      where: { id },
      include: {
        ambulances: {
          include: {
            destinationHospital: { select: { id: true, name: true } }
          }
        }
      }
    });

    if (!incident) {
      const err = new Error(`Incident with ID ${id} not found`);
      err.statusCode = 404;
      throw err;
    }

    return incident;
  },

  async createIncident(data) {
    const incident = await prisma.incident.create({
      data,
      include: { ambulances: true }
    });

    emitIncidentCreated(incident);

    if (incident.severity === 'CRITICAL' || incident.patientCount >= 3) {
      emitAlert({
        level: 'critical',
        title: `MASS CASUALTY / CRITICAL INCIDENT: ${incident.type}`,
        message: `${incident.patientCount} patients reported at location. Rapid ambulance routing & ER bed triage active.`
      });
    }

    logger.info(`Incident registered: ${incident.type} [${incident.severity}]`);
    return incident;
  },

  async updateIncident(id, data) {
    const incident = await prisma.incident.update({
      where: { id },
      data,
      include: { ambulances: true }
    });

    emitIncidentUpdated(incident);
    return incident;
  }
};

module.exports = incidentService;
