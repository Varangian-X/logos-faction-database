import { MapLocation } from "./mapData";
import { FactionResources } from "./factionDynamics";

export interface PlayerAsset {
  id: string;
  name: string;
  type: "Mining Outpost" | "Research Lab" | "Trade Hub" | "Military Base" | "Spaceport";
  location: string;
  locationName: string;
  owner: string; // faction name
  purchasePrice: number;
  level: 1 | 2 | 3; // upgrade level
  productionRate: Partial<FactionResources>; // resources generated per year
  maintenanceCost: Partial<FactionResources>; // resources consumed per year
  acquisitionMethod: "Purchase" | "Capture" | "Inherit";
  yearAcquired: number;
  status: "Active" | "Damaged" | "Contested" | "Destroyed";
  description: string;
}

export const assetTemplates: Record<string, Omit<PlayerAsset, 'id' | 'owner' | 'yearAcquired' | 'status'>> = {
  "Mining Outpost": {
    name: "Mining Outpost",
    type: "Mining Outpost",
    location: "",
    locationName: "",
    purchasePrice: 50,
    level: 1,
    productionRate: { credits: 15, tech: 0, manpower: 0 },
    maintenanceCost: { credits: 5, manpower: 3 },
    acquisitionMethod: "Purchase",
    description: "Extracts valuable minerals and ores for profit. Generates steady income.",
  },
  "Research Lab": {
    name: "Research Lab",
    type: "Research Lab",
    location: "",
    locationName: "",
    purchasePrice: 80,
    level: 1,
    productionRate: { credits: 5, tech: 20, manpower: 0 },
    maintenanceCost: { credits: 10, tech: 5 },
    acquisitionMethod: "Purchase",
    description: "Conducts advanced research and development. Generates technological breakthroughs.",
  },
  "Trade Hub": {
    name: "Trade Hub",
    type: "Trade Hub",
    location: "",
    locationName: "",
    purchasePrice: 60,
    level: 1,
    productionRate: { credits: 25, tech: 0, manpower: 0 },
    maintenanceCost: { credits: 8, manpower: 2 },
    acquisitionMethod: "Purchase",
    description: "Central marketplace for commerce. Generates high income through trade.",
  },
  "Military Base": {
    name: "Military Base",
    type: "Military Base",
    location: "",
    locationName: "",
    purchasePrice: 100,
    level: 1,
    productionRate: { credits: 0, tech: 5, manpower: 20 },
    maintenanceCost: { credits: 15, manpower: 10 },
    acquisitionMethod: "Purchase",
    description: "Trains and deploys military forces. Generates manpower and combat capability.",
  },
  "Spaceport": {
    name: "Spaceport",
    type: "Spaceport",
    location: "",
    locationName: "",
    purchasePrice: 120,
    level: 1,
    productionRate: { credits: 20, tech: 10, manpower: 5 },
    maintenanceCost: { credits: 12, tech: 3, manpower: 5 },
    acquisitionMethod: "Purchase",
    description: "Hub for space commerce and military operations. Generates diverse resources.",
  },
};

export function createPlayerAsset(
  type: keyof typeof assetTemplates,
  location: MapLocation,
  owner: string,
  yearAcquired: number,
  acquisitionMethod: "Purchase" | "Capture" | "Inherit" = "Purchase"
): PlayerAsset {
  const template = assetTemplates[type];

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: template.name,
    type: template.type,
    location: location.id,
    locationName: location.name,
    owner,
    purchasePrice: template.purchasePrice,
    level: 1,
    productionRate: { ...template.productionRate },
    maintenanceCost: { ...template.maintenanceCost },
    acquisitionMethod,
    yearAcquired,
    status: "Active",
    description: template.description,
  };
}

export function upgradeAsset(asset: PlayerAsset): PlayerAsset {
  if (asset.level >= 3) return asset;

  const upgraded = { ...asset, level: (asset.level + 1) as 1 | 2 | 3 };

  // Increase production by 50% per level
  const multiplier = 1 + asset.level * 0.5;
  upgraded.productionRate = {
    credits: asset.productionRate.credits ? Math.floor(asset.productionRate.credits * multiplier) : 0,
    tech: asset.productionRate.tech ? Math.floor(asset.productionRate.tech * multiplier) : 0,
    manpower: asset.productionRate.manpower ? Math.floor(asset.productionRate.manpower * multiplier) : 0,
  };

  // Increase maintenance by 25% per level
  const maintenanceMultiplier = 1 + (asset.level - 1) * 0.25;
  upgraded.maintenanceCost = {
    credits: asset.maintenanceCost.credits ? Math.floor(asset.maintenanceCost.credits * maintenanceMultiplier) : 0,
    tech: asset.maintenanceCost.tech ? Math.floor(asset.maintenanceCost.tech * maintenanceMultiplier) : 0,
    manpower: asset.maintenanceCost.manpower ? Math.floor(asset.maintenanceCost.manpower * maintenanceMultiplier) : 0,
  };

  return upgraded;
}

export function calculateAssetNetProduction(asset: PlayerAsset): Partial<FactionResources> {
  return {
    credits: (asset.productionRate.credits || 0) - (asset.maintenanceCost.credits || 0),
    tech: (asset.productionRate.tech || 0) - (asset.maintenanceCost.tech || 0),
    manpower: (asset.productionRate.manpower || 0) - (asset.maintenanceCost.manpower || 0),
  };
}

export function calculateTotalAssetProduction(assets: PlayerAsset[]): Partial<FactionResources> {
  const total: Partial<FactionResources> = { credits: 0, tech: 0, manpower: 0 };

  assets.forEach((asset) => {
    const net = calculateAssetNetProduction(asset);
    total.credits = (total.credits || 0) + (net.credits || 0);
    total.tech = (total.tech || 0) + (net.tech || 0);
    total.manpower = (total.manpower || 0) + (net.manpower || 0);
  });

  return total;
}

export function generateAssetCaptureScenario(asset: PlayerAsset, difficulty: "Easy" | "Medium" | "Hard") {
  const baseReward = asset.purchasePrice * 0.5;
  const difficultyMultiplier = difficulty === "Easy" ? 1 : difficulty === "Medium" ? 1.5 : 2;
  const reward = Math.floor(baseReward * difficultyMultiplier);

  return {
    title: `Capture: ${asset.name}`,
    description: `Seize control of the ${asset.name} at ${asset.locationName} from ${asset.owner}.`,
    objectives: [
      `Locate the ${asset.name}`,
      "Neutralize defensive forces",
      "Establish control and secure the facility",
    ],
    complications: [
      "Facility is heavily fortified",
      "Owner sends reinforcements",
      "Asset is rigged to self-destruct",
    ],
    reward,
    difficulty,
  };
}
