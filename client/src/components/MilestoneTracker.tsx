import React from 'react';
import { Card } from '@/components/ui/card';
import { Milestone } from '@/lib/milestoneSystem';
import { Sword, Scroll, Handshake, Skull, Ghost, Coins, Lock, Unlock } from 'lucide-react';

interface MilestoneTrackerProps {
  milestones: Milestone[];
}

export function MilestoneTracker({ milestones }: MilestoneTrackerProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sword': return <Sword className="w-5 h-5" />;
      case 'Scroll': return <Scroll className="w-5 h-5" />;
      case 'Handshake': return <Handshake className="w-5 h-5" />;
      case 'Skull': return <Skull className="w-5 h-5" />;
      case 'Ghost': return <Ghost className="w-5 h-5" />;
      case 'Coins': return <Coins className="w-5 h-5" />;
      default: return <Lock className="w-5 h-5" />;
    }
  };

  const unlockedCount = milestones.filter(m => m.unlocked).length;
  const progress = (unlockedCount / milestones.length) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <h3 className="text-lg font-semibold text-amber-100">Campaign Milestones</h3>
          <span className="text-xs text-amber-200/60">
            {unlockedCount} / {milestones.length} Unlocked
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-amber-900/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {milestones.map(milestone => (
          <Card 
            key={milestone.id}
            className={`p-4 border transition-all ${
              milestone.unlocked 
                ? 'border-amber-500/50 bg-amber-900/20 shadow-[0_0_15px_rgba(217,119,6,0.1)]' 
                : 'border-white/10 bg-black/40 opacity-70'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                milestone.unlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-white/30'
              }`}>
                {getIcon(milestone.icon)}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className={`font-semibold text-sm ${
                    milestone.unlocked ? 'text-amber-100' : 'text-white/50'
                  }`}>
                    {milestone.title}
                  </h4>
                  {milestone.unlocked ? (
                    <Unlock className="w-3 h-3 text-amber-500" />
                  ) : (
                    <Lock className="w-3 h-3 text-white/20" />
                  )}
                </div>
                
                <p className="text-xs text-white/60 leading-relaxed">
                  {milestone.description}
                </p>
                
                {milestone.unlocked && (
                  <div className="pt-2 mt-2 border-t border-white/10">
                    <p className="text-[10px] uppercase tracking-wider text-amber-400 font-mono">
                      Reward: {milestone.reward}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
