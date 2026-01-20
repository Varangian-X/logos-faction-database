// Cascading Effects System - Player actions trigger world changes
import { base44 } from '@/api/base44Client';
import { worldEvents } from './WorldEventsData';

// Track player action with detailed metadata
export function trackPlayerAction(gameState, action) {
  const actionRecord = {
    turn: gameState.turn_number,
    type: action.type, // 'quest', 'dialogue', 'combat', 'market', etc.
    description: action.description,
    factionImpact: action.faction_impact || {},
    resourceChanges: {
      credits: action.credits_change || 0,
      influence: action.influence_change || 0,
      intel: action.intel_change || 0,
      reputation: action.reputation_change || 0
    },
    significance: calculateActionSignificance(action),
    tags: action.tags || [] // ['aggressive', 'diplomatic', 'economic', etc.]
  };

  return actionRecord;
}

// Calculate how significant an action is (0-100)
function calculateActionSignificance(action) {
  let score = 0;

  // Faction impact
  if (action.faction_impact) {
    const totalImpact = Object.values(action.faction_impact).reduce((sum, val) => sum + Math.abs(val), 0);
    score += Math.min(totalImpact * 2, 40);
  }

  // Resource changes
  if (action.credits_change) score += Math.min(Math.abs(action.credits_change) / 50, 20);
  if (action.reputation_change) score += Math.min(Math.abs(action.reputation_change) * 2, 20);
  if (action.influence_change) score += Math.min(Math.abs(action.influence_change) * 1.5, 15);

  // Special tags
  if (action.tags) {
    if (action.tags.includes('major')) score += 30;
    if (action.tags.includes('critical')) score += 50;
  }

  return Math.min(Math.round(score), 100);
}

// Generate cascading effects from player action
export async function processCascadingEffects(gameState, action, actionHistory) {
  const effects = {
    factionChanges: [],
    marketChanges: [],
    worldEvents: [],
    narrativeUnlocks: [],
    consequences: [],
    npcReactions: []
  };

  // Faction power shifts
  if (action.faction_impact) {
    effects.factionChanges = await calculateFactionPowerShifts(
      gameState,
      action.faction_impact,
      actionHistory
    );
  }

  // Market price changes
  if (action.type === 'market' || action.type === 'quest') {
    effects.marketChanges = calculateMarketImpact(gameState, action);
  }

  // World event triggers
  effects.worldEvents = checkWorldEventTriggers(gameState, action, actionHistory);

  // Narrative arc unlocks
  effects.narrativeUnlocks = checkNarrativeUnlocks(gameState, action, actionHistory);

  // Future consequences
  effects.consequences = generateFutureConsequences(gameState, action);

  // NPC reactions
  effects.npcReactions = await generateNPCReactions(gameState, action);

  return effects;
}

// Calculate faction power shifts based on action patterns
async function calculateFactionPowerShifts(gameState, factionImpact, actionHistory) {
  const shifts = [];
  const recentActions = actionHistory.slice(-10); // Last 10 actions

  for (const [factionId, impact] of Object.entries(factionImpact)) {
    const faction = await base44.entities.Faction.filter({ faction_id: factionId }).then(f => f[0]);
    if (!faction) continue;

    const currentPower = faction.power_level || 50;
    const powerChange = Math.round(impact / 4); // Dampen direct power changes

    // Check patterns - consistent actions have amplified effects
    const recentFactionActions = recentActions.filter(a => 
      a.factionImpact && a.factionImpact[factionId]
    );
    
    let multiplier = 1.0;
    if (recentFactionActions.length >= 3) {
      const allPositive = recentFactionActions.every(a => a.factionImpact[factionId] > 0);
      const allNegative = recentFactionActions.every(a => a.factionImpact[factionId] < 0);
      
      if (allPositive || allNegative) {
        multiplier = 1.5; // Consistent actions amplified
      }
    }

    const finalChange = Math.round(powerChange * multiplier);
    const newPower = Math.max(0, Math.min(100, currentPower + finalChange));

    shifts.push({
      factionId,
      oldPower: currentPower,
      newPower,
      change: finalChange,
      reason: `Player actions ${impact > 0 ? 'strengthened' : 'weakened'} the faction`
    });

    // Update faction
    await base44.entities.Faction.update(faction.id, {
      power_level: newPower
    });

    // Check for rivalry/alliance triggers
    if (Math.abs(finalChange) >= 15) {
      await checkFactionRelationshipChanges(faction, finalChange, gameState);
    }
  }

  return shifts;
}

