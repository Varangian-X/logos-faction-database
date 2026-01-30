import { getFactionMetrics, type FactionAlignment } from './factionMetrics';

/**
 * Byzantine Pendulum System
 * Models the eternal conflict between Stasis (order/memory) and Plasticity (chaos/adaptation)
 * Influences tactical heat, AI behavior, and narrative events
 */

export type PendulumState = 'stasis-dominant' | 'balanced' | 'plasticity-dominant';

export interface TacticalHeat {
  level: number; // 0-100
  state: PendulumState;
  stasisInfluence: number; // 0-100
  plasticityInfluence: number; // 0-100
  modifiers: {
    aiAggressiveness: number; // multiplier 0.5-2.0
    encounterFrequency: number; // multiplier 0.5-2.0
    resourceVolatility: number; // multiplier 0.5-2.0
    narrativeTension: number; // 0-100
  };
}

export interface AIBehaviorProfile {
  alignment: FactionAlignment;
  tactics: 'defensive' | 'balanced' | 'aggressive';
  predictability: 'high' | 'medium' | 'low';
  adaptability: 'rigid' | 'moderate' | 'fluid';
  targetPriority: 'survival' | 'objective' | 'elimination';
  specialBehaviors: string[];
}

/**
 * Calculate current Byzantine Pendulum state based on active factions
 */
export function calculatePendulumState(activeFactionIds: string[]): TacticalHeat {
  let stasisWeight = 0;
  let plasticityWeight = 0;
  let totalPower = 0;

  // Weight each faction's influence by their total power
  for (const factionId of activeFactionIds) {
    const metrics = getFactionMetrics(factionId);
    if (!metrics) continue;

    const power = metrics.totalPowerScore;
    totalPower += power;

    if (metrics.alignment === 'Stasis') {
      stasisWeight += power;
    } else if (metrics.alignment === 'Plasticity') {
      plasticityWeight += power;
    }
    // Neutral factions don't affect the pendulum
  }

  // Normalize to 0-100 scale
  const stasisInfluence = totalPower > 0 ? (stasisWeight / totalPower) * 100 : 50;
  const plasticityInfluence = totalPower > 0 ? (plasticityWeight / totalPower) * 100 : 50;

  // Calculate pendulum state
  const balance = stasisInfluence - plasticityInfluence;
  let state: PendulumState;
  if (balance > 20) {
    state = 'stasis-dominant';
  } else if (balance < -20) {
    state = 'plasticity-dominant';
  } else {
    state = 'balanced';
  }

  // Calculate tactical heat (higher when pendulum is unbalanced)
  const imbalance = Math.abs(balance);
  const heatLevel = Math.min(100, imbalance * 1.5);

  // Calculate modifiers based on pendulum state
  const modifiers = calculatePendulumModifiers(state, heatLevel, stasisInfluence, plasticityInfluence);

  return {
    level: heatLevel,
    state,
    stasisInfluence,
    plasticityInfluence,
    modifiers,
  };
}

function calculatePendulumModifiers(
  state: PendulumState,
  heatLevel: number,
  stasisInfluence: number,
  plasticityInfluence: number
): TacticalHeat['modifiers'] {
  // Base modifiers
  let aiAggressiveness = 1.0;
  let encounterFrequency = 1.0;
  let resourceVolatility = 1.0;

  // State-specific adjustments
  if (state === 'stasis-dominant') {
    // Stasis: More predictable, defensive, stable resources
    aiAggressiveness = 0.7;
    encounterFrequency = 0.8;
    resourceVolatility = 0.6;
  } else if (state === 'plasticity-dominant') {
    // Plasticity: More aggressive, chaotic, volatile resources
    aiAggressiveness = 1.5;
    encounterFrequency = 1.4;
    resourceVolatility = 1.8;
  } else {
    // Balanced: Standard behavior
    aiAggressiveness = 1.0;
    encounterFrequency = 1.0;
    resourceVolatility = 1.0;
  }

  // Heat level amplifies effects
  const heatMultiplier = 1 + (heatLevel / 200); // 1.0 to 1.5
  aiAggressiveness *= heatMultiplier;
  encounterFrequency *= heatMultiplier;
  resourceVolatility *= heatMultiplier;

  // Narrative tension scales with heat
  const narrativeTension = heatLevel;

  return {
    aiAggressiveness: Math.max(0.5, Math.min(2.0, aiAggressiveness)),
    encounterFrequency: Math.max(0.5, Math.min(2.0, encounterFrequency)),
    resourceVolatility: Math.max(0.5, Math.min(2.0, resourceVolatility)),
    narrativeTension,
  };
}

