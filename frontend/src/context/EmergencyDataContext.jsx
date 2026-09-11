import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSocket } from './SocketContext';
import {
  hospitalService,
  ambulanceService,
  incidentService,
  routeService,
  simulationService
} from '../services';
import {
  FALLBACK_HOSPITALS,
  FALLBACK_AMBULANCES,
  FALLBACK_INCIDENTS
} from '../data/fallbackData';

const EmergencyDataContext = createContext(null);

export const EmergencyDataProvider = ({ children }) => {
  const { socket, isConnected } = useSocket();

  const [hospitals, setHospitals] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [activeRoute, setActiveRoute] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [simulationStatus, setSimulationStatus] = useState({
    active: false,
    step: 0,
    totalSteps: 5,
    description: null
  });
  const [recentlyUpdatedHospitalId, setRecentlyUpdatedHospitalId] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial system state (with automatic fallback for cold starts or standalone Vercel preview)
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [hospRes, ambRes, incRes] = await Promise.allSettled([
        hospitalService.getAll(),
        ambulanceService.getAll(),
        incidentService.getAll()
      ]);

      const hospData =
        hospRes.status === 'fulfilled' && hospRes.value?.success && hospRes.value.data.hospitals?.length > 0
          ? hospRes.value.data.hospitals
          : FALLBACK_HOSPITALS;

      const ambData =
        ambRes.status === 'fulfilled' && ambRes.value?.success && ambRes.value.data.ambulances?.length > 0
          ? ambRes.value.data.ambulances
          : FALLBACK_AMBULANCES;

      const incData =
        incRes.status === 'fulfilled' && incRes.value?.success && incRes.value.data.incidents?.length > 0
          ? incRes.value.data.incidents
          : FALLBACK_INCIDENTS;

      setHospitals(hospData);
      setAmbulances(ambData);
      if (ambData.length > 0 && !selectedAmbulance) {
        setSelectedAmbulance(ambData[0]);
      }
      setIncidents(incData);
      setLastSyncTime(new Date());
    } catch (err) {
      console.warn('Backend offline / unreachable, initializing fallback emergency data:', err);
      setHospitals(FALLBACK_HOSPITALS);
      setAmbulances(FALLBACK_AMBULANCES);
      setSelectedAmbulance(FALLBACK_AMBULANCES[0]);
      setIncidents(FALLBACK_INCIDENTS);
    } finally {
      setIsLoading(false);
    }
  }, [selectedAmbulance]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Real-Time Socket Event Listeners
  useEffect(() => {
    if (!socket) return;

    // 1. Live Hospital Capacity Updates
    const handleHospitalResourceUpdated = (data) => {
      console.log('[RealTime Sync] hospital:resource-updated ->', data);
      setLastSyncTime(new Date());

      setHospitals((prev) =>
        prev.map((h) => {
          if (h.id === data.hospitalId) {
            return {
              ...h,
              resources: data.resources,
              emergencyStatus: data.resources?.hospital?.emergencyStatus || h.emergencyStatus
            };
          }
          return h;
        })
      );

      // Trigger visual highlight flash on cards
      setRecentlyUpdatedHospitalId(data.hospitalId);
      setTimeout(() => {
        setRecentlyUpdatedHospitalId(null);
      }, 3000);

      // If this was the selected hospital on an active route, update it
      setActiveRoute((currentRoute) => {
        if (currentRoute && currentRoute.hospital?.id === data.hospitalId) {
          return {
            ...currentRoute,
            hospital: {
              ...currentRoute.hospital,
              resources: data.resources
            }
          };
        }
        return currentRoute;
      });

      // Add to alert feed
      const beds = data.resources?.emergencyBedsAvailable;
      setAlerts((prev) => [
        {
          id: `alert-${Date.now()}`,
          level: beds <= 2 ? 'critical' : 'info',
          title: 'Hospital Capacity Updated Just Now',
          message: `${data.hospitalName || 'Hospital'} emergency beds adjusted to ${beds}.`,
          timestamp: new Date().toISOString()
        },
        ...prev.slice(0, 19)
      ]);
    };

    // 2. Hospital Emergency Status Changes
    const handleHospitalStatusUpdated = (data) => {
      console.log('[RealTime Sync] hospital:status-updated ->', data);
      setLastSyncTime(new Date());

      setHospitals((prev) =>
        prev.map((h) =>
          h.id === data.hospitalId
            ? { ...h, emergencyStatus: data.emergencyStatus }
            : h
        )
      );

      setAlerts((prev) => [
        {
          id: `alert-${Date.now()}`,
          level: data.emergencyStatus === 'FULL' || data.emergencyStatus === 'CRITICAL' ? 'critical' : 'warning',
          title: 'Hospital Status Changed',
          message: `${data.hospitalName || 'Hospital'} status is now ${data.emergencyStatus}.`,
          timestamp: new Date().toISOString()
        },
        ...prev.slice(0, 19)
      ]);
    };

    // 3. Ambulance GPS Telemetry
    const handleAmbulanceLocationUpdated = (data) => {
      setLastSyncTime(new Date());
      setAmbulances((prev) =>
        prev.map((amb) =>
          amb.id === data.ambulanceId
            ? { ...amb, latitude: data.latitude, longitude: data.longitude }
            : amb
        )
      );
    };

    // 4. Ambulance Status Updates
    const handleAmbulanceStatusUpdated = (data) => {
      setLastSyncTime(new Date());
      setAmbulances((prev) =>
        prev.map((amb) => {
          if (amb.id === data.ambulanceId) {
            const destHospital = data.destinationHospitalId
              ? hospitals.find((h) => h.id === data.destinationHospitalId) ||
                (data.hospitalName ? { id: data.destinationHospitalId, name: data.hospitalName } : amb.destinationHospital)
              : null;

            return {
              ...amb,
              status: data.status,
              destinationHospitalId: data.destinationHospitalId,
              destinationHospital: destHospital
            };
          }
          return amb;
        })
      );
    };

    // 5. New Incident Reported
    const handleIncidentCreated = (data) => {
      setLastSyncTime(new Date());
      setIncidents((prev) => [data.incident, ...prev]);
    };

    // 6. Incident Status Updated
    const handleIncidentUpdated = (data) => {
      setLastSyncTime(new Date());
      setIncidents((prev) =>
        prev.map((inc) => (inc.id === data.incident.id ? data.incident : inc))
      );
    };

    // 7. System-wide Broadcast Alerts
    const handleAlertBroadcast = (alert) => {
      setLastSyncTime(new Date());
      setAlerts((prev) => [alert, ...prev.slice(0, 19)]);
    };

    // 8. Hackathon Simulation Mode Ticks
    const handleSimulationTick = (data) => {
      setLastSyncTime(new Date());
      setSimulationStatus({
        active: !data.isCompleted && !data.isReset,
        step: data.step,
        totalSteps: data.totalSteps || 5,
        description: data.description
      });
    };

    // Register socket listeners
    socket.on('hospital:resource-updated', handleHospitalResourceUpdated);
    socket.on('hospital:status-updated', handleHospitalStatusUpdated);
    socket.on('ambulance:location-updated', handleAmbulanceLocationUpdated);
    socket.on('ambulance:status-updated', handleAmbulanceStatusUpdated);
    socket.on('incident:created', handleIncidentCreated);
    socket.on('incident:updated', handleIncidentUpdated);
    socket.on('alert:broadcast', handleAlertBroadcast);
    socket.on('simulation:tick', handleSimulationTick);

    return () => {
      socket.off('hospital:resource-updated', handleHospitalResourceUpdated);
      socket.off('hospital:status-updated', handleHospitalStatusUpdated);
      socket.off('ambulance:location-updated', handleAmbulanceLocationUpdated);
      socket.off('ambulance:status-updated', handleAmbulanceStatusUpdated);
      socket.off('incident:created', handleIncidentCreated);
      socket.off('incident:updated', handleIncidentUpdated);
      socket.off('alert:broadcast', handleAlertBroadcast);
      socket.off('simulation:tick', handleSimulationTick);
    };
  }, [socket]);

  // Actions for components to invoke
  const updateHospitalResources = async (hospitalId, updates) => {
    try {
      const res = await hospitalService.updateResources(hospitalId, updates);
      return res;
    } catch (err) {
      console.warn('Operating in offline/standalone mode: updating resources in local state');
      setHospitals((prev) =>
        prev.map((h) => {
          if (h.id === hospitalId) {
            return {
              ...h,
              resources: {
                ...h.resources,
                ...updates
              }
            };
          }
          return h;
        })
      );
      setRecentlyUpdatedHospitalId(hospitalId);
      setTimeout(() => setRecentlyUpdatedHospitalId(null), 2500);
      return { success: true };
    }
  };

  const updateHospitalStatus = async (hospitalId, status) => {
    try {
      const res = await hospitalService.updateStatus(hospitalId, status);
      return res;
    } catch (err) {
      console.warn('Operating in offline/standalone mode: updating status in local state');
      setHospitals((prev) =>
        prev.map((h) => (h.id === hospitalId ? { ...h, emergencyStatus: status } : h))
      );
      return { success: true };
    }
  };

  const calculateRouteToHospital = async (ambulanceId, hospitalId) => {
    try {
      const res = await routeService.calculateRoute(ambulanceId, hospitalId);
      if (res.success && res.data) {
        setActiveRoute(res.data);
        return res.data;
      }
    } catch (err) {
      console.warn('Operating in offline/standalone mode: calculating route geometry locally');
    }

    // Standalone / Offline Route Fallback
    const amb = ambulances.find((a) => a.id === ambulanceId) || ambulances[0];
    const hosp = hospitals.find((h) => h.id === hospitalId);
    if (!amb || !hosp) return null;

    const dist = computeDistanceKm(amb.latitude, amb.longitude, hosp.latitude, hosp.longitude);
    const duration = Math.max(3, Math.round(dist * 2.2));
    const fallbackRoute = {
      ambulance: amb,
      hospital: hosp,
      distanceKm: dist,
      durationMin: duration,
      coordinates: [
        [amb.latitude, amb.longitude],
        [
          (amb.latitude + hosp.latitude) / 2 + 0.005,
          (amb.longitude + hosp.longitude) / 2 - 0.005
        ],
        [hosp.latitude, hosp.longitude]
      ]
    };
    setActiveRoute(fallbackRoute);
    return fallbackRoute;
  };

  const clearActiveRoute = async (ambulanceId = null) => {
    setActiveRoute(null);
    if (ambulanceId) {
      try {
        await ambulanceService.updateStatus(ambulanceId, 'AVAILABLE', null);
      } catch (err) {
        console.warn('Could not reset ambulance status:', err);
      }
      setAmbulances((prev) =>
        prev.map((a) =>
          a.id === ambulanceId
            ? { ...a, status: 'AVAILABLE', destinationHospitalId: null, destinationHospital: null }
            : a
        )
      );
    }
  };

  // Helper to compute distance in km
  const computeDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  // Attach a specific hospital to an ambulance
  const attachHospitalToAmbulance = async (ambulanceId, hospitalId) => {
    const amb = ambulances.find((a) => a.id === ambulanceId) || ambulances[0];
    const hosp = hospitals.find((h) => h.id === hospitalId);
    if (!amb || !hosp) return null;

    try {
      await ambulanceService.updateStatus(amb.id, 'EN_ROUTE', hosp.id);
    } catch (err) {
      console.warn('Operating in offline/standalone mode: syncing ambulance attach in state');
    }

    // Always update in state
    setAmbulances((prev) =>
      prev.map((a) =>
        a.id === amb.id
          ? { ...a, status: 'EN_ROUTE', destinationHospitalId: hosp.id, destinationHospital: hosp }
          : a
      )
    );

    // Calculate driving route and set active HUD
    const route = await calculateRouteToHospital(amb.id, hosp.id);

    // Broadcast toast alert
    setAlerts((prev) => [
      {
        id: `attach-${Date.now()}`,
        level: 'info',
        title: 'Hospital Attached Successfully',
        message: `Ambulance ${amb.vehicleNumber} is now attached and en route to ${hosp.name}.`,
        timestamp: new Date().toISOString()
      },
      ...prev.slice(0, 19)
    ]);

    return { ambulance: amb, hospital: hosp, route };
  };

  // Automatically find and attach the nearest accepting hospital
  const attachNearestHospital = async (ambulanceId, userCoords = null) => {
    const amb = ambulances.find((a) => a.id === ambulanceId) || ambulances[0];
    if (!amb) return null;

    const originLat = userCoords?.lat || amb.latitude;
    const originLng = userCoords?.lng || amb.longitude;

    // Filter for hospitals that are not FULL or OFFLINE
    const accepting = hospitals.filter(
      (h) => h.emergencyStatus !== 'FULL' && h.emergencyStatus !== 'OFFLINE'
    );
    const candidates = accepting.length > 0 ? accepting : hospitals;

    const scored = candidates.map((h) => {
      const dist = computeDistanceKm(originLat, originLng, h.latitude, h.longitude);
      const erBeds = h.resources?.emergencyBedsAvailable || 0;
      return { hospital: h, distanceKm: dist, erBeds };
    });

    // Sort by shortest distance, prioritizing facilities with available ER beds
    scored.sort((a, b) => {
      if ((a.erBeds > 0 && b.erBeds > 0) || (a.erBeds === 0 && b.erBeds === 0)) {
        return a.distanceKm - b.distanceKm;
      }
      return b.erBeds - a.erBeds;
    });

    const nearest = scored[0]?.hospital;
    if (!nearest) return null;

    return attachHospitalToAmbulance(amb.id, nearest.id);
  };

  // Detach hospital / clear ambulance assignment
  const detachHospitalFromAmbulance = async (ambulanceId) => {
    const amb = ambulances.find((a) => a.id === ambulanceId) || ambulances[0];
    if (!amb) return;
    try {
      await ambulanceService.updateStatus(amb.id, 'AVAILABLE', null);
      setActiveRoute(null);
      setAlerts((prev) => [
        {
          id: `detach-${Date.now()}`,
          level: 'info',
          title: 'Hospital Detached',
          message: `Ambulance ${amb.vehicleNumber} assignment cleared. Status reset to AVAILABLE.`,
          timestamp: new Date().toISOString()
        },
        ...prev.slice(0, 19)
      ]);
    } catch (err) {
      console.error('Failed to detach hospital:', err);
    }
  };

  const reportIncident = async (incidentData) => {
    const res = await incidentService.create(incidentData);
    return res;
  };

  const startSurgeSimulation = async () => {
    setSimulationStatus({
      active: true,
      step: 1,
      totalSteps: 5,
      description: 'Surge simulation starting...'
    });
    return simulationService.startSurge();
  };

  const resetSimulation = async () => {
    setSimulationStatus({
      active: false,
      step: 0,
      totalSteps: 5,
      description: null
    });
    const res = await simulationService.reset();
    await loadInitialData();
    return res;
  };

  const triggerIncidentSimulation = async () => {
    return simulationService.triggerIncident();
  };

  const dismissAlert = (alertId) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  return (
    <EmergencyDataContext.Provider
      value={{
        hospitals,
        ambulances,
        incidents,
        alerts,
        activeRoute,
        selectedHospital,
        selectedAmbulance,
        simulationStatus,
        recentlyUpdatedHospitalId,
        lastSyncTime,
        isLoading,
        setSelectedHospital,
        setSelectedAmbulance,
        updateHospitalResources,
        updateHospitalStatus,
        calculateRouteToHospital,
        clearActiveRoute,
        attachHospitalToAmbulance,
        attachNearestHospital,
        detachHospitalFromAmbulance,
        reportIncident,
        startSurgeSimulation,
        resetSimulation,
        triggerIncidentSimulation,
        dismissAlert,
        refreshData: loadInitialData
      }}
    >
      {children}
    </EmergencyDataContext.Provider>
  );
};

export const useEmergencyData = () => {
  const context = useContext(EmergencyDataContext);
  if (!context) {
    throw new Error('useEmergencyData must be used within an EmergencyDataProvider');
  }
  return context;
};
