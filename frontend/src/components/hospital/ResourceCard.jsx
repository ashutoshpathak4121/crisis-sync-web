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
      className={`relative overflow-hidden rounded-xl border bg-[#0E1626] p-5 transition-all duration-300 ${
        highlight ? 'flash-update ring-2 ring-cyan-400' : 'border-[#1E2E48]'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="p-2.5 rounded-lg bg-slate-800/80 text-cyan-400 border border-slate-700/50">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 tracking-wide">{title}</h4>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider ${
                statusColor === 'red'
                  ? 'text-red-400'
                  : statusColor === 'amber'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {badgeText} ({percentage}%)
            </span>
          </div>
        </div>

        {/* Available / Total Number */}
        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1 font-mono">
            <span
              className={`text-3xl font-extrabold transition-all duration-200 ${
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
          <span className="text-[11px] text-slate-400 tracking-wide">
            {unit ? `${unit} available` : 'available units'}
          </span>
        </div>
      </div>

      {/* Capacity Progress Bar */}
      {totalKey && (
        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out ${barColor}`}
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>
        </div>
      )}

      {/* Stepper Controls */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-400 font-medium">Quick Adjust:</span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            disabled={localAvailable <= 0 || isUpdating}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all border border-slate-700"
            title="Decrement by 1"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="w-10 text-center font-mono font-bold text-sm text-white bg-slate-900 py-1 px-1.5 rounded border border-slate-800">
            {localAvailable}
          </span>

          <button
            onClick={handleIncrement}
            disabled={(totalKey && localAvailable >= total) || isUpdating}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all border border-slate-700"
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
