// Crafting System - Resources and Recipes

export const resources = {
  nanite_clusters: {
    id: 'nanite_clusters',
    name: 'Nanite Clusters',
    description: 'Self-replicating molecular machines',
    rarity: 'common',
    icon: 'sparkles'
  },
  neural_fiber: {
    id: 'neural_fiber',
    name: 'Neural Fiber',
    description: 'Synthetic nerve tissue for augmentations',
    rarity: 'common',
    icon: 'brain'
  },
  plasma_cores: {
    id: 'plasma_cores',
    name: 'Plasma Cores',
    description: 'High-energy power sources',
    rarity: 'uncommon',
    icon: 'zap'
  },
  titanium_alloy: {
    id: 'titanium_alloy',
    name: 'Titanium Alloy',
    description: 'Lightweight but extremely durable metal',
    rarity: 'uncommon',
    icon: 'shield'
  },
  quantum_processors: {
    id: 'quantum_processors',
    name: 'Quantum Processors',
    description: 'Advanced computational hardware',
    rarity: 'rare',
    icon: 'cpu'
  },
  bio_gel: {
    id: 'bio_gel',
    name: 'Bio-Gel',
    description: 'Medical nanites suspended in organic matrix',
    rarity: 'uncommon',
    icon: 'droplet'
  },
  imperial_schematics: {
    id: 'imperial_schematics',
    name: 'Imperial Schematics',
    description: 'Classified technology blueprints',
    rarity: 'rare',
    icon: 'file-text'
  },
  dark_matter_shard: {
    id: 'dark_matter_shard',
    name: 'Dark Matter Shard',
    description: 'Fragments of exotic matter from beyond the void',
    rarity: 'legendary',
    icon: 'star'
  }
};

