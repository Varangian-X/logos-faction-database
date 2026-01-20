import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Target, AlertTriangle, TrendingUp, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CombatAIVisualizer({ 
  enemyTacticalState, 
  companionCoordination, 
  morale,
  recommendations = []
}) {
  const pattern = enemyTacticalState?.analyzePlayerPattern();
  
  return (
    <div className="space-y-2">
      {/* Enemy Intelligence */}
      <Card className="bg-slate-900/50 border-red-500/30">
        <CardContent className="pt-3">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-3 h-3 text-red-400" />
            <p className="text-xs text-red-400 font-semibold">Enemy AI</p>
          </div>
          
          {pattern && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="text-[9px] bg-red-500/20 text-red-300 border-red-500/30">
                  Analyzing tactics...
                </Badge>
                {pattern.is_aggressive && (
                  <Badge className="text-[9px] bg-amber-500/20 text-amber-300 border-amber-500/30">
                    Expects aggression
                  </Badge>
                )}
                {pattern.is_defensive && (
                  <Badge className="text-[9px] bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Countering defense
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Companion Coordination */}
      {companionCoordination && (
        <Card className="bg-slate-900/50 border-cyan-500/30">
          <CardContent className="pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-3 h-3 text-cyan-400" />
              <p className="text-xs text-cyan-400 font-semibold">Team Coordination</p>
            </div>
            
            {companionCoordination.activeStrategy && (
              <Badge className="text-[9px] bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                {companionCoordination.activeStrategy}
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      {/* Morale */}
      {morale && (
        <Card className="bg-slate-900/50 border-purple-500/30">
          <CardContent className="pt-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-500 mb-1">Your Morale</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className={cn(
                    "w-3 h-3",
                    morale.player_morale > 75 ? "text-green-400" : 
                    morale.player_morale < 25 ? "text-red-400" : "text-gray-400"
                  )} />
                  <span className={cn(
                    "font-semibold",
                    morale.player_morale > 75 ? "text-green-400" : 
                    morale.player_morale < 25 ? "text-red-400" : "text-gray-400"
                  )}>
                    {Math.round(morale.player_morale)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Enemy Morale</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className={cn(
                    "w-3 h-3",
                    morale.enemy_morale > 75 ? "text-red-400" : 
                    morale.enemy_morale < 25 ? "text-green-400" : "text-gray-400"
                  )} />
                  <span className={cn(
                    "font-semibold",
                    morale.enemy_morale > 75 ? "text-red-400" : 
                    morale.enemy_morale < 25 ? "text-green-400" : "text-gray-400"
                  )}>
                    {Math.round(morale.enemy_morale)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tactical Recommendations */}
      {recommendations.length > 0 && (
        <Card className="bg-slate-900/50 border-violet-500/30">
          <CardContent className="pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-3 h-3 text-violet-400" />
              <p className="text-xs text-violet-400 font-semibold">Tactical Advice</p>
            </div>
            <div className="space-y-1">
              {recommendations.slice(0, 2).map((rec, i) => (
                <div key={i} className="flex items-start gap-1">
                  <AlertTriangle className={cn(
                    "w-3 h-3 flex-shrink-0 mt-0.5",
                    rec.priority === 'high' ? "text-red-400" : "text-amber-400"
                  )} />
                  <p className="text-[10px] text-gray-400">{rec.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}