import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmergencyData } from '../context/EmergencyDataContext';
import { hospitalService } from '../services';
import ResourceCard from '../components/hospital/ResourceCard';
import EmergencyStatusToggle from '../components/hospital/EmergencyStatusToggle';
import AuditLogTable from '../components/hospital/AuditLogTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import {
  Building2,
  Bed,
  Activity,
  Wind,
  Layers,
  Droplets,
  ShieldAlert,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const HospitalDashboard = () => {
  const { user } = useAuth();
  const {
    hospitals,
    updateHospitalResources,
    updateHospitalStatus,
    recentlyUpdatedHospitalId,
    isLoading
  } = useEmergencyData();

  // Pick assigned hospital or default to the first one (Apollo)
  const defaultHospital =
    hospitals.find((h) => h.id === user?.hospitalId) ||
    hospitals[0] ||
    null;

  const [selectedHospitalId, setSelectedHospitalId] = useState(
    defaultHospital ? defaultHospital.id : ''
  );
  const [auditLogs, setAuditLogs] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [updatingField, setUpdatingField] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (!selectedHospitalId && hospitals.length > 0) {
      setSelectedHospitalId(defaultHospital ? defaultHospital.id : hospitals[0].id);
    }
  }, [hospitals, defaultHospital, selectedHospitalId]);

  // Keep live digital clock ticking
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch audit logs when selected hospital changes
  useEffect(() => {
    if (!selectedHospitalId) return;
    const fetchLogs = async () => {
      try {
        const res = await hospitalService.getAuditLogs(selectedHospitalId);
        if (res.success) {
          setAuditLogs(res.data.logs || []);
        }
      } catch (err) {
        console.error('Failed to fetch audit logs:', err);
      }
    };
    fetchLogs();
  }, [selectedHospitalId, recentlyUpdatedHospitalId]);

  const activeHospital =
    hospitals.find((h) => h.id === selectedHospitalId) || defaultHospital;

  const handleUpdateResource = async (updates) => {
    if (!activeHospital) return;
    const field = Object.keys(updates)[0];
    try {
      setUpdatingField(field);
      setStatusMessage({ type: 'info', text: 'Broadcasting live capacity update...' });
      await updateHospitalResources(activeHospital.id, updates);
      setStatusMessage({
        type: 'success',
        text: 'Capacity updated in PostgreSQL & Redis. Broadcasted via WebSockets.'
      });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setUpdatingField(null);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!activeHospital) return;
    try {
      setStatusMessage({ type: 'info', text: `Switching status to ${newStatus}...` });
      await updateHospitalStatus(activeHospital.id, newStatus);
      setStatusMessage({
        type: 'success',
        text: `Facility status changed to ${newStatus}. All en-route units alerted.`
      });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  if (isLoading || !activeHospital) {
    return <LoadingSpinner text="Connecting to Hospital telemetry feed..." />;
  }

  const res = activeHospital.resources || {};
  const isRecentlyUpdated = recentlyUpdatedHospitalId === activeHospital.id;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] py-6 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                  Hospital Portal
                </span>
                <StatusBadge status={activeHospital.emergencyStatus} type="hospital" size="md" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                {activeHospital.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activeHospital.address}</p>
            </div>
          </div>

          {/* Right side: Facility switcher & Live Clock */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Facility Switcher */}
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Switch Facility
              </label>
              <select
                value={selectedHospitalId}
                onChange={(e) => setSelectedHospitalId(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none transition-colors cursor-pointer"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clock pill */}
            <div className="bg-slate-50 dark:bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-sans">
                Station Time
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Status Alert Feedback */}
        {statusMessage && (
          <div
            className={`p-3 rounded-lg border text-xs font-medium flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300'
                : statusMessage.type === 'error'
                ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300'
                : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Main Interactive Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1: Emergency Beds */}
          <ResourceCard
            title="Emergency Beds"
            availableKey="emergencyBedsAvailable"
            totalKey="emergencyBedsTotal"
            resources={res}
            icon={Bed}
            unit="ER Beds"
            onUpdate={handleUpdateResource}
            isUpdating={updatingField === 'emergencyBedsAvailable'}
            highlight={isRecentlyUpdated}
          />

          {/* Card 2: ICU Units */}
          <ResourceCard
            title="ICU Beds"
            availableKey="icuBedsAvailable"
            totalKey="icuBedsTotal"
            resources={res}
            icon={Activity}
            unit="ICU Units"
            onUpdate={handleUpdateResource}
            isUpdating={updatingField === 'icuBedsAvailable'}
            highlight={isRecentlyUpdated}
          />

          {/* Card 3: Mechanical Ventilators */}
          <ResourceCard
            title="Mechanical Ventilators"
            availableKey="ventilatorsAvailable"
            totalKey="ventilatorsTotal"
            resources={res}
            icon={Wind}
            unit="Ventilators"
            onUpdate={handleUpdateResource}
            isUpdating={updatingField === 'ventilatorsAvailable'}
            highlight={isRecentlyUpdated}
          />

          {/* Card 4: Operating Rooms */}
          <ResourceCard
            title="Operating Rooms"
            availableKey="operatingRoomsAvailable"
            totalKey="operatingRoomsTotal"
            resources={res}
            icon={Layers}
            unit="OR Suites"
            onUpdate={handleUpdateResource}
            isUpdating={updatingField === 'operatingRoomsAvailable'}
            highlight={isRecentlyUpdated}
          />

          {/* Card 5: Blood Bank Inventory */}
          <ResourceCard
            title="Blood Units (O- / Universal)"
            availableKey="bloodUnitsAvailable"
            resources={res}
            icon={Droplets}
            unit="Units"
            onUpdate={handleUpdateResource}
            isUpdating={updatingField === 'bloodUnitsAvailable'}
            highlight={isRecentlyUpdated}
          />

          {/* Card 6: Trauma Surgical Team Availability */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-4 sm:p-5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Trauma Surgical Team
                </h4>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Emergency Surgeon on Duty</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span
                className={`text-xs font-semibold uppercase tracking-wider font-mono ${
                  res.traumaTeamAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {res.traumaTeamAvailable ? '● Available on-site' : '● Standby / Off-site'}
              </span>

              <button
                onClick={() =>
                  handleUpdateResource({
                    traumaTeamAvailable: !res.traumaTeamAvailable
                  })
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border cursor-pointer ${
                  res.traumaTeamAvailable
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300'
                    : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-800/60 dark:text-red-300'
                }`}
              >
                Toggle Status
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Status Selector */}
        <EmergencyStatusToggle
          currentStatus={activeHospital.emergencyStatus}
          onStatusChange={handleStatusChange}
        />

        {/* Audit Log Table */}
        <AuditLogTable logs={auditLogs} />
      </div>
    </div>
  );
};

export default HospitalDashboard;