import React, { useEffect, useState } from 'react';
import { useCampaign } from '@/contexts/CampaignContext';
import { initializeFactionAI, processFactionAITurn, FactionAIState } from '@/lib/factionAI';
import { mapLocations } from '@/lib/mapData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Activity } from 'lucide-react';

interface FactionAIControllerProps {
  currentYear: number;
}

export function FactionAIController({ currentYear }: FactionAIControllerProps) {
  const { playerAssets } = useCampaign();
  const [aiStates, setAiStates] = useState<Record<string, FactionAIState>>({});
  const [logs, setLogs] = useState<{ year: number; message: string }[]>([]);

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
        const { newState, actions } = processFactionAITurn(state, currentYear, playerAssets, mapLocations);
        newStates[factionId] = newState;
        actions.forEach(action => {
          newLogs.push({ year: currentYear, message: action });
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
              <div key={index} className="text-xs flex gap-2">
                <span className="text-white/40 font-mono">{log.year}</span>
                <span className="text-white/80">{log.message}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
