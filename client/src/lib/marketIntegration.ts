import { getFactionMetrics, getFactionRelationship } from './factionMetrics';
import { getRelationshipFromReputation, type PlayerFactionStanding } from './factionStanding';
import { calculatePendulumState, calculatePendulumEffects } from './byzantinePendulum';

/**
 * Market Integration API
 * Provides faction-driven pricing, discounts, and availability for Dynamic Market module
 */

export interface MarketPriceModifiers {
  basePrice: number;
  factionDiscount: number; // -100 to +100 percentage
  conflictPenalty: number; // 0 to +200 percentage
  pendulumVolatility: number; // -50 to +50 percentage
  finalPrice: number;
  availabilityLocked: boolean;
  lockReason?: string;
}

export interface FactionMarketAccess {
  factionId: string;
  factionName: string;
  relationship: PlayerFactionStanding['relationship'];
  discountPercentage: number;
  exclusiveItemsUnlocked: boolean;
  restrictedItems: string[];
}

/**
 * Calculate price modifiers for an item based on faction relationships
 */
export function calculateFactionPriceModifiers(
  itemFactionId: string | null, // Faction that produces/sells the item
  basePrice: number,
  playerStandings: PlayerFactionStanding[],
  activeFactionIds: string[]
): MarketPriceModifiers {
  let factionDiscount = 0;
  let conflictPenalty = 0;
  let availabilityLocked = false;
  let lockReason: string | undefined;

  // If item has a faction affiliation
  if (itemFactionId) {
    const standing = playerStandings.find(s => s.factionId === itemFactionId);
    const faction = getFactionMetrics(itemFactionId);

    if (standing && faction) {
      // Calculate discount based on relationship
      factionDiscount = calculateFactionDiscount(standing.reputation);

      // Check if item is locked due to hostile relationship
      if (standing.relationship === 'hostile') {
        availabilityLocked = true;
        lockReason = `${faction.factionName} refuses to trade with you due to hostile relations`;
      }

      // Check for conflict penalties (enemies of the seller increase prices)
      conflictPenalty = calculateConflictPenalty(itemFactionId, playerStandings);
    }
  }

  // Calculate Byzantine Pendulum volatility
  const pendulumState = calculatePendulumState(activeFactionIds);
  const pendulumEffects = calculatePendulumEffects(pendulumState);
  const pendulumVolatility = pendulumEffects.marketPriceVariance;

  // Calculate final price
  let finalPrice = basePrice;
  
  // Apply faction discount (can be negative for penalties)
  finalPrice *= (1 + factionDiscount / 100);
  
  // Apply conflict penalty
  finalPrice *= (1 + conflictPenalty / 100);
  
  // Apply pendulum volatility
  finalPrice *= (1 + pendulumVolatility / 100);
  
  // Round to nearest credit
  finalPrice = Math.round(finalPrice);

  return {
    basePrice,
    factionDiscount,
    conflictPenalty,
    pendulumVolatility,
    finalPrice,
    availabilityLocked,
    lockReason,
  };
}

/**
 * Calculate faction discount based on reputation
 * Returns percentage discount (-100 to +100)
 */
function calculateFactionDiscount(reputation: number): number {
  const relationship = getRelationshipFromReputation(reputation);

  // Base discounts by relationship tier
  const baseDiscounts: Record<PlayerFactionStanding['relationship'], number> = {
    'allied': -25,      // 25% discount
    'friendly': -15,    // 15% discount
    'neutral': 0,       // No discount
    'unfriendly': +20,  // 20% markup
    'hostile': +50,     // 50% markup
  };

  let discount = baseDiscounts[relationship];

  // Fine-tune based on exact reputation within tier
  if (relationship === 'allied') {
    // 75-100: -25% to -30%
    discount += (reputation - 75) * -0.2;
  } else if (relationship === 'friendly') {
    // 25-75: -15% to -25%
    discount += (reputation - 25) * -0.2;
  } else if (relationship === 'unfriendly') {
    // -75 to -25: +20% to +30%
    discount += (reputation + 75) * 0.2;
  } else if (relationship === 'hostile') {
    // -100 to -75: +50% to +75%
    discount += (reputation + 100) * -1.0;
  }

  return Math.round(discount);
}

