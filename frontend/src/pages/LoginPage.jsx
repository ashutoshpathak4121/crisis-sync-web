import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS, getRoleDestination } from '../utils/constants';
import { Radio, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('hospital@crisissync.demo');
  const [password, setPassword] = useState('DemoPassword123!');
  const [selectedEmail, setSelectedEmail] = useState('hospital@crisissync.demo');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectDemoUser = (user) => {
    setSelectedEmail(user.email);
    setEmail(user.email);
    setPassword(user.password);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const user = await login(email, password);
      // Dedicated Role-Based Redirection:
      // Hospital -> /hospital
      // Paramedic -> /ambulance
      // Admin -> /command
      // Citizen / User -> /overview
      const destination = location.state?.from?.pathname || getRoleDestination(user.role);
      navigate(destination);
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-slate-100 dark:bg-[#030712] overflow-hidden select-none font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-[550px] h-[550px] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />

      <div className="relative w-full max-w-md rounded-[32px] border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-slate-900/40 p-8 shadow-xl shadow-slate-200/50 dark:shadow-[0_25px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4E35CD] to-indigo-500 p-[1.5px] shadow-lg shadow-indigo-500/25 mb-3 text-white">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-['Outfit']">
            Sign In to CrisisSync
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-Time Emergency Resource Allocation Platform
          </p>
        </div>

        {/* 1-Click Fast Demo Credentials Selector */}
        <div className="mb-6 p-3.5 rounded-2xl bg-[#F6F7FD] dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#4E35CD] dark:text-indigo-400 block mb-2">
            1-Click Demo Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_USERS.map((u) => {
              const isSelected = selectedEmail === u.email;
              return (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => handleSelectDemoUser(u)}
                  className={`p-2.5 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-500/20 border-[#4E35CD] text-[#4E35CD] dark:text-indigo-300 shadow-sm'
                      : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                  }`}
                >
                  <span className="block text-xs font-bold truncate">{u.name || u.title}</span>
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">{u.role}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ashutosh@crisissync.demo"
                className="w-full bg-[#F6F7FD] dark:bg-[#060B16] border border-slate-200 dark:border-white/[0.1] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:border-[#4E35CD] focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F6F7FD] dark:bg-[#060B16] border border-slate-200 dark:border-white/[0.1] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-[#4E35CD] focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 px-4 rounded-xl bg-[#4E35CD] hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Enter Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Back to Dashboard Link */}
        <div className="mt-5 text-center">
          <Link
            to="/overview"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#4E35CD] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue as Guest / Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
