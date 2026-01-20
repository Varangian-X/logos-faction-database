// Five-Axis Stress System
import { base44 } from '@/api/base44Client';

// Stress thresholds and effects
export const stressThresholds = {
  heart: [
    { max: 25, status: 'healthy', color: 'green', penalty: null },
    { max: 50, status: 'fatigued', color: 'yellow', penalty: { combat: -10 } },
    { max: 75, status: 'exhausted', color: 'orange', penalty: { combat: -25, max_health: -20 } },
    { max: 100, status: 'critical', color: 'red', penalty: { combat: -40, max_health: -40, action_cost: 2 } }
  ],
  psyche: [
    { max: 25, status: 'stable', color: 'green', penalty: null },
    { max: 50, status: 'strained', color: 'yellow', penalty: { investigation: -10, hacking: -10 } },
    { max: 75, status: 'fractured', color: 'orange', penalty: { investigation: -25, hacking: -25, insight: -1 } },
    { max: 100, status: 'broken', color: 'red', penalty: { investigation: -50, hacking: -50, insight: -2, random_events: true } }
  ],
  spirit: [
    { max: 25, status: 'resolute', color: 'green', penalty: null },
    { max: 50, status: 'wavering', color: 'yellow', penalty: { reputation: -5 } },
    { max: 75, status: 'demoralized', color: 'orange', penalty: { reputation: -15, influence: -10 } },
    { max: 100, status: 'shattered', color: 'red', penalty: { reputation: -30, influence: -25, companion_loyalty: -20 } }
  ],
  presence: [
    { max: 25, status: 'esteemed', color: 'green', penalty: null },
    { max: 50, status: 'compromised', color: 'yellow', penalty: { negotiation: -10, faction_relations: -5 } },
    { max: 75, status: 'disgraced', color: 'orange', penalty: { negotiation: -25, faction_relations: -15, influence_cost: 1.5 } },
    { max: 100, status: 'pariah', color: 'red', penalty: { negotiation: -50, faction_relations: -30, locked_out: true } }
  ],
  capital: [
    { max: 25, status: 'solvent', color: 'green', penalty: null },
    { max: 50, status: 'indebted', color: 'yellow', penalty: { credits_per_turn: -50 } },
    { max: 75, status: 'bankrupt', color: 'orange', penalty: { credits_per_turn: -150, market_access: 0.5 } },
    { max: 100, status: 'ruined', color: 'red', penalty: { credits_per_turn: -300, market_locked: true, asset_seizure: true } }
  ]
};

// Get current stress status for a meter
export function getStressStatus(meterType, value) {
  const thresholds = stressThresholds[meterType];
  return thresholds.find(t => value <= t.max) || thresholds[thresholds.length - 1];
}

// Apply stress damage
export function applyStressDamage(gameState, meterType, amount, reason) {
  const meters = { ...(gameState.stress_meters || {}) };
  const currentValue = meters[meterType] || 0;
  const newValue = Math.min(100, Math.max(0, currentValue + amount));
  
  meters[meterType] = newValue;
  
  const oldStatus = getStressStatus(meterType, currentValue);
  const newStatus = getStressStatus(meterType, newValue);
  
  const result = {
    meters,
    message: `${meterType.toUpperCase()} stress ${amount > 0 ? 'increased' : 'reduced'} by ${Math.abs(amount)}: ${reason}`,
    threshold_crossed: oldStatus.status !== newStatus.status,
    new_status: newStatus.status,
    penalties: newStatus.penalty
  };
  
  return result;
}

// Calculate total stress (for fallout checks)
export function calculateTotalStress(stress_meters = {}) {
  const total = Object.values(stress_meters).reduce((sum, val) => sum + (val || 0), 0);
  return Math.floor(total / 5); // Average across all meters
}

