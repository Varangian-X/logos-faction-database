// Dynamic Faction AI System
// Factions act autonomously based on their strategic priorities

export function processFactionTurn(faction, allFactions, gameState, worldState) {
  const actions = [];
  const updates = { ...faction };
  
  // Initialize long-term goals if not exists
  if (!updates.long_term_goals) {
    updates.long_term_goals = initializeFactionGoals(faction);
  }
  
  // Progress goals
  const goalProgress = progressLongTermGoals(updates, allFactions, gameState, worldState);
  actions.push(...goalProgress.actions);
  updates.long_term_goals = goalProgress.updated_goals;
  
  // Update morale based on power and resources
  updates.morale = calculateMorale(faction, gameState);
  
  // Determine strategic focus based on state and goals
  updates.strategic_focus = determineStrategicFocus(faction, allFactions, worldState);
  
  // Execute operations
  const operationResults = processActiveOperations(faction, allFactions, gameState);
  actions.push(...operationResults.actions);
  updates.active_operations = operationResults.updated_operations;
  updates.resources = faction.resources + operationResults.resource_change;
  updates.power_level = Math.max(0, Math.min(100, faction.power_level + operationResults.power_change));
  
  // Process espionage and counter-intelligence
  const espionageResults = processFactionEspionage(faction, allFactions, gameState);
  actions.push(...espionageResults.actions);
  if (espionageResults.operation) {
    updates.active_operations = [...(updates.active_operations || []), espionageResults.operation];
  }
  
  // Sophisticated diplomatic decisions
  const diplomacyResult = processSophisticatedDiplomacy(faction, allFactions, gameState, worldState);
  if (diplomacyResult) {
    actions.push(diplomacyResult.action);
    if (diplomacyResult.diplomatic_action) {
      updates.diplomatic_actions = [...(updates.diplomatic_actions || []), diplomacyResult.diplomatic_action];
    }
    if (diplomacyResult.alliance_formed) {
      updates.alliances = [...(updates.alliances || []), diplomacyResult.alliance_formed];
    }
    if (diplomacyResult.rivalry_declared) {
      updates.rivalries = [...(updates.rivalries || []), diplomacyResult.rivalry_declared];
    }
  }
  
  // Make strategic decisions aligned with goals
  const decision = makeStrategicDecision(faction, allFactions, gameState, worldState);
  if (decision) {
    actions.push(decision.action);
    
    if (decision.type === 'launch_operation') {
      updates.active_operations = [...(updates.active_operations || []), decision.operation];
    } else if (decision.type === 'diplomatic_action') {
      updates.diplomatic_actions = [...(updates.diplomatic_actions || []), decision.diplomatic];
    } else if (decision.type === 'declare_war') {
      updates.rivalries = [...(updates.rivalries || []), decision.target];
      updates.alliances = (updates.alliances || []).filter(a => a !== decision.target);
    } else if (decision.type === 'form_alliance') {
      updates.alliances = [...(updates.alliances || []), decision.target];
      updates.rivalries = (updates.rivalries || []).filter(r => r !== decision.target);
    }
  }
  
  // React to player threat level
  const threatResponse = assessPlayerThreat(faction, gameState, allFactions);
  if (threatResponse) {
    actions.push(...threatResponse.actions);
    updates.player_threat_level = threatResponse.new_threat_level;
    if (threatResponse.counter_operation) {
      updates.active_operations = [...(updates.active_operations || []), threatResponse.counter_operation];
    }
  }
  
  return { updates, actions };
}

// Initialize faction-specific long-term goals
function initializeFactionGoals(faction) {
  const goalsByFaction = {
    ecclesiarchy: [
      { 
        id: 'divine_mandate', 
        name: 'Divine Mandate', 
        description: 'Spread Logos doctrine across all factions',
        type: 'cultural_dominance',
        subtype: 'religious',
        progress: 0, 
        target: 100,
        priority: 'critical',
        dynamic: true,
        actions: ['convert_faction', 'theological_propaganda', 'holy_sites'],
        conflicts_with: ['secular_society', 'technological_ascension'],
        synergizes_with: ['control', 'influence']
      },
      {
        id: 'sacred_technology',
        name: 'Sacred Technology',
        description: 'Merge divine doctrine with technological advancement',
        type: 'technological',
        subtype: 'theocratic_tech',
        progress: 0,
        target: 60,
        priority: 'medium',
        dynamic: true,
        actions: ['research_holy_tech', 'sanctify_machines', 'divine_algorithms']
      },
      {
        id: 'purge_heresy',
        name: 'Purge Heresy',
        description: 'Eliminate factions that oppose the Logos',
        type: 'warfare',
        subtype: 'ideological',
        progress: 0,
        target: 3,
        priority: 'high',
        dynamic: false,
        actions: ['crusade', 'excommunication', 'inquisition']
      }
    ],
    praetorians: [
      {
        id: 'military_supremacy',
        name: 'Military Supremacy',
        description: 'Achieve unmatched military dominance',
        type: 'power',
        subtype: 'military',
        progress: 0,
        target: 100,
        priority: 'critical',
        dynamic: false,
        actions: ['military_buildup', 'conquest', 'fortification'],
        conflicts_with: ['peace_keeper', 'demilitarization'],
        synergizes_with: ['control', 'territorial']
      },
      {
        id: 'advanced_weaponry',
        name: 'Advanced Weaponry',
        description: 'Develop cutting-edge military technology',
        type: 'technological',
        subtype: 'military_tech',
        progress: 0,
        target: 80,
        priority: 'high',
        dynamic: true,
        actions: ['weapons_research', 'prototype_testing', 'tech_acquisition'],
        synergizes_with: ['power', 'warfare']
      },
      {
        id: 'secure_empire',
        name: 'Secure the Empire',
        description: 'Eliminate all threats to imperial stability',
        type: 'control',
        subtype: 'security',
        progress: 0,
        target: 80,
        priority: 'high',
        dynamic: true,
        actions: ['suppress_rebellion', 'martial_law', 'surveillance']
      }
    ],
    varangians: [
      {
        id: 'honor_glory',
        name: 'Honor and Glory',
        description: 'Win legendary battles and earn reputation',
        type: 'reputation',
        subtype: 'warrior_culture',
        progress: 0,
        target: 50,
        priority: 'critical',
        dynamic: false,
        actions: ['challenge_duel', 'mercenary_contract', 'raid'],
        conflicts_with: ['peace_keeper', 'isolationism'],
        synergizes_with: ['warfare', 'independence']
      },
      {
        id: 'warrior_code',
        name: 'Preserve Warrior Code',
        description: 'Maintain ancient traditions and independence',
        type: 'cultural_preservation',
        subtype: 'traditional',
        progress: 0,
        target: 100,
        priority: 'high',
        dynamic: true,
        actions: ['resist_integration', 'recruit_warriors', 'honor_pacts'],
        conflicts_with: ['cultural_dominance', 'integration']
      },
      {
        id: 'sacred_relics',
        name: 'Gather Sacred Relics',
        description: 'Collect ancient warrior artifacts from across the galaxy',
        type: 'resource_acquisition',
        subtype: 'cultural_artifacts',
        progress: 0,
        target: 10,
        priority: 'medium',
        dynamic: true,
        actions: ['raid_ancient_sites', 'acquire_relics', 'treasure_hunt']
      }
    ],
    merchant_houses: [
      {
        id: 'economic_hegemony',
        name: 'Economic Hegemony',
        description: 'Control all major trade routes and markets',
        type: 'economic',
        subtype: 'monopoly',
        progress: 0,
        target: 100,
        priority: 'critical',
        dynamic: true,
        actions: ['monopolize_trade', 'market_manipulation', 'trade_embargo'],
        conflicts_with: ['free_markets', 'economic_equality'],
        synergizes_with: ['influence', 'technological']
      },
      {
        id: 'rare_resources',
        name: 'Rare Resource Control',
        description: 'Monopolize rare materials and exotic goods',
        type: 'resource_acquisition',
        subtype: 'strategic_materials',
        progress: 0,
        target: 75,
        priority: 'high',
        dynamic: true,
        actions: ['secure_mines', 'trade_agreements', 'resource_hoarding'],
        synergizes_with: ['economic', 'technological']
      },
      {
        id: 'political_influence',
        name: 'Political Influence',
        description: 'Use wealth to control political outcomes',
        type: 'influence',
        subtype: 'economic_power',
        progress: 0,
        target: 75,
        priority: 'medium',
        dynamic: true,
        actions: ['bribe_officials', 'fund_operations', 'lobby_policies']
      }
    ],
    agentes_in_rebus: [
      {
        id: 'information_supremacy',
        name: 'Information Supremacy',
        description: 'Know everything about everyone',
        type: 'intelligence',
        subtype: 'omniscience',
        progress: 0,
        target: 100,
        priority: 'critical',
        dynamic: false,
        actions: ['infiltrate_all', 'surveillance_network', 'blackmail'],
        synergizes_with: ['manipulation', 'influence']
      },
      {
        id: 'quantum_decryption',
        name: 'Quantum Decryption',
        description: 'Break all encryption systems across the Imperium',
        type: 'technological',
        subtype: 'cryptographic',
        progress: 0,
        target: 90,
        priority: 'high',
        dynamic: true,
        actions: ['quantum_research', 'steal_algorithms', 'cyber_warfare'],
        synergizes_with: ['intelligence', 'manipulation']
      },
      {
        id: 'shadow_control',
        name: 'Shadow Control',
        description: 'Control factions through covert manipulation',
        type: 'manipulation',
        subtype: 'puppet_master',
        progress: 0,
        target: 60,
        priority: 'high',
        dynamic: true,
        actions: ['puppet_leaders', 'false_flags', 'orchestrate_conflicts'],
        conflicts_with: ['transparency', 'democracy']
      }
    ],
    scrinium_barbarorum: [
      {
        id: 'knowledge_broker',
        name: 'Knowledge Broker',
        description: 'Become indispensable to all powers',
        type: 'neutrality',
        subtype: 'information_trade',
        progress: 0,
        target: 100,
        priority: 'critical',
        dynamic: true,
        actions: ['sell_intel', 'mediate_conflicts', 'independent_network'],
        conflicts_with: ['commitment', 'loyalty'],
        synergizes_with: ['balance', 'intelligence']
      },
      {
        id: 'ancient_knowledge',
        name: 'Ancient Knowledge',
        description: 'Uncover lost technologies and forgotten lore',
        type: 'resource_acquisition',
        subtype: 'knowledge',
        progress: 0,
        target: 50,
        priority: 'high',
        dynamic: true,
        actions: ['archaeological_digs', 'data_recovery', 'decode_texts'],
        synergizes_with: ['technological', 'influence']
      },
      {
        id: 'balance_power',
        name: 'Balance of Power',
        description: 'Prevent any single faction from dominating',
        type: 'balance',
        subtype: 'equilibrium',
        progress: 0,
        target: 80,
        priority: 'medium',
        dynamic: true,
        actions: ['support_underdog', 'expose_plots', 'sabotage_strong'],
        conflicts_with: ['dominance', 'hegemony']
      }
    ]
  };
  
  return goalsByFaction[faction.faction_id] || [];
}

// Progress long-term goals
function progressLongTermGoals(faction, allFactions, gameState, worldState) {
  const actions = [];
  
  // Adjust dynamic goals based on world state
  const adjustedGoals = adjustDynamicGoals(faction, allFactions, gameState, worldState);
  
  const updated_goals = adjustedGoals.map(goal => {
    const newGoal = { ...goal };
    
    // Calculate progress based on goal type and faction state
    const progressGain = calculateGoalProgress(goal, faction, allFactions, worldState);
    newGoal.progress = Math.min(newGoal.target, newGoal.progress + progressGain);
    
    // Trigger special actions when goals reach milestones
    if (newGoal.progress >= 25 && newGoal.progress < 30 && !goal.milestone_25) {
      newGoal.milestone_25 = true;
      actions.push({
        type: 'goal_milestone',
        faction: faction.faction_id,
        goal: goal.name,
        message: `${faction.name} is making progress toward: ${goal.name} (25%)`
      });
    }
    
    if (newGoal.progress >= 50 && newGoal.progress < 55 && !goal.milestone_50) {
      newGoal.milestone_50 = true;
      actions.push({
        type: 'goal_milestone',
        faction: faction.faction_id,
        goal: goal.name,
        message: `${faction.name} is halfway to achieving: ${goal.name}!`,
        significance: 'medium'
      });
    }
    
    if (newGoal.progress >= 75 && newGoal.progress < 80 && !goal.milestone_75) {
      newGoal.milestone_75 = true;
      actions.push({
        type: 'goal_milestone',
        faction: faction.faction_id,
        goal: goal.name,
        message: `⚠️ ${faction.name} is close to achieving: ${goal.name}! (75%)`,
        significance: 'medium'
      });
    }
    
    if (newGoal.progress >= goal.target && !goal.completed) {
      newGoal.completed = true;
      newGoal.completed_turn = gameState.turn_number || 0;
      actions.push({
        type: 'goal_completed',
        faction: faction.faction_id,
        goal: goal.name,
        message: `⚠️ ${faction.name} has achieved their goal: ${goal.name}!`,
        significance: 'high',
        effects: getGoalCompletionEffects(goal, faction)
      });
    }
    
    return newGoal;
  });
  
  return { actions, updated_goals };
}

// Calculate goal progress based on type
function calculateGoalProgress(goal, faction, allFactions, worldState) {
  let progress = 0;
  
  switch (goal.type) {
    case 'power':
      if (faction.power_level > 80) progress += 5;
      else if (faction.power_level > 60) progress += 3;
      break;
      
    case 'economic':
      if (faction.resources > 3000) progress += 4;
      else if (faction.resources > 2000) progress += 2;
      if (worldState?.economic_state === 'boom') progress += 2;
      break;
      
    case 'influence':
      const totalInfluence = Object.values(faction.relationships || {}).reduce((sum, val) => sum + Math.max(0, val), 0);
      progress = totalInfluence / 6;
      break;
      
    case 'warfare':
      progress = (faction.rivalries?.length || 0) * 3;
      if (faction.active_operations?.filter(op => op.operation_type === 'military').length > 0) {
        progress += 5;
      }
      break;
      
    case 'cultural_dominance':
      const culturalInfluence = Object.values(faction.relationships || {}).filter(v => v > 40).length;
      progress = culturalInfluence * 8;
      break;
      
    case 'cultural_preservation':
      if (faction.power_level > 50 && (faction.alliances?.length || 0) < 2) progress += 4;
      break;
      
    case 'technological':
      if (faction.resources > 2500) progress += 3;
      if (worldState?.economic_state === 'boom') progress += 2;
      break;
      
    case 'intelligence':
      const intelOperations = faction.active_operations?.filter(op => op.operation_type === 'espionage').length || 0;
      progress = intelOperations * 5;
      break;
      
    case 'resource_acquisition':
      if (faction.resources > 2000) progress += 2;
      if (goal.subtype === 'knowledge') {
        progress += (faction.faction_health?.intel || 50) / 20;
      }
      break;
      
    case 'manipulation':
      const diplomaticActions = faction.diplomatic_actions?.length || 0;
      progress = diplomaticActions * 4;
      break;
      
    case 'neutrality':
      const balancedRelations = Object.values(faction.relationships || {}).filter(v => Math.abs(v) < 30).length;
      progress = balancedRelations * 10;
      break;
      
    case 'balance':
      const powerImbalance = Math.max(...allFactions.map(f => f.power_level)) - Math.min(...allFactions.map(f => f.power_level));
      if (powerImbalance < 40) progress += 5;
      break;
      
    case 'control':
      if (faction.power_level > 70) progress += 4;
      break;
  }
  
  return progress;
}

// Adjust dynamic goals based on world events and relationships
function adjustDynamicGoals(faction, allFactions, gameState, worldState) {
  const goals = [...(faction.long_term_goals || [])];
  
  // Check if goals should be added/removed/prioritized
  goals.forEach(goal => {
    if (!goal.dynamic) return;
    
    // Increase priority if related to current situation
    if (goal.type === 'warfare' && (faction.rivalries?.length || 0) > 2) {
      goal.priority = 'critical';
    }
    
    if (goal.type === 'economic' && worldState?.economic_state === 'recession') {
      goal.priority = 'critical';
    }
    
    if (goal.type === 'balance' && worldState?.world_stability < 30) {
      goal.priority = 'critical';
    }
    
    // Decrease priority if not relevant
    if (goal.type === 'cultural_dominance' && faction.power_level < 40) {
      goal.priority = 'low';
    }
  });
  
  // Add opportunistic goals based on world state
  if (worldState?.economic_state === 'boom' && !goals.some(g => g.id === 'opportunistic_expansion')) {
    goals.push({
      id: 'opportunistic_expansion',
      name: 'Economic Expansion',
      description: 'Capitalize on economic boom',
      type: 'economic',
      subtype: 'opportunistic',
      progress: 0,
      target: 50,
      priority: 'high',
      dynamic: true,
      temporary: true,
      expires_turn: (gameState.turn_number || 0) + 10
    });
  }
  
  // Remove expired temporary goals
  return goals.filter(goal => !goal.temporary || !goal.expires_turn || (gameState.turn_number || 0) < goal.expires_turn);
}

