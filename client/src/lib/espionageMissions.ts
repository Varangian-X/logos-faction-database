import { FactionResources } from "./factionDynamics";

export interface EspionageMission {
  id: string;
  name: string;
  description: string;
  difficulty: "Low" | "Medium" | "High" | "Extreme";
  cost: FactionResources;
  duration: number; // turns
  successChance: number; // 0-1
  rewards: {
    intel?: string;
    resources?: Partial<FactionResources>;
    effect?: string;
  };
}

export const ESPIONAGE_MISSIONS: EspionageMission[] = [
  {
    id: "gather_intel",
    name: "Gather Intelligence",
    description: "Infiltrate local networks to map enemy assets and resource stockpiles.",
    difficulty: "Low",
    cost: { credits: 50, tech: 10, manpower: 0 },
    duration: 1,
    successChance: 0.8,
    rewards: {
      intel: "Reveals all enemy assets in the target sector.",
      resources: { tech: 20 },
    },
  },
  {
    id: "sabotage_production",
    name: "Sabotage Production",
    description: "Plant a virus in the enemy's manufacturing protocols to halt production.",
    difficulty: "Medium",
    cost: { credits: 100, tech: 30, manpower: 0 },
    duration: 2,
    successChance: 0.6,
    rewards: {
      effect: "Target faction loses 50% production for 3 turns.",
      resources: { credits: 50 }, // Stolen funds
    },
  },
  {
    id: "incite_unrest",
    name: "Incite Unrest",
    description: "Spread propaganda to destabilize the region and lower enemy reputation.",
    difficulty: "High",
    cost: { credits: 200, tech: 50, manpower: 10 },
    duration: 3,
    successChance: 0.4,
    rewards: {
      effect: "Target faction loses 20 Reputation in the sector.",
    },
  },
  {
    id: "steal_tech",
    name: "Steal Technology",
    description: "Extract classified blueprints from the enemy's research archives.",
    difficulty: "Extreme",
    cost: { credits: 500, tech: 100, manpower: 20 },
    duration: 5,
    successChance: 0.2,
    rewards: {
      resources: { tech: 200 },
      effect: "Unlocks a random technology instantly.",
    },
  },
];

export function resolveEspionage(mission: EspionageMission): { success: boolean; log: string } {
  const roll = Math.random();
  const success = roll < mission.successChance;
  
  if (success) {
    return {
      success: true,
      log: `Mission Successful: ${mission.name}. Operatives report: ${mission.rewards.intel || mission.rewards.effect}`,
    };
  } else {
    return {
      success: false,
      log: `Mission Failed: ${mission.name}. Operatives were detected and neutralized.`,
    };
  }
}
