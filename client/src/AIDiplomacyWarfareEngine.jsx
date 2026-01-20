// AI Diplomacy & Warfare Decision Engine

import { createTreatyProposal } from '../diplomacy/DiplomaticTreatySystem';
import { declareWar, proposePeace, WAR_GOALS } from './WarDeclarationSystem';

// AI decides diplomatic/warfare actions
export function processFactionDiplomacyWarfare(faction, allFactions, wars, treaties, gameState) {
  const actions = [];
  
  // War declaration evaluation
  const warDecision = evaluateWarDeclaration(faction, allFactions, wars, gameState);
  if (warDecision) {
    actions.push(warDecision);
  }
  
  // Peace negotiation evaluation
  const peaceDecision = evaluatePeaceNegotiation(faction, wars, allFactions);
  if (peaceDecision) {
    actions.push(peaceDecision);
  }
  
  // Treaty proposal evaluation
  const treatyDecisions = evaluateTreatyProposals(faction, allFactions, treaties, wars);
  actions.push(...treatyDecisions);
  
  // War effort management
  const warEfforts = manageWarEffort(faction, wars, allFactions, gameState);
  actions.push(...warEfforts);
  
  return actions;
}

function evaluateWarDeclaration(faction, allFactions, wars, gameState) {
  // Don't declare war if already in multiple wars
  const currentWars = wars.filter(w => 
    (w.attacker === faction.faction_id || w.defender === faction.faction_id) &&
    w.status === 'active'
  );
  
  if (currentWars.length >= 2) return null;
  
  // Strategic focus affects war likelihood
  if (faction.strategic_focus !== 'warfare' && 
      faction.strategic_focus !== 'dominance' &&
      faction.strategic_focus !== 'expansion') {
    if (Math.random() > 0.1) return null; // Low chance
  }
  
  // Find suitable target
  const target = findWarTarget(faction, allFactions, wars);
  if (!target) return null;
  
  // Determine war goal based on faction goals
  const warGoal = determineWarGoal(faction, target, gameState);
  
  // Calculate war readiness
  const readiness = calculateWarReadiness(faction, target, allFactions);
  
  if (readiness < 0.6) return null; // Not ready
  
  // Random chance based on strategic focus
  const declareChance = {
    warfare: 0.4,
    dominance: 0.35,
    expansion: 0.3,
    default: 0.1
  }[faction.strategic_focus] || 0.1;
  
  if (Math.random() > declareChance) return null;
  
  const justification = generateWarJustification(faction, target, gameState);
  
  return {
    type: 'declare_war',
    faction: faction.faction_id,
    target: target.faction_id,
    war_goal: warGoal,
    justification,
    readiness,
    message: `⚔️ ${faction.name} declares war on ${target.name}! War Goal: ${WAR_GOALS[warGoal].name}`
  };
}

function findWarTarget(faction, allFactions, wars) {
  const potentialTargets = allFactions.filter(f => {
    if (f.faction_id === faction.faction_id) return false;
    if ((faction.alliances || []).includes(f.faction_id)) return false;
    if ((faction.rivalries || []).includes(f.faction_id)) return false; // Already at war
    
    // Check if in active war with this faction
    const existingWar = wars.find(w =>
      ((w.attacker === faction.faction_id && w.defender === f.faction_id) ||
       (w.defender === faction.faction_id && w.attacker === f.faction_id)) &&
      w.status === 'active'
    );
    if (existingWar) return false;
    
    return true;
  });
  
  if (potentialTargets.length === 0) return null;
  
  // Prioritize targets based on:
  // 1. Weak factions (easier victory)
  // 2. Resource-rich factions
  // 3. Factions with conflicting goals
  
  return potentialTargets.reduce((best, target) => {
    if (!best) return target;
    
    const targetScore = calculateTargetScore(faction, target);
    const bestScore = calculateTargetScore(faction, best);
    
    return targetScore > bestScore ? target : best;
  }, null);
}

