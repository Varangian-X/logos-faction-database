/**
 * Faction Power Metrics Calculator
 * Calculates Military Strength, Economic Power, and Political Influence for all factions
 */

export interface FactionMetrics {
  factionId: string;
  factionName: string;
  alignment: 'Stasis' | 'Plasticity' | 'Neutral';
  militaryStrength: number;
  economicPower: number;
  politicalInfluence: number;
  totalPowerScore: number;
  threatLevel: 'EXISTENTIAL' | 'HIGH' | 'MODERATE' | 'LOW';
  primaryResources: string[];
  signatureUnit: string;
  naturalAllies: string[];
  naturalEnemies: string[];
}

// Faction metrics data based on Master Schema analysis
export const factionMetricsData: Record<string, FactionMetrics> = {
  'neo-praetorians': {
    factionId: 'neo-praetorians',
    factionName: 'Neo-Praetorians',
    alignment: 'Stasis',
    militaryStrength: 24,
    economicPower: 25,
    politicalInfluence: 26,
    totalPowerScore: 24.95,
    threatLevel: 'EXISTENTIAL',
    primaryResources: ['Master ROM', 'Official Narrative', 'Cryptographic Keys'],
    signatureUnit: 'Excubitor Sentinels',
    naturalAllies: ['Ecclesiarchy', 'Guild of Artificers', 'Mining Guilds'],
    naturalEnemies: ['Neo-Varangians', 'Mycenoids', 'The Sidhe'],
  },
  'neo-varangians': {
    factionId: 'neo-varangians',
    factionName: 'Neo-Varangians',
    alignment: 'Plasticity',
    militaryStrength: 23,
    economicPower: 18,
    politicalInfluence: 24,
    totalPowerScore: 21.95,
    threatLevel: 'EXISTENTIAL',
    primaryResources: ['Lead-Grain', 'Berserker-Glands', 'Drakkar Assault Ships'],
    signatureUnit: 'Huscarl Breachers',
    naturalAllies: ['Scrinium Barbarorum', 'Ister Rim Confederation', 'Void-Huns'],
    naturalEnemies: ['Neo-Praetorians', 'Angeloi', 'Guild of Artificers'],
  },
  'ecclesiarchy': {
    factionId: 'ecclesiarchy',
    factionName: 'Ecclesiarchy (Arch-Scribes)',
    alignment: 'Stasis',
    militaryStrength: 19,
    economicPower: 26,
    politicalInfluence: 22,
    totalPowerScore: 22.45,
    threatLevel: 'MODERATE',
    primaryResources: ['Nicaean Cryptographic Keys', 'Master ROM', 'Indulgences'],
    signatureUnit: 'Binary-Paladins',
    naturalAllies: ['Neo-Praetorians', 'Guild of Artificers', 'Mining Guilds'],
    naturalEnemies: ['Tomi Collective', 'Prasinoi', 'Synthetics'],
  },
  'mycenoids': {
    factionId: 'mycenoids',
    factionName: 'Mycenoids',
    alignment: 'Plasticity',
    militaryStrength: 25,
    economicPower: 22,
    politicalInfluence: 25,
    totalPowerScore: 24.10,
    threatLevel: 'EXISTENTIAL',
    primaryResources: ['Mycenoid Spores', 'Prime Cortex', 'Ambient Spore Field'],
    signatureUnit: 'Hunter-Killer Drones',
    naturalAllies: ['Data-Druids', 'Oneiric Cartel', 'The Synthetics'],
    naturalEnemies: ['All Factions (Existential Threat)'],
  },
  'the-sidhe': {
    factionId: 'the-sidhe',
    factionName: 'The Sidhe (Court of Shadows)',
    alignment: 'Plasticity',
    militaryStrength: 26,
    economicPower: 20,
    politicalInfluence: 27,
    totalPowerScore: 24.35,
    threatLevel: 'EXISTENTIAL',
    primaryResources: ['Reality Singing', 'Fairy Paths', 'Space-Time Mastery'],
    signatureUnit: 'Sidhe Operatives',
    naturalAllies: ['Mycenoids', 'Synthetics', 'Data-Druids'],
    naturalEnemies: ['All Factions (Existential Threat)'],
  },
  'mining-guilds': {
    factionId: 'mining-guilds',
    factionName: 'Mining Guilds (Aurum-Syndicate)',
    alignment: 'Stasis',
    militaryStrength: 16,
    economicPower: 28,
    politicalInfluence: 18,
    totalPowerScore: 20.75,
    threatLevel: 'MODERATE',
    primaryResources: ['Aurum-Processor Crystals', 'Raw Wealth', 'Bleeding Gold'],
    signatureUnit: 'Grave-Drones',
    naturalAllies: ['Ecclesiarchy', 'Guild of Artificers', 'Neo-Praetorians'],
    naturalEnemies: ['Scavenger Clans', 'Oneiric Cartel'],
  },
  'house-comnenus': {
    factionId: 'house-comnenus',
    factionName: 'House Comnenus',
    alignment: 'Neutral',
    militaryStrength: 14,
    economicPower: 27,
    politicalInfluence: 20,
    totalPowerScore: 20.35,
    threatLevel: 'MODERATE',
    primaryResources: ['Grey Intelligence', 'Trade Lanes', 'Shadow Economy'],
    signatureUnit: 'Merchant Enforcers',
    naturalAllies: ['All Factions (Neutral Broker)'],
    naturalEnemies: ['None (Deliberately Neutral)'],
  },
  'agentes-in-rebus': {
    factionId: 'agentes-in-rebus',
    factionName: 'Agentes in Rebus',
    alignment: 'Stasis',
    militaryStrength: 20,
    economicPower: 19,
    politicalInfluence: 25,
    totalPowerScore: 21.40,
    threatLevel: 'EXISTENTIAL',
    primaryResources: ['Grey Intelligence', 'Project Aether', 'Whisper Repository'],
    signatureUnit: 'Cipher-Ghosts',
    naturalAllies: ['Neo-Praetorians', 'Ecclesiarchy'],
    naturalEnemies: ['All Factions (Suspected)'],
  },
  'guild-of-artificers': {
    factionId: 'guild-of-artificers',
    factionName: 'Guild of Artificers',
    alignment: 'Stasis',
    militaryStrength: 17,
    economicPower: 24,
    politicalInfluence: 19,
    totalPowerScore: 20.05,
    threatLevel: 'MODERATE',
    primaryResources: ['Adamantine', 'Kinetic Ammunition', 'Standardized Tech'],
    signatureUnit: 'Steel Thralls',
    naturalAllies: ['Neo-Praetorians', 'Mining Guilds', 'Ecclesiarchy'],
    naturalEnemies: ['Data-Druids', 'Aether-Nomads'],
  },
  'data-druids': {
    factionId: 'data-druids',
    factionName: 'Data-Druids',
    alignment: 'Plasticity',
    militaryStrength: 15,
    economicPower: 16,
    politicalInfluence: 18,
    totalPowerScore: 16.45,
    threatLevel: 'MODERATE',
    primaryResources: ['Bio-Data', 'Feral Code', 'Memory-Weaves'],
    signatureUnit: 'Spirit-Weavers',
    naturalAllies: ['Aether-Nomads', 'Synthetics', 'Mycenoids'],
    naturalEnemies: ['Guild of Artificers', 'Neo-Praetorians'],
  },
};

