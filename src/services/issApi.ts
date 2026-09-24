import type { ISSPosition, Astronaut, NominatimResult, ISSPass } from '../types/iss';

// Primary endpoint: wheretheiss.at
const WHERETHEISS_BASE = 'https://api.wheretheiss.at/v1';

// Fallback: SGP orbital propagation cloud function endpoint
const SGP_ENDPOINT = 'https://us-central1-iss-hd-live-android.cloudfunctions.net/getISSPositionSGPEndpoint';

/**
 * Fetch current ISS position with fallback redundancy
 */
export async function fetchISSPosition(): Promise<ISSPosition> {
  try {
    // Attempt 1: WhereTheISS.at
    const res = await fetch(`${WHERETHEISS_BASE}/satellites/25544`, {
      headers: { 'Accept': 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      const lat = data.latitude;
      const lon = data.longitude;
      const altitude = data.altitude; // km
      const velocity = data.velocity; // km/h
      const footprint = data.footprint || 4500;
      const timestamp = data.timestamp * 1000;
      const isSun = data.visibility === 'daylight';

      // Attempt reverse geocoding with 2.5s timeout
      let locationName = getWaterBodyName(lat, lon);
      let countryCode = '';
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const geoRes = await fetch(`${WHERETHEISS_BASE}/coordinates/${lat.toFixed(4)},${lon.toFixed(4)}`, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' },
        });
        clearTimeout(timeoutId);

        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.country_code && geoData.country_code !== '??') {
            countryCode = geoData.country_code;
            locationName = geoData.name || `Over ${countryCode}`;
          }
        }
      } catch {
        // Fallback already assigned via getWaterBodyName
      }

      return {
        latitude: lat,
        longitude: lon,
        altitude,
        velocity,
        visibility: (data.visibility === 'daylight' || isSun) ? 'daylight' : 'eclipsed',
        footprint,
        timestamp,
        solarLat: data.solar_lat ?? 0,
        solarLon: data.solar_lon ?? 0,
        locationName,
        countryCode
      };
    }
  } catch (err) {
    console.warn('WhereTheISS endpoint unavailable, trying SGP endpoint fallback...', err);
  }

  // Attempt 2: SGP Cloud Function
  try {
    const res = await fetch(SGP_ENDPOINT, {
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const { latitude, longitude, altitude, velocity } = json.data;
        let normalizedLng = longitude;
        if (normalizedLng > 180 || normalizedLng < -180) {
          normalizedLng = ((normalizedLng + 180) % 360) - 180;
        }
        const now = Date.now();
        return {
          latitude,
          longitude: normalizedLng,
          altitude: altitude || 418,
          velocity: velocity || 27580,
          visibility: 'daylight',
          footprint: 4500,
          timestamp: now,
          locationName: getWaterBodyName(latitude, normalizedLng)
        };
      }
    }
  } catch (err) {
    console.warn('SGP endpoint failed, using mathematical orbital estimate', err);
  }

  // Attempt 3: Mathematical fallback (approx. 51.6° orbit)
  const now = Date.now();
  const periodMinutes = 92.68;
  const phase = ((now / 1000 / 60) % periodMinutes) / periodMinutes * 2 * Math.PI;
  const simulatedLat = 51.64 * Math.sin(phase);
  const simulatedLng = (((now / 1000 / 60) * 4) % 360) - 180;

  return {
    latitude: simulatedLat,
    longitude: simulatedLng,
    altitude: 418.5,
    velocity: 27580,
    visibility: 'daylight',
    footprint: 4500,
    timestamp: now,
    solarLat: 0,
    solarLon: 0,
    locationName: getWaterBodyName(simulatedLat, simulatedLng)
  };
}

/**
 * Approximate geographical land mass, sea or ocean region by coordinates
 */
