// Resource Management System - Income, Upkeep, and Strategic Allocation
import { base44 } from '@/api/base44Client';

// Income source types and their base values
export const incomeSourceTypes = {
  trade: {
    name: 'Trade Operations',
    icon: 'TrendingUp',
    baseIncome: 300,
    description: 'Income from merchant activities and trade routes',
    unlockRequirement: { reputation: 0 }
  },
  industry: {
    name: 'Industrial Holdings',
    icon: 'Factory',
    baseIncome: 500,
    description: 'Revenue from manufacturing and production facilities',
    unlockRequirement: { reputation: 30, credits: 5000 }
  },
  illicit: {
    name: 'Illicit Operations',
    icon: 'Users',
    baseIncome: 400,
    description: 'Income from smuggling, black market, and shadow activities',
    unlockRequirement: { reputation: 20, skills: { espionage: 3 } }
  },
  investments: {
    name: 'Financial Investments',
    icon: 'PiggyBank',
    baseIncome: 250,
    description: 'Returns from market investments and holdings',
    unlockRequirement: { credits: 10000 }
  },
  contracts: {
    name: 'Faction Contracts',
    icon: 'FileText',
    baseIncome: 350,
    description: 'Payment from active faction agreements and services',
    unlockRequirement: { influence: 30 }
  },
  territories: {
    name: 'Territorial Control',
    icon: 'MapPin',
    baseIncome: 600,
    description: 'Tax and tribute from controlled territories',
    unlockRequirement: { reputation: 50, influence: 50 }
  }
};

// Asset types and their upkeep costs
export const assetTypes = {
  fleet_small: {
    name: 'Small Fleet',
    type: 'fleet',
    icon: 'Ship',
    upkeep: 200,
    benefits: { military_strength: 10, exploration_bonus: 5 },
    description: 'A small group of ships for patrol and trade protection'
  },
  fleet_medium: {
    name: 'Medium Fleet',
    type: 'fleet',
    icon: 'Anchor',
    upkeep: 500,
    benefits: { military_strength: 30, exploration_bonus: 15 },
    description: 'A substantial fleet capable of major operations'
  },
  fleet_large: {
    name: 'Large Fleet',
    type: 'fleet',
    icon: 'Ship',
    upkeep: 1200,
    benefits: { military_strength: 75, exploration_bonus: 30, intimidation: 20 },
    description: 'A formidable armada that projects power across systems'
  },
  agent_network: {
    name: 'Agent Network',
    type: 'intelligence',
    icon: 'Users',
    upkeep: 300,
    benefits: { intel_per_turn: 10, espionage_bonus: 15 },
    description: 'Network of informants and field agents'
  },
  spy_ring: {
    name: 'Spy Ring',
    type: 'intelligence',
    icon: 'Eye',
    upkeep: 600,
    benefits: { intel_per_turn: 25, espionage_bonus: 30, sabotage_bonus: 20 },
    description: 'Elite covert operatives for high-risk missions'
  },
  research_facility: {
    name: 'Research Facility',
    type: 'infrastructure',
    icon: 'Beaker',
    upkeep: 400,
    benefits: { research_points_per_turn: 5, tech_unlock_bonus: 10 },
    description: 'Advanced laboratory for technological development'
  },
  propaganda_bureau: {
    name: 'Propaganda Bureau',
    type: 'influence',
    icon: 'Radio',
    upkeep: 250,
    benefits: { influence_per_turn: 8, diplomacy_bonus: 15 },
    description: 'Media control and public opinion manipulation'
  },
  trade_hub: {
    name: 'Trade Hub',
    type: 'economic',
    icon: 'Store',
    upkeep: 350,
    benefits: { trade_income_bonus: 25, market_access: true },
    description: 'Commercial center for trade and commerce'
  },
  training_grounds: {
    name: 'Training Grounds',
    type: 'military',
    icon: 'Swords',
    upkeep: 300,
    benefits: { combat_xp_bonus: 20, recruitment_bonus: 15 },
    description: 'Facility for training military personnel'
  },
  safe_house_network: {
    name: 'Safe House Network',
    type: 'operations',
    icon: 'Home',
    upkeep: 200,
    benefits: { operation_success_bonus: 10, escape_routes: true },
    description: 'Hidden locations for covert operations'
  }
};

