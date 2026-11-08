import React from 'react';
import { Sparkles, Check, Navigation } from 'lucide-react';

const SmartRecommendationCard = ({ recommendation, onSelectRoute }) => {
  if (!recommendation) return null;

  const { hospital, score, etaMinutes, distanceKm, reasons } = recommendation;
  const res = hospital.resources || {};

  return (
    <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              AI Destination Recommendation
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2.5 flex-wrap">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {hospital.name}
            </h3>
            <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300 bg-white dark:bg-blue-900/50 px-2.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
              Match Score: {score}/100
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2.5 text-xs font-mono text-slate-600 dark:text-slate-300 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              ETA: <strong className="text-slate-900 dark:text-white font-bold">{etaMinutes} min</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              Distance: <strong className="text-slate-900 dark:text-white font-bold">{distanceKm} km</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300">
              ER Beds: <strong className="font-bold">{res.emergencyBedsAvailable} avail</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300">
              ICU: <strong className="font-bold">{res.icuBedsAvailable} units</strong>
            </span>
          </div>
        </div>

        <button
          onClick={() => onSelectRoute(hospital)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm shrink-0 cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
          <span>Navigate & Route</span>
        </button>
      </div>

      {/* Transparent Why Recommended Breakdown */}
      <div className="mt-3.5 pt-3 border-t border-blue-200/60 dark:border-blue-900/40">
        <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
          Clinical Match Factors
        </p>
        <div className="flex flex-wrap gap-2">
          {reasons && reasons.map((reason, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-medium"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              {reason}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartRecommendationCard;