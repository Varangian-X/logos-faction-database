// Enemy AI System - Determines enemy behavior based on type and situation

import { imperialUnitTypes } from './ImperialUnitTypes';

// Legacy enemy types
const legacyEnemyTypes = {
  praetorian: {
    name: 'Neo-Praetorian Guard',
    maxHealth: 120,
    color: 'red',
    abilities: ['shield_bash', 'defensive_stance', 'power_strike'],
    aiProfile: 'defensive'
  },
  varangian: {
    name: 'Varangian Berserker',
    maxHealth: 110,
    color: 'blue',
    abilities: ['berserker_rage', 'intimidate', 'whirlwind'],
    aiProfile: 'aggressive'
  },
  agent: {
    name: 'Imperial Agent',
    maxHealth: 80,
    color: 'violet',
    abilities: ['smoke_bomb', 'precision_shot', 'vanish'],
    aiProfile: 'tactical'
  },
  cultist: {
    name: 'Logos Cultist',
    maxHealth: 70,
    color: 'amber',
    abilities: ['divine_frenzy', 'holy_chant', 'martyrdom'],
    aiProfile: 'fanatical'
  },
  rogue_operative: {
    name: 'Rogue Cyber-Operative',
    maxHealth: 90,
    color: 'cyan',
    abilities: ['hack_systems', 'emp_blast', 'adaptive_tactics'],
    aiProfile: 'adaptive'
  },
  security_bot: {
    name: 'Security Automaton',
    maxHealth: 100,
    color: 'emerald',
    abilities: ['targeting_lock', 'overcharge', 'repair_protocol'],
    aiProfile: 'calculated'
  },
  elite_assassin: {
    name: 'Elite Shadow Assassin',
    maxHealth: 85,
    color: 'purple',
    abilities: ['poison_blade', 'shadow_step', 'execution'],
    aiProfile: 'opportunistic'
  },
  heavy_enforcer: {
    name: 'Heavy Enforcer Unit',
    maxHealth: 150,
    color: 'orange',
    abilities: ['suppressing_fire', 'heavy_armor', 'charge'],
    aiProfile: 'tank'
  }
};

// Merge legacy and imperial unit types
export const enemyTypes = {
  ...legacyEnemyTypes,
  ...Object.entries(imperialUnitTypes).reduce((acc, [key, unit]) => {
    acc[key] = {
      name: unit.name,
      maxHealth: unit.maxHealth,
      color: unit.color,
      abilities: unit.abilities?.map(a => a.id) || [],
      aiProfile: unit.aiProfile,
      faction: unit.faction,
      archetype: unit.archetype,
      description: unit.description,
      special_traits: unit.special_traits
    };
    return acc;
  }, {})
};

// Extract abilities from imperial units
const imperialAbilities = {};
Object.values(imperialUnitTypes).forEach(unit => {
  unit.abilities?.forEach(ability => {
    imperialAbilities[ability.id] = ability;
  });
});

