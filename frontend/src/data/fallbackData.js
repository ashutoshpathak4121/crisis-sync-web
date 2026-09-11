// Standalone offline / cold-start fallback data for frontend deployments
export const FALLBACK_HOSPITALS = [
  {
    id: 'hosp-1',
    name: 'Apollo Emergency Trauma Center',
    address: 'Sarita Vihar, Mathura Road, New Delhi',
    latitude: 28.5355,
    longitude: 77.2882,
    phone: '+91-11-2692-5858',
    emergencyStatus: 'ACCEPTING',
    resources: {
      emergencyBedsTotal: 25,
      emergencyBedsAvailable: 8,
      icuBedsTotal: 12,
      icuBedsAvailable: 3,
      ventilatorsTotal: 8,
      ventilatorsAvailable: 4,
      operatingRoomsTotal: 5,
      operatingRoomsAvailable: 2,
      bloodUnitsAvailable: 52,
      traumaTeamAvailable: true
    }
  },
  {
    id: 'hosp-2',
    name: 'AIIMS Apex Trauma Center',
    address: 'Ring Road, Safdarjung Enclave, New Delhi',
    latitude: 28.5672,
    longitude: 77.2100,
    phone: '+91-11-2658-8500',
    emergencyStatus: 'ACCEPTING',
    resources: {
      emergencyBedsTotal: 40,
      emergencyBedsAvailable: 12,
      icuBedsTotal: 20,
      icuBedsAvailable: 5,
      ventilatorsTotal: 15,
      ventilatorsAvailable: 6,
      operatingRoomsTotal: 8,
      operatingRoomsAvailable: 3,
      bloodUnitsAvailable: 85,
      traumaTeamAvailable: true
    }
  },
  {
    id: 'hosp-3',
    name: 'Max Super Speciality Hospital',
    address: 'Saket, Press Enclave Road, New Delhi',
    latitude: 28.5284,
    longitude: 77.2114,
    phone: '+91-11-2651-5050',
    emergencyStatus: 'LIMITED',
    resources: {
      emergencyBedsTotal: 30,
      emergencyBedsAvailable: 2,
      icuBedsTotal: 15,
      icuBedsAvailable: 1,
      ventilatorsTotal: 10,
      ventilatorsAvailable: 2,
      operatingRoomsTotal: 6,
      operatingRoomsAvailable: 1,
      bloodUnitsAvailable: 34,
      traumaTeamAvailable: true
    }
  },
  {
    id: 'hosp-4',
    name: 'Fortis Escorts Heart & Trauma Institute',
    address: 'Okhla Road, New Friends Colony, New Delhi',
    latitude: 28.5604,
    longitude: 77.2735,
    phone: '+91-11-4713-5000',
    emergencyStatus: 'ACCEPTING',
    resources: {
      emergencyBedsTotal: 20,
      emergencyBedsAvailable: 6,
      icuBedsTotal: 10,
      icuBedsAvailable: 4,
      ventilatorsTotal: 6,
      ventilatorsAvailable: 3,
      operatingRoomsTotal: 4,
      operatingRoomsAvailable: 2,
      bloodUnitsAvailable: 40,
      traumaTeamAvailable: true
    }
  },
  {
    id: 'hosp-5',
    name: 'Safdarjung Hospital Emergency Care',
    address: 'Ansari Nagar East, New Delhi',
    latitude: 28.5700,
    longitude: 77.2070,
    phone: '+91-11-2616-5060',
    emergencyStatus: 'CRITICAL',
    resources: {
      emergencyBedsTotal: 35,
      emergencyBedsAvailable: 1,
      icuBedsTotal: 18,
      icuBedsAvailable: 0,
      ventilatorsTotal: 12,
      ventilatorsAvailable: 1,
      operatingRoomsTotal: 7,
      operatingRoomsAvailable: 0,
      bloodUnitsAvailable: 18,
      traumaTeamAvailable: false
    }
  },
  {
    id: 'hosp-6',
    name: 'Sir Ganga Ram Hospital',
    address: 'Rajinder Nagar, New Delhi',
    latitude: 28.6385,
    longitude: 77.1895,
    phone: '+91-11-2575-0000',
    emergencyStatus: 'FULL',
    resources: {
      emergencyBedsTotal: 28,
      emergencyBedsAvailable: 0,
      icuBedsTotal: 14,
      icuBedsAvailable: 0,
      ventilatorsTotal: 8,
      ventilatorsAvailable: 0,
      operatingRoomsTotal: 5,
      operatingRoomsAvailable: 0,
      bloodUnitsAvailable: 12,
      traumaTeamAvailable: false
    }
  },
  {
    id: 'hosp-7',
    name: 'Medanta Emergency Medical Corridor',
    address: 'CH Bakhtawar Singh Road, Sector 38, Gurugram',
    latitude: 28.4394,
    longitude: 77.0428,
    phone: '+91-124-414-1414',
    emergencyStatus: 'ACCEPTING',
    resources: {
      emergencyBedsTotal: 50,
      emergencyBedsAvailable: 18,
      icuBedsTotal: 25,
      icuBedsAvailable: 8,
      ventilatorsTotal: 20,
      ventilatorsAvailable: 11,
      operatingRoomsTotal: 10,
      operatingRoomsAvailable: 4,
      bloodUnitsAvailable: 110,
      traumaTeamAvailable: true
    }
  },
  {
    id: 'hosp-8',
    name: 'Indraprastha Medical Center',
    address: 'Delhi-Mathura Road, New Delhi',
    latitude: 28.5300,
    longitude: 77.2950,
    phone: '+91-11-2987-1000',
    emergencyStatus: 'ACCEPTING',
    resources: {
      emergencyBedsTotal: 22,
      emergencyBedsAvailable: 9,
      icuBedsTotal: 10,
      icuBedsAvailable: 4,
      ventilatorsTotal: 7,
      ventilatorsAvailable: 5,
      operatingRoomsTotal: 4,
      operatingRoomsAvailable: 2,
      bloodUnitsAvailable: 45,
      traumaTeamAvailable: true
    }
  }
];

