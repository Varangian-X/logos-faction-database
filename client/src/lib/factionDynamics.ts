import { SavedScenario, MissionOutcome } from '../contexts/CampaignContext';

export interface FactionResources {
  credits: number;
  tech: number;
  manpower: number;
}

export interface FactionStanding {
  faction: string;
  reputation: number;
  status: 'allied' | 'neutral' | 'hostile';
  influence: number;
  resources: FactionResources;
}

export interface CampaignState {
  factionStandings: Record<string, FactionStanding>;
  totalReputation: number;
  dominantFaction: string | null;
}

/**
 * Calculate faction standing based on cumulative reputation
 */
export function calculateFactionStanding(reputation: number): 'allied' | 'neutral' | 'hostile' {
  if (reputation >= 50) return 'allied';
  if (reputation <= -50) return 'hostile';
  return 'neutral';
}

/**
 * Determine outcome consequences based on mission type and faction standing
 */
export function generateOutcomeConsequences(
  mission: SavedScenario,
  outcome: 'success' | 'partial' | 'failure',
  factionReputation: Record<string, number>
): string[] {
  const consequences: string[] = [];
  const primaryFactionRep = factionReputation[mission.faction] || 0;
  const standing = calculateFactionStanding(primaryFactionRep);

  if (outcome === 'success') {
    consequences.push(`${mission.faction} recognizes your success`);
    if (standing === 'allied') {
      consequences.push('Allies offer additional support for future operations');
    } else if (standing === 'hostile') {
      consequences.push('Enemies grow wary of your capabilities');
    }
  } else if (outcome === 'partial') {
    consequences.push('Mixed results create complex political fallout');
    consequences.push('Rival factions exploit the situation');
  } else {
    consequences.push(`${mission.faction} suffers from your failure`);
    if (standing === 'allied') {
      consequences.push('Your allies question their commitment');
    } else {
      consequences.push('Enemies seize the opportunity to strike');
    }
  }

  return consequences;
}

/**
 * Calculate faction effects based on mission outcome and type
 */
export function calculateFactionEffects(
  mission: SavedScenario,
  outcome: 'success' | 'partial' | 'failure'
): Record<string, number> {
  const effects: Record<string, number> = {};
  
  // Primary faction effect
  if (outcome === 'success') {
    effects[mission.faction] = 20;
  } else if (outcome === 'partial') {
    effects[mission.faction] = 5;
  } else {
    effects[mission.faction] = -15;
  }

  // Type-specific effects
  switch (mission.type) {
    case 'Assassination':
      if (outcome === 'success') {
        effects['Neutral Observers'] = -5; // Neutral factions disapprove
        effects['Shadow Networks'] = 10; // Criminal factions approve
      }
      break;
    case 'Hostage Rescue':
      if (outcome === 'success') {
        effects['Humanitarian Factions'] = 15;
        effects['Stasis'] = 10;
      }
      break;
    case 'Supply Run':
      effects['Trade Factions'] = outcome === 'success' ? 12 : outcome === 'partial' ? 3 : -8;
      break;
    case 'Bounty Contract':
      effects['Mercenary Guilds'] = outcome === 'success' ? 15 : -10;
      break;
    case 'Heist/Raid':
      if (outcome === 'success') {
        effects['Criminal Networks'] = 15;
        effects['Law Enforcement'] = -10;
      }
      break;
    case 'Combat':
      effects['Military Powers'] = outcome === 'success' ? 15 : -10;
      break;
    case 'Diplomacy':
      effects['Political Factions'] = outcome === 'success' ? 12 : outcome === 'partial' ? 3 : -8;
      break;
    case 'Espionage':
      effects['Intelligence Agencies'] = outcome === 'success' ? 15 : -12;
      break;
  }

  return effects;
}

/**
 * Generate branched mission based on outcome and faction dynamics
 */
