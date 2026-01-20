/**
 * GameHub.tsx - Central command center for Logos Imperium
 * 
 * Design Philosophy: Command Center Aesthetic
 * - Deep space blue background with cyan/electric blue accents
 * - Clean, data-driven layouts for strategic decision-making
 * - Glowing elements and sci-fi visual language
 * - Quick access to all major game systems
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Ship,
  Zap,
  TrendingUp,
  Users,
  Map,
  Settings,
  Save,
  BarChart3,
  Shield,
  Compass,
  Swords,
  PieChart,
  Globe,
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useGameState } from '@/contexts/GameStateContext';

export default function GameHub() {
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState('overview');
  const { gameState, setGameState, logResourceChange } = useGameState();

  const saveGame = () => {
    localStorage.setItem('logos_imperium_save', JSON.stringify(gameState));
  };

  const advanceTurn = () => {
    setGameState(prev => ({
      ...prev,
      turn: prev.turn + 1,
      daysPassed: prev.daysPassed + 1,
      credits: prev.credits + 100,
      energy: Math.min(prev.energy + 50, 1000)
    }));
    logResourceChange('credits', 100, gameState.credits + 100, 'Turn Income', 'End of turn income');
  };

  const systemHubs = [
    {
      id: 'fleet',
      title: 'Fleet Management',
      description: 'Build, customize, and command your spacecraft',
      icon: Ship,
      color: 'from-cyan-500/20 to-cyan-600/10',
      borderColor: 'border-cyan-500/30',
    },
    {
      id: 'combat',
      title: 'Combat System',
      description: 'Engage in tactical fleet battles',
      icon: Shield,
      color: 'from-red-500/20 to-red-600/10',
      borderColor: 'border-red-500/30',
    },
    {
      id: 'economy',
      title: 'Economic Dashboard',
      description: 'Manage trade routes and resources',
      icon: TrendingUp,
      color: 'from-amber-500/20 to-amber-600/10',
      borderColor: 'border-amber-500/30',
    },
    {
      id: 'intel',
      title: 'Intel & Analytics',
      description: 'Strategic compendium and data visualization',
      icon: PieChart,
      color: 'from-purple-500/20 to-purple-600/10',
      borderColor: 'border-purple-500/30',
    },
    {
      id: 'companions',
      title: 'Companion Panel',
      description: 'Recruit and manage your crew',
      icon: Users,
      color: 'from-purple-500/20 to-purple-600/10',
      borderColor: 'border-purple-500/30',
    },
    {
      id: 'world',
      title: 'World Map',
      description: 'Explore procedurally-generated locations',
      icon: Map,
      color: 'from-teal-500/20 to-teal-600/10',
      borderColor: 'border-teal-500/30',
    },
    {
      id: 'character',
      title: 'Character Sheet',
      description: 'View skills, traits, and progression',
      icon: Compass,
      color: 'from-blue-500/20 to-blue-600/10',
      borderColor: 'border-blue-500/30',
    },
    {
      id: 'battle',
      title: 'Tactical Battle',
      description: 'Engage in fleet-to-fleet combat',
      icon: Swords,
      color: 'from-orange-500/20 to-orange-600/10',
      borderColor: 'border-orange-500/30',
    },
  {
    id: 'faction',
    title: 'Faction Command',
    description: 'Diplomacy, espionage, and sector control',
    icon: Globe,
    color: 'from-yellow-500/20 to-yellow-600/10',
    borderColor: 'border-yellow-500/30',
  },
  {
    id: 'citizen',
    title: 'Citizen Profile',
    description: 'Identity, stress tracks, and asset manifest',
    icon: Users,
    color: 'from-red-500/20 to-red-600/10',
    borderColor: 'border-red-500/30',
  },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 grid-bg">
      {/* Header */}
      <header className="border-b border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-sm glow-cyan flex items-center justify-center">
              <Zap className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-cyan-300">LOGOS IMPERIUM</h1>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Command Center</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right text-sm">
              <p className="text-cyan-300 font-mono">Turn {gameState.turn}</p>
              <p className="text-slate-400 text-xs">Stress: {gameState.stress}%</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="tech-button"
              onClick={() => saveGame()}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="tech-button border-amber-500/50 text-amber-300 hover:bg-amber-500/10"
              onClick={() => advanceTurn()}
            >
              <Zap className="w-4 h-4 mr-2" />
              End Turn
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-3 bg-slate-900 border border-slate-700 mb-8">
            <TabsTrigger value="overview" className="data-text">Overview</TabsTrigger>
            <TabsTrigger value="systems" className="data-text">Systems</TabsTrigger>
            <TabsTrigger value="settings" className="data-text">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Status Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Credits Card */}
              <Card className="tech-panel border-cyan-500/30">
                <div className="p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Credits</p>
                  <p className="text-3xl font-bold text-cyan-300 font-mono">{gameState.credits.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mt-2">+500 per turn</p>
                </div>
              </Card>

              {/* Fleet Size Card */}
              <Card className="tech-panel border-cyan-500/30">
                <div className="p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Fleet Size</p>
                  <p className="text-3xl font-bold text-cyan-300 font-mono">{gameState.fleets?.length || 0}</p>
                  <p className="text-xs text-slate-500 mt-2">Ships under command</p>
                </div>
              </Card>

              {/* Companions Card */}
              <Card className="tech-panel border-purple-500/30">
                <div className="p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Companions</p>
                  <p className="text-3xl font-bold text-purple-300 font-mono">3</p>
                  <p className="text-xs text-slate-500 mt-2">Active advisors</p>
                </div>
              </Card>
            </div>

            {/* Resources Section */}
            <Card className="tech-panel border-amber-500/30">
              <div className="p-6">
                <h3 className="text-lg font-bold text-amber-300 mb-4 uppercase tracking-wider">Resources</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: 'Credits', value: gameState.credits },
                    { key: 'Metal', value: gameState.metal },
                    { key: 'Energy', value: gameState.energy },
                    { key: 'Tech', value: gameState.tech },
                    { key: 'Manpower', value: gameState.manpower }
                  ].map(({ key, value }) => (
                    <div key={key} className="space-y-2">
                      <p className="text-xs uppercase text-slate-400 tracking-widest">{key}</p>
                      <div className="bg-slate-900 rounded-sm p-3 border border-slate-700">
                        <p className="text-2xl font-bold text-amber-300 font-mono">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                className="tech-button h-12" 
                variant="outline"
                onClick={() => setLocation('/game/intel')}
              >
                <Zap className="w-4 h-4 mr-2" />
                Research
              </Button>
              <Button 
                className="tech-button h-12" 
                variant="outline"
                onClick={() => setLocation('/game/economy')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Trade
              </Button>
              <Button 
                className="tech-button h-12" 
                variant="outline"
                onClick={() => setLocation('/game/fleet')}
              >
                <Shield className="w-4 h-4 mr-2" />
                Defend
              </Button>
              <Button 
                className="tech-button h-12" 
                variant="outline"
                onClick={() => setLocation('/game/world')}
              >
                <Map className="w-4 h-4 mr-2" />
                Explore
              </Button>
            </div>
          </TabsContent>

          {/* Systems Tab */}
          <TabsContent value="systems" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemHubs.map((system) => {
                const Icon = system.icon;
                return (
                  <Card
                    key={system.id}
                    className={`tech-panel border-2 ${system.borderColor} cursor-pointer hover:shadow-lg transition-all duration-200 group`}
                  >
                    <div className="p-6">
                      <div className={`w-12 h-12 rounded-sm bg-gradient-to-br ${system.color} border ${system.borderColor} flex items-center justify-center mb-4 group-hover:glow-cyan`}>
                        <Icon className="w-6 h-6 text-cyan-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-100 mb-2">{system.title}</h3>
                      <p className="text-sm text-slate-400 mb-4">{system.description}</p>
                      <Button 
                    className="tech-button w-full" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (system.id === 'fleet') setLocation('/game/fleet');
                      else if (system.id === 'combat') setLocation('/game/battle');
                      else if (system.id === 'economy') setLocation('/game/economy');
                      else if (system.id === 'intel') setLocation('/game/intel');
                      else if (system.id === 'companions') setLocation('/game/companions');
                      else if (system.id === 'character') setLocation('/game/character');
                      else if (system.id === 'battle') setLocation('/game/battle');
                      else if (system.id === 'faction') setLocation('/faction-command');
                      else if (system.id === 'citizen') setLocation('/citizen-profile');
                    }}
                  >
                    Access System
                  </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="tech-panel">
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-100 mb-4">Game Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-300">Master Volume</label>
                    <input type="range" min="0" max="100" defaultValue="70" className="w-32" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-300">Graphics Quality</label>
                    <select className="bg-slate-900 border border-slate-700 rounded-sm px-3 py-2 text-sm text-slate-300">
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-300">Auto-save</label>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
