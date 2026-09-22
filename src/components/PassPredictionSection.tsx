import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Compass, MapPin, Navigation, Clock, Search, Eye, EyeOff } from 'lucide-react';
import type { ISSPass } from '../types/iss';
import { calculateUpcomingPasses, searchLocation } from '../services/issApi';
import type { NominatimResult } from '../types/iss';

const GREEN = '#76FF03';
const BORDER = 'rgba(255,255,255,0.08)';

export const PassPredictionSection: React.FC = () => {
  const [lat, setLat] = useState<string>('0.00');
  const [lon, setLon] = useState<string>('0.00');
  const [locationLabel, setLocationLabel] = useState<string>('');
  const [passes, setPasses] = useState<ISSPass[]>([]);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [visibleOnly, setVisibleOnly] = useState<boolean>(true);

  // City search state
  const [cityQuery, setCityQuery] = useState<string>('');
  const [cityResults, setCityResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updatePasses = (latitude: number, longitude: number) => {
    setPasses(calculateUpcomingPasses(latitude, longitude));
  };

  // Debounced city search
  const handleCityInput = useCallback((value: string) => {
    setCityQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setCityResults([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchLocation(value);
        setCityResults(results);
        setShowDropdown(results.length > 0);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  }, []);

  const handleCitySelect = (result: NominatimResult) => {
    const selectedLat = parseFloat(result.lat).toFixed(4);
    const selectedLon = parseFloat(result.lon).toFixed(4);
    setLat(selectedLat);
    setLon(selectedLon);
    // Trim display_name to city, country
    const parts = result.display_name.split(',');
    const shortName = parts.length > 2 ? `${parts[0].trim()}, ${parts[parts.length - 1].trim()}` : result.display_name;
    setLocationLabel(shortName);
    setCityQuery(shortName);
    setShowDropdown(false);
    setCityResults([]);
    updatePasses(parseFloat(selectedLat), parseFloat(selectedLon));
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported.'); return; }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetecting(false);
        const userLat = pos.coords.latitude.toFixed(4);
        const userLon = pos.coords.longitude.toFixed(4);
        setLat(userLat); setLon(userLon);
        const label = `GPS Location (${parseFloat(userLat).toFixed(2)}°, ${parseFloat(userLon).toFixed(2)}°)`;
        setLocationLabel(label);
        setCityQuery(label);
        updatePasses(parseFloat(userLat), parseFloat(userLon));
      },
      () => { setIsDetecting(false); alert('Could not access location. Enter coordinates manually.'); }
    );
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLat = parseFloat(lat), parsedLon = parseFloat(lon);
    if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
      setLocationLabel(`Custom Coordinates (${parsedLat.toFixed(2)}°, ${parsedLon.toFixed(2)}°)`);
      updatePasses(parsedLat, parsedLon);
    }
  };

  const formatPassTime = (epochSeconds: number) =>
    new Date(epochSeconds * 1000).toLocaleDateString(undefined, {
      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'short',
    });

  const displayedPasses = visibleOnly ? passes.filter(p => p.visibilityType.includes('Visible')) : passes;

  const getMagColor = (mag?: number) => {
    if (mag === undefined || mag >= 90) return '#555555';
    if (mag <= -3) return '#76FF03';
    if (mag <= 0) return '#b2ff59';
    if (mag <= 1.5) return '#ffeb3b';
    return '#ff9800';
  };

  return (
    <section className="content-section" id="passesSection">
      <h2 className="content-section-title">
        <span className="material-icons">visibility</span>
        <span>Next ISS Passes (Spot the Station)</span>
      </h2>
      <p className="content-section-subtitle">
        Calculate upcoming visible passes over your city. The ISS appears as a brilliant, steady point of light gliding across the twilight sky.
      </p>

      {/* Control Card */}
      <div className="info-card" style={{ flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>

        {/* City Search Row */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <div className="info-card-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Search style={{ width: '13px', height: '13px', color: GREEN }} />
            <span>SEARCH CITY OR LOCATION</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#212121', padding: '8px 12px', borderRadius: '10px', border: `1px solid ${BORDER}` }}>
            <Search style={{ width: '14px', height: '14px', color: '#777', flexShrink: 0 }} />
            <input
              type="text"
              value={cityQuery}
              onChange={(e) => handleCityInput(e.target.value)}
              placeholder="Search city, country… e.g. London, UK or Tokyo, Japan"
              style={{
                flex: 1, background: 'transparent', color: '#ffffff',
                fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
                border: 'none', outline: 'none',
              }}
            />
            {isSearching && (
              <span style={{ fontSize: '11px', color: '#555', fontFamily: 'JetBrains Mono, monospace' }}>searching…</span>
            )}
          </div>

          {/* Autocomplete dropdown */}
          {showDropdown && cityResults.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
              background: '#181818', border: `1px solid ${BORDER}`, borderRadius: '10px',
              marginTop: '4px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', overflow: 'hidden',
            }}>
              {cityResults.map((result, i) => {
                const parts = result.display_name.split(',');
                const city = parts[0].trim();
                const country = parts[parts.length - 1].trim();
                return (
                  <button
                    key={i}
                    onClick={() => handleCitySelect(result)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '9px 14px', background: 'transparent',
                      border: 'none', borderBottom: i < cityResults.length - 1 ? `1px solid ${BORDER}` : 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#212121')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ color: '#ffffff', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>{city}</span>
                    <span style={{ color: '#aaaaaa', fontSize: '11px', whiteSpace: 'nowrap' }}>{country}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: BORDER }} />
          <span style={{ fontSize: '11px', color: '#555', fontFamily: 'JetBrains Mono, monospace' }}>or use manual coordinates</span>
          <div style={{ flex: 1, height: '1px', background: BORDER }} />
        </div>

        {/* Manual LAT/LON + GPS + Calculate + Visible Toggle */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div>
            <div className="info-card-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Compass style={{ width: '13px', height: '13px', color: GREEN }} />
              <span>TARGET SITE: <span style={{ color: locationLabel ? '#ffffff' : '#666' }}>{locationLabel || 'None selected (search above or use GPS)'}</span></span>
            </div>
          </div>

          <form onSubmit={handleCalculate} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            {(['LAT', 'LON'] as const).map((label) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#212121', padding: '6px 10px', borderRadius: '8px', border: `1px solid ${BORDER}` }}>
                <span className="info-card-label" style={{ marginBottom: 0 }}>{label}:</span>
                <input
                  type="number" step="any"
                  value={label === 'LAT' ? lat : lon}
                  onChange={(e) => label === 'LAT' ? setLat(e.target.value) : setLon(e.target.value)}
                  style={{ width: '65px', background: 'transparent', color: GREEN, fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', border: 'none', outline: 'none' }}
                  placeholder="0.00"
                />
              </div>
            ))}
            <button type="submit" style={{ padding: '6px 14px', borderRadius: '8px', background: '#272727', border: `1px solid ${BORDER}`, color: '#ffffff', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
              Calculate
            </button>
            <button type="button" onClick={handleUseMyLocation} disabled={isDetecting} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', background: GREEN, color: '#000', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: 'none', boxShadow: '0 2px 12px rgba(118,255,3,0.25)' }}>
              <MapPin style={{ width: '13px', height: '13px' }} />
              <span>{isDetecting ? 'Locating...' : 'Use My GPS'}</span>
            </button>
          </form>
        </div>

        {/* Visible Only Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setVisibleOnly(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px', padding: '5px 12px',
              borderRadius: '8px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 600, cursor: 'pointer', border: `1px solid ${visibleOnly ? GREEN : BORDER}`,
              background: visibleOnly ? 'rgba(118,255,3,0.12)' : '#212121',
              color: visibleOnly ? GREEN : '#aaaaaa', transition: 'all 0.2s',
            }}
          >
            {visibleOnly ? <Eye style={{ width: '13px', height: '13px' }} /> : <EyeOff style={{ width: '13px', height: '13px' }} />}
            {visibleOnly ? 'Visible Passes Only' : 'All Passes'}
          </button>
        </div>
      </div>

      {/* Prompt when no location selected yet */}
      {passes.length === 0 && !locationLabel && (
        <div style={{ padding: '24px', borderRadius: '10px', background: '#181818', border: `1px solid ${BORDER}`, textAlign: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', color: '#ffffff', fontFamily: 'JetBrains Mono, monospace', marginBottom: '4px' }}>
            No location selected
          </div>
          <div style={{ fontSize: '11px', color: '#777', fontFamily: 'JetBrains Mono, monospace' }}>
            Search for your city above, click "Use My GPS", or enter coordinates and hit Calculate to predict passes.
          </div>
        </div>
      )}

      {/* No visible passes message when location IS selected */}
      {passes.length > 0 && visibleOnly && displayedPasses.length === 0 && (
        <div style={{ padding: '18px', borderRadius: '10px', background: '#181818', border: `1px solid ${BORDER}`, textAlign: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', color: '#aaaaaa', fontFamily: 'JetBrains Mono, monospace' }}>
            No naked-eye visible passes predicted in the next 7 hours for this location. Toggle to "All Passes" to see daylight and night shadow passes.
          </span>
        </div>
      )}

      {/* Passes Grid */}
      {displayedPasses.length > 0 && (
        <div className="content-cards-grid passes-cards-grid">
        {displayedPasses.map((pass, idx) => {
          const isVisible = pass.isNakedEyeVisible ?? pass.visibilityType.includes('Visible');
          const magColor = getMagColor(pass.magnitude);
          return (
            <div key={idx} className="info-card">
              <div className="info-card-header">
                <div className="info-card-icon" style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock style={{ width: '15px', height: '15px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="info-card-title">Pass #{idx + 1}</div>
                  <div style={{ marginTop: '2px', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: isVisible ? GREEN : '#f87171' }}>
                    {isVisible ? '★ NAKED EYE VISIBLE' : '✕ NOT VISIBLE'}
                  </div>
                </div>

                {/* Magnitude badge slot - only shown for visible passes */}
                {isVisible && pass.magnitude !== undefined && (
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: '4px 8px', borderRadius: '8px', background: '#212121',
                    border: `1px solid ${magColor}40`, minWidth: '54px',
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: magColor }}>
                      {pass.magnitude > 0 ? '+' : ''}{pass.magnitude}
                    </span>
                    <span style={{ fontSize: '9px', color: magColor, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {pass.brightnessLabel}
                    </span>
                  </div>
                )}
              </div>

              <div className="info-card-content">
                <div className="info-card-value" style={{ fontSize: '13px' }}>{formatPassTime(pass.risetime)}</div>
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="info-card-description">Duration</span>
                    <span className="info-card-label" style={{ color: '#ffffff' }}>{Math.floor(pass.duration / 60)}m {pass.duration % 60}s</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="info-card-description">Max Elevation</span>
                    <span className="info-card-value" style={{ fontSize: '13px' }}>{pass.maxElevation}°</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="info-card-description">Trajectory</span>
                    <span className="info-card-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffffff' }}>
                      {pass.startAzimuth} <Navigation style={{ width: '10px', height: '10px', color: isVisible ? GREEN : '#aaaaaa' }} /> {pass.endAzimuth}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </section>
  );
};
