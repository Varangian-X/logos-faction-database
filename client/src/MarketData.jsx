// Market resources and their base properties
export const marketResources = {
  plasma_cores: {
    id: 'plasma_cores',
    name: 'Plasma Cores',
    category: 'energy',
    basePrice: 150,
    volatility: 0.3,
    demandFactors: ['military_operations', 'technological_advancement'],
    supplyFactors: ['mining_operations', 'faction_production']
  },
  neural_fiber: {
    id: 'neural_fiber',
    name: 'Neural Fiber',
    category: 'tech',
    basePrice: 80,
    volatility: 0.25,
    demandFactors: ['augmentation_demand', 'research_activity'],
    supplyFactors: ['biotech_facilities', 'faction_production']
  },
  titanium_alloy: {
    id: 'titanium_alloy',
    name: 'Titanium Alloy',
    category: 'materials',
    basePrice: 120,
    volatility: 0.2,
    demandFactors: ['construction', 'military_buildup'],
    supplyFactors: ['mining_operations', 'industrial_output']
  },
  bio_gel: {
    id: 'bio_gel',
    name: 'Bio-Gel',
    category: 'medical',
    basePrice: 100,
    volatility: 0.15,
    demandFactors: ['medical_needs', 'population_health'],
    supplyFactors: ['medical_facilities', 'faction_production']
  },
  quantum_processors: {
    id: 'quantum_processors',
    name: 'Quantum Processors',
    category: 'tech',
    basePrice: 300,
    volatility: 0.4,
    demandFactors: ['military_tech', 'research_activity', 'ai_development'],
    supplyFactors: ['high_tech_facilities', 'limited_production']
  },
  imperial_schematics: {
    id: 'imperial_schematics',
    name: 'Imperial Schematics',
    category: 'knowledge',
    basePrice: 500,
    volatility: 0.5,
    demandFactors: ['technological_advancement', 'military_research'],
    supplyFactors: ['intelligence_ops', 'black_market']
  },
  nanite_clusters: {
    id: 'nanite_clusters',
    name: 'Nanite Clusters',
    category: 'tech',
    basePrice: 60,
    volatility: 0.2,
    demandFactors: ['construction', 'repair_operations'],
    supplyFactors: ['nanoforges', 'faction_production']
  }
};

// Faction AI trading based on needs
export const processFactionTrades = (market, factions, turn) => {
  const trades = [];
  
  factions.forEach(faction => {
    const needs = calculateFactionNeeds(faction);
    const factionResources = faction.resources || 5000;
    
    needs.forEach(need => {
      const resource = market.resources[need.resource];
      if (!resource) return;
      
      if (need.action === 'buy' && factionResources >= resource.current_price * need.amount) {
        const actualAmount = Math.min(need.amount, Math.floor(factionResources / resource.current_price));
        
        trades.push({
          faction: faction.faction_id,
          type: 'buy',
          resource: need.resource,
          amount: actualAmount,
          price: resource.current_price,
          turn: turn
        });
        
        resource.supply = Math.max(20, resource.supply - actualAmount * 0.5);
        resource.demand += actualAmount * 0.3;
      } else if (need.action === 'sell') {
        trades.push({
          faction: faction.faction_id,
          type: 'sell',
          resource: need.resource,
          amount: need.amount,
          price: resource.current_price,
          turn: turn
        });
        
        resource.supply += need.amount * 0.5;
        resource.demand = Math.max(20, resource.demand - need.amount * 0.2);
      }
    });
  });
  
  return trades;
};

const calculateFactionNeeds = (faction) => {
  const needs = [];
  const focus = faction.strategic_focus || 'consolidation';
  
  if (focus === 'warfare' || focus === 'expansion') {
    needs.push({ resource: 'plasma_cores', amount: 10, action: 'buy' });
    needs.push({ resource: 'titanium_alloy', amount: 8, action: 'buy' });
  }
  
  if (focus === 'consolidation' || faction.faction_id === 'merchant_houses') {
    needs.push({ resource: 'quantum_processors', amount: 5, action: 'buy' });
    needs.push({ resource: 'nanite_clusters', amount: 12, action: 'sell' });
  }
  
  if (faction.faction_id === 'agentes_in_rebus' || focus === 'dominance') {
    needs.push({ resource: 'imperial_schematics', amount: 3, action: 'buy' });
  }
  
  if (faction.power_level < 40) {
    needs.push({ resource: 'bio_gel', amount: 5, action: 'sell' });
  }
  
  return needs;
};

// Initialize market state
export const initializeMarket = () => {
  const market = {
    resources: {},
    globalStability: 75,
    turn_initialized: 1,
    trade_history: [],
    price_history: {}
  };
  
  Object.keys(marketResources).forEach(resourceId => {
    const resource = marketResources[resourceId];
    market.resources[resourceId] = {
      current_price: resource.basePrice,
      supply: 100,
      demand: 100,
      price_trend: 0,
      controlled_by: null
    };
    market.price_history[resourceId] = [resource.basePrice];
  });
  
  return market;
};

