import React, { useState, useEffect } from 'react';
import { Plus, Minus, Check, AlertCircle } from 'lucide-react';

const ResourceCard = ({
  title,
  availableKey,
  totalKey,
  resources,
  icon: Icon,
  unit = '',
  onUpdate,
  isUpdating = false,
  highlight = false
}) => {
  const available = resources ? resources[availableKey] : 0;
  const total = resources ? resources[totalKey] : 0;

  const [localAvailable, setLocalAvailable] = useState(available);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    setLocalAvailable(available);
    setHasChanged(false);
  }, [available]);

  const percentage = total > 0 ? Math.round((localAvailable / total) * 100) : 0;

  // Capacity color logic
  let statusColor = 'emerald';
  let barColor = 'bg-emerald-500';
  let badgeText = 'Normal';

  if (percentage <= 15 || localAvailable <= 2) {
    statusColor = 'red';
    barColor = 'bg-red-500';
    badgeText = localAvailable === 0 ? 'Exhausted' : 'Critical';
  } else if (percentage <= 40) {
    statusColor = 'amber';
    barColor = 'bg-amber-500';
    badgeText = 'Limited';
  }

  const handleIncrement = () => {
    if (localAvailable < total) {
      const nextVal = localAvailable + 1;
      setLocalAvailable(nextVal);
      setHasChanged(true);
      if (onUpdate) {
        onUpdate({ [availableKey]: nextVal });
      }
    }
  };

  const handleDecrement = () => {
    if (localAvailable > 0) {
      const nextVal = localAvailable - 1;
      setLocalAvailable(nextVal);
      setHasChanged(true);
      if (onUpdate) {
        onUpdate({ [availableKey]: nextVal });
      }
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-[#0B1324]/85 backdrop-blur-xl p-5 transition-all duration-300 ${
        highlight ? 'flash-update ring-2 ring-cyan-400 shadow-glow-cyan' : 'border-white/[0.08] hover:border-white/[0.14]'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-3 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide font-['Outfit']">{title}</h4>
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider ${
                statusColor === 'red'
                  ? 'text-red-400'
                  : statusColor === 'amber'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${barColor} animate-pulse`} />
              {badgeText} // {percentage}% Cap
            </span>
          </div>
        </div>

        {/* Available / Total Number */}
        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1 font-mono">
            <span
              className={`text-3xl font-black tracking-tight transition-all duration-200 ${
                statusColor === 'red'
                  ? 'text-red-400'
                  : statusColor === 'amber'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {localAvailable}
            </span>
            {totalKey && (
              <span className="text-sm text-slate-500 font-semibold">/ {total}</span>
            )}
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            {unit ? `${unit} available` : 'ready units'}
          </span>
        </div>
      </div>

      {/* Capacity Progress Bar */}
      {totalKey && (
        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden p-[1px]">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                statusColor === 'red'
                  ? 'bg-gradient-to-r from-red-500 to-rose-500'
                  : statusColor === 'amber'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>
        </div>
      )}

      {/* Stepper Controls */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-3">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
          Touch Dial:
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            disabled={localAvailable <= 0 || isUpdating}
            className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all border border-white/[0.08] hover:border-white/[0.16]"
            title="Decrement by 1"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="w-12 text-center font-mono font-black text-sm text-white bg-[#060B16] py-1 px-2 rounded-xl border border-white/[0.08]">
            {localAvailable}
          </span>

          <button
            onClick={handleIncrement}
            disabled={(totalKey && localAvailable >= total) || isUpdating}
            className="w-8 h-8 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 active:scale-95 text-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all border border-cyan-500/30 hover:border-cyan-400 shadow-sm shadow-cyan-500/20"
            title="Increment by 1"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
