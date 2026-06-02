/**
 * Notion to Market Data Mapper
 * Converts Notion Factions and Resources into market-compatible data structures
 */

import { NotionFaction, NotionResource } from './notionClient';
import { MarketItem, ItemCategory, ItemRarity } from './marketCatalog';

/**
 * Map Notion Resource to MarketItem
 */
export function mapNotionResourceToMarketItem(
  resource: NotionResource,
  factionId?: string
): MarketItem {
  // Map strategic value to rarity
  const rarityMap: Record<string, ItemRarity> = {
    'Low': 'common',
    'Medium': 'uncommon',
    'High': 'rare',
    'Critical': 'exclusive',
    'Legendary': 'legendary',
  };

  const categoryMap: Record<string, ItemCategory> = {
    'weapons': 'weapons',
    'ships': 'ships',
    'resources': 'resources',
    'technology': 'technology',
    'equipment': 'equipment',
    'armor': 'equipment',
    'ammunition': 'resources',
    'fuel': 'resources',
  };

  return {
    id: resource.resourceId || resource.id,
    name: resource.name,
    description: resource.description,
    category: (categoryMap[resource.category] || 'resources') as ItemCategory,
    rarity: (rarityMap[resource.strategicValue] || 'uncommon') as ItemRarity,
    basePrice: resource.basePrice || 1000,
    factionId: factionId || null,
    imageUrl: resource.imageUrl,
    stats: {
      marketStatus: resource.status || 'Expected',
      marketTrends: resource.marketTrends || 'Stable',
      marketNodes: resource.marketNodes || 'All',
      strategicValue: resource.strategicValue || 'Medium',
      location: resource.place || '',
      lastUpdated: resource.date || '',
    },
  };
}

/**
 * Map Notion Factions to faction data
 */
export function mapNotionFactionToFactionData(faction: NotionFaction) {
  return {
    id: faction.factionId || faction.id,
    name: faction.name,
    type: faction.type,
    alignment: faction.alignment as 'Stasis' | 'Plasticity' | 'Existential' | 'Neutral',
    status: faction.status,
  };
}

/**
 * Convert Notion Resources to MarketItems grouped by faction
 */
export function buildMarketCatalogFromNotion(
  resources: NotionResource[],
  factions: NotionFaction[]
): Record<string, MarketItem[]> {
  const catalog: Record<string, MarketItem[]> = {};

  // Create faction map for quick lookup
  const factionMap = new Map(factions.map(f => [f.factionId, f.id]));

  // Group resources by category
  const byCategory: Record<string, MarketItem[]> = {};

  resources.forEach(resource => {
    const category = resource.category || 'resources';
    if (!byCategory[category]) {
      byCategory[category] = [];
    }

    const marketItem = mapNotionResourceToMarketItem(resource);
    byCategory[category].push(marketItem);
  });

  return byCategory;
}

/**
 * Apply market status modifiers based on Notion data
 */
export function getMarketStatusModifier(status: string): number {
  const modifiers: Record<string, number> = {
    'Inflationary': 1.35,
    'Expected': 1.0,
    'Concern': 0.8,
    'Depressed': 0.7,
  };

  return modifiers[status] || 1.0;
}

/**
 * Calculate final price with Notion market status
 */
export function calculateNotionMarketPrice(
  basePrice: number,
  marketStatus: string,
  factionModifier: number = 1.0
): number {
  const statusModifier = getMarketStatusModifier(marketStatus);
  return Math.round(basePrice * statusModifier * factionModifier);
}

/**
 * Filter resources by market node
 */
export function filterByMarketNode(
  resources: MarketItem[],
  marketNode: string
): MarketItem[] {
  return resources.filter(item => {
    const nodes = (item.stats?.marketNodes as string)?.split(',') || [];
    return nodes.some(node => node.trim().toLowerCase() === marketNode.toLowerCase());
  });
}

/**
 * Get resources by strategic value
 */
export function filterByStrategicValue(
  resources: MarketItem[],
  value: string
): MarketItem[] {
  return resources.filter(
    item => (item.stats?.strategicValue as string) === value
  );
}

/**
 * Get resources by market trend
 */
export function filterByMarketTrend(
  resources: MarketItem[],
  trend: string
): MarketItem[] {
  return resources.filter(
    item => (item.stats?.marketTrends as string) === trend
  );
}
