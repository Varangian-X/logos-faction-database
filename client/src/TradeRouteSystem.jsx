// Trade Route System - Dynamic routes with piracy and disruption

// Initialize trade routes
export function initializeTradeRoutes() {
  return [
    {
      id: 'chrysopolis_core',
      name: 'Chrysopolis Core Route',
      from: 'chrysopolis',
      to: 'imperial_core',
      distance: 100,
      traffic_volume: 150,
      danger_level: 0.1,
      resources_transported: ['exotic_matter', 'quantum_cores'],
      controlled_by: 'merchant_houses',
      active: true,
      profit_per_turn: 300
    },
    {
      id: 'rim_supply_line',
      name: 'Rim Station Supply Line',
      from: 'inner_worlds',
      to: 'rim_stations',
      distance: 250,
      traffic_volume: 100,
      danger_level: 0.4,
      resources_transported: ['helium3', 'biomass'],
      controlled_by: 'merchant_houses',
      active: true,
      profit_per_turn: 200
    },
    {
      id: 'mese_trade_corridor',
      name: 'Mese Trade Corridor',
      from: 'mese_district',
      to: 'trade_hub',
      distance: 80,
      traffic_volume: 200,
      danger_level: 0.2,
      resources_transported: ['nanomaterials', 'rare_earth'],
      controlled_by: 'merchant_houses',
      active: true,
      profit_per_turn: 250
    },
    {
      id: 'black_market_run',
      name: 'Black Market Route',
      from: 'cisterns',
      to: 'neutral_zone',
      distance: 150,
      traffic_volume: 50,
      danger_level: 0.7,
      resources_transported: ['all'],
      controlled_by: 'independent',
      active: true,
      profit_per_turn: 400,
      illegal: true
    }
  ];
}

// Process trade routes each turn
export function processTradeRoutes(routes, factions, worldState, gameState) {
  const updated = routes.map(route => ({ ...route }));
  const events = [];
  const impacts = {};
  
  updated.forEach(route => {
    if (!route.active) return;
    
    // Check for piracy
    const piracyRoll = Math.random();
    if (piracyRoll < route.danger_level) {
      const pirateStrength = Math.random() * 0.5 + 0.3;
      const cargoLoss = Math.round(route.traffic_volume * pirateStrength);
      
      route.traffic_volume = Math.max(20, route.traffic_volume - cargoLoss);
      route.recent_attack = {
        turn: gameState.turn_number || 0,
        loss: cargoLoss
      };
      
      events.push({
        type: 'piracy_attack',
        route: route.id,
        name: route.name,
        cargo_lost: cargoLoss,
        message: `🏴‍☠️ Pirates attack ${route.name} - ${cargoLoss} cargo lost!`,
        severity: cargoLoss > 40 ? 'high' : 'moderate'
      });
      
      // Impact resource availability
      route.resources_transported.forEach(resource => {
        impacts[resource] = (impacts[resource] || 0) - 0.15;
      });
    }
    
    // Check for faction disruption
    const disruptionCheck = checkFactionDisruption(route, factions, gameState);
    if (disruptionCheck) {
      route.disrupted = {
        by: disruptionCheck.faction,
        reason: disruptionCheck.reason,
        turns_remaining: disruptionCheck.duration
      };
      route.active = false;
      
      events.push({
        type: 'route_disrupted',
        route: route.id,
        name: route.name,
        faction: disruptionCheck.faction,
        reason: disruptionCheck.reason,
        message: `⚠️ ${disruptionCheck.faction} disrupts ${route.name}: ${disruptionCheck.reason}`,
        severity: 'high'
      });
      
      // Major impact on resource availability
      route.resources_transported.forEach(resource => {
        impacts[resource] = (impacts[resource] || 0) - 0.3;
      });
    }
    
    // Recover from disruption
    if (route.disrupted && !route.active) {
      route.disrupted.turns_remaining -= 1;
      if (route.disrupted.turns_remaining <= 0) {
        delete route.disrupted;
        route.active = true;
        route.traffic_volume = Math.round(route.traffic_volume * 1.5);
        
        events.push({
          type: 'route_restored',
          route: route.id,
          message: `${route.name} restored to operation`
        });
      }
    }
    
    // World instability increases danger
    if (worldState?.world_stability < 40) {
      route.danger_level = Math.min(0.9, route.danger_level * 1.2);
    }
    
    // Traffic recovers gradually
    if (!route.disrupted && route.traffic_volume < 150) {
      route.traffic_volume = Math.min(200, route.traffic_volume + 10);
    }
  });
  
  return { routes: updated, events, resourceImpacts: impacts };
}

