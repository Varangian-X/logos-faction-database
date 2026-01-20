// Production and Consumption System - AI-driven resource cycles

// Initialize production/consumption for resources
export function initializeResourceCycles() {
  return {
    helium3: { production: 100, consumption: 90, stockpile: 500 },
    rare_earth: { production: 80, consumption: 85, stockpile: 400 },
    exotic_matter: { production: 50, consumption: 60, stockpile: 200 },
    quantum_cores: { production: 30, consumption: 35, stockpile: 150 },
    biomass: { production: 120, consumption: 100, stockpile: 600 },
    nanomaterials: { production: 70, consumption: 75, stockpile: 350 }
  };
}

// Process production/consumption cycles
export function processResourceCycles(cycles, factions, worldState, marketPrices, turnNumber) {
  const updated = { ...cycles };
  const events = [];
  const supplyChanges = {};
  
  Object.keys(updated).forEach(resource => {
    const cycle = updated[resource];
    
    // Calculate faction production modifiers
    const factionProductionMod = calculateFactionProductionImpact(resource, factions);
    const adjustedProduction = Math.round(cycle.production * factionProductionMod);
    
    // Calculate faction consumption modifiers
    const factionConsumptionMod = calculateFactionConsumptionImpact(resource, factions, worldState);
    const adjustedConsumption = Math.round(cycle.consumption * factionConsumptionMod);
    
    // World state impacts
    const worldMod = getWorldStateModifier(worldState);
    const finalProduction = Math.round(adjustedProduction * worldMod.production);
    const finalConsumption = Math.round(adjustedConsumption * worldMod.consumption);
    
    // Update stockpile
    const netChange = finalProduction - finalConsumption;
    cycle.stockpile = Math.max(0, cycle.stockpile + netChange);
    
    // Calculate supply level for market
    const supplyLevel = Math.round((cycle.stockpile / 500) * 100);
    supplyChanges[resource] = Math.max(20, Math.min(200, supplyLevel));
    
    // Generate scarcity events
    if (cycle.stockpile < 100) {
      events.push({
        type: 'resource_scarcity',
        resource,
        severity: cycle.stockpile < 50 ? 'critical' : 'moderate',
        message: `⚠️ ${resource} stockpiles critically low - prices surge!`,
        price_impact: 0.5
      });
    }
    
    // Generate surplus events
    if (cycle.stockpile > 800) {
      events.push({
        type: 'resource_surplus',
        resource,
        message: `${resource} oversupply detected - prices drop`,
        price_impact: -0.3
      });
    }
    
    // Production disruption events
    if (Math.random() > 0.95) {
      const disruptionTypes = ['mining_accident', 'facility_sabotage', 'worker_strike', 'equipment_failure'];
      const disruption = disruptionTypes[Math.floor(Math.random() * disruptionTypes.length)];
      
      cycle.production = Math.round(cycle.production * 0.7);
      cycle.disruption = { type: disruption, turns_remaining: 2 };
      
      events.push({
        type: 'production_disruption',
        resource,
        disruption,
        message: `Production disruption: ${disruption} affects ${resource} output`,
        price_impact: 0.3
      });
    }
    
    // Recover from disruptions
    if (cycle.disruption) {
      cycle.disruption.turns_remaining -= 1;
      if (cycle.disruption.turns_remaining <= 0) {
        cycle.production = Math.round(cycle.production / 0.7);
        delete cycle.disruption;
      }
    }
  });
  
  return { cycles: updated, events, supplyChanges };
}

function calculateFactionProductionImpact(resource, factions) {
  let modifier = 1.0;
  
  factions.forEach(faction => {
    // Merchant houses boost all production
    if (faction.faction_id === 'merchant_houses' && faction.power_level > 60) {
      modifier *= 1.1;
    }
    
    // Check for resource acquisition goals
    const hasResourceGoal = (faction.long_term_goals || []).some(g => 
      g.type === 'resource_acquisition' && g.progress > 50
    );
    
    if (hasResourceGoal) {
      modifier *= 1.15;
    }
    
    // Wars reduce production
    if ((faction.rivalries || []).length > 2) {
      modifier *= 0.9;
    }
  });
  
  return modifier;
}

function calculateFactionConsumptionImpact(resource, factions, worldState) {
  let modifier = 1.0;
  
  // Strategic resources consumed more during conflicts
  const totalWars = factions.reduce((sum, f) => sum + (f.rivalries?.length || 0), 0);
  if (totalWars > 5 && ['quantum_cores', 'exotic_matter'].includes(resource)) {
    modifier *= 1.3;
  }
  
  // Low stability increases consumption
  if (worldState?.world_stability < 40) {
    modifier *= 1.2;
  }
  
  // Economic boom increases consumption
  if (worldState?.economic_state === 'boom') {
    modifier *= 1.4;
  } else if (worldState?.economic_state === 'recession') {
    modifier *= 0.7;
  }
  
  return modifier;
}

function getWorldStateModifier(worldState) {
  const stability = worldState?.world_stability || 75;
  
  return {
    production: stability > 60 ? 1.0 : 0.8,
    consumption: stability < 40 ? 1.2 : 1.0
  };
}

// Apply supply changes to market prices
export function applyCyclesToMarket(marketPrices, supplyChanges, events) {
  const updated = { ...marketPrices };
  
  Object.entries(supplyChanges).forEach(([resource, newSupply]) => {
    if (updated[resource]) {
      updated[resource].supply = newSupply;
    }
  });
  
  // Apply event impacts
  events.forEach(event => {
    if (event.price_impact && updated[event.resource]) {
      const price = updated[event.resource];
      price.current = Math.round(price.current * (1 + event.price_impact));
    }
  });
  
  return updated;
}