// Character Customization Data - Traits, backgrounds, and bonuses

export const BACKGROUNDS = {
  military_officer: {
    name: 'Military Officer',
    description: 'Former Neo-Praetorian commander with tactical expertise',
    icon: 'sword',
    bonuses: {
      combat_skill: 2,
      leadership_skill: 1,
      starting_reputation: 10,
      faction_relations: { praetorians: 30, varangians: 10 }
    },
    starting_resources: { credits: 1500, influence: 15 },
    trait: 'tactical_mind'
  },
  
  ecclesiarch_scholar: {
    name: 'Ecclesiarch Scholar',
    description: 'Student of the Logos with deep understanding of imperial doctrine',
    icon: 'book',
    bonuses: {
      negotiation_skill: 2,
      investigation_skill: 1,
      starting_reputation: 15,
      faction_relations: { ecclesiarchy: 40, scrinium_barbarorum: 10 }
    },
    starting_resources: { credits: 1000, influence: 25 },
    trait: 'theological_insight'
  },
  
  merchant_scion: {
    name: 'Merchant Scion',
    description: 'Heir to a trading dynasty with vast commercial networks',
    icon: 'coins',
    bonuses: {
      negotiation_skill: 2,
      starting_reputation: 5,
      faction_relations: { merchant_houses: 40 }
    },
    starting_resources: { credits: 3000, influence: 10 },
    trait: 'silver_tongue'
  },
  
  intelligence_operative: {
    name: 'Intelligence Operative',
    description: 'Former Agentes in Rebus agent skilled in espionage',
    icon: 'eye',
    bonuses: {
      espionage_skill: 3,
      hacking_skill: 1,
      starting_reputation: 0,
      faction_relations: { agentes_in_rebus: 30, scrinium_barbarorum: 15 }
    },
    starting_resources: { credits: 1200, intel: 30 },
    trait: 'shadow_operative'
  },
  
  varangian_exile: {
    name: 'Varangian Exile',
    description: 'Outcast warrior seeking honor and redemption',
    icon: 'shield',
    bonuses: {
      combat_skill: 3,
      starting_reputation: 5,
      faction_relations: { varangians: 20, praetorians: -10 }
    },
    starting_resources: { credits: 800, influence: 5 },
    trait: 'warriors_honor'
  },
  
  tech_savant: {
    name: 'Tech Savant',
    description: 'Brilliant engineer and hacker from the lower tiers',
    icon: 'cpu',
    bonuses: {
      hacking_skill: 2,
      engineering_skill: 2,
      starting_reputation: 0,
      faction_relations: { scrinium_barbarorum: 25 }
    },
    starting_resources: { credits: 1000, intel: 20 },
    trait: 'tech_genius'
  },
  
  noble_exile: {
    name: 'Fallen Noble',
    description: 'Disgraced noble family seeking to restore their name',
    icon: 'crown',
    bonuses: {
      negotiation_skill: 1,
      investigation_skill: 1,
      starting_reputation: 20,
      faction_relations: { ecclesiarchy: 10, merchant_houses: 10 }
    },
    starting_resources: { credits: 2000, influence: 20 },
    trait: 'noble_bearing'
  }
};

export const TRAITS = {
  tactical_mind: {
    name: 'Tactical Mind',
    description: 'Combat effectiveness +15%, military factions respect you more',
    effects: {
      combat_bonus: 0.15,
      faction_interaction_mod: { praetorians: 0.2, varangians: 0.15 }
    }
  },
  
  theological_insight: {
    name: 'Theological Insight',
    description: 'Ecclesiarchy missions reward +20%, diplomatic options with religious factions',
    effects: {
      ecclesiarchy_mission_bonus: 0.2,
      faction_interaction_mod: { ecclesiarchy: 0.25 }
    }
  },
  
  silver_tongue: {
    name: 'Silver Tongue',
    description: 'Negotiation success +20%, better trade prices',
    effects: {
      negotiation_bonus: 0.2,
      trade_price_mod: 0.9,
      faction_interaction_mod: { merchant_houses: 0.2 }
    }
  },
  
  shadow_operative: {
    name: 'Shadow Operative',
    description: 'Espionage success +25%, intelligence factions offer unique missions',
    effects: {
      espionage_bonus: 0.25,
      faction_interaction_mod: { agentes_in_rebus: 0.3, scrinium_barbarorum: 0.15 }
    }
  },
  
  warriors_honor: {
    name: "Warrior's Honor",
    description: 'Cannot flee from combat, +20% combat damage, Varangians highly respect you',
    effects: {
      combat_damage_bonus: 0.2,
      cannot_flee: true,
      faction_interaction_mod: { varangians: 0.35 }
    }
  },
  
  tech_genius: {
    name: 'Tech Genius',
    description: 'Hacking success +30%, unlock unique technology paths',
    effects: {
      hacking_bonus: 0.3,
      tech_tree_unlock: true,
      faction_interaction_mod: { scrinium_barbarorum: 0.25 }
    }
  },
  
  noble_bearing: {
    name: 'Noble Bearing',
    description: 'Start with higher reputation, better initial faction standing',
    effects: {
      reputation_bonus: 0.1,
      faction_interaction_mod: { ecclesiarchy: 0.15, merchant_houses: 0.15 }
    }
  }
};

