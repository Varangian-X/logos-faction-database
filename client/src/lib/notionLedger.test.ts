import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  mapNotionToLedger,
  generatePriceHistory,
  getCachedResources,
  setCachedResources,
} from './notionLedger';

describe('notionLedger', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('mapNotionToLedger', () => {
    it('should map Notion resource to Ledger format', () => {
      const notionResource = {
        id: 'test-id',
        properties: {
          Name: { title: [{ text: { content: 'Test Resource' } }] },
          'Resource ID': { rich_text: [{ text: { content: 'TST' } }] },
          Category: { select: { name: 'Strategic Material' } },
          'Strategic Value': { number: 75 },
          'Market Trends': { select: { name: 'Rising' } },
          'Market Nodes': { multi_select: [{ name: 'Node A' }] },
          Status: { select: { name: 'Active' } },
          'Base Price': { number: 1000 },
          'Price History': { rich_text: [] },
        },
      };

      const result = mapNotionToLedger(notionResource as any);

      expect(result.name).toBe('Test Resource');
      expect(result.symbol).toBe('TST');
      expect(result.category).toBe('Strategic Material');
      expect(result.strategicValue).toBe(75);
      expect(result.status).toBe('Active');
      expect(result.currentPrice).toBeGreaterThan(1000);
      expect(result.priceHistory).toHaveLength(24);
    });

    it('should handle missing properties gracefully', () => {
      const notionResource = {
        id: 'test-id',
        properties: {
          Name: { title: [] },
          'Resource ID': { rich_text: [] },
          Category: { select: null },
          'Strategic Value': { number: null },
          'Market Trends': { select: null },
          'Market Nodes': { multi_select: [] },
          Status: { select: null },
          'Base Price': { number: null },
          'Price History': { rich_text: [] },
        },
      };

      const result = mapNotionToLedger(notionResource as any);

      expect(result.name).toBe('Unknown');
      expect(result.category).toBe('General');
      expect(result.strategicValue).toBe(50);
      expect(result.currentPrice).toBeGreaterThan(0);
    });

    it('should calculate correct trend based on volatility', () => {
      const notionResourceUp = {
        id: 'test-id-up',
        properties: {
          Name: { title: [{ text: { content: 'Rising Resource' } }] },
          'Resource ID': { rich_text: [{ text: { content: 'RIS' } }] },
          Category: { select: { name: 'General' } },
          'Strategic Value': { number: 50 },
          'Market Trends': { select: { name: 'Rising' } },
          'Market Nodes': { multi_select: [] },
          Status: { select: { name: 'Active' } },
          'Base Price': { number: 1000 },
          'Price History': { rich_text: [] },
        },
      };

      const resultUp = mapNotionToLedger(notionResourceUp as any);
      expect(['up', 'stable']).toContain(resultUp.trend);
      expect(resultUp.color).toBe('#00E5FF');
    });

    it('should set correct color based on trend', () => {
      const notionResourceDown = {
        id: 'test-id-down',
        properties: {
          Name: { title: [{ text: { content: 'Falling Resource' } }] },
          'Resource ID': { rich_text: [{ text: { content: 'FAL' } }] },
          Category: { select: { name: 'General' } },
          'Strategic Value': { number: 50 },
          'Market Trends': { select: { name: 'Falling' } },
          'Market Nodes': { multi_select: [] },
          Status: { select: { name: 'Active' } },
          'Base Price': { number: 1000 },
          'Price History': { rich_text: [] },
        },
      };

      const resultDown = mapNotionToLedger(notionResourceDown as any);
      expect(['down', 'stable']).toContain(resultDown.trend);
      expect(resultDown.color).toBe('#FF3333');
    });
  });

  describe('generatePriceHistory', () => {
    it('should generate 24 data points', () => {
      const history = generatePriceHistory(1000, 0.1);
      expect(history).toHaveLength(24);
    });

    it('should have correct time format', () => {
      const history = generatePriceHistory(1000, 0.1);
      history.forEach((point, index) => {
        const expectedHour = String(index).padStart(2, '0');
        expect(point.time).toBe(`${expectedHour}:00`);
      });
    });

    it('should maintain price within reasonable bounds', () => {
      const basePrice = 1000;
      const history = generatePriceHistory(basePrice, 0.1);
      history.forEach((point) => {
        expect(point.price).toBeGreaterThan(basePrice * 0.7);
        expect(point.price).toBeLessThan(basePrice * 1.3);
      });
    });

    it('should handle different volatility levels', () => {
      const basePrice = 1000;
      const historyLow = generatePriceHistory(basePrice, 0.02);
      const historyHigh = generatePriceHistory(basePrice, 0.2);

      const rangeHigh = Math.max(...historyHigh.map((p) => p.price)) -
        Math.min(...historyHigh.map((p) => p.price));
      const rangeLow = Math.max(...historyLow.map((p) => p.price)) -
        Math.min(...historyLow.map((p) => p.price));

      expect(rangeHigh).toBeGreaterThan(rangeLow);
    });
  });

  describe('Cache Management', () => {
    it('should set and get cached resources', () => {
      const mockResources = [
        {
          id: '1',
          name: 'Resource 1',
          symbol: 'RES1',
          currentPrice: 100,
          priceHistory: [],
          change24h: 10,
          changePercent24h: 10,
          supplyLevel: 50,
          demandLevel: 50,
          controlLevel: 50,
          trend: 'up' as const,
          color: '#00E5FF',
          category: 'General',
          strategicValue: 50,
          marketTrends: 'Stable',
          status: 'Active',
        },
      ];

      setCachedResources(mockResources);
      const cached = getCachedResources();

      expect(cached).toEqual(mockResources);
    });

    it('should return null if cache is expired', () => {
      const mockResources = [
        {
          id: '1',
          name: 'Resource 1',
          symbol: 'RES1',
          currentPrice: 100,
          priceHistory: [],
          change24h: 10,
          changePercent24h: 10,
          supplyLevel: 50,
          demandLevel: 50,
          controlLevel: 50,
          trend: 'up' as const,
          color: '#00E5FF',
          category: 'General',
          strategicValue: 50,
          marketTrends: 'Stable',
          status: 'Active',
        },
      ];

      setCachedResources(mockResources);

      // Simulate cache expiration
      const cached = localStorage.getItem('notion_ledger_resources');
      if (cached) {
        const data = JSON.parse(cached);
        data.timestamp = Date.now() - 6 * 60 * 1000; // 6 minutes ago
        localStorage.setItem('notion_ledger_resources', JSON.stringify(data));
      }

      const result = getCachedResources();
      expect(result).toBeNull();
    });

    it('should clear cache on expiration', () => {
      const mockResources = [
        {
          id: '1',
          name: 'Resource 1',
          symbol: 'RES1',
          currentPrice: 100,
          priceHistory: [],
          change24h: 10,
          changePercent24h: 10,
          supplyLevel: 50,
          demandLevel: 50,
          controlLevel: 50,
          trend: 'up' as const,
          color: '#00E5FF',
          category: 'General',
          strategicValue: 50,
          marketTrends: 'Stable',
          status: 'Active',
        },
      ];

      setCachedResources(mockResources);

      // Simulate cache expiration
      const cached = localStorage.getItem('notion_ledger_resources');
      if (cached) {
        const data = JSON.parse(cached);
        data.timestamp = Date.now() - 6 * 60 * 1000;
        localStorage.setItem('notion_ledger_resources', JSON.stringify(data));
      }

      getCachedResources();
      const stillCached = localStorage.getItem('notion_ledger_resources');
      expect(stillCached).toBeNull();
    });
  });

  describe('Price Calculations', () => {
    it('should calculate correct change24h', () => {
      const notionResource = {
        id: 'test-id',
        properties: {
          Name: { title: [{ text: { content: 'Test' } }] },
          'Resource ID': { rich_text: [{ text: { content: 'TST' } }] },
          Category: { select: { name: 'General' } },
          'Strategic Value': { number: 50 },
          'Market Trends': { select: { name: 'Rising' } },
          'Market Nodes': { multi_select: [] },
          Status: { select: { name: 'Active' } },
          'Base Price': { number: 1000 },
          'Price History': { rich_text: [] },
        },
      };

      const result = mapNotionToLedger(notionResource as any);
      expect(result.change24h).toBe(result.currentPrice - 1000);
    });

    it('should calculate correct changePercent24h', () => {
      const notionResource = {
        id: 'test-id',
        properties: {
          Name: { title: [{ text: { content: 'Test' } }] },
          'Resource ID': { rich_text: [{ text: { content: 'TST' } }] },
          Category: { select: { name: 'General' } },
          'Strategic Value': { number: 50 },
          'Market Trends': { select: { name: 'Stable' } },
          'Market Nodes': { multi_select: [] },
          Status: { select: { name: 'Active' } },
          'Base Price': { number: 1000 },
          'Price History': { rich_text: [] },
        },
      };

      const result = mapNotionToLedger(notionResource as any);
      const expectedPercent = (result.change24h / 1000) * 100;
      expect(result.changePercent24h).toBe(expectedPercent);
    });
  });
});
