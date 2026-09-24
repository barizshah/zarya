import React, { useState, useEffect } from 'react';
import type { ISSPosition, Astronaut, ISSWeather } from '../types/iss';
import type { CameraId } from './IssNavbar';
import { getFactForLocation } from '../data/spaceData';
import { fetchISSWeather } from '../services/issApi';
import { PassPredictionSection } from './PassPredictionSection';
import { LaunchesSection } from './LaunchesSection';
import { LaunchSitesSection } from './LaunchSitesSection';
import { SpaceAgenciesSection } from './SpaceAgenciesSection';

interface IssContentSectionsProps {
  telemetry: ISSPosition | null;
  crew: Astronaut[];
  activeCamera: CameraId;
  onSelectCamera: (cam: CameraId) => void;
  activeSection: string;
  onSelectSection: (section: string) => void;
  onOpenCrewModal: () => void;
}

export const IssContentSections: React.FC<IssContentSectionsProps> = ({
  telemetry,
  crew,
  activeCamera,
  onSelectCamera,
  activeSection,
  onSelectSection,
  onOpenCrewModal,
}) => {
  const [weather, setWeather] = useState<ISSWeather | null>(null);

  const latitude = telemetry?.latitude;
  const longitude = telemetry?.longitude;

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) return;
    let isCurrent = true;
    fetchISSWeather(latitude, longitude).then((res) => {
      if (isCurrent && res) {
        setWeather(res);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [latitude, longitude]);

  const speedDisplay = telemetry ? Math.round(telemetry.velocity).toLocaleString() : '27,600';
  const altDisplay = telemetry ? `${Math.round(telemetry.altitude)} km` : '408 km';
  const locationText = telemetry?.locationName || 'International Airspace / Open Ocean';
  const locationFact = getFactForLocation(locationText);

  const handleNavClick = (sectionId: string) => {
    onSelectSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [currentTimestamp] = useState(() => Date.now());

  return (
    <>
      {/* 1. Quick Control Toggles Toolbar (Directly Below Video/Map) */}
      <section className="stream-toggles-bar">
        {/* Live Stream Camera Toggles */}
        <div className="stream-group feed-group">
          <span className="group-label">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#76FF03] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#76FF03] shadow-[0_0_8px_#76FF03]" />
            </span>
            Feeds:
          </span>

          <div className="feeds-boxes-grid">
            {/* 1. 4K Camera Toggle */}
            <button
              onClick={() => onSelectCamera('4k')}
              className={`feed-box-btn transition-all duration-200 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 cursor-pointer ${
                activeCamera === '4k'
                  ? 'bg-[#76FF03] text-black font-semibold shadow-md shadow-[#76FF03]/25 border border-[#76FF03]'
                  : 'bg-[#212121] text-white hover:bg-[#2e2e2e] border border-white/[0.08]'
              }`}
            >
              <span className="material-icons feed-box-icon" style={{ fontSize: '18px' }}>4k</span>
              <span className="feed-label-full hidden sm:inline text-xs font-semibold">4K Camera</span>
              <span className="feed-label-short inline sm:hidden text-xs font-bold font-mono">4K</span>
            </button>

            {/* 2. HD Camera Toggle */}
            <button
              onClick={() => onSelectCamera('hd')}
              className={`feed-box-btn transition-all duration-200 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 cursor-pointer ${
                activeCamera === 'hd'
                  ? 'bg-[#76FF03] text-black font-semibold shadow-md shadow-[#76FF03]/25 border border-[#76FF03]'
                  : 'bg-[#212121] text-white hover:bg-[#2e2e2e] border border-white/[0.08]'
              }`}
            >
              <span className="material-icons feed-box-icon" style={{ fontSize: '18px' }}>hd</span>
              <span className="feed-label-full hidden sm:inline text-xs font-semibold">HD Camera</span>
              <span className="feed-label-short inline sm:hidden text-xs font-bold font-mono">HD</span>
            </button>

            {/* 3. SD Camera Toggle */}
            <button
              onClick={() => onSelectCamera('sd')}
              className={`feed-box-btn transition-all duration-200 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 cursor-pointer ${
                activeCamera === 'sd'
                  ? 'bg-[#76FF03] text-black font-semibold shadow-md shadow-[#76FF03]/25 border border-[#76FF03]'
                  : 'bg-[#212121] text-white hover:bg-[#2e2e2e] border border-white/[0.08]'
              }`}
            >
              <span className="material-icons feed-box-icon" style={{ fontSize: '18px' }}>videocam</span>
              <span className="feed-label-full hidden sm:inline text-xs font-semibold">SD Camera</span>
              <span className="feed-label-short inline sm:hidden text-xs font-bold font-mono">SD</span>
            </button>
          </div>
        </div>

        {/* Learn Section Jump Links */}
        <div className="stream-group jump-group">
          <span className="group-label">
            <span className="material-icons" style={{ fontSize: '14px', color: '#76FF03' }}>explore</span>
            Jump:
          </span>

          {/* Desktop Horizontal Jump Row (All 7 destinations) */}
          <div className="desktop-jump-row hidden sm:flex items-center flex-wrap gap-2">
            <button
              onClick={() => handleNavClick('passesSection')}
              className={`jump-btn transition-all duration-200 rounded-lg flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-medium cursor-pointer ${
                activeSection === 'passesSection'
                  ? 'bg-[#76FF03]/20 text-[#76FF03] border border-[#76FF03]/40'
                  : 'bg-[#272727] text-[#e0e0e0] hover:bg-[#3f3f3f] border border-white/[0.06]'
              }`}
            >
              <span className="material-icons" style={{ fontSize: '14px' }}>visibility</span>
              <span>Passes</span>
            </button>

            <button
              onClick={() => handleNavClick('whoIsOnSection')}
              className={`jump-btn transition-all duration-200 rounded-lg flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-medium cursor-pointer ${
                activeSection === 'whoIsOnSection'
                  ? 'bg-[#76FF03]/20 text-[#76FF03] border border-[#76FF03]/40'
                  : 'bg-[#272727] text-[#e0e0e0] hover:bg-[#3f3f3f] border border-white/[0.06]'
              }`}
            >
              <span className="material-icons" style={{ fontSize: '14px' }}>people</span>
              <span>Crew</span>
            </button>

            <button
              onClick={() => handleNavClick('launchesSection')}
              className={`jump-btn transition-all duration-200 rounded-lg flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-medium cursor-pointer ${
                activeSection === 'launchesSection'
                  ? 'bg-[#76FF03]/20 text-[#76FF03] border border-[#76FF03]/40'
                  : 'bg-[#272727] text-[#e0e0e0] hover:bg-[#3f3f3f] border border-white/[0.06]'
              }`}
            >
              <span className="material-icons" style={{ fontSize: '14px' }}>rocket_launch</span>
              <span>Launches</span>
            </button>

            <button
              onClick={() => handleNavClick('launchSitesSection')}
              className={`jump-btn transition-all duration-200 rounded-lg flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-medium cursor-pointer ${
                activeSection === 'launchSitesSection'
                  ? 'bg-[#76FF03]/20 text-[#76FF03] border border-[#76FF03]/40'
                  : 'bg-[#272727] text-[#e0e0e0] hover:bg-[#3f3f3f] border border-white/[0.06]'
              }`}
            >
              <span className="material-icons" style={{ fontSize: '14px' }}>place</span>
              <span>Sites</span>
            </button>

            <button
              onClick={() => handleNavClick('agenciesSection')}
              className={`jump-btn transition-all duration-200 rounded-lg flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-medium cursor-pointer ${
                activeSection === 'agenciesSection'
                  ? 'bg-[#76FF03]/20 text-[#76FF03] border border-[#76FF03]/40'
                  : 'bg-[#272727] text-[#e0e0e0] hover:bg-[#3f3f3f] border border-white/[0.06]'
              }`}
            >
              <span className="material-icons" style={{ fontSize: '14px' }}>public</span>
              <span>Agencies</span>
            </button>

            <button
              onClick={() => handleNavClick('camerasSection')}
              className={`jump-btn transition-all duration-200 rounded-lg flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-medium cursor-pointer ${
                activeSection === 'camerasSection'
                  ? 'bg-[#76FF03]/20 text-[#76FF03] border border-[#76FF03]/40'
                  : 'bg-[#272727] text-[#e0e0e0] hover:bg-[#3f3f3f] border border-white/[0.06]'
              }`}
            >
              <span className="material-icons" style={{ fontSize: '14px' }}>videocam</span>
              <span>Cameras</span>
            </button>

            <button
              onClick={() => handleNavClick('faqSection')}
              className={`jump-btn transition-all duration-200 rounded-lg flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-medium cursor-pointer ${
                activeSection === 'faqSection'
                  ? 'bg-[#76FF03]/20 text-[#76FF03] border border-[#76FF03]/40'
                  : 'bg-[#272727] text-[#e0e0e0] hover:bg-[#3f3f3f] border border-white/[0.06]'
              }`}
            >
              <span className="material-icons" style={{ fontSize: '14px' }}>help_outline</span>
              <span>FAQ</span>
            </button>
          </div>

          {/* Mobile 3-Box Grid + Bottom FAQ (Active only on mobile) */}
          <div className="mobile-jump-wrapper flex sm:hidden flex-col w-full">
            <div className="jump-grid-3col">
              <button
                onClick={() => handleNavClick('passesSection')}
                className={`jump-btn jump-box-btn transition-all duration-200 cursor-pointer ${
                  activeSection === 'passesSection'
                    ? 'bg-[#76FF03]/20 text-[#76FF03] border border-[#76FF03]/40'
                    : 'bg-[#272727] text-[#e0e0e0] hover:bg-[#3f3f3f] border border-white/[0.06]'
                }`}
              >
                <span className="material-icons">visibility</span>
                <span>Passes</span>
              </button>

              <button
                onClick={() => handleNavClick('whoIsOnSection')}
                className={`jump-btn jump-box-btn transition-all duration-200 cursor-pointer ${
                  activeSection === 'whoIsOnSection'
                    ? 'bg-[#76FF03]/20 text-[#76FF03] border border-[#76FF03]/40'
                    : 'bg-[#272727] text-[#e0e0e0] hover:bg-[#3f3f3f] border border-white/[0.06]'
                }`}
              >
                <span className="material-icons">people</span>
                <span>Crew</span>
              </button>

              <button
                onClick={() => handleNavClick('launchesSection')}
                className={`jump-btn jump-box-btn transition-all duration-200 cursor-pointer ${
                  activeSection === 'launchesSection'
                    ? 'bg-[#76FF03]/20 text-[#76FF03] border border-[#76FF03]/40'
                    : 'bg-[#272727] text-[#e0e0e0] hover:bg-[#3f3f3f] border border-white/[0.06]'
                }`}
              >
                <span className="material-icons">rocket_launch</span>
                <span>Launches</span>
              </button>

              <button
                onClick={() => handleNavClick('launchSitesSection')}
                className={`jump-btn jump-box-btn transition-all duration-200 cursor-pointer ${
                  activeSection === 'launchSitesSection'
                    ? 'bg-[#76FF03]/20 text-[#76FF03] border border-[#76FF03]/40'
                    : 'bg-[#272727] text-[#e0e0e0] hover:bg-[#3f3f3f] border border-white/[0.06]'
                }`}
              >
                <span className="material-icons">place</span>
                <span>Sites</span>
              </button>

              <button
                onClick={() => handleNavClick('agenciesSection')}
                className={`jump-btn jump-box-btn transition-all duration-200 cursor-pointer ${
                  activeSection === 'agenciesSection'
                    ? 'bg-[#76FF03]/20 text-[#76FF03] border border-[#76FF03]/40'
                    : 'bg-[#272727] text-[#e0e0e0] hover:bg-[#3f3f3f] border border-white/[0.06]'
                }`}
              >
                <span className="material-icons">public</span>
                <span>Agencies</span>
              </button>

              <button
                onClick={() => handleNavClick('camerasSection')}
                className={`jump-btn jump-box-btn transition-all duration-200 cursor-pointer ${
                  activeSection === 'camerasSection'
                    ? 'bg-[#76FF03]/20 text-[#76FF03] border border-[#76FF03]/40'
                    : 'bg-[#272727] text-[#e0e0e0] hover:bg-[#3f3f3f] border border-white/[0.06]'
                }`}
              >
                <span className="material-icons">videocam</span>
                <span>Cameras</span>
              </button>
            </div>

            {/* Symmetrical FAQ Button at the Bottom on Mobile */}
            <button
              onClick={() => handleNavClick('faqSection')}
              className={`jump-faq-bottom-btn transition-all duration-200 cursor-pointer ${
                activeSection === 'faqSection'
                  ? 'bg-[#76FF03]/20 text-[#76FF03] border border-[#76FF03]/40'
                  : 'bg-[#212121] text-[#b0b0b0] hover:bg-[#2c2c2c] hover:text-white border border-white/[0.06]'
              }`}
            >
              <span className="material-icons" style={{ fontSize: '15px' }}>help_outline</span>
              <span>Frequently Asked Questions (FAQ)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Info Section (4 Telemetry Cards + ISS Location Card) */}
      <section className="info-section" id="infoSection" style={{ borderTop: 'none', padding: 0 }}>
        <div className="info-grid">
          <div className="info-cards-group">
            {/* Crew Card */}
            <div
              className="info-card crew-card clickable cursor-pointer"
              id="crewCard"
              onClick={onOpenCrewModal}
            >
              <div className="info-card-header">
                <div className="info-card-icon">
                  <span className="material-icons">people</span>
                </div>
                <div className="info-card-title">Crew</div>
              </div>
              <div className="info-card-content">
                <div className="info-card-value">{crew.length || 7}</div>
                <div className="info-card-label">Astronauts aboard ISS</div>
              </div>
            </div>

            {/* Altitude Card */}
            <div className="info-card clickable" id="altitudeCard">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <span className="material-icons">height</span>
                </div>
                <div className="info-card-title">Altitude</div>
              </div>
              <div className="info-card-content">
                <div className="info-card-value">{altDisplay}</div>
                <div className="info-card-label">Above Earth</div>
                <div className="info-card-description">Current orbital altitude of the ISS</div>
              </div>
            </div>

            {/* Speed Card */}
            <div className="info-card clickable" id="speedCard">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <span className="material-icons">rocket_launch</span>
                </div>
                <div className="info-card-title">Speed</div>
              </div>
              <div className="info-card-content">
                <div className="info-card-value">{speedDisplay}</div>
                <div className="info-card-label">km/h</div>
                <div className="info-card-description">Orbital velocity around Earth</div>
              </div>
            </div>

            {/* Orbits Card */}
            <div className="info-card clickable" id="orbitsCard">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <span className="material-icons">public</span>
                </div>
                <div className="info-card-title">Orbits</div>
              </div>
              <div className="info-card-content">
                <div className="info-card-value">16</div>
                <div className="info-card-label">Per Day</div>
                <div className="info-card-description">Complete orbits around Earth daily</div>
              </div>
            </div>
          </div>

          {/* Desktop & Mobile ISS Location Card with Live Surface Weather */}
          <div className="info-card iss-fact-desktop-card iss-location-card" id="issLocationDesktop">
            <div className="info-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="info-card-icon">
                  <span className="material-icons">place</span>
                </div>
                <div className="info-card-title">ISS Location</div>
              </div>

              {/* Surface Weather Badge - Prominent on both mobile & desktop */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: 'rgba(118, 255, 3, 0.08)',
                  border: '1px solid rgba(118, 255, 3, 0.25)',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
                title={weather ? `Surface weather at ISS subpoint: ${weather.conditionText}, Cloud cover: ${weather.cloudCover}%, Wind: ${weather.windSpeed} km/h` : 'Fetching surface meteorology at ISS coordinates...'}
              >
                <span className="material-icons" style={{ fontSize: '16px', color: '#76FF03' }}>
                  {weather ? (
                    weather.conditionText.includes('Rain') || weather.conditionText.includes('Drizzle')
                      ? 'water_drop'
                      : weather.conditionText.includes('Cloud') || weather.cloudCover > 40
                      ? 'cloud'
                      : 'wb_sunny'
                  ) : 'sensors'}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                  {weather ? `${weather.temperature > 0 ? `+${weather.temperature}` : weather.temperature}°C` : '--°C'}
                </span>
                <span style={{ fontSize: '11px', color: '#76FF03', fontWeight: 500 }}>
                  {weather ? weather.conditionText : 'Scanning'}
                </span>
              </div>
            </div>

            <div className="info-card-content" id="issLocationContentDesktop" style={{ marginTop: '8px' }}>
              <div className="info-card-value" style={{ fontSize: '17px', lineHeight: 1.3, marginBottom: '6px' }}>
                {locationText}
              </div>
              <div className="info-card-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '12px' }}>
                <span>{telemetry ? `${telemetry.latitude.toFixed(2)}° Lat  ${telemetry.longitude.toFixed(2)}° Lon` : 'Acquiring GPS...'}</span>
                {weather && (
                  <span style={{ color: '#aaaaaa', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#76FF03' }}>☁</span> {weather.cloudCover}% clouds
                    {weather.windSpeed ? ` • 💨 ${Math.round(weather.windSpeed)} km/h` : ''}
                  </span>
                )}
              </div>
              <div className="info-card-description" style={{ marginTop: '4px' }}>
                Sub-satellite ground coordinates & live surface meteorology
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ISS Location Fact — Standalone Banner */}
      <section className="content-section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="info-card overpass-fact-card">
          <div className="overpass-fact-top-row">
            {/* Header Main: Icon + Title */}
            <div className="overpass-fact-header-main">
              <div className="info-card-icon overpass-fact-icon">
                <span className="material-icons" style={{ fontSize: '20px' }}>auto_awesome</span>
              </div>
              <div className="overpass-fact-title-container">
                <div className="info-card-label overpass-fact-label">
                  ORBITAL OVERPASS FACT — {locationFact.title.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Metric Badge */}
            <div className="overpass-fact-metric-badge">
              {locationFact.highlightMetric}
            </div>
          </div>

          {/* Fact Content Text */}
          <p className="overpass-fact-text">
            {locationFact.fact}
          </p>
        </div>
      </section>

      {/* 3. Next Passes Prediction Section */}
      <PassPredictionSection />

      {/* 4. Who is on the ISS Section */}
      <section className="content-section" id="whoIsOnSection">
        <h2 className="content-section-title">
          <span className="material-icons">people</span>
          <span>Who is on the ISS</span>
        </h2>
        <p className="content-section-subtitle">
          Expedition 73 astronauts and cosmonauts currently living and working aboard the orbital outpost.
        </p>
        <div className="who-is-on-content" id="whoIsOnSectionContent">
          <div className="content-cards-grid">
            {crew.map((astronaut, idx) => {
              const launchDate = (astronaut as any).launchDate;
              const photoUrl = (astronaut as any).photoUrl;
              const funFact = (astronaut as any).funFact;
              const daysInSpace = launchDate
                ? Math.floor((currentTimestamp - new Date(launchDate).getTime()) / (1000 * 60 * 60 * 24))
                : null;
              const isSoyuz = astronaut.craft?.toLowerCase().includes('soyuz');
              const accentColor = isSoyuz ? '#4fc3f7' : '#76FF03';

              return (
                <div key={idx} className="info-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    {/* Portrait or flag fallback */}
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={astronaut.name}
                        style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover', border: `1px solid rgba(255,255,255,0.08)`, flexShrink: 0 }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: `${accentColor}15`, border: `1px solid ${accentColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                        {astronaut.flag}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#ffffff', lineHeight: 1.3 }}>{astronaut.name}</h3>
                        <span style={{ fontSize: '18px', flexShrink: 0 }}>{astronaut.flag}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#aaaaaa', marginTop: '2px' }}>{astronaut.role}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', padding: '2px 8px', borderRadius: '6px', background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}>
                          {astronaut.agency}
                        </span>
                        {daysInSpace !== null && (
                          <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: accentColor }}>
                            ★ {daysInSpace}d in space
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {funFact && (
                    <div style={{ padding: '8px 10px', borderRadius: '8px', background: '#212121', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <p style={{ margin: 0, fontSize: '11px', color: '#aaaaaa', lineHeight: 1.6 }}>{funFact}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* 5. Upcoming Rocket Launches */}
      <LaunchesSection />

      {/* 6. Major Spaceports & Launch Sites */}
      <LaunchSitesSection />

      {/* 7. Global Space Agencies */}
      <SpaceAgenciesSection />

      {/* 8. ISS Cameras Section (Informative Reference Cards) */}
      <section className="content-section" id="camerasSection">
        <h2 className="content-section-title">
          <span className="material-icons">videocam</span>
          <span>ISS Camera Systems</span>
        </h2>
        <p className="content-section-subtitle">
          Overview and technical specifications of external video payloads installed aboard the International Space Station. Use the feeds toolbar above to toggle the live player.
        </p>

        <div className="content-cards-grid">
          {/* 1. Sen 4K Camera Card */}
          <div className="content-card">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-[#76FF03]/10 text-[#76FF03] border border-[#76FF03]/25">
                <span className="material-icons" style={{ fontSize: '18px' }}>4k</span>
              </span>
              <h3 className="m-0 text-base font-semibold text-white">Sen 4K Ultra HD</h3>
            </div>
            <p className="text-sm text-[#cccccc] leading-relaxed mb-3">
              Commercial multi-camera system developed by Sen, mounted externally on ESA's Columbus laboratory module. Designed to capture ultra-high-definition panoramic views of Earth's horizon, atmospheric limb, and station operations.
            </p>
            <div className="pt-2 border-t border-white/[0.08] text-xs font-mono text-[#aaaaaa] space-y-1">
              <div>• Resolution: 3840 × 2160 (4K UHD)</div>
              <div>• Platform: Columbus Module External Facility</div>
              <div>• Operator: Sen.com in partnership with ESA</div>
            </div>
          </div>

          {/* 2. HD Camera Card */}
          <div className="content-card">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-[#76FF03]/10 text-[#76FF03] border border-[#76FF03]/25">
                <span className="material-icons" style={{ fontSize: '18px' }}>videocam</span>
              </span>
              <h3 className="m-0 text-base font-semibold text-white">NASA High Definition (EHDC)</h3>
            </div>
            <p className="text-sm text-[#cccccc] leading-relaxed mb-3">
              External High Definition Cameras (EHDC) installed along the station's Integrated Truss Structure. Engineered in hermetically sealed, thermal-regulated radiation-hardened enclosures to survive temperatures from -150°C to +120°C.
            </p>
            <div className="pt-2 border-t border-white/[0.08] text-xs font-mono text-[#aaaaaa] space-y-1">
              <div>• Resolution: 1080p (Full HD)</div>
              <div>• Location: Starboard & Port Truss Assemblies</div>
              <div>• Purpose: Vehicle docking & spacewalk monitoring</div>
            </div>
          </div>

          {/* 3. SD Camera Card */}
          <div className="content-card">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-[#76FF03]/10 text-[#76FF03] border border-[#76FF03]/25">
                <span className="material-icons" style={{ fontSize: '18px' }}>radio</span>
              </span>
              <h3 className="m-0 text-base font-semibold text-white">Operational SD & Radio Feed</h3>
            </div>
            <p className="text-sm text-[#cccccc] leading-relaxed mb-3">
              Standard-definition video downlink integrated directly into NASA mission control's Tracking and Data Relay Satellite System (TDRSS). Carries live mission radio communications between the flight control team in Houston and ISS astronauts.
            </p>
            <div className="pt-2 border-t border-white/[0.08] text-xs font-mono text-[#aaaaaa] space-y-1">
              <div>• Downlink: TDRSS Ku-band satellite network</div>
              <div>• Audio: NASA Space-to-Ground 1 & 2 radio channels</div>
              <div>• Status: Active during daylight passes & crew shifts</div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Space Exploration Section */}
      <section className="content-section" id="spaceSection">
        <h2 className="content-section-title">
          <span className="material-icons">public</span>
          <span>Space Exploration</span>
        </h2>
        <p className="content-section-subtitle">
          The ISS is at the heart of human space exploration. Commercial partners like SpaceX and international agencies continuously advance human presence beyond Low Earth Orbit.
        </p>
        <div className="content-cards-grid">
          <div className="content-card">
            <img
              src="https://images-assets.nasa.gov/image/iss064e004546/iss064e004546~large.jpg"
              alt="SpaceX Crew Dragon"
              className="content-card-image"
              loading="lazy"
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
            />
            <h3>
              <span className="material-icons">flight_takeoff</span>
              <span>SpaceX & Commercial Crew</span>
            </h3>
            <p>
              SpaceX Crew Dragon regularly transports astronauts to and from the ISS under NASA's Commercial Crew Program, maintaining continuous presence aboard the orbiting lab.
            </p>
          </div>

          <div className="content-card">
            <img
              src="https://images-assets.nasa.gov/image/iss071e416851/iss071e416851~large.jpg"
              alt="Cargo Resupply"
              className="content-card-image"
              loading="lazy"
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
            />
            <h3>
              <span className="material-icons">precision_manufacturing</span>
              <span>Cargo & Resupply</span>
            </h3>
            <p>
              Northrop Grumman Cygnus and SpaceX Cargo Dragon vehicles transport science experiments, fresh food, equipment, and station upgrades captured by the Canadarm2 robotic arm.
            </p>
          </div>

          <div className="content-card">
            <img
              src="https://images-assets.nasa.gov/image/iss038e020390/iss038e020390~large.jpg"
              alt="Spacewalks"
              className="content-card-image"
              loading="lazy"
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
            />
            <h3>
              <span className="material-icons">engineering</span>
              <span>Spacewalks (EVAs)</span>
            </h3>
            <p>
              Extravehicular activities allow astronauts to maintain station solar arrays, install new scientific packages, and conduct structural maintenance in the vacuum of space.
            </p>
          </div>
        </div>
      </section>

      {/* 10. About the ISS Section */}
      <section className="content-section" id="aboutSection">
        <h2 className="content-section-title">
          <span className="material-icons">info</span>
          <span>About the International Space Station</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* ISS Hero Image — fits frame with natural aspect ratio */}
          <div style={{
            borderRadius: '14px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            maxHeight: '440px',
            backgroundColor: '#0a0a0a',
          }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/International_Space_Station_after_undocking_of_STS-132.jpg/1280px-International_Space_Station_after_undocking_of_STS-132.jpg"
              alt="International Space Station"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '12px 16px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '8px',
            }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontFamily: 'JetBrains Mono, monospace' }}>
                Photographed from STS-132 Space Shuttle Atlantis · NASA
              </span>
              <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', padding: '2px 8px', borderRadius: '5px', background: 'rgba(118,255,3,0.12)', color: '#76FF03', border: '1px solid rgba(118,255,3,0.25)' }}>
                ~420,000 kg • 109m span
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="content-card" style={{ padding: '20px 24px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#cccccc', lineHeight: 1.8 }}>
              The International Space Station is the largest modular space station in Low Earth Orbit and the most complex engineering project in human history. A multinational collaboration between <strong style={{ color: '#ffffff' }}>NASA</strong> (US), <strong style={{ color: '#ffffff' }}>Roscosmos</strong> (Russia), <strong style={{ color: '#ffffff' }}>JAXA</strong> (Japan), <strong style={{ color: '#ffffff' }}>ESA</strong> (Europe), and <strong style={{ color: '#ffffff' }}>CSA</strong> (Canada) — the ISS has been continuously inhabited since November 2000, a testament to humanity's capacity for peaceful cooperation in extreme environments.
            </p>
          </div>

          {/* Specs — 4-col grid using content-cards-grid, cards are info-cards with row layout */}
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '16px', height: '1px', background: '#76FF03', opacity: 0.5 }} />
              Station Specifications
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {[
                { label: 'Total Mass', value: '~420,000 kg', sub: 'With docked vehicles', icon: 'scale' },
                { label: 'Solar Array Span', value: '109 m', sub: 'Wider than a football field', icon: 'straighten' },
                { label: 'Orbital Altitude', value: '~408 km', sub: 'Above Earth surface', icon: 'height' },
                { label: 'Orbital Speed', value: '27,580 km/h', sub: '7.66 km per second', icon: 'speed' },
                { label: 'Orbital Period', value: '92.68 min', sub: '16 sunrises per day', icon: 'public' },
                { label: 'Inclination', value: '51.64°', sub: 'Covers 90% of Earth pop.', icon: 'explore' },
              ].map((spec) => (
                <div key={spec.label} style={{
                  background: '#181818',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(118,255,3,0.1)', border: '1px solid rgba(118,255,3,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-icons" style={{ fontSize: '14px', color: '#76FF03' }}>{spec.icon}</span>
                    </div>
                    <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{spec.label}</span>
                  </div>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.2 }}>{spec.value}</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>{spec.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Module timeline */}
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '16px', height: '1px', background: '#76FF03', opacity: 0.5 }} />
              Assembly Timeline
            </div>
            <div className="content-card" style={{ padding: '0', overflow: 'hidden' }}>
              {[
                { name: 'Zarya (FGB)', agency: 'Roscosmos', year: '1998', desc: 'First element — propulsion and power during early assembly.' },
                { name: 'Unity (Node 1)', agency: 'NASA', year: '1998', desc: 'US connecting node linking Russian and American segments.' },
                { name: 'Zvezda (Service Module)', agency: 'Roscosmos', year: '2000', desc: 'Russian living quarters, life support, and orbital reboost propulsion.' },
                { name: 'Destiny (US Lab)', agency: 'NASA', year: '2001', desc: 'Primary US science lab with 24 experiment bays.' },
                { name: 'Kibō (JEM)', agency: 'JAXA', year: '2008', desc: "Japan's largest contribution — pressurized research lab with external experiment platform." },
                { name: 'Columbus', agency: 'ESA', year: '2008', desc: 'European science lab; hosts the Sen 4K cameras you\'re watching now.' },
                { name: 'Cupola', agency: 'ESA / ASI', year: '2010', desc: 'Seven-window observatory module offering panoramic Earth observation and robotics controls.' },
                { name: 'Nauka (MLM)', agency: 'Roscosmos', year: '2021', desc: "Russia's largest ISS module — multipurpose laboratory with European Robotic Arm." },
              ].map((mod, i, arr) => (
                <div key={mod.name} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  padding: '12px 20px',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', paddingTop: '2px' }}>
                    <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', padding: '2px 7px', borderRadius: '5px', background: '#212121', color: '#76FF03', border: '1px solid rgba(118,255,3,0.2)', whiteSpace: 'nowrap' }}>{mod.year}</span>
                    {i < arr.length - 1 && <div style={{ width: '1px', height: '16px', background: 'rgba(118,255,3,0.15)' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                      {mod.name} <span style={{ color: '#555', fontWeight: 400, fontSize: '12px' }}>· {mod.agency}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '3px', lineHeight: 1.5 }}>{mod.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 11. FAQ Section */}
      <section className="content-section" id="faqSection">
        <h2 className="content-section-title">
          <span className="material-icons">help_outline</span>
          <span>Frequently Asked Questions</span>
        </h2>
        <p className="content-section-subtitle">
          Common questions about the ISS live stream, orbital science, and how to spot the station from your backyard.
        </p>
        <div className="content-cards-grid">
          {[
            {
              q: 'Why is the camera black sometimes?',
              a: "The ISS orbits Earth every 92.68 minutes, entering Earth's night shadow for roughly 45 minutes of each orbit. During orbital night, external cameras show a dark screen — unless flying over brightly lit cities, lightning storms, or the aurora borealis.",
            },
            {
              q: 'Is this footage real or computer-generated imagery?',
              a: 'Everything you see is 100% real, live footage from cameras physically mounted on the exterior of the ISS. No CGI, no rendering, no simulation. The Sen 4K stream is broadcast directly from the Columbus module at 400+ km altitude.',
            },
            {
              q: 'What makes the Sen 4K stream special?',
              a: 'Sen Corporation mounted commercial 4K Ultra HD camera systems on ESA\'s Columbus external facility — the first commercial cameras ever permanently installed on the ISS. The resolution is 3840×2160, roughly 4× sharper than NASA\'s standard HD feed.',
            },
            {
              q: 'Why is there no sound on the HD camera feed?',
              a: 'Space is a vacuum — sound requires a medium to travel through. External cameras physically cannot capture audio. The SD/operational feed does include NASA air-to-ground mission radio audio during active crew shifts and communications windows.',
            },
            {
              q: 'Why does the stream sometimes cut out or go offline?',
              a: 'The ISS relies on NASA\'s Tracking and Data Relay Satellites (TDRSS) to downlink video. When the station is between TDRSS coverage zones (loss of signal — LOS), the live feed is interrupted. This typically lasts 2–10 minutes before contact is restored.',
            },
            {
              q: 'How fast is the ISS actually moving?',
              a: "The ISS orbits at ~27,580 km/h (7.66 km/s) — fast enough to circle Earth 16 times per day. At this speed, it completes one full orbit every 92.68 minutes, experiencing 16 sunrises and 16 sunsets every 24 hours.",
            },
            {
              q: 'Can I see the ISS with the naked eye?',
              a: 'Yes! The ISS is often the brightest object in the night sky after the Moon and Venus, reaching magnitude -5.9 during overhead twilight passes. Use the Pass Prediction section above to find your next visible flyby — it moves silently and steadily, unlike aircraft.',
            },
            {
              q: 'How do astronauts handle bone and muscle loss in space?',
              a: 'Without gravity, astronauts lose 1–2% of bone density per month. They exercise ~2 hours daily using the ARED resistance machine, COLBERT treadmill, and bike ergometer. Post-mission, bone recovery takes months of rehabilitation on Earth.',
            },
            {
              q: 'Can astronauts see stars from the ISS?',
              a: "Ironically, stars are hard to see with the naked eye from the ISS because the station and Earth are so bright that the human eye can't adapt to dark enough for star visibility. Astronauts use high-sensitivity cameras with long exposures to photograph star fields and aurora.",
            },
            {
              q: 'What is an EVA spacewalk like?',
              a: 'Extravehicular Activities (EVAs) last 6–8 hours and require days of pre-breathing pure oxygen to purge nitrogen from blood. Astronauts wear EMU or Orlan suits with 6 hours of oxygen, micro-meteorite shielding, and thermal regulation between -150°C and +120°C.',
            },
            {
              q: 'Can I see the ISS through a backyard telescope?',
              a: "Yes, but it's tricky — the ISS moves too fast to manually track at high magnification. With a 4\"-6\" telescope and a motorized mount, you can resolve the station's shape: the H-shaped truss structure and rectangular solar array panels become distinguishable at 100× magnification.",
            },
            {
              q: 'What will happen to the ISS at the end of its life?',
              a: "NASA and international partners plan to safely deorbit the ISS in 2030–2031. SpaceX has been awarded a contract to build a specialized US Deorbit Vehicle to guide the station into Point Nemo, the remote Pacific spacecraft cemetery, ensuring zero hazard to populated areas.",
            },
            {
              q: 'What is the Overview Effect?',
              a: 'The Overview Effect is a profound cognitive shift reported by astronauts when viewing Earth from orbit. Witnessing our borderless, radiant planet suspended in the silent void of space instills deep feelings of awe, global unity, and an acute desire to protect humanity\'s only home.',
            },
            {
              q: 'How do astronauts sleep in microgravity?',
              a: 'Astronauts sleep inside soundproof, phone-booth-sized Crew Quarters strapped into sleeping bags anchored to walls. Continuous ventilation fans are vital — without active air circulation in zero gravity, carbon dioxide exhaled by sleeping astronauts would pool around their heads and cause suffocation.',
            },
            {
              q: 'How does the ISS generate oxygen and recycle water?',
              a: 'The Environmental Control and Life Support System (ECLSS) recovers roughly 98% of all station water from astronaut breath, sweat, and urine, purifying it beyond tap water standards. Oxygen is continuously produced via water electrolysis powered by the station\'s massive solar array wings.',
            },
            {
              q: 'What time zone does the International Space Station use?',
              a: 'Because the station experiences 16 sunrises and sunsets every 24 hours, local solar time is unusable. Instead, the ISS operates on Coordinated Universal Time (UTC/GMT), comfortably bridging communications between primary mission controls in Houston (UTC-5/6) and Moscow (UTC+3).',
            },
            {
              q: 'How does the ISS avoid space debris and space junk?',
              a: 'Global radar tracking monitors thousands of orbital debris fragments. If any object enters the station\'s protective safety envelope (roughly 25×25×4 km) with a collision probability exceeding 1 in 10,000, thrusters on docked spacecraft execute a Pre-Determined Debris Avoidance Maneuver (PDAM).',
            },
            {
              q: 'How do astronauts take out the trash?',
              a: 'Garbage and discarded equipment are packed into expendable cargo spacecraft like Northrop Grumman\'s Cygnus or Roscosmos\'s Progress once unloaded. When detached, these craft execute a targeted atmospheric reentry, vaporizing tons of waste safely over the southern Pacific Ocean.',
            },
            {
              q: 'What happens during an emergency aboard the ISS?',
              a: 'Crews drill relentlessly for the "Big Three" emergencies: fire, rapid cabin depressurization (hull breach), and toxic ammonia coolant leakage. Response protocols involve donning emergency masks, isolating compartments using hermetic hatches, and retreating to docked escape vehicles if needed.',
            },
            {
              q: 'Do astronauts grow taller in space?',
              a: 'Yes! Without gravity compressing the vertebrae, spinal discs expand, causing astronauts to grow up to 3% taller (around 5 cm or 2 inches) while in orbit. Their height gradually returns to normal over several months after returning to Earth.',
            },
          ].map((faq, i) => (
            <div key={i} className="content-card">
              <h3 style={{ marginTop: 0 }}>{faq.q}</h3>
              <p>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
