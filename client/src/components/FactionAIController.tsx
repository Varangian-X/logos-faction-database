import React, { useEffect, useState } from 'react';
import { useCampaign } from '@/contexts/CampaignContext';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { initializeFactionAI, processFactionAITurn, FactionAIState } from '@/lib/factionAI';
import { mapLocations } from '@/lib/mapData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Activity } from 'lucide-react';

interface FactionAIControllerProps {
  currentYear: number;
}

export function FactionAIController({ currentYear }: FactionAIControllerProps) {
  const { playerAssets, addScenario } = useCampaign();
  const [aiStates, setAiStates] = useState<Record<string, FactionAIState>>({});
  const [logs, setLogs] = useState<{ year: number; message: string; missionId?: string }[]>([]);

  // Initialize AI for major factions
  useEffect(() => {
    const initialFactions = ["Neo-Praetorians", "Vanta Crucible Armada", "The Sidhe"];
    const states: Record<string, FactionAIState> = {};
    
    initialFactions.forEach(faction => {
      if (!aiStates[faction]) {
        const strategy = faction === "Neo-Praetorians" ? "Aggressive" : 
                        faction === "Vanta Crucible Armada" ? "Technological" : "Balanced";
        states[faction] = initializeFactionAI(faction, strategy);
      }
    });

    if (Object.keys(states).length > 0) {
      setAiStates(prev => ({ ...prev, ...states }));
    }
  }, []);

  // Process turns when year changes
  useEffect(() => {
    const newLogs: { year: number; message: string }[] = [];
    const newStates = { ...aiStates };

    Object.keys(newStates).forEach(factionId => {
      const state = newStates[factionId];
      if (state.lastActionYear < currentYear) {
        const { newState, actions, generatedMission } = processFactionAITurn(state, currentYear, playerAssets, mapLocations);
        newStates[factionId] = newState;
        
        let missionId: string | undefined;
        if (generatedMission) {
          addScenario({
            ...generatedMission,
            location: playerAssets.find(a => a.status === "Active")?.location || "Unknown",
            faction: state.factionId,
            year: currentYear,
            createdAt: Date.now(),
            status: 'active'
          });
          missionId = generatedMission.id;
        }

        actions.forEach(action => {
          newLogs.push({ 
            year: currentYear, 
            message: action, 
            missionId: action.includes("raid") ? missionId : undefined 
          } as { year: number; message: string; missionId?: string });
        });
      }
    });

    if (newLogs.length > 0) {
      setAiStates(newStates);
      setLogs(prev => [...newLogs, ...prev].slice(0, 50)); // Keep last 50 logs
    }
  }, [currentYear, playerAssets]);

  if (logs.length === 0) return null;

  return (
    <Card className="bg-black/40 border-white/10 mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-500" />
          Faction Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div key={index} className="text-xs flex items-center gap-2 justify-between">
                <div className="flex gap-2">
                  <span className="text-white/40 font-mono">{log.year}</span>
                  <span className="text-white/80">{log.message}</span>
                </div>
                {log.missionId && (
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="h-6 text-[10px] px-2"
                    onClick={() => {
                      // Navigate to campaign log or open mission details
                      // For now just show alert
                      alert("Check Campaign Log for Asset Defense mission!");
                    }}
                  >
                    <ShieldAlert className="w-3 h-3 mr-1" />
                    DEFEND
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
