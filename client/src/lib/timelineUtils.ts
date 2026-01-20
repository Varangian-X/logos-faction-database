import { SavedScenario } from '../contexts/CampaignContext';

export interface TimelineEvent {
  year: number;
  missions: SavedScenario[];
  factionChanges: Record<string, number>; // faction -> reputation change
  dominantEvent: string; // Brief description of most significant event
}

export interface FactionTimeline {
  faction: string;
  events: Array<{
    year: number;
    reputation: number;
    status: 'allied' | 'neutral' | 'hostile';
    missionCount: number;
    lastMissionTitle: string;
  }>;
  trajectory: 'rising' | 'falling' | 'stable';
}

/**
 * Group missions by year and calculate faction changes per year
 */
export function generateTimelineEvents(missions: SavedScenario[]): TimelineEvent[] {
  const eventsByYear = new Map<number, TimelineEvent>();

  missions.forEach(mission => {
    if (!eventsByYear.has(mission.year)) {
      eventsByYear.set(mission.year, {
        year: mission.year,
        missions: [],
        factionChanges: {},
        dominantEvent: '',
      });
    }

    const event = eventsByYear.get(mission.year)!;
    event.missions.push(mission);

    // Track faction changes
    if (mission.factionReputation) {
      Object.entries(mission.factionReputation).forEach(([faction, rep]) => {
        if (!event.factionChanges[faction]) {
          event.factionChanges[faction] = 0;
        }
        // Calculate change from previous year
        const previousRep = missions
          .filter(m => m.year < mission.year && m.faction === faction)
          .reduce((max, m) => Math.max(max, m.factionReputation?.[faction] || 0), 0);
        event.factionChanges[faction] = rep - previousRep;
      });
    }
  });

  // Sort by year and determine dominant events
  return Array.from(eventsByYear.values())
    .sort((a, b) => a.year - b.year)
    .map(event => {
      // Find most significant mission by type
      const missionTypes = new Map<string, number>();
      event.missions.forEach(m => {
        missionTypes.set(m.type, (missionTypes.get(m.type) || 0) + 1);
      });

      let dominantType = 'General Operations';
      let maxCount = 0;
      missionTypes.forEach((count, type) => {
        if (count > maxCount) {
          maxCount = count;
          dominantType = type;
        }
      });

      return {
        ...event,
        dominantEvent: `${event.missions.length} ${dominantType} mission${event.missions.length > 1 ? 's' : ''}`,
      };
    });
}

/**
 * Track faction reputation evolution over time
 */
export function generateFactionTimelines(missions: SavedScenario[]): FactionTimeline[] {
  const factionMap = new Map<string, FactionTimeline>();

  // Initialize factions
  const factions = new Set<string>();
  missions.forEach(m => {
    factions.add(m.faction);
    if (m.factionReputation) {
      Object.keys(m.factionReputation).forEach(f => factions.add(f));
    }
  });

  factions.forEach(faction => {
    factionMap.set(faction, {
      faction,
      events: [],
      trajectory: 'stable',
    });
  });

  // Build timeline for each faction
  missions.sort((a, b) => a.year - b.year).forEach(mission => {
    const factions = new Set<string>();
    factions.add(mission.faction);
    if (mission.factionReputation) {
      Object.keys(mission.factionReputation).forEach(f => factions.add(f));
    }

    factions.forEach(faction => {
      const timeline = factionMap.get(faction);
      if (!timeline) return;

      const reputation = mission.factionReputation?.[faction] || 0;
      const status = reputation >= 50 ? 'allied' : reputation <= -50 ? 'hostile' : 'neutral';

      timeline.events.push({
        year: mission.year,
        reputation,
        status,
        missionCount: timeline.events.length + 1,
        lastMissionTitle: mission.title,
      });
    });
  });

  // Determine trajectory
  factionMap.forEach(timeline => {
    if (timeline.events.length < 2) {
      timeline.trajectory = 'stable';
      return;
    }

    const first = timeline.events[0].reputation;
    const last = timeline.events[timeline.events.length - 1].reputation;
    const diff = last - first;

    if (diff > 20) timeline.trajectory = 'rising';
    else if (diff < -20) timeline.trajectory = 'falling';
    else timeline.trajectory = 'stable';
  });

  return Array.from(factionMap.values());
}

/**
 * Calculate faction relationship changes between consecutive years
 */
export function calculateYearlyChanges(
  missions: SavedScenario[]
): Record<number, Record<string, number>> {
  const changes: Record<number, Record<string, number>> = {};

  const sortedMissions = [...missions].sort((a, b) => a.year - b.year);

  sortedMissions.forEach((mission, index) => {
    if (!changes[mission.year]) {
      changes[mission.year] = {};
    }

    if (mission.factionReputation) {
      Object.entries(mission.factionReputation).forEach(([faction, rep]) => {
        if (!changes[mission.year][faction]) {
          changes[mission.year][faction] = 0;
        }

        // Find previous reputation for this faction
        let previousRep = 0;
        for (let i = index - 1; i >= 0; i--) {
          const prevRep = sortedMissions[i].factionReputation?.[faction];
          if (prevRep !== undefined) {
            previousRep = prevRep;
            break;
          }
        }

        changes[mission.year][faction] = rep - previousRep;
      });
    }
  });

  return changes;
}

/**
 * Get mission count by type per year
 */
export function getMissionCountByType(missions: SavedScenario[]): Record<number, Record<string, number>> {
  const counts: Record<number, Record<string, number>> = {};

  missions.forEach(mission => {
    if (!counts[mission.year]) {
      counts[mission.year] = {};
    }
    counts[mission.year][mission.type] = (counts[mission.year][mission.type] || 0) + 1;
  });

  return counts;
}

/**
 * Get mission success rate by year
 */
export function getSuccessRateByYear(missions: SavedScenario[]): Record<number, { success: number; total: number; rate: number }> {
  const rates: Record<number, { success: number; total: number; rate: number }> = {};

  missions.forEach(mission => {
    if (!rates[mission.year]) {
      rates[mission.year] = { success: 0, total: 0, rate: 0 };
    }
    rates[mission.year].total++;
    if (mission.status === 'completed') {
      rates[mission.year].success++;
    }
  });

  Object.values(rates).forEach(rate => {
    if (rate) {
      rate.rate = rate.total > 0 ? (rate.success / rate.total) * 100 : 0;
    }
  });

  return rates;
}

/**
 * Get year range for timeline
 */
export function getYearRange(missions: SavedScenario[]): { min: number; max: number } {
  if (missions.length === 0) {
    return { min: 0, max: 0 };
  }

  const years = missions.map(m => m.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  return {
    min: isFinite(minYear) ? minYear : 0,
    max: isFinite(maxYear) ? maxYear : 0,
  };
}
