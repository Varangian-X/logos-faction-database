// Dynamic World Events System - Random events with companion participation and world-state impacts

// Random event pool - triggered during turn progression
export const randomWorldEvents = {
  faction_skirmish_praetorians_varangians: {
    id: 'faction_skirmish_praetorians_varangians',
    name: 'Skirmish in the Lower Districts',
    type: 'faction_conflict',
    description: 'Neo-Praetorian guards clash with Varangian mercenaries in a brutal street fight. Stray plasma fire lights up the smog. Civilians scatter. You could intervene... or profit from the chaos.',
    duration: 0, // instant resolution
    factions_involved: ['praetorians', 'varangians'],
    trigger_chance: 0.15,
    trigger_conditions: {
      min_turn: 5,
      faction_tension: -30 // triggers when factions are hostile
    },
    companion_roles: {
      // Companions can have unique approaches
      available_roles: ['mediator', 'join_praetorians', 'join_varangians', 'loot_chaos', 'protect_civilians']
    },
    choices: [
      {
        text: 'Aid the Praetorians - maintain order',
        faction_impact: { praetorians: 20, varangians: -15 },
        companion_reactions: {
          favorable_factions: ['praetorians'],
          opposed_factions: ['varangians']
        },
        rewards: { reputation: 10, influence: 5 }
      },
      {
        text: 'Aid the Varangians - honor their warrior code',
        faction_impact: { varangians: 20, praetorians: -15 },
        companion_reactions: {
          favorable_factions: ['varangians'],
          opposed_factions: ['praetorians']
        },
        rewards: { credits: 300, reputation: -5 }
      },
      {
        text: 'Mediate the conflict - prevent bloodshed',
        faction_impact: { praetorians: 10, varangians: 10 },
        required_trait: 'reach',
        required_value: 5,
        companion_reactions: {
          moral_alignments: ['compassionate', 'idealist']
        },
        rewards: { reputation: 15, influence: 10 }
      },
      {
        text: 'Loot the chaos - profit from their distraction',
        faction_impact: { praetorians: -10, varangians: -10 },
        companion_reactions: {
          moral_alignments: ['ruthless', 'pragmatic']
        },
        rewards: { credits: 500, intel: 10 }
      },
      {
        text: 'Protect civilians and evacuate',
        faction_impact: { merchant_houses: 10 },
        companion_reactions: {
          moral_alignments: ['compassionate', 'idealist']
        },
        rewards: { reputation: 20 }
      }
    ]
  },

  distress_call_merchant_convoy: {
    id: 'distress_call_merchant_convoy',
    name: 'Merchant Convoy Under Attack',
    type: 'rescue_mission',
    description: 'Emergency broadcast: "This is Merchant Convoy Theta-7, we are under attack by raiders! Hull breach imminent! Requesting immediate assistance!" The signal cuts to static.',
    duration: 0,
    factions_involved: ['merchant_houses'],
    trigger_chance: 0.12,
    trigger_conditions: {
      min_turn: 3,
      location_types: ['trade_route', 'merchant_sector']
    },
    companion_roles: {
      available_roles: ['tactical_support', 'medical_aid', 'negotiate_raiders', 'combat_lead']
    },
    choices: [
      {
        text: 'Rush to their aid - fight off the raiders',
        triggers_combat: true,
        enemy_type: 'huscarl_breacher',
        faction_impact: { merchant_houses: 25 },
        companion_reactions: {
          favorable_factions: ['merchant_houses'],
          moral_alignments: ['compassionate', 'idealist']
        },
        rewards: { credits: 400, reputation: 15, merchant_houses: 25 }
      },
      {
        text: 'Negotiate with raiders - buy them off',
        faction_impact: { merchant_houses: 15 },
        cost: { credits: 300 },
        companion_reactions: {
          moral_alignments: ['pragmatic']
        },
        rewards: { reputation: 5, intel: 15 }
      },
      {
        text: 'Ignore the distress call - not your problem',
        faction_impact: { merchant_houses: -20 },
        companion_reactions: {
          moral_alignments: ['ruthless'],
          opposed_alignments: ['compassionate', 'idealist']
        },
        rewards: {}
      },
      {
        text: 'Join the raiders - profit from the spoils',
        faction_impact: { merchant_houses: -40 },
        companion_reactions: {
          moral_alignments: ['ruthless'],
          opposed_alignments: ['compassionate', 'idealist']
        },
        rewards: { credits: 600, reputation: -20 }
      }
    ]
  },

  ecclesiarchy_purge: {
    id: 'ecclesiarchy_purge',
    name: 'Data-Heresy Purge',
    type: 'faction_enforcement',
    description: 'Algorithm Paladins sweep through the district, purging "corrupted data streams." They scan everyone. Your neural implants flicker warnings. They\'re coming for you next.',
    duration: 0,
    factions_involved: ['ecclesiarchy'],
    trigger_chance: 0.10,
    trigger_conditions: {
      min_turn: 8,
      faction_standing: { ecclesiarchy: -30 } // triggers when hostile with Ecclesiarchy
    },
    companion_roles: {
      available_roles: ['fake_compliance', 'resist_purge', 'hide_player', 'theological_debate']
    },
    choices: [
      {
        text: 'Submit to scanning - you have nothing to hide',
        faction_impact: { ecclesiarchy: 15 },
        companion_reactions: {
          favorable_factions: ['ecclesiarchy'],
          opposed_factions: ['scrinium_barbarorum', 'agentes_in_rebus']
        },
        rewards: { reputation: 5 }
      },
      {
        text: 'Resist the purge - fight for freedom',
        triggers_combat: true,
        enemy_type: 'algorithm_paladin',
        faction_impact: { ecclesiarchy: -40 },
        companion_reactions: {
          opposed_factions: ['ecclesiarchy'],
          moral_alignments: ['idealist']
        },
        rewards: { reputation: 10 }
      },
      {
        text: 'Bribe the Paladins - corruption exists everywhere',
        faction_impact: { ecclesiarchy: -10 },
        cost: { credits: 400 },
        companion_reactions: {
          moral_alignments: ['pragmatic', 'ruthless']
        },
        rewards: { intel: 20 }
      },
      {
        text: 'Theological debate - challenge their doctrine',
        faction_impact: { ecclesiarchy: 10 },
        required_trait: 'insight',
        required_value: 6,
        companion_reactions: {
          moral_alignments: ['idealist']
        },
        rewards: { reputation: 15, influence: 10 }
      }
    ]
  },

  agentes_recruitment: {
    id: 'agentes_recruitment',
    name: 'Shadow Recruitment',
    type: 'opportunity',
    description: 'A Cipher-Ghost materializes beside you. "The Agentes In Rebus has been watching. Your skills are... noticed. We have a proposition." They offer a data-slate with coordinates.',
    duration: 0,
    factions_involved: ['agentes_in_rebus'],
    trigger_chance: 0.08,
    trigger_conditions: {
      min_turn: 10,
      min_skill: { espionage: 3, investigation: 3 }
    },
    companion_roles: {
      available_roles: ['vouch_for_player', 'warn_against', 'spy_network', 'infiltrate_agentes']
    },
    choices: [
      {
        text: 'Accept their offer - join the shadow network',
        faction_impact: { agentes_in_rebus: 40 },
        companion_reactions: {
          favorable_factions: ['agentes_in_rebus'],
          moral_alignments: ['pragmatic', 'ruthless']
        },
        rewards: { intel: 50, reputation: -10, influence: 15 },
        unlocks_missions: ['agentes_operative_path']
      },
      {
        text: 'Decline politely - maintain independence',
        faction_impact: { agentes_in_rebus: -5 },
        rewards: {}
      },
      {
        text: 'Report them to Praetorians - uphold law',
        faction_impact: { agentes_in_rebus: -50, praetorians: 30 },
        companion_reactions: {
          favorable_factions: ['praetorians'],
          opposed_factions: ['agentes_in_rebus']
        },
        rewards: { reputation: 20, credits: 300 }
      }
    ]
  },

  companion_endangered: {
    id: 'companion_endangered',
    name: 'Companion In Danger',
    type: 'companion_crisis',
    description: 'Emergency transmission from {companion_name}: "I\'ve been compromised. They know who I am. I need extraction - NOW!" The line cuts. You can trace the signal.',
    duration: 0,
    trigger_chance: 0.05,
    trigger_conditions: {
      min_turn: 12,
      companion_requirement: { min_recruited: 1, loyalty_threshold: 60 }
    },
    companion_specific: true, // randomly picks a recruited companion
    choices: [
      {
        text: 'Immediate extraction - save them at any cost',
        triggers_combat: true,
        companion_reactions: {
          massive_loyalty_boost: true
        },
        rewards: { loyalty_boost: 25, trust_boost: 20 }
      },
      {
        text: 'Negotiate their release - use your connections',
        faction_impact: { varies: true }, // depends on who captured them
        cost: { influence: 15, credits: 500 },
        rewards: { loyalty_boost: 15 }
      },
      {
        text: 'Leave them to their fate - too risky',
        companion_reactions: {
          massive_loyalty_loss: true,
          possible_desertion: true
        },
        rewards: { loyalty_loss: 50 }
      }
    ]
  },

  varangian_honor_duel: {
    id: 'varangian_honor_duel',
    name: 'Challenge of Honor',
    type: 'duel',
    description: 'A Huscarl blocks your path. "I have heard of your deeds. I challenge you to single combat - prove yourself worthy, or be shamed." The crowd gathers. Refusing would be... unwise.',
    duration: 0,
    factions_involved: ['varangians'],
    trigger_chance: 0.10,
    trigger_conditions: {
      min_turn: 7,
      min_reputation: 40
    },
    choices: [
      {
        text: 'Accept the duel - fight with honor',
        triggers_combat: true,
        enemy_type: 'huscarl_breacher',
        faction_impact: { varangians: 30 },
        companion_reactions: {
          favorable_factions: ['varangians'],
          moral_alignments: ['idealist']
        },
        rewards: { reputation: 25, varangians: 30 }
      },
      {
        text: 'Champion fights for you - send your companion',
        requires_companion: true,
        companion_combat: true,
        faction_impact: { varangians: 20 },
        rewards: { reputation: 15, companion_loyalty: 10 }
      },
      {
        text: 'Refuse and walk away - face the shame',
        faction_impact: { varangians: -40 },
        rewards: { reputation: -20 }
      },
      {
        text: 'Assassinate them before the duel',
        faction_impact: { varangians: -60 },
        companion_reactions: {
          moral_alignments: ['ruthless'],
          opposed_alignments: ['idealist', 'compassionate']
        },
        rewards: { reputation: -30, intel: 10 }
      }
    ]
  }
};