function calculateTargetScore(faction, target) {
  let score = 0;
  
  // Weaker targets score higher
  const powerDiff = faction.power_level - target.power_level;
  score += powerDiff * 2;
  
  // Rich targets score higher
  if (target.resources > 3000) score += 20;
  
  // Poor relationship increases score
  const relationship = (faction.relationships || {})[target.faction_id] || 0;
  if (relationship < -30) score += 30;
  if (relationship < -60) score += 50;
  
  // Goal conflicts
  const hasConflict = (faction.long_term_goals || []).some(g =>
    (target.long_term_goals || []).some(tg =>
      g.conflicts_with?.includes(tg.type)
    )
  );
  if (hasConflict) score += 40;
  
  return score;
}

function determineWarGoal(faction, target, gameState) {
  const goals = faction.long_term_goals || [];
  
  // Match war goal to faction goals
  if (goals.some(g => g.type === 'territorial' || g.type === 'expansion')) {
    return 'territorial_conquest';
  }
  
  if (goals.some(g => g.type === 'dominance' || g.type === 'power')) {
    if (faction.power_level > 70) return 'regime_change';
    return 'punitive_expedition';
  }
  
  if (goals.some(g => g.type === 'resource_acquisition')) {
    return 'resource_seizure';
  }
  
  if (faction.strategic_focus === 'warfare') {
    return 'total_war';
  }
  
  // Default
  return 'punitive_expedition';
}

function calculateWarReadiness(faction, target, allFactions) {
  let readiness = 0.5;
  
  // Military strength
  const powerRatio = faction.power_level / target.power_level;
  readiness += (powerRatio - 1) * 0.2;
  
  // Resources
  if (faction.resources > 3000) readiness += 0.2;
  else if (faction.resources < 1500) readiness -= 0.3;
  
  // Morale
  readiness += (faction.morale || 50) / 200;
  
  // Allies
  const factionAllies = (faction.alliances || []).length;
  const targetAllies = (target.alliances || []).length;
  readiness += (factionAllies - targetAllies) * 0.1;
  
  return Math.max(0, Math.min(1, readiness));
}

function generateWarJustification(faction, target, gameState) {
  const justifications = [
    'Border aggression',
    'Historical grievances',
    'Resource disputes',
    'Ideological conflict',
    'Threat to security',
    'Territorial claims',
    'Economic sanctions'
  ];
  
  return justifications[Math.floor(Math.random() * justifications.length)];
}

function evaluatePeaceNegotiation(faction, wars, allFactions) {
  const activeWars = wars.filter(w =>
    (w.attacker === faction.faction_id || w.defender === faction.faction_id) &&
    w.status === 'active'
  );
  
  if (activeWars.length === 0) return null;
  
  // Evaluate each war for peace potential
  for (const war of activeWars) {
    const isAttacker = war.attacker === faction.faction_id;
    const ourScore = isAttacker ? war.war_score.attacker : war.war_score.defender;
    const theirScore = isAttacker ? war.war_score.defender : war.war_score.attacker;
    
    // Consider peace if:
    // 1. Losing badly
    // 2. War exhaustion (long war)
    // 3. Resources depleted
    
    let peaceLikelihood = 0;
    
    if (theirScore > ourScore * 1.5) peaceLikelihood += 0.4; // Losing
    if (war.duration > 12) peaceLikelihood += 0.3; // War exhaustion
    if (faction.resources < 1000) peaceLikelihood += 0.3; // Low resources
    if (faction.morale < 40) peaceLikelihood += 0.2; // Low morale
    
    if (Math.random() < peaceLikelihood) {
      const terms = generatePeaceTerms(war, faction, ourScore, theirScore);
      
      return {
        type: 'propose_peace',
        faction: faction.faction_id,
        war_id: war.id,
        terms,
        message: `${faction.name} proposes peace to end the war`
      };
    }
  }
  
  return null;
}

