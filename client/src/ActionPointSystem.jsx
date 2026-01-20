// Action Point System for turn-based combat

export const ACTION_COSTS = {
  // Basic attacks
  basic_attack: 2,
  aggressive_strike: 3,
  tactical_shot: 2,
  defensive_counter: 2,
  
  // Abilities
  hack_systems: 3,
  use_augmentation: 3,
  special_ability: 4,
  ultimate_ability: 5,
  
  // Movement
  move: 1,
  take_cover: 1,
  reposition: 2,
  
  // Items
  use_consumable: 1,
  
  // Skills
  aim: 1,
  overwatch: 2,
  reload: 1
};

export const DEFAULT_AP_PER_TURN = 4;

export class ActionPointManager {
  constructor(maxAP = DEFAULT_AP_PER_TURN) {
    this.maxAP = maxAP;
    this.currentAP = maxAP;
    this.bonusAP = 0;
    this.apHistory = [];
  }

  reset() {
    this.currentAP = this.maxAP + this.bonusAP;
    this.bonusAP = 0;
  }

  canAfford(actionType) {
    const cost = ACTION_COSTS[actionType] || 2;
    return this.currentAP >= cost;
  }

  spendAP(actionType) {
    const cost = ACTION_COSTS[actionType] || 2;
    if (!this.canAfford(actionType)) return false;
    
    this.currentAP -= cost;
    this.apHistory.push({ action: actionType, cost, remaining: this.currentAP });
    return true;
  }

  gainBonusAP(amount) {
    this.bonusAP += amount;
    this.currentAP += amount;
  }

  increaseMaxAP(amount) {
    this.maxAP += amount;
    this.currentAP += amount;
  }

  getAvailableActions(allActions) {
    return allActions.filter(action => 
      this.canAfford(action.id) && !action.disabled
    );
  }
}

export function getActionAPCost(actionId) {
  return ACTION_COSTS[actionId] || 2;
}

export function calculateAPModifiers(character, statusEffects = []) {
  let maxAP = DEFAULT_AP_PER_TURN;
  let currentAPBonus = 0;

  // Status effects
  statusEffects.forEach(effect => {
    if (effect.type === 'haste') maxAP += 2;
    if (effect.type === 'slow') maxAP -= 1;
    if (effect.type === 'energized') currentAPBonus += 1;
  });

  // Skills
  if (character.skills?.combat?.level >= 7) maxAP += 1;
  if (character.skills?.hacking?.level >= 8) currentAPBonus += 1;

  // Augmentations
  const reflexBoost = character.augmentations?.find(a => a.id === 'reflex_boost');
  if (reflexBoost) maxAP += 1;

  return {
    maxAP: Math.max(2, maxAP),
    bonusAP: currentAPBonus
  };
}