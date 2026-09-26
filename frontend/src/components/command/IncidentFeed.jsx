import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { AlertCircle, Users, Clock } from 'lucide-react';

const IncidentFeed = ({ incidents = [] }) => {
  return (
    <div className="rounded-[28px] border border-rose-200/80 dark:border-rose-500/20 bg-white/85 dark:bg-slate-900/40 backdrop-blur-2xl p-5 sm:p-6 shadow-lg shadow-rose-100/50 dark:shadow-[0_15px_35px_rgba(0,0,0,0.4),0_0_20px_rgba(244,63,94,0.08)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide font-['Outfit']">
              Live Emergency Incident Feed
            </h4>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              {incidents.length} Active Metropolitan Dispatches
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 dark:text-red-400 px-2 py-0.5 rounded bg-red-500/10 border border-red-400/40">
          Radar Active
        </span>
      </div>

      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200/80 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/[0.18] hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-all duration-200 group shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  {inc.type}
                </h5>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {inc.description}
                </p>
              </div>
              <StatusBadge status={inc.severity} type="incident" size="sm" />
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200/80 dark:border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-cyan-700 dark:text-cyan-300 font-semibold">
                <Users className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                {inc.patientCount} casualty(s)
              </span>
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                {new Date(inc.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentFeed;
