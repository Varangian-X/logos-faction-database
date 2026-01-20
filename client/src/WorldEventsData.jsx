// Dynamic world events that impact the game state

export const worldEvents = {
  varangian_challenge: {
    id: 'varangian_challenge',
    name: 'Trial by Combat',
    description: 'The Varangians have issued a formal challenge to the Praetorians. The contest will determine military supremacy in the eyes of the Imperium.',
    duration: 5,
    trigger_conditions: {
      player_choice: true
    },
    effects: {
      immediate: { influence: 10 },
      perTurn: { reputation: 2 },
      onComplete: {
        faction_relations: { varangians: 15, praetorians: -10 }
      }
    }
  },
  military_alliance: {
    id: 'military_alliance',
    name: 'Uneasy Alliance',
    description: 'Against all odds, the Praetorians and Varangians have agreed to a joint military operation. This unprecedented cooperation could reshape Imperial power dynamics.',
    duration: 8,
    trigger_conditions: {
      player_choice: true
    },
    effects: {
      immediate: { influence: 20, reputation: 15 },
      perTurn: { credits: 100 },
      onComplete: {
        faction_relations: { varangians: 20, praetorians: 20 }
      }
    }
  },
  trade_crackdown: {
    id: 'trade_crackdown',
    name: 'Imperial Trade Investigation',
    description: 'The Praetorians have launched a crackdown on illegal trading operations. Merchant Houses scramble to cover their tracks.',
    duration: 6,
    trigger_conditions: {
      player_choice: true
    },
    effects: {
      immediate: { intel: 20 },
      perTurn: { credits: -50, influence: 3 },
      onComplete: {
        faction_relations: { merchant_houses: -20, praetorians: 15 }
      }
    }
  },
  intelligence_crackdown: {
    id: 'intelligence_crackdown',
    name: 'Shadow War Escalates',
    description: 'The Agentes in Rebus have launched operations against the Scrinium Barbarorum. Information warfare has never been more dangerous.',
    duration: 7,
    trigger_conditions: {
      player_choice: true
    },
    effects: {
      immediate: { intel: 30, reputation: -10 },
      perTurn: { influence: 5 },
      onComplete: {
        faction_relations: { agentes_in_rebus: 15, scrinium_barbarorum: -25 }
      }
    }
  },
  forbidden_expedition: {
    id: 'forbidden_expedition',
    name: 'Expedition to Dead Worlds',
    description: 'A dangerous expedition to ancient alien ruins has been mounted. The Ecclesiarchy has declared it heretical, but knowledge awaits.',
    duration: 10,
    trigger_conditions: {
      player_choice: true
    },
    effects: {
      immediate: { intel: 50, reputation: -20 },
      perTurn: { credits: -100, intel: 10 },
      onComplete: {
        faction_relations: { scrinium_barbarorum: 40, ecclesiarchy: -35 },
        credits: 1000,
        intel: 100
      }
    }
  },
  religious_schism: {
    id: 'religious_schism',
    name: 'Crisis of Faith',
    description: 'Questioning of Ecclesiarchy doctrine has sparked a religious crisis. The faithful demand orthodoxy while reformers call for change.',
    duration: 12,
    trigger_conditions: {
      player_choice: true
    },
    effects: {
      immediate: { influence: -10, reputation: -15 },
      perTurn: { faction_relations: { ecclesiarchy: -2, scrinium_barbarorum: 2 } },
      onComplete: {
        faction_relations: { ecclesiarchy: -30, scrinium_barbarorum: 20 }
      }
    }
  },
  economic_boom: {
    id: 'economic_boom',
    name: 'Trade Renaissance',
    description: 'Successful trade deals have sparked an economic boom. Credits flow freely, and opportunity abounds.',
    duration: 8,
    trigger_conditions: {
      player_choice: true
    },
    effects: {
      immediate: { credits: 500 },
      perTurn: { credits: 150, influence: 2 },
      onComplete: {
        faction_relations: { merchant_houses: 25 },
        credits: 1000
      }
    }
  },
  // Faction Wars
  praetorian_varangian_conflict: {
    id: 'praetorian_varangian_conflict',
    name: 'Praetorian-Varangian Border Clash',
    type: 'faction_war',
    description: 'Tensions explode into open conflict between the Neo-Praetorians and Varangian warriors. The Imperium trembles as chrome meets steel.',
    duration: 5,
    icon: 'swords',
    color: 'red',
    triggerConditions: {
      turn_min: 10,
      faction_praetorians_max: -20,
      faction_varangians_max: -20,
      random_chance: 0.15
    },
    effects: {
      immediate: {
        credits: -200,
        influence: -10,
        reputation: -5
      },
      perTurn: {
        credits: -50,
        combat_encounters_increased: true
      },
      onComplete: {
        credits: 300,
        influence: 15,
        unlock_mission: 'war_profiteer'
      }
    },
    impactedFactions: ['praetorians', 'varangians'],
    impactedLocations: ['new_roma', 'varangian_enclave', 'praetorian_fortress']
  },
  
  ecclesiarchy_purge: {
    id: 'ecclesiarchy_purge',
    name: 'The Great Purge',
    type: 'faction_war',
    description: 'The Ecclesiarchy declares a holy purge against heretical code. Data-flames burn across the network.',
    duration: 4,
    icon: 'flame',
    color: 'amber',
    triggerConditions: {
      turn_min: 15,
      faction_ecclesiarchy: 30,
      faction_scrinium_barbarorum_max: -10,
      random_chance: 0.12
    },
    effects: {
      immediate: {
        intel: -20,
        reputation: -10
      },
      perTurn: {
        faction_ecclesiarchy_drift: 5,
        faction_scrinium_barbarorum_drift: -10
      },
      onComplete: {
        reputation: 20,
        unlock_location: 'ecclesiarchy_cathedral'
      }
    },
    impactedFactions: ['ecclesiarchy', 'scrinium_barbarorum'],
    impactedLocations: ['ecclesiarchy_cathedral', 'shadow_archive']
  },
  
  // Economic Events
  merchant_boom: {
    id: 'merchant_boom',
    name: 'Trade Route Renaissance',
    type: 'economic_boom',
    description: 'New hyperlanes open, flooding the markets with exotic goods. Credits flow like digital rivers.',
    duration: 6,
    icon: 'trending-up',
    color: 'green',
    triggerConditions: {
      turn_min: 8,
      faction_merchant_houses: 15,
      credits_min: 500,
      random_chance: 0.18
    },
    effects: {
      immediate: {
        credits: 500,
        influence: 10
      },
      perTurn: {
        credits: 100,
        trade_prices_reduced: 30
      },
      onComplete: {
        credits: 1000,
        unlock_location: 'merchant_nexus'
      }
    },
    impactedFactions: ['merchant_houses'],
    impactedLocations: ['merchant_nexus', 'new_roma']
  },
  
  economic_collapse: {
    id: 'economic_collapse',
    name: 'Market Crash',
    type: 'economic_bust',
    description: 'A cascading failure in the Imperial credit network. Fortunes evaporate in nanoseconds.',
    duration: 4,
    icon: 'trending-down',
    color: 'red',
    triggerConditions: {
      turn_min: 12,
      credits_max: 300,
      reputation_max: 30,
      random_chance: 0.10
    },
    effects: {
      immediate: {
        credits: -400,
        influence: -15
      },
      perTurn: {
        credits: -50,
        trade_prices_increased: 50
      },
      onComplete: {
        influence: 20,
        unlock_mission: 'crisis_opportunity'
      }
    },
    impactedFactions: ['merchant_houses'],
    impactedLocations: ['merchant_nexus']
  },
  
  data_strike: {
    id: 'data_strike',
    name: 'Information Blackout',
    type: 'economic_bust',
    description: 'Coordinated cyberattacks cripple data-brokers across the Imperium. Intel becomes priceless.',
    duration: 3,
    icon: 'zap-off',
    color: 'violet',
    triggerConditions: {
      turn_min: 10,
      intel: 30,
      random_chance: 0.15
    },
    effects: {
      immediate: {
        intel: -15,
        credits: -200
      },
      perTurn: {
        intel_gain_halved: true
      },
      onComplete: {
        intel: 40,
        unlock_augmentation: 'neural_firewall'
      }
    },
    impactedFactions: ['agentes_in_rebus', 'scrinium_barbarorum'],
    impactedLocations: ['shadow_archive']
  },
  
  // Alien Incursions
  xeno_contact: {
    id: 'xeno_contact',
    name: 'First Contact Protocol',
    type: 'alien_incursion',
    description: 'Unknown signals from beyond known space. The Scrinium Barbarorum scrambles to respond.',
    duration: 5,
    icon: 'satellite',
    color: 'cyan',
    triggerConditions: {
      turn_min: 20,
      faction_scrinium_barbarorum: 20,
      discovered_locations_min: 5,
      random_chance: 0.12
    },
    effects: {
      immediate: {
        intel: 30,
        reputation: 10
      },
      perTurn: {
        intel: 10,
        xeno_encounters_enabled: true
      },
      onComplete: {
        reputation: 25,
        unlock_location: 'xeno_frontier',
        unlock_mission: 'xeno_diplomacy'
      }
    },
    impactedFactions: ['scrinium_barbarorum'],
    impactedLocations: ['xeno_frontier']
  },
  
  xeno_invasion: {
    id: 'xeno_invasion',
    name: 'The Outer Dark Invasion',
    type: 'alien_incursion',
    description: 'Alien warfleets emerge from the void! The Imperium mobilizes for total war.',
    duration: 7,
    icon: 'skull',
    color: 'red',
    triggerConditions: {
      turn_min: 30,
      reputation: 60,
      faction_praetorians: 25,
      random_chance: 0.08
    },
    effects: {
      immediate: {
        credits: -500,
        influence: 20
      },
      perTurn: {
        credits: -100,
        combat_encounters_doubled: true,
        all_factions_unity_bonus: 10
      },
      onComplete: {
        credits: 2000,
        reputation: 50,
        influence: 50,
        unlock_augmentation: 'xeno_adaptive_implants'
      }
    },
    impactedFactions: ['praetorians', 'varangians', 'scrinium_barbarorum'],
    impactedLocations: ['all']
  },
  
  // Technological Breakthroughs
  augmentation_revolution: {
    id: 'augmentation_revolution',
    name: 'Cybernetic Renaissance',
    type: 'tech_breakthrough',
    description: 'Breakthrough in neural integration! Augmentation technology leaps forward exponentially.',
    duration: 4,
    icon: 'cpu',
    color: 'purple',
    triggerConditions: {
      turn_min: 15,
      augmentations_min: 2,
      faction_merchant_houses: 15,
      random_chance: 0.15
    },
    effects: {
      immediate: {
        credits: -300,
        influence: 15
      },
      perTurn: {
        augmentation_prices_reduced: 40
      },
      onComplete: {
        unlock_augmentation: 'prototype_neural_core',
        reputation: 15
      }
    },
    impactedFactions: ['merchant_houses'],
    impactedLocations: ['new_roma', 'praetorian_fortress']
  },
  
  data_renaissance: {
    id: 'data_renaissance',
    name: 'The Archive Awakening',
    type: 'tech_breakthrough',
    description: 'Ancient data-vaults unlock their secrets. Lost knowledge floods the network.',
    duration: 5,
    icon: 'book-open',
    color: 'amber',
    triggerConditions: {
      turn_min: 18,
      intel: 40,
      trait_insight_min: 6,
      random_chance: 0.14
    },
    effects: {
      immediate: {
        intel: 50,
        influence: 20
      },
      perTurn: {
        skill_xp_doubled: true
      },
      onComplete: {
        all_skills_level_up: true,
        unlock_location: 'forbidden_sector'
      }
    },
    impactedFactions: ['ecclesiarchy', 'scrinium_barbarorum'],
    impactedLocations: ['deep_cisterns', 'shadow_archive', 'forbidden_sector']
  },
  
  void_gate_activation: {
    id: 'void_gate_activation',
    name: 'Gate to Infinity',
    type: 'tech_breakthrough',
    description: 'The ancient Void Gate pulses with power. Reality itself begins to fracture...',
    duration: 3,
    icon: 'portal',
    color: 'violet',
    triggerConditions: {
      turn_min: 40,
      reputation: 80,
      intel: 70,
      discovered_void_gate: true,
      random_chance: 0.10
    },
    effects: {
      immediate: {
        influence: 50,
        reputation: 30
      },
      perTurn: {
        reality_distortions: true
      },
      onComplete: {
        game_ending_unlock: 'transcendence',
        credits: 5000,
        reputation: 100
      }
    },
    impactedFactions: ['all'],
    impactedLocations: ['void_gate']
  }
};

