import React, { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import { Search, Filter, ArrowUpRight, Bed, Activity, Wind } from 'lucide-react';

const HospitalTable = ({
  hospitals = [],
  onSelectHospital,
  recentlyUpdatedId = null
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
    <div className="rounded-2xl border border-white/[0.08] bg-[#0B1324]/85 backdrop-blur-xl overflow-hidden shadow-xl">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.01]">
        <div>
          <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Hospital Capacity Telemetry Matrix
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
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
              className="bg-[#060B16] border border-white/[0.1] rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-400 focus:shadow-glow-cyan focus:outline-none w-48 transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#060B16] border border-white/[0.1] rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:border-cyan-400 focus:outline-none transition-all cursor-pointer"
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
            <tr className="border-b border-white/[0.06] bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[10px] font-mono">
              <th className="py-3.5 px-4 font-semibold">Facility Name</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold">Emergency Beds</th>
              <th className="py-3.5 px-4 font-semibold">ICU Units</th>
              <th className="py-3.5 px-4 font-semibold">Ventilators</th>
              <th className="py-3.5 px-4 font-semibold text-right">Telemetry Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredHospitals.map((h) => {
              const res = h.resources || {};
              const erAvail = res.emergencyBedsAvailable !== undefined ? res.emergencyBedsAvailable : 0;
              const erTotal = res.emergencyBedsTotal || 20;
              const erPct = Math.round((erAvail / erTotal) * 100);

              const isRecentlyUpdated = recentlyUpdatedId === h.id;

              return (
                <tr
                  key={h.id}
                  className={`transition-colors duration-200 ${
                    isRecentlyUpdated
                      ? 'flash-update bg-cyan-950/40'
                      : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block tracking-tight text-xs sm:text-sm">{h.name}</span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[220px] block mt-0.5">
                      {h.address}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={h.emergencyStatus} type="hospital" size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className={`font-bold ${erAvail <= 2 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {erAvail} / {erTotal} beds
                        </span>
                        <span className="text-[10px] text-slate-400">{erPct}%</span>
                      </div>
                      <div className="w-24 h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            erAvail <= 2
                              ? 'bg-gradient-to-r from-red-500 to-rose-500'
                              : erPct <= 40
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          }`}
                          style={{ width: `${Math.min(100, erPct)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className={res.icuBedsAvailable === 0 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                      {res.icuBedsAvailable || 0} / {res.icuBedsTotal || 10}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-200">
                    {res.ventilatorsAvailable || 0} / {res.ventilatorsTotal || 6}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectHospital && onSelectHospital(h)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 py-1.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 transition-all active:scale-95 shadow-sm"
                    >
                      Focus Map <ArrowUpRight className="w-3 h-3" />
                    </button>
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
