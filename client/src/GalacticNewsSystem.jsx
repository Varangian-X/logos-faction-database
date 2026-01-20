// Galactic News Feed - Aggregates updates from all game systems

export const NEWS_CATEGORIES = {
  FACTION: 'faction',
  ECONOMIC: 'economic',
  EVENT: 'event',
  QUEST: 'quest',
  HOUSING: 'housing',
  COMBAT: 'combat',
  DIPLOMATIC: 'diplomatic',
  EXPLORATION: 'exploration'
};

export const NEWS_PRIORITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// Generate news from faction activities
export function generateFactionNews(factions, previousState = {}) {
  const news = [];
  
  factions.forEach(faction => {
    // Faction power shifts
    const prevPower = previousState.faction_power?.[faction.faction_id] || faction.power_level;
    const powerChange = faction.power_level - prevPower;
    
    if (Math.abs(powerChange) >= 10) {
      news.push({
        id: `faction_power_${faction.faction_id}_${Date.now()}`,
        category: NEWS_CATEGORIES.FACTION,
        priority: powerChange > 0 ? NEWS_PRIORITY.HIGH : NEWS_PRIORITY.CRITICAL,
        headline: `${faction.name} ${powerChange > 0 ? 'Surges' : 'Falters'} in Power`,
        content: `${faction.name} has ${powerChange > 0 ? 'gained' : 'lost'} ${Math.abs(powerChange)} power. Their influence across the Imperium ${powerChange > 0 ? 'grows stronger' : 'weakens considerably'}.`,
        timestamp: Date.now(),
        impact: {
          threat_level: powerChange < 0 ? 2 : 7,
          opportunity: powerChange < 0 ? 8 : 3
        },
        affects_player: true
      });
    }
    
    // New faction operations
    if (faction.active_operations && faction.active_operations.length > 0) {
      const newOps = faction.active_operations.filter(op => 
        op.launched_turn === (previousState.turn_number || 0)
      );
      
      newOps.forEach(op => {
        news.push({
          id: `faction_op_${faction.faction_id}_${op.operation_id}`,
          category: NEWS_CATEGORIES.FACTION,
          priority: op.target === 'player' ? NEWS_PRIORITY.CRITICAL : NEWS_PRIORITY.MEDIUM,
          headline: `${faction.name} Launches ${op.operation_type} Operation`,
          content: `Intelligence reports indicate ${faction.name} has initiated a ${op.operation_type} operation targeting ${op.target}. Estimated duration: ${op.turns_remaining} turns.`,
          timestamp: Date.now(),
          impact: {
            threat_level: op.target === 'player' ? 9 : 4,
            opportunity: 2
          },
          affects_player: op.target === 'player'
        });
      });
    }
    
    // Diplomatic actions
    if (faction.diplomatic_actions && faction.diplomatic_actions.length > 0) {
      const recentActions = faction.diplomatic_actions.filter(action => 
        action.status === 'pending' || action.status === 'accepted'
      );
      
      recentActions.forEach(action => {
        if (action.status === 'accepted') {
          news.push({
            id: `faction_diplo_${faction.faction_id}_${action.target_faction}`,
            category: NEWS_CATEGORIES.DIPLOMATIC,
            priority: NEWS_PRIORITY.HIGH,
            headline: `${faction.name} and ${action.target_faction} Form ${action.action_type}`,
            content: `Breaking: ${faction.name} has successfully negotiated a ${action.action_type} with ${action.target_faction}. This alliance will reshape Imperial politics.`,
            timestamp: Date.now(),
            impact: {
              threat_level: 6,
              opportunity: 6
            },
            affects_player: true
          });
        }
      });
    }
  });
  
  return news;
}

