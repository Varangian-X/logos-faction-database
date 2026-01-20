import React, { useState } from 'react';
import { useGameState } from '@/contexts/GameStateContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Factory, TrendingUp, Ship, Building2, Zap, Pickaxe, Beaker } from 'lucide-react';
import { toast } from "sonner";

// Placeholder components for missing dependencies
const MarketOverview = ({ marketData, onBuy, onSell, isProcessing }: any) => (
  <div className="p-4 bg-slate-900 rounded border border-slate-700">
    <h3 className="text-cyan-400 mb-4">Market Overview</h3>
    <div className="grid grid-cols-1 gap-4">
      {marketData.map((item: any) => (
        <div key={item.id} className="flex justify-between items-center p-2 bg-slate-800 rounded">
          <span>{item.name}</span>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onBuy(item.id)} disabled={isProcessing}>Buy</Button>
            <Button size="sm" onClick={() => onSell(item.id)} disabled={isProcessing}>Sell</Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TradeRouteManager = ({ tradeRoutes, availablePartners, tradeHubs, onEstablishRoute, onCancelRoute, isProcessing }: any) => (
  <div className="p-4 bg-slate-900 rounded border border-slate-700">
    <h3 className="text-cyan-400 mb-4">Trade Routes</h3>
    <div className="space-y-4">
      {tradeRoutes.map((route: any) => (
        <div key={route.id} className="flex justify-between items-center p-2 bg-slate-800 rounded">
          <span>Route to {route.destination}</span>
          <Button size="sm" variant="destructive" onClick={() => onCancelRoute(route.id)} disabled={isProcessing}>Cancel</Button>
        </div>
      ))}
      <Button className="w-full" onClick={() => onEstablishRoute(availablePartners[0]?.id)} disabled={isProcessing || tradeRoutes.length >= tradeHubs}>
        Establish New Route
      </Button>
    </div>
  </div>
);

const INFRASTRUCTURE = {
  trade_hub: { name: 'Trade Hub', cost: 1000, upkeep: 50, produces: { credits: 100 } },
  mining_facility: { name: 'Mining Facility', cost: 1500, upkeep: 100, produces: { metal: 50 } },
  research_lab: { name: 'Research Lab', cost: 2000, upkeep: 150, produces: { tech: 10 } }
};

const EconomicDashboard = () => {
  const { gameState, setGameState } = useGameState();
  const [activeTab, setActiveTab] = useState('market');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data derived from gameState
  const marketData = [
    { id: 'minerals', name: 'Refined Minerals', price: 120, trend: 'up' },
    { id: 'components', name: 'Tech Components', price: 350, trend: 'stable' },
    { id: 'fuel', name: 'He3 Fuel Cells', price: 80, trend: 'down' }
  ];

  const tradeRoutes = gameState.tradeRoutes || [];
  const infrastructure = gameState.infrastructure || [];
  const maxTradeRoutes = gameState.maxTradeRoutes || 3;
  const tradePartners = [{ id: 'partner-1', name: 'House Chen' }, { id: 'partner-2', name: 'Vanta Crucible' }];

  const handleBuy = (itemId: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      toast.success(`Bought ${itemId}`);
      setIsProcessing(false);
    }, 500);
  };

  const handleSell = (itemId: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      toast.success(`Sold ${itemId}`);
      setIsProcessing(false);
    }, 500);
  };

  const handleEstablishRoute = (partnerId: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const newRoute = { id: `tr-${Date.now()}`, destination: partnerId, status: 'active', income: 50 };
      setGameState(prev => ({
        ...prev,
        tradeRoutes: [...prev.tradeRoutes, newRoute]
      }));
      toast.success("Trade route established");
      setIsProcessing(false);
    }, 1000);
  };

  const handleCancelRoute = (routeId: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        tradeRoutes: prev.tradeRoutes.filter(r => r.id !== routeId)
      }));
      toast.success("Trade route cancelled");
      setIsProcessing(false);
    }, 500);
  };

  return (
    <div className="p-6 bg-black min-h-screen text-gray-200">
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="h-8 w-8 text-cyan-500" />
        <h1 className="text-3xl font-bold text-white tracking-widest">ECONOMIC COMMAND</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-900 border border-slate-700">
          <TabsTrigger value="market" className="data-[state=active]:bg-cyan-900/50">Marketplace</TabsTrigger>
          <TabsTrigger value="trade" className="data-[state=active]:bg-cyan-900/50">Trade Network</TabsTrigger>
          <TabsTrigger value="infrastructure" className="data-[state=active]:bg-cyan-900/50">Infrastructure</TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MarketOverview 
                marketData={marketData}
                onBuy={handleBuy}
                onSell={handleSell}
                isProcessing={isProcessing}
              />
            </div>
            <div className="space-y-6">
              <Card className="bg-slate-900/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-sm text-slate-300 uppercase">Market News</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-xs border-l-2 border-green-500 pl-3 py-1">
                    <p className="text-green-400 font-bold">Mineral Boom</p>
                    <p className="text-slate-400">New deposits found in Sector 7. Mineral prices stabilizing.</p>
                  </div>
                  <div className="text-xs border-l-2 border-red-500 pl-3 py-1">
                    <p className="text-red-400 font-bold">Blockade Rumors</p>
                    <p className="text-slate-400">House Chen threatens trade lanes. Weapon demand rising.</p>
                  </div>
                  <div className="text-xs border-l-2 border-amber-500 pl-3 py-1">
                    <p className="text-amber-400 font-bold">Tech Shortage</p>
                    <p className="text-slate-400">Component factories offline in Core Systems.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-900/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-sm text-slate-300 uppercase">Your Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 flex items-center gap-2"><TrendingUp className="w-3 h-3" /> Credits</span>
                      <span className="text-slate-200 font-mono">{gameState.credits}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 flex items-center gap-2"><Pickaxe className="w-3 h-3" /> Metal</span>
                      <span className="text-slate-200 font-mono">{gameState.metal}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 flex items-center gap-2"><Zap className="w-3 h-3" /> Energy</span>
                      <span className="text-slate-200 font-mono">{gameState.energy}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 flex items-center gap-2"><Beaker className="w-3 h-3" /> Tech</span>
                      <span className="text-slate-200 font-mono">{gameState.tech}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 flex items-center gap-2"><Ship className="w-3 h-3" /> Manpower</span>
                      <span className="text-slate-200 font-mono">{gameState.manpower}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trade" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TradeRouteManager 
                tradeRoutes={tradeRoutes}
                availablePartners={tradePartners}
                tradeHubs={infrastructure.filter((i: any) => i.type === 'trade_hub').length}
                onEstablishRoute={handleEstablishRoute}
                onCancelRoute={handleCancelRoute}
                isProcessing={isProcessing}
              />
            </div>
            <div>
              <Card className="bg-slate-900/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-sm text-slate-300 uppercase">Trade Network Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Active Routes</span>
                    <span className="text-cyan-400 font-bold">{tradeRoutes.length} / {maxTradeRoutes}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Trade Efficiency</span>
                    <span className="text-green-400 font-bold">115%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Piracy Risk</span>
                    <span className="text-amber-400 font-bold">Low (12%)</span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase mb-2">Top Export</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">
                        <Factory className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">Minerals</p>
                        <p className="text-slate-500 text-[10px]">450 units/turn</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(INFRASTRUCTURE).map(([key, building]) => (
              <Card key={key} className="bg-slate-900/80 border-slate-700 hover:border-cyan-500/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-cyan-400 uppercase flex justify-between">
                    {building.name}
                    <span className="text-slate-500 text-xs">{infrastructure.filter((i: any) => i.type === key).length} Active</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Cost:</span>
                      <span className="text-amber-400">{building.cost} ₵</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Upkeep:</span>
                      <span className="text-red-400">-{building.upkeep} ₵</span>
                    </div>
                    {building.produces && (
                      <div className="flex justify-between">
                        <span>Produces:</span>
                        <span className="text-green-400">
                          {Object.entries(building.produces).map(([k, v]) => `${v} ${k}`).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button 
                    className="w-full bg-slate-800 hover:bg-cyan-900/50 border border-slate-700 hover:border-cyan-500/50"
                    disabled={gameState.credits < building.cost}
                    onClick={() => {
                      if (gameState.credits >= building.cost) {
                        const newBuilding = { 
                          id: `i-${Date.now()}`, 
                          type: key, 
                          status: 'active' as const, 
                          efficiency: 1.0 
                        };
                        
                        const newMaxRoutes = key === 'trade_hub' ? maxTradeRoutes + 2 : maxTradeRoutes;

                        setGameState(prev => ({ 
                          ...prev,
                          credits: prev.credits - building.cost,
                          infrastructure: [...prev.infrastructure, newBuilding],
                          maxTradeRoutes: newMaxRoutes
                        }));
                        toast.success(`Constructed ${building.name}`);
                      }
                    }}
                  >
                    Construct
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EconomicDashboard;
