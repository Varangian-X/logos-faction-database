import { getFactionMetrics, getFactionRelationship, type FactionMetrics } from './factionMetrics';

/**
 * Combat Encounter System
 * Generates dynamic combat encounters based on faction relationships and military strength
 */

export type EncounterType = 'interdiction' | 'patrol' | 'ambush' | 'raid' | 'inspection';
export type EncounterDifficulty = 'trivial' | 'easy' | 'moderate' | 'hard' | 'deadly';

export interface CombatEncounter {
  factionId: string;
  factionName: string;
  encounterType: EncounterType;
  difficulty: EncounterDifficulty;
  unitType: string;
  unitCount: number;
  threatLevel: number; // 1-10 scale
  description: string;
  rewards: {
    credits: number;
    reputation: number;
    loot?: string[];
  };
  penalties: {
    reputation: number;
    consequences?: string;
  };
}

export interface PlayerFactionStanding {
  factionId: string;
  reputation: number; // -100 to +100
  relationship: 'hostile' | 'unfriendly' | 'neutral' | 'friendly' | 'allied';
}

/**
 * Calculate encounter frequency based on faction military strength and relationship
 * Returns probability (0-1) of encounter occurring
 */
export function calculateEncounterFrequency(
  factionId: string,
  playerStanding: PlayerFactionStanding[],
  location: 'deep-space' | 'system-edge' | 'inner-system' | 'station'
): number {
  const metrics = getFactionMetrics(factionId);
  if (!metrics) return 0;

  const standing = playerStanding.find(s => s.factionId === factionId);
  const reputation = standing?.reputation ?? 0;

  // Base frequency from military strength (0-0.3)
  let frequency = (metrics.militaryStrength / 30) * 0.3;

  // Relationship modifier
  if (reputation < -50) {
    frequency *= 3.0; // Hostile: 3x encounters
  } else if (reputation < -20) {
    frequency *= 2.0; // Unfriendly: 2x encounters
  } else if (reputation > 50) {
    frequency *= 0.3; // Friendly: 70% reduction
  } else if (reputation > 20) {
    frequency *= 0.6; // Neutral-positive: 40% reduction
  }

  // Location modifier
  const locationModifiers = {
    'deep-space': 0.5,
    'system-edge': 0.8,
    'inner-system': 1.2,
    'station': 1.5,
  };
  frequency *= locationModifiers[location];

  // Threat level modifier
  if (metrics.threatLevel === 'EXISTENTIAL') {
    frequency *= 1.5;
  } else if (metrics.threatLevel === 'HIGH') {
    frequency *= 1.2;
  }

  return Math.min(frequency, 1.0);
}

/**
 * Generate a combat encounter for a specific faction
 */
export function generateEncounter(
  factionId: string,
  playerStanding: PlayerFactionStanding[],
  playerLevel: number = 1
): CombatEncounter | null {
  const metrics = getFactionMetrics(factionId);
  if (!metrics) return null;

  const standing = playerStanding.find(s => s.factionId === factionId);
  const reputation = standing?.reputation ?? 0;

  // Determine encounter type based on relationship
  const encounterType = determineEncounterType(reputation, metrics);
  
  // Calculate difficulty based on faction power and player level
  const difficulty = calculateDifficulty(metrics, playerLevel, reputation);
  
  // Determine unit composition
  const { unitType, unitCount } = determineUnits(metrics, difficulty);
  
  // Calculate threat level (1-10)
  const threatLevel = calculateThreatLevel(metrics, difficulty);

  // Generate description
  const description = generateEncounterDescription(
    metrics.factionName,
    encounterType,
    unitType,
    unitCount,
    reputation
  );

  // Calculate rewards and penalties
  const rewards = calculateRewards(metrics, difficulty, threatLevel);
  const penalties = calculatePenalties(metrics, reputation);

  return {
    factionId,
    factionName: metrics.factionName,
    encounterType,
    difficulty,
    unitType,
    unitCount,
    threatLevel,
    description,
    rewards,
    penalties,
  };
}

function determineEncounterType(reputation: number, metrics: FactionMetrics): EncounterType {
  if (reputation < -50) {
    // Hostile: aggressive encounters
    return Math.random() < 0.6 ? 'ambush' : 'raid';
  } else if (reputation < -20) {
    // Unfriendly: interdictions and patrols
    return Math.random() < 0.7 ? 'interdiction' : 'patrol';
  } else if (reputation > 20) {
    // Friendly: mostly inspections
    return 'inspection';
  } else {
    // Neutral: patrols and interdictions
    return Math.random() < 0.5 ? 'patrol' : 'interdiction';
  }
}

function calculateDifficulty(
  metrics: FactionMetrics,
  playerLevel: number,
  reputation: number
): EncounterDifficulty {
  // Base difficulty from faction military strength
  let difficultyScore = metrics.militaryStrength / 6; // 0-5 scale

  // Adjust for player level
  difficultyScore += (playerLevel - 1) * 0.5;

  // Hostile factions send stronger forces
  if (reputation < -50) {
    difficultyScore += 1.5;
  } else if (reputation < -20) {
    difficultyScore += 0.5;
  }

  // Map to difficulty categories
  if (difficultyScore < 1) return 'trivial';
  if (difficultyScore < 2) return 'easy';
  if (difficultyScore < 3.5) return 'moderate';
  if (difficultyScore < 5) return 'hard';
  return 'deadly';
}

function determineUnits(
  metrics: FactionMetrics,
  difficulty: EncounterDifficulty
): { unitType: string; unitCount: number } {
  const unitType = metrics.signatureUnit;

  const unitCountMap: Record<EncounterDifficulty, number> = {
    trivial: 1,
    easy: 2,
    moderate: 3,
    hard: 5,
    deadly: 8,
  };

  return {
    unitType,
    unitCount: unitCountMap[difficulty],
  };
}

