import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../utils/constants';
import {
  Radio,
  Building2,
  Ambulance,
  LayoutDashboard,
  Zap,
  ArrowRight,
  ShieldCheck,
  Activity,
  HeartPulse,
  Navigation,
  Github,
  Linkedin,
  Clock,
  Server,
  Layers
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleQuickLaunch = async (demoUser) => {
    try {
      await login(demoUser.email, demoUser.password);
      if (demoUser.role === 'ADMIN') navigate('/command');
      else if (demoUser.role === 'HOSPITAL') navigate('/hospital');
      else navigate('/ambulance');
    } catch (err) {
      console.error(err);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Live System Telemetry Ticker */}
      <div className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-[11px] font-mono text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">LIVE TELEMETRY STREAM</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-700 dark:text-slate-300">5 HOSPITALS OPERATIONAL</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-700 dark:text-slate-300">12 AMBULANCES DISPATCHED</span>
          </div>

          <div className="flex items-center gap-4 hidden sm:flex">
            <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" /> LATENCY: &lt;18ms
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-600 dark:text-slate-400">SECURITY: AES-256 + TLS 1.3</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 text-center">
        {/* Protocol Chip */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-800/80 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
          <Radio className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Real-Time Emergency Synchronization Protocol</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Zero Delays.{' '}
          <span className="text-blue-600 dark:text-blue-400">
            Real-Time Emergency
          </span>{' '}
          Resource Allocation.
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Bridging hospital emergency rooms and ambulance paramedics with instantaneous sub-50ms
          WebSocket capacity sync, intelligent routing, and zero information silos.
        </p>

        {/* Creator Attribution */}
        <div className="mt-5 flex items-center justify-center gap-3 flex-wrap text-xs font-mono text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-2 px-3 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            Engineered & Built by <strong className="text-slate-900 dark:text-white font-sans">Ashutosh Pathak</strong>
          </span>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/ashutoshpathak4121"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white transition-colors text-xs font-semibold"
              title="Ashutosh Pathak's GitHub"
            >
              <Github className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/ashutoshpathak4121"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white transition-colors text-xs font-semibold"
              title="Ashutosh Pathak's LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-600" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* 1-Click Fast Access Demo Bar */}
        <div className="mt-8 p-4 sm:p-5 max-w-4xl mx-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-sm text-left">
          <div className="flex items-center justify-between gap-2 mb-3 px-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              1-Click Demo Quick Launch
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline-block">
              Select Pre-Configured Role
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DEMO_USERS.map((u) => (
              <button
                key={u.role}
                onClick={() => handleQuickLaunch(u)}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left hover:border-blue-500 dark:hover:border-blue-500 transition-colors group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {u.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {u.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">{u.email}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* 3 Main Role Portals */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          {/* Portal 1: Command Center */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-6 shadow-sm hover:border-blue-500 dark:hover:border-blue-500 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center mb-4">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Command Dispatch Center
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Strategic metropolitan oversight. Real-time fleet tracking, hospital occupancy
              matrices, active casualty surge simulator, and system analytics.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                Live GPS Radar
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                Surge Simulator
              </span>
            </div>
            <Link
              to="/command"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors"
            >
              <span>Enter Command Center</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Portal 2: Hospital ER */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-6 shadow-sm hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Hospital ER Staff Portal
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Touch-optimized capacity dial for nurses. Update emergency beds, ICU, ventilators,
              and diverts. Instant live propagation to all dispatchers.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                Touch Stepper Dials
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                Audit Trail
              </span>
            </div>
            <Link
              to="/hospital"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors"
            >
              <span>Enter Hospital Portal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Portal 3: Paramedic GPS */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-6 shadow-sm hover:border-red-500 dark:hover:border-red-500 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/60 flex items-center justify-center mb-4">
              <Ambulance className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Ambulance Paramedic HUD
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Real-time map and smart hospital recommendations based on ETA, available beds,
              and acceptance status. Automatic reroute alerts if a hospital fills.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                Attach Near Hospital
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                AI Match Score
              </span>
            </div>
            <Link
              to="/ambulance"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors"
            >
              <span>Enter Paramedic HUD</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature Highlights Banner */}
        <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">&lt; 50ms</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Live Socket Sync
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">100% Zero</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Page Refreshes
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-200">Multi-Factor</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Smart ER Ranking
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">Sim Engine</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Mass Casualty Demo
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;