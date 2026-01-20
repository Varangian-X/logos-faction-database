// Companion Combat AI with role-based behaviors

export const companionRoles = {
  tank: {
    name: 'Tank',
    icon: '🛡️',
    color: 'blue',
    baseHealth: 150,
    baseDamage: [8, 15],
    defense: 25,
    threatGeneration: 15,
    description: 'Draws enemy fire and protects allies',
    abilities: [
      {
        id: 'taunt',
        name: 'Taunt',
        description: 'Force enemy to target this companion',
        damage: [0, 0],
        effect: 'taunt',
        cooldown: 3,
        priority: 'high_when_ally_low_health'
      },
      {
        id: 'shield_bash',
        name: 'Shield Bash',
        description: 'High threat attack with moderate damage',
        damage: [12, 20],
        effect: 'threat_boost',
        cooldown: 2,
        priority: 'default'
      },
      {
        id: 'defensive_stance',
        name: 'Defensive Stance',
        description: 'Reduce incoming damage by 40%',
        damage: [0, 0],
        effect: 'damage_reduction',
        cooldown: 4,
        priority: 'when_self_low_health'
      }
    ]
  },
  healer: {
    name: 'Healer',
    icon: '💚',
    color: 'green',
    baseHealth: 80,
    baseDamage: [5, 10],
    defense: 10,
    threatGeneration: 3,
    description: 'Keeps allies healthy and removes debuffs',
    abilities: [
      {
        id: 'heal',
        name: 'Healing Touch',
        description: 'Restore ally health',
        healing: 35,
        effect: 'heal',
        cooldown: 2,
        priority: 'when_ally_injured'
      },
      {
        id: 'mass_heal',
        name: 'Mass Restoration',
        description: 'Heal all allies',
        healing: 20,
        effect: 'mass_heal',
        cooldown: 5,
        priority: 'when_multiple_injured'
      },
      {
        id: 'cleanse',
        name: 'Purifying Light',
        description: 'Remove debuffs from ally',
        effect: 'cleanse',
        cooldown: 3,
        priority: 'when_ally_debuffed'
      }
    ]
  },
  dps: {
    name: 'DPS',
    icon: '⚔️',
    color: 'red',
    baseHealth: 100,
    baseDamage: [15, 30],
    defense: 12,
    threatGeneration: 8,
    description: 'Maximum damage output',
    abilities: [
      {
        id: 'execute',
        name: 'Execute',
        description: 'Massive damage to low health enemies',
        damage: [40, 60],
        effect: 'execute',
        cooldown: 4,
        priority: 'when_enemy_low_health'
      },
      {
        id: 'rapid_strikes',
        name: 'Rapid Strikes',
        description: 'Multiple quick attacks',
        damage: [10, 15],
        effect: 'multi_hit',
        cooldown: 2,
        priority: 'default'
      },
      {
        id: 'assassinate',
        name: 'Assassinate',
        description: 'Critical strike with high damage',
        damage: [25, 45],
        effect: 'crit',
        cooldown: 3,
        priority: 'high_when_enemy_strong'
      }
    ]
  },
  support: {
    name: 'Support',
    icon: '✨',
    color: 'purple',
    baseHealth: 90,
    baseDamage: [8, 12],
    defense: 15,
    threatGeneration: 5,
    description: 'Buffs allies and debuffs enemies',
    abilities: [
      {
        id: 'empower',
        name: 'Empower Ally',
        description: 'Increase ally damage by 30%',
        effect: 'damage_buff',
        cooldown: 3,
        priority: 'on_dps_ally'
      },
      {
        id: 'weaken',
        name: 'Weaken Enemy',
        description: 'Reduce enemy damage by 25%',
        damage: [5, 8],
        effect: 'debuff',
        cooldown: 3,
        priority: 'when_enemy_strong'
      },
      {
        id: 'haste',
        name: 'Haste',
        description: 'Reduce ally cooldowns',
        effect: 'cooldown_reduction',
        cooldown: 5,
        priority: 'when_abilities_on_cooldown'
      }
    ]
  }
};

