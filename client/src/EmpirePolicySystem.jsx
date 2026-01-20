// Empire-wide Policy System

export const EMPIRE_POLICIES = {
  // Economic Policies
  free_market: {
    id: 'free_market',
    name: 'Free Market Economy',
    category: 'economic',
    description: 'Reduces regulations, boosting trade and credit generation',
    effects: {
      credits_modifier: 25,
      trade_income: 30,
      stability: -5
    },
    cost_per_turn: 200,
    conflicts_with: ['planned_economy']
  },
  
  planned_economy: {
    id: 'planned_economy',
    name: 'Planned Economy',
    category: 'economic',
    description: 'Centralized economic control increasing production efficiency',
    effects: {
      production_modifier: 20,
      food_production: 15,
      happiness: -10
    },
    cost_per_turn: 150,
    conflicts_with: ['free_market']
  },
  
  research_grants: {
    id: 'research_grants',
    name: 'Research Grants Program',
    category: 'scientific',
    description: 'Massive investment in research and development',
    effects: {
      research_modifier: 35,
      tech_progress: 25
    },
    cost_per_turn: 500,
    conflicts_with: []
  },
  
  // Military Policies
  martial_law: {
    id: 'martial_law',
    name: 'Martial Law',
    category: 'military',
    description: 'Military rule ensuring order but crushing freedoms',
    effects: {
      stability: 25,
      defense_rating: 20,
      happiness: -25,
      unrest_suppression: 50
    },
    cost_per_turn: 300,
    conflicts_with: ['freedom_doctrine']
  },
  
  militarization: {
    id: 'militarization',
    name: 'Total Militarization',
    category: 'military',
    description: 'Society focused on military might',
    effects: {
      fleet_capacity: 30,
      ship_production_speed: 25,
      crew_quality: 15,
      credits_modifier: -15
    },
    cost_per_turn: 400,
    conflicts_with: ['pacifism']
  },
  
  // Social Policies
  welfare_state: {
    id: 'welfare_state',
    name: 'Welfare State',
    category: 'social',
    description: 'Strong social safety net ensuring citizen well-being',
    effects: {
      happiness: 20,
      population_growth: 15,
      credits_modifier: -20
    },
    cost_per_turn: 350,
    conflicts_with: ['austerity']
  },
  
  freedom_doctrine: {
    id: 'freedom_doctrine',
    name: 'Freedom Doctrine',
    category: 'social',
    description: 'Maximum personal freedoms for all citizens',
    effects: {
      happiness: 15,
      research_modifier: 10,
      stability: -15
    },
    cost_per_turn: 100,
    conflicts_with: ['martial_law', 'thought_control']
  },
  
  population_focus: {
    id: 'population_focus',
    name: 'Population Growth Initiative',
    category: 'social',
    description: 'Incentives for rapid population expansion',
    effects: {
      population_growth: 50,
      colonization_cost_reduction: 25,
      credits_modifier: -10
    },
    cost_per_turn: 250,
    conflicts_with: []
  },
  
  // Expansion Policies
  manifest_destiny: {
    id: 'manifest_destiny',
    name: 'Manifest Destiny',
    category: 'expansion',
    description: 'Aggressive expansion across the galaxy',
    effects: {
      colonization_speed: 40,
      influence_gain: 30,
      diplomatic_penalty: -20
    },
    cost_per_turn: 300,
    conflicts_with: ['isolationism']
  },
  
  diplomatic_corps: {
    id: 'diplomatic_corps',
    name: 'Enhanced Diplomatic Corps',
    category: 'expansion',
    description: 'Skilled diplomats improving relations',
    effects: {
      influence_gain: 40,
      faction_relations_bonus: 15,
      trade_income: 20
    },
    cost_per_turn: 200,
    conflicts_with: []
  },
  
  // Specialized Policies
  meritocracy: {
    id: 'meritocracy',
    name: 'Meritocratic Society',
    category: 'governance',
    description: 'Rewards competence and achievement',
    effects: {
      research_modifier: 15,
      production_modifier: 15,
      crew_quality: 20,
      happiness: 5
    },
    cost_per_turn: 250,
    conflicts_with: []
  },
  
  thought_control: {
    id: 'thought_control',
    name: 'Thought Control',
    category: 'governance',
    description: 'Dystopian control through propaganda and surveillance',
    effects: {
      stability: 40,
      unrest_suppression: 100,
      happiness: -30,
      research_modifier: -20
    },
    cost_per_turn: 400,
    conflicts_with: ['freedom_doctrine']
  },
  
  // Advanced Diplomatic Policies
  cultural_exchange: {
    id: 'cultural_exchange',
    name: 'Cultural Exchange Program',
    category: 'diplomatic',
    description: 'Foster cultural ties through art, science, and trade exchanges',
    effects: {
      faction_relations_all: 10,
      influence_gain: 25,
      happiness: 10,
      trade_income: 15
    },
    diplomatic_effects: {
      improves_relations_with: ['ecclesiarchy', 'merchant_houses', 'scrinium_barbarorum'],
      relation_boost_per_turn: 2
    },
    cost_per_turn: 300,
    conflicts_with: ['isolationism']
  },
  
  non_aggression_initiative: {
    id: 'non_aggression_initiative',
    name: 'Non-Aggression Initiative',
    category: 'diplomatic',
    description: 'Peaceful coexistence through diplomatic channels',
    effects: {
      faction_relations_all: 15,
      stability: 10,
      fleet_capacity: -20
    },
    diplomatic_effects: {
      prevents_war_declarations: true,
      reduces_threat_level: 50
    },
    cost_per_turn: 250,
    conflicts_with: ['manifest_destiny', 'militarization']
  },
  
  espionage_network: {
    id: 'espionage_network',
    name: 'Imperial Espionage Network',
    category: 'diplomatic',
    description: 'Extensive spy network gathering intelligence on all factions',
    effects: {
      intel_gain_per_turn: 15,
      faction_relations_all: -10,
      intrigue_success_rate: 25
    },
    diplomatic_effects: {
      reveals_faction_operations: true,
      counter_espionage_bonus: 30
    },
    cost_per_turn: 400,
    conflicts_with: ['non_aggression_initiative']
  },
  
  // Terraforming & Colonization Policies
  terraforming_initiative: {
    id: 'terraforming_initiative',
    name: 'Terraforming Initiative',
    category: 'expansion',
    description: 'Advanced technology to reshape hostile worlds',
    effects: {
      colonization_speed: 50,
      planet_development_speed: 40,
      credits_modifier: -25
    },
    terraforming_effects: {
      enables_hostile_colonization: true,
      reduces_harsh_penalties: 50,
      unlock_structures: ['atmospheric_processor', 'climate_regulator']
    },
    cost_per_turn: 600,
    requires_tech: 'advanced_terraforming',
    conflicts_with: []
  },
  
  rapid_colonization: {
    id: 'rapid_colonization',
    name: 'Rapid Colonization Doctrine',
    category: 'expansion',
    description: 'Streamlined processes for establishing new colonies',
    effects: {
      colonization_cost_reduction: 50,
      colonization_speed: 75,
      colony_stability: -20,
      population_growth: 30
    },
    terraforming_effects: {
      instant_basic_infrastructure: true,
      starting_population_bonus: 50
    },
    cost_per_turn: 400,
    conflicts_with: ['isolationism']
  },
  
  // Research & Technology Policies
  scientific_renaissance: {
    id: 'scientific_renaissance',
    name: 'Scientific Renaissance',
    category: 'scientific',
    description: 'Golden age of scientific discovery and innovation',
    effects: {
      research_modifier: 50,
      tech_progress: 40,
      happiness: 15,
      credits_modifier: -30
    },
    research_effects: {
      unlocks_projects: ['perpetual_motion_study', 'quantum_entanglement_research', 'void_gate_analysis'],
      reduces_research_time: 25,
      breakthrough_chance: 30
    },
    cost_per_turn: 700,
    conflicts_with: ['austerity', 'anti_intellectualism']
  },
  
  military_research_focus: {
    id: 'military_research_focus',
    name: 'Military Research Focus',
    category: 'scientific',
    description: 'Channel all research into weapons and defenses',
    effects: {
      research_modifier: 20,
      fleet_capacity: 20,
      ship_production_speed: 30
    },
    research_effects: {
      unlocks_projects: ['plasma_weapons_mk2', 'adaptive_shielding', 'torpedo_systems'],
      civilian_tech_penalty: -40
    },
    cost_per_turn: 500,
    conflicts_with: ['pacifism']
  },
  
  xeno_archaeology_program: {
    id: 'xeno_archaeology_program',
    name: 'Xeno-Archaeology Program',
    category: 'scientific',
    description: 'Study ancient alien ruins for lost knowledge',
    effects: {
      research_modifier: 25,
      discovery_chance: 40,
      faction_scrinium_relations: 20
    },
    research_effects: {
      unlocks_projects: ['ancient_precursor_study', 'alien_artifact_reverse_engineering'],
      enables_ruin_expeditions: true,
      artifact_discovery_rate: 50
    },
    cost_per_turn: 450,
    conflicts_with: []
  },
  
  // Economic & Trade Policies
  trade_monopoly: {
    id: 'trade_monopoly',
    name: 'Imperial Trade Monopoly',
    category: 'economic',
    description: 'Control all major trade routes and commercial activity',
    effects: {
      credits_modifier: 50,
      trade_income: 60,
      faction_merchant_relations: -30,
      faction_relations_all: -10
    },
    diplomatic_effects: {
      blocks_competitor_trade: true,
      enables_trade_embargoes: true
    },
    cost_per_turn: 500,
    conflicts_with: ['free_market']
  },
  
  resource_stockpiling: {
    id: 'resource_stockpiling',
    name: 'Resource Stockpiling',
    category: 'economic',
    description: 'Strategic reserves of critical resources',
    effects: {
      production_modifier: -15,
      resource_capacity: 100,
      supply_resilience: 50
    },
    special_effects: {
      enables_emergency_reserves: true,
      crisis_mitigation: 40
    },
    cost_per_turn: 300,
    conflicts_with: []
  },
  
  // Isolationist Policies
  isolationism: {
    id: 'isolationism',
    name: 'Imperial Isolationism',
    category: 'diplomatic',
    description: 'Withdraw from galactic affairs, focus inward',
    effects: {
      faction_relations_all: -20,
      stability: 30,
      production_modifier: 20,
      influence_gain: -50
    },
    diplomatic_effects: {
      prevents_diplomatic_missions: true,
      reduces_external_threats: 60
    },
    cost_per_turn: 200,
    conflicts_with: ['manifest_destiny', 'diplomatic_corps', 'cultural_exchange']
  },
  
  // Advanced Military Policies
  fleet_modernization: {
    id: 'fleet_modernization',
    name: 'Fleet Modernization Program',
    category: 'military',
    description: 'Upgrade and retrofit entire fleet with cutting-edge technology',
    effects: {
      ship_production_speed: 40,
      crew_quality: 30,
      fleet_effectiveness: 35,
      credits_modifier: -40
    },
    research_effects: {
      unlocks_projects: ['advanced_ship_chassis', 'experimental_propulsion'],
      retrofit_cost_reduction: 40
    },
    cost_per_turn: 800,
    conflicts_with: ['pacifism']
  },
  
  pacifism: {
    id: 'pacifism',
    name: 'Doctrine of Peace',
    category: 'military',
    description: 'Reject militarism, focus on defensive capabilities only',
    effects: {
      faction_relations_all: 25,
      happiness: 20,
      fleet_capacity: -50,
      defense_rating: 30,
      credits_modifier: 30
    },
    diplomatic_effects: {
      prevents_aggressive_actions: true,
      diplomatic_bonus: 40
    },
    cost_per_turn: 150,
    conflicts_with: ['militarization', 'manifest_destiny', 'fleet_modernization', 'military_research_focus']
  },
  
  // Unique Strategic Policies
  imperial_cult: {
    id: 'imperial_cult',
    name: 'Imperial Cult',
    category: 'governance',
    description: 'Deify the ruler to ensure absolute loyalty',
    effects: {
      stability: 35,
      faction_ecclesiarchy_relations: 30,
      happiness: -15,
      unrest_suppression: 60
    },
    special_effects: {
      enables_fanatical_loyalty: true,
      prevents_coup_attempts: true
    },
    cost_per_turn: 400,
    conflicts_with: ['freedom_doctrine']
  },
  
  decentralization: {
    id: 'decentralization',
    name: 'Administrative Decentralization',
    category: 'governance',
    description: 'Grant colonies significant autonomy',
    effects: {
      happiness: 25,
      stability: -10,
      colonization_speed: 30,
      credits_modifier: -10
    },
    special_effects: {
      colony_independence: 20,
      reduces_micromanagement: true
    },
    cost_per_turn: 200,
    conflicts_with: ['thought_control', 'imperial_cult']
  }
};

