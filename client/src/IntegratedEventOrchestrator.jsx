// Integrated Event Orchestrator - Manages all event systems
import { checkRandomEventTrigger } from './DynamicWorldEvents';
import { checkMultiStageEventTrigger, multiStageEvents } from '../narrative/MultiStageEventsData';
import { generateProceduralEvent } from './ProceduralEventEngine';
import { applyCascadingEffect, processDelayedConsequences } from './EnhancedCascadingSystem';
import { updateWorldState, checkWorldStateEvents } from './WorldStateTracker';

// Main orchestrator - decides what events fire each turn
export function orchestrateTurnEvents(gameState, worldState, factions, companions, recentActions, delayedConsequences) {
  const events = {
    primary: null,
    secondary: [],
    delayed_consequences: [],
    cascading_effects: []
  };
  
  // Process delayed consequences first
  const consequenceResults = processDelayedConsequences(gameState, delayedConsequences || []);
  events.delayed_consequences = consequenceResults.results.messages;
  const remainingDelayed = consequenceResults.remaining;
  
  if (consequenceResults.results.combatTriggered) {
    events.primary = {
      type: 'consequence_combat',
      name: 'Enemies Strike!',
      description: 'Your past actions have caught up with you. Prepare for battle!',
      enemy_type: consequenceResults.results.enemyType,
      immediate: true
    };
    return { events, updatedDelayed: remainingDelayed };
  }
  
  // Check for world-state triggered events (highest priority)
  const worldEvents = checkWorldStateEvents(worldState, gameState);
  if (worldEvents.length > 0) {
    events.primary = worldEvents[0];
    events.secondary = worldEvents.slice(1);
    return { events, updatedDelayed: remainingDelayed };
  }
  
  // Check for active multi-stage events
  const activeMultiStage = gameState.active_world_events?.find(e => 
    e.id && multiStageEvents[e.id] && !e.completed
  );
  
  if (activeMultiStage) {
    // Continue existing multi-stage event
    const eventData = multiStageEvents[activeMultiStage.id];
    events.primary = {
      ...eventData,
      current_stage: activeMultiStage.current_stage || 0,
      flags: activeMultiStage.flags || [],
      multi_stage_active: true
    };
    return { events, updatedDelayed: remainingDelayed };
  }
  
  // Check if new multi-stage event should trigger (medium priority)
  const shouldTriggerMultiStage = Math.random() < 0.15;
  if (shouldTriggerMultiStage) {
    for (const [key, event] of Object.entries(multiStageEvents)) {
      if (checkMultiStageEventTrigger(event, gameState, worldState, companions)) {
        events.primary = { ...event, current_stage: 0, flags: [], multi_stage_active: true };
        return { events, updatedDelayed: remainingDelayed };
      }
    }
  }
  
  // Check for random world events (lower priority)
  const randomEvent = checkRandomEventTrigger(gameState, companions);
  if (randomEvent) {
    events.primary = randomEvent;
    return { events, updatedDelayed: remainingDelayed };
  }
  
  // Generate procedural event (fallback)
  const shouldGenerateProcedural = Math.random() < 0.30;
  if (shouldGenerateProcedural) {
    const proceduralEvent = generateProceduralEvent(gameState, worldState, factions, recentActions);
    if (proceduralEvent) {
      events.primary = proceduralEvent;
    }
  }
  
  return { events, updatedDelayed: remainingDelayed };
}

