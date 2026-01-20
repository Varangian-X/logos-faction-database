// Enhanced Reputation System - Track actions and provide benefits

export const REPUTATION_TIERS = {
  REVILED: { min: -100, max: -75, name: 'Reviled', color: 'red' },
  HATED: { min: -74, max: -50, name: 'Hated', color: 'red' },
  HOSTILE: { min: -49, max: -25, name: 'Hostile', color: 'orange' },
  UNFRIENDLY: { min: -24, max: -1, name: 'Unfriendly', color: 'yellow' },
  NEUTRAL: { min: 0, max: 24, name: 'Neutral', color: 'gray' },
  FRIENDLY: { min: 25, max: 49, name: 'Friendly', color: 'green' },
  HONORED: { min: 50, max: 74, name: 'Honored', color: 'cyan' },
  REVERED: { min: 75, max: 100, name: 'Revered', color: 'purple' }
};

export const REPUTATION_BENEFITS = {
  ecclesiarchy: {
    25: { name: 'Divine Blessing', benefit: 'Access to Cathedral services', discount: 10 },
    50: { name: 'Honored Faithful', benefit: 'Sacred missions available', discount: 20 },
    75: { name: 'Chosen of the Logos', benefit: 'Divine artifacts accessible', discount: 30 }
  },
  praetorians: {
    25: { name: 'Trusted Ally', benefit: 'Military equipment access', discount: 10 },
    50: { name: 'Honorary Praetorian', benefit: 'Elite training available', discount: 20 },
    75: { name: 'Legion Champion', benefit: 'Commander authority granted', discount: 30 }
  },
  varangians: {
    25: { name: 'Shield-Brother', benefit: 'Join raids and battles', discount: 10 },
    50: { name: 'Warrior of Honor', benefit: 'Challenge for glory', discount: 20 },
    75: { name: 'Saga Legend', benefit: 'Named in the sagas', discount: 30 }
  },
  merchant_houses: {
    25: { name: 'Valued Customer', benefit: 'Better trade prices', discount: 15 },
    50: { name: 'Trade Partner', benefit: 'Exclusive deals available', discount: 25 },
    75: { name: 'Merchant Prince', benefit: 'Corporate backing granted', discount: 40 }
  },
  agentes_in_rebus: {
    25: { name: 'Asset', benefit: 'Intelligence network access', discount: 10 },
    50: { name: 'Deep Cover', benefit: 'Black ops missions available', discount: 20 },
    75: { name: 'Spymaster', benefit: 'Command intelligence operations', discount: 30 }
  },
  scrinium_barbarorum: {
    25: { name: 'Interesting Specimen', benefit: 'Xeno-tech access', discount: 10 },
    50: { name: 'Research Partner', benefit: 'Forbidden knowledge shared', discount: 20 },
    75: { name: 'Arch-Xenologist', benefit: 'Lead expeditions', discount: 30 }
  }
};

// Get reputation tier
export function getReputationTier(standing) {
  for (const tier of Object.values(REPUTATION_TIERS)) {
    if (standing >= tier.min && standing <= tier.max) {
      return tier;
    }
  }
  return REPUTATION_TIERS.NEUTRAL;
}

// Get benefits for faction
export function getFactionBenefits(factionId, standing) {
  const benefits = REPUTATION_BENEFITS[factionId] || {};
  const earned = [];
  
  Object.entries(benefits).forEach(([threshold, benefit]) => {
    if (standing >= parseInt(threshold)) {
      earned.push({ threshold: parseInt(threshold), ...benefit });
    }
  });
  
  return earned;
}

// Get next benefit threshold
export function getNextBenefit(factionId, standing) {
  const benefits = REPUTATION_BENEFITS[factionId] || {};
  const thresholds = Object.keys(benefits).map(t => parseInt(t)).sort((a, b) => a - b);
  
  for (const threshold of thresholds) {
    if (standing < threshold) {
      return {
        threshold,
        benefit: benefits[threshold],
        pointsNeeded: threshold - standing
      };
    }
  }
  
  return null;
}

// Track reputation change
export function trackReputationChange(gameState, factionId, change, reason) {
  const currentStanding = gameState.faction_relations?.[factionId] || 0;
  const newStanding = Math.max(-100, Math.min(100, currentStanding + change));
  
  const oldTier = getReputationTier(currentStanding);
  const newTier = getReputationTier(newStanding);
  const tierChanged = oldTier.name !== newTier.name;
  
  // Check for new benefits
  const oldBenefits = getFactionBenefits(factionId, currentStanding);
  const newBenefits = getFactionBenefits(factionId, newStanding);
  const unlockedBenefits = newBenefits.filter(b => 
    !oldBenefits.some(ob => ob.threshold === b.threshold)
  );
  
  return {
    newStanding,
    change,
    reason,
    oldTier: oldTier.name,
    newTier: newTier.name,
    tierChanged,
    unlockedBenefits,
    turn: gameState.turn_number
  };
}

// Apply reputation effects to game state
export function applyReputationEffects(gameState, factionId, change, reason) {
  const result = trackReputationChange(gameState, factionId, change, reason);
  
  const newState = {
    ...gameState,
    faction_relations: {
      ...gameState.faction_relations,
      [factionId]: result.newStanding
    },
    reputation_log: [
      ...(gameState.reputation_log || []),
      {
        faction: factionId,
        change: result.change,
        reason: result.reason,
        oldTier: result.oldTier,
        newTier: result.newTier,
        turn: result.turn
      }
    ]
  };
  
  return {
    newState,
    result
  };
}

// Check if player has reputation requirement for quest/dialogue
export function hasReputationRequirement(gameState, requirement) {
  if (!requirement) return true;
  
  if (requirement.faction && requirement.min_standing) {
    const standing = gameState.faction_relations?.[requirement.faction] || 0;
    return standing >= requirement.min_standing;
  }
  
  if (requirement.any_faction_min) {
    return Object.values(gameState.faction_relations || {}).some(
      standing => standing >= requirement.any_faction_min
    );
  }
  
  if (requirement.global_reputation) {
    return (gameState.reputation || 0) >= requirement.global_reputation;
  }
  
  return true;
}

// Calculate reputation multipliers from skills
export function getReputationMultiplier(gameState) {
  const bonuses = gameState.skill_bonuses || {};
  return bonuses.faction_gain_multiplier || 1.0;
}

// Award reputation with multipliers
export function awardReputation(gameState, factionId, baseChange, reason) {
  const multiplier = getReputationMultiplier(gameState);
  const actualChange = Math.round(baseChange * multiplier);
  
  return applyReputationEffects(gameState, factionId, actualChange, reason);
}