// Check for faction relationship changes
async function checkFactionRelationshipChanges(faction, powerChange, gameState) {
  const allFactions = await base44.entities.Faction.list();
  
  for (const otherFaction of allFactions) {
    if (otherFaction.faction_id === faction.faction_id) continue;

    const relationship = faction.relationships?.[otherFaction.faction_id] || 0;

    // Powerful factions attract allies
    if (powerChange > 15 && faction.power_level > 70 && relationship > 30) {
      // Propose alliance
      const diplomaticActions = faction.diplomatic_actions || [];
      if (!diplomaticActions.some(a => a.target_faction === otherFaction.faction_id && a.action_type === 'alliance_proposal')) {
        diplomaticActions.push({
          action_type: 'alliance_proposal',
          target_faction: otherFaction.faction_id,
          turn_initiated: gameState.turn_number,
          status: 'pending',
          terms: 'Mutual defense and trade cooperation'
        });

        await base44.entities.Faction.update(faction.id, {
          diplomatic_actions: diplomaticActions
        });
      }
    }

    // Weakened factions spark rivalries
    if (powerChange < -15 && faction.power_level < 40 && relationship < -20) {
      const rivalries = otherFaction.rivalries || [];
      if (!rivalries.includes(faction.faction_id)) {
        rivalries.push(faction.faction_id);
        
        await base44.entities.Faction.update(otherFaction.id, {
          rivalries
        });
      }
    }
  }
}

// Calculate market price changes
function calculateMarketImpact(gameState, action) {
  const changes = [];

  if (action.type === 'market') {
    // Direct market manipulation
    if (action.goods_traded) {
      changes.push({
        category: action.goods_traded,
        priceChange: action.trade_volume > 500 ? 15 : 5,
        reason: 'Large trade volume affected prices'
      });
    }
  }

  // Quest impacts on market
  if (action.type === 'quest' && action.quest_type === 'economic') {
    changes.push({
      category: 'all',
      priceChange: action.success ? -10 : 5,
      reason: action.success ? 'Trade routes secured' : 'Supply disruption'
    });
  }

  // Faction war impacts
  const activeWars = gameState.active_world_events?.filter(e => 
    worldEvents[e.id]?.type === 'faction_war'
  ) || [];
  
  if (activeWars.length > 0) {
    changes.push({
      category: 'weapons',
      priceChange: 30,
      reason: 'Wartime demand surge'
    });
    changes.push({
      category: 'intel',
      priceChange: 40,
      reason: 'Intelligence at premium during conflicts'
    });
  }

  return changes;
}

// Check if action triggers world events
function checkWorldEventTriggers(gameState, action, actionHistory) {
  const triggeredEvents = [];

  // Major faction shifts trigger events
  if (action.faction_impact) {
    const majorShifts = Object.entries(action.faction_impact).filter(([_, val]) => Math.abs(val) >= 25);
    
    if (majorShifts.length >= 2) {
      // Multiple major faction impacts = faction war possible
      const [faction1, faction2] = majorShifts.map(([f]) => f).slice(0, 2);
      const impact1 = action.faction_impact[faction1];
      const impact2 = action.faction_impact[faction2];

      if ((impact1 > 0 && impact2 < 0) || (impact1 < 0 && impact2 > 0)) {
        // Opposing impacts - check for conflict event
        const conflictEvent = Object.values(worldEvents).find(e => 
          e.type === 'faction_war' && 
          e.impactedFactions?.includes(faction1) && 
          e.impactedFactions?.includes(faction2)
        );

        if (conflictEvent) {
          triggeredEvents.push({
            eventId: conflictEvent.id,
            reason: 'Player actions escalated tensions',
            probability: 0.7
          });
        }
      }
    }
  }

  // Pattern-based triggers
  const recentQuestTypes = actionHistory
    .filter(a => a.type === 'quest')
    .slice(-5)
    .map(a => a.quest_type);

  // Economic focus triggers boom/bust
  const economicFocus = recentQuestTypes.filter(t => t === 'economic').length;
  if (economicFocus >= 3 && gameState.credits > 1000) {
    triggeredEvents.push({
      eventId: 'merchant_boom',
      reason: 'Economic success attracted market attention',
      probability: 0.5
    });
  }

  // Combat focus triggers military events
  const combatFocus = recentQuestTypes.filter(t => t === 'combat').length;
  if (combatFocus >= 4) {
    triggeredEvents.push({
      eventId: 'praetorian_varangian_conflict',
      reason: 'Military activities destabilized the region',
      probability: 0.4
    });
  }

  return triggeredEvents;
}

