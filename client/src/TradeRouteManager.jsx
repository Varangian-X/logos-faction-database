import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function calculateTradeIncome(tradeRoutes = [], marketPrices = {}, tradeHubs = 0) {
  let totalIncome = 0;
  const tradeBonus = 1 + (tradeHubs * 0.15);
  
  tradeRoutes.forEach(route => {
    if (route.status === 'active') {
      const value = route.value || 0;
      totalIncome += value * tradeBonus;
    }
  });
  
  return Math.round(totalIncome);
}

export default function TradeRouteManager({
  tradeRoutes = [],
  availablePartners = [],
  tradeHubs = 0,
  onEstablishRoute,
  onCancelRoute,
  isProcessing
}) {
  const [selectedPartner, setSelectedPartner] = useState(null);
  
  const activeRoutes = tradeRoutes.filter(r => r.status === 'active');
  const totalIncome = calculateTradeIncome(tradeRoutes, {}, tradeHubs);
  
  return (
    <div className="space-y-4">
      <Card className="bg-slate-900/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Trade Routes ({activeRoutes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Trade Income</p>
            <p className="text-2xl font-bold text-purple-300">+{totalIncome}₵/turn</p>
            {tradeHubs > 0 && (
              <p className="text-[10px] text-green-400 mt-1">
                +{(tradeHubs * 15).toFixed(0)}% from Trade Hubs
              </p>
            )}
          </div>
          
          {activeRoutes.length === 0 && (
            <p className="text-xs text-gray-500 text-center py-4">
              No active trade routes. Establish routes for passive income.
            </p>
          )}
          
          {activeRoutes.map((route, i) => (
            <div key={route.id || i} className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/30">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-bold text-purple-300">{route.partner_name}</p>
                  <p className="text-[10px] text-gray-500">{route.resource_type} trade</p>
                </div>
                <Badge className="bg-green-500/20 text-green-300 text-[9px]">
                  +{route.value}₵/turn
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-400">Established Turn {route.established_turn}</span>
                <Button
                  onClick={() => onCancelRoute(route.id)}
                  disabled={isProcessing}
                  variant="ghost"
                  size="sm"
                  className="h-5 text-red-400 hover:text-red-300"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {availablePartners.length > 0 && (
        <Card className="bg-slate-900/80 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Establish New Route
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {availablePartners.map(partner => {
              const relationBonus = Math.max(0, (partner.player_house_relation || 0));
              const baseValue = 300 + relationBonus * 5;
              const cost = 2000;
              
              return (
                <div
                  key={partner.id}
                  className={cn(
                    "bg-slate-800/50 rounded-lg p-3 border transition-all cursor-pointer",
                    selectedPartner?.id === partner.id 
                      ? "border-cyan-500 bg-cyan-500/10" 
                      : "border-slate-700 hover:border-slate-600"
                  )}
                  onClick={() => setSelectedPartner(partner)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-200">{partner.house_name}</span>
                    <span className="text-xs text-cyan-400">+{baseValue}₵/turn</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-500">Cost: {cost}₵</span>
                    <Badge className={cn(
                      "text-[9px]",
                      relationBonus > 30 ? "bg-green-500/20 text-green-400" :
                      relationBonus > 0 ? "bg-amber-500/20 text-amber-400" :
                      "bg-red-500/20 text-red-400"
                    )}>
                      {relationBonus > 0 ? '+' : ''}{relationBonus} relation
                    </Badge>
                  </div>
                </div>
              );
            })}
            
            {selectedPartner && (
              <Button
                onClick={() => {
                  onEstablishRoute(selectedPartner.id);
                  setSelectedPartner(null);
                }}
                disabled={isProcessing}
                className="w-full bg-cyan-600 hover:bg-cyan-700 mt-3"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Establish Route with {selectedPartner.house_name}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}