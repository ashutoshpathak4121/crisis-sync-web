import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { AlertCircle, Users, Clock } from 'lucide-react';

const IncidentFeed = ({ incidents = [] }) => {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
              Live Emergency Incident Feed
            </h4>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              {incidents.length} Active Metropolitan Dispatches
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-red-700 dark:text-red-300 px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 font-semibold">
          Radar Active
        </span>
      </div>

      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h5 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {inc.type}
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {inc.description}
                </p>
              </div>
              <StatusBadge status={inc.severity} type="incident" size="sm" />
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium font-sans">
                <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="font-mono font-bold">{inc.patientCount}</span> casualty(s)
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-400" />
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