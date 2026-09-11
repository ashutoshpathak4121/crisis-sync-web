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
      className={`relative rounded-xl border bg-[#0E1626] p-5 transition-all duration-300 ${
        isRecentlyUpdated ? 'flash-update ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20' : ''
      } ${
        isSelected
          ? 'border-cyan-500/60 ring-1 ring-cyan-500/30 bg-[#121D32]'
          : 'border-[#1E2E48] hover:border-slate-600'
      }`}
    >
      {/* Top Badge & Distance */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={hospital.emergencyStatus} type="hospital" size="sm" />
            {isRecentlyUpdated && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                Capacity Updated Live
              </span>
            )}
          </div>
          <h4 className="mt-2 text-base font-bold text-white tracking-tight">
            {hospital.name}
          </h4>
          <p className="text-xs text-slate-400 truncate max-w-[280px]">
            {hospital.address}
          </p>
        </div>

        {/* ETA & Distance Pill */}
        {hospital.distanceKm !== undefined && (
          <div className="text-right flex-shrink-0 bg-[#080C15] px-3 py-1.5 rounded-lg border border-slate-800">
            <div className="text-sm font-extrabold text-cyan-400 font-mono">
              {hospital.etaMinutes} min
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {hospital.distanceKm} km
            </div>
          </div>
        )}
      </div>

      {/* Real-Time Resource Metrics */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80">
        <div className="bg-[#080C15] p-2.5 rounded-lg border border-slate-800/60 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
            <Bed className="w-3.5 h-3.5 text-slate-400" />
            <span>ER Beds</span>
          </div>
          <div
            className={`text-xl font-extrabold font-mono transition-colors ${
              isCriticalBeds ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {erBeds}
          </div>
        </div>

        <div className="bg-[#080C15] p-2.5 rounded-lg border border-slate-800/60 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            <span>ICU Beds</span>
          </div>
          <div
            className={`text-xl font-extrabold font-mono transition-colors ${
              icuBeds === 0 ? 'text-red-400' : 'text-slate-100'
            }`}
          >
            {icuBeds}
          </div>
        </div>

        <div className="bg-[#080C15] p-2.5 rounded-lg border border-slate-800/60 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
            <Wind className="w-3.5 h-3.5 text-slate-400" />
            <span>Ventilators</span>
          </div>
          <div className="text-xl font-extrabold font-mono text-slate-100">
            {vents}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 flex items-center justify-between gap-3">
        {hospital.phone && (
          <a
            href={`tel:${hospital.phone}`}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-[11px]">{hospital.phone}</span>
          </a>
        )}

        <button
          onClick={() => onSelectRoute(hospital)}
          disabled={isLoadingRoute || isFull}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ml-auto ${
            isFull
              ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-800'
              : isSelected
              ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400/50'
              : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/25 hover:border-cyan-400'
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