function getGoalCompletionEffects(goal, faction) {
  const effects = {
    power_bonus: 0,
    resource_bonus: 0,
    new_capabilities: []
  };
  
  if (goal.type === 'power') {
    effects.power_bonus = 20;
    effects.new_capabilities.push('unstoppable_military');
  } else if (goal.type === 'economic') {
    effects.resource_bonus = 2000;
    effects.new_capabilities.push('economic_stranglehold');
  } else if (goal.type === 'influence') {
    effects.new_capabilities.push('diplomatic_immunity', 'mass_persuasion');
  }
  
  return effects;
}

// Sophisticated faction espionage and counter-intelligence
function processFactionEspionage(faction, allFactions, gameState) {
  const actions = [];
  let operation = null;
  
  // Counter-intelligence: detect player operations
  const playerStanding = (gameState.faction_relations || {})[faction.faction_id] || 0;
  if (playerStanding < -30 && Math.random() > 0.6) {
    const counterIntelSuccess = Math.random() > 0.5;
    if (counterIntelSuccess) {
      actions.push({
        type: 'counter_intelligence',
        faction: faction.faction_id,
        message: `${faction.name} has uncovered your covert operations! Relations deteriorate.`,
        effects: { faction_standing: -20, reputation: -15 }
      });
    }
  }
  
  // Launch espionage against rivals or player
  const shouldLaunchEspionage = (
    faction.strategic_focus === 'warfare' ||
    faction.strategic_focus === 'dominance' ||
    faction.faction_id === 'agentes_in_rebus' // Always spying
  ) && Math.random() > 0.65;
  
  if (shouldLaunchEspionage) {
    // Choose target based on threat assessment
    let target = null;
    
    // Target player if they're a threat
    if (playerStanding < -50 && Math.random() > 0.5) {
      target = 'player';
    } else {
      // Target a rival faction
      const rivals = faction.rivalries || [];
      if (rivals.length > 0) {
        const rivalFactions = allFactions.filter(f => rivals.includes(f.faction_id));
        if (rivalFactions.length > 0) {
          target = rivalFactions[Math.floor(Math.random() * rivalFactions.length)].faction_id;
        }
      }
    }
    
    if (target) {
      const espionageTypes = ['infiltration', 'sabotage', 'intelligence_theft', 'assassination_plot'];
      const opType = espionageTypes[Math.floor(Math.random() * espionageTypes.length)];
      
      operation = {
        operation_id: `esp_${Date.now()}`,
        operation_name: `${opType.replace('_', ' ')} against ${target}`,
        operation_type: 'espionage',
        target: target,
        turns_remaining: 3,
        success_chance: 50 + (faction.faction_health?.intel || 50) / 2,
        launched_turn: gameState.turn_number || 0,
        espionage_type: opType
      };
      
      actions.push({
        type: 'espionage_launched',
        faction: faction.faction_id,
        target: target,
        message: `${faction.name} launches covert ${opType} operation${target === 'player' ? ' targeting you' : ''}!`
      });
    }
  }
  
  return { actions, operation };
}

// Sophisticated diplomatic AI
function processSophisticatedDiplomacy(faction, allFactions, gameState, worldState) {
  const goals = faction.long_term_goals || [];
  const focus = faction.strategic_focus;
  
  // Check for temporary alliance opportunities based on goals
  const temporaryAllianceOpportunity = findTemporaryAllianceOpportunity(faction, allFactions, goals, worldState);
  if (temporaryAllianceOpportunity && Math.random() > 0.65) {
    return {
      action: {
        type: 'temporary_alliance_proposal',
        faction: faction.faction_id,
        target: temporaryAllianceOpportunity.faction_id,
        message: `${faction.name} proposes temporary alliance with ${temporaryAllianceOpportunity.name}: "${temporaryAllianceOpportunity.reason}"`,
        significance: 'medium'
      },
      diplomatic_action: {
        action_type: 'temporary_alliance',
        target_faction: temporaryAllianceOpportunity.faction_id,
        turn_initiated: gameState.turn_number || 0,
        status: 'pending',
        terms: temporaryAllianceOpportunity.terms,
        shared_goal: temporaryAllianceOpportunity.shared_goal,
        duration: temporaryAllianceOpportunity.duration
      },
      alliance_formed: temporaryAllianceOpportunity.faction_id
    };
  }
  
  // Check for goal-based rivalries
  const goalConflictRivalry = findGoalBasedRivalry(faction, allFactions, goals);
  if (goalConflictRivalry && Math.random() > 0.75) {
    return {
      action: {
        type: 'rivalry_declared',
        faction: faction.faction_id,
        target: goalConflictRivalry.faction_id,
        message: `${faction.name} declares rivalry with ${goalConflictRivalry.name} due to conflicting objectives: ${goalConflictRivalry.reason}`,
        significance: 'high'
      },
      rivalry_declared: goalConflictRivalry.faction_id
    };
  }
  
  // Proactive alliance building based on shared interests
  const sharedInterestAlliance = findSharedInterestAlliance(faction, allFactions, goals);
  if (sharedInterestAlliance && Math.random() > 0.7) {
    return {
      action: {
        type: 'strategic_alliance_proposal',
        faction: faction.faction_id,
        target: sharedInterestAlliance.faction_id,
        message: `${faction.name} proposes strategic alliance with ${sharedInterestAlliance.name} based on mutual interests`,
        significance: 'medium'
      },
      diplomatic_action: {
        action_type: 'alliance_proposal',
        target_faction: sharedInterestAlliance.faction_id,
        turn_initiated: gameState.turn_number || 0,
        status: 'pending',
        terms: sharedInterestAlliance.terms,
        shared_goal: sharedInterestAlliance.shared_goal
      },
      alliance_formed: sharedInterestAlliance.faction_id
    };
  }
  
  // Trade deals to strengthen economy
  if (faction.resources < 1500 && Math.random() > 0.6) {
    const tradingPartners = allFactions.filter(f => 
      f.faction_id !== faction.faction_id &&
      f.resources > 2000 &&
      !(faction.rivalries || []).includes(f.faction_id)
    );
    
    if (tradingPartners.length > 0) {
      const partner = tradingPartners[Math.floor(Math.random() * tradingPartners.length)];
      return {
        action: {
          type: 'trade_deal_proposal',
          faction: faction.faction_id,
          target: partner.faction_id,
          message: `${faction.name} proposes trade agreement with ${partner.name}`
        },
        diplomatic_action: {
          action_type: 'trade_agreement',
          target_faction: partner.faction_id,
          turn_initiated: gameState.turn_number || 0,
          status: 'pending',
          terms: 'Resource exchange and market access',
          economic_benefit: 500
        }
      };
    }
  }
  
  // Non-aggression pacts to secure borders
  if (focus === 'consolidation' || focus === 'survival') {
    const borderingFactions = allFactions.filter(f => 
      f.faction_id !== faction.faction_id &&
      !(faction.alliances || []).includes(f.faction_id) &&
      !(faction.rivalries || []).includes(f.faction_id) &&
      Math.abs(f.power_level - faction.power_level) < 30
    );
    
    if (borderingFactions.length > 0 && Math.random() > 0.75) {
      const neighbor = borderingFactions[Math.floor(Math.random() * borderingFactions.length)];
      return {
        action: {
          type: 'non_aggression_pact_proposal',
          faction: faction.faction_id,
          target: neighbor.faction_id,
          message: `${faction.name} proposes non-aggression pact with ${neighbor.name}`
        },
        diplomatic_action: {
          action_type: 'non_aggression_pact',
          target_faction: neighbor.faction_id,
          turn_initiated: gameState.turn_number || 0,
          status: 'pending',
          terms: 'Mutual non-aggression for 10 turns',
          duration: 10
        }
      };
    }
  }
  
  // Break alliances if goals conflict
  const conflictingAlliance = findConflictingAlliance(faction, allFactions, goals);
  if (conflictingAlliance && Math.random() > 0.8) {
    return {
      action: {
        type: 'alliance_broken',
        faction: faction.faction_id,
        target: conflictingAlliance.faction_id,
        message: `${faction.name} breaks alliance with ${conflictingAlliance.name} due to conflicting objectives!`,
        significance: 'high'
      },
      rivalry_declared: conflictingAlliance.faction_id
    };
  }
  
  return null;
}

