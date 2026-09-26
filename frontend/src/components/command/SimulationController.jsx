import React, { useState } from 'react';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import { Play, RotateCcw, AlertTriangle, Radio, Activity, Check } from 'lucide-react';

const SimulationController = () => {
  const {
    startSurgeSimulation,
    resetSimulation,
    triggerIncidentSimulation,
    simulationStatus
  } = useEmergencyData();

  const [loadingAction, setLoadingAction] = useState(null);

  const handleStartSurge = async () => {
    try {
      setLoadingAction('surge');
      await startSurgeSimulation();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReset = async () => {
    try {
      setLoadingAction('reset');
      await resetSimulation();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleTriggerIncident = async () => {
    try {
      setLoadingAction('incident');
      await triggerIncidentSimulation();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-cyan-500/25 bg-slate-900/40 dark:bg-slate-900/50 p-4 sm:p-5 shadow-[0_15px_35px_rgba(0,0,0,0.4),0_0_20px_rgba(6,182,212,0.12)] backdrop-blur-2xl">
      {/* Top micro light reflection */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Info */}
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-glow-cyan">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Live Incident Simulation Engine
              </span>
              {simulationStatus.active ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse shadow-sm shadow-red-500/30">
                  SURGE ACTIVE // STEP {simulationStatus.step}/5
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase bg-white/[0.04] text-slate-400 border border-white/[0.08]">
                  STANDBY READY
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              {simulationStatus.description ||
                'Simulate real-time casualty surges, automated ER saturation, and dynamic paramedic rerouting without page reload.'}
            </p>
          </div>
        </div>

        {/* Right: Demo Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleStartSurge}
            disabled={simulationStatus.active || loadingAction === 'surge'}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/30 disabled:opacity-50 transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            {loadingAction === 'surge' ? 'Triggering...' : 'Start Surge Demo'}
          </button>

          <button
            onClick={handleTriggerIncident}
            disabled={loadingAction === 'incident'}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/[0.04] hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-white/[0.1] hover:border-amber-500/40 transition-all active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Spawn Mass Incident
          </button>

          <button
            onClick={handleReset}
            disabled={loadingAction === 'reset'}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] transition-all active:scale-95"
            title="Reset baseline capacities for all hospitals"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Baseline
          </button>
        </div>
      </div>

      {/* Progress Steps Indicator during Surge */}
      {simulationStatus.active && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span>Progressive Surge Degradation</span>
            <span className="text-cyan-400 font-bold">
              Beds: {20 - (simulationStatus.step * 4) + 4} → {Math.max(0, 20 - (simulationStatus.step * 4))}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5].map((step) => {
              const isPassed = step <= simulationStatus.step;
              const isCurrent = step === simulationStatus.step;

              return (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    isCurrent
                      ? 'bg-red-500 animate-pulse ring-2 ring-red-400/50'
                      : isPassed
                      ? 'bg-red-600'
                      : 'bg-slate-800'
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationController;
