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
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-slide-in ${
              isCritical
                ? 'bg-red-950/90 border-red-500/50 text-red-200'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-200'
                : 'bg-slate-900/90 border-cyan-500/50 text-slate-200'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {isCritical ? (
                <AlertCircle className="w-5 h-5 text-red-400 animate-bounce" />
              ) : isWarning ? (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              ) : (
                <Info className="w-5 h-5 text-cyan-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {alert.title}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-300 font-sans">
                {alert.message}
              </p>
            </div>

            <button
              onClick={() => dismissAlert(alert.id)}
              className="flex-shrink-0 text-slate-400 hover:text-white transition-colors p-1"
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
