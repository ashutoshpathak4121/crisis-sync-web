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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] py-6 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
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
            color="blue"
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
            subtitle="Near / At Saturation"
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
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tactical Map & Triage
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Capacity Analytics (Charts)
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:flex">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>WebSocket Live Sync Active</span>
          </div>
        </div>

        {/* Tab 1: Tactical Map & Triage Matrix */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Main Interactive Live Map */}
            <div ref={mapSectionRef}>
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Live Metropolitan Emergency Telemetry
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Click any hospital, ambulance, or incident to inspect
                </span>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
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