// Strategic allocation options
export const allocationOptions = {
  expansion: {
    name: 'Territorial Expansion',
    icon: 'Map',
    description: 'Invest in acquiring new territories and influence',
    costPerLevel: 2000,
    effects: {
      1: { territory_claim_bonus: 10, expansion_speed: 5 },
      2: { territory_claim_bonus: 25, expansion_speed: 15, new_territory_chance: 0.3 },
      3: { territory_claim_bonus: 50, expansion_speed: 30, new_territory_chance: 0.6, influence: 20 }
    },
    maxLevel: 3
  },
  research: {
    name: 'Research & Development',
    icon: 'Lightbulb',
    description: 'Fund technological advancement and innovation',
    costPerLevel: 1500,
    effects: {
      1: { research_speed: 20, tech_unlock_chance: 0.1 },
      2: { research_speed: 50, tech_unlock_chance: 0.25, skill_xp_bonus: 10 },
      3: { research_speed: 100, tech_unlock_chance: 0.5, skill_xp_bonus: 25, breakthrough: true }
    },
    maxLevel: 3
  },
  influence: {
    name: 'Influence Campaign',
    icon: 'Users',
    description: 'Boost reputation and political influence',
    costPerLevel: 1200,
    effects: {
      1: { reputation_per_turn: 3, influence_per_turn: 5 },
      2: { reputation_per_turn: 8, influence_per_turn: 12, faction_relations_bonus: 5 },
      3: { reputation_per_turn: 15, influence_per_turn: 25, faction_relations_bonus: 15, diplomatic_immunity: true }
    },
    maxLevel: 3
  },
  military: {
    name: 'Military Buildup',
    icon: 'Swords',
    description: 'Strengthen military capabilities and readiness',
    costPerLevel: 1800,
    effects: {
      1: { combat_bonus: 10, military_strength: 15 },
      2: { combat_bonus: 25, military_strength: 40, asset_upgrade_discount: 0.2 },
      3: { combat_bonus: 50, military_strength: 100, asset_upgrade_discount: 0.4, elite_units: true }
    },
    maxLevel: 3
  },
  intelligence: {
    name: 'Intelligence Network',
    icon: 'Eye',
    description: 'Enhance espionage and information gathering',
    costPerLevel: 1400,
    effects: {
      1: { intel_per_turn: 10, espionage_bonus: 10 },
      2: { intel_per_turn: 25, espionage_bonus: 25, intrigue_cost_reduction: 0.2 },
      3: { intel_per_turn: 50, espionage_bonus: 50, intrigue_cost_reduction: 0.4, advanced_ops_unlock: true }
    },
    maxLevel: 3
  },
  consolidation: {
    name: 'Resource Consolidation',
    icon: 'Coins',
    description: 'Optimize income and reduce operating costs',
    costPerLevel: 1000,
    effects: {
      1: { income_bonus: 0.1, upkeep_reduction: 0.05 },
      2: { income_bonus: 0.25, upkeep_reduction: 0.15, trade_routes: 2 },
      3: { income_bonus: 0.5, upkeep_reduction: 0.3, trade_routes: 5, economic_mastery: true }
    },
    maxLevel: 3
  }
};