export const craftingRecipes = {
  // Basic Augmentations
  basic_optics: {
    id: 'basic_optics',
    name: 'Basic Optical Enhancement',
    type: 'augmentation',
    description: 'Simple visual processing upgrade',
    requirements: {
      resources: {
        nanite_clusters: 5,
        neural_fiber: 3
      },
      skill: { engineering: 2 }
    },
    crafting_time: 1,
    result: {
      type: 'augmentation',
      id: 'basic_optics_aug',
      name: 'Basic Optical Enhancement',
      augmentation_type: 'cognitive',
      effect: 'Improved visual clarity and target acquisition',
      bonus: { accuracy_bonus: 10, investigation_bonus: 5 }
    }
  },
  
  reinforced_skeleton: {
    id: 'reinforced_skeleton',
    name: 'Reinforced Endoskeleton',
    type: 'augmentation',
    description: 'Strengthened skeletal structure',
    requirements: {
      resources: {
        titanium_alloy: 8,
        nanite_clusters: 10,
        bio_gel: 5
      },
      skill: { engineering: 4 }
    },
    crafting_time: 2,
    result: {
      type: 'augmentation',
      id: 'reinforced_endoskeleton',
      name: 'Reinforced Endoskeleton',
      augmentation_type: 'combat',
      effect: 'Reduces incoming damage by 15%',
      bonus: { damage_reduction: 15, defense_bonus: 20 }
    }
  },
  
  neural_accelerator: {
    id: 'neural_accelerator',
    name: 'Neural Accelerator',
    type: 'augmentation',
    description: 'Enhances cognitive processing speed',
    requirements: {
      resources: {
        neural_fiber: 10,
        quantum_processors: 3,
        plasma_cores: 2
      },
      skill: { engineering: 5, hacking: 3 }
    },
    crafting_time: 3,
    result: {
      type: 'augmentation',
      id: 'neural_accelerator_aug',
      name: 'Neural Accelerator MK-II',
      augmentation_type: 'cognitive',
      effect: 'Process information 40% faster, +skill XP gain',
      bonus: { skill_xp_multiplier: 1.4, hacking_bonus: 15 }
    }
  },
  
  combat_optimizer: {
    id: 'combat_optimizer',
    name: 'Combat Optimization Suite',
    type: 'augmentation',
    description: 'Comprehensive battle enhancement system',
    requirements: {
      resources: {
        quantum_processors: 5,
        titanium_alloy: 12,
        plasma_cores: 6,
        imperial_schematics: 1
      },
      skill: { engineering: 7, combat: 6 }
    },
    crafting_time: 4,
    result: {
      type: 'augmentation',
      id: 'combat_optimizer_aug',
      name: 'Combat Optimization Suite',
      augmentation_type: 'combat',
      effect: 'Full combat enhancement: damage, accuracy, and defense',
      bonus: { 
        damage_bonus: 25, 
        accuracy_bonus: 20, 
        damage_reduction: 10,
        combat_skill_bonus: 15
      }
    }
  },
  
  // Legendary Augmentation
  void_walker: {
    id: 'void_walker',
    name: 'Void Walker Implant',
    type: 'augmentation',
    description: 'Harness the power of dark matter',
    requirements: {
      resources: {
        dark_matter_shard: 3,
        quantum_processors: 10,
        imperial_schematics: 2,
        plasma_cores: 15
      },
      skill: { engineering: 10 },
      perk: 'tech_lord'
    },
    crafting_time: 5,
    result: {
      type: 'augmentation',
      id: 'void_walker_aug',
      name: 'Void Walker Implant',
      augmentation_type: 'legendary',
      effect: 'Phase through attacks, manipulate probability',
      bonus: { 
        damage_bonus: 40,
        evasion: 30,
        damage_reduction: 25,
        reality_manipulation: true
      }
    }
  },
  
  // Equipment
  plasma_blade: {
    id: 'plasma_blade',
    name: 'Plasma Blade',
    type: 'equipment',
    description: 'Superheated energy weapon',
    requirements: {
      resources: {
        plasma_cores: 8,
        titanium_alloy: 6,
        nanite_clusters: 12
      },
      skill: { engineering: 6, combat: 5 }
    },
    crafting_time: 3,
    result: {
      type: 'equipment',
      id: 'plasma_blade_weapon',
      name: 'Plasma Blade',
      equipment_type: 'weapon',
      effect: 'Deals massive energy damage, ignore armor',
      bonus: { 
        weapon_damage: [30, 50],
        armor_penetration: 50,
        combat_bonus: 20
      }
    }
  },
  
  stealth_field: {
    id: 'stealth_field',
    name: 'Stealth Field Generator',
    type: 'equipment',
    description: 'Personal cloaking device',
    requirements: {
      resources: {
        quantum_processors: 6,
        plasma_cores: 4,
        imperial_schematics: 1
      },
      skill: { engineering: 7, espionage: 5 }
    },
    crafting_time: 3,
    result: {
      type: 'equipment',
      id: 'stealth_field_device',
      name: 'Stealth Field Generator',
      equipment_type: 'utility',
      effect: 'Become invisible for short periods',
      bonus: { 
        stealth_bonus: 40,
        espionage_bonus: 25,
        combat_avoidance_chance: 30
      }
    }
  },
  
  // Consumables
  nano_repair_kit: {
    id: 'nano_repair_kit',
    name: 'Nano-Repair Kit',
    type: 'consumable',
    description: 'Emergency healing nanites',
    requirements: {
      resources: {
        nanite_clusters: 8,
        bio_gel: 6
      },
      skill: { engineering: 3 }
    },
    crafting_time: 1,
    result: {
      type: 'consumable',
      id: 'nano_repair_consumable',
      name: 'Nano-Repair Kit',
      effect: 'Restore 50 HP in combat or out',
      usage: 'instant_heal',
      value: 50
    }
  },
  
  combat_stim: {
    id: 'combat_stim',
    name: 'Combat Stimulant',
    type: 'consumable',
    description: 'Temporary combat enhancement',
    requirements: {
      resources: {
        bio_gel: 10,
        plasma_cores: 2
      },
      skill: { engineering: 4 }
    },
    crafting_time: 1,
    result: {
      type: 'consumable',
      id: 'combat_stim_consumable',
      name: 'Combat Stimulant',
      effect: '+30% damage and accuracy for 3 turns',
      usage: 'combat_buff',
      duration: 3,
      bonus: { damage_bonus: 30, accuracy_bonus: 30 }
    }
  }
};

