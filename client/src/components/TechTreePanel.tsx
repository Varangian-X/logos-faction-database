import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Lock, Unlock, Zap, Database, Shield, Coins, ArrowRight } from 'lucide-react';
import { TECH_TREE, Technology, TechState, canUnlockTech } from '@/lib/techTree';

interface TechTreePanelProps {
  techState: TechState;
  currentTechResources: number;
  onUnlockTech: (techId: string, cost: number) => void;
}

export function TechTreePanel({ techState, currentTechResources, onUnlockTech }: TechTreePanelProps) {
  const categories = ["Infrastructure", "Military", "Economic", "Xenotech"] as const;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Infrastructure": return <Database className="w-4 h-4 text-blue-400" />;
      case "Military": return <Shield className="w-4 h-4 text-red-400" />;
      case "Economic": return <Coins className="w-4 h-4 text-amber-400" />;
      case "Xenotech": return <Zap className="w-4 h-4 text-purple-400" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-[#D4AF37]">Research & Development</h2>
        <div className="flex items-center gap-2 bg-blue-900/20 px-4 py-2 rounded-full border border-blue-500/30">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-blue-100 font-mono">{currentTechResources} Tech Points</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(category => (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              {getCategoryIcon(category)}
              <h3 className="font-serif text-lg text-white/80">{category}</h3>
            </div>
            
            <div className="space-y-4">
              {Object.values(TECH_TREE)
                .filter(tech => tech.category === category)
                .map(tech => {
                  const isUnlocked = techState.unlockedTechs.includes(tech.id);
                  const canUnlock = !isUnlocked && canUnlockTech(tech.id, techState, currentTechResources);
                  const isVisible = isUnlocked || canUnlock || tech.prerequisites.every(p => techState.unlockedTechs.includes(p));

                  if (!isVisible) return null;

                  return (
                    <Card 
                      key={tech.id} 
                      className={`bg-black/40 border-white/10 transition-all ${
                        isUnlocked ? 'border-green-500/30 bg-green-900/10' : 
                        canUnlock ? 'hover:border-blue-500/50 hover:bg-blue-900/10' : 'opacity-60'
                      }`}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className={`font-medium ${isUnlocked ? 'text-green-400' : 'text-white'}`}>
                            {tech.name}
                          </h4>
                          {isUnlocked ? (
                            <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-500/30">
                              <Unlock className="w-3 h-3 mr-1" /> Owned
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-500/30">
                              {tech.cost} TP
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-white/60">{tech.description}</p>
                        
                        {/* Effects */}
                        <div className="space-y-1">
                          {tech.effects.unlockAsset && (
                            <div className="text-xs text-amber-400 flex items-center gap-1">
                              <ArrowRight className="w-3 h-3" /> Unlocks: {tech.effects.unlockAsset.join(", ")}
                            </div>
                          )}
                          {tech.effects.resourceBonus && (
                            <div className="text-xs text-green-400 flex items-center gap-1">
                              <ArrowRight className="w-3 h-3" /> Bonus: {
                                Object.entries(tech.effects.resourceBonus)
                                  .map(([res, val]) => `+${val * 100}% ${res}`)
                                  .join(", ")
                              }
                            </div>
                          )}
                          {tech.effects.unlockDiplomacy && (
                            <div className="text-xs text-purple-400 flex items-center gap-1">
                              <ArrowRight className="w-3 h-3" /> Unlocks Advanced Diplomacy
                            </div>
                          )}
                        </div>

                        {!isUnlocked && (
                          <Button 
                            size="sm" 
                            className="w-full mt-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30"
                            disabled={!canUnlock}
                            onClick={() => onUnlockTech(tech.id, tech.cost)}
                          >
                            {canUnlock ? "Research" : "Locked"}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