function findSharedInterestAlliance(faction, allFactions, goals) {
  const neutralFactions = allFactions.filter(f => 
    f.faction_id !== faction.faction_id &&
    !(faction.alliances || []).includes(f.faction_id) &&
    !(faction.rivalries || []).includes(f.faction_id)
  );
  
  for (const potential of neutralFactions) {
    const potentialGoals = potential.long_term_goals || [];
    
    // Find shared enemies
    const sharedEnemies = (faction.rivalries || []).filter(r => 
      (potential.rivalries || []).includes(r)
    );
    
    if (sharedEnemies.length > 0) {
      return {
        faction_id: potential.faction_id,
        name: potential.name,
        terms: `Joint military cooperation against ${sharedEnemies.join(', ')}`,
        shared_goal: 'defeat_common_enemy'
      };
    }
    
    // Find complementary goals
    const hasComplementaryGoals = goals.some(g => 
      potentialGoals.some(pg => 
        (g.type === 'economic' && pg.type === 'power') ||
        (g.type === 'power' && pg.type === 'economic')
      )
    );
    
    if (hasComplementaryGoals && Math.random() > 0.6) {
      return {
        faction_id: potential.faction_id,
        name: potential.name,
        terms: 'Resource and military support exchange',
        shared_goal: 'mutual_benefit'
      };
    }
  }
  
  return null;
}

function findConflictingAlliance(faction, allFactions, goals) {
  const allies = faction.alliances || [];
  
  for (const allyId of allies) {
    const ally = allFactions.find(f => f.faction_id === allyId);
    if (!ally) continue;
    
    const allyGoals = ally.long_term_goals || [];
    
    // Check if goals directly conflict
    const hasConflict = goals.some(g => 
      allyGoals.some(ag => 
        (g.conflicts_with?.includes(ag.type)) ||
        (ag.conflicts_with?.includes(g.type)) ||
        (g.type === ag.type && g.subtype === ag.subtype && g.priority === 'critical' && ag.priority === 'critical')
      )
    );
    
    if (hasConflict) {
      return ally;
    }
  }
  
  return null;
}

// Find temporary alliance opportunities based on shared goals
function findTemporaryAllianceOpportunity(faction, allFactions, goals, worldState) {
  const nonAllies = allFactions.filter(f => 
    f.faction_id !== faction.faction_id &&
    !(faction.alliances || []).includes(f.faction_id) &&
    !(faction.rivalries || []).includes(f.faction_id)
  );
  
  for (const potential of nonAllies) {
    const potentialGoals = potential.long_term_goals || [];
    
    // Check for synergizing goals
    const synergies = goals.filter(g => 
      potentialGoals.some(pg => 
        g.synergizes_with?.includes(pg.type) || pg.synergizes_with?.includes(g.type)
      )
    );
    
    if (synergies.length > 0) {
      return {
        faction_id: potential.faction_id,
        name: potential.name,
        reason: `Synergizing objectives: ${synergies[0].name}`,
        terms: `Cooperation on ${synergies[0].type} objectives`,
        shared_goal: synergies[0].type,
        duration: 8
      };
    }
    
    // Check for common enemy
    const commonEnemies = (faction.rivalries || []).filter(r => 
      (potential.rivalries || []).includes(r)
    );
    
    if (commonEnemies.length > 0) {
      const enemyFaction = allFactions.find(f => f.faction_id === commonEnemies[0]);
      return {
        faction_id: potential.faction_id,
        name: potential.name,
        reason: `United against ${enemyFaction?.name || 'common enemy'}`,
        terms: 'Military cooperation against shared threat',
        shared_goal: 'defeat_common_enemy',
        duration: 10
      };
    }
    
    // Crisis-driven temporary alliance
    if (worldState?.world_stability < 30 && potential.power_level > 50) {
      return {
        faction_id: potential.faction_id,
        name: potential.name,
        reason: 'Stabilize the Imperium during crisis',
        terms: 'Temporary cooperation to restore stability',
        shared_goal: 'crisis_management',
        duration: 5
      };
    }
  }
  
  return null;
}

