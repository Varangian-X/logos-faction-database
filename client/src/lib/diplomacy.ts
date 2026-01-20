import { FactionResources } from "./factionDynamics";

export type DiplomaticStatus = "At War" | "Hostile" | "Neutral" | "Non-Aggression Pact" | "Trade Partner" | "Ally";

export interface DiplomaticTreaty {
  id: string;
  type: "Non-Aggression" | "Trade Agreement" | "Alliance" | "Research Pact";
  targetFactionId: string;
  turnsRemaining: number;
  benefits: {
    resourceIncome?: Partial<FactionResources>;
    defenseBonus?: boolean;
    techSharing?: boolean;
  };
}

export interface DiplomaticAction {
  id: string;
  name: string;
  description: string;
  requiredReputation: number;
  cost: {
    credits?: number;
    influence?: number; // Faction reputation cost
  };
  effect: (currentStatus: DiplomaticStatus) => DiplomaticStatus;
}

export const DIPLOMATIC_ACTIONS: DiplomaticAction[] = [
  {
    id: "propose_ceasefire",
    name: "Propose Ceasefire",
    description: "Negotiate an end to active hostilities.",
    requiredReputation: -50,
    cost: { credits: 100 },
    effect: (status) => status === "At War" ? "Hostile" : status
  },
  {
    id: "non_aggression_pact",
    name: "Sign Non-Aggression Pact",
    description: "Formal agreement to avoid conflict for a set duration.",
    requiredReputation: 10,
    cost: { credits: 200 },
    effect: (status) => ["Neutral", "Hostile"].includes(status) ? "Non-Aggression Pact" : status
  },
  {
    id: "trade_agreement",
    name: "Establish Trade Agreement",
    description: "Open borders for resource exchange.",
    requiredReputation: 30,
    cost: { credits: 500 },
    effect: (status) => ["Neutral", "Non-Aggression Pact"].includes(status) ? "Trade Partner" : status
  },
  {
    id: "alliance",
    name: "Form Alliance",
    description: "Full military and economic cooperation.",
    requiredReputation: 80,
    cost: { credits: 1000 },
    effect: (status) => ["Trade Partner", "Non-Aggression Pact"].includes(status) ? "Ally" : status
  }
];

export function getAvailableDiplomaticActions(currentReputation: number, currentStatus: DiplomaticStatus): DiplomaticAction[] {
  return DIPLOMATIC_ACTIONS.filter(action => {
    // Filter out actions that don't make sense for current status
    if (currentStatus === "At War" && action.id !== "propose_ceasefire") return false;
    if (currentStatus === "Ally" && action.id !== "break_alliance") return false; // TODO: Add break alliance
    
    return currentReputation >= action.requiredReputation;
  });
}

export function calculateDiplomaticIncome(treaties: DiplomaticTreaty[]): FactionResources {
  const income: FactionResources = { credits: 0, tech: 0, manpower: 0 };
  
  treaties.forEach(treaty => {
    if (treaty.benefits.resourceIncome) {
      if (treaty.benefits.resourceIncome.credits) income.credits += treaty.benefits.resourceIncome.credits;
      if (treaty.benefits.resourceIncome.tech) income.tech += treaty.benefits.resourceIncome.tech;
      if (treaty.benefits.resourceIncome.manpower) income.manpower += treaty.benefits.resourceIncome.manpower;
    }
  });
  
  return income;
}