// Generate news from market changes
export function generateEconomicNews(marketState, previousState = {}) {
  const news = [];
  
  if (!marketState.resources) return news;
  
  Object.entries(marketState.resources).forEach(([resourceId, resource]) => {
    const prevPrice = previousState.resources?.[resourceId]?.current_price || resource.base_price;
    const priceChange = ((resource.current_price - prevPrice) / prevPrice) * 100;
    
    // Significant price changes
    if (Math.abs(priceChange) > 20) {
      news.push({
        id: `market_${resourceId}_${Date.now()}`,
        category: NEWS_CATEGORIES.ECONOMIC,
        priority: Math.abs(priceChange) > 40 ? NEWS_PRIORITY.HIGH : NEWS_PRIORITY.MEDIUM,
        headline: `${resource.name} Prices ${priceChange > 0 ? 'Soar' : 'Plummet'}`,
        content: `${resource.name} has experienced a ${Math.abs(priceChange).toFixed(1)}% price ${priceChange > 0 ? 'increase' : 'decrease'}. Current price: ${resource.current_price} credits. Market analysts attribute this to ${priceChange > 0 ? 'supply shortages' : 'oversupply'}.`,
        timestamp: Date.now(),
        impact: {
          threat_level: priceChange > 0 ? 5 : 2,
          opportunity: priceChange < 0 ? 8 : 3
        },
        affects_player: true
      });
    }
  });
  
  // Market stability
  if (marketState.global_stability < 30 && previousState.global_stability >= 30) {
    news.push({
      id: `market_crisis_${Date.now()}`,
      category: NEWS_CATEGORIES.ECONOMIC,
      priority: NEWS_PRIORITY.CRITICAL,
      headline: 'MARKET CRISIS: Imperial Economy Destabilizes',
      content: `Global market stability has fallen to ${marketState.global_stability}%. Panic selling reported across major trading hubs. Economists warn of cascading failures.`,
      timestamp: Date.now(),
      impact: {
        threat_level: 9,
        opportunity: 7
      },
      affects_player: true
    });
  }
  
  return news;
}

// Generate news from world events
export function generateEventNews(activeEvents, gameState) {
  const news = [];
  
  activeEvents.forEach(event => {
    // New events
    if (event.triggered_turn === gameState.turn_number) {
      news.push({
        id: `event_start_${event.id}`,
        category: NEWS_CATEGORIES.EVENT,
        priority: NEWS_PRIORITY.HIGH,
        headline: `BREAKING: ${event.name}`,
        content: event.description || `A major event has begun affecting the Imperium. ${event.name} will unfold over the coming turns.`,
        timestamp: Date.now(),
        impact: {
          threat_level: 7,
          opportunity: 6
        },
        affects_player: true
      });
    }
    
    // Events ending soon
    if (event.turns_remaining <= 2 && event.turns_remaining > 0) {
      news.push({
        id: `event_warning_${event.id}`,
        category: NEWS_CATEGORIES.EVENT,
        priority: NEWS_PRIORITY.CRITICAL,
        headline: `URGENT: ${event.name} Nearing Conclusion`,
        content: `${event.name} will conclude in ${event.turns_remaining} turn(s). Time is running out to influence the outcome.`,
        timestamp: Date.now(),
        impact: {
          threat_level: 8,
          opportunity: 9
        },
        affects_player: true
      });
    }
  });
  
  return news;
}

// Generate news from quest completions
export function generateQuestNews(quests, gameState) {
  const news = [];
  
  const completedQuests = quests.filter(q => 
    q.status === 'completed' && 
    q.completed_turn === gameState.turn_number
  );
  
  completedQuests.forEach(quest => {
    if (quest.complexity === 'high' || quest.complexity === 'very_high') {
      news.push({
        id: `quest_complete_${quest.quest_id}`,
        category: NEWS_CATEGORIES.QUEST,
        priority: NEWS_PRIORITY.MEDIUM,
        headline: `House ${gameState.house_name} Completes ${quest.title}`,
        content: `${gameState.character_name} of House ${gameState.house_name} has successfully completed the challenging mission: ${quest.title}. Their reputation across the Imperium grows.`,
        timestamp: Date.now(),
        impact: {
          threat_level: 0,
          opportunity: 5
        },
        affects_player: false
      });
    }
  });
  
  return news;
}

// Generate news from housing milestones
export function generateHousingNews(housing, gameState) {
  const news = [];
  
  if (!housing) return news;
  
  // Major upgrades
  if (housing.housing_tier >= 3 && housing.upgraded_this_turn) {
    news.push({
      id: `housing_upgrade_${Date.now()}`,
      category: NEWS_CATEGORIES.HOUSING,
      priority: NEWS_PRIORITY.LOW,
      headline: `House ${gameState.house_name} Expands Operations`,
      content: `${gameState.character_name} has upgraded their base to Tier ${housing.housing_tier}. The expanded facilities demonstrate their growing influence.`,
      timestamp: Date.now(),
      impact: {
        threat_level: 0,
        opportunity: 3
      },
      affects_player: false
    });
  }
  
  // Trophy milestones
  if (housing.trophies && housing.trophies.length >= 10) {
    const recentTrophy = housing.trophies.find(t => t.acquired_turn === gameState.turn_number);
    if (recentTrophy && recentTrophy.rarity === 'legendary') {
      news.push({
        id: `trophy_${recentTrophy.trophy_id}`,
        category: NEWS_CATEGORIES.HOUSING,
        priority: NEWS_PRIORITY.MEDIUM,
        headline: `Legendary Achievement: ${recentTrophy.name}`,
        content: `House ${gameState.house_name} has earned the legendary trophy "${recentTrophy.name}". ${recentTrophy.description}`,
        timestamp: Date.now(),
        impact: {
          threat_level: 0,
          opportunity: 4
        },
        affects_player: false
      });
    }
  }
  
  return news;
}