// Find goal-based rivalries
function findGoalBasedRivalry(faction, allFactions, goals) {
  const neutralOrWeakAllies = allFactions.filter(f => 
    f.faction_id !== faction.faction_id &&
    !(faction.rivalries || []).includes(f.faction_id)
  );
  
  for (const potential of neutralOrWeakAllies) {
    const potentialGoals = potential.long_term_goals || [];
    
    // Check for directly conflicting goals
    const conflicts = goals.filter(g => 
      potentialGoals.some(pg => 
        g.conflicts_with?.includes(pg.type) || 
        pg.conflicts_with?.includes(g.type) ||
        (g.type === pg.type && g.subtype === pg.subtype && g.priority === 'critical' && pg.priority === 'critical')
      )
    );
    
    if (conflicts.length > 0 && Math.random() > 0.4) {
      return {
        faction_id: potential.faction_id,
        name: potential.name,
        reason: `Conflicting goals: ${conflicts[0].name} vs their objectives`
      };
    }
    
    // Resource competition
    const bothSeekResources = goals.some(g => g.type === 'resource_acquisition') &&
                              potentialGoals.some(pg => pg.type === 'resource_acquisition');
    
    if (bothSeekResources && Math.random() > 0.6) {
      return {
        faction_id: potential.faction_id,
        name: potential.name,
        reason: 'Competition for rare resources'
      };
    }
  }
  
  return null;
}

function calculateMorale(faction, gameState) {
  let morale = faction.morale || 50;
  
  // Power affects morale
  if (faction.power_level > 70) morale += 5;
  if (faction.power_level < 30) morale -= 10;
  
  // Resources affect morale
  if (faction.resources > 2000) morale += 5;
  if (faction.resources < 500) morale -= 10;
  
  // Successful operations boost morale
  const successfulOps = (faction.active_operations || []).filter(op => op.success_chance > 70).length;
  morale += successfulOps * 2;
  
  // Rivalries drain morale
  morale -= (faction.rivalries?.length || 0) * 3;
  
  return Math.max(0, Math.min(100, morale));
}

function determineStrategicFocus(faction, allFactions, worldState) {
  const stability = worldState?.stability || 50;
  const power = faction.power_level || 50;
  const rivals = faction.rivalries?.length || 0;
  const morale = faction.morale || 50;
  
  // In danger - focus on survival
  if (power < 30 || morale < 30) return 'survival';
  
  // Low stability = opportunity for expansion
  if (stability < 40 && power > 60) return 'expansion';
  
  // Many rivals = focus on warfare
  if (rivals > 2) return 'warfare';
  
  // High power = seek dominance
  if (power > 80) return 'dominance';
  
  // Moderate conditions = diplomacy
  if (morale > 60 && power > 50) return 'diplomacy';
  
  // Default to consolidation
  return 'consolidation';
}

function processActiveOperations(faction, allFactions, gameState) {
  const actions = [];
  const updated_operations = [];
  let resource_change = 0;
  let power_change = 0;
  
  (faction.active_operations || []).forEach(op => {
    op.turns_remaining -= 1;
    
    if (op.turns_remaining <= 0) {
      // Operation completes - roll for success
      const roll = Math.random() * 100;
      const success = roll <= op.success_chance;
      
      if (success) {
        actions.push({
          type: 'operation_complete',
          faction: faction.faction_id,
          operation: op.operation_name,
          success: true,
          message: `${faction.name} successfully completed ${op.operation_type}: ${op.operation_name}`
        });
        
        // Apply operation effects
        if (op.operation_type === 'military') {
          power_change += 10;
          resource_change -= 200;
        } else if (op.operation_type === 'economic') {
          resource_change += 500;
        } else if (op.operation_type === 'espionage') {
          // Damage target faction
          actions.push({
            type: 'faction_damaged',
            faction: op.target,
            amount: 15,
            source: faction.faction_id
          });
        }
      } else {
        actions.push({
          type: 'operation_failed',
          faction: faction.faction_id,
          operation: op.operation_name,
          message: `${faction.name}'s ${op.operation_type} operation "${op.operation_name}" has failed`
        });
        
        resource_change -= 100;
        power_change -= 5;
      }
    } else {
      updated_operations.push(op);
    }
  });
  
  return { actions, updated_operations, resource_change, power_change };
}

function makeStrategicDecision(faction, allFactions, gameState, worldState) {
  const focus = faction.strategic_focus || 'consolidation';
  const power = faction.power_level || 50;
  const resources = faction.resources || 1000;
  
  // Can't act if too weak or poor
  if (resources < 300 || power < 20) return null;
  
  switch (focus) {
    case 'expansion':
      return decideLaunchExpansion(faction, allFactions, worldState);
    
    case 'warfare':
      return decideWarAction(faction, allFactions);
    
    case 'diplomacy':
      return decideDiplomaticAction(faction, allFactions);
    
    case 'dominance':
      return decideDominanceAction(faction, allFactions, gameState);
    
    case 'survival':
      return decideSurvivalAction(faction, allFactions);
    
    default:
      return decideConsolidation(faction);
  }
}

function decideLaunchExpansion(faction, allFactions, worldState) {
  // Try to expand territory
  if (Math.random() > 0.6) {
    return {
      type: 'launch_operation',
      action: {
        type: 'operation_launched',
        faction: faction.faction_id,
        message: `${faction.name} launches territorial expansion campaign`
      },
      operation: {
        operation_id: `exp_${Date.now()}`,
        operation_name: 'Territorial Expansion',
        operation_type: 'military',
        target: 'neutral_zones',
        turns_remaining: 3,
        success_chance: 60 + (faction.power_level / 2),
        launched_turn: 0
      }
    };
  }
  
  return null;
}

