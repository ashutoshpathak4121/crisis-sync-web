import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, XCircle, PowerOff } from 'lucide-react';

const statuses = [
  {
    id: 'ACCEPTING',
    label: 'Accepting Patients',
    icon: CheckCircle2,
    color: 'hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300',
    activeClass: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-1 ring-emerald-500'
  },
  {
    id: 'LIMITED',
    label: 'Limited Capacity',
    icon: AlertTriangle,
    color: 'hover:border-amber-400 hover:text-amber-700 dark:hover:text-amber-300',
    activeClass: 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-800 dark:text-amber-200 ring-1 ring-amber-500'
  },
  {
    id: 'CRITICAL',
    label: 'Critical Shortage',
    icon: AlertOctagon,
    color: 'hover:border-orange-400 hover:text-orange-700 dark:hover:text-orange-300',
    activeClass: 'bg-orange-50 dark:bg-orange-950/60 border-orange-500 text-orange-800 dark:text-orange-200 ring-1 ring-orange-500'
  },
  {
    id: 'FULL',
    label: 'Divert / Full',
    icon: XCircle,
    color: 'hover:border-red-400 hover:text-red-700 dark:hover:text-red-300',
    activeClass: 'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-800 dark:text-red-200 ring-1 ring-red-500'
  },
  {
    id: 'OFFLINE',
    label: 'Facility Offline',
    icon: PowerOff,
    color: 'hover:border-slate-400 hover:text-slate-700 dark:hover:text-slate-300',
    activeClass: 'bg-slate-100 dark:bg-slate-800 border-slate-500 text-slate-800 dark:text-slate-200 ring-1 ring-slate-500'
  }
];

const EmergencyStatusToggle = ({ currentStatus, onStatusChange, disabled = false }) => {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-4 sm:p-5 shadow-sm">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
          Facility Emergency Acceptance Mode
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time status changes immediately broadcast to active paramedic units and 911 dispatchers
        </p>
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
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-colors min-h-[72px] cursor-pointer ${
                isActive
                  ? s.activeClass
                  : `bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 ${s.color} hover:bg-slate-100 dark:hover:bg-slate-750`
              } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Icon className="w-5 h-5 mb-1.5" />
              <span className="text-xs font-semibold tracking-tight">{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EmergencyStatusToggle;