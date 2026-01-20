import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { RESOURCES, calculateNetIncome } from './EconomicSystem';
import { cn } from '@/lib/utils';

export default function ResourceManagementHub({
  resources = {},
  infrastructure = [],
  marketPrices = {}
}) {
  const { netCredits, production, consumption, totalUpkeep } = calculateNetIncome(
    infrastructure,
    resources,
    marketPrices
  );
  
  return (
    <div className="space-y-4">
      <Card className="bg-slate-900/80 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
            <Package className="w-4 h-4" />
            Resource Stockpiles
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {Object.entries(RESOURCES).map(([key, resource]) => {
            const amount = resources[key] || 0;
            const prod = production[key] || 0;
            const cons = consumption[key] || 0;
            const net = prod - cons;
            
            return (
              <div key={key} className="bg-slate-800/50 rounded-lg p-2">
                <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                  <span>{resource.icon}</span>
                  {resource.name}
                </p>
                <p className="text-lg font-bold text-gray-200">{amount}</p>
                {net !== 0 && (
                  <p className={cn(
                    "text-[10px] flex items-center gap-1",
                    net > 0 ? "text-green-400" : "text-red-400"
                  )}>
                    {net > 0 ? <TrendingUp className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {net > 0 ? '+' : ''}{net}/turn
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
      
      <Card className="bg-slate-900/80 border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-amber-400 text-sm flex items-center gap-2">
            <Coins className="w-4 h-4" />
            Economic Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-2">Net Income</p>
            <p className={cn(
              "text-2xl font-bold",
              netCredits > 0 ? "text-green-300" : netCredits < 0 ? "text-red-300" : "text-gray-300"
            )}>
              {netCredits > 0 ? '+' : ''}{netCredits}₵/turn
            </p>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Production Value</span>
              <span className="text-green-400">
                +{Object.entries(production).reduce((sum, [r, amt]) => 
                  sum + (amt * (marketPrices[r] || RESOURCES[r]?.basePrice || 0)), 0
                ).toFixed(0)}₵
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Consumption Cost</span>
              <span className="text-amber-400">
                -{Object.entries(consumption).reduce((sum, [r, amt]) => 
                  sum + (amt * (marketPrices[r] || RESOURCES[r]?.basePrice || 0)), 0
                ).toFixed(0)}₵
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Infrastructure Upkeep</span>
              <span className="text-red-400">-{totalUpkeep}₵</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}