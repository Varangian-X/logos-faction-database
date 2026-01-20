import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, DollarSign, Package, AlertTriangle, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { marketResources } from './MarketData';
import { manipulationActions } from './MarketManipulation';

export default function MarketInterface({ 
  market, 
  playerResources = {},
  playerCredits = 0,
  playerReputation = 50,
  factionRelations = {},
  onBuy, 
  onSell,
  onManipulate,
  isProcessing = false 
}) {
  const [selectedResource, setSelectedResource] = useState(null);
  const [tradeAmount, setTradeAmount] = useState(1);
  const [manipulationTarget, setManipulationTarget] = useState(null);
  
  if (!market || !market.resources) return null;
  
  const getStabilityColor = (stability) => {
    if (stability >= 70) return 'text-green-400';
    if (stability >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getPriceTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (trend < 0) return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-gray-400" />;
  };
  
  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <Card className="bg-slate-900/80 border-amber-900/30">
        <CardHeader>
          <CardTitle className="text-amber-400 uppercase tracking-wider text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Galactic Market
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Global Stability</p>
              <p className={cn("text-lg font-bold", getStabilityColor(market.globalStability))}>
                {market.globalStability}%
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Your Credits</p>
              <p className="text-lg font-bold text-amber-400">{playerCredits}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Resource Listings */}
      <Card className="bg-slate-900/80 border-amber-900/30">
        <CardHeader>
          <CardTitle className="text-amber-400 uppercase tracking-wider text-sm flex items-center gap-2">
            <Package className="w-4 h-4" />
            Resource Exchange
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.keys(marketResources).map((resourceId, i) => {
            const resource = marketResources[resourceId];
            const marketData = market.resources[resourceId];
            const playerHas = playerResources[resourceId] || 0;
            const isSelected = selectedResource === resourceId;
            
            // Apply reputation-based pricing
            const reputationDiscount = Math.floor((playerReputation - 50) / 10) * 2;
            const adjustedPrice = Math.max(10, Math.floor(marketData.current_price * (1 - reputationDiscount / 100)));
            
            return (
              <motion.div
                key={resourceId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "bg-slate-800/50 rounded-lg p-3 border transition-all",
                  isSelected ? "border-purple-500/50 bg-purple-900/20" : "border-slate-700/50 hover:border-amber-500/50"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-200">{resource.name}</h4>
                    <Badge variant="outline" className="text-[9px] mt-1">
                      {resource.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {getPriceTrendIcon(marketData.price_trend)}
                      <span className="text-lg font-bold text-amber-400">{adjustedPrice}₵</span>
                    </div>
                    {adjustedPrice !== marketData.current_price && (
                      <p className="text-[9px] text-green-400 line-through">
                        {marketData.current_price}₵
                      </p>
                    )}
                    <p className="text-[9px] text-gray-500">
                      {marketData.price_trend !== 0 && (
                        <span className={marketData.price_trend > 0 ? 'text-green-400' : 'text-red-400'}>
                          {marketData.price_trend > 0 ? '+' : ''}{marketData.price_trend}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-slate-900/50 rounded p-2">
                    <p className="text-[9px] text-gray-500">Supply</p>
                    <p className={cn(
                      "text-xs font-semibold",
                      marketData.supply > 150 ? "text-green-400" : 
                      marketData.supply < 50 ? "text-red-400" : "text-gray-300"
                    )}>
                      {Math.floor(marketData.supply)}
                    </p>
                  </div>
                  <div className="bg-slate-900/50 rounded p-2">
                    <p className="text-[9px] text-gray-500">Demand</p>
                    <p className={cn(
                      "text-xs font-semibold",
                      marketData.demand > 150 ? "text-red-400" : 
                      marketData.demand < 50 ? "text-green-400" : "text-gray-300"
                    )}>
                      {Math.floor(marketData.demand)}
                    </p>
                  </div>
                  <div className="bg-slate-900/50 rounded p-2">
                    <p className="text-[9px] text-gray-500">You Have</p>
                    <p className="text-xs font-semibold text-cyan-400">{playerHas}</p>
                  </div>
                </div>
                
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2 pt-2 border-t border-slate-700/50"
                  >
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="flex-1 h-8 bg-slate-900"
                        placeholder="Amount"
                      />
                      <span className="text-xs text-gray-500">
                        = {tradeAmount * adjustedPrice}₵
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={isProcessing || playerCredits < tradeAmount * adjustedPrice}
                        onClick={() => onBuy && onBuy(resourceId, tradeAmount, adjustedPrice)}
                        className="flex-1 bg-green-600 hover:bg-green-700 h-8 text-xs"
                      >
                        Buy
                      </Button>
                      <Button
                        size="sm"
                        disabled={isProcessing || playerHas < tradeAmount}
                        onClick={() => onSell && onSell(resourceId, tradeAmount, adjustedPrice)}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 h-8 text-xs"
                      >
                        Sell
                      </Button>
                    </div>
                  </motion.div>
                )}
                
                {!isSelected && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedResource(resourceId)}
                    className="w-full h-7 text-xs"
                  >
                    Trade
                  </Button>
                )}
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
      
      {/* Market Manipulation */}
      <Card className="bg-slate-900/80 border-red-900/30">
        <CardHeader>
          <CardTitle className="text-red-400 uppercase tracking-wider text-sm flex items-center gap-2">
            <Target className="w-4 h-4" />
            Market Manipulation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">
                Illegal market operations carry risks but offer high rewards
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button
              variant="outline"
              disabled={isProcessing || playerCredits < 2000}
              onClick={() => onManipulate && onManipulate('corner_market', manipulationTarget)}
              className="w-full justify-between border-red-500/30 hover:bg-red-900/20 text-left h-auto py-3"
            >
              <div>
                <p className="text-sm font-semibold text-red-300">Corner Market</p>
                <p className="text-[9px] text-gray-500">Buy out supply, control prices (2000₵)</p>
              </div>
              <Zap className="w-4 h-4 text-red-400" />
            </Button>
            
            <Button
              variant="outline"
              disabled={isProcessing || playerCredits < 1500}
              onClick={() => onManipulate && onManipulate('spread_rumors', manipulationTarget)}
              className="w-full justify-between border-red-500/30 hover:bg-red-900/20 text-left h-auto py-3"
            >
              <div>
                <p className="text-sm font-semibold text-red-300">Spread Rumors</p>
                <p className="text-[9px] text-gray-500">Manipulate demand artificially (1500₵)</p>
              </div>
              <Zap className="w-4 h-4 text-red-400" />
            </Button>
            
            <Button
              variant="outline"
              disabled={isProcessing || playerCredits < 1000}
              onClick={() => onManipulate && onManipulate('sabotage_supply', manipulationTarget)}
              className="w-full justify-between border-red-500/30 hover:bg-red-900/20 text-left h-auto py-3"
            >
              <div>
                <p className="text-sm font-semibold text-red-300">Sabotage Supply</p>
                <p className="text-[9px] text-gray-500">Reduce competitor supply (1000₵)</p>
              </div>
              <Zap className="w-4 h-4 text-red-400" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}