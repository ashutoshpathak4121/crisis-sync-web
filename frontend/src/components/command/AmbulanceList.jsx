import React, { useState } from 'react';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import StatusBadge from '../common/StatusBadge';
import { Ambulance, User, Link2, Unlink, Loader2, Zap } from 'lucide-react';

const AmbulanceList = ({ ambulances = [] }) => {
  const { attachNearestHospital, detachHospitalFromAmbulance } = useEmergencyData();
  const [loadingAmbId, setLoadingAmbId] = useState(null);

  const handleAttach = async (ambId) => {
    try {
      setLoadingAmbId(ambId);
      await attachNearestHospital(ambId);
    } catch (err) {
      console.error('Failed to attach hospital:', err);
    } finally {
      setLoadingAmbId(null);
    }
  };

  const handleDetach = async (ambId) => {
    try {
      setLoadingAmbId(ambId);
      await detachHospitalFromAmbulance(ambId);
    } catch (err) {
      console.error('Failed to detach hospital:', err);
    } finally {
      setLoadingAmbId(null);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400">
            <Ambulance className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
              Active Ambulance Fleet
            </h4>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              {ambulances.length} Units Online & Tracked
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 font-semibold">
          GPS Live Sync
        </span>
      </div>

      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {ambulances.map((amb) => {
          const isLoading = loadingAmbId === amb.id;
          const isAttached = !!amb.destinationHospital || !!amb.destinationHospitalId;
          const hospitalName = amb.destinationHospital?.name || 'Assigned Hospital';

          return (
            <div
              key={amb.id}
              className={`p-3 rounded-lg border transition-colors shadow-sm ${
                isAttached
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                      Unit {amb.vehicleNumber}
                    </span>
                    <StatusBadge status={amb.status} type="ambulance" size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>{amb.paramedic?.name || 'Paramedic On Duty'}</span>
                  </p>
                </div>

                <div className="text-right text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                  <div>{amb.latitude.toFixed(4)}°N</div>
                  <div>{amb.longitude.toFixed(4)}°E</div>
                </div>
              </div>

              {/* Destination & Action Bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2 flex-wrap">
                {isAttached ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium truncate max-w-[200px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <Link2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate">ER: <strong>{hospitalName}</strong></span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">No ER currently attached</span>
                )}

                <div className="flex items-center gap-1.5 ml-auto">
                  {isAttached ? (
                    <button
                      onClick={() => handleDetach(amb.id)}
                      disabled={isLoading}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-700 hover:border-red-300 transition-colors cursor-pointer"
                      title="Detach ambulance from current hospital"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Unlink className="w-3 h-3" />
                      )}
                      <span>Detach</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAttach(amb.id)}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                      title="Automatically find & attach the nearest accepting hospital with ER beds"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Zap className="w-3 h-3" />
                      )}
                      <span>Attach Near ER</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AmbulanceList;