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
    <div className="rounded-xl border border-[#1E2E48] bg-[#0E1626] overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-white tracking-wide">
            Hospital Resource & Capacity Matrix
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time synchronization across {hospitals.length} metropolitan facilities
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search hospital..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#080C15] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none w-44"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#080C15] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACCEPTING">Accepting</option>
            <option value="LIMITED">Limited</option>
            <option value="CRITICAL">Critical</option>
            <option value="FULL">Full / Divert</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800/80 bg-[#0A101C] text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 font-semibold">Facility Name</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Emergency Beds</th>
              <th className="py-3 px-4 font-semibold">ICU Units</th>
              <th className="py-3 px-4 font-semibold">Ventilators</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
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
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className="font-bold text-white block">{h.name}</span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[200px] block">
                      {h.address}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={h.emergencyStatus} type="hospital" size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold ${erAvail <= 2 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {erAvail} / {erTotal}
                      </span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full ${erAvail <= 2 ? 'bg-red-500' : erPct <= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, erPct)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className={res.icuBedsAvailable === 0 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                      {res.icuBedsAvailable || 0} / {res.icuBedsTotal || 10}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-200">
                    {res.ventilatorsAvailable || 0} / {res.ventilatorsTotal || 6}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectHospital && onSelectHospital(h)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 py-1 px-2.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
                    >
                      Focus <ArrowUpRight className="w-3 h-3" />
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
