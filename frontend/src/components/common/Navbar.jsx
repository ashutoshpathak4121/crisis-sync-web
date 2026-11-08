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
      <div className="max-w-7xl mx-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm px-4 sm:px-6 transition-colors duration-200">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white shadow-sm shrink-0">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    Crisis<span className="text-blue-600 dark:text-blue-400">Sync</span>
                  </span>
                </div>
                <span className="block text-xs font-mono uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Emergency Telemetry
                </span>
              </div>
            </Link>
          </div>

          {/* Center Nav Links (Filtered by Role Permissions) */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            {allowedNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium tracking-normal transition-colors duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Live Status, Simulation Buttons, Theme Toggle, Auth */}
          <div className="hidden lg:flex items-center gap-3">
            <ConnectionStatus />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle visual theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Quick Demo Simulation Controls (Admin Only) */}
            {isSuperAdmin && (
              <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
                {simulationStatus.active ? (
                  <button
                    onClick={resetSimulation}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/80 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm"
                    title="Reset Demo Simulation"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Sim
                  </button>
                ) : (
                  <button
                    onClick={handleStartSimulation}
                    disabled={isSurging}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors shadow-sm"
                    title="Trigger Mass Casualty Demo on Hospital"
                  >
                    <PlayCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Demo Surge
                  </button>
                )}
              </div>
            )}

            {/* User Profile / Login */}
            <div className="border-l border-slate-200 dark:border-slate-800 pl-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-lg px-2.5 py-1">
                  <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[110px] leading-tight">
                      {user.name}
                    </p>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-mono uppercase font-medium">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="p-1 rounded text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Sign Out"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
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
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
              aria-label="Toggle visual theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
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
                      ? 'bg-blue-600 text-white'
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
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  <PlayCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Trigger Demo Surge
                </button>
              )}

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 py-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 py-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-semibold"
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