export function generateBranchedMissionTemplate(
  parentMission: SavedScenario,
  outcome: 'success' | 'partial' | 'failure',
  factionReputation: Record<string, number>
): Partial<SavedScenario> {
  const primaryFactionRep = factionReputation[parentMission.faction] || 0;
  const standing = calculateFactionStanding(primaryFactionRep);

  let title = '';
  let description = '';
  let objectives: string[] = [];
  let complications: string[] = [];

  if (outcome === 'success') {
    title = `Consolidation: ${parentMission.title}`;
    description = `Capitalize on your success and secure the gains from your previous mission.`;
    objectives = [
      'Secure strategic advantage from your victory',
      'Strengthen alliance with supporting factions',
      'Prevent enemy retaliation',
    ];
    complications = standing === 'allied' 
      ? ['Allies demand payment for their support', 'New threats emerge to challenge your position']
      : ['Enemies plot revenge', 'Neutral parties demand concessions'];
  } else if (outcome === 'partial') {
    title = `Salvage: ${parentMission.title}`;
    description = `The situation is unstable. Act quickly to salvage what you can.`;
    objectives = [
      'Stabilize the situation',
      'Prevent further deterioration',
      'Negotiate with affected parties',
    ];
    complications = [
      'Multiple factions exploit the chaos',
      'Your position is weakened',
      'Time is running out',
    ];
  } else {
    title = `Redemption: ${parentMission.title}`;
    description = `Your failure has consequences. Attempt to mitigate the damage.`;
    objectives = [
      'Repair relationships with affected factions',
      'Prevent escalation of the conflict',
      'Prove your worth through new action',
    ];
    complications = standing === 'hostile'
      ? ['Enemies move to finish you off', 'Your allies abandon you', 'Resources are depleted']
      : ['Allies demand compensation', 'Enemies grow bolder', 'Your reputation is damaged'];
  }

  return {
    title,
    description,
    objectives,
    complications,
    type: outcome === 'success' ? 'Diplomacy' : outcome === 'partial' ? 'Espionage' : 'Combat',
    location: parentMission.location,
    faction: standing === 'hostile' ? 'Neutral' : parentMission.faction,
    year: parentMission.year + 1,
  };
}

/**
 * Calculate campaign state from mission chain
 */
export function calculateCampaignState(missions: SavedScenario[]): CampaignState {
  const factionStandings: Record<string, FactionStanding> = {};
  let totalReputation = 0;

  missions.forEach(mission => {
    if (mission.factionReputation) {
      Object.entries(mission.factionReputation).forEach(([faction, rep]) => {
        if (!factionStandings[faction]) {
          factionStandings[faction] = {
            faction,
            reputation: rep,
            status: calculateFactionStanding(rep),
            influence: Math.abs(rep),
            resources: { credits: 50, tech: 50, manpower: 50 } // Base resources
          };
        } else {
          factionStandings[faction].reputation = rep;
          factionStandings[faction].status = calculateFactionStanding(rep);
          factionStandings[faction].influence = Math.abs(rep);
        }
        
        // Update resources based on mission outcome and type
        if (mission.status === 'completed') {
          const standing = factionStandings[faction];
          if (mission.type === 'Supply Run') standing.resources.credits += 10;
          if (mission.type === 'Heist/Raid') standing.resources.credits -= 10;
          if (mission.type === 'Espionage') standing.resources.tech += 5;
          if (mission.type === 'Combat') standing.resources.manpower -= 5;
          if (mission.type === 'Hostage Rescue') standing.resources.manpower += 5;
        }

        totalReputation += rep;
      });
    }
  });

  // Find dominant faction
  let dominantFaction: string | null = null;
  let maxInfluence = 0;
  Object.values(factionStandings).forEach(standing => {
    if (standing.influence > maxInfluence) {
      maxInfluence = standing.influence;
      dominantFaction = standing.faction;
    }
  });

  return {
    factionStandings,
    totalReputation,
    dominantFaction,
  };
}

/**
 * Determine if a mission should trigger branching
 */
export function shouldTriggerBranching(mission: SavedScenario): boolean {
  return mission.status === 'completed' || mission.status === 'failed';
}

/**
 * Get recommended next missions based on faction standing
 */
export function getRecommendedNextMissions(
  currentMission: SavedScenario,
  campaignState: CampaignState
): string[] {
  const recommendations: string[] = [];
  const primaryFactionRep = currentMission.factionReputation?.[currentMission.faction] || 0;

  if (primaryFactionRep >= 50) {
    recommendations.push('Leverage your strong alliance for a major operation');
    recommendations.push('Expand influence into new territories');
  } else if (primaryFactionRep <= -50) {
    recommendations.push('Seek redemption through a dangerous mission');
    recommendations.push('Switch allegiances to a neutral faction');
  } else {
    recommendations.push('Consolidate your current position');
    recommendations.push('Build relationships with other factions');
  }

  return recommendations;
}
