// Dynamic Market System - AI-driven prices and trading
import { base44 } from '@/api/base44Client';

// Market categories and base items
export const MARKET_CATEGORIES = {
  resources: {
    name: 'Strategic Resources',
    items: {
      helium3: { name: 'Helium-3 Fuel', basePrice: 150, volatility: 0.3, strategic: true },
      rare_earth: { name: 'Rare Earth Metals', basePrice: 200, volatility: 0.4, strategic: true },
      exotic_matter: { name: 'Exotic Matter', basePrice: 500, volatility: 0.5, strategic: true },
      quantum_cores: { name: 'Quantum Cores', basePrice: 800, volatility: 0.6, strategic: true },
      biomass: { name: 'Bio-Engineered Materials', basePrice: 100, volatility: 0.2 },
      nanomaterials: { name: 'Nanomaterials', basePrice: 300, volatility: 0.35 }
    }
  },
  equipment: {
    name: 'Equipment & Gear',
    items: {
      combat_aug: { name: 'Combat Augmentation', basePrice: 1200, volatility: 0.2, category: 'augmentation' },
      stealth_suite: { name: 'Stealth Suite', basePrice: 1500, volatility: 0.25, category: 'equipment' },
      hacking_rig: { name: 'Advanced Hacking Rig', basePrice: 900, volatility: 0.3, category: 'equipment' },
      med_nanites: { name: 'Medical Nanites', basePrice: 600, volatility: 0.15, category: 'consumable' },
      shield_gen: { name: 'Personal Shield Generator', basePrice: 2000, volatility: 0.35, category: 'equipment' }
    }
  },
  information: {
    name: 'Intelligence & Data',
    items: {
      faction_intel: { name: 'Faction Intelligence Report', basePrice: 300, volatility: 0.5, perishable: true },
      location_data: { name: 'Location Coordinates', basePrice: 200, volatility: 0.4, perishable: true },
      tech_blueprints: { name: 'Technology Blueprints', basePrice: 1000, volatility: 0.6 },
      blackmail_data: { name: 'Compromising Data', basePrice: 500, volatility: 0.7, illegal: true },
      market_insider: { name: 'Market Insider Tips', basePrice: 400, volatility: 0.8 }
    }
  },
  ships: {
    name: 'Vessels & Transports',
    items: {
      cargo_hauler: { name: 'Cargo Hauler', basePrice: 5000, volatility: 0.15, tradeable: true },
      scout_ship: { name: 'Scout Ship', basePrice: 3000, volatility: 0.2 },
      gunship: { name: 'Gunship', basePrice: 8000, volatility: 0.3 },
      luxury_yacht: { name: 'Luxury Yacht', basePrice: 12000, volatility: 0.25 }
    }
  }
};

// Initialize market prices
export function initializeMarketPrices(gameState) {
  const prices = {};
  
  Object.entries(MARKET_CATEGORIES).forEach(([categoryKey, category]) => {
    Object.entries(category.items).forEach(([itemKey, item]) => {
      prices[itemKey] = {
        current: item.basePrice,
        base: item.basePrice,
        volatility: item.volatility,
        trend: 'stable',
        history: [item.basePrice],
        supply: 100,
        demand: 100,
        last_update: gameState.turn_number || 0
      };
    });
  });
  
  return prices;
}

// Update market prices based on world state
export function updateMarketPrices(marketPrices, gameState, worldState, factions) {
  const updatedPrices = { ...marketPrices };
  const events = [];
  
  Object.keys(updatedPrices).forEach(itemKey => {
    const price = updatedPrices[itemKey];
    const item = findItemByKey(itemKey);
    
    // Base volatility fluctuation
    const baseChange = (Math.random() - 0.5) * 2 * price.volatility * 0.1;
    
    // Supply and demand influence
    const supplyDemandRatio = price.demand / price.supply;
    const supplyDemandInfluence = (supplyDemandRatio - 1) * 0.15;
    
    // World state influence
    const stabilityInfluence = (75 - (worldState?.world_stability || 75)) * 0.002;
    
    // Economic state influence
    const economicMultiplier = getEconomicMultiplier(worldState?.economic_state);
    
    // Faction influence
    const factionInfluence = calculateFactionInfluence(itemKey, factions);
    
    // Calculate total change
    const totalChange = baseChange + supplyDemandInfluence + stabilityInfluence + factionInfluence;
    const newPrice = Math.max(
      price.base * 0.3, 
      Math.round(price.current * (1 + totalChange * economicMultiplier))
    );
    
    // Update price data
    updatedPrices[itemKey] = {
      ...price,
      current: newPrice,
      history: [...price.history.slice(-10), newPrice],
      trend: determineTrend(price.history.slice(-3).concat(newPrice)),
      last_update: gameState.turn_number || 0
    };
    
    // Generate significant price events
    const priceChangePercent = ((newPrice - price.current) / price.current) * 100;
    if (Math.abs(priceChangePercent) > 20) {
      events.push({
        type: 'market_shock',
        item: item?.name || itemKey,
        change: priceChangePercent,
        message: `📈 Market Alert: ${item?.name || itemKey} ${priceChangePercent > 0 ? 'surges' : 'crashes'} by ${Math.abs(Math.round(priceChangePercent))}%!`
      });
    }
  });
  
  return { prices: updatedPrices, events };
}

