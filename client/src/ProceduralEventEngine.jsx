// Procedural Event Engine - Generates dynamic events based on game state
import { base44 } from '@/api/base44Client';

// Procedurally generate events based on current world state
export function generateProceduralEvent(gameState, worldState, factions, recentActions) {
  const generators = [
    generateFactionConflictEvent,
    generateEconomicEvent,
    generatePoliticalIntrigueEvent,
    generateTerritorialEvent,
    generatePlayerReputationEvent,
    generateCoalitionEvent,
    generateTechnologyEvent,
    generateCrisisEvent
  ];
  
  // Weight generators based on world state
  const weights = calculateGeneratorWeights(worldState, gameState, factions);
  const selectedGenerator = weightedRandom(generators, weights);
  
  return selectedGenerator(gameState, worldState, factions, recentActions);
}

function calculateGeneratorWeights(worldState, gameState, factions) {
  const stability = worldState?.world_stability || 75;
  const playerInfluence = worldState?.player_influence_score || 0;
  
  return {
    faction_conflict: stability < 50 ? 0.25 : 0.10,
    economic: worldState?.economic_state === 'recession' ? 0.20 : 0.15,
    political_intrigue: playerInfluence > 200 ? 0.20 : 0.10,
    territorial: stability < 40 ? 0.15 : 0.08,
    player_reputation: gameState.reputation > 60 || gameState.reputation < 30 ? 0.15 : 0.05,
    coalition: factions.filter(f => (f.alliances || []).length > 0).length > 2 ? 0.10 : 0.05,
    technology: 0.08,
    crisis: stability < 30 ? 0.25 : 0.02
  };
}

function weightedRandom(items, weights) {
  const weightArray = Object.values(weights);
  const total = weightArray.reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  
  for (let i = 0; i < items.length; i++) {
    random -= weightArray[i];
    if (random <= 0) return items[i];
  }
  
  return items[0];
}

