import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SavedScenario } from '@/contexts/CampaignContext';
import {
  generateTimelineEvents,
  generateFactionTimelines,
  getYearRange,
  getSuccessRateByYear,
} from '@/lib/timelineUtils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MissionTimelineProps {
  missions: SavedScenario[];
}

export function MissionTimeline({ missions }: MissionTimelineProps) {
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);

  const timelineEvents = useMemo(() => generateTimelineEvents(missions), [missions]);
  const factionTimelines = useMemo(() => generateFactionTimelines(missions), [missions]);
  const successRates = useMemo(() => getSuccessRateByYear(missions), [missions]);
  const yearRange = useMemo(() => getYearRange(missions), [missions]);

  if (missions.length === 0) {
    return (
      <Card className="p-6 border border-amber-800/50 text-center">
        <p className="text-amber-200/60">No missions to display on timeline</p>
      </Card>
    );
  }

  const allFactions = new Set<string>();
  missions.forEach(m => {
    allFactions.add(m.faction);
    if (m.factionReputation) {
      Object.keys(m.factionReputation).forEach(f => allFactions.add(f));
    }
  });

  return (
    <div className="space-y-8">
      {/* Timeline Header */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-amber-100">Campaign Timeline</h3>
        <p className="text-sm text-amber-200/60">
          Years {yearRange.min} - {yearRange.max} • {missions.length} total missions
        </p>
      </div>

      {/* Faction Filter */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-amber-100 uppercase tracking-widest">Filter by Faction</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedFaction(null)}
            className={`px-3 py-1 rounded text-xs transition-all ${
              selectedFaction === null
                ? 'bg-amber-600 text-white'
                : 'bg-amber-900/20 text-amber-200 hover:bg-amber-900/40'
            }`}
          >
            All Factions
          </button>
          {Array.from(allFactions).map(faction => (
            <button
              key={faction}
              onClick={() => setSelectedFaction(faction)}
              className={`px-3 py-1 rounded text-xs transition-all ${
                selectedFaction === faction
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-900/20 text-amber-200 hover:bg-amber-900/40'
              }`}
            >
              {faction}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Events */}
      <div className="space-y-4">
        {timelineEvents.map(event => {
          const successRate = successRates[event.year];
          const filteredMissions = selectedFaction
            ? event.missions.filter(m => m.faction === selectedFaction)
            : event.missions;

          if (filteredMissions.length === 0) return null;

          return (
            <div key={event.year} className="space-y-2">
              {/* Year Header */}
              <button
                onClick={() => setExpandedYear(expandedYear === event.year ? null : event.year)}
                className="w-full"
              >
                <Card className="p-4 border border-amber-800/50 hover:border-amber-700/70 transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-amber-100">Year {event.year}</span>
                        <span className="text-xs px-2 py-1 rounded bg-amber-900/30 text-amber-200">
                          {filteredMissions.length} mission{filteredMissions.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-sm text-amber-200/60 mt-1">{event.dominantEvent}</p>

                      {/* Success Rate */}
                      {successRate && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-32 h-2 bg-amber-900/30 rounded overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                successRate.rate >= 75
                                  ? 'bg-green-600'
                                  : successRate.rate >= 50
                                  ? 'bg-yellow-600'
                                  : 'bg-red-600'
                              }`}
                              style={{ width: `${successRate.rate}%` }}
                            />
                          </div>
                          <span className="text-xs text-amber-200/70">
                            {successRate.success}/{successRate.total} successful
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      {expandedYear === event.year ? (
                        <ChevronUp className="w-5 h-5 text-amber-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                  </div>
                </Card>
              </button>

              {/* Expanded Missions */}
              {expandedYear === event.year && (
                <div className="ml-4 space-y-2 border-l-2 border-amber-800/30 pl-4">
                  {filteredMissions.map(mission => (
                    <Card key={mission.id} className="p-3 border border-amber-800/30 bg-amber-900/10">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-amber-100 text-sm">{mission.title}</h4>
                          <p className="text-xs text-amber-200/60 mt-1">{mission.description}</p>

                          <div className="flex gap-2 mt-2">
                            <span className="text-xs px-2 py-0.5 rounded bg-blue-900/20 text-blue-300">
                              {mission.type}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-purple-900/20 text-purple-300">
                              {mission.faction}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded ${
                                mission.status === 'completed'
                                  ? 'bg-green-900/20 text-green-300'
                                  : mission.status === 'failed'
                                  ? 'bg-red-900/20 text-red-300'
                                  : 'bg-yellow-900/20 text-yellow-300'
                              }`}
                            >
                              {mission.status}
                            </span>
                          </div>

                          {/* Faction Reputation Changes */}
                          {mission.factionReputation && Object.keys(mission.factionReputation).length > 0 && (
                            <div className="mt-2 text-xs text-amber-200/50 space-y-1">
                              {Object.entries(mission.factionReputation).map(([faction, rep]) => (
                                <div key={faction} className="flex justify-between">
                                  <span>{faction}:</span>
                                  <span className={rep > 0 ? 'text-green-400' : rep < 0 ? 'text-red-400' : 'text-yellow-400'}>
                                    {rep > 0 ? '+' : ''}{rep}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Faction Relationship Evolution */}
      {factionTimelines.length > 0 && (
        <Card className="p-6 border border-amber-800/50 space-y-4">
          <h3 className="text-lg font-semibold text-amber-100">Faction Relationship Evolution</h3>

          <div className="space-y-4">
            {factionTimelines.map(factionTimeline => (
              <div key={factionTimeline.faction} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-100">{factionTimeline.faction}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      factionTimeline.trajectory === 'rising'
                        ? 'bg-green-900/20 text-green-300'
                        : factionTimeline.trajectory === 'falling'
                        ? 'bg-red-900/20 text-red-300'
                        : 'bg-yellow-900/20 text-yellow-300'
                    }`}
                  >
                    {factionTimeline.trajectory.toUpperCase()}
                  </span>
                </div>

                {/* Reputation Timeline */}
                <div className="flex items-end gap-1 h-16">
                  {factionTimeline.events.map((event, idx) => {
                    const normalized = (event.reputation + 100) / 200; // Normalize to 0-1
                    const height = Math.max(10, normalized * 100);

                    return (
                      <div
                        key={idx}
                        className="flex-1 relative group"
                        style={{ height: '100%' }}
                      >
                        <div
                          className={`w-full transition-all rounded-t ${
                            event.status === 'allied'
                              ? 'bg-green-600 hover:bg-green-500'
                              : event.status === 'hostile'
                              ? 'bg-red-600 hover:bg-red-500'
                              : 'bg-yellow-600 hover:bg-yellow-500'
                          }`}
                          style={{ height: `${height}%` }}
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                          <div>Year {event.year}</div>
                          <div>Rep: {event.reputation}</div>
                          <div>{event.status}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between text-xs text-amber-200/50">
                  <span>Year {factionTimeline.events[0]?.year}</span>
                  <span>Year {factionTimeline.events[factionTimeline.events.length - 1]?.year}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
