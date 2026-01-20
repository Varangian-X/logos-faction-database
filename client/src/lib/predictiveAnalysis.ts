import { SavedScenario } from '../contexts/CampaignContext';
import { calculateFactionEffects } from './factionDynamics';

export interface PredictionResult {
  faction: string;
  currentRep: number;
  predictedRep: number;
  change: number;
  consequence: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export function predictMissionOutcome(
  mission: SavedScenario,
  currentReputation: Record<string, number>,
  outcome: 'success' | 'failure'
): PredictionResult[] {
  const results: PredictionResult[] = [];
  
  // Base reputation change based on mission type and outcome
  let baseChange = 0;
  if (outcome === 'success') {
    baseChange = mission.type === 'Diplomacy' ? 15 : 10;
  } else {
    baseChange = mission.type === 'Diplomacy' ? -10 : -15;
  }

  // Primary faction prediction
  const currentPrimaryRep = currentReputation[mission.faction] || 0;
  const predictedPrimaryRep = currentPrimaryRep + baseChange;
  
  results.push({
    faction: mission.faction,
    currentRep: currentPrimaryRep,
    predictedRep: predictedPrimaryRep,
    change: baseChange,
    consequence: getConsequenceDescription(mission.faction, predictedPrimaryRep, baseChange),
    riskLevel: getRiskLevel(predictedPrimaryRep, baseChange)
  });

  // Related factions (if any)
  if (mission.factionReputation) {
    Object.entries(mission.factionReputation).forEach(([faction, change]) => {
      if (faction !== mission.faction) {
        // Adjust change based on outcome (failure reverses or amplifies negative effects)
        const adjustedChange = outcome === 'success' ? change : -change;
        const currentRep = currentReputation[faction] || 0;
        const predictedRep = currentRep + adjustedChange;

        results.push({
          faction,
          currentRep,
          predictedRep,
          change: adjustedChange,
          consequence: getConsequenceDescription(faction, predictedRep, adjustedChange),
          riskLevel: getRiskLevel(predictedRep, adjustedChange)
        });
      }
    });
  }

  return results;
}

function getConsequenceDescription(faction: string, rep: number, change: number): string {
  if (rep >= 50 && change > 0) return `${faction} alliance strengthened. Special support likely.`;
  if (rep >= 50 && change < 0) return `${faction} alliance strained but intact.`;
  if (rep <= -50 && change < 0) return `${faction} hostility deepens. Retaliation imminent.`;
  if (rep <= -50 && change > 0) return `${faction} wariness persists, but tensions cool slightly.`;
  
  if (change > 10) return `Significant reputation gain with ${faction}.`;
  if (change < -10) return `Major diplomatic incident with ${faction}.`;
  
  return `Minor influence shift with ${faction}.`;
}

function getRiskLevel(rep: number, change: number): 'low' | 'medium' | 'high' | 'critical' {
  if (rep <= -75) return 'critical';
  if (rep <= -50 && change < 0) return 'high';
  if (change < -15) return 'medium';
  return 'low';
}
