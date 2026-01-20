import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, TrendingUp, Gift, ChevronDown, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  getReputationTier, 
  getFactionBenefits, 
  getNextBenefit,
  REPUTATION_TIERS 
} from './EnhancedReputationSystem';

export default function ReputationTrackingUI({ gameState, factions }) {
  const [expandedFaction, setExpandedFaction] = useState(null);
  
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-300">
            <Trophy className="w-6 h-6" />
            Faction Reputation
          </CardTitle>
        </CardHeader>
      </Card>
      
      <div className="space-y-2">
        {factions.map(faction => {
          const standing = gameState.faction_relations?.[faction.faction_id] || 0;
          const tier = getReputationTier(standing);
          const benefits = getFactionBenefits(faction.faction_id, standing);
          const nextBenefit = getNextBenefit(faction.faction_id, standing);
          const isExpanded = expandedFaction === faction.faction_id;
          
          return (
            <Card
              key={faction.faction_id}
              className="bg-slate-900/80 border-slate-700/50 cursor-pointer hover:border-purple-500/30 transition-all"
              onClick={() => setExpandedFaction(isExpanded ? null : faction.faction_id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center border",
                    tier.color === 'green' && "bg-green-500/20 border-green-500/30",
                    tier.color === 'cyan' && "bg-cyan-500/20 border-cyan-500/30",
                    tier.color === 'purple' && "bg-purple-500/20 border-purple-500/30",
                    tier.color === 'gray' && "bg-gray-500/20 border-gray-500/30",
                    tier.color === 'yellow' && "bg-yellow-500/20 border-yellow-500/30",
                    tier.color === 'orange' && "bg-orange-500/20 border-orange-500/30",
                    tier.color === 'red' && "bg-red-500/20 border-red-500/30"
                  )}>
                    <Shield className={cn(
                      "w-5 h-5",
                      tier.color === 'green' && "text-green-400",
                      tier.color === 'cyan' && "text-cyan-400",
                      tier.color === 'purple' && "text-purple-400",
                      tier.color === 'gray' && "text-gray-400",
                      tier.color === 'yellow' && "text-yellow-400",
                      tier.color === 'orange' && "text-orange-400",
                      tier.color === 'red' && "text-red-400"
                    )} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-200">{faction.name}</h3>
                      <ChevronDown className={cn(
                        "w-4 h-4 text-gray-500 transition-transform",
                        isExpanded && "rotate-180"
                      )} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={cn(
                          "text-[10px]",
                          tier.color === 'green' && "bg-green-500/20 text-green-400 border-green-500/30",
                          tier.color === 'cyan' && "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
                          tier.color === 'purple' && "bg-purple-500/20 text-purple-400 border-purple-500/30",
                          tier.color === 'gray' && "bg-gray-500/20 text-gray-400 border-gray-500/30",
                          tier.color === 'yellow' && "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                          tier.color === 'orange' && "bg-orange-500/20 text-orange-400 border-orange-500/30",
                          tier.color === 'red' && "bg-red-500/20 text-red-400 border-red-500/30"
                        )}>
                          {tier.name}
                        </Badge>
                        <span className="text-sm text-gray-400">{standing}/100</span>
                      </div>
                      
                      <div className="space-y-1">
                        <Progress 
                          value={((standing + 100) / 200) * 100} 
                          className="h-2"
                        />
                        {nextBenefit && (
                          <p className="text-[10px] text-gray-500">
                            Next reward at {nextBenefit.threshold} ({nextBenefit.pointsNeeded} points)
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-slate-700 space-y-3"
                      >
                        {benefits.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
                              <Gift className="w-3 h-3" />
                              Active Benefits:
                            </p>
                            <div className="space-y-1">
                              {benefits.map(benefit => (
                                <div key={benefit.threshold} className="bg-slate-800/50 rounded p-2">
                                  <p className="text-xs text-cyan-300 font-semibold">{benefit.name}</p>
                                  <p className="text-[10px] text-gray-400">{benefit.benefit}</p>
                                  {benefit.discount > 0 && (
                                    <Badge className="mt-1 text-[9px] bg-green-500/20 text-green-400 border-green-500/30">
                                      {benefit.discount}% Discount
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {nextBenefit && (
                          <div>
                            <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Next Benefit:
                            </p>
                            <div className="bg-purple-900/20 rounded p-2 border border-purple-500/30">
                              <p className="text-xs text-purple-300 font-semibold">{nextBenefit.benefit.name}</p>
                              <p className="text-[10px] text-gray-400">{nextBenefit.benefit.benefit}</p>
                              <p className="text-[10px] text-gray-500 mt-1">
                                Requires {nextBenefit.pointsNeeded} more reputation
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}