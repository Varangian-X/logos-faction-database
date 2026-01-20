// Faction Reputation System - AI-driven reputation changes based on actions

// Process player action and calculate faction reputation changes
export function calculateReputationChanges(action, factions, gameState) {
  const changes = {};
  
  factions.forEach(faction => {
    let change = 0;
    
    // Trade actions
    if (action.type === 'trade' || action.type === 'market_transaction') {
      if (action.faction === faction.faction_id) {
        change += 2; // Trading with faction improves relations
      }
      // Merchant houses appreciate all trade
      if (faction.faction_id === 'merchant_houses') {
        change += 1;
      }
    }
    
    // Combat actions
    if (action.type === 'combat' || action.type === 'attack') {
      if (action.target_faction === faction.faction_id) {
        change -= 15; // Direct combat damages relations
      }
      // Allies of target faction also lose reputation
      if (faction.alliances?.includes(action.target_faction)) {
        change -= 8;
      }
      // Enemies of target faction gain reputation
      if (faction.rivalries?.includes(action.target_faction)) {
        change += 5;
      }
    }
    
    // Diplomatic actions
    if (action.type === 'diplomacy') {
      if (action.faction === faction.faction_id) {
        change += action.reputation_change || 5;
      }
    }
    
    // Quest completion
    if (action.type === 'quest_complete') {
      if (action.faction_sponsor === faction.faction_id) {
        change += 10;
      }
      // Quests against faction
      if (action.against_faction === faction.faction_id) {
        change -= 12;
      }
    }
    
    // Event choices
    if (action.type === 'event_choice') {
      const factionImpact = action.faction_impact || {};
      change += factionImpact[faction.faction_id] || 0;
    }
    
    // Investment in faction territory
    if (action.type === 'investment') {
      if (action.benefits_faction === faction.faction_id) {
        change += 3;
      }
    }
    
    // Espionage detected
    if (action.type === 'espionage_detected') {
      if (action.target_faction === faction.faction_id) {
        change -= 20;
      }
    }
    
    // Market manipulation affecting faction
    if (action.type === 'market_manipulation') {
      if (action.harms_faction === faction.faction_id) {
        change -= 10;
      }
      if (action.benefits_faction === faction.faction_id) {
        change += 8;
      }
    }
    
    // Apply changes if significant
    if (change !== 0) {
      changes[faction.faction_id] = change;
    }
  });
  
  return changes;
}

// Process faction-to-faction reputation changes
export function processFactionInteractionReputation(actingFaction, targetFaction, action, allFactions) {
  const changes = {};
  
  // The target faction's reputation changes
  let directChange = 0;
  
  switch (action.type) {
    case 'alliance_proposal':
      directChange = 5;
      break;
    case 'alliance_accepted':
      directChange = 20;
      break;
    case 'alliance_broken':
      directChange = -30;
      break;
    case 'trade_agreement':
      directChange = 10;
      break;
    case 'military_support':
      directChange = 15;
      break;
    case 'betrayal':
      directChange = -40;
      break;
    case 'rivalry_declared':
      directChange = -25;
      break;
    case 'territorial_aggression':
      directChange = -15;
      break;
    case 'aid_provided':
      directChange = 12;
      break;
  }
  
  changes[targetFaction.faction_id] = directChange;
  
  // Ripple effects to other factions
  allFactions.forEach(otherFaction => {
    if (otherFaction.faction_id === actingFaction.faction_id || 
        otherFaction.faction_id === targetFaction.faction_id) {
      return;
    }
    
    let rippleChange = 0;
    
    // Allies of target faction react
    if (otherFaction.alliances?.includes(targetFaction.faction_id)) {
      if (directChange < 0) {
        rippleChange -= Math.abs(directChange) * 0.4; // Negative action upsets allies
      } else if (action.type === 'alliance_accepted') {
        rippleChange += 5; // Happy about new alliance
      }
    }
    
    // Rivals of target faction react
    if (otherFaction.rivalries?.includes(targetFaction.faction_id)) {
      if (directChange < 0) {
        rippleChange += Math.abs(directChange) * 0.3; // Like when you hurt their enemy
      } else if (action.type === 'alliance_accepted') {
        rippleChange -= 8; // Worried about new alliance
      }
    }
    
    if (rippleChange !== 0) {
      changes[otherFaction.faction_id] = rippleChange;
    }
  });
  
  return changes;
}

// Apply reputation changes with bounds checking
export function applyReputationChanges(faction, changes, gameState) {
  const currentRelations = faction.relationships || {};
  const updatedRelations = { ...currentRelations };
  
  Object.entries(changes).forEach(([targetId, change]) => {
    const current = updatedRelations[targetId] || 0;
    updatedRelations[targetId] = Math.max(-100, Math.min(100, current + change));
  });
  
  return updatedRelations;
}

// Check for reputation milestones that trigger events
export function checkReputationMilestones(faction, oldRelations, newRelations, gameState) {
  const events = [];
  
  Object.keys(newRelations).forEach(targetId => {
    const oldValue = oldRelations[targetId] || 0;
    const newValue = newRelations[targetId];
    
    // Crossed into alliance territory
    if (oldValue < 60 && newValue >= 60) {
      events.push({
        type: 'reputation_milestone',
        faction: faction.faction_id,
        target: targetId,
        milestone: 'alliance_possible',
        message: `${faction.name} now views ${targetId} favorably enough for an alliance`
      });
    }
    
    // Crossed into hostility
    if (oldValue > -40 && newValue <= -40) {
      events.push({
        type: 'reputation_milestone',
        faction: faction.faction_id,
        target: targetId,
        milestone: 'hostility',
        message: `⚠️ Relations between ${faction.name} and ${targetId} have turned hostile!`
      });
    }
    
    // Crossed into war threshold
    if (oldValue > -70 && newValue <= -70) {
      events.push({
        type: 'reputation_milestone',
        faction: faction.faction_id,
        target: targetId,
        milestone: 'war_imminent',
        message: `🔥 ${faction.name} and ${targetId} are on the brink of war!`,
        severity: 'critical'
      });
    }
  });
  
  return events;
}

// Generate organic reputation decay/improvement over time
export function applyNaturalReputationDrift(faction, allFactions, turnNumber) {
  const changes = {};
  
  allFactions.forEach(otherFaction => {
    if (otherFaction.faction_id === faction.faction_id) return;
    
    const current = (faction.relationships || {})[otherFaction.faction_id] || 0;
    
    // Extreme values drift toward neutral slowly
    if (Math.abs(current) > 80) {
      const drift = current > 0 ? -1 : 1;
      changes[otherFaction.faction_id] = drift;
    }
    
    // Allies naturally strengthen bonds (if both are allied)
    if (faction.alliances?.includes(otherFaction.faction_id) && 
        otherFaction.alliances?.includes(faction.faction_id)) {
      if (current < 80) {
        changes[otherFaction.faction_id] = 1;
      }
    }
    
    // Rivalries naturally intensify
    if (faction.rivalries?.includes(otherFaction.faction_id)) {
      if (current > -80) {
        changes[otherFaction.faction_id] = -1;
      }
    }
  });
  
  return changes;
}