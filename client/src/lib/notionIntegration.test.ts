import { describe, it, expect } from 'vitest';
import {
  mapNotionResourceToMarketItem,
  mapNotionFactionToFactionData,
  buildMarketCatalogFromNotion,
  getMarketStatusModifier,
  calculateNotionMarketPrice,
  filterByMarketNode,
  filterByStrategicValue,
  filterByMarketTrend,
} from './notionMarketMapper';
import type { NotionFaction, NotionResource } from './notionClient';

describe('Notion Integration', () => {
  const mockFaction: NotionFaction = {
    id: 'notion-id-1',
    name: 'Neo-Praetorians',
    factionId: 'neo-praetorians',
    type: 'Military',
    alignment: 'Stasis',
    status: 'Active',
  };

  const mockResource: NotionResource = {
    id: 'notion-res-1',
    resourceId: 'praetorian-gladius',
    name: 'Praetorian Gladius',
    category: 'weapons',
    description: 'Mono-molecular blade',
    strategicValue: 'High',
    status: 'Expected',
    marketTrends: 'Stable',
    marketNodes: 'All',
    place: 'Imperial Forge',
    date: '2026-06-02',
    imageUrl: 'https://example.com/gladius.jpg',
    basePrice: 2500,
  };

  describe('mapNotionResourceToMarketItem', () => {
    it('should map Notion resource to market item', () => {
      const item = mapNotionResourceToMarketItem(mockResource, 'neo-praetorians');

      expect(item.id).toBe('praetorian-gladius');
      expect(item.name).toBe('Praetorian Gladius');
      expect(item.category).toBe('weapons');
      expect(item.rarity).toBe('rare');
      expect(item.basePrice).toBe(2500);
      expect(item.factionId).toBe('neo-praetorians');
    });

    it('should handle missing optional fields', () => {
      const minimal: NotionResource = {
        id: 'test-1',
        resourceId: 'test-resource',
        name: 'Test Item',
        category: 'resources',
        description: 'Test',
        strategicValue: 'Medium',
        status: 'Expected',
        marketTrends: 'Stable',
        marketNodes: 'All',
      };

      const item = mapNotionResourceToMarketItem(minimal);

      expect(item.rarity).toBe('uncommon');
      expect(item.basePrice).toBe(1000);
      expect(item.factionId).toBeNull();
    });

    it('should map strategic values to rarities correctly', () => {
      const testCases = [
        { value: 'Low', expected: 'common' },
        { value: 'Medium', expected: 'uncommon' },
        { value: 'High', expected: 'rare' },
        { value: 'Critical', expected: 'exclusive' },
        { value: 'Legendary', expected: 'legendary' },
      ];

      testCases.forEach(({ value, expected }) => {
        const resource = { ...mockResource, strategicValue: value };
        const item = mapNotionResourceToMarketItem(resource);
        expect(item.rarity).toBe(expected);
      });
    });
  });

  describe('mapNotionFactionToFactionData', () => {
    it('should map Notion faction to faction data', () => {
      const data = mapNotionFactionToFactionData(mockFaction);

      expect(data.id).toBe('neo-praetorians');
      expect(data.name).toBe('Neo-Praetorians');
      expect(data.type).toBe('Military');
      expect(data.alignment).toBe('Stasis');
      expect(data.status).toBe('Active');
    });
  });

  describe('buildMarketCatalogFromNotion', () => {
    it('should build catalog from Notion data', () => {
      const resources = [mockResource];
      const factions = [mockFaction];

      const catalog = buildMarketCatalogFromNotion(resources, factions);

      expect(catalog.weapons).toBeDefined();
      expect(catalog.weapons.length).toBe(1);
      expect(catalog.weapons[0].name).toBe('Praetorian Gladius');
    });

    it('should group resources by category', () => {
      const resources = [
        mockResource,
        { ...mockResource, id: 'res-2', resourceId: 'plasma-axe', category: 'weapons' },
        { ...mockResource, id: 'res-3', resourceId: 'starship', category: 'ships' },
      ];

      const catalog = buildMarketCatalogFromNotion(resources, []);

      expect(catalog.weapons.length).toBe(2);
      expect(catalog.ships.length).toBe(1);
    });
  });

  describe('Market Status Modifiers', () => {
    it('should calculate correct status modifiers', () => {
      expect(getMarketStatusModifier('Inflationary')).toBe(1.35);
      expect(getMarketStatusModifier('Expected')).toBe(1.0);
      expect(getMarketStatusModifier('Concern')).toBe(0.8);
      expect(getMarketStatusModifier('Depressed')).toBe(0.7);
      expect(getMarketStatusModifier('Unknown')).toBe(1.0);
    });

    it('should calculate final market price', () => {
      const basePrice = 1000;

      expect(calculateNotionMarketPrice(basePrice, 'Inflationary')).toBe(1350);
      expect(calculateNotionMarketPrice(basePrice, 'Expected')).toBe(1000);
      expect(calculateNotionMarketPrice(basePrice, 'Concern')).toBe(800);
      expect(calculateNotionMarketPrice(basePrice, 'Depressed')).toBe(700);
    });

    it('should apply faction modifiers', () => {
      const basePrice = 1000;
      const factionModifier = 1.2;

      const price = calculateNotionMarketPrice(basePrice, 'Expected', factionModifier);
      expect(price).toBe(1200);
    });
  });

  describe('Market Filtering', () => {
    const items = [
      mapNotionResourceToMarketItem(mockResource),
      mapNotionResourceToMarketItem({
        ...mockResource,
        id: 'res-2',
        resourceId: 'item-2',
        marketNodes: 'Core,Rim',
      }),
      mapNotionResourceToMarketItem({
        ...mockResource,
        id: 'res-3',
        resourceId: 'item-3',
        strategicValue: 'Critical',
      }),
    ];

    it('should filter by market node', () => {
      const filtered = filterByMarketNode(items, 'Core');
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('item-2');
    });

    it('should filter by strategic value', () => {
      const filtered = filterByStrategicValue(items, 'Critical');
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('item-3');
    });

    it('should filter by market trend', () => {
      const filtered = filterByMarketTrend(items, 'Stable');
      expect(filtered.length).toBe(3);
    });
  });
});
