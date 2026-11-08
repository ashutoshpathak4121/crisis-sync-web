import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Plus,
  Minus,
  Navigation,
  Map as MapIcon,
  Globe,
  Layers,
  Search,
  Building2,
  Ambulance,
  Radio,
  Locate,
  CheckCircle2,
  RotateCcw,
  Maximize2
} from 'lucide-react';

export const GOOGLE_MAP_HOSPITALS = [
  {
    id: 'aiims',
    name: 'AIIMS Apex Trauma Center',
    shortName: 'AIIMS Delhi',
    address: 'Ring Road, Safdarjung Enclave, New Delhi',
    lat: 28.5672,
    lng: 77.2100,
    distance: '12.6 km',
    eta: '24 min',
    status: 'Good',
    statusColor: 'emerald',
    icuAvailable: 18,
    icuTotal: 25,
    ventAvailable: 12,
    ventTotal: 18,
    genAvailable: 45,
    genTotal: 60,
    occupancy: 68,
    isolation: true,
    rating: 4.9,
    phone: '+91-11-2658-8500'
  },
  {
    id: 'max',
    name: 'Max Super Speciality Hospital',
    shortName: 'Max Super Speciality',
    address: '1, 2, Press Enclave Marg, Saket, New Delhi',
    lat: 28.5284,
    lng: 77.2114,
    distance: '8.4 km',
    eta: '18 min',
    status: 'Moderate',
    statusColor: 'amber',
    icuAvailable: 12,
    icuTotal: 20,
    ventAvailable: 8,
    ventTotal: 15,
    genAvailable: 32,
    genTotal: 50,
    occupancy: 72,
    isolation: true,
    rating: 4.7,
    phone: '+91-11-2651-5050'
  },
  {
    id: 'fortis',
    name: 'Fortis Escorts Heart & Trauma Institute',
    shortName: 'Fortis Hospital',
    address: 'Okhla Road, Sukhdev Vihar, New Delhi',
    lat: 28.5604,
    lng: 77.2764,
    distance: '14.2 km',
    eta: '28 min',
    status: 'Critical',
    statusColor: 'rose',
    icuAvailable: 3,
    icuTotal: 15,
    ventAvailable: 2,
    ventTotal: 10,
    genAvailable: 18,
    genTotal: 40,
    occupancy: 92,
    isolation: true,
    rating: 4.6,
    phone: '+91-11-4713-5000'
  },
  {
    id: 'medanta',
    name: 'Medanta Super Emergency Center',
    shortName: 'Medanta Hospital',
    address: 'CH Bakhtawar Singh Road, Sector 38, Gurugram',
    lat: 28.4394,
    lng: 77.0426,
    distance: '6.8 km',
    eta: '16 min',
    status: 'Good',
    statusColor: 'emerald',
    icuAvailable: 14,
    icuTotal: 20,
    ventAvailable: 10,
    ventTotal: 15,
    genAvailable: 38,
    genTotal: 50,
    occupancy: 66,
    isolation: true,
    rating: 4.8,
    phone: '+91-124-414-1414'
  },
  {
    id: 'apollo',
    name: 'Apollo Emergency Trauma Center',
    shortName: 'Apollo Hospital',
    address: 'Sarita Vihar, Mathura Road, New Delhi',
    lat: 28.5355,
    lng: 77.2882,
    distance: '10.3 km',
    eta: '22 min',
    status: 'Moderate',
    statusColor: 'amber',
    icuAvailable: 10,
    icuTotal: 18,
    ventAvailable: 6,
    ventTotal: 12,
    genAvailable: 28,
    genTotal: 45,
    occupancy: 78,
    isolation: false,
    rating: 4.8,
    phone: '+91-11-2692-5858'
  }
];

const SAMPLE_AMBULANCE_ROUTE = [
  [28.5490, 77.2520], // Nehru Place
  [28.5520, 77.2410], // Ring Road Flyover
  [28.5560, 77.2310], // Moolchand
  [28.5600, 77.2220], // South Extension
  [28.5672, 77.2100]  // AIIMS Apex Trauma Center
];