// Get companion action based on role and combat state
export function getCompanionAction(companion, combat, enemies, allAllies) {
  const role = companionRoles[companion.combat_role] || companionRoles.dps;
  const abilities = companion.combat_abilities || role.abilities;
  
  // Filter available abilities (not on cooldown)
  const availableAbilities = abilities.filter(ability => 
    !companion.cooldowns?.[ability.id] || companion.cooldowns[ability.id] <= 0
  );
  
  // Role-specific decision logic
  switch (companion.combat_role) {
    case 'tank':
      return getTankAction(companion, combat, enemies, allAllies, availableAbilities);
    case 'healer':
      return getHealerAction(companion, combat, enemies, allAllies, availableAbilities);
    case 'dps':
      return getDPSAction(companion, combat, enemies, allAllies, availableAbilities);
    case 'support':
      return getSupportAction(companion, combat, enemies, allAllies, availableAbilities);
    default:
      return getDefaultAction(companion, availableAbilities);
  }
}

// Tank AI - prioritize threat generation and protecting allies
function getTankAction(companion, combat, enemies, allAllies, availableAbilities) {
  const injuredAllies = allAllies.filter(a => a.health < a.max_health * 0.5);
  const selfHealthPercent = companion.health / companion.max_health;
  
  // Use taunt if allies are in danger
  const taunt = availableAbilities.find(a => a.effect === 'taunt');
  if (taunt && injuredAllies.length > 0) {
    return { action: 'ability', ability: taunt, target: enemies[0] };
  }
  
  // Use defensive stance if own health is low
  const defensiveStance = availableAbilities.find(a => a.effect === 'damage_reduction');
  if (defensiveStance && selfHealthPercent < 0.4) {
    return { action: 'ability', ability: defensiveStance, target: companion };
  }
  
  // Use threat-generating attacks
  const shieldBash = availableAbilities.find(a => a.effect === 'threat_boost');
  if (shieldBash) {
    return { action: 'ability', ability: shieldBash, target: enemies[0] };
  }
  
  // Basic attack with high threat
  return { 
    action: 'attack', 
    damage: companion.combat_stats?.base_damage || [8, 15],
    target: enemies[0]
  };
}

// Healer AI - prioritize healing and debuff removal
function getHealerAction(companion, combat, enemies, allAllies, availableAbilities) {
  const injuredAllies = allAllies.filter(a => a.health < a.max_health).sort((a, b) => 
    (a.health / a.max_health) - (b.health / b.max_health)
  );
  
  const criticallyInjured = injuredAllies.filter(a => a.health < a.max_health * 0.3);
  const multipleInjured = injuredAllies.length >= 2;
  
  // Priority 1: Mass heal if multiple allies injured
  const massHeal = availableAbilities.find(a => a.effect === 'mass_heal');
  if (massHeal && multipleInjured) {
    return { action: 'ability', ability: massHeal, target: allAllies };
  }
  
  // Priority 2: Single target heal on critically injured
  const heal = availableAbilities.find(a => a.effect === 'heal');
  if (heal && criticallyInjured.length > 0) {
    return { action: 'ability', ability: heal, target: criticallyInjured[0] };
  }
  
  // Priority 3: Heal any injured ally
  if (heal && injuredAllies.length > 0) {
    return { action: 'ability', ability: heal, target: injuredAllies[0] };
  }
  
  // Priority 4: Cleanse debuffs
  const cleanse = availableAbilities.find(a => a.effect === 'cleanse');
  const debuffedAlly = allAllies.find(a => a.activeEffects?.length > 0);
  if (cleanse && debuffedAlly) {
    return { action: 'ability', ability: cleanse, target: debuffedAlly };
  }
  
  // Default: Basic attack
  return { 
    action: 'attack', 
    damage: companion.combat_stats?.base_damage || [5, 10],
    target: enemies[0]
  };
}

// DPS AI - maximize damage output
function getDPSAction(companion, combat, enemies, allAllies, availableAbilities) {
  const primaryEnemy = enemies[0];
  const enemyHealthPercent = primaryEnemy.health / (combat.enemy_max_health || 100);
  
  // Priority 1: Execute on low health enemy
  const execute = availableAbilities.find(a => a.effect === 'execute');
  if (execute && enemyHealthPercent < 0.3) {
    return { action: 'ability', ability: execute, target: primaryEnemy };
  }
  
  // Priority 2: High damage abilities
  const assassinate = availableAbilities.find(a => a.effect === 'crit');
  if (assassinate) {
    return { action: 'ability', ability: assassinate, target: primaryEnemy };
  }
  
  // Priority 3: Rapid strikes
  const rapidStrikes = availableAbilities.find(a => a.effect === 'multi_hit');
  if (rapidStrikes) {
    return { action: 'ability', ability: rapidStrikes, target: primaryEnemy };
  }
  
  // Default: Basic attack with high damage
  return { 
    action: 'attack', 
    damage: companion.combat_stats?.base_damage || [15, 30],
    target: primaryEnemy
  };
}

