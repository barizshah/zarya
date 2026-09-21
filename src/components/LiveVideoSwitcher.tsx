import React, { useState } from 'react';
import { MoreHorizontal, Play, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface FeedConfig {
  id: string;
  sourceKey: 'hd' | 'sd' | '4k';
  title: string;
  youtubeId: string;
  topBadge: { text: string; color: string };
  bottomBadge: { text: string; color: string };
  previewImg: string;
  hasAudioWaveform?: boolean;
}

const FEEDS: FeedConfig[] = [
  {
    id: 'nasa-cam-1',
    sourceKey: 'hd',
    title: 'NASA Cam 1: Earth HD',
    youtubeId: 'M3HKLzjvKPc',
    topBadge: { text: 'HS', color: 'bg-amber-400' },
    bottomBadge: { text: 'HD', color: 'bg-emerald-400' },
    // Earth from space thumbnail matching Card 1 in mockup
    previewImg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'nasa-cam-2',
    sourceKey: 'sd',
    title: 'NASA Cam 2: Ops & Audio',
    youtubeId: 'awQzjn72bI0',
    topBadge: { text: 'ISS', color: 'bg-emerald-400' },
    bottomBadge: { text: 'T3', color: 'bg-emerald-400' },
    // ISS module and robotic arm thumbnail matching Card 2 in mockup
    previewImg: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop',
    hasAudioWaveform: true,
  },
  {
    id: 'sen-4k',
    sourceKey: '4k',
    title: 'Sen 4K: Ultra HD Stream',
    youtubeId: 'fO9e9jnhYK8', // Sen's verified 24/7 4K live stream
    topBadge: { text: 'ISS', color: 'bg-amber-400' },
    bottomBadge: { text: '4K', color: 'bg-emerald-400' },
    // Space stars and ISS solar array thumbnail matching Card 3 in mockup
    previewImg: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop',
  },
];

export const LiveVideoSwitcher: React.FC = () => {
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [fullscreenFeed, setFullscreenFeed] = useState<FeedConfig | null>(null);

  const togglePlay = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePlayingId(activePlayingId === id ? null : id);
  };

  return (
    <aside className="w-full lg:w-[350px] xl:w-[380px] h-full bg-[#090e1a]/70 backdrop-blur-xl border-l border-white/5 flex flex-col justify-between p-4 select-none z-20 overflow-y-auto">
      <div>
        {/* Header from Mockup: "Live Video Switcher" and "..." */}
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-sm font-semibold tracking-wide text-slate-100">
            Live Video Switcher
          </h2>
          <button className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer p-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Stacked Video Cards from Mockup */}
        <div className="space-y-3.5">
          {FEEDS.map((feed) => {
            const isPlaying = activePlayingId === feed.id;

            return (
              <div
                key={feed.id}
                onClick={() => setActivePlayingId(isPlaying ? null : feed.id)}
                className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer ${
                  isPlaying
                    ? 'border-amber-500/50 bg-[#141c2c]/90 shadow-xl ring-1 ring-amber-500/20'
                    : 'border-white/10 bg-[#121929]/70 backdrop-blur-md hover:border-white/20'
                }`}
              >
                {/* 16:9 Thumbnail / Live Video Frame */}
                <div className="relative aspect-video w-full bg-black overflow-hidden">
                  {isPlaying ? (
                    <iframe
                      className="w-full h-full border-0 pointer-events-auto"
                      src={`https://www.youtube-nocookie.com/embed/${feed.youtubeId}?autoplay=1&mute=${
                        isMuted ? 1 : 0
                      }&controls=1&playsinline=1&rel=0&modestbranding=1`}
                      title={feed.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img
                        src={feed.previewImg}
                        alt={feed.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30" />
                    </>
                  )}

                  {/* Center Play Button Circle (exact match to Mockup) */}
                  {!isPlaying && (
                    <div
                      onClick={(e) => togglePlay(feed.id, e)}
                      className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 group-hover:bg-black/80 border border-white/30 flex items-center justify-center text-white transition-all shadow-xl group-hover:scale-110"
                    >
                      <Play className="w-5 h-5 ml-0.5 fill-white" />
                    </div>
                  )}

                  {/* Top Right Status Badge (e.g. HS / ISS from Mockup) */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-mono font-medium text-slate-300 border border-white/10 pointer-events-none">
                    <span className={`w-1.5 h-1.5 rounded-full ${feed.topBadge.color}`} />
                    <span>{feed.topBadge.text}</span>
                  </div>

                  {/* Active Playing Quick Controls */}
                  {isPlaying && (
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(!isMuted);
                        }}
                        className="p-1 rounded bg-black/75 hover:bg-black text-slate-300 hover:text-white backdrop-blur-md border border-white/10"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFullscreenFeed(feed);
                        }}
                        className="p-1 rounded bg-black/75 hover:bg-black text-slate-300 hover:text-white backdrop-blur-md border border-white/10"
                        title="Expand View"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Audio Waveform Equalizer on Card 2 (exact match to Mockup) */}
                  {feed.hasAudioWaveform && (
                    <div className="absolute bottom-1 inset-x-4 h-6 flex items-center justify-center gap-[3px] pointer-events-none opacity-85">
                      {[30, 55, 20, 75, 45, 90, 35, 80, 50, 95, 40, 70, 90, 60, 30, 85, 50, 75, 40, 25, 60, 35, 80, 45, 90].map(
                        (h, idx) => (
                          <span
                            key={idx}
                            style={{ height: `${h}%` }}
                            className={`w-[3px] rounded-full bg-slate-300/80 ${
                              isPlaying ? 'animate-pulse' : ''
                            }`}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Card Title & Bottom Badge Row from Mockup */}
                <div className="px-3 py-2 flex items-center justify-between bg-[#121929]/90 border-t border-white/5">
                  <div className="text-xs font-semibold text-slate-200 tracking-wide">
                    {feed.title}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono font-medium text-slate-300">
                    <span className={`w-1.5 h-1.5 rounded-full ${feed.bottomBadge.color} shadow-[0_0_6px_#34d399]`} />
                    <span>{feed.bottomBadge.text}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Pagination Dots from Mockup: ● ○ */}
      <div className="flex items-center justify-center gap-2 pt-3">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
      </div>

      {/* Expanded Modal Player */}
      {fullscreenFeed && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <iframe
              className="w-full h-full border-0"
              src={`https://www.youtube-nocookie.com/embed/${fullscreenFeed.youtubeId}?autoplay=1&mute=0&controls=1`}
              title={fullscreenFeed.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              onClick={() => setFullscreenFeed(null)}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-xs font-semibold border border-white/20 cursor-pointer"
            >
              Close Stream
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
