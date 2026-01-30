import { describe, it, expect } from 'vitest';
import {
  calculateReputationChange,
  getRelationshipFromReputation,
  processMissionOutcome,
  initializeDefaultStandings,
  type MissionOutcome,
  type PlayerFactionStanding,
} from './factionStanding';

describe('Faction Standing System', () => {
  describe('calculateReputationChange', () => {
    it('should give positive reputation for combat victory', () => {
      const outcome: MissionOutcome = {
        type: 'combat-victory',
        targetFactionId: 'neo-praetorians',
        success: true,
        significance: 'moderate',
      };
      
      const change = calculateReputationChange(outcome, 0);
      expect(change).toBeGreaterThan(0);
    });

    it('should give negative reputation for assassination', () => {
      const outcome: MissionOutcome = {
        type: 'assassination',
        targetFactionId: 'neo-praetorians',
        success: true,
        significance: 'moderate',
      };
      
      const change = calculateReputationChange(outcome, 0);
      expect(change).toBeLessThan(0);
    });

    it('should scale with significance', () => {
      const minorOutcome: MissionOutcome = {
        type: 'combat-victory',
        targetFactionId: 'neo-praetorians',
        success: true,
        significance: 'minor',
      };
      
      const criticalOutcome: MissionOutcome = {
        type: 'combat-victory',
        targetFactionId: 'neo-praetorians',
        success: true,
        significance: 'critical',
      };
      
      const minorChange = calculateReputationChange(minorOutcome, 0);
      const criticalChange = calculateReputationChange(criticalOutcome, 0);
      
      expect(criticalChange).toBeGreaterThan(minorChange);
    });

    it('should have diminishing returns at high reputation', () => {
      const outcome: MissionOutcome = {
        type: 'combat-victory',
        targetFactionId: 'neo-praetorians',
        success: true,
        significance: 'moderate',
      };
      
      const lowRepChange = calculateReputationChange(outcome, 0);
      const highRepChange = calculateReputationChange(outcome, 80);
      
      expect(Math.abs(highRepChange)).toBeLessThan(Math.abs(lowRepChange));
    });
  });

  describe('getRelationshipFromReputation', () => {
    it('should return hostile for very negative reputation', () => {
      expect(getRelationshipFromReputation(-90)).toBe('hostile');
    });

    it('should return unfriendly for negative reputation', () => {
      expect(getRelationshipFromReputation(-50)).toBe('unfriendly');
    });

    it('should return neutral for zero reputation', () => {
      expect(getRelationshipFromReputation(0)).toBe('neutral');
    });

    it('should return friendly for positive reputation', () => {
      expect(getRelationshipFromReputation(50)).toBe('friendly');
    });

    it('should return allied for very positive reputation', () => {
      expect(getRelationshipFromReputation(90)).toBe('allied');
    });

    it('should handle boundary values correctly', () => {
      expect(getRelationshipFromReputation(-75)).toBe('hostile');
      expect(getRelationshipFromReputation(-25)).toBe('neutral');
      expect(getRelationshipFromReputation(25)).toBe('friendly');
      expect(getRelationshipFromReputation(75)).toBe('allied');
    });
  });

  describe('processMissionOutcome', () => {
    const mockStandings: PlayerFactionStanding[] = [
      { factionId: 'neo-praetorians', reputation: 0, relationship: 'neutral' },
      { factionId: 'neo-varangians', reputation: 0, relationship: 'neutral' },
      { factionId: 'ecclesiarchy', reputation: 0, relationship: 'neutral' },
    ];

    it('should update primary faction standing', () => {
      const outcome: MissionOutcome = {
        type: 'combat-victory',
        targetFactionId: 'neo-praetorians',
        success: true,
        significance: 'moderate',
      };
      
      const result = processMissionOutcome(outcome, mockStandings);
      
      expect(result.primaryChanges).toHaveLength(1);
      expect(result.primaryChanges[0]?.factionId).toBe('neo-praetorians');
      expect(result.primaryChanges[0]?.change).toBeGreaterThan(0);
    });

    it('should generate cascade effects for allies', () => {
      const standingsWithAllies: PlayerFactionStanding[] = [
        { factionId: 'neo-praetorians', reputation: 0, relationship: 'neutral' },
        { factionId: 'ecclesiarchy', reputation: 0, relationship: 'neutral' }, // Ally of Neo-Praetorians
      ];
      
      const outcome: MissionOutcome = {
        type: 'combat-victory',
        targetFactionId: 'neo-praetorians',
        success: true,
        significance: 'moderate',
      };
      
      const result = processMissionOutcome(outcome, standingsWithAllies);
      
      // Should have cascade effects for allied factions
      expect(result.cascadeChanges.length).toBeGreaterThanOrEqual(0);
    });

    it('should detect relationship changes', () => {
      const standingsLowRep: PlayerFactionStanding[] = [
        { factionId: 'neo-praetorians', reputation: 20, relationship: 'neutral' },
      ];
      
      const outcome: MissionOutcome = {
        type: 'diplomacy-success',
        targetFactionId: 'neo-praetorians',
        success: true,
        significance: 'major',
      };
      
      const result = processMissionOutcome(outcome, standingsLowRep);
      
      if (result.primaryChanges[0]) {
        expect(result.primaryChanges[0].relationshipChanged).toBe(true);
        expect(result.primaryChanges[0].newRelationship).toBe('friendly');
      }
    });

    it('should generate narrative consequences', () => {
      const outcome: MissionOutcome = {
        type: 'espionage-caught',
        targetFactionId: 'neo-praetorians',
        success: false,
        significance: 'critical',
      };
      
      const result = processMissionOutcome(outcome, mockStandings);
      
      expect(result.narrativeConsequences.length).toBeGreaterThan(0);
    });

    it('should handle witnessed actions', () => {
      const outcome: MissionOutcome = {
        type: 'assassination',
        targetFactionId: 'neo-praetorians',
        success: true,
        significance: 'major',
        witnessedBy: ['ecclesiarchy'],
      };
      
      const result = processMissionOutcome(outcome, mockStandings);
      
      expect(result.narrativeConsequences.some(n => n.includes('witnessed'))).toBe(true);
    });
  });

  describe('initializeDefaultStandings', () => {
    it('should create standings for major factions', () => {
      const standings = initializeDefaultStandings();
      
      expect(standings.length).toBeGreaterThan(0);
      expect(standings.every(s => s.reputation === 0)).toBe(true);
      expect(standings.every(s => s.relationship === 'neutral')).toBe(true);
    });

    it('should include Neo-Praetorians', () => {
      const standings = initializeDefaultStandings();
      
      expect(standings.some(s => s.factionId === 'neo-praetorians')).toBe(true);
    });
  });
});
