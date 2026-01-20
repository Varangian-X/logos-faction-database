// Procedural Content Manager - Coordinates all procedural generation

import { generateProceduralLocation, generateLocationCluster, shouldRevealProceduralLocation } from './ProceduralLocationGenerator';
import { generateProceduralQuest } from './ProceduralQuestGenerator';
import { generateProceduralEvent, generateEventCascade } from './ProceduralEventGenerator';

export class ProceduralContentManager {
  constructor() {
    this.generatedLocations = [];
    this.generatedQuests = [];
    this.generatedEvents = [];
    this.lastGenerationTurn = 0;
  }
  
  // Main update function - call each turn
  updateProceduralContent(gameState, factions, activeEvents, newsContext) {
    const results = {
      new_locations: [],
      new_quests: [],
      new_events: [],
      revealed_locations: []
    };
    
    // Generate new content periodically
    const turnsSinceLastGen = gameState.turn_number - this.lastGenerationTurn;
    
    if (turnsSinceLastGen >= 5 || this.generatedLocations.length < 3) {
      // Generate locations
      if (Math.random() > 0.5 || this.generatedLocations.length === 0) {
        const newLocation = generateProceduralLocation(
          Date.now() + gameState.turn_number,
          gameState
        );
        this.generatedLocations.push(newLocation);
        results.new_locations.push(newLocation);
      }
      
      // Generate quests
      if (Math.random() > 0.6 || this.generatedQuests.filter(q => q.status === 'available').length < 2) {
        const newQuest = generateProceduralQuest(gameState, factions, activeEvents, newsContext);
        this.generatedQuests.push(newQuest);
        results.new_quests.push(newQuest);
      }
      
      this.lastGenerationTurn = gameState.turn_number;
    }
    
    // React to news - generate reactive events
    if (newsContext.length > 0) {
      const criticalNews = newsContext.filter(n => n.priority === 'critical');
      if (criticalNews.length > 0 && Math.random() > 0.7) {
        const reactiveEvent = generateProceduralEvent(gameState, criticalNews, factions, activeEvents);
        this.generatedEvents.push(reactiveEvent);
        results.new_events.push(reactiveEvent);
      }
    }
    
    // Check for event cascades
    activeEvents.forEach(event => {
      if (event.turns_remaining === 1 && event.severity === 'critical') {
        const cascade = generateEventCascade(event, gameState, factions);
        if (cascade) {
          this.generatedEvents.push(cascade);
          results.new_events.push(cascade);
        }
      }
    });
    
    // Reveal locations based on player progression
    this.generatedLocations.forEach(location => {
      if (!location.revealed && shouldRevealProceduralLocation(location, gameState)) {
        location.revealed = true;
        results.revealed_locations.push(location);
      }
    });
    
    // Clean up old content
    this.cleanupOldContent(gameState.turn_number);
    
    return results;
  }
  
  // Generate initial content for new game
  initializeProceduralContent(gameState, factions) {
    // Generate 2-3 starting locations
    const startingLocations = generateLocationCluster(3, gameState);
    this.generatedLocations.push(...startingLocations);
    
    // Generate 2 starting quests
    for (let i = 0; i < 2; i++) {
      const quest = generateProceduralQuest(gameState, factions, [], []);
      this.generatedQuests.push(quest);
    }
    
    this.lastGenerationTurn = gameState.turn_number;
    
    return {
      locations: startingLocations,
      quests: this.generatedQuests
    };
  }
  
  // Get available quests for player
  getAvailableQuests(gameState) {
    return this.generatedQuests.filter(quest => {
      if (quest.status !== 'available') return false;
      
      // Check requirements
      const reqs = quest.requirements || {};
      if (reqs.min_reputation && gameState.reputation < reqs.min_reputation) return false;
      if (reqs.min_skill_level) {
        const hasSkill = Object.values(gameState.skills || {}).some(skill => 
          skill.level >= reqs.min_skill_level
        );
        if (!hasSkill) return false;
      }
      
      return true;
    });
  }
  
  // Get revealed locations
  getRevealedLocations() {
    return this.generatedLocations.filter(loc => loc.revealed || !loc.discoveryRequirements);
  }
  
  // Get active generated events
  getActiveEvents(currentTurn) {
    return this.generatedEvents.filter(event => {
      const age = currentTurn - event.triggered_turn;
      return age <= event.duration;
    });
  }
  
  // Clean up expired content
  cleanupOldContent(currentTurn) {
    // Remove failed quests older than 20 turns
    this.generatedQuests = this.generatedQuests.filter(quest => {
      if (quest.status === 'failed' || quest.status === 'expired') {
        const age = currentTurn - (quest.generatedTurn || 0);
        return age < 20;
      }
      return true;
    });
    
    // Remove completed events older than 15 turns
    this.generatedEvents = this.generatedEvents.filter(event => {
      const age = currentTurn - event.triggered_turn;
      return age < event.duration + 15;
    });
    
    // Keep all locations (player might discover later)
  }
  
  // Get generation statistics
  getStatistics() {
    return {
      total_locations: this.generatedLocations.length,
      revealed_locations: this.generatedLocations.filter(l => l.revealed).length,
      total_quests: this.generatedQuests.length,
      available_quests: this.generatedQuests.filter(q => q.status === 'available').length,
      completed_quests: this.generatedQuests.filter(q => q.status === 'completed').length,
      total_events: this.generatedEvents.length
    };
  }
}

// Create singleton instance
export const proceduralContentManager = new ProceduralContentManager();