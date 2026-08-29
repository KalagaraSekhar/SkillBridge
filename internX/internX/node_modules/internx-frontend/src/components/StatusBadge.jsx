import React from 'react';

export const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status?.toUpperCase()) {
      case 'APPLIED':
        return {
          bg: 'bg-indigo-50 text-primary border-indigo-200',
          dot: 'bg-primary',
          label: 'Applied'
        };
      case 'SHORTLISTED':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500 animate-pulse',
          label: 'Shortlisted'
        };
      case 'SELECTED':
        return {
          bg: 'bg-tealSuccess-light text-tealSuccess-dark border-tealSuccess/30',
          dot: 'bg-tealSuccess',
          label: 'Selected'
        };
      case 'REJECTED':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-500',
          label: 'Not Selected'
        };
      case 'ACTIVE':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Active'
        };
      case 'PENDING':
        return {
          bg: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          dot: 'bg-yellow-500',
          label: 'Pending'
        };
      case 'APPROVED':
        return {
          bg: 'bg-tealSuccess-light text-tealSuccess-dark border-tealSuccess/30',
          dot: 'bg-tealSuccess',
          label: 'Approved'
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-700 border-gray-200',
          dot: 'bg-gray-400',
          label: status || 'Unknown'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${config.bg}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
