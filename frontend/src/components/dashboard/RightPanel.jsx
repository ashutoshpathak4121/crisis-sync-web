import React, { useState } from 'react';
import {
  Bed,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  MapPin,
  Clock,
  User,
  Radio,
  Ambulance,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  Wind
} from 'lucide-react';
import { DonutCapacityChart } from './CrisisCharts';

const HOSPITALS_LIST = [
  {
    id: 'aiims',
    name: 'AIIMS Delhi',
    distance: '12.6 km',
    eta: '24 min',
    status: 'Good',
    statusColor: 'emerald',
    ventilatorsAvailable: 7,
    isolation: true,
    action: 'reserve',
    btnLabel: 'Reserve Bed'
  },
  {
    id: 'max',
    name: 'Max Super Speciality',
    distance: '8.4 km',
    eta: '18 min',
    status: 'Moderate',
    statusColor: 'amber',
    ventilatorsAvailable: 8,
    isolation: true,
    action: 'request',
    btnLabel: 'Request Bed'
  },
  {
    id: 'medanta',
    name: 'Medanta Hospital',
    distance: '6.8 km',
    eta: '16 min',
    status: 'Good',
    statusColor: 'emerald',
    ventilatorsAvailable: 10,
    isolation: true,
    action: 'request',
    btnLabel: 'Request Bed'
  },
  {
    id: 'apollo',
    name: 'Apollo Hospital',
    distance: '10.3 km',
    eta: '22 min',
    status: 'Moderate',
    statusColor: 'amber',
    ventilatorsAvailable: 6,
    isolation: false,
    action: 'request',
    btnLabel: 'Request Bed'
  },
  {
    id: 'fortis',
    name: 'Fortis Hospital',
    distance: '14.2 km',
    eta: '28 min',
    status: 'Critical',
    statusColor: 'rose',
    ventilatorsAvailable: 2,
    isolation: true,
    action: 'disabled',
    btnLabel: 'No Beds'
  }
];

const ALERTS_DATA = [
  {
    id: 1,
    title: 'Fortis Hospital ICU occupancy above 90%',
    time: '12 min ago',
    type: 'critical',
    badgeClass: 'bg-rose-50 text-rose-600 border-rose-200'
  },
  {
    id: 2,
    title: 'Ambulance ETA updated (DL-4587)',
    time: '16 min ago',
    type: 'ambulance',
    badgeClass: 'bg-blue-50 text-blue-600 border-blue-200'
  },
  {
    id: 3,
    title: 'Rapid increase in cases - Delhi NCR',
    time: '32 min ago',
    type: 'warning',
    badgeClass: 'bg-amber-50 text-amber-600 border-amber-200'
  },
  {
    id: 4,
    title: 'Medanta Hospital has 2 ventilator beds available',
    time: '47 min ago',
    type: 'success',
    badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  }
];

