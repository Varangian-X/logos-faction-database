import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Handshake, Shield, Coins, Swords, ScrollText } from 'lucide-react';
import { DIPLOMATIC_ACTIONS, DiplomaticStatus, getAvailableDiplomaticActions } from '@/lib/diplomacy';
import { useCampaign } from '@/contexts/CampaignContext';

interface DiplomacyPanelProps {
  factions: string[];
  factionReputations: Record<string, number>;
  onPerformAction: (factionId: string, actionId: string) => void;
}

export function DiplomacyPanel({ factions, factionReputations, onPerformAction }: DiplomacyPanelProps) {
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  // Mock status for now - in real app would come from context
  const [factionStatuses, setFactionStatuses] = useState<Record<string, DiplomaticStatus>>({});

  const getStatusColor = (status: DiplomaticStatus) => {
    switch (status) {
      case "At War": return "text-red-500 border-red-500/50 bg-red-900/20";
      case "Hostile": return "text-orange-500 border-orange-500/50 bg-orange-900/20";
      case "Neutral": return "text-gray-400 border-gray-500/50 bg-gray-900/20";
      case "Non-Aggression Pact": return "text-blue-400 border-blue-500/50 bg-blue-900/20";
      case "Trade Partner": return "text-green-400 border-green-500/50 bg-green-900/20";
      case "Ally": return "text-purple-400 border-purple-500/50 bg-purple-900/20";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Faction List */}
      <Card className="bg-black/40 border-white/10 md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-serif text-[#D4AF37] flex items-center gap-2">
            <ScrollText className="w-5 h-5" /> Known Factions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <div className="space-y-1 p-4">
              {factions.map(faction => {
                const reputation = factionReputations[faction] || 0;
                const status = factionStatuses[faction] || "Neutral";
                
                return (
                  <div 
                    key={faction}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedFaction === faction 
                        ? 'bg-white/10 border-white/30' 
                        : 'bg-black/20 border-transparent hover:bg-white/5'
                    }`}
                    onClick={() => setSelectedFaction(faction)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-white">{faction}</span>
                      <Badge variant="outline" className={getStatusColor(status)}>
                        {status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <span>Reputation:</span>
                      <span className={reputation > 0 ? "text-green-400" : reputation < 0 ? "text-red-400" : "text-white"}>
                        {reputation}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Diplomatic Actions */}
      <Card className="bg-black/40 border-white/10 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-serif text-[#D4AF37] flex items-center gap-2">
            <Handshake className="w-5 h-5" /> Diplomatic Channels
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedFaction ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <h3 className="text-xl font-serif text-white mb-1">{selectedFaction}</h3>
                  <p className="text-sm text-white/60">
                    Current Status: <span className={getStatusColor(factionStatuses[selectedFaction] || "Neutral").split(" ")[0]}>
                      {factionStatuses[selectedFaction] || "Neutral"}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold text-white">
                    {factionReputations[selectedFaction] || 0}
                  </div>
                  <div className="text-xs text-white/40 uppercase tracking-wider">Reputation</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getAvailableDiplomaticActions(
                  factionReputations[selectedFaction] || 0, 
                  factionStatuses[selectedFaction] || "Neutral"
                ).map(action => (
                  <Button
                    key={action.id}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2 border-white/10 hover:bg-white/5 hover:border-white/30"
                    onClick={() => {
                      onPerformAction(selectedFaction, action.id);
                      // Optimistic update for demo
                      setFactionStatuses(prev => ({
                        ...prev,
                        [selectedFaction]: action.effect(prev[selectedFaction] || "Neutral")
                      }));
                    }}
                  >
                    <div className="flex justify-between w-full">
                      <span className="font-medium text-white">{action.name}</span>
                      <span className="text-xs text-amber-400">{action.cost.credits} CR</span>
                    </div>
                    <p className="text-xs text-white/60 text-left">{action.description}</p>
                  </Button>
                ))}
                
                {getAvailableDiplomaticActions(
                  factionReputations[selectedFaction] || 0, 
                  factionStatuses[selectedFaction] || "Neutral"
                ).length === 0 && (
                  <div className="col-span-2 text-center py-8 text-white/40 italic">
                    No diplomatic actions available. Improve reputation to unlock treaties.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/40 min-h-[300px]">
              <Handshake className="w-12 h-12 mb-4 opacity-20" />
              <p>Select a faction to open diplomatic channels</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
