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

// Pinterest color palette: Royal navy, steel blue, soft sky, muted slate
export const DONUT_DATA = [
  { name: 'ICU Beds', value: 178, total: 260, color: '#1E3A8A' },
  { name: 'Ventilators', value: 142, total: 200, color: '#3B82F6' },
  { name: 'General Beds', value: 412, total: 600, color: '#93C5FD' },
  { name: 'Isolation Beds', value: 54, total: 100, color: '#CBD5E1' }
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
                    <div className="rounded-xl p-2.5 text-xs bg-white text-slate-900 border border-slate-200 shadow-xl">
                      <span className="font-bold">{data.name}</span>: {data.value} / {data.total}
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
          <span className="text-3xl font-black text-slate-900 dark:text-slate-100 font-['Outfit'] tracking-tight">
            68%
          </span>
          <span className="text-[10px] text-slate-500 font-semibold text-center leading-tight">
            System Occupancy
          </span>
        </div>
      </div>

      {/* Legend matching Pinterest style */}
      <div className="w-full space-y-2 mt-3 px-1 text-xs">
        {DONUT_DATA.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                {item.name}
              </span>
            </div>
            <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
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
      {/* Chart 1: ICU Bed Availability Trend (Frosted Glass Ocean Indigo Card) */}
      <div className="rounded-[26px] p-5 sm:p-6 bg-slate-900/35 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/10 hover:border-cyan-400/40 shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-white font-['Outfit']">
              ICU Bed Availability Trend
            </h4>
            <p className="text-[11px] text-slate-400 font-medium">Available units vs occupied demand</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-bold">
            <span className="flex items-center gap-1.5 text-cyan-300 bg-cyan-500/15 px-2.5 py-0.5 rounded-full border border-cyan-400/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Available
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-400/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Occupied
            </span>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ICU_TREND_DATA} margin={{ top: 15, right: 15, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="availWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="occWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis
                domain={[0, 200]}
                ticks={[0, 50, 100, 150, 200]}
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl p-2.5 bg-slate-900/90 backdrop-blur-md border border-white/15 shadow-2xl text-xs text-white">
                        <span className="font-bold text-cyan-300 block">{data.date}</span>
                        <div className="text-cyan-400 font-bold">Available: {data.available} Beds</div>
                        <div className="text-emerald-400 font-semibold">Occupied: {data.occupied} Beds</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="available"
                stroke="#06B6D4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#availWave)"
                dot={{ r: 3.5, fill: '#030712', stroke: '#06B6D4', strokeWidth: 2 }}
                activeDot={{ r: 5, fill: '#06B6D4', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="occupied"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#occWave)"
                dot={{ r: 3.5, fill: '#030712', stroke: '#10B981', strokeWidth: 2 }}
                activeDot={{ r: 5, fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Surge Forecast (Frosted Glass Sunset Rose Card) */}
      <div className="rounded-[26px] p-5 sm:p-6 bg-slate-900/35 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/10 hover:border-rose-400/40 shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-white font-['Outfit']">
              Surge Forecast <span className="text-rose-400/80 font-normal text-xs">(Next 7 Days)</span>
            </h4>
            <p className="text-[11px] text-slate-400 font-medium">Predictive caseload modeling</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-400/30 shadow-[0_0_10px_rgba(244,63,94,0.3)]">
            Projected Peak 95%
          </span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SURGE_FORECAST_DATA} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="surgeWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(v) => `${v}%`}
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(val) => [`${val}%`, 'Surge Index']}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                  fontSize: '11px',
                  color: '#F8FAFC'
                }}
              />
              <Area
                type="monotone"
                dataKey="surge"
                stroke="#F43F5E"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#surgeWave)"
                dot={{ r: 3.5, fill: '#030712', stroke: '#F43F5E', strokeWidth: 2 }}
                activeDot={{ r: 5, fill: '#F43F5E', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
