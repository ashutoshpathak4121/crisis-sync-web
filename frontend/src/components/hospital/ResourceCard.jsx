import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';

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
      className={`rounded-xl border bg-white dark:bg-[#1E293B] p-4 sm:p-5 transition-colors shadow-sm ${
        highlight
          ? 'flash-update border-blue-500 ring-2 ring-blue-500/30'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wide">{title}</h4>
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider ${
                statusColor === 'red'
                  ? 'text-red-600 dark:text-red-400'
                  : statusColor === 'amber'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${barColor}`} />
              {badgeText} • {percentage}% Cap
            </span>
          </div>
        </div>

        {/* Available / Total Number */}
        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1 font-mono">
            <span
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                statusColor === 'red'
                  ? 'text-red-600 dark:text-red-400'
                  : statusColor === 'amber'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {localAvailable}
            </span>
            {totalKey && (
              <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">/ {total}</span>
            )}
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
            {unit ? `${unit} available` : 'ready units'}
          </span>
        </div>
      </div>

      {/* Capacity Progress Bar */}
      {totalKey && (
        <div className="mt-3.5">
          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out ${barColor}`}
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>
        </div>
      )}

      {/* Stepper Controls with 44px Minimum Touch Targets */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
          Quick Adjust:
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            disabled={localAvailable <= 0 || isUpdating}
            aria-label={`Decrease ${title} available count`}
            className="min-w-[44px] min-h-[44px] rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="min-w-[44px] min-h-[44px] flex items-center justify-center font-mono font-bold text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
            {localAvailable}
          </span>

          <button
            onClick={handleIncrement}
            disabled={(totalKey && localAvailable >= total) || isUpdating}
            aria-label={`Increase ${title} available count`}
            className="min-w-[44px] min-h-[44px] rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors border border-blue-200 dark:border-blue-800/60 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;