// Reputation tier definitions
export const REPUTATION_TIERS = {
  REVERED: { min: 80, label: 'Revered', color: 'text-cyan-400', benefits: 'Maximum rewards, exclusive access' },
  HONORED: { min: 60, label: 'Honored', color: 'text-green-400', benefits: 'Enhanced rewards, special missions' },
  FRIENDLY: { min: 30, label: 'Friendly', color: 'text-blue-400', benefits: 'Standard rewards, basic access' },
  NEUTRAL: { min: -20, label: 'Neutral', color: 'text-gray-400', benefits: 'Limited interactions' },
  UNFRIENDLY: { min: -50, label: 'Unfriendly', color: 'text-orange-400', benefits: 'Restricted access, higher prices' },
  HOSTILE: { min: -80, label: 'Hostile', color: 'text-red-400', benefits: 'Combat on sight, no services' },
  HATED: { min: -101, label: 'Hated', color: 'text-red-600', benefits: 'Kill on sight' }
};

export function getReputationTier(standing) {
  if (standing >= REPUTATION_TIERS.REVERED.min) return REPUTATION_TIERS.REVERED;
  if (standing >= REPUTATION_TIERS.HONORED.min) return REPUTATION_TIERS.HONORED;
  if (standing >= REPUTATION_TIERS.FRIENDLY.min) return REPUTATION_TIERS.FRIENDLY;
  if (standing >= REPUTATION_TIERS.NEUTRAL.min) return REPUTATION_TIERS.NEUTRAL;
  if (standing >= REPUTATION_TIERS.UNFRIENDLY.min) return REPUTATION_TIERS.UNFRIENDLY;
  if (standing >= REPUTATION_TIERS.HOSTILE.min) return REPUTATION_TIERS.HOSTILE;
  return REPUTATION_TIERS.HATED;
}

// Calculate reputation multipliers
export function getReputationMultipliers(standing) {
  const tier = getReputationTier(standing);
  
  switch (tier.label) {
    case 'Revered':
      return { rewards: 1.5, prices: 0.7, questAccess: 5 };
    case 'Honored':
      return { rewards: 1.3, prices: 0.85, questAccess: 4 };
    case 'Friendly':
      return { rewards: 1.1, prices: 0.95, questAccess: 3 };
    case 'Neutral':
      return { rewards: 1.0, prices: 1.0, questAccess: 2 };
    case 'Unfriendly':
      return { rewards: 0.8, prices: 1.25, questAccess: 1 };
    case 'Hostile':
      return { rewards: 0.5, prices: 1.5, questAccess: 0 };
    case 'Hated':
      return { rewards: 0, prices: 999, questAccess: 0 };
    default:
      return { rewards: 1.0, prices: 1.0, questAccess: 2 };
  }
}

// Check if player can access faction-specific content
export function canAccessFactionContent(standing, requiredTier = 'FRIENDLY') {
  const playerTier = getReputationTier(standing);
  const required = REPUTATION_TIERS[requiredTier];
  return standing >= required.min;
}

// Calculate reputation change impact on relationships
export function calculateReputationImpact(currentStanding, change) {
  const oldTier = getReputationTier(currentStanding);
  const newStanding = Math.max(-100, Math.min(100, currentStanding + change));
  const newTier = getReputationTier(newStanding);
  
  return {
    newStanding,
    change,
    tierChanged: oldTier.label !== newTier.label,
    oldTier: oldTier.label,
    newTier: newTier.label
  };
}

// Get rival faction reputation penalties
export function getRivalFactionPenalties(faction, standing) {
  const rivalries = {
    ecclesiarchy: { scrinium_barbarorum: 0.5 },
    praetorians: { varangians: 0.3, scrinium_barbarorum: 0.2 },
    varangians: { praetorians: 0.3 },
    merchant_houses: { agentes_in_rebus: 0.25 },
    agentes_in_rebus: { merchant_houses: 0.25, scrinium_barbarorum: 0.3 },
    scrinium_barbarorum: { ecclesiarchy: 0.5, agentes_in_rebus: 0.3, praetorians: 0.2 }
  };
  
  const penalties = {};
  const factionRivals = rivalries[faction] || {};
  
  Object.entries(factionRivals).forEach(([rival, multiplier]) => {
    penalties[rival] = Math.floor(standing * multiplier * -1);
  });
  
  return penalties;
}

// Check if reputation allows world event trigger
export function reputationMeetsEventRequirement(factionRelations, requirement) {
  if (!requirement) return true;
  
  if (requirement.faction && requirement.min_standing) {
    const standing = factionRelations[requirement.faction] || 0;
    return standing >= requirement.min_standing;
  }
  
  if (requirement.any_hostile) {
    return Object.values(factionRelations).some(s => s <= -50);
  }
  
  if (requirement.all_friendly) {
    return Object.values(factionRelations).every(s => s >= 30);
  }
  
  return true;
}