export const enemyAbilities = {
  ...imperialAbilities,
  shield_bash: {
    name: 'Shield Bash',
    damage: [15, 25],
    effect: 'stun',
    cooldown: 3,
    description: 'Powerful shield strike that can stun'
  },
  defensive_stance: {
    name: 'Defensive Stance',
    damage: [5, 10],
    effect: 'defense_up',
    cooldown: 4,
    description: 'Reduces incoming damage for 2 turns'
  },
  power_strike: {
    name: 'Power Strike',
    damage: [25, 40],
    effect: 'none',
    cooldown: 5,
    description: 'Devastating melee attack'
  },
  berserker_rage: {
    name: 'Berserker Rage',
    damage: [20, 35],
    effect: 'rage',
    cooldown: 4,
    description: 'Increases damage output'
  },
  intimidate: {
    name: 'Intimidate',
    damage: [10, 15],
    effect: 'fear',
    cooldown: 5,
    description: 'Reduces player accuracy'
  },
  whirlwind: {
    name: 'Whirlwind Attack',
    damage: [18, 28],
    effect: 'multi_hit',
    cooldown: 6,
    description: 'Multiple rapid strikes'
  },
  smoke_bomb: {
    name: 'Smoke Bomb',
    damage: [5, 10],
    effect: 'evasion_up',
    cooldown: 4,
    description: 'Increases evasion for 2 turns'
  },
  precision_shot: {
    name: 'Precision Shot',
    damage: [25, 35],
    effect: 'critical',
    cooldown: 5,
    description: 'High accuracy critical hit'
  },
  vanish: {
    name: 'Vanish',
    damage: [0, 0],
    effect: 'dodge_next',
    cooldown: 7,
    description: 'Dodge next player attack'
  },
  divine_frenzy: {
    name: 'Divine Frenzy',
    damage: [15, 30],
    effect: 'reckless',
    cooldown: 3,
    description: 'Aggressive attack ignoring defense'
  },
  holy_chant: {
    name: 'Holy Chant',
    damage: [0, 0],
    effect: 'heal',
    cooldown: 6,
    description: 'Heals 20 HP'
  },
  martyrdom: {
    name: 'Martyrdom',
    damage: [40, 60],
    effect: 'sacrifice',
    cooldown: 999,
    description: 'Explosive final attack (only when near death)'
  },
  hack_systems: {
    name: 'System Hack',
    damage: [10, 20],
    effect: 'disable_aug',
    cooldown: 5,
    description: 'Temporarily disables augmentations'
  },
  emp_blast: {
    name: 'EMP Blast',
    damage: [15, 25],
    effect: 'tech_damage',
    cooldown: 4,
    description: 'Extra damage vs augmented targets'
  },
  adaptive_tactics: {
    name: 'Adaptive Tactics',
    damage: [12, 22],
    effect: 'counter',
    cooldown: 3,
    description: 'Counters player\'s last move'
  },
  targeting_lock: {
    name: 'Targeting Lock',
    damage: [20, 30],
    effect: 'guaranteed_hit',
    cooldown: 5,
    description: 'Cannot miss'
  },
  overcharge: {
    name: 'Overcharge',
    damage: [30, 45],
    effect: 'self_damage',
    cooldown: 6,
    description: 'Massive damage but hurts self'
  },
  repair_protocol: {
    name: 'Repair Protocol',
    damage: [0, 0],
    effect: 'heal',
    cooldown: 5,
    description: 'Repairs 25 HP'
  },
  poison_blade: {
    name: 'Poison Blade',
    damage: [12, 20],
    effect: 'poison',
    cooldown: 4,
    description: 'Deals damage over time'
  },
  shadow_step: {
    name: 'Shadow Step',
    damage: [18, 28],
    effect: 'teleport',
    cooldown: 5,
    description: 'Instant repositioning strike'
  },
  execution: {
    name: 'Execution',
    damage: [50, 80],
    effect: 'execute',
    cooldown: 999,
    description: 'Massive damage vs low HP targets'
  },
  suppressing_fire: {
    name: 'Suppressing Fire',
    damage: [15, 25],
    effect: 'suppress',
    cooldown: 3,
    description: 'Reduces player action options'
  },
  heavy_armor: {
    name: 'Heavy Armor',
    damage: [5, 10],
    effect: 'armor_up',
    cooldown: 5,
    description: 'Massive damage reduction'
  },
  charge: {
    name: 'Charge',
    damage: [25, 40],
    effect: 'knockback',
    cooldown: 4,
    description: 'Bull rush attack'
  }
};

