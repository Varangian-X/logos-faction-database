import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SavedScenario } from '@/contexts/CampaignContext';
import { useCampaign } from '@/contexts/CampaignContext';
import { calculateFactionEffects, generateOutcomeConsequences } from '@/lib/factionDynamics';

interface MissionOutcomeRecorderProps {
  mission: SavedScenario;
  onOutcomeRecorded?: (branchedMission: SavedScenario | null) => void;
}

export function MissionOutcomeRecorder({ mission, onOutcomeRecorded }: MissionOutcomeRecorderProps) {
  const { recordMissionOutcome, generateBranchedMission, getFactionReputation } = useCampaign();
  const [selectedOutcome, setSelectedOutcome] = useState<'success' | 'partial' | 'failure' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRecordOutcome = async (outcome: 'success' | 'partial' | 'failure') => {
    setIsProcessing(true);
    try {
      const currentRep = getFactionReputation(mission.id);
      const factionEffects = calculateFactionEffects(mission, outcome);
      const consequences = generateOutcomeConsequences(mission, outcome, currentRep);

      recordMissionOutcome(mission.id, outcome, factionEffects, consequences);

      // Generate branched mission
      const branchedMission = generateBranchedMission(mission.id, outcome);
      onOutcomeRecorded?.(branchedMission);
      
      setSelectedOutcome(outcome);
    } finally {
      setIsProcessing(false);
    }
  };

  if (mission.status !== 'active') {
    return null;
  }

  const outcomeColors = {
    success: 'bg-green-900/20 border-green-700',
    partial: 'bg-yellow-900/20 border-yellow-700',
    failure: 'bg-red-900/20 border-red-700',
  };

  return (
    <Card className="p-6 border border-amber-800/50">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-amber-100 mb-2">Record Mission Outcome</h3>
          <p className="text-sm text-amber-200/70">
            How did the mission resolve? Your choice affects faction dynamics and future opportunities.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {(['success', 'partial', 'failure'] as const).map(outcome => (
            <button
              key={outcome}
              onClick={() => handleRecordOutcome(outcome)}
              disabled={isProcessing}
              className={`p-4 rounded border-2 transition-all ${
                selectedOutcome === outcome
                  ? outcomeColors[outcome]
                  : 'border-amber-800/30 hover:border-amber-700/50'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="font-semibold text-amber-100 capitalize mb-1">{outcome}</div>
              <div className="text-xs text-amber-200/60">
                {outcome === 'success' && 'Mission accomplished'}
                {outcome === 'partial' && 'Mixed results'}
                {outcome === 'failure' && 'Mission failed'}
              </div>
            </button>
          ))}
        </div>

        {selectedOutcome && (
          <div className={`p-4 rounded border ${outcomeColors[selectedOutcome]}`}>
            <p className="text-sm text-amber-100">
              ✓ Outcome recorded. A new mission has been generated based on the consequences.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
