import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Target, Crosshair, Shield, Zap, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const engagementRanges = [
  { id: 'melee', name: 'Melee', icon: '⚔️', description: 'Close combat' },
  { id: 'ranged', name: 'Ranged', icon: '🏹', description: 'Distance attacks' },
  { id: 'support', name: 'Support', icon: '💚', description: 'Healing/buffs' }
];

const targetingPriorities = [
  { id: 'strongest', name: 'Strongest Enemy', icon: '💪' },
  { id: 'weakest', name: 'Weakest Enemy', icon: '🎯' },
  { id: 'healers', name: 'Enemy Healers', icon: '❤️' },
  { id: 'player_target', name: 'Follow Player', icon: '👤' }
];

export default function AllyManagementPanel({ allies = [], onCommandChange, onUseAbility }) {
  const [selectedAlly, setSelectedAlly] = useState(null);

  if (allies.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl border border-cyan-500/30 p-4 mt-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-5 h-5 text-cyan-400" />
        <h3 className="text-sm font-semibold text-cyan-200 uppercase tracking-wider">Allied Forces</h3>
      </div>

      <div className="space-y-3">
        {allies.map((ally) => {
          const healthPercent = (ally.health / ally.max_health) * 100;
          const isSelected = selectedAlly?.id === ally.id;

          return (
            <div key={ally.id} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-200">{ally.name}</p>
                    <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-500/30">
                      {ally.role}
                    </Badge>
                  </div>
                  <Progress 
                    value={healthPercent} 
                    className="h-2 bg-slate-900"
                    indicatorClassName={cn(
                      healthPercent > 60 ? "bg-green-500" : 
                      healthPercent > 30 ? "bg-amber-500" : "bg-red-500"
                    )}
                  />
                  <p className="text-xs text-gray-500 mt-1">{ally.health}/{ally.max_health} HP</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAlly(isSelected ? null : ally)}
                  className="text-cyan-400"
                >
                  {isSelected ? 'Hide' : 'Commands'}
                </Button>
              </div>

              {isSelected && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-3 pt-3 border-t border-slate-700/50 space-y-3"
                >
                  {/* Engagement Range */}
                  <div>
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                      <Crosshair className="w-3 h-3" />
                      Engagement Range
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {engagementRanges.map((range) => (
                        <button
                          key={range.id}
                          onClick={() => onCommandChange(ally.id, 'range', range.id)}
                          className={cn(
                            "p-2 rounded text-xs border transition-all",
                            ally.commands?.range === range.id
                              ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                              : "bg-slate-700/30 border-slate-600/50 text-gray-400 hover:border-cyan-500/30"
                          )}
                        >
                          <span className="text-sm">{range.icon}</span>
                          <p className="mt-1">{range.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Targeting Priority */}
                  <div>
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Target Priority
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {targetingPriorities.map((priority) => (
                        <button
                          key={priority.id}
                          onClick={() => onCommandChange(ally.id, 'priority', priority.id)}
                          className={cn(
                            "p-2 rounded text-xs border transition-all text-left",
                            ally.commands?.priority === priority.id
                              ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                              : "bg-slate-700/30 border-slate-600/50 text-gray-400 hover:border-purple-500/30"
                          )}
                        >
                          <span className="text-sm mr-1">{priority.icon}</span>
                          {priority.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Special Abilities */}
                  {ally.abilities && ally.abilities.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Special Abilities
                      </p>
                      <div className="space-y-1">
                        {ally.abilities.map((ability) => {
                          const onCooldown = ally.cooldowns?.[ability.id] > 0;
                          
                          return (
                            <Button
                              key={ability.id}
                              variant="outline"
                              size="sm"
                              disabled={onCooldown}
                              onClick={() => onUseAbility(ally.id, ability)}
                              className="w-full justify-between text-xs h-auto py-2"
                            >
                              <span>{ability.name}</span>
                              {onCooldown ? (
                                <span className="text-red-400">CD: {ally.cooldowns[ability.id]}</span>
                              ) : (
                                <span className="text-green-400">Ready</span>
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Current Status */}
                  <div className="text-xs text-gray-500 pt-2 border-t border-slate-700/50">
                    <p>Range: {ally.commands?.range || 'melee'} | Target: {ally.commands?.priority || 'strongest'}</p>
                    {ally.activeEffects && ally.activeEffects.length > 0 && (
                      <p className="text-cyan-400 mt-1">Active: {ally.activeEffects.join(', ')}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}