export function initializeEmpirePolicies(gameState) {
  gameState.empire_policies = {
    active_policies: [],
    available_influence: 0,
    policy_slots: 3 // Can be expanded
  };
  
  return gameState;
}

export function canEnactPolicy(policyId, gameState) {
  const policy = EMPIRE_POLICIES[policyId];
  if (!policy) return { can_enact: false, reason: 'Invalid policy' };
  
  const empirePolicies = gameState.empire_policies;
  
  // Check if already active
  if (empirePolicies.active_policies.includes(policyId)) {
    return { can_enact: false, reason: 'Policy already active' };
  }
  
  // Check policy slots
  if (empirePolicies.active_policies.length >= empirePolicies.policy_slots) {
    return { can_enact: false, reason: 'No available policy slots' };
  }
  
  // Check conflicts
  const hasConflict = policy.conflicts_with.some(conflictId => 
    empirePolicies.active_policies.includes(conflictId)
  );
  
  if (hasConflict) {
    return { can_enact: false, reason: 'Conflicts with active policy' };
  }
  
  return { can_enact: true };
}

export function enactPolicy(policyId, gameState) {
  const check = canEnactPolicy(policyId, gameState);
  if (!check.can_enact) {
    return { success: false, message: check.reason };
  }
  
  gameState.empire_policies.active_policies.push(policyId);
  
  return { 
    success: true, 
    message: `${EMPIRE_POLICIES[policyId].name} enacted`,
    policy: EMPIRE_POLICIES[policyId]
  };
}

