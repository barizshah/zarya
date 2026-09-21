import React from 'react';
import { HelpCircle, Bell, User } from 'lucide-react';

interface TopHeaderProps {
  onOpenHelp: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenHelp }) => {
  return (
    <header className="h-12 px-6 flex items-center justify-between border-b border-white/5 bg-[#090e1a]/60 backdrop-blur-md select-none z-20">
      {/* Title from Mockup */}
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold tracking-wide text-slate-200">
          ZARYA - ISS Live Tracker
        </h1>
      </div>

      {/* Right Icons from Mockup: (?) Help, Bell with red dot, User avatar */}
      <div className="flex items-center gap-4 text-slate-400">
        {/* Help Circle */}
        <button
          onClick={onOpenHelp}
          className="hover:text-slate-200 transition-colors cursor-pointer"
          title="Mission Info & Passes"
        >
          <HelpCircle className="w-4 h-4 stroke-[1.75]" />
        </button>

        {/* Bell with red notification badge */}
        <button
          onClick={onOpenHelp}
          className="relative hover:text-slate-200 transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4 stroke-[1.75]" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
        </button>

        {/* User Profile Avatar Circle */}
        <div className="w-6 h-6 rounded-full bg-slate-800/80 border border-white/10 flex items-center justify-center text-slate-300 hover:border-slate-400 transition-colors cursor-pointer">
          <User className="w-3.5 h-3.5 stroke-[1.75]" />
        </div>
      </div>
    </header>
  );
};
