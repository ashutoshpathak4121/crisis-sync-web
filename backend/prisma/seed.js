const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding CrisisSync Database ---');

  // Clean existing tables
  await prisma.resourceUpdateLog.deleteMany();
  await prisma.route.deleteMany();
  await prisma.ambulance.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.hospitalResource.deleteMany();
  await prisma.user.deleteMany();
  await prisma.hospital.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('DemoPassword123!', salt);

  // 1. Create Hospitals
  const hospitalsData = [
    {
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
      name: 'Max Super Speciality Hospital',
      address: '1, 2, Press Enclave Marg, Saket, New Delhi',
      latitude: 28.5276,
      longitude: 77.2144,
      phone: '+91-11-2651-5050',
      emergencyStatus: 'LIMITED',
      resources: {
        emergencyBedsTotal: 20,
        emergencyBedsAvailable: 3,
        icuBedsTotal: 8,
        icuBedsAvailable: 1,
        ventilatorsTotal: 6,
        ventilatorsAvailable: 1,
        operatingRoomsTotal: 4,
        operatingRoomsAvailable: 1,
        bloodUnitsAvailable: 30,
        traumaTeamAvailable: false
      }
    },
    {
      name: 'Fortis Escorts Heart Institute',
      address: 'Okhla Road, Sukhdev Vihar, New Delhi',
      latitude: 28.5603,
      longitude: 77.2764,
      phone: '+91-11-4713-5000',
      emergencyStatus: 'ACCEPTING',
      resources: {
        emergencyBedsTotal: 18,
        emergencyBedsAvailable: 6,
        icuBedsTotal: 10,
        icuBedsAvailable: 4,
        ventilatorsTotal: 8,
        ventilatorsAvailable: 5,
        operatingRoomsTotal: 4,
        operatingRoomsAvailable: 2,
        bloodUnitsAvailable: 40,
        traumaTeamAvailable: true
      }
    },
    {
      name: 'Sir Ganga Ram Emergency Hospital',
      address: 'Rajinder Nagar, New Delhi',
      latitude: 28.6385,
      longitude: 77.1895,
      phone: '+91-11-2575-0000',
      emergencyStatus: 'CRITICAL',
      resources: {
        emergencyBedsTotal: 22,
        emergencyBedsAvailable: 1,
        icuBedsTotal: 10,
        icuBedsAvailable: 0,
        ventilatorsTotal: 7,
        ventilatorsAvailable: 1,
        operatingRoomsTotal: 3,
        operatingRoomsAvailable: 0,
        bloodUnitsAvailable: 14,
        traumaTeamAvailable: false
      }
    },
    {
      name: 'Medanta Super Emergency Center',
      address: 'CH Bakhtawar Singh Road, Sector 38, Gurugram',
      latitude: 28.4394,
      longitude: 77.0426,
      phone: '+91-124-414-1414',
      emergencyStatus: 'ACCEPTING',
      resources: {
        emergencyBedsTotal: 35,
        emergencyBedsAvailable: 15,
        icuBedsTotal: 15,
        icuBedsAvailable: 6,
        ventilatorsTotal: 12,
        ventilatorsAvailable: 8,
        operatingRoomsTotal: 6,
        operatingRoomsAvailable: 4,
        bloodUnitsAvailable: 95,
        traumaTeamAvailable: true
      }
    },
    {
      name: 'Safdarjung Hospital Emergency Care',
      address: 'Ansari Nagar East, New Delhi',
      latitude: 28.5701,
      longitude: 77.2078,
      phone: '+91-11-2616-5060',
      emergencyStatus: 'FULL',
      resources: {
        emergencyBedsTotal: 30,
        emergencyBedsAvailable: 0,
        icuBedsTotal: 10,
        icuBedsAvailable: 0,
        ventilatorsTotal: 6,
        ventilatorsAvailable: 0,
        operatingRoomsTotal: 4,
        operatingRoomsAvailable: 0,
        bloodUnitsAvailable: 18,
        traumaTeamAvailable: false
      }
    },
    {
      name: 'Moolchand Medcity Emergency Wing',
      address: 'Lala Lajpat Rai Marg, Near Moolchand Metro, New Delhi',
      latitude: 28.5668,
      longitude: 77.2343,
      phone: '+91-11-4200-0000',
      emergencyStatus: 'ACCEPTING',
      resources: {
        emergencyBedsTotal: 16,
        emergencyBedsAvailable: 7,
        icuBedsTotal: 6,
        icuBedsAvailable: 2,
        ventilatorsTotal: 4,
        ventilatorsAvailable: 2,
        operatingRoomsTotal: 2,
        operatingRoomsAvailable: 1,
        bloodUnitsAvailable: 34,
        traumaTeamAvailable: true
      }
    }
  ];

  const createdHospitals = [];
  for (const h of hospitalsData) {
    const { resources, ...hospitalFields } = h;
    const hospital = await prisma.hospital.create({
      data: {
        ...hospitalFields,
        resources: {
          create: resources
        }
      },
      include: { resources: true }
    });
    createdHospitals.push(hospital);
  }
  console.log(`Created ${createdHospitals.length} hospitals.`);

  // 2. Create Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Commander Vikram Rao',
      email: 'admin@crisissync.demo',
      passwordHash,
      role: 'ADMIN'
    }
  });

  const hospitalUser = await prisma.user.create({
    data: {
      name: 'Nurse Incharge Sarah Thomas',
      email: 'hospital@crisissync.demo',
      passwordHash,
      role: 'HOSPITAL',
      hospitalId: createdHospitals[0].id // Apollo
    }
  });

  const paramedicUser = await prisma.user.create({
    data: {
      name: 'Paramedic Rohan Sharma',
      email: 'paramedic@crisissync.demo',
      passwordHash,
      role: 'PARAMEDIC'
    }
  });

  console.log('Created 3 demo users (Admin, Hospital Nurse, Paramedic).');

  // 3. Create Incidents
  const incidentData = [
    {
      type: 'Multi-Vehicle Collision',
      severity: 'CRITICAL',
      description: 'Highway crash involving 3 cars and a bus near Ring Road Flyover. Multiple traumas reported.',
      latitude: 28.5520,
      longitude: 77.2410,
      patientCount: 4,
      status: 'DISPATCHED'
    },
    {
      type: 'Industrial Chemical Leak',
      severity: 'HIGH',
      description: 'Factory hazardous chemical vapor release in Okhla Phase III with respiratory distress cases.',
      latitude: 28.5300,
      longitude: 77.2720,
      patientCount: 3,
      status: 'ON_SCENE'
    },
    {
      type: 'Severe Cardiac Event',
      severity: 'HIGH',
      description: '64yo male collapsed at Nehru Place commercial center, bystander CPR initiated.',
      latitude: 28.5490,
      longitude: 77.2520,
      patientCount: 1,
      status: 'REPORTED'
    },
    {
      type: 'Structural Scaffolding Collapse',
      severity: 'CRITICAL',
      description: 'Construction site accident near Saket Metro. 2 laborers trapped with head injuries.',
      latitude: 28.5210,
      longitude: 77.2080,
      patientCount: 2,
      status: 'TRANSPORTING'
    }
  ];

  const createdIncidents = [];
  for (const inc of incidentData) {
    const incident = await prisma.incident.create({ data: inc });
    createdIncidents.push(incident);
  }
  console.log(`Created ${createdIncidents.length} emergency incidents.`);

  // 4. Create Ambulances
  const ambulancesData = [
    {
      vehicleNumber: 'DL-01-EM-401',
      paramedicId: paramedicUser.id,
      latitude: 28.5480,
      longitude: 77.2450,
      status: 'EN_ROUTE',
      currentIncidentId: createdIncidents[0].id,
      destinationHospitalId: createdHospitals[0].id
    },
    {
      vehicleNumber: 'DL-01-EM-402',
      latitude: 28.5380,
      longitude: 77.2650,
      status: 'AT_SCENE',
      currentIncidentId: createdIncidents[1].id,
      destinationHospitalId: createdHospitals[3].id
    },
    {
      vehicleNumber: 'DL-02-EM-510',
      latitude: 28.5600,
      longitude: 77.2200,
      status: 'AVAILABLE',
      currentIncidentId: null,
      destinationHospitalId: null
    },
    {
      vehicleNumber: 'DL-03-EM-612',
      latitude: 28.5250,
      longitude: 77.2150,
      status: 'TRANSPORTING',
      currentIncidentId: createdIncidents[3].id,
      destinationHospitalId: createdHospitals[1].id
    },
    {
      vehicleNumber: 'HR-26-EM-889',
      latitude: 28.4500,
      longitude: 77.0600,
      status: 'AVAILABLE',
      currentIncidentId: null,
      destinationHospitalId: null
    },
    {
      vehicleNumber: 'DL-04-EM-990',
      latitude: 28.5800,
      longitude: 77.1950,
      status: 'AVAILABLE',
      currentIncidentId: null,
      destinationHospitalId: null
    },
    {
      vehicleNumber: 'DL-05-EM-112',
      latitude: 28.6200,
      longitude: 77.2200,
      status: 'AVAILABLE',
      currentIncidentId: null,
      destinationHospitalId: null
    }
  ];

  for (const amb of ambulancesData) {
    await prisma.ambulance.create({ data: amb });
  }
  console.log(`Created ${ambulancesData.length} active emergency ambulances.`);

  // 5. Initial Resource Audit Log
  await prisma.resourceUpdateLog.create({
    data: {
      hospitalId: createdHospitals[0].id,
      userId: hospitalUser.id,
      resourceType: 'emergencyBedsAvailable',
      oldValue: 12,
      newValue: 8
    }
  });

  console.log('--- CrisisSync Database Seed Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