export function getWaterBodyName(lat: number, lon: number): string {
  // Land approximations
  if (lat >= -35 && lat <= 38 && lon >= -18 && lon <= 52) {
    if (lat >= 30 && lat <= 45 && lon >= -6 && lon <= 36) return 'Mediterranean Sea';
    if (lat >= 12 && lat <= 30 && lon >= 32 && lon <= 44) return 'Red Sea';
    if (lat > 0) return 'African Continent (North)';
    return 'African Continent (South)';
  }
  if (lat >= 36 && lat <= 71 && lon >= -10 && lon <= 40) return 'European Continent';
  if (lat >= 10 && lat <= 55 && lon >= 60 && lon <= 145) {
    if (lat >= 8 && lat <= 37 && lon >= 68 && lon <= 97) return 'South Asia';
    if (lat >= 20 && lat <= 50 && lon >= 100 && lon <= 140) return 'East Asia';
    return 'Central / North Asia';
  }
  if (lat >= 15 && lat <= 72 && lon >= -168 && lon <= -52) {
    if (lat >= 25 && lat <= 49 && lon >= -125 && lon <= -67) return 'North America';
    if (lat < 25) return 'Central America / Caribbean Sea';
    return 'Canada / Alaska';
  }
  if (lat >= -56 && lat < 15 && lon >= -82 && lon <= -34) return 'South American Continent';
  if (lat >= -45 && lat <= -10 && lon >= 112 && lon <= 154) return 'Australian Continent';

  // Detailed Seas, Gulfs, Straits, and Bays
  if (lat >= 10 && lat <= 25 && lon >= -85 && lon <= -60) return 'Caribbean Sea';
  if (lat >= 18 && lat <= 30 && lon >= -98 && lon <= -80) return 'Gulf of Mexico';
  if (lat >= 24 && lat <= 35 && lon >= -75 && lon <= -55) return 'Sargasso Sea';
  if (lat >= 50 && lat <= 66 && lon >= -180 && lon <= -160) return 'Bering Sea';
  if (lat >= 20 && lat <= 32 && lon >= 48 && lon <= 57) return 'Persian Gulf';
  if (lat >= 22 && lat <= 26 && lon >= 56 && lon <= 60) return 'Gulf of Oman';
  if (lat >= 10 && lat <= 15 && lon >= 43 && lon <= 52) return 'Gulf of Aden';
  if (lat >= 54 && lat <= 66 && lon >= 10 && lon <= 30) return 'Baltic Sea';
  if (lat >= 51 && lat <= 62 && lon >= -4 && lon <= 9) return 'North Sea';
  if (lat >= 48 && lat <= 52 && lon >= -6 && lon <= 2) return 'English Channel';
  if (lat >= 43 && lat <= 48 && lon >= -10 && lon <= -1) return 'Bay of Biscay';
  if (lat >= 60 && lat <= 72 && lon >= -5 && lon <= 15) return 'Norwegian Sea';
  if (lat >= 68 && lat <= 78 && lon >= 20 && lon <= 55) return 'Barents Sea';
  if (lat >= 40 && lat <= 47 && lon >= 27 && lon <= 42) return 'Black Sea';
  if (lat >= 36 && lat <= 47 && lon >= 46 && lon <= 54) return 'Caspian Sea';
  if (lat >= 0 && lat <= 25 && lon >= 100 && lon <= 125) return 'South China Sea';
  if (lat >= 24 && lat <= 40 && lon >= 118 && lon <= 130) return 'East China Sea / Yellow Sea';
  if (lat >= 33 && lat <= 46 && lon >= 128 && lon <= 142) return 'Sea of Japan (East Sea)';
  if (lat >= 44 && lat <= 60 && lon >= 135 && lon <= 160) return 'Sea of Okhotsk';
  if (lat >= 5 && lat <= 26 && lon >= 125 && lon <= 145) return 'Philippine Sea';
  if (lat >= 0 && lat <= 25 && lon >= 50 && lon <= 78) return 'Arabian Sea';
  if (lat >= 5 && lat <= 22 && lon >= 80 && lon <= 95) return 'Bay of Bengal';
  if (lat >= -12 && lat <= 0 && lon >= 98 && lon <= 120) return 'Java Sea / Indonesian Archipelago';
  if (lat >= -25 && lat <= -10 && lon >= 142 && lon <= 170) return 'Coral Sea';
  if (lat >= -45 && lat <= -25 && lon >= 150 && lon <= 175) return 'Tasman Sea';
  if (lat >= -15 && lat <= -8 && lon >= 125 && lon <= 135) return 'Timor Sea';
  if (lat >= -20 && lat <= -10 && lon >= 135 && lon <= 142) return 'Gulf of Carpentaria';
  if (lat >= -40 && lat <= -30 && lon >= 115 && lon <= 138) return 'Great Australian Bight';
  if (lat >= 51 && lat <= 64 && lon >= -95 && lon <= -75) return 'Hudson Bay';
  if (lat >= 50 && lat <= 65 && lon >= -65 && lon <= -45) return 'Labrador Sea';
  if (lat >= -26 && lat <= -10 && lon >= 38 && lon <= 48) return 'Mozambique Channel';
  if (lat >= 30 && lat <= 45 && lon >= 12 && lon <= 20) return 'Adriatic Sea';
  if (lat >= 35 && lat <= 42 && lon >= 23 && lon <= 28) return 'Aegean Sea';

  // Oceans
  if (lat > 66) return 'Arctic Ocean';
  if (lat < -60) return 'Southern Ocean';
  if (lon > -70 && lon < 20 && lat > 0) return 'North Atlantic Ocean';
  if (lon > -70 && lon < 20 && lat <= 0) return 'South Atlantic Ocean';
  if (lon >= 20 && lon <= 110 && lat <= 25) return 'Indian Ocean';
  if ((lon > 110 || lon < -70) && lat > 0) return 'North Pacific Ocean';
  if ((lon > 110 || lon < -70) && lat <= 0) return 'South Pacific Ocean';
  return 'International Airspace / Open Ocean';
}

