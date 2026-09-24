import React from 'react';
import type { Astronaut } from '../types/iss';
import { X, Users, Star } from 'lucide-react';

interface CrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  crew: Astronaut[];
}

const CRAFT_BADGE: Record<string, { label: string; color: string }> = {
  'Crew Dragon': { label: 'Crew Dragon', color: '#76FF03' },
  'Crew-12': { label: 'Crew-12', color: '#76FF03' },
  'Soyuz': { label: 'Soyuz MS-29', color: '#4fc3f7' },
  'ISS': { label: 'ISS', color: '#aaaaaa' },
};

function getCraftBadge(craft: string): { label: string; color: string } {
  if (craft.toLowerCase().includes('crew-12') || craft.toLowerCase().includes('endurance')) return CRAFT_BADGE['Crew-12'];
  if (craft.toLowerCase().includes('crew dragon')) return CRAFT_BADGE['Crew Dragon'];
  if (craft.toLowerCase().includes('soyuz')) return CRAFT_BADGE['Soyuz'];
  return CRAFT_BADGE['ISS'];
}

function getDaysInSpace(launchDate?: string): number | null {
  if (!launchDate) return null;
  const launch = new Date(launchDate);
  const now = new Date();
  return Math.floor((now.getTime() - launch.getTime()) / (1000 * 60 * 60 * 24));
}

export const CrewModal: React.FC<CrewModalProps> = ({ isOpen, onClose, crew }) => {
  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Close on Escape key press
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const crewDragon = crew.filter(c => !c.craft?.toLowerCase().includes('soyuz'));
  const soyuz = crew.filter(c => c.craft?.toLowerCase().includes('soyuz'));

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 pt-[calc(env(safe-area-inset-top)+14px)] pb-[calc(env(safe-area-inset-bottom)+14px)] bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#181818] border border-white/[0.1] rounded-2xl w-full max-w-3xl max-h-[calc(100dvh-28px-env(safe-area-inset-top)-env(safe-area-inset-bottom))] sm:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-scaleUp">
        {/* Sticky Modal Header */}
        <div className="p-3 sm:p-4 border-b border-white/[0.08] flex items-center justify-between gap-2 bg-[#212121] shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-[#76FF03]/15 border border-[#76FF03]/30 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-[#76FF03]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-white font-mono leading-tight">
                  ISS Expedition 73
                </h3>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#76FF03]/15 text-[#76FF03] border border-[#76FF03]/30">
                  Exp. 73
                </span>
              </div>
              <p className="text-[10.5px] sm:text-xs text-[#cccccc] truncate mt-0.5">
                {crew.length} astronauts currently aboard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 sm:w-8 sm:h-8 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] active:bg-[#76FF03]/20 border border-white/[0.12] active:border-[#76FF03]/40 flex items-center justify-center text-white active:text-[#76FF03] transition-all cursor-pointer shrink-0 touch-manipulation shadow-sm"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Modal Body with smooth momentum scrolling */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-4 sm:space-y-6 overscroll-contain">
          {/* Crew Dragon / Crew-12 */}
          {crewDragon.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#76FF03]">
                  SpaceX Crew Dragon — Crew-12
                </h4>
                <span className="text-[11px] font-mono text-[#76FF03] bg-[#76FF03]/10 px-2 py-0.5 rounded border border-[#76FF03]/25">
                  {crewDragon.length} astronauts
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {crewDragon.map((member, i) => {
                  const days = getDaysInSpace(member.launchDate);
                  const badge = getCraftBadge(member.craft);
                  return (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-[#212121] border border-white/[0.06] hover:border-[#76FF03]/30 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        {/* Portrait */}
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="w-12 h-12 rounded-xl object-cover border border-white/[0.08] flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#76FF03]/10 border border-[#76FF03]/20 flex items-center justify-center flex-shrink-0 text-2xl">
                            {member.flag}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-sm font-semibold text-white leading-tight">{member.name}</div>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border flex-shrink-0"
                              style={{ color: badge.color, borderColor: `${badge.color}40`, background: `${badge.color}10` }}>
                              {badge.label}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#aaaaaa] mt-0.5">{member.role} · {member.agency}</div>
                          {days !== null && (
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <Star className="w-3 h-3 text-[#76FF03]" />
                              <span className="text-[11px] font-mono text-[#76FF03]">{days} days in space</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {member.funFact && (
                        <div className="mt-2.5 pt-2.5 border-t border-white/[0.06]">
                          <p className="text-[11px] text-[#aaaaaa] leading-relaxed">{member.funFact}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Soyuz crew */}
          {soyuz.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold" style={{ color: '#4fc3f7' }}>
                  Soyuz MS-29
                </h4>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded border" style={{ color: '#4fc3f7', borderColor: '#4fc3f740', background: '#4fc3f710' }}>
                  {soyuz.length} cosmonauts
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {soyuz.map((member, i) => {
                  const days = getDaysInSpace(member.launchDate);
                  return (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-[#212121] border border-white/[0.06] hover:border-[#4fc3f7]/30 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        {/* Portrait */}
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="w-12 h-12 rounded-xl object-cover border border-white/[0.08] flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#4fc3f7]/10 border border-[#4fc3f7]/20 flex items-center justify-center flex-shrink-0 text-2xl">
                            {member.flag}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-sm font-semibold text-white leading-tight">{member.name}</div>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border flex-shrink-0"
                              style={{ color: '#4fc3f7', borderColor: '#4fc3f740', background: '#4fc3f710' }}>
                              Soyuz MS-29
                            </span>
                          </div>
                          <div className="text-[11px] text-[#aaaaaa] mt-0.5">{member.role} · {member.agency}</div>
                          {days !== null && (
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <Star className="w-3 h-3" style={{ color: '#4fc3f7' }} />
                              <span className="text-[11px] font-mono" style={{ color: '#4fc3f7' }}>{days} days in space</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {member.funFact && (
                        <div className="mt-2.5 pt-2.5 border-t border-white/[0.06]">
                          <p className="text-[11px] text-[#aaaaaa] leading-relaxed">{member.funFact}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Station stats footer */}
          <div className="p-3.5 rounded-xl bg-[#0f0f0f] border border-white/[0.08] flex flex-wrap gap-4 items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-[#aaaaaa] uppercase tracking-wider font-semibold">Total Crew</div>
              <div className="text-sm font-mono font-bold text-white mt-0.5">{crew.length} People</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#76FF03] uppercase tracking-wider font-semibold">Expedition</div>
              <div className="text-sm font-mono font-bold text-white mt-0.5">ISS Exp. 73</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#aaaaaa] uppercase tracking-wider font-semibold">Altitude</div>
              <div className="text-sm font-mono font-bold text-[#76FF03] mt-0.5">~408 km LEO</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#aaaaaa] uppercase tracking-wider font-semibold">Orbital Period</div>
              <div className="text-sm font-mono font-bold text-white mt-0.5">92.68 min</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-white/[0.08] bg-[#181818] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 sm:py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-medium transition-colors cursor-pointer text-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
