// Combat Environment System - Dynamic environmental effects and interactions

export const ENVIRONMENT_TYPES = {
  cisterns: {
    id: 'cisterns',
    name: 'The Deep Cisterns',
    effects: {
      visibility: 'low',
      cover_density: 'high',
      hazards: ['flooded_sections', 'unstable_platforms']
    },
    skill_interactions: {
      hacking: {
        min_level: 4,
        action: 'drain_water',
        effect: 'Reveals hidden paths and flanking routes',
        mechanics: { vision_bonus: 2, movement_bonus: 1 }
      },
      engineering: {
        min_level: 5,
        action: 'activate_pumps',
        effect: 'Creates water hazards for enemies',
        mechanics: { enemy_movement_penalty: 2 }
      }
    },
    dynamic_events: [
      {
        trigger: 'turn_5',
        event: 'water_surge',
        description: 'A surge of water floods the lower levels!',
        effect: { random_damage: [5, 15], applies_to: 'units_in_water' }
      }
    ]
  },
  praetoria: {
    id: 'praetoria',
    name: 'Fortress Praetoria',
    effects: {
      visibility: 'high',
      cover_density: 'low',
      hazards: ['automated_turrets', 'force_fields']
    },
    skill_interactions: {
      hacking: {
        min_level: 6,
        action: 'hack_turrets',
        effect: 'Turn automated defenses against enemies',
        mechanics: { summon_turret: true, damage: [20, 30] }
      },
      combat: {
        min_level: 5,
        action: 'breach_fortification',
        effect: 'Destroy cover and create openings',
        mechanics: { remove_cover: true, stun_enemies: 1 }
      }
    },
    faction_modifiers: {
      praetorians: { defense_bonus: 25, morale_bonus: 20 }
    }
  },
  cathedral: {
    id: 'cathedral',
    name: 'Cathedral of the Logos',
    effects: {
      visibility: 'medium',
      cover_density: 'medium',
      hazards: ['energy_fields', 'holy_wards']
    },
    skill_interactions: {
      negotiation: {
        min_level: 6,
        action: 'invoke_sanctuary',
        effect: 'Call for divine protection',
        mechanics: { shield_all_allies: 30, morale_boost: 15 }
      },
      investigation: {
        min_level: 4,
        action: 'decipher_relics',
        effect: 'Unlock ancient weapon caches',
        mechanics: { bonus_damage: 15, crit_chance: 20 }
      }
    },
    faction_modifiers: {
      ecclesiarchy: { damage_bonus: 20, healing_bonus: 30 }
    }
  },
  varangian_enclave: {
    id: 'varangian_enclave',
    name: 'Varangian Enclave',
    effects: {
      visibility: 'high',
      cover_density: 'medium',
      hazards: ['mead_barrels', 'close_quarters']
    },
    skill_interactions: {
      combat: {
        min_level: 5,
        action: 'berserker_charge',
        effect: 'Close distance and unleash fury',
        mechanics: { movement_boost: 3, damage_bonus: 40, defense_penalty: 20 }
      },
      negotiation: {
        min_level: 4,
        action: 'challenge_to_duel',
        effect: 'Turn combat into honorable single combat',
        mechanics: { isolate_enemy: true, reputation_bonus: 20 }
      }
    },
    faction_modifiers: {
      varangians: { melee_damage_bonus: 30, morale_bonus: 25 }
    }
  },
  market_district: {
    id: 'market_district',
    name: 'Market District',
    effects: {
      visibility: 'medium',
      cover_density: 'very_high',
      hazards: ['civilian_crowds', 'market_stalls']
    },
    skill_interactions: {
      espionage: {
        min_level: 4,
        action: 'blend_into_crowd',
        effect: 'Become untargetable for 1 turn',
        mechanics: { stealth_turn: 1, flanking_bonus: 25 }
      },
      negotiation: {
        min_level: 5,
        action: 'call_for_help',
        effect: 'Summon civilian militia',
        mechanics: { summon_allies: 2, ally_strength: 30 }
      }
    },
    reputation_effects: {
      high: { civilian_help: true, escape_routes: 3 },
      low: { civilians_flee: true, no_assistance: true }
    }
  }
};

export function getEnvironmentForLocation(location) {
  const locationMap = {
    'The Deep Cisterns': 'cisterns',
    'Fortress Praetoria': 'praetoria',
    'Cathedral of the Logos': 'cathedral',
    'Varangian Enclave': 'varangian_enclave',
    'Market District': 'market_district'
  };

  const envId = locationMap[location];
  return ENVIRONMENT_TYPES[envId] || null;
}

