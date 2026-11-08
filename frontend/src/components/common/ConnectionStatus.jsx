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
    <div className="flex items-center gap-2">
      {simulationStatus.active ? (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-mono font-bold shadow-sm">
          <Activity className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>SIMULATION ACTIVE [{simulationStatus.step}/5]</span>
        </div>
      ) : (
        <div
          className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-medium border transition-colors ${
            isConnected
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-400'
              : connectionStatus === 'RECONNECTING'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-400'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/80 text-red-800 dark:text-red-400'
          }`}
        >
          {isConnected ? (
            <>
              <span className="flex h-2 w-2 relative">
                <span className="inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-wide font-semibold">LIVE SYNC</span>
              <span className="text-xs text-emerald-700/80 dark:text-emerald-400/80 font-normal border-l border-emerald-300 dark:border-emerald-800 pl-1.5">
                {timeAgo}
              </span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
              <span className="tracking-wide font-semibold">
                {connectionStatus === 'RECONNECTING' ? 'RECONNECTING' : 'OFFLINE'}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
