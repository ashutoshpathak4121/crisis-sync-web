import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, XCircle, PowerOff } from 'lucide-react';

const statuses = [
  {
    id: 'ACCEPTING',
    label: 'Accepting Patients',
    icon: CheckCircle2,
    color: 'hover:border-emerald-500 text-emerald-400',
    activeClass: 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
  },
  {
    id: 'LIMITED',
    label: 'Limited Capacity',
    icon: AlertTriangle,
    color: 'hover:border-amber-500 text-amber-400',
    activeClass: 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
  },
  {
    id: 'CRITICAL',
    label: 'Critical Shortage',
    icon: AlertOctagon,
    color: 'hover:border-orange-500 text-orange-400',
    activeClass: 'bg-orange-500/20 border-orange-500 text-orange-300 ring-1 ring-orange-500'
  },
  {
    id: 'FULL',
    label: 'Divert / Full',
    icon: XCircle,
    color: 'hover:border-red-500 text-red-400',
    activeClass: 'bg-red-500/20 border-red-500 text-red-300 ring-1 ring-red-500'
  },
  {
    id: 'OFFLINE',
    label: 'Facility Offline',
    icon: PowerOff,
    color: 'hover:border-slate-500 text-slate-400',
    activeClass: 'bg-slate-500/20 border-slate-500 text-slate-300 ring-1 ring-slate-500'
  }
];

const EmergencyStatusToggle = ({ currentStatus, onStatusChange, disabled = false }) => {
  return (
    <div className="rounded-xl border border-[#1E2E48] bg-[#0E1626] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-white tracking-wide">
            Facility Emergency Acceptance Status
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Changing status immediately notifies all en-route ambulances and dispatchers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {statuses.map((s) => {
          const Icon = s.icon;
          const isActive = currentStatus === s.id;

          return (
            <button
              key={s.id}
              onClick={() => onStatusChange(s.id)}
              disabled={disabled || isActive}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                isActive
                  ? s.activeClass
                  : `bg-[#080C15] border-slate-800 text-slate-400 ${s.color} hover:bg-slate-800/60`
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Icon className={`w-5 h-5 mb-1.5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-bold tracking-tight">{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EmergencyStatusToggle;
