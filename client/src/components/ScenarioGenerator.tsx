import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateScenario, Scenario } from "@/lib/scenarioGenerator";
import { MapLocation } from "@/lib/mapData";
import { Sparkles, Target, AlertTriangle, Gift, RefreshCw } from "lucide-react";

interface ScenarioGeneratorProps {
  location: MapLocation;
  year: number;
}

export const ScenarioGenerator: React.FC<ScenarioGeneratorProps> = ({ location, year }) => {
  const [scenario, setScenario] = useState<Scenario | null>(null);

  const handleGenerate = () => {
    const newScenario = generateScenario(location, year);
    setScenario(newScenario);
  };

  return (
    <div className="mt-4 space-y-4">
      <Button 
        onClick={handleGenerate} 
        className="w-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/50"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Generate Mission Hook
      </Button>

      {scenario && (
        <Card className="bg-black/40 border-white/10 animate-in fade-in slide-in-from-top-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg text-[#D4AF37]">{scenario.title}</CardTitle>
                <CardDescription className="text-xs font-mono mt-1">
                  {scenario.type.toUpperCase()} // {year} AD
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={handleGenerate} className="h-6 w-6">
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-white/80 italic border-l-2 border-white/20 pl-3 py-1">
              "{scenario.description}"
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase">
                <Target className="w-3 h-3" /> Objectives
              </div>
              <ul className="list-disc list-inside text-white/70 text-xs space-y-1 ml-1">
                {scenario.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase">
                <AlertTriangle className="w-3 h-3" /> Complications
              </div>
              <ul className="list-disc list-inside text-white/70 text-xs space-y-1 ml-1">
                {scenario.complications.map((comp, i) => (
                  <li key={i}>{comp}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase">
                <Gift className="w-3 h-3" /> Rewards
              </div>
              <div className="flex gap-2 flex-wrap">
                {scenario.rewards.map((reward, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] border-white/20 text-white/60">
                    {reward}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