// Faction Conflict Event Generator
function generateFactionConflictEvent(gameState, worldState, factions) {
  const rivalries = [];
  factions.forEach(faction => {
    (faction.rivalries || []).forEach(rival => {
      if (!rivalries.some(r => (r.f1 === faction.faction_id && r.f2 === rival) || (r.f2 === faction.faction_id && r.f1 === rival))) {
        rivalries.push({ f1: faction.faction_id, f2: rival, intensity: Math.abs((faction.relationships || {})[rival] || -50) });
      }
    });
  });
  
  if (rivalries.length === 0) return null;
  
  const conflict = rivalries[Math.floor(Math.random() * rivalries.length)];
  const faction1 = factions.find(f => f.faction_id === conflict.f1);
  const faction2 = factions.find(f => f.faction_id === conflict.f2);
  
  if (!faction1 || !faction2) return null;
  
  const types = ['border_skirmish', 'espionage_exposed', 'trade_embargo', 'propaganda_war', 'proxy_conflict'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const templates = {
    border_skirmish: {
      name: `Border Skirmish: ${faction1.name} vs ${faction2.name}`,
      description: `Armed conflict erupts along the border between ${faction1.name} and ${faction2.name}. Both sides mobilize forces. The situation could escalate into full-scale war.`,
      choices: [
        {
          text: `Support ${faction1.name} with military aid`,
          effects: { [`faction_${conflict.f1}`]: 25, [`faction_${conflict.f2}`]: -30, credits: -400 },
          cascading: { type: 'faction_power_shift', target: conflict.f1, amount: 10 }
        },
        {
          text: `Support ${faction2.name} with intelligence`,
          effects: { [`faction_${conflict.f2}`]: 25, [`faction_${conflict.f1}`]: -30, intel: -20 },
          cascading: { type: 'faction_power_shift', target: conflict.f2, amount: 10 }
        },
        {
          text: 'Mediate the conflict',
          effects: { [`faction_${conflict.f1}`]: 10, [`faction_${conflict.f2}`]: 10, influence: 20 },
          required_skill: { negotiation: 5 },
          cascading: { type: 'world_stability_change', amount: 10 }
        },
        {
          text: 'Exploit the chaos for profit',
          effects: { credits: 600, reputation: -15 },
          cascading: { type: 'world_stability_change', amount: -5 }
        }
      ]
    },
    espionage_exposed: {
      name: `Espionage Scandal: ${faction1.name} Caught Spying`,
      description: `${faction2.name} has uncovered ${faction1.name} spy networks operating within their territory. Evidence of extensive espionage sparks outrage.`,
      choices: [
        {
          text: `Condemn ${faction1.name}'s actions`,
          effects: { [`faction_${conflict.f1}`]: -20, [`faction_${conflict.f2}`]: 15, reputation: 10 }
        },
        {
          text: `Defend ${faction1.name} - all factions spy`,
          effects: { [`faction_${conflict.f1}`]: 15, [`faction_${conflict.f2}`]: -15 }
        },
        {
          text: 'Offer to investigate independently',
          effects: { intel: 30, influence: 15 },
          required_skill: { investigation: 4 },
          cascading: { type: 'unlock_quest', quest_id: 'spy_networks' }
        },
        {
          text: 'Stay out of it',
          effects: {}
        }
      ]
    },
    trade_embargo: {
      name: `Trade War: ${faction1.name} Embargo`,
      description: `${faction1.name} imposes strict trade embargo on ${faction2.name}, disrupting supply chains across the Imperium.`,
      choices: [
        {
          text: 'Smuggle goods to break embargo',
          effects: { credits: 800, [`faction_${conflict.f1}`]: -25, [`faction_${conflict.f2}`]: 20 },
          cascading: { type: 'market_disruption', severity: 'medium' }
        },
        {
          text: 'Respect the embargo',
          effects: { [`faction_${conflict.f1}`]: 15 }
        },
        {
          text: 'Broker alternative trade routes',
          effects: { credits: 400, influence: 20, faction_merchant_houses: 15 },
          required_skill: { negotiation: 4 }
        }
      ]
    }
  };
  
  return {
    id: `procedural_${type}_${Date.now()}`,
    type: 'procedural_conflict',
    factions_involved: [conflict.f1, conflict.f2],
    procedural: true,
    ...templates[type]
  };
}

// Economic Event Generator
function generateEconomicEvent(gameState, worldState, factions) {
  const economicState = worldState?.economic_state || 'stable';
  const marketHealth = factions.reduce((sum, f) => sum + (f.resources || 1000), 0) / factions.length;
  
  if (economicState === 'recession' || marketHealth < 1200) {
    return {
      id: `procedural_recession_${Date.now()}`,
      name: 'Imperial Economic Downturn',
      description: 'Markets across the Imperium contract. Credit flow slows. Unemployment rises. Desperate times breed desperate measures.',
      type: 'procedural_economic',
      choices: [
        {
          text: 'Invest heavily - buy low, sell high',
          effects: { credits: -1000 },
          cascading: { type: 'delayed_economic_return', multiplier: 2.5, turns: 5 }
        },
        {
          text: 'Consolidate resources - play it safe',
          effects: { credits: 200 }
        },
        {
          text: 'Exploit the downturn - predatory lending',
          effects: { credits: 600, reputation: -20, faction_merchant_houses: 15 },
          cascading: { type: 'future_consequences', severity: 'high', description: 'Those you exploited will remember' }
        },
        {
          text: 'Support relief efforts - help the people',
          effects: { credits: -500, reputation: 30 },
          cascading: { type: 'world_stability_change', amount: 5 }
        }
      ]
    };
  } else if (economicState === 'boom' || marketHealth > 2500) {
    return {
      id: `procedural_boom_${Date.now()}`,
      name: 'Economic Golden Age',
      description: 'The Imperium prospers. New technologies unlock markets. Credit flows freely. Everyone scrambles for their share.',
      type: 'procedural_economic',
      choices: [
        {
          text: 'Launch new business ventures',
          effects: { credits: -800, influence: 15 },
          cascading: { type: 'passive_income', amount: 150, duration: 10 }
        },
        {
          text: 'Manipulate markets for profit',
          effects: { credits: 1200, reputation: -10 },
          required_skill: { negotiation: 5 }
        },
        {
          text: 'Invest in faction enterprises',
          effects: { credits: -600 },
          cascading: { type: 'faction_favor_multiple', amount: 15 }
        }
      ]
    };
  }
  
  return null;
}

// Political Intrigue Event Generator  
function generatePoliticalIntrigueEvent(gameState, worldState, factions) {
  const playerRep = gameState.reputation || 50;
  const playerInfluence = gameState.influence || 10;
  
  if (playerRep > 70 && playerInfluence > 30) {
    return {
      id: `procedural_power_play_${Date.now()}`,
      name: 'The Power Play',
      description: 'Your rising influence threatens established powers. Anonymous parties offer you a choice: join their inner circle or face their wrath.',
      type: 'procedural_political',
      choices: [
        {
          text: 'Accept their offer - join the elite',
          effects: { influence: 40, reputation: -10 },
          cascading: { type: 'unlock_conspiracy', conspiracy_id: 'shadow_council' }
        },
        {
          text: 'Refuse and expose them',
          effects: { reputation: 40, influence: -20 },
          cascading: { type: 'make_enemies', power_level: 'high' }
        },
        {
          text: 'Play both sides against each other',
          effects: { intel: 40, credits: 500 },
          required_skill: { espionage: 6 },
          cascading: { type: 'future_consequences', severity: 'critical' }
        }
      ]
    };
  } else if (playerRep < 30) {
    return {
      id: `procedural_redemption_${Date.now()}`,
      name: 'Path to Redemption',
      description: 'Your poor reputation precedes you. But a faction leader offers a chance at redemption - if you prove yourself worthy.',
      type: 'procedural_political',
      choices: [
        {
          text: 'Accept the trial - prove yourself',
          effects: { reputation: 20 },
          cascading: { type: 'unlock_quest', quest_id: 'redemption_arc' }
        },
        {
          text: 'Reject it - you need no one\'s approval',
          effects: { reputation: -10, influence: 10 }
        }
      ]
    };
  }
  
  return null;
}

// Territorial Event Generator
function generateTerritorialEvent(gameState, worldState, factions) {
  const contested = Object.entries(worldState?.territory_control || {})
    .filter(([_, controller]) => controller === 'contested');
  
  if (contested.length === 0) return null;
  
  const [territory, _] = contested[Math.floor(Math.random() * contested.length)];
  const claimants = factions.filter(f => f.power_level > 50).slice(0, 2);
  
  if (claimants.length < 2) return null;
  
  return {
    id: `procedural_territory_${Date.now()}`,
    name: `Battle for ${territory}`,
    description: `${claimants[0].name} and ${claimants[1].name} both lay claim to ${territory}. The power vacuum won't last long.`,
    type: 'procedural_territorial',
    choices: [
      {
        text: `Back ${claimants[0].name}'s claim`,
        effects: { [`faction_${claimants[0].faction_id}`]: 20, [`faction_${claimants[1].faction_id}`]: -25 },
        cascading: { type: 'territory_shift', territory, new_owner: claimants[0].faction_id }
      },
      {
        text: `Back ${claimants[1].name}'s claim`,
        effects: { [`faction_${claimants[1].faction_id}`]: 20, [`faction_${claimants[0].faction_id}`]: -25 },
        cascading: { type: 'territory_shift', territory, new_owner: claimants[1].faction_id }
      },
      {
        text: 'Claim it for yourself',
        effects: { influence: -30, credits: -1500 },
        required_reputation: 70,
        cascading: { type: 'territory_shift', territory, new_owner: 'player', make_enemies: true }
      },
      {
        text: 'Propose neutral zone',
        effects: { influence: 20 },
        required_skill: { negotiation: 6 },
        cascading: { type: 'world_stability_change', amount: 10 }
      }
    ]
  };
}

// Player Reputation Event Generator
function generatePlayerReputationEvent(gameState, worldState, factions) {
  const rep = gameState.reputation || 50;
  
  if (rep > 80) {
    return {
      id: `procedural_legend_${Date.now()}`,
      name: 'Living Legend',
      description: 'Tales of your deeds spread across the Imperium. A young operative asks to become your apprentice.',
      type: 'procedural_reputation',
      choices: [
        {
          text: 'Accept them as apprentice',
          effects: { influence: 20 },
          cascading: { type: 'recruit_follower', loyalty: 60 }
        },
        {
          text: 'Decline - you work alone',
          effects: { reputation: -5 }
        },
        {
          text: 'Test them first',
          effects: {},
          cascading: { type: 'unlock_quest', quest_id: 'apprentice_trial' }
        }
      ]
    };
  } else if (rep < 25) {
    return {
      id: `procedural_hunted_${Date.now()}`,
      name: 'Marked for Death',
      description: 'Your enemies unite. Bounty hunters track your every move. You must act before they close in.',
      type: 'procedural_reputation',
      choices: [
        {
          text: 'Go into hiding',
          effects: { reputation: -10, intel: 20 },
          cascading: { type: 'delay_consequences', turns: 5 }
        },
        {
          text: 'Hunt the hunters',
          effects: { reputation: 20 },
          triggers_combat: true,
          cascading: { type: 'eliminate_threat' }
        },
        {
          text: 'Negotiate with your enemies',
          effects: { credits: -1000, reputation: 15 },
          required_skill: { negotiation: 5 }
        }
      ]
    };
  }
  
  return null;
}

// Coalition Event Generator
function generateCoalitionEvent(gameState, worldState, factions) {
  const alliances = factions.flatMap(f => 
    (f.alliances || []).map(ally => ({ faction: f.faction_id, ally }))
  );
  
  if (alliances.length < 3) return null;
  
  // Find largest coalition
  const coalitionMap = {};
  alliances.forEach(({ faction, ally }) => {
    if (!coalitionMap[faction]) coalitionMap[faction] = [];
    coalitionMap[faction].push(ally);
  });
  
  const largestCoalition = Object.entries(coalitionMap)
    .reduce((max, curr) => curr[1].length > max[1].length ? curr : max, ['', []]);
  
  if (largestCoalition[1].length < 2) return null;
  
  return {
    id: `procedural_coalition_${Date.now()}`,
    name: 'The Grand Coalition',
    description: `A powerful coalition forms, led by ${factions.find(f => f.faction_id === largestCoalition[0])?.name}. They extend an invitation to join.`,
    type: 'procedural_coalition',
    choices: [
      {
        text: 'Join the coalition',
        effects: { influence: 30 },
        cascading: { type: 'coalition_member', benefits: true, obligations: true }
      },
      {
        text: 'Form counter-coalition',
        effects: { influence: -20, reputation: 20 },
        required_reputation: 60,
        cascading: { type: 'start_cold_war' }
      },
      {
        text: 'Remain independent',
        effects: { reputation: -10 }
      }
    ]
  };
}

// Technology Event Generator
function generateTechnologyEvent(gameState, worldState, factions) {
  const discoveries = [
    { name: 'Neural Enhancement', field: 'cognitive' },
    { name: 'Quantum Encryption', field: 'security' },
    { name: 'Plasma Weaponry', field: 'military' },
    { name: 'Nanoforge Technology', field: 'manufacturing' }
  ];
  
  const discovery = discoveries[Math.floor(Math.random() * discoveries.length)];
  
  return {
    id: `procedural_tech_${Date.now()}`,
    name: `Breakthrough: ${discovery.name}`,
    description: `Scientists announce a major breakthrough in ${discovery.field} technology. Multiple factions scramble to acquire it.`,
    type: 'procedural_technology',
    choices: [
      {
        text: 'Acquire the technology',
        effects: { credits: -1200, research_points: 50 },
        cascading: { type: 'unlock_technology', tech_id: discovery.name.toLowerCase().replace(' ', '_') }
      },
      {
        text: 'Steal the research data',
        effects: { research_points: 40, reputation: -20 },
        required_skill: { hacking: 6 },
        cascading: { type: 'make_enemies', power_level: 'medium' }
      },
      {
        text: 'Sell access to highest bidder',
        effects: { credits: 1500, reputation: -15 }
      }
    ]
  };
}

// Crisis Event Generator
function generateCrisisEvent(gameState, worldState, factions) {
  const stability = worldState?.world_stability || 75;
  
  if (stability < 25) {
    return {
      id: `procedural_collapse_${Date.now()}`,
      name: 'Imperial Collapse Imminent',
      description: 'The Imperium teeters on the brink. Factions prepare for total war. The Digital Emperor\'s control weakens. Civilization may not survive.',
      type: 'procedural_crisis',
      significance: 'critical',
      choices: [
        {
          text: 'Unite the factions - save the Imperium',
          effects: { influence: -50, reputation: 100 },
          required_reputation: 80,
          cascading: { type: 'major_storyline', arc: 'save_imperium' }
        },
        {
          text: 'Seize power in the chaos',
          effects: { influence: 100, reputation: -40 },
          cascading: { type: 'major_storyline', arc: 'imperial_coup' }
        },
        {
          text: 'Flee to the outer systems',
          effects: { credits: -2000 },
          cascading: { type: 'exile_ending' }
        }
      ]
    };
  }
  
  return null;
}