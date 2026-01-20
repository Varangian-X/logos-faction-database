import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Globe, Users, TrendingUp, Zap, Wrench, Shield,
  Heart, AlertTriangle, Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLANETARY_STRUCTURES, canBuildStructure } from './PlanetaryStructures';

export default function ColonyManagementUI({ 
  colony, 
  gameState,
  onBuildStructure,
  onChangeFocus,
  isProcessing 
}) {
  const [selectedStructure, setSelectedStructure] = useState(null);
  
  const popPercent = (colony.population.current / colony.population.capacity) * 100;
  const happinessColor = colony.population.happiness > 70 ? 'green' : 
                         colony.population.happiness > 40 ? 'orange' : 'red';
  const stabilityColor = colony.stability > 70 ? 'green' : 
                         colony.stability > 40 ? 'orange' : 'red';

  return (
    <div className="space-y-4">
      {/* Colony Header */}
      <Card className="bg-slate-900/90 border-cyan-500/30">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {colony.name}
              </CardTitle>
              <p className="text-xs text-gray-400 mt-1">{colony.type} • Est. Turn {colony.established_turn}</p>
            </div>
            <Badge className="bg-purple-500/20 text-purple-400">
              {colony.traits.length} Traits
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Population */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Population
              </span>
              <span className="text-xs font-semibold text-gray-300">
                {colony.population.current.toLocaleString()} / {colony.population.capacity.toLocaleString()}
              </span>
            </div>
            <Progress value={popPercent} className="h-2" />
          </div>

          {/* Happiness & Stability */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  Happiness
                </span>
                <span className={cn('text-xs font-semibold', `text-${happinessColor}-400`)}>
                  {colony.population.happiness}
                </span>
              </div>
              <Progress value={colony.population.happiness} className="h-2" 
                indicatorClassName={`bg-${happinessColor}-500`} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Stability
                </span>
                <span className={cn('text-xs font-semibold', `text-${stabilityColor}-400`)}>
                  {colony.stability}
                </span>
              </div>
              <Progress value={colony.stability} className="h-2" 
                indicatorClassName={`bg-${stabilityColor}-500`} />
            </div>
          </div>

          {/* Resource Production */}
          <div className="bg-slate-800/50 rounded-lg p-3">
            <h5 className="text-xs font-semibold text-gray-400 mb-2">Resource Output:</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <ResourceStat label="Production" value={colony.resources.production.output} />
              <ResourceStat label="Research" value={colony.resources.research.output} />
              <ResourceStat label="Credits" value={colony.resources.credits_income} suffix="₡/turn" />
              <ResourceStat label="Food" value={colony.resources.food.production - colony.resources.food.consumption} 
                suffix=" surplus" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Structures & Development */}
      <Tabs defaultValue="structures">
        <TabsList className="grid grid-cols-2 bg-slate-800">
          <TabsTrigger value="structures">
            <Building2 className="w-4 h-4 mr-2" />
            Structures
          </TabsTrigger>
          <TabsTrigger value="build">
            <Wrench className="w-4 h-4 mr-2" />
            Construct
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structures" className="space-y-2">
          <Card className="bg-slate-900/90 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Active Structures ({colony.structures.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {colony.structures.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No structures built yet</p>
              ) : (
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {colony.structures.map((structure, i) => (
                      <StructureCard key={i} structure={structure} />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Construction Queue */}
          {colony.development_queue.length > 0 && (
            <Card className="bg-slate-900/90 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-sm text-orange-400">Under Construction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {colony.development_queue.map((item, i) => (
                  <div key={i} className="bg-slate-800/50 rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-300">{item.structure.name}</span>
                      <span className="text-xs text-gray-500">
                        Turn {item.completion_turn}
                      </span>
                    </div>
                    <Progress value={(item.progress / item.cost) * 100} className="h-1" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="build">
          <Card className="bg-slate-900/90 border-slate-700">
            <CardContent className="pt-4">
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {Object.values(PLANETARY_STRUCTURES).map(structure => {
                    const buildCheck = canBuildStructure(colony, structure.id);
                    return (
                      <StructureBuildOption
                        key={structure.id}
                        structure={structure}
                        canBuild={buildCheck.can_build}
                        reason={buildCheck.reason}
                        credits={gameState.credits}
                        onSelect={() => onBuildStructure(structure.id)}
                        isProcessing={isProcessing}
                      />
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ResourceStat({ label, value, suffix = '' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}:</span>
      <span className="text-gray-300 font-semibold">{value}{suffix}</span>
    </div>
  );
}

function StructureCard({ structure }) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
      <h5 className="text-sm font-bold text-gray-200 mb-1">{structure.name}</h5>
      <p className="text-xs text-gray-400 mb-2">{structure.description}</p>
      <div className="flex flex-wrap gap-1">
        {Object.entries(structure.bonuses).map(([key, value]) => (
          <Badge key={key} className="text-[9px] bg-green-500/20 text-green-400">
            +{value} {key.replace(/_/g, ' ')}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function StructureBuildOption({ structure, canBuild, reason, credits, onSelect, isProcessing }) {
  const canAfford = credits >= structure.cost;
  
  return (
    <motion.button
      onClick={canBuild && canAfford ? onSelect : undefined}
      disabled={!canBuild || !canAfford || isProcessing}
      className={cn(
        'w-full p-3 rounded-lg border-2 text-left transition-all',
        canBuild && canAfford 
          ? 'bg-slate-800/50 border-slate-700 hover:border-cyan-500/50' 
          : 'bg-slate-800/30 border-slate-800 opacity-50'
      )}
      whileHover={canBuild && canAfford ? { x: 4 } : {}}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h5 className="text-sm font-bold text-gray-200">{structure.name}</h5>
          <Badge className="text-[9px] bg-slate-700 text-gray-400 mt-1">{structure.type}</Badge>
        </div>
        <Badge className="text-[9px] bg-cyan-500/20 text-cyan-400">
          {structure.build_time} turns
        </Badge>
      </div>

      <p className="text-xs text-gray-400 mb-2">{structure.description}</p>

      <div className="flex items-center justify-between text-xs mb-2">
        <span className="text-gray-500">Cost: {structure.cost}₡</span>
        <span className="text-gray-500">Upkeep: {structure.maintenance}₡/turn</span>
      </div>

      {!canBuild && (
        <div className="flex items-center gap-1 text-xs text-red-400 mb-2">
          <AlertTriangle className="w-3 h-3" />
          {reason}
        </div>
      )}

      {!canAfford && canBuild && (
        <div className="text-xs text-red-400">Insufficient credits</div>
      )}
    </motion.button>
  );
}