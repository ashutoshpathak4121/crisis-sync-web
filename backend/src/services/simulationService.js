const prisma = require('../config/db');
const resourceService = require('./resourceService');
const {
  emitSimulationTick,
  emitAlert,
  emitIncidentCreated
} = require('../sockets/socketEmitter');
const logger = require('../utils/logger');

let activeSimulationTimer = null;
let currentSimulationStep = 0;
let isSimulating = false;

const simulationService = {
  isSimulating() {
    return isSimulating;
  },

  async startSurgeSimulation() {
    if (isSimulating) {
      return { status: 'already_running', step: currentSimulationStep };
    }

    // Find primary demo hospital (Apollo or first hospital)
    const hospital = await prisma.hospital.findFirst({
      where: { name: { contains: 'Apollo' } },
      include: { resources: true }
    }) || await prisma.hospital.findFirst({ include: { resources: true } });

    if (!hospital) {
      throw new Error('No hospital found to run simulation on');
    }

    isSimulating = true;
    currentSimulationStep = 0;

    const surgeSteps = [
      {
        step: 1,
        bedsAvailable: 15,
        icuAvailable: 3,
        description: 'Casualty Surge Step 1: Initial casualties arrive. ER beds reduce from 20 to 15.',
        status: 'ACCEPTING'
      },
      {
        step: 2,
        bedsAvailable: 10,
        icuAvailable: 2,
        description: 'Casualty Surge Step 2: Influx intensifies. ER beds drop to 10.',
        status: 'ACCEPTING'
      },
      {
        step: 3,
        bedsAvailable: 5,
        icuAvailable: 1,
        description: 'Casualty Surge Step 3: High crowding. ER beds drop to 5. Alert generated.',
        status: 'LIMITED'
      },
      {
        step: 4,
        bedsAvailable: 2,
        icuAvailable: 0,
        description: 'Casualty Surge Step 4: Critical bed threshold reached! Only 2 ER beds remaining.',
        status: 'CRITICAL'
      },
      {
        step: 5,
        bedsAvailable: 0,
        icuAvailable: 0,
        description: 'Casualty Surge Step 5: Capacity exhausted. Hospital status marked FULL.',
        status: 'FULL'
      }
    ];

    logger.info(`Starting Real-Time Emergency Surge Simulation on ${hospital.name}`);
    emitAlert({
      level: 'warning',
      title: 'Simulation Started',
      message: `Emergency Mass Casualty Surge initiated on ${hospital.name}. Synchronizing all dashboards live.`
    });

    let index = 0;
    const executeStep = async () => {
      if (!isSimulating || index >= surgeSteps.length) {
        isSimulating = false;
        if (activeSimulationTimer) clearTimeout(activeSimulationTimer);
        emitSimulationTick({
          step: 5,
          totalSteps: 5,
          isCompleted: true,
          description: 'Surge simulation complete. Hospital is at full capacity. Paramedics automatically rerouted.'
        });
        return;
      }

      const current = surgeSteps[index];
      currentSimulationStep = current.step;

      try {
        await resourceService.updateHospitalResources(
          hospital.id,
          {
            emergencyBedsAvailable: current.bedsAvailable,
            icuBedsAvailable: current.icuAvailable
          },
          null // system simulation
        );

        emitSimulationTick({
          step: current.step,
          totalSteps: surgeSteps.length,
          isCompleted: false,
          hospitalId: hospital.id,
          hospitalName: hospital.name,
          bedsAvailable: current.bedsAvailable,
          description: current.description
        });
      } catch (err) {
        logger.error(`Simulation step execution failed: ${err.message}`);
      }

      index++;
      if (index < surgeSteps.length && isSimulating) {
        activeSimulationTimer = setTimeout(executeStep, 3500); // 3.5s per step for clear judge demonstration
      } else {
        isSimulating = false;
      }
    };

    executeStep();

    return {
      status: 'started',
      hospitalName: hospital.name,
      totalSteps: surgeSteps.length
    };
  },

  async resetSimulation() {
    if (activeSimulationTimer) {
      clearTimeout(activeSimulationTimer);
      activeSimulationTimer = null;
    }
    isSimulating = false;
    currentSimulationStep = 0;

    // Reset all hospitals to baseline capacity
    const hospitals = await prisma.hospital.findMany({
      include: { resources: true }
    });

    for (const h of hospitals) {
      const defaultBeds = h.resources?.emergencyBedsTotal || 20;
      const defaultIcu = h.resources?.icuBedsTotal || 10;
      const defaultVents = h.resources?.ventilatorsTotal || 6;

      await prisma.hospitalResource.update({
        where: { hospitalId: h.id },
        data: {
          emergencyBedsAvailable: Math.max(5, Math.floor(defaultBeds * 0.4)),
          icuBedsAvailable: Math.max(2, Math.floor(defaultIcu * 0.3)),
          ventilatorsAvailable: Math.max(2, Math.floor(defaultVents * 0.5)),
          operatingRoomsAvailable: 2
        }
      });

      await prisma.hospital.update({
        where: { id: h.id },
        data: { emergencyStatus: 'ACCEPTING' }
      });
    }

    emitAlert({
      level: 'info',
      title: 'Simulation Reset',
      message: 'All hospitals and emergency resources restored to normal operating baseline.'
    });

    emitSimulationTick({
      step: 0,
      totalSteps: 5,
      isCompleted: true,
      isReset: true,
      description: 'System reset to normal operation.'
    });

    return { status: 'reset_successful' };
  },

  async triggerEmergencyIncident() {
    const types = [
      {
        type: 'Mass Transit Subway Collision',
        severity: 'CRITICAL',
        description: 'Derailment at Central Metro interchange. Multiple entrapments and blast injuries reported.',
        patientCount: 6,
        latitude: 28.5680,
        longitude: 77.2250
      },
      {
        type: 'Commercial High-Rise Fire',
        severity: 'CRITICAL',
        description: 'Smoke inhalation and burn casualties at IT Park building 4.',
        patientCount: 5,
        latitude: 28.5020,
        longitude: 77.0850
      }
    ];

    const pick = types[Math.floor(Math.random() * types.length)];
    const incident = await prisma.incident.create({
      data: {
        ...pick,
        status: 'DISPATCHED'
      }
    });

    emitIncidentCreated(incident);
    emitAlert({
      level: 'critical',
      title: `EMERGENCY ALERT: ${incident.type}`,
      message: `${incident.patientCount} patients reported. Dispatching closest available ambulances.`
    });

    return incident;
  }
};

module.exports = simulationService;
