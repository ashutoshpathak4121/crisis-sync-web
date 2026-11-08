import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmergencyData } from '../context/EmergencyDataContext';
import { routeService, ambulanceService } from '../services';
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] py-6 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Paramedic Status Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 shrink-0">
              <AmbulanceIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                  Ambulance Dispatch Portal
                </span>
                <StatusBadge status={currentAmbulance.status} type="ambulance" size="md" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                Unit {currentAmbulance.vehicleNumber}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap font-mono">
                <span>Paramedic: <strong className="text-slate-800 dark:text-slate-200 font-sans">{user?.name || 'On Duty'}</strong></span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span>GPS: <strong className="text-blue-600 dark:text-blue-400">{currentAmbulance.latitude.toFixed(4)}°N, {currentAmbulance.longitude.toFixed(4)}°E</strong></span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Attached Hospital Status Badge & Detach Action */}
            {currentAmbulance.destinationHospital ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <Link2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>
                  Attached: <strong className="text-slate-900 dark:text-white font-semibold">{currentAmbulance.destinationHospital.name}</strong>
                </span>
                <button
                  onClick={handleDetachHospital}
                  className="ml-1 text-[11px] underline text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-0.5 cursor-pointer"
                  title="Detach ambulance from current hospital destination"
                >
                  <Unlink className="w-3 h-3" /> Detach
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAttachNearestHospital()}
                disabled={isAttachingHospital}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                title="Automatically find and attach to the closest accepting hospital with available ER beds"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isAttachingHospital ? 'Attaching ER...' : 'Attach Near Hospital'}</span>
              </button>
            )}

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report Scene Incident</span>
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
                <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                  Live Emergency Tactical Map
                </h3>
              </div>
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-medium">
                Real-Time GPS Tracking Active
              </span>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
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
          </div>

          {/* Right (5 cols): Nearby Hospitals with Live Updating Cards */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                Nearby Emergency Centers ({filteredHospitals.length})
              </h3>

              <button
                onClick={() => setFilterAcceptingOnly(!filterAcceptingOnly)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                  filterAcceptingOnly
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Filter className="w-3 h-3" />
                <span>Accepting Only</span>
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
    </div>
  );
};

export default AmbulanceDashboard;