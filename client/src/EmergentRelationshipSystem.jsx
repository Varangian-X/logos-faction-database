// Emergent Relationship System - AI factions form organic alliances/rivalries

// Detect and form emergent alliances based on strategic situation
export function detectEmergentAlliances(factions, gameState, worldState) {
  const newAlliances = [];
  
  factions.forEach(faction => {
    factions.forEach(otherFaction => {
      if (faction.faction_id === otherFaction.faction_id) return;
      if (faction.alliances?.includes(otherFaction.faction_id)) return; // Already allied
      if (faction.rivalries?.includes(otherFaction.faction_id)) return; // Already rivals
      
      const relationship = (faction.relationships || {})[otherFaction.faction_id] || 0;
      
      // Check for alliance triggers
      const triggers = [];
      
      // Shared enemy trigger
      const commonEnemies = (faction.rivalries || []).filter(rival =>
        (otherFaction.rivalries || []).includes(rival)
      );
      if (commonEnemies.length > 0) {
        triggers.push({
          type: 'common_enemy',
          strength: commonEnemies.length * 30,
          reason: `United against ${commonEnemies.join(', ')}`
        });
      }
      
      // Power balance trigger (weak factions band together)
      const combinedPower = faction.power_level + otherFaction.power_level;
      const strongestFaction = Math.max(...factions.map(f => f.power_level));
      if (faction.power_level < 50 && otherFaction.power_level < 50 && strongestFaction > 70) {
        triggers.push({
          type: 'defensive_pact',
          strength: 25,
          reason: 'Mutual protection against stronger powers'
        });
      }
      
      // Goal synergy trigger
      const goalSynergy = calculateGoalSynergy(faction, otherFaction);
      if (goalSynergy > 50) {
        triggers.push({
          type: 'strategic_alignment',
          strength: goalSynergy,
          reason: 'Aligned strategic objectives'
        });
      }
      
      // Economic interdependence
      if (faction.faction_id === 'merchant_houses' || otherFaction.faction_id === 'merchant_houses') {
        if (relationship > 30) {
          triggers.push({
            type: 'economic_alliance',
            strength: 20,
            reason: 'Economic interdependence'
          });
        }
      }
      
      // Crisis-driven alliance
      if (worldState?.world_stability < 30 && relationship > 0) {
        triggers.push({
          type: 'crisis_coalition',
          strength: 35,
          reason: 'Emergency coalition to stabilize Imperium'
        });
      }
      
      // Calculate total alliance strength
      const totalStrength = triggers.reduce((sum, t) => sum + t.strength, 0);
      const relationshipBonus = Math.max(0, relationship) * 0.5;
      const allianceScore = totalStrength + relationshipBonus;
      
      // Form alliance if score is high enough
      if (allianceScore > 60 && Math.random() > 0.7) {
        newAlliances.push({
          faction1: faction.faction_id,
          faction2: otherFaction.faction_id,
          triggers,
          strength: allianceScore,
          type: getMostSignificantTrigger(triggers),
          message: `${faction.name} and ${otherFaction.name} have formed an alliance: ${triggers[0]?.reason}`,
          turn_formed: gameState.turn_number || 0
        });
      }
    });
  });
  
  return newAlliances;
}

// Detect and form emergent rivalries
export function detectEmergentRivalries(factions, gameState, worldState) {
  const newRivalries = [];
  
  factions.forEach(faction => {
    factions.forEach(otherFaction => {
      if (faction.faction_id === otherFaction.faction_id) return;
      if (faction.rivalries?.includes(otherFaction.faction_id)) return; // Already rivals
      if (faction.alliances?.includes(otherFaction.faction_id)) return; // Can't rival allies
      
      const relationship = (faction.relationships || {})[otherFaction.faction_id] || 0;
      
      // Check for rivalry triggers
      const triggers = [];
      
      // Conflicting goals
      const goalConflict = calculateGoalConflict(faction, otherFaction);
      if (goalConflict > 50) {
        triggers.push({
          type: 'ideological_conflict',
          strength: goalConflict,
          reason: 'Fundamentally opposed objectives'
        });
      }
      
      // Territory dispute
      const territoryConflict = checkTerritoryDispute(faction, otherFaction, worldState);
      if (territoryConflict) {
        triggers.push({
          type: 'territorial_dispute',
          strength: 40,
          reason: `Both claim ${territoryConflict.territory}`
        });
      }
      
      // Power competition (two strong factions)
      if (faction.power_level > 65 && otherFaction.power_level > 65) {
        triggers.push({
          type: 'hegemonic_rivalry',
          strength: 35,
          reason: 'Competition for dominance'
        });
      }
      
      // Historical grievances
      if (relationship < -30) {
        triggers.push({
          type: 'historical_animosity',
          strength: Math.abs(relationship) * 0.8,
          reason: 'Long-standing grievances'
        });
      }
      
      // Alliance with rival's enemy
      if (faction.alliances && otherFaction.rivalries) {
        const competingAlliances = faction.alliances.filter(ally =>
          otherFaction.rivalries.includes(ally)
        );
        if (competingAlliances.length > 0) {
          triggers.push({
            type: 'alliance_conflict',
            strength: 30,
            reason: `Allied with ${otherFaction.name}'s enemies`
          });
        }
      }
      
      // Calculate total rivalry strength
      const totalStrength = triggers.reduce((sum, t) => sum + t.strength, 0);
      const relationshipPenalty = Math.max(0, -relationship) * 0.5;
      const rivalryScore = totalStrength + relationshipPenalty;
      
      // Form rivalry if score is high enough
      if (rivalryScore > 60 && Math.random() > 0.65) {
        newRivalries.push({
          faction1: faction.faction_id,
          faction2: otherFaction.faction_id,
          triggers,
          strength: rivalryScore,
          type: getMostSignificantTrigger(triggers),
          message: `⚔️ ${faction.name} and ${otherFaction.name} have declared rivalry: ${triggers[0]?.reason}`,
          turn_formed: gameState.turn_number || 0,
          escalation_risk: rivalryScore > 80 ? 'high' : 'moderate'
        });
      }
    });
  });
  
  return newRivalries;
}