export function getAvailableEnvironmentalActions(environment, gameState, combat) {
  if (!environment) return [];

  const skills = gameState.skills || {};
  const actions = [];

  Object.entries(environment.skill_interactions || {}).forEach(([skill, interaction]) => {
    const skillLevel = skills[skill]?.level || 0;
    
    if (skillLevel >= interaction.min_level) {
      actions.push({
        id: `env_${skill}_${environment.id}`,
        name: interaction.action,
        description: interaction.effect,
        skill_required: skill,
        min_level: interaction.min_level,
        mechanics: interaction.mechanics,
        icon: getSkillIcon(skill)
      });
    }
  });

  return actions;
}

export function applyEnvironmentalAction(action, combat, gameState) {
  const mechanics = action.mechanics;
  const effects = {
    log: [`Used ${action.name}!`],
    combat_updates: {}
  };

  if (mechanics.vision_bonus) {
    combat.vision_range = (combat.vision_range || 5) + mechanics.vision_bonus;
    effects.log.push(`Vision range increased!`);
  }

  if (mechanics.movement_bonus) {
    combat.player_movement_bonus = mechanics.movement_bonus;
    effects.log.push(`Movement enhanced!`);
  }

  if (mechanics.enemy_movement_penalty) {
    combat.enemy_movement_penalty = mechanics.enemy_movement_penalty;
    effects.log.push(`Enemy movement hindered!`);
  }

  if (mechanics.summon_turret) {
    const turret = {
      id: `turret_${Date.now()}`,
      type: 'automated_turret',
      health: 50,
      max_health: 50,
      damage: mechanics.damage,
      x: combat.grid_positions.player.x + 2,
      y: combat.grid_positions.player.y
    };
    combat.grid_positions.allies.push(turret);
    effects.log.push('Automated turret deployed!');
  }

  if (mechanics.shield_all_allies) {
    combat.active_effects = combat.active_effects || {};
    combat.active_effects.sanctuary_shield = {
      amount: mechanics.shield_all_allies,
      duration: 3
    };
    effects.log.push(`Divine protection shields all allies!`);
  }

  if (mechanics.bonus_damage) {
    combat.environment_damage_bonus = mechanics.bonus_damage;
    effects.log.push(`Ancient weapons unlock damage boost!`);
  }

  if (mechanics.summon_allies) {
    for (let i = 0; i < mechanics.summon_allies; i++) {
      const ally = {
        id: `militia_${Date.now()}_${i}`,
        name: `Civilian Militia`,
        type: 'militia',
        health: 40,
        max_health: 40,
        x: combat.grid_positions.player.x + 1,
        y: combat.grid_positions.player.y + i - 1
      };
      combat.grid_positions.allies.push(ally);
    }
    effects.log.push(`Citizens answer your call!`);
  }

  effects.combat_updates = combat;
  return effects;
}

export function applyFactionLocationBonus(faction, environment, combat) {
  if (!environment?.faction_modifiers?.[faction]) return null;

  const modifiers = environment.faction_modifiers[faction];
  const bonuses = [];

  if (modifiers.defense_bonus) {
    combat.faction_defense_bonus = modifiers.defense_bonus;
    bonuses.push(`+${modifiers.defense_bonus}% defense (home territory)`);
  }

  if (modifiers.damage_bonus) {
    combat.faction_damage_bonus = modifiers.damage_bonus;
    bonuses.push(`+${modifiers.damage_bonus}% damage`);
  }

  if (modifiers.morale_bonus) {
    combat.morale_modifier = modifiers.morale_bonus;
    bonuses.push(`+${modifiers.morale_bonus} morale`);
  }

  return bonuses;
}

export function applyReputationLocationEffects(reputation, environment, combat) {
  if (!environment?.reputation_effects) return [];

  const effects = [];
  const tier = reputation > 60 ? 'high' : reputation < -30 ? 'low' : 'neutral';

  const repEffects = environment.reputation_effects[tier];
  if (!repEffects) return effects;

  if (repEffects.civilian_help) {
    effects.push('Civilians provide aid and information');
    combat.intel_bonus = 10;
  }

  if (repEffects.escape_routes) {
    combat.escape_chance_bonus = 20;
    effects.push(`${repEffects.escape_routes} escape routes available`);
  }

  if (repEffects.civilians_flee) {
    effects.push('Civilians flee from your presence');
  }

  return effects;
}

function getSkillIcon(skill) {
  const icons = {
    hacking: Zap,
    combat: Crosshair,
    negotiation: Target,
    engineering: Shield,
    investigation: Eye,
    espionage: AlertTriangle
  };
  return icons[skill] || Target;
}