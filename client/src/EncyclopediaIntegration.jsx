// Encyclopedia Integration - Auto-populate from game events

import { 
  processLocationForEncyclopedia,
  processFactionForEncyclopedia,
  processNPCForEncyclopedia,
  processQuestForEncyclopedia,
  processCompanionForEncyclopedia,
  processEventForEncyclopedia,
  ENCYCLOPEDIA_CATEGORIES
} from './EncyclopediaSystem';

// Auto-update encyclopedia from game state changes
export function updateEncyclopediaFromGameState(encyclopediaManager, gameState, factions, npcs, companions, quests, activeEvents, proceduralContent) {
  const updates = [];
  
  // Add discovered locations
  const discoveredLocations = gameState.discovered_locations || [];
  discoveredLocations.forEach(locationId => {
    // Find location data (could be from static or procedural)
    const location = findLocation(locationId, proceduralContent);
    if (location && !encyclopediaManager.getEntry(ENCYCLOPEDIA_CATEGORIES.LOCATIONS, locationId)) {
      const entry = encyclopediaManager.addEntry(
        ENCYCLOPEDIA_CATEGORIES.LOCATIONS,
        locationId,
        processLocationForEncyclopedia(location, gameState)
      );
      updates.push({ category: 'location', entry });
    }
  });
  
  // Add known factions (those with relationship != 0)
  factions.forEach(faction => {
    const standing = gameState.faction_relations?.[faction.faction_id] || 0;
    if (Math.abs(standing) > 0 || gameState.turn_number > 1) {
      const existing = encyclopediaManager.getEntry(ENCYCLOPEDIA_CATEGORIES.FACTIONS, faction.faction_id);
      const entry = encyclopediaManager.addEntry(
        ENCYCLOPEDIA_CATEGORIES.FACTIONS,
        faction.faction_id,
        processFactionForEncyclopedia(faction, gameState)
      );
      if (!existing) updates.push({ category: 'faction', entry });
    }
  });
  
  // Add encountered NPCs
  npcs.forEach(npc => {
    if (npc.last_interaction_turn) {
      const existing = encyclopediaManager.getEntry(ENCYCLOPEDIA_CATEGORIES.NPCS, npc.id);
      const entry = encyclopediaManager.addEntry(
        ENCYCLOPEDIA_CATEGORIES.NPCS,
        npc.id,
        processNPCForEncyclopedia(npc, gameState)
      );
      if (!existing) updates.push({ category: 'npc', entry });
    }
  });
  
  // Add recruited companions
  companions.filter(c => c.is_recruited).forEach(companion => {
    const existing = encyclopediaManager.getEntry(ENCYCLOPEDIA_CATEGORIES.COMPANIONS, companion.id);
    const entry = encyclopediaManager.addEntry(
      ENCYCLOPEDIA_CATEGORIES.COMPANIONS,
      companion.id,
      processCompanionForEncyclopedia(companion, gameState)
    );
    if (!existing) updates.push({ category: 'companion', entry });
  });
  
  // Add active and completed quests
  quests.forEach(quest => {
    if (quest.status === 'active' || quest.status === 'completed') {
      const existing = encyclopediaManager.getEntry(ENCYCLOPEDIA_CATEGORIES.QUESTS, quest.quest_id);
      const entry = encyclopediaManager.addEntry(
        ENCYCLOPEDIA_CATEGORIES.QUESTS,
        quest.quest_id,
        processQuestForEncyclopedia(quest, gameState)
      );
      if (!existing) updates.push({ category: 'quest', entry });
    }
  });
  
  // Add active events
  activeEvents.forEach(event => {
    const existing = encyclopediaManager.getEntry(ENCYCLOPEDIA_CATEGORIES.EVENTS, event.id);
    const entry = encyclopediaManager.addEntry(
      ENCYCLOPEDIA_CATEGORIES.EVENTS,
      event.id,
      processEventForEncyclopedia(event, gameState)
    );
    if (!existing) updates.push({ category: 'event', entry });
  });
  
  return updates;
}

function findLocation(locationId, proceduralContent) {
  // Try to find in procedural locations
  if (proceduralContent?.locations) {
    const found = proceduralContent.locations.find(loc => loc.id === locationId);
    if (found) return found;
  }
  
  // Could also check static locations from LocationData
  // For now, return null if not found
  return null;
}