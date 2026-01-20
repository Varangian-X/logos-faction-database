// AI Advisor System - Strategic analysis and recommendations

// Analyze current game state and generate recommendations
export function generateAdvisorRecommendations(gameState, factions = [], companions = [], activeEvents = [], marketState = {}, quests = [], proceduralContent = null) {
  const recommendations = [];
  const threats = [];
  const opportunities = [];
  
  // Analyze each system
  const economicAnalysis = analyzeEconomicSituation(gameState, marketState);
  const factionAnalysis = analyzeFactionRelations(gameState, factions);
  const companionAnalysis = analyzeCompanions(companions);
  const eventAnalysis = analyzeActiveEvents(activeEvents, gameState);
  const questAnalysis = analyzeQuests(quests, gameState);
  const resourceAnalysis = analyzeResources(gameState);
  const proceduralAnalysis = analyzeProceduralContent(proceduralContent, gameState);
  
  // Combine all analyses
  recommendations.push(...economicAnalysis.recommendations);
  recommendations.push(...factionAnalysis.recommendations);
  recommendations.push(...companionAnalysis.recommendations);
  recommendations.push(...eventAnalysis.recommendations);
  recommendations.push(...questAnalysis.recommendations);
  recommendations.push(...resourceAnalysis.recommendations);
  recommendations.push(...proceduralAnalysis.recommendations);
  
  threats.push(...economicAnalysis.threats);
  threats.push(...factionAnalysis.threats);
  threats.push(...companionAnalysis.threats);
  threats.push(...eventAnalysis.threats);
  threats.push(...proceduralAnalysis.threats);
  
  opportunities.push(...economicAnalysis.opportunities);
  opportunities.push(...factionAnalysis.opportunities);
  opportunities.push(...companionAnalysis.opportunities);
  opportunities.push(...eventAnalysis.opportunities);
  opportunities.push(...questAnalysis.opportunities);
  opportunities.push(...resourceAnalysis.opportunities);
  opportunities.push(...proceduralAnalysis.opportunities);
  
  // Prioritize recommendations
  const prioritized = prioritizeRecommendations(recommendations, threats, opportunities, gameState);
  
  return {
    top_recommendations: prioritized.slice(0, 5),
    all_recommendations: prioritized,
    threats: threats.sort((a, b) => b.severity - a.severity),
    opportunities: opportunities.sort((a, b) => b.value - a.value),
    strategic_overview: generateStrategicOverview(gameState, factions, companions, activeEvents)
  };
}

// Economic Analysis
function analyzeEconomicSituation(gameState, marketState) {
  const recommendations = [];
  const threats = [];
  const opportunities = [];
  const credits = gameState.credits || 0;
  
  // Low credits warning
  if (credits < 300) {
    threats.push({
      id: 'low_credits',
      title: 'Critical Financial Situation',
      description: `Your House has only ${credits} credits remaining. Immediate action needed to avoid bankruptcy.`,
      severity: 9,
      category: 'economic',
      actions: ['Accept economic quests', 'Sell unused resources', 'Seek merchant house loans']
    });
    
    recommendations.push({
      id: 'urgent_funding',
      title: 'Secure Emergency Funding',
      description: 'Prioritize economic quests and trade missions immediately',
      priority: 10,
      category: 'economic',
      impact: 'critical',
      effort: 'medium'
    });
  } else if (credits < 800) {
    recommendations.push({
      id: 'improve_finances',
      title: 'Strengthen Economic Position',
      description: 'Build up reserves before pursuing expensive opportunities',
      priority: 7,
      category: 'economic',
      impact: 'high',
      effort: 'medium'
    });
  }
  
  // High credits - investment opportunity
  if (credits > 2000) {
    opportunities.push({
      id: 'investment_opportunity',
      title: 'Strong Financial Position',
      description: 'Your wealth enables strategic investments in market manipulation, faction influence, or advanced augmentations.',
      value: 8,
      category: 'economic',
      actions: ['Corner markets', 'Fund faction operations', 'Purchase elite augmentations']
    });
    
    recommendations.push({
      id: 'strategic_investment',
      title: 'Deploy Capital Strategically',
      description: 'Use your financial strength to gain long-term advantages',
      priority: 6,
      category: 'economic',
      impact: 'high',
      effort: 'low'
    });
  }
  
  // Market volatility
  if (marketState.global_stability < 30) {
    opportunities.push({
      id: 'market_volatility',
      title: 'Market Chaos Creates Opportunities',
      description: 'Low market stability allows for profitable speculation and arbitrage.',
      value: 7,
      category: 'economic',
      actions: ['Buy undervalued resources', 'Execute price manipulation']
    });
  }
  
  return { recommendations, threats, opportunities };
}

