import { FactionResources } from "./factionDynamics";

export interface Governor {
  id: string;
  name: string;
  title: string;
  traits: string[];
  bonuses: Partial<FactionResources>;
  assignedSectorId: string | null;
  portraitUrl?: string;
}

export interface Edict {
  id: string;
  name: string;
  description: string;
  cost: Partial<FactionResources>;
  duration: number; // in turns/years
  effect: string;
}

export const GOVERNOR_TRAITS = [
  "Industrialist", // Bonus to Credits
  "Technocrat", // Bonus to Tech
  "Warlord", // Bonus to Manpower
  "Diplomat", // Bonus to Reputation
  "Corrupt", // Malus to Credits, Bonus to Influence
];

export const EDICTS: Edict[] = [
  {
    id: "martial_law",
    name: "Martial Law",
    description: "Enforce strict military control to suppress unrest.",
    cost: { credits: 50, manpower: 20 },
    duration: 5,
    effect: "Reduces unrest, increases manpower generation, decreases credit income.",
  },
  {
    id: "industrial_subsidy",
    name: "Industrial Subsidy",
    description: "Invest in local industry to boost production.",
    cost: { credits: 100 },
    duration: 10,
    effect: "Increases credit income significantly.",
  },
  {
    id: "research_grant",
    name: "Research Grant",
    description: "Fund local research initiatives.",
    cost: { credits: 80 },
    duration: 8,
    effect: "Increases tech generation.",
  },
  {
    id: "propaganda_campaign",
    name: "Propaganda Campaign",
    description: "Promote faction ideology to the populace.",
    cost: { credits: 40, tech: 10 },
    duration: 5,
    effect: "Increases faction reputation in the sector.",
  },
];

export function generateGovernor(): Governor {
  const titles = ["Exarch", "Prefect", "Logothete", "Strategos", "Magister"];
  const firstNames = ["Aurelius", "Cassia", "Decimus", "Flavia", "Gaius", "Helena", "Lucius", "Octavia"];
  const lastNames = ["Varrus", "Draco", "Severus", "Tullius", "Cato", "Felix", "Magnus"];
  
  const trait = GOVERNOR_TRAITS[Math.floor(Math.random() * GOVERNOR_TRAITS.length)];
  
  const bonuses: Partial<FactionResources> = {};
  if (trait === "Industrialist") bonuses.credits = 10;
  if (trait === "Technocrat") bonuses.tech = 10;
  if (trait === "Warlord") bonuses.manpower = 10;
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    title: titles[Math.floor(Math.random() * titles.length)],
    traits: [trait],
    bonuses,
    assignedSectorId: null,
  };
}
