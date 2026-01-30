import { getFactionMetrics, getFactionRelationship } from './factionMetrics';
import type { PlayerFactionStanding } from './combatEncounters';

export type { PlayerFactionStanding };

/**
 * Faction Standing System
 * Manages player reputation with factions and cascading relationship effects
 */

export type MissionType = 
  | 'combat-victory'
  | 'combat-defeat'
  | 'combat-flee'
  | 'diplomacy-success'
  | 'diplomacy-failure'
  | 'trade-completed'
  | 'espionage-success'
  | 'espionage-caught'
  | 'rescue-mission'
  | 'assassination'
  | 'sabotage';

export interface MissionOutcome {
  type: MissionType;
  targetFactionId: string;
  success: boolean;
  significance: 'minor' | 'moderate' | 'major' | 'critical';
  witnessedBy?: string[]; // Other factions that observed the action
}

export interface FactionStandingChange {
  factionId: string;
  factionName: string;
  oldReputation: number;
  newReputation: number;
  change: number;
  reason: string;
  relationshipChanged: boolean;
  oldRelationship: PlayerFactionStanding['relationship'];
  newRelationship: PlayerFactionStanding['relationship'];
}

export interface MissionResult {
  primaryChanges: FactionStandingChange[];
  cascadeChanges: FactionStandingChange[];
  narrativeConsequences: string[];
  unlockedOpportunities: string[];
  newThreats: string[];
}

/**
 * Calculate reputation change from a mission outcome
 */
export function calculateReputationChange(
  outcome: MissionOutcome,
  currentReputation: number
): number {
  // Base reputation changes by mission type
  const baseChanges: Record<MissionType, { success: number; failure: number }> = {
    'combat-victory': { success: 10, failure: 0 },
    'combat-defeat': { success: 0, failure: -15 },
    'combat-flee': { success: 0, failure: -8 },
    'diplomacy-success': { success: 15, failure: -5 },
    'diplomacy-failure': { success: -5, failure: -10 },
    'trade-completed': { success: 5, failure: -3 },
    'espionage-success': { success: 0, failure: 0 }, // Espionage is secret
    'espionage-caught': { success: 0, failure: -25 },
    'rescue-mission': { success: 20, failure: -10 },
    'assassination': { success: -30, failure: -15 },
    'sabotage': { success: -20, failure: -10 },
  };

  const baseChange = outcome.success 
    ? baseChanges[outcome.type].success 
    : baseChanges[outcome.type].failure;

  // Significance multiplier
  const significanceMultipliers = {
    minor: 0.5,
    moderate: 1.0,
    major: 1.5,
    critical: 2.5,
  };

  let change = baseChange * significanceMultipliers[outcome.significance];

  // Diminishing returns for high reputation
  if (change > 0 && currentReputation > 50) {
    change *= 0.7;
  } else if (change > 0 && currentReputation > 75) {
    change *= 0.5;
  }

  // Accelerating losses for low reputation
  if (change < 0 && currentReputation < -50) {
    change *= 1.3;
  }

  return Math.round(change);
}

/**
 * Calculate cascading reputation effects based on faction relationships
 */
export function calculateCascadingEffects(
  primaryFactionId: string,
  reputationChange: number,
  allStandings: PlayerFactionStanding[]
): Array<{ factionId: string; change: number; reason: string }> {
  const cascades: Array<{ factionId: string; change: number; reason: string }> = [];
  const primaryMetrics = getFactionMetrics(primaryFactionId);
  
  if (!primaryMetrics) return cascades;

  // Check all other factions for relationship effects
  for (const standing of allStandings) {
    if (standing.factionId === primaryFactionId) continue;

    const relationship = getFactionRelationship(primaryFactionId, standing.factionId);
    
    if (relationship === 'ally') {
      // Allies share reputation changes (50% effect)
      const cascadeChange = Math.round(reputationChange * 0.5);
      if (cascadeChange !== 0) {
        cascades.push({
          factionId: standing.factionId,
          change: cascadeChange,
          reason: `Allied with ${primaryMetrics.factionName}`,
        });
      }
    } else if (relationship === 'enemy') {
      // Enemies have inverse reputation changes (30% effect)
      const cascadeChange = Math.round(reputationChange * -0.3);
      if (cascadeChange !== 0) {
        cascades.push({
          factionId: standing.factionId,
          change: cascadeChange,
          reason: `Enemy of ${primaryMetrics.factionName}`,
        });
      }
    }
  }

  return cascades;
}

