// Procedural Location Generator - Creates unique locations with characteristics

const LOCATION_TYPES = ['station', 'planet', 'asteroid', 'derelict', 'nebula', 'gateway', 'fortress'];
const SECTORS = ['Core', 'Frontier', 'Outer Rim', 'Hidden', 'Contested', 'Quarantine'];
const ATMOSPHERES = ['sterile', 'oppressive', 'mysterious', 'chaotic', 'serene', 'dangerous'];

const LOCATION_THEMES = {
  military: {
    prefixes: ['Fort', 'Bastion', 'Garrison', 'Stronghold', 'Outpost'],
    suffixes: ['Prime', 'Alpha', 'Omega', 'Secundus', 'Tertius'],
    resources: ['military_tech', 'weapons', 'armor'],
    factions: ['praetorians', 'varangians']
  },
  religious: {
    prefixes: ['Sanctum', 'Cathedral', 'Shrine', 'Temple', 'Chapel'],
    suffixes: ['of Light', 'of the Logos', 'Divine', 'Sanctified', 'Holy'],
    resources: ['religious_artifacts', 'ancient_texts', 'divine_algorithms'],
    factions: ['ecclesiarchy']
  },
  commercial: {
    prefixes: ['Trade', 'Market', 'Exchange', 'Bazaar', 'Commerce'],
    suffixes: ['Hub', 'Station', 'Nexus', 'Center', 'Port'],
    resources: ['credits', 'rare_goods', 'trade_routes'],
    factions: ['merchant_houses']
  },
  criminal: {
    prefixes: ['Shadow', 'Dark', 'Hidden', 'Black', 'Rogue'],
    suffixes: ['Den', 'Haven', 'Refuge', 'Enclave', 'Hideout'],
    resources: ['contraband', 'stolen_goods', 'intel'],
    factions: []
  },
  research: {
    prefixes: ['Research', 'Laboratory', 'Institute', 'Archive', 'Complex'],
    suffixes: ['Alpha', 'Beta', 'Prime', 'Central', 'Advanced'],
    resources: ['ancient_tech', 'research_data', 'prototypes'],
    factions: ['scrinium_barbarorum']
  },
  mysterious: {
    prefixes: ['Enigma', 'Anomaly', 'Void', 'Lost', 'Forgotten'],
    suffixes: ['Sector', 'Zone', 'Region', 'Point', 'Nexus'],
    resources: ['alien_artifacts', 'void_energy', 'forbidden_knowledge'],
    factions: []
  }
};

const LOCATION_FEATURES = [
  { id: 'trading_post', name: 'Trading Post', benefit: 'buy_sell_goods' },
  { id: 'repair_bay', name: 'Repair Facilities', benefit: 'restore_health' },
  { id: 'intel_broker', name: 'Information Broker', benefit: 'buy_intel' },
  { id: 'mission_board', name: 'Mission Board', benefit: 'get_missions' },
  { id: 'augmentation_shop', name: 'Augmentation Clinic', benefit: 'install_augs' },
  { id: 'faction_embassy', name: 'Faction Embassy', benefit: 'faction_missions' },
  { id: 'arena', name: 'Combat Arena', benefit: 'test_skills' },
  { id: 'library', name: 'Data Library', benefit: 'learn_lore' },
  { id: 'workshop', name: 'Workshop', benefit: 'craft_items' },
  { id: 'cantina', name: 'Cantina', benefit: 'recruit_npcs' }
];