export function checkEventTrigger(event, gameState) {
  const conditions = event.triggerConditions;
  
  // Check if already active or completed
  const activeEvents = gameState.active_world_events || [];
  const completedEvents = gameState.completed_world_events || [];
  if (activeEvents.some(e => e.id === event.id) || completedEvents.includes(event.id)) {
    return false;
  }
  
  // Check turn minimum
  if (conditions.turn_min && gameState.turn_number < conditions.turn_min) return false;
  
  // Check reputation
  if (conditions.reputation && gameState.reputation < conditions.reputation) return false;
  if (conditions.reputation_max && gameState.reputation > conditions.reputation_max) return false;
  
  // Check credits
  if (conditions.credits_min && gameState.credits < conditions.credits_min) return false;
  if (conditions.credits_max && gameState.credits > conditions.credits_max) return false;
  
  // Check intel
  if (conditions.intel && gameState.intel < conditions.intel) return false;
  
  // Check augmentations
  if (conditions.augmentations_min && (gameState.augmentations?.length || 0) < conditions.augmentations_min) return false;
  
  // Check traits
  if (conditions.trait_insight_min && (gameState.character_traits?.insight || 3) < conditions.trait_insight_min) return false;
  if (conditions.trait_reach_min && (gameState.character_traits?.reach || 3) < conditions.trait_reach_min) return false;
  if (conditions.trait_grasp_min && (gameState.character_traits?.grasp || 3) < conditions.trait_grasp_min) return false;
  
  // Check faction standings
  Object.keys(conditions).forEach(key => {
    if (key.startsWith('faction_') && !key.endsWith('_max') && !key.endsWith('_min')) {
      const factionKey = key.replace('faction_', '');
      const standing = gameState.faction_relations?.[factionKey] || 0;
      if (standing < conditions[key]) return false;
    }
    if (key.endsWith('_max')) {
      const factionKey = key.replace('faction_', '').replace('_max', '');
      const standing = gameState.faction_relations?.[factionKey] || 0;
      if (standing > conditions[key]) return false;
    }
  });
  
  // Check discovered locations
  if (conditions.discovered_locations_min && (gameState.discovered_locations?.length || 1) < conditions.discovered_locations_min) return false;
  if (conditions.discovered_void_gate && !(gameState.discovered_locations || []).includes('void_gate')) return false;
  
  // Random chance
  if (conditions.random_chance && Math.random() > conditions.random_chance) return false;
  
  return true;
}

