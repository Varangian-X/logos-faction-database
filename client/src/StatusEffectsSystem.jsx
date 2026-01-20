// Comprehensive status effects system

export const STATUS_EFFECTS = {
  // Damage over time
  burning: {
    id: 'burning',
    name: 'Burning',
    type: 'damage_over_time',
    icon: '🔥',
    color: 'red',
    damage_per_turn: 8,
    duration: 3,
    description: 'Takes fire damage each turn'
  },
  bleeding: {
    id: 'bleeding',
    name: 'Bleeding',
    type: 'damage_over_time',
    icon: '💉',
    color: 'red',
    damage_per_turn: 5,
    duration: 4,
    description: 'Loses health over time'
  },
  poisoned: {
    id: 'poisoned',
    name: 'Poisoned',
    type: 'damage_over_time',
    icon: '☠️',
    color: 'green',
    damage_per_turn: 6,
    duration: 5,
    reduces_healing: 0.5,
    description: 'Takes poison damage and reduced healing'
  },
  
  // Debuffs
  stunned: {
    id: 'stunned',
    name: 'Stunned',
    type: 'control',
    icon: '⚡',
    color: 'yellow',
    skip_turn: true,
    duration: 1,
    description: 'Cannot take actions'
  },
  disarmed: {
    id: 'disarmed',
    name: 'Disarmed',
    type: 'debuff',
    icon: '🚫',
    color: 'orange',
    damage_reduction: 0.5,
    duration: 2,
    description: 'Damage reduced by 50%'
  },
  weakened: {
    id: 'weakened',
    name: 'Weakened',
    type: 'debuff',
    icon: '⬇️',
    color: 'gray',
    damage_reduction: 0.3,
    defense_reduction: 20,
    duration: 3,
    description: 'Reduced damage and defense'
  },
  blinded: {
    id: 'blinded',
    name: 'Blinded',
    type: 'debuff',
    icon: '👁️',
    color: 'slate',
    accuracy_penalty: 40,
    duration: 2,
    description: 'Greatly reduced accuracy'
  },
  slowed: {
    id: 'slowed',
    name: 'Slowed',
    type: 'debuff',
    icon: '🐌',
    color: 'blue',
    ap_reduction: 1,
    evasion_penalty: 15,
    duration: 3,
    description: 'Reduced action points and evasion'
  },
  
  // Buffs
  fortified: {
    id: 'fortified',
    name: 'Fortified',
    type: 'buff',
    icon: '🛡️',
    color: 'blue',
    defense_bonus: 30,
    damage_reduction: 0.2,
    duration: 3,
    description: 'Increased defense and damage reduction'
  },
  haste: {
    id: 'haste',
    name: 'Haste',
    type: 'buff',
    icon: '⚡',
    color: 'cyan',
    ap_bonus: 2,
    evasion_bonus: 20,
    duration: 2,
    description: 'Extra action points and evasion'
  },
  empowered: {
    id: 'empowered',
    name: 'Empowered',
    type: 'buff',
    icon: '💪',
    color: 'red',
    damage_bonus: 0.4,
    crit_chance_bonus: 15,
    duration: 3,
    description: 'Increased damage and crit chance'
  },
  regenerating: {
    id: 'regenerating',
    name: 'Regenerating',
    type: 'heal_over_time',
    icon: '💚',
    color: 'green',
    heal_per_turn: 10,
    duration: 4,
    description: 'Restores health each turn'
  },
  shielded: {
    id: 'shielded',
    name: 'Shielded',
    type: 'buff',
    icon: '🛡️',
    color: 'cyan',
    absorb_damage: 30,
    duration: 2,
    description: 'Absorbs incoming damage'
  },
  
  // Special
  marked: {
    id: 'marked',
    name: 'Marked',
    type: 'debuff',
    icon: '🎯',
    color: 'red',
    incoming_damage_bonus: 0.25,
    cannot_evade: true,
    duration: 3,
    description: 'Takes increased damage, cannot evade'
  },
  invisible: {
    id: 'invisible',
    name: 'Invisible',
    type: 'buff',
    icon: '👻',
    color: 'violet',
    cannot_be_targeted: true,
    crit_bonus: 50,
    duration: 2,
    description: 'Cannot be targeted, increased crit chance'
  },
  overloaded: {
    id: 'overloaded',
    name: 'Overloaded',
    type: 'special',
    icon: '⚠️',
    color: 'amber',
    damage_bonus: 0.5,
    takes_damage_per_turn: 5,
    duration: 3,
    description: 'Massive damage boost but takes damage each turn'
  }
};

