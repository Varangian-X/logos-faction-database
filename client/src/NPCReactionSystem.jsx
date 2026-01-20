import { base44 } from '@/api/base44Client';

// Check for NPC-initiated interactions
export async function checkNPCInteractions(gameState) {
  try {
    const npcs = await base44.entities.NPC.filter({ 
      current_location: gameState.current_location,
      state: 'active'
    });
    
    const triggeredInteractions = [];
    
    for (const npc of npcs) {
      if (!npc.interaction_triggers || npc.interaction_triggers.length === 0) continue;
      
      for (const trigger of npc.interaction_triggers) {
        // Skip if on cooldown
        if (trigger.cooldown_turns && trigger.last_triggered_turn) {
          const turnsSince = gameState.turn_number - trigger.last_triggered_turn;
          if (turnsSince < trigger.cooldown_turns) continue;
        }
        
        // Check trigger conditions
        if (shouldTriggerInteraction(trigger, gameState, npc)) {
          triggeredInteractions.push({
            npc,
            trigger,
            priority: trigger.priority || 'medium'
          });
          
          // Update last triggered turn
          const updatedTriggers = npc.interaction_triggers.map(t => 
            t === trigger ? { ...t, last_triggered_turn: gameState.turn_number } : t
          );
          await base44.entities.NPC.update(npc.id, { 
            interaction_triggers: updatedTriggers 
          });
        }
      }
    }
    
    // Sort by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    triggeredInteractions.sort((a, b) => 
      (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
    );
    
    return triggeredInteractions[0] || null; // Return highest priority
  } catch (error) {
    console.error('Error checking NPC interactions:', error);
    return null;
  }
}

function shouldTriggerInteraction(trigger, gameState, npc) {
  switch (trigger.trigger_type) {
    case 'player_enters_location':
      // Trigger when player first enters location
      return !npc.last_interaction_turn || 
             npc.last_interaction_turn < gameState.turn_number - 10;
    
    case 'world_event':
      // Trigger when specific world event is active
      return gameState.active_world_events?.some(e => 
        e.id === trigger.condition?.event_id
      );
    
    case 'npc_goal':
      // Trigger when NPC has specific active goal
      return npc.goals?.some(g => 
        g.goal_id === trigger.condition?.goal_id && 
        g.priority === 'critical'
      );
    
    case 'relationship_threshold':
      // Trigger when relationship crosses threshold
      const threshold = trigger.condition?.threshold || 0;
      const currentRel = npc.relationship_to_player || 0;
      return (threshold > 0 && currentRel >= threshold) ||
             (threshold < 0 && currentRel <= threshold);
    
    case 'faction_standing_change':
      // Trigger when player's faction standing changes significantly
      const factionStanding = gameState.faction_relations?.[npc.faction_affiliation] || 0;
      const minStanding = trigger.condition?.min_standing || 0;
      return factionStanding >= minStanding;
    
    case 'turn_based':
      // Trigger every N turns
      const interval = trigger.condition?.turn_interval || 10;
      return gameState.turn_number % interval === 0;
    
    default:
      return false;
  }
}

// Update NPC relationships based on player choice
export async function updateNPCRelationships(choice, affectedNPC) {
  if (!choice.affects_npc_relationship) return;
  
  const { npc_id, change } = choice.affects_npc_relationship;
  
  try {
    const targetNPC = await base44.entities.NPC.filter({ id: npc_id });
    if (targetNPC.length === 0) return;
    
    const npc = targetNPC[0];
    const currentRelationships = npc.npc_relationships || {};
    currentRelationships[affectedNPC.id] = Math.max(-100, Math.min(100, 
      (currentRelationships[affectedNPC.id] || 0) + change
    ));
    
    await base44.entities.NPC.update(npc_id, { 
      npc_relationships: currentRelationships 
    });
    
    // Reciprocal relationship update (less intense)
    const affectedRelationships = affectedNPC.npc_relationships || {};
    affectedRelationships[npc_id] = Math.max(-100, Math.min(100, 
      (affectedRelationships[npc_id] || 0) + Math.floor(change * 0.5)
    ));
    
    await base44.entities.NPC.update(affectedNPC.id, { 
      npc_relationships: affectedRelationships 
    });
  } catch (error) {
    console.error('Error updating NPC relationships:', error);
  }
}

// Update NPC goals based on player choice
export async function updateNPCGoals(choice, npc) {
  if (!choice.updates_npc_goal) return;
  
  const { goal_id, progress_change } = choice.updates_npc_goal;
  
  try {
    const goals = npc.goals || [];
    const updatedGoals = goals.map(goal => {
      if (goal.goal_id === goal_id) {
        const newProgress = Math.max(0, Math.min(100, goal.progress + progress_change));
        return { ...goal, progress: newProgress };
      }
      return goal;
    });
    
    await base44.entities.NPC.update(npc.id, { goals: updatedGoals });
  } catch (error) {
    console.error('Error updating NPC goals:', error);
  }
}

// React to world events
export async function npcReactToWorldEvent(eventId, gameState) {
  try {
    const npcs = await base44.entities.NPC.list();
    
    for (const npc of npcs) {
      // Check if NPC has a defined reaction to this event
      const reaction = npc.event_reactions?.find(r => r.event_id === eventId);
      
      if (reaction) {
        const updates = {};
        
        // Apply relationship changes
        if (reaction.relationship_changes) {
          const npcRelationships = { ...(npc.npc_relationships || {}) };
          Object.entries(reaction.relationship_changes).forEach(([targetId, change]) => {
            npcRelationships[targetId] = Math.max(-100, Math.min(100, 
              (npcRelationships[targetId] || 0) + change
            ));
          });
          updates.npc_relationships = npcRelationships;
        }
        
        // Apply goal updates
        if (reaction.goal_updates && reaction.goal_updates.length > 0) {
          const goals = [...(npc.goals || []), ...reaction.goal_updates];
          updates.goals = goals;
        }
        
        if (Object.keys(updates).length > 0) {
          await base44.entities.NPC.update(npc.id, updates);
        }
      }
    }
  } catch (error) {
    console.error('Error processing NPC reactions to world event:', error);
  }
}