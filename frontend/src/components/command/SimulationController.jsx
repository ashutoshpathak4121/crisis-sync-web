import React, { useState } from 'react';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import { Play, RotateCcw, AlertTriangle, Radio, Activity } from 'lucide-react';

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
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-4 sm:p-5 shadow-sm text-slate-900 dark:text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Info */}
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Live Incident Simulation Engine
              </span>
              {simulationStatus.active ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60">
                  SURGE ACTIVE • STEP {simulationStatus.step}/5
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  STANDBY READY
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl font-medium">
              {simulationStatus.description ||
                'Simulate real-time casualty surges, automated ER saturation, and dynamic paramedic rerouting without page reload.'}
            </p>
          </div>
        </div>

        {/* Right: Demo Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={handleStartSurge}
            disabled={simulationStatus.active || loadingAction === 'surge'}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{loadingAction === 'surge' ? 'Triggering...' : 'Start Surge Demo'}</span>
          </button>

          <button
            onClick={handleTriggerIncident}
            disabled={loadingAction === 'incident'}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800/60 transition-colors cursor-pointer disabled:opacity-50"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Spawn Incident</span>
          </button>

          <button
            onClick={handleReset}
            disabled={loadingAction === 'reset'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            title="Reset baseline capacities for all hospitals"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Progress Steps Indicator during Surge */}
      {simulationStatus.active && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1.5">
            <span>Progressive Surge Degradation</span>
            <span className="text-red-600 dark:text-red-400 font-bold">
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
                  className={`h-1.5 rounded-full transition-colors ${
                    isCurrent
                      ? 'bg-red-600'
                      : isPassed
                      ? 'bg-red-400'
                      : 'bg-slate-200 dark:bg-slate-700'
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