import React from 'react';
import { Sparkles, Check, Navigation, AlertCircle } from 'lucide-react';

const SmartRecommendationCard = ({ recommendation, onSelectRoute }) => {
  if (!recommendation) return null;

  const { hospital, score, etaMinutes, distanceKm, reasons } = recommendation;
  const res = hospital.resources || {};

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-300 dark:border-cyan-500/30 bg-gradient-to-r from-cyan-50/90 via-teal-50/80 to-blue-50/90 dark:from-cyan-950/40 dark:via-[#0B1426] dark:to-[#0A101E] p-5 shadow-lg shadow-cyan-100/50 dark:shadow-2xl backdrop-blur-2xl">
      {/* Glow accent */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-extrabold uppercase tracking-wider bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border border-cyan-400/50 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
              AI Emergency Destination Recommendation
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline gap-3 flex-wrap">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight font-['Outfit']">
              {hospital.name}
            </h3>
            <span className="text-xs font-mono font-bold text-cyan-800 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950/80 px-2.5 py-0.5 rounded-lg border border-cyan-300 dark:border-cyan-500/40 shadow-sm">
              Match Score: {score}/100
            </span>
          </div>

          <div className="mt-2 flex items-center gap-3 text-xs font-mono text-slate-600 dark:text-slate-300 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08]">
              ETA: <strong className="text-slate-900 dark:text-white font-bold">{etaMinutes} min</strong>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08]">
              Distance: <strong className="text-slate-900 dark:text-white font-bold">{distanceKm} km</strong>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
              ER Beds: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{res.emergencyBedsAvailable} avail</strong>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300">
              ICU: <strong className="text-cyan-600 dark:text-cyan-400 font-bold">{res.icuBedsAvailable} units</strong>
            </span>
          </div>
        </div>

        <button
          onClick={() => onSelectRoute(hospital)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all active:scale-95 flex-shrink-0"
        >
          <Navigation className="w-4 h-4 fill-white" />
          Navigate & Route
        </button>
      </div>

      {/* Transparent Why Recommended Breakdown */}
      <div className="mt-4 pt-3.5 border-t border-slate-200/80 dark:border-white/[0.06]">
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
          Clinical Match Factors
        </p>
        <div className="flex flex-wrap gap-2">
          {reasons && reasons.map((reason, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/80 dark:bg-[#060B16] border border-slate-200 dark:border-white/[0.08] text-[11px] text-slate-700 dark:text-slate-300 font-medium shadow-sm"
            >
              <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
              {reason}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartRecommendationCard;
