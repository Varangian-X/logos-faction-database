import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, UserPlus, TrendingUp, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function buildSpyNetwork(targetHouseId, targetHouseName, gameState, playerHouse) {
  const baseCost = 1000;
  const intelCost = 40;
  
  const houseHealth = playerHouse.house_health || {};
  const streetsLevel = houseHealth.streets || 50;
  const intelLevel = houseHealth.intel || 50;
  
  // Success chance based on capabilities
  const baseChance = 50;
  const streetsBonus = Math.floor(streetsLevel * 0.3);
  const intelBonus = Math.floor(intelLevel * 0.2);
  const skillBonus = (gameState.skills?.espionage?.level || 0) * 4;
  
  const successChance = Math.min(90, baseChance + streetsBonus + intelBonus + skillBonus);
  
  return {
    id: `spy_network_${Date.now()}`,
    target_house_id: targetHouseId,
    target_house_name: targetHouseName,
    coverage: 0,
    max_coverage: 100,
    quality: Math.floor(streetsLevel / 2),
    agents_assigned: 1,
    max_agents: Math.floor(streetsLevel / 20) + 2,
    intel_per_turn: Math.floor(5 + (intelLevel / 10)),
    maintenance_cost: Math.floor(baseCost * 0.1),
    detection_risk: Math.max(10, 60 - streetsLevel),
    status: 'building',
    turns_to_activate: 3,
    created_turn: gameState.turn_number
  };
}

export function upgradeSpyNetwork(network, upgradeType, playerHouse) {
  const upgrades = {
    add_agent: {
      cost: 800,
      intelCost: 20,
      effect: (net) => ({
        ...net,
        agents_assigned: Math.min(net.max_agents, net.agents_assigned + 1),
        intel_per_turn: net.intel_per_turn + 3,
        detection_risk: Math.max(5, net.detection_risk - 5)
      })
    },
    improve_quality: {
      cost: 1200,
      intelCost: 30,
      effect: (net) => ({
        ...net,
        quality: Math.min(100, net.quality + 15),
        intel_per_turn: Math.floor(net.intel_per_turn * 1.3),
        detection_risk: Math.max(5, net.detection_risk - 8)
      })
    },
    expand_coverage: {
      cost: 600,
      intelCost: 15,
      effect: (net) => ({
        ...net,
        coverage: Math.min(net.max_coverage, net.coverage + 20)
      })
    }
  };
  
  return upgrades[upgradeType];
}

export default function SpyNetworkManager({ 
  gameState, 
  playerHouse,
  spyNetworks = [],
  targetHouses,
  onBuildNetwork,
  onUpgradeNetwork,
  onDismantle,
  isProcessing 
}) {
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  
  const activeNetworks = spyNetworks.filter(n => n.status === 'active');
  const buildingNetworks = spyNetworks.filter(n => n.status === 'building');
  
  const availableTargets = targetHouses.filter(h => 
    !spyNetworks.some(n => n.target_house_id === h.id)
  );
  
  return (
    <div className="space-y-4">
      <Card className="bg-slate-900/80 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Spy Networks ({activeNetworks.length + buildingNetworks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Active Networks */}
          {activeNetworks.map(network => (
            <div key={network.id} className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/30">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-bold text-cyan-300">{network.target_house_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-green-500/20 text-green-400 text-[9px]">Active</Badge>
                    <Badge className="bg-cyan-500/20 text-cyan-400 text-[9px]">
                      +{network.intel_per_turn} intel/turn
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedNetwork(network)}
                  className="h-6 text-cyan-400 hover:text-cyan-300"
                >
                  Manage
                </Button>
              </div>
              
              <div className="space-y-1 text-[10px] text-gray-400">
                <div className="flex justify-between">
                  <span>Coverage</span>
                  <span className="text-cyan-300">{network.coverage}%</span>
                </div>
                <Progress value={network.coverage} className="h-1 bg-slate-900" />
                
                <div className="flex justify-between mt-1">
                  <span>Quality</span>
                  <span className="text-purple-300">{network.quality}%</span>
                </div>
                <Progress value={network.quality} className="h-1 bg-slate-900" />
                
                <div className="flex justify-between items-center mt-2">
                  <span>Agents: {network.agents_assigned}/{network.max_agents}</span>
                  <span className={cn(
                    "font-semibold",
                    network.detection_risk > 50 ? "text-red-400" : "text-amber-400"
                  )}>
                    Risk: {network.detection_risk}%
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Building Networks */}
          {buildingNetworks.map(network => (
            <div key={network.id} className="bg-slate-800/50 rounded-lg p-3 border border-amber-500/30">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-bold text-amber-300">{network.target_house_name}</p>
                  <Badge className="bg-amber-500/20 text-amber-400 text-[9px] mt-1">
                    Building ({network.turns_to_activate} turns)
                  </Badge>
                </div>
              </div>
            </div>
          ))}
          
          {/* Build New Network */}
          {availableTargets.length > 0 && (
            <div className="pt-3 border-t border-slate-700">
              <p className="text-xs text-gray-400 mb-2">Establish New Network</p>
              <div className="space-y-2">
                {availableTargets.slice(0, 3).map(house => (
                  <Button
                    key={house.id}
                    onClick={() => onBuildNetwork(house.id, house.house_name)}
                    disabled={isProcessing || (gameState.credits || 0) < 1000 || (gameState.intel || 0) < 40}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 justify-between"
                    size="sm"
                  >
                    <span className="text-xs">{house.house_name}</span>
                    <span className="text-[10px]">1000₵ | 40 Intel</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Network Management Modal */}
      {selectedNetwork && (
        <Card className="bg-slate-900 border-cyan-500/50">
          <CardHeader>
            <CardTitle className="text-cyan-400 text-sm flex items-center justify-between">
              <span>Managing: {selectedNetwork.target_house_name}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedNetwork(null)}
                className="h-6"
              >
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => onUpgradeNetwork(selectedNetwork.id, 'add_agent')}
                disabled={isProcessing || selectedNetwork.agents_assigned >= selectedNetwork.max_agents}
                className="bg-purple-600 hover:bg-purple-700"
                size="sm"
              >
                <UserPlus className="w-3 h-3 mr-1" />
                Add Agent
              </Button>
              
              <Button
                onClick={() => onUpgradeNetwork(selectedNetwork.id, 'improve_quality')}
                disabled={isProcessing}
                className="bg-amber-600 hover:bg-amber-700"
                size="sm"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Quality
              </Button>
              
              <Button
                onClick={() => onUpgradeNetwork(selectedNetwork.id, 'expand_coverage')}
                disabled={isProcessing}
                className="bg-cyan-600 hover:bg-cyan-700"
                size="sm"
              >
                <Eye className="w-3 h-3 mr-1" />
                Coverage
              </Button>
            </div>
            
            <Button
              onClick={() => {
                onDismantle(selectedNetwork.id);
                setSelectedNetwork(null);
              }}
              disabled={isProcessing}
              variant="destructive"
              className="w-full"
              size="sm"
            >
              <XCircle className="w-3 h-3 mr-2" />
              Dismantle Network
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}