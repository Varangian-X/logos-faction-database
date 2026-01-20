/**
 * Market Events System
 * 
 * Generates random market events that affect prices, supply, and demand
 * Creates strategic trading opportunities through dynamic market conditions
 */

export type MarketEventType = 
  | 'price_surge'      // Sudden price increase for a resource
  | 'price_crash'      // Sudden price decrease for a resource
  | 'supply_shortage'  // Supply drops, prices rise
  | 'supply_glut'      // Supply increases, prices fall
  | 'trade_embargo'    // Specific faction blocks trade
  | 'pirate_activity'  // Increased piracy risk
  | 'discovery'        // New resource deposits found
  | 'disaster';        // Natural disaster affects supply

export interface MarketEvent {
  id: string;
  type: MarketEventType;
  affectedResource?: string;
  affectedFaction?: string;
  severity: 'minor' | 'moderate' | 'severe';
  priceModifier: number; // Multiplier: 0.5 = 50% price, 1.5 = 150% price
  supplyModifier: number; // Multiplier for supply
  demandModifier: number; // Multiplier for demand
  description: string;
  duration: number; // Turns the event lasts
  turnsRemaining: number;
  active: boolean;
}

export interface MarketEventState {
  activeEvents: MarketEvent[];
  eventHistory: MarketEvent[];
  nextEventTurn: number;
}

const EVENT_DESCRIPTIONS: Record<MarketEventType, string[]> = {
  price_surge: [
    'Sudden demand spike for {{resource}}',
    'Market speculation drives {{resource}} prices up',
    'Strategic reserves of {{resource}} depleted',
  ],
  price_crash: [
    'Market oversupply of {{resource}}',
    'New {{resource}} deposits discovered, flooding market',
    'Reduced demand for {{resource}} due to technological shift',
  ],
  supply_shortage: [
    'Supply lines disrupted for {{resource}}',
    'Mining accident reduces {{resource}} output',
    'Blockade prevents {{resource}} shipments',
  ],
  supply_glut: [
    'Bumper harvest of {{resource}}',
    'New {{resource}} production facility comes online',
    'Competitor overproduction floods {{resource}} market',
  ],
  trade_embargo: [
    'House {{faction}} imposes trade embargo',
    '{{faction}} blocks all trade with your faction',
    'Diplomatic crisis with {{faction}} disrupts trade',
  ],
  pirate_activity: [
    'Pirate activity increases in trade lanes',
    'Corsairs targeting {{resource}} shipments',
    'Increased security costs due to piracy',
  ],
  discovery: [
    'Rich {{resource}} deposits discovered',
    'New {{resource}} source identified',
    'Geological survey reveals {{resource}} abundance',
  ],
  disaster: [
    'Natural disaster affects {{resource}} production',
    'Environmental catastrophe impacts {{resource}} supply',
    'Infrastructure damage reduces {{resource}} output',
  ],
};

const RESOURCES = [
  'minerals', 'metals', 'energy', 'food', 'components', 'weapons', 'luxuries'
];

const FACTIONS = [
  'House Valerius', 'House Chen', 'House Korrigan', 'Syndicate 7'
];

/**
 * Generate a random market event
 */
