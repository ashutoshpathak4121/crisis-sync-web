import React from 'react';
import { Link } from 'react-router-dom';
import {
  Radio,
  Github,
  Linkedin,
  Heart,
  ShieldCheck,
  Zap,
  Activity,
  Code2
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-white/[0.06] bg-white/90 dark:bg-[#04070F] text-slate-600 dark:text-slate-400 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Mission (5 cols) */}
          <div className="md:col-span-5 space-y-3.5">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-blue-600 p-[1px] shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-white dark:bg-[#070D1A] rounded-[11px] flex items-center justify-center">
                  <Radio className="w-4 h-4 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                </div>
              </div>
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-white font-['Outfit']">
                Crisis<span className="bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">Sync</span>
              </span>
            </Link>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Real-time emergency resource allocation and telemetry platform bridging hospital
              emergency rooms and ambulance fleets with zero communication delays.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Sub-50ms WebSocket Synchronized Fleet Telemetry</span>
            </div>
          </div>

          {/* Quick Dashboards (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-300 font-mono">
              Emergency Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/command" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="text-cyan-500">›</span> Command Dispatch Center
                </Link>
              </li>
              <li>
                <Link to="/hospital" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="text-emerald-500">›</span> Hospital ER Capacity Portal
                </Link>
              </li>
              <li>
                <Link to="/ambulance" className="hover:text-red-600 dark:hover:text-red-300 transition-colors flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="text-red-500">›</span> Ambulance Paramedic HUD
                </Link>
              </li>
            </ul>
          </div>

          {/* Creator Spotlight (4 cols) */}
          <div className="md:col-span-4 rounded-2xl border border-cyan-500/30 bg-slate-50/90 dark:bg-gradient-to-b dark:from-[#0B1324] dark:to-[#070D1A] p-5 shadow-xl shadow-slate-200/50 dark:shadow-cyan-950/20 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                Architect & Engineer
              </span>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                100% Original
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-blue-600 flex items-center justify-center font-black text-white shadow-lg text-sm">
                AP
              </div>
              <div>
                <h5 className="text-sm font-black text-slate-900 dark:text-white font-['Outfit']">Ashutosh Pathak</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Lead Full-Stack Developer</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
              Engineered end-to-end with real-time WebSockets, dynamic hospital scoring, and Leaflet Google Maps.
            </p>

            <div className="mt-3.5 grid grid-cols-2 gap-2">
              <a
                href="https://github.com/ashutoshpathak4121"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#060B16] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-white/[0.1] hover:border-cyan-500 transition-all justify-center shadow-sm"
                title="Ashutosh Pathak's GitHub"
              >
                <Github className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>GitHub</span>
              </a>

              <a
                href="https://linkedin.com/in/ashutoshpathak4121"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#0A66C2]/10 dark:bg-[#0A66C2]/20 hover:bg-[#0A66C2]/20 dark:hover:bg-[#0A66C2]/35 text-[#0A66C2] dark:text-blue-200 hover:text-[#004182] dark:hover:text-white border border-[#0A66C2]/30 dark:border-[#0A66C2]/50 hover:border-[#0A66C2] transition-all justify-center shadow-sm"
                title="Ashutosh Pathak's LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] dark:text-[#38bdf8]" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-10 pt-6 border-t border-slate-200/80 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-800 dark:text-slate-300">Ashutosh Pathak</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span>React 18</span>
            <span>•</span>
            <span>Node.js</span>
            <span>•</span>
            <span>Socket.io</span>
            <span>•</span>
            <span>Leaflet</span>
            <span>•</span>
            <span>Prisma</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