function getEconomicMultiplier(economicState) {
  switch (economicState) {
    case 'boom': return 1.3;
    case 'recession': return 0.7;
    default: return 1.0;
  }
}

function calculateFactionInfluence(itemKey, factions) {
  let influence = 0;
  
  factions.forEach(faction => {
    // Faction operations affect specific resources
    const operations = faction.active_operations || [];
    
    operations.forEach(op => {
      if (op.operation_type === 'economic' && itemKey.includes('rare')) {
        influence += 0.05;
      }
      if (op.operation_type === 'military' && itemKey.includes('combat')) {
        influence += 0.08;
      }
      if (op.operation_type === 'espionage' && itemKey.includes('intel')) {
        influence += 0.06;
      }
    });
  });
  
  return influence;
}

function determineTrend(priceHistory) {
  if (priceHistory.length < 2) return 'stable';
  
  const recent = priceHistory.slice(-3);
  const increasing = recent.every((price, i) => i === 0 || price >= recent[i - 1]);
  const decreasing = recent.every((price, i) => i === 0 || price <= recent[i - 1]);
  
  if (increasing) return 'rising';
  if (decreasing) return 'falling';
  return 'volatile';
}

function findItemByKey(key) {
  for (const category of Object.values(MARKET_CATEGORIES)) {
    if (category.items[key]) {
      return category.items[key];
    }
  }
  return null;
}

// Calculate transaction impact on supply/demand
export function applyTransaction(marketPrices, itemKey, quantity, isBuying) {
  const updated = { ...marketPrices };
  const price = updated[itemKey];
  
  if (!price) return updated;
  
  if (isBuying) {
    price.demand = Math.min(200, price.demand + quantity * 2);
    price.supply = Math.max(20, price.supply - quantity);
  } else {
    price.supply = Math.min(200, price.supply + quantity * 2);
    price.demand = Math.max(20, price.demand - quantity);
  }
  
  return updated;
}

// Market manipulation mechanics
export function executeMarketManipulation(manipulation, marketPrices, gameState) {
  const { type, target_item, investment, faction } = manipulation;
  const updated = { ...marketPrices };
  const price = updated[target_item];
  
  if (!price) return { success: false, message: 'Invalid target' };
  
  let successChance = 0.5;
  let impact = 0;
  
  switch (type) {
    case 'pump':
      successChance = 0.6 + (investment / 5000) * 0.3;
      impact = 0.3 + (investment / 10000) * 0.2;
      break;
    case 'dump':
      successChance = 0.5 + (investment / 5000) * 0.3;
      impact = -0.25 - (investment / 10000) * 0.15;
      break;
    case 'corner':
      successChance = 0.4 + (investment / 8000) * 0.3;
      impact = 0.5;
      break;
    case 'insider':
      successChance = 0.7;
      impact = 0;
      break;
  }
  
  const success = Math.random() < successChance;
  
  if (success) {
    if (type !== 'insider') {
      price.current = Math.round(price.current * (1 + impact));
      price.demand = Math.max(20, Math.min(200, price.demand * (1 + impact * 0.5)));
    }
    
    return {
      success: true,
      message: `Market manipulation successful!`,
      profit: type === 'insider' ? investment * 0.5 : 0,
      impact
    };
  } else {
    return {
      success: false,
      message: 'Market manipulation failed - authorities are investigating',
      reputation_loss: 10,
      faction_heat: faction
    };
  }
}

// AI faction market actions
export function generateFactionMarketActions(faction, marketPrices, worldState) {
  const actions = [];
  
  // Resource acquisition based on goals
  const resourceGoals = (faction.long_term_goals || []).filter(g => g.type === 'resource_acquisition');
  if (resourceGoals.length > 0 && faction.resources > 1500) {
    const targetResource = Math.random() > 0.5 ? 'rare_earth' : 'quantum_cores';
    actions.push({
      type: 'bulk_purchase',
      item: targetResource,
      quantity: 10,
      faction: faction.faction_id
    });
  }
  
  // Market manipulation for economic factions
  if (faction.faction_id === 'merchant_houses' && faction.resources > 3000 && Math.random() > 0.7) {
    actions.push({
      type: 'market_manipulation',
      manipulation_type: 'pump',
      target: 'helium3',
      investment: 2000,
      faction: faction.faction_id
    });
  }
  
  // Intel trading for spy factions
  if ((faction.faction_id === 'agentes_in_rebus' || faction.faction_id === 'scrinium_barbarorum') && Math.random() > 0.6) {
    actions.push({
      type: 'sell_intel',
      item: 'faction_intel',
      quantity: 5,
      faction: faction.faction_id
    });
  }
  
  return actions;
}