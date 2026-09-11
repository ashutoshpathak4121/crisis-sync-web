import React from 'react';
import { History, User, ArrowRight } from 'lucide-react';

const AuditLogTable = ({ logs = [] }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="rounded-xl border border-[#1E2E48] bg-[#0E1626] p-6 text-center">
        <History className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
        <p className="text-xs text-slate-400">No recent resource change logs recorded yet.</p>
      </div>
    );
  }

  const formatResourceName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace('Available', '');
  };

  return (
    <div className="rounded-xl border border-[#1E2E48] bg-[#0E1626] p-5 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-4 h-4 text-cyan-400" />
        <h4 className="text-sm font-bold text-white tracking-wide">
          Resource Audit & Traceability Log
        </h4>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="pb-2.5 font-semibold">Timestamp</th>
              <th className="pb-2.5 font-semibold">Staff Member</th>
              <th className="pb-2.5 font-semibold">Resource</th>
              <th className="pb-2.5 font-semibold text-center">Shift</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {logs.slice(0, 8).map((log) => (
              <tr key={log.id} className="text-slate-300 hover:bg-slate-800/30">
                <td className="py-2.5 text-slate-400 text-[11px]">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
                <td className="py-2.5 text-slate-200 flex items-center gap-1.5 font-sans">
                  <User className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                  <span className="truncate max-w-[120px]">{log.user?.name || 'System / Sim'}</span>
                </td>
                <td className="py-2.5 text-slate-300 font-sans">
                  {formatResourceName(log.resourceType)}
                </td>
                <td className="py-2.5 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">{log.oldValue}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-cyan-400" />
                    <span className={log.newValue < log.oldValue ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {log.newValue}
                    </span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogTable;
