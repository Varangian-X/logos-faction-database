// Planetary Structures and Buildings

export const PLANETARY_STRUCTURES = {
  // Economic
  mining_complex: {
    id: 'mining_complex',
    name: 'Mining Complex',
    type: 'economic',
    description: 'Extracts valuable minerals and resources from the planet',
    cost: 2000,
    build_time: 3,
    maintenance: 100,
    bonuses: { production: 50, credits_income: 150 },
    requirements: {}
  },
  
  agricultural_dome: {
    id: 'agricultural_dome',
    name: 'Agricultural Dome',
    type: 'economic',
    description: 'Advanced farming complex for food production',
    cost: 1500,
    build_time: 2,
    maintenance: 80,
    bonuses: { food_production: 100, population_capacity: 500 },
    requirements: {}
  },
  
  trade_hub: {
    id: 'trade_hub',
    name: 'Trade Hub',
    type: 'economic',
    description: 'Increases commerce and credit generation',
    cost: 3000,
    build_time: 4,
    maintenance: 150,
    bonuses: { credits_income: 300, influence: 10 },
    requirements: { min_population: 3000 }
  },
  
  // Research
  research_institute: {
    id: 'research_institute',
    name: 'Research Institute',
    type: 'research',
    description: 'Advanced scientific research facility',
    cost: 2500,
    build_time: 4,
    maintenance: 120,
    bonuses: { research: 80, tech_progress: 15 },
    requirements: { min_population: 2000 }
  },
  
  xenobiology_lab: {
    id: 'xenobiology_lab',
    name: 'Xenobiology Laboratory',
    type: 'research',
    description: 'Studies alien life and technologies',
    cost: 4000,
    build_time: 5,
    maintenance: 180,
    bonuses: { research: 120, alien_tech_bonus: 25 },
    requirements: { min_population: 4000, trait: 'ancient_ruins' }
  },
  
  // Military
  defense_grid: {
    id: 'defense_grid',
    name: 'Planetary Defense Grid',
    type: 'defense',
    description: 'Orbital defense platforms protecting the planet',
    cost: 3500,
    build_time: 5,
    maintenance: 200,
    bonuses: { defense_rating: 50, stability: 15 },
    requirements: {}
  },
  
  military_academy: {
    id: 'military_academy',
    name: 'Military Academy',
    type: 'military',
    description: 'Trains elite military personnel and officers',
    cost: 2800,
    build_time: 4,
    maintenance: 150,
    bonuses: { crew_quality: 20, ship_experience_gain: 15 },
    requirements: { min_population: 3000 }
  },
  
  fortress: {
    id: 'fortress',
    name: 'Imperial Fortress',
    type: 'defense',
    description: 'Massive fortification providing ultimate defense',
    cost: 8000,
    build_time: 8,
    maintenance: 400,
    bonuses: { defense_rating: 150, stability: 30, ground_defense: 100 },
    requirements: { min_population: 6000, structures: ['defense_grid'] }
  },
  
  // Infrastructure
  spaceport: {
    id: 'spaceport',
    name: 'Orbital Spaceport',
    type: 'infrastructure',
    description: 'Major trade and transport hub',
    cost: 4000,
    build_time: 5,
    maintenance: 200,
    bonuses: { credits_income: 200, trade_routes: 2, fleet_capacity: 5 },
    requirements: { min_population: 4000 }
  },
  
  shipyard: {
    id: 'shipyard',
    name: 'Orbital Shipyard',
    type: 'military',
    description: 'Constructs and repairs fleet vessels',
    cost: 6000,
    build_time: 6,
    maintenance: 300,
    bonuses: { 
      ship_production_speed: 30, 
      ship_cost_reduction: 15,
      repair_speed: 50,
      fleet_capacity: 10
    },
    requirements: { min_population: 5000, structures: ['spaceport'] }
  },
  
  planetary_capital: {
    id: 'planetary_capital',
    name: 'Planetary Capital Complex',
    type: 'infrastructure',
    description: 'Administrative center boosting all colony outputs',
    cost: 10000,
    build_time: 10,
    maintenance: 500,
    bonuses: { 
      production: 50,
      research: 50,
      credits_income: 300,
      influence: 25,
      stability: 20,
      happiness_bonus: 15
    },
    requirements: { min_population: 8000 },
    unique: true // Only one per colony
  },
  
  // Happiness
  entertainment_complex: {
    id: 'entertainment_complex',
    name: 'Entertainment Complex',
    type: 'happiness',
    description: 'Provides leisure and entertainment for colonists',
    cost: 1500,
    build_time: 2,
    maintenance: 100,
    bonuses: { happiness_bonus: 15, credits_income: 50 },
    requirements: {}
  },
  
  medical_center: {
    id: 'medical_center',
    name: 'Advanced Medical Center',
    type: 'happiness',
    description: 'Improves healthcare and quality of life',
    cost: 2000,
    build_time: 3,
    maintenance: 120,
    bonuses: { happiness_bonus: 20, population_growth: 10 },
    requirements: { min_population: 2500 }
  }
};

export function canBuildStructure(colony, structureId) {
  const structure = PLANETARY_STRUCTURES[structureId];
  if (!structure) return { can_build: false, reason: 'Invalid structure' };
  
  // Check population
  if (structure.requirements.min_population && colony.population.current < structure.requirements.min_population) {
    return { can_build: false, reason: `Requires ${structure.requirements.min_population} population` };
  }
  
  // Check trait requirement
  if (structure.requirements.trait && !colony.traits.includes(structure.requirements.trait)) {
    return { can_build: false, reason: `Requires ${structure.requirements.trait} trait` };
  }
  
  // Check prerequisite structures
  if (structure.requirements.structures) {
    const hasPrereqs = structure.requirements.structures.every(reqId => 
      colony.structures.some(s => s.id === reqId)
    );
    if (!hasPrereqs) {
      return { can_build: false, reason: 'Missing prerequisite structures' };
    }
  }
  
  // Check if unique and already built
  if (structure.unique && colony.structures.some(s => s.id === structureId)) {
    return { can_build: false, reason: 'Already constructed (unique)' };
  }
  
  return { can_build: true };
}

export function startConstruction(colony, structureId, gameState) {
  const structure = PLANETARY_STRUCTURES[structureId];
  const canBuild = canBuildStructure(colony, structureId);
  
  if (!canBuild.can_build) {
    return { success: false, message: canBuild.reason };
  }
  
  if (gameState.credits < structure.cost) {
    return { success: false, message: 'Insufficient credits' };
  }
  
  colony.development_queue.push({
    structure: { ...structure },
    cost: structure.cost,
    progress: 0,
    started_turn: gameState.turn_number,
    completion_turn: gameState.turn_number + structure.build_time
  });
  
  gameState.credits -= structure.cost;
  
  return { 
    success: true, 
    message: `Construction of ${structure.name} started`,
    completion_turn: gameState.turn_number + structure.build_time
  };
}

export function calculateStructureBonuses(colony) {
  const bonuses = {
    production: 0,
    research: 0,
    credits_income: 0,
    food_production: 0,
    happiness_bonus: 0,
    stability: 0,
    defense_rating: 0,
    fleet_capacity: 0,
    population_capacity: 0
  };
  
  colony.structures.forEach(structure => {
    Object.keys(structure.bonuses).forEach(key => {
      if (bonuses[key] !== undefined) {
        bonuses[key] += structure.bonuses[key];
      }
    });
  });
  
  return bonuses;
}

export function calculateMaintenanceCost(colony) {
  return colony.structures.reduce((sum, structure) => sum + (structure.maintenance || 0), 0);
}