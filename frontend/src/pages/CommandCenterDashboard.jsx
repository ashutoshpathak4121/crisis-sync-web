import React, { useState } from 'react';
import { useEmergencyData } from '../context/EmergencyDataContext';
import StatCard from '../components/common/StatCard';
import EmergencyMap from '../components/map/EmergencyMap';
import HospitalTable from '../components/command/HospitalTable';
import AmbulanceList from '../components/command/AmbulanceList';
import IncidentFeed from '../components/command/IncidentFeed';
import CapacityCharts from '../components/command/CapacityCharts';
import SimulationController from '../components/command/SimulationController';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  AlertTriangle,
  Ambulance,
  Building2,
  AlertCircle,
  Clock,
  Bed,
  Layers,
  Activity,
  Maximize2
} from 'lucide-react';

const CommandCenterDashboard = () => {
  const {
    hospitals,
    ambulances,
    incidents,
    activeRoute,
    attachNearestHospital,
    recentlyUpdatedHospitalId,
    isLoading
  } = useEmergencyData();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'analytics', 'fleet'
  const [focusedHospital, setFocusedHospital] = useState(null);
  const [isAttaching, setIsAttaching] = useState(false);

  const handleAttachNearestHospital = async (userCoords = null) => {
    try {
      setIsAttaching(true);
      const targetAmb = ambulances.find((a) => a.status === 'AVAILABLE') || ambulances[0];
      if (targetAmb) {
        await attachNearestHospital(targetAmb.id, userCoords);
      }
    } catch (err) {
      console.error('Failed to attach nearest hospital:', err);
    } finally {
      setIsAttaching(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Connecting to Command Center Dispatch Data Stream..." />;
  }

  // System-wide KPI Computations
  const totalIncidents = incidents.length;
  const activeAmbulancesCount = ambulances.filter((a) => a.status !== 'OFFLINE').length;
  const availableHospitalsCount = hospitals.filter((h) => h.emergencyStatus === 'ACCEPTING').length;
  const criticalHospitalsCount = hospitals.filter(
    (h) => h.emergencyStatus === 'CRITICAL' || h.emergencyStatus === 'FULL'
  ).length;

  const totalErBedsAvailable = hospitals.reduce(
    (sum, h) => sum + (h.resources?.emergencyBedsAvailable || 0),
    0
  );
  const totalErBedsTotal = hospitals.reduce(
    (sum, h) => sum + (h.resources?.emergencyBedsTotal || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Simulation Controller Top Banner */}
      <SimulationController />

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard
          title="Active Incidents"
          value={totalIncidents}
          subtitle="Triaged & Dispatched"
          icon={AlertCircle}
          color="red"
        />

        <StatCard
          title="Ambulances Active"
          value={`${activeAmbulancesCount}/${ambulances.length}`}
          subtitle="Real-time GPS Tracking"
          icon={Ambulance}
          color="cyan"
        />

        <StatCard
          title="Accepting Hospitals"
          value={`${availableHospitalsCount}/${hospitals.length}`}
          subtitle="Open for Trauma"
          icon={Building2}
          color="emerald"
        />

        <StatCard
          title="Critical / Divert"
          value={criticalHospitalsCount}
          subtitle="Near / At Max Saturation"
          icon={AlertTriangle}
          color="amber"
          highlight={criticalHospitalsCount > 0}
        />

        <StatCard
          title="Total Available Beds"
          value={`${totalErBedsAvailable}/${totalErBedsTotal}`}
          subtitle="System-wide ER Capacity"
          icon={Bed}
          color="purple"
        />
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'overview'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Tactical Map & Triage
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'analytics'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Capacity Analytics (Charts)
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
          Auto-Refreshing via WebSocket
        </span>
      </div>

      {/* Tab 1: Tactical Map & Triage Matrix */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Interactive Live Map */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Live City-Wide Emergency Telemetry
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Click any hospital, ambulance, or incident to inspect
              </span>
            </div>

            <EmergencyMap
              hospitals={hospitals}
              ambulances={ambulances}
              incidents={incidents}
              activeRoute={activeRoute}
              onSelectHospital={(h) => setFocusedHospital(h)}
              selectedHospitalId={focusedHospital?.id}
              onAttachNearestHospital={handleAttachNearestHospital}
              isAttaching={isAttaching}
              height="520px"
            />
          </div>

          {/* Hospital Resource Matrix Table */}
          <HospitalTable
            hospitals={hospitals}
            onSelectHospital={(h) => setFocusedHospital(h)}
            recentlyUpdatedId={recentlyUpdatedHospitalId}
          />

          {/* Bottom Grid: Ambulance Fleet + Live Incident Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AmbulanceList ambulances={ambulances} />
            <IncidentFeed incidents={incidents} />
          </div>
        </div>
      )}

      {/* Tab 2: Analytics & Recharts */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <CapacityCharts hospitals={hospitals} />
          <HospitalTable
            hospitals={hospitals}
            onSelectHospital={(h) => setFocusedHospital(h)}
            recentlyUpdatedId={recentlyUpdatedHospitalId}
          />
        </div>
      )}
    </div>
  );
};

export default CommandCenterDashboard;