export function generateMarketEvent(): MarketEvent {
  const eventTypes: MarketEventType[] = [
    'price_surge', 'price_crash', 'supply_shortage', 'supply_glut',
    'trade_embargo', 'pirate_activity', 'discovery', 'disaster'
  ];

  const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  const severity = ['minor', 'moderate', 'severe'][Math.floor(Math.random() * 3)] as 'minor' | 'moderate' | 'severe';
  
  const affectedResource = RESOURCES[Math.floor(Math.random() * RESOURCES.length)];
  const affectedFaction = FACTIONS[Math.floor(Math.random() * FACTIONS.length)];

  let priceModifier = 1;
  let supplyModifier = 1;
  let demandModifier = 1;
  let duration = 3;

  // Set modifiers based on event type and severity
  const severityMultiplier = severity === 'minor' ? 0.1 : severity === 'moderate' ? 0.25 : 0.4;

  switch (type) {
    case 'price_surge':
      priceModifier = 1 + severityMultiplier;
      demandModifier = 1 + severityMultiplier * 0.5;
      duration = 2 + Math.floor(Math.random() * 3);
      break;
    case 'price_crash':
      priceModifier = 1 - severityMultiplier;
      supplyModifier = 1 + severityMultiplier * 0.5;
      duration = 2 + Math.floor(Math.random() * 3);
      break;
    case 'supply_shortage':
      supplyModifier = 1 - severityMultiplier;
      priceModifier = 1 + severityMultiplier * 0.8;
      demandModifier = 1 + severityMultiplier * 0.3;
      duration = 3 + Math.floor(Math.random() * 4);
      break;
    case 'supply_glut':
      supplyModifier = 1 + severityMultiplier;
      priceModifier = 1 - severityMultiplier * 0.8;
      duration = 2 + Math.floor(Math.random() * 3);
      break;
    case 'trade_embargo':
      priceModifier = 1 + severityMultiplier * 0.6;
      supplyModifier = 1 - severityMultiplier * 0.5;
      duration = 4 + Math.floor(Math.random() * 5);
      break;
    case 'pirate_activity':
      priceModifier = 1 + severityMultiplier * 0.4;
      supplyModifier = 1 - severityMultiplier * 0.3;
      duration = 3 + Math.floor(Math.random() * 4);
      break;
    case 'discovery':
      supplyModifier = 1 + severityMultiplier;
      priceModifier = 1 - severityMultiplier * 0.6;
      duration = 5 + Math.floor(Math.random() * 5);
      break;
    case 'disaster':
      supplyModifier = 1 - severityMultiplier;
      priceModifier = 1 + severityMultiplier;
      demandModifier = 1 + severityMultiplier * 0.2;
      duration = 4 + Math.floor(Math.random() * 6);
      break;
  }

  const descriptions = EVENT_DESCRIPTIONS[type];
  let description = descriptions[Math.floor(Math.random() * descriptions.length)];
  description = description
    .replace('{{resource}}', affectedResource)
    .replace('{{faction}}', affectedFaction);

  return {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    affectedResource,
    affectedFaction: type === 'trade_embargo' ? affectedFaction : undefined,
    severity,
    priceModifier,
    supplyModifier,
    demandModifier,
    description,
    duration,
    turnsRemaining: duration,
    active: true,
  };
}

/**
 * Update active market events (decrement duration)
 */
export function updateMarketEvents(events: MarketEvent[]): MarketEvent[] {
  return events.map(event => ({
    ...event,
    turnsRemaining: event.turnsRemaining - 1,
    active: event.turnsRemaining - 1 > 0,
  })).filter(event => event.active);
}

/**
 * Check if a new event should be triggered (every 3-5 turns)
 */
export function shouldGenerateEvent(currentTurn: number, lastEventTurn: number): boolean {
  const eventInterval = 3 + Math.floor(Math.random() * 3); // 3-5 turns
  return currentTurn - lastEventTurn >= eventInterval;
}

/**
 * Apply market event modifiers to a price
 */
export function applyEventModifiers(
  basePrice: number,
  events: MarketEvent[],
  resourceId: string
): number {
  let modifiedPrice = basePrice;

  events.forEach(event => {
    if (event.affectedResource === resourceId && event.active) {
      modifiedPrice *= event.priceModifier;
    }
  });

  return Math.floor(modifiedPrice);
}

/**
 * Apply market event modifiers to supply
 */
export function applySupplyModifiers(
  baseSupply: number,
  events: MarketEvent[],
  resourceId: string
): number {
  let modifiedSupply = baseSupply;

  events.forEach(event => {
    if (event.affectedResource === resourceId && event.active) {
      modifiedSupply *= event.supplyModifier;
    }
  });

  return Math.floor(modifiedSupply);
}

/**
 * Apply market event modifiers to demand
 */
export function applyDemandModifiers(
  baseDemand: number,
  events: MarketEvent[],
  resourceId: string
): number {
  let modifiedDemand = baseDemand;

  events.forEach(event => {
    if (event.affectedResource === resourceId && event.active) {
      modifiedDemand *= event.demandModifier;
    }
  });

  return Math.floor(modifiedDemand);
}
