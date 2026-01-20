import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, TrendingUp, TrendingDown, AlertTriangle, 
  Gift, Skull, Clock, ChevronDown, ChevronUp,
  DollarSign, Users, Target, MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CascadingEffectsUI({ effects, consequences = [], onDismiss }) {
  const [expanded, setExpanded] = useState(true);

  if (!effects || (
    effects.factionChanges?.length === 0 &&
    effects.marketChanges?.length === 0 &&
    effects.worldEvents?.length === 0 &&
    effects.narrativeUnlocks?.length === 0 &&
    effects.npcReactions?.length === 0 &&
    consequences.length === 0
  )) {
    return null;
  }

  const hasEffects = 
    (effects.factionChanges?.length || 0) +
    (effects.marketChanges?.length || 0) +
    (effects.worldEvents?.length || 0) +
    (effects.narrativeUnlocks?.length || 0) +
    (effects.npcReactions?.length || 0) +
    consequences.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 border-violet-500/30">
        <CardHeader className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-violet-400" />
              <CardTitle className="text-violet-200">
                Cascading Effects ({hasEffects})
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-violet-400 border-violet-500/50">
                {hasEffects} changes
              </Badge>
              {expanded ? 
                <ChevronUp className="w-4 h-4 text-violet-400" /> : 
                <ChevronDown className="w-4 h-4 text-violet-400" />
              }
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <CardContent className="space-y-4">
                {/* Faction Power Shifts */}
                {effects.factionChanges?.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-violet-400 uppercase tracking-wider">
                      <Users className="w-3 h-3" />
                      Faction Power Shifts
                    </div>
                    {effects.factionChanges.map((shift, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-200 capitalize">
                            {shift.factionId.replace(/_/g, ' ')}
                          </span>
                          <div className="flex items-center gap-2">
                            {shift.change > 0 ? (
                              <TrendingUp className="w-4 h-4 text-green-400" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-400" />
                            )}
                            <span className={cn(
                              "text-sm font-semibold",
                              shift.change > 0 ? "text-green-400" : "text-red-400"
                            )}>
                              {shift.change > 0 ? '+' : ''}{shift.change}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-[10px] text-gray-500">{shift.reason}</div>
                          <div className="text-[10px] text-gray-600">
                            {shift.oldPower} → {shift.newPower}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Market Changes */}
                {effects.marketChanges?.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-violet-400 uppercase tracking-wider">
                      <DollarSign className="w-3 h-3" />
                      Market Impact
                    </div>
                    {effects.marketChanges.map((change, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-200 capitalize">
                            {change.category} Prices
                          </span>
                          <span className={cn(
                            "text-sm font-semibold",
                            change.priceChange > 0 ? "text-red-400" : "text-green-400"
                          )}>
                            {change.priceChange > 0 ? '+' : ''}{change.priceChange}%
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500">{change.reason}</div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* World Events Triggered */}
                {effects.worldEvents?.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-violet-400 uppercase tracking-wider">
                      <Target className="w-3 h-3" />
                      World Events Triggered
                    </div>
                    {effects.worldEvents.map((event, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-amber-900/20 rounded-lg p-3 border border-amber-500/30"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <span className="text-sm text-amber-200">{event.eventId}</span>
                        </div>
                        <div className="text-[10px] text-gray-400">{event.reason}</div>
                        <div className="text-[10px] text-amber-500 mt-1">
                          Probability: {Math.round(event.probability * 100)}%
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Narrative Unlocks */}
                {effects.narrativeUnlocks?.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-violet-400 uppercase tracking-wider">
                      <Zap className="w-3 h-3" />
                      Narrative Developments
                    </div>
                    {effects.narrativeUnlocks.map((unlock, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-cyan-900/20 rounded-lg p-3 border border-cyan-500/30"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                            {unlock.type.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <div className="text-sm text-cyan-200">{unlock.description}</div>
                        {unlock.questline && (
                          <div className="text-[10px] text-cyan-500 mt-1">
                            Quest Chain: {unlock.questline}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* NPC Reactions */}
                {effects.npcReactions?.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-violet-400 uppercase tracking-wider">
                      <MessageSquare className="w-3 h-3" />
                      NPC Reactions
                    </div>
                    {effects.npcReactions.slice(0, 3).map((reaction, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-200">{reaction.npcName}</span>
                          <span className={cn(
                            "text-xs font-semibold",
                            reaction.relationshipChange > 0 ? "text-green-400" : "text-red-400"
                          )}>
                            {reaction.relationshipChange > 0 ? '+' : ''}{reaction.relationshipChange}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500 italic mt-1">
                          {reaction.reaction}
                        </div>
                      </motion.div>
                    ))}
                    {effects.npcReactions.length > 3 && (
                      <div className="text-[10px] text-gray-600 text-center">
                        +{effects.npcReactions.length - 3} more reactions
                      </div>
                    )}
                  </div>
                )}

                {/* Pending Consequences */}
                {consequences.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-violet-400 uppercase tracking-wider">
                      <Clock className="w-3 h-3" />
                      Future Consequences
                    </div>
                    {consequences.slice(0, 3).map((consequence, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                          "rounded-lg p-3 border",
                          consequence.type === 'reward' 
                            ? "bg-green-900/20 border-green-500/30"
                            : "bg-red-900/20 border-red-500/30"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {consequence.type === 'reward' ? (
                            <Gift className="w-4 h-4 text-green-400" />
                          ) : (
                            <Skull className="w-4 h-4 text-red-400" />
                          )}
                          <Badge variant="outline" className={cn(
                            consequence.severity === 'major' 
                              ? "border-amber-500/50 text-amber-400"
                              : "border-gray-500/50 text-gray-400"
                          )}>
                            {consequence.severity}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-200">{consequence.description}</div>
                        <div className="text-[10px] text-gray-500 mt-1">
                          Activates in {consequence.activatesOnTurn - consequence.triggeredByTurn} turns
                        </div>
                      </motion.div>
                    ))}
                    {consequences.length > 3 && (
                      <div className="text-[10px] text-gray-600 text-center">
                        +{consequences.length - 3} more pending
                      </div>
                    )}
                  </div>
                )}

                {onDismiss && (
                  <Button
                    onClick={onDismiss}
                    variant="outline"
                    className="w-full mt-4 border-violet-500/50 text-violet-400 hover:bg-violet-500/10"
                  >
                    Acknowledge
                  </Button>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// Component for displaying consequence notifications
export function ConsequenceNotification({ consequence, onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -50 }}
      className="fixed bottom-4 right-4 z-50 max-w-md"
    >
      <Card className={cn(
        "border-2 shadow-2xl",
        consequence.type === 'reward'
          ? "bg-green-900/90 border-green-500"
          : "bg-red-900/90 border-red-500"
      )}>
        <CardHeader>
          <div className="flex items-center gap-2">
            {consequence.type === 'reward' ? (
              <Gift className="w-5 h-5 text-green-400" />
            ) : (
              <Skull className="w-5 h-5 text-red-400" />
            )}
            <CardTitle className="text-white">
              {consequence.type === 'reward' ? 'Consequence Resolved' : 'Reckoning Arrives'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-200 mb-3">{consequence.description}</p>
          
          {consequence.effects && (
            <div className="space-y-1 mb-3">
              {consequence.effects.credits && (
                <div className="text-xs text-gray-300">
                  Credits: {consequence.effects.credits > 0 ? '+' : ''}{consequence.effects.credits}
                </div>
              )}
              {consequence.effects.reputation && (
                <div className="text-xs text-gray-300">
                  Reputation: {consequence.effects.reputation > 0 ? '+' : ''}{consequence.effects.reputation}
                </div>
              )}
            </div>
          )}

          <Button
            onClick={onDismiss}
            className="w-full"
            variant={consequence.type === 'reward' ? 'default' : 'destructive'}
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}