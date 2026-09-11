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
    cyan: 'from-cyan-500/20 to-transparent text-cyan-400 border-cyan-500/20',
    red: 'from-red-500/20 to-transparent text-red-400 border-red-500/20',
    emerald: 'from-emerald-500/20 to-transparent text-emerald-400 border-emerald-500/20',
    amber: 'from-amber-500/20 to-transparent text-amber-400 border-amber-500/20',
    purple: 'from-purple-500/20 to-transparent text-purple-400 border-purple-500/20'
  };

  const iconBgMap = {
    cyan: 'bg-cyan-500/15 text-cyan-400',
    red: 'bg-red-500/15 text-red-400',
    emerald: 'bg-emerald-500/15 text-emerald-400',
    amber: 'bg-amber-500/15 text-amber-400',
    purple: 'bg-purple-500/15 text-purple-400'
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border bg-[#0E1626] p-5 transition-all duration-200 ${
        colorMap[color] || colorMap.cyan
      } ${onClick ? 'cursor-pointer hover:border-slate-600 hover:scale-[1.01]' : ''} ${
        highlight ? 'ring-2 ring-cyan-400/50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={`rounded-xl p-3 ${iconBgMap[color] || iconBgMap.cyan}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend && (
            <span className={`font-semibold ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
