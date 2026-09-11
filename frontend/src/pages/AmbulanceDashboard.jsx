import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmergencyData } from '../context/EmergencyDataContext';
import { routeService } from '../services';
import EmergencyMap from '../components/map/EmergencyMap';
import HospitalCard from '../components/ambulance/HospitalCard';
import SmartRecommendationCard from '../components/ambulance/SmartRecommendationCard';
import RoutePanel from '../components/ambulance/RoutePanel';
import IncidentReportModal from '../components/ambulance/IncidentReportModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import {
  Ambulance as AmbulanceIcon,
  Navigation,
  AlertCircle,
  Radio,
  PlusCircle,
  Filter,
  Zap,
  Link2,
  Unlink
} from 'lucide-react';

const AmbulanceDashboard = () => {
  const { user } = useAuth();
  const {
    hospitals,
    ambulances,
    incidents,
    activeRoute,
    calculateRouteToHospital,
    clearActiveRoute,
    attachNearestHospital,
    attachHospitalToAmbulance,
    detachHospitalFromAmbulance,
    reportIncident,
    recentlyUpdatedHospitalId,
    isLoading
  } = useEmergencyData();

  // Active ambulance unit (assigned or default)
  const currentAmbulance =
    ambulances.find((a) => a.paramedicId === user?.id) ||
    ambulances[0] ||
    null;

  const [recommendation, setRecommendation] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [filterAcceptingOnly, setFilterAcceptingOnly] = useState(false);
  const [calculatingRouteId, setCalculatingRouteId] = useState(null);
  const [isAttachingHospital, setIsAttachingHospital] = useState(false);

  // Auto-Attach to Nearest Available Hospital
  const handleAttachNearestHospital = async (customCoords = null) => {
    if (!currentAmbulance) return;
    try {
      setIsAttachingHospital(true);
      await attachNearestHospital(currentAmbulance.id, customCoords);
    } catch (err) {
      console.error('Failed to attach nearest hospital:', err);
    } finally {
      setIsAttachingHospital(false);
    }
  };

  // Detach Hospital Assignment
  const handleDetachHospital = async () => {
    if (!currentAmbulance) return;
    try {
      await detachHospitalFromAmbulance(currentAmbulance.id);
    } catch (err) {
      console.error('Failed to detach hospital:', err);
    }
  };

  // Fetch smart hospital recommendations
  useEffect(() => {
    if (!currentAmbulance) return;
    const fetchRec = async () => {
      try {
        const res = await routeService.getRecommendations({
          lat: currentAmbulance.latitude,
          lng: currentAmbulance.longitude
        });
        if (res.success && res.data.recommendations?.length > 0) {
          setRecommendation(res.data.recommendations[0]);
        }
      } catch (err) {
        console.error('Failed to calculate smart recommendation:', err);
      }
    };
    fetchRec();
  }, [currentAmbulance, hospitals]); // Re-evaluates when live hospital capacities change!

  const handleRouteToHospital = async (hospital) => {
    if (!currentAmbulance) return;
    try {
      setCalculatingRouteId(hospital.id);
      await calculateRouteToHospital(currentAmbulance.id, hospital.id);
    } catch (err) {
      console.error('Failed to calculate route:', err);
    } finally {
      setCalculatingRouteId(null);
    }
  };

  const handleReportIncident = async (incidentData) => {
    await reportIncident(incidentData);
  };

  const handleUserLocationChange = async (coords) => {
    if (currentAmbulance) {
      try {
        await ambulanceService.updateLocation(currentAmbulance.id, coords.lat, coords.lng);
      } catch (err) {
        console.warn('Could not sync user location to ambulance:', err);
      }
    }
  };

  if (isLoading || !currentAmbulance) {
    return <LoadingSpinner text="Connecting to Paramedic GPS telemetry..." />;
  }

  const filteredHospitals = hospitals.filter((h) => {
    if (filterAcceptingOnly) {
      return h.emergencyStatus === 'ACCEPTING';
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Paramedic Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-[#0B1324]/85 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 shadow-glow-cyan">
            <AmbulanceIcon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-black text-white tracking-tight font-['Outfit']">
                Unit {currentAmbulance.vehicleNumber}
              </h2>
              <StatusBadge status={currentAmbulance.status} type="ambulance" size="md" />
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap font-mono">
              <span>Paramedic: <strong className="text-slate-200">{user?.name || 'On Duty'}</strong></span>
              <span className="text-slate-600">•</span>
              <span>GPS: <strong className="text-cyan-400">{currentAmbulance.latitude.toFixed(4)}°N, {currentAmbulance.longitude.toFixed(4)}°E</strong></span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Attached Hospital Status Badge & Detach Action */}
          {currentAmbulance.destinationHospital ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-semibold shadow-lg shadow-emerald-950/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Link2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Attached: <strong className="text-white">{currentAmbulance.destinationHospital.name}</strong>
              </span>
              <button
                onClick={handleDetachHospital}
                className="ml-1 text-[11px] underline text-slate-300 hover:text-red-300 flex items-center gap-0.5"
                title="Detach ambulance from current hospital destination"
              >
                <Unlink className="w-3 h-3" /> Detach
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleAttachNearestHospital()}
              disabled={isAttachingHospital}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-lg ${
                isAttachingHospital
                  ? 'bg-emerald-600/50 text-emerald-200 border border-emerald-400 animate-pulse'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-glow-emerald'
              }`}
              title="Automatically find and attach to the closest accepting hospital with available ER beds"
            >
              <Zap className="w-4 h-4 fill-white text-white" />
              {isAttachingHospital ? 'Attaching ER...' : 'Attach Near Hospital'}
            </button>
          )}

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/30 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Report Scene Incident
          </button>
        </div>
      </div>

      {/* Smart Destination Recommendation Banner */}
      <SmartRecommendationCard
        recommendation={recommendation}
        onSelectRoute={handleRouteToHospital}
      />

      {/* Active Navigation Route HUD (if routed) */}
      {activeRoute && (
        <RoutePanel
          route={activeRoute}
          onClearRoute={() => handleDetachHospital()}
        />
      )}

      {/* Main Grid: Live Emergency Map + Nearby Hospitals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Top (7 cols): Interactive Live Emergency Map */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Live Emergency Tactical Map
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-medium">
              Real-Time GPS Tracking Active
            </span>
          </div>

          <EmergencyMap
            hospitals={hospitals}
            ambulances={ambulances}
            incidents={incidents}
            activeRoute={activeRoute}
            onSelectHospital={handleRouteToHospital}
            selectedHospitalId={activeRoute?.hospital?.id || currentAmbulance?.destinationHospitalId}
            onUserLocationChange={handleUserLocationChange}
            onAttachNearestHospital={handleAttachNearestHospital}
            isAttaching={isAttachingHospital}
            height="480px"
          />
        </div>

        {/* Right (5 cols): Nearby Hospitals with Live Updating Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Nearby Emergency Centers ({filteredHospitals.length})
            </h3>

            <button
              onClick={() => setFilterAcceptingOnly(!filterAcceptingOnly)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                filterAcceptingOnly
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Filter className="w-3 h-3" />
              Accepting Only
            </button>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredHospitals.map((hospital) => {
              const isSelected = activeRoute?.hospital?.id === hospital.id;
              const isRecentlyUpdated = recentlyUpdatedHospitalId === hospital.id;

              return (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  onSelectRoute={handleRouteToHospital}
                  isSelected={isSelected}
                  isRecentlyUpdated={isRecentlyUpdated}
                  isLoadingRoute={calculatingRouteId === hospital.id}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Incident Report Modal */}
      <IncidentReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportIncident}
        defaultCoordinates={{
          lat: currentAmbulance.latitude,
          lng: currentAmbulance.longitude
        }}
      />
    </div>
  );
};

export default AmbulanceDashboard;
