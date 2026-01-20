// Investment System - Businesses and trade routes for passive income

export const INVESTMENT_OPPORTUNITIES = {
  trade_routes: [
    {
      id: 'chrysopolis_mese',
      name: 'Chrysopolis-Mese Luxury Route',
      description: 'Transport high-value goods between upper and middle tiers',
      initial_cost: 3000,
      base_income: 150,
      risk: 0.2,
      requirements: { reputation: 40, influence: 20 }
    },
    {
      id: 'rim_stations',
      name: 'Rim Stations Supply Line',
      description: 'Essential supplies to frontier stations',
      initial_cost: 2000,
      base_income: 100,
      risk: 0.4,
      requirements: { reputation: 20 }
    },
    {
      id: 'imperial_contract',
      name: 'Imperial Military Contract',
      description: 'Deliver armaments to Neo-Praetorians',
      initial_cost: 5000,
      base_income: 300,
      risk: 0.15,
      requirements: { reputation: 60, faction_standing: { praetorians: 40 } }
    },
    {
      id: 'black_market',
      name: 'Black Market Network',
      description: 'Smuggling operation through contested zones',
      initial_cost: 4000,
      base_income: 250,
      risk: 0.6,
      requirements: { reputation: 30 },
      illegal: true
    }
  ],
  businesses: [
    {
      id: 'data_broker',
      name: 'Information Brokerage',
      description: 'Buy and sell intelligence across the Imperium',
      initial_cost: 2500,
      base_income: 120,
      risk: 0.25,
      requirements: { intel: 50, reputation: 30 },
      synergy: 'espionage'
    },
    {
      id: 'weapon_shop',
      name: 'Arms Dealership',
      description: 'Supply weapons to various factions',
      initial_cost: 4000,
      base_income: 180,
      risk: 0.3,
      requirements: { reputation: 40 },
      synergy: 'combat'
    },
    {
      id: 'research_lab',
      name: 'Private Research Lab',
      description: 'Develop and sell cutting-edge technology',
      initial_cost: 6000,
      base_income: 200,
      risk: 0.2,
      requirements: { reputation: 50, skill_level: 5 },
      synergy: 'technological'
    },
    {
      id: 'safe_house',
      name: 'Safe House Network',
      description: 'Provide shelter and services to operatives',
      initial_cost: 3500,
      base_income: 140,
      risk: 0.35,
      requirements: { reputation: 35, influence: 25 }
    },
    {
      id: 'mining_operation',
      name: 'Asteroid Mining Operation',
      description: 'Extract rare minerals from asteroid fields',
      initial_cost: 8000,
      base_income: 350,
      risk: 0.4,
      requirements: { credits: 8000, reputation: 55 }
    }
  ]
};

// Calculate investment income
export function calculateInvestmentIncome(investment, gameState, worldState, marketPrices) {
  const opportunity = findInvestmentOpportunity(investment.id);
  if (!opportunity) return 0;
  
  let income = opportunity.base_income;
  
  // World state modifiers
  const stability = worldState?.world_stability || 75;
  if (stability < 30) {
    income *= 0.5; // Crisis reduces all income
  } else if (stability > 80) {
    income *= 1.2; // Stability boosts income
  }
  
  // Economic state modifiers
  const economicState = worldState?.economic_state || 'stable';
  if (economicState === 'boom') {
    income *= 1.5;
  } else if (economicState === 'recession') {
    income *= 0.6;
  }
  
  // Risk events
  if (Math.random() < opportunity.risk) {
    const eventType = Math.random();
    if (eventType < 0.3) {
      // Minor setback
      income *= 0.5;
      investment.event = 'minor_setback';
    } else if (eventType < 0.5) {
      // Major loss
      income = 0;
      investment.event = 'major_loss';
    } else {
      // Windfall
      income *= 2;
      investment.event = 'windfall';
    }
  }
  
  // Synergy bonuses
  if (opportunity.synergy) {
    const playerGoals = gameState.long_term_goals || [];
    const hasSynergy = playerGoals.some(g => g.type === opportunity.synergy);
    if (hasSynergy) {
      income *= 1.3;
    }
  }
  
  // Market influence for trade routes
  if (opportunity.base_income && marketPrices) {
    const marketBonus = calculateMarketBonus(investment.id, marketPrices);
    income *= (1 + marketBonus);
  }
  
  return Math.round(income);
}

