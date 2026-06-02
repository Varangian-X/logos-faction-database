import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Search, ArrowLeft, Loader2 } from 'lucide-react';
import { useImperialLedger } from '@/hooks/useImperialLedger';
import type { LedgerResource } from '@/lib/notionLedger';

type Resource = LedgerResource;

// Mock data - fallback if Notion fails
const MOCK_RESOURCES: Resource[] = [
  {
    id: 'prm',
    name: 'Promethium Reserve',
    symbol: 'PRMR',
    currentPrice: 3466.48,
    change24h: 120.50,
    changePercent24h: 3.60,
    supplyLevel: 65,
    demandLevel: 78,
    controlLevel: 85,
    trend: 'up',
    color: '#00E5FF',
    category: 'Strategic Material',
    strategicValue: 85,
    marketTrends: 'Rising',
    status: 'Active',
    priceHistory: [
      { time: '00:00', price: 3346 },
      { time: '04:00', price: 3380 },
      { time: '08:00', price: 3420 },
      { time: '12:00', price: 3460 },
      { time: '16:00', price: 3440 },
      { time: '20:00', price: 3466 },
    ],
  },
  {
    id: 'cbk',
    name: 'Corkwork Plating',
    symbol: 'CBKP',
    currentPrice: 82.86,
    change24h: -2.14,
    changePercent24h: -2.50,
    supplyLevel: 45,
    demandLevel: 32,
    controlLevel: 42,
    trend: 'down',
    color: '#FF3333',
    category: 'Industrial',
    strategicValue: 45,
    marketTrends: 'Depressed',
    status: 'Active',
    priceHistory: [
      { time: '00:00', price: 85 },
      { time: '04:00', price: 84 },
      { time: '08:00', price: 83.5 },
      { time: '12:00', price: 83 },
      { time: '16:00', price: 82.5 },
      { time: '20:00', price: 82.86 },
    ],
  },
  {
    id: 'vds',
    name: 'Voidstone Shards',
    symbol: 'VDSS',
    currentPrice: 12645.16,
    change24h: 2645.16,
    changePercent24h: 26.45,
    supplyLevel: 78,
    demandLevel: 92,
    controlLevel: 88,
    trend: 'up',
    color: '#00E5FF',
    category: 'Exotic',
    strategicValue: 92,
    marketTrends: 'Rising',
    status: 'Active',
    priceHistory: [
      { time: '00:00', price: 10000 },
      { time: '04:00', price: 10500 },
      { time: '08:00', price: 11200 },
      { time: '12:00', price: 12000 },
      { time: '16:00', price: 12400 },
      { time: '20:00', price: 12645 },
    ],
  },
  {
    id: 'osv',
    name: 'Ortho-Sheet Vellum',
    symbol: 'OSVL',
    currentPrice: 402.62,
    change24h: -5.38,
    changePercent24h: -1.32,
    supplyLevel: 55,
    demandLevel: 48,
    controlLevel: 62,
    trend: 'down',
    color: '#9D4EDD',
    category: 'Archival',
    strategicValue: 65,
    marketTrends: 'Stable',
    status: 'Active',
    priceHistory: [
      { time: '00:00', price: 408 },
      { time: '04:00', price: 405 },
      { time: '08:00', price: 404 },
      { time: '12:00', price: 403 },
      { time: '16:00', price: 402.8 },
      { time: '20:00', price: 402.62 },
    ],
  },
];

interface TickerCardProps {
  resource: Resource;
}