function decideWarAction(faction, allFactions) {
  const rivals = faction.rivalries || [];
  if (rivals.length === 0) return null;
  
  // Launch attack on weakest rival
  const rivalFactions = allFactions.filter(f => rivals.includes(f.faction_id));
  if (rivalFactions.length === 0) return null;
  
  const weakestRival = rivalFactions.reduce((min, f) => 
    f.power_level < min.power_level ? f : min
  );
  
  if (Math.random() > 0.5) {
    return {
      type: 'launch_operation',
      action: {
        type: 'military_strike',
        faction: faction.faction_id,
        target: weakestRival.faction_id,
        message: `${faction.name} launches military strike against ${weakestRival.name}`
      },
      operation: {
        operation_id: `war_${Date.now()}`,
        operation_name: `Strike Against ${weakestRival.name}`,
        operation_type: 'military',
        target: weakestRival.faction_id,
        turns_remaining: 2,
        success_chance: 50 + ((faction.power_level - weakestRival.power_level) / 2),
        launched_turn: 0
      }
    };
  }
  
  return null;
}

function decideDiplomaticAction(faction, allFactions) {
  // Try to form alliance with neutral faction
  const neutralFactions = allFactions.filter(f => 
    f.faction_id !== faction.faction_id &&
    !(faction.alliances || []).includes(f.faction_id) &&
    !(faction.rivalries || []).includes(f.faction_id)
  );
  
  if (neutralFactions.length > 0 && Math.random() > 0.7) {
    const target = neutralFactions[Math.floor(Math.random() * neutralFactions.length)];
    
    return {
      type: 'diplomatic_action',
      action: {
        type: 'alliance_proposed',
        faction: faction.faction_id,
        target: target.faction_id,
        message: `${faction.name} proposes alliance with ${target.name}`
      },
      diplomatic: {
        action_type: 'alliance_proposal',
        target_faction: target.faction_id,
        turn_initiated: 0,
        status: 'pending',
        terms: 'Mutual defense and trade agreement'
      }
    };
  }
  
  return null;
}

function decideDominanceAction(faction, allFactions, gameState) {
  // High power factions demand tribute or declare rivals
  const weakFactions = allFactions.filter(f => 
    f.faction_id !== faction.faction_id && 
    f.power_level < faction.power_level - 30
  );
  
  if (weakFactions.length > 0 && Math.random() > 0.6) {
    const target = weakFactions[Math.floor(Math.random() * weakFactions.length)];
    
    return {
      type: 'diplomatic_action',
      action: {
        type: 'demand_tribute',
        faction: faction.faction_id,
        target: target.faction_id,
        message: `${faction.name} demands tribute from ${target.name}`
      },
      diplomatic: {
        action_type: 'demand_tribute',
        target_faction: target.faction_id,
        turn_initiated: 0,
        status: 'pending',
        terms: 'Annual resource payment'
      }
    };
  }
  
  return null;
}

function decideSurvivalAction(faction, allFactions) {
  // Seek alliance with powerful faction
  const strongFactions = allFactions.filter(f => 
    f.faction_id !== faction.faction_id &&
    f.power_level > faction.power_level + 20 &&
    !(faction.rivalries || []).includes(f.faction_id)
  );
  
  if (strongFactions.length > 0 && Math.random() > 0.5) {
    const protector = strongFactions[Math.floor(Math.random() * strongFactions.length)];
    
    return {
      type: 'diplomatic_action',
      action: {
        type: 'alliance_proposed',
        faction: faction.faction_id,
        target: protector.faction_id,
        message: `${faction.name} seeks alliance with ${protector.name} for protection`
      },
      diplomatic: {
        action_type: 'alliance_proposal',
        target_faction: protector.faction_id,
        turn_initiated: 0,
        status: 'pending',
        terms: 'Protection pact'
      }
    };
  }
  
  return null;
}

function decideConsolidation(faction) {
  // Build up resources
  if (Math.random() > 0.7) {
    return {
      type: 'launch_operation',
      action: {
        type: 'economic_development',
        faction: faction.faction_id,
        message: `${faction.name} focuses on economic development`
      },
      operation: {
        operation_id: `econ_${Date.now()}`,
        operation_name: 'Economic Development',
        operation_type: 'economic',
        target: 'internal',
        turns_remaining: 2,
        success_chance: 75,
        launched_turn: 0
      }
    };
  }
  
  return null;
}

