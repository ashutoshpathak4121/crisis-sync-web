import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { AlertCircle, Users, Clock } from 'lucide-react';

const IncidentFeed = ({ incidents = [] }) => {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0B1324]/85 backdrop-blur-xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400">
            <AlertCircle className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">
              Live Emergency Incident Feed
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              {incidents.length} Active Metropolitan Dispatches
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">
          Radar Active
        </span>
      </div>

      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="p-3.5 rounded-xl bg-[#070D1A] border border-white/[0.06] hover:border-white/[0.14] transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h5 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {inc.type}
                </h5>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {inc.description}
                </p>
              </div>
              <StatusBadge status={inc.severity} type="incident" size="sm" />
            </div>

            <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                {inc.patientCount} casualty(s)
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3 h-3 text-slate-500" />
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
