import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RESOURCES } from './EconomicSystem';

export default function MarketSystemHub({
  marketPrices = {},
  playerResources = {},
  onBuyResource,
  onSellResource,
  isProcessing
}) {
  return (
    <Card className="bg-slate-900/80 border-amber-500/30">
      <CardHeader>
        <CardTitle className="text-amber-400 text-sm flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Galactic Market
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {Object.entries(RESOURCES).map(([key, resource]) => {
          if (key === 'credits') return null;
          
          const currentPrice = marketPrices[key] || resource.basePrice;
          const basePrice = resource.basePrice;
          const priceChange = ((currentPrice - basePrice) / basePrice) * 100;
          const owned = playerResources[key] || 0;
          
          return (
            <div key={key} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-bold text-gray-200 flex items-center gap-1">
                    <span>{resource.icon}</span>
                    {resource.name}
                  </p>
                  <p className="text-[10px] text-gray-500">{resource.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-300">{currentPrice}₵</p>
                  <Badge className={cn(
                    "text-[9px]",
                    priceChange > 5 ? "bg-red-500/20 text-red-400" :
                    priceChange < -5 ? "bg-green-500/20 text-green-400" :
                    "bg-gray-500/20 text-gray-400"
                  )}>
                    {priceChange > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {priceChange > 0 ? '+' : ''}{priceChange.toFixed(1)}%
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-[10px] mb-2">
                <span className="text-gray-500">Owned: {owned}</span>
                <span className="text-gray-600">Base: {basePrice}₵</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => onBuyResource(key, 10)}
                  disabled={isProcessing}
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700 h-7 text-xs"
                >
                  Buy 10 ({currentPrice * 10}₵)
                </Button>
                <Button
                  onClick={() => onSellResource(key, 10)}
                  disabled={isProcessing || owned < 10}
                  size="sm"
                  className="flex-1 bg-red-600 hover:bg-red-700 h-7 text-xs"
                >
                  Sell 10 ({currentPrice * 10}₵)
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}