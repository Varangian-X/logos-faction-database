// Enhanced Cascading Effects System - Persistent consequences that ripple through the game
import { base44 } from '@/api/base44Client';

export function applyCascadingEffect(cascading, gameState, worldState, factions) {
  if (!cascading) return { messages: [], delayed: [], worldChanges: {} };
  
  const handlers = {
    faction_power_shift: handleFactionPowerShift,
    world_stability_change: handleWorldStabilityChange,
    market_disruption: handleMarketDisruption,
    unlock_quest: handleUnlockQuest,
    delayed_economic_return: handleDelayedEconomicReturn,
    future_consequences: handleFutureConsequences,
    passive_income: handlePassiveIncome,
    faction_favor_multiple: handleFactionFavorMultiple,
    unlock_conspiracy: handleUnlockConspiracy,
    make_enemies: handleMakeEnemies,
    territory_shift: handleTerritoryShift,
    recruit_follower: handleRecruitFollower,
    delay_consequences: handleDelayConsequences,
    eliminate_threat: handleEliminateThreat,
    coalition_member: handleCoalitionMember,
    start_cold_war: handleStartColdWar,
    unlock_technology: handleUnlockTechnology,
    major_storyline: handleMajorStoryline,
    exile_ending: handleExileEnding
  };
  
  const handler = handlers[cascading.type];
  if (!handler) return { messages: [], delayed: [], worldChanges: {} };
  
  return handler(cascading, gameState, worldState, factions);
}

function handleFactionPowerShift(cascading, gameState, worldState, factions) {
  const targetFaction = factions.find(f => f.faction_id === cascading.target);
  if (!targetFaction) return { messages: [], delayed: [], worldChanges: {} };
  
  const messages = [
    `${targetFaction.name} grows ${cascading.amount > 0 ? 'stronger' : 'weaker'} from recent events (Power ${cascading.amount > 0 ? '+' : ''}${cascading.amount})`
  ];
  
  // Ripple effect: enemies react
  const enemies = factions.filter(f => (targetFaction.rivalries || []).includes(f.faction_id));
  enemies.forEach(enemy => {
    messages.push(`${enemy.name} mobilizes forces in response to ${targetFaction.name}'s actions`);
  });
  
  return {
    messages,
    delayed: [],
    worldChanges: {
      faction_power: { [cascading.target]: cascading.amount }
    }
  };
}

function handleWorldStabilityChange(cascading, gameState, worldState, factions) {
  const change = cascading.amount;
  const newStability = Math.max(0, Math.min(100, (worldState?.world_stability || 75) + change));
  
  let message = '';
  if (change > 0) {
    message = `Imperial stability improves (+${change})`;
  } else {
    message = `Imperial stability deteriorates (${change})`;
    if (newStability < 30) {
      message += ' - Chaos looms!';
    }
  }
  
  return {
    messages: [message],
    delayed: [],
    worldChanges: {
      world_stability: change
    }
  };
}

function handleMarketDisruption(cascading, gameState, worldState, factions) {
  const severity = cascading.severity || 'low';
  const disruption = { low: 10, medium: 20, high: 30 }[severity];
  
  return {
    messages: [`Markets disrupted! All factions lose ${disruption}% resources for 3 turns`],
    delayed: [{
      type: 'market_disruption_active',
      severity: disruption,
      duration: 3,
      trigger_turn: (gameState.turn_number || 0) + 1
    }],
    worldChanges: {
      economic_state: 'recession'
    }
  };
}

function handleUnlockQuest(cascading, gameState, worldState, factions) {
  return {
    messages: [`New quest available: ${cascading.quest_id}`],
    delayed: [],
    worldChanges: {
      unlocked_quests: [cascading.quest_id]
    }
  };
}

function handleDelayedEconomicReturn(cascading, gameState, worldState, factions) {
  const investment = Math.abs(cascading.investment || 1000);
  const returns = investment * (cascading.multiplier || 2);
  const turns = cascading.turns || 5;
  
  return {
    messages: [`Your investment will mature in ${turns} turns, returning ${returns} credits`],
    delayed: [{
      type: 'economic_return',
      amount: returns,
      trigger_turn: (gameState.turn_number || 0) + turns
    }],
    worldChanges: {}
  };
}