// Support AI - buff allies and debuff enemies
function getSupportAction(companion, combat, enemies, allAllies, availableAbilities) {
  const dpsAllies = allAllies.filter(a => a.combat_role === 'dps' || a.roleType === 'warrior');
  const primaryEnemy = enemies[0];
  const enemyHealthPercent = primaryEnemy.health / (combat.enemy_max_health || 100);
  
  // Priority 1: Empower DPS allies
  const empower = availableAbilities.find(a => a.effect === 'damage_buff');
  if (empower && dpsAllies.length > 0 && !dpsAllies[0].activeEffects?.includes('damage_boost')) {
    return { action: 'ability', ability: empower, target: dpsAllies[0] };
  }
  
  // Priority 2: Weaken strong enemies
  const weaken = availableAbilities.find(a => a.effect === 'debuff');
  if (weaken && enemyHealthPercent > 0.5) {
    return { action: 'ability', ability: weaken, target: primaryEnemy };
  }
  
  // Priority 3: Reduce cooldowns if allies have abilities ready
  const haste = availableAbilities.find(a => a.effect === 'cooldown_reduction');
  const alliesWithCooldowns = allAllies.filter(a => 
    a.cooldowns && Object.keys(a.cooldowns).length > 0
  );
  if (haste && alliesWithCooldowns.length >= 2) {
    return { action: 'ability', ability: haste, target: allAllies };
  }
  
  // Default: Basic attack
  return { 
    action: 'attack', 
    damage: companion.combat_stats?.base_damage || [8, 12],
    target: primaryEnemy
  };
}

// Default action
function getDefaultAction(companion, availableAbilities) {
  if (availableAbilities.length > 0) {
    return { 
      action: 'ability', 
      ability: availableAbilities[0], 
      target: { health: 100, name: 'Enemy' }
    };
  }
  
  return { 
    action: 'attack', 
    damage: [10, 20],
    target: { health: 100, name: 'Enemy' }
  };
}

// Apply companion ability effects
export function applyCompanionAbilityEffect(companion, ability, target, combat) {
  let message = `${companion.name} uses ${ability.name}!`;
  
  switch (ability.effect) {
    case 'heal':
      if (target.health < target.max_health) {
        const healAmount = ability.healing || 35;
        target.health = Math.min(target.max_health, target.health + healAmount);
        message = `${companion.name} heals ${target.name} for ${healAmount} HP!`;
      }
      break;
      
    case 'mass_heal':
      const healAmount = ability.healing || 20;
      message = `${companion.name} heals all allies for ${healAmount} HP!`;
      break;
      
    case 'taunt':
      combat.enemy_target = companion.id;
      message = `${companion.name} taunts the enemy! Enemy now focuses on ${companion.name}.`;
      break;
      
    case 'damage_reduction':
      companion.activeEffects = companion.activeEffects || [];
      if (!companion.activeEffects.includes('damage_reduction')) {
        companion.activeEffects.push('damage_reduction');
      }
      message = `${companion.name} enters defensive stance! Damage reduced by 40%.`;
      break;
      
    case 'damage_buff':
      target.activeEffects = target.activeEffects || [];
      if (!target.activeEffects.includes('damage_boost')) {
        target.activeEffects.push('damage_boost');
      }
      message = `${companion.name} empowers ${target.name}! Damage increased by 30%.`;
      break;
      
    case 'debuff':
      combat.active_effects = combat.active_effects || {};
      combat.active_effects.weakened = 3;
      message = `${companion.name} weakens the enemy! Enemy damage reduced.`;
      break;
      
    case 'cleanse':
      target.activeEffects = [];
      message = `${companion.name} cleanses ${target.name} of all debuffs!`;
      break;
      
    case 'cooldown_reduction':
      message = `${companion.name} accelerates time! All ally cooldowns reduced.`;
      break;
  }
  
  return { message };
}