// Faction Relations Analysis
function analyzeFactionRelations(gameState, factions) {
  const recommendations = [];
  const threats = [];
  const opportunities = [];
  const relations = gameState.faction_relations || {};
  
  factions.forEach(faction => {
    const standing = relations[faction.faction_id] || 0;
    const factionName = faction.name || faction.faction_id;
    
    // Hostile faction threat
    if (standing < -30) {
      threats.push({
        id: `hostile_${faction.faction_id}`,
        title: `${factionName} Hostility`,
        description: `${factionName} views you as an enemy (${standing}). They may take aggressive action against you.`,
        severity: Math.abs(standing) / 10,
        category: 'diplomatic',
        actions: ['Seek reconciliation', 'Prepare for conflict', 'Avoid their territories']
      });
      
      recommendations.push({
        id: `reconcile_${faction.faction_id}`,
        title: `Repair Relations with ${factionName}`,
        description: 'Accept redemption quests or make peace offerings',
        priority: 8,
        category: 'diplomatic',
        impact: 'high',
        effort: 'high'
      });
    }
    
    // High standing opportunity
    if (standing > 50 && standing < 80) {
      opportunities.push({
        id: `elite_access_${faction.faction_id}`,
        title: `${factionName} Elite Access`,
        description: `Your strong relationship (${standing}) with ${factionName} unlocks elite missions and exclusive benefits.`,
        value: 8,
        category: 'diplomatic',
        actions: ['Accept elite missions', 'Request special favors', 'Deepen alliance']
      });
      
      recommendations.push({
        id: `leverage_${faction.faction_id}`,
        title: `Leverage ${factionName} Alliance`,
        description: 'Take advantage of your strong relationship for strategic gains',
        priority: 7,
        category: 'diplomatic',
        impact: 'high',
        effort: 'low'
      });
    }
    
    // Ongoing operations threat
    if (faction.active_operations?.length > 0) {
      const operationsAgainstPlayer = faction.active_operations.filter(op => 
        op.target === 'player' || op.operation_type === 'sabotage'
      );
      
      if (operationsAgainstPlayer.length > 0) {
        threats.push({
          id: `ops_${faction.faction_id}`,
          title: `${factionName} Active Operations`,
          description: `${factionName} is conducting ${operationsAgainstPlayer.length} operation(s) that may affect you.`,
          severity: 7,
          category: 'intelligence',
          actions: ['Counter-intelligence', 'Investigate operations', 'Pre-emptive action']
        });
      }
    }
  });
  
  // Multi-faction balance
  const hostileFactions = Object.entries(relations).filter(([_, v]) => v < -20).length;
  const alliedFactions = Object.entries(relations).filter(([_, v]) => v > 40).length;
  
  if (hostileFactions > 2) {
    threats.push({
      id: 'too_many_enemies',
      title: 'Surrounded by Enemies',
      description: `You are hostile with ${hostileFactions} major factions. This creates extreme vulnerability.`,
      severity: 9,
      category: 'diplomatic',
      actions: ['Prioritize reconciliation', 'Seek powerful allies', 'Maintain low profile']
    });
  }
  
  if (alliedFactions >= 3) {
    opportunities.push({
      id: 'coalition_potential',
      title: 'Coalition Building Potential',
      description: `Strong relations with ${alliedFactions} factions enables grand alliance formation.`,
      value: 9,
      category: 'diplomatic',
      actions: ['Form coalition', 'Coordinate faction actions', 'Dominate politics']
    });
  }
  
  return { recommendations, threats, opportunities };
}