/**
 * Determine relationship status from reputation score
 */
export function getRelationshipFromReputation(reputation: number): PlayerFactionStanding['relationship'] {
  if (reputation >= 75) return 'allied';
  if (reputation >= 25) return 'friendly';
  if (reputation >= -25) return 'neutral';
  if (reputation >= -75) return 'unfriendly';
  return 'hostile';
}

/**
 * Process a mission outcome and update all affected faction standings
 */
export function processMissionOutcome(
  outcome: MissionOutcome,
  currentStandings: PlayerFactionStanding[]
): MissionResult {
  const primaryChanges: FactionStandingChange[] = [];
  const cascadeChanges: FactionStandingChange[] = [];
  const narrativeConsequences: string[] = [];
  const unlockedOpportunities: string[] = [];
  const newThreats: string[] = [];

  // Find current standing with target faction
  const targetStanding = currentStandings.find(s => s.factionId === outcome.targetFactionId);
  if (!targetStanding) {
    console.warn(`No standing found for faction: ${outcome.targetFactionId}`);
    return { primaryChanges, cascadeChanges, narrativeConsequences, unlockedOpportunities, newThreats };
  }

  // Calculate primary reputation change
  const reputationChange = calculateReputationChange(outcome, targetStanding.reputation);
  const newReputation = Math.max(-100, Math.min(100, targetStanding.reputation + reputationChange));
  
  const oldRelationship = getRelationshipFromReputation(targetStanding.reputation);
  const newRelationship = getRelationshipFromReputation(newReputation);
  const relationshipChanged = oldRelationship !== newRelationship;

  const targetMetrics = getFactionMetrics(outcome.targetFactionId);
  if (targetMetrics) {
    primaryChanges.push({
      factionId: outcome.targetFactionId,
      factionName: targetMetrics.factionName,
      oldReputation: targetStanding.reputation,
      newReputation,
      change: reputationChange,
      reason: getMissionReasonText(outcome),
      relationshipChanged,
      oldRelationship,
      newRelationship,
    });

    // Generate narrative consequences for relationship changes
    if (relationshipChanged) {
      narrativeConsequences.push(
        generateRelationshipChangeNarrative(targetMetrics.factionName, oldRelationship, newRelationship)
      );

      // Check for unlocked opportunities or new threats
      if (newRelationship === 'allied') {
        unlockedOpportunities.push(`${targetMetrics.factionName} alliance unlocks exclusive contracts and resources`);
      } else if (newRelationship === 'hostile') {
        newThreats.push(`${targetMetrics.factionName} has marked you as an enemy. Expect increased aggression.`);
      }
    }
  }

  // Calculate cascading effects
  const cascades = calculateCascadingEffects(outcome.targetFactionId, reputationChange, currentStandings);
  
  for (const cascade of cascades) {
    const cascadeStanding = currentStandings.find(s => s.factionId === cascade.factionId);
    if (!cascadeStanding) continue;

    const cascadeNewRep = Math.max(-100, Math.min(100, cascadeStanding.reputation + cascade.change));
    const cascadeOldRel = getRelationshipFromReputation(cascadeStanding.reputation);
    const cascadeNewRel = getRelationshipFromReputation(cascadeNewRep);
    const cascadeRelChanged = cascadeOldRel !== cascadeNewRel;

    const cascadeMetrics = getFactionMetrics(cascade.factionId);
    if (cascadeMetrics) {
      cascadeChanges.push({
        factionId: cascade.factionId,
        factionName: cascadeMetrics.factionName,
        oldReputation: cascadeStanding.reputation,
        newReputation: cascadeNewRep,
        change: cascade.change,
        reason: cascade.reason,
        relationshipChanged: cascadeRelChanged,
        oldRelationship: cascadeOldRel,
        newRelationship: cascadeNewRel,
      });

      if (cascadeRelChanged) {
        narrativeConsequences.push(
          `${cascadeMetrics.factionName}: ${cascade.reason} (${cascadeOldRel} → ${cascadeNewRel})`
        );
      }
    }
  }

  // Check for witnessed actions
  if (outcome.witnessedBy && outcome.witnessedBy.length > 0) {
    for (const witnessId of outcome.witnessedBy) {
      const witnessMetrics = getFactionMetrics(witnessId);
      if (witnessMetrics) {
        narrativeConsequences.push(
          `${witnessMetrics.factionName} witnessed your actions. Word will spread.`
        );
      }
    }
  }

  return {
    primaryChanges,
    cascadeChanges,
    narrativeConsequences,
    unlockedOpportunities,
    newThreats,
  };
}

