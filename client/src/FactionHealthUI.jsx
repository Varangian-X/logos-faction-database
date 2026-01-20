import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Swords, Cpu, Network, Eye, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFactionHealthStatus } from './FactionHealthSystem';

const axisIcons = {
  muscle: Swords,
  savvy: Cpu,
  streets: Network,
  intel: Eye,
  funds: Coins
};

const axisLabels = {
  muscle: 'Muscle',
  savvy: 'Savvy',
  streets: 'Streets',
  intel: 'Intel',
  funds: 'Funds'
};

const statusColors = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500'
};

export default function FactionHealthUI({ faction, compact = false }) {
  const health = faction.faction_health || {};
  
  if (compact) {
    return (
      <div className="space-y-1">
        {Object.entries(health).map(([axis, value]) => {
          const status = getFactionHealthStatus(axis, value);
          const Icon = axisIcons[axis];
          
          return (
            <div key={axis} className="flex items-center gap-2">
              <Icon className="w-3 h-3 text-gray-400" />
              <Progress 
                value={value} 
                className="h-1.5 flex-1 bg-slate-800"
                indicatorClassName={statusColors[status.color]}
              />
              <span className="text-[9px] text-gray-500 w-6 text-right">{value}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Object.entries(health).map(([axis, value]) => {
        const status = getFactionHealthStatus(axis, value);
        const Icon = axisIcons[axis];
        
        return (
          <div key={axis} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={cn("w-4 h-4", `text-${status.color}-400`)} />
                <span className="text-xs font-semibold text-gray-300">
                  {axisLabels[axis]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{value}</span>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[9px]",
                    `border-${status.color}-500/50 text-${status.color}-400`
                  )}
                >
                  {status.status}
                </Badge>
              </div>
            </div>
            <Progress 
              value={value} 
              className="h-2 bg-slate-800"
              indicatorClassName={statusColors[status.color]}
            />
          </div>
        );
      })}
    </div>
  );
}