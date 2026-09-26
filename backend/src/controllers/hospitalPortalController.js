const prisma = require('../config/db');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const {
  emitHospitalResourceUpdated,
  emitHospitalStatusUpdated,
  emitAdmissionRequestUpdated
} = require('../sockets/socketEmitter');

// Helper to determine the target hospital for the authenticated user
const resolveUserHospitalId = async (req) => {
  if (req.user.hospitalId) return req.user.hospitalId;
  // If Super Admin without explicit hospitalId, return first available or query param
  if (req.query.hospitalId) return req.query.hospitalId;
  const first = await prisma.hospital.findFirst({ select: { id: true } });
  return first ? first.id : null;
};

const hospitalPortalController = {
  // 1. Hospital Operations Dashboard Overview
  async getDashboard(req, res, next) {
    try {
      const hospitalId = await resolveUserHospitalId(req);
      if (!hospitalId) {
        return sendError(res, 'No hospital associated with this staff account', 400);
      }

      const hospital = await prisma.hospital.findUnique({
        where: { id: hospitalId },
        include: {
          resources: true,
          staff: {
            select: { id: true, name: true, email: true, role: true }
          }
        }
      });

      if (!hospital) {
        return sendError(res, 'Hospital not found', 404);
      }

      const [pendingRequestsCount, activePatientsCount, recentRequests, recentAuditLogs] =
        await Promise.all([
          prisma.admissionRequest.count({
            where: { hospitalId, status: 'PENDING' }
          }),
          prisma.patient.count({
            where: { hospitalId, status: { in: ['ADMITTED', 'IN_SURGERY', 'RECOVERING'] } }
          }),
          prisma.admissionRequest.findMany({
            where: { hospitalId },
            orderBy: { createdAt: 'desc' },
            take: 5
          }),
          prisma.auditLog.findMany({
            where: { hospitalId },
            orderBy: { createdAt: 'desc' },
            take: 8
          })
        ]);

      const resObj = hospital.resources || {};
      const totalBeds = (resObj.emergencyBedsTotal || 0) + (resObj.icuBedsTotal || 0);
      const availableBeds = (resObj.emergencyBedsAvailable || 0) + (resObj.icuBedsAvailable || 0);
      const occupiedBeds = Math.max(0, totalBeds - availableBeds);

      return sendSuccess(
        res,
        {
          hospital,
          metrics: {
            totalBeds,
            availableBeds,
            occupiedBeds,
            icuTotal: resObj.icuBedsTotal || 0,
            icuAvailable: resObj.icuBedsAvailable || 0,
            icuOccupied: Math.max(0, (resObj.icuBedsTotal || 0) - (resObj.icuBedsAvailable || 0)),
            emergencyBedsTotal: resObj.emergencyBedsTotal || 0,
            emergencyBedsAvailable: resObj.emergencyBedsAvailable || 0,
            ventilatorsTotal: resObj.ventilatorsTotal || 0,
            ventilatorsAvailable: resObj.ventilatorsAvailable || 0,
            operatingRoomsAvailable: resObj.operatingRoomsAvailable || 0,
            bloodUnitsAvailable: resObj.bloodUnitsAvailable || 0,
            activePatientsCount,
            pendingRequestsCount,
            emergencyStatus: hospital.emergencyStatus,
            verificationStatus: hospital.verificationStatus
          },
          recentRequests,
          recentAuditLogs
        },
        'Hospital operations telemetry fetched'
      );
    } catch (err) {
      next(err);
    }
  },

  // 2. Update Live Bed & Resource Capacity (with audit logging and WebSocket broadcast)
  async updateCapacity(req, res, next) {
    try {
      const hospitalId = await resolveUserHospitalId(req);
      if (!hospitalId) {
        return sendError(res, 'No hospital associated with this staff account', 400);
      }

      const {
        emergencyBedsAvailable,
        icuBedsAvailable,
        ventilatorsAvailable,
        operatingRoomsAvailable,
        bloodUnitsAvailable,
        emergencyStatus,
        reason
      } = req.body;

      const currentResources = await prisma.hospitalResource.findUnique({
        where: { hospitalId }
      });

      const previousStatus = await prisma.hospital.findUnique({
        where: { id: hospitalId },
        select: { emergencyStatus: true }
      });

      // Prepare updated resource values
      const updatedResources = await prisma.hospitalResource.upsert({
        where: { hospitalId },
        create: {
          hospitalId,
          emergencyBedsAvailable: emergencyBedsAvailable !== undefined ? parseInt(emergencyBedsAvailable, 10) : 10,
          icuBedsAvailable: icuBedsAvailable !== undefined ? parseInt(icuBedsAvailable, 10) : 3,
          ventilatorsAvailable: ventilatorsAvailable !== undefined ? parseInt(ventilatorsAvailable, 10) : 4,
          operatingRoomsAvailable: operatingRoomsAvailable !== undefined ? parseInt(operatingRoomsAvailable, 10) : 2,
          bloodUnitsAvailable: bloodUnitsAvailable !== undefined ? parseInt(bloodUnitsAvailable, 10) : 40
        },
        update: {
          emergencyBedsAvailable: emergencyBedsAvailable !== undefined ? parseInt(emergencyBedsAvailable, 10) : undefined,
          icuBedsAvailable: icuBedsAvailable !== undefined ? parseInt(icuBedsAvailable, 10) : undefined,
          ventilatorsAvailable: ventilatorsAvailable !== undefined ? parseInt(ventilatorsAvailable, 10) : undefined,
          operatingRoomsAvailable: operatingRoomsAvailable !== undefined ? parseInt(operatingRoomsAvailable, 10) : undefined,
          bloodUnitsAvailable: bloodUnitsAvailable !== undefined ? parseInt(bloodUnitsAvailable, 10) : undefined
        }
      });

      // Update emergencyStatus if provided
      let updatedStatus = previousStatus?.emergencyStatus;
      if (emergencyStatus) {
        const h = await prisma.hospital.update({
          where: { id: hospitalId },
          data: { emergencyStatus }
        });
        updatedStatus = h.emergencyStatus;
      }

      // Record detailed Audit Log for compliance
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          userName: req.user.name,
          userRole: req.user.role,
          hospitalId,
          action: 'CAPACITY_UPDATE',
          entityType: 'BED',
          entityId: hospitalId,
          previousValue: JSON.stringify({
            emergencyBeds: currentResources?.emergencyBedsAvailable,
            icuBeds: currentResources?.icuBedsAvailable,
            ventilators: currentResources?.ventilatorsAvailable,
            status: previousStatus?.emergencyStatus
          }),
          newValue: JSON.stringify({
            emergencyBeds: updatedResources.emergencyBedsAvailable,
            icuBeds: updatedResources.icuBedsAvailable,
            ventilators: updatedResources.ventilatorsAvailable,
            status: updatedStatus
          }),
          details: reason || 'Routine shift capacity adjustment by authorized triage staff',
          ipAddress: req.ip || '127.0.0.1'
        }
      });

      // Broadcast changes in real-time across the network
      emitHospitalResourceUpdated({
        hospitalId,
        resources: updatedResources
      });

      if (emergencyStatus) {
        emitHospitalStatusUpdated({
          hospitalId,
          emergencyStatus
        });
      }

      return sendSuccess(
        res,
        { resources: updatedResources, emergencyStatus: updatedStatus, auditLog },
        'Hospital capacity updated and audited successfully'
      );
    } catch (err) {
      next(err);
    }
  },

  // 3. Get Admission Requests Queue for this hospital
  async getAdmissionRequests(req, res, next) {
    try {
      const hospitalId = await resolveUserHospitalId(req);
      const { status } = req.query;

      const where = { hospitalId };
      if (status && status !== 'ALL') {
        where.status = status;
      }

      const requests = await prisma.admissionRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      return sendSuccess(res, { requests, total: requests.length }, 'Admission requests retrieved');
    } catch (err) {
      next(err);
    }
  },

  // 4. Accept or Reject Admission Request
  async updateAdmissionRequest(req, res, next) {
    try {
      const { id } = req.params;
      const { status, rejectionReason, notes } = req.body;

      if (!['ACCEPTED', 'REJECTED', 'COMPLETED'].includes(status)) {
        return sendError(res, 'Invalid request status (must be ACCEPTED, REJECTED, or COMPLETED)', 400);
      }

      const existing = await prisma.admissionRequest.findUnique({
        where: { id }
      });

      if (!existing) {
        return sendError(res, 'Admission request not found', 404);
      }

      const updated = await prisma.admissionRequest.update({
        where: { id },
        data: {
          status,
          rejectionReason: status === 'REJECTED' ? rejectionReason || 'Capacity constraints' : null,
          notes: notes || existing.notes,
          reviewedBy: req.user.name,
          reviewedAt: new Date()
        }
      });

      // Audit log the admission decision
      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          userName: req.user.name,
          userRole: req.user.role,
          hospitalId: existing.hospitalId,
          action: 'ADMISSION_DECISION',
          entityType: 'ADMISSION_REQUEST',
          entityId: id,
          previousValue: existing.status,
          newValue: status,
          details: status === 'ACCEPTED'
            ? `Accepted admission for ${existing.patientName} (${existing.bedType})`
            : `Rejected admission for ${existing.patientName}. Reason: ${rejectionReason || 'No beds available'}`
        }
      });

      emitAdmissionRequestUpdated(updated);

      return sendSuccess(res, { request: updated }, `Admission request marked as ${status}`);
    } catch (err) {
      next(err);
    }
  },

  // 5. Patient Registry Management
  async getPatients(req, res, next) {
    try {
      const hospitalId = await resolveUserHospitalId(req);
      const patients = await prisma.patient.findMany({
        where: { hospitalId },
        orderBy: { admittedAt: 'desc' }
      });
      return sendSuccess(res, { patients, total: patients.length }, 'Patient list retrieved');
    } catch (err) {
      next(err);
    }
  },

  async createPatient(req, res, next) {
    try {
      const hospitalId = await resolveUserHospitalId(req);
      const { name, age, gender, triageLevel, bedType, ward, condition, attendingDoctor } = req.body;

      if (!name || !age || !condition) {
        return sendError(res, 'Name, age, and condition are required', 400);
      }

      const patient = await prisma.patient.create({
        data: {
          hospitalId,
          name,
          age: parseInt(age, 10),
          gender: gender || 'Other',
          triageLevel: triageLevel || '2 - High',
          bedType: bedType || 'ICU Bed',
          ward: ward || 'Emergency Bay',
          condition,
          attendingDoctor: attendingDoctor || req.user.name,
          status: 'ADMITTED'
        }
      });

      return sendSuccess(res, { patient }, 'Patient admitted successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  // 6. Hospital Staff Management (HOSPITAL_ADMIN only)
  async getStaff(req, res, next) {
    try {
      const hospitalId = await resolveUserHospitalId(req);
      const staff = await prisma.user.findMany({
        where: { hospitalId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          createdAt: true
        }
      });
      return sendSuccess(res, { staff }, 'Hospital staff roster fetched');
    } catch (err) {
      next(err);
    }
  },

  // 7. Hospital Audit Logs
  async getAuditLogs(req, res, next) {
    try {
      const hospitalId = await resolveUserHospitalId(req);
      const logs = await prisma.auditLog.findMany({
        where: { hospitalId },
        orderBy: { createdAt: 'desc' },
        take: 50
      });
      return sendSuccess(res, { logs }, 'Hospital audit logs fetched');
    } catch (err) {
      next(err);
    }
  },

  // 8. Hospital Settings
  async updateSettings(req, res, next) {
    try {
      const hospitalId = await resolveUserHospitalId(req);
      const { phone, address, contactEmail } = req.body;

      const updated = await prisma.hospital.update({
        where: { id: hospitalId },
        data: {
          phone: phone || undefined,
          address: address || undefined,
          contactEmail: contactEmail || undefined
        }
      });

      return sendSuccess(res, { hospital: updated }, 'Hospital settings updated');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = hospitalPortalController;