function handleFutureConsequences(cascading, gameState, worldState, factions) {
  const severity = cascading.severity || 'medium';
  const turns = { low: 5, medium: 8, high: 12, critical: 15 }[severity];
  
  return {
    messages: [`Your actions will have consequences... (${severity} severity)`],
    delayed: [{
      type: 'consequence_trigger',
      severity,
      description: cascading.description || 'Unknown consequences await',
      trigger_turn: (gameState.turn_number || 0) + turns
    }],
    worldChanges: {}
  };
}

function handlePassiveIncome(cascading, gameState, worldState, factions) {
  const amount = cascading.amount || 100;
  const duration = cascading.duration || 5;
  
  return {
    messages: [`Passive income established: +${amount} credits/turn for ${duration} turns`],
    delayed: Array.from({ length: duration }, (_, i) => ({
      type: 'passive_income_payment',
      amount,
      trigger_turn: (gameState.turn_number || 0) + i + 1
    })),
    worldChanges: {}
  };
}

function handleFactionFavorMultiple(cascading, gameState, worldState, factions) {
  const amount = cascading.amount || 10;
  const messages = factions.map(f => `${f.name} views your investment favorably (+${amount})`);
  
  const factionChanges = {};
  factions.forEach(f => {
    factionChanges[f.faction_id] = amount;
  });
  
  return {
    messages,
    delayed: [],
    worldChanges: {
      faction_relations: factionChanges
    }
  };
}

function handleUnlockConspiracy(cascading, gameState, worldState, factions) {
  return {
    messages: [`You've been initiated into: ${cascading.conspiracy_id}`],
    delayed: [{
      type: 'conspiracy_activated',
      conspiracy_id: cascading.conspiracy_id,
      trigger_turn: (gameState.turn_number || 0) + 3
    }],
    worldChanges: {
      conspiracies: [cascading.conspiracy_id]
    }
  };
}

function handleMakeEnemies(cascading, gameState, worldState, factions) {
  const powerLevel = cascading.power_level || 'medium';
  const turns = { low: 5, medium: 8, high: 12 }[powerLevel];
  
  return {
    messages: [`You've made powerful enemies... They will strike when you least expect it`],
    delayed: [{
      type: 'enemy_attack',
      power_level: powerLevel,
      trigger_turn: (gameState.turn_number || 0) + turns
    }],
    worldChanges: {}
  };
}

function handleTerritoryShift(cascading, gameState, worldState, factions) {
  const territory = cascading.territory;
  const newOwner = cascading.new_owner;
  
  let message = `${territory} control shifts to ${newOwner}`;
  const delayed = [];
  
  if (cascading.make_enemies) {
    message += ' - Multiple factions now oppose you!';
    delayed.push({
      type: 'multi_faction_opposition',
      trigger_turn: (gameState.turn_number || 0) + 2
    });
  }
  
  return {
    messages: [message],
    delayed,
    worldChanges: {
      territory_control: { [territory]: newOwner }
    }
  };
}

function handleRecruitFollower(cascading, gameState, worldState, factions) {
  return {
    messages: ['New follower recruited! They can assist in operations'],
    delayed: [],
    worldChanges: {
      followers: [{
        name: 'Loyal Apprentice',
        loyalty: cascading.loyalty || 50,
        recruited_turn: gameState.turn_number || 0
      }]
    }
  };
}

function handleDelayConsequences(cascading, gameState, worldState, factions) {
  const turns = cascading.turns || 5;
  
  return {
    messages: [`You've bought yourself time... but they'll find you eventually`],
    delayed: [{
      type: 'delayed_threat_resumes',
      original_threat: 'marked_for_death',
      trigger_turn: (gameState.turn_number || 0) + turns
    }],
    worldChanges: {}
  };
}

