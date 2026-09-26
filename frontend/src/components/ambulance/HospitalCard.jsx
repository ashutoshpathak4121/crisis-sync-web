import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { Navigation, Bed, Activity, Wind, Phone, ArrowUpRight, Link2 } from 'lucide-react';

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
      className={`relative rounded-2xl border bg-white/85 dark:bg-[#0B1324]/85 backdrop-blur-xl p-5 transition-all duration-300 shadow-md shadow-slate-200/40 dark:shadow-none ${
        isRecentlyUpdated ? 'flash-update ring-2 ring-cyan-400 shadow-glow-cyan' : ''
      } ${
        isSelected
          ? 'border-emerald-500/60 ring-1 ring-emerald-500/40 bg-gradient-to-b from-emerald-50/50 to-teal-50/50 dark:from-[#0E1B2E] dark:to-[#0A1424] shadow-md shadow-emerald-500/20'
          : 'border-slate-200/80 dark:border-white/[0.08] hover:border-cyan-500/40 hover:bg-slate-50/80 dark:hover:bg-[#0E192D]/90'
      }`}
    >
      {/* Top Badge & Distance */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={hospital.emergencyStatus} type="hospital" size="sm" />
            {isRecentlyUpdated && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 animate-pulse">
                Live Capacity Flash
              </span>
            )}
          </div>
          <h4 className="mt-2.5 text-base font-extrabold text-slate-900 dark:text-white tracking-tight font-['Outfit']">
            {hospital.name}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[280px] mt-0.5">
            {hospital.address}
          </p>
        </div>

        {/* ETA & Distance Pill */}
        {hospital.distanceKm !== undefined && (
          <div className="text-right flex-shrink-0 bg-slate-50 dark:bg-[#060B16] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-sm">
            <div className="text-sm font-extrabold text-cyan-600 dark:text-cyan-300 font-mono">
              {hospital.etaMinutes} min
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              {hospital.distanceKm} km away
            </div>
          </div>
        )}
      </div>

      {/* Real-Time Resource Metrics Pods */}
      <div className="grid grid-cols-3 gap-2.5 mt-4 pt-3.5 border-t border-slate-200/80 dark:border-white/[0.06]">
        <div className="bg-slate-50 dark:bg-[#060B16] p-2.5 rounded-xl border border-slate-200 dark:border-white/[0.06] text-center shadow-sm">
          <div className="flex items-center justify-center gap-1 text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-1">
            <Bed className="w-3.5 h-3.5 text-slate-400" />
            <span>ER Beds</span>
          </div>
          <div
            className={`text-xl font-extrabold font-mono transition-colors ${
              isCriticalBeds ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {erBeds}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-[#060B16] p-2.5 rounded-xl border border-slate-200 dark:border-white/[0.06] text-center shadow-sm">
          <div className="flex items-center justify-center gap-1 text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-1">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            <span>ICU Beds</span>
          </div>
          <div
            className={`text-xl font-extrabold font-mono transition-colors ${
              icuBeds === 0 ? 'text-red-500 dark:text-red-400' : 'text-slate-800 dark:text-slate-100'
            }`}
          >
            {icuBeds}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-[#060B16] p-2.5 rounded-xl border border-slate-200 dark:border-white/[0.06] text-center shadow-sm">
          <div className="flex items-center justify-center gap-1 text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-1">
            <Wind className="w-3.5 h-3.5 text-slate-400" />
            <span>Ventilators</span>
          </div>
          <div className="text-xl font-extrabold font-mono text-slate-800 dark:text-slate-100">
            {vents}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-200/80 dark:border-white/[0.04] flex items-center justify-between gap-3">
        {hospital.phone && (
          <a
            href={`tel:${hospital.phone}`}
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="font-mono text-[11px]">{hospital.phone}</span>
          </a>
        )}

        <button
          onClick={() => onSelectRoute(hospital)}
          disabled={isLoadingRoute || isFull}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ml-auto active:scale-95 shadow-sm ${
            isFull
              ? 'bg-slate-100 dark:bg-white/[0.02] text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-white/[0.04]'
              : isSelected
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold shadow-md shadow-emerald-500/30'
              : 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-400/50 hover:bg-cyan-500/25 hover:border-cyan-400 hover:text-cyan-900 dark:hover:text-white'
          }`}
        >
          {isSelected ? (
            <>
              <Link2 className="w-3.5 h-3.5" />
              Attached & En Route
            </>
          ) : isFull ? (
            'Capacity Full'
          ) : (
            <>
              <Navigation className="w-3.5 h-3.5" />
              Route & Attach
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default HospitalCard;
