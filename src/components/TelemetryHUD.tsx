import React, { useState } from 'react';
import type { ISSPosition } from '../types/iss';
import { Gauge, Compass, Globe, Sun, Moon, ArrowUpRight, Signal } from 'lucide-react';

interface TelemetryHUDProps {
  telemetry: ISSPosition | null;
  isLoading: boolean;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ telemetry, isLoading }) => {
  const [useImperial, setUseImperial] = useState(false);

  const formatCoord = (val: number, type: 'lat' | 'lon') => {
    const abs = Math.abs(val).toFixed(2);
    if (type === 'lat') return `${abs}° ${val >= 0 ? 'N' : 'S'}`;
    return `${abs}° ${val >= 0 ? 'E' : 'W'}`;
  };

  const altitudeDisplay = telemetry
    ? useImperial
      ? `${(telemetry.altitude * 0.621371).toFixed(1)} MI`
      : `${telemetry.altitude.toFixed(1)} KM`
    : '418.2 KM';

  const speedDisplay = telemetry
    ? useImperial
      ? `${Math.round(telemetry.velocity * 0.621371).toLocaleString()} MPH`
      : `${Math.round(telemetry.velocity).toLocaleString()} KM/H`
    : '27,580 KM/H';

  const coordsDisplay = telemetry
    ? `${formatCoord(telemetry.latitude, 'lat')}, ${formatCoord(telemetry.longitude, 'lon')}`
    : '0.00° N, 0.00° E';

  const isSunlit = telemetry ? telemetry.visibility === 'daylight' : true;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2.5 p-3 md:p-4 bg-[#080c16]/80 backdrop-blur-md border-b border-slate-800/80 select-none">
      {/* 1. Altitude Card */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between shadow-lg relative overflow-hidden group">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-semibold tracking-wider uppercase text-[11px] text-slate-400 flex items-center gap-1.5">
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
            Altitude
          </span>
          <button
            onClick={() => setUseImperial(!useImperial)}
            className="text-[10px] text-slate-500 hover:text-slate-300 font-mono transition-colors"
            title="Toggle Metric/Imperial"
          >
            {useImperial ? 'MI' : 'KM'}
          </button>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl md:text-2xl font-bold font-mono text-amber-400 tracking-tight">
            {isLoading && !telemetry ? '---' : altitudeDisplay}
          </span>
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5 truncate">Low Earth Orbit (LEO)</div>
        <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/5 rounded-bl-full pointer-events-none" />
      </div>

      {/* 2. Speed Card */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between shadow-lg relative overflow-hidden group">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-semibold tracking-wider uppercase text-[11px] text-slate-400 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            Orbital Velocity
          </span>
          <span className="text-[10px] font-mono text-slate-500">~7.66 km/s</span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl md:text-2xl font-bold font-mono text-cyan-400 tracking-tight">
            {isLoading && !telemetry ? '---' : speedDisplay}
          </span>
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5 truncate">Period: ~92.7 minutes</div>
        <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500/5 rounded-bl-full pointer-events-none" />
      </div>

      {/* 3. Coordinates Card */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between shadow-lg relative overflow-hidden group">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-semibold tracking-wider uppercase text-[11px] text-slate-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            Sub-Point Coords
          </span>
          <span className="text-[10px] font-mono text-slate-500">WGS84</span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-sm md:text-base font-bold font-mono text-slate-100 tracking-tight truncate">
            {isLoading && !telemetry ? '---' : coordsDisplay}
          </span>
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5 truncate">
          Inclination: 51.64°
        </div>
        <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
      </div>

      {/* 4. Overhead Location Card */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between shadow-lg relative overflow-hidden group">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-semibold tracking-wider uppercase text-[11px] text-slate-400 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            Overhead Region
          </span>
          {telemetry?.countryCode && (
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1 rounded">
              {telemetry.countryCode}
            </span>
          )}
        </div>
        <div className="mt-1">
          <span className="text-sm md:text-base font-semibold text-emerald-400 tracking-tight truncate block">
            {isLoading && !telemetry ? 'Detecting...' : (telemetry?.locationName || 'International Waters')}
          </span>
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5 truncate">
          Footprint radius ~2,250 km
        </div>
        <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
      </div>

      {/* 5. Illumination / Solar State */}
      <div className="col-span-2 md:col-span-4 lg:col-span-1 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between shadow-lg relative overflow-hidden group">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-semibold tracking-wider uppercase text-[11px] text-slate-400 flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5 text-teal-400" />
            Solar Condition
          </span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          {isSunlit ? (
            <>
              <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
              <span className="text-sm font-bold text-amber-300 tracking-tight uppercase">
                Direct Daylight
              </span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-bold text-indigo-300 tracking-tight uppercase">
                Earth Shadow (Night)
              </span>
            </>
          )}
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5 truncate">
          16 sunrises & sunsets / day
        </div>
        <div className="absolute top-0 right-0 w-12 h-12 bg-teal-500/5 rounded-bl-full pointer-events-none" />
      </div>
    </div>
  );
};