// Calculate price based on supply and demand
export const calculatePrice = (resource, supply, demand, basePrice, volatility, stability) => {
  const supplyDemandRatio = demand / Math.max(1, supply);
  const stabilityFactor = (stability / 100) * 0.5 + 0.5;
  const priceMultiplier = Math.pow(supplyDemandRatio, volatility) * stabilityFactor;
  
  const newPrice = Math.floor(basePrice * priceMultiplier);
  return Math.max(10, newPrice);
};

// Update market based on world state
export const updateMarket = (market, worldState, factions, activeEvents) => {
  if (!market) return initializeMarket();
  
  const updated = { ...market };
  let stabilityChange = 0;
  
  // Process each resource
  Object.keys(marketResources).forEach(resourceId => {
    const resourceData = marketResources[resourceId];
    const current = updated.resources[resourceId];
    
    let supplyModifier = 1;
    let demandModifier = 1;
    
    // World event impacts
    activeEvents.forEach(event => {
      if (event.id === 'economic_boom') {
        demandModifier *= 1.3;
        supplyModifier *= 1.2;
        stabilityChange += 2;
      } else if (event.id === 'trade_war' || event.id === 'faction_war') {
        supplyModifier *= 0.7;
        stabilityChange -= 3;
        if (resourceData.category === 'energy' || resourceData.category === 'materials') {
          demandModifier *= 1.5;
        }
      } else if (event.id === 'technological_breakthrough') {
        if (resourceData.category === 'tech') {
          demandModifier *= 1.5;
        }
      } else if (event.id === 'alien_incursion') {
        if (resourceData.category === 'energy' || resourceData.category === 'materials') {
          demandModifier *= 2;
          supplyModifier *= 0.8;
        }
        stabilityChange -= 5;
      }
    });
    
    // Faction activity impacts
    factions.forEach(faction => {
      const operations = faction.active_operations || [];
      operations.forEach(op => {
        if (op.operation_type === 'military' && resourceData.demandFactors.includes('military_operations')) {
          demandModifier *= 1.15;
        } else if (op.operation_type === 'economic' && resourceData.supplyFactors.includes('faction_production')) {
          supplyModifier *= 1.2;
        }
      });
      
      // High power factions stabilize markets
      if (faction.power_level > 70) {
        stabilityChange += 0.5;
      }
    });
    
    // Natural market fluctuations
    const randomFlux = (Math.random() - 0.5) * 0.1;
    supplyModifier *= (1 + randomFlux);
    demandModifier *= (1 - randomFlux);
    
    // Update supply and demand
    current.supply = Math.max(20, Math.min(200, current.supply * supplyModifier));
    current.demand = Math.max(20, Math.min(200, current.demand * demandModifier));
    
    // Calculate new price
    const oldPrice = current.current_price;
    current.current_price = calculatePrice(
      resourceData,
      current.supply,
      current.demand,
      resourceData.basePrice,
      resourceData.volatility,
      updated.globalStability
    );
    
    // Track price trend
    current.price_trend = current.current_price - oldPrice;
    
    // Update price history
    if (!updated.price_history[resourceId]) updated.price_history[resourceId] = [];
    updated.price_history[resourceId].push(current.current_price);
    if (updated.price_history[resourceId].length > 20) {
      updated.price_history[resourceId].shift();
    }
  });
  
  // Update global stability
  updated.globalStability = Math.max(0, Math.min(100, updated.globalStability + stabilityChange));
  
  return updated;
};

// Faction AI trading decision
export const getFactionTradeDecision = (faction, market, factionResources) => {
  const decisions = [];
  
  Object.keys(marketResources).forEach(resourceId => {
    const marketData = market.resources[resourceId];
    const resourceInfo = marketResources[resourceId];
    const factionHas = factionResources[resourceId] || 0;
    
    if (marketData.current_price < resourceInfo.basePrice * 0.8 && factionHas < 50) {
      const amount = Math.floor(Math.random() * 10) + 5;
      decisions.push({
        action: 'buy',
        resource: resourceId,
        amount: amount,
        max_price: marketData.current_price * 1.1
      });
    }
    
    if (marketData.current_price > resourceInfo.basePrice * 1.2 && factionHas > 100) {
      const amount = Math.floor(Math.random() * 15) + 10;
      decisions.push({
        action: 'sell',
        resource: resourceId,
        amount: amount,
        min_price: marketData.current_price * 0.9
      });
    }
  });
  
  return decisions;
};

// Execute trade
export const executeTrade = (market, resourceId, amount, isBuying) => {
  const updated = { ...market };
  const resource = updated.resources[resourceId];
  
  if (isBuying) {
    resource.demand += amount * 0.5;
    resource.supply -= amount * 0.3;
  } else {
    resource.supply += amount * 0.5;
    resource.demand -= amount * 0.3;
  }
  
  const resourceData = marketResources[resourceId];
  resource.current_price = calculatePrice(
    resourceData,
    resource.supply,
    resource.demand,
    resourceData.basePrice,
    resourceData.volatility,
    updated.globalStability
  );
  
  return updated;
};