// Check if random event should trigger this turn
export function checkRandomEventTrigger(gameState, companions) {
  if (!gameState || !companions) return null;
  
  const events = Object.values(randomWorldEvents);
  const eligibleEvents = events.filter(event => {
    const conditions = event.trigger_conditions || {};
    
    // Check basic trigger conditions
    if (conditions.min_turn && gameState.turn_number < conditions.min_turn) {
      return false;
    }
    
    // Check faction tension
    if (conditions.faction_tension) {
      const factions = event.factions_involved || [];
      const hasHostility = factions.some(faction => 
        (gameState.faction_relations?.[faction] || 0) <= conditions.faction_tension
      );
      if (!hasHostility) return false;
    }
    
    // Check faction standing
    if (conditions.faction_standing) {
      const meetsStanding = Object.entries(conditions.faction_standing).every(
        ([faction, threshold]) => (gameState.faction_relations?.[faction] || 0) <= threshold
      );
      if (!meetsStanding) return false;
    }
    
    // Check skill requirements
    if (conditions.min_skill) {
      const meetsSkills = Object.entries(conditions.min_skill).every(
        ([skill, level]) => (gameState.skills?.[skill]?.level || 0) >= level
      );
      if (!meetsSkills) return false;
    }
    
    // Check companion requirements
    if (conditions.companion_requirement) {
      const recruited = companions.filter(c => c.is_recruited).length;
      const highLoyalty = companions.filter(c => 
        c.is_recruited && c.loyalty >= (conditions.companion_requirement.loyalty_threshold || 60)
      ).length;
      
      if (recruited < (conditions.companion_requirement.min_recruited || 0)) return false;
      if (highLoyalty === 0 && event.companion_specific) return false;
    }
    
    return true;
  });
  
  // Roll for random trigger
  for (const event of eligibleEvents) {
    if (Math.random() < event.trigger_chance) {
      // For companion-specific events, pick a random high-loyalty companion
      if (event.companion_specific) {
        const highLoyaltyCompanions = companions.filter(c => 
          c.is_recruited && c.loyalty >= 60
        );
        if (highLoyaltyCompanions.length > 0) {
          const selected = highLoyaltyCompanions[Math.floor(Math.random() * highLoyaltyCompanions.length)];
          return {
            ...event,
            selected_companion: selected,
            description: event.description.replace('{companion_name}', selected.name)
          };
        }
      }
      
      return event;
    }
  }
  
  return null;
}

