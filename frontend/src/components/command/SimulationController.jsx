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
    <div className="rounded-xl border border-cyan-500/40 bg-gradient-to-r from-[#0E1626] via-[#121D32] to-[#0E1626] p-4 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Info */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                Hackathon Judge Simulation Engine
              </span>
              {simulationStatus.active && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                  Surge Active (Step {simulationStatus.step}/5)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {simulationStatus.description ||
                'Simulate real-time casualty surges and hospital saturation without page refreshes.'}
            </p>
          </div>
        </div>

        {/* Right: Demo Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleStartSurge}
            disabled={simulationStatus.active || loadingAction === 'surge'}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/20 disabled:opacity-50 transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            {loadingAction === 'surge' ? 'Triggering...' : 'Start Surge Demo'}
          </button>

          <button
            onClick={handleTriggerIncident}
            disabled={loadingAction === 'incident'}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Spawn Mass Incident
          </button>

          <button
            onClick={handleReset}
            disabled={loadingAction === 'reset'}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all active:scale-95"
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