function getMissionReasonText(outcome: MissionOutcome): string {
  const typeTexts: Record<MissionType, string> = {
    'combat-victory': 'Defeated in combat',
    'combat-defeat': 'Defeated you in combat',
    'combat-flee': 'You fled from combat',
    'diplomacy-success': 'Successful diplomatic negotiation',
    'diplomacy-failure': 'Failed diplomatic negotiation',
    'trade-completed': 'Trade agreement completed',
    'espionage-success': 'Covert operation (undetected)',
    'espionage-caught': 'Caught conducting espionage',
    'rescue-mission': 'Rescued their personnel',
    'assassination': 'Assassination of faction member',
    'sabotage': 'Sabotage of faction assets',
  };

  return typeTexts[outcome.type];
}

function generateRelationshipChangeNarrative(
  factionName: string,
  oldRel: PlayerFactionStanding['relationship'],
  newRel: PlayerFactionStanding['relationship']
): string {
  const improvements: Record<string, string> = {
    'hostile-unfriendly': `${factionName} grudgingly acknowledges your recent actions. Hostilities reduced.`,
    'hostile-neutral': `${factionName} calls for a ceasefire. Relations normalized.`,
    'unfriendly-neutral': `${factionName} relations improve to neutral standing.`,
    'neutral-friendly': `${factionName} extends an offer of friendship.`,
    'friendly-allied': `${factionName} proposes a formal alliance!`,
  };

  const deteriorations: Record<string, string> = {
    'allied-friendly': `${factionName} alliance weakens. Trust has been damaged.`,
    'friendly-neutral': `${factionName} friendship cools. Relations become neutral.`,
    'neutral-unfriendly': `${factionName} grows suspicious of your intentions.`,
    'unfriendly-hostile': `${factionName} declares you an enemy of their people!`,
  };

  const key = `${oldRel}-${newRel}`;
  return improvements[key] || deteriorations[key] || `${factionName} relationship changed: ${oldRel} → ${newRel}`;
}

/**
 * Initialize default faction standings for a new player
 */
export function initializeDefaultStandings(): PlayerFactionStanding[] {
  const majorFactions = [
    'neo-praetorians',
    'neo-varangians',
    'ecclesiarchy',
    'the-sidhe',
    'mycenoids',
  ];

  return majorFactions.map(factionId => ({
    factionId,
    reputation: 0,
    relationship: 'neutral',
  }));
}

/**
 * Apply faction standing changes to current standings array
 */
export function applyStandingChanges(
  currentStandings: PlayerFactionStanding[],
  changes: FactionStandingChange[]
): PlayerFactionStanding[] {
  const updated = [...currentStandings];

  for (const change of changes) {
    const standing = updated.find(s => s.factionId === change.factionId);
    if (standing) {
      standing.reputation = change.newReputation;
      standing.relationship = change.newRelationship;
    }
  }

  return updated;
}
