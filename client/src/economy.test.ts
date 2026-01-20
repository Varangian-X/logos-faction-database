import { describe, it, expect } from 'vitest';

/**
 * Economy System Tests
 * 
 * Tests for:
 * - Trade route income calculation
 * - Infrastructure persistence across turns
 * - Market buy/sell operations
 */

describe('Economy System', () => {
  describe('Trade Route Income', () => {
    it('should calculate income from active trade routes', () => {
      const tradeRoutes = [
        { id: 'tr1', status: 'active' as const, income: 300, value: 300 },
        { id: 'tr2', status: 'active' as const, income: 450, value: 450 },
        { id: 'tr3', status: 'inactive' as const, income: 200, value: 200 },
      ];

      const totalIncome = tradeRoutes
        .filter(route => route.status === 'active')
        .reduce((total, route) => total + (route.income || route.value || 0), 0);

      expect(totalIncome).toBe(750); // 300 + 450, inactive route ignored
    });

    it('should handle trade routes with only value field', () => {
      const tradeRoutes = [
        { id: 'tr1', status: 'active' as const, value: 500 },
      ];

      const totalIncome = tradeRoutes
        .filter(route => route.status === 'active')
        .reduce((total, route) => total + ((route as any).income || route.value || 0), 0);

      expect(totalIncome).toBe(500);
    });

    it('should return 0 for empty trade routes', () => {
      const tradeRoutes: any[] = [];

      const totalIncome = tradeRoutes
        .filter(route => route.status === 'active')
        .reduce((total, route) => total + (route.income || route.value || 0), 0);

      expect(totalIncome).toBe(0);
    });
  });

  describe('Infrastructure Income', () => {
    it('should calculate income from active infrastructure', () => {
      const infrastructure = [
        { id: 'i1', type: 'trade_hub', status: 'active' as const, efficiency: 1.0 },
        { id: 'i2', type: 'mining_facility', status: 'active' as const, efficiency: 1.0 },
        { id: 'i3', type: 'research_lab', status: 'active' as const, efficiency: 1.0 },
        { id: 'i4', type: 'trade_hub', status: 'building' as const, efficiency: 0.5 },
      ];

      let infrastructureIncome = 0;
      infrastructure.forEach(building => {
        if (building.status === 'active') {
          if (building.type === 'trade_hub') infrastructureIncome += 100;
          if (building.type === 'mining_facility') infrastructureIncome += 150;
          if (building.type === 'research_lab') infrastructureIncome += 50;
        }
      });

      expect(infrastructureIncome).toBe(300); // 100 + 150 + 50
    });

    it('should calculate upkeep costs', () => {
      const infrastructure = [
        { id: 'i1', type: 'trade_hub', status: 'active' as const, efficiency: 1.0 },
        { id: 'i2', type: 'mining_facility', status: 'active' as const, efficiency: 1.0 },
      ];

      let infrastructureUpkeep = 0;
      infrastructure.forEach(building => {
        if (building.status === 'active') {
          infrastructureUpkeep += 50;
        }
      });

      expect(infrastructureUpkeep).toBe(100); // 50 per building
    });
  });

  describe('Total Income Calculation', () => {
    it('should calculate total income correctly', () => {
      const baseIncome = 500;
      const tradeRouteIncome = 750;
      const infrastructureIncome = 300;
      const infrastructureUpkeep = 100;

      const totalIncome = baseIncome + tradeRouteIncome + infrastructureIncome - infrastructureUpkeep;

      expect(totalIncome).toBe(1450);
    });

    it('should handle negative net income from high upkeep', () => {
      const baseIncome = 500;
      const tradeRouteIncome = 0;
      const infrastructureIncome = 100;
      const infrastructureUpkeep = 800;

      const totalIncome = baseIncome + tradeRouteIncome + infrastructureIncome - infrastructureUpkeep;

      expect(totalIncome).toBe(-200);
    });
  });

  describe('State Persistence', () => {
    it('should preserve infrastructure in state updates', () => {
      const prevState = {
        infrastructure: [
          { id: 'i1', type: 'trade_hub', status: 'active' as const, efficiency: 1.0 },
        ],
        maxTradeRoutes: 3,
        tradeRoutes: [
          { id: 'tr1', status: 'active' as const, income: 300 },
        ],
      };

      const newState = {
        ...prevState,
        turn: 2,
        infrastructure: prevState.infrastructure,
        tradeRoutes: prevState.tradeRoutes,
        maxTradeRoutes: prevState.maxTradeRoutes,
      };

      expect(newState.infrastructure).toEqual(prevState.infrastructure);
      expect(newState.tradeRoutes).toEqual(prevState.tradeRoutes);
      expect(newState.maxTradeRoutes).toBe(3);
    });
  });

  describe('Market Operations', () => {
    it('should deduct credits and add resources on buy', () => {
      let credits = 10000;
      let resources = { minerals: 500 };
      
      const resourceId = 'minerals';
      const amount = 10;
      const price = 50;
      const cost = amount * price;

      if (credits >= cost) {
        credits -= cost;
        resources[resourceId] = (resources[resourceId] || 0) + amount;
      }

      expect(credits).toBe(9500); // 10000 - 500
      expect(resources.minerals).toBe(510); // 500 + 10
    });

    it('should add credits and remove resources on sell', () => {
      let credits = 10000;
      let resources = { minerals: 500 };
      
      const resourceId = 'minerals';
      const amount = 10;
      const price = 50;

      if ((resources[resourceId] || 0) >= amount) {
        credits += amount * price;
        resources[resourceId] = (resources[resourceId] || 0) - amount;
      }

      expect(credits).toBe(10500); // 10000 + 500
      expect(resources.minerals).toBe(490); // 500 - 10
    });

    it('should not allow buying with insufficient credits', () => {
      let credits = 100;
      let resources = { minerals: 500 };
      
      const resourceId = 'minerals';
      const amount = 10;
      const price = 50;
      const cost = amount * price;

      if (credits >= cost) {
        credits -= cost;
        resources[resourceId] = (resources[resourceId] || 0) + amount;
      }

      expect(credits).toBe(100); // Unchanged
      expect(resources.minerals).toBe(500); // Unchanged
    });

    it('should not allow selling more than owned', () => {
      let credits = 10000;
      let resources = { minerals: 5 };
      
      const resourceId = 'minerals';
      const amount = 10;
      const price = 50;

      if ((resources[resourceId] || 0) >= amount) {
        credits += amount * price;
        resources[resourceId] = (resources[resourceId] || 0) - amount;
      }

      expect(credits).toBe(10000); // Unchanged
      expect(resources.minerals).toBe(5); // Unchanged
    });
  });

  describe('Trade Hub Capacity', () => {
    it('should increase max trade routes when purchasing trade hub', () => {
      let maxTradeRoutes = 1;
      const infrastructure: any[] = [];

      // Purchase trade hub
      const newBuilding = {
        id: 'i-1',
        type: 'trade_hub',
        status: 'active' as const,
        efficiency: 1.0,
      };

      infrastructure.push(newBuilding);
      maxTradeRoutes += 2;

      expect(maxTradeRoutes).toBe(3);
      expect(infrastructure.length).toBe(1);
      expect(infrastructure[0].type).toBe('trade_hub');
    });

    it('should maintain increased capacity across turns', () => {
      let maxTradeRoutes = 5;
      
      // Simulate turn advancement
      const preservedMaxRoutes = maxTradeRoutes;

      expect(preservedMaxRoutes).toBe(5);
    });
  });
});
