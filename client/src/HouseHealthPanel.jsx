import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Sword, Cpu, Users as UsersIcon, Eye, Coins } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const HOUSE_METRICS = [
  { key: 'muscle', label: 'Muscle', icon: Sword, color: 'red', description: 'Military Might' },
  { key: 'savvy', label: 'Savvy', icon: Cpu, color: 'purple', description: 'Technology' },
  { key: 'streets', label: 'Streets', icon: UsersIcon, color: 'amber', description: 'Underworld Influence' },
  { key: 'intel', label: 'Intel', icon: Eye, color: 'cyan', description: 'Information Network' },
  { key: 'funds', label: 'Funds', icon: Coins, color: 'green', description: 'Financial Power' }
];

export default function HouseHealthPanel({ houseName, houseHealth = {} }) {
  const metrics = {
    muscle: houseHealth.muscle || 50,
    savvy: houseHealth.savvy || 50,
    streets: houseHealth.streets || 50,
    intel: houseHealth.intel || 50,
    funds: houseHealth.funds || 50
  };

  return (
    <Card className="bg-slate-900/80 border-amber-500/30">
      <CardHeader>
        <CardTitle className="text-amber-400 text-sm flex items-center gap-2">
          <Crown className="w-4 h-4" />
          House {houseName} - Capabilities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {HOUSE_METRICS.map(metric => {
          const Icon = metric.icon;
          const value = metrics[metric.key];
          
          return (
            <div key={metric.key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={cn("w-4 h-4", `text-${metric.color}-400`)} />
                  <span className="text-sm text-gray-300">{metric.label}</span>
                </div>
                <span className={cn("text-sm font-bold", `text-${metric.color}-400`)}>
                  {value}/100
                </span>
              </div>
              <Progress 
                value={value} 
                className={cn("h-2", `bg-slate-800`)}
              />
              <p className="text-[10px] text-gray-500 mt-1">{metric.description}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}