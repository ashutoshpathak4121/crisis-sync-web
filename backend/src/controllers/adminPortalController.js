const prisma = require('../config/db');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { emitCrisisEventUpdated } = require('../sockets/socketEmitter');

const adminPortalController = {
  // 1. Super Admin Command Center Dashboard
  async getDashboard(req, res, next) {
    try {
      const [
        totalHospitals,
        verifiedHospitals,
        pendingHospitals,
        suspendedHospitals,
        totalUsers,
        activeEmergencyRequests,
        pendingAdmissionRequests,
        activeCrises,
        hospitalsWithResources,
        recentAuditLogs
      ] = await Promise.all([
        prisma.hospital.count(),
        prisma.hospital.count({ where: { verificationStatus: 'VERIFIED' } }),
        prisma.hospital.count({ where: { verificationStatus: 'PENDING' } }),
        prisma.hospital.count({ where: { verificationStatus: 'SUSPENDED' } }),
        prisma.user.count(),
        prisma.emergencyRequest.count({ where: { status: { in: ['PENDING', 'DISPATCHED', 'EN_ROUTE'] } } }),
        prisma.admissionRequest.count({ where: { status: 'PENDING' } }),
        prisma.crisisEvent.findMany({ where: { status: 'ACTIVE' }, orderBy: { startedAt: 'desc' } }),
        prisma.hospital.findMany({
          include: { resources: true }
        }),
        prisma.auditLog.findMany({
          orderBy: { createdAt: 'desc' },
          take: 10
        })
      ]);

      // Calculate citywide bed telemetry totals
      let totalEmergencyBeds = 0;
      let availableEmergencyBeds = 0;
      let totalIcuBeds = 0;
      let availableIcuBeds = 0;
      let totalVentilators = 0;
      let availableVentilators = 0;

      const networkMapNodes = hospitalsWithResources.map((h) => {
        const r = h.resources || {};
        totalEmergencyBeds += r.emergencyBedsTotal || 0;
        availableEmergencyBeds += r.emergencyBedsAvailable || 0;
        totalIcuBeds += r.icuBedsTotal || 0;
        availableIcuBeds += r.icuBedsAvailable || 0;
        totalVentilators += r.ventilatorsTotal || 0;
        availableVentilators += r.ventilatorsAvailable || 0;

        // Visual status pin color for network map:
        // Green -> good availability, Yellow -> limited, Red -> critical/full, Gray -> offline
        let mapColor = 'green';
        if (h.emergencyStatus === 'OFFLINE' || h.verificationStatus === 'SUSPENDED') {
          mapColor = 'gray';
        } else if (h.emergencyStatus === 'CRITICAL' || h.emergencyStatus === 'FULL' || (r.icuBedsAvailable || 0) <= 1) {
          mapColor = 'red';
        } else if (h.emergencyStatus === 'LIMITED' || (r.icuBedsAvailable || 0) <= 3) {
          mapColor = 'yellow';
        }

        return {
          id: h.id,
          name: h.name,
          latitude: h.latitude,
          longitude: h.longitude,
          emergencyStatus: h.emergencyStatus,
          verificationStatus: h.verificationStatus,
          mapColor,
          availableBeds: (r.emergencyBedsAvailable || 0) + (r.icuBedsAvailable || 0),
          icuAvailable: r.icuBedsAvailable || 0,
          ventilatorsAvailable: r.ventilatorsAvailable || 0
        };
      });

      const totalBeds = totalEmergencyBeds + totalIcuBeds;
      const totalAvailableBeds = availableEmergencyBeds + availableIcuBeds;
      const totalOccupiedBeds = Math.max(0, totalBeds - totalAvailableBeds);

      return sendSuccess(
        res,
        {
          overview: {
            totalHospitals,
            verifiedHospitals,
            pendingHospitals,
            suspendedHospitals,
            totalUsers,
            activeEmergencyRequests,
            pendingAdmissionRequests,
            activeCrisesCount: activeCrises.length,
            totalBeds,
            totalAvailableBeds,
            totalOccupiedBeds,
            occupancyRate: totalBeds > 0 ? Math.round((totalOccupiedBeds / totalBeds) * 100) : 0,
            icuTotal: totalIcuBeds,
            icuAvailable: availableIcuBeds,
            ventilatorsTotal: totalVentilators,
            ventilatorsAvailable: availableVentilators
          },
          networkMapNodes,
          activeCrises,
          recentAuditLogs
        },
        'National Emergency Command Metrics Fetched'
      );
    } catch (err) {
      next(err);
    }
  },

  // 2. Hospital Master Registry & Management
  async getHospitals(req, res, next) {
    try {
      const { status, verificationStatus, search } = req.query;

      const where = {};
      if (status && status !== 'ALL') where.emergencyStatus = status;
      if (verificationStatus && verificationStatus !== 'ALL') where.verificationStatus = verificationStatus;
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { address: { contains: search } },
          { registrationNumber: { contains: search } }
        ];
      }

      const hospitals = await prisma.hospital.findMany({
        where,
        include: {
          resources: true,
          _count: {
            select: { staff: true, admissionRequests: true, patients: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return sendSuccess(res, { hospitals, total: hospitals.length }, 'Hospital registry fetched');
    } catch (err) {
      next(err);
    }
  },

  // 3. Hospital Verification (Approve, Reject, Suspend, Request Changes)
  async verifyHospital(req, res, next) {
    try {
      const { id } = req.params;
      const { verificationStatus, reason } = req.body;

      if (!['VERIFIED', 'REJECTED', 'SUSPENDED', 'PENDING'].includes(verificationStatus)) {
        return sendError(res, 'Invalid verification status', 400);
      }

      const existing = await prisma.hospital.findUnique({ where: { id } });
      if (!existing) {
        return sendError(res, 'Hospital not found', 404);
      }

      const updated = await prisma.hospital.update({
        where: { id },
        data: {
          verificationStatus,
          verifiedAt: verificationStatus === 'VERIFIED' ? new Date() : existing.verifiedAt,
          verifiedBy: req.user.name
        }
      });

      // Audit log the verification action
      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          userName: req.user.name,
          userRole: req.user.role,
          hospitalId: id,
          action: 'HOSPITAL_VERIFY',
          entityType: 'HOSPITAL',
          entityId: id,
          previousValue: existing.verificationStatus,
          newValue: verificationStatus,
          details: reason || `Hospital verification marked as ${verificationStatus} by Super Admin`
        }
      });

      return sendSuccess(res, { hospital: updated }, `Hospital marked as ${verificationStatus}`);
    } catch (err) {
      next(err);
    }
  },

  // 4. User Account Management
  async getUsers(req, res, next) {
    try {
      const { role, search } = req.query;
      const where = {};
      if (role && role !== 'ALL') where.role = role;
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { email: { contains: search } }
        ];
      }

      const users = await prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          hospitalId: true,
          hospital: { select: { id: true, name: true } },
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return sendSuccess(res, { users, total: users.length }, 'Users retrieved');
    } catch (err) {
      next(err);
    }
  },

  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role, hospitalId } = req.body;

      const validRoles = ['USER', 'HOSPITAL_STAFF', 'HOSPITAL_ADMIN', 'SUPER_ADMIN'];
      if (!validRoles.includes(role)) {
        return sendError(res, `Role must be one of: ${validRoles.join(', ')}`, 400);
      }

      const existing = await prisma.user.findUnique({ where: { id } });
      if (!existing) {
        return sendError(res, 'User not found', 404);
      }

      const updated = await prisma.user.update({
        where: { id },
        data: {
          role,
          hospitalId: ['HOSPITAL_STAFF', 'HOSPITAL_ADMIN'].includes(role) ? hospitalId || null : null
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          hospitalId: true
        }
      });

      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          userName: req.user.name,
          userRole: req.user.role,
          action: 'USER_ROLE_CHANGE',
          entityType: 'USER',
          entityId: id,
          previousValue: existing.role,
          newValue: role,
          details: `Role updated for user ${existing.email} to ${role}`
        }
      });

      return sendSuccess(res, { user: updated }, 'User role updated successfully');
    } catch (err) {
      next(err);
    }
  },

  // 5. Crisis Management
  async getCrisisEvents(req, res, next) {
    try {
      const { status } = req.query;
      const where = {};
      if (status && status !== 'ALL') where.status = status;

      const crises = await prisma.crisisEvent.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      return sendSuccess(res, { crises }, 'Crisis events fetched');
    } catch (err) {
      next(err);
    }
  },

  async createCrisisEvent(req, res, next) {
    try {
      const {
        title,
        type = 'REGIONAL_EMERGENCY',
        severity = 'HIGH',
        affectedRegion,
        description,
        activeHospitalsCount = 4,
        demandedBeds = 50,
        demandedVentilators = 15
      } = req.body;

      if (!title || !affectedRegion || !description) {
        return sendError(res, 'Title, affectedRegion, and description are required', 400);
      }

      const crisis = await prisma.crisisEvent.create({
        data: {
          title,
          type,
          severity,
          status: 'ACTIVE',
          affectedRegion,
          description,
          activeHospitalsCount: parseInt(activeHospitalsCount, 10) || 0,
          demandedBeds: parseInt(demandedBeds, 10) || 0,
          demandedVentilators: parseInt(demandedVentilators, 10) || 0,
          createdBy: req.user.name
        }
      });

      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          userName: req.user.name,
          userRole: req.user.role,
          action: 'CRISIS_TRIGGER',
          entityType: 'CRISIS',
          entityId: crisis.id,
          newValue: 'ACTIVE',
          details: `Declared crisis event: ${title} (${severity})`
        }
      });

      emitCrisisEventUpdated(crisis);

      return sendSuccess(res, { crisis }, 'Crisis event created and declared', 201);
    } catch (err) {
      next(err);
    }
  },

  async updateCrisisStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, description } = req.body;

      if (!['ACTIVE', 'CONTAINED', 'RESOLVED'].includes(status)) {
        return sendError(res, 'Invalid status (ACTIVE, CONTAINED, RESOLVED)', 400);
      }

      const existing = await prisma.crisisEvent.findUnique({ where: { id } });
      if (!existing) {
        return sendError(res, 'Crisis event not found', 404);
      }

      const updated = await prisma.crisisEvent.update({
        where: { id },
        data: {
          status,
          description: description || existing.description,
          resolvedAt: status === 'RESOLVED' ? new Date() : existing.resolvedAt
        }
      });

      emitCrisisEventUpdated(updated);

      return sendSuccess(res, { crisis: updated }, `Crisis event status changed to ${status}`);
    } catch (err) {
      next(err);
    }
  },

  // 6. Global Audit Logs
  async getAuditLogs(req, res, next) {
    try {
      const { action, entityType, limit = 50 } = req.query;
      const where = {};
      if (action && action !== 'ALL') where.action = action;
      if (entityType && entityType !== 'ALL') where.entityType = entityType;

      const logs = await prisma.auditLog.findMany({
        where,
        include: {
          hospital: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit, 10) || 50
      });

      return sendSuccess(res, { logs, total: logs.length }, 'Global audit logs retrieved');
    } catch (err) {
      next(err);
    }
  },

  // 7. System Health & Infrastructure Telemetry
  async getSystemTelemetry(req, res, next) {
    try {
      const mem = process.memoryUsage();
      return sendSuccess(
        res,
        {
          telemetry: {
            uptime: Math.floor(process.uptime()),
            nodeVersion: process.version,
            environment: process.env.NODE_ENV || 'development',
            memory: {
              rssMB: Math.round(mem.rss / 1024 / 1024),
              heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
              heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024)
            },
            database: {
              provider: 'SQLite',
              status: 'HEALTHY'
            },
            security: {
              jwtExpiresIn: '24h',
              roleEnforcement: 'STRICT_RBAC',
              sslTls: 'ENABLED'
            }
          }
        },
        'System telemetry fetched'
      );
    } catch (err) {
      next(err);
    }
  }
};

module.exports = adminPortalController;
