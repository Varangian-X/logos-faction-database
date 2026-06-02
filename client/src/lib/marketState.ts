/**
 * Market State Management
 * JSON-serializable market data structure with image URLs and Notion integration
 */

export type ItemCategory = 'weapons' | 'ships' | 'resources' | 'technology' | 'equipment';
export type MarketStatus = 'Inflationary' | 'Depressed' | 'Concern' | 'Expected';

/**
 * Market Item - fully serializable to JSON
 * All images referenced via URLs stored in imageUrl field
 */
export interface MarketItem {
  id: string;
  resourceId: string;
  name: string;
  category: ItemCategory;
  description: string;
  basePrice: number;
  strategicValue: string;
  status: MarketStatus;
  marketTrends: string;
  marketNodes: string;
  place?: string;
  date?: string;
  imageUrl?: string; // URL to external image (S3, CDN, etc.)
  factionId?: string;
  requiresAlliance?: boolean;
  stats?: Record<string, number | string>;
  notionUrl?: string;
}

/**
 * Faction data from Notion
 */
export interface Faction {
  id: string;
  name: string;
  type: string;
  alignmentPolitical: string;
  status: string;
  imageUrl?: string;
  notionUrl?: string;
}

/**
 * Complete market state snapshot
 * Can be exported to JSON and imported back
 */
export interface MarketStateSnapshot {
  version: string;
  timestamp: string;
  metadata: {
    name: string;
    description: string;
    author?: string;
    notionFactionsDatabaseId?: string;
    notionResourcesDatabaseId?: string;
  };
  factions: Faction[];
  items: MarketItem[];
  categories: ItemCategory[];
  priceModifiers: Record<MarketStatus, number>;
}

/**
 * Default price modifiers based on market status
 */
export const DEFAULT_PRICE_MODIFIERS: Record<MarketStatus, number> = {
  Inflationary: 0.35, // +35%
  Expected: 0, // Baseline
  Concern: -0.2, // -20%
  Depressed: -0.3, // -30%
};

/**
 * Create empty market state
 */
export function createEmptyMarketState(): MarketStateSnapshot {
  return {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    metadata: {
      name: 'Logos Imperium Market State',
      description: 'Market data snapshot with live Notion integration',
      author: 'Logos Imperium',
    },
    factions: [],
    items: [],
    categories: ['weapons', 'ships', 'resources', 'technology', 'equipment'],
    priceModifiers: DEFAULT_PRICE_MODIFIERS,
  };
}

/**
 * Serialize market state to JSON string
 */
export function serializeMarketState(state: MarketStateSnapshot): string {
  return JSON.stringify(state, null, 2);
}

/**
 * Deserialize market state from JSON string
 */
export function deserializeMarketState(json: string): MarketStateSnapshot {
  try {
    const parsed = JSON.parse(json);
    
    // Validate required fields
    if (!parsed.version || !parsed.items || !Array.isArray(parsed.items)) {
      throw new Error('Invalid market state format');
    }
    
    return parsed as MarketStateSnapshot;
  } catch (error) {
    throw new Error(`Failed to deserialize market state: ${error}`);
  }
}

/**
 * Export market state to JSON file
 */
export function exportMarketStateToFile(state: MarketStateSnapshot, filename?: string): void {
  const json = serializeMarketState(state);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `market-state-${state.timestamp}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import market state from JSON file
 */
export async function importMarketStateFromFile(file: File): Promise<MarketStateSnapshot> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const state = deserializeMarketState(json);
        resolve(state);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Calculate price with modifiers
 */
export function calculatePrice(
  basePrice: number,
  status: MarketStatus,
  modifiers: Record<MarketStatus, number> = DEFAULT_PRICE_MODIFIERS
): number {
  const modifier = modifiers[status] || 0;
  return Math.round(basePrice * (1 + modifier));
}

/**
 * Get items by category
 */
export function getItemsByCategory(
  items: MarketItem[],
  category: ItemCategory
): MarketItem[] {
  return items.filter((item) => item.category === category);
}

/**
 * Get items by market status
 */
export function getItemsByStatus(
  items: MarketItem[],
  status: MarketStatus
): MarketItem[] {
  return items.filter((item) => item.status === status);
}

/**
 * Search items by name or description
 */
export function searchItems(
  items: MarketItem[],
  query: string
): MarketItem[] {
  const lowerQuery = query.toLowerCase();
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get items by market node/location
 */
export function getItemsByMarketNode(
  items: MarketItem[],
  node: string
): MarketItem[] {
  return items.filter((item) =>
    item.marketNodes.toLowerCase().includes(node.toLowerCase())
  );
}

/**
 * Get faction by ID
 */
export function getFactionById(
  factions: Faction[],
  id: string
): Faction | undefined {
  return factions.find((f) => f.id === id);
}

/**
 * Create market state from Notion data
 * Maps Notion fields to MarketStateSnapshot
 */
export function createMarketStateFromNotionData(
  factions: Faction[],
  resources: MarketItem[]
): MarketStateSnapshot {
  const state = createEmptyMarketState();
  state.factions = factions;
  state.items = resources;
  state.timestamp = new Date().toISOString();
  return state;
}

/**
 * Merge two market states (newer overwrites older)
 */
export function mergeMarketStates(
  older: MarketStateSnapshot,
  newer: MarketStateSnapshot
): MarketStateSnapshot {
  return {
    ...older,
    ...newer,
    timestamp: newer.timestamp,
    items: [
      ...newer.items,
      ...older.items.filter((item) => !newer.items.find((ni) => ni.id === item.id)),
    ],
    factions: [
      ...newer.factions,
      ...older.factions.filter((faction) => !newer.factions.find((nf) => nf.id === faction.id)),
    ],
  };
}

/**
 * Validate market state integrity
 */
export function validateMarketState(state: MarketStateSnapshot): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!state.version) errors.push('Missing version');
  if (!state.timestamp) errors.push('Missing timestamp');
  if (!Array.isArray(state.items)) errors.push('Items must be an array');
  if (!Array.isArray(state.factions)) errors.push('Factions must be an array');

  // Validate items
  if (Array.isArray(state.items)) {
    state.items.forEach((item, index) => {
      if (!item.id) errors.push(`Item ${index} missing id`);
      if (!item.name) errors.push(`Item ${index} missing name`);
      if (!item.category) errors.push(`Item ${index} missing category`);
      if (item.basePrice === undefined) errors.push(`Item ${index} missing basePrice`);
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
