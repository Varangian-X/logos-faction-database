// Faction Five-Axis Health System

export const factionHealthThresholds = {
  muscle: [
    { max: 25, status: 'decimated', color: 'red' },
    { max: 50, status: 'weakened', color: 'orange' },
    { max: 75, status: 'strong', color: 'yellow' },
    { max: 100, status: 'dominant', color: 'green' }
  ],
  savvy: [
    { max: 25, status: 'primitive', color: 'red' },
    { max: 50, status: 'basic', color: 'orange' },
    { max: 75, status: 'advanced', color: 'yellow' },
    { max: 100, status: 'cutting-edge', color: 'green' }
  ],
  streets: [
    { max: 25, status: 'isolated', color: 'red' },
    { max: 50, status: 'limited', color: 'orange' },
    { max: 75, status: 'networked', color: 'yellow' },
    { max: 100, status: 'embedded', color: 'green' }
  ],
  intel: [
    { max: 25, status: 'blind', color: 'red' },
    { max: 50, status: 'aware', color: 'orange' },
    { max: 75, status: 'informed', color: 'yellow' },
    { max: 100, status: 'omniscient', color: 'green' }
  ],
  funds: [
    { max: 25, status: 'bankrupt', color: 'red' },
    { max: 50, status: 'stable', color: 'orange' },
    { max: 75, status: 'wealthy', color: 'yellow' },
    { max: 100, status: 'opulent', color: 'green' }
  ]
};

export function getFactionHealthStatus(axis, value) {
  const thresholds = factionHealthThresholds[axis];
  return thresholds.find(t => value <= t.max) || thresholds[thresholds.length - 1];
}

// Damage faction on specific axis
export function damageFactionHealth(faction, axis, amount, reason) {
  const health = { ...(faction.faction_health || {}) };
  const currentValue = health[axis] || 50;
  const newValue = Math.max(0, currentValue - amount);
  
  health[axis] = newValue;
  
  return {
    health,
    message: `${faction.name} ${axis.toUpperCase()} reduced by ${amount}: ${reason}`,
    new_value: newValue,
    critically_low: newValue < 25
  };
}

// Check if faction can perform action based on health
export function canFactionAct(faction, requiredAxis, minValue = 30) {
  const health = faction.faction_health || {};
  const axisValue = health[requiredAxis] || 50;
  
  return {
    can_act: axisValue >= minValue,
    current: axisValue,
    required: minValue,
    deficit: Math.max(0, minValue - axisValue)
  };
}

// Calculate faction overall strength
export function calculateFactionStrength(faction) {
  const health = faction.faction_health || {};
  const values = Object.values(health);
  
  if (values.length === 0) return 50;
  
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.floor(average);
}