// Companion Analysis
function analyzeCompanions(companions) {
  const recommendations = [];
  const threats = [];
  const opportunities = [];
  
  const recruited = companions.filter(c => c.is_recruited);
  const lowLoyalty = recruited.filter(c => c.loyalty < 30);
  const highLoyalty = recruited.filter(c => c.loyalty >= 70 && c.trust >= 60);
  const questsAvailable = recruited.filter(c => 
    c.personal_quest && !c.personal_quest.completed && c.loyalty >= 30
  );
  
  // Low loyalty threat
  if (lowLoyalty.length > 0) {
    threats.push({
      id: 'companion_loyalty',
      title: 'Companion Loyalty Crisis',
      description: `${lowLoyalty.length} companion(s) have low loyalty: ${lowLoyalty.map(c => c.name).join(', ')}. They may abandon you.`,
      severity: 6,
      category: 'companions',
      actions: ['Complete companion quests', 'Align choices with values', 'Spend time with companions']
    });
    
    recommendations.push({
      id: 'restore_loyalty',
      title: 'Restore Companion Loyalty',
      description: 'Focus on companion relationships before they deteriorate further',
      priority: 8,
      category: 'companions',
      impact: 'high',
      effort: 'medium'
    });
  }
  
  // High loyalty opportunity
  if (highLoyalty.length > 0) {
    opportunities.push({
      id: 'companion_strength',
      title: 'Loyal Companion Network',
      description: `${highLoyalty.length} devoted companion(s) provide significant strategic advantages and combat bonuses.`,
      value: 7,
      category: 'companions',
      actions: ['Use companion bonuses', 'Coordinate strategies', 'Unlock ultimate abilities']
    });
  }
  
  // Quest opportunities
  if (questsAvailable.length > 0) {
    opportunities.push({
      id: 'companion_quests',
      title: 'Companion Personal Quests',
      description: `${questsAvailable.length} companion quest(s) available. Completing these unlocks powerful abilities.`,
      value: 8,
      category: 'companions',
      actions: ['Complete personal quests', 'Unlock abilities', 'Deepen relationships']
    });
    
    recommendations.push({
      id: 'pursue_quests',
      title: 'Pursue Companion Quests',
      description: 'Unlock unique abilities and strengthen bonds',
      priority: 7,
      category: 'companions',
      impact: 'high',
      effort: 'medium'
    });
  }
  
  // Under-utilized companions
  if (recruited.length < 2) {
    recommendations.push({
      id: 'recruit_companions',
      title: 'Expand Your Inner Circle',
      description: 'Recruit more companions to gain diverse abilities and strategic options',
      priority: 6,
      category: 'companions',
      impact: 'medium',
      effort: 'medium'
    });
  }
  
  return { recommendations, threats, opportunities };
}

// Active Events Analysis
function analyzeActiveEvents(activeEvents, gameState) {
  const recommendations = [];
  const threats = [];
  const opportunities = [];
  
  activeEvents.forEach(event => {
    const turnsRemaining = event.turns_remaining || 0;
    
    // Time-sensitive events
    if (turnsRemaining <= 2 && turnsRemaining > 0) {
      threats.push({
        id: `event_expiry_${event.id}`,
        title: `Event Ending: ${event.name}`,
        description: `${event.name} concludes in ${turnsRemaining} turn(s). Take action before it's too late.`,
        severity: 7,
        category: 'events',
        actions: ['Respond to event', 'Complete event quests', 'Prepare for consequences']
      });
      
      recommendations.push({
        id: `respond_${event.id}`,
        title: `Urgent: Respond to ${event.name}`,
        description: 'Time is running out to influence this event',
        priority: 9,
        category: 'events',
        impact: 'high',
        effort: 'high'
      });
    }
    
    // Event opportunities
    if (event.stages && event.current_stage < event.stages.length - 1) {
      opportunities.push({
        id: `event_influence_${event.id}`,
        title: `Shape Event Outcome: ${event.name}`,
        description: 'This event is still unfolding. Your actions can determine its resolution.',
        value: 8,
        category: 'events',
        actions: ['Accept event quests', 'Influence factions', 'Make strategic choices']
      });
    }
  });
  
  return { recommendations, threats, opportunities };
}

