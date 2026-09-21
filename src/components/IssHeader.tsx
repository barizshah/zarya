import React from 'react';
import type { CameraId } from './IssNavbar';
import { IssBrandLogo } from './IssBrandLogo';

interface IssHeaderProps {
  activeCamera?: CameraId;
  onOpenCrewModal?: () => void;
  onOpenAbout?: () => void;
}

export const IssHeader: React.FC<IssHeaderProps> = ({
  onOpenAbout,
}) => {
  return (
    <header className="header iss-ad-exclude !bg-[#0f0f0f]/95 !backdrop-blur-xl !border-b !border-white/[0.08] !shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      <div className="header-left">
        <div className="header-title">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 decoration-none text-inherit group"
          >
            {/* Polished, minimalist ISS brand badge */}
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#181818] border border-white/[0.12] group-hover:border-[#76FF03]/60 group-hover:shadow-[0_0_16px_rgba(118,255,3,0.2)] transition-all duration-300">
              <IssBrandLogo size={24} className="transition-transform duration-300 group-hover:scale-105" />
            </div>

            <div className="header-text flex flex-col">
              <h1 className="header-main-title text-base sm:text-lg tracking-wider font-semibold text-white uppercase font-mono">
                Zarya
              </h1>
            </div>
          </a>
        </div>
      </div>

      <div className="header-right flex items-center gap-2.5">
        {/* Minimal Live Orbit Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#76FF03]/[0.08] border border-[#76FF03]/25 text-[#76FF03] text-[11px] font-mono font-medium tracking-wide">
          <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#76FF03] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#76FF03] shadow-[0_0_8px_#76FF03]" />
            </span>
          <span>ORBIT ACTIVE</span>
        </div>

        {/* Minimal About Button */}
        {onOpenAbout && (
          <button
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] hover:border-[#76FF03]/40 text-[#f1f1f1] hover:text-[#76FF03] text-xs font-mono font-medium transition-all duration-200 cursor-pointer shadow-sm"
            title="About Zarya"
          >
            <span className="material-icons" style={{ fontSize: '15px', color: '#76FF03' }}>info</span>
            <span>About</span>
          </button>
        )}
      </div>
    </header>
  );
};