/**
 * Calculate conflict penalty based on player's relationships with faction enemies
 */
function calculateConflictPenalty(
  itemFactionId: string,
  playerStandings: PlayerFactionStanding[]
): number {
  const faction = getFactionMetrics(itemFactionId);
  if (!faction) return 0;

  let totalPenalty = 0;

  // Check if player is allied with any of this faction's enemies
  for (const enemyId of faction.naturalEnemies) {
    const enemyStanding = playerStandings.find(s => s.factionId === enemyId);
    
    if (enemyStanding) {
      const relationship = getRelationshipFromReputation(enemyStanding.reputation);
      
      // Penalty increases with closeness to faction's enemies
      if (relationship === 'allied') {
        totalPenalty += 30; // Major penalty for being allied with enemies
      } else if (relationship === 'friendly') {
        totalPenalty += 15; // Moderate penalty for being friendly with enemies
      }
    }
  }

  return Math.min(totalPenalty, 100); // Cap at 100% penalty
}

/**
 * Get faction market access information for all major factions
 */
export function getFactionMarketAccess(
  playerStandings: PlayerFactionStanding[]
): FactionMarketAccess[] {
  const majorFactions = [
    'neo-praetorians',
    'neo-varangians',
    'ecclesiarchy',
    'the-sidhe',
    'mycenoids',
  ];

  return majorFactions.map(factionId => {
    const standing = playerStandings.find(s => s.factionId === factionId);
    const faction = getFactionMetrics(factionId);

    if (!standing || !faction) {
      return {
        factionId,
        factionName: 'Unknown',
        relationship: 'neutral',
        discountPercentage: 0,
        exclusiveItemsUnlocked: false,
        restrictedItems: [],
      };
    }

    const discountPercentage = calculateFactionDiscount(standing.reputation);
    const exclusiveItemsUnlocked = standing.relationship === 'allied';
    const restrictedItems = standing.relationship === 'hostile' 
      ? faction.primaryResources 
      : [];

    return {
      factionId,
      factionName: faction.factionName,
      relationship: standing.relationship,
      discountPercentage,
      exclusiveItemsUnlocked,
      restrictedItems,
    };
  });
}

/**
 * Check if a specific item is available for purchase
 */
export function isItemAvailable(
  itemFactionId: string | null,
  playerStandings: PlayerFactionStanding[]
): { available: boolean; reason?: string } {
  if (!itemFactionId) {
    return { available: true }; // Neutral items always available
  }

  const standing = playerStandings.find(s => s.factionId === itemFactionId);
  const faction = getFactionMetrics(itemFactionId);

  if (!standing || !faction) {
    return { available: true };
  }

  if (standing.relationship === 'hostile') {
    return {
      available: false,
      reason: `${faction.factionName} refuses to trade with you. Improve relations to unlock.`,
    };
  }

  return { available: true };
}

/**
 * Get exclusive items unlocked by faction alliances
 */
export function getExclusiveItems(
  playerStandings: PlayerFactionStanding[]
): Array<{ factionId: string; factionName: string; items: string[] }> {
  const exclusives: Array<{ factionId: string; factionName: string; items: string[] }> = [];

  for (const standing of playerStandings) {
    if (standing.relationship === 'allied') {
      const faction = getFactionMetrics(standing.factionId);
      if (faction) {
        exclusives.push({
          factionId: standing.factionId,
          factionName: faction.factionName,
          items: faction.primaryResources, // Allied factions grant access to their primary resources
        });
      }
    }
  }

  return exclusives;
}