// Check for narrative arc unlocks
function checkNarrativeUnlocks(gameState, action, actionHistory) {
  const unlocks = [];

  // High-significance action unlocks
  if (action.significance >= 70) {
    unlocks.push({
      type: 'narrative_thread',
      id: `major_consequence_${gameState.turn_number}`,
      description: 'Your actions have drawn powerful attention',
      trigger: action.description
    });
  }

  // Faction-specific unlocks
  if (action.faction_impact) {
    Object.entries(action.faction_impact).forEach(([factionId, impact]) => {
      const currentStanding = gameState.faction_relations?.[factionId] || 0;
      
      // High standing unlocks faction-specific arcs
      if (currentStanding + impact >= 75 && currentStanding < 75) {
        unlocks.push({
          type: 'faction_arc',
          factionId,
          description: `${factionId} offers you a position of authority`,
          questline: `${factionId}_ascension`
        });
      }

      // Low standing unlocks conflict arcs
      if (currentStanding + impact <= -50 && currentStanding > -50) {
        unlocks.push({
          type: 'faction_conflict',
          factionId,
          description: `${factionId} marks you as an enemy`,
          questline: `${factionId}_vendetta`
        });
      }
    });
  }

  return unlocks;
}

// Generate future consequences
function generateFutureConsequences(gameState, action) {
  const consequences = [];

  if (action.significance < 40) return consequences; // Only significant actions have consequences

  // Faction consequences
  if (action.faction_impact) {
    Object.entries(action.faction_impact).forEach(([factionId, impact]) => {
      if (Math.abs(impact) >= 20) {
        const turnsUntilConsequence = Math.floor(Math.random() * 10) + 5;
        
        consequences.push({
          id: `${factionId}_consequence_${gameState.turn_number}`,
          triggeredByTurn: gameState.turn_number,
          activatesOnTurn: gameState.turn_number + turnsUntilConsequence,
          factionId,
          type: impact > 0 ? 'reward' : 'retribution',
          severity: Math.abs(impact) > 30 ? 'major' : 'moderate',
          description: impact > 0 
            ? `${factionId} remembers your assistance`
            : `${factionId} has not forgotten your betrayal`,
          effects: {
            faction_relations: { [factionId]: impact > 0 ? 15 : -15 },
            credits: impact > 0 ? 500 : -300,
            reputation: impact > 0 ? 10 : -10
          }
        });
      }
    });
  }

  // Companion consequences
  if (action.companion_approval) {
    Object.entries(action.companion_approval).forEach(([companionId, approval]) => {
      if (Math.abs(approval) >= 15) {
        consequences.push({
          id: `companion_${companionId}_${gameState.turn_number}`,
          triggeredByTurn: gameState.turn_number,
          activatesOnTurn: gameState.turn_number + Math.floor(Math.random() * 8) + 3,
          companionId,
          type: approval > 0 ? 'loyalty_milestone' : 'loyalty_crisis',
          description: approval > 0
            ? `Your bond with ${companionId} deepens`
            : `${companionId} questions their loyalty to you`,
          effects: {
            companion_loyalty_change: approval > 0 ? 10 : -10
          }
        });
      }
    });
  }

  return consequences;
}

