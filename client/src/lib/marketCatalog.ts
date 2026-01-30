/**
 * Dynamic Market Catalog
 * Item definitions with faction affiliations for faction-driven pricing
 */

export type ItemCategory = 'weapons' | 'ships' | 'resources' | 'technology' | 'equipment';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'legendary' | 'exclusive';

export interface MarketItem {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  basePrice: number;
  factionId: string | null; // null = neutral/universal item
  description: string;
  requiresAlliance?: boolean; // Only available to allied factions
  imageUrl?: string;
  stats?: Record<string, number | string>;
}

/**
 * Complete market catalog organized by category
 */
export const marketCatalog: Record<ItemCategory, MarketItem[]> = {
  weapons: [
    {
      id: 'neo-praetorian-gladius',
      name: 'Praetorian Gladius Blade',
      category: 'weapons',
      rarity: 'rare',
      basePrice: 2500,
      factionId: 'neo-praetorians',
      description: 'Mono-molecular edge blade favored by Neo-Praetorian Excubitors. Maintains perfect edge through quantum-locked lattice.',
      stats: { damage: 45, durability: 95, weight: 'Light' },
    },
    {
      id: 'varangian-axe',
      name: 'Varangian Plasma Axe',
      category: 'weapons',
      rarity: 'rare',
      basePrice: 3200,
      factionId: 'neo-varangians',
      description: 'Brutal plasma-edged axe that adapts to wielder\'s combat style. Chaos-forged for maximum unpredictability.',
      stats: { damage: 60, durability: 70, weight: 'Heavy' },
    },
    {
      id: 'ecclesiarchy-staff',
      name: 'Arch-Scribe Resonance Staff',
      category: 'weapons',
      rarity: 'legendary',
      basePrice: 8000,
      factionId: 'ecclesiarchy',
      description: 'Cryptographic weapon that disrupts enemy systems through harmonic interference. Requires Nicaean Key authorization.',
      requiresAlliance: true,
      stats: { damage: 35, 'system disruption': 90, weight: 'Medium' },
    },
    {
      id: 'standard-pulse-rifle',
      name: 'Standard Pulse Rifle',
      category: 'weapons',
      rarity: 'common',
      basePrice: 800,
      factionId: null,
      description: 'Universal energy weapon. Reliable, mass-produced, and available across the Imperium.',
      stats: { damage: 25, durability: 60, weight: 'Medium' },
    },
  ],

  ships: [
    {
      id: 'justiciar-cutter',
      name: 'Justiciar-Class Cutter',
      category: 'ships',
      rarity: 'legendary',
      basePrice: 150000,
      factionId: 'neo-praetorians',
      description: 'Fast interdiction vessel used by Neo-Praetorian patrols. Equipped with Stasis Field generators for ship immobilization.',
      requiresAlliance: true,
      stats: { speed: 85, armor: 70, weapons: 'Heavy', crew: 12 },
    },
    {
      id: 'raider-corvette',
      name: 'Raider Corvette',
      category: 'ships',
      rarity: 'rare',
      basePrice: 95000,
      factionId: 'neo-varangians',
      description: 'Agile pirate vessel with adaptive hull plating. Favored by Neo-Varangian warbands for hit-and-run tactics.',
      stats: { speed: 95, armor: 50, weapons: 'Medium', crew: 8 },
    },
    {
      id: 'merchant-hauler',
      name: 'Merchant Hauler',
      category: 'ships',
      rarity: 'common',
      basePrice: 45000,
      factionId: null,
      description: 'Standard cargo vessel. Slow but reliable with massive cargo capacity.',
      stats: { speed: 40, armor: 30, weapons: 'Light', cargo: 1000 },
    },
    {
      id: 'scout-frigate',
      name: 'Scout Frigate',
      category: 'ships',
      rarity: 'uncommon',
      basePrice: 68000,
      factionId: null,
      description: 'Long-range exploration vessel with advanced sensor arrays.',
      stats: { speed: 70, armor: 45, weapons: 'Light', sensors: 'Advanced' },
    },
  ],

  resources: [
    {
      id: 'aurum-crystal',
      name: 'Aurum-Processor Crystal',
      category: 'resources',
      rarity: 'legendary',
      basePrice: 50000,
      factionId: 'neo-praetorians', // Controlled by Mining Guilds, but Neo-Praetorians regulate trade
      description: 'CRITICAL RESOURCE: Powers the Logos itself. Mined exclusively at Sarmizegetusa Penal Colony. Heavily regulated.',
      requiresAlliance: true,
      stats: { purity: '99.8%', 'energy output': 'Extreme' },
    },
    {
      id: 'nicaean-key',
      name: 'Nicaean Cryptographic Key',
      category: 'resources',
      rarity: 'legendary',
      basePrice: 75000,
      factionId: 'ecclesiarchy',
      description: 'Validates all authority in the Imperium. Required for high-level system access. Ecclesiarchy monopoly.',
      requiresAlliance: true,
      stats: { 'authority level': 'Absolute', 'encryption': 'Unbreakable' },
    },
    {
      id: 'plasteel-ingot',
      name: 'Plasteel Ingot',
      category: 'resources',
      rarity: 'common',
      basePrice: 150,
      factionId: null,
      description: 'Standard construction material. Used in ship hulls, weapons, and infrastructure.',
      stats: { weight: '10kg', durability: 'High' },
    },
    {
      id: 'exotic-matter',
      name: 'Exotic Matter Sample',
      category: 'resources',
      rarity: 'rare',
      basePrice: 12000,
      factionId: 'the-sidhe',
      description: 'Strange substance from Sidhe-controlled space. Properties defy conventional physics.',
      stats: { stability: 'Unstable', 'research value': 'Extreme' },
    },
  ],

  technology: [
    {
      id: 'stasis-field-gen',
      name: 'Stasis Field Generator',
      category: 'technology',
      rarity: 'legendary',
      basePrice: 45000,
      factionId: 'neo-praetorians',
      description: 'Freezes targets in temporal stasis. Core Neo-Praetorian technology for maintaining order.',
      requiresAlliance: true,
      stats: { range: '500m', duration: '30 seconds', 'power consumption': 'High' },
    },
    {
      id: 'adaptive-ai',
      name: 'Adaptive Combat AI',
      category: 'technology',
      rarity: 'rare',
      basePrice: 28000,
      factionId: 'neo-varangians',
      description: 'Self-learning tactical AI that adapts to enemy patterns. Embodies Plasticity principles.',
      stats: { 'learning rate': 'Fast', 'decision speed': '0.001s', compatibility: 'Universal' },
    },
    {
      id: 'cloaking-device',
      name: 'Cloaking Device',
      category: 'technology',
      rarity: 'rare',
      basePrice: 35000,
      factionId: null,
      description: 'Renders ship invisible to most sensors. Limited duration due to power requirements.',
      stats: { duration: '15 minutes', 'detection chance': '5%', 'power consumption': 'Extreme' },
    },
    {
      id: 'quantum-comm',
      name: 'Quantum Communicator',
      category: 'technology',
      rarity: 'uncommon',
      basePrice: 8500,
      factionId: null,
      description: 'Instantaneous communication across any distance. Standard for military operations.',
      stats: { range: 'Unlimited', latency: '0ms', encryption: 'Military-grade' },
    },
  ],

  equipment: [
    {
      id: 'excubitor-armor',
      name: 'Excubitor Power Armor',
      category: 'equipment',
      rarity: 'legendary',
      basePrice: 18000,
      factionId: 'neo-praetorians',
      description: 'Elite Neo-Praetorian armor with integrated Stasis Field projectors. Symbol of absolute authority.',
      requiresAlliance: true,
      stats: { armor: 95, mobility: 70, 'special ability': 'Stasis Burst' },
    },
    {
      id: 'varangian-warplate',
      name: 'Varangian Warplate',
      category: 'equipment',
      rarity: 'rare',
      basePrice: 12000,
      factionId: 'neo-varangians',
      description: 'Adaptive armor that shifts configuration based on threat. Chaos-forged for unpredictability.',
      stats: { armor: 80, mobility: 85, 'special ability': 'Adaptive Plating' },
    },
    {
      id: 'standard-voidsuit',
      name: 'Standard Voidsuit',
      category: 'equipment',
      rarity: 'common',
      basePrice: 1200,
      factionId: null,
      description: 'Basic environmental protection for space operations. Mass-produced across the Imperium.',
      stats: { armor: 20, mobility: 90, 'life support': '8 hours' },
    },
    {
      id: 'stealth-cloak',
      name: 'Stealth Cloak',
      category: 'equipment',
      rarity: 'uncommon',
      basePrice: 6500,
      factionId: null,
      description: 'Light-bending fabric that reduces visual detection. Popular among infiltrators.',
      stats: { armor: 10, mobility: 95, 'detection reduction': '70%' },
    },
  ],
};

