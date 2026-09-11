import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { AlertCircle, Users, Clock } from 'lucide-react';

const IncidentFeed = ({ incidents = [] }) => {
  return (
    <div className="rounded-xl border border-[#1E2E48] bg-[#0E1626] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 animate-pulse" />
          <h4 className="text-sm font-bold text-white tracking-wide">
            Live Emergency Incident Feed ({incidents.length})
          </h4>
        </div>
      </div>

      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="p-3 rounded-lg bg-[#080C15] border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h5 className="text-xs font-bold text-white leading-snug">
                  {inc.type}
                </h5>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  {inc.description}
                </p>
              </div>
              <StatusBadge status={inc.severity} type="incident" size="sm" />
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1 text-cyan-400">
                <Users className="w-3 h-3" />
                {inc.patientCount} casualty(s)
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
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