export function getEnemyAction(combat, lastPlayerAction = null) {
  const enemyData = enemyTypes[combat.enemy_type];
  if (!enemyData) return getBasicAttack();
  
  const healthPercent = (combat.enemy_health / combat.enemy_max_health) * 100;
  const aiProfile = enemyData.aiProfile;
  
  // Check for retreat (only certain enemy types)
  if (healthPercent < 20 && ['agent', 'rogue_operative', 'elite_assassin'].includes(combat.enemy_type)) {
    const retreatChance = Math.random() * 100;
    if (retreatChance < 30) {
      return { action: 'retreat', damage: 0, message: `${combat.enemy_name} attempts to flee!` };
    }
  }
  
  // Special: Martyrdom for cultists near death
  if (combat.enemy_type === 'cultist' && healthPercent < 15 && !combat.used_martyrdom) {
    return { action: 'martyrdom', ability: enemyAbilities.martyrdom, special: true };
  }
  
  // Special: Execution for assassins vs low HP player
  if (combat.enemy_type === 'elite_assassin' && combat.player_health < 30 && !combat.used_execution) {
    return { action: 'execution', ability: enemyAbilities.execution, special: true };
  }
  
  // AI Decision making based on profile
  const availableAbilities = enemyData.abilities
    .filter(abilityId => !combat.abilities_on_cooldown?.[abilityId])
    .map(abilityId => ({ id: abilityId, data: enemyAbilities[abilityId] }));
  
  if (availableAbilities.length === 0) {
    return getBasicAttack();
  }
  
  // Profile-specific decision logic
  switch (aiProfile) {
    case 'defensive':
      return defensiveAI(combat, availableAbilities, healthPercent);
    case 'aggressive':
      return aggressiveAI(combat, availableAbilities, healthPercent);
    case 'tactical':
      return tacticalAI(combat, availableAbilities, healthPercent, lastPlayerAction);
    case 'fanatical':
      return fanaticalAI(combat, availableAbilities, healthPercent);
    case 'adaptive':
      return adaptiveAI(combat, availableAbilities, healthPercent, lastPlayerAction);
    case 'calculated':
      return calculatedAI(combat, availableAbilities, healthPercent);
    case 'opportunistic':
      return opportunisticAI(combat, availableAbilities, healthPercent, combat.player_health);
    case 'tank':
      return tankAI(combat, availableAbilities, healthPercent);
    default:
      return getRandomAbility(availableAbilities);
  }
}

function defensiveAI(combat, abilities, healthPercent) {
  // Prioritize defense when low HP
  if (healthPercent < 40) {
    const defensiveAbility = abilities.find(a => 
      a.data.effect === 'defense_up' || a.data.effect === 'heal'
    );
    if (defensiveAbility) return { action: 'ability', ability: defensiveAbility.data, abilityId: defensiveAbility.id };
  }
  
  // Use shield bash when healthy
  const shieldBash = abilities.find(a => a.id === 'shield_bash');
  if (shieldBash && Math.random() > 0.4) {
    return { action: 'ability', ability: shieldBash.data, abilityId: shieldBash.id };
  }
  
  return getRandomAbility(abilities);
}

function aggressiveAI(combat, abilities, healthPercent) {
  // Always go for damage
  const highestDamage = abilities.reduce((max, curr) => {
    const currMax = curr.data.damage[1];
    const maxMax = max.data.damage[1];
    return currMax > maxMax ? curr : max;
  }, abilities[0]);
  
  return { action: 'ability', ability: highestDamage.data, abilityId: highestDamage.id };
}

function tacticalAI(combat, abilities, healthPercent, lastPlayerAction) {
  // Use evasion when player is aggressive
  if (lastPlayerAction?.id === 'aggressive_strike') {
    const evasion = abilities.find(a => a.data.effect === 'evasion_up' || a.id === 'vanish');
    if (evasion) return { action: 'ability', ability: evasion.data, abilityId: evasion.id };
  }
  
  // Use precision when player is defensive
  if (lastPlayerAction?.id === 'defensive_counter') {
    const precision = abilities.find(a => a.id === 'precision_shot');
    if (precision) return { action: 'ability', ability: precision.data, abilityId: precision.id };
  }
  
  return getRandomAbility(abilities);
}

