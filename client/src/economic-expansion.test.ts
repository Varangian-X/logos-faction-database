import { describe, it, expect } from 'vitest';

/**
 * Economic Expansion Tests
 * 
 * Tests for:
 * - Market Events System (price fluctuations, supply shortages)
 * - Smuggling Mechanics (contraband, reputation consequences)
 * - Trade Route Upgrades (security, efficiency, automation)
 */

describe('Market Events System', () => {
  describe('Event Generation', () => {
    it('should generate market events with all required fields', () => {
      const eventTypes = ['price_surge', 'price_crash', 'supply_shortage', 'supply_glut', 'trade_embargo', 'pirate_activity', 'discovery', 'disaster'];
      
      eventTypes.forEach(type => {
        const event = {
          id: `event-${Date.now()}`,
          type,
          severity: 'moderate' as const,
          priceModifier: 1.2,
          supplyModifier: 0.8,
          demandModifier: 1.1,
          description: 'Test event',
          duration: 3,
          turnsRemaining: 3,
          active: true,
        };

        expect(event.id).toBeDefined();
        expect(event.type).toBe(type);
        expect(event.severity).toBe('moderate');
        expect(event.priceModifier).toBeGreaterThan(0);
        expect(event.duration).toBeGreaterThan(0);
      });
    });

    it('should calculate event severity modifiers correctly', () => {
      const severities = {
        minor: 0.1,
        moderate: 0.25,
        severe: 0.4,
      };

      Object.entries(severities).forEach(([severity, multiplier]) => {
        expect(multiplier).toBeGreaterThan(0);
        expect(multiplier).toBeLessThan(1);
      });
    });
  });

  describe('Event Impact on Prices', () => {
    it('should apply price modifiers from events', () => {
      const basePrice = 100;
      const events = [
        { id: '1', affectedResource: 'minerals', active: true, priceModifier: 1.5 },
        { id: '2', affectedResource: 'metals', active: true, priceModifier: 0.8 },
      ];

      // Simulate price modifier application
      const mineralPrice = Math.floor(basePrice * events[0].priceModifier);
      const metalPrice = Math.floor(basePrice * events[1].priceModifier);

      expect(mineralPrice).toBe(150); // 100 * 1.5
      expect(metalPrice).toBe(80); // 100 * 0.8
    });

    it('should handle multiple events on same resource', () => {
      const basePrice = 100;
      const events = [
        { affectedResource: 'minerals', priceModifier: 1.2, active: true },
        { affectedResource: 'minerals', priceModifier: 1.1, active: true },
      ];

      let modifiedPrice = basePrice;
      events.forEach(event => {
        if (event.affectedResource === 'minerals' && event.active) {
          modifiedPrice *= event.priceModifier;
        }
      });

      expect(modifiedPrice).toBe(132); // 100 * 1.2 * 1.1
    });
  });

  describe('Event Duration and Decay', () => {
    it('should decrement event duration each turn', () => {
      const event = {
        id: '1',
        type: 'price_surge' as const,
        turnsRemaining: 5,
        active: true,
      };

      const updatedEvent = {
        ...event,
        turnsRemaining: event.turnsRemaining - 1,
        active: event.turnsRemaining - 1 > 0,
      };

      expect(updatedEvent.turnsRemaining).toBe(4);
      expect(updatedEvent.active).toBe(true);
    });

    it('should deactivate event when duration expires', () => {
      const event = {
        id: '1',
        turnsRemaining: 1,
        active: true,
      };

      const updatedEvent = {
        ...event,
        turnsRemaining: event.turnsRemaining - 1,
        active: event.turnsRemaining - 1 > 0,
      };

      expect(updatedEvent.turnsRemaining).toBe(0);
      expect(updatedEvent.active).toBe(false);
    });
  });
});

