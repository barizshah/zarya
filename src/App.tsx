import React, { useState, useEffect, useCallback } from 'react';
import type { ISSPosition, Astronaut } from './types/iss';
import { fetchISSPosition, fetchISSCrew } from './services/issApi';
import { IssHeader } from './components/IssHeader';
import type { CameraId } from './components/IssNavbar';
import { IssVideoPlayer } from './components/IssVideoPlayer';
import { MapTracker } from './components/MapTracker';
import { IssContentSections } from './components/IssContentSections';
import { CrewModal } from './components/CrewModal';
import { AboutModal } from './components/AboutModal';

export const App: React.FC = () => {
  const [telemetry, setTelemetry] = useState<ISSPosition | null>(null);
  const [crew, setCrew] = useState<Astronaut[]>([]);
  const [activeCamera, setActiveCamera] = useState<CameraId>('4k');
  const [activeSection, setActiveSection] = useState<string>('');
  const [isCrewModalOpen, setIsCrewModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Always dark mode — lock theme permanently
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
  }, []);

  // Poll live ISS coordinates from WhereTheISS API every 4s
  const syncPosition = useCallback(async () => {
    try {
      const data = await fetchISSPosition();
      setTelemetry(data);
    } catch (e) {
      console.warn('Telemetry polling fallback:', e);
    }
  }, []);

  useEffect(() => {
    syncPosition();
    fetchISSCrew().then(setCrew);

    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        syncPosition();
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [syncPosition]);

  return (
    <div className="iss-app-root">
      {/* 1. Header (Fixed 64px) */}
      <IssHeader
        activeCamera={activeCamera}
        onOpenAbout={() => setIsAboutModalOpen(true)}
      />

      {/* 2. Main Container (Main Content) */}
      <div className="main-container">
        {/* Main Content Area */}
        <main className="main-content">
          <div className="content-layout">
            {/* Top 50/50 Video & Map Container */}
            <div className="video-map-container iss-ad-exclude">
              {/* Map Section */}
              <section className="map-section">
                <MapTracker />
              </section>

              {/* Video Section */}
              <section className="video-section">
                <IssVideoPlayer
                  activeCamera={activeCamera}
                  onSelectCamera={setActiveCamera}
                />
              </section>
            </div>

            {/* Below Video/Map: Stream toggles bar, Info cards, Location, Crew, Camera grid, Space & About */}
            <IssContentSections
              telemetry={telemetry}
              crew={crew}
              activeCamera={activeCamera}
              onSelectCamera={setActiveCamera}
              activeSection={activeSection}
              onSelectSection={setActiveSection}
              onOpenCrewModal={() => setIsCrewModalOpen(true)}
            />
          </div>
        </main>
      </div>

      {/* Crew & Passes Dialog */}
      <CrewModal
        isOpen={isCrewModalOpen}
        onClose={() => setIsCrewModalOpen(false)}
        crew={crew}
      />

      {/* Minimal About Dialog */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
};

export default App;
