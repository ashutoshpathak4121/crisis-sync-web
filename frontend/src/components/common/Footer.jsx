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
    <footer className="w-full border-t border-[#1E2E48] bg-[#060910] text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Mission (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-cyan-500 p-0.5 shadow-md shadow-cyan-500/15">
                <div className="w-full h-full bg-[#080C15] rounded-[6px] flex items-center justify-center">
                  <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <span className="text-base font-extrabold tracking-tight text-white font-['Outfit']">
                Crisis<span className="text-cyan-400">Sync</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Real-time emergency resource allocation and telemetry platform bridging hospital
              emergency rooms and ambulance fleets with zero communication delays.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Sub-50ms WebSocket Synchronized Fleet Telemetry</span>
            </div>
          </div>

          {/* Quick Dashboards (3 cols) */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono">
              Emergency Portals
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/command" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>•</span> Command Dispatch Center
                </Link>
              </li>
              <li>
                <Link to="/hospital" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>•</span> Hospital ER Capacity Portal
                </Link>
              </li>
              <li>
                <Link to="/ambulance" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>•</span> Ambulance Paramedic HUD
                </Link>
              </li>
            </ul>
          </div>

          {/* Creator Spotlight (4 cols) */}
          <div className="md:col-span-4 rounded-xl border border-cyan-500/30 bg-[#0E1626]/80 p-4 shadow-xl">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5" />
                Creator & Architect
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                100% Original
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg text-sm">
                AP
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">Ashutosh Pathak</h5>
                <p className="text-[11px] text-slate-400">Lead Full-Stack Developer</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 mt-2.5 leading-relaxed">
              Engineered end-to-end with real-time WebSockets, dynamic hospital scoring, and Leaflet Google Maps.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href="https://github.com/ashutoshpathak4121"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-cyan-500/40 transition-all justify-center"
                title="Ashutosh Pathak's GitHub"
              >
                <Github className="w-3.5 h-3.5 text-cyan-400" />
                <span>GitHub</span>
              </a>

              <a
                href="https://linkedin.com/in/ashutoshpathak4121"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#0A66C2]/20 hover:bg-[#0A66C2]/35 text-white border border-[#0A66C2]/50 hover:border-[#0A66C2] transition-all justify-center"
                title="Ashutosh Pathak's LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#3b82f6]" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-300">Ashutosh Pathak</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
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
