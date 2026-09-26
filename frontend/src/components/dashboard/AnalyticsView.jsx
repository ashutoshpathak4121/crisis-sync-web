import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Download,
  Filter,
  Play,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useEmergencyData } from '../../context/EmergencyDataContext';

// Velocity trend dataset by timeframe
const VELOCITY_BY_TIMEFRAME = {
  '24h': [
    { time: '00:00', admissions: 12, discharges: 8 },
    { time: '04:00', admissions: 8, discharges: 5 },
    { time: '08:00', admissions: 28, discharges: 14 },
    { time: '12:00', admissions: 42, discharges: 30 },
    { time: '16:00', admissions: 48, discharges: 36 },
    { time: '20:00', admissions: 35, discharges: 22 },
    { time: '23:59', admissions: 19, discharges: 15 }
  ],
  '7d': [
    { time: 'Mon', admissions: 142, discharges: 110 },
    { time: 'Tue', admissions: 168, discharges: 135 },
    { time: 'Wed', admissions: 184, discharges: 142 },
    { time: 'Thu', admissions: 195, discharges: 160 },
    { time: 'Fri', admissions: 228, discharges: 172 },
    { time: 'Sat', admissions: 245, discharges: 188 },
    { time: 'Sun', admissions: 210, discharges: 195 }
  ],
  '30d': [
    { time: 'Week 1', admissions: 1120, discharges: 980 },
    { time: 'Week 2', admissions: 1240, discharges: 1050 },
    { time: 'Week 3', admissions: 1380, discharges: 1120 },
    { time: 'Week 4', admissions: 1520, discharges: 1290 },
    { time: 'Current', admissions: 840, discharges: 710 }
  ]
};

const TRIAGE_DISTRIBUTION = [
  { name: 'Triage 1 - Critical', value: 24, color: '#EF4444' },
  { name: 'Triage 2 - High', value: 38, color: '#F97316' },
  { name: 'Triage 3 - Medium', value: 26, color: '#F59E0B' },
  { name: 'Triage 4 - Low', value: 12, color: '#10B981' }
];

const REGIONS = ['All NCR', 'South Delhi', 'Central Delhi', 'Gurugram', 'Noida'];

