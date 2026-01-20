// Encyclopedia System - Tracks and manages discovered game content

export const ENCYCLOPEDIA_CATEGORIES = {
  LOCATIONS: 'locations',
  FACTIONS: 'factions',
  NPCS: 'npcs',
  QUESTS: 'quests',
  EVENTS: 'events',
  LORE: 'lore',
  TECHNOLOGY: 'technology',
  COMPANIONS: 'companions'
};

export class EncyclopediaManager {
  constructor() {
    this.entries = new Map();
    this.discoveredCategories = new Set();
  }
  
  // Add or update an entry
  addEntry(category, id, data) {
    const entryKey = `${category}_${id}`;
    
    const entry = {
      id,
      category,
      title: data.title || data.name || 'Unknown',
      discovered_turn: data.discovered_turn || 0,
      discovered_date: Date.now(),
      raw_data: data,
      summary: data.summary || null,
      details: data.details || null,
      related_entries: data.related_entries || [],
      tags: data.tags || [],
      importance: data.importance || 'normal', // low, normal, high, critical
      last_updated: Date.now()
    };
    
    this.entries.set(entryKey, entry);
    this.discoveredCategories.add(category);
    
    return entry;
  }
  
  // Get entry by category and id
  getEntry(category, id) {
    return this.entries.get(`${category}_${id}`);
  }
  
  // Get all entries in a category
  getEntriesByCategory(category) {
    return Array.from(this.entries.values()).filter(e => e.category === category);
  }
  
