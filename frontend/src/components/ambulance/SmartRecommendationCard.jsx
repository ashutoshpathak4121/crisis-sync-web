import React from 'react';
import { Sparkles, Check, Navigation, AlertCircle } from 'lucide-react';

const SmartRecommendationCard = ({ recommendation, onSelectRoute }) => {
  if (!recommendation) return null;

  const { hospital, score, etaMinutes, distanceKm, reasons } = recommendation;
  const res = hospital.resources || {};

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-[#0E1626] to-[#0E1626] p-5 shadow-xl shadow-cyan-500/5">
      {/* Glow accent */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Emergency Destination Recommendation
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-3">
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              {hospital.name}
            </h3>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
              Score: {score}/100
            </span>
          </div>

          <div className="mt-1 flex items-center gap-4 text-xs font-mono text-slate-300">
            <span>ETA: <strong className="text-white font-bold">{etaMinutes} min</strong></span>
            <span>Distance: <strong className="text-white font-bold">{distanceKm} km</strong></span>
            <span>ER Beds: <strong className="text-emerald-400 font-bold">{res.emergencyBedsAvailable}</strong></span>
            <span>ICU Beds: <strong className="text-cyan-400 font-bold">{res.icuBedsAvailable}</strong></span>
          </div>
        </div>

        <button
          onClick={() => onSelectRoute(hospital)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all active:scale-95 flex-shrink-0"
        >
          <Navigation className="w-4 h-4 fill-slate-950" />
          Navigate Here
        </button>
      </div>

      {/* Transparent Why Recommended Breakdown */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Why Recommended?
        </p>
        <div className="flex flex-wrap gap-2">
          {reasons && reasons.map((reason, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#080C15] border border-slate-800 text-[11px] text-slate-300 font-medium"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              {reason}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartRecommendationCard;
