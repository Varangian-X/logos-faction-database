import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Coins, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Swords,
  Target,
  Eye
} from 'lucide-react';
import { topFactions, getFactionMetrics } from '@/lib/factionMetrics';
import { FactionNetworkGraph } from '@/components/FactionNetworkGraph';
import { 
  calculatePendulumState, 
  getPendulumNarrative,
  calculatePendulumEffects,
  type TacticalHeat 
} from '@/lib/byzantinePendulum';
import { 
  initializeDefaultStandings,
  getRelationshipFromReputation,
  type PlayerFactionStanding 
} from '@/lib/factionStanding';
import { 
  calculateEncounterFrequency,
  generateEncounter 
} from '@/lib/combatEncounters';

/**
 * Faction Intelligence Interface
 * Unified dashboard for monitoring faction power, relationships, and player standing
 */

export default function FactionIntelligence() {
  // Initialize player standings (in real game, this would come from game state)
  const [playerStandings] = useState<PlayerFactionStanding[]>(initializeDefaultStandings());
  
  // Calculate Byzantine Pendulum state
  const activeFactions = topFactions.map(f => f.factionId);
  const pendulumState = calculatePendulumState(activeFactions);
  const pendulumEffects = calculatePendulumEffects(pendulumState);

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-serif text-[#D4AF37]">Faction Intelligence</h1>
          <Badge variant="outline" className="text-[#00E5FF] border-[#00E5FF]">
            CLASSIFIED // EYES ONLY
          </Badge>
        </div>
        <p className="text-white/60">Strategic analysis of factional power dynamics and political topology</p>
      </div>

      {/* Byzantine Pendulum Status */}
      <div className="max-w-7xl mx-auto mb-6">
        <Card className="bg-black/40 border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
              <Target className="w-5 h-5" />
              Byzantine Pendulum Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Pendulum Visual */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-white/70">Stasis Influence</span>
                    <span className="text-sm text-[#D4AF37]">{pendulumState.stasisInfluence.toFixed(1)}%</span>
                  </div>
                  <Progress value={pendulumState.stasisInfluence} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-white/70">Plasticity Influence</span>
                    <span className="text-sm text-[#FF3333]">{pendulumState.plasticityInfluence.toFixed(1)}%</span>
                  </div>
                  <Progress value={pendulumState.plasticityInfluence} className="h-2" />
                </div>
              </div>

              {/* Tactical Heat */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">Tactical Heat</span>
                  <span className="text-sm text-[#FF3333]">{pendulumState.level.toFixed(0)}/100</span>
                </div>
                <Progress value={pendulumState.level} className="h-3" />
              </div>

              {/* State Badge */}
              <div className="flex items-center gap-4">
                <Badge 
                  variant="outline" 
                  className={
                    pendulumState.state === 'stasis-dominant' 
                      ? 'text-[#D4AF37] border-[#D4AF37]'
                      : pendulumState.state === 'plasticity-dominant'
                      ? 'text-[#FF3333] border-[#FF3333]'
                      : 'text-[#00E5FF] border-[#00E5FF]'
                  }
                >
                  {pendulumState.state.toUpperCase().replace('-', ' ')}
                </Badge>
                <span className="text-sm text-white/60 italic">
                  {getPendulumNarrative(pendulumState)}
                </span>
              </div>

              {/* Effects Summary */}
              <div className="grid grid-cols-4 gap-3 pt-2">
                <div className="text-center p-2 bg-white/5 rounded">
                  <div className="text-xs text-white/50 mb-1">Combat</div>
                  <div className="text-sm text-white">×{pendulumEffects.combatModifier.toFixed(2)}</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded">
                  <div className="text-xs text-white/50 mb-1">Encounters</div>
                  <div className="text-sm text-white">×{pendulumEffects.encounterRate.toFixed(2)}</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded">
                  <div className="text-xs text-white/50 mb-1">Market</div>
                  <div className="text-sm text-white">{pendulumEffects.marketPriceVariance > 0 ? '+' : ''}{pendulumEffects.marketPriceVariance.toFixed(0)}%</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded">
                  <div className="text-xs text-white/50 mb-1">Diplomacy</div>
                  <div className="text-sm text-white">×{pendulumEffects.diplomaticDifficulty.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/40">
            <TabsTrigger value="overview">Power Overview</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
            <TabsTrigger value="standing">Your Standing</TabsTrigger>
            <TabsTrigger value="threats">Threat Assessment</TabsTrigger>
          </TabsList>

          {/* Power Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-[#D4AF37]">Top Five Factions by Power</CardTitle>
                <CardDescription>Military, Economic, and Political influence rankings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topFactions.map((faction, index) => (
                    <div key={faction.factionId} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-white/30">#{index + 1}</span>
                            <h3 className="text-lg font-serif text-white">{faction.factionName}</h3>
                            <Badge 
                              variant="outline"
                              className={
                                faction.alignment === 'Stasis' 
                                  ? 'text-[#D4AF37] border-[#D4AF37]'
                                  : faction.alignment === 'Plasticity'
                                  ? 'text-[#FF3333] border-[#FF3333]'
                                  : 'text-white/70 border-white/30'
                              }
                            >
                              {faction.alignment}
                            </Badge>
                          </div>
                          <p className="text-sm text-white/50 mt-1">
                            Primary Unit: {faction.signatureUnit}
                          </p>
                        </div>
                        <Badge 
                          variant="outline"
                          className={
                            faction.threatLevel === 'EXISTENTIAL'
                              ? 'text-[#FF3333] border-[#FF3333]'
                              : 'text-white/70 border-white/30'
                          }
                        >
                          {faction.threatLevel}
                        </Badge>
                      </div>

                      {/* Power Metrics */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Shield className="w-4 h-4 text-[#FF3333]" />
                            <span className="text-xs text-white/50">Military</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={(faction.militaryStrength / 30) * 100} className="h-2" />
                            <span className="text-sm text-white">{faction.militaryStrength}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Coins className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-xs text-white/50">Economic</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={(faction.economicPower / 30) * 100} className="h-2" />
                            <span className="text-sm text-white">{faction.economicPower}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-[#00E5FF]" />
                            <span className="text-xs text-white/50">Political</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={(faction.politicalInfluence / 30) * 100} className="h-2" />
                            <span className="text-sm text-white">{faction.politicalInfluence}</span>
                          </div>
                        </div>
                      </div>

                      {/* Total Power Score */}
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/70">Total Power Score</span>
                          <span className="text-lg font-bold text-[#D4AF37]">{faction.totalPowerScore.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relationships Tab */}
          <TabsContent value="relationships">
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-[#D4AF37]">Faction Relationship Network</CardTitle>
                <CardDescription>Alliance and enmity topology</CardDescription>
              </CardHeader>
              <CardContent>
                <FactionNetworkGraph />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Your Standing Tab */}
          <TabsContent value="standing" className="space-y-4">
            {playerStandings.map(standing => {
              const faction = getFactionMetrics(standing.factionId);
              if (!faction) return null;

              const relationshipColor: Record<PlayerFactionStanding['relationship'], string> = {
                'hostile': 'text-[#FF3333] border-[#FF3333]',
                'unfriendly': 'text-orange-500 border-orange-500',
                'neutral': 'text-white/70 border-white/30',
                'friendly': 'text-green-500 border-green-500',
                'allied': 'text-[#00E5FF] border-[#00E5FF]',
              };
              const colorClass = relationshipColor[standing.relationship];

              return (
                <Card key={standing.factionId} className="bg-black/40 border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{faction.factionName}</CardTitle>
                      <Badge variant="outline" className={colorClass}>
                        {standing.relationship.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Reputation Bar */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-white/70">Reputation</span>
                          <span className="text-sm text-white">{standing.reputation}/100</span>
                        </div>
                        <Progress 
                          value={((standing.reputation + 100) / 200) * 100} 
                          className="h-2" 
                        />
                      </div>

                      {/* Encounter Frequency */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">Encounter Frequency</span>
                        <span className="text-white">
                          {(calculateEncounterFrequency(standing.factionId, playerStandings, 'inner-system') * 100).toFixed(0)}%
                        </span>
                      </div>

                      <Separator className="bg-white/10" />

                      {/* Relationship Effects */}
                      <div className="text-sm text-white/60">
                        {standing.relationship === 'allied' && '✓ Exclusive contracts available'}
                        {standing.relationship === 'friendly' && '✓ Trade discounts available'}
                        {standing.relationship === 'neutral' && '• Standard interactions'}
                        {standing.relationship === 'unfriendly' && '⚠ Increased inspection frequency'}
                        {standing.relationship === 'hostile' && '⚠ Active combat patrols targeting you'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Threat Assessment Tab */}
          <TabsContent value="threats" className="space-y-4">
            <Alert className="bg-[#FF3333]/10 border-[#FF3333]/30">
              <AlertTriangle className="h-4 w-4 text-[#FF3333]" />
              <AlertDescription className="text-white">
                Current Tactical Heat: <strong>{pendulumState.level.toFixed(0)}/100</strong>
                {pendulumState.level > 70 && ' - CRITICAL INSTABILITY'}
              </AlertDescription>
            </Alert>

            {topFactions.filter(f => f.threatLevel === 'EXISTENTIAL' || f.threatLevel === 'HIGH').map(faction => (
              <Card key={faction.factionId} className="bg-black/40 border-[#FF3333]/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#FF3333] flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      {faction.factionName}
                    </CardTitle>
                    <Badge variant="outline" className="text-[#FF3333] border-[#FF3333]">
                      {faction.threatLevel}
                    </Badge>
                  </div>
                  <CardDescription>Signature Unit: {faction.signatureUnit}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-white/70">
                    <p><strong>Military Strength:</strong> {faction.militaryStrength}/30</p>
                    <p><strong>Primary Resources:</strong> {faction.primaryResources.join(', ')}</p>
                    <p><strong>Known Allies:</strong> {faction.naturalAllies.slice(0, 3).join(', ')}</p>
                    <p><strong>Known Enemies:</strong> {faction.naturalEnemies.slice(0, 3).join(', ')}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto mt-6">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
        >
          ← Back to Menu
        </Button>
      </div>
    </div>
  );
}