// Calculate total income from all sources
export function calculateTotalIncome(gameState) {
  let totalIncome = 0;
  const incomeSources = gameState.resource_management?.income_sources || {};
  
  Object.entries(incomeSources).forEach(([sourceKey, sourceData]) => {
    if (sourceData.active) {
      const sourceType = incomeSourceTypes[sourceKey];
      let income = sourceData.level * sourceType.baseIncome;
      
      // Apply bonuses from allocations
      const allocations = gameState.resource_management?.allocations || {};
      if (allocations.consolidation) {
        const consolidationBonus = allocationOptions.consolidation.effects[allocations.consolidation.level]?.income_bonus || 0;
        income *= (1 + consolidationBonus);
      }
      
      // Apply trade hub bonus
      const assets = gameState.resource_management?.assets || [];
      const tradeHubs = assets.filter(a => a.asset_id === 'trade_hub' && a.active).length;
      if (tradeHubs > 0 && sourceKey === 'trade') {
        income *= (1 + (0.25 * tradeHubs));
      }
      
      totalIncome += Math.floor(income);
    }
  });
  
  return totalIncome;
}

// Calculate total upkeep costs
export function calculateTotalUpkeep(gameState) {
  let totalUpkeep = 0;
  const assets = gameState.resource_management?.assets || [];
  
  assets.forEach(asset => {
    if (asset.active) {
      const assetType = assetTypes[asset.asset_id];
      let upkeep = assetType.upkeep;
      
      // Apply upkeep reduction from consolidation
      const allocations = gameState.resource_management?.allocations || {};
      if (allocations.consolidation) {
        const reduction = allocationOptions.consolidation.effects[allocations.consolidation.level]?.upkeep_reduction || 0;
        upkeep *= (1 - reduction);
      }
      
      totalUpkeep += Math.floor(upkeep);
    }
  });
  
  return totalUpkeep;
}

// Calculate net income
export function calculateNetIncome(gameState) {
  const income = calculateTotalIncome(gameState);
  const upkeep = calculateTotalUpkeep(gameState);
  return income - upkeep;
}

// Process resource turn (called at end of turn)
export async function processResourceTurn(gameState) {
  const netIncome = calculateNetIncome(gameState);
  const updates = {
    credits: gameState.credits + netIncome
  };
  
  const messages = [];
  messages.push(`💰 Net income: ${netIncome > 0 ? '+' : ''}${netIncome}₵`);
  
  // Apply allocation benefits
  const allocations = gameState.resource_management?.allocations || {};
  Object.entries(allocations).forEach(([allocKey, allocData]) => {
    const option = allocationOptions[allocKey];
    const effects = option.effects[allocData.level];
    
    if (effects.reputation_per_turn) {
      updates.reputation = (gameState.reputation || 0) + effects.reputation_per_turn;
      messages.push(`📈 Reputation +${effects.reputation_per_turn} (${allocKey})`);
    }
    
    if (effects.influence_per_turn) {
      updates.influence = (gameState.influence || 0) + effects.influence_per_turn;
      messages.push(`🎭 Influence +${effects.influence_per_turn} (${allocKey})`);
    }
    
    if (effects.intel_per_turn) {
      updates.intel = (gameState.intel || 0) + effects.intel_per_turn;
    }
    
    if (effects.research_points_per_turn) {
      const researchPoints = (gameState.research_points || 0) + effects.research_points_per_turn;
      updates.research_points = researchPoints;
    }
  });
  
  // Apply asset benefits
  const assets = gameState.resource_management?.assets || [];
  assets.forEach(asset => {
    if (asset.active) {
      const assetType = assetTypes[asset.asset_id];
      
      if (assetType.benefits.intel_per_turn) {
        updates.intel = (updates.intel || gameState.intel || 0) + assetType.benefits.intel_per_turn;
      }
      
      if (assetType.benefits.influence_per_turn) {
        updates.influence = (updates.influence || gameState.influence || 0) + assetType.benefits.influence_per_turn;
      }
      
      if (assetType.benefits.research_points_per_turn) {
        updates.research_points = (updates.research_points || gameState.research_points || 0) + assetType.benefits.research_points_per_turn;
      }
    }
  });
  
  return { updates, messages };
}