const AnalyticsView = ({ isDark = false, onBack }) => {
  const {
    hospitals = [],
    ambulances = [],
    incidents = [],
    startSurgeSimulation,
    resetSimulation,
    simulationStatus
  } = useEmergencyData();

  const [timeRange, setTimeRange] = useState('7d'); // '24h', '7d', '30d'
  const [selectedRegion, setSelectedRegion] = useState('All NCR');
  const [isSimulating, setIsSimulating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Fallback demo hospitals if DB still initializing
  const rawHospitals = hospitals.length > 0 ? hospitals : [
    { id: '1', name: 'AIIMS Apex Trauma Center', address: 'Ring Road, Safdarjung Enclave, New Delhi', resources: { emergencyBedsAvailable: 12, emergencyBedsTotal: 40, icuBedsAvailable: 5, ventilatorsAvailable: 6 } },
    { id: '2', name: 'Max Super Speciality Hospital', address: '1, 2, Press Enclave Road, Saket, New Delhi', resources: { emergencyBedsAvailable: 6, emergencyBedsTotal: 30, icuBedsAvailable: 2, ventilatorsAvailable: 3 } },
    { id: '3', name: 'Fortis Escorts Trauma Center', address: 'Okhla Road, Sukhdev Vihar, New Delhi', resources: { emergencyBedsAvailable: 4, emergencyBedsTotal: 25, icuBedsAvailable: 1, ventilatorsAvailable: 2 } },
    { id: '4', name: 'Medanta Super Emergency Center', address: 'CH Bakhtawar Singh Road, Sector 38, Gurugram', resources: { emergencyBedsAvailable: 15, emergencyBedsTotal: 35, icuBedsAvailable: 6, ventilatorsAvailable: 8 } },
    { id: '5', name: 'Apollo Emergency Trauma Center', address: 'Sarita Vihar, Mathura Road, New Delhi', resources: { emergencyBedsAvailable: 8, emergencyBedsTotal: 25, icuBedsAvailable: 3, ventilatorsAvailable: 4 } },
    { id: '6', name: 'Safdarjung Care Center', address: 'Ansari Nagar West, New Delhi', resources: { emergencyBedsAvailable: 2, emergencyBedsTotal: 30, icuBedsAvailable: 0, ventilatorsAvailable: 1 } },
    { id: '7', name: 'Fortis Hospital Noida', address: 'B-22, Sector 62, Gautam Buddha Nagar, Noida', resources: { emergencyBedsAvailable: 5, emergencyBedsTotal: 20, icuBedsAvailable: 2, ventilatorsAvailable: 2 } }
  ];

  // Filter hospitals by Region
  const filteredHospitals = useMemo(() => {
    if (selectedRegion === 'All NCR') return rawHospitals;
    const regLower = selectedRegion.toLowerCase();
    return rawHospitals.filter((h) => {
      const addr = (h.address || '').toLowerCase();
      const nm = (h.name || '').toLowerCase();
      if (selectedRegion === 'South Delhi') return addr.includes('saket') || addr.includes('sarita vihar') || addr.includes('okhla') || addr.includes('south');
      if (selectedRegion === 'Central Delhi') return addr.includes('ring road') || addr.includes('ansari nagar') || addr.includes('safdarjung') || addr.includes('delhi');
      if (selectedRegion === 'Gurugram') return addr.includes('gurugram') || nm.includes('medanta');
      if (selectedRegion === 'Noida') return addr.includes('noida') || addr.includes('gautam buddha');
      return true;
    });
  }, [rawHospitals, selectedRegion]);

  // Aggregate stats dynamically
  const { totalBeds, availBeds, occBeds, saturationPct, totalIcu, totalVent } = useMemo(() => {
    let tot = 0;
    let av = 0;
    let icu = 0;
    let vent = 0;

    filteredHospitals.forEach((h) => {
      const res = h.resources || {};
      const t = res.emergencyBedsTotal || 25;
      const a = res.emergencyBedsAvailable !== undefined ? res.emergencyBedsAvailable : 8;
      tot += t;
      av += a;
      icu += (res.icuBedsAvailable || 0);
      vent += (res.ventilatorsAvailable || 0);
    });

    const occ = Math.max(0, tot - av);
    const sat = tot > 0 ? ((occ / tot) * 100).toFixed(1) : '68.0';

    return {
      totalBeds: tot,
      availBeds: av,
      occBeds: occ,
      saturationPct: sat,
      totalIcu: icu,
      totalVent: vent
    };
  }, [filteredHospitals]);

  // Capacity Bar Chart dataset
  const capacityChartData = useMemo(() => {
    return filteredHospitals.map((h) => {
      const res = h.resources || {};
      const total = res.emergencyBedsTotal || 25;
      const avail = res.emergencyBedsAvailable !== undefined ? res.emergencyBedsAvailable : 8;
      const occupied = Math.max(0, total - avail);

      return {
        name: h.name.replace('Hospital', '').replace('Emergency', '').trim().split(' ')[0],
        fullName: h.name,
        available: avail,
        occupied: occupied,
        total: total,
        icu: res.icuBedsAvailable || 0,
        vent: res.ventilatorsAvailable || 0
      };
    });
  }, [filteredHospitals]);

  const velocityData = VELOCITY_BY_TIMEFRAME[timeRange] || VELOCITY_BY_TIMEFRAME['7d'];

  const handleRunSimulation = async () => {
    try {
      setIsSimulating(true);
      setFeedbackMsg('Starting mass casualty surge simulation...');
      if (startSurgeSimulation) {
        await startSurgeSimulation();
        setFeedbackMsg('Surge simulation active: live updates streaming via WebSocket.');
      }
    } catch (e) {
      console.error(e);
      setFeedbackMsg('Simulation failed to trigger.');
    } finally {
      setIsSimulating(false);
      setTimeout(() => setFeedbackMsg(''), 5000);
    }
  };

  const handleResetSimulation = async () => {
    try {
      setFeedbackMsg('Resetting simulation baseline...');
      if (resetSimulation) {
        await resetSimulation();
        setFeedbackMsg('All hospital capacities restored to normal baseline.');
      }
    } catch (e) {
      console.error(e);
      setFeedbackMsg('Reset failed.');
    } finally {
      setTimeout(() => setFeedbackMsg(''), 5000);
    }
  };

  const handleExportCSV = () => {
    const headers = 'Hospital Name,Available Beds,Occupied Beds,Total Capacity,Available ICU,Available Ventilators\n';
    const rows = capacityChartData
      .map((d) => `"${d.fullName}",${d.available},${d.occupied},${d.total},${d.icu},${d.vent}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CrisisSync_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setFeedbackMsg('CSV report downloaded successfully.');
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Active Notification Banner */}
      {simulationStatus?.active && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-transparent border border-rose-500/30 text-rose-600 dark:text-rose-400">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <div>
              <strong className="text-xs font-bold block">
                Active Mass Casualty Surge Simulation in Progress
              </strong>
              <span className="text-[11px] opacity-80">
                {simulationStatus.description || 'Emergency room capacities are actively rising.'} (Step {simulationStatus.step || 1} of 5)
              </span>
            </div>
          </div>
          <button
            onClick={handleResetSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>
      )}

      {/* Operation Feedback Toast */}
      {feedbackMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-medium animate-fadeIn">
          <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Top Header & Analytics Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-[26px] bg-white/80 dark:bg-[#0B1220]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              title="Return to Cockpit & Live Map"
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.06] hover:bg-blue-50 dark:hover:bg-blue-500/20 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all border border-slate-200 dark:border-white/[0.08] shadow-sm shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black font-['Outfit'] text-slate-900 dark:text-white tracking-tight">
                Emergency Analytics & Capacity Intelligence
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                Live Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cross-facility telemetry, admission velocities, and AI-predicted bed saturation
            </p>
          </div>
        </div>

        {/* Filter Pills & Interactive Actions */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Region Filter Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08]">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none pr-2 cursor-pointer"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe Selector (24h / 7d / 30d) */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08]">
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                timeRange === '24h'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              24h
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                timeRange === '7d'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                timeRange === '30d'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              30 Days
            </button>
          </div>

          {/* Surge Simulation Button */}
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isSimulating ? 'Simulating...' : 'Simulate Surge'}</span>
          </button>

          {/* Reset Baseline Button */}
          <button
            onClick={handleResetSimulation}
            title="Reset simulated spikes back to normal"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Export Report Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Distinct 3D Colored KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available Emergency Beds (3D Emerald Jade) */}
        <div className="p-5 rounded-[26px] bg-gradient-to-br from-emerald-50/95 via-teal-50/80 to-emerald-100/60 dark:from-[#06261E] dark:via-[#09352A] dark:to-[#041D17] border border-emerald-300/80 dark:border-emerald-500/40 border-b-[6px] border-b-emerald-600 dark:border-b-emerald-500 shadow-[0_14px_28px_-6px_rgba(5,150,105,0.22),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Available ER Beds</span>
            <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white shadow-sm shadow-emerald-600/30">
              {availBeds} Ready
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-950 dark:text-emerald-100 font-['Outfit'] mt-1">
            {availBeds} <span className="text-sm font-semibold text-emerald-700/80 dark:text-emerald-400">/ {totalBeds}</span>
          </div>
          <p className="text-[10px] text-emerald-800/80 dark:text-emerald-400/80 font-medium mt-1">Across {filteredHospitals.length} filtered centers</p>
        </div>

        {/* Card 2: Bed Saturation Rate (3D Amber Gold / Flame) */}
        <div className="p-5 rounded-[26px] bg-gradient-to-br from-amber-50/95 via-yellow-50/80 to-orange-100/60 dark:from-[#331C08] dark:via-[#42240A] dark:to-[#261506] border border-amber-300/80 dark:border-amber-500/40 border-b-[6px] border-b-amber-600 dark:border-b-amber-500 shadow-[0_14px_28px_-6px_rgba(217,119,6,0.22),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">System Saturation Rate</span>
            <span className={`inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white shadow-sm ${
              Number(saturationPct) > 80
                ? 'bg-rose-600 shadow-rose-600/30'
                : 'bg-amber-600 shadow-amber-600/30'
            }`}>
              <ArrowUpRight className="w-3 h-3" /> {saturationPct}%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-950 dark:text-amber-100 font-['Outfit'] mt-1">
            {saturationPct}%
          </div>
          <p className="text-[10px] text-amber-800/80 dark:text-amber-400/80 font-medium mt-1">{occBeds} occupied / {totalBeds} total capacity</p>
        </div>

        {/* Card 3: Critical Asset Reserves (3D Cobalt Sapphire Blue) */}
        <div className="p-5 rounded-[26px] bg-gradient-to-br from-blue-50/95 via-sky-50/80 to-indigo-100/60 dark:from-[#0B1E38] dark:via-[#0E294D] dark:to-[#08172C] border border-blue-300/80 dark:border-blue-500/40 border-b-[6px] border-b-blue-600 dark:border-b-blue-500 shadow-[0_14px_28px_-6px_rgba(37,99,235,0.22),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">ICU & Ventilator Ready</span>
            <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-sm shadow-blue-600/30">
              {totalIcu} ICU / {totalVent} Vent
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-950 dark:text-blue-100 font-['Outfit'] mt-1">
            {totalIcu + totalVent} Units
          </div>
          <p className="text-[10px] text-blue-800/80 dark:text-blue-400/80 font-medium mt-1">Available for immediate critical triage</p>
        </div>

        {/* Card 4: Average Triage Latency (3D Amethyst Purple) */}
        <div className="p-5 rounded-[26px] bg-gradient-to-br from-purple-50/95 via-violet-50/80 to-purple-100/60 dark:from-[#1E0F38] dark:via-[#29144D] dark:to-[#170B2B] border border-purple-300/80 dark:border-purple-500/40 border-b-[6px] border-b-purple-600 dark:border-b-purple-500 shadow-[0_14px_28px_-6px_rgba(147,51,234,0.22),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider">Avg Triage Latency</span>
            <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-600 text-white shadow-sm shadow-purple-600/30">
              <ArrowDownRight className="w-3 h-3" /> -3.2m
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-950 dark:text-purple-100 font-['Outfit'] mt-1">
            14.2 min
          </div>
          <p className="text-[10px] text-purple-800/80 dark:text-purple-400/80 font-medium mt-1">Door-to-doctor ER triage average</p>
        </div>
      </div>

      {/* Row 1: Hospital ER Capacity Stacked Bar Chart & Patient Triage Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stacked Capacity Comparison (~65% width) */}
        <div className="lg:col-span-8 p-6 rounded-[26px] bg-white/80 dark:bg-[#0B1220]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                Emergency Bed Occupancy by Medical Facility
              </h3>
              <p className="text-xs text-slate-400">
                Real-time breakdown of Available vs Occupied ER Capacity ({selectedRegion})
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Available Beds
              </span>
              <span className="flex items-center gap-1 text-rose-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Occupied
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capacityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl p-3 bg-white text-slate-800 border border-slate-200 shadow-2xl text-xs space-y-1">
                          <strong className="text-slate-900 block font-bold">{data.fullName}</strong>
                          <div className="text-emerald-600 font-semibold">Available Beds: {data.available}</div>
                          <div className="text-rose-600 font-semibold">Occupied Beds: {data.occupied}</div>
                          <div className="text-blue-600">ICU Available: {data.icu} Units</div>
                          <div className="text-purple-600">Ventilators: {data.vent} Units</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="available" name="Available Beds" fill="#10B981" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="occupied" name="Occupied Beds" fill="#EF4444" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Triage Severity Classification Breakdown (~35% width) */}
        <div className="lg:col-span-4 p-6 rounded-[26px] bg-white/80 dark:bg-[#0B1220]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit'] mb-1">
              Active Triage Classification
            </h3>
            <p className="text-xs text-slate-400 mb-4">Patient severity distribution</p>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TRIAGE_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={74}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {TRIAGE_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [`${val}%`, name]}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2E8F0',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#0F172A'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-white/[0.06] text-xs">
            {TRIAGE_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Admission vs Discharge Velocity Area Curve (Dynamic by timeRange) */}
      <div className="p-6 rounded-[26px] bg-white/80 dark:bg-[#0B1220]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
              Patient Admission vs Discharge Velocity ({timeRange.toUpperCase()})
            </h3>
            <p className="text-xs text-slate-400">
              System intake throughput across time: dynamically adapts to selected timeframe
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-blue-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Intake Admissions
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Patient Discharges
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={velocityData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="intakeWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="dischargeWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  fontSize: '11px',
                  color: '#0F172A'
                }}
              />
              <Area type="monotone" dataKey="admissions" name="Admissions" stroke="#2563EB" strokeWidth={2.5} fill="url(#intakeWave)" />
              <Area type="monotone" dataKey="discharges" name="Discharges" stroke="#10B981" strokeWidth={2.5} fill="url(#dischargeWave)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
