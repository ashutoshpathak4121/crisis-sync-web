import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  Ambulance,
  Shield,
  Bell,
  TrendingUp,
  MapPin,
  ChevronDown,
  Sun,
  Moon,
  Home,
  User,
  Plus,
  AlertOctagon,
  ArrowRight,
  ArrowLeft,
  Radio,
  Activity,
  Layers,
  HelpCircle,
  LogIn,
  LogOut,
  Check,
  Bed,
  Wind
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USERS, getRoleDestination } from '../../utils/constants';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import GoogleMapView from './ThreeDMapView';
import RightPanel from './RightPanel';
import { TrendCharts } from './CrisisCharts';
import { SosModal, PatientDetailsModal, ReserveBedModal } from './CrisisModals';
import AnalyticsView from './AnalyticsView';
import HospitalTable from '../command/HospitalTable';
import AmbulanceList from '../command/AmbulanceList';
import IncidentFeed from '../command/IncidentFeed';
import SimulationController from '../command/SimulationController';

// Mini Sparkline Wave Component for the 5 KPI Cards styled with reference image wave aesthetics
const MiniSparkline = ({ points, color = '#4E35CD', id }) => (
  <svg className="w-full h-8 mt-2 overflow-hidden" viewBox="0 0 100 28" preserveAspectRatio="none">
    <defs>
      <linearGradient id={`kpi-grad-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.28" />
        <stop offset="100%" stopColor={color} stopOpacity="0.0" />
      </linearGradient>
    </defs>
    <path d={`M 0,28 ${points} L 100,28 Z`} fill={`url(#kpi-grad-${id})`} />
    <path
      d={`M 0,${points.split(' ')[0].split(',')[1]} ${points}`}
      fill="none"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CrisisSyncDashboard = ({ defaultTab = 'Overview' }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, login, logout, isAuthenticated } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const {
    hospitals = [],
    ambulances = [],
    incidents = [],
    recentlyUpdatedHospitalId
  } = useEmergencyData();

  const getInitialTab = () => {
    if (location.pathname === '/analytics') return 'Analytics';
    if (location.pathname === '/hospital') return 'Live Hospitals';
    if (location.pathname === '/ambulance') return 'Ambulances';
    if (location.pathname === '/command') return 'Crisis Command';
    return defaultTab || 'Overview';
  };

  const [activeNav, setActiveNav] = useState(getInitialTab);

  useEffect(() => {
    if (location.pathname === '/analytics') setActiveNav('Analytics');
    else if (location.pathname === '/hospital') setActiveNav('Live Hospitals');
    else if (location.pathname === '/ambulance') setActiveNav('Ambulances');
    else if (location.pathname === '/command') setActiveNav('Crisis Command');
    else if (location.pathname === '/' || location.pathname === '/overview') setActiveNav('Overview');
  }, [location.pathname]);

  const [selectedLocation, setSelectedLocation] = useState('Delhi NCR');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Modals state
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [hospitalToReserve, setHospitalToReserve] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const userRole = user?.role || 'USER';
  const isSuperAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(userRole);
  const isHospitalUser = ['HOSPITAL', 'HOSPITAL_ADMIN'].includes(userRole);
  const isParamedicUser = ['PARAMEDIC', 'HOSPITAL_STAFF'].includes(userRole);
  const isCitizenUser = !isSuperAdmin && !isHospitalUser && !isParamedicUser;

  const navMenuItems = isSuperAdmin
    ? [
        { name: 'Overview', icon: Home, title: 'Central Overview' },
        { name: 'Live Hospitals', icon: Building2, title: 'Live Hospital Beds' },
        { name: 'Hospital Management', icon: Activity, badge: 'ER', title: 'Hospital Management' },
        { name: 'Ambulances', icon: Ambulance, badge: 3, title: 'Ambulance Fleet' },
        { name: 'Crisis Command', icon: Shield, title: 'Crisis Command & Simulator' },
        { name: 'Alerts', icon: Bell, badge: 3, title: 'Emergency Alerts' },
        { name: 'Analytics', icon: TrendingUp, title: 'System Analytics' }
      ]
    : isHospitalUser
    ? [
        { name: 'Overview', icon: Home, title: 'Hospital ER Overview' },
        { name: 'Hospital Management', icon: Activity, badge: 'ER', title: 'Manage Beds & Seats' },
        { name: 'Live Hospitals', icon: Building2, title: 'Hospital Network' },
        { name: 'Alerts', icon: Bell, badge: 3, title: 'Emergency Alerts' }
      ]
    : isParamedicUser
    ? [
        { name: 'Overview', icon: Home, title: 'Fleet Overview' },
        { name: 'Ambulances', icon: Ambulance, badge: 3, title: 'Ambulance Dispatch HUD' },
        { name: 'Live Hospitals', icon: Building2, title: 'Nearest Hospitals' },
        { name: 'Alerts', icon: Bell, badge: 3, title: 'Emergency Alerts' }
      ]
    : [
        // CITIZEN USER: ONLY show how many beds are available, book seat, and book ambulance
        { name: 'Overview', icon: Home, title: 'Bed Availability & Booking' },
        { name: 'Live Hospitals', icon: Building2, title: 'Available Hospital Beds' },
        { name: 'Book Ambulance', icon: Ambulance, badge: 'SOS', title: 'Book an Ambulance' },
        { name: 'Alerts', icon: Bell, badge: 3, title: 'Emergency Alerts' }
      ];

  const handleNavClick = (itemName) => {
    if (itemName === 'Overview') {
      setActiveNav('Overview');
      navigate('/overview');
    } else if (itemName === 'Live Hospitals') {
      setActiveNav('Live Hospitals');
    } else if (itemName === 'Hospital Management') {
      navigate('/hospital');
    } else if (itemName === 'Crisis Command') {
      navigate('/command');
    } else if (itemName === 'Ambulances') {
      navigate('/ambulance');
    } else if (itemName === 'Book Ambulance') {
      setSosModalOpen(true);
    } else if (itemName === 'Analytics') {
      setActiveNav('Analytics');
      navigate('/analytics');
    } else if (itemName === 'Alerts') {
      setNotificationsOpen(true);
    }
  };

  const handleOpenReserveModal = (hosp) => {
    setHospitalToReserve(hosp);
    setReserveModalOpen(true);
  };

  const handleQuickAction = (action) => {
    if (action === 'nearest') {
      alert('Locating closest medical center with trauma & ventilator facilities: AIIMS Apex Trauma Center (12.6 km, 24 min).');
    } else if (action === 'ambulance') {
      handleNavClick('Ambulances');
    } else if (action === 'alerts') {
      handleNavClick('Alerts');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#030712] p-2 sm:p-4 lg:p-6 flex items-center justify-center relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] antialiased select-none text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Dynamic Luminous Aurora Mesh Orbs for High Aesthetic Transparency */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 blur-[130px] pointer-events-none animate-pulse duration-1000" />
      <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/20 blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-teal-500/12 dark:bg-teal-500/18 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-rose-500/10 dark:bg-rose-500/15 blur-[120px] pointer-events-none" />
      
      {/* Cyber Grid Texture Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-60" />

      {/* DASHBOARD OUTER CONTAINER (FLOATING DOCK + MAIN WINDOW) */}
      <div className="w-full max-w-[1720px] h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] flex items-stretch gap-3 lg:gap-4 relative z-10">
        
        {/* ======================================================== */}
        {/* FLOATING LEFT PILL DOCK (Ultra-Aesthetic Frosted Glass)  */}
        {/* ======================================================== */}
        <aside className="hidden lg:flex flex-col items-center justify-between w-16 xl:w-20 rounded-[34px] xl:rounded-[38px] bg-white/80 dark:bg-slate-950/50 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.2)] py-7 px-2 shrink-0 z-30 transition-all">
          
          {/* Top Brand Logo Icon */}
          <button
            onClick={() => handleNavClick('Overview')}
            title="CrisisSync Central Command"
            className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-blue-600 p-[1.5px] shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <div className="w-full h-full bg-white dark:bg-[#070D1A] rounded-[14px] flex items-center justify-center">
              <Radio className="w-5 h-5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
            </div>
          </button>

          {/* Center Navigation Icons Stack */}
          <nav className="flex flex-col items-center gap-3.5 my-auto">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.name;

              return (
                <div key={item.name} className="relative group">
                  <button
                    onClick={() => handleNavClick(item.name)}
                    className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 shadow-md dark:shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-400/40 backdrop-blur-md'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />

                    {/* Notification Badge */}
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-900 shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {/* Tooltip on hover */}
                  <div className="absolute left-full ml-3 px-2.5 py-1 rounded-xl bg-slate-900/90 text-white dark:bg-slate-900/90 backdrop-blur-md border border-white/10 text-xs font-semibold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {item.name}
                  </div>
                </div>
              );
            })}

            {/* Quick Action SOS Button inside Floating Dock */}
            <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 w-full flex justify-center">
              <button
                onClick={() => setSosModalOpen(true)}
                title="Emergency SOS Trigger"
                className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center shadow-lg shadow-rose-950/40 border border-rose-400/40 hover:scale-110 active:scale-95 transition-transform animate-pulse"
              >
                <AlertOctagon className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </nav>

          {/* Bottom Help Icon */}
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <button
              onClick={() => alert('CrisisSync Healthcare Cockpit v1.0.0 - Delhi NCR Central Command')}
              title="System Information"
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* MAIN APPLICATION CONTAINER (Ultra-Clear Cyber Glass)     */}
        {/* ======================================================== */}
        <div className="flex-1 rounded-[32px] lg:rounded-[40px] bg-white/80 dark:bg-slate-950/50 shadow-[0_25px_70px_rgba(0,0,0,0.08)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.65)] border border-slate-200/80 dark:border-white/10 flex flex-col overflow-hidden relative backdrop-blur-3xl transition-colors duration-300">
          
          {/* Subtle fluid wave watermark line vector in background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10 dark:opacity-20" preserveAspectRatio="none" viewBox="0 0 1200 800">
            <path d="M 0,200 C 300,120 400,320 700,220 C 1000,120 1100,280 1200,220" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="2.5" />
            <path d="M 0,450 C 250,380 450,560 750,440 C 1050,320 1150,520 1200,480" fill="none" stroke="rgba(99,102,241,0.3)" strokeWidth="2" />
          </svg>

          {/* ======================================================== */}
          {/* TOP HEADER BAR (Frosted Cyber Glass)                     */}
          {/* ======================================================== */}
          <header className="h-20 px-5 sm:px-8 flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.08] shrink-0 z-20 bg-white/70 dark:bg-slate-950/35 backdrop-blur-xl transition-colors duration-300">
            
            {/* Left Top: Brand Group (Logo, Location, Live Status) */}
            <div className="flex items-center gap-4 sm:gap-6 min-w-0">
              
              {/* Official CrisisSync Brand Logo */}
              <div className="flex items-center gap-3 sm:gap-3.5 shrink-0">
                
                {/* Radio Wave Icon Box with Cyan-Blue Gradient Border */}
                <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-blue-600 p-[1.5px] shadow-lg shadow-cyan-500/20 shrink-0">
                  <div className="w-full h-full bg-white dark:bg-[#070D1A] rounded-[14px] flex items-center justify-center">
                    <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                  </div>
                </div>

                {/* Brand Typography & Badge */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-['Outfit'] leading-none">
                      Crisis<span className="bg-gradient-to-r from-cyan-600 dark:from-cyan-400 via-teal-500 dark:via-teal-300 to-blue-600 dark:to-blue-400 bg-clip-text text-transparent">Sync</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[9px] sm:text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest inline-block shadow-sm">
                      PRO v2.6
                    </span>
                  </div>
                  <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                    Emergency Telemetry Sync
                  </span>
                </div>
              </div>

              {/* Location Pill Dropdown */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-indigo-400 transition-all shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#4E35CD]" />
                  <span>{selectedLocation}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
                </button>

                {locationDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-2xl border border-slate-200 dark:border-white/15 p-1.5 shadow-2xl z-50 bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl">
                    {['Delhi NCR', 'South Delhi', 'Gurugram', 'Noida', 'Faridabad'].map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          selectedLocation === loc
                            ? 'text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-50 dark:bg-cyan-500/20'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* LIVE Triage Radar Pill */}
              <div className="hidden xl:inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                <span className="font-bold text-[11px]">LIVE</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-300">• Real-time Bed Availability</span>
              </div>
            </div>

            {/* Right Top Bar: Role Action, Theme Toggle, Notifications, User Profile */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              
              {/* Citizen Quick Action: Book Ambulance */}
              {isCitizenUser && (
                <button
                  onClick={() => setSosModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 shadow-md shadow-rose-600/30 border border-rose-400/40 transition-all cursor-pointer animate-pulse"
                  title="Book an Ambulance"
                >
                  <Ambulance className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Book Ambulance</span>
                  <span className="sm:hidden">SOS</span>
                </button>
              )}

              {/* Hospital Staff Quick Action: Manage Seats */}
              {isHospitalUser && (
                <button
                  onClick={() => navigate('/hospital')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md border border-emerald-400/40 transition-all cursor-pointer"
                  title="Manage Hospital Seats & Beds"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Manage Seats</span>
                  <span className="sm:hidden">ER</span>
                </button>
              )}

              {/* Theme Toggle (Dark / Light) */}
              <button
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 backdrop-blur-md transition-all shadow-sm"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-cyan-600" />}
              </button>

              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  title="Notifications"
                  className="relative p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white backdrop-blur-md transition-all shadow-sm"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                    3
                  </span>
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 dark:border-white/15 p-3 shadow-2xl z-50 bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10 mb-2">
                      <span className="text-xs font-bold font-['Outfit'] text-slate-900 dark:text-white">Active Notifications</span>
                      <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold">3 New</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/20 font-medium">
                        Fortis Hospital ICU exceeded 90% threshold.
                      </div>
                      <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 font-medium">
                        Ambulance DL-4587 ETA revised: 18 min.
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 font-medium">
                        2 Ventilators opened at Medanta Center.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Pill & Dropdown / Sign In */}
              <div className="relative">
                {isAuthenticated && user ? (
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-white/80 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-indigo-400 transition-all cursor-pointer"
                  >
                    <img
                      src="/assets/ashutosh_avatar.jpg"
                      alt={user.name}
                      className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/20"
                    />
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-bold leading-tight text-slate-900 dark:text-white truncate max-w-[120px]">
                        {user.name}
                      </div>
                      <span className="text-[9px] text-[#4E35CD] dark:text-indigo-400 block leading-tight font-semibold">
                        {user.role === 'ADMIN' ? 'Command Admin' : user.role === 'HOSPITAL' ? 'ER Incharge' : 'Paramedic Lead'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#4E35CD] hover:bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                )}

                {/* Profile & Fast Role Switcher Dropdown */}
                {profileDropdownOpen && isAuthenticated && user && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 dark:border-white/15 p-3 shadow-2xl z-50 bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl">
                    <div className="pb-2.5 border-b border-slate-100 dark:border-white/10 mb-2.5">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
                        {user.role} Clearance
                      </span>
                    </div>

                    <div className="space-y-1 mb-2.5">
                      <p className="text-[10px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400 px-1">
                        1-Click Switch Account:
                      </p>
                      {DEMO_USERS.map((demo) => {
                        const isCurrent = user.email === demo.email;
                        return (
                          <button
                            key={demo.email}
                            onClick={async () => {
                              try {
                                const newUser = await login(demo.email, demo.password);
                                setProfileDropdownOpen(false);
                                const dest = getRoleDestination(newUser.role);
                                navigate(dest);
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                              isCurrent
                                ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-200 dark:border-cyan-500/30'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <div className="truncate">
                              <span className="block font-semibold truncate">{demo.name}</span>
                              <span className="text-[9px] text-slate-500 dark:text-slate-400">{demo.title}</span>
                            </div>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-white/10">
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full py-1.5 px-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* ======================================================== */}
          {/* MAIN SCROLLABLE CONTENT BODY                             */}
          {/* ======================================================== */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6 pb-24 lg:pb-8">
            
            {/* Dynamic View Switcher based on active tab */}
            {activeNav === 'Analytics' ? (
              <AnalyticsView
                onBack={() => {
                  handleNavClick('Overview');
                }}
              />
            ) : activeNav === 'Live Hospitals' ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[26px] bg-white/85 dark:bg-slate-900/45 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/40 dark:shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleNavClick('Overview')}
                      className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.05] hover:bg-cyan-50 dark:hover:bg-cyan-500/20 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-all border border-slate-200 dark:border-white/10 hover:border-cyan-400/40 shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black font-['Outfit'] text-slate-900 dark:text-white tracking-tight">
                        Live Delhi NCR Hospitals & Bed Availability
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Real-time emergency telemetry across Delhi trauma centers
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavClick('Crisis Command')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 border border-cyan-500/40 dark:border-cyan-400/40 shadow-md shadow-cyan-950/20 transition-all"
                  >
                    Command Telemetry
                  </button>
                </div>

                <HospitalTable
                  hospitals={hospitals}
                  onSelectHospital={(hosp) => setSelectedHospital(hosp)}
                  onAttachHospital={(hosp) => handleOpenReserveModal(hosp)}
                  selectedHospitalId={selectedHospital?.id}
                  recentlyUpdatedId={recentlyUpdatedHospitalId}
                />
              </div>
            ) : activeNav === 'Crisis Command' ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[26px] bg-white/85 dark:bg-slate-900/45 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/40 dark:shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleNavClick('Overview')}
                      className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.05] hover:bg-cyan-50 dark:hover:bg-cyan-500/20 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-all border border-slate-200 dark:border-white/10 hover:border-cyan-400/40 shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black font-['Outfit'] text-slate-900 dark:text-white tracking-tight">
                        Crisis Command & Casualty Surge Control
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Simulation protocol controls, regional telemetry, and active dispatches
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavClick('Analytics')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 dark:from-cyan-500/30 dark:to-indigo-500/30 dark:hover:from-cyan-500/40 border border-cyan-400/40 shadow-md transition-all"
                  >
                    View Analytics
                  </button>
                </div>

                <SimulationController />

                <HospitalTable
                  hospitals={hospitals}
                  onSelectHospital={(hosp) => setSelectedHospital(hosp)}
                  onAttachHospital={(hosp) => handleOpenReserveModal(hosp)}
                  selectedHospitalId={selectedHospital?.id}
                  recentlyUpdatedId={recentlyUpdatedHospitalId}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AmbulanceList ambulances={ambulances} />
                  <IncidentFeed incidents={incidents} />
                </div>
              </div>
            ) : activeNav === 'Ambulances' ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[26px] bg-white/85 dark:bg-slate-900/45 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/40 dark:shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleNavClick('Overview')}
                      className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.05] hover:bg-cyan-50 dark:hover:bg-cyan-500/20 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-all border border-slate-200 dark:border-white/10 hover:border-cyan-400/40 shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black font-['Outfit'] text-slate-900 dark:text-white tracking-tight">
                        Metropolitan Ambulance Fleet & Active Navigation
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Live GPS route tracking, hospital auto-attachment, and fleet coordinates
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSosModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 border border-rose-400/40 shadow-md shadow-rose-950/50 transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Dispatch Ambulance (SOS)</span>
                  </button>
                </div>

                <div className="rounded-[28px] overflow-hidden bg-white/80 dark:bg-slate-950/40 border border-slate-200/80 dark:border-white/10 shadow-xl backdrop-blur-2xl">
                  <GoogleMapView
                    selectedHospitalId={selectedHospital?.id}
                    onSelectHospital={(hosp) => setSelectedHospital(hosp)}
                    onReserveBed={handleOpenReserveModal}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AmbulanceList ambulances={ambulances} />
                  <IncidentFeed incidents={incidents} />
                </div>
              </div>
            ) : activeNav === 'Alerts' ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[26px] bg-white/85 dark:bg-slate-900/45 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/40 dark:shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleNavClick('Overview')}
                      className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.05] hover:bg-cyan-50 dark:hover:bg-cyan-500/20 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-all border border-slate-200 dark:border-white/10 hover:border-cyan-400/40 shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black font-['Outfit'] text-slate-900 dark:text-white tracking-tight">
                        Metropolitan Crisis Alerts & Incident Radar
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Real-time emergency broadcast feeds, triage warnings, and citywide telemetry
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSosModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 border border-rose-400/40 shadow-md shadow-rose-950/50 transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Dispatch Emergency SOS</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <IncidentFeed incidents={incidents} />
                  <AmbulanceList ambulances={ambulances} />
                </div>
              </div>
            ) : (
              /* ======================================================== */
              /* OVERVIEW: REAL CRISISSYNC COCKPIT WITH MODERN AESTHETIC   */
              /* ======================================================== */
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* LEFT / CENTER COLUMN (~65%) */}
                <div className="xl:col-span-7 2xl:col-span-8 space-y-6">
                                 {/* 1. About the Project Hero Showcase (Cyber-Glass Command Card) */}
                  {/* 1. Hero Showcase: Role-Tailored Interface */}
                  {isCitizenUser ? (
                    /* CITIZEN EMERGENCY PORTAL HERO & QUICK ACTIONS */
                    <div className="relative rounded-[28px] overflow-hidden p-6 sm:p-7 bg-gradient-to-br from-cyan-50/95 via-white/95 to-indigo-50/90 dark:from-cyan-950/40 dark:via-slate-900/50 dark:to-indigo-950/30 text-slate-900 dark:text-white shadow-xl dark:shadow-2xl shadow-slate-200/50 dark:shadow-black/40 border border-cyan-200/80 dark:border-cyan-500/30 backdrop-blur-2xl transition-all">
                      <div className="relative z-10 space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/15 backdrop-blur-md border border-cyan-400/40 text-cyan-700 dark:text-cyan-300">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
                            Live Patient Emergency Portal
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-500/15 backdrop-blur-md border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
                            Delhi NCR Real-Time Hospital Network
                          </span>
                        </div>

                        <div>
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-['Outfit'] tracking-tight text-slate-900 dark:text-white leading-tight">
                            CrisisSync • Live Hospital Bed Availability & Quick Booking
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1.5 max-w-2xl leading-relaxed">
                            Check available hospital beds across Delhi NCR trauma centers in real time. Reserve an emergency bed immediately or request an emergency ambulance dispatch to your location.
                          </p>
                        </div>

                        {/* 2 Primary Citizen Emergency Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                          <button
                            onClick={() => handleOpenReserveModal(hospitals[0] || { name: 'Apollo Emergency Trauma ER', distance: '4.2 km', eta: '12 min', ventilatorsAvailable: 8 })}
                            className="p-4 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/25 border border-cyan-400/40 flex items-center justify-between group transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                                <Bed className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                <div className="text-sm font-bold font-['Outfit']">Book a Hospital Bed / Seat</div>
                                <div className="text-[11px] text-cyan-100 font-medium">Instant 20-min bed reservation at trauma ER</div>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>

                          <button
                            onClick={() => setSosModalOpen(true)}
                            className="p-4 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/30 border border-rose-400/40 flex items-center justify-between group transition-all animate-pulse cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                                <Ambulance className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                <div className="text-sm font-bold font-['Outfit']">Book an Ambulance (SOS)</div>
                                <div className="text-[11px] text-rose-100 font-medium">Sub-50ms dispatch to your coordinates</div>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : isHospitalUser ? (
                    /* HOSPITAL ER MANAGEMENT HERO CARD */
                    <div className="relative rounded-[28px] overflow-hidden p-6 sm:p-7 bg-gradient-to-br from-emerald-50/95 via-white/95 to-teal-50/90 dark:from-emerald-950/40 dark:via-slate-900/50 dark:to-teal-950/30 text-slate-900 dark:text-white shadow-xl dark:shadow-2xl shadow-slate-200/50 dark:shadow-black/40 border border-emerald-200/80 dark:border-emerald-500/30 backdrop-blur-2xl transition-all">
                      <div className="relative z-10 space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 backdrop-blur-md border border-emerald-400/40 text-emerald-700 dark:text-emerald-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                            Hospital ER Management Cockpit
                          </span>
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-['Outfit'] tracking-tight text-slate-900 dark:text-white leading-tight">
                            Manage Hospital Beds & Available Seats
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1.5 max-w-2xl leading-relaxed">
                            Control and update your emergency trauma center capacity. Increment or decrement available ER beds, ICU seats, ventilators, and toggle emergency diversion status.
                          </p>
                        </div>
                        <div className="pt-2">
                          <button
                            onClick={() => navigate('/hospital')}
                            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 border border-emerald-400/40 flex items-center gap-2 transition-all cursor-pointer"
                          >
                            <Activity className="w-4 h-4" />
                            <span>Open Bed & Seat Capacity Manager</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Existing Admin Hero Card */
                    <div className="relative rounded-[28px] overflow-hidden p-6 sm:p-7 bg-gradient-to-br from-indigo-50/95 via-white/90 to-cyan-50/90 dark:from-indigo-950/40 dark:via-slate-900/50 dark:to-cyan-950/30 text-slate-900 dark:text-white shadow-xl dark:shadow-2xl shadow-slate-200/50 dark:shadow-black/40 border border-indigo-200/80 dark:border-cyan-500/25 backdrop-blur-2xl transition-all">
                      {/* Abstract fluid wave graphics in background */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 dark:opacity-25" viewBox="0 0 600 240" preserveAspectRatio="none">
                        <path d="M 0,100 C 150,50 300,160 450,110 C 520,80 580,120 600,100 L 600,240 L 0,240 Z" fill="#06B6D4" />
                        <path d="M 0,140 C 180,90 320,190 480,130 C 540,110 570,140 600,130 L 600,240 L 0,240 Z" fill="#6366F1" />
                      </svg>

                      <div className="relative z-10 space-y-4">
                        {/* Top Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/15 backdrop-blur-md border border-cyan-400/40 text-cyan-700 dark:text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
                            CrisisSync Core Architecture
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-white/10 backdrop-blur-md border border-indigo-200 dark:border-white/10 text-indigo-700 dark:text-indigo-200">
                            Delhi NCR Metropolitan Network
                          </span>
                        </div>

                        {/* Project Headline & Mission */}
                        <div>
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-['Outfit'] tracking-tight text-slate-900 dark:text-white leading-tight">
                            Real-Time Emergency Resource Allocator
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1.5 max-w-2xl leading-relaxed">
                            CrisisSync bridges emergency responders, trauma hospitals, and command centers with sub-second synchronization. By automating bed reservations, patient triage categories, and ambulance route coordination, we ensure critical patients reach the right facility within the golden hour.
                          </p>
                        </div>

                        {/* 3 Core Capability Cards (Frosted Cyber Glass with Glowing Borders) */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                          {/* Glass Card 1: Electric Teal */}
                          <div className="p-4 rounded-2xl bg-teal-50/90 dark:bg-teal-500/10 hover:bg-teal-100/80 dark:hover:bg-teal-500/15 backdrop-blur-xl border border-teal-200/90 dark:border-teal-400/30 shadow-md dark:shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300">
                            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-300 border border-teal-400/30 flex items-center justify-center mb-2 shadow-sm">
                              <Activity className="w-4 h-4" />
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white font-['Outfit']">Live Bed Telemetry</h4>
                            <p className="text-[11px] text-teal-900/80 dark:text-teal-100/80 mt-1 leading-snug">
                              Real-time tracking of ICU, ventilator, and oxygen beds with instant 20-min triage holds.
                            </p>
                          </div>

                          {/* Glass Card 2: Royal Blue & Sky */}
                          <div className="p-4 rounded-2xl bg-blue-50/90 dark:bg-blue-500/10 hover:bg-blue-100/80 dark:hover:bg-blue-500/15 backdrop-blur-xl border border-blue-200/90 dark:border-blue-400/30 shadow-md dark:shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300">
                            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-sky-600 dark:text-sky-300 border border-blue-400/30 flex items-center justify-center mb-2 shadow-sm">
                              <Ambulance className="w-4 h-4" />
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white font-['Outfit']">Dynamic Fleet Dispatch</h4>
                            <p className="text-[11px] text-sky-900/80 dark:text-sky-100/80 mt-1 leading-snug">
                              GPS route calculation and automated hospital handoff based on traffic and patient acuity.
                            </p>
                          </div>

                          {/* Glass Card 3: Neon Fuchsia & Rose */}
                          <div className="p-4 rounded-2xl bg-purple-50/90 dark:bg-purple-500/10 hover:bg-purple-100/80 dark:hover:bg-purple-500/15 backdrop-blur-xl border border-purple-200/90 dark:border-purple-400/30 shadow-md dark:shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300">
                            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-400/30 flex items-center justify-center mb-2 shadow-sm">
                              <Shield className="w-4 h-4" />
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white font-['Outfit']">Casualty Surge Control</h4>
                            <p className="text-[11px] text-purple-900/80 dark:text-purple-100/80 mt-1 leading-snug">
                              Citywide algorithmic load-balancing to prevent ER saturation during mass emergency incidents.
                            </p>
                          </div>
                        </div>

                        {/* Quick Action Navigation Buttons */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-2">
                          <button
                            onClick={() => handleNavClick('Live Hospitals')}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-white bg-white/90 dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-200/80 dark:border-white/20 hover:border-cyan-400/40 backdrop-blur-md shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Building2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                            <span>View Hospital Matrix</span>
                          </button>

                          <button
                            onClick={() => handleNavClick('Ambulances')}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold text-cyan-800 dark:text-white bg-cyan-50 dark:bg-cyan-500/15 hover:bg-cyan-100 dark:hover:bg-cyan-500/25 border border-cyan-200 dark:border-cyan-400/30 backdrop-blur-md shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Ambulance className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-300" />
                            <span>Track Fleet on Live Map</span>
                          </button>

                          <button
                            onClick={() => setSosModalOpen(true)}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-600 border border-rose-400/40 shadow-lg shadow-rose-950/40 transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Trigger SOS</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Mass Crisis Command Center • Live (5 Transparent Frosted Glass KPI Cards) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-3 sm:gap-3.5">
                    
                    {/* Card 1: Available Beds (Frosted Emerald Jade Glass) */}
                    <div className="min-w-0 overflow-hidden p-3.5 sm:p-4 rounded-[22px] sm:rounded-[24px] bg-white/90 dark:bg-emerald-950/20 backdrop-blur-2xl border border-emerald-200/90 dark:border-emerald-500/30 hover:border-emerald-400/70 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(16,185,129,0.1)] hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between cursor-pointer group">
                      <div className="flex items-center justify-between gap-1.5 min-w-0">
                        <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider truncate" title="Available Beds">
                          Available Beds
                        </span>
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-400/40 shadow-sm">
                          Live
                        </span>
                      </div>
                      <span className="text-xl sm:text-2xl 2xl:text-3xl font-black font-['Outfit'] text-slate-900 dark:text-white mt-1.5 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                        178
                      </span>
                      <div className="mt-1">
                        <MiniSparkline
                          id="kpi-1"
                          points="L 15,18 L 30,10 L 50,16 L 70,8 L 85,14 L 100,4"
                          color="#10B981"
                        />
                      </div>
                    </div>

                    {/* Card 2: Occupied (Frosted Electric Blue Glass) */}
                    <div className="min-w-0 overflow-hidden p-3.5 sm:p-4 rounded-[22px] sm:rounded-[24px] bg-white/90 dark:bg-blue-950/20 backdrop-blur-2xl border border-blue-200/90 dark:border-blue-500/30 hover:border-blue-400/70 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(59,130,246,0.1)] hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between cursor-pointer group">
                      <div className="flex items-center justify-between gap-1.5 min-w-0">
                        <span className="text-[10px] sm:text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider truncate" title="Occupied">
                          Occupied
                        </span>
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-blue-500/15 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-400/40 shadow-sm">
                          +12%
                        </span>
                      </div>
                      <span className="text-xl sm:text-2xl 2xl:text-3xl font-black font-['Outfit'] text-slate-900 dark:text-white mt-1.5 truncate group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                        68
                      </span>
                      <div className="mt-1">
                        <MiniSparkline
                          id="kpi-2"
                          points="L 15,22 L 30,16 L 50,20 L 70,12 L 85,18 L 100,8"
                          color="#3B82F6"
                        />
                      </div>
                    </div>

                    {/* Card 3: Ventilators Available (Frosted Neon Amethyst Glass) */}
                    <div className="min-w-0 overflow-hidden p-3.5 sm:p-4 rounded-[22px] sm:rounded-[24px] bg-white/90 dark:bg-purple-950/20 backdrop-blur-2xl border border-purple-200/90 dark:border-purple-500/30 hover:border-purple-400/70 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(168,85,247,0.1)] hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between cursor-pointer group">
                      <div className="flex items-center justify-between gap-1.5 min-w-0">
                        <span className="text-[10px] sm:text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider truncate" title="Ventilators Available">
                          Ventilators
                        </span>
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-purple-500/15 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-400/40 shadow-sm">
                          Crit.
                        </span>
                      </div>
                      <span className="text-xl sm:text-2xl 2xl:text-3xl font-black font-['Outfit'] text-slate-900 dark:text-white mt-1.5 truncate group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                        7
                      </span>
                      <div className="mt-1">
                        <MiniSparkline
                          id="kpi-3"
                          points="L 15,20 L 30,14 L 50,18 L 70,10 L 85,15 L 100,5"
                          color="#A855F7"
                        />
                      </div>
                    </div>

                    {/* Card 4: Surge Level (Frosted Hot Ruby Crimson Glass) */}
                    <div className="min-w-0 overflow-hidden p-3.5 sm:p-4 rounded-[22px] sm:rounded-[24px] bg-white/90 dark:bg-rose-950/20 backdrop-blur-2xl border border-rose-200/90 dark:border-rose-500/30 hover:border-rose-400/70 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(244,63,94,0.1)] hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between cursor-pointer group">
                      <div className="flex items-center justify-between gap-1.5 min-w-0">
                        <span className="text-[10px] sm:text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider truncate" title="Surge Level">
                          Surge Level
                        </span>
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-rose-500/15 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-400/40 shadow-sm">
                          Active
                        </span>
                      </div>
                      <span className="text-xl sm:text-2xl 2xl:text-3xl font-black font-['Outfit'] text-rose-600 dark:text-rose-400 mt-1.5 truncate">
                        High
                      </span>
                      <div className="mt-1">
                        <MiniSparkline
                          id="kpi-4"
                          points="L 15,22 L 30,18 L 50,14 L 70,12 L 85,8 L 100,3"
                          color="#F43F5E"
                        />
                      </div>
                    </div>

                    {/* Card 5: Projected Capacity (Frosted Sunset Gold Glass) */}
                    <div className="col-span-2 sm:col-span-1 xl:col-span-1 2xl:col-span-1 min-w-0 overflow-hidden p-3.5 sm:p-4 rounded-[22px] sm:rounded-[24px] bg-white/90 dark:bg-amber-950/20 backdrop-blur-2xl border border-amber-200/90 dark:border-amber-500/30 hover:border-amber-400/70 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(245,158,11,0.1)] hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between cursor-pointer group">
                      <div className="flex items-center justify-between gap-1.5 min-w-0">
                        <span className="text-[10px] sm:text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider truncate" title="Projected Capacity">
                          Capacity
                        </span>
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-400/40 shadow-sm">
                          68%
                        </span>
                      </div>
                      <span className="text-xl sm:text-2xl 2xl:text-3xl font-black font-['Outfit'] text-slate-900 dark:text-white mt-1.5 truncate group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                        68%
                      </span>
                      <div className="mt-1">
                        <MiniSparkline
                          id="kpi-5"
                          points="L 15,16 L 30,12 L 50,15 L 70,10 L 85,12 L 100,5"
                          color="#F59E0B"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Dynamic Section: Citizen Direct Seat Booking & Hospital Bed Availability OR Admin Analytic Trend Charts */}
                  {isCitizenUser ? (
                    /* CITIZEN AVAILABLE BEDS LIST WITH DIRECT BOOKING */
                    <div className="rounded-[28px] p-5 sm:p-6 bg-white/85 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/40 dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-white/[0.08]">
                        <div>
                          <h3 className="text-base sm:text-lg font-black font-['Outfit'] text-slate-900 dark:text-white flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                            <span>CrisisSync Hospital Bed Availability & Direct Seat Booking</span>
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Real-time available beds. Select any hospital below to reserve your seat/bed or call an ambulance
                          </p>
                        </div>
                        <button
                          onClick={() => setSosModalOpen(true)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                        >
                          <Ambulance className="w-3.5 h-3.5" />
                          <span>Book Ambulance</span>
                        </button>
                      </div>

                      {/* Hospital Cards List */}
                      <div className="space-y-3">
                        {hospitals.map((hosp) => {
                          const erAvailable = hosp.resources?.emergencyBedsAvailable ?? 18;
                          const erTotal = hosp.resources?.emergencyBedsTotal ?? 30;
                          const icuAvailable = hosp.resources?.icuBedsAvailable ?? 6;
                          const oxygenAvailable = hosp.resources?.oxygenBedsAvailable ?? 12;
                          const isAccepting = hosp.emergencyStatus === 'ACCEPTING';
                          const isFull = hosp.emergencyStatus === 'FULL' || erAvailable === 0;

                          return (
                            <div
                              key={hosp.id}
                              className="p-4 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/[0.05] hover:border-cyan-400/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                            >
                              <div className="space-y-1.5 min-w-0">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                    {hosp.name}
                                  </h4>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                      isFull
                                        ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-400/30'
                                        : isAccepting
                                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/30'
                                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/30'
                                    }`}
                                  >
                                    {isFull ? 'Seats Full' : isAccepting ? 'Accepting Patients' : hosp.emergencyStatus}
                                  </span>
                                  <span className="text-[11px] text-slate-500 font-mono">
                                    {hosp.distance || '5.2 km'} • {hosp.eta || '14 min'}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                  {hosp.address}
                                </p>

                                {/* Exact Seat / Bed Counters */}
                                <div className="flex items-center gap-2 sm:gap-4 flex-wrap pt-1 text-xs font-semibold">
                                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20">
                                    <Bed className="w-3.5 h-3.5" />
                                    <span><strong>{erAvailable}</strong>/{erTotal} ER Beds</span>
                                  </span>
                                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/20">
                                    <Activity className="w-3.5 h-3.5" />
                                    <span><strong>{icuAvailable}</strong> ICU Beds</span>
                                  </span>
                                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20">
                                    <Wind className="w-3.5 h-3.5" />
                                    <span><strong>{oxygenAvailable}</strong> Oxygen Beds</span>
                                  </span>
                                </div>
                              </div>

                              {/* Direct Booking Actions */}
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => handleOpenReserveModal(hosp)}
                                  disabled={isFull}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
                                    isFull
                                      ? 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed'
                                      : 'bg-[#4E35CD] hover:bg-indigo-600 text-white shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]'
                                  }`}
                                >
                                  <Bed className="w-3.5 h-3.5" />
                                  <span>{isFull ? 'Seats Full' : 'Book Seat / Bed'}</span>
                                </button>

                                <button
                                  onClick={() => setSosModalOpen(true)}
                                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                                  title="Request Ambulance to this Hospital"
                                >
                                  <Ambulance className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Ambulance</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* 3. Analytic Trend Charts for Admin */
                    <TrendCharts isDark={isDark} />
                  )}
                </div>

                {/* RIGHT SIDEBAR COLUMN (~35%) */}
                <div className="xl:col-span-5 2xl:col-span-4">
                  <RightPanel
                    onSelectHospital={(hosp) => setSelectedHospital(hosp)}
                    onOpenPatientModal={() => setPatientModalOpen(true)}
                    onReserveHospital={handleOpenReserveModal}
                    onQuickAction={handleQuickAction}
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR                             */}
      {/* ======================================================== */}
      <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden h-16 border-t flex items-center justify-around px-2 bg-white/95 dark:bg-[#090F1C]/95 border-slate-200 dark:border-white/[0.08] backdrop-blur-xl shadow-lg">
        <button
          onClick={() => handleNavClick('Overview')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeNav === 'Overview' ? 'text-[#4E35CD]' : 'text-slate-400'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => handleNavClick('Live Hospitals')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeNav === 'Live Hospitals' ? 'text-[#4E35CD]' : 'text-slate-400'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Hospitals</span>
        </button>

        {/* FLOATING SOS BUTTON */}
        <div className="relative -top-4">
          <button
            onClick={() => setSosModalOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 text-white flex flex-col items-center justify-center shadow-xl shadow-rose-600/40 border-4 border-[#EEF2F6] dark:border-slate-800 hover:scale-105 active:scale-95 transition-transform"
          >
            <Plus className="w-6 h-6 stroke-[3.5]" />
            <span className="text-[9px] font-black -mt-1 tracking-wider uppercase">SOS</span>
          </button>
        </div>

        <button
          onClick={() => handleNavClick('Alerts')}
          className="relative flex flex-col items-center gap-1 text-[10px] font-semibold text-slate-400"
        >
          <div className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white">
              3
            </span>
          </div>
          <span>Alerts</span>
        </button>

        <button
          onClick={() => {
            if (isAuthenticated && user) {
              setProfileDropdownOpen(true);
            } else {
              navigate('/login');
            }
          }}
          className="flex flex-col items-center gap-1 text-[10px] font-semibold text-slate-400"
        >
          <User className="w-4 h-4" />
          <span>{isAuthenticated && user ? user.name.split(' ')[0] : 'Sign In'}</span>
        </button>
      </nav>

      {/* ======================================================== */}
      {/* INTERACTIVE MODALS                                       */}
      {/* ======================================================== */}
      <SosModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        onDispatch={(details) => {
          console.log('Dispatched SOS:', details);
        }}
      />

      <PatientDetailsModal
        isOpen={patientModalOpen}
        onClose={() => setPatientModalOpen(false)}
        onActionClick={(action) => {
          if (action === 'route') handleNavClick('Ambulances');
        }}
      />

      <ReserveBedModal
        isOpen={reserveModalOpen}
        hospital={hospitalToReserve}
        onClose={() => setReserveModalOpen(false)}
        onConfirm={(hosp) => {
          console.log('Confirmed reservation for:', hosp);
        }}
      />
    </div>
  );
};

export default CrisisSyncDashboard;
