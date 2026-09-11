const prisma = require('../config/db');
const redisService = require('./redisService');
const {
  emitHospitalResourceUpdated,
  emitHospitalStatusUpdated,
  emitAlert
} = require('../sockets/socketEmitter');
const logger = require('../utils/logger');

const resourceService = {
  async getResourcesByHospitalId(hospitalId) {
    // 1. Check Redis cache first
    const cached = await redisService.getHospitalResources(hospitalId);
    if (cached) {
      return cached;
    }

    // 2. Fetch from DB
    const resources = await prisma.hospitalResource.findUnique({
      where: { hospitalId },
      include: {
        hospital: {
          select: { id: true, name: true, emergencyStatus: true }
        }
      }
    });

    if (!resources) {
      const err = new Error('Hospital resources record not found');
      err.statusCode = 404;
      throw err;
    }

    // 3. Cache in Redis
    await redisService.setHospitalResources(hospitalId, resources);
    return resources;
  },

  async updateHospitalResources(hospitalId, updateData, userId) {
    // 1. Verify hospital and current resources exist
    const current = await prisma.hospitalResource.findUnique({
      where: { hospitalId },
      include: {
        hospital: true
      }
    });

    if (!current) {
      const err = new Error(`Hospital with ID ${hospitalId} not found`);
      err.statusCode = 404;
      throw err;
    }

    // 2. Validate consistency (e.g. available cannot exceed total)
    const newEmergencyTotal = updateData.emergencyBedsTotal !== undefined
      ? updateData.emergencyBedsTotal
      : current.emergencyBedsTotal;
    const newEmergencyAvailable = updateData.emergencyBedsAvailable !== undefined
      ? updateData.emergencyBedsAvailable
      : current.emergencyBedsAvailable;

    if (newEmergencyAvailable > newEmergencyTotal) {
      const err = new Error(`Available emergency beds (${newEmergencyAvailable}) cannot exceed total beds (${newEmergencyTotal})`);
      err.statusCode = 400;
      throw err;
    }

    const newIcuTotal = updateData.icuBedsTotal !== undefined
      ? updateData.icuBedsTotal
      : current.icuBedsTotal;
    const newIcuAvailable = updateData.icuBedsAvailable !== undefined
      ? updateData.icuBedsAvailable
      : current.icuBedsAvailable;

    if (newIcuAvailable > newIcuTotal) {
      const err = new Error(`Available ICU beds (${newIcuAvailable}) cannot exceed total ICU beds (${newIcuTotal})`);
      err.statusCode = 400;
      throw err;
    }

    const newVentilatorsTotal = updateData.ventilatorsTotal !== undefined
      ? updateData.ventilatorsTotal
      : current.ventilatorsTotal;
    const newVentilatorsAvailable = updateData.ventilatorsAvailable !== undefined
      ? updateData.ventilatorsAvailable
      : current.ventilatorsAvailable;

    if (newVentilatorsAvailable > newVentilatorsTotal) {
      const err = new Error(`Available ventilators (${newVentilatorsAvailable}) cannot exceed total ventilators (${newVentilatorsTotal})`);
      err.statusCode = 400;
      throw err;
    }

    // 3. Track audit logs for modified numeric fields
    const auditEntries = [];
    const fieldsToAudit = [
      'emergencyBedsAvailable',
      'emergencyBedsTotal',
      'icuBedsAvailable',
      'icuBedsTotal',
      'ventilatorsAvailable',
      'ventilatorsTotal',
      'operatingRoomsAvailable',
      'bloodUnitsAvailable'
    ];

    for (const field of fieldsToAudit) {
      if (updateData[field] !== undefined && updateData[field] !== current[field]) {
        auditEntries.push({
          hospitalId,
          userId: userId || 'system',
          resourceType: field,
          oldValue: current[field],
          newValue: updateData[field]
        });
      }
    }

    // 4. Execute atomic update and audit logging
    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.hospitalResource.update({
        where: { hospitalId },
        data: updateData,
        include: {
          hospital: {
            select: { id: true, name: true, emergencyStatus: true, address: true, phone: true }
          }
        }
      });

      if (auditEntries.length > 0 && userId) {
        // Only log if valid user ID is present
        const userExists = await tx.user.findUnique({ where: { id: userId } });
        if (userExists) {
          for (const entry of auditEntries) {
            await tx.resourceUpdateLog.create({ data: entry });
          }
        }
      }

      // Automatically sync emergencyStatus if beds run out
      let newStatus = current.hospital.emergencyStatus;
      if (res.emergencyBedsAvailable === 0 && res.icuBedsAvailable === 0) {
        newStatus = 'FULL';
      } else if (res.emergencyBedsAvailable <= 2 || res.icuBedsAvailable <= 1) {
        if (newStatus !== 'CRITICAL' && newStatus !== 'FULL' && newStatus !== 'OFFLINE') {
          newStatus = 'CRITICAL';
        }
      } else if (res.emergencyBedsAvailable > 2 && (newStatus === 'CRITICAL' || newStatus === 'FULL')) {
        newStatus = 'ACCEPTING';
      }

      if (newStatus !== current.hospital.emergencyStatus) {
        await tx.hospital.update({
          where: { id: hospitalId },
          data: { emergencyStatus: newStatus }
        });
        res.hospital.emergencyStatus = newStatus;
      }

      return res;
    });

    // 5. Update Redis Cache
    await redisService.setHospitalResources(hospitalId, updated);

    // 6. Broadcast Real-Time Socket Event
    emitHospitalResourceUpdated({
      hospitalId,
      hospitalName: current.hospital.name,
      resources: updated,
      changes: auditEntries.map((a) => ({
        field: a.resourceType,
        oldValue: a.oldValue,
        newValue: a.newValue
      }))
    });

    // If status changed, emit status update as well
    if (updated.hospital.emergencyStatus !== current.hospital.emergencyStatus) {
      emitHospitalStatusUpdated({
        hospitalId,
        emergencyStatus: updated.hospital.emergencyStatus,
        hospitalName: current.hospital.name
      });
    }

    // 7. Check for critical alert thresholds
    if (updated.emergencyBedsAvailable <= 2) {
      emitAlert({
        level: updated.emergencyBedsAvailable === 0 ? 'critical' : 'warning',
        title: updated.emergencyBedsAvailable === 0 ? 'Hospital Full' : 'Critical Bed Shortage',
        message: `${current.hospital.name} now has only ${updated.emergencyBedsAvailable} emergency bed(s) available.`,
        hospitalId
      });
    }

    logger.info(`Hospital ${hospitalId} resources updated successfully. Broadcasted to clients.`);
    return updated;
  }
};

module.exports = resourceService;
