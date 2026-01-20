// Multi-stage complex world events with cascading effects

export const complexEvents = {
  resource_crisis: {
    id: 'resource_crisis',
    name: 'Resource Crisis',
    description: 'A critical shortage threatens the Imperium',
    total_stages: 4,
    stages: [
      {
        stage: 0,
        name: 'Initial Shortage',
        description: 'Reports emerge of dwindling supply chains',
        duration: 3,
        effects: {
          market: {
            target_resource: 'plasma_cores',
            price_multiplier: 1.5,
            supply_reduction: 0.4
          },
          factions: {
            tension_increase: 10
          }
        }
      },
      {
        stage: 1,
        name: 'Price Surge',
        description: 'Markets destabilize as prices skyrocket',
        duration: 4,
        effects: {
          market: {
            target_resource: 'plasma_cores',
            price_multiplier: 2.5,
            supply_reduction: 0.6,
            stability_loss: 20
          },
          factions: {
            merchant_houses: { power_gain: 15, relationship_penalty: -10 },
            ecclesiarchy: { issue_demand: 'provide_resources' }
          },
          companions: {
            trigger_reactions: true
          }
        }
      },
      {
        stage: 2,
        name: 'Faction Demands',
        description: 'Factions demand action to resolve the crisis',
        duration: 5,
        effects: {
          quest: {
            generate: true,
            title: 'Resolve the Resource Crisis',
            description: 'Find a way to restore supply chains or face Imperial collapse',
            objectives: [
              { type: 'acquire', resource: 'plasma_cores', amount: 50 },
              { type: 'negotiate', faction: 'merchant_houses' },
              { type: 'investigate', location: 'mining_station_alpha' }
            ]
          },
          factions: {
            all: { tension_increase: 20 }
          }
        }
      },
      {
        stage: 3,
        name: 'Critical Point',
        description: 'The Imperium teeters on the brink',
        duration: 3,
        effects: {
          market: {
            target_resource: 'plasma_cores',
            price_multiplier: 3.0,
            global_instability: 40
          },
          factions: {
            trigger_wars: 0.6,
            faction_actions: ['military', 'economic_sabotage']
          },
          companions: {
            loyalty_tests: true,
            forced_choices: true
          }
        },
        failure_condition: {
          trigger: 'quest_not_completed',
          consequence: 'imperial_collapse'
        }
      }
    ]
  },
  
  faction_power_struggle: {
    id: 'faction_power_struggle',
    name: 'Power Struggle',
    description: 'Two factions vie for Imperial dominance',
    total_stages: 3,
    requires_factions: 2,
    stages: [
      {
        stage: 0,
        name: 'Rising Tensions',
        description: 'Diplomatic relations deteriorate rapidly',
        duration: 3,
        effects: {
          factions: {
            selected_two: {
              relationship_to_each: -30,
              military_buildup: true
            }
          },
          companions: {
            faction_aligned_react: true
          }
        }
      },
      {
        stage: 1,
        name: 'Proxy Conflicts',
        description: 'Small skirmishes erupt across the sector',
        duration: 4,
        effects: {
          factions: {
            selected_two: {
              power_damage: 10,
              active_operations: 'military'
            }
          },
          market: {
            weapons: { demand_increase: 1.4 },
            armor_plating: { demand_increase: 1.3 }
          },
          quest: {
            generate: true,
            title: 'Choose Your Side',
            description: 'The power struggle demands you pick an allegiance',
            choice_based: true
          }
        }
      },
      {
        stage: 2,
        name: 'Open Warfare',
        description: 'Full-scale conflict engulfs the Imperium',
        duration: 6,
        effects: {
          factions: {
            selected_two: {
              declare_war: true,
              recruit_allies: true
            }
          },
          market: {
            global_instability: 30,
            all_military_resources: { price_increase: 1.6 }
          },
          companions: {
            forced_allegiance_choices: true,
            relationship_impacts: 'severe'
          },
          world: {
            unlock_locations: ['war_zones', 'contested_territories']
          }
        }
      }
    ]
  },
  
  technological_revolution: {
    id: 'technological_revolution',
    name: 'Technological Revolution',
    description: 'A breakthrough reshapes Imperial society',
    total_stages: 3,
    stages: [
      {
        stage: 0,
        name: 'Discovery',
        description: 'Ancient technology is unearthed',
        duration: 2,
        effects: {
          market: {
            imperial_schematics: { demand_increase: 1.8 },
            quantum_processors: { demand_increase: 1.5 }
          },
          factions: {
            scrinium_barbarorum: { power_gain: 10 },
            ecclesiarchy: { tension_increase: 15, issue_warning: true }
          }
        }
      },
      {
        stage: 1,
        name: 'Adoption Race',
        description: 'Factions race to exploit the new technology',
        duration: 4,
        effects: {
          factions: {
            all: { 
              research_operations: true,
              espionage_increase: true
            }
          },
          quest: {
            generate: true,
            title: 'Secure the Technology',
            description: 'Obtain the revolutionary technology before rivals do',
            rewards: {
              unique_augmentation: true,
              massive_credits: 10000
            }
          },
          companions: {
            tech_aligned_bonus: true
          }
        }
      },
      {
        stage: 2,
        name: 'New Paradigm',
        description: 'The technology fundamentally alters Imperial power',
        duration: 5,
        effects: {
          world: {
            permanent_change: 'tech_level_increase',
            unlock_features: ['advanced_augmentations', 'quantum_weapons']
          },
          factions: {
            power_redistribution: true,
            tech_faction_dominance: 20
          },
          market: {
            all_tech_resources: { base_price_increase: 1.3 }
          }
        }
      }
    ]
  },
  
  companion_betrayal: {
    id: 'companion_betrayal',
    name: 'Betrayal from Within',
    description: 'A trusted ally plots against you',
    total_stages: 3,
    requires_companion: true,
    stages: [
      {
        stage: 0,
        name: 'Seeds of Doubt',
        description: 'Strange behavior from a companion raises questions',
        duration: 2,
        effects: {
          companions: {
            select_low_loyalty: true,
            suspicious_behavior: true,
            warning_signs: ['secretive', 'evasive', 'hostile']
          }
        }
      },
      {
        stage: 1,
        name: 'Hidden Agenda',
        description: 'Evidence emerges of covert activities',
        duration: 3,
        effects: {
          companions: {
            selected_companion: {
              loyalty_drain: 20,
              reveal_faction_ties: true
            }
          },
          quest: {
            generate: true,
            title: 'Uncover the Truth',
            description: 'Investigate your companion before it\'s too late',
            investigation: true
          },
          factions: {
            affiliated_faction_revealed: true
          }
        }
      },
      {
        stage: 2,
        name: 'The Betrayal',
        description: 'Your companion makes their move',
        duration: 1,
        effects: {
          companions: {
            selected_companion: {
              betray: true,
              steal_resources: 0.2,
              reveal_secrets_to_faction: true,
              force_confrontation: true
            }
          },
          quest: {
            generate: true,
            title: 'Face the Betrayer',
            description: 'Confront your former ally',
            final_choice: ['forgive', 'eliminate', 'manipulate']
          }
        }
      }
    ]
  },
  
  economic_collapse: {
    id: 'economic_collapse',
    name: 'Economic Collapse',
    description: 'The Imperial economy crumbles',
    total_stages: 4,
    stages: [
      {
        stage: 0,
        name: 'Market Panic',
        description: 'Traders lose confidence in the markets',
        duration: 2,
        effects: {
          market: {
            global_instability: 25,
            all_resources: { volatility_increase: 0.3 }
          },
          factions: {
            merchant_houses: { power_loss: 15 }
          }
        }
      },
      {
        stage: 1,
        name: 'Credit Crunch',
        description: 'Currency becomes worthless',
        duration: 3,
        effects: {
          market: {
            all_resources: { price_multiplier: 2.0 },
            credit_devaluation: 0.5
          },
          factions: {
            all: { resources_decrease: 0.3 }
          },
          companions: {
            material_concerns: true
          }
        }
      },
      {
        stage: 2,
        name: 'Trade Wars',
        description: 'Factions fight for economic survival',
        duration: 4,
        effects: {
          factions: {
            merchant_houses: { aggressive_operations: true },
            all_others: { economic_warfare: true }
          },
          quest: {
            generate: true,
            title: 'Restore Economic Stability',
            description: 'Find a way to stabilize the crumbling economy',
            objectives: [
              { type: 'acquire', credits: 50000 },
              { type: 'unite_factions', min_count: 3 }
            ]
          }
        }
      },
      {
        stage: 3,
        name: 'New Order',
        description: 'A new economic system emerges from chaos',
        duration: 5,
        effects: {
          world: {
            permanent_change: 'economic_restructure',
            player_choice_determines_outcome: true
          },
          market: {
            reset_to_new_baseline: true,
            stability_restored: 60
          },
          factions: {
            power_redistribution_major: true
          }
        }
      }
    ]
  }
};