export function getActiveEvents(gameState) {
  return (gameState.active_world_events || []).map(activeEvent => {
    const eventData = worldEvents[activeEvent.id];
    return {
      ...eventData,
      ...activeEvent
    };
  });
}

export function applyEventEffects(event, gameState, type = 'immediate') {
  const effects = event.effects[type];
  if (!effects) return {};
  
  const updates = {};
  
  // Apply resource changes
  if (effects.credits) updates.credits = (gameState.credits || 0) + effects.credits;
  if (effects.influence) updates.influence = (gameState.influence || 0) + effects.influence;
  if (effects.intel) updates.intel = (gameState.intel || 0) + effects.intel;
  if (effects.reputation) updates.reputation = Math.max(0, Math.min(100, (gameState.reputation || 50) + effects.reputation));
  
  // Apply faction changes
  if (effects.faction_ecclesiarchy_drift || effects.faction_praetorians_drift || effects.faction_varangians_drift ||
      effects.faction_merchant_houses_drift || effects.faction_agentes_in_rebus_drift || effects.faction_scrinium_barbarorum_drift ||
      effects.all_factions_unity_bonus) {
    const factionRelations = { ...(gameState.faction_relations || {}) };
    
    Object.keys(effects).forEach(key => {
      if (key.endsWith('_drift')) {
        const factionKey = key.replace('faction_', '').replace('_drift', '');
        factionRelations[factionKey] = Math.max(-100, Math.min(100, (factionRelations[factionKey] || 0) + effects[key]));
      }
    });
    
    if (effects.all_factions_unity_bonus) {
      Object.keys(factionRelations).forEach(faction => {
        factionRelations[faction] = Math.max(-100, Math.min(100, factionRelations[faction] + effects.all_factions_unity_bonus));
      });
    }
    
    updates.faction_relations = factionRelations;
  }
  
  return updates;
}