import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Building2, Timer } from 'lucide-react';
import type { RocketLaunch } from '../types/iss';
import { fetchUpcomingLaunches } from '../services/issApi';

const GREEN = '#76FF03';
const BORDER = 'rgba(255,255,255,0.08)';

export const LaunchesSection: React.FC = () => {
  const [launches, setLaunches] = useState<RocketLaunch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    fetchUpcomingLaunches().then((data) => { setLaunches(data); setLoading(false); });
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getCountdown = (targetNet: string) => {
    const diff = new Date(targetNet).getTime() - now;
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, isPast: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      mins: Math.floor((diff / (1000 * 60)) % 60),
      secs: Math.floor((diff / 1000) % 60),
      isPast: false,
    };
  };

  return (
    <section className="content-section" id="launchesSection">
      <h2 className="content-section-title">
        <span className="material-icons">rocket_launch</span>
        <span>Upcoming Rocket Launches</span>
      </h2>
      <p className="content-section-subtitle">
        Real-time orbital launch manifest and live countdown clocks for upcoming missions delivering payloads, cargo, and astronauts to space.
      </p>

      {loading ? (
        <div className="info-card-label" style={{ padding: '32px', textAlign: 'center' }}>
          SYNCING GLOBAL LAUNCH MANIFEST...
        </div>
      ) : (
        <div className="content-cards-grid">
          {launches.map((launch) => {
            const countdown = getCountdown(launch.net);
            const launchDate = new Date(launch.net).toLocaleDateString(undefined, {
              month: 'short', day: 'numeric', year: 'numeric',
              hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
            });

            return (
              <div key={launch.id} className="info-card" style={{ padding: 0, overflow: 'hidden', justifyContent: 'space-between' }}>
                {/* Body */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Status + Vehicle row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span className="info-card-label" style={{
                      padding: '2px 8px', borderRadius: '4px',
                      background: 'rgba(118,255,3,0.1)',
                      border: '1px solid rgba(118,255,3,0.25)',
                      color: GREEN,
                    }}>{launch.status}</span>
                    <span className="info-card-description">{launch.rocketName}</span>
                  </div>

                  {/* Mission name */}
                  <div>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{launch.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                      <Building2 style={{ width: '12px', height: '12px', color: GREEN }} />
                      <span className="info-card-description">{launch.provider}</span>
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: '12px', color: '#cccccc', lineHeight: 1.6 }}>{launch.description}</p>

                  {/* Date + pad */}
                  <div style={{ paddingTop: '8px', borderTop: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar style={{ width: '12px', height: '12px', color: GREEN }} />
                      <span className="info-card-label">{launchDate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin style={{ width: '12px', height: '12px', color: GREEN }} />
                      <span className="info-card-label">{launch.locationName}</span>
                    </div>
                  </div>
                </div>

                {/* Countdown HUD */}
                <div style={{ padding: '10px 16px', background: '#131313', borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Timer style={{ width: '12px', height: '12px', color: GREEN }} />
                    <span className="info-card-label">T-MINUS</span>
                  </div>
                  {countdown.isPast ? (
                    <span className="info-card-description">LIFTOFF OCCURRED</span>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'JetBrains Mono, monospace', color: GREEN, fontSize: '12px', fontWeight: 700 }}>
                      {[`${countdown.days}d`, `${String(countdown.hours).padStart(2,'0')}h`, `${String(countdown.mins).padStart(2,'0')}m`, `${String(countdown.secs).padStart(2,'0')}s`].map((seg, i) => (
                        <span key={i} style={{ padding: '2px 5px', borderRadius: '4px', background: '#212121', border: `1px solid ${BORDER}` }}>{seg}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
