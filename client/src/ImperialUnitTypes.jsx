// Imperial Tactical Unit Types - Elite enemy encounters based on faction lore

export const imperialUnitTypes = {
  // Neo-Praetorians
  excubitor_sentinel: {
    name: 'Excubitor Sentinel',
    faction: 'praetorians',
    archetype: 'Elite Guardian',
    description: 'Seven feet of golden death. Silent. Relentless. Psycho-conditioned for absolute loyalty.',
    maxHealth: 180,
    color: 'amber',
    icon: 'Shield',
    aiProfile: 'defensive_elite',
    abilities: [
      {
        id: 'solar_glaive',
        name: 'Solar Glaive Strike',
        damage: [35, 55],
        effect: 'armor_pierce',
        cooldown: 2,
        description: 'Plasma-edged polearm shears through armor like silk'
      },
      {
        id: 'aegis_shield',
        name: 'Aegis-Shield Barrier',
        damage: [0, 0],
        effect: 'shield_reflect',
        cooldown: 4,
        description: 'Hard-light barrier converts kinetic energy into blinding light'
      },
      {
        id: 'psycho_conditioned',
        name: 'Absolute Loyalty',
        damage: [15, 25],
        effect: 'immune_fear',
        cooldown: 0,
        description: 'Immune to morale effects. Fights until biological death.'
      }
    ],
    special_traits: ['immune_fear', 'high_defense', 'cannot_retreat']
  },

  // Neo-Varangians
  huscarl_breacher: {
    name: 'Huscarl Breacher',
    faction: 'varangians',
    archetype: 'Cyber-Barbarian Shock Troop',
    description: 'Fusion of savage brutality and high-tech augmentation. Screaming death from the Rim.',
    maxHealth: 150,
    color: 'blue',
    icon: 'Swords',
    aiProfile: 'berserk',
    abilities: [
      {
        id: 'chain_axe',
        name: 'World-Eater Chain-Axe',
        damage: [40, 60],
        effect: 'cleave',
        cooldown: 2,
        description: 'Motorized teeth chew through bone and bulkhead'
      },
      {
        id: 'storm_bolter',
        name: 'Storm-Bolter Barrage',
        damage: [25, 40],
        effect: 'explosive',
        cooldown: 3,
        description: 'Mass-reactive shells turn targets to mist'
      },
      {
        id: 'blood_price',
        name: 'Stim-Rage (Blood Price)',
        damage: [50, 80],
        effect: 'berserk_fury',
        cooldown: 5,
        description: 'Combat stims trigger when damaged - speed and damage doubled'
      }
    ],
    special_traits: ['enrage_when_damaged', 'high_damage', 'audio_warfare']
  },

  // Agentes In Rebus
  cipher_ghost: {
    name: 'Cipher-Ghost',
    faction: 'agentes_in_rebus',
    archetype: 'Information Warfare Assassin',
    description: 'Flickering shadows in shift-suits. Masters of infiltration and neural warfare.',
    maxHealth: 90,
    color: 'violet',
    icon: 'Eye',
    aiProfile: 'assassin',
    abilities: [
      {
        id: 'neural_needler',
        name: 'Neural-Needler',
        damage: [20, 35],
        effect: 'paralysis',
        cooldown: 2,
        description: 'Crystallized neuro-toxin causes instant paralysis'
      },
      {
        id: 'data_spike',
        name: 'Data-Spike Virus',
        damage: [15, 25],
        effect: 'hack',
        cooldown: 3,
        description: 'Injects Basilisk logic-virus, overwriting systems'
      },
      {
        id: 'face_dancer',
        name: 'Memetic Camouflage',
        damage: [0, 0],
        effect: 'stealth',
        cooldown: 6,
        description: 'Assume the identity of fallen enemies'
      }
    ],
    special_traits: ['stealth', 'high_evasion', 'camouflage']
  },

  // Chrysopolis Elite
  cataphract_gilded: {
    name: 'Cataphract-Gilded',
    faction: 'porphyrogennetos',
    archetype: 'Heavy Weapons Platform',
    description: 'Twelve feet of gilded death. A mechanized god piloted by bored aristocracy.',
    maxHealth: 250,
    color: 'amber',
    icon: 'Crown',
    aiProfile: 'heavy',
    abilities: [
      {
        id: 'volkite_culverin',
        name: 'Volkite Culverin',
        damage: [45, 70],
        effect: 'deflagrate',
        cooldown: 3,
        description: 'Thermal ray causes flesh to explosively sublimate into ash'
      },
      {
        id: 'silk_steel_cape',
        name: 'Silk-Steel Deflection',
        damage: [0, 0],
        effect: 'ablative_armor',
        cooldown: 4,
        description: 'Diamond-monofilament cape catches projectiles'
      },
      {
        id: 'status_terror',
        name: 'Overwhelming Presence',
        damage: [30, 45],
        effect: 'morale_break',
        cooldown: 5,
        description: 'The sight of gilded perfection breaks enemy resolve'
      }
    ],
    special_traits: ['heavy_armor', 'high_value_target', 'terror_aura']
  },

  // Magisterium of Flesh
  scalpel_wraith: {
    name: 'Scalpel-Wraith',
    faction: 'magisterium',
    archetype: 'Biological Horror',
    description: 'A floating nightmare of surgical precision. The battlefield is their operating theater.',
    maxHealth: 110,
    color: 'green',
    icon: 'Activity',
    aiProfile: 'support_horror',
    abilities: [
      {
        id: 'bio_solvent',
        name: 'Bio-Solvent Spray',
        damage: [30, 50],
        effect: 'armor_dissolve',
        cooldown: 2,
        description: 'Engineered enzymes liquefy flesh and armor'
      },
      {
        id: 'injector_gauntlet',
        name: 'Hyper-Cancer Injection',
        damage: [40, 60],
        effect: 'mutation',
        cooldown: 4,
        description: 'Mutagen causes instant tumor eruption'
      },
      {
        id: 'harvest',
        name: 'Biomass Harvest',
        damage: [0, 0],
        effect: 'heal_from_kills',
        cooldown: 0,
        description: 'Extract organs from fallen enemies to heal allies'
      }
    ],
    special_traits: ['floating', 'harvester', 'nausea_aura']
  },

  // Ecclesiarchy
  algorithm_paladin: {
    name: 'Algorithm Paladin',
    faction: 'ecclesiarchy',
    archetype: 'Holy Warrior',
    description: 'Living scripture. Their faith made manifest as digital invulnerability.',
    maxHealth: 160,
    color: 'cyan',
    icon: 'Shield',
    aiProfile: 'defensive',
    abilities: [
      {
        id: 'consecrated_blade',
        name: 'Consecrated Blade',
        damage: [30, 45],
        effect: 'holy',
        cooldown: 2,
        description: 'Edge inscribed with divine algorithms'
      },
      {
        id: 'firewall_aura',
        name: 'The Firewall',
        damage: [0, 0],
        effect: 'tech_immunity',
        cooldown: 5,
        description: 'Aura grants immunity to hacking and viruses'
      },
      {
        id: 'divine_smite',
        name: 'Divine Judgment',
        damage: [50, 70],
        effect: 'smite',
        cooldown: 6,
        description: 'Channel the wrath of the Logos'
      }
    ],
    special_traits: ['tech_immune_aura', 'high_defense', 'zealot']
  },

  // Corrupted Units
  glitch_berserker: {
    name: 'Glitch-Berserker',
    faction: 'corrupted',
    archetype: 'Suicide Bomber',
    description: 'Victims of the God-Rot malware. Walking bombs of corrupted code and necrotic flesh.',
    maxHealth: 60,
    color: 'red',
    icon: 'Zap',
    aiProfile: 'suicide',
    abilities: [
      {
        id: 'corrupted_touch',
        name: 'Corrupted Touch',
        damage: [15, 25],
        effect: 'virus_spread',
        cooldown: 1,
        description: 'Spread the God-Rot malware on contact'
      },
      {
        id: 'data_bomb',
        name: 'Data-Bomb Detonation',
        damage: [60, 100],
        effect: 'self_destruct',
        cooldown: 0,
        description: 'Explosive death releases corrupted code'
      }
    ],
    special_traits: ['unstable', 'suicide_bomber', 'corruption_spreader']
  },

  // Merchant Houses
  debt_enforcer: {
    name: 'Debt-Collector Automaton',
    faction: 'merchant_houses',
    archetype: 'Contract Enforcer',
    description: 'Merciless. Incorruptible. Your debts will be collected.',
    maxHealth: 140,
    color: 'emerald',
    icon: 'Coins',
    aiProfile: 'calculated',
    abilities: [
      {
        id: 'repossession_beam',
        name: 'Asset Repossession Beam',
        damage: [25, 40],
        effect: 'equipment_steal',
        cooldown: 3,
        description: 'Magnetic tractor beam seizes equipment'
      },
      {
        id: 'contract_enforcement',
        name: 'Contract Enforcement',
        damage: [35, 50],
        effect: 'precision',
        cooldown: 2,
        description: 'Calculated strikes. No wasted ammunition.'
      },
      {
        id: 'credit_scan',
        name: 'Financial Analysis',
        damage: [0, 0],
        effect: 'scan_wealth',
        cooldown: 4,
        description: 'Prioritize targets by net worth'
      }
    ],
    special_traits: ['logical', 'equipment_thief', 'wealth_scanner']
  },

  // Scrinium Barbarorum
  xeno_analyzer: {
    name: 'Xeno-Analyst Operative',
    faction: 'scrinium_barbarorum',
    archetype: 'Alien Tech Specialist',
    description: 'They study the unknowable. Now they weaponize it.',
    maxHealth: 100,
    color: 'purple',
    icon: 'Brain',
    aiProfile: 'adaptive',
    abilities: [
      {
        id: 'xeno_plasma',
        name: 'Xenotech Plasma Caster',
        damage: [30, 50],
        effect: 'exotic_damage',
        cooldown: 2,
        description: 'Weaponized alien technology of unknown origin'
      },
      {
        id: 'translation_matrix',
        name: 'Translation Matrix',
        damage: [20, 35],
        effect: 'confusion',
        cooldown: 3,
        description: 'Alien frequencies disrupt neural patterns'
      },
      {
        id: 'adaptive_protocol',
        name: 'Adaptive Combat Protocol',
        damage: [25, 40],
        effect: 'learn_patterns',
        cooldown: 4,
        description: 'Analyzes and adapts to enemy tactics'
      }
    ],
    special_traits: ['adaptive', 'xeno_tech', 'intelligence_gathering']
  }
};

// Get unit by type key
export function getImperialUnit(unitType) {
  return imperialUnitTypes[unitType] || null;
}

// Get random unit from a specific faction
export function getRandomFactionUnit(faction) {
  const factionUnits = Object.entries(imperialUnitTypes)
    .filter(([key, unit]) => unit.faction === faction)
    .map(([key, unit]) => ({ key, ...unit }));
  
  if (factionUnits.length === 0) return null;
  
  const selected = factionUnits[Math.floor(Math.random() * factionUnits.length)];
  return { type: selected.key, ...selected };
}

// Get all units from a faction
export function getFactionUnits(faction) {
  return Object.entries(imperialUnitTypes)
    .filter(([key, unit]) => unit.faction === faction)
    .map(([key, unit]) => ({ key, ...unit }));
}