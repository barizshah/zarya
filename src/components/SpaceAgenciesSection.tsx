import React from 'react';
import { Building2, Rocket } from 'lucide-react';
import { SPACE_AGENCIES } from '../data/spaceData';

const GREEN = '#76FF03';
const BORDER = 'rgba(255,255,255,0.08)';

export const SpaceAgenciesSection: React.FC = () => {
  return (
    <section className="content-section" id="agenciesSection">
      <h2 className="content-section-title">
        <span className="material-icons">public</span>
        <span>Global Space Agencies</span>
      </h2>
      <p className="content-section-subtitle">
        International government space organizations cooperating to advance human exploration, robotic planetary science, and the ISS program.
      </p>

      <div className="content-cards-grid">
        {SPACE_AGENCIES.map((agency) => (
          <div key={agency.id} className="info-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="info-card-icon" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  {agency.flag}
                </div>
                <div>
                  <div className="info-card-title">{agency.code}</div>
                  <div className="info-card-description">{agency.name}</div>
                </div>
              </div>
              <span className="info-card-label" style={{ padding: '3px 8px', borderRadius: '6px', background: '#212121', border: `1px solid ${BORDER}`, whiteSpace: 'nowrap' }}>
                Est. {agency.founded}
              </span>
            </div>

            {/* Description */}
            <p style={{ margin: 0, fontSize: '12px', color: '#cccccc', lineHeight: 1.65 }}>{agency.description}</p>

            {/* ISS Contribution box */}
            <div style={{ padding: '10px 12px', borderRadius: '8px', background: '#212121', border: `1px solid ${BORDER}` }}>
              <div className="info-card-label" style={{ marginBottom: '5px', color: GREEN }}>ISS PROGRAM CONTRIBUTION:</div>
              <div className="info-card-description" style={{ fontSize: '11px', lineHeight: 1.55 }}>{agency.roleInIss}</div>
            </div>

            {/* Fleet + HQ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Rocket style={{ width: '12px', height: '12px', color: GREEN }} />
                <span className="info-card-description">Fleet: {agency.primaryRockets.join(', ')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 style={{ width: '12px', height: '12px', color: GREEN }} />
                <span className="info-card-description">HQ: {agency.headquarters}</span>
              </div>
            </div>

            {/* Footer */}
            <div style={{ paddingTop: '10px', borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="info-card-label">MEMBER NATION / ALLIANCE</span>
              <span className="info-card-value" style={{ fontSize: '12px' }}>{agency.country}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
