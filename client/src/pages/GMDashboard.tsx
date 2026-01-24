import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { topFactions, getFactionRelationship } from '@/lib/factionMetrics';
import { Shield, Coins, Crown, Zap, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GMDashboard() {
  const [selectedFaction, setSelectedFaction] = useState(topFactions[0]);
  const [expandedMetrics, setExpandedMetrics] = useState<string | null>(null);

  const getThreatColor = (threatLevel: string) => {
    switch (threatLevel) {
      case 'EXISTENTIAL':
        return 'text-red-500 border-red-500/50 bg-red-500/10';
      case 'HIGH':
        return 'text-orange-500 border-orange-500/50 bg-orange-500/10';
      case 'MODERATE':
        return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10';
      case 'LOW':
        return 'text-green-500 border-green-500/50 bg-green-500/10';
      default:
        return 'text-gray-500 border-gray-500/50 bg-gray-500/10';
    }
  };

  const getAlignmentColor = (alignment: string) => {
    switch (alignment) {
      case 'Stasis':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'Plasticity':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
    }
  };

  const MetricBar = ({
    label,
    value,
    max = 30,
    icon: Icon,
    color,
  }: {
    label: string;
    value: number;
    max?: number;
    icon: React.ReactNode;
    color: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded ${color}`}>{Icon}</div>
          <span className="text-sm font-medium text-gray-300">{label}</span>
        </div>
        <span className={`text-lg font-bold ${color}`}>{value.toFixed(1)}</span>
      </div>
      <Progress
        value={(value / max) * 100}
        className="h-3 bg-gray-900"
        indicatorClassName={color.replace('text-', 'bg-')}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e17] via-[#0f1419] to-[#0a0e17] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold text-yellow-500 tracking-widest uppercase flex items-center gap-3">
            <Crown className="h-8 w-8" />
            GM Dashboard: Imperial Power Analysis
          </h1>
          <p className="text-gray-400">
            Real-time faction power metrics and strategic relationships
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Faction Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="bg-[#0a0f14]/80 border-yellow-500/30 h-full">
              <CardHeader>
                <CardTitle className="text-yellow-500">Top 5 Factions</CardTitle>
                <CardDescription>Click to view detailed metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topFactions.map((faction, idx) => (
                  <motion.button
                    key={faction.factionId}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedFaction(faction)}
                    className={`w-full p-3 rounded border transition-all text-left ${
                      selectedFaction.factionId === faction.factionId
                        ? 'border-yellow-500 bg-yellow-500/20'
                        : 'border-gray-700 bg-gray-900/40 hover:border-yellow-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{idx + 1}. {faction.factionName}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getAlignmentColor(faction.alignment)}`}
                      >
                        {faction.alignment}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400">
                      Power: {faction.totalPowerScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {faction.signatureUnit}
                    </div>
                  </motion.button>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Center & Right: Detailed Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Faction Header */}
            <Card className="bg-gradient-to-r from-[#0a0f14]/80 to-[#1a1f2e]/80 border-yellow-500/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-yellow-500">
                      {selectedFaction.factionName}
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-2">
                      {selectedFaction.primaryResources.join(' • ')}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-yellow-500">
                      {selectedFaction.totalPowerScore.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">Total Power Score</div>
                    <Badge className={`mt-2 ${getThreatColor(selectedFaction.threatLevel)}`}>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {selectedFaction.threatLevel}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Metrics Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-900/50">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                <TabsTrigger value="relationships">Relationships</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <Card className="bg-[#0a0f14]/80 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Power Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <MetricBar
                      label="Military Strength"
                      value={selectedFaction.militaryStrength}
                      icon={<Shield className="h-4 w-4" />}
                      color="text-red-400"
                    />
                    <MetricBar
                      label="Economic Power"
                      value={selectedFaction.economicPower}
                      icon={<Coins className="h-4 w-4" />}
                      color="text-green-400"
                    />
                    <MetricBar
                      label="Political Influence"
                      value={selectedFaction.politicalInfluence}
                      icon={<Crown className="h-4 w-4" />}
                      color="text-blue-400"
                    />
                  </CardContent>
                </Card>

                {/* Radar-like Summary */}
                <Card className="bg-[#0a0f14]/80 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm">Faction Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Alignment:</span>
                        <div className={`mt-1 px-2 py-1 rounded text-xs font-bold ${getAlignmentColor(selectedFaction.alignment)}`}>
                          {selectedFaction.alignment}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Threat Level:</span>
                        <div className={`mt-1 px-2 py-1 rounded text-xs font-bold ${getThreatColor(selectedFaction.threatLevel)}`}>
                          {selectedFaction.threatLevel}
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Signature Unit:</span>
                      <div className="text-white font-semibold mt-1">{selectedFaction.signatureUnit}</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Breakdown Tab */}
              <TabsContent value="breakdown" className="space-y-4">
                <Card className="bg-[#0a0f14]/80 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Metric Breakdown</CardTitle>
                    <CardDescription>Detailed component analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Military Breakdown */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() =>
                        setExpandedMetrics(
                          expandedMetrics === 'military' ? null : 'military'
                        )
                      }
                      className="cursor-pointer p-4 rounded border border-gray-700 hover:border-red-500/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-red-400" />
                          <span className="font-bold text-white">Military Strength</span>
                        </div>
                        <span className="text-2xl font-bold text-red-400">
                          {selectedFaction.militaryStrength}
                        </span>
                      </div>
                      <Progress
                        value={(selectedFaction.militaryStrength / 30) * 100}
                        className="h-2 bg-gray-900"
                        indicatorClassName="bg-red-500"
                      />
                      {expandedMetrics === 'military' && (
                        <div className="mt-3 pt-3 border-t border-gray-700 text-sm text-gray-400 space-y-1">
                          <div>• Elite Combat Units: {Math.floor(selectedFaction.militaryStrength / 3)}</div>
                          <div>• Fleet Assets: Varies</div>
                          <div>• Territorial Control: Fortified</div>
                        </div>
                      )}
                    </motion.div>

                    {/* Economic Breakdown */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() =>
                        setExpandedMetrics(
                          expandedMetrics === 'economic' ? null : 'economic'
                        )
                      }
                      className="cursor-pointer p-4 rounded border border-gray-700 hover:border-green-500/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Coins className="h-5 w-5 text-green-400" />
                          <span className="font-bold text-white">Economic Power</span>
                        </div>
                        <span className="text-2xl font-bold text-green-400">
                          {selectedFaction.economicPower}
                        </span>
                      </div>
                      <Progress
                        value={(selectedFaction.economicPower / 30) * 100}
                        className="h-2 bg-gray-900"
                        indicatorClassName="bg-green-500"
                      />
                      {expandedMetrics === 'economic' && (
                        <div className="mt-3 pt-3 border-t border-gray-700 text-sm text-gray-400 space-y-1">
                          <div>• Key Resources: {selectedFaction.primaryResources.length}</div>
                          <div>• Production Capacity: Active</div>
                          <div>• Trade Network: Established</div>
                        </div>
                      )}
                    </motion.div>

                    {/* Political Breakdown */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() =>
                        setExpandedMetrics(
                          expandedMetrics === 'political' ? null : 'political'
                        )
                      }
                      className="cursor-pointer p-4 rounded border border-gray-700 hover:border-blue-500/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Crown className="h-5 w-5 text-blue-400" />
                          <span className="font-bold text-white">Political Influence</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-400">
                          {selectedFaction.politicalInfluence}
                        </span>
                      </div>
                      <Progress
                        value={(selectedFaction.politicalInfluence / 30) * 100}
                        className="h-2 bg-gray-900"
                        indicatorClassName="bg-blue-500"
                      />
                      {expandedMetrics === 'political' && (
                        <div className="mt-3 pt-3 border-t border-gray-700 text-sm text-gray-400 space-y-1">
                          <div>• Alignment: {selectedFaction.alignment}</div>
                          <div>• Threat Level: {selectedFaction.threatLevel}</div>
                          <div>• Information Control: Active</div>
                        </div>
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Relationships Tab */}
              <TabsContent value="relationships" className="space-y-4">
                <Card className="bg-[#0a0f14]/80 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Faction Relationships</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Allies */}
                    <div>
                      <h3 className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Natural Allies
                      </h3>
                      <div className="space-y-2">
                        {selectedFaction.naturalAllies.map((ally) => (
                          <div
                            key={ally}
                            className="p-2 rounded bg-green-500/10 border border-green-500/30 text-sm text-green-300"
                          >
                            ✓ {ally}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enemies */}
                    <div>
                      <h3 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Natural Enemies
                      </h3>
                      <div className="space-y-2">
                        {selectedFaction.naturalEnemies.map((enemy) => (
                          <div
                            key={enemy}
                            className="p-2 rounded bg-red-500/10 border border-red-500/30 text-sm text-red-300"
                          >
                            ✗ {enemy}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* Power Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-[#0a0f14]/80 border-gray-700">
            <CardHeader>
              <CardTitle>Top 5 Factions: Power Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topFactions.map((faction) => (
                  <div key={faction.factionId} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-white">{faction.factionName}</span>
                      <span className="text-yellow-500 font-bold">
                        {faction.totalPowerScore.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-2 h-6">
                      <div className="flex-1 rounded bg-gray-900 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(faction.militaryStrength / 30) * 100}%`,
                          }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                          className="h-full bg-red-500/70"
                          title={`Military: ${faction.militaryStrength}`}
                        />
                      </div>
                      <div className="flex-1 rounded bg-gray-900 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(faction.economicPower / 30) * 100}%`,
                          }}
                          transition={{ delay: 0.6, duration: 0.8 }}
                          className="h-full bg-green-500/70"
                          title={`Economic: ${faction.economicPower}`}
                        />
                      </div>
                      <div className="flex-1 rounded bg-gray-900 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(faction.politicalInfluence / 30) * 100}%`,
                          }}
                          transition={{ delay: 0.7, duration: 0.8 }}
                          className="h-full bg-blue-500/70"
                          title={`Political: ${faction.politicalInfluence}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700 flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500/70" />
                  <span className="text-gray-400">Military Strength</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500/70" />
                  <span className="text-gray-400">Economic Power</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500/70" />
                  <span className="text-gray-400">Political Influence</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
