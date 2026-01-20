import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, X, TrendingUp, TrendingDown, 
  AlertTriangle, Sparkles, Lock, ChevronRight, Shield 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { shouldCompanionIntervene } from '@/components/companions/CompanionAdviceSystem';
import { getCompanionDiplomacyAdvice, getCompanionUnlockedDialogue } from '@/components/companions/CompanionDiplomacySystem';
import { getUnlockedDialogueOptions } from '../skills/SkillTreeSystem';
import { hasReputationRequirement } from '../reputation/EnhancedReputationSystem';
import { getMasteryDialogueUnlocks } from '../mastery/MasterySystem';

export default function DialogueInterface({ 
  npc, 
  gameState, 
  onChoice, 
  onClose,
  companions = [],
  isProcessing = false 
}) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [companionIntervention, setCompanionIntervention] = useState(null);
  const [companionDiplomacyAdvice, setCompanionDiplomacyAdvice] = useState([]);
  const unlockedDialogueOptions = getUnlockedDialogueOptions(gameState);
  const masteryDialogueUnlocks = getMasteryDialogueUnlocks(gameState);

  if (!npc) return null;

  // Determine greeting based on reputation and relationship
  const getGreeting = () => {
    const relationship = npc.relationship_to_player || 0;
    const reputation = gameState?.reputation || 50;
    
    if (npc.dialogue_tree?.greeting) {
      // Find matching greeting based on conditions
      const matchingGreeting = npc.dialogue_tree.greeting.find(g => {
        const cond = g.condition || {};
        const repMatch = (!cond.min_reputation || reputation >= cond.min_reputation) &&
                        (!cond.max_reputation || reputation <= cond.max_reputation);
        const relMatch = !cond.min_relationship || relationship >= cond.min_relationship;
        const eventMatch = !cond.requires_event || 
                          gameState?.active_events?.includes(cond.requires_event);
        return repMatch && relMatch && eventMatch;
      });
      
      if (matchingGreeting) return matchingGreeting.text;
    }

    // Fallback greetings
    if (relationship >= 50) return `Ah, ${gameState?.character_name}! Welcome, friend.`;
    if (relationship >= 20) return `${gameState?.character_name}. What brings you here?`;
    if (relationship >= -20) return `State your business.`;
    if (relationship >= -50) return `You again. Make it quick.`;
    return `I have nothing to say to you.`;
  };

  // Get available dialogue topics
  const getTopics = () => {
    if (!npc.dialogue_tree?.topics) return [];
    
    return npc.dialogue_tree.topics.filter(topic => {
      if (!topic.unlock_condition) return true;
      
      const cond = topic.unlock_condition;
      const reputation = gameState?.reputation || 50;
      const relationship = npc.relationship_to_player || 0;
      
      const repMatch = !cond.min_reputation || reputation >= cond.min_reputation;
      const relMatch = !cond.min_relationship || relationship >= cond.min_relationship;
      const eventMatch = !cond.requires_event || 
                        gameState?.active_events?.includes(cond.requires_event);
      const factionMatch = !cond.min_faction_standing || 
                          (gameState?.faction_relations?.[npc.faction_affiliation] || 0) >= cond.min_faction_standing;
      
      return repMatch && relMatch && eventMatch && factionMatch;
    });
  };

  const topics = getTopics();
  const greeting = getGreeting();
  
  // Check for companion intervention when topic is selected
  React.useEffect(() => {
    if (selectedTopic && companions.length > 0) {
      for (const companion of companions) {
        const intervention = shouldCompanionIntervene(companion, npc, selectedTopic, gameState);
        if (intervention) {
          setCompanionIntervention(intervention);
          break;
        }
      }
    }
  }, [selectedTopic, companions, npc, gameState]);

  // Parse choice effects to display
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
    
    if (choice.relationship_change) {
      impacts.push({
        type: 'relationship',
        value: choice.relationship_change,
        icon: choice.relationship_change > 0 ? TrendingUp : TrendingDown,
        color: choice.relationship_change > 0 ? 'text-green-400' : 'text-red-400'
      });
    }
    
    if (choice.triggers_event) {
      impacts.push({
        type: 'event',
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
    
    return impacts;
  };

  // Check if choice is locked
  const isChoiceLocked = (choice) => {
    if (!choice.requirements) return false;
    
    const req = choice.requirements;
    const reputation = gameState?.reputation || 50;
    const relationship = npc.relationship_to_player || 0;
    
    if (req.min_reputation && reputation < req.min_reputation) return true;
    if (req.min_relationship && relationship < req.min_relationship) return true;
    if (req.required_trait && (!gameState?.character_traits?.[req.required_trait] || 
        gameState.character_traits[req.required_trait] < (req.trait_level || 1))) return true;
    if (req.required_skill && (!gameState?.skills?.[req.required_skill]?.level || 
        gameState.skills[req.required_skill].level < (req.skill_level || 1))) return true;
    if (req.required_skill_unlock && !unlockedDialogueOptions.has(`dialogue_${req.required_skill_unlock}`)) return true;
    if (req.required_mastery_unlock && !masteryDialogueUnlocks.has(req.required_mastery_unlock)) return true;
    if (req.faction_reputation) {
      const hasRep = hasReputationRequirement(gameState, {
        faction: npc.faction_affiliation,
        min_standing: req.faction_reputation
      });
      if (!hasRep) return true;
    }
    
    return false;
  };
  
  // Check if topic is locked
  const isTopicLocked = (topic) => {
    if (!topic.unlock_condition) return false;
    
    const cond = topic.unlock_condition;
    if (cond.required_skill_unlock && !unlockedDialogueOptions.has(`dialogue_${cond.required_skill_unlock}`)) return true;
    if (cond.required_mastery_unlock && !masteryDialogueUnlocks.has(cond.required_mastery_unlock)) return true;
    if (cond.min_faction_reputation) {
      const hasRep = hasReputationRequirement(gameState, {
        faction: npc.faction_affiliation,
        min_standing: cond.min_faction_reputation
      });
      if (!hasRep) return true;
    }
    
    return false;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl"
        >
          <Card className="bg-slate-900 border-amber-900/30 shadow-2xl">
            {/* Header */}
            <CardHeader className="border-b border-slate-700/50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-cyan-500/20 flex items-center justify-center border border-amber-500/30">
                    <MessageSquare className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-amber-100">{npc.name}</CardTitle>
                    <p className="text-sm text-gray-400">{npc.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px]">
                        {npc.faction_affiliation}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[10px]",
                          (npc.relationship_to_player || 0) >= 50 && "border-green-500/50 text-green-400",
                          (npc.relationship_to_player || 0) < 50 && (npc.relationship_to_player || 0) >= 0 && "border-gray-500/50 text-gray-400",
                          (npc.relationship_to_player || 0) < 0 && "border-red-500/50 text-red-400"
                        )}
                      >
                        {npc.mood || 'neutral'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Greeting */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <p className="text-gray-200 leading-relaxed">{greeting}</p>
              </div>

              {/* Topics or Selected Topic Responses */}
              {!selectedTopic ? (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Dialogue Topics:
                  </p>
                  
                  {topics.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">No dialogue topics available</p>
                    </div>
                  )}

                  {topics.map((topic, index) => {
                    const locked = isTopicLocked(topic);
                    
                    return (
                      <motion.div
                        key={topic.topic_id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Button
                          variant="outline"
                          disabled={isProcessing || locked}
                          onClick={() => setSelectedTopic(topic)}
                          className={cn(
                            "w-full text-left h-auto py-3 px-4 bg-slate-800/50 border-slate-600/50 transition-all group relative",
                            !locked && "hover:bg-slate-700/50 hover:border-amber-500/50",
                            locked && "opacity-50"
                          )}
                        >
                          {locked && (
                            <Lock className="w-4 h-4 text-gray-600 mr-2" />
                          )}
                          {topic.unlock_condition?.required_skill_unlock && !locked && (
                            <Star className="w-4 h-4 text-amber-400 mr-2" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-gray-200 group-hover:text-amber-200">
                              {topic.label}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Companion Intervention */}
                  {companionIntervention && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/30"
                    >
                      <div className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-purple-400 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-purple-200">{companionIntervention.companion_name}</p>
                          <p className="text-xs text-gray-300 italic">"{companionIntervention.intervention}"</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                
                  {/* NPC Response */}
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                      {selectedTopic.response}
                    </p>
                  </div>

                  {/* Player Choices */}
                  {selectedTopic.choices && selectedTopic.choices.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Your Response:
                      </p>

                      {selectedTopic.choices.map((choice, index) => {
                        const impacts = getChoiceImpact(choice);
                        const locked = isChoiceLocked(choice);

                        // Get companion diplomacy advice for this specific choice
                        const choiceAdvice = getCompanionDiplomacyAdvice(companions, choice, npc, gameState);

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Button
                              variant="outline"
                              disabled={isProcessing || locked}
                              onClick={() => onChoice && onChoice(choice, selectedTopic, npc)}
                              className={cn(
                                "w-full text-left h-auto py-3 px-4 bg-slate-800/50 border-slate-600/50 transition-all group relative",
                                !locked && "hover:bg-slate-700/50 hover:border-cyan-500/50"
                              )}
                            >
                              {locked && (
                                <div className="absolute inset-0 bg-slate-950/60 rounded flex items-center justify-center">
                                  <Lock className="w-4 h-4 text-red-400 mr-2" />
                                  <span className="text-xs text-red-400">
                                    {choice.requirements?.min_reputation && `Reputation ${choice.requirements.min_reputation}+`}
                                    {choice.requirements?.required_trait && ` ${choice.requirements.required_trait} ${choice.requirements.trait_level}+`}
                                    {choice.requirements?.required_skill && ` ${choice.requirements.required_skill} ${choice.requirements.skill_level}+`}
                                  </span>
                                </div>
                              )}

                              <div className="flex-1">
                                <p className="text-sm text-gray-200 group-hover:text-cyan-200">
                                  {choice.text}
                                </p>

                                {/* Companion Diplomacy Advice */}
                                {choiceAdvice.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {choiceAdvice.slice(0, 2).map((advice, i) => (
                                      <div
                                        key={i}
                                        className={cn(
                                          "text-[10px] px-2 py-1 rounded border flex items-center gap-1",
                                          advice.stance === 'strongly_approve' && "bg-green-500/10 text-green-400 border-green-500/30",
                                          advice.stance === 'approve' && "bg-green-500/5 text-green-300 border-green-500/20",
                                          advice.stance === 'disapprove' && "bg-red-500/5 text-red-300 border-red-500/20",
                                          advice.stance === 'strongly_disapprove' && "bg-red-500/10 text-red-400 border-red-500/30"
                                        )}
                                      >
                                        <Shield className="w-3 h-3" />
                                        <span className="font-semibold">{advice.companion_name}:</span>
                                        <span className="italic">
                                          {advice.stance === 'strongly_approve' && '✓✓'}
                                          {advice.stance === 'approve' && '✓'}
                                          {advice.stance === 'disapprove' && '✗'}
                                          {advice.stance === 'strongly_disapprove' && '✗✗'}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Show impacts */}
                                {impacts.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {impacts.map((impact, i) => {
                                      const Icon = impact.icon;
                                      return (
                                        <div
                                          key={i}
                                          className={cn(
                                            "flex items-center gap-1 text-[10px]",
                                            impact.color
                                          )}
                                        >
                                          <Icon className="w-3 h-3" />
                                          {impact.type === 'faction' && (
                                            <span>{impact.faction} {impact.value > 0 ? '+' : ''}{impact.value}</span>
                                          )}
                                          {impact.type === 'relationship' && (
                                            <span>Relationship {impact.value > 0 ? '+' : ''}{impact.value}</span>
                                          )}
                                          {impact.type === 'event' && <span>Triggers Event</span>}
                                          {impact.type === 'location' && <span>Unlocks Location</span>}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>

                              {!locked && (
                                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-all" />
                              )}
                            </Button>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Back button */}
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTopic(null)}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    Back to Topics
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}