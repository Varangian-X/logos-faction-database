/**
 * Trade Route Upgrades System
 * 
 * Allow players to invest in route improvements for:
 * - Enhanced security (reduce piracy risk)
 * - Improved efficiency (increase income)
 * - Automation (passive income scaling)
 */

export type UpgradeType = 'security' | 'efficiency' | 'automation';

export interface TradeRouteUpgrade {
  id: string;
  type: UpgradeType;
  level: number; // 1-5
  cost: number;
  incomeBonus: number; // Multiplier: 1.1 = 10% bonus
  securityBonus: number; // Reduces piracy/embargo impact
  automationBonus: number; // Passive income multiplier
  description: string;
}

export interface UpgradedTradeRoute {
  id: string;
  baseIncome: number;
  upgrades: {
    security?: TradeRouteUpgrade;
    efficiency?: TradeRouteUpgrade;
    automation?: TradeRouteUpgrade;
  };
  currentIncome: number; // Calculated with upgrades
  automationLevel: number; // 0-100, passive income percentage
  securityLevel: number; // 0-100, piracy resistance
}

const UPGRADE_TIERS: Record<UpgradeType, TradeRouteUpgrade[]> = {
  security: [
    {
      id: 'security-1',
      type: 'security',
      level: 1,
      cost: 500,
      incomeBonus: 1.0,
      securityBonus: 0.2, // 20% piracy reduction
      automationBonus: 1.0,
      description: 'Basic Security - Armed escorts reduce piracy risk by 20%',
    },
    {
      id: 'security-2',
      type: 'security',
      level: 2,
      cost: 1000,
      incomeBonus: 1.0,
      securityBonus: 0.4, // 40% piracy reduction
      automationBonus: 1.0,
      description: 'Enhanced Security - Military-grade protection, 40% piracy reduction',
    },
    {
      id: 'security-3',
      type: 'security',
      level: 3,
      cost: 2000,
      incomeBonus: 1.0,
      securityBonus: 0.6, // 60% piracy reduction
      automationBonus: 1.0,
      description: 'Advanced Security - Cloaking and countermeasures, 60% piracy reduction',
    },
    {
      id: 'security-4',
      type: 'security',
      level: 4,
      cost: 3500,
      incomeBonus: 1.0,
      securityBonus: 0.8, // 80% piracy reduction
      automationBonus: 1.0,
      description: 'Fortress Fleet - Heavily armed convoys, 80% piracy reduction',
    },
    {
      id: 'security-5',
      type: 'security',
      level: 5,
      cost: 5000,
      incomeBonus: 1.0,
      securityBonus: 1.0, // 100% piracy reduction
      automationBonus: 1.0,
      description: 'Impenetrable Defense - Virtually immune to piracy, 100% reduction',
    },
  ],
  efficiency: [
    {
      id: 'efficiency-1',
      type: 'efficiency',
      level: 1,
      cost: 600,
      incomeBonus: 1.15, // 15% income increase
      securityBonus: 0.0,
      automationBonus: 1.0,
      description: 'Optimized Routes - Better navigation, +15% income',
    },
    {
      id: 'efficiency-2',
      type: 'efficiency',
      level: 2,
      cost: 1200,
      incomeBonus: 1.3, // 30% income increase
      securityBonus: 0.0,
      automationBonus: 1.0,
      description: 'Advanced Logistics - Streamlined operations, +30% income',
    },
    {
      id: 'efficiency-3',
      type: 'efficiency',
      level: 3,
      cost: 2200,
      incomeBonus: 1.5, // 50% income increase
      securityBonus: 0.0,
      automationBonus: 1.0,
      description: 'Quantum Navigation - Faster routes, +50% income',
    },
    {
      id: 'efficiency-4',
      type: 'efficiency',
      level: 4,
      cost: 3800,
      incomeBonus: 1.75, // 75% income increase
      securityBonus: 0.0,
      automationBonus: 1.0,
      description: 'Hyperspace Optimization - Cutting-edge tech, +75% income',
    },
    {
      id: 'efficiency-5',
      type: 'efficiency',
      level: 5,
      cost: 5500,
      incomeBonus: 2.0, // 100% income increase
      securityBonus: 0.0,
      automationBonus: 1.0,
      description: 'Perfect Efficiency - Theoretical maximum, +100% income',
    },
  ],
  automation: [
    {
      id: 'automation-1',
      type: 'automation',
      level: 1,
      cost: 800,
      incomeBonus: 1.0,
      securityBonus: 0.0,
      automationBonus: 1.2, // 20% passive income
      description: 'Basic Automation - Semi-autonomous convoys, 20% passive income',
    },
    {
      id: 'automation-2',
      type: 'automation',
      level: 2,
      cost: 1500,
      incomeBonus: 1.0,
      securityBonus: 0.0,
      automationBonus: 1.4, // 40% passive income
      description: 'Smart Routing - AI-assisted navigation, 40% passive income',
    },
    {
      id: 'automation-3',
      type: 'automation',
      level: 3,
      cost: 2500,
      incomeBonus: 1.0,
      securityBonus: 0.0,
      automationBonus: 1.6, // 60% passive income
      description: 'Full Automation - Fully autonomous operations, 60% passive income',
    },
    {
      id: 'automation-4',
      type: 'automation',
      level: 4,
      cost: 4000,
      incomeBonus: 1.0,
      securityBonus: 0.0,
      automationBonus: 1.8, // 80% passive income
      description: 'Self-Sustaining Fleet - Minimal oversight required, 80% passive income',
    },
    {
      id: 'automation-5',
      type: 'automation',
      level: 5,
      cost: 6000,
      incomeBonus: 1.0,
      securityBonus: 0.0,
      automationBonus: 2.0, // 100% passive income (doubles income)
      description: 'Fully Autonomous Network - Complete self-management, 100% passive income',
    },
  ],
};

