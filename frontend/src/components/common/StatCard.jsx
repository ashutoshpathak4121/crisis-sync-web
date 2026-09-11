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
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      text: 'text-cyan-400',
      badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      glow: 'shadow-[0_0_20px_-5px_rgba(6,182,212,0.2)]',
      gradient: 'from-cyan-400 to-teal-300'
    },
    red: {
      border: 'border-red-500/20 hover:border-red-500/40',
      text: 'text-red-400',
      badge: 'bg-red-500/10 text-red-300 border-red-500/30',
      iconBg: 'bg-red-500/15 text-red-400 border-red-500/30',
      glow: 'shadow-[0_0_20px_-5px_rgba(239,68,68,0.2)]',
      gradient: 'from-red-400 to-rose-300'
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      text: 'text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      glow: 'shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]',
      gradient: 'from-emerald-400 to-teal-300'
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      text: 'text-amber-400',
      badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      glow: 'shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)]',
      gradient: 'from-amber-400 to-yellow-300'
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/40',
      text: 'text-purple-400',
      badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      iconBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      glow: 'shadow-[0_0_20px_-5px_rgba(139,92,246,0.2)]',
      gradient: 'from-purple-400 to-indigo-300'
    }
  };

  const c = colorMap[color] || colorMap.cyan;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-b from-[#0F1829]/90 to-[#0A101D]/90 backdrop-blur-xl p-4 sm:p-5 transition-all duration-300 group ${
        c.border
      } ${c.glow} ${
        onClick ? 'cursor-pointer hover:scale-[1.02] hover:-translate-y-0.5' : ''
      } ${highlight ? 'ring-2 ring-cyan-400 shadow-glow-cyan' : ''}`}
    >
      {/* Top micro light reflection */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-white`}>
            {value}
          </h3>
        </div>

        {Icon && (
          <div
            className={`p-2.5 rounded-xl border ${c.iconBg} transition-transform duration-300 group-hover:scale-110 shadow-sm`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3.5 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-[11px] text-slate-400 font-medium truncate">{subtitle}</span>
          )}
          {trend && (
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                trend > 0
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'text-red-400 border-red-500/20 bg-red-500/10'
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
