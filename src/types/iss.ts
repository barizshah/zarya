export interface ISSPosition {
  latitude: number;
  longitude: number;
  altitude: number; // in km
  velocity: number; // in km/h
  visibility: 'daylight' | 'eclipsed';
  footprint: number;
  timestamp: number;
  solarLat?: number;
  solarLon?: number;
  locationName?: string;
  countryCode?: string;
}

export interface OrbitPoint {
  lat: number;
  lng: number;
  timestamp: number;
  isSunlit: boolean;
}

export interface CameraFeed {
  id: string;
  name: string;
  subtitle: string;
  youtubeId: string;
  quality: string;
  description: string;
  type: 'earth' | 'ops' | '4k';
  badge: string;
}

export interface Astronaut {
  name: string;
  craft: string;
  role: string;
  agency: string;
  flag: string;
  nationality?: string;
  launchDate?: string; // ISO date string of arrival to ISS
  photoUrl?: string;
  bio?: string;
  funFact?: string;
}

export interface RocketLaunch {
  id: string;
  name: string;
  missionName: string;
  net: string; // ISO date string
  rocketName: string;
  provider: string;
  padName: string;
  locationName: string;
  status: string;
  description: string;
  imageUrl?: string;
}

export interface ISSPass {
  risetime: number; // Unix timestamp in seconds
  duration: number; // in seconds
  maxElevation: number; // in degrees
  startAzimuth: string; // e.g. "SW"
  endAzimuth: string; // e.g. "NE"
  visibilityType: 'Visible (Clear Twilight)' | 'Daylight' | 'Deep Night Shadow';
  isNakedEyeVisible: boolean;
  magnitude?: number; // apparent magnitude (lower = brighter, -6 to +3 typical for ISS)
  brightnessLabel?: string; // e.g. "Brilliant", "Bright", "Faint"
}

export interface ISSWeather {
  temperature: number; // in °C
  weatherCode: number;
  conditionText: string;
  cloudCover: number; // %
  windSpeed: number; // km/h
}

export interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  type: string;
}

