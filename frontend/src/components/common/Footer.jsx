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
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] text-slate-600 dark:text-slate-400 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Mission (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 text-white shadow-sm shrink-0">
                <Radio className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Crisis<span className="text-blue-600 dark:text-blue-400">Sync</span>
              </span>
            </Link>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Real-time emergency resource allocation and telemetry platform bridging hospital
              emergency rooms and ambulance fleets with zero communication delays.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>Real-Time WebSocket Synchronized Telemetry</span>
            </div>
          </div>

          {/* Quick Dashboards (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 font-mono">
              Emergency Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/command" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="text-blue-500">›</span> Command Dispatch Center
                </Link>
              </li>
              <li>
                <Link to="/hospital" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="text-emerald-500">›</span> Hospital ER Capacity Portal
                </Link>
              </li>
              <li>
                <Link to="/ambulance" className="hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="text-red-500">›</span> Ambulance Paramedic HUD
                </Link>
              </li>
            </ul>
          </div>

          {/* Creator Spotlight (4 cols) */}
          <div className="md:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111827] p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                Architect & Engineer
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm text-xs">
                AP
              </div>
              <div>
                <h5 className="text-sm font-semibold text-slate-900 dark:text-white">Ashutosh Pathak</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Lead Full-Stack Developer</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
              Engineered with real-time WebSockets, dynamic hospital scoring, and interactive mapping.
            </p>

            <div className="mt-3.5 grid grid-cols-2 gap-2">
              <a
                href="https://github.com/ashutoshpathak4121"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-[#1E293B] hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors justify-center shadow-sm"
                title="Ashutosh Pathak's GitHub"
              >
                <Github className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                <span>GitHub</span>
              </a>

              <a
                href="https://linkedin.com/in/ashutoshpathak4121"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-[#1E293B] hover:bg-slate-100 dark:hover:bg-slate-700 text-[#0A66C2] dark:text-[#38bdf8] border border-slate-200 dark:border-slate-700 hover:border-[#0A66C2] transition-colors justify-center shadow-sm"
                title="Ashutosh Pathak's LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] dark:text-[#38bdf8]" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-800 dark:text-slate-300">Ashutosh Pathak</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
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