// Check for stress fallout
export function checkStressFallout(gameState) {
  const totalStress = calculateTotalStress(gameState.stress_meters);
  
  if (totalStress < 10) return null; // Too low to trigger
  
  const falloutChance = totalStress; // 1% per total stress point
  const roll = Math.random() * 100;
  
  if (roll > falloutChance) return null; // No fallout
  
  // Determine which meter triggers fallout
  const meters = gameState.stress_meters || {};
  const highest = Object.entries(meters)
    .sort(([, a], [, b]) => b - a)[0];
  
  if (!highest) return null;
  
  const [meterType, value] = highest;
  const status = getStressStatus(meterType, value);
  
  return {
    meter: meterType,
    stress_level: value,
    status: status.status,
    consequence: generateFalloutConsequence(meterType, status.status, gameState)
  };
}

// Generate fallout consequences
function generateFalloutConsequence(meterType, status, gameState) {
  const consequences = {
    heart: {
      fatigued: { injury: 'minor_bruise', turns: 2, message: 'Physical exhaustion causes minor injury' },
      exhausted: { injury: 'impaired_limb', turns: 4, message: 'Severe fatigue results in impaired movement' },
      critical: { injury: 'critical_wound', turns: 8, message: 'Physical collapse - critical medical attention needed' }
    },
    psyche: {
      strained: { penalty: { insight: -1 }, turns: 3, message: 'Mental strain clouds your judgment' },
      fractured: { penalty: { insight: -2, random_hallucination: true }, turns: 5, message: 'Psychological fracture causes paranoia' },
      broken: { penalty: { insight: -3, forced_rest: 2 }, turns: 10, message: 'Mental breakdown - must seek treatment' }
    },
    spirit: {
      wavering: { penalty: { companion_loyalty: -10 }, message: 'Emotional turmoil affects your relationships' },
      demoralized: { penalty: { companion_loyalty: -20, morale_crisis: true }, message: 'Depression spreads to your allies' },
      shattered: { penalty: { companion_loyalty: -40, companion_leave: true }, message: 'Emotional collapse - companions question your leadership' }
    },
    presence: {
      compromised: { penalty: { faction_relations: -10 }, message: 'Scandal damages your reputation' },
      disgraced: { penalty: { faction_relations: -25, social_lockout: 2 }, message: 'Public disgrace bars you from high society' },
      pariah: { penalty: { faction_relations: -50, exile: true }, message: 'Complete social ruin - branded a pariah' }
    },
    capital: {
      indebted: { penalty: { credits: -500 }, message: 'Debts called in - assets seized' },
      bankrupt: { penalty: { credits: -1500, gear_lost: 1 }, message: 'Bankruptcy - creditors seize equipment' },
      ruined: { penalty: { credits: -3000, gear_lost: 3, tier_loss: true }, message: 'Financial ruin - forced to lower tier' }
    }
  };
  
  return consequences[meterType]?.[status] || { message: 'Stress consequence triggered' };
}

// Reduce stress through rest/recovery
export function reduceStress(gameState, meterType, amount) {
  const meters = { ...(gameState.stress_meters || {}) };
  meters[meterType] = Math.max(0, (meters[meterType] || 0) - amount);
  
  return {
    meters,
    message: `${meterType.toUpperCase()} stress reduced by ${amount} through recovery`
  };
}

// Get active stress penalties
export function getActiveStressPenalties(gameState) {
  const penalties = {
    skills: {},
    traits: {},
    resources_per_turn: {},
    multipliers: {},
    restrictions: []
  };
  
  Object.entries(gameState.stress_meters || {}).forEach(([meter, value]) => {
    const status = getStressStatus(meter, value);
    if (status.penalty) {
      Object.entries(status.penalty).forEach(([key, val]) => {
        if (key === 'combat' || key === 'investigation' || key === 'hacking' || key === 'negotiation') {
          penalties.skills[key] = (penalties.skills[key] || 0) + val;
        } else if (key === 'insight' || key === 'reach' || key === 'grasp') {
          penalties.traits[key] = (penalties.traits[key] || 0) + val;
        } else if (key === 'credits_per_turn') {
          penalties.resources_per_turn.credits = (penalties.resources_per_turn.credits || 0) + val;
        } else if (key === 'market_access' || key === 'influence_cost') {
          penalties.multipliers[key] = val;
        } else if (key === 'locked_out' || key === 'market_locked') {
          penalties.restrictions.push(key);
        }
      });
    }
  });
  
  return penalties;
}