function handleEliminateThreat(cascading, gameState, worldState, factions) {
  return {
    messages: ['Threat eliminated. You can breathe easier... for now.'],
    delayed: [],
    worldChanges: {
      active_threats: []
    }
  };
}

function handleCoalitionMember(cascading, gameState, worldState, factions) {
  return {
    messages: [
      'You are now part of the grand coalition',
      'Benefits: +100 credits/turn, +10 influence/turn',
      'Obligations: Must support coalition members in conflicts'
    ],
    delayed: Array.from({ length: 10 }, (_, i) => ({
      type: 'coalition_benefits',
      credits: 100,
      influence: 10,
      trigger_turn: (gameState.turn_number || 0) + i + 1
    })),
    worldChanges: {
      coalition_member: true
    }
  };
}

function handleStartColdWar(cascading, gameState, worldState, factions) {
  return {
    messages: [
      'Cold War initiated! Proxy conflicts will erupt across the Imperium',
      'Both coalitions will compete for your support'
    ],
    delayed: [{
      type: 'cold_war_active',
      trigger_turn: (gameState.turn_number || 0) + 1,
      duration: 20
    }],
    worldChanges: {
      cold_war_active: true,
      world_stability: -15
    }
  };
}

function handleUnlockTechnology(cascading, gameState, worldState, factions) {
  const techId = cascading.tech_id;
  
  return {
    messages: [`Technology unlocked: ${techId}`, 'New capabilities and options now available'],
    delayed: [],
    worldChanges: {
      unlocked_tech: [techId]
    }
  };
}

function handleMajorStoryline(cascading, gameState, worldState, factions) {
  const arc = cascading.arc;
  
  return {
    messages: [`Major storyline begins: ${arc}`, 'Your choices will determine the fate of the Imperium'],
    delayed: [{
      type: 'storyline_stage',
      arc,
      stage: 1,
      trigger_turn: (gameState.turn_number || 0) + 2
    }],
    worldChanges: {
      active_storyline: arc
    }
  };
}

function handleExileEnding(cascading, gameState, worldState, factions) {
  return {
    messages: [
      'You flee to the outer systems...',
      'Your story in the Imperium ends here.',
      'Perhaps in exile, you can find peace.'
    ],
    delayed: [],
    worldChanges: {
      game_ended: true,
      ending: 'exile'
    }
  };
}

// Process delayed consequences that trigger this turn
export function processDelayedConsequences(gameState, delayedConsequences) {
  const currentTurn = gameState.turn_number || 0;
  const triggered = (delayedConsequences || []).filter(c => c.trigger_turn === currentTurn);
  const remaining = (delayedConsequences || []).filter(c => c.trigger_turn > currentTurn);
  
  const results = {
    messages: [],
    effects: {},
    combatTriggered: false
  };
  
  triggered.forEach(consequence => {
    switch (consequence.type) {
      case 'economic_return':
        results.messages.push(`💰 Investment matured! +${consequence.amount} credits`);
        results.effects.credits = (results.effects.credits || 0) + consequence.amount;
        break;
        
      case 'passive_income_payment':
        results.messages.push(`💵 Passive income: +${consequence.amount} credits`);
        results.effects.credits = (results.effects.credits || 0) + consequence.amount;
        break;
        
      case 'consequence_trigger':
        results.messages.push(`⚠️ Consequences arrive: ${consequence.description}`);
        results.effects.reputation = (results.effects.reputation || 0) - 20;
        break;
        
      case 'enemy_attack':
        results.messages.push(`⚔️ Your enemies strike! (${consequence.power_level} threat)`);
        results.combatTriggered = true;
        results.enemyType = consequence.power_level === 'high' ? 'elite_assassin' : 'mercenary_squad';
        break;
        
      case 'coalition_benefits':
        results.effects.credits = (results.effects.credits || 0) + consequence.credits;
        results.effects.influence = (results.effects.influence || 0) + consequence.influence;
        break;
        
      case 'storyline_stage':
        results.messages.push(`📖 Story continues: ${consequence.arc} - Stage ${consequence.stage}`);
        break;
    }
  });
  
  return { results, remaining };
}