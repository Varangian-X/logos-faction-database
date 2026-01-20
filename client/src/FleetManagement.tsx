/**
 * FleetManagement.tsx - Fleet command and customization hub
 * 
 * Design Philosophy: Command Center Aesthetic
 * - Integrated fleet system with ship building and customization
 * - Tactical formation and doctrine management
 * - Real-time fleet status and logistics tracking
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameState } from '@/contexts/GameStateContext';
import { useLocation } from 'wouter';
import {
  Ship,
  Plus,
  Settings,
  BarChart3,
  Zap,
  Shield,
  ArrowLeft,
} from 'lucide-react';

export default function FleetManagement() {
  const [, setLocation] = useLocation();
  const { gameState, updateGameState, addShip } = useGameState();
  const [selectedFleet, setSelectedFleet] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  const handleBuildShip = (shipType: any) => {
    if (gameState.credits >= shipType.cost) {
      updateGameState({ credits: gameState.credits - shipType.cost });
      addShip({
        id: `ship-${Date.now()}`,
        name: `${shipType.name} ${Math.floor(Math.random() * 1000)}`,
        class: shipType.name.toLowerCase(),
        experience: 0,
        status: 'Ready'
      });
      // toast.success(`${shipType.name} construction started`);
    }
  };

  // Mock fleet data
  const fleets = [
    {
      id: 1,
      name: 'Alpha Squadron',
      ships: 4,
      strength: 85,
      morale: 92,
      status: 'Ready',
      doctrine: 'Aggressive',
    },
    {
      id: 2,
      name: 'Beta Squadron',
      ships: 4,
      strength: 72,
      morale: 78,
      status: 'Patrolling',
      doctrine: 'Balanced',
    },
    {
      id: 3,
      name: 'Gamma Squadron',
      ships: 4,
      strength: 65,
      morale: 85,
      status: 'Defending',
      doctrine: 'Defensive',
    },
  ];

  const shipTypes = [
    { name: 'Fighter', cost: 500, crew: 2, firepower: 8, defense: 4 },
    { name: 'Corvette', cost: 1200, crew: 8, firepower: 6, defense: 6 },
    { name: 'Destroyer', cost: 3000, crew: 25, firepower: 9, defense: 8 },
    { name: 'Cruiser', cost: 7500, crew: 60, firepower: 7, defense: 10 },
    { name: 'Battleship', cost: 15000, crew: 150, firepower: 10, defense: 12 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 grid-bg">
      {/* Header */}
      <header className="border-b border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-400 hover:text-cyan-300"
              onClick={() => setLocation('/game')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-cyan-300">FLEET COMMAND</h1>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Manage your armada</p>
            </div>
          </div>
          
          <div className="text-right text-sm">
            <p className="text-cyan-300 font-mono">Total Ships: {gameState.totalShips}</p>
            <p className="text-slate-400 text-xs">Credits: {gameState.credits.toLocaleString()}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4 bg-slate-900 border border-slate-700 mb-8">
            <TabsTrigger value="overview" className="data-text">Fleets</TabsTrigger>
            <TabsTrigger value="ships" className="data-text">Ships</TabsTrigger>
            <TabsTrigger value="build" className="data-text">Build</TabsTrigger>
            <TabsTrigger value="doctrine" className="data-text">Doctrine</TabsTrigger>
          </TabsList>

          {/* Fleets Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fleets.map((fleet) => (
                <Card
                  key={fleet.id}
                  onClick={() => setSelectedFleet(fleet.id)}
                  className={`tech-panel cursor-pointer transition-all duration-200 ${
                    selectedFleet === fleet.id
                      ? 'border-cyan-400 glow-cyan'
                      : 'border-slate-700 hover:border-cyan-500/50'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-cyan-300">{fleet.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-sm font-mono ${
                        fleet.status === 'Ready'
                          ? 'bg-green-900/30 text-green-300'
                          : 'bg-amber-900/30 text-amber-300'
                      }`}>
                        {fleet.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ships:</span>
                        <span className="text-cyan-300 font-mono">{fleet.ships}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Strength:</span>
                        <div className="w-24 bg-slate-800 rounded-sm h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full"
                            style={{ width: `${fleet.strength}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Morale:</span>
                        <span className="text-amber-300 font-mono">{fleet.morale}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Doctrine:</span>
                        <span className="text-purple-300 font-mono text-xs">{fleet.doctrine}</span>
                      </div>
                    </div>

                    <Button className="w-full tech-button mt-4" variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Fleet Details */}
            {selectedFleet && (
              <Card className="tech-panel border-cyan-500/30">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-cyan-300 mb-4">Fleet Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 rounded-sm p-4 border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase mb-2">Total Power</p>
                      <p className="text-2xl font-bold text-cyan-300">340</p>
                    </div>
                    <div className="bg-slate-900 rounded-sm p-4 border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase mb-2">Crew</p>
                      <p className="text-2xl font-bold text-cyan-300">187</p>
                    </div>
                    <div className="bg-slate-900 rounded-sm p-4 border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase mb-2">Maintenance</p>
                      <p className="text-2xl font-bold text-amber-300">250/turn</p>
                    </div>
                    <div className="bg-slate-900 rounded-sm p-4 border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase mb-2">Exp. Bonus</p>
                      <p className="text-2xl font-bold text-purple-300">+15%</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Ships Tab */}
          <TabsContent value="ships" className="space-y-6">
            <Card className="tech-panel border-cyan-500/30">
              <div className="p-6">
                <h3 className="text-lg font-bold text-cyan-300 mb-4">Ship Inventory</h3>
                <div className="space-y-3">
                  {shipTypes.map((ship) => (
                    <div key={ship.name} className="flex items-center justify-between p-3 bg-slate-900 rounded-sm border border-slate-700">
                      <div className="flex items-center gap-3">
                        <Ship className="w-5 h-5 text-cyan-300" />
                        <div>
                          <p className="font-semibold text-slate-100">{ship.name}</p>
                          <p className="text-xs text-slate-400">Crew: {ship.crew} | Power: {ship.firepower}/{ship.defense}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-amber-300 font-mono">{ship.cost.toLocaleString()}</p>
                        <Button 
                          size="sm" 
                          className="tech-button mt-1" 
                          variant="outline"
                          disabled={gameState.credits < ship.cost}
                          onClick={() => handleBuildShip(ship)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Build Tab */}
          <TabsContent value="build" className="space-y-6">
            <Card className="tech-panel border-amber-500/30">
              <div className="p-6">
                <h3 className="text-lg font-bold text-amber-300 mb-4">Ship Production Queue</h3>
                <p className="text-slate-400 text-sm mb-4">Queue new ships for construction</p>
                <div className="space-y-3">
                  <div className="bg-slate-900 rounded-sm p-4 border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-slate-100">Destroyer #5</p>
                      <span className="text-xs text-slate-400">45% complete</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-sm h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full" style={{ width: '45%' }} />
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded-sm p-4 border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-slate-100">Cruiser #2</p>
                      <span className="text-xs text-slate-400">20% complete</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-sm h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full" style={{ width: '20%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Doctrine Tab */}
          <TabsContent value="doctrine" className="space-y-6">
            <Card className="tech-panel border-purple-500/30">
              <div className="p-6">
                <h3 className="text-lg font-bold text-purple-300 mb-4">Fleet Doctrines</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Aggressive', 'Balanced', 'Defensive', 'Evasive'].map((doctrine) => (
                    <div key={doctrine} className="p-4 bg-slate-900 rounded-sm border border-slate-700 cursor-pointer hover:border-purple-500/50 transition-colors">
                      <p className="font-semibold text-slate-100 mb-2">{doctrine}</p>
                      <p className="text-xs text-slate-400">+25% Firepower / -10% Defense</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