// Get companion's reaction and role in event
export function getCompanionEventRole(companion, event) {
  const availableRoles = event.companion_roles?.available_roles || [];
  
  // Determine best role based on companion's faction and alignment
  let recommendedRole = null;
  
  if (availableRoles.includes('mediator') && companion.choice_preferences?.moral_alignment === 'compassionate') {
    recommendedRole = 'mediator';
  } else if (availableRoles.includes('combat_lead') && companion.combat_role) {
    recommendedRole = 'combat_lead';
  } else if (availableRoles.includes('negotiate_raiders') && companion.choice_preferences?.moral_alignment === 'pragmatic') {
    recommendedRole = 'negotiate_raiders';
  }
  
  return {
    available: availableRoles,
    recommended: recommendedRole,
    can_participate: companion.is_recruited && companion.loyalty >= 40
  };
}

// Apply companion participation bonuses to event outcome
export function applyCompanionEventBonus(choice, companion, role) {
  const bonuses = {
    loyalty_change: 0,
    trust_change: 0,
    effectiveness_multiplier: 1.0,
    additional_rewards: {}
  };
  
  // Check if companion approves of choice
  const reactions = choice.companion_reactions || {};
  
  // Faction alignment bonus
  if (reactions.favorable_factions?.includes(companion.faction_affiliation)) {
    bonuses.loyalty_change += 8;
    bonuses.effectiveness_multiplier += 0.2;
  } else if (reactions.opposed_factions?.includes(companion.faction_affiliation)) {
    bonuses.loyalty_change -= 10;
  }
  
  // Moral alignment bonus
  if (reactions.moral_alignments?.includes(companion.choice_preferences?.moral_alignment)) {
    bonuses.loyalty_change += 10;
    bonuses.trust_change += 5;
    bonuses.effectiveness_multiplier += 0.15;
  } else if (reactions.opposed_alignments?.includes(companion.choice_preferences?.moral_alignment)) {
    bonuses.loyalty_change -= 12;
    bonuses.trust_change -= 5;
  }
  
  // Role-specific bonuses
  if (role) {
    bonuses.trust_change += 3;
    bonuses.additional_rewards.influence = 5;
  }
  
  // Massive reactions for special events
  if (reactions.massive_loyalty_boost) {
    bonuses.loyalty_change = 25;
    bonuses.trust_change = 20;
  } else if (reactions.massive_loyalty_loss) {
    bonuses.loyalty_change = -50;
    bonuses.trust_change = -30;
  }
  
  return bonuses;
}