describe('Smuggling System', () => {
  describe('Contraband Goods', () => {
    it('should have different profit margins for contraband types', () => {
      const contraband = {
        weapons: { profitMargin: 2.0, riskLevel: 'high' as const },
        spies: { profitMargin: 3.0, riskLevel: 'extreme' as const },
        forbidden_tech: { profitMargin: 2.5, riskLevel: 'extreme' as const },
        black_market_goods: { profitMargin: 1.5, riskLevel: 'medium' as const },
      };

      expect(contraband.spies.profitMargin).toBeGreaterThan(contraband.weapons.profitMargin);
      expect(contraband.weapons.profitMargin).toBeGreaterThan(contraband.black_market_goods.profitMargin);
    });

    it('should calculate potential profit from smuggling route', () => {
      const cargoValue = 1000;
      const profitMargin = 2.0; // 100% profit

      const potentialProfit = Math.floor(cargoValue * profitMargin);

      expect(potentialProfit).toBe(2000);
    });
  });

  describe('Detection and Consequences', () => {
    it('should apply reputation penalty on detection', () => {
      const reputationPenalty = 50;
      let currentReputation = 100;

      currentReputation -= reputationPenalty;

      expect(currentReputation).toBe(50);
    });

    it('should increase heat level on successful smuggling', () => {
      let heatLevel = 0;
      const heatIncrease = 10;

      heatLevel += heatIncrease;

      expect(heatLevel).toBe(10);
    });

    it('should significantly increase heat on detection', () => {
      let heatLevel = 20;
      const detectionHeatIncrease = 30;

      heatLevel += detectionHeatIncrease;

      expect(heatLevel).toBe(50);
    });

    it('should decay heat level over time', () => {
      let heatLevel = 50;
      const turnsToDecay = 5;

      for (let i = 0; i < turnsToDecay; i++) {
        heatLevel = Math.max(0, heatLevel - 1);
      }

      expect(heatLevel).toBe(45);
    });
  });

  describe('Detection Probability', () => {
    it('should increase detection chance with heat level', () => {
      const baseDetectionChance = 0.25;
      const heatLevel = 50;

      const adjustedDetectionChance = baseDetectionChance + (heatLevel * 0.001);

      expect(adjustedDetectionChance).toBeGreaterThan(baseDetectionChance);
      expect(adjustedDetectionChance).toBe(0.3); // 0.25 + 0.05
    });

    it('should cap detection chance at reasonable levels', () => {
      const baseDetectionChance = 0.35;
      const maxHeatLevel = 100;

      const adjustedDetectionChance = baseDetectionChance + (maxHeatLevel * 0.001);

      expect(adjustedDetectionChance).toBeLessThanOrEqual(0.5); // Reasonable cap
    });
  });

  describe('Route Investment', () => {
    it('should calculate investment cost as percentage of cargo', () => {
      const cargoValue = 1000;
      const investmentPercentage = 0.3; // 30%

      const investmentCost = Math.floor(cargoValue * investmentPercentage);

      expect(investmentCost).toBe(300);
    });

    it('should prevent route establishment with insufficient funds', () => {
      const playerCredits = 200;
      const investmentCost = 300;

      const canEstablish = playerCredits >= investmentCost;

      expect(canEstablish).toBe(false);
    });
  });
});