/**
 * Calculate economic power influence on market supply
 * Higher economic power = more items available, lower base prices
 */
export function calculateSupplyModifier(factionId: string): {
  supplyMultiplier: number; // 0.5 to 2.0
  basePriceModifier: number; // -20% to +20%
} {
  const faction = getFactionMetrics(factionId);
  if (!faction) {
    return { supplyMultiplier: 1.0, basePriceModifier: 0 };
  }

  // Economic power influences supply and base prices
  const economicPower = faction.economicPower;
  
  // Supply multiplier: higher economic power = more supply
  // 0-30 scale → 0.5-2.0 multiplier
  const supplyMultiplier = 0.5 + (economicPower / 30) * 1.5;
  
  // Base price modifier: higher economic power = lower base prices (economies of scale)
  // 0-30 scale → +20% to -20%
  const basePriceModifier = 20 - (economicPower / 30) * 40;

  return {
    supplyMultiplier: Math.round(supplyMultiplier * 100) / 100,
    basePriceModifier: Math.round(basePriceModifier),
  };
}

/**
 * API Documentation for Dynamic Market Integration
 */
export const MARKET_API_DOCS = `
# Faction Market Integration API

## Overview
This API provides faction-driven pricing, discounts, and availability for the Dynamic Market module.
All functions are pure and can be called from any market system.

## Core Functions

### calculateFactionPriceModifiers(itemFactionId, basePrice, playerStandings, activeFactionIds)
Returns complete price breakdown including:
- Base price
- Faction discount/penalty
- Conflict penalties
- Byzantine Pendulum volatility
- Final calculated price
- Availability lock status

### getFactionMarketAccess(playerStandings)
Returns array of faction market access info:
- Relationship status
- Discount percentage
- Exclusive items unlocked
- Restricted items list

### isItemAvailable(itemFactionId, playerStandings)
Checks if item can be purchased:
- Returns { available: boolean, reason?: string }

### getExclusiveItems(playerStandings)
Returns list of exclusive items unlocked through faction alliances

### calculateSupplyModifier(factionId)
Returns supply and base price modifiers based on faction economic power

## Integration Example

\`\`\`typescript
import { 
  calculateFactionPriceModifiers,
  getFactionMarketAccess,
  isItemAvailable 
} from '@/lib/marketIntegration';

// Check if item is available
const { available, reason } = isItemAvailable('neo-praetorians', playerStandings);

if (available) {
  // Calculate final price with all modifiers
  const priceInfo = calculateFactionPriceModifiers(
    'neo-praetorians',
    1000, // base price
    playerStandings,
    activeFactionIds
  );
  
  console.log(\`Final price: \${priceInfo.finalPrice} credits\`);
  console.log(\`Faction discount: \${priceInfo.factionDiscount}%\`);
}

// Get all faction market access
const marketAccess = getFactionMarketAccess(playerStandings);
marketAccess.forEach(faction => {
  console.log(\`\${faction.factionName}: \${faction.discountPercentage}% discount\`);
});
\`\`\`

## Price Calculation Formula

Final Price = Base Price 
  × (1 + Faction Discount %)
  × (1 + Conflict Penalty %)
  × (1 + Pendulum Volatility %)

## Relationship Discounts

- Allied: -25% to -30%
- Friendly: -15% to -25%
- Neutral: 0%
- Unfriendly: +20% to +30%
- Hostile: +50% to +75% (or locked)

## Conflict Penalties

- Allied with faction's enemy: +30%
- Friendly with faction's enemy: +15%
- Multiple conflicts stack (max +100%)

## Byzantine Pendulum Effects

- Stasis-dominant: Lower volatility, stable prices
- Plasticity-dominant: Higher volatility, chaotic prices
- Balanced: Moderate volatility

## Notes

- All prices rounded to nearest credit
- Hostile factions lock item availability
- Allied factions unlock exclusive items
- Economic Power affects supply and base prices
`;
