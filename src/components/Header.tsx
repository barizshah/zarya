import React, { useState, useEffect } from 'react';
import { Users, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { IssBrandLogo } from './IssBrandLogo';

interface HeaderProps {
  onOpenCrew: () => void;
  crewCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCrew, crewCount }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <header className="h-16 px-4 md:px-6 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between z-30 select-none">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3.5">
        <div className="relative group flex items-center justify-center w-10 h-10 rounded-xl bg-[#181818] border border-white/[0.12] shadow-md group-hover:border-[#76FF03]/60 transition-all">
          <IssBrandLogo size={24} className="transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#76FF03] rounded-full border-2 border-[#0b0f19] animate-pulse shadow-[0_0_6px_#76FF03]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-wider text-slate-100 flex items-center gap-1.5">
              ZARYA
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold tracking-wider">
                ISS Live
              </span>
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 tracking-wide hidden sm:block">
            High-Definition Earth Stream & Orbital HUD
          </p>
        </div>
      </div>

      {/* Center UTC Clock & Status */}
      <div className="hidden md:flex items-center gap-4 bg-slate-900/60 border border-slate-800/80 rounded-full px-4 py-1.5 text-xs text-slate-300 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] text-emerald-400 font-medium">LIVE TELEMETRY</span>
        </div>
        <div className="h-3 w-px bg-slate-700/60" />
        <div className="font-mono text-slate-300 font-medium tracking-tight">
          {utcTime || 'SYNCING UTC...'}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenCrew}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium text-slate-200 transition-all cursor-pointer shadow-sm active:scale-95"
          title="View astronauts on ISS"
        >
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Crew</span>
          <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[11px]">
            {crewCount}
          </span>
        </button>

        <button
          onClick={() => setIsAudioPlaying(!isAudioPlaying)}
          className={`p-2 rounded-lg border transition-all cursor-pointer shadow-sm active:scale-95 ${
            isAudioPlaying
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 border-slate-700/60'
          }`}
          title={isAudioPlaying ? 'Mute ambient sound' : 'Play ambient space sound'}
        >
          {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 transition-all cursor-pointer shadow-sm active:scale-95"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