export function generateProceduralLocation(seed, gameState) {
  const theme = selectTheme(gameState);
  const type = LOCATION_TYPES[seed % LOCATION_TYPES.length];
  const sector = SECTORS[Math.floor(seed / LOCATION_TYPES.length) % SECTORS.length];
  const atmosphere = ATMOSPHERES[seed % ATMOSPHERES.length];
  
  const themeData = LOCATION_THEMES[theme];
  const prefix = themeData.prefixes[seed % themeData.prefixes.length];
  const suffix = themeData.suffixes[Math.floor(seed / 10) % themeData.suffixes.length];
  
  const name = `${prefix} ${suffix}`;
  const id = name.toLowerCase().replace(/\s+/g, '_') + `_${seed}`;
  
  // Generate coordinates
  const coordinates = {
    x: 20 + (seed % 60),
    y: 20 + (Math.floor(seed / 10) % 60)
  };
  
  // Select features based on theme and type
  const features = selectFeatures(theme, type, seed);
  
  // Generate description
  const description = generateDescription(name, type, atmosphere, theme);
  
  // Generate discovery requirements
  const discoveryReqs = generateDiscoveryRequirements(theme, gameState);
  
  // Select faction presence
  const factionPresence = themeData.factions.length > 0 
    ? themeData.factions 
    : [];
  
  return {
    id,
    name,
    type,
    sector,
    tier: determineLocationTier(theme, gameState),
    coordinates,
    atmosphere,
    theme,
    description,
    discoveryRequirements: discoveryReqs,
    features,
    resources: themeData.resources,
    factionPresence,
    npcs: generateLocationNPCs(theme, seed),
    dangers: generateDangers(theme, atmosphere, seed),
    isGenerated: true,
    generatedTurn: gameState.turn_number
  };
}

function selectTheme(gameState) {
  const themes = Object.keys(LOCATION_THEMES);
  
  // Weight themes based on game state
  const weights = {
    military: gameState.reputation > 60 ? 2 : 1,
    religious: gameState.faction_relations?.ecclesiarchy > 40 ? 2 : 1,
    commercial: gameState.credits > 5000 ? 2 : 1,
    criminal: gameState.reputation < 30 ? 2 : 1,
    research: gameState.intel > 50 ? 2 : 1,
    mysterious: gameState.discovered_locations?.length > 8 ? 2 : 1
  };
  
  const weightedThemes = [];
  themes.forEach(theme => {
    for (let i = 0; i < (weights[theme] || 1); i++) {
      weightedThemes.push(theme);
    }
  });
  
  return weightedThemes[Math.floor(Math.random() * weightedThemes.length)];
}

function selectFeatures(theme, type, seed) {
  const numFeatures = 2 + (seed % 3); // 2-4 features
  const availableFeatures = [...LOCATION_FEATURES];
  
  // Theme-specific feature priorities
  const priorities = {
    commercial: ['trading_post', 'intel_broker', 'workshop'],
    military: ['repair_bay', 'arena', 'augmentation_shop'],
    religious: ['library', 'faction_embassy'],
    criminal: ['intel_broker', 'cantina', 'trading_post'],
    research: ['library', 'workshop', 'augmentation_shop'],
    mysterious: ['library', 'intel_broker']
  };
  
  const selected = [];
  const themePriorities = priorities[theme] || [];
  
  // Add priority features first
  themePriorities.forEach(featureId => {
    const feature = availableFeatures.find(f => f.id === featureId);
    if (feature && selected.length < numFeatures) {
      selected.push(feature);
    }
  });
  
  // Fill remaining slots randomly
  while (selected.length < numFeatures && availableFeatures.length > 0) {
    const idx = (seed + selected.length) % availableFeatures.length;
    const feature = availableFeatures[idx];
    if (!selected.find(f => f.id === feature.id)) {
      selected.push(feature);
    }
  }
  
  return selected;
}

function generateDescription(name, type, atmosphere, theme) {
  const descriptions = {
    military: [
      `A fortified ${type} bristling with defensive systems and disciplined troops.`,
      `Steel and determination define this ${atmosphere} military installation.`,
      `Banners of the Imperium fly high over this well-defended ${type}.`
    ],
    religious: [
      `Divine light filters through stained data-glass in this sacred ${type}.`,
      `The air hums with digital hymns and the prayers of the faithful.`,
      `A holy site where technology and faith intertwine seamlessly.`
    ],
    commercial: [
      `Credits flow like water through this bustling ${type}.`,
      `Merchants from across the Imperium gather to trade exotic goods.`,
      `The smell of profit and opportunity permeates the ${atmosphere} atmosphere.`
    ],
    criminal: [
      `Shadows conceal secrets in this ${atmosphere} ${type}.`,
      `The law rarely reaches this far into the underbelly of civilization.`,
      `Deals are struck in hushed tones beneath flickering neon lights.`
    ],
    research: [
      `Advanced technology hums behind reinforced walls in this research ${type}.`,
      `Brilliant minds push the boundaries of Imperial science here.`,
      `Experimental equipment fills every corner of this ${atmosphere} facility.`
    ],
    mysterious: [
      `Strange energies emanate from this enigmatic ${type}.`,
      `Few understand what truly lies within these ${atmosphere} halls.`,
      `Reality seems... different here. Proceed with caution.`
    ]
  };
  
  const themeDescriptions = descriptions[theme] || descriptions.mysterious;
  return themeDescriptions[Math.floor(Math.random() * themeDescriptions.length)];
}

