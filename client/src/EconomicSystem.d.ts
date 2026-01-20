export interface ResourceType {
  name: string;
  type: 'currency' | 'raw' | 'manufactured';
  icon: string;
  basePrice?: number;
}

export const RESOURCES: Record<string, ResourceType>;

export interface InfrastructureType {
  name: string;
  cost: number;
  upkeep: number;
  produces?: Record<string, number>;
  consumes?: Record<string, number>;
  tradeBonus?: number;
  buildTime: number;
  requirements: Record<string, number>;
}

export const INFRASTRUCTURE: Record<string, InfrastructureType>;

export interface ProductionResult {
  production: Record<string, number>;
  consumption: Record<string, number>;
}

export interface NetIncomeResult extends ProductionResult {
  netCredits: number;
  totalUpkeep: number;
}

export function calculateResourceProduction(
  infrastructure: any[],
  marketPrices: Record<string, number>
): ProductionResult;

export function calculateNetIncome(
  infrastructure: any[],
  resources: Record<string, number>,
  marketPrices: Record<string, number>
): NetIncomeResult;

export function canBuildInfrastructure(
  type: string,
  currentInfrastructure: any[],
  resources: Record<string, number>
): { canBuild: boolean; reason?: string };

export function updateMarketPrices(
  currentPrices: Record<string, number>,
  globalSupply: Record<string, number>,
  globalDemand: Record<string, number>,
  volatility?: number
): Record<string, number>;
