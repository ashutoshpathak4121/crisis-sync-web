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
  Sparkles,
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
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#050811] overflow-hidden text-slate-800 dark:text-slate-100 selection:bg-cyan-500 selection:text-white transition-colors duration-300">
      {/* High-Tech Animated Ambient Mesh Lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-br from-cyan-500/15 via-blue-600/10 to-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-[450px] h-[450px] bg-rose-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Futuristic Live System Telemetry Ticker */}
      <div className="w-full border-b border-slate-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-slate-950/60 backdrop-blur-md px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-[11px] font-mono text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-none">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">LIVE TELEMETRY STREAM</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-slate-700 dark:text-slate-300">5 HOSPITALS OPERATIONAL</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-slate-700 dark:text-slate-300">12 AMBULANCES DISPATCHED</span>
          </div>

          <div className="flex items-center gap-4 hidden sm:flex">
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" /> LATENCY: &lt;18ms
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-slate-600 dark:text-slate-400">SECURITY: AES-256 + TLS 1.3</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-24 text-center">
        {/* Futuristic Protocol Chip */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-50 dark:bg-cyan-950/40 backdrop-blur-md text-cyan-700 dark:text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm dark:shadow-glow-cyan animate-pulse">
          <Radio className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Real-Time Emergency Synchronization Protocol</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
        </div>

        {/* Dynamic Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] font-['Outfit'] max-w-5xl mx-auto">
          Zero Delays.{' '}
          <span className="bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 dark:from-cyan-400 dark:via-teal-300 dark:to-blue-500 bg-clip-text text-transparent">
            Real-Time Emergency
          </span>{' '}
          Resource Allocation.
        </h1>

        <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
          Bridging hospital emergency rooms and ambulance paramedics with instantaneous sub-50ms
          WebSocket capacity sync, intelligent routing, and zero information silos.
        </p>

        {/* Creator Attribution */}
        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap text-xs font-mono text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            Engineered & Built by <strong className="text-slate-900 dark:text-white">Ashutosh Pathak</strong>
          </span>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/ashutoshpathak4121"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-white transition-all text-xs font-semibold shadow-sm"
              title="Ashutosh Pathak's GitHub"
            >
              <Github className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/ashutoshpathak4121"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A66C2]/10 dark:bg-[#0A66C2]/20 border border-[#0A66C2]/30 dark:border-[#0A66C2]/50 hover:border-[#0A66C2] text-[#0A66C2] dark:text-blue-200 hover:text-[#004182] dark:hover:text-white transition-all text-xs font-semibold shadow-sm"
              title="Ashutosh Pathak's LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] dark:text-[#38bdf8]" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* 1-Click Fast Access Demo Bar for Hackathon Judges */}
        <div className="mt-10 p-5 max-w-4xl mx-auto rounded-2xl border border-slate-200/80 dark:border-cyan-500/30 bg-white/90 dark:bg-gradient-to-b dark:from-[#0F192C]/90 dark:to-[#0A101E]/95 backdrop-blur-2xl shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-cyan-950/30 text-left">
          <div className="flex items-center justify-between gap-2 mb-3.5 px-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400 fill-cyan-500/20" />
              1-Click Judge Demo Quick Launch
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline-block">
              Instant JWT Auth // Select Pre-Configured Role
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DEMO_USERS.map((u) => {
              const roleAccent =
                u.role === 'ADMIN'
                  ? 'hover:border-cyan-500/50 hover:shadow-glow-cyan'
                  : u.role === 'HOSPITAL'
                  ? 'hover:border-emerald-500/50 hover:shadow-glow-emerald'
                  : 'hover:border-red-500/50 hover:shadow-glow-red';

              return (
                <button
                  key={u.role}
                  onClick={() => handleQuickLaunch(u)}
                  className={`flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#070D1A] border border-slate-200 dark:border-white/[0.08] text-left transition-all duration-300 group hover:-translate-y-0.5 active:scale-98 shadow-sm ${roleAccent}`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                        {u.title}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300">
                        {u.role}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">{u.email}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Main Role Portals */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Portal 1: Command Center */}
          <div className="relative group rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-gradient-to-b dark:from-[#0F1829]/80 dark:to-[#0A101E]/90 backdrop-blur-xl p-7 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-glow-cyan hover:-translate-y-1 shadow-lg shadow-slate-200/50 dark:shadow-none">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight font-['Outfit']">
              Command Dispatch Center
            </h3>
            <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Strategic metropolitan oversight. Real-time fleet tracking, hospital occupancy
              matrices, active casualty surge simulator, and system analytics.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300">
                Live GPS Radar
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300">
                Surge Simulator
              </span>
            </div>
            <Link
              to="/command"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500 transition-colors"
            >
              Enter Command Center <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Portal 2: Hospital ER */}
          <div className="relative group rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-gradient-to-b dark:from-[#0F1829]/80 dark:to-[#0A101E]/90 backdrop-blur-xl p-7 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-glow-emerald hover:-translate-y-1 shadow-lg shadow-slate-200/50 dark:shadow-none">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight font-['Outfit']">
              Hospital ER Staff Portal
            </h3>
            <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Touch-optimized capacity dial for nurses. Update emergency beds, ICU, ventilators,
              and diverts. Instant live propagation to all dispatchers.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                Touch Stepper Dials
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                Audit Trail
              </span>
            </div>
            <Link
              to="/hospital"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors"
            >
              Enter Hospital Portal <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Portal 3: Paramedic GPS */}
          <div className="relative group rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-gradient-to-b dark:from-[#0F1829]/80 dark:to-[#0A101E]/90 backdrop-blur-xl p-7 transition-all duration-300 hover:border-red-500/50 hover:shadow-glow-red hover:-translate-y-1 shadow-lg shadow-slate-200/50 dark:shadow-none">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
              <Ambulance className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight font-['Outfit']">
              Ambulance Paramedic HUD
            </h3>
            <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Real-time map and smart hospital recommendations based on ETA, available beds,
              and acceptance status. Automatic reroute alerts if a hospital fills.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300">
                Attach Near Hospital
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300">
                AI Match Score
              </span>
            </div>
            <Link
              to="/ambulance"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 group-hover:text-red-500 transition-colors"
            >
              Enter Paramedic HUD <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature Highlights Banner */}
        <div className="mt-20 border-t border-slate-200/80 dark:border-white/[0.08] pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.04] shadow-sm">
            <div className="text-3xl font-black font-mono text-cyan-600 dark:text-cyan-400">&lt; 50ms</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Live Socket Sync
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.04] shadow-sm">
            <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">100% Zero</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Page Refreshes
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.04] shadow-sm">
            <div className="text-3xl font-black font-mono text-purple-600 dark:text-purple-400">Multi-Factor</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Smart ER Ranking
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.04] shadow-sm">
            <div className="text-3xl font-black font-mono text-rose-600 dark:text-rose-400">Sim Engine</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Mass Casualty Demo
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