function fanaticalAI(combat, abilities, healthPercent) {
  // More aggressive when wounded
  if (healthPercent < 50) {
    const frenzy = abilities.find(a => a.id === 'divine_frenzy');
    if (frenzy) return { action: 'ability', ability: frenzy.data, abilityId: frenzy.id };
  }
  
  // Heal if very low
  if (healthPercent < 30) {
    const heal = abilities.find(a => a.data.effect === 'heal');
    if (heal) return { action: 'ability', ability: heal.data, abilityId: heal.id };
  }
  
  return getRandomAbility(abilities);
}

function adaptiveAI(combat, abilities, healthPercent, lastPlayerAction) {
  // Counter player's playstyle
  const adaptive = abilities.find(a => a.id === 'adaptive_tactics');
  if (adaptive && Math.random() > 0.5) {
    return { action: 'ability', ability: adaptive.data, abilityId: adaptive.id };
  }
  
  // Hack if player has augmentations
  if (combat.player_augmentation_count > 0) {
    const hack = abilities.find(a => a.id === 'hack_systems');
    if (hack) return { action: 'ability', ability: hack.data, abilityId: hack.id };
  }
  
  return getRandomAbility(abilities);
}

function calculatedAI(combat, abilities, healthPercent) {
  // Repair when damaged
  if (healthPercent < 50) {
    const repair = abilities.find(a => a.id === 'repair_protocol');
    if (repair) return { action: 'ability', ability: repair.data, abilityId: repair.id };
  }
  
  // Use targeting lock for guaranteed damage
  const targeting = abilities.find(a => a.id === 'targeting_lock');
  if (targeting && Math.random() > 0.4) {
    return { action: 'ability', ability: targeting.data, abilityId: targeting.id };
  }
  
  return getRandomAbility(abilities);
}

function opportunisticAI(combat, abilities, healthPercent, playerHealth) {
  // Execute if player is low
  if (playerHealth < 30) {
    const execute = abilities.find(a => a.id === 'execution');
    if (execute) return { action: 'ability', ability: execute.data, abilityId: execute.id };
  }
  
  // Shadow step for positioning
  const shadowStep = abilities.find(a => a.id === 'shadow_step');
  if (shadowStep && Math.random() > 0.5) {
    return { action: 'ability', ability: shadowStep.data, abilityId: shadowStep.id };
  }
  
  return getRandomAbility(abilities);
}

function tankAI(combat, abilities, healthPercent) {
  // Use armor when damaged
  if (healthPercent < 60) {
    const armor = abilities.find(a => a.id === 'heavy_armor');
    if (armor) return { action: 'ability', ability: armor.data, abilityId: armor.id };
  }
  
  // Charge when healthy
  const charge = abilities.find(a => a.id === 'charge');
  if (charge && healthPercent > 50) {
    return { action: 'ability', ability: charge.data, abilityId: charge.id };
  }
  
  return getRandomAbility(abilities);
}

function getBasicAttack() {
  return { 
    action: 'basic_attack', 
    damage: [10, 20],
    message: 'Basic attack'
  };
}

function getRandomAbility(abilities) {
  const chosen = abilities[Math.floor(Math.random() * abilities.length)];
  return { action: 'ability', ability: chosen.data, abilityId: chosen.id };
}

export function applyAbilityEffect(combat, effect, isPlayer = false) {
  const effects = { ...combat.active_effects || {} };
  
  switch (effect) {
    case 'defense_up':
      effects.enemy_defense = 2;
      break;
    case 'evasion_up':
      effects.enemy_evasion = 2;
      break;
    case 'rage':
      effects.enemy_damage_boost = 2;
      break;
    case 'armor_up':
      effects.enemy_armor = 3;
      break;
    case 'heal':
      // Handled separately in combat logic
      break;
  }
  
  return effects;
}