/**
 * Expedition 73 crew with enriched data (as of Sep 2026)
 * Craft: Crew Dragon Endurance (Crew-12) / Soyuz MS-29
 */
const EXPEDITION_73_CREW: Astronaut[] = [
  {
    name: 'Jessica Meir',
    craft: 'Crew Dragon Endurance (Crew-12)',
    role: 'Commander',
    agency: 'NASA',
    flag: '🇺🇸',
    nationality: 'American',
    launchDate: '2026-04-11',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Jessica_Meir_official_portrait_%282019%29.jpg/440px-Jessica_Meir_official_portrait_%282019%29.jpg',
    bio: 'Marine biologist and NASA astronaut. Former record-holder for the first all-female spacewalk with Christina Koch in 2019.',
    funFact: 'Jessica earned her PhD studying how diving birds physiologically adapt to extreme cold — then applied that same curiosity to space physiology aboard the ISS.',
  },
  {
    name: 'Jack Hathaway',
    craft: 'Crew Dragon Endurance (Crew-12)',
    role: 'Pilot',
    agency: 'NASA',
    flag: '🇺🇸',
    nationality: 'American',
    launchDate: '2026-04-11',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/NASA_astronaut_Jack_Hathaway.jpg/440px-NASA_astronaut_Jack_Hathaway.jpg',
    bio: 'US Navy test pilot and NASA astronaut. Selected in the 2017 astronaut class, known as "the Turtles".',
    funFact: 'Before joining NASA, Jack logged over 2,500 flight hours in 40 different aircraft types.',
  },
  {
    name: 'Sophie Adenot',
    craft: 'Crew Dragon Endurance (Crew-12)',
    role: 'Flight Engineer',
    agency: 'ESA',
    flag: '🇫🇷',
    nationality: 'French',
    launchDate: '2026-04-11',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/ESA_astronaut_Sophie_Adenot.jpg/440px-ESA_astronaut_Sophie_Adenot.jpg',
    bio: 'ESA astronaut and French Army helicopter test pilot. Part of the 2022 ESA astronaut class — one of Europe\'s newest spacefarers.',
    funFact: 'Sophie is one of only four women selected in ESA\'s 2022 astronaut class and her first spaceflight is on Expedition 73.',
  },
  {
    name: 'Anil Menon',
    craft: 'Crew Dragon Endurance (Crew-12)',
    role: 'Mission Specialist',
    agency: 'NASA',
    flag: '🇺🇸',
    nationality: 'American',
    launchDate: '2026-04-11',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Anil_Menon_official_portrait.jpg/440px-Anil_Menon_official_portrait.jpg',
    bio: 'NASA astronaut and SpaceX launch director. Anil was the flight surgeon and first SpaceX human spaceflight director before joining the astronaut corps in 2021.',
    funFact: 'Dr. Menon served as the medical officer on the first Crew Dragon launch (Demo-2) in 2020 before becoming an astronaut himself.',
  },
  {
    name: 'Andrey Fedyaev',
    craft: 'Soyuz MS-29',
    role: 'Soyuz Commander',
    agency: 'Roscosmos',
    flag: '🇷🇺',
    nationality: 'Russian',
    launchDate: '2026-04-14',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Andrey_Fedyaev_%28GCTC%2C_2019%29.jpg/440px-Andrey_Fedyaev_%28GCTC%2C_2019%29.jpg',
    bio: 'Roscosmos cosmonaut and pilot who previously flew on Crew-5 as a mission specialist with NASA.',
    funFact: 'Andrey is one of the few cosmonauts to have flown on both a Soyuz spacecraft and a SpaceX Crew Dragon.',
  },
  {
    name: 'Pyotr Dubrov',
    craft: 'Soyuz MS-29',
    role: 'Flight Engineer',
    agency: 'Roscosmos',
    flag: '🇷🇺',
    nationality: 'Russian',
    launchDate: '2026-04-14',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Pyotr_Dubrov_official_portrait_%28GCTC%29.jpg/440px-Pyotr_Dubrov_official_portrait_%28GCTC%29.jpg',
    bio: 'Roscosmos cosmonaut on his second spaceflight. His first mission extended to a record-breaking 355 days aboard ISS.',
    funFact: 'During his 355-day mission, Pyotr\'s bones and muscles underwent the most extreme microgravity adaptation data ever recorded by Russian science.',
  },
  {
    name: 'Anna Kikina',
    craft: 'Soyuz MS-29',
    role: 'Flight Engineer',
    agency: 'Roscosmos',
    flag: '🇷🇺',
    nationality: 'Russian',
    launchDate: '2026-04-14',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Anna_Kikina_%28GCTC%2C_2022%29.jpg/440px-Anna_Kikina_%28GCTC%2C_2022%29.jpg',
    bio: 'Roscosmos cosmonaut and the only active female cosmonaut in Russia. Previously flew on SpaceX Crew-5 in 2022.',
    funFact: 'Anna is Russia\'s only active female cosmonaut and has performed multiple spacewalks in the Russian Orlan spacesuit.',
  },
];

