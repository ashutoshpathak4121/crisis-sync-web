const bcrypt = require('bcryptjs');
const prisma = require('../src/config/db');
const env = require('../src/config/env');

async function seedPortals() {
  console.log('--- Initializing Portal Database Seed ---');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(env.DEMO_PASSWORD, salt);

  // 1. Get or create a sample primary hospital
  let apollo = await prisma.hospital.findFirst({
    where: { name: { contains: 'Apollo' } }
  });

  if (!apollo) {
    apollo = await prisma.hospital.create({
      data: {
        name: 'Apollo Emergency Trauma Center',
        address: 'Sarita Vihar, Mathura Road, New Delhi',
        latitude: 28.5355,
        longitude: 77.2910,
        phone: '+91-11-26925858',
        emergencyStatus: 'ACCEPTING',
        verificationStatus: 'VERIFIED',
        registrationNumber: 'DL-HOSP-2023-4412',
        hospitalType: 'SUPER_SPECIALTY',
        contactEmail: 'emergency@apollo.demo',
        verifiedAt: new Date()
      }
    });
  } else {
    await prisma.hospital.update({
      where: { id: apollo.id },
      data: {
        verificationStatus: 'VERIFIED',
        registrationNumber: 'DL-HOSP-2023-4412',
        hospitalType: 'SUPER_SPECIALTY',
        contactEmail: 'emergency@apollo.demo',
        verifiedAt: new Date()
      }
    });
  }

  // Ensure Apollo has resources
  await prisma.hospitalResource.upsert({
    where: { hospitalId: apollo.id },
    create: {
      hospitalId: apollo.id,
      emergencyBedsTotal: 30,
      emergencyBedsAvailable: 8,
      icuBedsTotal: 15,
      icuBedsAvailable: 4,
      ventilatorsTotal: 8,
      ventilatorsAvailable: 6,
      operatingRoomsTotal: 4,
      operatingRoomsAvailable: 2,
      bloodUnitsAvailable: 48,
      traumaTeamAvailable: true
    },
    update: {
      emergencyBedsTotal: 30,
      emergencyBedsAvailable: 8,
      icuBedsTotal: 15,
      icuBedsAvailable: 4
    }
  });

  // 2. Ensure other hospitals have verification status
  const otherHospitals = await prisma.hospital.findMany({
    where: { id: { not: apollo.id } }
  });

  for (let i = 0; i < otherHospitals.length; i++) {
    const h = otherHospitals[i];
    let vStatus = 'VERIFIED';
    if (i === otherHospitals.length - 1) vStatus = 'PENDING';
    if (i === otherHospitals.length - 2) vStatus = 'SUSPENDED';

    await prisma.hospital.update({
      where: { id: h.id },
      data: {
        verificationStatus: vStatus,
        registrationNumber: `DL-HOSP-202${i}-98${i}0`,
        hospitalType: i % 2 === 0 ? 'TRAUMA_CENTER' : 'GENERAL',
        contactEmail: `contact@${h.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.demo`,
        verifiedAt: vStatus === 'VERIFIED' ? new Date() : null
      }
    });
  }

  // If we don't have a pending hospital, create one for the admin verification screen
  const pendingHosp = await prisma.hospital.findFirst({
    where: { verificationStatus: 'PENDING' }
  });

  if (!pendingHosp) {
    await prisma.hospital.create({
      data: {
        name: 'Metro City Trauma Hospital',
        address: 'Sector 62, Electronic City, Noida, NCR',
        latitude: 28.6280,
        longitude: 77.3649,
        phone: '+91-120-4567890',
        emergencyStatus: 'LIMITED',
        verificationStatus: 'PENDING',
        registrationNumber: 'UP-NCR-2026-9041',
        hospitalType: 'TRAUMA_CENTER',
        contactEmail: 'compliance@metrocitytrauma.demo',
        documentsUrl: 'https://crisissync.demo/docs/metro-city-accreditation.pdf',
        resources: {
          create: {
            emergencyBedsTotal: 25,
            emergencyBedsAvailable: 10,
            icuBedsTotal: 8,
            icuBedsAvailable: 3,
            ventilatorsTotal: 5,
            ventilatorsAvailable: 2,
            bloodUnitsAvailable: 30
          }
        }
      }
    });
  }

  // 3. Seed / Update standard users with proper roles
  const usersToSeed = [
    {
      email: 'admin@crisissync.demo',
      name: 'Dr. Vikram Malhotra (Admin)',
      role: 'SUPER_ADMIN',
      hospitalId: null,
      phone: '+91-9811000001'
    },
    {
      email: 'ashutosh@crisissync.demo',
      name: 'Ashutosh Pathak (Super Admin)',
      role: 'SUPER_ADMIN',
      hospitalId: null,
      phone: '+91-9811000002'
    },
    {
      email: 'hospital@crisissync.demo',
      name: 'Dr. Aris Thorne (Chief Medical Officer)',
      role: 'HOSPITAL_ADMIN',
      hospitalId: apollo.id,
      phone: '+91-9811000003'
    },
    {
      email: 'staff@crisissync.demo',
      name: 'Nurse Sarah Jenkins (ER Triage Officer)',
      role: 'HOSPITAL_STAFF',
      hospitalId: apollo.id,
      phone: '+91-9811000004'
    },
    {
      email: 'user@crisissync.demo',
      name: 'Aarav Sharma (Patient / Citizen)',
      role: 'USER',
      hospitalId: null,
      phone: '+91-9811000005'
    }
  ];

  let sampleUser = null;
  for (const u of usersToSeed) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      const updated = await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: u.name,
          role: u.role,
          hospitalId: u.hospitalId,
          passwordHash,
          phone: u.phone
        }
      });
      if (u.role === 'USER') sampleUser = updated;
    } else {
      const created = await prisma.user.create({
        data: {
          email: u.email,
          name: u.name,
          role: u.role,
          hospitalId: u.hospitalId,
          passwordHash,
          phone: u.phone
        }
      });
      if (u.role === 'USER') sampleUser = created;
    }
  }

  // 4. Seed Admission Requests
  const existingReqs = await prisma.admissionRequest.count();
  if (existingReqs === 0 && sampleUser) {
    await prisma.admissionRequest.createMany({
      data: [
        {
          userId: sampleUser.id,
          hospitalId: apollo.id,
          patientName: 'Rameshwar Nath',
          age: 58,
          gender: 'Male',
          contactPhone: '+91-9876543210',
          condition: 'Acute Bilateral Pneumonia with severe hypoxemia (SpO2 84%)',
          triageLevel: '1 - Critical',
          bedType: 'ICU Bed',
          status: 'PENDING',
          notes: 'Patient requiring mechanical ventilation on arrival.'
        },
        {
          userId: sampleUser.id,
          hospitalId: apollo.id,
          patientName: 'Kiran Deep Kaur',
          age: 34,
          gender: 'Female',
          contactPhone: '+91-9876543211',
          condition: 'Polytrauma following high-speed motor vehicle collision',
          triageLevel: '2 - High',
          bedType: 'Emergency Bed',
          status: 'ACCEPTED',
          notes: 'Pelvic stabilization in transit. Assigned to Trauma Bay 3.',
          reviewedBy: 'Dr. Aris Thorne'
        },
        {
          userId: sampleUser.id,
          hospitalId: apollo.id,
          patientName: 'Devika Pillai',
          age: 72,
          gender: 'Female',
          contactPhone: '+91-9876543212',
          condition: 'Mild persistent chest discomfort, vitals stable',
          triageLevel: '3 - Medium',
          bedType: 'Emergency Bed',
          status: 'REJECTED',
          rejectionReason: 'Emergency wing currently at surge capacity; patient redirected to Safdarjung Care Center',
          reviewedBy: 'Dr. Aris Thorne'
        }
      ]
    });
    console.log('Seed: Admission Requests created.');
  }

  // 5. Seed Emergency Requests (SOS)
  const existingEmergencies = await prisma.emergencyRequest.count();
  if (existingEmergencies === 0) {
    await prisma.emergencyRequest.createMany({
      data: [
        {
          patientName: 'Pooja Iyer',
          contactPhone: '+91-9811223344',
          latitude: 28.5355,
          longitude: 77.2910,
          locationAddress: 'Ring Road intersection near Nehru Place, South Delhi',
          emergencyType: 'Trauma',
          acuity: 'CRITICAL',
          status: 'DISPATCHED',
          assignedHospitalId: apollo.id,
          notes: 'Motorcycle collision. Bleeding controlled, ambulance en route.'
        },
        {
          patientName: 'Girish Kumar',
          contactPhone: '+91-9811223355',
          latitude: 28.5672,
          longitude: 77.2100,
          locationAddress: 'Safdarjung Enclave B-Block, New Delhi',
          emergencyType: 'Cardiac',
          acuity: 'CRITICAL',
          status: 'RESOLVED',
          assignedHospitalId: apollo.id,
          notes: 'STEMI suspected. Transferred to catheterization lab.'
        }
      ]
    });
    console.log('Seed: Emergency Requests created.');
  }

  // 6. Seed Crisis Events
  const existingCrises = await prisma.crisisEvent.count();
  if (existingCrises === 0) {
    await prisma.crisisEvent.createMany({
      data: [
        {
          title: 'Industrial Chemical Flare & Respiratory Surge - Okhla Zone',
          type: 'MASS_ACCIDENT',
          severity: 'CRITICAL',
          status: 'ACTIVE',
          affectedRegion: 'South Delhi & Okhla Industrial Area',
          description: 'Toxic gas venting incident leading to localized chemical pneumonitis cases across multiple neighborhoods. Rapid surge protocol engaged for ICU beds and oxygen therapy.',
          activeHospitalsCount: 5,
          demandedBeds: 45,
          demandedVentilators: 18,
          createdBy: 'State Emergency Command Center'
        },
        {
          title: 'Seasonal Severe Dengue Hemorrhagic Wave',
          type: 'EPIDEMIC',
          severity: 'MEDIUM',
          status: 'ACTIVE',
          affectedRegion: 'Delhi NCR Metropolitan',
          description: 'Regional elevation in platelet unit consumption and pediatric high-dependency admissions across NCR centers.',
          activeHospitalsCount: 8,
          demandedBeds: 120,
          demandedVentilators: 10,
          createdBy: 'National Health Directorate'
        }
      ]
    });
    console.log('Seed: Crisis Events created.');
  }

  // 7. Seed Patients in Hospital
  const existingPatients = await prisma.patient.count();
  if (existingPatients === 0) {
    await prisma.patient.createMany({
      data: [
        {
          hospitalId: apollo.id,
          name: 'Mohit Chadha',
          age: 48,
          gender: 'Male',
          triageLevel: '2 - High',
          bedType: 'ICU Bed',
          ward: 'Intensive Care Unit Bay 2',
          condition: 'Acute Myocardial Infarction Post-Angioplasty',
          status: 'ADMITTED',
          attendingDoctor: 'Dr. Aris Thorne'
        },
        {
          hospitalId: apollo.id,
          name: 'Kavita Rao',
          age: 63,
          gender: 'Female',
          triageLevel: '1 - Critical',
          bedType: 'Ventilator Bed',
          ward: 'Trauma ICU Pod 1',
          condition: 'Severe Sepsis with ARDS',
          status: 'ADMITTED',
          attendingDoctor: 'Dr. Sarah Patel'
        },
        {
          hospitalId: apollo.id,
          name: 'Anand Mehra',
          age: 35,
          gender: 'Male',
          triageLevel: '3 - Medium',
          bedType: 'Emergency Bed',
          ward: 'Emergency Observation Bay 4',
          condition: 'Right Femur Fracture & Lacerations',
          status: 'IN_SURGERY',
          attendingDoctor: 'Dr. Vivek Sengupta'
        }
      ]
    });
    console.log('Seed: Hospital Patients created.');
  }

  // 8. Seed Audit Logs
  const existingLogs = await prisma.auditLog.count();
  if (existingLogs === 0) {
    await prisma.auditLog.createMany({
      data: [
        {
          hospitalId: apollo.id,
          userName: 'Dr. Aris Thorne',
          userRole: 'HOSPITAL_ADMIN',
          action: 'CAPACITY_UPDATE',
          entityType: 'BED',
          entityId: apollo.id,
          previousValue: 'ICU Available: 6',
          newValue: 'ICU Available: 4',
          details: 'Emergency hold placed for incoming multi-casualty dispatch.',
          ipAddress: '127.0.0.1'
        },
        {
          hospitalId: apollo.id,
          userName: 'Nurse Sarah Jenkins',
          userRole: 'HOSPITAL_STAFF',
          action: 'ADMISSION_DECISION',
          entityType: 'ADMISSION_REQUEST',
          details: 'Accepted admission request for Kiran Deep Kaur (Trauma Bay 3 assigned).',
          ipAddress: '127.0.0.1'
        },
        {
          userName: 'Ashutosh Pathak (Super Admin)',
          userRole: 'SUPER_ADMIN',
          action: 'CRISIS_TRIGGER',
          entityType: 'CRISIS',
          details: 'Activated Regional Surge Protocol: Industrial Chemical Flare - Okhla Zone.',
          ipAddress: '127.0.0.1'
        },
        {
          userName: 'Ashutosh Pathak (Super Admin)',
          userRole: 'SUPER_ADMIN',
          action: 'HOSPITAL_VERIFY',
          entityType: 'HOSPITAL',
          entityId: apollo.id,
          details: 'Verified accreditation and trauma designation for Apollo Emergency Trauma Center.',
          ipAddress: '127.0.0.1'
        }
      ]
    });
    console.log('Seed: Audit Logs created.');
  }

  console.log('--- Database Seed Complete! ---');
  process.exit(0);
}

seedPortals().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
