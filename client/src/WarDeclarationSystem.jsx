// War Declaration System - War goals and mechanics

export const WAR_GOALS = {
  territorial_conquest: {
    name: 'Territorial Conquest',
    description: 'Seize enemy territory',
    difficulty: 'high',
    victory_conditions: { territory_captured: 3, enemy_fleets_destroyed: 2 },
    rewards: { power: 20, territory: 2, reputation: 15 }
  },
  regime_change: {
    name: 'Regime Change',
    description: 'Overthrow enemy leadership',
    difficulty: 'very_high',
    victory_conditions: { enemy_power_reduced: 50, influence_gained: 30 },
    rewards: { power: 30, influence: 25, reputation: 20 }
  },
  punitive_expedition: {
    name: 'Punitive Expedition',
    description: 'Punish enemy aggression',
    difficulty: 'medium',
    victory_conditions: { enemy_fleets_destroyed: 3, raids_completed: 2 },
    rewards: { power: 10, credits: 2000, reputation: 10 }
  },
  resource_seizure: {
    name: 'Resource Seizure',
    description: 'Capture enemy resource installations',
    difficulty: 'medium',
    victory_conditions: { resources_captured: 1000, installations_seized: 2 },
    rewards: { resources: 1500, credits: 1000 }
  },
  total_war: {
    name: 'Total War',
    description: 'Complete annihilation of enemy',
    difficulty: 'extreme',
    victory_conditions: { enemy_power_reduced: 80, fleets_destroyed: 5 },
    rewards: { power: 50, territory: 5, reputation: 30 }
  },
  liberation: {
    name: 'Liberation',
    description: 'Free territory from enemy control',
    difficulty: 'high',
    victory_conditions: { territory_liberated: 2, civilian_support: 60 },
    rewards: { reputation: 25, influence: 20, alliances: 1 }
  }
};

// Declare war
export function declareWar(attacker, defender, warGoal, justification, factions) {
  const attackerFaction = factions.find(f => f.faction_id === attacker);
  const defenderFaction = factions.find(f => f.faction_id === defender);
  
  if (!attackerFaction || !defenderFaction) {
    return { success: false, message: 'Faction not found' };
  }
  
  // Check if already at war
  if ((attackerFaction.rivalries || []).includes(defender)) {
    return { success: false, message: 'Already at war' };
  }
  
  const war = {
    id: `war_${Date.now()}`,
    attacker,
    defender,
    war_goal: warGoal,
    justification,
    status: 'active',
    started_turn: 0,
    duration: 0,
    war_score: { attacker: 0, defender: 0 },
    progress: {
      territory_captured: 0,
      fleets_destroyed: 0,
      enemy_power_reduced: 0,
      resources_captured: 0,
      raids_completed: 0,
      installations_seized: 0
    },
    participants: {
      attacker_allies: [],
      defender_allies: []
    }
  };
  
  // Add to rivalries
  if (!attackerFaction.rivalries) attackerFaction.rivalries = [];
  attackerFaction.rivalries.push(defender);
  
  if (!defenderFaction.rivalries) defenderFaction.rivalries = [];
  defenderFaction.rivalries.push(attacker);
  
  // Call allies
  const allyCalls = callAllies(war, factions);
  
  return {
    success: true,
    message: `${attackerFaction.name} declares war on ${defenderFaction.name}!`,
    war,
    ally_calls: allyCalls
  };
}

function callAllies(war, factions) {
  const calls = [];
  
  const attackerFaction = factions.find(f => f.faction_id === war.attacker);
  const defenderFaction = factions.find(f => f.faction_id === war.defender);
  
  // Attacker's allies
  (attackerFaction.alliances || []).forEach(allyId => {
    const ally = factions.find(f => f.faction_id === allyId);
    if (ally && Math.random() > 0.4) { // 60% chance to join
      war.participants.attacker_allies.push(allyId);
      if (!ally.rivalries) ally.rivalries = [];
      ally.rivalries.push(war.defender);
      
      calls.push({
        type: 'ally_joined',
        ally: allyId,
        side: 'attacker',
        war_id: war.id
      });
    }
  });
  
  // Defender's allies
  (defenderFaction.alliances || []).forEach(allyId => {
    const ally = factions.find(f => f.faction_id === allyId);
    if (ally && Math.random() > 0.3) { // 70% chance to join defensive war
      war.participants.defender_allies.push(allyId);
      if (!ally.rivalries) ally.rivalries = [];
      ally.rivalries.push(war.attacker);
      
      calls.push({
        type: 'ally_joined',
        ally: allyId,
        side: 'defender',
        war_id: war.id
      });
    }
  });
  
  return calls;
}

// Update war progress
export function updateWarProgress(war, warEvents, currentTurn) {
  war.duration = currentTurn - war.started_turn;
  
  warEvents.forEach(event => {
    switch (event.type) {
      case 'fleet_battle_won':
        if (event.winner === war.attacker) {
          war.progress.fleets_destroyed += 1;
          war.war_score.attacker += 10;
        } else {
          war.war_score.defender += 10;
        }
        break;
        
      case 'territory_captured':
        war.progress.territory_captured += 1;
        war.war_score.attacker += 15;
        break;
        
      case 'raid_success':
        war.progress.raids_completed += 1;
        war.progress.resources_captured += event.resources || 0;
        war.war_score.attacker += 5;
        break;
        
      case 'installation_seized':
        war.progress.installations_seized += 1;
        war.war_score.attacker += 8;
        break;
        
      case 'power_reduced':
        war.progress.enemy_power_reduced += event.amount || 0;
        war.war_score.attacker += event.amount / 2;
        break;
    }
  });
  
  // Check victory conditions
  return checkVictoryConditions(war);
}

