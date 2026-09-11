import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEmergencyData } from '../../context/EmergencyDataContext';
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
  Radio
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
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

  const navLinks = [
    {
      name: 'Command Center',
      path: '/command',
      icon: LayoutDashboard,
      role: 'ADMIN'
    },
    {
      name: 'Hospital Portal',
      path: '/hospital',
      icon: Building2,
      role: 'HOSPITAL'
    },
    {
      name: 'Ambulance GPS',
      path: '/ambulance',
      icon: Ambulance,
      role: 'PARAMEDIC'
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E2E48] bg-[#080C15]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-cyan-500 p-0.5 shadow-lg shadow-cyan-500/10 group-hover:shadow-cyan-500/25 transition-all">
                <div className="w-full h-full bg-[#080C15] rounded-[10px] flex items-center justify-center">
                  <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5 font-['Outfit']">
                  Crisis<span className="text-cyan-400">Sync</span>
                </span>
                <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-400 -mt-0.5">
                  Real-Time Resource Allocator
                </span>
              </div>
            </Link>
          </div>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Live Status, Simulation Buttons, Auth */}
          <div className="hidden lg:flex items-center gap-3">
            <ConnectionStatus />

            {/* Quick Demo Simulation Controls */}
            <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
              {simulationStatus.active ? (
                <button
                  onClick={resetSimulation}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition-all"
                  title="Reset Demo Simulation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Sim
                </button>
              ) : (
                <button
                  onClick={handleStartSimulation}
                  disabled={isSurging}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/25 hover:border-cyan-400 transition-all shadow-sm shadow-cyan-500/10"
                  title="Trigger Mass Casualty Demo on Hospital"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  Demo Surge
                </button>
              )}
            </div>

            {/* User Profile / Login */}
            <div className="border-l border-slate-800 pl-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-2.5">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-200 truncate max-w-[130px]">
                      {user.name}
                    </p>
                    <span className="text-[10px] text-cyan-400 font-mono uppercase">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Demo Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ConnectionStatus />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between px-2">
              <button
                onClick={() => {
                  handleStartSimulation();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
              >
                <PlayCircle className="w-4 h-4" />
                Trigger Demo Surge
              </button>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1 text-xs text-red-400 py-2 px-3 hover:bg-slate-800 rounded-lg"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1 text-xs text-cyan-400 py-2 px-3 hover:bg-slate-800 rounded-lg"
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