// Tile Layer configurations (Google Maps & Hybrid)
const GOOGLE_TILE_LAYERS = {
  STREETS: {
    name: 'Google Map',
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20
  },
  HYBRID: {
    name: 'Satellite',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Satellite',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20
  },
  TERRAIN: {
    name: 'Terrain',
    url: 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Terrain',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20
  },
  TRAFFIC: {
    name: 'Traffic',
    url: 'https://mt{s}.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Traffic',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20
  }
};

const GoogleMapView = ({ selectedHospitalId, onSelectHospital, onReserveBed }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersGroupRef = useRef(null);
  const routeGroupRef = useRef(null);
  const userLocGroupRef = useRef(null);
  const markerLookupRef = useRef({});

  const [activeLayer, setActiveLayer] = useState('STREETS'); // STREETS, HYBRID, TERRAIN, TRAFFIC
  const [showTraffic, setShowTraffic] = useState(false);
  const [showRoute, setShowRoute] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [activeHospital, setActiveHospital] = useState(null);

  // Default Center: New Delhi Ring Road medical corridor
  const NCR_CENTER = [28.5520, 77.2250];

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: NCR_CENTER,
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    // Add initial Google Streets Tile Layer
    const currentConfig = GOOGLE_TILE_LAYERS[activeLayer];
    const tileLayer = L.tileLayer(currentConfig.url, {
      attribution: currentConfig.attribution,
      subdomains: currentConfig.subdomains,
      maxZoom: currentConfig.maxZoom
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Create Layer Groups
    markersGroupRef.current = L.layerGroup().addTo(map);
    routeGroupRef.current = L.layerGroup().addTo(map);
    userLocGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // Render Markers & Route
    renderHospitalMarkers(map);
    renderEmergencyRoute(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Switch Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const targetConfig = GOOGLE_TILE_LAYERS[activeLayer];
    const newTileLayer = L.tileLayer(targetConfig.url, {
      attribution: targetConfig.attribution,
      subdomains: targetConfig.subdomains,
      maxZoom: targetConfig.maxZoom
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTileLayer;
  }, [activeLayer]);

  // 3. Render Hospital Markers (Google Maps Style Pins)
  const renderHospitalMarkers = (map) => {
    const group = markersGroupRef.current;
    if (!group) return;
    group.clearLayers();

    GOOGLE_MAP_HOSPITALS.forEach((hosp) => {
      const pinColor =
        hosp.statusColor === 'emerald'
          ? '#10B981'
          : hosp.statusColor === 'amber'
          ? '#F59E0B'
          : '#EF4444';

      const isSelected = selectedHospitalId === hosp.id;

      // Google Pin SVG Markup
      const iconHtml = `
        <div class="google-pin-container group relative cursor-pointer select-none">
          <div class="relative flex flex-col items-center">
            <!-- Pulsing Ground Radar Ring -->
            <span class="absolute -bottom-1 w-6 h-6 rounded-full opacity-60 animate-ping" style="background-color: ${pinColor};"></span>
            
            <!-- Google Maps Teardrop Marker Pin -->
            <div class="relative flex items-center justify-center w-9 h-11 transition-transform duration-200 transform group-hover:scale-110 ${
              isSelected ? 'scale-125' : ''
            }">
              <svg viewBox="0 0 36 44" fill="none" class="w-full h-full drop-shadow-lg">
                <path d="M18 0C8.05887 0 0 8.05887 0 18C0 27.5 14.5 41.5 17.1 43.8C17.6 44.2 18.4 44.2 18.9 43.8C21.5 41.5 36 27.5 36 18C36 8.05887 27.9411 0 18 0Z" fill="${pinColor}"/>
                <circle cx="18" cy="18" r="14" fill="#FFFFFF"/>
                <path d="M18 10V26M10 18H26" stroke="${pinColor}" stroke-width="3.5" stroke-linecap="round"/>
              </svg>
            </div>

            <!-- Small Label Pill -->
            <div class="mt-0.5 px-2 py-0.5 rounded-md bg-slate-950/90 text-white text-[9px] font-bold tracking-tight shadow-md border border-white/20 whitespace-nowrap pointer-events-none">
              ${hosp.shortName}
            </div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'google-map-marker',
        iconSize: [36, 52],
        iconAnchor: [18, 44],
        popupAnchor: [0, -44]
      });

      const marker = L.marker([hosp.lat, hosp.lng], { icon: customIcon }).addTo(group);
      markerLookupRef.current[hosp.id] = marker;

      // Google Maps Info Window Popup
      const popupHtml = `
        <div class="google-popup-card p-3 min-w-[240px] text-slate-100 font-sans">
          <div class="flex items-start justify-between gap-2 pb-2 border-b border-white/10">
            <div>
              <h4 class="text-xs font-black text-white leading-tight">${hosp.name}</h4>
              <p class="text-[10px] text-slate-400 mt-0.5">${hosp.address}</p>
            </div>
            <span class="px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
              hosp.statusColor === 'emerald'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : hosp.statusColor === 'amber'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }">
              ${hosp.status === 'Good' ? '+ Good' : hosp.status}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2 my-2.5 text-[10px] font-mono bg-white/[0.04] p-2 rounded-lg">
            <div>
              <span class="text-slate-400 block">ICU Available:</span>
              <span class="font-bold text-white">${hosp.icuAvailable} / ${hosp.icuTotal}</span>
            </div>
            <div>
              <span class="text-cyan-400 block">Ventilators:</span>
              <span class="font-bold text-cyan-400">${hosp.ventAvailable} / ${hosp.ventTotal}</span>
            </div>
            <div>
              <span class="text-slate-400 block">General Beds:</span>
              <span class="font-bold text-white">${hosp.genAvailable} / ${hosp.genTotal}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Occupancy:</span>
              <span class="font-bold ${hosp.occupancy > 85 ? 'text-rose-400' : 'text-emerald-400'}">${hosp.occupancy}%</span>
            </div>
          </div>

          <div class="flex items-center justify-between text-[10px] text-slate-300 mb-2">
            <span>Distance: <strong>${hosp.distance}</strong></span>
            <span>ETA: <strong class="text-emerald-400">${hosp.eta}</strong></span>
          </div>

          <button id="btn-reserve-${hosp.id}" class="w-full py-1.5 px-3 rounded-lg text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-md shadow-cyan-400/25 transition-all">
            Reserve Bed
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'google-leaflet-popup',
        maxWidth: 280
      });

      marker.on('click', () => {
        setActiveHospital(hosp);
        if (onSelectHospital) onSelectHospital(hosp);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-reserve-${hosp.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onReserveBed) onReserveBed(hosp);
          };
        }
      });
    });
  };

  // 4. Render Live Directions Route (Google Navigation Blue Line)
  const renderEmergencyRoute = (map) => {
    const routeGroup = routeGroupRef.current;
    if (!routeGroup) return;
    routeGroup.clearLayers();

    if (!showRoute) return;

    // Glowing Google Navigation Route Polyline
    L.polyline(SAMPLE_AMBULANCE_ROUTE, {
      color: '#1E40AF',
      weight: 8,
      opacity: 0.5,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(routeGroup);

    L.polyline(SAMPLE_AMBULANCE_ROUTE, {
      color: '#3B82F6',
      weight: 5,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(routeGroup);

    // Live Ambulance Marker (Nehru Place departure point)
    const ambulanceHtml = `
      <div class="relative cursor-pointer select-none">
        <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-cyan-400 opacity-75"></span>
        <div class="relative w-8 h-8 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/50">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        </div>
        <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-cyan-950/90 text-cyan-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-cyan-500/40 shadow">
          DL-4587 • 18m
        </div>
      </div>
    `;

    const ambulanceIcon = L.divIcon({
      html: ambulanceHtml,
      className: 'google-ambulance-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    L.marker([28.5490, 77.2520], { icon: ambulanceIcon })
      .bindPopup(
        `<div class="p-2 text-xs text-white">
          <strong class="text-cyan-400">Ambulance DL-4587</strong><br/>
          Patient: Triage 2 (Respiratory Distress)<br/>
          Heading to AIIMS Apex Trauma Center (ETA: 18 min)
        </div>`
      )
      .addTo(routeGroup);
  };

  // Sync when selected hospital prop changes
  useEffect(() => {
    if (!selectedHospitalId || !mapInstanceRef.current) return;
    const target = GOOGLE_MAP_HOSPITALS.find((h) => h.id === selectedHospitalId);
    if (target) {
      mapInstanceRef.current.flyTo([target.lat, target.lng], 14, { duration: 1.2 });
      const marker = markerLookupRef.current[target.id];
      if (marker) {
        setTimeout(() => marker.openPopup(), 600);
      }
    }
  }, [selectedHospitalId]);

  // Controls Handlers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo(NCR_CENTER, 12, { duration: 1.0 });
  };

  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = pos.coords;

        if (mapInstanceRef.current && userLocGroupRef.current) {
          userLocGroupRef.current.clearLayers();

          // Circle
          L.circle([latitude, longitude], {
            radius: Math.max(accuracy, 80),
            color: '#3B82F6',
            fillColor: '#3B82F6',
            fillOpacity: 0.15,
            weight: 1.5
          }).addTo(userLocGroupRef.current);

          // Dot
          const userDot = L.divIcon({
            html: `
              <div class="relative flex items-center justify-center">
                <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-lg"></span>
              </div>
            `,
            className: 'user-loc-dot',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          L.marker([latitude, longitude], { icon: userDot }).addTo(userLocGroupRef.current);
          mapInstanceRef.current.flyTo([latitude, longitude], 14, { duration: 1.2 });
        }
      },
      () => {
        setIsLocating(false);
        // Fallback to Delhi Center if location blocked
        mapInstanceRef.current?.flyTo(NCR_CENTER, 13);
      },
      { timeout: 8000 }
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const match = GOOGLE_MAP_HOSPITALS.find(
      (h) =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (match && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([match.lat, match.lng], 14, { duration: 1.2 });
      const marker = markerLookupRef.current[match.id];
      if (marker) setTimeout(() => marker.openPopup(), 600);
    } else {
      alert(`No exact hospital match for "${searchQuery}". Showing Delhi NCR overview.`);
      handleRecenter();
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-sm">
      {/* Top Google Maps Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 z-20 relative">
        {/* Layer Mode Tabs (Google Map, Satellite, Terrain, Traffic) */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveLayer('STREETS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeLayer === 'STREETS'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>
          <button
            onClick={() => setActiveLayer('HYBRID')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeLayer === 'HYBRID'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Satellite</span>
          </button>
          <button
            onClick={() => setActiveLayer('TERRAIN')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeLayer === 'TERRAIN'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Terrain</span>
          </button>
          <button
            onClick={() => setActiveLayer('TRAFFIC')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeLayer === 'TRAFFIC'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Live Traffic</span>
          </button>
        </div>

        {/* Live Route Navigation Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowRoute(!showRoute);
              if (mapInstanceRef.current) {
                if (!showRoute) renderEmergencyRoute(mapInstanceRef.current);
                else routeGroupRef.current?.clearLayers();
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              showRoute
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Ambulance className="w-3.5 h-3.5" />
            <span>Ambulance GPS Route</span>
            <span
              className={`w-2 h-2 rounded-full ${
                showRoute ? 'bg-blue-600 dark:bg-blue-400' : 'bg-slate-400'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Floating Google Maps Search & Fly-To Box */}
      <div className="absolute top-16 left-4 z-20 w-64 sm:w-72 shadow-md">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search on Map (e.g. AIIMS)..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-md"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              ×
            </button>
          )}
        </form>
      </div>

      {/* The Leaflet Google Map Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-[400px] sm:h-[470px] lg:h-[500px] bg-slate-900 z-10"
        style={{ minHeight: '400px' }}
      />

      {/* Map Float Controls (Zoom, My Location, Recenter) */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
        <button
          onClick={handleRecenter}
          title="Recenter Delhi NCR"
          className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 shadow-md transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </button>

        <button
          onClick={handleGetMyLocation}
          title="Locate Me (GPS)"
          disabled={isLocating}
          className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 shadow-md transition-colors cursor-pointer"
        >
          <Locate className={`w-4 h-4 ${isLocating ? 'animate-spin text-blue-600' : 'text-blue-600 dark:text-blue-400'}`} />
        </button>

        <div className="flex flex-col rounded-lg overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 border-b border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend Pill (Bottom Left) */}
      <div className="absolute bottom-3 left-4 z-20 hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-700 dark:text-slate-300 shadow-md">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> &gt;70% Beds
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Moderate
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500" /> Critical ER
        </span>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span className="text-blue-600 dark:text-blue-400 font-semibold font-sans">Tactical Map</span>
      </div>
    </div>
  );
};

export default GoogleMapView;
export { GoogleMapView as ThreeDMapView };
