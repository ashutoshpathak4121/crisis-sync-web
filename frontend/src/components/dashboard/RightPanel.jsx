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

const DEFAULT_HOSPITALS = [
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
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
  },
  {
    id: 2,
    title: 'Ambulance ETA updated (DL-4587)',
    time: '16 min ago',
    type: 'ambulance',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60'
  },
  {
    id: 3,
    title: 'Rapid increase in cases - Delhi NCR',
    time: '32 min ago',
    type: 'warning',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
  },
  {
    id: 4,
    title: 'Medanta Hospital has 2 ventilator beds available',
    time: '47 min ago',
    type: 'success',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
  }
];

const RightPanel = ({
  onSelectHospital,
  onOpenPatientModal,
  onReserveHospital,
  onQuickAction,
  hospitals: propHospitals
}) => {
  const [isolationChecked, setIsolationChecked] = useState(true);
  const [specialistChecked, setSpecialistChecked] = useState(true);
  const [radius, setRadius] = useState('Within 25 km');

  // Format hospital list from real props or fallback
  const displayHospitals = (propHospitals && propHospitals.length > 0)
    ? propHospitals.slice(0, 5).map((h) => {
        const erAvail = h.resources?.emergencyBedsAvailable ?? 10;
        const isCritical = h.emergencyStatus === 'FULL' || erAvail === 0;
        const isGood = h.emergencyStatus === 'ACCEPTING';
        return {
          id: h.id,
          name: h.name,
          distance: h.distance || '8.2 km',
          eta: h.eta || '18 min',
          status: isCritical ? 'Critical' : isGood ? 'Good' : 'Moderate',
          statusColor: isCritical ? 'rose' : isGood ? 'emerald' : 'amber',
          ventilatorsAvailable: h.resources?.oxygenBedsAvailable ?? 6,
          isolation: true,
          action: isCritical ? 'disabled' : 'reserve',
          rawHospital: h
        };
      })
    : DEFAULT_HOSPITALS;

  return (
    <div className="space-y-4">
      {/* 1. Emergency Match Widget */}
      <div className="rounded-xl p-4 sm:p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800/60">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Emergency Match
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Find facilities by patient requirements</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60">
            Triage 2 - High
          </span>
        </div>

        {/* Patient Needs */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Required Care</span>
            <span className="text-blue-600 dark:text-blue-400 text-[11px] font-medium">Criteria</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium">
              <Bed className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>ICU Bed</span>
              <span className="text-rose-600 dark:text-rose-400 font-semibold">+ Ventilator</span>
            </div>

            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isolationChecked}
                  onChange={(e) => setIsolationChecked(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-[11px] font-medium">Isolation (if available)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={specialistChecked}
                  onChange={(e) => setSpecialistChecked(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-[11px] font-medium">Critical Specialist</span>
              </label>
            </div>
          </div>
        </div>

        {/* Location Selector */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
            Search Radius
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="truncate">Current Location</span>
            </div>

            <div className="relative">
              <select
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="w-full appearance-none px-3 py-1.5 pr-8 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
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

      {/* 2. Hospitals with Available Beds */}
      <div className="rounded-xl p-4 sm:p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Hospitals with Available Beds
            </h3>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {displayHospitals.map((hosp) => (
            <div
              key={hosp.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectHospital && onSelectHospital(hosp.rawHospital || hosp)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectHospital && onSelectHospital(hosp.rawHospital || hosp);
                }
              }}
              className="group flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    hosp.statusColor === 'emerald'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                      : hosp.statusColor === 'amber'
                      ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
                      : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {hosp.name}
                    </h4>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                        hosp.statusColor === 'emerald'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                          : hosp.statusColor === 'amber'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
                          : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
                      }`}
                    >
                      {hosp.status === 'Good' ? 'Good' : hosp.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium flex-wrap">
                    <span className="shrink-0 font-mono">{hosp.distance} • {hosp.eta}</span>
                    <span className="shrink-0 text-slate-300 dark:text-slate-600">•</span>
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold shrink-0">
                      <Wind className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Vent: <span className="font-mono">{hosp.ventilatorsAvailable}</span>
                    </span>
                    <span className="shrink-0 text-slate-300 dark:text-slate-600">•</span>
                    <span className="flex items-center gap-0.5 font-medium shrink-0">
                      {hosp.isolation ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
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
                      onReserveHospital && onReserveHospital(hosp.rawHospital || hosp);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
                  >
                    Reserve Bed
                  </button>
                ) : hosp.action === 'request' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReserveHospital && onReserveHospital(hosp.rawHospital || hosp);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Request Bed
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
                  >
                    No Beds
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Live Capacity Overview Widget */}
      <div className="rounded-xl p-4 sm:p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
          Live Capacity Overview
        </h3>
        <DonutCapacityChart />
      </div>

      {/* 4. Recent Alerts */}
      <div className="rounded-xl p-4 sm:p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Recent Alerts
          </h3>
          <button
            onClick={() => onQuickAction && onQuickAction('alerts')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-2">
          {ALERTS_DATA.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center mt-0.5 shrink-0 border ${alert.badgeClass}`}
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
                  <p className="font-medium text-slate-800 dark:text-slate-200 leading-snug">
                    {alert.title}
                  </p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {alert.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Emergency Case */}
      <div className="rounded-xl p-4 sm:p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-200 dark:border-red-800/60">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Active Emergency Case
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Critical Patient • ICU + Ventilator</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60">
            Triage 2 - High
          </span>
        </div>

        {/* Spec List */}
        <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Age Group</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">Adult (35-60)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Condition</span>
            <span className="font-semibold text-rose-600 dark:text-rose-400">Respiratory Distress</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Location</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">R. Ambulance (ETA 18 min)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Triage Level</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">2 - High</span>
          </div>
        </div>

        {/* View Full Details Button */}
        <button
          onClick={onOpenPatientModal}
          className="w-full mt-3 py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>View Patient Telemetry</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-medium">
          <button
            onClick={() => onQuickAction && onQuickAction('nearest')}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">Find Nearest</span>
          </button>
          <button
            onClick={() => onQuickAction && onQuickAction('ambulance')}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Ambulance className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">Track Ambulance</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;