function checkVictoryConditions(war) {
  const goal = WAR_GOALS[war.war_goal];
  if (!goal) return null;
  
  const conditions = goal.victory_conditions;
  let conditionsMet = 0;
  let totalConditions = 0;
  
  Object.entries(conditions).forEach(([key, required]) => {
    totalConditions++;
    if (war.progress[key] >= required) {
      conditionsMet++;
    }
  });
  
  if (conditionsMet === totalConditions) {
    return {
      victory: true,
      winner: war.attacker,
      goal: war.war_goal,
      rewards: goal.rewards
    };
  }
  
  // Check war exhaustion - defender wins if attacker fails after long war
  if (war.duration > 15 && war.war_score.attacker < war.war_score.defender) {
    return {
      victory: true,
      winner: war.defender,
      reason: 'war_exhaustion',
      rewards: { reputation: 15, power: 10 }
    };
  }
  
  return null;
}

// Propose peace
export function proposePeace(war, proposer, terms, factions) {
  const isAttacker = proposer === war.attacker;
  const opponent = isAttacker ? war.defender : war.attacker;
  
  const proposal = {
    id: `peace_${Date.now()}`,
    war_id: war.id,
    proposer,
    opponent,
    terms: {
      white_peace: terms.white_peace || false,
      war_reparations: terms.war_reparations || 0,
      territory_ceded: terms.territory_ceded || [],
      enforce_war_goal: terms.enforce_war_goal || false
    },
    status: 'pending'
  };
  
  // AI decision
  if (opponent !== 'player') {
    const acceptance = evaluatePeaceTerms(war, proposal, factions);
    
    if (acceptance.accepted) {
      return {
        success: true,
        accepted: true,
        message: `${opponent} accepts peace terms`,
        proposal
      };
    } else {
      return {
        success: true,
        accepted: false,
        message: `${opponent} rejects peace terms`,
        reason: acceptance.reason,
        counter_offer: acceptance.counter_offer
      };
    }
  }
  
  return { success: true, proposal };
}

function evaluatePeaceTerms(war, proposal, factions) {
  const proposerFaction = factions.find(f => f.faction_id === proposal.proposer);
  const opponentFaction = factions.find(f => f.faction_id === proposal.opponent);
  
  let acceptanceChance = 0.5;
  
  // War score affects acceptance
  const isProposerWinning = war.war_score[proposal.proposer === war.attacker ? 'attacker' : 'defender'] >
                            war.war_score[proposal.opponent === war.attacker ? 'attacker' : 'defender'];
  
  if (!isProposerWinning) {
    acceptanceChance += 0.3; // Losing side more willing to negotiate
  }
  
  // White peace is easier to accept
  if (proposal.terms.white_peace) {
    acceptanceChance += 0.2;
  }
  
  // High reparations reduce acceptance
  if (proposal.terms.war_reparations > 1500) {
    acceptanceChance -= 0.3;
  }
  
  // Territory demands
  if (proposal.terms.territory_ceded?.length > 0) {
    acceptanceChance -= 0.2 * proposal.terms.territory_ceded.length;
  }
  
  // War exhaustion
  if (war.duration > 10) {
    acceptanceChance += 0.15;
  }
  
  if (Math.random() < Math.max(0.1, Math.min(0.9, acceptanceChance))) {
    return { accepted: true };
  }
  
  // Generate counter-offer
  const counterOffer = {
    white_peace: true,
    war_reparations: Math.round((proposal.terms.war_reparations || 0) * 0.5),
    territory_ceded: [],
    enforce_war_goal: false
  };
  
  return {
    accepted: false,
    reason: 'Terms too harsh',
    counter_offer: counterOffer
  };
}

// End war
export function endWar(war, victor, factions) {
  war.status = 'ended';
  war.victor = victor;
  
  const attackerFaction = factions.find(f => f.faction_id === war.attacker);
  const defenderFaction = factions.find(f => f.faction_id === war.defender);
  
  // Remove rivalries
  if (attackerFaction) {
    attackerFaction.rivalries = (attackerFaction.rivalries || []).filter(r => r !== war.defender);
  }
  if (defenderFaction) {
    defenderFaction.rivalries = (defenderFaction.rivalries || []).filter(r => r !== war.attacker);
  }
  
  // Remove ally rivalries
  war.participants.attacker_allies.forEach(allyId => {
    const ally = factions.find(f => f.faction_id === allyId);
    if (ally) {
      ally.rivalries = (ally.rivalries || []).filter(r => r !== war.defender);
    }
  });
  
  war.participants.defender_allies.forEach(allyId => {
    const ally = factions.find(f => f.faction_id === allyId);
    if (ally) {
      ally.rivalries = (ally.rivalries || []).filter(r => r !== war.attacker);
    }
  });
  
  return {
    message: `War between ${war.attacker} and ${war.defender} has ended`,
    victor,
    war
  };
}