export const FALLBACK_AMBULANCES = [
  {
    id: 'amb-1',
    vehicleNumber: 'DL-01-EM-1044',
    status: 'AVAILABLE',
    latitude: 28.5480,
    longitude: 77.2450,
    destinationHospitalId: null,
    destinationHospital: null,
    paramedic: { id: 'p-1', name: 'Paramedic Sarah Jenkins', email: 'paramedic@crisissync.demo' }
  },
  {
    id: 'amb-2',
    vehicleNumber: 'DL-01-EM-2088',
    status: 'EN_ROUTE',
    latitude: 28.5600,
    longitude: 77.2200,
    destinationHospitalId: 'hosp-2',
    destinationHospital: { id: 'hosp-2', name: 'AIIMS Apex Trauma Center' },
    paramedic: { id: 'p-2', name: 'Paramedic Dave Miller', email: 'dave@crisissync.demo' }
  },
  {
    id: 'amb-3',
    vehicleNumber: 'DL-02-EM-3112',
    status: 'AT_SCENE',
    latitude: 28.5300,
    longitude: 77.2700,
    destinationHospitalId: null,
    destinationHospital: null,
    paramedic: { id: 'p-3', name: 'Paramedic Priya Sharma', email: 'priya@crisissync.demo' }
  },
  {
    id: 'amb-4',
    vehicleNumber: 'DL-03-EM-4099',
    status: 'AVAILABLE',
    latitude: 28.5800,
    longitude: 77.2300,
    destinationHospitalId: null,
    destinationHospital: null,
    paramedic: { id: 'p-4', name: 'Paramedic Marcus Vance', email: 'marcus@crisissync.demo' }
  },
  {
    id: 'amb-5',
    vehicleNumber: 'DL-04-EM-5120',
    status: 'AVAILABLE',
    latitude: 28.5200,
    longitude: 77.2000,
    destinationHospitalId: null,
    destinationHospital: null,
    paramedic: { id: 'p-5', name: 'Paramedic Chloe Zhang', email: 'chloe@crisissync.demo' }
  },
  {
    id: 'amb-6',
    vehicleNumber: 'DL-05-EM-6601',
    status: 'AVAILABLE',
    latitude: 28.6200,
    longitude: 77.2100,
    destinationHospitalId: null,
    destinationHospital: null,
    paramedic: { id: 'p-6', name: 'Paramedic Alex Rivera', email: 'alex@crisissync.demo' }
  },
  {
    id: 'amb-7',
    vehicleNumber: 'DL-06-EM-7789',
    status: 'AVAILABLE',
    latitude: 28.4500,
    longitude: 77.0500,
    destinationHospitalId: null,
    destinationHospital: null,
    paramedic: { id: 'p-7', name: 'Paramedic Tariq Al-Mansoor', email: 'tariq@crisissync.demo' }
  }
];

export const FALLBACK_INCIDENTS = [
  {
    id: 'inc-1',
    type: 'Multi-Vehicle Highway Collision',
    severity: 'CRITICAL',
    description: '4-vehicle collision on Outer Ring Road near Nehru Place flyover. Multiple casualties reported.',
    latitude: 28.5495,
    longitude: 77.2520,
    patientCount: 6,
    status: 'DISPATCHED'
  },
  {
    id: 'inc-2',
    type: 'Commercial Structural Fire',
    severity: 'HIGH',
    description: 'Second-floor warehouse fire with smoke inhalation casualties in Okhla Industrial Area Phase-III.',
    latitude: 28.5305,
    longitude: 77.2750,
    patientCount: 3,
    status: 'ON_SCENE'
  },
  {
    id: 'inc-3',
    type: 'Construction Site Scaffold Collapse',
    severity: 'MEDIUM',
    description: 'Scaffold structural failure at commercial metro extension site.',
    latitude: 28.5720,
    longitude: 77.2280,
    patientCount: 2,
    status: 'REPORTED'
  }
];
