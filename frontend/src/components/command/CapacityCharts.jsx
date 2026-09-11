import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';

const CapacityCharts = ({ hospitals = [] }) => {
  const chartData = hospitals.slice(0, 6).map((h) => {
    const res = h.resources || {};
    const erTotal = res.emergencyBedsTotal || 20;
    const erAvail = res.emergencyBedsAvailable !== undefined ? res.emergencyBedsAvailable : 0;
    const erOccupied = Math.max(0, erTotal - erAvail);

    return {
      name: h.name.split(' ')[0],
      fullName: h.name,
      availableBeds: erAvail,
      occupiedBeds: erOccupied,
      icuAvailable: res.icuBedsAvailable || 0,
      ventAvailable: res.ventilatorsAvailable || 0
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#080C15] border border-cyan-500/40 p-3 rounded-lg shadow-xl text-xs font-mono">
          <p className="font-bold text-white mb-1.5 font-sans">{data.fullName}</p>
          <div className="space-y-1">
            <p className="text-emerald-400">
              Available ER Beds: <strong className="text-white">{data.availableBeds}</strong>
            </p>
            <p className="text-red-400">
              Occupied ER Beds: <strong className="text-white">{data.occupiedBeds}</strong>
            </p>
            <p className="text-cyan-400">
              Available ICU: <strong className="text-white">{data.icuAvailable}</strong>
            </p>
            <p className="text-purple-400">
              Available Vents: <strong className="text-white">{data.ventAvailable}</strong>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Chart 1: Bed Occupancy Distribution */}
      <div className="rounded-xl border border-[#1E2E48] bg-[#0E1626] p-4">
        <div className="mb-4">
          <h4 className="text-sm font-bold text-white tracking-wide">
            Emergency Bed Occupancy by Facility
          </h4>
          <p className="text-xs text-slate-400">
            Real-time comparison of available vs occupied ER beds
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis
                dataKey="name"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                angle={-20}
                textAnchor="end"
              />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
              />
              <Bar dataKey="availableBeds" name="Available Beds" fill="#10B981" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="occupiedBeds" name="Occupied Beds" fill="#EF4444" radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: ICU & Ventilator Critical Assets */}
      <div className="rounded-xl border border-[#1E2E48] bg-[#0E1626] p-4">
        <div className="mb-4">
          <h4 className="text-sm font-bold text-white tracking-wide">
            Critical Assets Standby (ICU & Ventilators)
          </h4>
          <p className="text-xs text-slate-400">
            Unallocated life-support equipment ready for immediate trauma
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis
                dataKey="name"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                angle={-20}
                textAnchor="end"
              />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
              />
              <Bar dataKey="icuAvailable" name="ICU Available" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ventAvailable" name="Ventilators" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CapacityCharts;
