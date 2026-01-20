import React, { useState } from 'react';
import { useGameState } from '@/contexts/GameStateContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Ship, Plus, TrendingUp, Zap, Shield, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SHIP_CLASSES, calculateFleetPower, calculateFleetUpkeep } from '@/lib/fleetManagement';

export default function FleetManagementHub({ 
  playerHouse,
  isProcessing 
}) {
  const { gameState, constructShip, updateFleet, removeFleet } = useGameState();
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedShip, setSelectedShip] = useState(null);
  const [selectedFleetId, setSelectedFleetId] = useState(gameState.fleets[0]?.id || null);
  
  const fleets = gameState.fleets || [];
  const selectedFleet = fleets.find(f => f.id === selectedFleetId) || fleets[0];
  
  // Calculate totals across all fleets
  const totalPower = fleets.reduce((sum, fleet) => sum + calculateFleetPower(fleet), 0);
  const totalUpkeep = fleets.reduce((sum, fleet) => sum + calculateFleetUpkeep(fleet), 0);
  const totalShips = fleets.reduce((sum, fleet) => sum + fleet.ships.reduce((s, stack) => s + stack.count, 0), 0);
  
  const fleetCapacity = (playerHouse?.house_health?.muscle || 50) + 20;
  
  const handleBuildShip = (shipClassId) => {
    const targetFleetId = selectedFleetId || (fleets.length > 0 ? fleets[0].id : `fleet-${Date.now()}`);
    constructShip(targetFleetId, shipClassId);
    if (!selectedFleetId) setSelectedFleetId(targetFleetId);
  };

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
              <p className="text-lg font-bold text-cyan-300">{totalShips}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2">
              <p className="text-[9px] text-gray-500 mb-1">Total Power</p>
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
              <span className="text-gray-300">{totalShips}/{fleetCapacity}</span>
            </div>
            <Progress value={(totalShips / fleetCapacity) * 100} className="h-2 bg-slate-800" />
          </div>
        </CardContent>
      </Card>
      
      {/* Current Fleet */}
      {selectedFleet && (
        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-gray-300 text-sm flex justify-between items-center">
              <span>{selectedFleet.name}</span>
              <Badge variant="outline" className="text-xs">{selectedFleet.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedFleet.ships.map((stack, i) => {
              const shipClass = SHIP_CLASSES.find(s => s.id === stack.shipClassId);
              if (!shipClass) return null;
              
              return (
                <div 
                  key={`${selectedFleet.id}-${stack.shipClassId}`} 
                  className={cn(
                    "bg-slate-800/50 rounded-lg p-3 border transition-all cursor-pointer",
                    selectedShip?.shipClassId === stack.shipClassId ? "border-cyan-500" : "border-slate-700 hover:border-slate-600"
                  )}
                  onClick={() => setSelectedShip({ ...stack, fleetId: selectedFleet.id })}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-bold text-cyan-300">{shipClass.name}</p>
                      <p className="text-[10px] text-gray-500">{shipClass.type}</p>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-300 text-[9px]">
                      <Zap className="w-3 h-3 mr-1" />
                      {shipClass.combatPower * stack.count}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-[9px] text-gray-400">
                    <div>Count: {stack.count}</div>
                    <div>Speed: {shipClass.speed}</div>
                    <div>Upkeep: {shipClass.maintenance.credits * stack.count}₵</div>
                  </div>
                </div>
              );
            })}
            {selectedFleet.ships.length === 0 && (
                <div className="text-center text-gray-500 text-xs py-4">
                    No ships in this fleet. Construct ships to deploy them here.
                </div>
            )}
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
          {SHIP_CLASSES.map((shipClass) => {
            const canAfford = (gameState.credits || 0) >= shipClass.cost.credits &&
                              (gameState.tech || 0) >= shipClass.cost.tech &&
                              (gameState.manpower || 0) >= shipClass.cost.manpower;
            const hasCapacity = totalShips < fleetCapacity;
            const canBuild = canAfford && hasCapacity;
            
            return (
              <div
                key={shipClass.id}
                className={cn(
                  "bg-slate-800/50 rounded-lg p-3 border transition-all cursor-pointer",
                  selectedClass === shipClass.id ? "border-green-500 bg-green-500/10" : "border-slate-700",
                  (!canAfford || !hasCapacity) && "opacity-50"
                )}
                onClick={() => canAfford && hasCapacity && setSelectedClass(shipClass.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Ship className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-gray-200">{shipClass.name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={cn("text-xs font-bold", canAfford ? "text-green-400" : "text-red-400")}>
                        {shipClass.cost.credits}₵
                    </span>
                    <span className="text-[9px] text-gray-500">
                        {shipClass.cost.tech}T / {shipClass.cost.manpower}M
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-[9px] text-gray-400">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-purple-400" />
                    {shipClass.combatPower}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-cyan-400" />
                    {shipClass.speed}
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-400" />
                    {shipClass.cargoCapacity}
                  </div>
                  <div className="text-amber-400">{shipClass.maintenance.credits}₵/t</div>
                </div>
              </div>
            );
          })}
          
          {selectedClass && (
            <Button
              onClick={() => {
                handleBuildShip(selectedClass);
                setSelectedClass(null);
              }}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 mt-3"
            >
              <Plus className="w-4 h-4 mr-2" />
              Construct {SHIP_CLASSES.find(s => s.id === selectedClass)?.name}
            </Button>
          )}
          
          {totalShips >= fleetCapacity && (
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
              <span>Manage: {SHIP_CLASSES.find(s => s.id === selectedShip.shipClassId)?.name}</span>
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
                // Implement upgrade logic here
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
                // Implement scrap logic here
                setSelectedShip(null);
              }}
              disabled={isProcessing}
              variant="destructive"
              className="w-full"
              size="sm"
            >
              Scrap Ship (Refund)
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
