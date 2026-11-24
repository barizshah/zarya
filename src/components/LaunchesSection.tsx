import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Building2, Timer, RefreshCw } from 'lucide-react';
import type { RocketLaunch } from '../types/iss';
import { fetchUpcomingLaunches } from '../services/issApi';

const GREEN = '#76FF03';
const BORDER = 'rgba(255,255,255,0.08)';

export const LaunchesSection: React.FC = () => {
  const [launches, setLaunches] = useState<RocketLaunch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [now, setNow] = useState<number>(() => Date.now());

  const loadData = async (force = false) => {
    if (force) setRefreshing(true);
    try {
      const data = await fetchUpcomingLaunches(force);
      setLaunches(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(false);
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getCountdown = (targetNet: string) => {
    const targetMs = new Date(targetNet).getTime();
    if (isNaN(targetMs)) {
      return { days: 0, hours: 0, mins: 0, secs: 0, isPast: false, isTBD: true };
    }
    const diff = targetMs - now;
    if (diff <= 0) {
      const elapsed = Math.abs(diff);
      const elapsedMins = Math.floor(elapsed / (1000 * 60));
      return {
        days: 0,
        hours: 0,
        mins: 0,
        secs: 0,
        isPast: true,
        isTBD: false,
        elapsedText: elapsedMins < 60 ? `T+${elapsedMins}m (IN FLIGHT)` : 'LIFTOFF COMPLETED'
      };
    }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      mins: Math.floor((diff / (1000 * 60)) % 60),
      secs: Math.floor((diff / 1000) % 60),
      isPast: false,
      isTBD: false,
    };
  };

  return (
    <section className="content-section" id="launchesSection">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
        <div>
          <h2 className="content-section-title" style={{ margin: 0 }}>
            <span className="material-icons">rocket_launch</span>
            <span>Upcoming Rocket Launches</span>
          </h2>
          <p className="content-section-subtitle" style={{ margin: '6px 0 0 0' }}>
            Real-time orbital launch manifest and live countdown clocks for upcoming missions delivering payloads, cargo, and astronauts to space.
          </p>
        </div>
        <button
          onClick={() => loadData(true)}
          disabled={loading || refreshing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${BORDER}`,
            borderRadius: '6px',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 600,
            cursor: loading || refreshing ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
          title="Force fresh sync with launch manifest providers"
        >
          <RefreshCw style={{ width: '13px', height: '13px', color: GREEN, animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          <span>{refreshing ? 'Syncing...' : 'Sync Manifest'}</span>
        </button>
      </div>

      {loading ? (
        <div className="info-card-label" style={{ padding: '32px', textAlign: 'center' }}>
          SYNCING GLOBAL LAUNCH MANIFEST...
        </div>
      ) : (
        <div className="content-cards-grid">
          {launches.map((launch) => {
            const countdown = getCountdown(launch.net);
            const parsedDate = new Date(launch.net);
            const isValidDate = !isNaN(parsedDate.getTime());
            
            const launchDateLocal = isValidDate ? parsedDate.toLocaleDateString(undefined, {
              month: 'short', day: 'numeric', year: 'numeric',
              hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'short',
            }) : 'TBD';

            const launchDateUTC = isValidDate ? parsedDate.toLocaleDateString('en-US', {
              month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC'
            }) + ' UTC' : '';

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
                      <span className="info-card-label">
                        {launchDateLocal} {launchDateUTC ? `(${launchDateUTC})` : ''}
                      </span>
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
                    <span className="info-card-label">{countdown.isPast ? 'STATUS' : 'T-MINUS'}</span>
                  </div>
                  {countdown.isTBD ? (
                    <span className="info-card-description">TARGET DATE TBD</span>
                  ) : countdown.isPast ? (
                    <span className="info-card-description" style={{ color: '#ffb74d', fontWeight: 600 }}>
                      {countdown.elapsedText || 'LIFTOFF OCCURRED'}
                    </span>
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
