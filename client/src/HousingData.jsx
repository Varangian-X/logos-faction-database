// Player Housing System Data and Configuration

export const housingTypes = {
  ship_interior: {
    id: 'ship_interior',
    name: 'Personal Starship',
    description: 'A compact vessel, your mobile home among the stars',
    base_cost: 0,
    base_capacity: 1000,
    max_tier: 5,
    imageUrl: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&q=80'
  },
  safehouse: {
    id: 'safehouse',
    name: 'Urban Safehouse',
    description: 'A hidden refuge in the city depths',
    base_cost: 2000,
    base_capacity: 1500,
    max_tier: 4,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
  },
  orbital_station: {
    id: 'orbital_station',
    name: 'Private Orbital Station',
    description: 'Your own station floating in the void',
    base_cost: 5000,
    base_capacity: 2500,
    max_tier: 5,
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80'
  },
  imperial_villa: {
    id: 'imperial_villa',
    name: 'Imperial Villa',
    description: 'Luxury estate in the Chrysopolis Heights',
    base_cost: 10000,
    base_capacity: 3000,
    max_tier: 5,
    required_reputation: 70,
    required_tier: 'chrysopolis',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
  }
};

export const housingModules = {
  // Storage Modules
  expanded_vault: {
    id: 'expanded_vault',
    name: 'Expanded Vault',
    type: 'storage',
    description: 'Increase resource storage capacity',
    cost: 500,
    capacity_bonus: 500,
    max_level: 5
  },
  secure_cache: {
    id: 'secure_cache',
    name: 'Secure Cache',
    type: 'storage',
    description: 'Protected storage for valuable resources',
    cost: 800,
    capacity_bonus: 300,
    passive_income: 50,
    max_level: 3
  },
  
  // Companion Facilities
  training_hall: {
    id: 'training_hall',
    name: 'Training Hall',
    type: 'companion',
    description: 'Advanced facility for companion training',
    cost: 1000,
    training_speed: 1.5,
    max_level: 5,
    unlocks: ['combat_training', 'tactical_training', 'leadership_training']
  },
  meditation_chamber: {
    id: 'meditation_chamber',
    name: 'Meditation Chamber',
    type: 'companion',
    description: 'Restore companion loyalty and trust over time',
    cost: 800,
    passive_loyalty_gain: 5,
    max_level: 3
  },
  sparring_arena: {
    id: 'sparring_arena',
    name: 'Sparring Arena',
    type: 'companion',
    description: 'Companions gain combat experience passively',
    cost: 1200,
    passive_xp: 10,
    max_level: 4
  },
  
  // Crafting Facilities
  tech_workshop: {
    id: 'tech_workshop',
    name: 'Tech Workshop',
    type: 'crafting',
    description: 'Craft advanced augmentations and technology',
    cost: 1500,
    crafting_speed: 1.3,
    max_level: 5,
    unlocks: ['augmentation_crafting', 'tech_items']
  },
  chemical_lab: {
    id: 'chemical_lab',
    name: 'Chemical Laboratory',
    type: 'crafting',
    description: 'Create consumables and enhancements',
    cost: 1000,
    crafting_speed: 1.2,
    max_level: 4,
    unlocks: ['consumables', 'stims']
  },
  fabrication_bay: {
    id: 'fabrication_bay',
    name: 'Fabrication Bay',
    type: 'crafting',
    description: 'Mass produce items at reduced cost',
    cost: 2000,
    cost_reduction: 0.8,
    max_level: 3,
    unlocks: ['mass_production']
  },
  
  // Utility Modules
  intelligence_hub: {
    id: 'intelligence_hub',
    name: 'Intelligence Hub',
    type: 'utility',
    description: 'Passive intel generation and analysis',
    cost: 1200,
    passive_intel: 5,
    max_level: 5
  },
  trophy_hall: {
    id: 'trophy_hall',
    name: 'Trophy Hall',
    type: 'utility',
    description: 'Display more trophies and gain reputation',
    cost: 800,
    trophy_slots: 5,
    passive_reputation: 2,
    max_level: 4
  },
  command_center: {
    id: 'command_center',
    name: 'Command Center',
    type: 'utility',
    description: 'Coordinate operations and manage assets',
    cost: 1500,
    passive_influence: 3,
    max_level: 5
  }
};

