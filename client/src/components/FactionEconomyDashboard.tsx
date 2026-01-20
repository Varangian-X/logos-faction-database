import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Coins, Cpu, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { FactionStanding } from '@/lib/factionDynamics';

interface FactionEconomyDashboardProps {
  factionStandings: Record<string, FactionStanding>;
}

export function FactionEconomyDashboard({ factionStandings }: FactionEconomyDashboardProps) {
  const sortedFactions = Object.values(factionStandings).sort((a, b) => b.influence - a.influence);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/40 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" />
              Global Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {sortedFactions.reduce((acc, f) => acc + f.resources.credits, 0).toLocaleString()}
            </div>
            <p className="text-xs text-white/50 mt-1">Total economic output</p>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" />
              Global Tech Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {sortedFactions.reduce((acc, f) => acc + f.resources.tech, 0).toLocaleString()}
            </div>
            <p className="text-xs text-white/50 mt-1">Total technological assets</p>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Users className="w-4 h-4 text-red-500" />
              Global Manpower
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {sortedFactions.reduce((acc, f) => acc + f.resources.manpower, 0).toLocaleString()}
            </div>
            <p className="text-xs text-white/50 mt-1">Total military personnel</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sortedFactions.map((faction) => (
          <Card key={faction.faction} className="bg-black/40 border-white/10 hover:bg-white/5 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-8 rounded-full ${
                    faction.status === 'allied' ? 'bg-green-500' :
                    faction.status === 'hostile' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <h3 className="font-serif text-lg text-white">{faction.faction}</h3>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Badge variant="outline" className="text-[10px] h-4 border-white/20">
                        {faction.status.toUpperCase()}
                      </Badge>
                      <span>Influence: {faction.influence}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono text-white/70">Resource Score</div>
                  <div className="text-xl font-bold text-white">
                    {(faction.resources.credits + faction.resources.tech + faction.resources.manpower).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-white/70">
                    <span className="flex items-center gap-1"><Coins className="w-3 h-3" /> Credits</span>
                    <span>{faction.resources.credits}</span>
                  </div>
                  <Progress value={Math.min(100, faction.resources.credits)} className="h-1 bg-white/10" indicatorClassName="bg-amber-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-white/70">
                    <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> Tech</span>
                    <span>{faction.resources.tech}</span>
                  </div>
                  <Progress value={Math.min(100, faction.resources.tech)} className="h-1 bg-white/10" indicatorClassName="bg-blue-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-white/70">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Manpower</span>
                    <span>{faction.resources.manpower}</span>
                  </div>
                  <Progress value={Math.min(100, faction.resources.manpower)} className="h-1 bg-white/10" indicatorClassName="bg-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
