import { PlayerAsset } from "./playerAssets";

export interface Technology {
  id: string;
  name: string;
  description: string;
  cost: number; // Tech cost
  prerequisites: string[]; // IDs of required technologies
  category: "Infrastructure" | "Military" | "Economic" | "Xenotech";
  effects: {
    unlockAsset?: string[]; // Asset types unlocked
    resourceBonus?: {
      credits?: number; // Percentage bonus
      tech?: number;
      manpower?: number;
    };
    unlockDiplomacy?: boolean; // Unlocks advanced diplomacy options
  };
}

export const TECH_TREE: Record<string, Technology> = {
  // Tier 1
  "basic_logistics": {
    id: "basic_logistics",
    name: "Basic Logistics",
    description: "Standardized shipping containers and routing algorithms.",
    cost: 50,
    prerequisites: [],
    category: "Infrastructure",
    effects: {
      resourceBonus: { credits: 0.05 }
    }
  },
  "planetary_defense": {
    id: "planetary_defense",
    name: "Planetary Defense Doctrine",
    description: "Basic surface-to-orbit defense coordination.",
    cost: 75,
    prerequisites: [],
    category: "Military",
    effects: {
      unlockAsset: ["Military Base"]
    }
  },
  "xenolinguistics": {
    id: "xenolinguistics",
    name: "Xenolinguistics",
    description: "Database of known xenos dialects and protocols.",
    cost: 100,
    prerequisites: [],
    category: "Xenotech",
    effects: {
      unlockDiplomacy: true
    }
  },

  // Tier 2
  "orbital_construction": {
    id: "orbital_construction",
    name: "Orbital Construction",
    description: "Zero-G manufacturing techniques for large structures.",
    cost: 200,
    prerequisites: ["basic_logistics"],
    category: "Infrastructure",
    effects: {
      unlockAsset: ["Spaceport"]
    }
  },
  "advanced_mining": {
    id: "advanced_mining",
    name: "Deep Core Extraction",
    description: "High-energy lasers for mantle-level mining.",
    cost: 150,
    prerequisites: ["basic_logistics"],
    category: "Economic",
    effects: {
      resourceBonus: { credits: 0.15 }
    }
  },
  "automated_warfare": {
    id: "automated_warfare",
    name: "Automated Warfare",
    description: "AI-driven combat drones and automated turrets.",
    cost: 250,
    prerequisites: ["planetary_defense"],
    category: "Military",
    effects: {
      resourceBonus: { manpower: 0.1 }
    }
  },

  // Tier 3
  "dyson_theory": {
    id: "dyson_theory",
    name: "Stellar Harvesting Theory",
    description: "Theoretical framework for Dyson Swarm components.",
    cost: 500,
    prerequisites: ["orbital_construction", "advanced_mining"],
    category: "Infrastructure",
    effects: {
      unlockAsset: ["Dyson Swarm Node"] // Hypothetical advanced asset
    }
  },
  "quantum_comms": {
    id: "quantum_comms",
    name: "Quantum Entanglement Comms",
    description: "Instantaneous communication across sectors.",
    cost: 400,
    prerequisites: ["xenolinguistics", "orbital_construction"],
    category: "Xenotech",
    effects: {
      resourceBonus: { tech: 0.2 }
    }
  }
};

export interface TechState {
  unlockedTechs: string[];
  researchProgress: Record<string, number>; // For partial research if implemented later
}

export function canUnlockTech(techId: string, state: TechState, currentTechResources: number): boolean {
  const tech = TECH_TREE[techId];
  if (!tech) return false;
  if (state.unlockedTechs.includes(techId)) return false;
  if (currentTechResources < tech.cost) return false;
  
  // Check prerequisites
  for (const prereq of tech.prerequisites) {
    if (!state.unlockedTechs.includes(prereq)) return false;
  }
  
  return true;
}

export function getUnlockableTechs(state: TechState): Technology[] {
  return Object.values(TECH_TREE).filter(tech => {
    if (state.unlockedTechs.includes(tech.id)) return false;
    return tech.prerequisites.every(prereq => state.unlockedTechs.includes(prereq));
  });
}
