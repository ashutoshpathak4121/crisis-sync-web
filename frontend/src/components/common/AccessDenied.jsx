import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogIn, Lock, UserCheck } from 'lucide-react';

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
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-slate-50 dark:bg-[#0B0F19] font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 shadow-sm text-center">
        {/* Shield Icon */}
        <div className="mx-auto w-14 h-14 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center justify-center text-red-600 dark:text-red-400 mb-4 shadow-sm">
          <ShieldAlert className="w-7 h-7" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/60 mb-3">
          <Lock className="w-3.5 h-3.5" />
          Restricted Portal Area
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Clearance Verification Required
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-md mx-auto">
          You are signed in as <strong className="text-slate-900 dark:text-white font-semibold">{user?.name || 'Citizen'}</strong> with{' '}
          <span className="font-mono text-blue-700 dark:text-blue-400 font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
            {user?.role || 'GUEST'}
          </span>{' '}
          status.
        </p>

        {/* Security Warning Notice */}
        <div className="mt-5 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2.5">
          <div className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-500 mt-1 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white font-semibold">Required Permission: </strong>
              {getRoleLabel(requiredRoles)}
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 mt-1 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400">
              Public citizens and unauthorized users are restricted from modifying hospital ICU bed counts, emergency hospital statuses, and ambulance fleet routing.
            </span>
          </div>
        </div>

        {/* Fast Switch Demo Accounts */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-left">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-2.5">
            Switch to Authorized Healthcare Role:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => handleQuickSwitch('hospital@crisissync.demo', '/hospital')}
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <UserCheck className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <div className="truncate text-left">
                <span className="block truncate font-bold">Hospital ER Chief</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">hospital@demo</span>
              </div>
            </button>

            <button
              onClick={() => handleQuickSwitch('paramedic@crisissync.demo', '/ambulance')}
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <UserCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="truncate text-left">
                <span className="block truncate font-bold">Paramedic Lead</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">paramedic@demo</span>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/overview')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Public Portal
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer"
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
