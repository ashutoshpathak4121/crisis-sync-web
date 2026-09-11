export const ROLES = {
  ADMIN: 'ADMIN',
  HOSPITAL: 'HOSPITAL',
  PARAMEDIC: 'PARAMEDIC'
};

export const HOSPITAL_STATUS = {
  ACCEPTING: {
    label: 'ACCEPTING',
    color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400'
  },
  LIMITED: {
    label: 'LIMITED',
    color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400'
  },
  CRITICAL: {
    label: 'CRITICAL',
    color: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    dot: 'bg-orange-400'
  },
  FULL: {
    label: 'FULL',
    color: 'bg-red-500/15 text-red-400 border-red-500/30',
    dot: 'bg-red-400'
  },
  OFFLINE: {
    label: 'OFFLINE',
    color: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    dot: 'bg-slate-400'
  }
};

export const AMBULANCE_STATUS = {
  AVAILABLE: {
    label: 'AVAILABLE',
    color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400'
  },
  EN_ROUTE: {
    label: 'EN ROUTE',
    color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    dot: 'bg-cyan-400'
  },
  AT_SCENE: {
    label: 'AT SCENE',
    color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    dot: 'bg-indigo-400'
  },
  TRANSPORTING: {
    label: 'TRANSPORTING',
    color: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    dot: 'bg-purple-400'
  },
  ARRIVED: {
    label: 'ARRIVED',
    color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    dot: 'bg-blue-400'
  },
  OFFLINE: {
    label: 'OFFLINE',
    color: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    dot: 'bg-slate-400'
  }
};

export const INCIDENT_SEVERITY = {
  CRITICAL: {
    label: 'CRITICAL',
    color: 'bg-red-500/20 text-red-400 border-red-500/40'
  },
  HIGH: {
    label: 'HIGH',
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/40'
  },
  MEDIUM: {
    label: 'MEDIUM',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/40'
  },
  LOW: {
    label: 'LOW',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
  }
};

export const DEMO_USERS = [
  {
    role: 'ADMIN',
    title: 'Command Center Dispatcher',
    email: 'admin@crisissync.demo',
    password: 'DemoPassword123!',
    description: 'Full strategic city-wide oversight, simulation controls, and incident triage.'
  },
  {
    role: 'HOSPITAL',
    title: 'Hospital / ER Nurse',
    email: 'hospital@crisissync.demo',
    password: 'DemoPassword123!',
    description: 'Instant live resource controls for Apollo Emergency Trauma Center.'
  },
  {
    role: 'PARAMEDIC',
    title: 'Ambulance / Paramedic',
    email: 'paramedic@crisissync.demo',
    password: 'DemoPassword123!',
    description: 'Real-time hospital capacity map, route navigation, and smart recommendation.'
  }
];
