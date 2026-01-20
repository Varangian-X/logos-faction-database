import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, TrendingUp, Coins, Users, AlertCircle } from 'lucide-react';

export function calculateIntelIncome(gameState, playerHouse, spyNetworks = []) {
  let baseIncome = 5;
  
  // From house intel stat
  const houseIntelBonus = Math.floor((playerHouse?.house_health?.intel || 50) / 10);
  
  // From spy networks
  const networkIncome = spyNetworks
    .filter(n => n.status === 'active')
    .reduce((sum, n) => sum + n.intel_per_turn, 0);
  
  // From espionage skill
  const skillBonus = (gameState.skills?.espionage?.level || 0) * 2;
  
  // From investigation skill
  const investigationBonus = (gameState.skills?.investigation?.level || 0);
  
  return {
    total: baseIncome + houseIntelBonus + networkIncome + skillBonus + investigationBonus,
    breakdown: {
      base: baseIncome,
      house_intel: houseIntelBonus,
      spy_networks: networkIncome,
      espionage_skill: skillBonus,
      investigation_skill: investigationBonus
    }
  };
}

export default function IntelResourceManager({ 
  gameState, 
  playerHouse,
  spyNetworks,
  onPurchaseIntel,
  onAllocateIntel,
  isProcessing 
}) {
  const currentIntel = gameState.intel || 0;
  const intelIncome = calculateIntelIncome(gameState, playerHouse, spyNetworks);
  
  const allocations = gameState.intel_allocations || {
    operations: 0,
    research: 0,
    defense: 0
  };
  
  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  const unallocated = currentIntel - totalAllocated;
  
  return (
    <Card className="bg-slate-900/80 border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Intel Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Intel */}
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Available Intel</span>
            <span className="text-2xl font-bold text-cyan-300">{currentIntel}</span>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] text-green-400">
            <TrendingUp className="w-3 h-3" />
            <span>+{intelIncome.total} per turn</span>
          </div>
          
          <div className="mt-2 pt-2 border-t border-slate-700 space-y-1 text-[9px] text-gray-500">
            <div className="flex justify-between">
              <span>Base Income</span>
              <span>+{intelIncome.breakdown.base}</span>
            </div>
            {intelIncome.breakdown.house_intel > 0 && (
              <div className="flex justify-between">
                <span>House Intel Stat</span>
                <span className="text-purple-400">+{intelIncome.breakdown.house_intel}</span>
              </div>
            )}
            {intelIncome.breakdown.spy_networks > 0 && (
              <div className="flex justify-between">
                <span>Spy Networks</span>
                <span className="text-cyan-400">+{intelIncome.breakdown.spy_networks}</span>
              </div>
            )}
            {intelIncome.breakdown.espionage_skill > 0 && (
              <div className="flex justify-between">
                <span>Espionage Skill</span>
                <span className="text-amber-400">+{intelIncome.breakdown.espionage_skill}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Purchase Intel */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400">Purchase Intel</p>
          <div className="flex gap-2">
            <Button
              onClick={() => onPurchaseIntel(25)}
              disabled={isProcessing || (gameState.credits || 0) < 500}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700"
              size="sm"
            >
              <Coins className="w-3 h-3 mr-1" />
              +25 (500₵)
            </Button>
            <Button
              onClick={() => onPurchaseIntel(50)}
              disabled={isProcessing || (gameState.credits || 0) < 900}
              className="flex-1 bg-cyan-700 hover:bg-cyan-800"
              size="sm"
            >
              <Coins className="w-3 h-3 mr-1" />
              +50 (900₵)
            </Button>
          </div>
        </div>
        
        {/* Unallocated Warning */}
        {unallocated < 0 && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-2 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
            <div>
              <p className="text-xs text-red-300 font-semibold">Over-allocated!</p>
              <p className="text-[10px] text-red-400">
                You've allocated {Math.abs(unallocated)} more intel than available.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}