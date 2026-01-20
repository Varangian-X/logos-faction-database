import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Globe, MapPin, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChoicePreview({ choice }) {
  const hasFactionImpact = choice.faction_impact && Object.keys(choice.faction_impact).length > 0;
  const triggersEvent = choice.triggers_world_event;
  const unlocksLocation = choice.unlocks_location;
  const hasConsequences = hasFactionImpact || triggersEvent || unlocksLocation;
  
  if (!hasConsequences) return null;

  return (
    <div className="mt-2 pt-2 border-t border-slate-700/50 space-y-1">
      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Potential Consequences:</p>
      
      {hasFactionImpact && (
        <div className="space-y-0.5">
          {Object.entries(choice.faction_impact).map(([faction, value]) => {
            const Icon = value > 0 ? TrendingUp : TrendingDown;
            const isPositive = value > 0;
            
            return (
              <div key={faction} className="flex items-center gap-2 text-xs">
                <Icon className={cn("w-3 h-3", isPositive ? "text-green-400" : "text-red-400")} />
                <span className={cn(isPositive ? "text-green-400" : "text-red-400")}>
                  {isPositive ? '+' : ''}{value}
                </span>
                <span className="text-gray-400">{faction.replace('_', ' ')}</span>
              </div>
            );
          })}
        </div>
      )}
      
      {triggersEvent && (
        <div className="flex items-center gap-2 text-xs text-purple-400">
          <Globe className="w-3 h-3" />
          <span>May trigger world event</span>
        </div>
      )}
      
      {unlocksLocation && (
        <div className="flex items-center gap-2 text-xs text-cyan-400">
          <MapPin className="w-3 h-3" />
          <span>Unlocks new location</span>
        </div>
      )}
      
      {choice.relationship_change && (
        <div className="flex items-center gap-2 text-xs">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span className={cn(
            choice.relationship_change > 0 ? "text-green-400" : "text-red-400"
          )}>
            NPC relationship {choice.relationship_change > 0 ? '+' : ''}{choice.relationship_change}
          </span>
        </div>
      )}
    </div>
  );
}