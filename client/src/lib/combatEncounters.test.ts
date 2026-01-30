import { describe, it, expect } from 'vitest';
import {
  calculateEncounterFrequency,
  generateEncounter,
  type PlayerFactionStanding,
} from './combatEncounters';

describe('Combat Encounter System', () => {
  const mockPlayerStandings: PlayerFactionStanding[] = [
    { factionId: 'neo-praetorians', reputation: -80, relationship: 'hostile' },
    { factionId: 'neo-varangians', reputation: 50, relationship: 'friendly' },
    { factionId: 'ecclesiarchy', reputation: 0, relationship: 'neutral' },
  ];

  describe('calculateEncounterFrequency', () => {
    it('should return high frequency for hostile factions', () => {
      const frequency = calculateEncounterFrequency(
        'neo-praetorians',
        mockPlayerStandings,
        'inner-system'
      );
      
      expect(frequency).toBeGreaterThan(0.5);
    });

    it('should return low frequency for friendly factions', () => {
      const frequency = calculateEncounterFrequency(
        'neo-varangians',
        mockPlayerStandings,
        'inner-system'
      );
      
      expect(frequency).toBeLessThan(0.3);
    });

    it('should return moderate frequency for neutral factions', () => {
      const frequency = calculateEncounterFrequency(
        'ecclesiarchy',
        mockPlayerStandings,
        'inner-system'
      );
      
      expect(frequency).toBeGreaterThan(0.1);
      expect(frequency).toBeLessThan(0.5);
    });

    it('should increase frequency in deep space', () => {
      const innerFreq = calculateEncounterFrequency(
        'neo-praetorians',
        mockPlayerStandings,
        'inner-system'
      );
      
      const deepFreq = calculateEncounterFrequency(
        'neo-praetorians',
        mockPlayerStandings,
        'deep-space'
      );
      
      expect(deepFreq).toBeGreaterThan(innerFreq);
    });

    it('should return 0 for unknown factions', () => {
      const frequency = calculateEncounterFrequency(
        'unknown-faction',
        mockPlayerStandings,
        'inner-system'
      );
      
      expect(frequency).toBe(0);
    });
  });

  describe('generateEncounter', () => {
    it('should generate encounter with correct faction', () => {
      const encounter = generateEncounter(
        'neo-praetorians',
        mockPlayerStandings,
        'inner-system'
      );
      
      expect(encounter.factionId).toBe('neo-praetorians');
      expect(encounter.factionName).toBe('Neo-Praetorians');
    });

    it('should generate harder encounters for hostile factions', () => {
      const hostileEncounter = generateEncounter(
        'neo-praetorians',
        mockPlayerStandings,
        'inner-system'
      );
      
      const friendlyEncounter = generateEncounter(
        'neo-varangians',
        mockPlayerStandings,
        'inner-system'
      );
      
      expect(hostileEncounter.difficulty).toBeGreaterThanOrEqual(friendlyEncounter.difficulty);
    });

    it('should include signature unit in encounter', () => {
      const encounter = generateEncounter(
        'neo-praetorians',
        mockPlayerStandings,
        'inner-system'
      );
      
      expect(encounter.units.some(u => u.includes('Excubitor'))).toBe(true);
    });

    it('should scale difficulty with location danger', () => {
      const innerEncounter = generateEncounter(
        'neo-praetorians',
        mockPlayerStandings,
        'inner-system'
      );
      
      const deepEncounter = generateEncounter(
        'neo-praetorians',
        mockPlayerStandings,
        'deep-space'
      );
      
      expect(deepEncounter.difficulty).toBeGreaterThanOrEqual(innerEncounter.difficulty);
    });

    it('should return null for unknown faction', () => {
      const encounter = generateEncounter(
        'unknown-faction',
        mockPlayerStandings,
        'inner-system'
      );
      
      expect(encounter).toBeNull();
    });
  });
});