// Calculate goal synergy between factions
function calculateGoalSynergy(faction1, faction2) {
  const goals1 = faction1.long_term_goals || [];
  const goals2 = faction2.long_term_goals || [];
  
  let synergy = 0;
  
  goals1.forEach(g1 => {
    goals2.forEach(g2 => {
      // Check synergies
      if (g1.synergizes_with?.includes(g2.type)) {
        synergy += 20;
      }
      if (g2.synergizes_with?.includes(g1.type)) {
        synergy += 20;
      }
      // Same non-competitive goal type
      if (g1.type === g2.type && !['power', 'dominance', 'hegemony'].includes(g1.type)) {
        synergy += 15;
      }
    });
  });
  
  return Math.min(100, synergy);
}

// Calculate goal conflict between factions
function calculateGoalConflict(faction1, faction2) {
  const goals1 = faction1.long_term_goals || [];
  const goals2 = faction2.long_term_goals || [];
  
  let conflict = 0;
  
  goals1.forEach(g1 => {
    goals2.forEach(g2 => {
      // Check conflicts
      if (g1.conflicts_with?.includes(g2.type)) {
        conflict += 25;
      }
      if (g2.conflicts_with?.includes(g1.type)) {
        conflict += 25;
      }
      // Same competitive goal type
      if (g1.type === g2.type && g1.subtype === g2.subtype && 
          ['power', 'dominance', 'hegemony', 'control'].includes(g1.type)) {
        conflict += 30;
      }
      // Both want same resources
      if (g1.type === 'resource_acquisition' && g2.type === 'resource_acquisition') {
        conflict += 20;
      }
    });
  });
  
  return Math.min(100, conflict);
}

// Check for territory disputes
function checkTerritoryDispute(faction1, faction2, worldState) {
  if (!worldState?.territory_control) return null;
  
  const territories = Object.entries(worldState.territory_control);
  
  for (const [territory, controller] of territories) {
    // Both factions want contested territory
    if (controller === 'contested') {
      const faction1Wants = faction1.desired_territories?.includes(territory);
      const faction2Wants = faction2.desired_territories?.includes(territory);
      if (faction1Wants && faction2Wants) {
        return { territory, type: 'contested' };
      }
    }
    
    // One faction controls, other wants it
    if (controller === faction1.faction_id && faction2.desired_territories?.includes(territory)) {
      return { territory, type: 'claimed' };
    }
    if (controller === faction2.faction_id && faction1.desired_territories?.includes(territory)) {
      return { territory, type: 'claimed' };
    }
  }
  
  return null;
}

function getMostSignificantTrigger(triggers) {
  if (triggers.length === 0) return 'general';
  return triggers.reduce((max, t) => t.strength > max.strength ? t : max, triggers[0]).type;
}

// Check if alliance/rivalry should naturally dissolve
export function checkRelationshipStability(faction, otherFactionId, relationship, gameState) {
  const isAllied = faction.alliances?.includes(otherFactionId);
  const isRival = faction.rivalries?.includes(otherFactionId);
  
  // Alliance dissolution triggers
  if (isAllied) {
    if (relationship < 20) {
      return {
        should_dissolve: true,
        type: 'alliance',
        reason: 'Relations have deteriorated too far',
        message: `Alliance between ${faction.name} and ${otherFactionId} has dissolved due to poor relations`
      };
    }
  }
  
  // Rivalry resolution triggers
  if (isRival) {
    if (relationship > 40) {
      return {
        should_dissolve: true,
        type: 'rivalry',
        reason: 'Relations have improved significantly',
        message: `Rivalry between ${faction.name} and ${otherFactionId} has ended - relations normalized`
      };
    }
  }
  
  return { should_dissolve: false };
}