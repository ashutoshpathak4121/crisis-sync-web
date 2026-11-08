import React from 'react';
import { HOSPITAL_STATUS, AMBULANCE_STATUS, INCIDENT_SEVERITY } from '../../utils/constants';

const StatusBadge = ({ status, type = 'hospital', size = 'md' }) => {
  let config;
  if (type === 'hospital') {
    config = HOSPITAL_STATUS[status] || HOSPITAL_STATUS.ACCEPTING;
  } else if (type === 'ambulance') {
    config = AMBULANCE_STATUS[status] || AMBULANCE_STATUS.AVAILABLE;
  } else if (type === 'incident') {
    config = INCIDENT_SEVERITY[status] || INCIDENT_SEVERITY.HIGH;
  } else {
    config = { label: status, color: 'bg-slate-500/15 text-slate-400 border-slate-500/30', dot: 'bg-slate-400' };
  }

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5' 
    : size === 'lg' 
    ? 'text-sm px-3 py-1 font-semibold' 
    : 'text-xs px-2.5 py-0.5 font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${config.color} ${sizeClasses} tracking-normal select-none`}
    >
      {config.dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      )}
      {config.label || status}
    </span>
  );
};

export default StatusBadge;
