import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Heart, Swords, Sparkles, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const roleIcons = {
  tank: Shield,
  healer: Heart,
  dps: Swords,
  support: Sparkles
};

const roleColors = {
  tank: 'blue',
  healer: 'green',
  dps: 'red',
  support: 'purple'
};

export default function CompanionCombatPanel({ 
  companions = [], 
  onCompanionCommand,
  isProcessing = false 
}) {
  const [expandedCompanion, setExpandedCompanion] = useState(null);
  
  if (companions.length === 0) return null;

  return (
    <div className="bg-slate-900/50 rounded-lg border border-purple-500/30 p-3">
      <p className="text-xs text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1">
        <Shield className="w-3 h-3" />
        Companions in Battle
      </p>
      
      <div className="space-y-2">
        {companions.map((companion, index) => {
          const healthPercent = (companion.health / companion.max_health) * 100;
          const RoleIcon = roleIcons[companion.combat_role] || Swords;
          const roleColor = roleColors[companion.combat_role] || 'gray';
          const isExpanded = expandedCompanion === companion.id;
          const isDead = companion.health <= 0;
          
          return (
            <motion.div
              key={companion.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "rounded-lg border",
                isDead 
                  ? "bg-red-900/20 border-red-500/30 opacity-50" 
                  : "bg-slate-800/50 border-slate-700/50"
              )}
            >
              {/* Companion Header */}
              <button
                onClick={() => setExpandedCompanion(isExpanded ? null : companion.id)}
                disabled={isDead}
                className="w-full p-2 text-left hover:bg-slate-700/30 transition-colors rounded-t-lg"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-6 h-6 rounded-lg bg-${roleColor}-500/10 border border-${roleColor}-500/30 flex items-center justify-center`}>
                    <RoleIcon className={`w-3 h-3 text-${roleColor}-400`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-200">{companion.name}</p>
                    <Badge variant="outline" className={`text-[9px] text-${roleColor}-400 border-${roleColor}-500/30`}>
                      {companion.combat_role || 'dps'}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {companion.health}/{companion.max_health}
                  </span>
                  {!isDead && (
                    isExpanded ? 
                      <ChevronUp className="w-4 h-4 text-gray-400" /> :
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                
                <Progress 
                  value={healthPercent} 
                  className="h-1.5 bg-slate-700"
                  indicatorClassName={cn(
                    healthPercent > 60 ? "bg-green-500" : 
                    healthPercent > 30 ? "bg-amber-500" : "bg-red-500"
                  )}
                />
              </button>
              
              {/* Active Effects */}
              {companion.activeEffects && companion.activeEffects.length > 0 && (
                <div className="flex flex-wrap gap-1 px-2 pb-2">
                  {companion.activeEffects.map((effect, i) => (
                    <span
                      key={i}
                      className="text-[8px] px-1 py-0.5 rounded bg-purple-500/10 text-purple-400"
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Expanded Abilities Panel */}
              <AnimatePresence>
                {isExpanded && !isDead && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-700/50 overflow-hidden"
                  >
                    <div className="p-2 space-y-1">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                        Abilities:
                      </p>
                      
                      {(companion.combat_abilities || []).map((ability) => {
                        const onCooldown = companion.cooldowns?.[ability.id] > 0;
                        const cooldownRemaining = companion.cooldowns?.[ability.id] || 0;
                        
                        return (
                          <Button
                            key={ability.id}
                            variant="outline"
                            size="sm"
                            disabled={isProcessing || onCooldown}
                            onClick={() => onCompanionCommand && onCompanionCommand(companion.id, ability)}
                            className={cn(
                              "w-full h-auto py-1.5 px-2 text-left text-[10px]",
                              "bg-slate-700/30 border-slate-600/50",
                              !onCooldown && "hover:bg-purple-500/20 hover:border-purple-500/50"
                            )}
                          >
                            <div className="flex items-start gap-2 w-full">
                              <Zap className={cn(
                                "w-3 h-3 mt-0.5 flex-shrink-0",
                                onCooldown ? "text-gray-600" : "text-purple-400"
                              )} />
                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  "font-semibold",
                                  onCooldown ? "text-gray-600" : "text-gray-200"
                                )}>
                                  {ability.name}
                                  {onCooldown && (
                                    <span className="ml-1 text-red-400">({cooldownRemaining})</span>
                                  )}
                                </p>
                                <p className="text-[9px] text-gray-500 leading-tight">
                                  {ability.description}
                                </p>
                                {ability.damage && ability.damage[1] > 0 && (
                                  <p className="text-[9px] text-red-400 mt-0.5">
                                    DMG: {ability.damage[0]}-{ability.damage[1]}
                                  </p>
                                )}
                                {ability.healing && (
                                  <p className="text-[9px] text-green-400 mt-0.5">
                                    HEAL: {ability.healing}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}