// Consolidated types for Logos Imperium

export interface FactionResources {
  credits: number;
  tech: number;
  manpower: number;
  influence: number;
  intel: number;
}

export interface Faction {
  id: string;
  name: string;
  alignment: "Stasis" | "Fluidity" | "Existential";
  tier: 1 | 2 | 3;
  description: string;
  resources: FactionResources;
  reputation: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: "Combat" | "Diplomacy" | "Espionage" | "Trade" | "Exploration";
  difficulty: "Low" | "Medium" | "High" | "Extreme";
  rewards: Partial<FactionResources>;
  cost: Partial<FactionResources>;
  duration: number;
}

export interface Asset {
  id: string;
  name: string;
  type: "Military" | "Economic" | "Research" | "Espionage";
  tier: 1 | 2 | 3;
  production: Partial<FactionResources>;
  maintenance: Partial<FactionResources>;
}
