import { describe, it, expect } from 'vitest';
import {
  calculateTotalPowerScore,
  getFactionMetrics,
  getAllFactionsSorted,
  getFactionRelationship,
  topFactions,
  factionMetricsData,
} from './factionMetrics';

describe('Faction Metrics', () => {
  describe('calculateTotalPowerScore', () => {
    it('should calculate total power score using weighted formula', () => {
      const military = 24;
      const economic = 25;
      const political = 26;
      const expected = military * 0.35 + economic * 0.35 + political * 0.3;
      const result = calculateTotalPowerScore(military, economic, political);
      expect(result).toBeCloseTo(expected, 2);
    });

    it('should give equal weight to military and economic (35% each)', () => {
      const score1 = calculateTotalPowerScore(30, 0, 0);
      const score2 = calculateTotalPowerScore(0, 30, 0);
      expect(score1).toBeCloseTo(score2, 2);
    });

    it('should give lower weight to political (30%)', () => {
      const militaryScore = calculateTotalPowerScore(30, 0, 0);
      const politicalScore = calculateTotalPowerScore(0, 0, 30);
      expect(militaryScore).toBeGreaterThan(politicalScore);
    });
  });

  describe('getFactionMetrics', () => {
    it('should return faction metrics by ID', () => {
      const metrics = getFactionMetrics('neo-praetorians');
      expect(metrics).toBeDefined();
      expect(metrics?.factionName).toBe('Neo-Praetorians');
      expect(metrics?.alignment).toBe('Stasis');
    });

    it('should return undefined for non-existent faction', () => {
      const metrics = getFactionMetrics('non-existent');
      expect(metrics).toBeUndefined();
    });

    it('should have calculated total power score matching formula', () => {
      const metrics = getFactionMetrics('neo-praetorians');
      if (metrics) {
        const calculated = calculateTotalPowerScore(
          metrics.militaryStrength,
          metrics.economicPower,
          metrics.politicalInfluence
        );
        expect(metrics.totalPowerScore).toBeCloseTo(calculated, 2);
      }
    });
  });

  describe('getAllFactionsSorted', () => {
    it('should return all factions sorted by power score descending', () => {
      const sorted = getAllFactionsSorted();
      expect(sorted.length).toBeGreaterThan(0);
      
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].totalPowerScore).toBeGreaterThanOrEqual(
          sorted[i + 1].totalPowerScore
        );
      }
    });

    it('should include all factions from factionMetricsData', () => {
      const sorted = getAllFactionsSorted();
      const dataCount = Object.keys(factionMetricsData).length;
      expect(sorted.length).toBe(dataCount);
    });
  });

  describe('topFactions', () => {
    it('should contain exactly 5 factions', () => {
      expect(topFactions.length).toBe(5);
    });

    it('should be sorted by power score descending', () => {
      for (let i = 0; i < topFactions.length - 1; i++) {
        expect(topFactions[i].totalPowerScore).toBeGreaterThanOrEqual(
          topFactions[i + 1].totalPowerScore
        );
      }
    });

    it('should include EXISTENTIAL threat factions', () => {
      const existentialCount = topFactions.filter(
        (f) => f.threatLevel === 'EXISTENTIAL'
      ).length;
      expect(existentialCount).toBeGreaterThan(0);
    });

    it('should have The Sidhe and Mycenoids in top 5', () => {
      const factionIds = topFactions.map((f) => f.factionId);
      expect(factionIds).toContain('the-sidhe');
      expect(factionIds).toContain('mycenoids');
    });
  });

  describe('getFactionRelationship', () => {
    it('should return ally for natural allies', () => {
      const relationship = getFactionRelationship(
        'neo-praetorians',
        'ecclesiarchy'
      );
      expect(relationship).toBe('ally');
    });

    it('should return enemy for natural enemies', () => {
      const relationship = getFactionRelationship(
        'neo-praetorians',
        'neo-varangians'
      );
      expect(relationship).toBe('enemy');
    });

    it('should return neutral for unrelated factions', () => {
      const relationship = getFactionRelationship(
        'neo-praetorians',
        'aether-nomads'
      );
      expect(relationship).toBe('neutral');
    });

    it('should return neutral for non-existent factions', () => {
      const relationship = getFactionRelationship(
        'non-existent',
        'neo-praetorians'
      );
      expect(relationship).toBe('neutral');
    });

    it('should be bidirectional (symmetric)', () => {
      const rel1 = getFactionRelationship('neo-praetorians', 'ecclesiarchy');
      const rel2 = getFactionRelationship('ecclesiarchy', 'neo-praetorians');
      // Note: This test assumes relationships are symmetric in the data
      // If they're not, this test should be adjusted
      expect(rel1).toBe(rel2);
    });
  });

  describe('Faction Data Integrity', () => {
    it('should have all required properties for each faction', () => {
      topFactions.forEach((faction) => {
        expect(faction.factionId).toBeDefined();
        expect(faction.factionName).toBeDefined();
        expect(faction.alignment).toBeDefined();
        expect(faction.militaryStrength).toBeGreaterThan(0);
        expect(faction.economicPower).toBeGreaterThan(0);
        expect(faction.politicalInfluence).toBeGreaterThan(0);
        expect(faction.totalPowerScore).toBeGreaterThan(0);
        expect(faction.threatLevel).toBeDefined();
        expect(faction.primaryResources.length).toBeGreaterThan(0);
        expect(faction.signatureUnit).toBeDefined();
      });
    });

    it('should have valid alignment values', () => {
      topFactions.forEach((faction) => {
        expect(['Stasis', 'Plasticity', 'Neutral']).toContain(faction.alignment);
      });
    });

    it('should have valid threat levels', () => {
      topFactions.forEach((faction) => {
        expect(['EXISTENTIAL', 'HIGH', 'MODERATE', 'LOW']).toContain(
          faction.threatLevel
        );
      });
    });

    it('should have metrics in reasonable ranges', () => {
      topFactions.forEach((faction) => {
        expect(faction.militaryStrength).toBeLessThanOrEqual(30);
        expect(faction.economicPower).toBeLessThanOrEqual(30);
        expect(faction.politicalInfluence).toBeLessThanOrEqual(30);
        expect(faction.totalPowerScore).toBeLessThanOrEqual(30);
      });
    });
  });

  describe('Byzantine Pendulum Balance', () => {
    it('should have factions representing both Stasis and Plasticity', () => {
      const alignments = new Set(topFactions.map((f) => f.alignment));
      expect(alignments.size).toBeGreaterThan(1);
    });

    it('should have Neo-Praetorians as pure Stasis', () => {
      const neoPraetorians = getFactionMetrics('neo-praetorians');
      expect(neoPraetorians?.alignment).toBe('Stasis');
    });

    it('should have Neo-Varangians as pure Plasticity', () => {
      const neoVarangians = getFactionMetrics('neo-varangians');
      expect(neoVarangians?.alignment).toBe('Plasticity');
    });
  });
});
