import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../utils/constants';
import { Radio, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@crisissync.demo');
  const [password, setPassword] = useState('DemoPassword123!');
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectDemoUser = (user) => {
    setSelectedRole(user.role);
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
      // Redirect based on role or intended route
      const destination = location.state?.from?.pathname || (
        user.role === 'ADMIN' ? '/command' : user.role === 'HOSPITAL' ? '/hospital' : '/ambulance'
      );
      navigate(destination);
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-[#050811] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#0F192C]/90 to-[#0A101E]/95 p-8 shadow-2xl backdrop-blur-2xl">
        {/* Top micro light reflection */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-blue-600 p-[1.5px] shadow-lg shadow-cyan-500/20 mb-3">
            <div className="w-full h-full bg-[#070D1A] rounded-[14px] flex items-center justify-center">
              <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight font-['Outfit']">
            Sign In to CrisisSync
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-Time Emergency Resource Allocation Platform
          </p>
        </div>

        {/* 1-Click Fast Demo Credentials Selector */}
        <div className="mb-6 p-3.5 rounded-xl bg-[#060B16] border border-white/[0.08]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-2">
            1-Click Demo Accounts:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_USERS.map((u) => {
              const isSelected = selectedRole === u.role;
              return (
                <button
                  key={u.role}
                  type="button"
                  onClick={() => handleSelectDemoUser(u)}
                  className={`px-2.5 py-2 rounded-lg text-center text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 ring-1 ring-cyan-500/40 shadow-sm shadow-cyan-500/20'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="block text-[11px] font-mono">{u.role}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="paramedic@crisissync.demo"
                className="w-full bg-[#060B16] border border-white/[0.1] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-400 focus:shadow-glow-cyan focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#060B16] border border-white/[0.1] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-200 focus:border-cyan-400 focus:shadow-glow-cyan focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Enter Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
