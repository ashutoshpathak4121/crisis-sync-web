const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email({ tlds: false }).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('ADMIN', 'HOSPITAL', 'PARAMEDIC').default('PARAMEDIC'),
  hospitalId: Joi.string().uuid().allow(null, '')
});

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
  password: Joi.string().required()
});

const resourceUpdateSchema = Joi.object({
  emergencyBedsAvailable: Joi.number().integer().min(0),
  emergencyBedsTotal: Joi.number().integer().min(0),
  icuBedsAvailable: Joi.number().integer().min(0),
  icuBedsTotal: Joi.number().integer().min(0),
  ventilatorsAvailable: Joi.number().integer().min(0),
  ventilatorsTotal: Joi.number().integer().min(0),
  operatingRoomsAvailable: Joi.number().integer().min(0),
  operatingRoomsTotal: Joi.number().integer().min(0),
  bloodUnitsAvailable: Joi.number().integer().min(0),
  traumaTeamAvailable: Joi.boolean()
}).min(1);

const hospitalStatusSchema = Joi.object({
  emergencyStatus: Joi.string().valid('ACCEPTING', 'LIMITED', 'CRITICAL', 'FULL', 'OFFLINE').required()
});

const ambulanceLocationSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required()
});

const ambulanceStatusSchema = Joi.object({
  status: Joi.string().valid('AVAILABLE', 'EN_ROUTE', 'AT_SCENE', 'TRANSPORTING', 'ARRIVED', 'OFFLINE').required(),
  destinationHospitalId: Joi.string().uuid().allow(null, '')
});

const incidentCreateSchema = Joi.object({
  type: Joi.string().min(3).max(100).required(),
  severity: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').default('HIGH'),
  description: Joi.string().min(5).max(500).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  patientCount: Joi.number().integer().min(1).default(1)
});

const incidentUpdateSchema = Joi.object({
  status: Joi.string().valid('REPORTED', 'DISPATCHED', 'ON_SCENE', 'TRANSPORTING', 'RESOLVED'),
  severity: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
  patientCount: Joi.number().integer().min(0)
}).min(1);

const routeCalculateSchema = Joi.object({
  ambulanceId: Joi.string().uuid().required(),
  hospitalId: Joi.string().uuid().required()
});

module.exports = {
  registerSchema,
  loginSchema,
  resourceUpdateSchema,
  hospitalStatusSchema,
  ambulanceLocationSchema,
  ambulanceStatusSchema,
  incidentCreateSchema,
  incidentUpdateSchema,
  routeCalculateSchema
};
