import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Search, Zap, AlertTriangle } from 'lucide-react';

export default function CounterIntelligencePanel({ 
  gameState,
  playerHouse,
  suspectedThreats = [],
  onSweep,
  onInvestigate,
  isProcessing 
}) {
  const houseIntel = playerHouse?.house_health?.intel || 50;
  const sweepCost = 600;
  const intelCost = 25;
  
  const detectionChance = Math.min(90, 50 + Math.floor(houseIntel * 0.5));
  
  return (
    <Card className="bg-slate-900/80 border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400 text-sm flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Counter-Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-2">Defense Capability</p>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-500">Detection Chance</span>
            <span className="text-sm font-bold text-green-400">{detectionChance}%</span>
          </div>
        </div>
        
        {suspectedThreats.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Suspected Infiltration ({suspectedThreats.length})
            </p>
            {suspectedThreats.map((threat, i) => (
              <div key={i} className="bg-red-900/20 rounded-lg p-2 border border-red-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-red-300">{threat.source}</span>
                  <Button
                    onClick={() => onInvestigate(threat)}
                    disabled={isProcessing}
                    size="sm"
                    className="h-6 bg-red-600 hover:bg-red-700 text-[10px]"
                  >
                    <Search className="w-3 h-3 mr-1" />
                    Investigate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="pt-3 border-t border-slate-700 space-y-2">
          <Button
            onClick={onSweep}
            disabled={isProcessing || (gameState.credits || 0) < sweepCost || (gameState.intel || 0) < intelCost}
            className="w-full bg-green-600 hover:bg-green-700"
            size="sm"
          >
            <Zap className="w-3 h-3 mr-2" />
            Full Counter-Intel Sweep ({sweepCost}₵, {intelCost} intel)
          </Button>
          
          <p className="text-[9px] text-gray-500 text-center">
            Removes enemy spies and reveals hostile operations
          </p>
        </div>
      </CardContent>
    </Card>
  );
}