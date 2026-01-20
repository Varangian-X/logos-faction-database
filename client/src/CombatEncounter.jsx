import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Swords, Shield, Target, Zap, Heart, Eye, Cpu, 
  ArrowRight, AlertTriangle, TrendingUp, Activity, Flame, Move
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { enemyTypes as enemyTypeData } from '@/components/combat/EnemyAI';
import AllyManagementPanel from './AllyManagementPanel';
import { getAllyAction, applyAllyAbilityEffect } from './AllyAI';
import CompanionCombatPanel from './CompanionCombatPanel';
import { getActionAPCost } from './ActionPointSystem';
import { getStatusEffectIcon, getStatusEffectColor } from './StatusEffectsSystem';
import { getEnvironmentalActions } from './EnvironmentalInteractions';

const enemyTypes = {
  praetorian: { name: 'Neo-Praetorian Guard', color: 'red', icon: Shield },
  varangian: { name: 'Varangian Warrior', color: 'blue', icon: Swords },
  agent: { name: 'Imperial Agent', color: 'violet', icon: Eye },
  cultist: { name: 'Logos Cultist', color: 'amber', icon: Activity },
  rogue_operative: { name: 'Rogue Operative', color: 'cyan', icon: Target },
  security_bot: { name: 'Security Automaton', color: 'emerald', icon: Cpu },
  elite_assassin: { name: 'Elite Shadow Assassin', color: 'purple', icon: Target },
  heavy_enforcer: { name: 'Heavy Enforcer Unit', color: 'orange', icon: Shield }
};

