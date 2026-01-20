// Skill Mastery and Perk System
// Players unlock perks at mastery milestones

export const masteryThresholds = [
  { level: 3, name: 'Apprentice', color: 'gray' },
  { level: 5, name: 'Adept', color: 'cyan' },
  { level: 7, name: 'Expert', color: 'purple' },
  { level: 9, name: 'Master', color: 'amber' },
  { level: 10, name: 'Grandmaster', color: 'red' }
];

export const skillPerks = {
  combat: {
    tier1: [
      {
        id: 'combat_rush',
        name: 'Combat Rush',
        description: 'Gain +15% damage on consecutive attacks in same combat',
        requirements: { level: 3 },
        effects: { consecutive_damage_bonus: 15 },
        passive: true
      },
      {
        id: 'resilient_fighter',
        name: 'Resilient Fighter',
        description: 'Reduce all incoming damage by 10%',
        requirements: { level: 3 },
        effects: { damage_reduction: 10 },
        passive: true
      }
    ],
    tier2: [
      {
        id: 'weapon_specialist',
        name: 'Weapon Specialist',
        description: 'Critical hits deal 50% more damage',
        requirements: { level: 5 },
        effects: { critical_damage_multiplier: 1.5 },
        passive: true
      },
      {
        id: 'tactical_advantage',
        name: 'Tactical Advantage',
        description: '+20% accuracy and can see enemy weaknesses',
        requirements: { level: 5 },
        effects: { accuracy_bonus: 20, reveal_weaknesses: true },
        passive: true
      },
      {
        id: 'second_wind',
        name: 'Second Wind',
        description: 'Heal 30 HP when below 30% health (once per combat)',
        requirements: { level: 5 },
        effects: { emergency_heal: 30 },
        active: true
      }
    ],
    tier3: [
      {
        id: 'battle_master',
        name: 'Battle Master',
        description: '+30% damage, +15% accuracy, companions gain +10% damage',
        requirements: { level: 7 },
        effects: { damage_bonus: 30, accuracy_bonus: 15, companion_damage_buff: 10 },
        passive: true
      },
      {
        id: 'unstoppable',
        name: 'Unstoppable',
        description: 'Cannot be stunned or knocked down, resist all debuffs',
        requirements: { level: 7 },
        effects: { debuff_immunity: true, knockdown_immunity: true },
        passive: true
      }
    ],
    tier4: [
      {
        id: 'legendary_warrior',
        name: 'Legendary Warrior',
        description: '+50% damage, double XP from combat, intimidate enemies',
        requirements: { level: 10 },
        effects: { damage_bonus: 50, combat_xp_multiplier: 2, intimidation: true },
        passive: true,
        ultimate: true
      }
    ]
  },
  
  negotiation: {
    tier1: [
      {
        id: 'silver_tongue',
        name: 'Silver Tongue',
        description: '+15% success on all persuasion attempts',
        requirements: { level: 3 },
        effects: { persuasion_bonus: 15 },
        passive: true
      },
      {
        id: 'read_emotions',
        name: 'Read Emotions',
        description: 'See NPC relationship values and emotional state',
        requirements: { level: 3 },
        effects: { reveal_npc_emotions: true },
        passive: true
      }
    ],
    tier2: [
      {
        id: 'master_negotiator',
        name: 'Master Negotiator',
        description: '+25% better prices, unlock unique dialogue options',
        requirements: { level: 5 },
        effects: { price_reduction: 25, unlock_special_dialogue: true },
        passive: true
      },
      {
        id: 'faction_diplomat',
        name: 'Faction Diplomat',
        description: 'Faction reputation changes 30% more effective',
        requirements: { level: 5 },
        effects: { faction_gain_multiplier: 1.3 },
        passive: true
      },
      {
        id: 'de_escalate',
        name: 'De-escalate',
        description: 'Can talk your way out of combat encounters',
        requirements: { level: 5 },
        effects: { combat_avoidance: true },
        active: true
      }
    ],
    tier3: [
      {
        id: 'political_mastermind',
        name: 'Political Mastermind',
        description: '+50% influence gain, see hidden event outcomes',
        requirements: { level: 7 },
        effects: { influence_multiplier: 1.5, reveal_outcomes: true },
        passive: true
      },
      {
        id: 'unifier',
        name: 'Unifier',
        description: 'Rival factions lose 50% less standing when you help one',
        requirements: { level: 7 },
        effects: { rival_penalty_reduction: 0.5 },
        passive: true
      }
    ],
    tier4: [
      {
        id: 'voice_of_empire',
        name: 'Voice of the Empire',
        description: 'Can mediate any conflict, +100% influence, auto-pass negotiation checks',
        requirements: { level: 10 },
        effects: { mediation_unlock: true, influence_multiplier: 2, auto_success: true },
        passive: true,
        ultimate: true
      }
    ]
  },
  
  hacking: {
    tier1: [
      {
        id: 'code_breaker',
        name: 'Code Breaker',
        description: '+20% success on hacking attempts',
        requirements: { level: 3 },
        effects: { hacking_bonus: 20 },
        passive: true
      },
      {
        id: 'data_miner',
        name: 'Data Miner',
        description: 'Gain +10 intel from successful hacks',
        requirements: { level: 3 },
        effects: { intel_bonus: 10 },
        passive: true
      }
    ],
    tier2: [
      {
        id: 'system_override',
        name: 'System Override',
        description: 'Can disable enemy augmentations in combat',
        requirements: { level: 5 },
        effects: { disable_augmentations: true },
        active: true
      },
      {
        id: 'ghost_protocol',
        name: 'Ghost Protocol',
        description: 'Leave no trace when hacking, -30% detection chance',
        requirements: { level: 5 },
        effects: { stealth_bonus: 30 },
        passive: true
      },
      {
        id: 'data_fortress',
        name: 'Data Fortress',
        description: 'Immune to enemy hacking attempts',
        requirements: { level: 5 },
        effects: { hack_immunity: true },
        passive: true
      }
    ],
    tier3: [
      {
        id: 'neural_jack',
        name: 'Neural Jack',
        description: 'Access restricted systems, +50 intel per turn in high-tech areas',
        requirements: { level: 7 },
        effects: { restricted_access: true, passive_intel: 50 },
        passive: true
      },
      {
        id: 'ai_whisperer',
        name: 'AI Whisperer',
        description: 'Control automated defenses, turn security bots to your side',
        requirements: { level: 7 },
        effects: { control_bots: true },
        passive: true
      }
    ],
    tier4: [
      {
        id: 'digital_god',
        name: 'Digital God',
        description: 'Control all digital systems, see all information, auto-succeed hacks',
        requirements: { level: 10 },
        effects: { omniscience: true, auto_success: true, system_control: true },
        passive: true,
        ultimate: true
      }
    ]
  },
  
  investigation: {
    tier1: [
      {
        id: 'keen_eye',
        name: 'Keen Eye',
        description: 'Discover hidden clues others miss',
        requirements: { level: 3 },
        effects: { hidden_clue_chance: 30 },
        passive: true
      },
      {
        id: 'pattern_recognition',
        name: 'Pattern Recognition',
        description: '+15% XP from all investigation actions',
        requirements: { level: 3 },
        effects: { investigation_xp_bonus: 15 },
        passive: true
      }
    ],
    tier2: [
      {
        id: 'crime_scene_analysis',
        name: 'Crime Scene Analysis',
        description: 'Automatically succeed on investigation checks',
        requirements: { level: 5 },
        effects: { auto_success_investigation: true },
        passive: true
      },
      {
        id: 'conspiracy_theorist',
        name: 'Conspiracy Theorist',
        description: 'See connections between events, unlock hidden quests',
        requirements: { level: 5 },
        effects: { reveal_connections: true, unlock_hidden_quests: true },
        passive: true
      },
      {
        id: 'forensic_mind',
        name: 'Forensic Mind',
        description: '+40 intel when discovering lore entries',
        requirements: { level: 5 },
        effects: { lore_intel_bonus: 40 },
        passive: true
      }
    ],
    tier3: [
      {
        id: 'master_detective',
        name: 'Master Detective',
        description: 'See NPC goals and motivations, predict events',
        requirements: { level: 7 },
        effects: { reveal_npc_goals: true, event_prediction: true },
        passive: true
      },
      {
        id: 'truth_seeker',
        name: 'Truth Seeker',
        description: 'NPCs cannot lie to you, see through deception',
        requirements: { level: 7 },
        effects: { lie_detection: true },
        passive: true
      }
    ],
    tier4: [
      {
        id: 'omniscient_mind',
        name: 'Omniscient Mind',
        description: 'See all hidden information, predict all outcomes, +200 intel',
        requirements: { level: 10 },
        effects: { total_knowledge: true, intel_gain: 200 },
        passive: true,
        ultimate: true
      }
    ]
  },
  
  espionage: {
    tier1: [
      {
        id: 'shadow_walker',
        name: 'Shadow Walker',
        description: '+20% success on stealth operations',
        requirements: { level: 3 },
        effects: { stealth_bonus: 20 },
        passive: true
      },
      {
        id: 'infiltrator',
        name: 'Infiltrator',
        description: 'Access restricted areas without detection',
        requirements: { level: 3 },
        effects: { infiltration_bonus: true },
        passive: true
      }
    ],
    tier2: [
      {
        id: 'master_spy',
        name: 'Master Spy',
        description: 'Can impersonate faction members',
        requirements: { level: 5 },
        effects: { impersonation: true },
        active: true
      },
      {
        id: 'double_agent',
        name: 'Double Agent',
        description: 'Gain rewards from multiple factions simultaneously',
        requirements: { level: 5 },
        effects: { double_rewards: true },
        passive: true
      },
      {
        id: 'saboteur',
        name: 'Saboteur',
        description: 'Sabotage actions 40% more effective',
        requirements: { level: 5 },
        effects: { sabotage_effectiveness: 1.4 },
        passive: true
      }
    ],
    tier3: [
      {
        id: 'spymaster',
        name: 'Spymaster',
        description: 'Plant agents in factions to gather intel automatically',
        requirements: { level: 7 },
        effects: { passive_intel_network: 30 },
        passive: true
      },
      {
        id: 'invisible_hand',
        name: 'Invisible Hand',
        description: 'Actions leave no evidence, cannot be traced',
        requirements: { level: 7 },
        effects: { untraceable: true },
        passive: true
      }
    ],
    tier4: [
      {
        id: 'shadow_emperor',
        name: 'Shadow Emperor',
        description: 'Control events from shadows, +100% sabotage, immune to betrayal',
        requirements: { level: 10 },
        effects: { shadow_control: true, sabotage_multiplier: 2, betrayal_immunity: true },
        passive: true,
        ultimate: true
      }
    ]
  },
  
  engineering: {
    tier1: [
      {
        id: 'tech_savant',
        name: 'Tech Savant',
        description: 'Augmentations cost 20% less',
        requirements: { level: 3 },
        effects: { augmentation_discount: 20 },
        passive: true
      },
      {
        id: 'improviser',
        name: 'Improviser',
        description: 'Can craft basic items from scrap',
        requirements: { level: 3 },
        effects: { crafting_unlock: true },
        passive: true
      }
    ],
    tier2: [
      {
        id: 'combat_engineer',
        name: 'Combat Engineer',
        description: 'Deploy defensive turrets in combat',
        requirements: { level: 5 },
        effects: { deploy_turret: true },
        active: true
      },
      {
        id: 'augmentation_expert',
        name: 'Augmentation Expert',
        description: 'Augmentations 30% more effective',
        requirements: { level: 5 },
        effects: { augmentation_bonus: 1.3 },
        passive: true
      },
      {
        id: 'shield_generator',
        name: 'Shield Generator',
        description: 'Start combat with 50 shield points',
        requirements: { level: 5 },
        effects: { starting_shield: 50 },
        passive: true
      }
    ],
    tier3: [
      {
        id: 'master_craftsman',
        name: 'Master Craftsman',
        description: 'Craft advanced equipment and augmentations',
        requirements: { level: 7 },
        effects: { advanced_crafting: true },
        passive: true
      },
      {
        id: 'tech_lord',
        name: 'Tech Lord',
        description: 'All augmentations active simultaneously, no limits',
        requirements: { level: 7 },
        effects: { unlimited_augmentations: true },
        passive: true
      }
    ],
    tier4: [
      {
        id: 'archmagos',
        name: 'Archmagos',
        description: 'Become one with technology, +100% to all tech-based actions',
        requirements: { level: 10 },
        effects: { tech_mastery: true, tech_multiplier: 2 },
        passive: true,
        ultimate: true
      }
    ]
  }
};

