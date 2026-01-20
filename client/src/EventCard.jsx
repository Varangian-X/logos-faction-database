import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, Sparkles, Skull, ChevronRight } from 'lucide-react';

const eventTypeIcons = {
  passive: Clock,
  turn_based: Sparkles,
  crisis: Skull,
  opportunity: AlertCircle
};

const eventTypeColors = {
  passive: 'border-violet-500/50 bg-violet-500/5',
  turn_based: 'border-cyan-500/50 bg-cyan-500/5',
  crisis: 'border-red-500/50 bg-red-500/5',
  opportunity: 'border-amber-500/50 bg-amber-500/5'
};

export default function EventCard({ event, onChoice, isActive = true, gameState = null }) {
  if (!event) return null;
  
  const Icon = eventTypeIcons[event.event_type] || AlertCircle;
  const colorClass = eventTypeColors[event.event_type] || eventTypeColors.turn_based;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className={`rounded-xl border-2 ${colorClass} p-6 relative overflow-hidden`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-transparent to-violet-500" />
        </div>
        
        {/* Header */}
        <div className="relative flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-slate-800/80 flex items-center justify-center border border-amber-500/30">
            <Icon className="w-6 h-6 text-amber-400" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider text-amber-500/70">
                {event.event_type?.replace('_', ' ')} Event
              </span>
              {event.location && (
                <span className="text-[10px] text-gray-500">• {event.location}</span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-100">{event.title}</h3>
          </div>
        </div>
        
        {/* Description */}
        <div className="relative mb-6">
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>
        
        {/* Faction Tag */}
        {event.faction_involved && (
          <div className="mb-4">
            <span className="text-xs px-2 py-1 rounded bg-slate-800/60 text-cyan-400 border border-cyan-500/30">
              {event.faction_involved}
            </span>
          </div>
        )}
        
        {/* Choices */}
        {isActive && event.choices && event.choices.length > 0 && (
          <div className="relative space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Choose your response:</p>
            {event.choices.map((choice, index) => {
              const isLocked = choice.required_trait && choice.required_value && 
                (!gameState?.character_traits?.[choice.required_trait] || 
                 gameState.character_traits[choice.required_trait] < choice.required_value);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className="w-full text-left h-auto py-3 px-4 bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/50 hover:border-amber-500/50 transition-all group"
                    onClick={() => !isLocked && onChoice && onChoice(choice, index)}
                    disabled={isLocked}
                  >
                    <div className="flex-1">
                      <div className="text-sm text-gray-200 group-hover:text-amber-200">
                        {choice.text}
                      </div>
                      {choice.required_trait && (
                        <div className={`text-[10px] mt-1 flex items-center gap-1 ${
                          isLocked ? 'text-red-400' : 'text-cyan-400'
                        }`}>
                          <span className="uppercase tracking-wider">
                            Requires {choice.required_trait} {choice.required_value}
                          </span>
                          {isLocked && <span>🔒 Locked</span>}
                        </div>
                      )}
                      {choice.trait_reward && (
                        <div className="text-[10px] mt-1 text-amber-400">
                          +{choice.trait_reward.amount} {choice.trait_reward.trait.toUpperCase()}
                        </div>
                      )}
                    </div>
                    {!isLocked && (
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}