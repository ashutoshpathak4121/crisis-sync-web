import React from 'react';
import { Navigation, Clock, MapPin, X, AlertTriangle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const RoutePanel = ({ route, onClearRoute }) => {
  if (!route) return null;

  const { hospital, distanceKm, durationMin } = route;
  const res = hospital?.resources || {};
  const isCritical = res.emergencyBedsAvailable <= 2;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-4 shadow-sm text-slate-900 dark:text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-blue-600 dark:text-blue-400 font-semibold">
                Active En-Route Navigation
              </span>
              <StatusBadge status={hospital.emergencyStatus} type="hospital" size="sm" />
            </div>
            <h4 className="text-sm font-bold tracking-tight mt-0.5">
              {hospital.name}
            </h4>
          </div>
        </div>

        <button
          onClick={onClearRoute}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Cancel Route"
          aria-label="Cancel route"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center font-mono">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-sans font-medium">ETA</span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{durationMin} min</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-sans font-medium">Distance</span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{distanceKm} km</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-sans font-medium">ER Beds</span>
          <span className={`text-sm font-bold ${isCritical ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {res.emergencyBedsAvailable}
          </span>
        </div>
      </div>

      {isCritical && (
        <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          <span>Notice: Destination ER capacity is low ({res.emergencyBedsAvailable} beds). Prepared for diversion if needed.</span>
        </div>
      )}
    </div>
  );
};

export default RoutePanel;