// Generate NPC reactions to player action
async function generateNPCReactions(gameState, action) {
  const reactions = [];

  // Only react to significant actions
  if (action.significance < 50) return reactions;

  try {
    const npcs = await base44.entities.NPC.list();
    
    for (const npc of npcs) {
      // NPCs react based on faction affiliation
      if (action.faction_impact && action.faction_impact[npc.faction_affiliation]) {
        const impact = action.faction_impact[npc.faction_affiliation];
        const relationshipChange = Math.floor(impact / 2);

        reactions.push({
          npcId: npc.id,
          npcName: npc.name,
          relationshipChange,
          reaction: impact > 0 
            ? `${npc.name} nods approvingly at your recent actions`
            : `${npc.name} regards you with suspicion`,
          moodChange: impact > 0 ? 'friendly' : 'unfriendly'
        });

        // Update NPC relationship
        await base44.entities.NPC.update(npc.id, {
          relationship_to_player: Math.max(-100, Math.min(100, 
            (npc.relationship_to_player || 0) + relationshipChange
          ))
        });
      }
    }
  } catch (error) {
    console.error('Error generating NPC reactions:', error);
  }

  return reactions;
}

// Apply all cascading effects to game state
export async function applyCascadingEffects(gameState, effects) {
  const updates = { ...gameState };

  // Apply market changes
  if (effects.marketChanges.length > 0) {
    const marketState = updates.market_state || { price_modifiers: {} };
    effects.marketChanges.forEach(change => {
      marketState.price_modifiers[change.category] = 
        (marketState.price_modifiers[change.category] || 0) + change.priceChange;
    });
    updates.market_state = marketState;
  }

  // Trigger world events
  if (effects.worldEvents.length > 0) {
    const activeEvents = updates.active_world_events || [];
    effects.worldEvents.forEach(trigger => {
      if (Math.random() < trigger.probability) {
        const event = worldEvents[trigger.eventId];
        if (event && !activeEvents.some(e => e.id === trigger.eventId)) {
          activeEvents.push({
            id: trigger.eventId,
            name: event.name,
            turns_remaining: event.duration,
            triggered_turn: updates.turn_number
          });
        }
      }
    });
    updates.active_world_events = activeEvents;
  }

  // Add narrative unlocks to active events/quests
  if (effects.narrativeUnlocks.length > 0) {
    const narrativeState = updates.narrative_state || { active_threads: [] };
    effects.narrativeUnlocks.forEach(unlock => {
      narrativeState.active_threads.push({
        id: unlock.id || `thread_${updates.turn_number}`,
        type: unlock.type,
        description: unlock.description,
        turn_activated: updates.turn_number
      });
    });
    updates.narrative_state = narrativeState;
  }

  // Store future consequences
  if (effects.consequences.length > 0) {
    updates.pending_consequences = [
      ...(updates.pending_consequences || []),
      ...effects.consequences
    ];
  }

  return updates;
}

// Process any consequences that are due this turn
export async function processScheduledConsequences(gameState) {
  const consequences = gameState.pending_consequences || [];
  const dueConsequences = consequences.filter(c => c.activatesOnTurn === gameState.turn_number);
  
  if (dueConsequences.length === 0) return { updates: {}, messages: [] };

  const updates = {};
  const messages = [];

  for (const consequence of dueConsequences) {
    messages.push({
      type: consequence.type,
      severity: consequence.severity || 'moderate',
      description: consequence.description,
      turn: gameState.turn_number
    });

    // Apply consequence effects
    if (consequence.effects) {
      if (consequence.effects.credits) {
        updates.credits = (gameState.credits || 0) + consequence.effects.credits;
      }
      if (consequence.effects.reputation) {
        updates.reputation = Math.max(0, Math.min(100, 
          (gameState.reputation || 50) + consequence.effects.reputation
        ));
      }
      if (consequence.effects.faction_relations) {
        const factionRelations = { ...(gameState.faction_relations || {}) };
        Object.entries(consequence.effects.faction_relations).forEach(([faction, change]) => {
          factionRelations[faction] = Math.max(-100, Math.min(100,
            (factionRelations[faction] || 0) + change
          ));
        });
        updates.faction_relations = factionRelations;
      }
    }
  }

  // Remove processed consequences
  updates.pending_consequences = consequences.filter(c => 
    !dueConsequences.some(dc => dc.id === c.id)
  );

  return { updates, messages };
}