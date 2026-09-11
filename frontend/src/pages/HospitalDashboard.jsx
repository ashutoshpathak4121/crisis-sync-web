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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-white/[0.08] bg-[#0B1324]/85 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 shadow-glow-cyan">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-black text-white tracking-tight font-['Outfit']">
                {activeHospital.name}
              </h2>
              <StatusBadge status={activeHospital.emergencyStatus} type="hospital" size="md" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{activeHospital.address}</p>
          </div>
        </div>

        {/* Right side: Facility switcher & Live Clock */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Facility Switcher */}
          <div>
            <label className="block text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1">
              Switch Facility
            </label>
            <select
              value={selectedHospitalId}
              onChange={(e) => setSelectedHospitalId(e.target.value)}
              className="bg-[#060B16] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none transition-all cursor-pointer"
            >
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clock pill */}
          <div className="bg-[#060B16] px-4 py-2 rounded-xl border border-white/[0.08] font-mono text-xs text-right shadow-sm">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-sans">
              Local Station Time
            </span>
            <span className="text-cyan-300 font-black text-sm">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Status Alert Feedback */}
      {statusMessage && (
        <div
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-slide-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : statusMessage.type === 'error'
              ? 'bg-red-950/60 border-red-500/40 text-red-300'
              : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Interactive Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
        <div className="rounded-xl border border-[#1E2E48] bg-[#0E1626] p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-lg bg-slate-800/80 text-cyan-400 border border-slate-700/50">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200 tracking-wide">
                Trauma Surgical Team
              </h4>
              <span className="text-[11px] text-slate-400">Emergency Surgeon on Duty</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase tracking-wider font-mono ${
                res.traumaTeamAvailable ? 'text-emerald-400' : 'text-red-400'
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
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                res.traumaTeamAvailable
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-red-500/20 border-red-500/40 text-red-300'
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
  );
};

export default HospitalDashboard;
