import React from 'react';
import { X, Globe, Radio, Sparkles } from 'lucide-react';
import { IssBrandLogo } from './IssBrandLogo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#181818] border border-white/[0.1] rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#212121]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#181818] border border-white/[0.12] flex items-center justify-center shadow-sm">
              <IssBrandLogo size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono tracking-wide">ZARYA • About</h3>
              <p className="text-xs text-[#76FF03] font-mono">Autonomous Orbital Telemetry &amp; Live Feeds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#aaaaaa] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5 text-xs text-[#e0e0e0] leading-relaxed font-sans overflow-y-auto max-h-[70vh]">
          {/* What is Zarya */}
          <div className="p-3.5 rounded-xl bg-[#212121] border border-[#76FF03]/25 flex gap-3 items-start">
            <Sparkles className="w-4 h-4 text-[#76FF03] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white mb-1">What is Zarya?</div>
              <p className="text-[#cccccc]">
                Named after the first ISS module launched in 1998 — Russian for &quot;Dawn&quot; — Zarya is a real-time telemetry console and live video dashboard tracking humanity&apos;s orbital outpost at 27,580 km/h.
              </p>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#212121] border border-white/[0.08]">
              <div className="flex items-center gap-2 text-[#76FF03] font-mono text-[11px] font-semibold mb-1.5">
                <Radio className="w-3.5 h-3.5" />
                <span>TELEMETRY</span>
              </div>
              <p className="text-[11px] text-[#aaaaaa] leading-relaxed">
                Real-time orbital coordinates, altitude, velocity, and ground location refreshed every 4 seconds.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#212121] border border-white/[0.08]">
              <div className="flex items-center gap-2 text-[#76FF03] font-mono text-[11px] font-semibold mb-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>ESA TRACKER</span>
              </div>
              <p className="text-[11px] text-[#aaaaaa] leading-relaxed">
                Live precision tracking via the European Space Agency orbital flight dynamics engine.
              </p>
            </div>
          </div>

          {/* Data sources */}
          <div className="p-3 rounded-xl bg-[#212121] border border-white/[0.06] text-[11px] text-[#aaaaaa] space-y-1.5">
            <div className="text-white font-semibold text-xs mb-2">Data Sources</div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#76FF03] shrink-0" />
              WhereTheISS.at REST Telemetry Engine
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#76FF03] shrink-0" />
              European Space Agency (ESA) ISS Ground Track
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#76FF03] shrink-0" />
              NASA &amp; Sen.com Live Commercial HD/4K Feeds
            </div>
          </div>

          {/* Creator Attribution */}
          <a
            href="https://github.com/barizsh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-[#212121] border border-white/[0.08] hover:border-[#76FF03]/40 hover:bg-[#252525] transition-all duration-200 group no-underline"
            style={{ textDecoration: 'none' }}
          >
            <div className="w-8 h-8 rounded-lg bg-[#181818] border border-white/[0.12] flex items-center justify-center shrink-0">
              {/* GitHub SVG icon */}
              <svg className="w-4 h-4" fill="#76FF03" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[10px] text-[#666] font-mono uppercase tracking-widest">Built by</span>
              <span className="text-xs text-white font-mono font-medium group-hover:text-[#76FF03] transition-colors duration-200">
                @barizsh
              </span>
            </div>
            <span className="ml-auto text-[#555] group-hover:text-[#76FF03] transition-colors duration-200 text-sm">↗</span>
          </a>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#181818] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#76FF03] opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#76FF03]" />
            </span>
            <span className="text-[11px] font-mono text-[#76FF03]">v2.0 • Live</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#76FF03] hover:bg-[#64dd17] text-black text-xs font-semibold transition-all cursor-pointer shadow-lg shadow-[#76FF03]/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