function assessPlayerThreat(faction, gameState, allFactions) {
  const playerStanding = (gameState.faction_relations || {})[faction.faction_id] || 0;
  const playerPower = gameState.reputation || 50;
  const playerInfluence = gameState.influence || 10;
  
  let threatLevel = faction.player_threat_level || 'negligible';
  const actions = [];
  let counter_operation = null;
  
  // Calculate threat based on standing, power, and influence
  if (playerStanding < -60 && playerPower > 70) {
    threatLevel = 'existential';
  } else if (playerStanding < -40 && playerPower > 50) {
    threatLevel = 'significant';
  } else if (playerStanding < -20) {
    threatLevel = 'moderate';
  } else if (playerStanding < 0) {
    threatLevel = 'minor';
  } else {
    threatLevel = 'negligible';
  }
  
  // Take action based on threat level
  if (threatLevel === 'existential') {
    // Coordinate with other factions against player
    const otherThreatenedFactions = allFactions.filter(f => 
      f.faction_id !== faction.faction_id &&
      (gameState.faction_relations || {})[f.faction_id] < -40
    );
    
    if (otherThreatenedFactions.length > 0 && Math.random() > 0.7) {
      actions.push({
        type: 'coalition_formed',
        faction: faction.faction_id,
        allies: otherThreatenedFactions.map(f => f.faction_id),
        message: `⚠️ ${faction.name} forms anti-player coalition with other threatened factions!`,
        significance: 'critical'
      });
    }
    
    // Launch counter-operation against player
    if (Math.random() > 0.6) {
      counter_operation = {
        operation_id: `counter_${Date.now()}`,
        operation_name: 'Eliminate Player Threat',
        operation_type: 'sabotage',
        target: 'player',
        turns_remaining: 4,
        success_chance: 40 + faction.power_level / 3,
        launched_turn: gameState.turn_number || 0
      };
      
      actions.push({
        type: 'player_targeted',
        faction: faction.faction_id,
        operation: 'elimination',
        message: `⚠️ ${faction.name} launches major operation to eliminate you as a threat!`,
        severity: 'critical'
      });
    }
  } else if (threatLevel === 'significant') {
    // Aggressive espionage against player
    if (Math.random() > 0.5) {
      counter_operation = {
        operation_id: `spy_${Date.now()}`,
        operation_name: 'Monitor Player Activities',
        operation_type: 'espionage',
        target: 'player',
        turns_remaining: 3,
        success_chance: 60 + (faction.faction_health?.intel || 50) / 3,
        launched_turn: gameState.turn_number || 0
      };
      
      actions.push({
        type: 'player_monitored',
        faction: faction.faction_id,
        message: `${faction.name} is closely monitoring your activities`,
        severity: 'high'
      });
    }
  } else if (threatLevel === 'moderate' && Math.random() > 0.7) {
    // Defensive measures
    actions.push({
      type: 'defensive_posture',
      faction: faction.faction_id,
      message: `${faction.name} adopts defensive posture due to your actions`
    });
  }
  
  return { actions, new_threat_level: threatLevel, counter_operation };
}

// React to world events
export function factionReactToWorldEvent(faction, worldEvent, allFactions) {
  const reactions = [];
  
  // Economic events
  if (worldEvent.id === 'economic_boom') {
    reactions.push({
      type: 'resource_gain',
      faction: faction.faction_id,
      amount: 300,
      message: `${faction.name} capitalizes on economic boom`
    });
  } else if (worldEvent.id === 'market_crash') {
    reactions.push({
      type: 'resource_loss',
      faction: faction.faction_id,
      amount: 400,
      message: `${faction.name} suffers from market crash`
    });
  }
  
  // Military events
  if (worldEvent.id === 'border_conflict') {
    if (faction.strategic_focus === 'warfare' || faction.strategic_focus === 'dominance') {
      reactions.push({
        type: 'power_gain',
        faction: faction.faction_id,
        amount: 10,
        message: `${faction.name} exploits border conflicts to increase military power`
      });
    }
  }
  
  return reactions;
}

// Process diplomatic proposals between factions
export function processDiplomaticProposal(proposal, proposingFaction, targetFaction) {
  const targetRelation = (targetFaction.relationships || {})[proposingFaction.faction_id] || 0;
  const powerDifference = proposingFaction.power_level - targetFaction.power_level;
  
  let acceptChance = 50;
  
  // Relationship affects acceptance
  acceptChance += targetRelation / 2;
  
  // Power difference affects acceptance
  if (proposal.action_type === 'alliance_proposal') {
    // More likely to ally if powers are balanced
    if (Math.abs(powerDifference) < 20) acceptChance += 20;
    if (powerDifference > 40) acceptChance -= 30; // Don't trust much stronger
  } else if (proposal.action_type === 'demand_tribute') {
    // Only accept if much weaker
    acceptChance = powerDifference > 0 ? powerDifference : 0;
  }
  
  // Check for mutual enemies
  const mutualEnemies = (proposingFaction.rivalries || []).filter(r => 
    (targetFaction.rivalries || []).includes(r)
  );
  if (mutualEnemies.length > 0) acceptChance += 25;
  
  const roll = Math.random() * 100;
  return roll <= acceptChance;
}

// Player espionage actions against factions
export function executeEspionageAction(actionType, targetFaction, playerSkills, gameState) {
  const espionageLevel = (playerSkills.espionage?.level || 0);
  const hackingLevel = (playerSkills.hacking?.level || 0);
  
  let baseSuccess = 60;
  let effects = {};
  let cost = { intel: 20, credits: 300 };
  
  switch (actionType) {
    case 'steal_secrets':
      baseSuccess += espionageLevel * 5;
      effects = {
        intel_gain: 40,
        faction_standing: -20,
        reveals_operations: true
      };
      cost = { intel: 15, credits: 200 };
      break;
      
    case 'plant_agent':
      baseSuccess += espionageLevel * 4;
      effects = {
        passive_intel: 10, // per turn
        faction_standing: -10,
        duration: 5
      };
      cost = { intel: 30, credits: 500 };
      break;
      
    case 'sabotage_operations':
      baseSuccess += hackingLevel * 5;
      effects = {
        disrupt_operations: true,
        faction_standing: -30,
        power_damage: 15
      };
      cost = { intel: 25, credits: 400 };
      break;
      
    case 'spread_propaganda':
      baseSuccess += (playerSkills.negotiation?.level || 0) * 4;
      effects = {
        morale_damage: 20,
        faction_standing: -15,
        reputation_gain: 10
      };
      cost = { intel: 10, influence: 15 };
      break;
      
    case 'assassinate_leader':
      baseSuccess += espionageLevel * 3;
      effects = {
        power_damage: 30,
        faction_standing: -60,
        triggers_investigation: true,
        high_risk: true
      };
      cost = { intel: 50, credits: 1000 };
      break;
  }
  
  const roll = Math.random() * 100;
  const success = roll <= baseSuccess;
  
  return {
    success,
    effects: success ? effects : { faction_standing: -40, reputation_loss: 20 },
    cost,
    roll,
    successChance: baseSuccess
  };
}