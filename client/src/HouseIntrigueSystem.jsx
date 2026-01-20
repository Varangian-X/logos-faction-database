// Core Intrigue Mechanics for House-vs-House Operations
import { base44 } from '@/api/base44Client';

export const intrigueOperations = {
  espionage: {
    id: 'espionage',
    name: 'Plant Spy Network',
    description: 'Infiltrate target house to gather ongoing intelligence',
    cost: { credits: 500, intel: 20 },
    duration: 6,
    requires: { streets: 30, intel: 25 },
    success_base: 60,
    effects: {
      success: {
        intel_per_turn: 15,
        reveals_operations: true,
        house_intel_damage: 10
      },
      failure: {
        reputation_loss: 15,
        house_relation_damage: 30,
        streets_damage: 5
      },
      detected: {
        reputation_loss: 25,
        house_relation_damage: 50,
        intel_loss: 30,
        trigger_retaliation: true
      }
    }
  },
  sabotage: {
    id: 'sabotage',
    name: 'Sabotage Operations',
    description: 'Disrupt target house\'s operations and damage their capabilities',
    cost: { credits: 800, intel: 30 },
    duration: 4,
    requires: { streets: 40, savvy: 30 },
    success_base: 50,
    effects: {
      success: {
        target_muscle_damage: 15,
        target_funds_damage: 20,
        player_reputation_gain: 10
      },
      failure: {
        credits_lost: 400,
        reputation_loss: 10
      },
      detected: {
        credits_lost: 800,
        reputation_loss: 30,
        house_relation_damage: 60,
        trigger_war: true
      }
    }
  },
  assassination: {
    id: 'assassination',
    name: 'Targeted Elimination',
    description: 'Attempt to eliminate key figure in target house',
    cost: { credits: 2000, intel: 50 },
    duration: 3,
    requires: { streets: 60, muscle: 40, intel: 50 },
    success_base: 35,
    effects: {
      success: {
        target_muscle_damage: 30,
        target_intel_damage: 25,
        target_power_damage: 40,
        player_reputation_gain: 20,
        triggers_quest: true
      },
      failure: {
        credits_lost: 1000,
        reputation_loss: 20,
        streets_damage: 10
      },
      detected: {
        credits_lost: 2000,
        reputation_loss: 50,
        house_relation_damage: 100,
        trigger_war: true,
        all_factions_hostile: true
      }
    }
  },
  counter_intelligence: {
    id: 'counter_intelligence',
    name: 'Counter-Intelligence Sweep',
    description: 'Root out enemy spies and protect your house',
    cost: { credits: 600, intel: 25 },
    duration: 3,
    requires: { intel: 35, savvy: 25 },
    success_base: 70,
    effects: {
      success: {
        removes_enemy_spies: true,
        intel_gain: 20,
        house_intel_boost: 10,
        reveals_enemy_operations: 2
      },
      failure: {
        credits_lost: 300,
        intel_loss: 10
      }
    }
  },
  propaganda: {
    id: 'propaganda',
    name: 'Propaganda Campaign',
    description: 'Launch disinformation to damage rival house reputation',
    cost: { credits: 1000, intel: 15 },
    duration: 5,
    requires: { streets: 35, funds: 40 },
    success_base: 65,
    effects: {
      success: {
        target_reputation_damage: 20,
        player_streets_boost: 10,
        faction_standing_steal: 10
      },
      failure: {
        credits_lost: 500,
        own_reputation_damage: 10
      },
      detected: {
        credits_lost: 1000,
        reputation_loss: 25,
        house_relation_damage: 40
      }
    }
  },
  bribery: {
    id: 'bribery',
    name: 'Bribe Key Officials',
    description: 'Corrupt target house personnel for information and influence',
    cost: { credits: 1200, intel: 10 },
    duration: 4,
    requires: { funds: 50, streets: 25 },
    success_base: 60,
    effects: {
      success: {
        intel_gain: 30,
        influence_gain: 15,
        house_relation_improve: 10,
        reveals_vulnerabilities: true
      },
      failure: {
        credits_lost: 600
      },
      detected: {
        credits_lost: 1200,
        house_relation_damage: 35,
        reputation_loss: 20
      }
    }
  }
};