export const COSMETIC_OPTIONS = {
  appearance: {
    portraits: [
      { id: 'imperial_officer', name: 'Imperial Officer', tier: 'chrysopolis' },
      { id: 'tech_adept', name: 'Tech Adept', tier: 'mese' },
      { id: 'street_operative', name: 'Street Operative', tier: 'cisterns' },
      { id: 'ecclesiarch', name: 'Ecclesiarch', tier: 'chrysopolis' },
      { id: 'merchant_lord', name: 'Merchant Lord', tier: 'mese' },
      { id: 'varangian_warrior', name: 'Varangian Warrior', tier: 'any' }
    ],
    
    colors: [
      { id: 'imperial_gold', name: 'Imperial Gold', hex: '#d4af37' },
      { id: 'royal_purple', name: 'Royal Purple', hex: '#8b5cf6' },
      { id: 'crimson_red', name: 'Crimson Red', hex: '#dc2626' },
      { id: 'oceanic_cyan', name: 'Oceanic Cyan', hex: '#06b6d4' },
      { id: 'forest_green', name: 'Forest Green', hex: '#059669' },
      { id: 'midnight_blue', name: 'Midnight Blue', hex: '#1e40af' }
    ],
    
    sigils: [
      { id: 'eagle', name: 'Imperial Eagle', description: 'Symbol of imperial authority' },
      { id: 'star', name: 'Seven-Pointed Star', description: 'Logos divine symbol' },
      { id: 'sword', name: 'Crossed Swords', description: 'Military heritage' },
      { id: 'coin', name: 'Golden Coin', description: 'Merchant wealth' },
      { id: 'eye', name: 'All-Seeing Eye', description: 'Intelligence network' },
      { id: 'crown', name: 'Ancient Crown', description: 'Noble lineage' }
    ]
  },
  
  dynasty_motto: [
    'Honor Above All',
    'Knowledge is Power',
    'Fortune Favors the Bold',
    'In Shadows We Thrive',
    'Unity Through Strength',
    'Eternal Vigilance',
    'From Ashes, Glory'
  ]
};

export const STARTING_TIER_OPTIONS = {
  chrysopolis: {
    name: 'Chrysopolis',
    description: 'Elite upper tier - Start with high reputation but greater expectations',
    modifiers: {
      starting_reputation: 60,
      starting_credits: 2000,
      starting_influence: 20,
      faction_scrutiny: 'high'
    },
    requirements: 'Start with enemies among lower tier factions'
  },
  
  mese: {
    name: 'Mese',
    description: 'Middle tier - Balanced start with opportunities in all directions',
    modifiers: {
      starting_reputation: 50,
      starting_credits: 1000,
      starting_influence: 10,
      faction_scrutiny: 'medium'
    },
    requirements: 'Standard difficulty'
  },
  
  cisterns: {
    name: 'Cisterns',
    description: 'Lower tier - Harder start but greater freedom and hidden opportunities',
    modifiers: {
      starting_reputation: 30,
      starting_credits: 500,
      starting_influence: 5,
      faction_scrutiny: 'low'
    },
    requirements: 'More challenging but factions underestimate you'
  }
};

// Generate player profile for faction AI
export function generatePlayerProfile(customization) {
  const background = BACKGROUNDS[customization.background];
  const trait = TRAITS[background?.trait];
  
  return {
    background: customization.background,
    trait: background?.trait,
    interaction_modifiers: trait?.effects.faction_interaction_mod || {},
    reputation_bonus: trait?.effects.reputation_bonus || 0,
    special_abilities: {
      cannot_flee: trait?.effects.cannot_flee || false,
      tech_tree_unlock: trait?.effects.tech_tree_unlock || false,
      ecclesiarchy_mission_bonus: trait?.effects.ecclesiarchy_mission_bonus || 0,
      negotiation_bonus: trait?.effects.negotiation_bonus || 0,
      espionage_bonus: trait?.effects.espionage_bonus || 0,
      hacking_bonus: trait?.effects.hacking_bonus || 0,
      combat_bonus: trait?.effects.combat_bonus || 0,
      combat_damage_bonus: trait?.effects.combat_damage_bonus || 0
    },
    cosmetics: {
      portrait: customization.portrait,
      color: customization.color,
      sigil: customization.sigil,
      motto: customization.motto
    }
  };
}