// Colony Management System

export const PLANET_TYPES = {
  terran: {
    name: 'Terran World',
    base_population_capacity: 10000,
    resource_modifiers: { food: 1.5, production: 1.0, research: 1.0 },
    colonization_cost: 5000
  },
  oceanic: {
    name: 'Oceanic World',
    base_population_capacity: 8000,
    resource_modifiers: { food: 2.0, production: 0.7, research: 1.2 },
    colonization_cost: 6000
  },
  arid: {
    name: 'Arid World',
    base_population_capacity: 6000,
    resource_modifiers: { food: 0.5, production: 1.3, research: 0.8 },
    colonization_cost: 4000
  },
  frozen: {
    name: 'Frozen World',
    base_population_capacity: 4000,
    resource_modifiers: { food: 0.3, production: 0.8, research: 1.5 },
    colonization_cost: 7000
  },
  volcanic: {
    name: 'Volcanic World',
    base_population_capacity: 5000,
    resource_modifiers: { food: 0.4, production: 1.8, research: 0.6 },
    colonization_cost: 8000
  },
  gas_mining: {
    name: 'Gas Mining Station',
    base_population_capacity: 2000,
    resource_modifiers: { food: 0, production: 0.5, research: 2.0 },
    colonization_cost: 10000
  }
};

export const COLONY_TRAITS = {
  mineral_rich: { name: 'Mineral Rich', production: 30, maintenance: 10 },
  ancient_ruins: { name: 'Ancient Ruins', research: 40, tourism: 20 },
  strategic_location: { name: 'Strategic Location', trade: 30, influence: 15 },
  hostile_fauna: { name: 'Hostile Fauna', happiness: -15, defense: 20 },
  lush_biosphere: { name: 'Lush Biosphere', food: 40, happiness: 20 },
  unstable_core: { name: 'Unstable Core', production: 20, maintenance: 30 },
  ideal_climate: { name: 'Ideal Climate', population_growth: 50, happiness: 15 }
};

export function initializeColony(planet, gameState) {
  const planetType = PLANET_TYPES[planet.type] || PLANET_TYPES.terran;
  
  return {
    id: `colony_${Date.now()}`,
    planet_id: planet.id,
    name: planet.name,
    type: planet.type,
    established_turn: gameState.turn_number,
    
    population: {
      current: 1000,
      capacity: planetType.base_population_capacity,
      growth_rate: 2.5,
      happiness: 60
    },
    
    resources: {
      food: { production: 100, consumption: 50, stored: 500 },
      production: { output: 50, allocated: 0 },
      research: { output: 30, allocated: 0 },
      credits_income: 100
    },
    
    traits: planet.traits || [],
    structures: [],
    development_queue: [],
    stability: 70
  };
}

export function processColonyTurn(colony, empirePolicies = {}) {
  // Population growth
  const growthModifier = 1 + (colony.population.happiness - 50) / 100;
  const policyGrowth = empirePolicies.population_focus ? 1.5 : 1.0;
  
  const populationGrowth = Math.floor(
    colony.population.current * 
    (colony.population.growth_rate / 100) * 
    growthModifier * 
    policyGrowth
  );
  
  colony.population.current = Math.min(
    colony.population.capacity,
    colony.population.current + populationGrowth
  );
  
  // Resource production
  updateResourceProduction(colony, empirePolicies);
  
  // Happiness calculation
  updateHappiness(colony, empirePolicies);
  
  // Stability
  updateStability(colony, empirePolicies);
  
  // Process construction queue
  processConstructionQueue(colony);
  
  return {
    population_growth: populationGrowth,
    resource_changes: colony.resources,
    happiness_change: 0, // Would calculate delta
    stability: colony.stability
  };
}

function updateResourceProduction(colony, policies) {
  const planetType = PLANET_TYPES[colony.type];
  const popFactor = colony.population.current / 1000;
  
  // Food
  let foodProd = 50 * popFactor * planetType.resource_modifiers.food;
  colony.traits.forEach(traitId => {
    if (COLONY_TRAITS[traitId]?.food) foodProd *= (1 + COLONY_TRAITS[traitId].food / 100);
  });
  colony.resources.food.production = Math.floor(foodProd);
  colony.resources.food.consumption = Math.floor(colony.population.current * 0.05);
  
  // Production
  let production = 40 * popFactor * planetType.resource_modifiers.production;
  colony.traits.forEach(traitId => {
    if (COLONY_TRAITS[traitId]?.production) production *= (1 + COLONY_TRAITS[traitId].production / 100);
  });
  colony.resources.production.output = Math.floor(production);
  
  // Research
  let research = 25 * popFactor * planetType.resource_modifiers.research;
  colony.traits.forEach(traitId => {
    if (COLONY_TRAITS[traitId]?.research) research *= (1 + COLONY_TRAITS[traitId].research / 100);
  });
  colony.resources.research.output = Math.floor(research);
  
  // Credits
  colony.resources.credits_income = Math.floor(popFactor * 50);
}

function updateHappiness(colony, policies) {
  let happiness = 60; // Base
  
  // Food availability
  const foodRatio = colony.resources.food.stored / (colony.resources.food.consumption * 10);
  if (foodRatio < 0.5) happiness -= 20;
  else if (foodRatio > 2) happiness += 10;
  
  // Population density
  const density = colony.population.current / colony.population.capacity;
  if (density > 0.9) happiness -= 15;
  else if (density < 0.5) happiness += 5;
  
  // Traits
  colony.traits.forEach(traitId => {
    if (COLONY_TRAITS[traitId]?.happiness) {
      happiness += COLONY_TRAITS[traitId].happiness;
    }
  });
  
  // Structures
  colony.structures.forEach(structure => {
    if (structure.happiness_bonus) happiness += structure.happiness_bonus;
  });
  
  // Policies
  if (policies.welfare_state) happiness += 15;
  if (policies.martial_law) happiness -= 20;
  
  colony.population.happiness = Math.max(0, Math.min(100, happiness));
}

function updateStability(colony, policies) {
  let stability = 70;
  
  // Happiness impact
  stability += (colony.population.happiness - 50) * 0.4;
  
  // Defense structures
  const defenseLevel = colony.structures.filter(s => s.type === 'defense').length * 5;
  stability += defenseLevel;
  
  // Policy impact
  if (policies.martial_law) stability += 20;
  if (policies.freedom_doctrine) stability -= 10;
  
  colony.stability = Math.max(0, Math.min(100, stability));
}

function processConstructionQueue(colony) {
  if (colony.development_queue.length === 0) return;
  
  const current = colony.development_queue[0];
  current.progress += colony.resources.production.allocated;
  
  if (current.progress >= current.cost) {
    // Complete construction
    colony.structures.push(current.structure);
    colony.development_queue.shift();
  }
}

export function calculateColonyIncome(colony) {
  return {
    credits: colony.resources.credits_income,
    research: colony.resources.research.output,
    production: colony.resources.production.output,
    food_surplus: colony.resources.food.production - colony.resources.food.consumption
  };
}

export function assignPopulationFocus(colony, focus) {
  // focus: 'balanced', 'production', 'research', 'food'
  const allocations = {
    balanced: { production: 0.4, research: 0.3, food: 0.3 },
    production: { production: 0.7, research: 0.15, food: 0.15 },
    research: { production: 0.2, research: 0.7, food: 0.1 },
    food: { production: 0.2, research: 0.2, food: 0.6 }
  };
  
  colony.population_focus = focus;
  return allocations[focus];
}