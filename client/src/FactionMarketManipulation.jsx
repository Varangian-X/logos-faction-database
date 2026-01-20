// Faction Market Manipulation - AI factions manipulate markets based on goals

// Generate faction market manipulation actions
export function generateFactionMarketActions(faction, marketPrices, allFactions, worldState) {
  const actions = [];
  
  // Only economically-focused factions manipulate often
  const manipulationChance = faction.faction_id === 'merchant_houses' ? 0.4 : 0.15;
  
  if (Math.random() > manipulationChance) return actions;
  
  const goals = faction.long_term_goals || [];
  
  // Price fixing for profit
  if (faction.faction_id === 'merchant_houses' && faction.resources > 2500) {
    const profitableResource = findProfitableResource(marketPrices);
    if (profitableResource && Math.random() > 0.6) {
      actions.push({
        type: 'price_fixing',
        faction: faction.faction_id,
        resource: profitableResource.key,
        action: 'inflate',
        investment: 2000,
        duration: 3,
        expected_profit: 3000,
        message: `${faction.name} artificially inflates ${profitableResource.name} prices`
      });
    }
  }
  
  // Embargo against rivals
  const rivals = faction.rivalries || [];
  if (rivals.length > 0 && faction.power_level > 50 && Math.random() > 0.7) {
    const target = rivals[Math.floor(Math.random() * rivals.length)];
    const strategicResource = ['quantum_cores', 'exotic_matter', 'rare_earth'][Math.floor(Math.random() * 3)];
    
    actions.push({
      type: 'embargo',
      faction: faction.faction_id,
      target_faction: target,
      resource: strategicResource,
      duration: 5,
      impact: 'severe',
      message: `${faction.name} imposes embargo on ${strategicResource} trade with ${target}`
    });
  }
  
  // Hoarding for strategic advantage
  const resourceGoal = goals.find(g => g.type === 'resource_acquisition');
  if (resourceGoal && faction.resources > 3000 && Math.random() > 0.65) {
    actions.push({
      type: 'resource_hoarding',
      faction: faction.faction_id,
      resource: 'rare_earth',
      quantity: 50,
      duration: 4,
      message: `${faction.name} begins hoarding strategic resources`
    });
  }
  
  // Dumping to crash market
  if (faction.strategic_focus === 'dominance' && Math.random() > 0.75) {
    actions.push({
      type: 'market_dumping',
      faction: faction.faction_id,
      resource: 'biomass',
      quantity: 100,
      target: 'crash_prices',
      message: `${faction.name} floods market with cheap ${faction.resource} to undercut competitors`
    });
  }
  
  // Corner the market
  if (faction.power_level > 70 && faction.resources > 5000 && Math.random() > 0.85) {
    const targetResource = 'quantum_cores';
    actions.push({
      type: 'market_corner',
      faction: faction.faction_id,
      resource: targetResource,
      investment: 4000,
      duration: 5,
      message: `🚨 ${faction.name} attempts to corner the ${targetResource} market!`
    });
  }
  
  return actions;
}

// Execute faction market manipulation
export function executeFactionManipulation(action, marketPrices, resourceCycles) {
  const updatedPrices = { ...marketPrices };
  const updatedCycles = { ...resourceCycles };
  const effects = [];
  
  switch (action.type) {
    case 'price_fixing':
      if (updatedPrices[action.resource]) {
        updatedPrices[action.resource].current = Math.round(
          updatedPrices[action.resource].current * 1.4
        );
        updatedPrices[action.resource].manipulation = {
          type: 'price_fixing',
          faction: action.faction,
          turns_remaining: action.duration
        };
        effects.push({
          type: 'price_surge',
          resource: action.resource,
          amount: 40,
          faction: action.faction
        });
      }
      break;
      
    case 'embargo':
      effects.push({
        type: 'trade_embargo',
        faction: action.faction,
        target: action.target_faction,
        resource: action.resource,
        impact: 'Supply disrupted, prices volatile'
      });
      
      if (updatedPrices[action.resource]) {
        updatedPrices[action.resource].demand = Math.min(200, 
          updatedPrices[action.resource].demand * 1.2
        );
      }
      break;
      
    case 'resource_hoarding':
      if (updatedCycles[action.resource]) {
        updatedCycles[action.resource].stockpile = Math.max(0,
          updatedCycles[action.resource].stockpile - action.quantity
        );
      }
      
      if (updatedPrices[action.resource]) {
        updatedPrices[action.resource].supply = Math.max(20,
          updatedPrices[action.resource].supply - 30
        );
      }
      
      effects.push({
        type: 'artificial_scarcity',
        resource: action.resource,
        faction: action.faction
      });
      break;
      
    case 'market_dumping':
      if (updatedPrices[action.resource]) {
        updatedPrices[action.resource].current = Math.round(
          updatedPrices[action.resource].current * 0.6
        );
        updatedPrices[action.resource].supply = Math.min(200,
          updatedPrices[action.resource].supply + 50
        );
      }
      
      effects.push({
        type: 'price_crash',
        resource: action.resource,
        amount: -40,
        faction: action.faction
      });
      break;
      
    case 'market_corner':
      if (updatedPrices[action.resource]) {
        updatedPrices[action.resource].current = Math.round(
          updatedPrices[action.resource].current * 1.8
        );
        updatedPrices[action.resource].supply = 30; // Extreme scarcity
        updatedPrices[action.resource].controlled_by = action.faction;
      }
      
      effects.push({
        type: 'market_controlled',
        resource: action.resource,
        faction: action.faction,
        severity: 'critical'
      });
      break;
  }
  
  return { prices: updatedPrices, cycles: updatedCycles, effects };
}

function findProfitableResource(marketPrices) {
  let best = null;
  let bestTrend = 0;
  
  Object.entries(marketPrices).forEach(([key, price]) => {
    if (price.trend === 'rising' && price.volatility > 0.3) {
      const trendScore = price.current / price.base;
      if (trendScore > bestTrend) {
        bestTrend = trendScore;
        best = { key, name: key };
      }
    }
  });
  
  return best;
}

// Decay manipulation effects over time
export function decayManipulationEffects(marketPrices) {
  const updated = { ...marketPrices };
  
  Object.keys(updated).forEach(resource => {
    const price = updated[resource];
    
    if (price.manipulation) {
      price.manipulation.turns_remaining -= 1;
      
      if (price.manipulation.turns_remaining <= 0) {
        delete price.manipulation;
        delete price.controlled_by;
        
        // Prices gradually return to normal
        price.current = Math.round(price.current * 0.9 + price.base * 0.1);
      }
    }
  });
  
  return updated;
}