/**
 * Fetch astronauts aboard the ISS
 */
export async function fetchISSCrew(): Promise<Astronaut[]> {
  try {
    const res = await fetch('https://corps-astros.pages.dev/astros.json');
    if (res.ok) {
      const data = await res.json();
      if (data && data.people) {
        const apiCrew = data.people
          .filter((p: { craft?: string }) => !p.craft || p.craft.toLowerCase().includes('iss'))
          .map((p: { name: string; craft: string }) => {
            // Try to match with our enriched crew data
            const enriched = EXPEDITION_73_CREW.find(
              (c) => c.name.toLowerCase() === p.name.toLowerCase()
            );
            if (enriched) return enriched;
            return {
              name: p.name,
              craft: p.craft || 'ISS',
              role: 'Flight Engineer',
              agency: 'International Crew',
              flag: '🇺🇳',
            };
          });
        if (apiCrew.length > 0) return apiCrew;
      }
    }
  } catch {
    // Fallback crew roster
  }

  return EXPEDITION_73_CREW;
}

/**
 * Search for a location by name using OpenStreetMap Nominatim geocoding
 */
export async function searchLocation(query: string): Promise<NominatimResult[]> {
  if (!query.trim() || query.trim().length < 2) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=0`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Zarya ISS Tracker (https://github.com/barizshah/zarya)',
      },
    });
    if (res.ok) {
      const results: NominatimResult[] = await res.json();
      return results;
    }
  } catch (err) {
    console.warn('Nominatim geocoding error:', err);
  }
  return [];
}

/**
 * Fetch upcoming orbital rocket launches from Launch Library 2 API with fallback data
 */
export async function fetchUpcomingLaunches(): Promise<import('../types/iss').RocketLaunch[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch('https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?limit=6', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.results && data.results.length > 0) {
        return data.results.map((item: any) => ({
          id: item.id || String(Math.random()),
          name: item.name || 'Orbital Launch',
          missionName: item.mission?.name || item.name || 'Satellite Deployment',
          net: item.net,
          rocketName: item.rocket?.configuration?.name || 'Launch Vehicle',
          provider: item.launch_service_provider?.name || 'Commercial Operator',
          padName: item.pad?.name || 'Launch Complex',
          locationName: item.pad?.location?.name || 'Spaceport',
          status: item.status?.name || 'Go for Launch',
          description: item.mission?.description || 'Orbital mission delivering science and satellite payloads to low Earth orbit.',
          imageUrl: item.image || undefined,
        }));
      }
    }
  } catch (err) {
    console.warn('Launch Library live fetch fallback:', err);
  }

  // Fallback upcoming orbital launches schedule
  const now = Date.now();
  return [
    {
      id: 'f9-starlink',
      name: 'Falcon 9 Block 5 | Starlink Group',
      missionName: 'Starlink Broadband Constellation',
      net: new Date(now + 14 * 3600 * 1000).toISOString(),
      rocketName: 'Falcon 9 Block 5',
      provider: 'SpaceX',
      padName: 'Space Launch Complex 40',
      locationName: 'Cape Canaveral SFS, FL, USA',
      status: 'Go for Launch',
      description: 'Deployment of next-generation high-bandwidth Starlink internet satellites into low Earth orbit.',
      imageUrl: 'https://images-assets.nasa.gov/image/KSC-20200530-PH-SPX01_0001/KSC-20200530-PH-SPX01_0001~large.jpg',
    },
    {
      id: 'f9-crew',
      name: 'Falcon 9 Block 5 | NASA Commercial Crew',
      missionName: 'ISS Expedition Crew Rotation',
      net: new Date(now + 48 * 3600 * 1000).toISOString(),
      rocketName: 'Falcon 9 Block 5',
      provider: 'SpaceX / NASA',
      padName: 'Launch Complex 39A',
      locationName: 'Kennedy Space Center, FL, USA',
      status: 'Go for Launch',
      description: 'Crew Dragon spacecraft transporting NASA and international partner astronauts to the ISS for a 6-month science expedition.',
      imageUrl: 'https://images-assets.nasa.gov/image/iss064e004546/iss064e004546~large.jpg',
    },
    {
      id: 'soyuz-progress',
      name: 'Soyuz-2.1a | Progress MS Resupply',
      missionName: 'ISS Cargo Resupply',
      net: new Date(now + 96 * 3600 * 1000).toISOString(),
      rocketName: 'Soyuz-2.1a',
      provider: 'Roscosmos',
      padName: 'Site 31/6',
      locationName: 'Baikonur Cosmodrome, Kazakhstan',
      status: 'Scheduled',
      description: 'Autonomous cargo spacecraft delivering 2.5 tons of food, fuel, scientific gear, and oxygen to the ISS.',
      imageUrl: 'https://images-assets.nasa.gov/image/jsc2020e016629/jsc2020e016629~large.jpg',
    },
    {
      id: 'electron-commercial',
      name: 'Electron | Dedicated Smallsat Mission',
      missionName: 'Earth Observation Radar CubeSats',
      net: new Date(now + 140 * 3600 * 1000).toISOString(),
      rocketName: 'Electron',
      provider: 'Rocket Lab',
      padName: 'Launch Complex 1A',
      locationName: 'Mahia Peninsula, New Zealand',
      status: 'Scheduled',
      description: 'Dedicated commercial rideshare launch deploying radar observation satellites into sun-synchronous orbit.',
    },
  ];
}

/**
 * Calculate apparent magnitude label for ISS pass based on peak elevation and slant range
 * Uses standard visual satellite photometric model:
 * m = H0 + 5 * log10(d / 1000) + atmospheric extinction
 * Standard ISS intrinsic absolute magnitude H0 ≈ -1.9 at 1,000 km distance
 * Ranges from -3.6 (74° zenith overhead) to -0.7 (12° low horizon)
 */
function getMagnitude(maxElevation: number, isVisible: boolean): { magnitude: number; brightnessLabel: string } {
  if (!isVisible) {
    return { magnitude: 99, brightnessLabel: 'Not Visible' };
  }

  const R = 6371.0;
  const H = 418.0;
  const el = Math.max(10, Math.min(90, maxElevation));
  const elRad = (el * Math.PI) / 180;

  // Exact slant range distance from observer to ISS (km)
  const slantKm = Math.sqrt(R * R * Math.sin(elRad) * Math.sin(elRad) + 2 * R * H + H * H) - R * Math.sin(elRad);

  // Rayleigh atmospheric extinction correction
  const extinction = 0.14 / (Math.sin(elRad) + 0.05);

  // Standard photometric magnitude equation
  const mag = parseFloat((-1.9 + 5 * Math.log10(slantKm / 1000) + extinction).toFixed(1));

  let brightnessLabel: string;
  if (mag <= -3.0) brightnessLabel = 'Brilliant';
  else if (mag <= -2.0) brightnessLabel = 'Very Bright';
  else if (mag <= -1.0) brightnessLabel = 'Bright';
  else if (mag <= 0.5) brightnessLabel = 'Moderate';
  else brightnessLabel = 'Faint';

  return { magnitude: mag, brightnessLabel };
}

/**
 * Calculate solar elevation angle in degrees for given date & observer coordinates
 */
function getSolarAltitudeDeg(date: Date, latDeg: number, lonDeg: number): number {
  const rad = Math.PI / 180;
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  // Solar declination approximation
  const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * rad) * rad;
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const solarTime = ((utcHours + lonDeg / 15) % 24 + 24) % 24;
  const hourAngle = (solarTime - 12) * 15 * rad;
  const latRad = latDeg * rad;
  const sinAlt = Math.sin(latRad) * Math.sin(declination) + Math.cos(latRad) * Math.cos(declination) * Math.cos(hourAngle);
  return Math.asin(Math.max(-1, Math.min(1, sinAlt))) * (180 / Math.PI);
}

/**
 * Calculate upcoming ISS passes for given coordinates over the next 10 days
 * Continuous time-step orbital propagation model
 * @param startOffsetMinutes Optional offset in minutes from now (e.g. to stitch after live API passes)
 */
export function calculateUpcomingPasses(lat: number, lon: number, startOffsetMinutes = 0): import('../types/iss').ISSPass[] {
  const nowMs = Date.now();
  const passes: import('../types/iss').ISSPass[] = [];

  const inc = (51.64 * Math.PI) / 180;
  const periodMin = 92.68;
  const earthRateDegPerMin = 360 / 1440; // 0.25 deg/min
  const raanPrecessionDegPerMin = 5.0 / 1440; // ~0.00347 deg/min westward nodal regression
  const R = 6371.0;
  const H = 418.0;

  const obsLatRad = (lat * Math.PI) / 180;
  const totalMinutes = 10 * 24 * 60; // 10 days = 14,400 minutes
  const stepMin = 0.5; // 30-second simulation steps for continuous precision

  const getCompass = (startLat: number, startLon: number, endLat: number, endLon: number): string => {
    const dLon = ((endLon - startLon) * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos((endLat * Math.PI) / 180);
    const x =
      Math.cos((startLat * Math.PI) / 180) * Math.sin((endLat * Math.PI) / 180) -
      Math.sin((startLat * Math.PI) / 180) * Math.cos((endLat * Math.PI) / 180) * Math.cos(dLon);
    const brng = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
    const compass = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return compass[Math.round(brng / 22.5) % 16];
  };

  let inPass = false;
  let passStartMin = 0;
  let passMaxEl = -90;
  let passPeakMin = 0;
  let passStartLat = 0;
  let passStartLon = 0;
  let passPeakLat = 0;
  let passPeakLon = 0;
  let passEndLat = 0;
  let passEndLon = 0;

  for (let m = Math.max(0, startOffsetMinutes); m <= totalMinutes; m += stepMin) {
    const u = (m / periodMin) * 2 * Math.PI;
    const satLat = Math.asin(Math.sin(inc) * Math.sin(u));
    const satLonDeg =
      ((((u * 180) / Math.PI) * Math.cos(inc) - m * (earthRateDegPerMin + raanPrecessionDegPerMin) + 180) % 360 + 360) %
        360 -
      180;
    const satLatDeg = (satLat * 180) / Math.PI;

    // Great circle angle gamma
    const cosGamma =
      Math.sin(obsLatRad) * Math.sin(satLat) +
      Math.cos(obsLatRad) * Math.cos(satLat) * Math.cos(((lon - satLonDeg) * Math.PI) / 180);
    const gamma = Math.acos(Math.max(-1, Math.min(1, cosGamma)));
    const sinGamma = Math.sin(gamma);
    const el = Math.atan2(cosGamma - R / (R + H), sinGamma) * (180 / Math.PI);

    if (el >= 10.0) {
      if (!inPass) {
        inPass = true;
        passStartMin = m;
        passMaxEl = el;
        passPeakMin = m;
        passStartLat = satLatDeg;
        passStartLon = satLonDeg;
        passPeakLat = satLatDeg;
        passPeakLon = satLonDeg;
      } else {
        if (el > passMaxEl) {
          passMaxEl = el;
          passPeakMin = m;
          passPeakLat = satLatDeg;
          passPeakLon = satLonDeg;
        }
      }
      passEndLat = satLatDeg;
      passEndLon = satLonDeg;
    } else {
      if (inPass) {
        inPass = false;
        const passEndMin = m;
        const durationSec = Math.round((passEndMin - passStartMin) * 60);

        // Only register if pass had a genuine duration
        if (durationSec >= 90) {
          const risetime = Math.round((nowMs + passStartMin * 60 * 1000) / 1000);
          const highestTime = Math.round((nowMs + passPeakMin * 60 * 1000) / 1000);
          const endTime = Math.round((nowMs + passEndMin * 60 * 1000) / 1000);
          const roundedMaxEl = Math.round(passMaxEl);

          const peakDate = new Date(highestTime * 1000);
          const solarAlt = getSolarAltitudeDeg(peakDate, lat, lon);

          // Classification:
          // Civil to astronomical twilight: -18° <= solarAlt <= -6° => Visible
          // Daylight: solarAlt > -6° => Daylight Pass
          // Night shadow: solarAlt < -18° => Night (Unlit)
          let passTypeLabel: 'VISIBLE' | 'DAYLIGHT PASS' | 'NIGHT (UNLIT)';
          let visibilityType: import('../types/iss').ISSPass['visibilityType'];
          let isNakedEyeVisible = false;
          let subtleNote = '';

          if (solarAlt >= -18 && solarAlt <= -6.0) {
            passTypeLabel = 'VISIBLE';
            visibilityType = 'Visible (Clear Twilight)';
            isNakedEyeVisible = true;
            subtleNote = roundedMaxEl >= 40
              ? 'High overhead in twilight — exceptionally bright and easy to spot.'
              : 'Twilight pass — steady point of light gliding across the horizon.';
          } else if (solarAlt > -6.0) {
            passTypeLabel = 'DAYLIGHT PASS';
            visibilityType = 'Daylight';
            isNakedEyeVisible = false;
            subtleNote = 'Overhead in daylight — watch your city live on the ISS 4K external cameras.';
          } else {
            passTypeLabel = 'NIGHT (UNLIT)';
            visibilityType = 'Deep Night Shadow';
            isNakedEyeVisible = false;
            subtleNote = 'Eclipsed in Earth shadow — station cameras capture city lights and auroras.';
          }

          const { magnitude, brightnessLabel } = getMagnitude(roundedMaxEl, isNakedEyeVisible);

          const startAz = getCompass(lat, lon, passStartLat, passStartLon);
          const highestAz = getCompass(lat, lon, passPeakLat, passPeakLon);
          const endAz = getCompass(lat, lon, passEndLat, passEndLon);

          passes.push({
            risetime,
            duration: durationSec,
            maxElevation: roundedMaxEl,
            startAzimuth: startAz,
            startElevation: 10,
            highestAzimuth: highestAz,
            highestElevation: roundedMaxEl,
            endAzimuth: endAz,
            endElevation: 10,
            highestTime,
            endTime,
            visibilityType,
            passTypeLabel,
            isNakedEyeVisible,
            magnitude: isNakedEyeVisible ? magnitude : undefined,
            brightnessLabel: isNakedEyeVisible ? brightnessLabel : 'Not Visible',
            subtleNote,
            dateLabel: peakDate.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }),
            startTimeStr: new Date(risetime * 1000).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            highestTimeStr: peakDate.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            endTimeStr: new Date(endTime * 1000).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
          });
        }
        passMaxEl = -90;
      }
    }
  }

  return passes;
}

interface PolluxPass {
  rise: { time: string; azimuth_deg: number; compass: string };
  culmination: { time: string; elevation_deg: number };
  set: { time: string; azimuth_deg: number; compass: string };
  duration_sec: number;
  above_horizon: boolean;
  visible: boolean;
}

interface PolluxResponse {
  passes: PolluxPass[];
}

/**
 * High-Accuracy Hybrid Pass Engine:
 * 1. Primary: Queries Pollux Labs live SGP4 / Skyfield API (real-time CelesTrak TLEs).
 * 2. Fallback: Seamless in-browser continuous mathematical propagator if offline/timeout.
 */
export async function fetchUpcomingPasses(lat: number, lon: number): Promise<ISSPass[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7500);

    const url = `https://iss-api.polluxlabs.io/iss-pass?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}&n=20`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data: PolluxResponse = await res.json();
      if (Array.isArray(data.passes) && data.passes.length > 0) {
        const mappedPasses: ISSPass[] = data.passes.map((p) => {
          const risetime = Math.round(new Date(p.rise.time).getTime() / 1000);
          const highestTime = Math.round(new Date(p.culmination.time).getTime() / 1000);
          const endTime = Math.round(new Date(p.set.time).getTime() / 1000);
          const roundedMaxEl = Math.round(p.culmination.elevation_deg);
          const peakDate = new Date(highestTime * 1000);

          // Solar altitude at observer location during peak
          const solarAlt = getSolarAltitudeDeg(peakDate, lat, lon);

          let passTypeLabel: 'VISIBLE' | 'DAYLIGHT PASS' | 'NIGHT (UNLIT)';
          let visibilityType: import('../types/iss').ISSPass['visibilityType'];
          let isNakedEyeVisible = false;
          let subtleNote = '';

          // Pollux Labs visible flag evaluates both satellite illumination and observer darkness
          if (p.visible) {
            passTypeLabel = 'VISIBLE';
            visibilityType = 'Visible (Clear Twilight)';
            isNakedEyeVisible = true;
            subtleNote = roundedMaxEl >= 40
              ? 'High overhead in twilight — exceptionally bright and easy to spot.'
              : 'Twilight pass — steady point of light gliding across the horizon.';
          } else if (solarAlt > -6.0) {
            passTypeLabel = 'DAYLIGHT PASS';
            visibilityType = 'Daylight';
            isNakedEyeVisible = false;
            subtleNote = 'Overhead in daylight — watch your city live on the ISS 4K external cameras.';
          } else {
            passTypeLabel = 'NIGHT (UNLIT)';
            visibilityType = 'Deep Night Shadow';
            isNakedEyeVisible = false;
            subtleNote = 'Eclipsed in Earth shadow — station cameras capture city lights and auroras.';
          }

          const { magnitude, brightnessLabel } = getMagnitude(roundedMaxEl, isNakedEyeVisible);

          return {
            risetime,
            duration: p.duration_sec,
            maxElevation: roundedMaxEl,
            startAzimuth: p.rise.compass || 'N',
            startElevation: 10,
            highestAzimuth: '',
            highestElevation: roundedMaxEl,
            endAzimuth: p.set.compass || 'S',
            endElevation: 10,
            highestTime,
            endTime,
            visibilityType,
            passTypeLabel,
            isNakedEyeVisible,
            magnitude: isNakedEyeVisible ? magnitude : undefined,
            brightnessLabel: isNakedEyeVisible ? brightnessLabel : 'Not Visible',
            subtleNote,
            dateLabel: peakDate.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }),
            startTimeStr: new Date(risetime * 1000).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            highestTimeStr: peakDate.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            endTimeStr: new Date(endTime * 1000).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
          };
        });

        // Return purely genuine high-precision passes from SGP4 engine without extra synthetic passes
        return mappedPasses;
      }
    }
  } catch {
    // Graceful fallback to continuous mathematical propagator if live endpoint is unreachable
  }

  return calculateUpcomingPasses(lat, lon);
}

/**
 * WMO Weather interpretation codes (WW)
 */
function getWeatherCondition(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1) return 'Mainly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Fog / Haze';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain Showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Fair';
}

/**
 * Fetch surface weather at ISS sub-satellite coordinates
 * Uses Open-Meteo free API (no key required, fast response)
 */
export async function fetchISSWeather(lat: number, lon: number): Promise<import('../types/iss').ISSWeather | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(2)}&longitude=${lon.toFixed(2)}&current=temperature_2m,weather_code,cloud_cover,wind_speed_10m`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.current) {
        return {
          temperature: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weather_code ?? 0,
          conditionText: getWeatherCondition(data.current.weather_code ?? 0),
          cloudCover: Math.round(data.current.cloud_cover ?? 0),
          windSpeed: Math.round(data.current.wind_speed_10m ?? 0),
        };
      }
    }
  } catch {
    // Gracefully handle network timeouts or ocean areas without readings
  }
  return null;
}

