/**
 * Smuggling System
 * 
 * High-risk, high-reward illegal trade mechanics
 * Players can trade contraband goods with consequences
 */

export type ContrabandType = 'weapons' | 'spies' | 'forbidden_tech' | 'black_market_goods';

export interface ContrabandGood {
  id: string;
  type: ContrabandType;
  name: string;
  basePrice: number;
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  reputationPenalty: number; // Reputation lost if caught
  reputationGain: number; // Reputation gained if successful
  profitMargin: number; // Multiplier on base price (e.g., 2.5 = 250% profit)
  detectionChance: number; // 0-1 probability of being caught
  description: string;
}

export interface SmugglingRoute {
  id: string;
  sourceLocation: string;
  targetLocation: string;
  contraband: ContrabandType;
  status: 'planning' | 'in_transit' | 'completed' | 'intercepted';
  cargoValue: number;
  investmentCost: number;
  potentialProfit: number;
  detectionRisk: number;
  turnsRemaining: number;
  active: boolean;
}

export interface SmugglingState {
  activeRoutes: SmugglingRoute[];
  completedRoutes: SmugglingRoute[];
  totalProfit: number;
  totalLosses: number;
  heatLevel: number; // 0-100, increases with activity, decreases over time
  reputationModifier: number; // Cumulative reputation penalty from smuggling
}

const CONTRABAND_GOODS: Record<ContrabandType, ContrabandGood> = {
  weapons: {
    id: 'contraband-weapons',
    type: 'weapons',
    name: 'Illegal Weapons Cache',
    basePrice: 2000,
    riskLevel: 'high',
    reputationPenalty: 50,
    reputationGain: 25,
    profitMargin: 2.0, // 100% profit
    detectionChance: 0.25,
    description: 'Banned military-grade weapons. Highly profitable but significant legal risk.',
  },
  spies: {
    id: 'contraband-spies',
    type: 'spies',
    name: 'Intelligence Assets',
    basePrice: 3000,
    riskLevel: 'extreme',
    reputationPenalty: 75,
    reputationGain: 40,
    profitMargin: 3.0, // 200% profit
    detectionChance: 0.35,
    description: 'Trained operatives and intelligence networks. Extremely dangerous if discovered.',
  },
  forbidden_tech: {
    id: 'contraband-tech',
    type: 'forbidden_tech',
    name: 'Forbidden Technology',
    basePrice: 2500,
    riskLevel: 'extreme',
    reputationPenalty: 60,
    reputationGain: 35,
    profitMargin: 2.5, // 150% profit
    detectionChance: 0.30,
    description: 'Restricted AI cores and advanced weaponry. Highly regulated.',
  },
  black_market_goods: {
    id: 'contraband-black',
    type: 'black_market_goods',
    name: 'Black Market Goods',
    basePrice: 1500,
    riskLevel: 'medium',
    reputationPenalty: 30,
    reputationGain: 15,
    profitMargin: 1.5, // 50% profit
    detectionChance: 0.15,
    description: 'Restricted luxury goods and rare commodities. Lower risk, moderate profit.',
  },
};

const LOCATIONS = [
  'Outer Rim Station', 'Pirate Haven', 'Corporate Enclave', 'Black Market Hub',
  'Frontier Outpost', 'Underground Network', 'Rogue Asteroid', 'Shadow Port'
];

/**
 * Get contraband good details
 */
export function getContrabandGood(type: ContrabandType): ContrabandGood {
  return CONTRABAND_GOODS[type];
}

/**
 * Get all available contraband types
 */
export function getAvailableContraband(): ContrabandGood[] {
  return Object.values(CONTRABAND_GOODS);
}

/**
 * Establish a smuggling route
 */
export function establishSmugglingRoute(
  contraband: ContrabandType,
  cargoValue: number,
  playerCredits: number
): SmugglingRoute | null {
  const good = getContrabandGood(contraband);
  const investmentCost = Math.floor(cargoValue * 0.3); // 30% of cargo value as investment

  if (playerCredits < investmentCost) {
    return null; // Insufficient funds
  }

  const potentialProfit = Math.floor(cargoValue * good.profitMargin);
  const turnsInTransit = 2 + Math.floor(Math.random() * 3); // 2-4 turns

  return {
    id: `smuggle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sourceLocation: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    targetLocation: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    contraband,
    status: 'in_transit',
    cargoValue,
    investmentCost,
    potentialProfit,
    detectionRisk: good.detectionChance,
    turnsRemaining: turnsInTransit,
    active: true,
  };
}

/**
 * Resolve a completed smuggling route
 * Returns: { success: boolean, profit: number, reputationChange: number }
 */
export function resolveSmugglingRoute(
  route: SmugglingRoute,
  currentHeatLevel: number
): { success: boolean; profit: number; reputationChange: number; heatIncrease: number } {
  const good = getContrabandGood(route.contraband);

  // Detection chance increases with heat level
  const adjustedDetectionChance = good.detectionChance + (currentHeatLevel * 0.001);
  const detected = Math.random() < adjustedDetectionChance;

  if (detected) {
    return {
      success: false,
      profit: -route.investmentCost, // Lose investment
      reputationChange: -good.reputationPenalty,
      heatIncrease: 30, // Significant heat increase
    };
  }

  return {
    success: true,
    profit: route.potentialProfit,
    reputationChange: good.reputationGain,
    heatIncrease: 10, // Moderate heat increase even on success
  };
}

/**
 * Update smuggling routes (decrement turns remaining)
 */
export function updateSmugglingRoutes(routes: SmugglingRoute[]): SmugglingRoute[] {
  return routes.map(route => ({
    ...route,
    turnsRemaining: route.turnsRemaining - 1,
    status: route.turnsRemaining - 1 <= 0 ? 'completed' : route.status,
    active: route.turnsRemaining - 1 > 0,
  }));
}

/**
 * Decay heat level over time (decreases by 1 per turn)
 */
export function decayHeatLevel(currentHeat: number): number {
  return Math.max(0, currentHeat - 1);
}

/**
 * Get risk description for a heat level
 */
export function getRiskDescription(heatLevel: number): string {
  if (heatLevel < 20) return 'Low Risk - Authorities not actively searching';
  if (heatLevel < 40) return 'Moderate Risk - Increased patrols in trade lanes';
  if (heatLevel < 60) return 'High Risk - Active investigation ongoing';
  if (heatLevel < 80) return 'Critical Risk - Manhunt declared';
  return 'Extreme Risk - All-out pursuit, immediate capture likely';
}

/**
 * Calculate reputation modifier from smuggling activity
 */
export function calculateReputationModifier(totalSmugglingReputation: number): number {
  // Every 100 reputation loss = -5 to all faction relations
  return Math.floor(totalSmugglingReputation / 20);
}