export const craftingRecipes = {
  combat_stim: {
    id: 'combat_stim',
    name: 'Combat Stimulant',
    description: 'Temporarily boost combat effectiveness',
    category: 'consumable',
    craft_time: 1,
    ingredients: { credits: 200, chemicals: 1 },
    output: { type: 'buff', stat: 'combat', bonus: 2, duration: 3 }
  },
  repair_kit: {
    id: 'repair_kit',
    name: 'Repair Kit',
    description: 'Restore health during combat',
    category: 'consumable',
    craft_time: 1,
    ingredients: { credits: 150, tech_parts: 1 },
    output: { type: 'heal', amount: 50 }
  },
  neural_enhancer: {
    id: 'neural_enhancer',
    name: 'Neural Enhancer',
    description: 'Basic cognitive augmentation',
    category: 'augmentation',
    craft_time: 3,
    ingredients: { credits: 1000, rare_tech: 2, neural_tissue: 1 },
    output: { type: 'augmentation', stat: 'insight', bonus: 1 },
    requires_module: 'tech_workshop',
    requires_level: 2
  },
  tactical_implant: {
    id: 'tactical_implant',
    name: 'Tactical Implant',
    description: 'Advanced combat augmentation',
    category: 'augmentation',
    craft_time: 4,
    ingredients: { credits: 1500, rare_tech: 3, combat_data: 2 },
    output: { type: 'augmentation', stat: 'combat', bonus: 2 },
    requires_module: 'tech_workshop',
    requires_level: 3
  },
  data_analyzer: {
    id: 'data_analyzer',
    name: 'Data Analyzer',
    description: 'Tool for extracting intel from sources',
    category: 'tool',
    craft_time: 2,
    ingredients: { credits: 500, tech_parts: 2 },
    output: { type: 'tool', use: 'intel_extraction', bonus: 25 }
  }
};

export const companionTrainingTypes = {
  combat_training: {
    id: 'combat_training',
    name: 'Combat Training',
    description: 'Improve combat capabilities',
    duration: 2,
    cost: 300,
    effects: { combat_level_xp: 100, health_bonus: 10 }
  },
  tactical_training: {
    id: 'tactical_training',
    name: 'Tactical Training',
    description: 'Enhance strategic thinking',
    duration: 2,
    cost: 300,
    effects: { ability_cooldown_reduction: 1, damage_bonus: 5 }
  },
  leadership_training: {
    id: 'leadership_training',
    name: 'Leadership Training',
    description: 'Boost companion effectiveness',
    duration: 3,
    cost: 500,
    effects: { loyalty_gain: 10, passive_bonus: 5 }
  },
  specialist_training: {
    id: 'specialist_training',
    name: 'Specialist Training',
    description: 'Unlock unique abilities',
    duration: 4,
    cost: 800,
    effects: { unlock_ability: true },
    requires_level: 3
  }
};

export const trophyCategories = {
  combat: {
    name: 'Combat Victories',
    color: 'text-red-400',
    icon: 'Sword'
  },
  diplomatic: {
    name: 'Diplomatic Triumphs',
    color: 'text-purple-400',
    icon: 'Users'
  },
  exploration: {
    name: 'Discoveries',
    color: 'text-cyan-400',
    icon: 'Globe'
  },
  economic: {
    name: 'Economic Achievements',
    color: 'text-amber-400',
    icon: 'Coins'
  },
  quest: {
    name: 'Quest Completions',
    color: 'text-green-400',
    icon: 'Star'
  }
};

