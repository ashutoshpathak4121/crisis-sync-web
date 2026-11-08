export const ROLES = {
  ADMIN: 'ADMIN',
  HOSPITAL: 'HOSPITAL',
  PARAMEDIC: 'PARAMEDIC'
};

export const HOSPITAL_STATUS = {
  ACCEPTING: {
    label: 'ACCEPTING',
    color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60',
    dot: 'bg-emerald-500 dark:bg-emerald-400'
  },
  LIMITED: {
    label: 'LIMITED',
    color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900/60',
    dot: 'bg-amber-500 dark:bg-amber-400'
  },
  CRITICAL: {
    label: 'CRITICAL',
    color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-400 border-orange-200 dark:border-orange-900/60',
    dot: 'bg-orange-500 dark:bg-orange-400'
  },
  FULL: {
    label: 'FULL',
    color: 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-400 border-red-200 dark:border-red-900/60',
    dot: 'bg-red-500 dark:bg-red-400'
  },
  OFFLINE: {
    label: 'OFFLINE',
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400'
  }
};

export const AMBULANCE_STATUS = {
  AVAILABLE: {
    label: 'AVAILABLE',
    color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60',
    dot: 'bg-emerald-500 dark:bg-emerald-400'
  },
  EN_ROUTE: {
    label: 'EN ROUTE',
    color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-900/60',
    dot: 'bg-blue-500 dark:bg-blue-400'
  },
  AT_SCENE: {
    label: 'AT SCENE',
    color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900/60',
    dot: 'bg-amber-500 dark:bg-amber-400'
  },
  TRANSPORTING: {
    label: 'TRANSPORTING',
    color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/60',
    dot: 'bg-indigo-500 dark:bg-indigo-400'
  },
  ARRIVED: {
    label: 'ARRIVED',
    color: 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-400 border-teal-200 dark:border-teal-900/60',
    dot: 'bg-teal-500 dark:bg-teal-400'
  },
  OFFLINE: {
    label: 'OFFLINE',
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400'
  }
};

export const INCIDENT_SEVERITY = {
  CRITICAL: {
    label: 'CRITICAL',
    color: 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-400 border-red-200 dark:border-red-900/60'
  },
  HIGH: {
    label: 'HIGH',
    color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-400 border-orange-200 dark:border-orange-900/60'
  },
  MEDIUM: {
    label: 'MEDIUM',
    color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900/60'
  },
  LOW: {
    label: 'LOW',
    color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60'
  }
};

export const DEMO_USERS = [
  {
    role: 'ADMIN',
    title: 'Healthcare Operator',
    name: 'Ashutosh Pathak',
    email: 'ashutosh@crisissync.demo',
    password: 'DemoPassword123!',
    description: 'Lead Healthcare Operator with full administrative and triage clearance.'
  },
  {
    role: 'ADMIN',
    title: 'Command Center Dispatcher',
    name: 'Commander Vikram Rao',
    email: 'admin@crisissync.demo',
    password: 'DemoPassword123!',
    description: 'Full strategic city-wide oversight, simulation controls, and incident triage.'
  },
  {
    role: 'HOSPITAL',
    title: 'Hospital / ER Chief',
    name: 'Dr. Aris Thorne (Chief Medical Officer)',
    email: 'hospital@crisissync.demo',
    password: 'DemoPassword123!',
    description: 'Instant live resource controls for Apollo Emergency Trauma Center.'
  },
  {
    role: 'PARAMEDIC',
    title: 'Ambulance / Paramedic',
    name: 'Paramedic Rohan Sharma',
    email: 'paramedic@crisissync.demo',
    password: 'DemoPassword123!',
    description: 'Real-time hospital capacity map, route navigation, and smart recommendation.'
  },
  {
    role: 'USER',
    title: 'Public Citizen / Patient',
    name: 'Aarav Sharma (Citizen / Patient)',
    email: 'user@crisissync.demo',
    password: 'DemoPassword123!',
    description: 'Public emergency portal: check live hospital availability, SOS, and emergency requests.'
  }
];

export const getRoleDestination = (role) => {
  if (['ADMIN', 'SUPER_ADMIN'].includes(role)) {
    return '/command';
  }
  if (['HOSPITAL', 'HOSPITAL_ADMIN'].includes(role)) {
    return '/hospital';
  }
  if (['PARAMEDIC', 'HOSPITAL_STAFF'].includes(role)) {
    return '/ambulance';
  }
  return '/overview';
};

