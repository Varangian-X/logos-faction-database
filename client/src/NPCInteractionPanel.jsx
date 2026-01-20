import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import DialogueInterface from '@/components/dialogue/DialogueInterface';

export default function NPCInteractionPanel({ gameState, onDialogueChoice }) {
  const [selectedNPC, setSelectedNPC] = useState(null);

  // Fetch NPCs at current location
  const { data: npcs = [] } = useQuery({
    queryKey: ['npcs', gameState?.current_location],
    queryFn: async () => {
      if (!gameState?.current_location) return [];
      const allNPCs = await base44.entities.NPC.list();
      return allNPCs.filter(npc => npc.current_location === gameState.current_location);
    },
    enabled: !!gameState?.current_location
  });

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'hostile': return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'unfriendly': return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
      case 'neutral': return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
      case 'friendly': return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'allied': return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  if (npcs.length === 0) return null;

  return (
    <>
      <Card className="bg-slate-900/80 border-cyan-900/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 uppercase tracking-wider text-sm flex items-center gap-2">
            <Users className="w-4 h-4" />
            NPCs Present
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {npcs.map((npc, index) => (
            <motion.div
              key={npc.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant="outline"
                onClick={() => setSelectedNPC(npc)}
                className="w-full text-left h-auto py-3 px-4 bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/50 hover:border-cyan-500/50 transition-all group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <p className="text-sm font-semibold text-gray-200 group-hover:text-cyan-200">
                      {npc.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">{npc.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-[10px]">
                      {npc.faction_affiliation}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={cn("text-[10px]", getMoodColor(npc.mood))}
                    >
                      {npc.mood}
                    </Badge>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {selectedNPC && (
        <DialogueInterface
          npc={selectedNPC}
          gameState={gameState}
          onChoice={onDialogueChoice}
          onClose={() => setSelectedNPC(null)}
        />
      )}
    </>
  );
}