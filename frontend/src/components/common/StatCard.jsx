import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'cyan',
  trend = null,
  onClick = null,
  highlight = false
}) => {
  const colorMap = {
    cyan: {
      border: 'border-slate-200 dark:border-slate-700 hover:border-blue-500/50',
      text: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60',
    },
    red: {
      border: 'border-slate-200 dark:border-slate-700 hover:border-red-500/50',
      text: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/60',
    },
    emerald: {
      border: 'border-slate-200 dark:border-slate-700 hover:border-emerald-500/50',
      text: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
    },
    amber: {
      border: 'border-slate-200 dark:border-slate-700 hover:border-amber-500/50',
      text: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
    },
    purple: {
      border: 'border-slate-200 dark:border-slate-700 hover:border-blue-500/50',
      text: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60',
    }
  };

  const c = colorMap[color] || colorMap.cyan;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border bg-white dark:bg-[#1E293B] p-4 sm:p-5 transition-colors duration-150 shadow-sm ${
        c.border
      } ${
        onClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60' : ''
      } ${highlight ? 'ring-2 ring-emerald-500' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight font-mono text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>

        {Icon && (
          <div
            className={`p-2.5 rounded-lg border ${c.iconBg} shadow-sm shrink-0`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend !== null) && (
        <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-normal truncate">{subtitle}</span>
          )}
          {trend !== null && (
            <span
              className={`text-xs font-mono font-semibold px-1.5 py-0.5 rounded border ${
                trend > 0
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800/60'
              }`}
            >
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