export default function CombatEncounter({ 
  combat, 
  gameState, 
  onAction, 
  onFlee,
  onAllyCommand,
  onAllyAbility,
  onCompanionAbility,
  onEnvironmentalAction,
  onDefeat,
  isProcessing 
}) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [showEnvironmental, setShowEnvironmental] = useState(false);
  
  const allies = combat.allies || [];
  const companions = combat.companions || [];
  const actionPoints = combat.player_action_points || 4;
  const maxAP = combat.player_max_ap || 4;
  const statusEffects = combat.player_status_effects || [];
  const encounterType = combat.encounter_type || 'standard';
  const environmentalObjects = combat.environmental_objects || [];
  
  const enemy = enemyTypes[combat.enemy_type] || enemyTypes.rogue_operative;
  const EnemyIcon = enemy.icon;
  
  const playerHealthPercent = (combat.player_health / combat.player_max_health) * 100;
  const enemyHealthPercent = (combat.enemy_health / combat.enemy_max_health) * 100;
  
  const skills = gameState?.skills || {};
  const augmentations = gameState?.augmentations || [];
  
  // Calculate combat bonuses
  const combatSkillBonus = Math.floor((skills.combat?.level || 0) * 5);
  const hackingSkillBonus = Math.floor((skills.hacking?.level || 0) * 3);
  
  // Calculate augmentation bonuses
  let augBonus = augmentations.filter(a => a.type === 'combat').length * 10;
  const subdermalArmor = augmentations.find(a => a.id === 'subdermal_armor');
  if (subdermalArmor) {
    augBonus += subdermalArmor.bonus.combat_skill_bonus || 0;
  }
  
  const actions = [
    {
      id: 'aggressive_strike',
      name: 'Aggressive Strike',
      description: 'Full power attack with high damage',
      icon: Swords,
      color: 'red',
      damage: '20-40',
      accuracy: 70 + combatSkillBonus,
      ap_cost: 3,
      skillUsed: 'combat',
      xpGain: 25
    },
    {
      id: 'tactical_shot',
      name: 'Tactical Shot',
      description: 'Calculated attack with medium damage',
      icon: Target,
      color: 'cyan',
      damage: '15-25',
      accuracy: 85 + combatSkillBonus,
      ap_cost: 2,
      skillUsed: 'combat',
      xpGain: 20
    },
    {
      id: 'defensive_counter',
      name: 'Defensive Counter',
      description: 'Block and counterattack',
      icon: Shield,
      color: 'blue',
      damage: '10-20',
      accuracy: 90 + combatSkillBonus,
      ap_cost: 2,
      skillUsed: 'combat',
      xpGain: 18
    },
    {
      id: 'hack_systems',
      name: 'Hack Enemy Systems',
      description: 'Disable augmentations or armor',
      icon: Cpu,
      color: 'violet',
      damage: '5-15',
      accuracy: 60 + hackingSkillBonus,
      ap_cost: 3,
      skillUsed: 'hacking',
      xpGain: 30,
      requiredSkill: 'hacking',
      requiredLevel: 2,
      applies_status: 'weakened'
    },
    {
      id: 'use_augmentation',
      name: 'Augmentation Ability',
      description: 'Use installed cybernetics',
      icon: Zap,
      color: 'amber',
      damage: '15-35',
      accuracy: 80 + augBonus,
      ap_cost: 3,
      disabled: augmentations.filter(a => a.type === 'combat').length === 0,
      skillUsed: 'combat',
      xpGain: 22
    },
    {
      id: 'take_cover',
      name: 'Take Cover',
      description: 'Reduce damage taken next turn',
      icon: Shield,
      color: 'blue',
      ap_cost: 1,
      grants_buff: 'fortified'
    },
    {
      id: 'aimed_shot',
      name: 'Aimed Shot',
      description: 'Guaranteed hit, moderate damage',
      icon: Target,
      color: 'purple',
      damage: '18-28',
      accuracy: 100,
      ap_cost: 4,
      skillUsed: 'combat',
      xpGain: 24
    }
  ];

  return (
    <div className="bg-slate-900/90 rounded-2xl border-2 border-red-500/50 overflow-hidden">
      {/* Combat Header */}
      <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 p-4 border-b border-red-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/40 animate-pulse">
              <Swords className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-red-200 font-bold text-lg">COMBAT ENGAGED</h3>
              <p className="text-xs text-red-400/70">Turn {combat.turn_number} • {combat.location}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onFlee}
            disabled={isProcessing}
            className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
          >
            Attempt Retreat
          </Button>
        </div>
      </div>
      
      {/* Encounter Type Badge */}
      {encounterType !== 'standard' && (
        <div className="px-6 pt-2">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
            {encounterType.toUpperCase()} ENCOUNTER
          </Badge>
        </div>
      )}

      {/* Action Points Bar */}
      <div className="px-6 pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-cyan-400 uppercase tracking-wider">Action Points</span>
          <span className="text-sm font-bold text-cyan-300">{actionPoints} / {maxAP}</span>
        </div>
        <div className="flex gap-1">
          {[...Array(maxAP)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 h-2 rounded-full transition-all",
                i < actionPoints ? "bg-cyan-500" : "bg-slate-700"
              )}
            />
          ))}
        </div>
      </div>

      {/* Health Bars */}
      <div className="p-6 grid grid-cols-2 gap-6">
        {/* Player Health */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300 font-semibold">
              {gameState?.character_name || 'Operative'}
            </span>
            <span className="text-xs text-gray-500">
              {combat.player_health} / {combat.player_max_health}
            </span>
          </div>
          <Progress 
            value={playerHealthPercent} 
            className="h-3 bg-slate-800"
            indicatorClassName={cn(
              playerHealthPercent > 60 ? "bg-green-500" : 
              playerHealthPercent > 30 ? "bg-amber-500" : "bg-red-500"
            )}
          />
          
          {/* Player Status Effects */}
          {statusEffects.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {statusEffects.map((effect, i) => (
                <span
                  key={i}
                  className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40"
                >
                  {getStatusEffectIcon(effect.id)} {effect.name}
                </span>
              ))}
            </div>
          )}
          
          <div className="mt-2 text-[10px] text-gray-500">
            Combat Bonus: +{combatSkillBonus + augBonus}%
          </div>
        </div>
        
        {/* Enemy Health */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300 font-semibold flex items-center gap-2">
              <EnemyIcon className={`w-4 h-4 text-${enemy.color}-400`} />
              {combat.enemy_name}
            </span>
            <span className="text-xs text-gray-500">
              {combat.enemy_health} / {combat.enemy_max_health}
            </span>
          </div>
          <Progress 
            value={enemyHealthPercent} 
            className="h-3 bg-slate-800"
            indicatorClassName={cn(
              enemyHealthPercent > 60 ? "bg-red-500" : 
              enemyHealthPercent > 30 ? "bg-orange-500" : "bg-yellow-500"
            )}
          />
          
          {/* Enemy Status Effects */}
          {combat.enemy_status_effects?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {combat.enemy_status_effects.map((effect, i) => (
                <span
                  key={i}
                  className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40"
                >
                  {getStatusEffectIcon(effect.id)} {effect.name}
                </span>
              ))}
            </div>
          )}
          
          <div className="mt-2 text-[10px] text-gray-500 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {enemy.name} • Stance: {combat.enemy_stance}
            {combat.enemy_adaptations?.length > 0 && (
              <Badge variant="outline" className="text-[8px] ml-1 text-amber-400 border-amber-500/50">
                Adapted
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Environmental Objects */}
      {environmentalObjects.length > 0 && (
        <div className="px-6 pb-4">
          <button
            onClick={() => setShowEnvironmental(!showEnvironmental)}
            className="text-xs text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1 hover:text-green-300"
          >
            <Flame className="w-3 h-3" />
            Environmental ({environmentalObjects.length})
          </button>
          
          <AnimatePresence>
            {showEnvironmental && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-2 gap-2 mt-2"
              >
                {environmentalObjects.map((obj, i) => (
                  <Button
                    key={i}
                    size="sm"
                    variant="outline"
                    disabled={isProcessing || actionPoints < 2}
                    onClick={() => onEnvironmentalAction && onEnvironmentalAction(obj.id, obj.action)}
                    className="h-auto py-2 text-left justify-start bg-green-900/10 border-green-500/30 hover:bg-green-900/20"
                  >
                    <span className="text-lg mr-2">{obj.icon}</span>
                    <div>
                      <div className="text-[10px] font-semibold text-green-300">{obj.name}</div>
                      <div className="text-[8px] text-gray-500">AP: 2</div>
                    </div>
                  </Button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Combat Actions */}
      <div className="px-6 pb-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Combat Actions:
          {statusEffects.some(e => e.id === 'stunned') && (
            <span className="ml-2 text-red-400">(STUNNED - Cannot Act)</span>
          )}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            const apCost = action.ap_cost || getActionAPCost(action.id);
            const canAfford = actionPoints >= apCost;
            const isDisabled = action.disabled || 
              !canAfford ||
              statusEffects.some(e => e.id === 'stunned') ||
              (action.requiredSkill && (skills[action.requiredSkill]?.level || 0) < (action.requiredLevel || 0));
            
            return (
              <Button
                key={action.id}
                variant="outline"
                disabled={isDisabled || isProcessing}
                onClick={() => onAction(action)}
                className={cn(
                  "h-auto py-4 px-3 flex flex-col items-center gap-2 bg-slate-800/50 border-slate-600/50 transition-all group relative",
                  !isDisabled && `hover:bg-${action.color}-500/10 hover:border-${action.color}-500/50`
                )}
              >
                {isDisabled && (
                  <div className="absolute inset-0 bg-slate-950/60 rounded flex items-center justify-center z-10">
                    <span className="text-[10px] text-red-400 text-center px-1">
                      {!canAfford ? `Need ${apCost} AP` :
                       statusEffects.some(e => e.id === 'stunned') ? 'Stunned' :
                       action.requiredSkill ? `Need ${action.requiredSkill} Lv${action.requiredLevel}` : 'Locked'}
                    </span>
                  </div>
                )}
                
                <div className={`w-10 h-10 rounded-lg bg-${action.color}-500/10 flex items-center justify-center border border-${action.color}-500/30`}>
                  <Icon className={`w-5 h-5 text-${action.color}-400`} />
                </div>
                
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-200">{action.name}</p>
                  <p className="text-[9px] text-gray-500 mt-0.5">{action.description}</p>
                  <div className="mt-2 space-y-0.5">
                    {action.damage && (
                      <div className="flex items-center justify-center gap-2 text-[10px]">
                        <span className={`text-${action.color}-400`}>DMG: {action.damage}</span>
                        {action.accuracy && (
                          <>
                            <span className="text-gray-600">•</span>
                            <span className="text-cyan-400">ACC: {action.accuracy}%</span>
                          </>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-[9px] text-cyan-400">{apCost} AP</span>
                      {action.applies_status && (
                        <span className="text-[8px] text-purple-400">• {action.applies_status}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
      
      {/* Enemy Adaptations */}
      {combat.enemy_adaptations && combat.enemy_adaptations.length > 0 && (
        <div className="px-6 pb-4">
          <p className="text-[10px] text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Enemy Adaptations:
          </p>
          <div className="flex flex-wrap gap-2">
            {combat.enemy_adaptations.map((adaptation, i) => (
              <span
                key={i}
                className="text-[9px] px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30"
              >
                {adaptation.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Companion Status */}
      {companions.length > 0 && (
        <div className="px-6 pb-4">
          <CompanionCombatPanel 
            companions={companions}
            onCompanionCommand={onCompanionAbility}
            isProcessing={isProcessing}
          />
        </div>
      )}

      {/* Combat Log */}
      {combat.combat_log && combat.combat_log.length > 0 && (
        <div className="px-6 pb-6">
          <div className="bg-slate-950/50 rounded-lg border border-slate-700/50 p-3 max-h-32 overflow-y-auto">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Combat Log:</p>
            <div className="space-y-1">
              {combat.combat_log.slice(-4).map((log, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs text-gray-400"
                >
                  {log}
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Augmentations Display */}
      {augmentations.length > 0 && (
        <div className="px-6 pb-4">
          <p className="text-[10px] text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Active Augmentations:
          </p>
          <div className="flex flex-wrap gap-2">
            {augmentations.map((aug, i) => (
              <span
                key={i}
                className={cn(
                  "text-[9px] px-2 py-1 rounded border",
                  aug.type === 'combat' 
                    ? "bg-red-500/10 text-red-400 border-red-500/30"
                    : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                )}
              >
                {aug.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}