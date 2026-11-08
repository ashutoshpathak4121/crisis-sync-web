import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const ICU_TREND_DATA = [
  { date: 'Apr 21', available: 160, occupied: 45, marker: null },
  { date: 'Apr 22', available: 155, occupied: 52, marker: null },
  { date: 'Apr 23', available: 168, occupied: 48, marker: '168 Beds' },
  { date: 'Apr 24', available: 162, occupied: 65, marker: null },
  { date: 'Apr 25', available: 175, occupied: 58, marker: '175 Beds' },
  { date: 'Apr 26', available: 170, occupied: 72, marker: null },
  { date: 'Apr 27', available: 178, occupied: 68, marker: '178 Peak' }
];

export const SURGE_FORECAST_DATA = [
  { date: 'Apr 28', surge: 46 },
  { date: 'Apr 29', surge: 52 },
  { date: 'Apr 30', surge: 60 },
  { date: 'May 1', surge: 68 },
  { date: 'May 2', surge: 79 },
  { date: 'May 3', surge: 89 },
  { date: 'May 4', surge: 95 }
];

// Clinical color palette: Royal blue, sky blue, steel blue, slate
export const DONUT_DATA = [
  { name: 'ICU Beds', value: 178, total: 260, color: '#1D4ED8' },
  { name: 'Ventilators', value: 142, total: 200, color: '#0284C7' },
  { name: 'General Beds', value: 412, total: 600, color: '#38BDF8' },
  { name: 'Isolation Beds', value: 54, total: 100, color: '#94A3B8' }
];

export const DonutCapacityChart = ({ isDark = false }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DONUT_DATA}
              cx="50%"
              cy="50%"
              innerRadius={54}
              outerRadius={76}
              paddingAngle={3}
              dataKey="value"
            >
              {DONUT_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg p-2.5 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg">
                      <span className="font-semibold">{data.name}</span>: <span className="font-mono font-bold">{data.value}</span> / <span className="font-mono">{data.total}</span>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
            68%
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium text-center leading-tight">
            System Occupancy
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full space-y-2 mt-3 px-1 text-xs">
        {DONUT_DATA.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                {item.name}
              </span>
            </div>
            <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">
              {item.value} / {item.total}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TrendCharts = ({ isDark = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
      {/* Chart 1: ICU Bed Availability Trend */}
      <div className="rounded-xl p-4 sm:p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              ICU Bed Availability Trend
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Available units vs occupied demand</p>
          </div>
          <div className="flex items-center gap-2.5 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" /> Available
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" /> Occupied
            </span>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ICU_TREND_DATA} margin={{ top: 15, right: 15, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="availWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="occWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis
                domain={[0, 200]}
                ticks={[0, 50, 100, 150, 200]}
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg text-xs text-slate-900 dark:text-white">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{data.date}</span>
                        <div className="text-blue-600 dark:text-blue-400 font-semibold font-mono">Available: {data.available} Beds</div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">Occupied: {data.occupied} Beds</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="available"
                stroke="#2563EB"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#availWave)"
                dot={{ r: 3, fill: '#FFFFFF', stroke: '#2563EB', strokeWidth: 2 }}
                activeDot={{ r: 5, fill: '#2563EB', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="occupied"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#occWave)"
                dot={{ r: 3, fill: '#FFFFFF', stroke: '#10B981', strokeWidth: 2 }}
                activeDot={{ r: 5, fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Surge Forecast */}
      <div className="rounded-xl p-4 sm:p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Surge Forecast <span className="text-slate-400 font-normal text-xs">(Next 7 Days)</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Predictive caseload modeling</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60">
            Projected Peak: 95%
          </span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SURGE_FORECAST_DATA} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="surgeWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(v) => `${v}%`}
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(val) => [`${val}%`, 'Surge Index']}
                contentStyle={{
                  backgroundColor: '#1E293B',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '11px',
                  color: '#F8FAFC'
                }}
              />
              <Area
                type="monotone"
                dataKey="surge"
                stroke="#EF4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#surgeWave)"
                dot={{ r: 3, fill: '#FFFFFF', stroke: '#EF4444', strokeWidth: 2 }}
                activeDot={{ r: 5, fill: '#EF4444', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
