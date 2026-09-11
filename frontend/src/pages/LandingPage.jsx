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
  Linkedin
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
    <div className="relative min-h-screen bg-[#080C15] overflow-hidden">
      {/* Glow ambient backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/15 to-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <Radio className="w-3.5 h-3.5" />
          <span>Real-Time Emergency Synchronization Protocol</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] font-['Outfit']">
          Zero Delays. Real-Time Emergency{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
            Resource Allocation.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
          Bridging hospital emergency rooms and ambulance paramedics with instantaneous sub-50ms
          WebSocket capacity sync, intelligent routing, and zero information silos.
        </p>

        {/* Creator Attribution */}
        <div className="mt-5 flex items-center justify-center gap-3 flex-wrap text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Engineered & Built by <strong className="text-white">Ashutosh Pathak</strong>
          </span>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/ashutoshpathak4121"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition-all text-[11px]"
              title="Ashutosh Pathak's GitHub"
            >
              <Github className="w-3 h-3 text-cyan-400" />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/ashutoshpathak4121"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0A66C2]/20 border border-[#0A66C2]/50 hover:border-[#0A66C2] text-blue-200 hover:text-white transition-all text-[11px]"
              title="Ashutosh Pathak's LinkedIn"
            >
              <Linkedin className="w-3 h-3 text-[#3b82f6]" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* 1-Click Fast Access Demo Bar for Hackathon Judges */}
        <div className="mt-10 p-4 max-w-3xl mx-auto rounded-2xl border border-cyan-500/30 bg-[#0E1626]/80 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between gap-2 mb-3 px-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              1-Click Judge Demo Quick Launch
            </span>
            <span className="text-[11px] text-slate-400">Select pre-configured role</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {DEMO_USERS.map((u) => (
              <button
                key={u.role}
                onClick={() => handleQuickLaunch(u)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#080C15] border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/40 text-left transition-all group"
              >
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-cyan-400 transition-colors">
                    {u.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{u.email}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* 3 Main Role Portals */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Portal 1: Command Center */}
          <div className="group rounded-2xl border border-[#1E2E48] bg-[#0E1626] p-7 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight font-['Outfit']">
              Command Dispatch Center
            </h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Strategic metropolitan oversight. Real-time fleet tracking, hospital occupancy
              matrices, active casualty surge simulator, and system analytics.
            </p>
            <Link
              to="/command"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 group-hover:text-cyan-300"
            >
              Enter Command Center <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Portal 2: Hospital ER */}
          <div className="group rounded-2xl border border-[#1E2E48] bg-[#0E1626] p-7 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight font-['Outfit']">
              Hospital ER Staff Portal
            </h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Touch-optimized capacity dial for nurses. Update emergency beds, ICU, ventilators,
              and diverts. Instant live propagation to all dispatchers.
            </p>
            <Link
              to="/hospital"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 group-hover:text-emerald-300"
            >
              Enter Hospital Portal <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Portal 3: Paramedic GPS */}
          <div className="group rounded-2xl border border-[#1E2E48] bg-[#0E1626] p-7 transition-all duration-300 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/10">
            <div className="w-12 h-12 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Ambulance className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight font-['Outfit']">
              Ambulance Paramedic HUD
            </h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Real-time map and smart hospital recommendations based on ETA, available beds,
              and acceptance status. Automatic reroute alerts if a hospital fills.
            </p>
            <Link
              to="/ambulance"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 group-hover:text-red-300"
            >
              Enter Paramedic HUD <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Feature Highlights Banner */}
        <div className="mt-20 border-t border-slate-800/80 pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-extrabold font-mono text-cyan-400">&lt; 50ms</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Live Socket Sync
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-emerald-400">100% Zero</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Page Refreshes
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-purple-400">Multi-Factor</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Smart ER Ranking
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-red-400">Sim Engine</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Mass Casualty Demo
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