const TickerCard = ({ resource }: TickerCardProps) => {
  const isPositive = resource.trend === 'up';
  const trendColor = isPositive ? '#00E5FF' : '#FF3333';

  return (
    <div className="bg-black/40 border border-white/10 rounded p-4 hover:border-[#D4AF37]/50 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-xs text-white/50 font-mono uppercase">{resource.symbol}</div>
          <div className="text-sm font-serif text-white">{resource.name}</div>
        </div>
        {isPositive ? (
          <TrendingUp className="w-4 h-4" style={{ color: trendColor }} />
        ) : (
          <TrendingDown className="w-4 h-4" style={{ color: trendColor }} />
        )}
      </div>

      {/* Price */}
      <div className="mb-3">
        <div className="text-2xl font-bold text-[#D4AF37]">
          {resource.currentPrice.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <div
          className="text-xs font-mono mt-1"
          style={{ color: isPositive ? '#00E5FF' : '#FF3333' }}
        >
          {isPositive ? '▲' : '▼'} {Math.abs(resource.changePercent24h).toFixed(2)}%
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={60}>
        <LineChart data={resource.priceHistory}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <Line
            type="monotone"
            dataKey="price"
            stroke={trendColor}
            dot={false}
            strokeWidth={2}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Control Level */}
      <div className="mt-3 text-xs text-white/60">
        <div className="flex justify-between mb-1">
          <span>CTRL</span>
          <span>{resource.controlLevel}%</span>
        </div>
        <div className="w-full bg-white/10 rounded h-1.5">
          <div
            className="bg-gradient-to-r from-[#D4AF37] to-[#00E5FF] h-full rounded"
            style={{ width: `${resource.controlLevel}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default function ImperialLedger() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('markets');

  // Get Notion token from localStorage
  const notionToken = localStorage.getItem('notion_token') || null;
  const { resources, loading, error, lastSync, isConnected, syncResources } =
    useImperialLedger(notionToken);

  // Use Notion resources if available, otherwise use mock data
  const displayResources = resources.length > 0 ? resources : MOCK_RESOURCES;

  const filteredResources = useMemo(() => {
    return displayResources.filter((r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, displayResources]);

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-serif text-[#D4AF37] mb-2">
                ECONOMY • IMPERIAL LEDGER
              </h1>
              <div className="flex items-center gap-4 text-sm font-mono text-white/60">
                <span>CYCLE 30492.184</span>
                <span className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#00E5FF]' : 'bg-[#FF3333]'} ${isConnected ? 'animate-pulse' : ''}`}
                  />
                  {isConnected ? 'LIVE' : 'OFFLINE'}
                </span>
                {lastSync && (
                  <span className="text-xs text-white/40">
                    Last sync: {lastSync.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={syncResources}
                disabled={loading}
                variant="outline"
                className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    SYNCING
                  </>
                ) : (
                  'SYNC NOW'
                )}
              </Button>
              <Button
                variant="outline"
                className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
              >
                PAUSE
              </Button>
              <Button
                variant="outline"
                className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
              >
                DAY
              </Button>
              <Button
                variant="outline"
                className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
              >
                WEEK
              </Button>
              <Button className="bg-[#D4AF37] text-black hover:bg-[#E5C158]">CYCLE</Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent border-b border-[#D4AF37]/20 rounded-none w-full justify-start">
              <TabsTrigger
                value="markets"
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#D4AF37] data-[state=active]:bg-transparent rounded-none"
              >
                MARKETS
              </TabsTrigger>
              <TabsTrigger
                value="routes"
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#D4AF37] data-[state=active]:bg-transparent rounded-none"
              >
                TRADE ROUTES
              </TabsTrigger>
              <TabsTrigger
                value="treasuries"
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#D4AF37] data-[state=active]:bg-transparent rounded-none"
              >
                TREASURIES
              </TabsTrigger>
              <TabsTrigger
                value="anomalies"
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#D4AF37] data-[state=active]:bg-transparent rounded-none"
              >
                ANOMALIES
              </TabsTrigger>
            </TabsList>

            <TabsContent value="markets" className="mt-6">
              {/* Status Messages */}
              {error && (
                <div className="mb-4 p-3 bg-[#FF3333]/10 border border-[#FF3333]/30 rounded text-[#FF3333] text-sm">
                  {error}
                </div>
              )}

              {/* Search */}
              <div className="mb-6 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              {/* Resource Grid */}
              {loading && filteredResources.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
                  <span className="ml-2 text-white/60">Loading resources...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredResources.map((resource) => (
                    <TickerCard key={resource.id} resource={resource} />
                  ))}
                </div>
              )}

              {filteredResources.length === 0 && !loading && (
                <div className="text-center py-12 text-white/40">
                  No resources found matching your search.
                </div>
              )}
            </TabsContent>

            <TabsContent value="routes" className="mt-6">
              <div className="text-center py-12 text-white/40">Trade routes data coming soon...</div>
            </TabsContent>

            <TabsContent value="treasuries" className="mt-6">
              <div className="text-center py-12 text-white/40">Treasury data coming soon...</div>
            </TabsContent>

            <TabsContent value="anomalies" className="mt-6">
              <div className="text-center py-12 text-white/40">Anomaly tracking coming soon...</div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-white/60 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
