const prisma = require('../config/db');
const env = require('../config/env');
const {
  calculateDistanceKm,
  estimateEtaMinutes,
  generateRouteCoordinates
} = require('../utils/geo');
const logger = require('../utils/logger');

const routeService = {
  async calculateRoute(ambulanceId, hospitalId) {
    const ambulance = await prisma.ambulance.findUnique({
      where: { id: ambulanceId }
    });
    if (!ambulance) {
      const err = new Error(`Ambulance with ID ${ambulanceId} not found`);
      err.statusCode = 404;
      throw err;
    }

    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
      include: { resources: true }
    });
    if (!hospital) {
      const err = new Error(`Hospital with ID ${hospitalId} not found`);
      err.statusCode = 404;
      throw err;
    }

    let distanceKm = calculateDistanceKm(
      ambulance.latitude,
      ambulance.longitude,
      hospital.latitude,
      hospital.longitude
    );
    let durationMin = estimateEtaMinutes(distanceKm);
    let coordinates = generateRouteCoordinates(
      ambulance.latitude,
      ambulance.longitude,
      hospital.latitude,
      hospital.longitude
    );

    // If Mapbox token is configured, try querying Mapbox Directions API
    if (env.MAPBOX_ACCESS_TOKEN) {
      try {
        const start = `${ambulance.longitude},${ambulance.latitude}`;
        const end = `${hospital.longitude},${hospital.latitude}`;
        const mapboxUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?geometries=geojson&access_token=${env.MAPBOX_ACCESS_TOKEN}`;

        const res = await fetch(mapboxUrl);
        if (res.ok) {
          const mapboxData = await res.json();
          if (mapboxData.routes && mapboxData.routes.length > 0) {
            const bestRoute = mapboxData.routes[0];
            distanceKm = Math.round((bestRoute.distance / 1000) * 10) / 10;
            durationMin = Math.round(bestRoute.duration / 60);
            coordinates = bestRoute.geometry.coordinates;
            logger.info(`Mapbox route computed successfully: ${distanceKm} km, ${durationMin} min`);
          }
        }
      } catch (err) {
        logger.warn(`Mapbox Directions API fallback to internal geo engine: ${err.message}`);
      }
    }

    // Save route record in DB
    const savedRoute = await prisma.route.create({
      data: {
        ambulanceId,
        hospitalId,
        distance: distanceKm,
        duration: durationMin,
        geometry: JSON.stringify(coordinates)
      }
    });

    return {
      routeId: savedRoute.id,
      ambulance: {
        id: ambulance.id,
        vehicleNumber: ambulance.vehicleNumber,
        latitude: ambulance.latitude,
        longitude: ambulance.longitude
      },
      hospital: {
        id: hospital.id,
        name: hospital.name,
        address: hospital.address,
        latitude: hospital.latitude,
        longitude: hospital.longitude,
        emergencyStatus: hospital.emergencyStatus,
        resources: hospital.resources
      },
      distanceKm,
      durationMin,
      geometry: coordinates
    };
  }
};

module.exports = routeService;