// Quest Analysis
function analyzeQuests(quests, gameState) {
  const recommendations = [];
  const opportunities = [];
  
  const activeQuests = quests.filter(q => q.status === 'active');
  const availableHighValue = quests.filter(q => 
    (!q.status || q.status === 'available') && 
    (q.complexity === 'high' || q.complexity === 'very_high')
  );
  const expiringSoon = activeQuests.filter(q => 
    q.time_sensitive && q.expires_turn && 
    gameState.turn_number >= q.expires_turn - 2
  );
  
  // Expiring quests
  if (expiringSoon.length > 0) {
    recommendations.push({
      id: 'expiring_quests',
      title: 'Complete Time-Sensitive Quests',
      description: `${expiringSoon.length} quest(s) expiring soon. Prioritize completion to avoid losing rewards.`,
      priority: 9,
      category: 'quests',
      impact: 'high',
      effort: 'high'
    });
  }
  
  // High-value opportunities
  if (availableHighValue.length > 0) {
    opportunities.push({
      id: 'elite_quests',
      title: 'Elite Quest Opportunities',
      description: `${availableHighValue.length} high-value quest(s) available offering exceptional rewards.`,
      value: 8,
      category: 'quests',
      actions: ['Accept elite quests', 'Prepare resources', 'Coordinate with allies']
    });
    
    recommendations.push({
      id: 'pursue_elite',
      title: 'Pursue Elite Quests',
      description: 'Take on challenging missions for maximum rewards',
      priority: 7,
      category: 'quests',
      impact: 'high',
      effort: 'high'
    });
  }
  
  // Quest overload
  if (activeQuests.length > 5) {
    recommendations.push({
      id: 'quest_focus',
      title: 'Focus Quest Efforts',
      description: 'Too many active quests may dilute your effectiveness. Consider abandoning low-priority missions.',
      priority: 5,
      category: 'quests',
      impact: 'medium',
      effort: 'low'
    });
  }
  
  return { recommendations, opportunities };
}

// Resource Analysis
function analyzeResources(gameState) {
  const recommendations = [];
  const opportunities = [];
  
  const intel = gameState.intel || 0;
  const influence = gameState.influence || 0;
  const reputation = gameState.reputation || 0;
  
  // High intel
  if (intel > 50) {
    opportunities.push({
      id: 'intel_advantage',
      title: 'Intelligence Superiority',
      description: 'High intel reserves enable espionage operations and information-based strategies.',
      value: 7,
      category: 'resources',
      actions: ['Execute espionage', 'Blackmail operations', 'Sell intelligence']
    });
  }
  
  // Low intel
  if (intel < 15) {
    recommendations.push({
      id: 'gather_intel',
      title: 'Strengthen Intelligence Network',
      description: 'Low intel limits strategic options. Invest in investigation and espionage.',
      priority: 6,
      category: 'resources',
      impact: 'medium',
      effort: 'medium'
    });
  }
  
  // High influence
  if (influence > 40) {
    opportunities.push({
      id: 'political_power',
      title: 'Significant Political Influence',
      description: 'Your influence enables major diplomatic initiatives and power plays.',
      value: 8,
      category: 'resources',
      actions: ['Broker alliances', 'Launch political campaigns', 'Manipulate factions']
    });
  }
  
  // High reputation
  if (reputation > 60) {
    opportunities.push({
      id: 'renowned_status',
      title: 'Imperial Renown',
      description: 'Your reputation opens doors across the Imperium. Leverage this for strategic gains.',
      value: 7,
      category: 'resources',
      actions: ['Access elite locations', 'Gain faction trust', 'Influence events']
    });
  }
  
  return { recommendations, opportunities };
}

// Prioritize recommendations
function prioritizeRecommendations(recommendations, threats, opportunities, gameState) {
  return recommendations.map(rec => {
    // Adjust priority based on related threats/opportunities
    const relatedThreats = threats.filter(t => t.category === rec.category);
    const relatedOpps = opportunities.filter(o => o.category === rec.category);
    
    let adjustedPriority = rec.priority;
    if (relatedThreats.length > 0) {
      adjustedPriority += 2;
    }
    if (relatedOpps.length > 0) {
      adjustedPriority += 1;
    }
    
    return { ...rec, adjusted_priority: adjustedPriority };
  }).sort((a, b) => b.adjusted_priority - a.adjusted_priority);
}