// Generate news from exploration
export function generateExplorationNews(gameState, previousState = {}) {
  const news = [];
  
  const discovered = gameState.discovered_locations || [];
  const prevDiscovered = previousState.discovered_locations || [];
  const newLocations = discovered.filter(loc => !prevDiscovered.includes(loc));
  
  newLocations.forEach(locationId => {
    news.push({
      id: `exploration_${locationId}`,
      category: NEWS_CATEGORIES.EXPLORATION,
      priority: NEWS_PRIORITY.MEDIUM,
      headline: `New Territory Discovered: ${locationId}`,
      content: `Explorers from House ${gameState.house_name} have charted a previously unknown sector. The discovery opens new opportunities for expansion.`,
      timestamp: Date.now(),
      impact: {
        threat_level: 1,
        opportunity: 7
      },
      affects_player: false
    });
  });
  
  return news;
}

// Aggregate all news sources
export function aggregateNews(gameState, factions, marketState, activeEvents, quests, housing, previousState = {}) {
  const allNews = [
    ...generateFactionNews(factions, previousState),
    ...generateEconomicNews(marketState, previousState),
    ...generateEventNews(activeEvents, gameState),
    ...generateQuestNews(quests, gameState),
    ...generateHousingNews(housing, gameState),
    ...generateExplorationNews(gameState, previousState)
  ];
  
  // Sort by priority and timestamp
  return allNews.sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.timestamp - a.timestamp;
  });
}

// AI-driven news analysis
export function analyzeNewsImpact(newsItems) {
  const analysis = {
    major_threats: [],
    major_opportunities: [],
    trending_topics: {},
    urgency_score: 0
  };
  
  newsItems.forEach(item => {
    // Categorize threats
    if (item.impact.threat_level >= 7) {
      analysis.major_threats.push({
        headline: item.headline,
        threat_level: item.impact.threat_level,
        category: item.category
      });
    }
    
    // Categorize opportunities
    if (item.impact.opportunity >= 7) {
      analysis.major_opportunities.push({
        headline: item.headline,
        opportunity_value: item.impact.opportunity,
        category: item.category
      });
    }
    
    // Track trending topics
    analysis.trending_topics[item.category] = (analysis.trending_topics[item.category] || 0) + 1;
  });
  
  // Calculate urgency score
  const criticalNews = newsItems.filter(n => n.priority === NEWS_PRIORITY.CRITICAL);
  const highPriorityNews = newsItems.filter(n => n.priority === NEWS_PRIORITY.HIGH);
  analysis.urgency_score = (criticalNews.length * 10) + (highPriorityNews.length * 5);
  
  // Generate AI summary
  analysis.summary = generateAISummary(newsItems, analysis);
  
  return analysis;
}

function generateAISummary(newsItems, analysis) {
  if (newsItems.length === 0) {
    return "All systems nominal. The Imperium remains stable.";
  }
  
  const critical = newsItems.filter(n => n.priority === NEWS_PRIORITY.CRITICAL);
  const affectingPlayer = newsItems.filter(n => n.affects_player);
  
  if (critical.length > 0) {
    return `ALERT: ${critical.length} critical situation(s) detected. Immediate attention required. ${affectingPlayer.length} development(s) directly impact your operations.`;
  }
  
  if (analysis.urgency_score > 20) {
    return `High activity across the Imperium. ${newsItems.length} significant developments reported. Stay vigilant and monitor evolving situations.`;
  }
  
  return `${newsItems.length} development(s) reported across Imperial space. Situation stable but dynamic. Key areas: ${Object.keys(analysis.trending_topics).slice(0, 3).join(', ')}.`;
}