export const triggerComplexEvent = (eventId, gameState, factions, companions) => {
  const event = complexEvents[eventId];
  if (!event) return null;
  
  // Check requirements
  if (event.requires_factions && factions.length < event.requires_factions) {
    return null;
  }
  
  if (event.requires_companion && companions.filter(c => c.is_recruited).length === 0) {
    return null;
  }
  
  return {
    id: `${eventId}_${Date.now()}`,
    event_type: eventId,
    current_stage: 0,
    total_stages: event.total_stages,
    turns_in_stage: 0,
    initiated_turn: gameState.turn_number,
    stage_data: event.stages[0],
    selected_factions: event.requires_factions ? selectRandomFactions(factions, event.requires_factions) : null,
    selected_companion: event.requires_companion ? selectVulnerableCompanion(companions) : null
  };
};

const selectRandomFactions = (factions, count) => {
  const shuffled = [...factions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(f => f.faction_id);
};

const selectVulnerableCompanion = (companions) => {
  const recruited = companions.filter(c => c.is_recruited && c.loyalty < 60);
  if (recruited.length === 0) return null;
  return recruited[Math.floor(Math.random() * recruited.length)].id;
};

export const advanceComplexEvent = (activeEvent, gameState) => {
  const event = complexEvents[activeEvent.event_type];
  if (!event) return null;
  
  const currentStage = event.stages[activeEvent.current_stage];
  activeEvent.turns_in_stage++;
  
  // Check if stage should advance
  if (activeEvent.turns_in_stage >= currentStage.duration) {
    if (activeEvent.current_stage < event.total_stages - 1) {
      // Advance to next stage
      activeEvent.current_stage++;
      activeEvent.turns_in_stage = 0;
      activeEvent.stage_data = event.stages[activeEvent.current_stage];
      
      return {
        advanced: true,
        new_stage: activeEvent.current_stage,
        message: `${event.name} escalates: ${activeEvent.stage_data.name}`
      };
    } else {
      // Event completes
      return {
        completed: true,
        message: `${event.name} has concluded`
      };
    }
  }
  
  return { ongoing: true };
};

export const applyComplexEventEffects = (activeEvent, gameState, market, factions, companions) => {
  const stageData = activeEvent.stage_data;
  const effects = {
    market: {},
    factions: {},
    companions: {},
    quests: [],
    world: {},
    log: []
  };
  
  // Market effects
  if (stageData.effects.market) {
    const marketFx = stageData.effects.market;
    
    if (marketFx.target_resource && market.resources[marketFx.target_resource]) {
      const resource = market.resources[marketFx.target_resource];
      
      if (marketFx.price_multiplier) {
        resource.current_price = Math.floor(resource.current_price * marketFx.price_multiplier);
        effects.log.push(`📈 ${marketFx.target_resource} price surged!`);
      }
      
      if (marketFx.supply_reduction) {
        resource.supply *= (1 - marketFx.supply_reduction);
        effects.log.push(`📉 ${marketFx.target_resource} supply critically low`);
      }
      
      effects.market.updated = true;
    }
    
    if (marketFx.global_instability) {
      market.globalStability = Math.max(0, (market.globalStability || 75) - marketFx.global_instability);
      effects.log.push(`⚠️ Market instability rising`);
    }
    
    if (marketFx.stability_loss) {
      market.globalStability = Math.max(0, (market.globalStability || 75) - marketFx.stability_loss);
    }
  }
  
  // Faction effects
  if (stageData.effects.factions) {
    const factionFx = stageData.effects.factions;
    
    Object.keys(factionFx).forEach(key => {
      if (key === 'all') {
        effects.log.push(`🏛️ All factions affected by ${activeEvent.stage_data.name}`);
      } else if (key === 'selected_two' && activeEvent.selected_factions) {
        activeEvent.selected_factions.forEach(fId => {
          effects.log.push(`⚔️ ${fId} tensions escalating`);
        });
      } else {
        const fx = factionFx[key];
        if (fx.issue_demand) {
          effects.log.push(`📜 ${key} issues demands to the Imperium`);
        }
      }
    });
  }
  
  // Quest generation
  if (stageData.effects.quest?.generate) {
    const questFx = stageData.effects.quest;
    effects.quests.push({
      title: questFx.title,
      description: questFx.description,
      objectives: questFx.objectives || [],
      source_event: activeEvent.id,
      urgent: true
    });
    effects.log.push(`🎯 New quest: ${questFx.title}`);
  }
  
  // Companion effects
  if (stageData.effects.companions) {
    if (activeEvent.selected_companion) {
      effects.log.push(`👤 Companion behavior changing...`);
    }
  }
  
  return effects;
};