function calculateThreatLevel(metrics: FactionMetrics, difficulty: EncounterDifficulty): number {
  const difficultyValues: Record<EncounterDifficulty, number> = {
    trivial: 2,
    easy: 4,
    moderate: 6,
    hard: 8,
    deadly: 10,
  };

  let threat = difficultyValues[difficulty];

  // Adjust for faction threat level
  if (metrics.threatLevel === 'EXISTENTIAL') {
    threat = Math.min(10, threat + 2);
  } else if (metrics.threatLevel === 'HIGH') {
    threat = Math.min(10, threat + 1);
  }

  return threat;
}

function generateEncounterDescription(
  factionName: string,
  encounterType: EncounterType,
  unitType: string,
  unitCount: number,
  reputation: number
): string {
  const typeDescriptions: Record<EncounterType, string> = {
    interdiction: `${factionName} forces have interdicted your vessel. ${unitCount}x ${unitType} demanding compliance.`,
    patrol: `${factionName} patrol detected. ${unitCount}x ${unitType} on standard sweep pattern.`,
    ambush: `AMBUSH! ${factionName} ${unitType} units (${unitCount}) emerging from concealment!`,
    raid: `${factionName} raid in progress! ${unitCount}x ${unitType} attacking!`,
    inspection: `${factionName} inspection. ${unitCount}x ${unitType} requesting standard identification protocols.`,
  };

  let description = typeDescriptions[encounterType];

  if (reputation < -50) {
    description += ' [HOSTILE - Weapons hot]';
  } else if (reputation < -20) {
    description += ' [Unfriendly - Heightened alert]';
  } else if (reputation > 50) {
    description += ' [Friendly - Routine procedure]';
  }

  return description;
}

function calculateRewards(
  metrics: FactionMetrics,
  difficulty: EncounterDifficulty,
  threatLevel: number
): CombatEncounter['rewards'] {
  const baseCredits = threatLevel * 100;
  const baseReputation = Math.floor(threatLevel / 2);

  const difficultyMultipliers: Record<EncounterDifficulty, number> = {
    trivial: 0.5,
    easy: 1.0,
    moderate: 1.5,
    hard: 2.5,
    deadly: 4.0,
  };

  const multiplier = difficultyMultipliers[difficulty];

  const loot: string[] = [];
  if (difficulty === 'hard' || difficulty === 'deadly') {
    loot.push(...metrics.primaryResources.slice(0, 2));
  }

  return {
    credits: Math.floor(baseCredits * multiplier),
    reputation: Math.floor(baseReputation * multiplier),
    loot: loot.length > 0 ? loot : undefined,
  };
}

function calculatePenalties(
  metrics: FactionMetrics,
  reputation: number
): CombatEncounter['penalties'] {
  const baseRepLoss = reputation < -50 ? 5 : 3;

  let consequences: string | undefined;
  if (reputation < -70) {
    consequences = `${metrics.factionName} has marked you as a priority target. Expect increased patrols.`;
  }

  return {
    reputation: baseRepLoss,
    consequences,
  };
}

/**
 * Neo-Praetorian Justiciar-Class Cutter - Special Encounter
 * High-threat law enforcement vessel
 */
export function generateJusticiarEncounter(
  playerStanding: PlayerFactionStanding[],
  playerLevel: number,
  warranted: boolean = false
): CombatEncounter {
  const neoPraetorianStanding = playerStanding.find(s => s.factionId === 'neo-praetorians');
  const reputation = neoPraetorianStanding?.reputation ?? 0;

  const difficulty: EncounterDifficulty = warranted ? 'deadly' : 'hard';
  const threatLevel = warranted ? 10 : 8;

  return {
    factionId: 'neo-praetorians',
    factionName: 'Neo-Praetorians',
    encounterType: warranted ? 'raid' : 'interdiction',
    difficulty,
    unitType: 'Justiciar-Class Cutter',
    unitCount: warranted ? 2 : 1,
    threatLevel,
    description: warranted
      ? 'WARRANT ACTIVE: Neo-Praetorian Justiciar-Class Cutters converging on your position! Compliance is mandatory.'
      : 'Neo-Praetorian Justiciar-Class Cutter has interdicted your vessel. Submit to inspection or face consequences.',
    rewards: {
      credits: warranted ? 2000 : 1000,
      reputation: warranted ? 15 : 8,
      loot: warranted ? ['Nicaean Cryptographic Keys', 'Imperial Authority Tokens'] : undefined,
    },
    penalties: {
      reputation: warranted ? 20 : 10,
      consequences: warranted
        ? 'Warrant escalated to MAXIMUM PRIORITY. All Neo-Praetorian forces alerted.'
        : 'Resisting Neo-Praetorian authority increases warrant level.',
    },
  };
}

/**
 * Get all possible encounters for current game state
 */
export function getAllPossibleEncounters(
  playerStanding: PlayerFactionStanding[],
  playerLevel: number,
  location: 'deep-space' | 'system-edge' | 'inner-system' | 'station'
): CombatEncounter[] {
  const encounters: CombatEncounter[] = [];

  // Major faction encounters
  const majorFactions = [
    'neo-praetorians',
    'neo-varangians',
    'ecclesiarchy',
    'the-sidhe',
    'mycenoids',
  ];

  for (const factionId of majorFactions) {
    const frequency = calculateEncounterFrequency(factionId, playerStanding, location);
    
    // Generate encounter if frequency check passes
    if (Math.random() < frequency) {
      const encounter = generateEncounter(factionId, playerStanding, playerLevel);
      if (encounter) {
        encounters.push(encounter);
      }
    }
  }

  return encounters;
}