// Get available perks for a skill at current level
export function getAvailablePerks(skillName, currentLevel, selectedPerks = []) {
  const skillPerkTree = skillPerks[skillName];
  if (!skillPerkTree) return [];
  
  const available = [];
  
  Object.entries(skillPerkTree).forEach(([tier, perks]) => {
    perks.forEach(perk => {
      if (currentLevel >= perk.requirements.level && !selectedPerks.includes(perk.id)) {
        available.push({ ...perk, tier });
      }
    });
  });
  
  return available;
}

// Calculate total perk bonuses
export function calculatePerkBonuses(selectedPerks) {
  const bonuses = {
    damage_bonus: 0,
    accuracy_bonus: 0,
    damage_reduction: 0,
    influence_multiplier: 1,
    intel_bonus: 0,
    // ... all other bonuses
  };
  
  selectedPerks.forEach(perkId => {
    // Find the perk in all skill trees
    Object.values(skillPerks).forEach(skillTree => {
      Object.values(skillTree).forEach(tierPerks => {
        const perk = tierPerks.find(p => p.id === perkId);
        if (perk && perk.effects) {
          Object.entries(perk.effects).forEach(([key, value]) => {
            if (typeof value === 'number') {
              if (key.includes('multiplier')) {
                bonuses[key] = (bonuses[key] || 1) * value;
              } else {
                bonuses[key] = (bonuses[key] || 0) + value;
              }
            } else {
              bonuses[key] = value;
            }
          });
        }
      });
    });
  });
  
  return bonuses;
}

// Get mastery rank for skill level
export function getMasteryRank(level) {
  for (let i = masteryThresholds.length - 1; i >= 0; i--) {
    if (level >= masteryThresholds[i].level) {
      return masteryThresholds[i];
    }
  }
  return { level: 0, name: 'Novice', color: 'gray' };
}