function generateDiscoveryRequirements(theme, gameState) {
  const baseReqs = {
    military: { reputation: 40, faction_praetorians: 20 },
    religious: { reputation: 35, faction_ecclesiarchy: 25 },
    commercial: { credits: 2000 },
    criminal: { reputation: -20, intel: 30 },
    research: { intel: 40, trait_insight: 5 },
    mysterious: { trait_insight: 6, intel: 50 }
  };
  
  return baseReqs[theme] || {};
}

function determineLocationTier(theme, gameState) {
  const playerTier = gameState.tier || 'mese';
  
  if (theme === 'mysterious' || theme === 'military') {
    return Math.random() > 0.5 ? 'chrysopolis' : 'mese';
  } else if (theme === 'criminal') {
    return Math.random() > 0.5 ? 'cisterns' : 'mese';
  }
  
  return playerTier;
}

function generateLocationNPCs(theme, seed) {
  const npcTypes = {
    military: ['Commander', 'Veteran Soldier', 'Quartermaster'],
    religious: ['High Priest', 'Zealot', 'Pilgrim'],
    commercial: ['Merchant Prince', 'Trade Negotiator', 'Smuggler'],
    criminal: ['Crime Boss', 'Enforcer', 'Information Broker'],
    research: ['Lead Scientist', 'Research Assistant', 'AI Specialist'],
    mysterious: ['Enigmatic Figure', 'Void Touched', 'Oracle']
  };
  
  const types = npcTypes[theme] || npcTypes.mysterious;
  const count = 2 + (seed % 2); // 2-3 NPCs
  
  return types.slice(0, count);
}

function generateDangers(theme, atmosphere, seed) {
  if (atmosphere === 'serene') return [];
  
  const dangers = {
    military: ['armed_patrols', 'security_checkpoints', 'restricted_areas'],
    religious: ['fanatical_guards', 'heresy_trials', 'divine_judgment'],
    commercial: ['price_gouging', 'corporate_spies', 'market_manipulation'],
    criminal: ['gang_violence', 'betrayal', 'law_enforcement_raids'],
    research: ['experimental_hazards', 'rogue_AI', 'containment_breaches'],
    mysterious: ['reality_distortions', 'void_creatures', 'sanity_loss']
  };
  
  const themeDangers = dangers[theme] || dangers.mysterious;
  const count = atmosphere === 'dangerous' ? 3 : 1 + (seed % 2);
  
  return themeDangers.slice(0, count);
}

// Generate multiple locations at once
export function generateLocationCluster(count, gameState) {
  const locations = [];
  const baseSeed = Date.now();
  
  for (let i = 0; i < count; i++) {
    const seed = baseSeed + i * 1000 + (gameState.turn_number || 0) * 100;
    locations.push(generateProceduralLocation(seed, gameState));
  }
  
  return locations;
}

// Check if location should be revealed based on game progression
export function shouldRevealProceduralLocation(location, gameState) {
  const reqs = location.discoveryRequirements;
  
  for (const [key, value] of Object.entries(reqs)) {
    if (key === 'reputation' && gameState.reputation < value) return false;
    if (key === 'credits' && gameState.credits < value) return false;
    if (key === 'intel' && gameState.intel < value) return false;
    if (key.startsWith('faction_')) {
      const faction = key.replace('faction_', '');
      if ((gameState.faction_relations?.[faction] || 0) < value) return false;
    }
    if (key.startsWith('trait_')) {
      const trait = key.replace('trait_', '');
      if ((gameState.character_traits?.[trait] || 3) < value) return false;
    }
  }
  
  return true;
}