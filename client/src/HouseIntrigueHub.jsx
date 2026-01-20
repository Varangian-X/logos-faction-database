import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, Flame, Skull, Shield, Megaphone, DollarSign, 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Loader2 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { intrigueOperations, calculateIntrigueSuccess, calculateDetectionRisk } from './HouseIntrigueSystem';
import SpyNetworkManager from './SpyNetworkManager';
import CovertActionManager from './CovertActionManager';
import IntelResourceManager from './IntelResourceManager';
import CounterIntelligencePanel from './CounterIntelligencePanel';

const operationIcons = {
  espionage: Eye,
  sabotage: Flame,
  assassination: Skull,
  counter_intelligence: Shield,
  propaganda: Megaphone,
  bribery: DollarSign
};

export default function HouseIntrigueHub({ 
  gameState, 
  playerHouse, 
  targetHouses,
  onExecuteOperation,
  onBuildSpyNetwork,
  onUpgradeSpyNetwork,
  onDismantleNetwork,
  onPurchaseIntel,
  onCounterIntelSweep,
  isProcessing 
}) {
  const [selectedOp, setSelectedOp] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  
  if (!playerHouse) return null;
  
  const houseHealth = playerHouse.house_health || {};
  const activeOps = gameState.active_house_intrigue || [];
  const spyNetworks = gameState.spy_networks || [];
  const suspectedThreats = gameState.suspected_intrigue || [];
  
  const handleExecute = () => {
    if (selectedOp && selectedTarget) {
      onExecuteOperation(selectedOp.id, selectedTarget.id);
      setSelectedOp(null);
      setSelectedTarget(null);
    }
  };
  
  return (
    <Tabs defaultValue="operations" className="space-y-4">
      <TabsList className="grid grid-cols-4 bg-slate-800">
        <TabsTrigger value="operations" className="text-xs">Operations</TabsTrigger>
        <TabsTrigger value="networks" className="text-xs">Spy Networks</TabsTrigger>
        <TabsTrigger value="intel" className="text-xs">Intel</TabsTrigger>
        <TabsTrigger value="defense" className="text-xs">Defense</TabsTrigger>
      </TabsList>
      
      <TabsContent value="operations" className="space-y-4">
        <CovertActionManager
          activeOperations={activeOps}
          onCancelOperation={(opId) => onExecuteOperation('cancel', null, opId)}
          onViewDetails={(op) => console.log('View:', op)}
          isProcessing={isProcessing}
        />
        
        {/* Active Operations from original */}
        {activeOps.length > 0 && (
        <Card className="bg-slate-900/80 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 text-sm flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Active Operations ({activeOps.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeOps.map((op, i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg p-3 border border-red-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-red-300">{op.type}</span>
                  <Badge className="bg-red-500/20 text-red-300 text-[9px]">
                    {op.turns_remaining} turns left
                  </Badge>
                </div>
                <p className="text-[10px] text-gray-400">Target: {op.target_house_name}</p>
                {op.intel_per_turn && (
                  <p className="text-[10px] text-cyan-400">+{op.intel_per_turn} intel/turn</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* House Capabilities */}
      <Card className="bg-slate-900/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm">Your House Capabilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Streets</span>
              <span className="text-purple-300 font-semibold">{houseHealth.streets || 50}</span>
            </div>
            <Progress value={houseHealth.streets || 50} className="h-1 bg-slate-800" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Intel</span>
              <span className="text-cyan-300 font-semibold">{houseHealth.intel || 50}</span>
            </div>
            <Progress value={houseHealth.intel || 50} className="h-1 bg-slate-800" />
          </div>
        </CardContent>
      </Card>
      
      {/* Available Operations */}
      <Card className="bg-slate-900/80 border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-amber-400 text-sm">Covert Operations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.values(intrigueOperations).map(op => {
            const Icon = operationIcons[op.id];
            const meetsReqs = Object.entries(op.requires).every(([stat, value]) => 
              (houseHealth[stat] || 0) >= value
            );
            const canAfford = (gameState.credits || 0) >= op.cost.credits && 
                              (gameState.intel || 0) >= op.cost.intel;
            
            return (
              <div 
                key={op.id}
                className={cn(
                  "bg-slate-800/50 rounded-lg p-3 border cursor-pointer transition-all",
                  selectedOp?.id === op.id 
                    ? "border-amber-500 bg-amber-500/10" 
                    : "border-slate-700 hover:border-slate-600",
                  (!meetsReqs || !canAfford) && "opacity-50"
                )}
                onClick={() => meetsReqs && canAfford && setSelectedOp(op)}
              >
                <div className="flex items-start gap-2 mb-2">
                  <Icon className="w-4 h-4 text-amber-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-amber-300">{op.name}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{op.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-[9px] text-gray-500">
                  <span>💰 {op.cost.credits}₵</span>
                  <span>🔍 {op.cost.intel}</span>
                  <span>⏱️ {op.duration}t</span>
                </div>
                
                {!meetsReqs && (
                  <p className="text-[9px] text-red-400 mt-1">
                    Requires: {Object.entries(op.requires)
                      .filter(([stat, val]) => (houseHealth[stat] || 0) < val)
                      .map(([stat, val]) => `${stat} ${val}`)
                      .join(', ')}
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
      
      {/* Target Selection */}
      {selectedOp && (
        <Card className="bg-slate-900/80 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 text-sm">Select Target House</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {targetHouses.map(house => {
              const relation = house.player_house_relation || 0;
              const successCalc = calculateIntrigueSuccess(selectedOp, playerHouse, house, gameState.skills);
              const detectionRisk = calculateDetectionRisk(selectedOp, playerHouse, house);
              
              return (
                <div
                  key={house.id}
                  className={cn(
                    "bg-slate-800/50 rounded-lg p-3 border cursor-pointer transition-all",
                    selectedTarget?.id === house.id 
                      ? "border-red-500 bg-red-500/10" 
                      : "border-slate-700 hover:border-slate-600"
                  )}
                  onClick={() => setSelectedTarget(house)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-200">{house.house_name}</span>
                    <Badge className={cn(
                      "text-[9px]",
                      relation > 30 ? "bg-green-500/20 text-green-400" :
                      relation < -30 ? "bg-red-500/20 text-red-400" :
                      "bg-gray-500/20 text-gray-400"
                    )}>
                      {relation > 0 ? '+' : ''}{relation} relation
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-[9px] text-gray-400 mb-2">
                    <div>Power: {house.power_level || 50}</div>
                    <div>Intel: {house.house_health?.intel || 50}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px]">
                      <span className="text-green-400">Success</span>
                      <span className="text-green-300 font-semibold">{successCalc.chance}%</span>
                    </div>
                    <Progress value={successCalc.chance} className="h-1 bg-slate-900" />
                    
                    <div className="flex justify-between text-[9px]">
                      <span className="text-red-400">Detection Risk</span>
                      <span className="text-red-300 font-semibold">{detectionRisk}%</span>
                    </div>
                    <Progress value={detectionRisk} className="h-1 bg-slate-900" />
                  </div>
                </div>
              );
            })}
            
            {selectedTarget && (
              <Button
                onClick={handleExecute}
                disabled={isProcessing}
                className="w-full bg-red-600 hover:bg-red-700 mt-4"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Flame className="w-4 h-4 mr-2" />
                )}
                Launch {selectedOp.name}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Street Operations */}
      <Card className="bg-slate-900/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm">Develop Street Influence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-[10px] text-gray-400 mb-3">
            Invest in underworld connections to improve intrigue success rates
          </p>
          
          <Button
            onClick={() => onExecuteOperation('boost_streets', null)}
            disabled={isProcessing || (gameState.credits || 0) < 800}
            className="w-full bg-purple-600 hover:bg-purple-700"
            size="sm"
          >
            <TrendingUp className="w-3 h-3 mr-2" />
            Expand Street Network (800₵)
          </Button>
          
          <Button
            onClick={() => onExecuteOperation('boost_intel', null)}
            disabled={isProcessing || (gameState.credits || 0) < 1000}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
            size="sm"
          >
            <Eye className="w-3 h-3 mr-2" />
            Enhance Intel Network (1000₵)
          </Button>
        </CardContent>
      </Card>
      </TabsContent>
      
      <TabsContent value="networks" className="space-y-4">
        <SpyNetworkManager
          gameState={gameState}
          playerHouse={playerHouse}
          spyNetworks={spyNetworks}
          targetHouses={targetHouses}
          onBuildNetwork={onBuildSpyNetwork}
          onUpgradeNetwork={onUpgradeSpyNetwork}
          onDismantle={onDismantleNetwork}
          isProcessing={isProcessing}
        />
      </TabsContent>
      
      <TabsContent value="intel" className="space-y-4">
        <IntelResourceManager
          gameState={gameState}
          playerHouse={playerHouse}
          spyNetworks={spyNetworks}
          onPurchaseIntel={onPurchaseIntel}
          isProcessing={isProcessing}
        />
      </TabsContent>
      
      <TabsContent value="defense" className="space-y-4">
        <CounterIntelligencePanel
          gameState={gameState}
          playerHouse={playerHouse}
          suspectedThreats={suspectedThreats}
          onSweep={onCounterIntelSweep}
          onInvestigate={(threat) => console.log('Investigate:', threat)}
          isProcessing={isProcessing}
        />
      </TabsContent>
    </Tabs>
  );
}