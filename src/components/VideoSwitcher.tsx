import React, { useState } from 'react';
import type { CameraFeed } from '../types/iss';
import { Video, Radio, Sparkles, ExternalLink, RefreshCw, Volume2, VolumeX, Eye } from 'lucide-react';

const CAMERA_FEEDS: CameraFeed[] = [
  {
    id: 'nasa-hd',
    name: 'NASA Cam 1: Earth HD',
    subtitle: 'Primary Views of Earth from ISS HDEV',
    youtubeId: 'FuuC4dpSQ1M',
    quality: '1080p HD',
    description: 'High-definition external views looking directly down at Earth oceans and continents.',
    type: 'earth',
    badge: 'LIVE HD',
  },
  {
    id: 'nasa-sd',
    name: 'NASA Cam 2: Ops & Audio',
    subtitle: 'Operations & Air-to-Ground Radio',
    youtubeId: 'uwXgcTc8oY8',
    quality: '720p 60fps',
    description: 'Secondary operations feed showing docking, spacewalks, module views, and mission control communications.',
    type: 'ops',
    badge: 'MISSION COMMS',
  },
  {
    id: 'sen-4k',
    name: 'Sen 4K: Ultra HD Stream',
    subtitle: 'Sen.com Commercial 4K ISS Cam',
    youtubeId: 'fO9e9jnhYK8',
    quality: '4K UHD',
    description: 'Ultra-high-definition 4K real-time broadcast from Sen camera platform on the Columbus module.',
    type: '4k',
    badge: '4K ULTRA HD',
  },
];

interface VideoSwitcherProps {
  isSolarNight?: boolean;
}

export const VideoSwitcher: React.FC<VideoSwitcherProps> = ({ isSolarNight }) => {
  const [activeFeedId, setActiveFeedId] = useState<string>('nasa-hd');
  const [isMuted, setIsMuted] = useState(true);
  const [keyCounter, setKeyCounter] = useState(0);

  const activeFeed = CAMERA_FEEDS.find((f) => f.id === activeFeedId) || CAMERA_FEEDS[0];

  const refreshStream = () => {
    setKeyCounter((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full bg-[#080c16] border-l border-slate-800/80 select-none">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-slate-100 tracking-wide">Live Video Switcher</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={refreshStream}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            title="Reload Video Stream"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE
          </span>
        </div>
      </div>

      {/* Main Video Screen Container */}
      <div className="relative aspect-video w-full bg-black flex-shrink-0 overflow-hidden group shadow-2xl">
        <iframe
          key={`${activeFeed.youtubeId}-${keyCounter}`}
          className="w-full h-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${activeFeed.youtubeId}?autoplay=1&mute=${
            isMuted ? 1 : 0
          }&controls=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`}
          title={activeFeed.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />

        {/* Video Overlays (HUD Badge) */}
        <div className="absolute top-2 left-2 pointer-events-none flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-slate-200 font-mono text-[10px] font-semibold border border-white/10 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            {activeFeed.quality}
          </span>
          {isSolarNight && (
            <span className="px-2 py-0.5 rounded bg-indigo-950/80 backdrop-blur-md text-indigo-300 font-mono text-[10px] border border-indigo-500/30">
              ORBITAL NIGHT (DARK FEED)
            </span>
          )}
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-1">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-md bg-black/60 hover:bg-black/90 backdrop-blur-md text-slate-300 hover:text-white border border-white/10 transition-colors shadow-lg cursor-pointer"
            title={isMuted ? 'Unmute Stream' : 'Mute Stream'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        </div>

        {/* Stream title bar bottom */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2.5 flex items-center justify-between pointer-events-none">
          <div>
            <div className="text-xs font-semibold text-white tracking-wide">{activeFeed.name}</div>
            <div className="text-[10px] text-slate-400 truncate max-w-[240px]">{activeFeed.subtitle}</div>
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${activeFeed.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto p-1 text-slate-400 hover:text-white transition-colors"
            title="Open stream in YouTube"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Camera Selection List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold px-1">
          Available Orbital Streams ({CAMERA_FEEDS.length})
        </div>

        {CAMERA_FEEDS.map((feed) => {
          const isSelected = feed.id === activeFeedId;
          return (
            <div
              key={feed.id}
              onClick={() => setActiveFeedId(feed.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer text-left flex flex-col gap-1 relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-500/50 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/40 hover:bg-slate-800/50 border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                  {feed.type === 'earth' && <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                  {feed.type === 'ops' && <Radio className="w-3.5 h-3.5 text-amber-400" />}
                  {feed.type === '4k' && <Sparkles className="w-3.5 h-3.5 text-violet-400" />}
                  {feed.name}
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {feed.quality}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {feed.description}
              </p>

              {/* Status footer inside card */}
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'
                    }`}
                  />
                  {isSelected ? 'ACTIVE STREAM' : 'STANDBY'}
                </span>
                <span>{feed.badge}</span>
              </div>
            </div>
          );
        })}

        {/* Informational Loss-of-Signal Box */}
        <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800/60 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            Signal Loss & Night Pass Notice
          </div>
          <p className="text-[10px] leading-relaxed text-slate-400">
            Cameras frequently transit Earth's night side (~45 minutes every 90 minutes). During orbital night, views appear pitch-black or show city lights. Temporary blue or grey screens indicate Ku-band TDRS satellite handovers.
          </p>
        </div>
      </div>
    </div>
  );
};
