import React, { useState, useRef } from 'react';
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
    attachHospitalToAmbulance,
    recentlyUpdatedHospitalId,
    isLoading
  } = useEmergencyData();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'analytics', 'fleet'
  const [focusedHospital, setFocusedHospital] = useState(null);
  const [isAttaching, setIsAttaching] = useState(false);
  const mapSectionRef = useRef(null);

  const handleFocusHospital = (hospital) => {
    setFocusedHospital(hospital);
    if (activeTab !== 'overview') {
      setActiveTab('overview');
    }
    setTimeout(() => {
      mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleAttachSpecificHospital = async (hospital) => {
    try {
      setIsAttaching(true);
      const targetAmb = ambulances.find((a) => a.status === 'AVAILABLE') || ambulances[0];
      if (targetAmb) {
        await attachHospitalToAmbulance(targetAmb.id, hospital.id);
        setFocusedHospital(hospital);
        if (activeTab !== 'overview') {
          setActiveTab('overview');
        }
        setTimeout(() => {
          mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    } catch (err) {
      console.error('Failed to attach hospital to ambulance:', err);
    } finally {
      setIsAttaching(false);
    }
  };

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
    <div className="min-h-screen bg-slate-100 dark:bg-[#030712] relative overflow-hidden py-6 px-4 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Dynamic Ambient Background Lights */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[550px] h-[550px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
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

      {/* View Switcher Segmented Control */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.06] pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/80 dark:bg-[#080E1C] border border-slate-200/80 dark:border-white/[0.06] shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.03]'
            }`}
          >
            Tactical Map & Triage
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.03]'
            }`}
          >
            Capacity Analytics (Charts)
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:flex">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-ping" />
          <span>Auto-Syncing via WebSocket</span>
        </div>
      </div>

      {/* Tab 1: Tactical Map & Triage Matrix */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Interactive Live Map */}
          <div ref={mapSectionRef}>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide flex items-center gap-2 font-['Outfit']">
                <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                Live Metropolitan Emergency Telemetry
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Click any hospital, ambulance, or incident to inspect
              </span>
            </div>

            <EmergencyMap
              hospitals={hospitals}
              ambulances={ambulances}
              incidents={incidents}
              activeRoute={activeRoute}
              onSelectHospital={handleFocusHospital}
              onAttachHospital={handleAttachSpecificHospital}
              selectedHospitalId={focusedHospital?.id}
              onAttachNearestHospital={handleAttachNearestHospital}
              isAttaching={isAttaching}
              height="520px"
            />
          </div>

          {/* Hospital Resource Matrix Table */}
          <HospitalTable
            hospitals={hospitals}
            onSelectHospital={handleFocusHospital}
            onAttachHospital={handleAttachSpecificHospital}
            selectedHospitalId={focusedHospital?.id}
            activeRouteHospitalId={activeRoute?.hospital?.id}
            recentlyUpdatedId={recentlyUpdatedHospitalId}
            isAttaching={isAttaching}
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
            onSelectHospital={handleFocusHospital}
            onAttachHospital={handleAttachSpecificHospital}
            selectedHospitalId={focusedHospital?.id}
            activeRouteHospitalId={activeRoute?.hospital?.id}
            recentlyUpdatedId={recentlyUpdatedHospitalId}
            isAttaching={isAttaching}
          />
        </div>
      )}
      </div>
    </div>
  );
};

export default CommandCenterDashboard;
