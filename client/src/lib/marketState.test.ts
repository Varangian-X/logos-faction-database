/**
 * Market State Management Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createEmptyMarketState,
  serializeMarketState,
  deserializeMarketState,
  validateMarketState,
  calculatePrice,
  getItemsByCategory,
  getItemsByStatus,
  searchItems,
  getItemsByMarketNode,
  DEFAULT_PRICE_MODIFIERS,
  type MarketStateSnapshot,
  type MarketItem,
} from './marketState';

describe('Market State Management', () => {
  let emptyState: MarketStateSnapshot;
  let testItem: MarketItem;

  beforeEach(() => {
    emptyState = createEmptyMarketState();
    testItem = {
      id: 'test-item-1',
      resourceId: 'resource-1',
      name: 'Test Weapon',
      category: 'weapons',
      description: 'A test weapon',
      basePrice: 1000,
      strategicValue: 'High',
      status: 'Expected',
      marketTrends: 'Stable',
      marketNodes: 'Market A, Market B',
      imageUrl: 'https://example.com/image.jpg',
    };
  });

  describe('State Creation', () => {
    it('should create empty market state with correct structure', () => {
      expect(emptyState.version).toBe('1.0.0');
      expect(emptyState.items).toEqual([]);
      expect(emptyState.factions).toEqual([]);
      expect(emptyState.timestamp).toBeDefined();
    });

    it('should have default price modifiers', () => {
      expect(emptyState.priceModifiers).toEqual(DEFAULT_PRICE_MODIFIERS);
    });
  });

  describe('Serialization', () => {
    it('should serialize market state to JSON string', () => {
      const json = serializeMarketState(emptyState);
      expect(typeof json).toBe('string');
      expect(json).toContain('version');
      expect(json).toContain('1.0.0');
    });

    it('should deserialize JSON string back to market state', () => {
      const json = serializeMarketState(emptyState);
      const deserialized = deserializeMarketState(json);
      expect(deserialized.version).toBe(emptyState.version);
      expect(deserialized.items.length).toBe(0);
    });

    it('should preserve item data through serialization cycle', () => {
      emptyState.items.push(testItem);
      const json = serializeMarketState(emptyState);
      const deserialized = deserializeMarketState(json);
      expect(deserialized.items[0]).toEqual(testItem);
      expect(deserialized.items[0].imageUrl).toBe('https://example.com/image.jpg');
    });

    it('should throw error on invalid JSON', () => {
      expect(() => deserializeMarketState('invalid json')).toThrow();
    });

    it('should throw error on missing required fields', () => {
      const invalidJson = JSON.stringify({ version: '1.0.0' });
      expect(() => deserializeMarketState(invalidJson)).toThrow();
    });
  });

  describe('Validation', () => {
    it('should validate correct market state', () => {
      emptyState.items.push(testItem);
      const validation = validateMarketState(emptyState);
      expect(validation.valid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    it('should detect missing version', () => {
      const invalidState = { ...emptyState, version: '' };
      const validation = validateMarketState(invalidState as any);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should detect invalid items array', () => {
      const invalidState = { ...emptyState, items: null };
      const validation = validateMarketState(invalidState as any);
      expect(validation.valid).toBe(false);
    });

    it('should detect items with missing id', () => {
      const invalidItem = { ...testItem, id: '' };
      emptyState.items.push(invalidItem);
      const validation = validateMarketState(emptyState);
      expect(validation.valid).toBe(false);
    });
  });

  describe('Price Calculations', () => {
    it('should calculate price with Inflationary modifier', () => {
      const price = calculatePrice(1000, 'Inflationary');
      expect(price).toBe(1350);
    });

    it('should calculate price with Expected modifier (baseline)', () => {
      const price = calculatePrice(1000, 'Expected');
      expect(price).toBe(1000);
    });

    it('should calculate price with Depressed modifier', () => {
      const price = calculatePrice(1000, 'Depressed');
      expect(price).toBe(700);
    });

    it('should calculate price with Concern modifier', () => {
      const price = calculatePrice(1000, 'Concern');
      expect(price).toBe(800);
    });

    it('should use custom modifiers', () => {
      const customModifiers = {
        Inflationary: 0.5,
        Expected: 0,
        Concern: -0.1,
        Depressed: -0.5,
      };
      const price = calculatePrice(1000, 'Inflationary', customModifiers);
      expect(price).toBe(1500);
    });
  });

  describe('Item Filtering', () => {
    beforeEach(() => {
      emptyState.items = [
        testItem,
        {
          ...testItem,
          id: 'weapon-2',
          category: 'ships',
          name: 'Test Ship',
        },
        {
          ...testItem,
          id: 'resource-1',
          category: 'resources',
          status: 'Inflationary',
        },
      ];
    });

    it('should filter items by category', () => {
      const weapons = getItemsByCategory(emptyState.items, 'weapons');
      expect(weapons.length).toBe(1);
      expect(weapons[0].id).toBe('test-item-1');
    });

    it('should filter items by status', () => {
      const inflationary = getItemsByStatus(emptyState.items, 'Inflationary');
      expect(inflationary.length).toBe(1);
      expect(inflationary[0].id).toBe('resource-1');
    });

    it('should search items by name', () => {
      const results = searchItems(emptyState.items, 'ship');
      expect(results.length).toBe(1);
      expect(results[0].name).toContain('Ship');
    });

    it('should search items by description', () => {
      const results = searchItems(emptyState.items, 'test');
      expect(results.length).toBe(3);
    });

    it('should filter items by market node', () => {
      const results = getItemsByMarketNode(emptyState.items, 'Market A');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('Export/Import Workflow', () => {
    it('should preserve all data through export-import cycle', () => {
      emptyState.items.push(testItem);
      emptyState.factions.push({
        id: 'faction-1',
        name: 'Test Faction',
        type: 'Military',
        alignmentPolitical: 'Stasis',
        status: 'Active',
      });

      const json = serializeMarketState(emptyState);
      const restored = deserializeMarketState(json);

      expect(restored.items.length).toBe(1);
      expect(restored.factions.length).toBe(1);
      expect(restored.items[0].imageUrl).toBe(testItem.imageUrl);
    });
  });
});
