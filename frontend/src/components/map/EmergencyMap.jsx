import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Navigation,
  MapPin,
  AlertTriangle,
  RotateCcw,
  Layers,
  Crosshair,
  Locate,
  Hospital as HospitalIcon,
  Check,
  Radio,
  Loader2,
  Zap,
  Link2
} from 'lucide-react';

// Tile Layer configurations (Real Google Maps & OpenStreetMap with maxNativeZoom to eliminate "Map data not available")
const TILE_LAYERS = {
  GOOGLE_STREETS: {
    name: 'Google Maps (Streets)',
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 21,
    maxNativeZoom: 20
  },
  GOOGLE_HYBRID: {
    name: 'Google Hybrid (Satellite + Roads)',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 21,
    maxNativeZoom: 20
  },
  OSM: {
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 21,
    maxNativeZoom: 19
  },
  DARK: {
    name: 'Tactical Dark Navigation',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    subdomains: [],
    maxZoom: 21,
    maxNativeZoom: 16
  }
};

const EmergencyMap = ({
  hospitals = [],
  ambulances = [],
  incidents = [],
  activeRoute = null,
  onSelectHospital,
  onAttachHospital = null,
  selectedHospitalId = null,
  onUserLocationChange = null,
  onAttachNearestHospital = null,
  isAttaching = false,
  height = '500px'
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerGroupRef = useRef(null);
  const routeLayerGroupRef = useRef(null);
  const userLocationLayerGroupRef = useRef(null);
  const hospitalMarkersRef = useRef({});

  const [activeTileType, setActiveTileType] = useState('GOOGLE_STREETS');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center (New Delhi metropolitan medical corridor)
    const initialCenter = [28.5672, 77.2250];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 12,
      maxZoom: 21,
      zoomControl: false,
      attributionControl: false
    });

    // Zoom control at top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Initial Tile Layer
    const tileConfig = TILE_LAYERS[activeTileType];
    const tileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      subdomains: tileConfig.subdomains || ['a', 'b', 'c'],
      maxZoom: tileConfig.maxZoom || 21,
      maxNativeZoom: tileConfig.maxNativeZoom || 20
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Layers
    const markersGroup = L.layerGroup().addTo(map);
    const routeGroup = L.layerGroup().addTo(map);
    const userLocationGroup = L.layerGroup().addTo(map);

    markersLayerGroupRef.current = markersGroup;
    routeLayerGroupRef.current = routeGroup;
    userLocationLayerGroupRef.current = userLocationGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Switch Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const tileConfig = TILE_LAYERS[activeTileType];
    const newTileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      subdomains: tileConfig.subdomains || ['a', 'b', 'c'],
      maxZoom: tileConfig.maxZoom || 21,
      maxNativeZoom: tileConfig.maxNativeZoom || 20
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTileLayer;
  }, [activeTileType]);

  // "My Location" Geolocation Handler
  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus({ type: 'error', text: 'Geolocation is not supported by your browser.' });
      setTimeout(() => setLocationStatus(null), 4000);
      return;
    }

    setIsLocating(true);
    setLocationStatus({ type: 'info', text: 'Acquiring high-accuracy GPS fix...' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude, accuracy });
        setLocationStatus({ type: 'success', text: `GPS Locked! (±${Math.round(accuracy)}m accuracy)` });
        setTimeout(() => setLocationStatus(null), 4000);

        if (!mapInstanceRef.current || !userLocationLayerGroupRef.current) return;

        const group = userLocationLayerGroupRef.current;
        group.clearLayers();

        // 1. Accuracy circle
        L.circle([latitude, longitude], {
          radius: Math.max(accuracy, 60),
          color: '#3B82F6',
          fillColor: '#3B82F6',
          fillOpacity: 0.15,
          weight: 1.5,
          dashArray: '4, 4'
        }).addTo(group);

        // 2. Custom Glowing "You Are Here" Marker
        const userIconHtml = `
          <div class="relative cursor-pointer select-none">
            <span class="relative flex h-8 w-8 items-center justify-center">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-5 w-5 bg-blue-600 border-2 border-white items-center justify-center shadow-lg shadow-blue-500/50">
                <span class="w-2 h-2 rounded-full bg-white"></span>
              </span>
            </span>
            <div class="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-950/90 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-400/40 shadow-lg pointer-events-none font-sans">
              You Are Here
            </div>
          </div>
        `;

        const userIcon = L.divIcon({
          html: userIconHtml,
          className: 'custom-user-location-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18]
        });

        const popupContent = `
          <div class="text-xs p-1 font-sans">
            <div class="flex items-center gap-1.5 text-blue-400 font-bold mb-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span>CURRENT LIVE LOCATION</span>
            </div>
            <p class="text-white font-mono text-[11px]">${latitude.toFixed(5)}°N, ${longitude.toFixed(5)}°E</p>
            <p class="text-slate-400 text-[10px] mt-0.5">GPS Precision: ±${Math.round(accuracy)} meters</p>
          </div>
        `;

        const marker = L.marker([latitude, longitude], { icon: userIcon })
          .bindPopup(popupContent)
          .addTo(group);

        // Smoothly fly to user position
        mapInstanceRef.current.flyTo([latitude, longitude], 15, {
          animate: true,
          duration: 1.2
        });

        if (onUserLocationChange) {
          onUserLocationChange({ lat: latitude, lng: longitude });
        }
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Unable to retrieve your location.';
        if (error.code === 1) msg = 'Location access denied. Please enable GPS permissions in browser.';
        else if (error.code === 2) msg = 'GPS position unavailable. Centering on city center.';
        else if (error.code === 3) msg = 'Location request timed out.';
        setLocationStatus({ type: 'error', text: msg });
        setTimeout(() => setLocationStatus(null), 4000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000
      }
    );
  };

  // Plot Hospitals, Ambulances, and Incidents
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;

    const group = markersLayerGroupRef.current;
    group.clearLayers();
    hospitalMarkersRef.current = {};

    // 1. Plot Hospitals
    hospitals.forEach((hosp) => {
      const isSelected = selectedHospitalId === hosp.id || activeRoute?.hospital?.id === hosp.id;
      const isRouted = activeRoute?.hospital?.id === hosp.id;
      const res = hosp.resources || {};
      const erBeds = res.emergencyBedsAvailable !== undefined ? res.emergencyBedsAvailable : 0;

      let pinColor = '#10B981'; // Green
      let statusClass = 'border-emerald-500 bg-slate-900 text-emerald-400';
      if (hosp.emergencyStatus === 'CRITICAL' || erBeds <= 2) {
        pinColor = '#EF4444';
        statusClass = 'border-red-500 bg-slate-900 text-red-400 animate-pulse';
      } else if (hosp.emergencyStatus === 'LIMITED') {
        pinColor = '#F59E0B';
        statusClass = 'border-amber-500 bg-slate-900 text-amber-400';
      } else if (hosp.emergencyStatus === 'FULL') {
        pinColor = '#DC2626';
        statusClass = 'border-red-600 bg-red-950 text-red-200';
      }

      const iconHtml = `
        <div class="relative cursor-pointer group select-none">
          <div class="flex items-center justify-center w-9 h-9 rounded-xl border-2 ${statusClass} shadow-xl transition-transform ${isSelected ? 'scale-125 ring-4 ring-cyan-400' : 'group-hover:scale-110'}">
            <svg class="w-5 h-5" fill="none" stroke="${pinColor}" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span class="absolute -top-2 -right-2 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-extrabold bg-slate-950 border border-${hosp.emergencyStatus === 'CRITICAL' ? 'red-500 text-red-400' : 'emerald-500 text-emerald-400'} shadow">
              ${erBeds}
            </span>
          </div>
          <div class="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-700 shadow-lg pointer-events-none">
            ${hosp.name.split(' ')[0]}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-hospital-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20]
      });

      const popupContent = document.createElement('div');
      popupContent.className = 'text-xs p-1';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
          <div>
            <span class="text-[9px] uppercase font-mono font-bold tracking-widest text-cyan-400">HOSPITAL FACILITY</span>
            <h4 class="text-sm font-bold text-white">${hosp.name}</h4>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
            hosp.emergencyStatus === 'ACCEPTING' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
          }">${hosp.emergencyStatus}</span>
        </div>
        <p class="text-slate-400 text-[11px] mb-2">${hosp.address}</p>
        <div class="grid grid-cols-3 gap-1.5 font-mono text-center mb-3">
          <div class="bg-slate-900 p-1.5 rounded border border-slate-800">
            <span class="text-[9px] text-slate-400 block">ER Beds</span>
            <strong class="text-emerald-400">${erBeds}</strong>
          </div>
          <div class="bg-slate-900 p-1.5 rounded border border-slate-800">
            <span class="text-[9px] text-slate-400 block">ICU</span>
            <strong class="text-cyan-400">${res.icuBedsAvailable || 0}</strong>
          </div>
          <div class="bg-slate-900 p-1.5 rounded border border-slate-800">
            <span class="text-[9px] text-slate-400 block">Vents</span>
            <strong class="text-purple-400">${res.ventilatorsAvailable || 0}</strong>
          </div>
        </div>
        <button id="route-btn-${hosp.id}" class="w-full py-2 px-3 rounded-lg ${
          isRouted
            ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-emerald-500/30'
            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold'
        } text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95">
          ${isRouted ? '✓ Unit Attached & En-Route' : 'Dispatch / Attach Unit Here'}
        </button>
      `;

      const marker = L.marker([hosp.latitude, hosp.longitude], { icon: customIcon });
      marker.bindPopup(popupContent, { maxWidth: 280 });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`route-btn-${hosp.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onAttachHospital) {
              onAttachHospital(hosp);
            } else if (onSelectHospital) {
              onSelectHospital(hosp);
            }
            marker.closePopup();
          };
        }
      });

      marker.on('click', () => {
        if (onSelectHospital) onSelectHospital(hosp);
      });

      marker.addTo(group);
      hospitalMarkersRef.current[hosp.id] = marker;
    });

    // 2. Plot Ambulances
    ambulances.forEach((amb) => {
      const isEnRoute = amb.status === 'EN_ROUTE' || amb.status === 'TRANSPORTING';

      const iconHtml = `
        <div class="relative cursor-pointer group select-none">
          <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 border-2 border-white shadow-xl shadow-cyan-500/40 text-slate-950 transition-transform group-hover:scale-125">
            <svg class="w-4 h-4 ${isEnRoute ? 'animate-bounce' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div class="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/90 text-cyan-400 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-cyan-500/30 shadow pointer-events-none">
            ${amb.vehicleNumber}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-ambulance-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const popupHtml = `
        <div class="text-xs p-1 font-mono">
          <div class="border-b border-slate-800 pb-1.5 mb-1.5 flex items-center justify-between">
            <span class="font-bold text-white text-sm">${amb.vehicleNumber}</span>
            <span class="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300">${amb.status}</span>
          </div>
          <p class="text-slate-300 font-sans text-xs">
            Paramedic: <strong class="text-white">${amb.paramedic?.name || 'On Duty'}</strong>
          </p>
          <p class="text-slate-400 text-[11px] mt-1">
            ${amb.destinationHospital ? `En-route to: <span class="text-cyan-400 font-bold">${amb.destinationHospital.name}</span>` : 'On Standby / Patrol'}
          </p>
        </div>
      `;

      L.marker([amb.latitude, amb.longitude], { icon: customIcon })
        .bindPopup(popupHtml)
        .addTo(group);
    });

    // 3. Plot Incidents
    incidents.forEach((inc) => {
      const iconHtml = `
        <div class="relative cursor-pointer group select-none">
          <span class="relative flex h-8 w-8 items-center justify-center">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-7 w-7 bg-red-600 border-2 border-white items-center justify-center shadow-lg shadow-red-600/50">
              <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
          </span>
          <div class="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-950/90 text-red-200 text-[9px] font-bold px-1.5 py-0.5 rounded border border-red-500/40 shadow pointer-events-none">
            ${inc.patientCount} Casualties
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-incident-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const popupHtml = `
        <div class="text-xs p-1">
          <div class="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
            <h4 class="font-bold text-white text-xs">${inc.type}</h4>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/40">${inc.severity}</span>
          </div>
          <p class="text-slate-300 text-xs mb-1.5">${inc.description}</p>
          <span class="text-cyan-400 font-mono text-[11px] block font-bold">
            ${inc.patientCount} victims requiring urgent ER bed allocation
          </span>
        </div>
      `;

      L.marker([inc.latitude, inc.longitude], { icon: customIcon })
        .bindPopup(popupHtml)
        .addTo(group);
    });
  }, [hospitals, ambulances, incidents, selectedHospitalId, activeRoute, onSelectHospital, onAttachHospital]);

  // Smoothly pan/fly map to selected hospital and open its popup
  useEffect(() => {
    if (!selectedHospitalId || !mapInstanceRef.current) return;
    const targetHosp = hospitals.find((h) => h.id === selectedHospitalId);
    if (!targetHosp) return;

    try {
      mapInstanceRef.current.invalidateSize();
      mapInstanceRef.current.flyTo([targetHosp.latitude, targetHosp.longitude], 15, {
        animate: true,
        duration: 1.0
      });
    } catch (e) {
      console.warn('Map flyTo failed:', e);
    }

    const timer = setTimeout(() => {
      const marker = hospitalMarkersRef.current[selectedHospitalId];
      if (marker && mapInstanceRef.current) {
        marker.openPopup();
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [selectedHospitalId, hospitals]);

  // Route Polyline & Auto-fit bounds
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerGroupRef.current) return;

    const group = routeLayerGroupRef.current;
    group.clearLayers();

    if (!activeRoute || !activeRoute.geometry || !Array.isArray(activeRoute.geometry)) {
      return;
    }

    const latLngs = activeRoute.geometry.map((pt) => [pt[1], pt[0]]);

    // Glow border halo
    L.polyline(latLngs, {
      color: '#06B6D4',
      weight: 8,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(group);

    // Primary Route Polyline
    const primaryLine = L.polyline(latLngs, {
      color: '#06B6D4',
      weight: 4.5,
      opacity: 0.95,
      dashArray: '8, 6',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(group);

    // Auto-fit map bounds smoothly to display whole route
    try {
      mapInstanceRef.current.fitBounds(primaryLine.getBounds(), {
        padding: [50, 50],
        maxZoom: 14,
        animate: true
      });
    } catch (e) {
      console.warn('fitBounds skipped:', e);
    }
  }, [activeRoute]);

  // Recenter to default view or active route
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    if (userLocation) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 14, { animate: true });
    } else if (activeRoute && activeRoute.geometry && activeRoute.geometry.length > 0) {
      const latLngs = activeRoute.geometry.map((pt) => [pt[1], pt[0]]);
      const bounds = L.latLngBounds(latLngs);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else {
      mapInstanceRef.current.setView([28.5672, 77.2250], 12, { animate: true });
    }
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-[#1E2E48] shadow-2xl"
      style={{ height }}
    >
      {/* Real Street Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Active Route Navigation Telemetry HUD */}
      {activeRoute && (
        <div className="absolute top-4 left-4 z-[1000] bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-md font-mono text-xs text-slate-800 dark:text-slate-200 max-w-xs">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-[11px] uppercase tracking-wider mb-1">
            <Navigation className="w-3.5 h-3.5" />
            <span>Active Navigation Locked</span>
          </div>
          <h4 className="text-slate-900 dark:text-white font-bold text-sm truncate font-sans">
            {activeRoute.hospital?.name}
          </h4>
          <div className="flex items-center gap-4 mt-1.5 text-slate-600 dark:text-slate-300 font-semibold">
            <span>ETA: <strong className="text-blue-600 dark:text-blue-400 font-bold">{activeRoute.durationMin} min</strong></span>
            <span>Dist: <strong className="text-slate-900 dark:text-white font-bold">{activeRoute.distanceKm} km</strong></span>
          </div>
        </div>
      )}

      {/* GPS Status Toast */}
      {locationStatus && (
        <div className={`absolute bottom-14 left-1/2 -translate-x-1/2 z-[1000] px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md border ${
          locationStatus.type === 'error'
            ? 'bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
            : locationStatus.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
            : 'bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
        }`}>
          {locationStatus.text}
        </div>
      )}

      {/* Map Floating Action Controls */}
      <div className="absolute top-4 right-14 z-[1000] flex items-center gap-1.5">
        {/* "Attach Near Hospital" Quick Action */}
        {onAttachNearestHospital && (
          <button
            onClick={() => onAttachNearestHospital(userLocation)}
            disabled={isAttaching}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors shadow-sm cursor-pointer ${
              isAttaching
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                : activeRoute
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
            }`}
            title="Automatically attach to nearest accepting emergency hospital"
          >
            {isAttaching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 fill-current" />
            )}
            <span className="hidden sm:inline">
              {isAttaching ? 'Attaching...' : activeRoute ? 'Re-Attach Near ER' : 'Attach Near Hospital'}
            </span>
          </button>
        )}

        {/* "My Location" GPS Button */}
        <button
          onClick={handleGetMyLocation}
          disabled={isLocating}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors shadow-sm cursor-pointer ${
            isLocating
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 text-blue-700 dark:text-blue-300'
              : userLocation
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750'
          }`}
          title="Detect and Center on My Real GPS Location"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
          ) : (
            <Locate className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">
            {isLocating ? 'Locating...' : 'My Location'}
          </span>
        </button>

        {/* Recenter Button */}
        <button
          onClick={handleRecenter}
          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors shadow-sm cursor-pointer"
          title="Recenter Map View"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Layer Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors shadow-sm text-xs font-semibold cursor-pointer"
            title="Switch Map Layers"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">{TILE_LAYERS[activeTileType].name}</span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg p-1.5 z-50 text-xs space-y-0.5">
              {Object.keys(TILE_LAYERS).map((key) => {
                const isSelected = activeTileType === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveTileType(key);
                      setShowLayerMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                  >
                    {TILE_LAYERS[key].name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-[11px] text-slate-700 dark:text-slate-300 shadow-sm">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Hospital
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Ambulance
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Incident
        </span>
        {userLocation && (
          <span className="flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> You
          </span>
        )}
      </div>
    </div>
  );
};

export default EmergencyMap;
