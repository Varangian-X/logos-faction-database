// Market manipulation actions and their effects

export const manipulationActions = {
  corner_market: {
    id: 'corner_market',
    name: 'Corner Market',
    cost: 2000,
    requiredSkill: 'negotiation',
    requiredLevel: 5,
    duration: 5,
    effects: {
      price_control: 0.3,
      supply_reduction: 20,
      stability_impact: -10,
      detection_risk: 0.4
    }
  },
  spread_rumors: {
    id: 'spread_rumors',
    name: 'Spread Rumors',
    cost: 1500,
    requiredSkill: 'espionage',
    requiredLevel: 4,
    duration: 3,
    effects: {
      demand_increase: 30,
      stability_impact: -5,
      detection_risk: 0.3
    }
  },
  sabotage_supply: {
    id: 'sabotage_supply',
    name: 'Sabotage Supply Lines',
    cost: 1000,
    requiredSkill: 'espionage',
    requiredLevel: 3,
    duration: 4,
    effects: {
      supply_reduction: 40,
      stability_impact: -15,
      detection_risk: 0.5
    }
  },
  price_fixing: {
    id: 'price_fixing',
    name: 'Price Fixing Cartel',
    cost: 3000,
    requiredSkill: 'negotiation',
    requiredLevel: 6,
    duration: 8,
    effects: {
      price_control: 0.5,
      stability_impact: -20,
      detection_risk: 0.6,
      requires_influence: 50
    }
  }
};

export const executeManipulation = (action, resourceId, market, skills) => {
  const actionData = manipulationActions[action];
  if (!actionData) return null;
  
  const skill = skills[actionData.requiredSkill] || { level: 0 };
  const successChance = Math.min(95, 50 + (skill.level * 8));
  const roll = Math.random() * 100;
  
  const result = {
    success: roll <= successChance,
    detected: false,
    effects: {},
    message: ''
  };
  
  if (result.success) {
    result.effects = {
      ...actionData.effects,
      resource: resourceId,
      duration: actionData.duration,
      active: true
    };
    
    result.message = `Successfully executed ${actionData.name}! Market will be affected for ${actionData.duration} turns.`;
    
    // Immediate market impact
    const resource = market.resources[resourceId];
    if (resource) {
      if (action === 'corner_market') {
        resource.supply *= 0.6;
        resource.current_price = Math.floor(resource.current_price * 1.4);
      } else if (action === 'price_fixing') {
        resource.current_price = Math.floor(resource.current_price * 1.3);
        market.globalStability = Math.max(0, (market.globalStability || 75) - 10);
      } else if (action === 'spread_rumors') {
        resource.demand *= 1.3;
        resource.current_price = Math.floor(resource.current_price * 1.15);
      } else if (action === 'sabotage_supply') {
        resource.supply *= 0.6;
        resource.current_price = Math.floor(resource.current_price * 1.5);
        market.globalStability = Math.max(0, (market.globalStability || 75) - 15);
      }
    }
    
    // Check for detection
    const detectionRoll = Math.random();
    if (detectionRoll < actionData.effects.detection_risk) {
      result.detected = true;
      result.effects.reputation_loss = 20;
      result.effects.faction_relations_penalty = -15;
      result.message += ' WARNING: Your manipulation was detected by authorities!';
    }
  } else {
    result.message = `Failed to execute ${actionData.name}. The operation was compromised.`;
    result.effects.reputation_loss = 10;
    result.effects.credits_lost = Math.floor(actionData.cost * 0.5);
  }
  
  return result;
};

// Apply active manipulation to market
export const applyActiveManipulations = (market, activeManipulations, playerResources = {}) => {
  if (!activeManipulations || activeManipulations.length === 0) return { market, effects: [] };
  
  const updated = { ...market };
  const effects = [];
  
  activeManipulations.forEach(manip => {
    const resource = updated.resources[manip.resource];
    if (!resource) return;
    
    if (manip.price_control) {
      resource.controlled_by = 'player';
      resource.price_control_strength = manip.price_control;
      
      // Generate passive income from price control
      const income = Math.floor(resource.current_price * manip.price_control * 5);
      effects.push({ type: 'credits', amount: income, source: 'Price Control' });
    }
    
    if (manip.supply_reduction) {
      resource.supply = Math.max(20, resource.supply - (manip.supply_reduction * 0.1));
    }
    
    if (manip.demand_increase) {
      resource.demand = Math.min(200, resource.demand + (manip.demand_increase * 0.1));
    }
    
    if (manip.stability_impact) {
      updated.globalStability = Math.max(0, Math.min(100, 
        updated.globalStability + (manip.stability_impact * 0.1)
      ));
    }
  });
  
  return { market: updated, effects };
};

// Process faction counter-moves
export const processFactionCounterMoves = (market, factions, playerManipulations) => {
  const counterMoves = [];
  
  if (!playerManipulations || playerManipulations.length === 0) return counterMoves;
  
  factions.forEach(faction => {
    playerManipulations.forEach(manip => {
      const factionPower = faction.power_level || 50;
      const detectionChance = (factionPower / 100) * 0.3;
      
      if (Math.random() < detectionChance) {
        counterMoves.push({
          faction: faction.name,
          action: 'counter_manipulation',
          target_resource: manip.resource,
          effect: `${faction.name} is working to restore market balance`,
          impact: {
            reduce_control: 0.2,
            increase_supply: 15
          }
        });
        
        // Apply counter-effect
        const resource = market.resources[manip.resource];
        if (resource) {
          resource.supply = Math.min(200, resource.supply + 15);
          if (resource.price_control_strength) {
            resource.price_control_strength *= 0.8;
          }
        }
      }
    });
  });
  
  return counterMoves;
};