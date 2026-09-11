const prisma = require('../config/db');
const { calculateDistanceKm, estimateEtaMinutes } = require('../utils/geo');

const recommendationService = {
  async getRecommendations({ latitude, longitude, requiresIcu = false, requiresVentilator = false }) {
    const hospitals = await prisma.hospital.findMany({
      include: { resources: true }
    });

    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);

    const scoredHospitals = hospitals.map((hospital) => {
      const res = hospital.resources || {};
      const distanceKm = calculateDistanceKm(userLat, userLng, hospital.latitude, hospital.longitude);
      const etaMinutes = estimateEtaMinutes(distanceKm);

      // Scoring Breakdown (0 - 100 max)
      // 1. Travel Time Factor (0 - 35 points) - 5 min = 35 pts, 25+ min = 0 pts
      const timeScore = Math.max(0, Math.min(35, Math.round(35 - (etaMinutes - 3) * 1.5)));

      // 2. Emergency Bed Availability (0 - 25 points) - 10+ beds = 25 pts, 0 beds = 0 pts
      const erBeds = res.emergencyBedsAvailable || 0;
      const erScore = Math.min(25, Math.round(erBeds * 2.5));

      // 3. ICU Availability (0 - 15 points) - 5+ beds = 15 pts
      const icuBeds = res.icuBedsAvailable || 0;
      const icuScore = Math.min(15, Math.round(icuBeds * 3));

      // 4. Ventilator Availability (0 - 10 points) - 4+ = 10 pts
      const vents = res.ventilatorsAvailable || 0;
      const ventScore = Math.min(10, Math.round(vents * 2.5));

      // 5. Hospital Acceptance Status (0 - 15 points)
      let statusScore = 0;
      if (hospital.emergencyStatus === 'ACCEPTING') statusScore = 15;
      else if (hospital.emergencyStatus === 'LIMITED') statusScore = 8;
      else if (hospital.emergencyStatus === 'CRITICAL') statusScore = 3;
      else if (hospital.emergencyStatus === 'FULL' || hospital.emergencyStatus === 'OFFLINE') statusScore = 0;

      // Penalties if specific equipment required is missing
      let penalty = 0;
      if (requiresIcu && icuBeds === 0) penalty += 30;
      if (requiresVentilator && vents === 0) penalty += 20;

      const totalScore = Math.max(0, Math.min(100, (timeScore + erScore + icuScore + ventScore + statusScore) - penalty));

      // Reasons why recommended
      const reasons = [];
      if (etaMinutes <= 8) reasons.push('Short ETA (< 8 min)');
      else if (etaMinutes <= 15) reasons.push('Moderate travel time');

      if (erBeds >= 6) reasons.push('High emergency bed capacity');
      else if (erBeds > 0) reasons.push('Emergency beds available');

      if (icuBeds >= 2) reasons.push('ICU units ready');
      if (vents >= 2) reasons.push('Ventilators on standby');
      if (res.traumaTeamAvailable) reasons.push('Trauma surgical team active');
      if (hospital.emergencyStatus === 'ACCEPTING') reasons.push('Currently accepting all critical admissions');

      return {
        hospital: {
          id: hospital.id,
          name: hospital.name,
          address: hospital.address,
          latitude: hospital.latitude,
          longitude: hospital.longitude,
          emergencyStatus: hospital.emergencyStatus,
          resources: res
        },
        distanceKm,
        etaMinutes,
        score: totalScore,
        scoreBreakdown: {
          travelTimePoints: timeScore,
          emergencyBedsPoints: erScore,
          icuPoints: icuScore,
          ventilatorPoints: ventScore,
          statusPoints: statusScore,
          penaltyPoints: penalty
        },
        reasons
      };
    });

    // Sort descending by score, then ascending by ETA
    scoredHospitals.sort((a, b) => b.score - a.score || a.etaMinutes - b.etaMinutes);

    return scoredHospitals;
  }
};

module.exports = recommendationService;