/**
 * Get upgrade tier for a specific type and level
 */
export function getUpgrade(type: UpgradeType, level: number): TradeRouteUpgrade | null {
  const upgrades = UPGRADE_TIERS[type];
  return upgrades.find(u => u.level === level) || null;
}

/**
 * Get all available upgrades of a type
 */
export function getAvailableUpgrades(type: UpgradeType): TradeRouteUpgrade[] {
  return UPGRADE_TIERS[type];
}

/**
 * Calculate total income with upgrades applied
 */
export function calculateUpgradedIncome(
  baseIncome: number,
  upgrades: UpgradedTradeRoute['upgrades']
): number {
  let multiplier = 1.0;

  if (upgrades.efficiency) {
    multiplier *= upgrades.efficiency.incomeBonus;
  }

  if (upgrades.automation) {
    multiplier *= upgrades.automation.automationBonus;
  }

  return Math.floor(baseIncome * multiplier);
}

/**
 * Calculate security level (piracy resistance)
 */
export function calculateSecurityLevel(upgrade?: TradeRouteUpgrade): number {
  if (!upgrade) return 0;
  return Math.floor(upgrade.securityBonus * 100);
}

/**
 * Calculate automation level (passive income percentage)
 */
export function calculateAutomationLevel(upgrade?: TradeRouteUpgrade): number {
  if (!upgrade) return 0;
  // Automation bonus of 1.2 = 20% passive, 1.4 = 40% passive, etc.
  return Math.floor((upgrade.automationBonus - 1) * 100);
}

/**
 * Apply upgrade to a trade route
 */
export function applyUpgrade(
  route: UpgradedTradeRoute,
  upgrade: TradeRouteUpgrade
): UpgradedTradeRoute {
  const updatedRoute = { ...route };
  updatedRoute.upgrades[upgrade.type] = upgrade;

  // Recalculate income
  updatedRoute.currentIncome = calculateUpgradedIncome(route.baseIncome, updatedRoute.upgrades);

  // Update security level
  updatedRoute.securityLevel = calculateSecurityLevel(updatedRoute.upgrades.security);

  // Update automation level
  updatedRoute.automationLevel = calculateAutomationLevel(updatedRoute.upgrades.automation);

  return updatedRoute;
}

/**
 * Get upgrade cost for next level
 */
export function getNextUpgradeCost(type: UpgradeType, currentLevel: number): number {
  const nextLevel = currentLevel + 1;
  const upgrade = getUpgrade(type, nextLevel);
  return upgrade?.cost || 0;
}

/**
 * Get total upgrade cost to reach a specific level
 */
export function getTotalUpgradeCost(type: UpgradeType, targetLevel: number): number {
  let total = 0;
  for (let i = 1; i <= targetLevel; i++) {
    const upgrade = getUpgrade(type, i);
    if (upgrade) total += upgrade.cost;
  }
  return total;
}

/**
 * Recommend upgrades based on route income
 */
export function recommendUpgrades(baseIncome: number): UpgradeType[] {
  const recommendations: UpgradeType[] = [];

  // High income routes benefit from efficiency
  if (baseIncome > 1000) {
    recommendations.push('efficiency');
  }

  // All routes benefit from security
  recommendations.push('security');

  // High income routes benefit from automation
  if (baseIncome > 500) {
    recommendations.push('automation');
  }

  return recommendations;
}
