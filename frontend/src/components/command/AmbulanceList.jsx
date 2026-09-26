import React, { useState } from 'react';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import StatusBadge from '../common/StatusBadge';
import { Ambulance, User, MapPin, Zap, Link2, Unlink, Loader2 } from 'lucide-react';

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
    <div className="rounded-[28px] border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-slate-900/40 backdrop-blur-2xl p-5 sm:p-6 shadow-lg shadow-slate-200/40 dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
            <Ambulance className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide font-['Outfit']">
              Active Ambulance Fleet
            </h4>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              {ambulances.length} Units Online & Tracked
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-700 dark:text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/40">
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
              className={`p-3.5 rounded-xl border transition-all duration-300 shadow-sm ${
                isAttached
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/40 ring-1 ring-emerald-400/30'
                  : 'bg-slate-50/80 dark:bg-[#070D1A] border-slate-200 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/[0.12]'
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

                <div className="text-right text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-white/[0.02] px-2 py-1 rounded-lg border border-slate-200 dark:border-white/[0.04]">
                  <div>{amb.latitude.toFixed(4)}°N</div>
                  <div>{amb.longitude.toFixed(4)}°E</div>
                </div>
              </div>

              {/* Destination & Action Bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between gap-2 flex-wrap">
                {isAttached ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-300 font-medium truncate max-w-[200px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                    <Link2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
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
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-white/[0.08] hover:border-red-400 transition-all"
                      title="Detach ambulance from current hospital"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Unlink className="w-3 h-3" />
                      )}
                      Detach
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAttach(amb.id)}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm transition-all active:scale-95"
                      title="Automatically find & attach the nearest accepting hospital with ER beds"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Zap className="w-3 h-3 fill-white text-white" />
                      )}
                      Attach Near ER
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