// Resource sources - where players can find resources
export const resourceSources = {
  combat_rewards: {
    praetorian: ['titanium_alloy', 'plasma_cores'],
    varangian: ['titanium_alloy', 'nanite_clusters'],
    agent: ['quantum_processors', 'neural_fiber'],
    cultist: ['bio_gel', 'nanite_clusters'],
    rogue_operative: ['quantum_processors', 'imperial_schematics'],
    security_bot: ['plasma_cores', 'titanium_alloy']
  },
  location_rewards: {
    high_tech: ['quantum_processors', 'plasma_cores'],
    industrial: ['titanium_alloy', 'nanite_clusters'],
    medical: ['bio_gel', 'neural_fiber'],
    restricted: ['imperial_schematics', 'dark_matter_shard']
  },
  exploration: {
    common: ['nanite_clusters', 'neural_fiber'],
    uncommon: ['plasma_cores', 'titanium_alloy', 'bio_gel'],
    rare: ['quantum_processors', 'imperial_schematics'],
    legendary: ['dark_matter_shard']
  }
};

// Check if player can craft recipe
export function canCraftRecipe(recipe, gameState) {
  const reqs = recipe.requirements;
  
  // Check resources
  if (reqs.resources) {
    const playerResources = gameState.resources || {};
    for (const [resource, amount] of Object.entries(reqs.resources)) {
      if ((playerResources[resource] || 0) < amount) {
        return { canCraft: false, reason: `Need ${amount} ${resources[resource].name}` };
      }
    }
  }
  
  // Check skills
  if (reqs.skill) {
    const skills = gameState.skills || {};
    for (const [skill, level] of Object.entries(reqs.skill)) {
      if ((skills[skill]?.level || 0) < level) {
        return { canCraft: false, reason: `Need ${skill} level ${level}` };
      }
    }
  }
  
  // Check perks
  if (reqs.perk) {
    const selectedPerks = Object.values(gameState.selected_perks || {}).flat();
    if (!selectedPerks.includes(reqs.perk)) {
      return { canCraft: false, reason: `Need perk: ${reqs.perk}` };
    }
  }
  
  return { canCraft: true };
}

// Get random resource drop from combat
export function getCombatResourceDrop(enemyType) {
  const sources = resourceSources.combat_rewards[enemyType];
  if (!sources || sources.length === 0) {
    // Fallback for any enemy type
    const allResources = ['nanite_clusters', 'neural_fiber', 'plasma_cores', 'titanium_alloy'];
    const resource = allResources[Math.floor(Math.random() * allResources.length)];
    const amount = Math.floor(Math.random() * 2) + 1;
    return { resource, amount };
  }
  
  const resource = sources[Math.floor(Math.random() * sources.length)];
  const amount = Math.floor(Math.random() * 3) + 1;
  
  return { resource, amount };
}

// Get resource drop from exploration
export function getExplorationResourceDrop(reputation) {
  const commonResources = ['nanite_clusters', 'neural_fiber'];
  const uncommonResources = ['plasma_cores', 'titanium_alloy', 'bio_gel'];
  const rareResources = ['quantum_processors', 'imperial_schematics'];
  const legendaryResources = ['dark_matter_shard'];
  
  let pool = [...commonResources];
  if (reputation > 60) pool = [...pool, ...uncommonResources];
  if (reputation > 80) pool = [...pool, ...rareResources];
  if (reputation > 95) pool = [...pool, ...legendaryResources];
  
  const resource = pool[Math.floor(Math.random() * pool.length)];
  const amount = Math.floor(Math.random() * 3) + 2;
  
  return { resource, amount };
}