export function calculateIntrigueSuccess(operation, playerHouse, targetHouse, playerSkills) {
  const baseChance = operation.success_base;
  
  // Player house capability bonuses
  const streetsBonus = Math.floor((playerHouse.house_health?.streets || 50) * 0.3);
  const intelBonus = Math.floor((playerHouse.house_health?.intel || 50) * 0.2);
  
  // Skill bonuses
  const espionageLevel = playerSkills?.espionage?.level || 0;
  const skillBonus = espionageLevel * 3;
  
  // Target house defenses
  const targetIntelPenalty = Math.floor((targetHouse.house_health?.intel || 50) * 0.15);
  const targetStreetsPenalty = Math.floor((targetHouse.house_health?.streets || 50) * 0.1);
  
  // Relationship modifier (easier against enemies, harder against allies)
  const relationshipMod = Math.floor((targetHouse.player_house_relation || 0) * -0.1);
  
  const totalChance = Math.max(5, Math.min(95, 
    baseChance + streetsBonus + intelBonus + skillBonus - targetIntelPenalty - targetStreetsPenalty + relationshipMod
  ));
  
  return {
    chance: totalChance,
    breakdown: {
      base: baseChance,
      streets: streetsBonus,
      intel: intelBonus,
      skills: skillBonus,
      targetDefense: -(targetIntelPenalty + targetStreetsPenalty),
      relationship: relationshipMod
    }
  };
}

export function calculateDetectionRisk(operation, playerHouse, targetHouse) {
  const baseRisk = 100 - operation.success_base;
  
  const playerStreetsReduction = Math.floor((playerHouse.house_health?.streets || 50) * 0.2);
  const targetIntelIncrease = Math.floor((targetHouse.house_health?.intel || 50) * 0.25);
  
  const risk = Math.max(5, Math.min(80, baseRisk - playerStreetsReduction + targetIntelIncrease));
  
  return risk;
}

