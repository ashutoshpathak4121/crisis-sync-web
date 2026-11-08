import React from 'react';
import { History, User, ArrowRight } from 'lucide-react';

const AuditLogTable = ({ logs = [] }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-6 text-center shadow-sm">
        <History className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2 opacity-50" />
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No recent resource change logs recorded yet.</p>
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
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-4 sm:p-5 overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
          Resource Audit & Traceability Log
        </h4>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="pb-2.5 font-semibold">Timestamp</th>
              <th className="pb-2.5 font-semibold">Staff Member</th>
              <th className="pb-2.5 font-semibold">Resource</th>
              <th className="pb-2.5 font-semibold text-center">Shift</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono">
            {logs.slice(0, 8).map((log) => (
              <tr key={log.id} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-2.5 text-slate-500 dark:text-slate-400 text-[11px]">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
                <td className="py-2.5 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-sans">
                  <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="truncate max-w-[140px] font-medium">{log.user?.name || 'System / Sim'}</span>
                </td>
                <td className="py-2.5 text-slate-700 dark:text-slate-300 font-sans font-medium">
                  {formatResourceName(log.resourceType)}
                </td>
                <td className="py-2.5 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">{log.oldValue}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                    <span className={log.newValue < log.oldValue ? 'text-red-600 dark:text-red-400 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-bold'}>
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