const RightPanel = ({
  onSelectHospital,
  onOpenPatientModal,
  onReserveHospital,
  onQuickAction
}) => {
  const [isolationChecked, setIsolationChecked] = useState(true);
  const [specialistChecked, setSpecialistChecked] = useState(true);
  const [radius, setRadius] = useState('Within 25 km');

  return (
    <div className="space-y-5">
      {/* 1. Emergency Match Widget (Frosted Glass Iris Violet) */}
      <div className="rounded-[28px] p-5 sm:p-6 bg-indigo-50/90 dark:bg-indigo-950/30 backdrop-blur-2xl border border-indigo-200/80 dark:border-indigo-500/25 shadow-lg shadow-indigo-100/50 dark:shadow-[0_15px_35px_rgba(0,0,0,0.4),0_0_20px_rgba(99,102,241,0.12)] hover:-translate-y-1 hover:border-indigo-400/50 transition-all duration-300">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shadow-md border border-indigo-400/30">
              <Radio className="w-4 h-4 animate-pulse text-indigo-500 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-['Outfit']">
                Emergency Match
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-indigo-200/70 font-medium">Find hospitals with required facilities</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/15 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-300 dark:border-rose-400/40 shadow-sm">
            Triage 2 - High
          </span>
        </div>

        {/* Patient Needs */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-800 dark:text-slate-200 font-bold">+ Patient Needs</span>
            <span className="text-indigo-600 dark:text-indigo-300/70 text-[11px] font-semibold">Requirements</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 dark:bg-white/[0.05] border border-indigo-200 dark:border-indigo-400/30 text-slate-800 dark:text-slate-100 font-bold text-xs backdrop-blur-md shadow-sm">
              <Bed className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>ICU Bed</span>
              <span className="text-rose-600 dark:text-rose-400 font-black">+ Ventilator</span>
            </div>

            <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isolationChecked}
                  onChange={(e) => setIsolationChecked(e.target.checked)}
                  className="rounded border-slate-300 dark:border-white/20 bg-white dark:bg-white/10 text-cyan-600 dark:text-cyan-500 focus:ring-cyan-500 w-3.5 h-3.5"
                />
                <span className="text-[11px] font-semibold">Isolation (if available)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={specialistChecked}
                  onChange={(e) => setSpecialistChecked(e.target.checked)}
                  className="rounded border-slate-300 dark:border-white/20 bg-white dark:bg-white/10 text-cyan-600 dark:text-cyan-500 focus:ring-cyan-500 w-3.5 h-3.5"
                />
                <span className="text-[11px] font-semibold">Critical Specialist</span>
              </label>
            </div>
          </div>
        </div>

        {/* Location Selector */}
        <div className="mt-4 pt-3.5 border-t border-indigo-100 dark:border-white/[0.08]">
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
            Location Radius
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 font-semibold shadow-sm backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span className="truncate">Current Location</span>
            </div>

            <div className="relative">
              <select
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="w-full appearance-none px-3 py-2 pr-8 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 cursor-pointer shadow-sm backdrop-blur-md"
              >
                <option value="Within 10 km">Within 10 km</option>
                <option value="Within 25 km">Within 25 km</option>
                <option value="Within 50 km">Within 50 km</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hospitals with Available Beds (Frosted Glass Seafoam Emerald) */}
      <div className="rounded-[28px] p-5 sm:p-6 bg-white/85 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/40 dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:border-cyan-400/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-['Outfit']">
              Hospitals with Available Beds
            </h3>
            <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-400/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" /> Live
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {HOSPITALS_LIST.map((hosp) => (
            <div
              key={hosp.id}
              onClick={() => onSelectHospital && onSelectHospital(hosp)}
              className="group flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] hover:border-cyan-400/40 bg-slate-50/80 dark:bg-white/[0.03] hover:bg-slate-100/90 dark:hover:bg-white/[0.07] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer backdrop-blur-md"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                    hosp.statusColor === 'emerald'
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-400/40'
                      : hosp.statusColor === 'amber'
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-400/40'
                      : 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-400/40'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {hosp.name}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                        hosp.statusColor === 'emerald'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/30'
                          : hosp.statusColor === 'amber'
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/30'
                          : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-400/30'
                      }`}
                    >
                      {hosp.status === 'Good' ? '+ Good' : hosp.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium flex-wrap">
                    <span className="shrink-0">{hosp.distance} • {hosp.eta}</span>
                    <span className="shrink-0 text-slate-300 dark:text-slate-700">•</span>
                    <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-bold shrink-0">
                      <Wind className="w-3 h-3" /> Vent: {hosp.ventilatorsAvailable}
                    </span>
                    <span className="shrink-0 text-slate-300 dark:text-slate-700">•</span>
                    <span className="flex items-center gap-0.5 font-semibold shrink-0">
                      {hosp.isolation ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="w-3 h-3 text-rose-500 dark:text-rose-400" />
                      )}
                      <span>Isolation</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0">
                {hosp.action === 'reserve' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReserveHospital && onReserveHospital(hosp);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-cyan-600 dark:bg-cyan-500/20 hover:bg-cyan-500 dark:hover:bg-cyan-500/30 border border-cyan-500/50 dark:border-cyan-400/40 shadow-sm transition-all"
                  >
                    Reserve Bed
                  </button>
                ) : hosp.action === 'request' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReserveHospital && onReserveHospital(hosp);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/20 hover:border-cyan-400 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white bg-white dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/[0.1] shadow-sm transition-all"
                  >
                    Request Bed
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-white/[0.03] text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-white/[0.06] cursor-not-allowed"
                  >
                    No Beds
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Live Capacity Overview Widget (Frosted Glass Cyan & Ocean) */}
      <div className="rounded-[28px] p-5 sm:p-6 bg-white/85 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/40 dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:border-cyan-400/40 transition-all duration-300">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-['Outfit'] mb-2">
          Live Capacity Overview
        </h3>
        <DonutCapacityChart />
      </div>

      {/* 4. Recent Alerts (Frosted Glass Amber Gold) */}
      <div className="rounded-[28px] p-5 sm:p-6 bg-white/85 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/40 dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:border-amber-400/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-['Outfit']">
            Recent Alerts
          </h3>
          <button
            onClick={() => onQuickAction && onQuickAction('alerts')}
            className="text-xs font-extrabold text-amber-600 dark:text-amber-300 hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-2.5">
          {ALERTS_DATA.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] hover:bg-slate-100/90 dark:hover:bg-white/[0.07] border border-slate-200/80 dark:border-white/[0.08] hover:border-amber-400/40 shadow-sm text-xs transition-colors backdrop-blur-md"
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 shrink-0 border ${alert.badgeClass}`}
                >
                  {alert.type === 'ambulance' ? (
                    <Ambulance className="w-3.5 h-3.5" />
                  ) : alert.type === 'critical' ? (
                    <ShieldAlert className="w-3.5 h-3.5" />
                  ) : alert.type === 'warning' ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : (
                    <Bed className="w-3.5 h-3.5" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100 leading-snug">
                    {alert.title}
                  </p>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                    {alert.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Emergency Case (Frosted Glass Crimson Ruby) */}
      <div className="rounded-[28px] p-5 sm:p-6 bg-rose-50/90 dark:bg-rose-950/30 backdrop-blur-2xl border border-rose-200/80 dark:border-rose-500/25 shadow-lg shadow-rose-100/50 dark:shadow-[0_15px_35px_rgba(0,0,0,0.4),0_0_20px_rgba(244,63,94,0.12)] hover:-translate-y-1 hover:border-rose-400/50 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-300 flex items-center justify-center shadow-md border border-rose-400/30">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-['Outfit']">
                Emergency Case
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-rose-200/70 font-medium">Critical Patient • ICU + Ventilator</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-300 dark:border-rose-400/40 shadow-sm">
            Triage 2 - High
          </span>
        </div>

        {/* Spec List */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-white/90 dark:bg-white/[0.04] border border-rose-200/60 dark:border-white/[0.08] shadow-sm text-xs font-semibold backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Age Group</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">Adult (35-60)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Condition</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">Respiratory Distress</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Location</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">R. Ambulance (ETA 18 min)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Triage Level</span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400">2 - High</span>
          </div>
        </div>

        {/* View Full Details Button */}
        <button
          onClick={onOpenPatientModal}
          className="w-full mt-4 py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-600 border border-rose-400/40 shadow-lg shadow-rose-900/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <span>View Full Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-rose-200/60 dark:border-white/[0.08] text-xs font-bold">
          <button
            onClick={() => onQuickAction && onQuickAction('nearest')}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-white/90 hover:bg-white dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white border border-rose-200/80 dark:border-white/10 hover:border-cyan-400/40 transition-all shadow-sm cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0" />
            <span className="truncate">Find Nearest</span>
          </button>
          <button
            onClick={() => onQuickAction && onQuickAction('ambulance')}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-white/90 hover:bg-white dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white border border-rose-200/80 dark:border-white/10 hover:border-cyan-400/40 transition-all shadow-sm cursor-pointer"
          >
            <Ambulance className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0" />
            <span className="truncate">Track Ambulance</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
