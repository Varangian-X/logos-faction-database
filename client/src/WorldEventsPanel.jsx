import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Swords, Flame, TrendingUp, TrendingDown, ZapOff, 
  Satellite, Skull, Cpu, BookOpen, Sparkles, Clock,
  AlertTriangle, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

const eventIcons = {
  swords: Swords,
  flame: Flame,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'zap-off': ZapOff,
  satellite: Satellite,
  skull: Skull,
  cpu: Cpu,
  'book-open': BookOpen,
  portal: Sparkles
};

const eventTypeLabels = {
  faction_war: 'Faction War',
  economic_boom: 'Economic Boom',
  economic_bust: 'Economic Crisis',
  alien_incursion: 'Alien Event',
  tech_breakthrough: 'Tech Breakthrough'
};

const eventTypeColors = {
  faction_war: 'border-red-500/50 bg-red-500/5',
  economic_boom: 'border-green-500/50 bg-green-500/5',
  economic_bust: 'border-orange-500/50 bg-orange-500/5',
  alien_incursion: 'border-cyan-500/50 bg-cyan-500/5',
  tech_breakthrough: 'border-purple-500/50 bg-purple-500/5'
};

export default function WorldEventsPanel({ activeEvents = [], compact = false }) {
  if (activeEvents.length === 0) {
    return compact ? null : (
      <div className="bg-slate-900/80 rounded-xl border border-slate-700/50 p-4">
        <h3 className="text-slate-400 font-semibold uppercase tracking-wider text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          World Events
        </h3>
        <p className="text-xs text-slate-500 mt-2">No active world events</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-slate-900/80 rounded-xl border border-amber-900/30 overflow-hidden",
      compact ? "p-3" : "p-4"
    )}>
      <h3 className="text-amber-400 font-semibold uppercase tracking-wider text-xs flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4" />
        Active World Events
        <span className="ml-auto text-amber-500/60">{activeEvents.length}</span>
      </h3>

      <div className={cn("space-y-2", compact ? "max-h-48 overflow-y-auto" : "")}>
        <AnimatePresence>
          {activeEvents.map((event, index) => {
            const Icon = eventIcons[event.icon] || AlertTriangle;
            const colorClass = eventTypeColors[event.type] || eventTypeColors.faction_war;
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "rounded-lg border-2 p-3 relative overflow-hidden",
                  colorClass
                )}
              >
                {/* Background pulse effect */}
                <div className="absolute inset-0 opacity-5 animate-pulse-glow">
                  <div className={`absolute inset-0 bg-gradient-to-r from-${event.color}-500 to-transparent`} />
                </div>

                <div className="relative flex items-start gap-3">
                  {/* Icon */}
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0",
                    `bg-${event.color}-500/10 border-${event.color}-500/30`
                  )}>
                    <Icon className={`w-4 h-4 text-${event.color}-400`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-100 leading-tight">
                          {event.name}
                        </h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
                          {eventTypeLabels[event.type]}
                        </p>
                      </div>
                      
                      {/* Duration */}
                      <div className="flex items-center gap-1 text-xs text-amber-400 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        <span className="font-mono">{event.turns_remaining}</span>
                      </div>
                    </div>

                    {!compact && (
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                        {event.description}
                      </p>
                    )}

                    {/* Impacted factions */}
                    {event.impactedFactions && event.impactedFactions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {event.impactedFactions.slice(0, compact ? 2 : 4).map(faction => (
                          <span
                            key={faction}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/50 text-slate-400 border border-slate-600/30"
                          >
                            {faction.replace('_', ' ')}
                          </span>
                        ))}
                        {event.impactedFactions.length > (compact ? 2 : 4) && (
                          <span className="text-[9px] px-1.5 py-0.5 text-slate-500">
                            +{event.impactedFactions.length - (compact ? 2 : 4)} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Progress indicator */}
                    <div className="mt-2">
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-${event.color}-500`}
                          initial={{ width: '100%' }}
                          animate={{ 
                            width: `${(event.turns_remaining / event.duration) * 100}%` 
                          }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}