// Strategic Overview
function generateStrategicOverview(gameState, factions, companions, activeEvents) {
  const metrics = {
    economic_health: calculateEconomicHealth(gameState),
    diplomatic_position: calculateDiplomaticPosition(gameState, factions),
    military_strength: calculateMilitaryStrength(gameState, companions),
    political_influence: gameState.influence || 0,
    overall_stability: 0
  };
  
  metrics.overall_stability = Math.round(
    (metrics.economic_health + metrics.diplomatic_position + metrics.military_strength + metrics.political_influence / 2) / 4
  );
  
  const phase = determineGamePhase(gameState, metrics);
  const strategic_focus = recommendStrategicFocus(metrics, activeEvents);
  
  return {
    metrics,
    phase,
    strategic_focus,
    key_strengths: identifyStrengths(metrics),
    key_weaknesses: identifyWeaknesses(metrics)
  };
}

function calculateEconomicHealth(gameState) {
  const credits = gameState.credits || 0;
  if (credits < 300) return 20;
  if (credits < 800) return 40;
  if (credits < 1500) return 60;
  if (credits < 2500) return 80;
  return 100;
}

function calculateDiplomaticPosition(gameState, factions) {
  const relations = gameState.faction_relations || {};
  const values = Object.values(relations);
  if (values.length === 0) return 50;
  
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.max(0, Math.min(100, 50 + avg));
}

function calculateMilitaryStrength(gameState, companions) {
  const combatSkill = gameState.skills?.combat?.level || 0;
  const recruitedCompanions = companions.filter(c => c.is_recruited).length;
  const augmentations = gameState.augmentations?.length || 0;
  
  return Math.min(100, (combatSkill * 10) + (recruitedCompanions * 15) + (augmentations * 5));
}

function determineGamePhase(gameState, metrics) {
  const turn = gameState.turn_number || 1;
  if (turn < 10) return 'Early Game - Establishment';
  if (turn < 25) return 'Mid Game - Expansion';
  if (turn < 50) return 'Late Game - Domination';
  return 'End Game - Legacy';
}

function recommendStrategicFocus(metrics, activeEvents) {
  if (metrics.economic_health < 40) return 'Economic Recovery - Stabilize finances first';
  if (metrics.diplomatic_position < 30) return 'Diplomatic Repair - Mend faction relations';
  if (activeEvents.length > 2) return 'Crisis Management - Respond to active events';
  if (metrics.political_influence < 20) return 'Influence Building - Increase political power';
  return 'Opportunity Exploitation - Pursue ambitious goals';
}

function identifyStrengths(metrics) {
  const strengths = [];
  if (metrics.economic_health > 70) strengths.push('Strong Economy');
  if (metrics.diplomatic_position > 70) strengths.push('Excellent Relations');
  if (metrics.military_strength > 70) strengths.push('Powerful Military');
  if (metrics.political_influence > 50) strengths.push('High Influence');
  return strengths.length > 0 ? strengths : ['Building Foundation'];
}

function identifyWeaknesses(metrics) {
  const weaknesses = [];
  if (metrics.economic_health < 40) weaknesses.push('Financial Instability');
  if (metrics.diplomatic_position < 40) weaknesses.push('Poor Faction Relations');
  if (metrics.military_strength < 40) weaknesses.push('Weak Defenses');
  if (metrics.political_influence < 20) weaknesses.push('Limited Influence');
  return weaknesses.length > 0 ? weaknesses : ['Well-Rounded Position'];
}