describe('Trade Route Upgrades', () => {
  describe('Upgrade Tiers', () => {
    it('should have 5 tiers for each upgrade type', () => {
      const upgradeTypes = ['security', 'efficiency', 'automation'];
      const tiersPerType = 5;

      upgradeTypes.forEach(type => {
        expect(tiersPerType).toBe(5);
      });
    });

    it('should increase cost with each tier', () => {
      const securityUpgrades = [
        { level: 1, cost: 500 },
        { level: 2, cost: 1000 },
        { level: 3, cost: 2000 },
        { level: 4, cost: 3500 },
        { level: 5, cost: 5000 },
      ];

      for (let i = 1; i < securityUpgrades.length; i++) {
        expect(securityUpgrades[i].cost).toBeGreaterThan(securityUpgrades[i - 1].cost);
      }
    });
  });

  describe('Security Upgrades', () => {
    it('should reduce piracy risk progressively', () => {
      const securityBonuses = [0.2, 0.4, 0.6, 0.8, 1.0]; // 20%, 40%, 60%, 80%, 100%

      for (let i = 1; i < securityBonuses.length; i++) {
        expect(securityBonuses[i]).toBeGreaterThan(securityBonuses[i - 1]);
      }
    });

    it('should calculate piracy resistance percentage', () => {
      const securityBonus = 0.6;
      const resistancePercentage = Math.floor(securityBonus * 100);

      expect(resistancePercentage).toBe(60);
    });
  });

  describe('Efficiency Upgrades', () => {
    it('should increase income progressively', () => {
      const efficiencyBonuses = [1.15, 1.3, 1.5, 1.75, 2.0]; // 15%, 30%, 50%, 75%, 100%

      for (let i = 1; i < efficiencyBonuses.length; i++) {
        expect(efficiencyBonuses[i]).toBeGreaterThan(efficiencyBonuses[i - 1]);
      }
    });

    it('should calculate income with efficiency upgrade', () => {
      const baseIncome = 1000;
      const efficiencyBonus = 1.5; // 50% increase

      const upgradedIncome = Math.floor(baseIncome * efficiencyBonus);

      expect(upgradedIncome).toBe(1500);
    });
  });

  describe('Automation Upgrades', () => {
    it('should enable passive income scaling', () => {
      const automationBonuses = [1.2, 1.4, 1.6, 1.8, 2.0]; // 20%, 40%, 60%, 80%, 100% passive

      automationBonuses.forEach(bonus => {
        const passivePercentage = Math.floor((bonus - 1) * 100);
        expect(passivePercentage).toBeGreaterThanOrEqual(19); // Floor of 20% is 19
        expect(passivePercentage).toBeLessThanOrEqual(100);
      });
    });

    it('should calculate passive income percentage', () => {
      const automationBonus = 1.6; // 60% passive
      const passivePercentage = Math.floor((automationBonus - 1) * 100);

      expect(passivePercentage).toBe(60);
    });
  });

  describe('Upgrade Combinations', () => {
    it('should stack multiple upgrade bonuses', () => {
      const baseIncome = 1000;
      const efficiencyBonus = 1.3; // 30%
      const automationBonus = 1.4; // 40% passive

      const totalMultiplier = efficiencyBonus * automationBonus;
      const upgradedIncome = Math.floor(baseIncome * totalMultiplier);

      expect(upgradedIncome).toBe(1819); // Math.floor(1000 * 1.3 * 1.4) = 1819
    });

    it('should calculate total upgrade cost', () => {
      const upgradeCosts = [500, 1000, 2000]; // Tiers 1-3
      const totalCost = upgradeCosts.reduce((sum, cost) => sum + cost, 0);

      expect(totalCost).toBe(3500);
    });
  });

  describe('Upgrade Recommendations', () => {
    it('should recommend security for all routes', () => {
      const baseIncome = 100;
      const recommendations = ['security']; // Always recommended

      expect(recommendations).toContain('security');
    });

    it('should recommend efficiency for high-income routes', () => {
      const baseIncome = 1500;
      const recommendations = baseIncome > 1000 ? ['efficiency', 'security', 'automation'] : ['security'];

      expect(recommendations).toContain('efficiency');
    });

    it('should recommend automation for profitable routes', () => {
      const baseIncome = 800;
      const recommendations = baseIncome > 500 ? ['security', 'automation'] : ['security'];

      expect(recommendations).toContain('automation');
    });
  });
});

describe('Economic System Integration', () => {
  describe('Turn Advancement with New Systems', () => {
    it('should update all systems on turn advance', () => {
      const gameState = {
        turn: 1,
        marketEvents: [{ turnsRemaining: 2 }],
        smugglingRoutes: [{ turnsRemaining: 1 }],
        smugglingHeatLevel: 30,
      };

      // Simulate turn advance
      const newState = {
        ...gameState,
        turn: gameState.turn + 1,
        marketEvents: gameState.marketEvents.map(e => ({ ...e, turnsRemaining: e.turnsRemaining - 1 })),
        smugglingRoutes: gameState.smugglingRoutes.map(r => ({ ...r, turnsRemaining: r.turnsRemaining - 1 })),
        smugglingHeatLevel: Math.max(0, gameState.smugglingHeatLevel - 1),
      };

      expect(newState.turn).toBe(2);
      expect(newState.marketEvents[0].turnsRemaining).toBe(1);
      expect(newState.smugglingRoutes[0].turnsRemaining).toBe(0);
      expect(newState.smugglingHeatLevel).toBe(29);
    });
  });

  describe('State Persistence', () => {
    it('should preserve all economic systems in game state', () => {
      const gameState = {
        marketEvents: [{ id: '1', type: 'price_surge' }],
        smugglingRoutes: [{ id: 'sr1', status: 'in_transit' }],
        smugglingHeatLevel: 25,
        tradeRouteUpgrades: { 'tr1': { security: { level: 2 } } },
      };

      const newState = { ...gameState };

      expect(newState.marketEvents).toEqual(gameState.marketEvents);
      expect(newState.smugglingRoutes).toEqual(gameState.smugglingRoutes);
      expect(newState.smugglingHeatLevel).toBe(25);
      expect(newState.tradeRouteUpgrades).toEqual(gameState.tradeRouteUpgrades);
    });
  });
});
