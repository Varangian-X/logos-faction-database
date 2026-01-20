// World State Tracker - Cumulative impact tracking and world-state changes

export function initializeWorldState() {
  return {
    faction_power_levels: {
      ecclesiarchy: 50,
      praetorians: 50,
      varangians: 50,
      merchant_houses: 50,
      agentes_in_rebus: 50,
      scrinium_barbarorum: 50
    },
    faction_tensions: {
      // Tracks tension between faction pairs (0-100)
      praetorians_varangians: 40,
      ecclesiarchy_scrinium: 60,
      merchant_agentes: 30
    },
    territory_control: {
      // Tracks which faction controls which areas
      chrysopolis: 'ecclesiarchy',
      lower_districts: 'contested',
      trade_sector: 'merchant_houses',
      rim_stations: 'varangians'
    },
    world_stability: 75, // 0-100, affects random event frequency
    player_influence_score: 0, // Cumulative impact tracker
    companion_collective_influence: 0,
    major_events_completed: [],
    faction_wars_active: [],
    economic_state: 'stable' // 'recession', 'stable', 'boom'
  };
}

// Update world state based on player action
export function updateWorldState(worldState, action) {
  const updated = { ...worldState };
  
  // Track player influence
  if (action.reputation_change) {
    updated.player_influence_score += Math.abs(action.reputation_change);
  }
  
  // Faction power shifts
  if (action.faction_impact) {
    Object.entries(action.faction_impact).forEach(([faction, change]) => {
      updated.faction_power_levels[faction] = Math.max(0, Math.min(100,
        (updated.faction_power_levels[faction] || 50) + Math.floor(change / 2)
      ));
    });
  }
  
  // Faction tension changes
  if (action.faction_impact && Object.keys(action.faction_impact).length >= 2) {
    const [faction1, faction2] = Object.keys(action.faction_impact).slice(0, 2);
    const tensionKey = `${faction1}_${faction2}`;
    
    if (updated.faction_tensions[tensionKey] !== undefined) {
      // Opposing changes increase tension
      const change1 = action.faction_impact[faction1];
      const change2 = action.faction_impact[faction2];
      
      if ((change1 > 0 && change2 < 0) || (change1 < 0 && change2 > 0)) {
        updated.faction_tensions[tensionKey] += 5;
      }
    }
  }
  
  // World stability impacts
  if (action.triggers_conflict) {
    updated.world_stability = Math.max(0, updated.world_stability - 10);
  }
  
  if (action.promotes_peace) {
    updated.world_stability = Math.min(100, updated.world_stability + 5);
  }
  
  return updated;
}

// Check for world-state triggered events
export function checkWorldStateEvents(worldState, gameState) {
  const events = [];
  
  // Faction war trigger
  Object.entries(worldState.faction_tensions).forEach(([key, tension]) => {
    if (tension >= 80 && !worldState.faction_wars_active.includes(key)) {
      events.push({
        type: 'faction_war',
        id: `war_${key}`,
        name: `Faction War: ${key.replace('_', ' vs ')}`,
        description: 'Open warfare has erupted between factions'
      });
    }
  });
  
  // Economic crisis trigger
  const avgPower = Object.values(worldState.faction_power_levels).reduce((a, b) => a + b, 0) / 6;
  if (avgPower < 30 && worldState.economic_state !== 'recession') {
    events.push({
      type: 'economic_crisis',
      id: 'economic_collapse',
      name: 'Imperial Economic Collapse',
      description: 'The economic foundations of the Imperium crumble'
    });
  }
  
  // Low stability chaos
  if (worldState.world_stability < 25) {
    events.push({
      type: 'chaos',
      id: 'empire_in_chaos',
      name: 'The Empire Burns',
      description: 'Civilization teeters on the brink of total collapse'
    });
  }
  
  // High influence ascension
  if (worldState.player_influence_score > 500 && gameState.reputation >= 80) {
    events.push({
      type: 'ascension_opportunity',
      id: 'rise_to_power',
      name: 'Claim Your Throne',
      description: 'Your influence has grown immense. The throne beckons...'
    });
  }
  
  return events;
}

// Apply world state effects per turn
export function applyWorldStateEffects(worldState, gameState) {
  const effects = {
    credits_modifier: 1.0,
    random_event_chance_modifier: 1.0,
    faction_mission_availability: {}
  };
  
  // Economic state impacts
  if (worldState.economic_state === 'boom') {
    effects.credits_modifier = 1.5;
  } else if (worldState.economic_state === 'recession') {
    effects.credits_modifier = 0.5;
  }
  
  // Low stability increases random events
  if (worldState.world_stability < 50) {
    effects.random_event_chance_modifier = 1.5;
  }
  
  // Active faction wars
  worldState.faction_wars_active.forEach(war => {
    const [faction1, faction2] = war.split('_');
    effects.faction_mission_availability[faction1] = false;
    effects.faction_mission_availability[faction2] = false;
  });
  
  return effects;
}

// Calculate territory shifts
export function updateTerritoryControl(worldState) {
  const updated = { ...worldState };
  
  Object.entries(updated.territory_control).forEach(([territory, controller]) => {
    if (controller === 'contested') {
      // Random chance for faction to claim
      const factions = Object.keys(updated.faction_power_levels);
      const strongest = factions.reduce((max, faction) => 
        updated.faction_power_levels[faction] > updated.faction_power_levels[max] ? faction : max
      );
      
      if (updated.faction_power_levels[strongest] > 70) {
        updated.territory_control[territory] = strongest;
      }
    } else {
      // Check if current controller is weak
      if (updated.faction_power_levels[controller] < 30) {
        updated.territory_control[territory] = 'contested';
      }
    }
  });
  
  return updated;
}