// Process event choice and apply all effects
export async function processEventChoice(event, choice, gameState, worldState, factions, companions) {
  const results = {
    immediate_effects: {},
    faction_changes: {},
    cascading_messages: [],
    new_delayed_consequences: [],
    world_state_changes: {},
    triggers_combat: false,
    enemy_type: null,
    next_stage: null,
    event_completed: false
  };
  
  // Apply immediate effects
  if (choice.effects) {
    Object.entries(choice.effects).forEach(([key, value]) => {
      if (key.startsWith('faction_')) {
        const factionId = key.replace('faction_', '');
        results.faction_changes[factionId] = value;
      } else {
        results.immediate_effects[key] = value;
      }
    });
  }
  
  // Check for combat trigger
  if (choice.triggers_combat) {
    results.triggers_combat = true;
    results.enemy_type = choice.enemy_type || 'generic_hostile';
  }
  
  // Handle multi-stage progression
  if (event.multi_stage_active) {
    if (choice.next_stage !== undefined) {
      results.next_stage = choice.next_stage;
      
      const eventData = multiStageEvents[event.id];
      const nextStage = eventData?.stages?.find(s => s.stage_id === choice.next_stage);
      
      if (nextStage?.is_conclusion) {
        results.event_completed = true;
        if (nextStage.outcomes) {
          // Apply conclusion outcomes
          Object.entries(nextStage.outcomes).forEach(([key, value]) => {
            if (key.includes('gain')) {
              const resource = key.replace('_gain', '');
              results.immediate_effects[resource] = value;
            } else if (key.includes('loss')) {
              const resource = key.replace('_loss', '');
              results.immediate_effects[resource] = -value;
            } else if (key === 'world_state_changes') {
              results.world_state_changes = { ...results.world_state_changes, ...value };
            }
          });
        }
      }
    }
  }
  
  // Apply cascading effects
  if (choice.cascading) {
    const cascading = applyCascadingEffect(choice.cascading, gameState, worldState, factions);
    results.cascading_messages = cascading.messages;
    results.new_delayed_consequences = cascading.delayed;
    results.world_state_changes = { ...results.world_state_changes, ...cascading.worldChanges };
  }
  
  // Update world state based on action
  const updatedWorldState = updateWorldState(worldState, {
    reputation_change: results.immediate_effects.reputation,
    faction_impact: results.faction_changes,
    triggers_conflict: results.triggers_combat
  });
  
  results.world_state_changes = { ...results.world_state_changes, ...updatedWorldState };
  
  return results;
}

// Get event display data
export function getEventDisplayData(event, gameState) {
  const display = {
    title: event.name || 'Unknown Event',
    description: event.description || '',
    type: event.type || 'unknown',
    choices: event.choices || [],
    can_participate: true,
    warnings: []
  };
  
  // Check if multi-stage and get current stage
  if (event.multi_stage_active) {
    const eventData = multiStageEvents[event.id];
    const currentStage = eventData?.stages?.find(s => s.stage_id === event.current_stage);
    
    if (currentStage) {
      display.title = currentStage.title;
      display.description = currentStage.description;
      display.choices = currentStage.choices || [];
      
      // Apply conditional text
      if (currentStage.conditional_text && event.flags) {
        event.flags.forEach(flag => {
          if (currentStage.conditional_text[flag]) {
            display.description += `\n\n${currentStage.conditional_text[flag]}`;
          }
        });
      }
      
      // Mark combat stages
      if (currentStage.is_combat_stage) {
        display.is_combat = true;
        display.warnings.push('This choice will trigger combat');
      }
    }
  }
  
  // Add warnings for choices
  display.choices.forEach(choice => {
    if (choice.triggers_combat) {
      choice.warning = '⚔️ Triggers Combat';
    }
    if (choice.required_skill) {
      const skillName = Object.keys(choice.required_skill)[0];
      const requiredLevel = choice.required_skill[skillName];
      const playerLevel = gameState.skills?.[skillName]?.level || 0;
      
      if (playerLevel < requiredLevel) {
        choice.locked = true;
        choice.lock_reason = `Requires ${skillName} level ${requiredLevel}`;
      }
    }
    if (choice.required_reputation) {
      if ((gameState.reputation || 50) < choice.required_reputation) {
        choice.locked = true;
        choice.lock_reason = `Requires ${choice.required_reputation} reputation`;
      }
    }
  });
  
  return display;
}