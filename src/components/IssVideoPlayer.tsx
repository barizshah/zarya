import React, { useState, useEffect } from 'react';
import type { CameraId } from './IssNavbar';

interface IssVideoPlayerProps {
  activeCamera: CameraId;
}

interface CameraMetadata {
  title: string;
  subtitle: string;
  youtubeId: string;
}

const CAMERAS: Record<CameraId, CameraMetadata> = {
  '4k': {
    title: 'Sen 4K Ultra HD — Space Station Live',
    subtitle: 'Commercial 4K Ultra-HD • Sen.com',
    youtubeId: 'fO9e9jnhYK8',
  },
  hd: {
    title: 'NASA ISS Live — High Definition Earth Cam',
    subtitle: 'High Definition Views • Earth & Station',
    youtubeId: 'ROboUHfPUrU',
  },
  sd: {
    title: 'NASA ISS Live — SD Camera & Mission Audio',
    subtitle: 'Standard Definition • TDRSS Mission Audio',
    youtubeId: 'M3HKLzjvKPc',
  },
};

export const IssVideoPlayer: React.FC<IssVideoPlayerProps> = ({
  activeCamera,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when active camera changes
  useEffect(() => {
    setIsLoading(true);
  }, [activeCamera]);

  const currentCam = CAMERAS[activeCamera] || CAMERAS['4k'];

  return (
    <div className="video-player select-none">
      <div className="video-container relative w-full h-full bg-[#000000] overflow-hidden" id="videoContainer">
        {isLoading && (
          <div
            className="video-overlay loading absolute inset-0 flex items-center justify-center bg-[#000000] z-10 transition-opacity duration-300 pointer-events-none"
            id="videoOverlay"
          >
            <div className="loading-spinner-large" />
          </div>
        )}

        {/* Only mount single active camera iframe to avoid background streaming/resource usage */}
        <iframe
          key={activeCamera}
          className="video-iframe w-full h-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${currentCam.youtubeId}?autoplay=1&mute=1&controls=1&playsinline=1&rel=0&modestbranding=1`}
          title={currentCam.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="eager"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
};
