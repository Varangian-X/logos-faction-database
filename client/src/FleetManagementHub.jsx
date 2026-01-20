import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Ship, Plus, TrendingUp, Zap, Shield, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const SHIP_CLASSES = {
  corvette: { name: 'Corvette', cost: 2000, upkeep: 100, combat: 10, speed: 30, capacity: 1 },
  frigate: { name: 'Frigate', cost: 5000, upkeep: 250, combat: 25, speed: 20, capacity: 2 },
  destroyer: { name: 'Destroyer', cost: 10000, upkeep: 500, combat: 50, speed: 15, capacity: 3 },
  cruiser: { name: 'Cruiser', cost: 20000, upkeep: 1000, combat: 100, speed: 12, capacity: 5 },
  battleship: { name: 'Battleship', cost: 50000, upkeep: 2500, combat: 250, speed: 8, capacity: 10 },
  carrier: { name: 'Carrier', cost: 75000, upkeep: 3500, combat: 150, speed: 10, capacity: 20 }
};

export function calculateFleetPower(fleet = []) {
  return fleet.reduce((sum, ship) => {
    const shipClass = SHIP_CLASSES[ship.class];
    const veterancy = (ship.experience || 0) / 10;
    return sum + (shipClass?.combat || 0) * (1 + veterancy);
  }, 0);
}

export function calculateFleetUpkeep(fleet = []) {
  return fleet.reduce((sum, ship) => {
    const shipClass = SHIP_CLASSES[ship.class];
    return sum + (shipClass?.upkeep || 0);
  }, 0);
}

export default function FleetManagementHub({ 
  gameState,
  playerHouse,
  onBuildShip,
  onScrapShip,
  onUpgradeShip,
  isProcessing 
}) {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedShip, setSelectedShip] = useState(null);
  
  const fleet = gameState.fleet || [];
  const totalPower = calculateFleetPower(fleet);
  const totalUpkeep = calculateFleetUpkeep(fleet);
  const fleetCapacity = (playerHouse?.house_health?.muscle || 50) + 20;
  
  return (
    <div className="space-y-4">
      {/* Fleet Overview */}
      <Card className="bg-slate-900/80 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
            <Ship className="w-4 h-4" />
            Fleet Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/50 rounded-lg p-2">
              <p className="text-[9px] text-gray-500 mb-1">Total Ships</p>
              <p className="text-lg font-bold text-cyan-300">{fleet.length}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2">
              <p className="text-[9px] text-gray-500 mb-1">Fleet Power</p>
              <p className="text-lg font-bold text-purple-300">{Math.round(totalPower)}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2">
              <p className="text-[9px] text-gray-500 mb-1">Upkeep/Turn</p>
              <p className="text-lg font-bold text-amber-300">{totalUpkeep}₵</p>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Fleet Capacity</span>
              <span className="text-gray-300">{fleet.length}/{fleetCapacity}</span>
            </div>
            <Progress value={(fleet.length / fleetCapacity) * 100} className="h-2 bg-slate-800" />
          </div>
        </CardContent>
      </Card>
      
      {/* Current Fleet */}
      {fleet.length > 0 && (
        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-gray-300 text-sm">Your Fleet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {fleet.map((ship, i) => {
              const shipClass = SHIP_CLASSES[ship.class];
              return (
                <div 
                  key={ship.id || i} 
                  className={cn(
                    "bg-slate-800/50 rounded-lg p-3 border transition-all cursor-pointer",
                    selectedShip?.id === ship.id ? "border-cyan-500" : "border-slate-700 hover:border-slate-600"
                  )}
                  onClick={() => setSelectedShip(ship)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-bold text-cyan-300">{ship.name || shipClass.name}</p>
                      <p className="text-[10px] text-gray-500">{shipClass.name}-class</p>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-300 text-[9px]">
                      <Zap className="w-3 h-3 mr-1" />
                      {shipClass.combat}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-[9px] text-gray-400">
                    <div>Speed: {shipClass.speed}</div>
                    <div>XP: {ship.experience || 0}</div>
                    <div>Upkeep: {shipClass.upkeep}₵</div>
                  </div>
                  
                  {ship.status && (
                    <Badge className="bg-amber-500/20 text-amber-300 text-[9px] mt-2">
                      {ship.status}
                    </Badge>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
      
      {/* Build New Ship */}
      <Card className="bg-slate-900/80 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Construct New Ship
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(SHIP_CLASSES).map(([key, shipClass]) => {
            const canAfford = (gameState.credits || 0) >= shipClass.cost;
            const hasCapacity = fleet.length < fleetCapacity;
            const canBuild = canAfford && hasCapacity;
            
            return (
              <div
                key={key}
                className={cn(
                  "bg-slate-800/50 rounded-lg p-3 border transition-all cursor-pointer",
                  selectedClass === key ? "border-green-500 bg-green-500/10" : "border-slate-700",
                  (!canAfford || !hasCapacity) && "opacity-50"
                )}
                onClick={() => canAfford && hasCapacity && setSelectedClass(key)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Ship className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-gray-200">{shipClass.name}</span>
                  </div>
                  <span className="text-xs font-bold text-green-400">{shipClass.cost}₵</span>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-[9px] text-gray-400">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-purple-400" />
                    {shipClass.combat}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-cyan-400" />
                    {shipClass.speed}
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-400" />
                    {shipClass.capacity}
                  </div>
                  <div className="text-amber-400">{shipClass.upkeep}₵/t</div>
                </div>
              </div>
            );
          })}
          
          {selectedClass && (
            <Button
              onClick={() => {
                onBuildShip(selectedClass);
                setSelectedClass(null);
              }}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 mt-3"
            >
              <Plus className="w-4 h-4 mr-2" />
              Construct {SHIP_CLASSES[selectedClass].name}
            </Button>
          )}
          
          {fleet.length >= fleetCapacity && (
            <p className="text-xs text-red-400 text-center mt-2">
              Fleet capacity reached. Upgrade Muscle to expand.
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Ship Management */}
      {selectedShip && (
        <Card className="bg-slate-900/80 border-cyan-500/50">
          <CardHeader>
            <CardTitle className="text-cyan-400 text-sm flex items-center justify-between">
              <span>Manage: {selectedShip.name || SHIP_CLASSES[selectedShip.class].name}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedShip(null)}
                className="h-6"
              >
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={() => {
                onUpgradeShip(selectedShip.id);
                setSelectedShip(null);
              }}
              disabled={isProcessing}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="sm"
            >
              <TrendingUp className="w-3 h-3 mr-2" />
              Upgrade Systems (5000₵)
            </Button>
            
            <Button
              onClick={() => {
                onScrapShip(selectedShip.id);
                setSelectedShip(null);
              }}
              disabled={isProcessing}
              variant="destructive"
              className="w-full"
              size="sm"
            >
              Scrap Ship (Refund {Math.floor(SHIP_CLASSES[selectedShip.class].cost * 0.3)}₵)
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}