// Haversine formula to compute great-circle distance between two points in km
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place
}

// Estimate emergency vehicle ETA in minutes
function estimateEtaMinutes(distanceKm, trafficFactor = 1.2) {
  // Average emergency response speed in urban corridors ~ 38 km/h
  const avgSpeedKmh = 38 / trafficFactor;
  const hours = distanceKm / avgSpeedKmh;
  const minutes = Math.round(hours * 60);
  return Math.max(minutes, 2); // Minimum 2 minutes
}

// Generate realistic polyline coordinates connecting two points with slight road-like bends
function generateRouteCoordinates(startLat, startLng, endLat, endLng) {
  const points = [[startLng, startLat]];
  const steps = 6;
  for (let i = 1; i < steps; i++) {
    const fraction = i / steps;
    const lat = startLat + (endLat - startLat) * fraction;
    const lng = startLng + (endLng - startLng) * fraction;
    
    // Add small realistic road deviation (alternating lateral offset)
    const offset = Math.sin(fraction * Math.PI) * 0.003 * (i % 2 === 0 ? 1 : -1);
    points.push([
      Math.round((lng + offset) * 100000) / 100000,
      Math.round((lat + offset) * 100000) / 100000
    ]);
  }
  points.push([endLng, endLat]);
  return points;
}

module.exports = {
  calculateDistanceKm,
  estimateEtaMinutes,
  generateRouteCoordinates
};
