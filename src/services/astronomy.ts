/**
 * Astronomical and orbital mechanics calculations
 */

/**
 * Calculate the day/night solar terminator boundary polygon.
 * Produces a closed polygon covering the night hemisphere without self-intersecting.
 */
export function getTerminatorCoordinates(
  solarLatDeg: number = 0,
  solarLonDeg: number = 0
): [number, number][] {
  const sunLon = (solarLonDeg * Math.PI) / 180.0;
  const sunLat = (solarLatDeg * Math.PI) / 180.0;
  const boundary: [number, number][] = [];

  // Generate points along the terminator curve from -180 to 180 deg
  const safeSunLat = Math.abs(sunLat) < 0.001 ? 0.001 : sunLat;

  for (let lonDeg = -180.0; lonDeg <= 180.0; lonDeg += 2.0) {
    const lon = (lonDeg * Math.PI) / 180.0;
    const tanLat = -Math.cos(sunLon - lon) / Math.tan(safeSunLat);
    const lat = Math.atan(tanLat);
    const latDeg = (lat * 180.0) / Math.PI;
    boundary.push([latDeg, lonDeg]);
  }

  // Close over the dark pole (if sun is north, south pole is dark, and vice versa)
  const nearPoleLat = safeSunLat >= 0 ? -89.9 : 89.9;
  boundary.push([nearPoleLat, 180.0]);
  boundary.push([nearPoleLat, -180.0]);
  boundary.push(boundary[0]);

  return boundary;
}

/**
 * Generate orbital track points for past (-45m) and future (+90m) trajectory.
 * The ISS orbit has an inclination of 51.64° and a period of ~92.68 minutes.
 * Earth rotates westward beneath the orbit at ~0.25°/min (360°/1440m).
 */
export function generateOrbitalTrack(
  currentLat: number,
  currentLng: number
): { past: [number, number][][]; future: [number, number][][] } {
  const inclinationDeg = 51.64;
  const periodMinutes = 92.68;
  const earthRotRate = 360 / (24 * 60); // 0.25 deg/min

  // Estimate orbital phase from current latitude
  const clampedRatio = Math.max(-1, Math.min(1, currentLat / inclinationDeg));
  let phase = Math.asin(clampedRatio);

  // Sample points every 1 minute
  const computePoint = (m: number): [number, number] => {
    const ptPhase = phase + (m / periodMinutes) * 2 * Math.PI;
    const lat = inclinationDeg * Math.sin(ptPhase);
    const orbitProg = (m / periodMinutes) * 360 * Math.cos((inclinationDeg * Math.PI) / 180);
    const earthDrift = m * earthRotRate;
    let lng = currentLng + orbitProg - earthDrift;
    lng = ((((lng + 180) % 360) + 360) % 360) - 180;
    return [lat, lng];
  };

  // Build past trajectory (-45 mins to 0)
  const pastRaw: [number, number][] = [];
  for (let m = -45; m <= 0; m += 1) {
    pastRaw.push(computePoint(m));
  }
  pastRaw.push([currentLat, currentLng]);

  // Build future trajectory (0 to +90 mins)
  const futureRaw: [number, number][] = [];
  futureRaw.push([currentLat, currentLng]);
  for (let m = 1; m <= 92; m += 1) {
    futureRaw.push(computePoint(m));
  }

  // Split polyline at the anti-meridian (|lng difference| > 180) to avoid ugly horizontal crossing lines
  const splitSegments = (points: [number, number][]): [number, number][][] => {
    const segments: [number, number][][] = [];
    let currentSegment: [number, number][] = [];

    for (let i = 0; i < points.length; i++) {
      const pt = points[i];
      if (currentSegment.length > 0) {
        const prev = currentSegment[currentSegment.length - 1];
        if (Math.abs(pt[1] - prev[1]) > 180) {
          segments.push(currentSegment);
          currentSegment = [pt];
          continue;
        }
      }
      currentSegment.push(pt);
    }
    if (currentSegment.length > 0) {
      segments.push(currentSegment);
    }
    return segments;
  };

  return {
    past: splitSegments(pastRaw),
    future: splitSegments(futureRaw),
  };
}
