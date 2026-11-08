import React from 'react';

const LoadingSpinner = ({ text = 'Synchronizing real-time emergency telemetry...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[260px] p-8 text-center font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-400 animate-spin" />
      <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide font-mono">
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;
