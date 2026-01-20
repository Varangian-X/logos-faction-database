import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getReputationTier, getReputationMultipliers } from './ReputationSystem';

const factions = [
  { key: 'ecclesiarchy', name: 'Ecclesiarchy', icon: '✝️' },
  { key: 'praetorians', name: 'Praetorians', icon: '🛡️' },
  { key: 'varangians', name: 'Varangians', icon: '⚔️' },
  { key: 'merchant_houses', name: 'Merchant Houses', icon: '💰' },
  { key: 'agentes_in_rebus', name: 'Agentes in Rebus', icon: '🕵️' },
  { key: 'scrinium_barbarorum', name: 'Scrinium Barbarorum', icon: '📚' }
];

export default function ReputationTracker({ factionRelations = {}, compact = false }) {
  if (compact) {
    return (
      <Card className="bg-slate-900/80 border-amber-900/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-amber-400 uppercase tracking-wider text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Faction Standing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {factions.map((faction) => {
            const standing = factionRelations[faction.key] || 0;
            const tier = getReputationTier(standing);
            
            return (
              <div key={faction.key} className="flex items-center justify-between text-xs">
                <span className="text-gray-400">{faction.icon} {faction.name}</span>
                <Badge variant="outline" className={cn("text-[10px]", tier.color)}>
                  {tier.label}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/80 border-amber-900/30">
      <CardHeader>
        <CardTitle className="text-amber-400 uppercase tracking-wider text-sm flex items-center gap-2">
          <Award className="w-4 h-4" />
          Reputation & Standing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {factions.map((faction, index) => {
          const standing = factionRelations[faction.key] || 0;
          const tier = getReputationTier(standing);
          const multipliers = getReputationMultipliers(standing);
          const percentage = ((standing + 100) / 200) * 100;
          
          return (
            <motion.div
              key={faction.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{faction.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{faction.name}</p>
                    <p className="text-[10px] text-gray-500">{standing >= 0 ? '+' : ''}{standing}/100</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={cn("text-xs", tier.color)}>
                    {tier.label}
                  </Badge>
                  {standing > factionRelations[faction.key] && (
                    <TrendingUp className="w-3 h-3 text-green-400 inline ml-1" />
                  )}
                  {standing < factionRelations[faction.key] && (
                    <TrendingDown className="w-3 h-3 text-red-400 inline ml-1" />
                  )}
                </div>
              </div>
              
              <Progress 
                value={percentage} 
                className="h-2 bg-slate-800"
                indicatorClassName={cn(
                  standing >= 60 ? "bg-green-500" :
                  standing >= 30 ? "bg-blue-500" :
                  standing >= -20 ? "bg-gray-500" :
                  standing >= -50 ? "bg-orange-500" :
                  "bg-red-500"
                )}
              />
              
              <div className="flex items-center justify-between text-[10px] text-gray-500">
                <span>{tier.benefits}</span>
                <span>
                  Rewards: {Math.round(multipliers.rewards * 100)}% | 
                  Prices: {Math.round(multipliers.prices * 100)}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}