import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SavedScenario } from '@/contexts/CampaignContext';

interface FactionNode {
  name: string;
  reputation: number;
  status: 'allied' | 'neutral' | 'hostile';
  missionCount: number;
  influence: number;
}

interface FactionRelationshipNetworkProps {
  missions: SavedScenario[];
}

export function FactionRelationshipNetwork({ missions }: FactionRelationshipNetworkProps) {
  const factionData = useMemo(() => {
    const factions = new Map<string, FactionNode>();

    missions.forEach(mission => {
      // Add primary faction
      if (!factions.has(mission.faction)) {
        factions.set(mission.faction, {
          name: mission.faction,
          reputation: 0,
          status: 'neutral',
          missionCount: 0,
          influence: 0,
        });
      }

      const primary = factions.get(mission.faction)!;
      primary.missionCount++;

      // Update reputation from mission data
      if (mission.factionReputation?.[mission.faction] !== undefined) {
        primary.reputation = mission.factionReputation[mission.faction];
        primary.status =
          primary.reputation >= 50 ? 'allied' : primary.reputation <= -50 ? 'hostile' : 'neutral';
        primary.influence = Math.abs(primary.reputation);
      }

      // Add related factions
      if (mission.factionReputation) {
        Object.entries(mission.factionReputation).forEach(([faction, rep]) => {
          if (!factions.has(faction)) {
            factions.set(faction, {
              name: faction,
              reputation: rep,
              status: rep >= 50 ? 'allied' : rep <= -50 ? 'hostile' : 'neutral',
              missionCount: 0,
              influence: Math.abs(rep),
            });
          } else {
            const node = factions.get(faction)!;
            node.reputation = rep;
            node.status = rep >= 50 ? 'allied' : rep <= -50 ? 'hostile' : 'neutral';
            node.influence = Math.max(node.influence, Math.abs(rep));
          }
        });
      }
    });

    return Array.from(factions.values()).sort((a, b) => b.influence - a.influence);
  }, [missions]);

  if (missions.length === 0) {
    return (
      <Card className="p-6 border border-amber-800/50 text-center">
        <p className="text-amber-200/60">No faction data to display</p>
      </Card>
    );
  }

  const maxInfluence = Math.max(...factionData.map(f => f.influence), 1);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-amber-100">Faction Relationship Network</h3>
        <p className="text-sm text-amber-200/60">
          {factionData.length} factions involved • Sized by influence
        </p>
      </div>

      {/* Faction Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {factionData.map(faction => {
          const nodeSize = Math.max(80, (faction.influence / maxInfluence) * 200);
          const statusColors = {
            allied: 'border-green-600 bg-green-900/20 shadow-green-600/30',
            neutral: 'border-yellow-600 bg-yellow-900/20 shadow-yellow-600/30',
            hostile: 'border-red-600 bg-red-900/20 shadow-red-600/30',
          };

          return (
            <div key={faction.name} className="flex flex-col items-center space-y-3">
              {/* Faction Node */}
              <div
                className={`rounded-full border-2 flex items-center justify-center transition-all hover:shadow-lg ${statusColors[faction.status]}`}
                style={{
                  width: `${nodeSize}px`,
                  height: `${nodeSize}px`,
                  boxShadow: `0 0 ${nodeSize / 4}px ${statusColors[faction.status].split(' ')[3]}`,
                }}
              >
                <div className="text-center">
                  <p className="font-bold text-amber-100 text-sm leading-tight">{faction.name}</p>
                  <p className="text-xs text-amber-200/70 mt-1">{faction.status.toUpperCase()}</p>
                </div>
              </div>

              {/* Faction Stats */}
              <Card className="w-full p-3 border border-amber-800/30 bg-amber-900/10">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-amber-200/60">Reputation:</span>
                    <span
                      className={
                        faction.reputation > 0
                          ? 'text-green-400'
                          : faction.reputation < 0
                          ? 'text-red-400'
                          : 'text-yellow-400'
                      }
                    >
                      {faction.reputation > 0 ? '+' : ''}
                      {faction.reputation}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-amber-200/60">Missions:</span>
                    <span className="text-amber-100">{faction.missionCount}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-amber-200/60">Influence:</span>
                    <span className="text-amber-100">{faction.influence}</span>
                  </div>

                  {/* Reputation Bar */}
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-amber-900/30 rounded overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          faction.status === 'allied'
                            ? 'bg-green-600'
                            : faction.status === 'hostile'
                            ? 'bg-red-600'
                            : 'bg-yellow-600'
                        }`}
                        style={{ width: `${Math.min(100, (faction.reputation + 100) / 2)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <Card className="p-4 border border-amber-800/50">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-amber-100">Legend</p>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-green-600 bg-green-900/20" />
              <span className="text-amber-200">Allied (≥50)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-yellow-600 bg-yellow-900/20" />
              <span className="text-amber-200">Neutral (-50 to 50)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-red-600 bg-red-900/20" />
              <span className="text-amber-200">Hostile (≤-50)</span>
            </div>
          </div>
          <p className="text-xs text-amber-200/60 mt-3">
            Node size represents faction influence. Larger nodes indicate greater involvement in the campaign.
          </p>
        </div>
      </Card>
    </div>
  );
}