export class StatusEffectManager {
  constructor() {
    this.activeEffects = new Map();
  }

  applyEffect(targetId, effectId, duration = null) {
    const effect = STATUS_EFFECTS[effectId];
    if (!effect) return false;

    const effectDuration = duration || effect.duration;
    
    this.activeEffects.set(`${targetId}_${effectId}`, {
      ...effect,
      targetId,
      duration: effectDuration,
      turnsActive: 0
    });

    return true;
  }

  removeEffect(targetId, effectId) {
    this.activeEffects.delete(`${targetId}_${effectId}`);
  }

  getActiveEffects(targetId) {
    const effects = [];
    this.activeEffects.forEach((effect, key) => {
      if (effect.targetId === targetId) {
        effects.push(effect);
      }
    });
    return effects;
  }

  processEndOfTurn(targetId) {
    const results = {
      damage: 0,
      healing: 0,
      expired: [],
      messages: []
    };

    const effects = this.getActiveEffects(targetId);
    
    effects.forEach(effect => {
      // Process damage over time
      if (effect.type === 'damage_over_time' && effect.damage_per_turn) {
        results.damage += effect.damage_per_turn;
        results.messages.push(`${effect.name} deals ${effect.damage_per_turn} damage`);
      }

      // Process healing over time
      if (effect.type === 'heal_over_time' && effect.heal_per_turn) {
        results.healing += effect.heal_per_turn;
        results.messages.push(`${effect.name} restores ${effect.heal_per_turn} HP`);
      }

      // Decrement duration
      effect.turnsActive++;
      if (effect.turnsActive >= effect.duration) {
        this.removeEffect(targetId, effect.id);
        results.expired.push(effect.id);
        results.messages.push(`${effect.name} expired`);
      }
    });

    return results;
  }

  calculateModifiers(targetId) {
    const effects = this.getActiveEffects(targetId);
    
    const modifiers = {
      damage_bonus: 1.0,
      damage_reduction: 1.0,
      defense_bonus: 0,
      accuracy_bonus: 0,
      evasion_bonus: 0,
      crit_chance_bonus: 0,
      ap_modifier: 0,
      healing_multiplier: 1.0,
      can_act: true,
      can_be_targeted: true,
      absorb_damage: 0
    };

    effects.forEach(effect => {
      if (effect.skip_turn) modifiers.can_act = false;
      if (effect.cannot_be_targeted) modifiers.can_be_targeted = false;
      if (effect.damage_bonus) modifiers.damage_bonus *= (1 + effect.damage_bonus);
      if (effect.damage_reduction) modifiers.damage_reduction *= (1 - effect.damage_reduction);
      if (effect.defense_bonus) modifiers.defense_bonus += effect.defense_bonus;
      if (effect.defense_reduction) modifiers.defense_bonus -= effect.defense_reduction;
      if (effect.accuracy_penalty) modifiers.accuracy_bonus -= effect.accuracy_penalty;
      if (effect.evasion_bonus) modifiers.evasion_bonus += effect.evasion_bonus;
      if (effect.evasion_penalty) modifiers.evasion_bonus -= effect.evasion_penalty;
      if (effect.crit_chance_bonus) modifiers.crit_chance_bonus += effect.crit_chance_bonus;
      if (effect.crit_bonus) modifiers.crit_chance_bonus += effect.crit_bonus;
      if (effect.ap_bonus) modifiers.ap_modifier += effect.ap_bonus;
      if (effect.ap_reduction) modifiers.ap_modifier -= effect.ap_reduction;
      if (effect.reduces_healing) modifiers.healing_multiplier *= effect.reduces_healing;
      if (effect.absorb_damage) modifiers.absorb_damage += effect.absorb_damage;
      if (effect.incoming_damage_bonus) modifiers.damage_reduction *= (1 + effect.incoming_damage_bonus);
    });

    return modifiers;
  }

  hasEffect(targetId, effectId) {
    return this.activeEffects.has(`${targetId}_${effectId}`);
  }

  clearAllEffects(targetId) {
    const toRemove = [];
    this.activeEffects.forEach((effect, key) => {
      if (effect.targetId === targetId) {
        toRemove.push(key);
      }
    });
    toRemove.forEach(key => this.activeEffects.delete(key));
  }
}

export function getStatusEffectIcon(effectId) {
  return STATUS_EFFECTS[effectId]?.icon || '❓';
}

export function getStatusEffectColor(effectId) {
  return STATUS_EFFECTS[effectId]?.color || 'gray';
}