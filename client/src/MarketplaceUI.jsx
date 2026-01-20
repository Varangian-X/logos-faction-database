import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, TrendingDown, Minus, ShoppingCart, 
  DollarSign, AlertTriangle, TrendingDown as Crash,
  Eye, Building, Ship, Package, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MARKET_CATEGORIES } from './DynamicMarketSystem';
import { INVESTMENT_OPPORTUNITIES } from './InvestmentSystem';

const categoryIcons = {
  resources: Package,
  equipment: Zap,
  information: Eye,
  ships: Ship
};

export default function MarketplaceUI({ 
  marketPrices = {}, 
  gameState = {}, 
  onTrade,
  onInvest,
  onManipulate
}) {
  const [selectedCategory, setSelectedCategory] = useState('resources');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('market');

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'falling': return <TrendingDown className="w-3 h-3 text-red-400" />;
      default: return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'rising': return 'text-green-400';
      case 'falling': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-slate-900/80 rounded-xl border border-cyan-900/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
          <Building className="w-6 h-6" />
          Galactic Marketplace
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-500">Credits:</span>
            <span className="text-amber-400 font-mono ml-2">{gameState.credits || 0} ₡</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="market">Trading Floor</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="manipulation">Market Ops</TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="space-y-4">
          {/* Category Selection */}
          <div className="flex gap-2 mb-4">
            {Object.entries(MARKET_CATEGORIES).map(([key, category]) => {
              const Icon = categoryIcons[key];
              return (
                <Button
                  key={key}
                  variant={selectedCategory === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                  className={cn(
                    selectedCategory === key && 'bg-cyan-600 hover:bg-cyan-700'
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(MARKET_CATEGORIES[selectedCategory]?.items || {}).map(([itemKey, item]) => {
              const priceData = marketPrices[itemKey] || { current: item.basePrice, trend: 'stable' };
              const priceChange = priceData.history?.length > 1 
                ? ((priceData.current - priceData.history[priceData.history.length - 2]) / priceData.history[priceData.history.length - 2] * 100)
                : 0;

              return (
                <motion.div
                  key={itemKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 hover:border-cyan-500/50 transition-all cursor-pointer"
                  onClick={() => setSelectedItem({ ...item, key: itemKey, priceData })}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-200">{item.name}</h3>
                      {item.strategic && (
                        <Badge className="mt-1 bg-purple-500/20 text-purple-300 text-xs">Strategic</Badge>
                      )}
                      {item.illegal && (
                        <Badge className="mt-1 bg-red-500/20 text-red-300 text-xs">Illegal</Badge>
                      )}
                    </div>
                    {getTrendIcon(priceData.trend)}
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-xl font-bold text-amber-400 font-mono">
                      {priceData.current} ₡
                    </span>
                    <span className={cn('text-xs font-mono', getTrendColor(priceData.trend))}>
                      {priceChange > 0 && '+'}{priceChange.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex gap-2 text-xs">
                    <span className="text-gray-500">Supply: {priceData.supply || 100}</span>
                    <span className="text-gray-500">Demand: {priceData.demand || 100}</span>
                  </div>

                  {priceData.volatility > 0.5 && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-orange-400">
                      <AlertTriangle className="w-3 h-3" />
                      High Volatility
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Trade Panel */}
          <AnimatePresence>
            {selectedItem && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-800 rounded-lg border border-cyan-500/50 p-4 mt-4"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-cyan-400">{selectedItem.name}</h3>
                    <p className="text-sm text-gray-400">Current Price: {selectedItem.priceData.current} ₡</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>✕</Button>
                </div>

                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 mb-1 block">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onTrade?.(selectedItem.key, quantity, 'buy')}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={gameState.credits < selectedItem.priceData.current * quantity}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy ({selectedItem.priceData.current * quantity} ₡)
                    </Button>
                    <Button
                      onClick={() => onTrade?.(selectedItem.key, quantity, 'sell')}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Sell
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="investments" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Trade Routes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {INVESTMENT_OPPORTUNITIES.trade_routes.map(route => (
                  <InvestmentCard key={route.id} investment={route} gameState={gameState} onInvest={onInvest} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Business Ventures</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {INVESTMENT_OPPORTUNITIES.businesses.map(business => (
                  <InvestmentCard key={business.id} investment={business} gameState={gameState} onInvest={onInvest} />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manipulation" className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg border border-orange-500/30 p-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-orange-400">Market Manipulation</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Risky operations that can shift market prices in your favor. High risk, high reward.
            </p>

            <div className="grid gap-3">
              <ManipulationOption
                type="pump"
                name="Pump & Dump"
                description="Artificially inflate prices, then sell at peak"
                cost={2000}
                risk="High"
                onExecute={() => onManipulate?.('pump')}
              />
              <ManipulationOption
                type="corner"
                name="Market Corner"
                description="Buy up all supply to control prices"
                cost={5000}
                risk="Very High"
                onExecute={() => onManipulate?.('corner')}
              />
              <ManipulationOption
                type="insider"
                name="Insider Trading"
                description="Use advance knowledge of market moves"
                cost={1500}
                risk="Medium"
                onExecute={() => onManipulate?.('insider')}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InvestmentCard({ investment, gameState, onInvest }) {
  const canAfford = gameState.credits >= investment.initial_cost;
  const owned = gameState.investments?.some(inv => inv.id === investment.id);

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-200">{investment.name}</h4>
        {investment.illegal && <Badge className="bg-red-500/20 text-red-300 text-xs">Illegal</Badge>}
      </div>
      <p className="text-xs text-gray-400 mb-3">{investment.description}</p>
      
      <div className="space-y-1 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-gray-500">Cost:</span>
          <span className="text-amber-400 font-mono">{investment.initial_cost} ₡</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Income/Turn:</span>
          <span className="text-green-400 font-mono">+{investment.base_income} ₡</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Risk Level:</span>
          <span className={cn(
            'font-medium',
            investment.risk > 0.4 ? 'text-red-400' : investment.risk > 0.2 ? 'text-orange-400' : 'text-green-400'
          )}>
            {investment.risk > 0.4 ? 'High' : investment.risk > 0.2 ? 'Medium' : 'Low'}
          </span>
        </div>
      </div>

      <Button
        onClick={() => onInvest?.(investment.id)}
        disabled={!canAfford || owned}
        className="w-full"
        size="sm"
      >
        {owned ? 'Already Owned' : canAfford ? 'Invest' : 'Insufficient Credits'}
      </Button>
    </div>
  );
}

function ManipulationOption({ type, name, description, cost, risk, onExecute }) {
  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-gray-200 text-sm">{name}</h4>
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
        <Badge className={cn(
          'text-xs',
          risk === 'Very High' ? 'bg-red-500/20 text-red-300' :
          risk === 'High' ? 'bg-orange-500/20 text-orange-300' :
          'bg-yellow-500/20 text-yellow-300'
        )}>
          {risk} Risk
        </Badge>
      </div>
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-gray-500">Cost: {cost} ₡</span>
        <Button onClick={onExecute} size="sm" variant="outline" className="text-xs">
          Execute
        </Button>
      </div>
    </div>
  );
}