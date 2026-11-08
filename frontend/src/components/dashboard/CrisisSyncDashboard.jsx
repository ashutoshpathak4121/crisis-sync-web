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

// Mini Sparkline Wave Component for the 5 KPI Cards styled with clean operational aesthetics
const MiniSparkline = ({ points, color = '#2563EB', id }) => (
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] p-2 sm:p-4 lg:p-6 flex justify-center relative font-['Plus_Jakarta_Sans',sans-serif] antialiased text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* DASHBOARD OUTER CONTAINER */}
      <div className="w-full max-w-7xl flex items-start gap-3 lg:gap-4 relative z-10">
        
        {/* ======================================================== */}
        {/* LEFT DOCK (Solid Surface, High Contrast, Compact Sticky) */}
        {/* ======================================================== */}
        <aside className="hidden lg:flex flex-col items-center w-16 xl:w-20 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm py-5 px-2 shrink-0 z-30 sticky top-4 lg:top-6 self-start gap-3.5 transition-colors">
          
          {/* Top Brand Logo Icon */}
          <button
            onClick={() => handleNavClick('Overview')}
            title="CrisisSync Central Command"
            aria-label="CrisisSync Central Command"
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Radio className="w-5 h-5 text-white" />
          </button>

          <div className="w-7 border-t border-slate-200 dark:border-slate-800" />

          {/* Center Navigation Icons Stack */}
          <nav className="flex flex-col items-center gap-2.5 w-full">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.name;

              return (
                <div key={item.name} className="relative group">
                  <button
                    onClick={() => handleNavClick(item.name)}
                    aria-label={item.name}
                    className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />

                    {/* Notification Badge */}
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {/* Tooltip on hover */}
                  <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-slate-900 text-white dark:bg-slate-800 border border-slate-700 text-xs font-medium whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {item.name}
                  </div>
                </div>
              );
            })}

            {/* Quick Action SOS Button inside Dock */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 w-full flex justify-center">
              <button
                onClick={() => setSosModalOpen(true)}
                title="Emergency SOS Trigger"
                aria-label="Emergency SOS Trigger"
                className="w-10 h-10 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-sm active:scale-95 transition-colors"
              >
                <AlertOctagon className="w-5 h-5" />
              </button>
            </div>
          </nav>

          <div className="w-7 border-t border-slate-200 dark:border-slate-800" />

          {/* Bottom Help Icon */}
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <button
              onClick={() => alert('CrisisSync Healthcare Cockpit v1.0.0 - Delhi NCR Central Command')}
              title="System Information"
              aria-label="System Information"
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* MAIN APPLICATION CONTAINER (Solid Opaque Surface)        */}
        {/* ======================================================== */}
        <div className="flex-1 rounded-xl bg-white dark:bg-[#111827] shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden relative transition-colors duration-200">

          {/* ======================================================== */}
          {/* TOP HEADER BAR                                           */}
          {/* ======================================================== */}
          <header className="h-16 px-5 sm:px-7 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 z-20 bg-white dark:bg-[#111827] transition-colors duration-200">
            
            {/* Left Top: Brand Group (Logo, Location, Live Status) */}
            <div className="flex items-center gap-4 sm:gap-6 min-w-0">
              
              {/* Official CrisisSync Brand Logo */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white shadow-sm shrink-0">
                  <Radio className="w-5 h-5 text-white" />
                </div>

                {/* Brand Typography */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                      Crisis<span className="text-blue-600 dark:text-blue-400">Sync</span>
                    </span>
                  </div>
                  <span className="block text-xs font-mono uppercase tracking-wide text-slate-500 dark:text-slate-400 mt-0.5">
                    Emergency Telemetry
                  </span>
                </div>
              </div>

              {/* Location Pill Dropdown */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 transition-colors shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{selectedLocation}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
                </button>

                {locationDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-700 p-1.5 shadow-lg z-50 bg-white dark:bg-slate-800">
                    {['Delhi NCR', 'South Delhi', 'Gurugram', 'Noida', 'Faridabad'].map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          selectedLocation === loc
                            ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/50'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* LIVE Triage Radar Pill */}
              <div className="hidden xl:inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold">LIVE</span>
                <span className="text-slate-600 dark:text-slate-300">• Real-Time Triage</span>
              </div>
            </div>

            {/* Right Top Bar: Role Action, Theme Toggle, Notifications, User Profile */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              
              {/* Citizen Quick Action: Book Ambulance */}
              {isCitizenUser && (
                <button
                  onClick={() => setSosModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors cursor-pointer"
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors cursor-pointer"
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
                title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                aria-label="Toggle visual theme"
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  title="Notifications"
                  aria-label="Notifications"
                  className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                    3
                  </span>
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-700 p-3 shadow-lg z-50 bg-white dark:bg-[#1E293B]">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">Active Notifications</span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">3 New</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/60 font-medium">
                        Fortis Hospital ICU exceeded 90% threshold.
                      </div>
                      <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 font-medium">
                        Ambulance DL-4587 ETA revised: 18 min.
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 font-medium">
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
                    className="flex items-center gap-2 p-1 pr-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-400 transition-colors cursor-pointer"
                  >
                    <img
                      src="/assets/ashutosh_avatar.jpg"
                      alt={user.name}
                      className="w-7 h-7 rounded-md object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                    />
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-bold leading-tight text-slate-900 dark:text-white truncate max-w-[120px]">
                        {user.name}
                      </div>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 block leading-tight font-semibold">
                        {user.role === 'ADMIN' ? 'Command Admin' : user.role === 'HOSPITAL' ? 'ER Incharge' : 'Paramedic Lead'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                )}

                {/* Profile & Fast Role Switcher Dropdown */}
                {profileDropdownOpen && isAuthenticated && user && (
                  <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 dark:border-slate-700 p-3 shadow-lg z-50 bg-white dark:bg-[#1E293B]">
                    <div className="pb-2.5 border-b border-slate-100 dark:border-slate-800 mb-2.5">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                        {user.role} Clearance
                      </span>
                    </div>

                    <div className="space-y-1 mb-2.5">
                      <p className="text-xs font-mono uppercase font-semibold text-slate-500 dark:text-slate-400 px-1">
                        Switch Demo Account:
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
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                              isCurrent
                                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800/80'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                            }`}
                          >
                            <div className="truncate">
                              <span className="block font-semibold truncate">{demo.name}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">{demo.title}</span>
                            </div>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleNavClick('Overview')}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                      aria-label="Back to overview"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                        Live Delhi NCR Hospitals & Bed Availability
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Real-time emergency telemetry across Delhi trauma centers
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavClick('Crisis Command')}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleNavClick('Overview')}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                      aria-label="Back to overview"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                        Crisis Command & Casualty Surge Control
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Simulation protocol controls, regional telemetry, and active dispatches
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavClick('Analytics')}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleNavClick('Overview')}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                      aria-label="Back to overview"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                        Metropolitan Ambulance Fleet & Active Navigation
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Live GPS route tracking, hospital auto-attachment, and fleet coordinates
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSosModalOpen(true)}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Dispatch Ambulance (SOS)</span>
                  </button>
                </div>

                <div className="rounded-xl overflow-hidden bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleNavClick('Overview')}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                      aria-label="Back to overview"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                        Metropolitan Crisis Alerts & Incident Radar
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Real-time emergency broadcast feeds, triage warnings, and citywide telemetry
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSosModalOpen(true)}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
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
                    <div className="relative rounded-xl overflow-hidden p-5 sm:p-6 bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                      <div className="relative z-10 space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-800 dark:text-blue-300">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            Live Patient Emergency Portal
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                            Delhi NCR Real-Time Hospital Network
                          </span>
                        </div>

                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                            Live Hospital Bed Availability & Quick Booking
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal mt-1 max-w-2xl leading-relaxed">
                            Check available hospital beds across Delhi NCR trauma centers in real time. Reserve an emergency bed immediately or request an emergency ambulance dispatch to your location.
                          </p>
                        </div>

                        {/* 2 Primary Citizen Emergency Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <button
                            onClick={() => handleOpenReserveModal(hospitals[0] || { name: 'Apollo Emergency Trauma ER', distance: '4.2 km', eta: '12 min', ventilatorsAvailable: 8 })}
                            className="p-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center justify-between group transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-md bg-white/20 flex items-center justify-center text-white">
                                <Bed className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                <div className="text-xs font-bold">Book a Hospital Bed / Seat</div>
                                <div className="text-xs text-blue-100 font-normal">Instant 20-min bed reservation at trauma ER</div>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </button>

                          <button
                            onClick={() => setSosModalOpen(true)}
                            className="p-3.5 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center justify-between group transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-md bg-white/20 flex items-center justify-center text-white">
                                <Ambulance className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                <div className="text-xs font-bold">Book an Ambulance (SOS)</div>
                                <div className="text-xs text-red-100 font-normal">Real-time dispatch to your coordinates</div>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : isHospitalUser ? (
                    /* HOSPITAL ER MANAGEMENT HERO CARD */
                    <div className="relative rounded-xl overflow-hidden p-5 sm:p-6 bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                      <div className="relative z-10 space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Hospital ER Management Cockpit
                          </span>
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                            Manage Hospital Beds & Available Seats
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal mt-1 max-w-2xl leading-relaxed">
                            Control and update your emergency trauma center capacity. Increment or decrement available ER beds, ICU seats, ventilators, and toggle emergency diversion status.
                          </p>
                        </div>
                        <div className="pt-1">
                          <button
                            onClick={() => navigate('/hospital')}
                            className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Activity className="w-4 h-4" />
                            <span>Open Bed & Seat Capacity Manager</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Admin Hero Card */
                    <div className="relative rounded-xl overflow-hidden p-5 sm:p-6 bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                      <div className="relative z-10 space-y-4">
                        {/* Top Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-800 dark:text-blue-300">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            CrisisSync Telemetry Architecture
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                            Delhi NCR Metropolitan Network
                          </span>
                        </div>

                        {/* Project Headline & Mission */}
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                            Real-Time Emergency Resource Allocator
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal mt-1 max-w-2xl leading-relaxed">
                            CrisisSync bridges emergency responders, trauma hospitals, and command centers with sub-second synchronization. By automating bed reservations, patient triage categories, and ambulance route coordination, critical patients reach the right facility within the golden hour.
                          </p>
                        </div>

                        {/* 3 Core Capability Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="w-7 h-7 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center mb-2 shadow-sm">
                              <Activity className="w-4 h-4" />
                            </div>
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Live Bed Telemetry</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                              Real-time tracking of ICU, ventilator, and oxygen beds with instant triage holds.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="w-7 h-7 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center mb-2 shadow-sm">
                              <Ambulance className="w-4 h-4" />
                            </div>
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Dynamic Fleet Dispatch</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                              GPS route calculation and automated hospital handoff based on traffic and patient acuity.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="w-7 h-7 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center mb-2 shadow-sm">
                              <Shield className="w-4 h-4" />
                            </div>
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Casualty Surge Control</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                              Citywide algorithmic load-balancing to prevent ER saturation during mass emergencies.
                            </p>
                          </div>
                        </div>

                        {/* Quick Action Navigation Buttons */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            onClick={() => handleNavClick('Live Hospitals')}
                            className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span>View Hospital Matrix</span>
                          </button>

                          <button
                            onClick={() => handleNavClick('Ambulances')}
                            className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Ambulance className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span>Track Fleet on Live Map</span>
                          </button>

                          <button
                            onClick={() => setSosModalOpen(true)}
                            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 border border-red-700 shadow-sm transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Trigger SOS</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Crisis Command Telemetry KPIs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-3.5">
                    
                    {/* Card 1: Available Beds */}
                    <div className="min-w-0 p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col justify-between transition-colors">
                      <div className="flex items-center justify-between gap-1.5 min-w-0">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                          Available Beds
                        </span>
                        <span className="shrink-0 px-1.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                          Live
                        </span>
                      </div>
                      <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2 truncate">
                        178
                      </span>
                      <div className="mt-1">
                        <MiniSparkline
                          id="kpi-1"
                          points="L 15,18 L 30,10 L 50,16 L 70,8 L 85,14 L 100,4"
                          color="#059669"
                        />
                      </div>
                    </div>

                    {/* Card 2: Occupied */}
                    <div className="min-w-0 p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col justify-between transition-colors">
                      <div className="flex items-center justify-between gap-1.5 min-w-0">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                          Occupied
                        </span>
                        <span className="shrink-0 px-1.5 py-0.5 rounded text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
                          +12%
                        </span>
                      </div>
                      <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white mt-2 truncate">
                        68
                      </span>
                      <div className="mt-1">
                        <MiniSparkline
                          id="kpi-2"
                          points="L 15,22 L 30,16 L 50,20 L 70,12 L 85,18 L 100,8"
                          color="#2563EB"
                        />
                      </div>
                    </div>

                    {/* Card 3: Ventilators Available */}
                    <div className="min-w-0 p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col justify-between transition-colors">
                      <div className="flex items-center justify-between gap-1.5 min-w-0">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                          Ventilators
                        </span>
                        <span className="shrink-0 px-1.5 py-0.5 rounded text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                          Crit.
                        </span>
                      </div>
                      <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white mt-2 truncate">
                        7
                      </span>
                      <div className="mt-1">
                        <MiniSparkline
                          id="kpi-3"
                          points="L 15,20 L 30,14 L 50,18 L 70,10 L 85,15 L 100,5"
                          color="#D97706"
                        />
                      </div>
                    </div>

                    {/* Card 4: Surge Level */}
                    <div className="min-w-0 p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col justify-between transition-colors">
                      <div className="flex items-center justify-between gap-1.5 min-w-0">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                          Surge Level
                        </span>
                        <span className="shrink-0 px-1.5 py-0.5 rounded text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800/60">
                          Active
                        </span>
                      </div>
                      <span className="text-2xl sm:text-3xl font-bold font-mono text-red-600 dark:text-red-400 mt-2 truncate">
                        High
                      </span>
                      <div className="mt-1">
                        <MiniSparkline
                          id="kpi-4"
                          points="L 15,22 L 30,18 L 50,14 L 70,12 L 85,8 L 100,3"
                          color="#DC2626"
                        />
                      </div>
                    </div>

                    {/* Card 5: Projected Capacity */}
                    <div className="col-span-2 sm:col-span-1 xl:col-span-1 2xl:col-span-1 min-w-0 p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col justify-between transition-colors">
                      <div className="flex items-center justify-between gap-1.5 min-w-0">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                          Capacity
                        </span>
                        <span className="shrink-0 px-1.5 py-0.5 rounded text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                          68%
                        </span>
                      </div>
                      <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-2 truncate">
                        68%
                      </span>
                      <div className="mt-1">
                        <MiniSparkline
                          id="kpi-5"
                          points="L 15,16 L 30,12 L 50,15 L 70,10 L 85,12 L 100,5"
                          color="#D97706"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Dynamic Section: Citizen Direct Seat Booking & Hospital Bed Availability OR Admin Analytic Trend Charts */}
                  {isCitizenUser ? (
                    /* CITIZEN AVAILABLE BEDS LIST WITH DIRECT BOOKING */
                    <div className="rounded-xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <span>Hospital Bed Availability & Direct Booking</span>
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Real-time available beds. Select any facility below to reserve your bed or request ambulance dispatch.
                          </p>
                        </div>
                        <button
                          onClick={() => setSosModalOpen(true)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors"
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
                              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                              <div className="space-y-1.5 min-w-0">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                    {hosp.name}
                                  </h4>
                                  <span
                                    className={`px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide border ${
                                      isFull
                                        ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
                                        : isAccepting
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
                                    }`}
                                  >
                                    {isFull ? 'Seats Full' : isAccepting ? 'Accepting Patients' : hosp.emergencyStatus}
                                  </span>
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                    {hosp.distance || '5.2 km'} • {hosp.eta || '14 min'}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                  {hosp.address}
                                </p>

                                {/* Exact Seat / Bed Counters */}
                                <div className="flex items-center gap-2 sm:gap-3 flex-wrap pt-1 text-xs font-medium">
                                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    <Bed className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                    <span><strong className="font-semibold text-slate-900 dark:text-white font-mono">{erAvailable}</strong>/{erTotal} ER Beds</span>
                                  </span>
                                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                    <span><strong className="font-semibold text-slate-900 dark:text-white font-mono">{icuAvailable}</strong> ICU Beds</span>
                                  </span>
                                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    <Wind className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                    <span><strong className="font-semibold text-slate-900 dark:text-white font-mono">{oxygenAvailable}</strong> Oxygen Beds</span>
                                  </span>
                                </div>
                              </div>

                              {/* Direct Booking Actions */}
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => handleOpenReserveModal(hosp)}
                                  disabled={isFull}
                                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                                    isFull
                                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                                  }`}
                                >
                                  <Bed className="w-3.5 h-3.5" />
                                  <span>{isFull ? 'Seats Full' : 'Book Seat / Bed'}</span>
                                </button>

                                <button
                                  onClick={() => setSosModalOpen(true)}
                                  className="px-3 py-2 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800/60 transition-colors flex items-center gap-1.5 cursor-pointer"
                                  title="Request Ambulance to this Hospital"
                                >
                                  <Ambulance className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
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
                    hospitals={hospitals}
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
      <nav aria-label="Mobile Navigation" className="fixed bottom-0 inset-x-0 z-40 lg:hidden h-16 border-t flex items-center justify-around px-2 bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-800 shadow-lg">
        <button
          onClick={() => handleNavClick('Overview')}
          aria-label="Overview"
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 text-[11px] font-medium transition-colors ${
            activeNav === 'Overview' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => handleNavClick('Live Hospitals')}
          aria-label="Live Hospitals"
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 text-[11px] font-medium transition-colors ${
            activeNav === 'Live Hospitals' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span>Hospitals</span>
        </button>

        {/* FLOATING SOS BUTTON */}
        <div className="relative -top-3">
          <button
            onClick={() => setSosModalOpen(true)}
            aria-label="Trigger SOS Emergency"
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex flex-col items-center justify-center shadow-lg border-4 border-slate-100 dark:border-slate-900 transition-colors"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
            <span className="text-[10px] font-bold -mt-0.5 tracking-wider uppercase">SOS</span>
          </button>
        </div>

        <button
          onClick={() => handleNavClick('Alerts')}
          aria-label="Emergency Alerts"
          className="relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 transition-colors"
        >
          <div className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
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
          aria-label="User Profile"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 transition-colors"
        >
          <User className="w-5 h-5" />
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