// Generate trophy from game event
export function generateTrophy(eventType, eventData, gameState) {
  const trophies = {
    faction_alliance: {
      trophy_id: `alliance_${eventData.faction}`,
      name: `Alliance with ${eventData.faction}`,
      description: `Forged a lasting alliance with ${eventData.faction}`,
      category: 'diplomatic',
      rarity: 'rare',
      acquired_turn: gameState.turn_number
    },
    elite_quest_complete: {
      trophy_id: `quest_${eventData.quest_id}`,
      name: `Elite Mission: ${eventData.quest_name}`,
      description: eventData.quest_description,
      category: 'quest',
      rarity: 'legendary',
      acquired_turn: gameState.turn_number
    },
    location_discovery: {
      trophy_id: `discovery_${eventData.location_id}`,
      name: `Discovered ${eventData.location_name}`,
      description: `First to explore ${eventData.location_name}`,
      category: 'exploration',
      rarity: 'uncommon',
      acquired_turn: gameState.turn_number
    },
    combat_victory: {
      trophy_id: `combat_${eventData.enemy_type}_${gameState.turn_number}`,
      name: `Defeated ${eventData.enemy_name}`,
      description: `Triumphed over ${eventData.enemy_name} in combat`,
      category: 'combat',
      rarity: eventData.enemy_elite ? 'rare' : 'common',
      acquired_turn: gameState.turn_number
    },
    market_monopoly: {
      trophy_id: `market_${eventData.resource}`,
      name: `Market Domination: ${eventData.resource}`,
      description: `Cornered the ${eventData.resource} market`,
      category: 'economic',
      rarity: 'rare',
      acquired_turn: gameState.turn_number
    }
  };
  
  return trophies[eventType] || null;
}

// Calculate module costs with level scaling
export function calculateModuleCost(module, currentLevel) {
  if (currentLevel >= module.max_level) return null;
  return Math.floor(module.cost * Math.pow(1.5, currentLevel));
}

// Calculate housing upgrade benefits
export function calculateHousingBenefits(housing) {
  const benefits = {
    storage_capacity: housing.resource_storage?.capacity || 1000,
    passive_income: 0,
    passive_intel: 0,
    passive_influence: 0,
    passive_reputation: 0,
    training_speed: 1,
    crafting_speed: 1,
    cost_reduction: 1
  };
  
  // Calculate benefits from installed modules
  housing.customizations?.installed_modules?.forEach(module => {
    const moduleData = housingModules[module.module_id];
    if (!moduleData) return;
    
    const level = module.level || 1;
    
    if (moduleData.passive_income) benefits.passive_income += moduleData.passive_income * level;
    if (moduleData.passive_intel) benefits.passive_intel += moduleData.passive_intel * level;
    if (moduleData.passive_influence) benefits.passive_influence += moduleData.passive_influence * level;
    if (moduleData.passive_reputation) benefits.passive_reputation += moduleData.passive_reputation * level;
    if (moduleData.training_speed) benefits.training_speed *= moduleData.training_speed;
    if (moduleData.crafting_speed) benefits.crafting_speed *= moduleData.crafting_speed;
    if (moduleData.cost_reduction) benefits.cost_reduction *= moduleData.cost_reduction;
    if (moduleData.capacity_bonus) benefits.storage_capacity += moduleData.capacity_bonus * level;
  });
  
  return benefits;
}

// Check if player can craft recipe
export function canCraftRecipe(recipe, housing, playerResources) {
  // Check if module required
  if (recipe.requires_module) {
    const hasModule = housing.customizations?.installed_modules?.find(m => 
      m.module_id === recipe.requires_module && 
      m.level >= (recipe.requires_level || 1)
    );
    if (!hasModule) return { canCraft: false, reason: `Requires ${recipe.requires_module}` };
  }
  
  // Check ingredients
  for (const [resource, amount] of Object.entries(recipe.ingredients)) {
    if ((playerResources[resource] || 0) < amount) {
      return { canCraft: false, reason: `Need ${amount} ${resource}` };
    }
  }
  
  return { canCraft: true };
}