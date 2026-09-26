import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogIn, Lock, CheckCircle2, UserCheck } from 'lucide-react';

const AccessDenied = ({ requiredRoles = [] }) => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const handleQuickSwitch = async (email, destination) => {
    try {
      await login(email, 'DemoPassword123!');
      navigate(destination);
    } catch (err) {
      console.error('Fast switch failed:', err);
    }
  };

  const getRoleLabel = (roles) => {
    if (roles.includes('HOSPITAL')) return 'Hospital Staff / ER Incharge Clearance';
    if (roles.includes('PARAMEDIC')) return 'Paramedic / Ambulance Dispatch Clearance';
    if (roles.includes('ADMIN')) return 'Command Center Administrator Clearance';
    return 'Authorized Healthcare Personnel Clearance';
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-slate-100 dark:bg-[#030712] relative overflow-hidden select-none font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Dynamic Background Aurora Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-rose-500/10 dark:bg-rose-500/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-amber-500/10 dark:bg-amber-500/15 blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />

      <div className="relative w-full max-w-lg rounded-[32px] border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-slate-900/40 backdrop-blur-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-center">
        {/* Shield Icon with Amber/Rose Ring */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-5 shadow-lg shadow-rose-900/20">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 mb-3">
          <Lock className="w-3 h-3" />
          Restricted Portal Area
        </div>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit'] tracking-tight">
          Clearance Verification Required
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed max-w-md mx-auto">
          You are signed in as <strong className="text-cyan-700 dark:text-cyan-300">{user?.name || 'Citizen'}</strong> with{' '}
          <span className="font-mono text-cyan-700 dark:text-cyan-400 font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
            {user?.role || 'GUEST'}
          </span>{' '}
          status.
        </p>

        {/* Security Warning Notice */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/[0.08] text-left text-xs space-y-2">
          <div className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400 mt-1.5 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">Required Permission: </strong>
              {getRoleLabel(requiredRoles)}
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 mt-1.5 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400">
              Public citizens and unauthorized users are restricted from modifying hospital ICU bed counts, emergency hospital statuses, and ambulance fleet routing.
            </span>
          </div>
        </div>

        {/* Fast Switch Demo Accounts */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10 text-left">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-2">
            Switch to Authorized Healthcare Role:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickSwitch('hospital@crisissync.demo', '/hospital')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-800 dark:text-cyan-300 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-98 shadow-sm"
            >
              <UserCheck className="w-4 h-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
              <div className="truncate text-left">
                <span className="block truncate">Hospital ER Chief</span>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400/80 font-mono">hospital@demo</span>
              </div>
            </button>

            <button
              onClick={() => handleQuickSwitch('paramedic@crisissync.demo', '/ambulance')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-98 shadow-sm"
            >
              <UserCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="truncate text-left">
                <span className="block truncate">Paramedic Lead</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400/80 font-mono">paramedic@demo</span>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/overview')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Public Portal
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            Sign In with Different ID
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
