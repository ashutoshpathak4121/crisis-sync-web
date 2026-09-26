import React, { useState } from 'react';
import {
  X,
  AlertOctagon,
  Bed,
  CheckCircle2,
  HeartPulse,
  MapPin,
  Phone,
  Radio,
  Send,
  User,
  Activity,
  Wind
} from 'lucide-react';

export const SosModal = ({ isOpen, onClose, onDispatch }) => {
  const [incidentType, setIncidentType] = useState('Severe Trauma / Collision');
  const [patientCount, setPatientCount] = useState(1);
  const [severity, setSeverity] = useState('CRITICAL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setDispatchedSuccess(true);
      setTimeout(() => {
        setDispatchedSuccess(false);
        onClose();
        if (onDispatch) onDispatch({ incidentType, patientCount, severity });
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-md rounded-[32px] p-6 sm:p-7 border border-rose-500/20 bg-white dark:bg-[#0E1626] text-slate-800 dark:text-slate-100 shadow-[0_25px_70px_rgba(20,10,60,0.25)]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-500 animate-pulse shadow-md shadow-rose-500/20">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black font-['Outfit'] text-slate-900 dark:text-white">Emergency SOS Trigger</h3>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-mono font-semibold">Immediate Priority Dispatch Level 1</p>
          </div>
        </div>

        {dispatchedSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Nearest Ambulance & Hospital Dispatched!</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Telemetry synchronized. Live route tracking enabled.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Incident Category</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F6F7FD] dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-all cursor-pointer font-medium"
              >
                <option value="Severe Trauma / Collision">Severe Trauma / Collision</option>
                <option value="Acute Cardiac Arrest">Acute Cardiac Arrest</option>
                <option value="Respiratory Distress / Suffocation">Respiratory Distress / Suffocation</option>
                <option value="Hazardous Chemical / Fire Exposure">Hazardous Chemical / Fire Exposure</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F6F7FD] dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-all cursor-pointer font-medium"
                >
                  <option value="CRITICAL">CRITICAL (Triage 1)</option>
                  <option value="HIGH">HIGH (Triage 2)</option>
                  <option value="MEDIUM">MEDIUM (Triage 3)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Patients Count</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={patientCount}
                  onChange={(e) => setPatientCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F6F7FD] dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/25 text-rose-700 dark:text-rose-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>Auto-Geolocating Nearest ER Unit</span>
              </div>
              <p className="text-[11px] text-rose-600/90 dark:text-rose-200/80 leading-relaxed font-medium">
                AIIMS Apex Trauma Center & Medanta Hub are alerted for immediate bay clearance.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 shadow-lg shadow-rose-600/35 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <span>Dispatching Emergency Units...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Execute High-Priority Dispatch</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const PatientDetailsModal = ({ isOpen, onClose, onActionClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-[32px] p-6 sm:p-7 border border-indigo-500/20 bg-white dark:bg-[#0E1626] text-slate-800 dark:text-slate-100 shadow-[0_25px_70px_rgba(20,10,60,0.25)]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/40 flex items-center justify-center text-[#4E35CD] dark:text-indigo-400 shadow-md">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">Patient Case #CR-8921</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
                Triage 2 - High
              </span>
            </div>
            <p className="text-xs text-slate-400">En Route via Ambulance DL-4587</p>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-[#F6F7FD] dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] mb-4 text-center">
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5 font-semibold">Heart Rate</span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1">
              <HeartPulse className="w-3.5 h-3.5" /> 118 bpm
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5 font-semibold">SpO2 Oxygen</span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
              <Wind className="w-3.5 h-3.5" /> 88%
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5 font-semibold">Blood Pressure</span>
            <span className="text-sm font-bold text-[#4E35CD] dark:text-cyan-400 flex items-center justify-center gap-1">
              <Activity className="w-3.5 h-3.5" /> 145/95
            </span>
          </div>
        </div>

        {/* Case Info List */}
        <div className="rounded-2xl p-4 bg-[#F8F9FE] dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] space-y-2 text-xs text-slate-700 dark:text-slate-300 mb-5">
          <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-white/[0.06]">
            <span className="text-slate-400">Chief Complaint</span>
            <span className="font-semibold text-slate-900 dark:text-white">Acute Respiratory Distress & Chest Pain</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-white/[0.06]">
            <span className="text-slate-400">Age / Gender</span>
            <span className="font-semibold text-slate-900 dark:text-white">48 Yrs • Male</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-white/[0.06]">
            <span className="text-slate-400">Assigned Paramedic</span>
            <span className="font-semibold text-slate-900 dark:text-white">Rohan Sharma (Unit #4)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-white/[0.06]">
            <span className="text-slate-400">Target Hospital</span>
            <span className="font-semibold text-[#4E35CD] dark:text-cyan-400">AIIMS Apex Trauma Center</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Estimated Arrival (ETA)</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">18 minutes</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => {
              onClose();
              if (onActionClick) onActionClick('route');
            }}
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#4E35CD] hover:bg-indigo-600 shadow-md shadow-indigo-500/25 flex items-center justify-center gap-1.5 transition-all"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Track GPS Route</span>
          </button>
          <button
            onClick={() => {
              alert('Direct audio channel opened with Paramedic Rohan Sharma via WebRTC.');
            }}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/[0.1] flex items-center justify-center gap-1.5 transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Radio Comms</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const ReserveBedModal = ({ isOpen, hospital, onClose, onConfirm }) => {
  const [reserved, setReserved] = useState(false);

  if (!isOpen || !hospital) return null;

  const handleConfirm = () => {
    setReserved(true);
    setTimeout(() => {
      setReserved(false);
      onClose();
      if (onConfirm) onConfirm(hospital);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-md rounded-[32px] p-6 sm:p-7 border border-indigo-500/20 bg-white dark:bg-[#0E1626] text-slate-800 dark:text-slate-100 shadow-[0_25px_70px_rgba(20,10,60,0.25)]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/40 flex items-center justify-center text-[#4E35CD] dark:text-indigo-400 shadow-md">
            <Bed className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">Confirm Bed Allocation</h3>
            <p className="text-xs text-slate-400">{hospital.name}</p>
          </div>
        </div>

        {reserved ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Bed Reserved & Locked</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Notification sent to ER triage team at {hospital.name}.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Locking an ICU Bed with Ventilator support at <strong className="text-slate-900 dark:text-white">{hospital.name}</strong> will
              temporarily hold the resource for 20 minutes for incoming ambulance transit.
            </p>

            <div className="p-4 rounded-2xl bg-[#F6F7FD] dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Distance / Travel Time:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {hospital.distance} • {hospital.eta}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ventilator Available:</span>
                <span className="font-semibold text-[#4E35CD] dark:text-cyan-400">
                  {hospital.ventilatorsAvailable || 7} units
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Isolation Facility:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Confirmed Ready</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#4E35CD] hover:bg-indigo-600 shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Confirm Allocation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