// Check if player can afford an allocation
export function canAffordAllocation(gameState, allocationKey, targetLevel) {
  const option = allocationOptions[allocationKey];
  const currentLevel = gameState.resource_management?.allocations?.[allocationKey]?.level || 0;
  
  if (targetLevel <= currentLevel) return { canAfford: false, reason: 'Already at this level' };
  if (targetLevel > option.maxLevel) return { canAfford: false, reason: 'Max level reached' };
  
  const cost = option.costPerLevel * targetLevel;
  if (gameState.credits < cost) return { canAfford: false, reason: `Need ${cost}₵`, cost };
  
  return { canAfford: true, cost };
}

// Upgrade allocation
export async function upgradeAllocation(gameStateId, allocationKey, targetLevel) {
  const gameState = (await base44.entities.GameState.filter({ id: gameStateId }))[0];
  const check = canAffordAllocation(gameState, allocationKey, targetLevel);
  
  if (!check.canAfford) {
    return { success: false, message: check.reason };
  }
  
  const allocations = gameState.resource_management?.allocations || {};
  allocations[allocationKey] = {
    level: targetLevel,
    invested_turn: gameState.turn_number
  };
  
  await base44.entities.GameState.update(gameStateId, {
    credits: gameState.credits - check.cost,
    resource_management: {
      ...gameState.resource_management,
      allocations
    }
  });
  
  return { 
    success: true, 
    message: `${allocationOptions[allocationKey].name} upgraded to level ${targetLevel}!`,
    cost: check.cost
  };
}

// Purchase asset
export async function purchaseAsset(gameStateId, assetId) {
  const gameState = (await base44.entities.GameState.filter({ id: gameStateId }))[0];
  const assetType = assetTypes[assetId];
  
  // Purchase cost is typically 10x upkeep
  const purchaseCost = assetType.upkeep * 10;
  
  if (gameState.credits < purchaseCost) {
    return { success: false, message: `Need ${purchaseCost}₵ to acquire this asset` };
  }
  
  const assets = gameState.resource_management?.assets || [];
  assets.push({
    asset_id: assetId,
    acquired_turn: gameState.turn_number,
    active: true
  });
  
  await base44.entities.GameState.update(gameStateId, {
    credits: gameState.credits - purchaseCost,
    resource_management: {
      ...gameState.resource_management,
      assets
    }
  });
  
  return {
    success: true,
    message: `${assetType.name} acquired for ${purchaseCost}₵!`,
    cost: purchaseCost
  };
}

// Activate/deactivate income source
export async function toggleIncomeSource(gameStateId, sourceKey, level = 1) {
  const gameState = (await base44.entities.GameState.filter({ id: gameStateId }))[0];
  const sourceType = incomeSourceTypes[sourceKey];
  
  // Check unlock requirements
  const req = sourceType.unlockRequirement;
  if (req.reputation && gameState.reputation < req.reputation) {
    return { success: false, message: `Requires ${req.reputation} reputation` };
  }
  if (req.credits && gameState.credits < req.credits) {
    return { success: false, message: `Requires ${req.credits}₵ to establish` };
  }
  if (req.influence && (gameState.influence || 0) < req.influence) {
    return { success: false, message: `Requires ${req.influence} influence` };
  }
  
  const incomeSources = gameState.resource_management?.income_sources || {};
  const existing = incomeSources[sourceKey];
  
  if (existing?.active) {
    // Deactivate
    incomeSources[sourceKey] = { ...existing, active: false };
  } else {
    // Activate/upgrade
    const cost = req.credits || 0;
    if (cost > 0 && gameState.credits < cost) {
      return { success: false, message: `Need ${cost}₵ to establish` };
    }
    
    incomeSources[sourceKey] = {
      level,
      active: true,
      established_turn: gameState.turn_number
    };
    
    await base44.entities.GameState.update(gameStateId, {
      credits: gameState.credits - cost,
      resource_management: {
        ...gameState.resource_management,
        income_sources: incomeSources
      }
    });
    
    return { success: true, message: `${sourceType.name} established!`, cost };
  }
  
  await base44.entities.GameState.update(gameStateId, {
    resource_management: {
      ...gameState.resource_management,
      income_sources: incomeSources
    }
  });
  
  return { success: true, message: existing.active ? 'Source deactivated' : 'Source activated' };
}