function checkFactionDisruption(route, factions, gameState) {
  // Check if any faction wants to disrupt this route
  for (const faction of factions) {
    // Rivals disrupt each other's routes
    if (route.controlled_by && faction.rivalries?.includes(route.controlled_by)) {
      if (Math.random() > 0.8) {
        return {
          faction: faction.faction_id,
          reason: 'Strategic blockade',
          duration: 3
        };
      }
    }
    
    // Economic warfare
    if (faction.strategic_focus === 'dominance' && faction.power_level > 65) {
      if (Math.random() > 0.85) {
        return {
          faction: faction.faction_id,
          reason: 'Economic warfare',
          duration: 4
        };
      }
    }
    
    // Agentes in rebus sabotage
    if (faction.faction_id === 'agentes_in_rebus' && Math.random() > 0.9) {
      return {
        faction: faction.faction_id,
        reason: 'Covert sabotage',
        duration: 2
      };
    }
  }
  
  return null;
}

// Calculate route safety and profits
export function calculateRouteProfitability(route, marketPrices) {
  let profit = route.profit_per_turn;
  
  // Danger reduces profitability
  profit *= (1 - route.danger_level * 0.5);
  
  // Volume affects profit
  profit *= (route.traffic_volume / 150);
  
  // Recent attacks reduce profit
  if (route.recent_attack) {
    profit *= 0.7;
  }
  
  // Market prices for transported resources
  let marketBonus = 0;
  route.resources_transported.forEach(resource => {
    if (marketPrices[resource]?.trend === 'rising') {
      marketBonus += 50;
    }
  });
  
  return Math.round(profit + marketBonus);
}

// Player actions on trade routes
export function playerProtectRoute(route, gameState) {
  const combatSkill = gameState.skills?.combat?.level || 0;
  const successChance = 0.6 + combatSkill * 0.05;
  
  if (Math.random() < successChance) {
    route.danger_level = Math.max(0.05, route.danger_level * 0.6);
    route.traffic_volume = Math.min(200, route.traffic_volume + 30);
    
    return {
      success: true,
      message: 'Route protection successful - danger reduced',
      reputation_gain: 10,
      faction_bonus: 15
    };
  } else {
    return {
      success: false,
      message: 'Protection effort failed - pirates remain active',
      reputation_loss: 5
    };
  }
}

export function playerDisruptRoute(route, gameState) {
  const espionageSkill = gameState.skills?.espionage?.level || 0;
  const successChance = 0.5 + espionageSkill * 0.05;
  
  if (Math.random() < successChance) {
    route.disrupted = {
      by: 'player',
      reason: 'Sabotage',
      turns_remaining: 3
    };
    route.active = false;
    
    return {
      success: true,
      message: 'Route successfully disrupted',
      intel_gain: 30,
      faction_penalty: -25,
      target_faction: route.controlled_by
    };
  } else {
    return {
      success: false,
      message: 'Disruption attempt detected',
      reputation_loss: 20,
      faction_penalty: -30,
      target_faction: route.controlled_by
    };
  }
}

// Apply route impacts to market
export function applyRouteImpactsToMarket(marketPrices, resourceImpacts) {
  const updated = { ...marketPrices };
  
  Object.entries(resourceImpacts).forEach(([resource, impact]) => {
    if (updated[resource]) {
      updated[resource].supply = Math.max(20, Math.min(200,
        Math.round(updated[resource].supply * (1 + impact))
      ));
      updated[resource].current = Math.round(
        updated[resource].current * (1 - impact * 0.5)
      );
    }
  });
  
  return updated;
}