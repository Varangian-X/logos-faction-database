// NPC Ally roles and abilities
export const allyRoles = {
  warrior: {
    name: 'Warrior',
    baseHealth: 100,
    baseDamage: [15, 25],
    abilities: [
      {
        id: 'shield_bash',
        name: 'Shield Bash',
        damage: [20, 30],
        cooldown: 3,
        effect: 'stun',
        description: 'Stun enemy for 1 turn'
      },
      {
        id: 'rallying_cry',
        name: 'Rallying Cry',
        damage: [0, 0],
        cooldown: 4,
        effect: 'buff_damage',
        description: 'Boost all allies damage by 20%'
      }
    ]
  },
  ranger: {
    name: 'Ranger',
    baseHealth: 80,
    baseDamage: [12, 20],
    abilities: [
      {
        id: 'precise_shot',
        name: 'Precise Shot',
        damage: [25, 35],
        cooldown: 2,
        effect: 'high_accuracy',
        description: 'Guaranteed hit with bonus damage'
      },
      {
        id: 'volley',
        name: 'Volley',
        damage: [10, 15],
        cooldown: 4,
        effect: 'aoe',
        description: 'Damage all enemies'
      }
    ]
  },
  cleric: {
    name: 'Cleric',
    baseHealth: 70,
    baseDamage: [8, 12],
    abilities: [
      {
        id: 'heal',
        name: 'Healing Light',
        damage: [0, 0],
        cooldown: 3,
        effect: 'heal',
        healAmount: 30,
        description: 'Restore 30 HP to target'
      },
      {
        id: 'divine_shield',
        name: 'Divine Shield',
        damage: [0, 0],
        cooldown: 5,
        effect: 'buff_defense',
        description: 'Grant damage reduction to all allies'
      }
    ]
  },
  mage: {
    name: 'Mage',
    baseHealth: 60,
    baseDamage: [10, 18],
    abilities: [
      {
        id: 'fireball',
        name: 'Fireball',
        damage: [30, 40],
        cooldown: 3,
        effect: 'burn',
        description: 'High damage with burn effect'
      },
      {
        id: 'arcane_barrier',
        name: 'Arcane Barrier',
        damage: [0, 0],
        cooldown: 4,
        effect: 'shield',
        description: 'Absorb next attack'
      }
    ]
  }
};

// AI decision making for allies
export function getAllyAction(ally, combat, enemies, allies) {
  const commands = ally.commands || { range: 'melee', priority: 'strongest' };
  const role = allyRoles[ally.roleType];
  
  // Check if ally has usable abilities
  const usableAbilities = role.abilities.filter(ability => 
    !ally.cooldowns || !ally.cooldowns[ability.id] || ally.cooldowns[ability.id] <= 0
  );
  
  // Role-based AI behavior
  if (ally.roleType === 'cleric') {
    // Clerics prioritize healing
    const injuredAllies = allies.filter(a => a.health < a.max_health * 0.6);
    if (injuredAllies.length > 0 && usableAbilities.some(a => a.effect === 'heal')) {
      const healAbility = usableAbilities.find(a => a.effect === 'heal');
      return {
        action: 'ability',
        ability: healAbility,
        target: injuredAllies.sort((a, b) => a.health - b.health)[0]
      };
    }
  }
  
  // Use abilities based on AI logic
  if (usableAbilities.length > 0 && Math.random() > 0.6) {
    const ability = usableAbilities[Math.floor(Math.random() * usableAbilities.length)];
    return {
      action: 'ability',
      ability,
      target: selectTarget(enemies, commands.priority, combat)
    };
  }
  
  // Basic attack
  return {
    action: 'attack',
    damage: role.baseDamage,
    target: selectTarget(enemies, commands.priority, combat)
  };
}

function selectTarget(enemies, priority, combat) {
  if (enemies.length === 0) return null;
  
  switch (priority) {
    case 'strongest':
      return enemies.reduce((max, e) => e.health > max.health ? e : max);
    case 'weakest':
      return enemies.reduce((min, e) => e.health < min.health ? e : min);
    case 'healers':
      // Target enemies with healing abilities
      const healer = enemies.find(e => e.abilities?.some(a => a.effect === 'heal'));
      return healer || enemies[0];
    case 'player_target':
      // Follow player's last target
      return combat.player_last_target || enemies[0];
    default:
      return enemies[0];
  }
}

export function applyAllyAbilityEffect(ally, ability, target, combat) {
  const effects = {};
  
  switch (ability.effect) {
    case 'heal':
      target.health = Math.min(target.max_health, target.health + ability.healAmount);
      effects.message = `${ally.name} heals ${target.name} for ${ability.healAmount} HP!`;
      break;
    case 'buff_damage':
      combat.allies.forEach(a => {
        a.activeEffects = a.activeEffects || [];
        a.activeEffects.push('damage_boost');
      });
      effects.message = `${ally.name} boosts all allies' damage!`;
      break;
    case 'buff_defense':
      combat.allies.forEach(a => {
        a.activeEffects = a.activeEffects || [];
        a.activeEffects.push('defense_boost');
      });
      effects.message = `${ally.name} shields all allies!`;
      break;
    case 'stun':
      target.stunned = 1;
      effects.message = `${ally.name} stuns ${target.name || 'the enemy'}!`;
      break;
    case 'shield':
      target.activeEffects = target.activeEffects || [];
      target.activeEffects.push('arcane_shield');
      effects.message = `${ally.name} grants arcane shield!`;
      break;
    case 'burn':
      target.activeEffects = target.activeEffects || [];
      target.activeEffects.push('burning_2');
      effects.message = `${ally.name}'s fireball ignites ${target.name || 'the enemy'}!`;
      break;
    case 'aoe':
      effects.message = `${ally.name} unleashes a volley on all enemies!`;
      break;
    default:
      effects.message = `${ally.name} uses ${ability.name}!`;
  }
  
  return effects;
}