export async function executeIntrigueOperation(operationId, targetHouseId, playerHouseId, gameState) {
  const operation = intrigueOperations[operationId];
  if (!operation) return { success: false, message: 'Invalid operation' };
  
  // Fetch houses
  const [playerHouses, targetHouses] = await Promise.all([
    base44.entities.House.filter({ id: playerHouseId }),
    base44.entities.House.filter({ id: targetHouseId })
  ]);
  
  const playerHouse = playerHouses[0];
  const targetHouse = targetHouses[0];
  
  if (!playerHouse || !targetHouse) {
    return { success: false, message: 'Houses not found' };
  }
  
  // Check requirements
  const houseHealth = playerHouse.house_health || {};
  const reqs = operation.requires;
  const meetsReqs = Object.entries(reqs).every(([stat, value]) => 
    (houseHealth[stat] || 0) >= value
  );
  
  if (!meetsReqs) {
    return { success: false, message: 'House capabilities insufficient' };
  }
  
  // Calculate success
  const successCalc = calculateIntrigueSuccess(operation, playerHouse, targetHouse, gameState.skills);
  const detectionRisk = calculateDetectionRisk(operation, playerHouse, targetHouse);
  
  const successRoll = Math.random() * 100;
  const detectionRoll = Math.random() * 100;
  
  const succeeded = successRoll <= successCalc.chance;
  const detected = detectionRoll <= detectionRisk;
  
  const result = {
    success: succeeded,
    detected,
    operation: operation.id,
    target: targetHouse.house_name,
    successChance: successCalc.chance,
    detectionRisk,
    rolls: { success: successRoll, detection: detectionRoll },
    effects: {},
    updates: {}
  };
  
  // Apply effects based on outcome
  let effectsToApply;
  if (detected) {
    effectsToApply = operation.effects.detected;
    result.message = `Operation DETECTED by ${targetHouse.house_name}! Severe consequences.`;
  } else if (succeeded) {
    effectsToApply = operation.effects.success;
    result.message = `Operation successful against ${targetHouse.house_name}!`;
  } else {
    effectsToApply = operation.effects.failure;
    result.message = `Operation failed but went undetected.`;
  }
  
  // Build game state updates
  result.updates.game_log = [];
  
  if (effectsToApply.intel_gain) {
    result.updates.intel = (gameState.intel || 0) + effectsToApply.intel_gain;
  }
  if (effectsToApply.intel_loss) {
    result.updates.intel = Math.max(0, (gameState.intel || 0) - effectsToApply.intel_loss);
  }
  if (effectsToApply.reputation_loss) {
    result.updates.reputation = Math.max(0, (gameState.reputation || 50) - effectsToApply.reputation_loss);
  }
  if (effectsToApply.player_reputation_gain) {
    result.updates.reputation = Math.min(100, (gameState.reputation || 50) + effectsToApply.player_reputation_gain);
  }
  if (effectsToApply.credits_lost) {
    result.updates.credits = Math.max(0, (gameState.credits || 0) - effectsToApply.credits_lost);
  }
  
  // Update player house stats
  const playerHouseUpdates = { house_health: { ...houseHealth } };
  if (effectsToApply.streets_damage) {
    playerHouseUpdates.house_health.streets = Math.max(0, (houseHealth.streets || 50) - effectsToApply.streets_damage);
  }
  if (effectsToApply.player_streets_boost) {
    playerHouseUpdates.house_health.streets = Math.min(100, (houseHealth.streets || 50) + effectsToApply.player_streets_boost);
  }
  if (effectsToApply.house_intel_boost) {
    playerHouseUpdates.house_health.intel = Math.min(100, (houseHealth.intel || 50) + effectsToApply.house_intel_boost);
  }
  
  // Update target house
  const targetHouseUpdates = { house_health: { ...(targetHouse.house_health || {}) } };
  if (effectsToApply.target_muscle_damage) {
    targetHouseUpdates.house_health.muscle = Math.max(0, (targetHouse.house_health?.muscle || 50) - effectsToApply.target_muscle_damage);
  }
  if (effectsToApply.target_intel_damage) {
    targetHouseUpdates.house_health.intel = Math.max(0, (targetHouse.house_health?.intel || 50) - effectsToApply.target_intel_damage);
  }
  if (effectsToApply.target_funds_damage) {
    targetHouseUpdates.house_health.funds = Math.max(0, (targetHouse.house_health?.funds || 50) - effectsToApply.target_funds_damage);
  }
  if (effectsToApply.target_power_damage) {
    targetHouseUpdates.power_level = Math.max(0, (targetHouse.power_level || 50) - effectsToApply.target_power_damage);
  }
  if (effectsToApply.target_reputation_damage) {
    // Track in a damage log
    targetHouseUpdates.recent_damage = [...(targetHouse.recent_damage || []), {
      type: 'reputation',
      amount: effectsToApply.target_reputation_damage,
      turn: gameState.turn_number
    }];
  }
  
  // Update house relation
  if (effectsToApply.house_relation_damage) {
    targetHouseUpdates.player_house_relation = Math.max(-100, 
      (targetHouse.player_house_relation || 0) - effectsToApply.house_relation_damage
    );
  }
  if (effectsToApply.house_relation_improve) {
    targetHouseUpdates.player_house_relation = Math.min(100, 
      (targetHouse.player_house_relation || 0) + effectsToApply.house_relation_improve
    );
  }
  
  // Create active operation for ongoing effects
  if (succeeded && !detected && effectsToApply.intel_per_turn) {
    result.activeOperation = {
      operation_id: `intrigue_${Date.now()}`,
      type: operation.id,
      target_house_id: targetHouseId,
      turns_remaining: operation.duration,
      intel_per_turn: effectsToApply.intel_per_turn,
      launched_turn: gameState.turn_number,
      status: 'active'
    };
  }
  
  // Trigger consequences
  if (effectsToApply.trigger_retaliation) {
    result.triggersRetaliation = true;
  }
  if (effectsToApply.trigger_war) {
    result.triggersWar = true;
    targetHouseUpdates.rivalries = [...(targetHouse.rivalries || []), playerHouseId];
  }
  
  // Save updates
  await base44.entities.House.update(playerHouseId, playerHouseUpdates);
  await base44.entities.House.update(targetHouseId, targetHouseUpdates);
  
  result.playerHouseUpdates = playerHouseUpdates;
  result.targetHouseUpdates = targetHouseUpdates;
  
  return result;
}

