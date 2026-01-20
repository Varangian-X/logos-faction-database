import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Building2, Plus, TrendingUp, Zap, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { INFRASTRUCTURE, canBuildInfrastructure } from './EconomicSystem';

export default function InfrastructureManager({
  infrastructure = [],
  resources,
  onBuildInfrastructure,
  onUpgradeInfrastructure,
  onDemolishInfrastructure,
  isProcessing
}) {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  
  const activeBuildings = infrastructure.filter(b => b.status === 'active');
  const buildingBuildings = infrastructure.filter(b => b.status === 'building');
  
  return (
    <div className="space-y-4">
      <Card className="bg-slate-900/80 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Infrastructure ({activeBuildings.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeBuildings.length === 0 && buildingBuildings.length === 0 && (
            <p className="text-xs text-gray-500 text-center py-4">
              No infrastructure. Build facilities to generate resources.
            </p>
          )}
          
          {/* Active Buildings */}
          {activeBuildings.map((building, i) => {
            const type = INFRASTRUCTURE[building.type];
            return (
              <div
                key={building.id || i}
                className={cn(
                  "bg-slate-800/50 rounded-lg p-3 border transition-all cursor-pointer",
                  selectedBuilding?.id === building.id ? "border-green-500" : "border-slate-700"
                )}
                onClick={() => setSelectedBuilding(building)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-bold text-green-300">{type.name}</p>
                    <p className="text-[10px] text-gray-500">Level {building.level || 1}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 text-[9px]">
                    Active
                  </Badge>
                </div>
                
                {type.produces && (
                  <div className="text-[10px] text-gray-400 mb-1">
                    Produces: {Object.entries(type.produces).map(([r, amt]) => 
                      `${amt * (building.efficiency || 1)} ${r}`
                    ).join(', ')}
                  </div>
                )}
                
                {type.consumes && (
                  <div className="text-[10px] text-amber-400 mb-1">
                    Consumes: {Object.entries(type.consumes).map(([r, amt]) => 
                      `${amt} ${r}`
                    ).join(', ')}
                  </div>
                )}
                
                <div className="text-[10px] text-red-400">
                  Upkeep: {type.upkeep}₵/turn
                </div>
              </div>
            );
          })}
          
          {/* Buildings Under Construction */}
          {buildingBuildings.map((building, i) => {
            const type = INFRASTRUCTURE[building.type];
            const progress = ((type.buildTime - building.turns_remaining) / type.buildTime) * 100;
            
            return (
              <div key={building.id || i} className="bg-slate-800/50 rounded-lg p-3 border border-amber-500/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-amber-300">{type.name}</p>
                  <Badge className="bg-amber-500/20 text-amber-300 text-[9px]">
                    <Clock className="w-3 h-3 mr-1" />
                    {building.turns_remaining}t
                  </Badge>
                </div>
                <Progress value={progress} className="h-1" />
              </div>
            );
          })}
        </CardContent>
      </Card>
      
      {/* Build New Infrastructure */}
      <Card className="bg-slate-900/80 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Construct Infrastructure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(INFRASTRUCTURE).map(([key, type]) => {
            const check = canBuildInfrastructure(key, infrastructure, resources);
            
            return (
              <div
                key={key}
                className={cn(
                  "bg-slate-800/50 rounded-lg p-3 border transition-all",
                  selectedType === key ? "border-cyan-500 bg-cyan-500/10 cursor-pointer" : "border-slate-700",
                  check.canBuild ? "cursor-pointer hover:border-slate-600" : "opacity-50"
                )}
                onClick={() => check.canBuild && setSelectedType(key)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-200">{type.name}</span>
                  <span className="text-xs font-bold text-cyan-400">{type.cost}₵</span>
                </div>
                
                <div className="space-y-1 text-[10px] text-gray-400">
                  {type.produces && (
                    <div className="text-green-400">
                      +{Object.entries(type.produces).map(([r, amt]) => `${amt} ${r}`).join(', ')}/turn
                    </div>
                  )}
                  {type.consumes && (
                    <div className="text-amber-400">
                      -{Object.entries(type.consumes).map(([r, amt]) => `${amt} ${r}`).join(', ')}/turn
                    </div>
                  )}
                  {type.tradeBonus && (
                    <div className="text-purple-400">
                      +{(type.tradeBonus * 100).toFixed(0)}% trade income
                    </div>
                  )}
                  <div className="text-red-400">Upkeep: {type.upkeep}₵/turn</div>
                  <div className="text-gray-500">Build time: {type.buildTime} turns</div>
                </div>
                
                {!check.canBuild && (
                  <p className="text-[9px] text-red-400 mt-2">{check.reason}</p>
                )}
              </div>
            );
          })}
          
          {selectedType && (
            <Button
              onClick={() => {
                onBuildInfrastructure(selectedType);
                setSelectedType(null);
              }}
              disabled={isProcessing}
              className="w-full bg-cyan-600 hover:bg-cyan-700 mt-3"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Construct {INFRASTRUCTURE[selectedType].name}
            </Button>
          )}
        </CardContent>
      </Card>
      
      {/* Building Management */}
      {selectedBuilding && (
        <Card className="bg-slate-900/80 border-green-500/50">
          <CardHeader>
            <CardTitle className="text-green-400 text-sm flex items-center justify-between">
              <span>Manage: {INFRASTRUCTURE[selectedBuilding.type].name}</span>
              <Button size="sm" variant="ghost" onClick={() => setSelectedBuilding(null)} className="h-6">
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={() => {
                onUpgradeInfrastructure(selectedBuilding.id);
                setSelectedBuilding(null);
              }}
              disabled={isProcessing}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="sm"
            >
              <TrendingUp className="w-3 h-3 mr-2" />
              Upgrade (+10% efficiency) - 3000₵
            </Button>
            
            <Button
              onClick={() => {
                onDemolishInfrastructure(selectedBuilding.id);
                setSelectedBuilding(null);
              }}
              disabled={isProcessing}
              variant="destructive"
              className="w-full"
              size="sm"
            >
              Demolish (Refund {Math.floor(INFRASTRUCTURE[selectedBuilding.type].cost * 0.3)}₵)
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}