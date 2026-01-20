// AI Logic for Rival Houses to perform intrigue operations
import { base44 } from '@/api/base44Client';
import { intrigueOperations } from './HouseIntrigueSystem';

export async function processRivalHouseIntrigue(house, allHouses, gameState, playerHouseId) {
  if (house.house_type !== 'npc') return null;
  if (house.id === playerHouseId) return null;
  
  const actions = [];
  const houseHealth = house.house_health || {};
  
  // Determine strategic focus
  const playerHouse = allHouses.find(h => h.id === playerHouseId);
  if (!playerHouse) return null;
  
  const relationToPlayer = house.player_house_relation || 0;
  const powerDiff = (playerHouse.power_level || 50) - (house.power_level || 50);
  
  // Hostile houses are more likely to act against player
  const hostilityLevel = relationToPlayer < -50 ? 'high' : relationToPlayer < -20 ? 'medium' : 'low';
  
  // Decision making based on AI personality and situation
  const shouldActAgainstPlayer = 
    (hostilityLevel === 'high' && Math.random() > 0.3) ||
    (hostilityLevel === 'medium' && Math.random() > 0.6) ||
    (powerDiff > 20 && Math.random() > 0.5); // Weak houses fear strong player
  
  if (!shouldActAgainstPlayer) {
    // Act against other rival houses instead
    const rivals = allHouses.filter(h => 
      h.id !== house.id && 
      h.id !== playerHouseId && 
      house.rivalries?.includes(h.id)
    );
    
    if (rivals.length > 0 && Math.random() > 0.4) {
      const target = rivals[0];
      const operation = selectOperationForHouse(house, target, houseHealth);
      
      if (operation) {
        actions.push({
          type: 'house_intrigue',
          actor: house.house_name,
          target: target.house_name,
          operation: operation.name,
          message: `${house.house_name} launched ${operation.name} against ${target.house_name}`
        });
        
        // Apply effects to target
        await applyAIIntrigueEffects(house, target, operation, false);
      }
    }
    
    return { actions, targetsPlayer: false };
  }
  
  // Acting against player
  const operation = selectOperationForHouse(house, playerHouse, houseHealth);
  
  if (operation) {
    const isDetected = Math.random() * 100 <= 40; // 40% chance player detects
    
    actions.push({
      type: 'house_intrigue_player',
      actor: house.house_name,
      operation: operation.name,
      detected: isDetected,
      message: isDetected 
        ? `⚠️ Intelligence detected: ${house.house_name} attempted ${operation.name} against you!`
        : `[Hidden] ${house.house_name} is secretly acting against you...`,
      targetsPlayer: true
    });
    
    // Apply effects
    const effects = await applyAIIntrigueEffects(house, playerHouse, operation, isDetected);
    
    return { 
      actions, 
      targetsPlayer: true, 
      detected: isDetected,
      effects,
      affectsGameState: true
    };
  }
  
  return { actions, targetsPlayer: false };
}

function selectOperationForHouse(house, target, houseHealth) {
  const availableOps = Object.values(intrigueOperations).filter(op => {
    // Check if house meets requirements
    return Object.entries(op.requires).every(([stat, value]) => 
      (houseHealth[stat] || 0) >= value * 0.7 // AI houses have lower requirements
    );
  });
  
  if (availableOps.length === 0) return null;
  
  const relation = house.player_house_relation || 0;
  const targetPower = target.power_level || 50;
  
  // Weight operations based on situation
  let weights = {};
  
  if (relation < -60) {
    // Very hostile - aggressive operations
    weights.assassination = 30;
    weights.sabotage = 40;
    weights.espionage = 20;
    weights.propaganda = 10;
  } else if (relation < -30) {
    // Moderately hostile
    weights.sabotage = 30;
    weights.espionage = 40;
    weights.propaganda = 20;
    weights.bribery = 10;
  } else {
    // Neutral or friendly - mostly intelligence gathering
    weights.espionage = 50;
    weights.bribery = 30;
    weights.counter_intelligence = 20;
  }
  
  // If target is much stronger, avoid direct confrontation
  if (targetPower > (house.power_level || 50) + 20) {
    weights.assassination = 0;
    weights.sabotage = Math.floor((weights.sabotage || 0) / 2);
    weights.espionage = (weights.espionage || 0) + 20;
  }
  
  // Random weighted selection
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  
  for (const [opId, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) {
      return availableOps.find(op => op.id === opId) || availableOps[0];
    }
  }
  
  return availableOps[0];
}

async function applyAIIntrigueEffects(actorHouse, targetHouse, operation, detected) {
  const effects = detected ? operation.effects.detected : operation.effects.success;
  
  const targetUpdates = { house_health: { ...(targetHouse.house_health || {}) } };
  
  if (effects.target_muscle_damage) {
    targetUpdates.house_health.muscle = Math.max(0, 
      (targetHouse.house_health?.muscle || 50) - effects.target_muscle_damage
    );
  }
  if (effects.target_intel_damage) {
    targetUpdates.house_health.intel = Math.max(0, 
      (targetHouse.house_health?.intel || 50) - effects.target_intel_damage
    );
  }
  if (effects.target_funds_damage) {
    targetUpdates.house_health.funds = Math.max(0, 
      (targetHouse.house_health?.funds || 50) - effects.target_funds_damage
    );
  }
  if (effects.house_relation_damage) {
    targetUpdates.player_house_relation = Math.max(-100, 
      (targetHouse.player_house_relation || 0) - effects.house_relation_damage
    );
  }
  
  // Update rivalry if severe action
  if (effects.trigger_war) {
    targetUpdates.rivalries = [...(targetHouse.rivalries || []), actorHouse.id];
  }
  
  await base44.entities.House.update(targetHouse.id, targetUpdates);
  
  return {
    targetUpdates,
    detected,
    severity: effects.target_muscle_damage > 20 ? 'severe' : 'moderate'
  };
}

export async function generateRivalIntrigueEvent(actorHouse, operation, detected, gameState) {
  // Generate a narrative event from rival house intrigue
  return {
    id: `rival_intrigue_${Date.now()}`,
    name: detected 
      ? `${actorHouse.house_name} Intrigue Detected!`
      : 'Mysterious Setbacks',
    description: detected
      ? `Your intelligence network has uncovered a covert operation by ${actorHouse.house_name}. They are attempting ${operation.name} against your house. Swift action is required.`
      : 'Strange incidents plague your operations. Equipment failures, missing intel, personnel vanishing. Someone is working against you in the shadows.',
    event_type: 'crisis',
    choices: detected ? [
      {
        text: 'Launch immediate counter-operation',
        effects: { credits: -1000 },
        triggers_intrigue_mission: true,
        faction_impact: {}
      },
      {
        text: 'Reinforce defenses and gather evidence',
        effects: { intel: 20 },
        house_intel_boost: 15,
        faction_impact: {}
      },
      {
        text: 'Leak information to damage their reputation',
        effects: { influence: 10 },
        target_house_reputation_damage: 15,
        faction_impact: {}
      }
    ] : [
      {
        text: 'Investigate the incidents thoroughly',
        effects: { intel: -15 },
        reveals_intrigue: 60, // 60% chance to reveal
        faction_impact: {}
      },
      {
        text: 'Sweep for infiltrators',
        effects: { credits: -500 },
        removes_spies: true,
        faction_impact: {}
      }
    ]
  };
}