/**
 * Get all items from catalog as flat array
 */
export function getAllItems(): MarketItem[] {
  return Object.values(marketCatalog).flat();
}

/**
 * Get items by category
 */
export function getItemsByCategory(category: ItemCategory): MarketItem[] {
  return marketCatalog[category] || [];
}

/**
 * Get items by faction
 */
export function getItemsByFaction(factionId: string | null): MarketItem[] {
  return getAllItems().filter(item => item.factionId === factionId);
}

/**
 * Get items by rarity
 */
export function getItemsByRarity(rarity: ItemRarity): MarketItem[] {
  return getAllItems().filter(item => item.rarity === rarity);
}

/**
 * Get item by ID
 */
export function getItemById(itemId: string): MarketItem | undefined {
  return getAllItems().find(item => item.id === itemId);
}

/**
 * Get exclusive items (require alliance)
 */
export function getExclusiveItems(): MarketItem[] {
  return getAllItems().filter(item => item.requiresAlliance);
}

/**
 * Get neutral items (no faction affiliation)
 */
export function getNeutralItems(): MarketItem[] {
  return getAllItems().filter(item => item.factionId === null);
}

/**
 * Rarity color mapping for UI
 */
export const rarityColors: Record<ItemRarity, string> = {
  common: 'text-white/70 border-white/30',
  uncommon: 'text-green-500 border-green-500',
  rare: 'text-blue-500 border-blue-500',
  legendary: 'text-[#D4AF37] border-[#D4AF37]',
  exclusive: 'text-[#FF3333] border-[#FF3333]',
};

/**
 * Category icons for UI
 */
export const categoryIcons: Record<ItemCategory, string> = {
  weapons: '⚔️',
  ships: '🚀',
  resources: '💎',
  technology: '🔬',
  equipment: '🛡️',
};
