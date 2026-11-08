import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { Navigation, Bed, Activity, Wind, Phone, Link2 } from 'lucide-react';

const HospitalCard = ({
  hospital,
  onSelectRoute,
  isSelected = false,
  isRecentlyUpdated = false,
  isLoadingRoute = false
}) => {
  const res = hospital.resources || {};
  const erBeds = res.emergencyBedsAvailable !== undefined ? res.emergencyBedsAvailable : 0;
  const icuBeds = res.icuBedsAvailable !== undefined ? res.icuBedsAvailable : 0;
  const vents = res.ventilatorsAvailable !== undefined ? res.ventilatorsAvailable : 0;

  const isCriticalBeds = erBeds <= 2;
  const isFull = hospital.emergencyStatus === 'FULL' || erBeds === 0;

  return (
    <div
      className={`rounded-xl border p-4 transition-colors shadow-sm ${
        isRecentlyUpdated ? 'flash-update border-blue-500 ring-2 ring-blue-500/30' : ''
      } ${
        isSelected
          ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20'
          : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top Badge & Distance */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={hospital.emergencyStatus} type="hospital" size="sm" />
            {isRecentlyUpdated && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60">
                Live Flash
              </span>
            )}
          </div>
          <h4 className="mt-2 text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            {hospital.name}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[280px] mt-0.5">
            {hospital.address}
          </p>
        </div>

        {/* ETA & Distance Pill */}
        {hospital.distanceKm !== undefined && (
          <div className="text-right shrink-0 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
              {hospital.etaMinutes} min
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              {hospital.distanceKm} km
            </div>
          </div>
        )}
      </div>

      {/* Real-Time Resource Metrics Pods */}
      <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-center gap-1 text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-0.5">
            <Bed className="w-3 h-3 text-slate-400" />
            <span>ER Beds</span>
          </div>
          <div
            className={`text-base font-bold font-mono ${
              isCriticalBeds ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {erBeds}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-center gap-1 text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-0.5">
            <Activity className="w-3 h-3 text-slate-400" />
            <span>ICU</span>
          </div>
          <div
            className={`text-base font-bold font-mono ${
              icuBeds === 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'
            }`}
          >
            {icuBeds}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-center gap-1 text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-0.5">
            <Wind className="w-3 h-3 text-slate-400" />
            <span>Vent</span>
          </div>
          <div className="text-base font-bold font-mono text-slate-900 dark:text-white">
            {vents}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        {hospital.phone && (
          <a
            href={`tel:${hospital.phone}`}
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="font-mono text-[11px]">{hospital.phone}</span>
          </a>
        )}

        <button
          onClick={() => onSelectRoute(hospital)}
          disabled={isLoadingRoute || isFull}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ml-auto cursor-pointer ${
            isFull
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
              : isSelected
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
          }`}
        >
          {isSelected ? (
            <>
              <Link2 className="w-3.5 h-3.5" />
              <span>Attached & En Route</span>
            </>
          ) : isFull ? (
            'Capacity Full'
          ) : (
            <>
              <Navigation className="w-3.5 h-3.5" />
              <span>Route & Attach</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default HospitalCard;