export async function processActiveIntrigueOperations(gameState, playerHouseId) {
  const activeOps = gameState.active_house_intrigue || [];
  const updates = { game_log: [], intel_gained: 0 };
  const remaining = [];
  
  for (const op of activeOps) {
    op.turns_remaining -= 1;
    
    if (op.intel_per_turn) {
      updates.intel_gained += op.intel_per_turn;
      updates.game_log.push(`🕵️ Spy network generated ${op.intel_per_turn} intel from ${op.target_house_name}`);
    }
    
    if (op.turns_remaining > 0) {
      // Check for counter-intel detection each turn
      const houses = await base44.entities.House.filter({ id: op.target_house_id });
      const targetHouse = houses[0];
      
      if (targetHouse) {
        const counterIntelChance = (targetHouse.house_health?.intel || 50) * 0.4;
        if (Math.random() * 100 <= counterIntelChance) {
          updates.game_log.push(`⚠️ ${targetHouse.house_name} detected and shut down your spy network!`);
          
          // Apply detection penalties
          updates.reputation_loss = 15;
          const houseRelation = Math.max(-100, (targetHouse.player_house_relation || 0) - 25);
          await base44.entities.House.update(targetHouse.id, {
            player_house_relation: houseRelation
          });
          
          continue; // Don't add to remaining
        }
      }
      
      remaining.push(op);
    } else {
      updates.game_log.push(`✓ Intrigue operation "${op.type}" against ${op.target_house_name} completed.`);
    }
  }
  
  return {
    updates: {
      active_house_intrigue: remaining,
      intel: (gameState.intel || 0) + updates.intel_gained,
      reputation: updates.reputation_loss 
        ? Math.max(0, (gameState.reputation || 50) - updates.reputation_loss)
        : gameState.reputation,
      game_log: [...(gameState.game_log || []), ...updates.game_log]
    }
  };
}

export async function generateIntelReport(playerHouseId, gameState) {
  const [houses, factions] = await Promise.all([
    base44.entities.House.list(),
    base44.entities.Faction.list()
  ]);
  
  const activeSpies = (gameState.active_house_intrigue || []).filter(op => 
    op.type === 'espionage' && op.status === 'active'
  );
  
  const report = {
    turn: gameState.turn_number,
    intel_available: gameState.intel || 0,
    active_operations: activeSpies.length,
    threats: [],
    opportunities: [],
    house_movements: []
  };
  
  // Analyze rival houses for threats
  houses.filter(h => h.house_type === 'npc' && h.id !== playerHouseId).forEach(house => {
    const relation = house.player_house_relation || 0;
    const power = house.power_level || 50;
    
    if (relation < -30 && power > 60) {
      report.threats.push({
        house_name: house.house_name,
        threat_level: power > 80 ? 'critical' : 'high',
        reason: `Hostile house with ${power} power`,
        recommended_action: 'Consider sabotage or alliance building'
      });
    }
    
    if (relation > 30 && power < 40) {
      report.opportunities.push({
        house_name: house.house_name,
        opportunity: 'Potential absorption target',
        details: `Friendly but weak house - alliance or takeover possible`
      });
    }
    
    // House movements (if we have active spies)
    const spyOnHouse = activeSpies.find(op => op.target_house_id === house.id);
    if (spyOnHouse) {
      report.house_movements.push({
        house_name: house.house_name,
        intelligence: `Power: ${power}, Muscle: ${house.house_health?.muscle || 50}, Funds: ${house.house_health?.funds || 50}`,
        alliances: house.alliances?.length || 0,
        rivalries: house.rivalries?.length || 0
      });
    }
  });
  
  // Faction analysis
  factions.forEach(faction => {
    const relation = (gameState.faction_relations || {})[faction.faction_id] || 0;
    if (relation < -50) {
      report.threats.push({
        house_name: faction.name,
        threat_level: 'high',
        reason: `Hostile faction with significant power`,
        recommended_action: 'Repair relations or prepare for conflict'
      });
    }
  });
  
  return report;
}