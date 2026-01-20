// Gear and Equipment System

export const gearSlots = ['head', 'torso', 'left_arm', 'right_arm', 'left_leg', 'right_leg', 'accessory_1', 'accessory_2'];

export const gearDatabase = {
  // Head
  neural_crown: {
    id: 'neural_crown',
    name: 'Neural Crown MK-VII',
    slot: 'head',
    armor_value: 15,
    special_effects: ['insight_+1', 'hacking_+15%'],
    price: 2500,
    rarity: 'rare'
  },
  combat_helm: {
    id: 'combat_helm',
    name: 'Praetorian Combat Helm',
    slot: 'head',
    armor_value: 30,
    special_effects: ['combat_+10%', 'intimidation'],
    price: 1800,
    rarity: 'uncommon'
  },
  
  // Torso
  titan_plate: {
    id: 'titan_plate',
    name: 'Titanium Plate Armor',
    slot: 'torso',
    armor_value: 50,
    special_effects: ['damage_reduction_25%', 'heart_stress_-20%'],
    price: 5000,
    rarity: 'legendary'
  },
  stealth_suit: {
    id: 'stealth_suit',
    name: 'Adaptive Stealth Suit',
    slot: 'torso',
    armor_value: 20,
    special_effects: ['espionage_+20%', 'detection_-30%'],
    price: 3500,
    rarity: 'rare'
  },
  
  // Arms
  power_gauntlet: {
    id: 'power_gauntlet',
    name: 'Varangian Power Gauntlet',
    slot: 'right_arm',
    armor_value: 25,
    special_effects: ['melee_damage_+30%', 'grasp_+1'],
    price: 2200,
    rarity: 'rare'
  },
  hacker_rig: {
    id: 'hacker_rig',
    name: 'Scrinium Hacker Rig',
    slot: 'left_arm',
    armor_value: 10,
    special_effects: ['hacking_+25%', 'intel_gain_+50%'],
    price: 2800,
    rarity: 'rare'
  },
  
  // Legs
  mobility_servos: {
    id: 'mobility_servos',
    name: 'Enhanced Mobility Servos',
    slot: 'left_leg',
    armor_value: 20,
    special_effects: ['dodge_+20%', 'flee_success_+30%'],
    price: 1500,
    rarity: 'uncommon'
  },
  
  // Accessories
  imperial_signet: {
    id: 'imperial_signet',
    name: 'Imperial Signet Ring',
    slot: 'accessory_1',
    armor_value: 0,
    special_effects: ['presence_stress_-15%', 'negotiation_+15%', 'reputation_+5'],
    price: 3000,
    rarity: 'rare'
  },
  data_crystal: {
    id: 'data_crystal',
    name: 'Encrypted Data Crystal',
    slot: 'accessory_2',
    armor_value: 0,
    special_effects: ['intel_+10_per_turn', 'investigation_+10%'],
    price: 2000,
    rarity: 'uncommon'
  }
};

// Equip gear to slot
export function equipGear(gameState, gearId, slot) {
  const gear = gearDatabase[gearId];
  if (!gear) return null;
  
  const inventory = { ...(gameState.gear_inventory || {}) };
  inventory[slot] = {
    item_id: gear.id,
    name: gear.name,
    armor_value: gear.armor_value,
    special_effects: gear.special_effects,
    damaged: false
  };
  
  return {
    gear_inventory: inventory,
    message: `Equipped ${gear.name} to ${slot}`
  };
}

// Unequip gear from slot
export function unequipGear(gameState, slot) {
  const inventory = { ...(gameState.gear_inventory || {}) };
  const removed = inventory[slot];
  delete inventory[slot];
  
  return {
    gear_inventory: inventory,
    message: removed ? `Removed ${removed.name} from ${slot}` : 'Slot was empty'
  };
}

// Calculate total armor value
export function calculateTotalArmor(gameState) {
  const inventory = gameState.gear_inventory || {};
  let total = 0;
  
  Object.values(inventory).forEach(item => {
    if (item && !item.damaged) {
      total += item.armor_value || 0;
    }
  });
  
  return total;
}

// Get active gear bonuses
export function getGearBonuses(gameState) {
  const inventory = gameState.gear_inventory || {};
  const bonuses = {
    skills: {},
    traits: {},
    stress_reduction: {},
    resources_per_turn: {},
    special: []
  };
  
  Object.values(inventory).forEach(item => {
    if (!item || item.damaged) return;
    
    (item.special_effects || []).forEach(effect => {
      if (effect.includes('_+') || effect.includes('_-')) {
        const [key, val] = effect.split('_');
        const value = parseInt(val.replace('%', ''));
        
        if (['combat', 'hacking', 'investigation', 'espionage', 'negotiation'].includes(key)) {
          bonuses.skills[key] = (bonuses.skills[key] || 0) + value;
        } else if (['insight', 'reach', 'grasp'].includes(key)) {
          bonuses.traits[key] = (bonuses.traits[key] || 0) + value;
        } else if (key.includes('stress')) {
          const stressMeter = key.replace('_stress', '');
          bonuses.stress_reduction[stressMeter] = (bonuses.stress_reduction[stressMeter] || 0) + Math.abs(value);
        } else if (key === 'intel' || key === 'credits') {
          bonuses.resources_per_turn[key] = (bonuses.resources_per_turn[key] || 0) + value;
        } else if (key === 'reputation') {
          bonuses.reputation = (bonuses.reputation || 0) + value;
        }
      } else {
        bonuses.special.push(effect);
      }
    });
  });
  
  return bonuses;
}

// Damage gear in slot
export function damageGear(gameState, slot, severity = 'minor') {
  const inventory = { ...(gameState.gear_inventory || {}) };
  const item = inventory[slot];
  
  if (!item) return null;
  
  if (severity === 'destroyed') {
    delete inventory[slot];
    return {
      gear_inventory: inventory,
      message: `${item.name} was destroyed!`,
      destroyed: true
    };
  }
  
  item.damaged = true;
  item.armor_value = Math.floor((item.armor_value || 0) * 0.5);
  
  return {
    gear_inventory: inventory,
    message: `${item.name} damaged - effectiveness reduced`,
    damaged: true
  };
}

// Repair gear
export function repairGear(gameState, slot, cost = 200) {
  const inventory = { ...(gameState.gear_inventory || {}) };
  const item = inventory[slot];
  
  if (!item || !item.damaged) return null;
  
  const originalGear = gearDatabase[item.item_id];
  if (originalGear) {
    item.damaged = false;
    item.armor_value = originalGear.armor_value;
  }
  
  return {
    gear_inventory: inventory,
    credits: -cost,
    message: `Repaired ${item.name} for ${cost}₵`
  };
}