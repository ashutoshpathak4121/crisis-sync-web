const prisma = require('../config/db');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { emitAdmissionRequestCreated, emitEmergencyRequestCreated } = require('../sockets/socketEmitter');

const userPortalController = {
  // 1. Get all VERIFIED hospitals for the public directory
  async getVerifiedHospitals(req, res, next) {
    try {
      const { search, type, icuAvailable, bedAvailable } = req.query;

      const where = {
        verificationStatus: 'VERIFIED'
      };

      if (type && type !== 'ALL') {
        where.hospitalType = type;
      }

      if (search) {
        where.OR = [
          { name: { contains: search } },
          { address: { contains: search } }
        ];
      }

      const hospitals = await prisma.hospital.findMany({
        where,
        include: {
          resources: true
        },
        orderBy: { name: 'asc' }
      });

      // Filter by bed availability if requested
      let filtered = hospitals;
      if (icuAvailable === 'true') {
        filtered = filtered.filter((h) => (h.resources?.icuBedsAvailable || 0) > 0);
      }
      if (bedAvailable === 'true') {
        filtered = filtered.filter((h) => (h.resources?.emergencyBedsAvailable || 0) > 0);
      }

      return sendSuccess(res, { hospitals: filtered, total: filtered.length }, 'Verified hospitals fetched');
    } catch (err) {
      next(err);
    }
  },

  // 2. Get specific verified hospital details
  async getHospitalById(req, res, next) {
    try {
      const { id } = req.params;
      const hospital = await prisma.hospital.findUnique({
        where: { id },
        include: {
          resources: true
        }
      });

      if (!hospital) {
        return sendError(res, 'Hospital not found', 404);
      }

      return sendSuccess(res, { hospital }, 'Hospital details retrieved');
    } catch (err) {
      next(err);
    }
  },

  // 3. Create a new admission request (Patient / Citizen)
  async createAdmissionRequest(req, res, next) {
    try {
      const {
        hospitalId,
        patientName,
        age,
        gender = 'Unspecified',
        contactPhone,
        condition,
        triageLevel = '2 - High',
        bedType = 'Emergency Bed',
        notes
      } = req.body;

      if (!hospitalId || !patientName || !contactPhone || !condition) {
        return sendError(res, 'Missing required fields for admission request (hospitalId, patientName, contactPhone, condition)', 400);
      }

      const hospital = await prisma.hospital.findUnique({
        where: { id: hospitalId }
      });

      if (!hospital) {
        return sendError(res, 'Target hospital does not exist', 404);
      }

      const request = await prisma.admissionRequest.create({
        data: {
          userId: req.user ? req.user.id : null,
          hospitalId,
          patientName,
          age: parseInt(age, 10) || 30,
          gender,
          contactPhone,
          condition,
          triageLevel,
          bedType,
          notes,
          status: 'PENDING'
        },
        include: {
          hospital: {
            select: { id: true, name: true, phone: true }
          }
        }
      });

      // Real-time notification to the hospital management portal
      emitAdmissionRequestCreated(request);

      return sendSuccess(res, { request }, 'Admission request submitted successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  // 4. Get active user's admission requests
  async getUserAdmissionRequests(req, res, next) {
    try {
      const requests = await prisma.admissionRequest.findMany({
        where: {
          userId: req.user.id
        },
        include: {
          hospital: {
            select: { id: true, name: true, phone: true, address: true, emergencyStatus: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return sendSuccess(res, { requests }, 'User admission requests fetched');
    } catch (err) {
      next(err);
    }
  },

  // 5. Submit an Emergency SOS Request
  async createEmergencyRequest(req, res, next) {
    try {
      const {
        patientName,
        contactPhone,
        latitude,
        longitude,
        locationAddress,
        emergencyType = 'Trauma',
        acuity = 'CRITICAL',
        notes
      } = req.body;

      if (!patientName || !contactPhone || !locationAddress) {
        return sendError(res, 'Missing required emergency contact info', 400);
      }

      // Automatically find nearest accepting verified hospital
      const verifiedHospitals = await prisma.hospital.findMany({
        where: {
          verificationStatus: 'VERIFIED',
          emergencyStatus: { in: ['ACCEPTING', 'LIMITED'] }
        },
        take: 1
      });

      const nearestHospitalId = verifiedHospitals.length > 0 ? verifiedHospitals[0].id : null;

      const emergency = await prisma.emergencyRequest.create({
        data: {
          userId: req.user ? req.user.id : null,
          patientName,
          contactPhone,
          latitude: parseFloat(latitude) || 28.6139,
          longitude: parseFloat(longitude) || 77.2090,
          locationAddress,
          emergencyType,
          acuity,
          status: 'PENDING',
          assignedHospitalId: nearestHospitalId,
          notes
        }
      });

      emitEmergencyRequestCreated(emergency);

      return sendSuccess(res, { emergency }, 'Emergency request dispatched to emergency command grid', 201);
    } catch (err) {
      next(err);
    }
  },

  // 6. Get active user's emergency requests
  async getUserEmergencyRequests(req, res, next) {
    try {
      const emergencies = await prisma.emergencyRequest.findMany({
        where: {
          userId: req.user.id
        },
        orderBy: { createdAt: 'desc' }
      });

      return sendSuccess(res, { emergencies }, 'Emergency history fetched');
    } catch (err) {
      next(err);
    }
  },

  // 7. Get user emergency profile
  async getProfile(req, res, next) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true
        }
      });
      return sendSuccess(res, { profile: user }, 'User profile fetched');
    } catch (err) {
      next(err);
    }
  },

  // 8. Update user emergency profile
  async updateProfile(req, res, next) {
    try {
      const { name, phone } = req.body;
      const updated = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          name: name || undefined,
          phone: phone || undefined
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true
        }
      });
      return sendSuccess(res, { profile: updated }, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = userPortalController;
