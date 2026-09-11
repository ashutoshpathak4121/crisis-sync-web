import React from 'react';

const LoadingSpinner = ({ text = 'Synchronizing real-time emergency telemetry...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
        <div className="absolute w-8 h-8 rounded-full border-2 border-red-500/30 border-b-red-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-400 tracking-wide font-mono animate-pulse">
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;