function findInvestmentOpportunity(id) {
  const allOpportunities = [
    ...INVESTMENT_OPPORTUNITIES.trade_routes,
    ...INVESTMENT_OPPORTUNITIES.businesses
  ];
  return allOpportunities.find(opp => opp.id === id);
}

function calculateMarketBonus(investmentId, marketPrices) {
  // Trade routes benefit from high resource prices
  if (investmentId.includes('luxury') && marketPrices.exotic_matter) {
    const priceTrend = marketPrices.exotic_matter.trend;
    if (priceTrend === 'rising') return 0.3;
  }
  
  if (investmentId.includes('military') && marketPrices.combat_aug) {
    const priceTrend = marketPrices.combat_aug.trend;
    if (priceTrend === 'rising') return 0.25;
  }
  
  return 0;
}

// Check if player can purchase investment
export function canPurchaseInvestment(opportunity, gameState) {
  const requirements = opportunity.requirements || {};
  
  if (gameState.credits < opportunity.initial_cost) {
    return { canPurchase: false, reason: 'Insufficient credits' };
  }
  
  if (requirements.reputation && gameState.reputation < requirements.reputation) {
    return { canPurchase: false, reason: `Requires ${requirements.reputation} reputation` };
  }
  
  if (requirements.influence && gameState.influence < requirements.influence) {
    return { canPurchase: false, reason: `Requires ${requirements.influence} influence` };
  }
  
  if (requirements.intel && gameState.intel < requirements.intel) {
    return { canPurchase: false, reason: `Requires ${requirements.intel} intel` };
  }
  
  if (requirements.faction_standing) {
    for (const [faction, required] of Object.entries(requirements.faction_standing)) {
      const current = (gameState.faction_relations || {})[faction] || 0;
      if (current < required) {
        return { canPurchase: false, reason: `Requires better standing with ${faction}` };
      }
    }
  }
  
  return { canPurchase: true };
}

// Upgrade investment
export function upgradeInvestment(investment, gameState) {
  const currentLevel = investment.level || 1;
  const upgradeCost = investment.initial_cost * currentLevel * 0.5;
  
  if (gameState.credits < upgradeCost) {
    return { success: false, message: 'Insufficient credits' };
  }
  
  investment.level = currentLevel + 1;
  investment.base_income = Math.round(investment.base_income * 1.4);
  
  return {
    success: true,
    cost: upgradeCost,
    message: `Investment upgraded to level ${investment.level}!`,
    new_income: investment.base_income
  };
}

// Faction investment competition
export function generateFactionInvestmentActions(factions, investments, gameState) {
  const actions = [];
  
  factions.forEach(faction => {
    // Economic-focused factions invest more
    if (faction.faction_id === 'merchant_houses' && faction.resources > 5000) {
      if (Math.random() > 0.6) {
        actions.push({
          type: 'faction_invests',
          faction: faction.faction_id,
          investment_type: 'trade_route',
          message: `${faction.name} has established a competing trade route`,
          player_impact: -0.15 // Reduces player's trade income by 15%
        });
      }
    }
    
    // Spy factions compete in information business
    if ((faction.faction_id === 'agentes_in_rebus' || faction.faction_id === 'scrinium_barbarorum') && 
        Math.random() > 0.7) {
      const playerHasDataBroker = investments.some(inv => inv.id === 'data_broker' && inv.owned_by === 'player');
      if (playerHasDataBroker) {
        actions.push({
          type: 'faction_competes',
          faction: faction.faction_id,
          target_investment: 'data_broker',
          message: `${faction.name} is competing in the intelligence market`,
          player_impact: -0.2
        });
      }
    }
  });
  
  return actions;
}

// Sabotage/protection mechanics
export function executeInvestmentSabotage(target, gameState) {
  const successChance = 0.4 + (gameState.skills?.espionage?.level || 0) * 0.1;
  
  if (Math.random() < successChance) {
    return {
      success: true,
      message: 'Sabotage successful - competitor operation disrupted',
      duration: 3,
      effect: 'competitor_disabled'
    };
  } else {
    return {
      success: false,
      message: 'Sabotage attempt detected - reputation damage',
      reputation_loss: 15,
      heat_level: 'high'
    };
  }
}