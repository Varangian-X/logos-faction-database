import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertTriangle, Swords, Shield, Users, Sparkles, 
  TrendingUp, TrendingDown, Target, Crown 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const eventTypeIcons = {
  faction_conflict: Swords,
  rescue_mission: Shield,
  faction_enforcement: AlertTriangle,
  opportunity: Sparkles,
  companion_crisis: Users,
  duel: Target
};

const eventTypeColors = {
  faction_conflict: 'red',
  rescue_mission: 'blue',
  faction_enforcement: 'amber',
  opportunity: 'purple',
  companion_crisis: 'cyan',
  duel: 'orange'
};

export default function DynamicEventCard({ 
  event, 
  companions,
  onChoice, 
  isActive = true 
}) {
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  
  const Icon = eventTypeIcons[event.type] || AlertTriangle;
  const color = eventTypeColors[event.type] || 'gray';
  
  // Get companions who can participate
  const eligibleCompanions = companions.filter(c => 
    c.is_recruited && c.loyalty >= 40
  );
  
  const handleChoice = (choice) => {
    onChoice({
      ...choice,
      companion_participation: selectedCompanion ? {
        companion_id: selectedCompanion.id,
        role: selectedRole
      } : null
    });
  };
  
  // Get companion reactions preview for each choice
  const getReactionPreview = (choice) => {
    if (!selectedCompanion) return null;
    
    const reactions = choice.companion_reactions || {};
    const companionPrefs = selectedCompanion.choice_preferences || {};
    
    let reaction = 'neutral';
    
    if (reactions.favorable_factions?.includes(selectedCompanion.faction_affiliation)) {
      reaction = 'approve';
    } else if (reactions.opposed_factions?.includes(selectedCompanion.faction_affiliation)) {
      reaction = 'disapprove';
    }
    
    if (reactions.moral_alignments?.includes(companionPrefs.moral_alignment)) {
      reaction = 'approve';
    } else if (reactions.opposed_alignments?.includes(companionPrefs.moral_alignment)) {
      reaction = 'disapprove';
    }
    
    return reaction;
  };
  
  return (
    <Card className={`border-2 border-${color}-500/50 bg-slate-900/90 shadow-2xl`}>
      <CardHeader className={`border-b border-${color}-500/30 bg-gradient-to-r from-${color}-900/40 to-${color}-900/20`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-lg bg-${color}-500/20 flex items-center justify-center border border-${color}-500/40`}>
              <Icon className={`w-6 h-6 text-${color}-400`} />
            </div>
            <div>
              <CardTitle className="text-xl text-amber-100">{event.name}</CardTitle>
              <Badge variant="outline" className="mt-1 text-[10px]">
                {event.type.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          
          {event.factions_involved && event.factions_involved.length > 0 && (
            <div className="flex gap-1">
              {event.factions_involved.map(faction => (
                <Badge key={faction} variant="outline" className="text-[9px]">
                  {faction}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Event Description */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <p className="text-gray-200 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>
        
        {/* Companion Participation */}
        {eligibleCompanions.length > 0 && (
          <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
            <p className="text-xs text-purple-300 uppercase tracking-wider mb-3">
              Companion Support:
            </p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {eligibleCompanions.map(companion => (
                <Button
                  key={companion.id}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCompanion(
                    selectedCompanion?.id === companion.id ? null : companion
                  )}
                  className={cn(
                    "text-xs",
                    selectedCompanion?.id === companion.id && "bg-purple-500/20 border-purple-500"
                  )}
                >
                  {companion.name}
                </Button>
              ))}
            </div>
            
            {selectedCompanion && event.companion_roles?.available_roles && (
              <div className="space-y-2">
                <p className="text-[10px] text-gray-400">Select Role:</p>
                <div className="flex flex-wrap gap-2">
                  {event.companion_roles.available_roles.map(role => (
                    <Button
                      key={role}
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRole(selectedRole === role ? null : role)}
                      className={cn(
                        "text-[10px]",
                        selectedRole === role && "bg-purple-500/20 border-purple-500"
                      )}
                    >
                      {role.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Choices */}
        <div className="space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Your Response:
          </p>
          
          {event.choices.map((choice, index) => {
            const reactionPreview = selectedCompanion ? getReactionPreview(choice) : null;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  variant="outline"
                  disabled={!isActive}
                  onClick={() => handleChoice(choice)}
                  className="w-full text-left h-auto py-4 px-4 bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/50 hover:border-cyan-500/50 transition-all group"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-200 group-hover:text-cyan-200 mb-2">
                      {choice.text}
                    </p>
                    
                    {/* Companion Reaction Preview */}
                    {reactionPreview && (
                      <div className="mb-2">
                        <Badge className={cn(
                          "text-[9px]",
                          reactionPreview === 'approve' && "bg-green-500/10 text-green-400 border-green-500/30",
                          reactionPreview === 'disapprove' && "bg-red-500/10 text-red-400 border-red-500/30"
                        )}>
                          {selectedCompanion.name}: {reactionPreview === 'approve' ? '✓' : '✗'}
                        </Badge>
                      </div>
                    )}
                    
                    {/* Faction Impacts */}
                    {choice.faction_impact && Object.keys(choice.faction_impact).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(choice.faction_impact).map(([faction, value]) => (
                          <div
                            key={faction}
                            className={cn(
                              "flex items-center gap-1 text-[10px]",
                              value > 0 ? "text-green-400" : "text-red-400"
                            )}
                          >
                            {value > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            <span>{faction} {value > 0 ? '+' : ''}{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Rewards */}
                    {choice.rewards && Object.keys(choice.rewards).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(choice.rewards).map(([resource, value]) => (
                          <Badge key={resource} variant="outline" className="text-[9px]">
                            +{value} {resource}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Special flags */}
                    {choice.triggers_combat && (
                      <Badge className="text-[9px] bg-red-500/10 text-red-400 mt-2">
                        <Swords className="w-3 h-3 mr-1" />
                        Triggers Combat
                      </Badge>
                    )}
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}