import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Sparkles, AlertTriangle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateCompanionAdvice } from '@/components/companions/CompanionAdviceSystem';
import { calculateCompanionBonus } from '@/components/companions/CompanionBonusSystem';
import CompanionAdviceDisplay from '@/components/companions/CompanionAdviceDisplay';
import { Brain } from 'lucide-react';

export default function PlayerChoiceEvent({ event, gameState, companions = [], onChoice, isProcessing }) {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showAdvice, setShowAdvice] = useState(false);
  
  if (!event) return null;
  
  // Show companion advice for selected choice
  useEffect(() => {
    if (selectedChoice && companions.length > 0) {
      setShowAdvice(true);
    } else {
      setShowAdvice(false);
    }
  }, [selectedChoice, companions]);

  // Parse choice impacts
  const getChoiceImpact = (choice) => {
    const impacts = [];
    
    if (choice.faction_impact) {
      Object.entries(choice.faction_impact).forEach(([faction, value]) => {
        impacts.push({
          type: 'faction',
          faction,
          value,
          icon: value > 0 ? TrendingUp : TrendingDown,
          color: value > 0 ? 'text-green-400' : 'text-red-400'
        });
      });
    }
    
    if (choice.reputation_change) {
      impacts.push({
        type: 'reputation',
        value: choice.reputation_change,
        icon: choice.reputation_change > 0 ? TrendingUp : TrendingDown,
        color: choice.reputation_change > 0 ? 'text-green-400' : 'text-red-400'
      });
    }
    
    if (choice.triggers_world_event) {
      impacts.push({
        type: 'world_event',
        icon: Sparkles,
        color: 'text-amber-400'
      });
    }

    if (choice.unlocks_location) {
      impacts.push({
        type: 'location',
        icon: Sparkles,
        color: 'text-cyan-400'
      });
    }

    if (choice.risk_level) {
      impacts.push({
        type: 'risk',
        value: choice.risk_level,
        icon: AlertTriangle,
        color: 'text-orange-400'
      });
    }
    
    return impacts;
  };

  // Check if locked
  const isChoiceLocked = (choice) => {
    if (!choice.requirements) return false;
    
    const req = choice.requirements;
    const reputation = gameState?.reputation || 50;
    
    if (req.min_reputation && reputation < req.min_reputation) return true;
    if (req.required_trait && (!gameState?.character_traits?.[req.required_trait] || 
        gameState.character_traits[req.required_trait] < (req.trait_level || 1))) return true;
    if (req.required_skill && (!gameState?.skills?.[req.required_skill]?.level || 
        gameState.skills[req.required_skill].level < (req.skill_level || 1))) return true;
    if (req.min_credits && (gameState?.credits || 0) < req.min_credits) return true;
    
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      className="rounded-xl border-2 border-amber-500/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-violet-500/10 opacity-50" />

      <div className="relative space-y-6">
        {/* Event Description */}
        <div>
          <Badge variant="outline" className="mb-3 text-[10px] border-amber-500/50 text-amber-400">
            Critical Decision
          </Badge>
          <h3 className="text-xl font-bold text-amber-100 mb-3">{event.title}</h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>
        
        {/* Show companion advice for selected choice */}
        <AnimatePresence>
          {selectedChoice && showAdvice && companions.length > 0 && (
            <CompanionAdviceDisplay
              advice={generateCompanionAdvice(companions, selectedChoice, gameState)}
              bonuses={calculateCompanionBonus(companions, event.faction_involved ? 'faction_diplomacy' : 'negotiation', {
                targetFaction: event.faction_involved,
                choice: selectedChoice
              }).contributors}
            />
          )}
        </AnimatePresence>

        {/* Choices */}
        <div className="space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-3 h-3" />
            Your decision will have consequences...
          </p>

          {event.choices?.map((choice, index) => {
            const impacts = getChoiceImpact(choice);
            const locked = isChoiceLocked(choice);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  disabled={isProcessing || locked}
                  onMouseEnter={() => setSelectedChoice(choice)}
                  onMouseLeave={() => setSelectedChoice(null)}
                  onClick={() => onChoice && onChoice(choice, index)}
                  className={cn(
                    "w-full text-left h-auto py-4 px-4 bg-slate-800/50 border-slate-600/50 transition-all group relative",
                    !locked && "hover:bg-slate-700/50 hover:border-cyan-500/50",
                    selectedChoice === choice && "border-purple-500/50 bg-purple-900/20"
                  )}
                >
                  {locked && (
                    <div className="absolute inset-0 bg-slate-950/80 rounded flex items-center justify-center text-center px-4">
                      <span className="text-xs text-red-400">
                        🔒 {choice.requirements?.min_reputation && `Reputation ${choice.requirements.min_reputation}+`}
                        {choice.requirements?.required_trait && ` ${choice.requirements.required_trait} ${choice.requirements.trait_level}+`}
                        {choice.requirements?.min_credits && ` ${choice.requirements.min_credits} credits required`}
                      </span>
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-200 group-hover:text-cyan-200 mb-2">
                      {choice.text}
                    </p>
                    
                    {/* Show impacts */}
                    {impacts.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {impacts.map((impact, i) => {
                          const Icon = impact.icon;
                          return (
                            <div
                              key={i}
                              className={cn(
                                "flex items-center gap-1 text-[10px] px-2 py-1 rounded border",
                                impact.color,
                                impact.color.includes('green') && "border-green-500/30 bg-green-500/10",
                                impact.color.includes('red') && "border-red-500/30 bg-red-500/10",
                                impact.color.includes('amber') && "border-amber-500/30 bg-amber-500/10",
                                impact.color.includes('cyan') && "border-cyan-500/30 bg-cyan-500/10",
                                impact.color.includes('orange') && "border-orange-500/30 bg-orange-500/10"
                              )}
                            >
                              <Icon className="w-3 h-3" />
                              {impact.type === 'faction' && (
                                <span>{impact.faction} {impact.value > 0 ? '+' : ''}{impact.value}</span>
                              )}
                              {impact.type === 'reputation' && (
                                <span>Rep {impact.value > 0 ? '+' : ''}{impact.value}</span>
                              )}
                              {impact.type === 'world_event' && <span>New Event</span>}
                              {impact.type === 'location' && <span>New Location</span>}
                              {impact.type === 'risk' && <span>{impact.value} Risk</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {!locked && (
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}