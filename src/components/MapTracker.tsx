import React, { useState, useRef, useEffect } from 'react';

export const MapTracker: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // ESA tracker has a fixed internal layout size of 625px × 352px (16:9)
  // When embedded directly in an iframe, any width !== 625 leaves white background bars.
  // We dynamically scale the 625×352 iframe to perfectly fill 100% of the parent container.
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const currentWidth = containerRef.current.clientWidth;
        if (currentWidth > 0) {
          setScale(currentWidth / 625);
        }
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateScale);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="map-container relative w-full h-full bg-[#000000] overflow-hidden flex items-center justify-center"
      style={{
        aspectRatio: '16 / 9',
        position: 'relative',
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#070b14] z-10">
          <div className="loading-spinner-large" />
        </div>
      )}

      {/* Official ESA International Space Station Tracker */}
      <iframe
        src="https://isstracker.spaceflight.esa.int/"
        title="ESA ISS Tracker"
        className="border-0 select-none"
        allow="fullscreen"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        style={{
          width: '625px',
          height: '352px',
          minWidth: '625px',
          minHeight: '352px',
          maxWidth: '625px',
          maxHeight: '352px',
          border: 'none',
          display: 'block',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          pointerEvents: 'auto',
          backgroundColor: '#000000',
        }}
      />
    </div>
  );
};
