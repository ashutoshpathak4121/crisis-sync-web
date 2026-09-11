import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import { Activity, Wifi, WifiOff } from 'lucide-react';

const ConnectionStatus = () => {
  const { connectionStatus, isConnected } = useSocket();
  const { lastSyncTime, simulationStatus } = useEmergencyData();
  const [timeAgo, setTimeAgo] = useState('just now');

  useEffect(() => {
    const interval = setInterval(() => {
      if (!lastSyncTime) return;
      const seconds = Math.floor((new Date() - new Date(lastSyncTime)) / 1000);
      if (seconds < 3) {
        setTimeAgo('just now');
      } else if (seconds < 60) {
        setTimeAgo(`${seconds}s ago`);
      } else {
        const mins = Math.floor(seconds / 60);
        setTimeAgo(`${mins}m ago`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSyncTime]);

  return (
    <div className="flex items-center gap-3">
      {simulationStatus.active ? (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold animate-pulse">
          <Activity className="w-3.5 h-3.5" />
          <span>SIMULATION MODE (Step {simulationStatus.step}/5)</span>
        </div>
      ) : (
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            isConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : connectionStatus === 'RECONNECTING'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {isConnected ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold tracking-wide">LIVE SYSTEM</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 animate-pulse" />
              <span className="font-semibold tracking-wide">
                {connectionStatus === 'RECONNECTING' ? 'RECONNECTING...' : 'DISCONNECTED'}
              </span>
            </>
          )}
        </div>
      )}

      <span className="text-xs text-slate-400 hidden sm:inline-block">
        Synced: <span className="text-slate-200 font-mono">{timeAgo}</span>
      </span>
    </div>
  );
};

export default ConnectionStatus;
