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
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-[#080C15]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md rounded-2xl border border-[#1E2E48] bg-[#0E1626] p-7 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-cyan-500 p-0.5 shadow-lg mb-3">
            <div className="w-full h-full bg-[#080C15] rounded-[10px] flex items-center justify-center">
              <Radio className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-['Outfit']">
            Sign In to CrisisSync
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-Time Emergency Resource Allocation Platform
          </p>
        </div>

        {/* 1-Click Fast Demo Credentials Selector */}
        <div className="mb-5 p-3 rounded-xl bg-[#080C15] border border-slate-800">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-2">
            1-Click Demo Accounts:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {DEMO_USERS.map((u) => {
              const isSelected = selectedRole === u.role;
              return (
                <button
                  key={u.role}
                  type="button"
                  onClick={() => handleSelectDemoUser(u)}
                  className={`px-2.5 py-2 rounded-lg text-center text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/40'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
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
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="paramedic@crisissync.demo"
                className="w-full bg-[#080C15] border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#080C15] border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
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
