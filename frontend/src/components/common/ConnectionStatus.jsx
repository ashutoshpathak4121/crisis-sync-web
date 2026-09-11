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
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-mono font-bold animate-pulse shadow-sm shadow-amber-500/20">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span>SIMULATION ACTIVE [{simulationStatus.step}/5]</span>
        </div>
      ) : (
        <div
          className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border transition-all ${
            isConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-sm shadow-emerald-500/15'
              : connectionStatus === 'RECONNECTING'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {isConnected ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="tracking-wider">LIVE SYNC</span>
              <span className="text-[10px] text-emerald-400/80 font-normal border-l border-emerald-500/30 pl-1.5">
                {timeAgo}
              </span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-red-400 animate-pulse" />
              <span className="tracking-wider">
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
