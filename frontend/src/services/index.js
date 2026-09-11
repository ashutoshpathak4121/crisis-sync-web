import api from './api';

export const authService = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  register: async (userData) => {
    return api.post('/auth/register', userData);
  },

  getMe: async () => {
    return api.get('/auth/me');
  }
};

export const hospitalService = {
  getAll: async (params = {}) => {
    return api.get('/hospitals', { params });
  },

  getById: async (id) => {
    return api.get(`/hospitals/${id}`);
  },

  getResources: async (id) => {
    return api.get(`/hospitals/${id}/resources`);
  },

  updateResources: async (id, resourceUpdates) => {
    return api.put(`/hospitals/${id}/resources`, resourceUpdates);
  },

  updateStatus: async (id, emergencyStatus) => {
    return api.put(`/hospitals/${id}/status`, { emergencyStatus });
  },

  getAuditLogs: async (id) => {
    return api.get(`/hospitals/${id}/audit-logs`);
  }
};

export const ambulanceService = {
  getAll: async () => {
    return api.get('/ambulances');
  },

  getById: async (id) => {
    return api.get(`/ambulances/${id}`);
  },

  updateLocation: async (id, latitude, longitude) => {
    return api.put(`/ambulances/${id}/location`, { latitude, longitude });
  },

  updateStatus: async (id, status, destinationHospitalId) => {
    return api.put(`/ambulances/${id}/status`, { status, destinationHospitalId });
  }
};

export const incidentService = {
  getAll: async () => {
    return api.get('/incidents');
  },

  getById: async (id) => {
    return api.get(`/incidents/${id}`);
  },

  create: async (incidentData) => {
    return api.post('/incidents', incidentData);
  },

  update: async (id, updateData) => {
    return api.put(`/incidents/${id}`, updateData);
  }
};

export const routeService = {
  calculateRoute: async (ambulanceId, hospitalId) => {
    return api.post('/routes/calculate', { ambulanceId, hospitalId });
  },

  getRecommendations: async (params) => {
    return api.get('/routes/recommendations', { params });
  }
};

export const simulationService = {
  startSurge: async () => {
    return api.post('/simulation/start-surge');
  },

  reset: async () => {
    return api.post('/simulation/reset');
  },

  triggerIncident: async () => {
    return api.post('/simulation/trigger-incident');
  }
};