  // Search entries
  searchEntries(query) {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.entries.values()).filter(entry => 
      entry.title.toLowerCase().includes(lowerQuery) ||
      entry.summary?.toLowerCase().includes(lowerQuery) ||
      entry.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
  
  // Get statistics
  getStatistics() {
    const stats = {};
    Object.values(ENCYCLOPEDIA_CATEGORIES).forEach(cat => {
      stats[cat] = this.getEntriesByCategory(cat).length;
    });
    stats.total = this.entries.size;
    return stats;
  }
  
  // Export for persistence
  export() {
    return {
      entries: Array.from(this.entries.entries()),
      categories: Array.from(this.discoveredCategories)
    };
  }
  
  // Import from saved data
  import(data) {
    if (data.entries) {
      this.entries = new Map(data.entries);
    }
    if (data.categories) {
      this.discoveredCategories = new Set(data.categories);
    }
  }
}

// Process location for encyclopedia
export function processLocationForEncyclopedia(location, gameState) {
  return {
    title: location.name,
    name: location.name,
    discovered_turn: gameState.turn_number,
    summary: location.description,
    details: {
      type: location.type || 'Unknown',
      sector: location.sector,
      tier: location.tier,
      coordinates: location.coordinates,
      atmosphere: location.atmosphere,
      theme: location.theme,
      features: location.features?.map(f => f.name) || [],
      resources: location.resources || [],
      npcs: location.npcs || [],
      dangers: location.dangers || [],
      isGenerated: location.isGenerated || false
    },
    tags: [
      location.tier,
      location.theme,
      location.sector,
      ...(location.factionPresence || [])
    ],
    importance: location.theme === 'mysterious' ? 'high' : 'normal',
    related_entries: location.factionPresence?.map(f => `factions_${f}`) || []
  };
}

// Process faction for encyclopedia
export function processFactionForEncyclopedia(faction, gameState) {
  const standing = gameState.faction_relations?.[faction.faction_id] || 0;
  
  return {
    title: faction.name,
    name: faction.name,
    discovered_turn: gameState.turn_number,
    summary: `A major Imperial faction with ${faction.power_level || 50} power. Your standing: ${standing > 0 ? 'Positive' : standing < 0 ? 'Negative' : 'Neutral'} (${standing}).`,
    details: {
      faction_id: faction.faction_id,
      power_level: faction.power_level,
      resources: faction.resources,
      current_standing: standing,
      current_agenda: faction.current_agenda,
      territory_control: faction.territory_control || [],
      active_operations: faction.active_operations?.length || 0,
      alliances: faction.alliances || [],
      rivalries: faction.rivalries || []
    },
    tags: [
      faction.faction_id,
      standing > 20 ? 'allied' : standing < -20 ? 'hostile' : 'neutral',
      'major_faction'
    ],
    importance: Math.abs(standing) > 50 ? 'high' : 'normal',
    related_entries: [
      ...(faction.territory_control?.map(loc => `locations_${loc}`) || []),
      ...(faction.alliances?.map(f => `factions_${f}`) || [])
    ]
  };
}

// Process NPC for encyclopedia
export function processNPCForEncyclopedia(npc, gameState) {
  const relationship = npc.relationship_to_player || 0;
  
  return {
    title: npc.name,
    name: npc.name,
    discovered_turn: gameState.turn_number,
    summary: `${npc.title || 'Individual'} of ${npc.faction_affiliation}. ${npc.personality || 'Personality unknown'}.`,
    details: {
      title: npc.title,
      location: npc.current_location,
      faction: npc.faction_affiliation,
      personality: npc.personality,
      background: npc.background,
      agenda: npc.agenda,
      relationship: relationship,
      mood: npc.mood || 'neutral',
      last_interaction: npc.last_interaction_turn
    },
    tags: [
      npc.faction_affiliation,
      npc.current_location,
      relationship > 50 ? 'ally' : relationship < -50 ? 'enemy' : 'neutral'
    ],
    importance: relationship > 60 || relationship < -60 ? 'high' : 'normal',
    related_entries: [
      `factions_${npc.faction_affiliation}`,
      `locations_${npc.current_location}`
    ]
  };
}

// Process quest for encyclopedia
export function processQuestForEncyclopedia(quest, gameState) {
  return {
    title: quest.title,
    name: quest.title,
    discovered_turn: gameState.turn_number,
    summary: quest.description,
    details: {
      quest_type: quest.quest_type || quest.type,
      complexity: quest.complexity,
      status: quest.status,
      faction_sponsor: quest.faction_sponsor,
      rewards: quest.rewards,
      stages_completed: quest.current_stage || 0,
      total_stages: quest.stages?.length || 0,
      isGenerated: quest.isGenerated || false,
      branching: quest.branching_paths?.length > 0
    },
    tags: [
      quest.quest_type || quest.type,
      quest.complexity,
      quest.status,
      quest.faction_sponsor
    ].filter(Boolean),
    importance: quest.complexity === 'epic' || quest.complexity === 'very_high' ? 'high' : 'normal',
    related_entries: quest.faction_sponsor ? [`factions_${quest.faction_sponsor}`] : []
  };
}

// Process companion for encyclopedia
export function processCompanionForEncyclopedia(companion, gameState) {
  return {
    title: companion.name,
    name: companion.name,
    discovered_turn: gameState.turn_number,
    summary: `${companion.title || 'Companion'}. ${companion.personality || 'Loyal ally'}.`,
    details: {
      title: companion.title,
      faction: companion.faction_affiliation,
      background: companion.background,
      loyalty: companion.loyalty,
      trust: companion.trust,
      combat_role: companion.combat_role,
      personal_quest: companion.personal_quest?.title,
      recruited: companion.is_recruited
    },
    tags: [
      companion.faction_affiliation,
      companion.combat_role,
      companion.is_recruited ? 'recruited' : 'available'
    ],
    importance: companion.is_recruited ? 'high' : 'normal',
    related_entries: [`factions_${companion.faction_affiliation}`]
  };
}

// Process event for encyclopedia
export function processEventForEncyclopedia(event, gameState) {
  return {
    title: event.name,
    name: event.name,
    discovered_turn: event.triggered_turn || gameState.turn_number,
    summary: event.description,
    details: {
      event_type: event.event_type,
      severity: event.severity,
      duration: event.duration,
      turns_remaining: event.turns_remaining,
      affects_systems: event.affects_systems || [],
      isGenerated: event.isGenerated || false
    },
    tags: [
      event.event_type,
      event.severity,
      'world_event'
    ],
    importance: event.severity === 'critical' ? 'critical' : event.severity === 'major' ? 'high' : 'normal',
    related_entries: []
  };
}

// Generate AI summary for complex entries
export async function generateAISummary(entry) {
  // Only generate for complex or important entries
  if (entry.importance === 'low' && entry.details && Object.keys(entry.details).length < 5) {
    return entry.summary; // Use existing summary for simple entries
  }
  
  const prompt = `Summarize this encyclopedia entry in 2-3 engaging sentences for a Byzantine sci-fi game:

Title: ${entry.title}
Category: ${entry.category}
Current Summary: ${entry.summary || 'No summary'}
Details: ${JSON.stringify(entry.details, null, 2)}

Write a concise, atmospheric summary that captures the essence and importance of this entry.`;
  
  try {
    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' }
        }
      }
    });
    
    return response.summary;
  } catch (error) {
    console.error('Failed to generate AI summary:', error);
    return entry.summary; // Fallback to existing
  }
}