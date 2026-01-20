// Core economic simulation system

export const RESOURCES = {
  credits: { name: 'Credits', type: 'currency', icon: '₵' },
  minerals: { name: 'Minerals', type: 'raw', icon: '⛏️', basePrice: 50 },
  metals: { name: 'Metals', type: 'raw', icon: '🔩', basePrice: 75 },
  energy: { name: 'Energy', type: 'raw', icon: '⚡', basePrice: 60 },
  food: { name: 'Food', type: 'raw', icon: '🌾', basePrice: 40 },
  components: { name: 'Components', type: 'manufactured', icon: '⚙️', basePrice: 150 },
  weapons: { name: 'Weapons', type: 'manufactured', icon: '🔫', basePrice: 200 },
  luxuries: { name: 'Luxuries', type: 'manufactured', icon: '💎', basePrice: 300 }
};

export const INFRASTRUCTURE = {
  mine: {
    name: 'Mining Complex',
    cost: 5000,
    upkeep: 200,
    produces: { minerals: 10 },
    buildTime: 2,
    requirements: {}
  },
  refinery: {
    name: 'Refinery',
    cost: 8000,
    upkeep: 350,
    produces: { metals: 8 },
    consumes: { minerals: 5 },
    buildTime: 3,
    requirements: {}
  },
  powerplant: {
    name: 'Power Plant',
    cost: 7000,
    upkeep: 300,
    produces: { energy: 12 },
    buildTime: 2,
    requirements: {}
  },
  farm: {
    name: 'Agricultural Zone',
    cost: 4000,
    upkeep: 150,
    produces: { food: 15 },
    buildTime: 2,
    requirements: {}
  },
  factory: {
    name: 'Factory',
    cost: 12000,
    upkeep: 500,
    produces: { components: 5 },
    consumes: { metals: 8, energy: 6 },
    buildTime: 4,
    requirements: { refinery: 1 }
  },
  armory: {
    name: 'Armory',
    cost: 15000,
    upkeep: 600,
    produces: { weapons: 4 },
    consumes: { metals: 10, components: 3 },
    buildTime: 4,
    requirements: { factory: 1 }
  },
  trade_hub: {
    name: 'Trade Hub',
    cost: 10000,
    upkeep: 400,
    tradeBonus: 0.15,
    buildTime: 3,
    requirements: {}
  },
  luxury_workshop: {
    name: 'Luxury Workshop',
    cost: 20000,
    upkeep: 800,
    produces: { luxuries: 3 },
    consumes: { metals: 5, components: 4 },
    buildTime: 5,
    requirements: { factory: 1 }
  }
};

export function calculateResourceProduction(infrastructure = [], marketPrices = {}) {
  const production = {};
  const consumption = {};
  
  infrastructure.forEach(building => {
    if (building.status !== 'active') return;
    
    const type = INFRASTRUCTURE[building.type];
    if (!type) return;
    
    // Add production
    if (type.produces) {
      Object.entries(type.produces).forEach(([resource, amount]) => {
        production[resource] = (production[resource] || 0) + amount * (building.efficiency || 1);
      });
    }
    
    // Add consumption
    if (type.consumes) {
      Object.entries(type.consumes).forEach(([resource, amount]) => {
        consumption[resource] = (consumption[resource] || 0) + amount;
      });
    }
  });
  
  return { production, consumption };
}

export function calculateNetIncome(infrastructure, resources, marketPrices) {
  const { production, consumption } = calculateResourceProduction(infrastructure, marketPrices);
  
  let netCredits = 0;
  
  // Calculate surplus to sell
  Object.entries(production).forEach(([resource, amount]) => {
    const consumed = consumption[resource] || 0;
    const surplus = amount - consumed;
    
    if (surplus > 0) {
      const price = marketPrices[resource] || RESOURCES[resource]?.basePrice || 0;
      netCredits += surplus * price;
    }
  });
  
  // Calculate deficit to buy
  Object.entries(consumption).forEach(([resource, amount]) => {
    const produced = production[resource] || 0;
    const deficit = amount - produced;
    
    if (deficit > 0) {
      const price = marketPrices[resource] || RESOURCES[resource]?.basePrice || 0;
      netCredits -= deficit * price * 1.2; // 20% markup for buying
    }
  });
  
  // Subtract upkeep
  const totalUpkeep = infrastructure
    .filter(b => b.status === 'active')
    .reduce((sum, b) => sum + (INFRASTRUCTURE[b.type]?.upkeep || 0), 0);
  
  netCredits -= totalUpkeep;
  
  return {
    netCredits,
    production,
    consumption,
    totalUpkeep
  };
}

export function canBuildInfrastructure(type, currentInfrastructure, resources) {
  const building = INFRASTRUCTURE[type];
  if (!building) return { canBuild: false, reason: 'Unknown building type' };
  
  // Check cost
  if ((resources.credits || 0) < building.cost) {
    return { canBuild: false, reason: 'Insufficient credits' };
  }
  
  // Check requirements
  if (building.requirements) {
    for (const [reqType, reqCount] of Object.entries(building.requirements)) {
      const existing = currentInfrastructure.filter(b => b.type === reqType && b.status === 'active').length;
      if (existing < reqCount) {
        return { canBuild: false, reason: `Requires ${reqCount} ${INFRASTRUCTURE[reqType]?.name}` };
      }
    }
  }
  
  return { canBuild: true };
}

export function updateMarketPrices(currentPrices, globalSupply, globalDemand, volatility = 0.1) {
  const newPrices = {};
  
  Object.keys(RESOURCES).forEach(resource => {
    if (resource === 'credits') return;
    
    const basePrice = RESOURCES[resource].basePrice;
    const currentPrice = currentPrices[resource] || basePrice;
    
    const supply = globalSupply[resource] || 0;
    const demand = globalDemand[resource] || 0;
    
    // Supply/demand ratio affects price
    const ratio = demand / Math.max(1, supply);
    let priceChange = (ratio - 1) * 0.15; // 15% max change per turn from supply/demand
    
    // Add random volatility
    priceChange += (Math.random() - 0.5) * volatility;
    
    // Apply change
    let newPrice = currentPrice * (1 + priceChange);
    
    // Clamp to reasonable range (50% to 200% of base)
    newPrice = Math.max(basePrice * 0.5, Math.min(basePrice * 2, newPrice));
    
    newPrices[resource] = Math.round(newPrice);
  });
  
  return newPrices;
}