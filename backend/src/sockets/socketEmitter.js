const logger = require('../utils/logger');

let ioInstance = null;

const initSocketEmitter = (io) => {
  ioInstance = io;
};

const getIO = () => {
  return ioInstance;
};

const emitHospitalResourceUpdated = (payload) => {
  if (!ioInstance) return;
  logger.info(`[Socket Broadcast] hospital:resource-updated -> Hospital ${payload.hospitalId}`);
  ioInstance.emit('hospital:resource-updated', {
    ...payload,
    timestamp: new Date().toISOString()
  });
};

const emitHospitalStatusUpdated = (payload) => {
  if (!ioInstance) return;
  logger.info(`[Socket Broadcast] hospital:status-updated -> Hospital ${payload.hospitalId} : ${payload.emergencyStatus}`);
  ioInstance.emit('hospital:status-updated', {
    ...payload,
    timestamp: new Date().toISOString()
  });
};

const emitAmbulanceLocationUpdated = (payload) => {
  if (!ioInstance) return;
  ioInstance.emit('ambulance:location-updated', {
    ...payload,
    timestamp: new Date().toISOString()
  });
};

const emitAmbulanceStatusUpdated = (payload) => {
  if (!ioInstance) return;
  logger.info(`[Socket Broadcast] ambulance:status-updated -> Ambulance ${payload.ambulanceId} : ${payload.status}`);
  ioInstance.emit('ambulance:status-updated', {
    ...payload,
    timestamp: new Date().toISOString()
  });
};

const emitIncidentCreated = (incident) => {
  if (!ioInstance) return;
  logger.info(`[Socket Broadcast] incident:created -> ${incident.type} (${incident.severity})`);
  ioInstance.emit('incident:created', {
    incident,
    timestamp: new Date().toISOString()
  });
};

const emitIncidentUpdated = (incident) => {
  if (!ioInstance) return;
  logger.info(`[Socket Broadcast] incident:updated -> Incident ${incident.id}`);
  ioInstance.emit('incident:updated', {
    incident,
    timestamp: new Date().toISOString()
  });
};

const emitAlert = (alert) => {
  if (!ioInstance) return;
  logger.info(`[Socket Broadcast] alert:broadcast -> [${alert.level}] ${alert.title}`);
  ioInstance.emit('alert:broadcast', {
    id: alert.id || `alert-${Date.now()}`,
    ...alert,
    timestamp: new Date().toISOString()
  });
};

const emitSimulationTick = (tickData) => {
  if (!ioInstance) return;
  ioInstance.emit('simulation:tick', {
    ...tickData,
    timestamp: new Date().toISOString()
  });
};

const emitAdmissionRequestCreated = (payload) => {
  if (!ioInstance) return;
  logger.info(`[Socket Broadcast] admission:created -> Request ${payload.id} for Hospital ${payload.hospitalId}`);
  ioInstance.emit('admission:created', {
    ...payload,
    timestamp: new Date().toISOString()
  });
};

const emitAdmissionRequestUpdated = (payload) => {
  if (!ioInstance) return;
  logger.info(`[Socket Broadcast] admission:updated -> Request ${payload.id} : ${payload.status}`);
  ioInstance.emit('admission:updated', {
    ...payload,
    timestamp: new Date().toISOString()
  });
};

const emitEmergencyRequestCreated = (payload) => {
  if (!ioInstance) return;
  logger.info(`[Socket Broadcast] emergency:created -> Emergency ${payload.id} (${payload.acuity})`);
  ioInstance.emit('emergency:created', {
    ...payload,
    timestamp: new Date().toISOString()
  });
};

const emitCrisisEventUpdated = (payload) => {
  if (!ioInstance) return;
  logger.info(`[Socket Broadcast] crisis:updated -> ${payload.title} (${payload.status})`);
  ioInstance.emit('crisis:updated', {
    ...payload,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  initSocketEmitter,
  getIO,
  emitHospitalResourceUpdated,
  emitHospitalStatusUpdated,
  emitAmbulanceLocationUpdated,
  emitAmbulanceStatusUpdated,
  emitIncidentCreated,
  emitIncidentUpdated,
  emitAlert,
  emitSimulationTick,
  emitAdmissionRequestCreated,
  emitAdmissionRequestUpdated,
  emitEmergencyRequestCreated,
  emitCrisisEventUpdated
};
