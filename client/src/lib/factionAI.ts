import { SavedScenario } from "@/contexts/CampaignContext";
import { FactionResources } from "./factionDynamics";
import { MapLocation, mapLocations } from "./mapData";
import { PlayerAsset, assetTemplates, createPlayerAsset } from "./playerAssets";

export interface FactionAIState {
  factionId: string;
  resources: FactionResources;
  assets: PlayerAsset[];
  strategy: "Aggressive" | "Economic" | "Technological" | "Balanced";
  targetLocation?: string;
  lastActionYear: number;
}

export function initializeFactionAI(factionId: string, strategy: FactionAIState["strategy"] = "Balanced"): FactionAIState {
  return {
    factionId,
    resources: {
      credits: 500,
      tech: 100,
      manpower: 200,
    },
    assets: [],
    strategy,
    lastActionYear: 0,
  };
}

export function processFactionAITurn(
  aiState: FactionAIState,
  currentYear: number,
  playerAssets: PlayerAsset[],
  mapLocations: MapLocation[]
): { newState: FactionAIState; actions: string[] } {
  const newState = { ...aiState };
  const actions: string[] = [];

  // 1. Resource Generation
  newState.resources.credits += 50; // Base income
  newState.resources.tech += 10;
  newState.resources.manpower += 20;

  newState.assets.forEach(asset => {
    if (asset.productionRate.credits) newState.resources.credits += asset.productionRate.credits;
    if (asset.productionRate.tech) newState.resources.tech += asset.productionRate.tech;
    if (asset.productionRate.manpower) newState.resources.manpower += asset.productionRate.manpower;
  });

  // 2. Decide Action based on Strategy
  if (newState.resources.credits >= 150) {
    // Attempt to expand
    const target = findExpansionTarget(newState, mapLocations, playerAssets);
    if (target) {
      const assetType = determineAssetType(newState.strategy);
      const cost = assetTemplates[assetType].purchasePrice;

      if (newState.resources.credits >= cost) {
        newState.resources.credits -= cost;
        const newAsset = createPlayerAsset(assetType, target, newState.factionId, currentYear, "Purchase");
        newState.assets.push(newAsset);
        actions.push(`${newState.factionId} established a ${assetType} at ${target.name}`);
      }
    }
  }

  // 3. Conflict Logic (Simplified)
  if (newState.strategy === "Aggressive" && newState.resources.manpower >= 100) {
    // Look for player assets to raid
    const playerTarget = playerAssets.find(a => a.status === "Active");
    if (playerTarget) {
      // 20% chance to raid
      if (Math.random() < 0.2) {
        actions.push(`${newState.factionId} launched a raid on your ${playerTarget.name} at ${playerTarget.locationName}!`);
        // In a full implementation, this would trigger a mission or reduce asset health
      }
    }
  }

  newState.lastActionYear = currentYear;
  return { newState, actions };
}

function findExpansionTarget(aiState: FactionAIState, locations: MapLocation[], playerAssets: PlayerAsset[]): MapLocation | null {
  // Find a location not already occupied by this faction's assets
  const occupiedLocations = new Set(aiState.assets.map(a => a.location));
  
  // Filter valid locations
  const validLocations = locations.filter(l => !occupiedLocations.has(l.id));
  
  if (validLocations.length === 0) return null;
  
  // Pick random valid location
  return validLocations[Math.floor(Math.random() * validLocations.length)];
}

function determineAssetType(strategy: FactionAIState["strategy"]): keyof typeof assetTemplates {
  switch (strategy) {
    case "Aggressive":
      return Math.random() < 0.7 ? "Military Base" : "Mining Outpost";
    case "Economic":
      return Math.random() < 0.7 ? "Trade Hub" : "Mining Outpost";
    case "Technological":
      return Math.random() < 0.7 ? "Research Lab" : "Spaceport";
    case "Balanced":
    default:
      const types = Object.keys(assetTemplates) as (keyof typeof assetTemplates)[];
      return types[Math.floor(Math.random() * types.length)];
  }
}
