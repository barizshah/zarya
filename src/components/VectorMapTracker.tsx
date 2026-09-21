import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { ISSPosition } from '../types/iss';
import { getTerminatorCoordinates, generateOrbitalTrack } from '../services/astronomy';

interface VectorMapTrackerProps {
  telemetry: ISSPosition | null;
  showOrbit?: boolean;
  showTerminator?: boolean;
}

export const VectorMapTracker: React.FC<VectorMapTrackerProps> = ({
  telemetry,
  showOrbit = true,
  showTerminator = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const issMarkerRef = useRef<L.Marker | null>(null);
  const pastTrackGroupRef = useRef<L.LayerGroup | null>(null);
  const futureTrackGroupRef = useRef<L.LayerGroup | null>(null);
  const terminatorPolygonRef = useRef<L.Polygon | null>(null);

  // Initialize Leaflet map with dark nolabels tiles
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [25, 0],
      zoom: 2.1,
      minZoom: 1.5,
      maxZoom: 10,
      worldCopyJump: true,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark tiles without any labels (matching mockup's clean continent aesthetics)
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png',
      {
        subdomains: 'abcd',
        maxZoom: 18,
      }
    ).addTo(map);

    // Zoom control at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    pastTrackGroupRef.current = L.layerGroup().addTo(map);
    futureTrackGroupRef.current = L.layerGroup().addTo(map);

    mapRef.current = map;

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update ISS position, glowing trajectory lines, and night terminator
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !telemetry) return;

    const lat = telemetry.latitude;
    const lng = telemetry.longitude;
    const latLng: L.LatLngTuple = [lat, lng];

    // 1. ISS Marker: Glowing Amber Halo + Yellow Core Dot from Mockup
    const issMarkerHtml = `
      <div class="relative flex items-center justify-center w-12 h-12 -ml-6 -mt-6 pointer-events-none">
        <!-- Outer Glowing Radial Pulse -->
        <div class="absolute w-11 h-11 rounded-full bg-amber-400/25 animate-ping"></div>
        <!-- Soft Amber Halo Bloom -->
        <div class="absolute w-8 h-8 rounded-full bg-amber-400/40 blur-[3px]"></div>
        <!-- Thin Amber Ring -->
        <div class="absolute w-6 h-6 rounded-full border border-amber-300/80"></div>
        <!-- Bright Solid Yellow Core Beacon -->
        <div class="relative w-2.5 h-2.5 rounded-full bg-yellow-100 shadow-[0_0_12px_#fde047]"></div>
      </div>
    `;

    const issIcon = L.divIcon({
      className: 'zarya-mockup-marker',
      html: issMarkerHtml,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    if (!issMarkerRef.current) {
      issMarkerRef.current = L.marker(latLng, { icon: issIcon, zIndexOffset: 2000 }).addTo(map);
    } else {
      issMarkerRef.current.setLatLng(latLng);
    }

    // 2. Day/Night Solar Terminator Shadow Overlay
    if (terminatorPolygonRef.current) {
      map.removeLayer(terminatorPolygonRef.current);
      terminatorPolygonRef.current = null;
    }

    if (showTerminator) {
      try {
        const sLat = telemetry.solarLat ?? 0;
        const sLon = telemetry.solarLon ?? 0;
        const coords = getTerminatorCoordinates(sLat, sLon);
        const poly = L.polygon(coords, {
          stroke: false,
          fillColor: '#020409',
          fillOpacity: 0.52,
          interactive: false,
        }).addTo(map);
        terminatorPolygonRef.current = poly;
      } catch (err) {
        console.error('Terminator render error:', err);
      }
    }

    // 3. Trajectory Curves (Amber Ascending Arc + Cyan Descending Arc from Mockup)
    if (pastTrackGroupRef.current) pastTrackGroupRef.current.clearLayers();
    if (futureTrackGroupRef.current) futureTrackGroupRef.current.clearLayers();

    if (showOrbit) {
      try {
        const { past, future } = generateOrbitalTrack(lat, lng);

        // Past Arc: Glowing Amber (#f59e0b)
        past.forEach((segment) => {
          if (segment.length > 1 && pastTrackGroupRef.current) {
            L.polyline(segment, {
              color: '#f59e0b',
              weight: 2.8,
              opacity: 0.95,
              interactive: false,
            }).addTo(pastTrackGroupRef.current);
          }
        });

        // Future Arc: Electric Cyan (#38bdf8)
        future.forEach((segment) => {
          if (segment.length > 1 && futureTrackGroupRef.current) {
            L.polyline(segment, {
              color: '#38bdf8',
              weight: 2.0,
              opacity: 0.85,
              interactive: false,
            }).addTo(futureTrackGroupRef.current);
          }
        });
      } catch (err) {
        console.error('Track generation error:', err);
      }
    }
  }, [telemetry, showOrbit, showTerminator]);

  return (
    <div className="relative w-full h-full bg-[#090d16] overflow-hidden select-none">
      {/* Background Graticule Dots Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none z-10" />

      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
};