/**
 * Generate AI behavior profile for a faction based on Byzantine Pendulum state
 */
export function generateAIBehavior(
  factionId: string,
  pendulumState: TacticalHeat
): AIBehaviorProfile | null {
  const metrics = getFactionMetrics(factionId);
  if (!metrics) return null;

  const alignment = metrics.alignment;
  const aggressivenessModifier = pendulumState.modifiers.aiAggressiveness;

  // Determine tactics based on alignment and pendulum state
  let tactics: AIBehaviorProfile['tactics'];
  if (alignment === 'Stasis') {
    // Stasis factions prefer defensive tactics
    tactics = aggressivenessModifier > 1.3 ? 'balanced' : 'defensive';
  } else if (alignment === 'Plasticity') {
    // Plasticity factions prefer aggressive tactics
    tactics = aggressivenessModifier < 0.8 ? 'balanced' : 'aggressive';
  } else {
    // Neutral factions adapt to pendulum state
    tactics = aggressivenessModifier > 1.2 ? 'aggressive' : aggressivenessModifier < 0.8 ? 'defensive' : 'balanced';
  }

  // Predictability and adaptability based on alignment
  const predictability: AIBehaviorProfile['predictability'] = 
    alignment === 'Stasis' ? 'high' : alignment === 'Plasticity' ? 'low' : 'medium';
  
  const adaptability: AIBehaviorProfile['adaptability'] = 
    alignment === 'Stasis' ? 'rigid' : alignment === 'Plasticity' ? 'fluid' : 'moderate';

  // Target priority based on tactics and alignment
  let targetPriority: AIBehaviorProfile['targetPriority'];
  if (tactics === 'defensive') {
    targetPriority = 'survival';
  } else if (tactics === 'aggressive') {
    targetPriority = 'elimination';
  } else {
    targetPriority = 'objective';
  }

  // Special behaviors based on faction and alignment
  const specialBehaviors = generateSpecialBehaviors(metrics.factionId, alignment, pendulumState);

  return {
    alignment,
    tactics,
    predictability,
    adaptability,
    targetPriority,
    specialBehaviors,
  };
}

function generateSpecialBehaviors(
  factionId: string,
  alignment: FactionAlignment,
  pendulumState: TacticalHeat
): string[] {
  const behaviors: string[] = [];

  // Alignment-based behaviors
  if (alignment === 'Stasis') {
    behaviors.push('Defensive formations');
    behaviors.push('Predictable patrol patterns');
    behaviors.push('Reinforcement calling');
    if (pendulumState.state === 'stasis-dominant') {
      behaviors.push('Enhanced armor protocols');
      behaviors.push('Coordinated fire discipline');
    }
  } else if (alignment === 'Plasticity') {
    behaviors.push('Flanking maneuvers');
    behaviors.push('Unpredictable movement');
    behaviors.push('Opportunistic targeting');
    if (pendulumState.state === 'plasticity-dominant') {
      behaviors.push('Berserker charges');
      behaviors.push('Adaptive tactics');
    }
  }

  // Faction-specific behaviors
  switch (factionId) {
    case 'neo-praetorians':
      behaviors.push('Authority enforcement protocols');
      behaviors.push('Compliance demands before engagement');
      break;
    case 'neo-varangians':
      behaviors.push('Honor duel challenges');
      behaviors.push('Aggressive boarding actions');
      break;
    case 'ecclesiarchy':
      behaviors.push('Theological condemnation broadcasts');
      behaviors.push('Ritual combat patterns');
      break;
    case 'the-sidhe':
      behaviors.push('Reality-warping abilities');
      behaviors.push('Psychological warfare');
      behaviors.push('Existential dread aura');
      break;
    case 'mycenoids':
      behaviors.push('Biological assimilation attempts');
      behaviors.push('Swarm tactics');
      behaviors.push('Regeneration');
      break;
  }

  return behaviors;
}

