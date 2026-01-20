import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SavedScenario } from '@/contexts/CampaignContext';
import { useCampaign } from '@/contexts/CampaignContext';
import { calculateCampaignState, calculateFactionStanding } from '@/lib/factionDynamics';

interface CampaignBranchingProps {
  missions: SavedScenario[];
  onMissionSelect?: (mission: SavedScenario) => void;
}

export function CampaignBranching({ missions, onMissionSelect }: CampaignBranchingProps) {
  const { getMissionChain, getAvailableBranches } = useCampaign();

  const campaignState = useMemo(() => {
    return calculateCampaignState(missions);
  }, [missions]);

  // Find root missions (no parent)
  const rootMissions = missions.filter(m => !m.parentMissionId);

  const renderMissionNode = (mission: SavedScenario, depth: number = 0) => {
    const branches = getAvailableBranches(mission.id);
    const factionRep = mission.factionReputation?.[mission.faction] || 0;
    const standing = calculateFactionStanding(factionRep);

    const standingColors = {
      allied: 'text-green-400 bg-green-900/20',
      neutral: 'text-yellow-400 bg-yellow-900/20',
      hostile: 'text-red-400 bg-red-900/20',
    };

    const statusColors = {
      active: 'border-amber-600 bg-amber-900/20',
      completed: 'border-green-600 bg-green-900/20',
      failed: 'border-red-600 bg-red-900/20',
    };

    return (
      <div key={mission.id} className={`ml-${depth * 4}`}>
        <Card
          className={`p-4 cursor-pointer transition-all border-2 hover:shadow-lg ${statusColors[mission.status]}`}
          onClick={() => onMissionSelect?.(mission)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-amber-100 mb-1">{mission.title}</h4>
              <p className="text-xs text-amber-200/60 mb-2">{mission.type}</p>
              
              <div className="flex gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded ${standingColors[standing]}`}>
                  {standing.toUpperCase()}
                </span>
                <span className="text-xs px-2 py-1 rounded bg-blue-900/20 text-blue-300">
                  Year {mission.year}
                </span>
              </div>

              {mission.factionReputation && Object.keys(mission.factionReputation).length > 0 && (
                <div className="text-xs text-amber-200/50 mb-2">
                  Reputation: {Object.entries(mission.factionReputation)
                    .map(([f, r]) => `${f}: ${r > 0 ? '+' : ''}${r}`)
                    .join(' • ')}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className={`text-sm font-bold ${
                mission.status === 'completed' ? 'text-green-400' :
                mission.status === 'failed' ? 'text-red-400' :
                'text-yellow-400'
              }`}>
                {mission.status ? mission.status.toUpperCase() : 'ACTIVE'}
              </div>
            </div>
          </div>
        </Card>

        {branches.length > 0 && (
          <div className="mt-3 ml-4 border-l-2 border-amber-800/30 pl-4">
            {branches.map(branch => renderMissionNode(branch, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Campaign Overview */}
      <Card className="p-6 border border-amber-800/50">
        <h3 className="text-lg font-semibold text-amber-100 mb-4">Campaign Overview</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-amber-200/60 mb-1">Total Missions</p>
            <p className="text-2xl font-bold text-amber-100">{missions.length}</p>
          </div>
          <div>
            <p className="text-xs text-amber-200/60 mb-1">Dominant Faction</p>
            <p className="text-lg font-bold text-amber-100">
              {campaignState.dominantFaction || 'None'}
            </p>
          </div>
        </div>

        {/* Faction Standings */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-amber-100 mb-3">Faction Standings</p>
          {Object.values(campaignState.factionStandings).map(standing => (
            <div key={standing.faction} className="flex items-center justify-between text-sm">
              <span className="text-amber-200">{standing.faction}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-amber-900/30 rounded overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      standing.status === 'allied' ? 'bg-green-600' :
                      standing.status === 'hostile' ? 'bg-red-600' :
                      'bg-yellow-600'
                    }`}
                    style={{ width: `${Math.min(100, (standing.reputation + 100) / 2)}%` }}
                  />
                </div>
                <span className={`text-xs font-semibold ${
                  standing.reputation > 0 ? 'text-green-400' :
                  standing.reputation < 0 ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {standing.reputation > 0 ? '+' : ''}{standing.reputation}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Mission Chain */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-amber-100">Mission Chains</h3>
        {rootMissions.length > 0 ? (
          rootMissions.map(mission => renderMissionNode(mission))
        ) : (
          <Card className="p-6 border border-amber-800/30 text-center">
            <p className="text-amber-200/60">No missions in campaign yet</p>
          </Card>
        )}
      </div>
    </div>
  );
}
