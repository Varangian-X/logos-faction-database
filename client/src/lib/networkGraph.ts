import { Faction, factions } from "./factions";

export interface GraphNode {
  id: string;
  name: string;
  tier: number;
  alignment: string;
  category: string;
  color: string;
  size: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: "ally" | "enemy";
  color: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const alignmentColors = {
  Stasis: "#D4AF37",
  Plasticity: "#FF3333",
  Neutral: "#888888",
  Existential: "#00E5FF",
};

const tierSizes = {
  1: 30,
  2: 25,
  3: 20,
  4: 18,
  5: 16,
  6: 14,
  7: 12,
};

export function buildGraphData(selectedFactions?: string[]): GraphData {
  const factionsToUse = selectedFactions 
    ? factions.filter(f => selectedFactions.includes(f.id))
    : factions;

  const nodes: GraphNode[] = factionsToUse.map((faction) => ({
    id: faction.id,
    name: faction.name,
    tier: faction.tier,
    alignment: faction.alignment,
    category: faction.category,
    color: alignmentColors[faction.alignment as keyof typeof alignmentColors] || "#888888",
    size: tierSizes[faction.tier as keyof typeof tierSizes] || 15,
  }));

  const links: GraphLink[] = [];
  const processedPairs = new Set<string>();

  factionsToUse.forEach((faction) => {
    // Add ally links
    if (faction.allies) {
      faction.allies.forEach((allyName) => {
        const allyFaction = factions.find(f => f.name === allyName);
        if (allyFaction && factionsToUse.find(f => f.id === allyFaction.id)) {
          const pairKey = [faction.id, allyFaction.id].sort().join("-");
          if (!processedPairs.has(pairKey)) {
            links.push({
              source: faction.id,
              target: allyFaction.id,
              type: "ally",
              color: "rgba(0, 255, 65, 0.3)",
            });
            processedPairs.add(pairKey);
          }
        }
      });
    }

    // Add enemy links
    if (faction.enemies) {
      faction.enemies.forEach((enemyName) => {
        const enemyFaction = factions.find(f => f.name === enemyName);
        if (enemyFaction && factionsToUse.find(f => f.id === enemyFaction.id)) {
          const pairKey = [faction.id, enemyFaction.id].sort().join("-");
          if (!processedPairs.has(pairKey)) {
            links.push({
              source: faction.id,
              target: enemyFaction.id,
              type: "enemy",
              color: "rgba(255, 51, 51, 0.3)",
            });
            processedPairs.add(pairKey);
          }
        }
      });
    }
  });

  return { nodes, links };
}

export function getNodeLabel(node: GraphNode): string {
  return `${node.name}\nTier ${node.tier} • ${node.alignment}`;
}
