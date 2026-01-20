// Enhanced Combat Flow - Integrates tactical grid with existing combat system
import React, { useState } from 'react';
import TacticalGridCombat from './TacticalGridCombat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, List, Zap, Eye } from 'lucide-react';
import { 
  getEnvironmentForLocation, 
  getAvailableEnvironmentalActions,
  applyEnvironmentalAction,
  applyFactionLocationBonus,
  applyReputationLocationEffects
} from './CombatEnvironmentSystem';
import { cn } from '@/lib/utils';

export default function EnhancedCombatFlow({
  combat,
  gameState,
  companions = [],
  onAction,
  onFlee,
  isProcessing
}) {
  const [viewMode, setViewMode] = useState('tactical'); // tactical or traditional
  const [showEnvironmentActions, setShowEnvironmentActions] = useState(false);

  const environment = getEnvironmentForLocation(combat.location);
  const environmentalActions = environment ? 
    getAvailableEnvironmentalActions(environment, gameState, combat) : [];

  const factionBonuses = environment && combat.enemy_faction ?
    applyFactionLocationBonus(combat.enemy_faction, environment, combat) : [];

  const reputationEffects = environment ?
    applyReputationLocationEffects(gameState.reputation, environment, combat) : [];

  const handleEnvironmentalAction = (action) => {
    const result = applyEnvironmentalAction(action, combat, gameState);
    
    result.log.forEach(msg => {
      combat.combat_log.push(msg);
    });

    onAction({ 
      id: action.id, 
      name: action.name, 
      skillUsed: action.skill_required,
      xpGain: 25,
      environmental: true
    });

    setShowEnvironmentActions(false);
  };

  return (
    <div className="space-y-4">
      {/* Environment Header */}
      {environment && (
        <Card className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 border-amber-900/30">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-amber-300">{environment.name}</h4>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge className="bg-slate-700 text-gray-400">
                    Visibility: {environment.effects.visibility}
                  </Badge>
                  <Badge className="bg-slate-700 text-gray-400">
                    Cover: {environment.effects.cover_density}
                  </Badge>
                </div>

                {reputationEffects.length > 0 && (
                  <div className="mt-2 text-xs text-cyan-400">
                    {reputationEffects.map((effect, i) => (
                      <p key={i}>• {effect}</p>
                    ))}
                  </div>
                )}
              </div>

              {environmentalActions.length > 0 && (
                <Button
                  size="sm"
                  onClick={() => setShowEnvironmentActions(!showEnvironmentActions)}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Actions ({environmentalActions.length})
                </Button>
              )}
            </div>

            {/* Environmental Actions */}
            {showEnvironmentActions && environmentalActions.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-slate-700 pt-4">
                {environmentalActions.map(action => {
                  const ActionIcon = action.icon;
                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      onClick={() => handleEnvironmentalAction(action)}
                      disabled={isProcessing}
                      className="w-full justify-start border-amber-500/30 hover:bg-amber-900/20 h-auto py-3"
                    >
                      <ActionIcon className="w-4 h-4 mr-3 text-amber-400" />
                      <div className="text-left flex-1">
                        <p className="text-sm font-semibold text-amber-300">{action.name}</p>
                        <p className="text-xs text-gray-400">{action.description}</p>
                        <p className="text-[10px] text-amber-500 mt-1">
                          Requires: {action.skill_required} level {action.min_level}+
                        </p>
                      </div>
                    </Button>
                  );
                })}
              </div>
            )}

            {/* Faction Bonuses */}
            {factionBonuses && factionBonuses.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <p className="text-xs text-red-400 mb-1">Enemy Faction Advantage:</p>
                {factionBonuses.map((bonus, i) => (
                  <p key={i} className="text-xs text-gray-400">• {bonus}</p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* View Mode Toggle */}
      <div className="flex justify-center">
        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full max-w-md">
          <TabsList className="grid grid-cols-2 bg-slate-800">
            <TabsTrigger value="tactical" className="data-[state=active]:bg-cyan-500/20">
              <Map className="w-4 h-4 mr-2" />
              Tactical Grid
            </TabsTrigger>
            <TabsTrigger value="traditional" className="data-[state=active]:bg-cyan-500/20">
              <List className="w-4 h-4 mr-2" />
              Traditional
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Combat Interface */}
      {viewMode === 'tactical' ? (
        <TacticalGridCombat
          combat={combat}
          gameState={gameState}
          companions={companions}
          onAction={onAction}
          onFlee={onFlee}
          isProcessing={isProcessing}
        />
      ) : (
        <Card className="bg-slate-900/90 border-red-900/50">
          <CardHeader>
            <CardTitle className="text-red-400">Traditional Combat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 text-center py-8">
              Use the Tactical Grid for full combat experience
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}