import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, XCircle, PowerOff } from 'lucide-react';

const statuses = [
  {
    id: 'ACCEPTING',
    label: 'Accepting Patients',
    icon: CheckCircle2,
    color: 'hover:border-emerald-500/50 hover:text-emerald-300',
    activeClass: 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-glow-emerald ring-1 ring-emerald-400'
  },
  {
    id: 'LIMITED',
    label: 'Limited Capacity',
    icon: AlertTriangle,
    color: 'hover:border-amber-500/50 hover:text-amber-300',
    activeClass: 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-glow-amber ring-1 ring-amber-400'
  },
  {
    id: 'CRITICAL',
    label: 'Critical Shortage',
    icon: AlertOctagon,
    color: 'hover:border-orange-500/50 hover:text-orange-300',
    activeClass: 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-[0_0_20px_rgba(249,115,22,0.3)] ring-1 ring-orange-400'
  },
  {
    id: 'FULL',
    label: 'Divert / Full',
    icon: XCircle,
    color: 'hover:border-red-500/50 hover:text-red-300',
    activeClass: 'bg-red-500/20 border-red-500 text-red-300 shadow-glow-red ring-1 ring-red-400'
  },
  {
    id: 'OFFLINE',
    label: 'Facility Offline',
    icon: PowerOff,
    color: 'hover:border-slate-500/50 hover:text-slate-300',
    activeClass: 'bg-slate-700/30 border-slate-500 text-slate-300 ring-1 ring-slate-400'
  }
];

const EmergencyStatusToggle = ({ currentStatus, onStatusChange, disabled = false }) => {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0B1324]/85 backdrop-blur-xl p-5 shadow-md shadow-slate-200/40 dark:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide font-['Outfit']">
            Facility Emergency Acceptance Mode
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Real-time status change immediately broadcasts to all active paramedic units and 911 dispatchers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statuses.map((s) => {
          const Icon = s.icon;
          const isActive = currentStatus === s.id;

          return (
            <button
              key={s.id}
              onClick={() => onStatusChange(s.id)}
              disabled={disabled || isActive}
              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all duration-300 active:scale-95 ${
                isActive
                  ? s.activeClass
                  : `bg-slate-50 dark:bg-[#060B16] border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 ${s.color} hover:bg-slate-100 dark:hover:bg-white/[0.04]`
              } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Icon className={`w-5 h-5 mb-1.5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-bold tracking-tight">{s.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 animate-ping" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EmergencyStatusToggle;
