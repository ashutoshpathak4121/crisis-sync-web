import React from 'react';
import { Navigation, Clock, MapPin, X, AlertTriangle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const RoutePanel = ({ route, onClearRoute }) => {
  if (!route) return null;

  const { hospital, distanceKm, durationMin } = route;
  const res = hospital?.resources || {};
  const isCritical = res.emergencyBedsAvailable <= 2;

  return (
    <div className="rounded-xl border border-cyan-500/50 bg-[#0E1626] p-4 shadow-xl shadow-cyan-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold">
                Active En-Route Navigation
              </span>
              <StatusBadge status={hospital.emergencyStatus} type="hospital" size="sm" />
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight mt-0.5">
              {hospital.name}
            </h4>
          </div>
        </div>

        <button
          onClick={onClearRoute}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Cancel Route"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center font-mono">
        <div className="bg-[#080C15] p-2 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block font-sans">ETA</span>
          <span className="text-base font-extrabold text-cyan-400">{durationMin} min</span>
        </div>
        <div className="bg-[#080C15] p-2 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block font-sans">Distance</span>
          <span className="text-base font-extrabold text-slate-200">{distanceKm} km</span>
        </div>
        <div className="bg-[#080C15] p-2 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block font-sans">ER Beds</span>
          <span className={`text-base font-extrabold ${isCritical ? 'text-red-400' : 'text-emerald-400'}`}>
            {res.emergencyBedsAvailable}
          </span>
        </div>
      </div>

      {isCritical && (
        <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>Notice: Destination ER capacity is low ({res.emergencyBedsAvailable} beds). Prepared for diversion if needed.</span>
        </div>
      )}
    </div>
  );
};

export default RoutePanel;