// Procedural Content Analysis
function analyzeProceduralContent(proceduralContent, gameState) {
  const recommendations = [];
  const threats = [];
  const opportunities = [];
  
  if (!proceduralContent) return { recommendations, threats, opportunities };
  
  // Analyze new locations
  if (proceduralContent.new_locations && proceduralContent.new_locations.length > 0) {
    proceduralContent.new_locations.forEach(location => {
      opportunities.push({
        id: `new_location_${location.id}`,
        title: `New Location Discovered: ${location.name}`,
        description: `${location.description} This ${location.theme} location offers ${location.resources?.join(', ') || 'unique opportunities'}.`,
        value: location.theme === 'mysterious' ? 9 : 7,
        category: 'exploration',
        actions: ['Explore location', 'Complete location quests', 'Establish presence']
      });
      
      if (location.dangers && location.dangers.length > 0) {
        threats.push({
          id: `location_danger_${location.id}`,
          title: `${location.name} Hazards`,
          description: `This location presents dangers: ${location.dangers.join(', ')}. Proceed with caution.`,
          severity: location.atmosphere === 'dangerous' ? 7 : 5,
          category: 'exploration',
          actions: ['Prepare adequately', 'Bring companions', 'Research dangers first']
        });
      }
    });
    
    recommendations.push({
      id: 'explore_new_locations',
      title: 'Investigate New Territories',
      description: `${proceduralContent.new_locations.length} new location(s) await exploration`,
      priority: 7,
      category: 'exploration',
      impact: 'high',
      effort: 'medium'
    });
  }
  
  // Analyze revealed locations
  if (proceduralContent.revealed_locations && proceduralContent.revealed_locations.length > 0) {
    opportunities.push({
      id: 'unlocked_locations',
      title: 'New Areas Unlocked',
      description: `Your progress has unlocked ${proceduralContent.revealed_locations.length} previously hidden location(s).`,
      value: 8,
      category: 'exploration',
      actions: ['Visit unlocked locations', 'Claim resources', 'Meet new NPCs']
    });
  }
  
  // Analyze new quests
  if (proceduralContent.new_quests && proceduralContent.new_quests.length > 0) {
    proceduralContent.new_quests.forEach(quest => {
      if (quest.reactsToNews) {
        opportunities.push({
          id: `reactive_quest_${quest.quest_id}`,
          title: `Emerging Situation: ${quest.title}`,
          description: `A new quest has emerged in response to recent events. This ${quest.complexity} mission offers significant rewards.`,
          value: quest.complexity === 'epic' ? 10 : quest.complexity === 'complex' ? 8 : 6,
          category: 'quests',
          actions: ['Accept quest immediately', 'Prepare resources', 'Study situation']
        });
        
        recommendations.push({
          id: `pursue_reactive_${quest.quest_id}`,
          title: `Respond to Emerging Quest`,
          description: 'Time-sensitive opportunity arising from current events',
          priority: 9,
          category: 'quests',
          impact: 'high',
          effort: 'high'
        });
      }
      
      if (quest.branching_paths && quest.branching_paths.length > 0) {
        opportunities.push({
          id: `branching_quest_${quest.quest_id}`,
          title: `Complex Mission Available: ${quest.title}`,
          description: `This quest offers multiple paths and outcomes. Your choices will have lasting consequences.`,
          value: 9,
          category: 'quests',
          actions: ['Plan approach carefully', 'Consider all options', 'Align with goals']
        });
      }
    });
  }
  
  // Analyze new events
  if (proceduralContent.new_events && proceduralContent.new_events.length > 0) {
    proceduralContent.new_events.forEach(event => {
      if (event.severity === 'critical') {
        threats.push({
          id: `critical_event_${event.id}`,
          title: `CRITICAL: ${event.name}`,
          description: event.description,
          severity: 10,
          category: 'events',
          actions: ['Respond immediately', 'Mobilize all resources', 'Coordinate with allies']
        });
        
        recommendations.push({
          id: `respond_critical_${event.id}`,
          title: `URGENT: Address Critical Crisis`,
          description: 'Existential threat requires immediate action',
          priority: 10,
          category: 'events',
          impact: 'critical',
          effort: 'high'
        });
      } else if (event.severity === 'major') {
        threats.push({
          id: `major_event_${event.id}`,
          title: `Major Event: ${event.name}`,
          description: event.description,
          severity: 8,
          category: 'events',
          actions: event.choices?.map(c => c.text) || ['Respond to event']
        });
      }
      
      if (event.reactsTo) {
        opportunities.push({
          id: `cascade_opportunity_${event.id}`,
          title: `Event Chain Detected`,
          description: `${event.name} is part of a cascading crisis. Early intervention could prevent escalation.`,
          value: 9,
          category: 'events',
          actions: ['Break the cascade', 'Prepare for escalation', 'Seek pattern']
        });
      }
    });
  }
  
  return { recommendations, threats, opportunities };
}