import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import { useTheme } from '../../context/ThemeContext';
import ConnectionStatus from './ConnectionStatus';
import {
  ShieldAlert,
  Building2,
  Ambulance,
  LayoutDashboard,
  PlayCircle,
  RotateCcw,
  LogOut,
  LogIn,
  Menu,
  X,
  Radio,
  Sun,
  Moon
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const {
    startSurgeSimulation,
    resetSimulation,
    simulationStatus
  } = useEmergencyData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSurging, setIsSurging] = useState(false);

  const handleStartSimulation = async () => {
    try {
      setIsSurging(true);
      await startSurgeSimulation();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSurging(false);
    }
  };

  const allNavLinks = [
    {
      name: 'Public Portal',
      path: '/overview',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'SUPER_ADMIN', 'HOSPITAL', 'HOSPITAL_ADMIN', 'PARAMEDIC', 'HOSPITAL_STAFF', 'USER', 'CITIZEN']
    },
    {
      name: 'Command Center',
      path: '/command',
      icon: ShieldAlert,
      roles: ['ADMIN', 'SUPER_ADMIN']
    },
    {
      name: 'Hospital Management',
      path: '/hospital',
      icon: Building2,
      roles: ['HOSPITAL', 'HOSPITAL_ADMIN', 'ADMIN', 'SUPER_ADMIN']
    },
    {
      name: 'Ambulance Dispatch',
      path: '/ambulance',
      icon: Ambulance,
      roles: ['PARAMEDIC', 'HOSPITAL_STAFF', 'ADMIN', 'SUPER_ADMIN']
    }
  ];

  const userRole = user?.role || 'USER';
  const isSuperAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(userRole);

  const allowedNavLinks = allNavLinks.filter((link) => {
    if (isSuperAdmin) return true;
    if (!isAuthenticated) return link.roles.includes('USER');
    return link.roles.includes(userRole);
  });

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 pt-3 pb-1">
      <div className="max-w-7xl mx-auto rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#070D1A]/80 backdrop-blur-2xl shadow-lg shadow-slate-200/40 dark:shadow-2xl dark:shadow-black/60 px-4 sm:px-6 transition-colors duration-300">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-blue-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
                <div className="w-full h-full bg-slate-50 dark:bg-[#070D1A] rounded-[10px] flex items-center justify-center">
                  <Radio className="w-5 h-5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white font-['Outfit']">
                    Crisis<span className="bg-gradient-to-r from-cyan-600 dark:from-cyan-400 via-teal-500 dark:via-teal-300 to-blue-600 dark:to-blue-400 bg-clip-text text-transparent">Sync</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest hidden sm:inline-block">
                    PRO v2.6
                  </span>
                </div>
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 -mt-0.5">
                  Emergency Telemetry Sync
                </span>
              </div>
            </Link>
          </div>

          {/* Center Nav Links (Filtered by Role Permissions) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.04]">
            {allowedNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/50 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                  {link.name}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Live Status, Simulation Buttons, Theme Toggle, Auth */}
          <div className="hidden lg:flex items-center gap-3">
            <ConnectionStatus />

            {/* Theme Toggle (Day-Light / Cyber-Dark) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.05] dark:hover:bg-white/10 text-amber-500 dark:text-amber-400 border border-slate-200 dark:border-white/10 transition-colors shadow-sm"
              title={isDark ? 'Switch to Daylight Theme' : 'Switch to Cyber-Dark Theme'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-cyan-600" />}
            </button>

            {/* Quick Demo Simulation Controls (Admin Only) */}
            {isSuperAdmin && (
              <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-white/[0.08] pl-3">
                {simulationStatus.active ? (
                  <button
                    onClick={resetSimulation}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/40 hover:bg-red-500/25 transition-all shadow-sm"
                    title="Reset Demo Simulation"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Sim
                  </button>
                ) : (
                  <button
                    onClick={handleStartSimulation}
                    disabled={isSurging}
                    className="relative group overflow-hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-blue-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/50 hover:border-cyan-400 transition-all shadow-sm active:scale-95"
                    title="Trigger Mass Casualty Demo on Hospital"
                  >
                    <PlayCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                    Demo Surge
                  </button>
                )}
              </div>
            )}

            {/* User Profile / Login */}
            <div className="border-l border-slate-200 dark:border-white/[0.08] pl-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-xl px-2.5 py-1">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[110px] leading-tight">
                      {user.name}
                    </p>
                    <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-mono uppercase font-semibold">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/[0.05] hover:bg-cyan-500/20 text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-300 transition-all border border-slate-200 dark:border-white/[0.1] hover:border-cyan-500/40"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Demo Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu & Theme Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-amber-500 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-cyan-600" />}
            </button>
            <ConnectionStatus />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {allowedNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-2">
              {isSuperAdmin && (
                <button
                  onClick={() => {
                    handleStartSimulation();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30"
                >
                  <PlayCircle className="w-4 h-4" />
                  Trigger Demo Surge
                </button>
              )}

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400 py-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1 text-xs text-cyan-600 dark:text-cyan-400 py-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <LogIn className="w-4 h-4" /> Demo Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
