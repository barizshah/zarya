import React from 'react';
import { Navigation, Rocket } from 'lucide-react';
import { LAUNCH_SITES } from '../data/spaceData';

const GREEN = '#76FF03';
const BORDER = 'rgba(255,255,255,0.08)';

export const LaunchSitesSection: React.FC = () => {
  return (
    <section className="content-section" id="launchSitesSection">
      <h2 className="content-section-title">
        <span className="material-icons">place</span>
        <span>Major Spaceports &amp; Launch Sites</span>
      </h2>
      <p className="content-section-subtitle">
        Primary orbital gateways around the world from which rockets launch human crew, robotic explorers, and commercial satellites into Earth orbit.
      </p>

      <div className="content-cards-grid">
        {LAUNCH_SITES.map((site) => (
          <div key={site.id} className="info-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Card Header */}
            <div style={{ padding: '16px', background: '#141414', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Flag icon box */}
              <div className="info-card-icon" style={{ width: '48px', height: '48px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                {site.flag}
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="info-card-title" style={{ marginBottom: '4px' }}>{site.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Navigation style={{ width: '11px', height: '11px', transform: 'rotate(45deg)', color: GREEN, flexShrink: 0 }} />
                  <span className="info-card-value" style={{ fontSize: '11px' }}>{site.coordinates}</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#cccccc', lineHeight: 1.65 }}>{site.description}</p>
              <div style={{ paddingTop: '8px', borderTop: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div>
                  <span className="info-card-label">OPERATOR: </span>
                  <span className="info-card-description">{site.operator}</span>
                </div>
                <div>
                  <span className="info-card-label">KEY COMPLEXES: </span>
                  <span className="info-card-description">{site.notablePads.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '8px 16px', background: '#141414', borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Rocket style={{ width: '11px', height: '11px', color: GREEN }} />
                <span className="info-card-label">ACTIVE SPACEPORT</span>
              </div>
              <span className="info-card-value" style={{ fontSize: '11px' }}>ORBITAL</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
