import React from 'react';
import type { ISSPosition } from '../types/iss';

interface MockupHUDProps {
  telemetry: ISSPosition | null;
}

export const MockupHUD: React.FC<MockupHUDProps> = ({ telemetry }) => {
  const altitude = telemetry ? `${Math.round(telemetry.altitude)} KM` : '418 KM';
  const speed = telemetry
    ? `${Math.round(telemetry.velocity).toLocaleString()} KM/H`
    : '27,580 KM/H';

  const formatCoord = (val: number, type: 'lat' | 'lon') => {
    const abs = Math.abs(val).toFixed(1);
    if (type === 'lat') return `${abs}°${val >= 0 ? 'N' : 'S'}`;
    return `${abs}°${val >= 0 ? 'W' : 'E'}`;
  };

  const coords = telemetry
    ? `${formatCoord(telemetry.latitude, 'lat')}, ${formatCoord(telemetry.longitude, 'lon')}`
    : '45.2°N, 172.8°W';

  const overheadStatus = telemetry?.locationName
    ? telemetry.locationName.toUpperCase()
    : 'ACQUIRING SIGNAL';

  return (
    <div className="px-6 pt-3 pb-2 select-none z-20">
      {/* Floating Glassmorphism Pill from Mockup */}
      <div className="bg-[#121929]/70 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-wrap lg:flex-nowrap items-center justify-between gap-6">
        {/* 1. ALTITUDE */}
        <div className="flex flex-col min-w-[120px]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#d97706]">
            ALTITUDE
          </span>
          <span className="text-2xl font-bold font-mono text-[#f59e0b] tracking-tight">
            {altitude}
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="hidden sm:block w-px h-9 bg-white/10" />

        {/* 2. SPEED */}
        <div className="flex flex-col min-w-[150px]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#d97706]">
            SPEED
          </span>
          <span className="text-2xl font-bold font-mono text-[#f59e0b] tracking-tight">
            {speed}
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px h-9 bg-white/10" />

        {/* 3. COORDINATES */}
        <div className="flex flex-col min-w-[170px]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            COORDINATES
          </span>
          <span className="text-xl font-bold font-mono text-[#38bdf8] tracking-tight">
            {coords}
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="hidden lg:block w-px h-9 bg-white/10" />

        {/* 4. OVERHEAD STATUS */}
        <div className="flex flex-col min-w-[190px] max-w-[260px]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            OVERHEAD STATUS:
          </span>
          <span className="text-xl font-bold font-mono text-[#38bdf8] tracking-tight truncate">
            {overheadStatus}
          </span>
        </div>

        {/* Far Right: ISS Silhouette Icon + 5 Indicator Dots from Mockup */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Detailed ISS Vector Graphic */}
          <div className="text-[#38bdf8] flex items-center justify-center">
            <svg
              className="w-9 h-9 text-[#38bdf8]"
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              {/* Central Truss Spine */}
              <line x1="6" y1="24" x2="42" y2="24" strokeWidth="2.5" />
              {/* Pressurized Modules Body */}
              <rect x="21" y="16" width="6" height="16" rx="1.5" fill="currentColor" fillOpacity="0.25" />
              {/* Module Cross Hab */}
              <line x1="20" y1="20" x2="28" y2="20" strokeWidth="2" />
              <line x1="20" y1="28" x2="28" y2="28" strokeWidth="2" />
              {/* Left Wing Solar Array 1 & 2 */}
              <rect x="8" y="10" width="5" height="28" rx="0.5" fill="currentColor" fillOpacity="0.3" />
              <line x1="8" y1="19" x2="13" y2="19" />
              <line x1="8" y1="29" x2="13" y2="29" />
              {/* Right Wing Solar Array 1 & 2 */}
              <rect x="35" y="10" width="5" height="28" rx="0.5" fill="currentColor" fillOpacity="0.3" />
              <line x1="35" y1="19" x2="40" y2="19" />
              <line x1="35" y1="29" x2="40" y2="29" />
            </svg>
          </div>

          {/* 5 Cyan/Teal Indicator Dots from Mockup */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-ping" />
          </div>
        </div>
      </div>
    </div>
  );
};