export function repealPolicy(policyId, gameState) {
  const index = gameState.empire_policies.active_policies.indexOf(policyId);
  if (index === -1) {
    return { success: false, message: 'Policy not active' };
  }
  
  gameState.empire_policies.active_policies.splice(index, 1);
  
  return { 
    success: true, 
    message: `${EMPIRE_POLICIES[policyId].name} repealed` 
  };
}

export function calculatePolicyEffects(gameState) {
  const effects = {
    credits_modifier: 0,
    production_modifier: 0,
    research_modifier: 0,
    happiness: 0,
    stability: 0,
    population_growth: 0,
    fleet_capacity: 0,
    influence_gain: 0,
    total_upkeep: 0
  };
  
  gameState.empire_policies.active_policies.forEach(policyId => {
    const policy = EMPIRE_POLICIES[policyId];
    
    Object.keys(policy.effects).forEach(key => {
      if (effects[key] !== undefined) {
        effects[key] += policy.effects[key];
      }
    });
    
    effects.total_upkeep += policy.cost_per_turn;
  });
  
  return effects;
}

export function applyPolicyEffectsToEmpire(gameState, colonies) {
  const policyEffects = calculatePolicyEffects(gameState);
  
  // Initialize advanced tracking
  const advancedEffects = {
    diplomatic_changes: [],
    unlocked_projects: [],
    unlocked_structures: [],
    special_abilities: []
  };
  
  // Process active policies for advanced effects
  gameState.empire_policies.active_policies.forEach(policyId => {
    const policy = EMPIRE_POLICIES[policyId];
    
    // Diplomatic effects
    if (policy.diplomatic_effects) {
      if (policy.diplomatic_effects.improves_relations_with) {
        policy.diplomatic_effects.improves_relations_with.forEach(faction => {
          const boost = policy.diplomatic_effects.relation_boost_per_turn || 1;
          gameState.faction_relations = gameState.faction_relations || {};
          gameState.faction_relations[faction] = (gameState.faction_relations[faction] || 0) + boost;
          advancedEffects.diplomatic_changes.push({
            faction,
            change: boost,
            reason: policy.name
          });
        });
      }
      
      if (policy.diplomatic_effects.prevents_war_declarations) {
        gameState.can_declare_war = false;
      }
      
      if (policy.diplomatic_effects.reduces_threat_level) {
        gameState.threat_level_modifier = (gameState.threat_level_modifier || 0) - 
          policy.diplomatic_effects.reduces_threat_level;
      }
      
      if (policy.diplomatic_effects.reveals_faction_operations) {
        gameState.can_see_faction_operations = true;
      }
    }
    
    // Terraforming effects
    if (policy.terraforming_effects) {
      if (policy.terraforming_effects.enables_hostile_colonization) {
        gameState.can_colonize_hostile = true;
      }
      
      if (policy.terraforming_effects.unlock_structures) {
        policy.terraforming_effects.unlock_structures.forEach(structure => {
          if (!advancedEffects.unlocked_structures.includes(structure)) {
            advancedEffects.unlocked_structures.push(structure);
          }
        });
      }
      
      if (policy.terraforming_effects.instant_basic_infrastructure) {
        gameState.instant_colony_infrastructure = true;
      }
    }
    
    // Research effects
    if (policy.research_effects) {
      if (policy.research_effects.unlocks_projects) {
        policy.research_effects.unlocks_projects.forEach(project => {
          if (!advancedEffects.unlocked_projects.includes(project)) {
            advancedEffects.unlocked_projects.push(project);
          }
        });
      }
      
      if (policy.research_effects.breakthrough_chance) {
        gameState.research_breakthrough_chance = 
          (gameState.research_breakthrough_chance || 0) + 
          policy.research_effects.breakthrough_chance;
      }
      
      if (policy.research_effects.enables_ruin_expeditions) {
        gameState.can_explore_ruins = true;
      }
    }
    
    // Special effects
    if (policy.special_effects) {
      Object.keys(policy.special_effects).forEach(effect => {
        advancedEffects.special_abilities.push({
          name: effect,
          value: policy.special_effects[effect],
          source: policy.name
        });
      });
    }
  });
  
  // Apply to each colony
  colonies.forEach(colony => {
    // Happiness
    colony.population.happiness = (colony.population.happiness || 0) + policyEffects.happiness;
    
    // Stability
    colony.stability = (colony.stability || 0) + policyEffects.stability;
    
    // Production modifiers
    colony.resources = colony.resources || {};
    colony.resources.production = colony.resources.production || { output: 0 };
    colony.resources.research = colony.resources.research || { output: 0 };
    colony.resources.credits_income = colony.resources.credits_income || 0;
    
    colony.resources.production.output *= (1 + policyEffects.production_modifier / 100);
    colony.resources.research.output *= (1 + policyEffects.research_modifier / 100);
    colony.resources.credits_income *= (1 + policyEffects.credits_modifier / 100);
    
    // Population growth
    colony.population.growth_rate = (colony.population.growth_rate || 1) * 
      (1 + policyEffects.population_growth / 100);
    
    // Apply unlocked structures to colony
    if (advancedEffects.unlocked_structures.length > 0) {
      colony.available_structures = colony.available_structures || [];
      advancedEffects.unlocked_structures.forEach(structure => {
        if (!colony.available_structures.includes(structure)) {
          colony.available_structures.push(structure);
        }
      });
    }
  });
  
  // Apply empire-wide effects
  gameState.credits -= policyEffects.total_upkeep;
  
  // Apply influence gain
  if (policyEffects.influence_gain) {
    gameState.influence = (gameState.influence || 0) + (policyEffects.influence_gain / 10);
  }
  
  // Apply intel gain
  gameState.empire_policies.active_policies.forEach(policyId => {
    const policy = EMPIRE_POLICIES[policyId];
    if (policy.effects.intel_gain_per_turn) {
      gameState.intel = (gameState.intel || 0) + policy.effects.intel_gain_per_turn;
    }
  });
  
  // Apply faction relations modifiers
  if (policyEffects.faction_relations_all) {
    Object.keys(gameState.faction_relations || {}).forEach(faction => {
      gameState.faction_relations[faction] += policyEffects.faction_relations_all;
    });
  }
  
  // Store unlocked projects
  gameState.unlocked_research_projects = gameState.unlocked_research_projects || [];
  advancedEffects.unlocked_projects.forEach(project => {
    if (!gameState.unlocked_research_projects.includes(project)) {
      gameState.unlocked_research_projects.push(project);
    }
  });
  
  return {
    ...policyEffects,
    advanced: advancedEffects
  };
}