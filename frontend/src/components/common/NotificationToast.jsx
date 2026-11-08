import React from 'react';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const NotificationToast = () => {
  const { alerts, dismissAlert } = useEmergencyData();

  // Show only the 3 most recent alerts
  const visibleAlerts = alerts.slice(0, 3);

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {visibleAlerts.map((alert) => {
        const isCritical = alert.level === 'critical';
        const isWarning = alert.level === 'warning';

        return (
          <div
            key={alert.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border transition-all duration-200 bg-white dark:bg-[#1E293B] ${
              isCritical
                ? 'border-red-300 dark:border-red-800/80 text-red-900 dark:text-red-200'
                : isWarning
                ? 'border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-200'
                : 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {isCritical ? (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              ) : isWarning ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold tracking-tight text-slate-900 dark:text-white">
                {alert.title}
              </h4>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {alert.message}
              </p>
            </div>

            <button
              onClick={() => dismissAlert(alert.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationToast;
