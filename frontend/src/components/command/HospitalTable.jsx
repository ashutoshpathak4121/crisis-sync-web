import React, { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import { Search, Bed, Activity, Wind, Navigation, Zap, Check } from 'lucide-react';

const HospitalTable = ({
  hospitals = [],
  onSelectHospital,
  onAttachHospital,
  selectedHospitalId = null,
  activeRouteHospitalId = null,
  recentlyUpdatedId = null,
  isAttaching = false
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.address.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === 'ALL' || h.emergencyStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] overflow-hidden shadow-sm">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/20">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Hospital Capacity Telemetry Matrix
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time synchronization across {hospitals.length} regional trauma centers
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search facility..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:outline-none w-44 transition-colors shadow-sm"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-300 focus:border-blue-500 focus:outline-none transition-colors cursor-pointer shadow-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACCEPTING">Accepting Only</option>
            <option value="LIMITED">Limited Capacity</option>
            <option value="CRITICAL">Critical</option>
            <option value="FULL">Full / Divert</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-mono">
              <th className="py-3 px-4 font-semibold">Facility Name</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Emergency Beds</th>
              <th className="py-3 px-4 font-semibold">ICU Units</th>
              <th className="py-3 px-4 font-semibold">Ventilators</th>
              <th className="py-3 px-4 font-semibold text-right">Telemetry Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredHospitals.map((h) => {
              const res = h.resources || {};
              const erAvail = res.emergencyBedsAvailable !== undefined ? res.emergencyBedsAvailable : 0;
              const erTotal = res.emergencyBedsTotal || 20;
              const erPct = Math.round((erAvail / erTotal) * 100);

              const isRecentlyUpdated = recentlyUpdatedId === h.id;
              const isSelected = selectedHospitalId === h.id;
              const isRouted = activeRouteHospitalId === h.id;

              return (
                <tr
                  key={h.id}
                  className={`transition-colors duration-200 ${
                    isRecentlyUpdated
                      ? 'flash-update bg-blue-50 dark:bg-blue-950/30'
                      : isSelected
                      ? 'bg-blue-50/70 dark:bg-blue-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 dark:text-white block tracking-tight text-xs sm:text-sm">{h.name}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[220px] block mt-0.5">
                      {h.address}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={h.emergencyStatus} type="hospital" size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className={`font-semibold ${erAvail <= 2 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {erAvail} / {erTotal} beds
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{erPct}%</span>
                      </div>
                      <div className="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            erAvail <= 2
                              ? 'bg-red-500'
                              : erPct <= 40
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, erPct)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className={res.icuBedsAvailable === 0 ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-800 dark:text-slate-200'}>
                      {res.icuBedsAvailable || 0} / {res.icuBedsTotal || 10}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-800 dark:text-slate-200">
                    {res.ventilatorsAvailable || 0} / {res.ventilatorsTotal || 6}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap sm:flex-nowrap">
                      {/* Action 1: Focus & Locate on Tactical Map */}
                      <button
                        onClick={() => onSelectHospital && onSelectHospital(h)}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold py-1.5 px-2.5 rounded-lg border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-white bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/40'
                        }`}
                        title="Locate facility on tactical map"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Focus</span>
                      </button>

                      {/* Action 2: Attach / Dispatch Ambulance to this facility */}
                      {onAttachHospital && (
                        isRouted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1.5 rounded-lg font-mono">
                            <Check className="w-3 h-3" />
                            <span>Routed</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => onAttachHospital(h)}
                            disabled={isAttaching || h.emergencyStatus === 'FULL'}
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold py-1.5 px-2.5 rounded-lg border transition-colors cursor-pointer ${
                              h.emergencyStatus === 'FULL'
                                ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800'
                                : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-white bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                            }`}
                            title={
                              h.emergencyStatus === 'FULL'
                                ? 'Facility at capacity divert'
                                : 'Attach and route nearest active ambulance to this hospital'
                            }
                          >
                            <Zap className="w-3 h-3" />
                            <span>Route Unit</span>
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HospitalTable;