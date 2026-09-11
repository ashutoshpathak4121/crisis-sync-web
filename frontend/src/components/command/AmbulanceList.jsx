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
    <div className="rounded-xl border border-[#1E2E48] bg-[#0E1626] p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Ambulance className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-white tracking-wide">
            Active Ambulance Fleet ({ambulances.length})
          </h4>
        </div>
        <span className="text-[11px] font-mono text-cyan-400">1-Click ER Assignment</span>
      </div>

      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {ambulances.map((amb) => {
          const isLoading = loadingAmbId === amb.id;
          const isAttached = !!amb.destinationHospital || !!amb.destinationHospitalId;
          const hospitalName = amb.destinationHospital?.name || 'Assigned Hospital';

          return (
            <div
              key={amb.id}
              className={`p-3 rounded-xl border transition-all ${
                isAttached
                  ? 'bg-[#0b1322] border-emerald-500/30 ring-1 ring-emerald-500/10'
                  : 'bg-[#080C15] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-white">
                      Unit {amb.vehicleNumber}
                    </span>
                    <StatusBadge status={amb.status} type="ambulance" size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <User className="w-3 h-3 text-slate-500" />
                    <span>{amb.paramedic?.name || 'Paramedic Unit'}</span>
                  </p>
                </div>

                <div className="text-right text-[10px] font-mono text-slate-500">
                  <div>{amb.latitude.toFixed(4)}°N</div>
                  <div>{amb.longitude.toFixed(4)}°E</div>
                </div>
              </div>

              {/* Destination & Action Bar */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2 flex-wrap">
                {isAttached ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium truncate max-w-[200px]">
                    <Link2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">Attached: <strong>{hospitalName}</strong></span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">No destination attached</span>
                )}

                <div className="flex items-center gap-1.5 ml-auto">
                  {isAttached ? (
                    <button
                      onClick={() => handleDetach(amb.id)}
                      disabled={isLoading}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-400 hover:text-red-300 hover:bg-red-950/40 border border-slate-700 hover:border-red-500/40 transition-colors"
                      title="Detach ambulance from current hospital"
                    >
                      {isLoading ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      ) : (
                        <Unlink className="w-2.5 h-2.5" />
                      )}
                      Detach
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAttach(amb.id)}
                      disabled={isLoading}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                      title="Automatically find & attach the nearest accepting hospital with ER beds"
                    >
                      {isLoading ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      ) : (
                        <Zap className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" />
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
