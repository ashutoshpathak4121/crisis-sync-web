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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70">
      <div className="relative w-full max-w-md rounded-2xl p-6 border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-slate-800 dark:text-slate-100 shadow-xl">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/60 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Emergency SOS Trigger</h3>
            <p className="text-xs text-red-600 dark:text-red-400 font-mono font-medium">Immediate Priority Dispatch Level 1</p>
          </div>
        </div>

        {dispatchedSuccess ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Nearest Ambulance & Hospital Dispatched!</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Telemetry synchronized. Live route tracking enabled.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Incident Category</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
              >
                <option value="Severe Trauma / Collision">Severe Trauma / Collision</option>
                <option value="Acute Cardiac Arrest">Acute Cardiac Arrest</option>
                <option value="Respiratory Distress / Suffocation">Respiratory Distress / Suffocation</option>
                <option value="Hazardous Chemical / Fire Exposure">Hazardous Chemical / Fire Exposure</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
                >
                  <option value="CRITICAL">CRITICAL (Triage 1)</option>
                  <option value="HIGH">HIGH (Triage 2)</option>
                  <option value="MEDIUM">MEDIUM (Triage 3)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Patients Count</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={patientCount}
                  onChange={(e) => setPatientCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono font-medium"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                <Radio className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Auto-Geolocating Nearest ER Unit</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                AIIMS Apex Trauma Center & Medanta Hub are alerted for immediate bay clearance.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70">
      <div className="relative w-full max-w-lg rounded-2xl p-6 border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-slate-800 dark:text-slate-100 shadow-xl">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Patient Case #CR-8921</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                Triage 2 - High
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">En Route via Ambulance DL-4587</p>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-4 text-center">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Heart Rate</span>
            <span className="text-sm font-bold font-mono text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1">
              <HeartPulse className="w-3.5 h-3.5" /> 118 bpm
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">SpO2 Oxygen</span>
            <span className="text-sm font-bold font-mono text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
              <Wind className="w-3.5 h-3.5" /> 88%
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Blood Pressure</span>
            <span className="text-sm font-bold font-mono text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
              <Activity className="w-3.5 h-3.5" /> 145/95
            </span>
          </div>
        </div>

        {/* Case Info List */}
        <div className="rounded-xl p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs text-slate-700 dark:text-slate-300 mb-5">
          <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">Chief Complaint</span>
            <span className="font-semibold text-slate-900 dark:text-white">Acute Respiratory Distress & Chest Pain</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">Age / Gender</span>
            <span className="font-semibold text-slate-900 dark:text-white">48 Yrs • Male</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">Assigned Paramedic</span>
            <span className="font-semibold text-slate-900 dark:text-white">Rohan Sharma (Unit #4)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">Target Hospital</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">AIIMS Apex Trauma Center</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500 dark:text-slate-400">Estimated Arrival (ETA)</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">18 minutes</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => {
              onClose();
              if (onActionClick) onActionClick('route');
            }}
            className="py-2 px-3.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Track GPS Route</span>
          </button>
          <button
            onClick={() => {
              alert('Direct audio channel opened with Paramedic Rohan Sharma via WebRTC.');
            }}
            className="py-2 px-3.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70">
      <div className="relative w-full max-w-md rounded-2xl p-6 border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-slate-800 dark:text-slate-100 shadow-xl">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Bed className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Confirm Bed Allocation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{hospital.name}</p>
          </div>
        </div>

        {reserved ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
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

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Distance / Travel Time:</span>
                <span className="font-semibold font-mono text-slate-900 dark:text-white">
                  {hospital.distance || '5.2 km'} • {hospital.eta || '14 min'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Ventilator Available:</span>
                <span className="font-semibold font-mono text-blue-600 dark:text-blue-400">
                  {hospital.ventilatorsAvailable || 7} units
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Isolation Facility:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Confirmed Ready</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
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
