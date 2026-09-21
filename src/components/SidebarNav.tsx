import React from 'react';
import { Home, LayoutGrid, Route, Clock, Folder, Settings, LogOut } from 'lucide-react';

interface SidebarNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  showOrbit: boolean;
  onToggleOrbit: () => void;
  showTerminator: boolean;
  onToggleTerminator: () => void;
  onOpenCrew: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onTabChange,
  showOrbit,
  onToggleOrbit,
  showTerminator,
  onToggleTerminator,
  onOpenCrew,
}) => {
  return (
    <aside className="w-[68px] flex-shrink-0 bg-[#090e1a]/75 backdrop-blur-xl border-r border-white/5 flex flex-col items-center justify-between py-6 select-none z-30">
      {/* Top Section */}
      <div className="flex flex-col items-center gap-7 w-full">
        {/* 1. Super Minimal "Z" Logo (from Mockup) */}
        <div className="text-white font-bold text-2xl font-sans tracking-tight cursor-default select-none">
          Z
        </div>

        {/* Vertical Nav Icons */}
        <nav className="flex flex-col items-center gap-4 w-full px-2">
          {/* Home Icon */}
          <button
            onClick={() => onTabChange('home')}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-[#182133]/90 text-amber-400 border border-white/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
            title="Overview"
          >
            <Home className="w-5 h-5 stroke-[1.75]" />
          </button>

          {/* Grid / Dashboard Icon (Active in Mockup with Amber Left Bar) */}
          <button
            onClick={() => onTabChange('dashboard')}
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative bg-[#182133]/95 text-amber-400 border border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.1)]"
            title="Live Tracker Dashboard"
          >
            {/* Left Amber Indicator Bar from Mockup */}
            <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-5 bg-amber-400 rounded-r-full shadow-[0_0_10px_#fbbf24]" />
            <LayoutGrid className="w-5 h-5 stroke-[1.75]" />
          </button>

          {/* Trajectory / Route Icon (Toggles Orbit Lines) */}
          <button
            onClick={() => {
              onTabChange('trajectory');
              onToggleOrbit();
            }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
              showOrbit
                ? 'text-amber-400/90 hover:text-amber-300 bg-[#182133]/40'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
            }`}
            title={showOrbit ? 'Orbit Tracks Active (Click to toggle)' : 'Orbit Tracks Hidden (Click to toggle)'}
          >
            <Route className="w-5 h-5 stroke-[1.75]" />
            {showOrbit && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]" />
            )}
          </button>

          {/* Clock Icon (Toggles Night Terminator Overlay) */}
          <button
            onClick={() => {
              onTabChange('clock');
              onToggleTerminator();
            }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
              showTerminator
                ? 'text-amber-400/90 hover:text-amber-300 bg-[#182133]/40'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
            }`}
            title={showTerminator ? 'Day/Night Terminator Active' : 'Day/Night Terminator Hidden'}
          >
            <Clock className="w-5 h-5 stroke-[1.75]" />
            {showTerminator && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
            )}
          </button>

          {/* Folder Icon (Opens Astronauts / Crew Roster) */}
          <button
            onClick={() => {
              onTabChange('archive');
              onOpenCrew();
            }}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-all cursor-pointer"
            title="ISS Expedition Crew"
          >
            <Folder className="w-5 h-5 stroke-[1.75]" />
          </button>

          {/* Settings Icon */}
          <button
            onClick={() => {
              onTabChange('settings');
              onOpenCrew();
            }}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-all cursor-pointer"
            title="Settings & Mission Passes"
          >
            <Settings className="w-5 h-5 stroke-[1.75]" />
          </button>
        </nav>
      </div>

      {/* Bottom Exit Button from Mockup */}
      <button
        onClick={() => window.location.reload()}
        className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-all cursor-pointer"
        title="Reload Telemetry"
      >
        <LogOut className="w-5 h-5 stroke-[1.75]" />
      </button>
    </aside>
  );
};