function generatePeaceTerms(war, faction, ourScore, theirScore) {
  const isWinning = ourScore > theirScore;
  
  if (isWinning) {
    return {
      white_peace: false,
      war_reparations: 1500,
      territory_ceded: ['border_territory'],
      enforce_war_goal: true
    };
  } else {
    return {
      white_peace: true,
      war_reparations: 500,
      territory_ceded: [],
      enforce_war_goal: false
    };
  }
}

function evaluateTreatyProposals(faction, allFactions, treaties, wars) {
  const proposals = [];
  
  // Don't overwhelm with proposals
  if (Math.random() > 0.3) return proposals;
  
  // Defense pact with allies against common threat
  if (faction.strategic_focus === 'survival' || faction.power_level < 50) {
    const ally = findDefensePactCandidate(faction, allFactions, wars);
    if (ally && Math.random() > 0.6) {
      proposals.push({
        type: 'propose_treaty',
        faction: faction.faction_id,
        target: ally.faction_id,
        treaty_type: 'defense_pact',
        message: `${faction.name} proposes defense pact with ${ally.name}`
      });
    }
  }
  
  // Research agreements for tech-focused factions
  if (faction.faction_id === 'scrinium_barbarorum' || 
      (faction.long_term_goals || []).some(g => g.type === 'technological')) {
    const partner = findResearchPartner(faction, allFactions);
    if (partner && Math.random() > 0.7) {
      proposals.push({
        type: 'propose_treaty',
        faction: faction.faction_id,
        target: partner.faction_id,
        treaty_type: 'research_agreement',
        message: `${faction.name} proposes research cooperation with ${partner.name}`
      });
    }
  }
  
  // Trade agreements for economic factions
  if (faction.faction_id === 'merchant_houses' || faction.strategic_focus === 'consolidation') {
    const tradingPartner = findTradingPartner(faction, allFactions);
    if (tradingPartner && Math.random() > 0.65) {
      proposals.push({
        type: 'propose_treaty',
        faction: faction.faction_id,
        target: tradingPartner.faction_id,
        treaty_type: 'trade_agreement',
        message: `${faction.name} proposes trade agreement with ${tradingPartner.name}`
      });
    }
  }
  
  return proposals;
}

function findDefensePactCandidate(faction, allFactions, wars) {
  return allFactions.find(f =>
    f.faction_id !== faction.faction_id &&
    !(faction.alliances || []).includes(f.faction_id) &&
    !(faction.rivalries || []).includes(f.faction_id) &&
    (f.relationships || {})[faction.faction_id] > 20 &&
    // Share common enemies
    (faction.rivalries || []).some(r => (f.rivalries || []).includes(r))
  );
}

function findResearchPartner(faction, allFactions) {
  return allFactions.find(f =>
    f.faction_id !== faction.faction_id &&
    !(faction.rivalries || []).includes(f.faction_id) &&
    (f.resources > 2000) &&
    (f.relationships || {})[faction.faction_id] > 0
  );
}

function findTradingPartner(faction, allFactions) {
  return allFactions.find(f =>
    f.faction_id !== faction.faction_id &&
    !(faction.rivalries || []).includes(f.faction_id) &&
    f.resources > 2500 &&
    (f.relationships || {})[faction.faction_id] > -20
  );
}

function manageWarEffort(faction, wars, allFactions, gameState) {
  const actions = [];
  
  const activeWars = wars.filter(w =>
    (w.attacker === faction.faction_id || w.defender === faction.faction_id) &&
    w.status === 'active'
  );
  
  activeWars.forEach(war => {
    // Increase military spending during war
    if (faction.resources > 2000 && Math.random() > 0.5) {
      actions.push({
        type: 'war_mobilization',
        faction: faction.faction_id,
        war_id: war.id,
        spending: 1500,
        message: `${faction.name} increases military spending for the war effort`
      });
    }
    
    // Request aid from allies
    if (faction.resources < 1500 && (faction.alliances || []).length > 0) {
      actions.push({
        type: 'request_war_aid',
        faction: faction.faction_id,
        war_id: war.id,
        message: `${faction.name} requests military aid from allies`
      });
    }
  });
  
  return actions;
}