// Top 5 most powerful factions
export const topFactions = [
  'the-sidhe',
  'mycenoids',
  'neo-praetorians',
  'ecclesiarchy',
  'neo-varangians',
].map((id) => factionMetricsData[id]);

/**
 * Calculate total power score using weighted formula
 * FACTION_POWER_SCORE = (MILITARY × 0.35) + (ECONOMIC × 0.35) + (POLITICAL × 0.30)
 */
export function calculateTotalPowerScore(
  military: number,
  economic: number,
  political: number
): number {
  return military * 0.35 + economic * 0.35 + political * 0.3;
}

/**
 * Get faction by ID
 */
export function getFactionMetrics(factionId: string): FactionMetrics | undefined {
  return factionMetricsData[factionId];
}

/**
 * Get all factions sorted by power score
 */
export function getAllFactionsSorted(): FactionMetrics[] {
  return Object.values(factionMetricsData).sort(
    (a, b) => b.totalPowerScore - a.totalPowerScore
  );
}

/**
 * Get relationship between two factions
 */
export function getFactionRelationship(
  factionId1: string,
  factionId2: string
): 'ally' | 'enemy' | 'neutral' {
  const faction1 = factionMetricsData[factionId1];
  const faction2 = factionMetricsData[factionId2];

  if (!faction1 || !faction2) return 'neutral';

  if (faction1.naturalAllies.includes(faction2.factionName)) return 'ally';
  if (faction1.naturalEnemies.includes(faction2.factionName)) return 'enemy';
  return 'neutral';
}