/**
 * Calculate tactical heat contribution from a specific action
 */
export function calculateActionHeatContribution(
  action: 'combat' | 'diplomacy' | 'trade' | 'espionage' | 'exploration',
  factionAlignment: FactionAlignment,
  success: boolean
): number {
  const baseHeat: Record<typeof action, number> = {
    combat: 15,
    diplomacy: -5,
    trade: -3,
    espionage: 10,
    exploration: 5,
  };

  let heat = baseHeat[action];

  // Alignment modifiers
  if (factionAlignment === 'Stasis') {
    // Stasis factions reduce heat through order
    if (action === 'diplomacy' || action === 'trade') {
      heat *= 1.5; // Reward order-promoting actions
    }
  } else if (factionAlignment === 'Plasticity') {
    // Plasticity factions increase heat through chaos
    if (action === 'combat' || action === 'espionage') {
      heat *= 1.5; // Amplify chaos-promoting actions
    }
  }

  // Success/failure modifier
  if (!success) {
    heat *= 1.3; // Failed actions increase tension
  }

  return Math.round(heat);
}

/**
 * Get narrative description of current pendulum state
 */
export function getPendulumNarrative(pendulumState: TacticalHeat): string {
  const { state, level, stasisInfluence, plasticityInfluence } = pendulumState;

  if (state === 'stasis-dominant') {
    if (level > 70) {
      return 'The forces of Stasis tighten their grip. Order becomes oppression. The Imperium calcifies under the weight of unchanging law.';
    } else if (level > 40) {
      return 'Stasis ascendant. The Neo-Praetorians enforce rigid order. Memory and tradition dominate the political landscape.';
    } else {
      return 'Stasis holds sway, but the balance remains delicate. Order prevails, but whispers of change persist.';
    }
  } else if (state === 'plasticity-dominant') {
    if (level > 70) {
      return 'Plasticity runs rampant. Chaos threatens to unmake reality itself. The Neo-Varangians revel in the collapse of order.';
    } else if (level > 40) {
      return 'Plasticity surges. Adaptation and change sweep through the Imperium. Old certainties crumble.';
    } else {
      return 'Plasticity gains ground. Change is in the air, but order has not yet broken.';
    }
  } else {
    if (level > 50) {
      return 'The Byzantine Pendulum swings wildly. Stasis and Plasticity clash in perfect opposition. The Imperium trembles at the brink.';
    } else {
      return 'Balance holds—for now. Stasis and Plasticity exist in uneasy equilibrium. The calm before the storm.';
    }
  }
}

/**
 * Apply pendulum effects to game systems
 */
export interface PendulumEffects {
  combatModifier: number; // Damage/accuracy multiplier
  encounterRate: number; // Encounter frequency multiplier
  marketPriceVariance: number; // Price volatility percentage
  diplomaticDifficulty: number; // Negotiation difficulty modifier
  espionageRisk: number; // Detection chance modifier
}

export function calculatePendulumEffects(pendulumState: TacticalHeat): PendulumEffects {
  const { modifiers } = pendulumState;

  return {
    combatModifier: modifiers.aiAggressiveness,
    encounterRate: modifiers.encounterFrequency,
    marketPriceVariance: (modifiers.resourceVolatility - 1) * 100, // Convert to percentage
    diplomaticDifficulty: modifiers.narrativeTension / 50, // 0-2 scale
    espionageRisk: modifiers.narrativeTension / 100, // 0-1 scale
  };
}
