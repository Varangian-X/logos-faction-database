/**
 * CompanionPanel.tsx - Companion recruitment and management
 * 
 * Design Philosophy: Command Center Aesthetic
 * - Dynamic companion profiles with personality traits
 * - Relationship and loyalty tracking
 * - Skill trees and specialization paths
 * - Proactive advice system
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameState } from '@/contexts/GameStateContext';
import { useLocation } from 'wouter';
import {
  Users,
  Heart,
  Zap,
  Star,
  MessageSquare,
  Plus,
  ArrowLeft,
} from 'lucide-react';

export default function CompanionPanelPage() {
  const [, setLocation] = useLocation();
  const { gameState } = useGameState();
  const [selectedTab, setSelectedTab] = useState('roster');
  const [selectedCompanion, setSelectedCompanion] = useState<number | null>(null);

  // Mock companion data
  const companions = [
    {
      id: 1,
      name: 'Captain Vex',
      role: 'Fleet Commander',
      personality: 'Aggressive',
      loyalty: 92,
      skills: ['Tactics', 'Leadership', 'Combat'],
      level: 12,
      experience: 3450,
      advice: 'Recommend aggressive expansion into Sector 7',
    },
    {
      id: 2,
      name: 'Dr. Aria',
      role: 'Chief Scientist',
      personality: 'Analytical',
      loyalty: 78,
      skills: ['Research', 'Engineering', 'Diplomacy'],
      level: 10,
      experience: 2890,
      advice: 'New research breakthrough available in Energy Systems',
    },
    {
      id: 3,
      name: 'Commander Kess',
      role: 'Tactical Officer',
      personality: 'Cautious',
      loyalty: 85,
      skills: ['Defense', 'Logistics', 'Tactics'],
      level: 11,
      experience: 3120,
      advice: 'Recommend defensive posture due to enemy fleet activity',
    },
  ];

  const availableCompanions = [
    {
      id: 4,
      name: 'Rax Vorn',
      role: 'Mercenary',
      personality: 'Ruthless',
      cost: 5000,
      skills: ['Combat', 'Espionage', 'Negotiation'],
    },
    {
      id: 5,
      name: 'Lyra Shade',
      role: 'Diplomat',
      personality: 'Charismatic',
      cost: 3500,
      skills: ['Diplomacy', 'Deception', 'Insight'],
    },
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
              <h1 className="text-2xl font-bold text-purple-300">COMPANION ROSTER</h1>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Manage your advisors</p>
            </div>
          </div>
          
          <div className="text-right text-sm">
            <p className="text-purple-300 font-mono">Active: {gameState.companionCount}</p>
            <p className="text-slate-400 text-xs">Credits: {gameState.credits.toLocaleString()}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-3 bg-slate-900 border border-slate-700 mb-8">
            <TabsTrigger value="roster" className="data-text">Roster</TabsTrigger>
            <TabsTrigger value="recruit" className="data-text">Recruit</TabsTrigger>
            <TabsTrigger value="advice" className="data-text">Advice</TabsTrigger>
          </TabsList>

          {/* Roster Tab */}
          <TabsContent value="roster" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companions.map((companion) => (
                <Card
                  key={companion.id}
                  onClick={() => setSelectedCompanion(companion.id)}
                  className={`tech-panel cursor-pointer transition-all duration-200 ${
                    selectedCompanion === companion.id
                      ? 'border-purple-400 glow-purple'
                      : 'border-slate-700 hover:border-purple-500/50'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-100">{companion.name}</h3>
                        <p className="text-sm text-slate-400">{companion.role}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-sm font-mono ${
                          companion.personality === 'Aggressive'
                            ? 'bg-red-900/30 text-red-300'
                            : companion.personality === 'Analytical'
                            ? 'bg-blue-900/30 text-blue-300'
                            : 'bg-amber-900/30 text-amber-300'
                        }`}>
                          {companion.personality}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          Loyalty
                        </span>
                        <div className="w-24 bg-slate-800 rounded-sm h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-400 h-full"
                            style={{ width: `${companion.loyalty}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Level:</span>
                        <span className="text-purple-300 font-mono">{companion.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Experience:</span>
                        <span className="text-slate-300 font-mono text-xs">{companion.experience.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-slate-400 uppercase mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {companion.skills.map((skill) => (
                          <span key={skill} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-sm border border-slate-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full tech-button" variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Interact
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Companion Details */}
            {selectedCompanion && companions.find(c => c.id === selectedCompanion) && (
              <Card className="tech-panel border-purple-500/30">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-purple-300 mb-4">Companion Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100 mb-3 uppercase">Specializations</h4>
                      <div className="space-y-2">
                        {['Leadership', 'Tactics', 'Diplomacy'].map((spec) => (
                          <div key={spec} className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">{spec}</span>
                            <div className="w-32 bg-slate-800 rounded-sm h-2 overflow-hidden">
                              <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-full" style={{ width: '75%' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100 mb-3 uppercase">Bonuses</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Fleet Morale:</span>
                          <span className="text-green-300">+12%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Research Speed:</span>
                          <span className="text-green-300">+8%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Diplomacy:</span>
                          <span className="text-green-300">+15%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Recruit Tab */}
          <TabsContent value="recruit" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableCompanions.map((companion) => (
                <Card key={companion.id} className="tech-panel border-amber-500/30">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-100">{companion.name}</h3>
                        <p className="text-sm text-slate-400">{companion.role}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-sm font-mono bg-amber-900/30 text-amber-300">
                        {companion.personality}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-slate-400 uppercase mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {companion.skills.map((skill) => (
                          <span key={skill} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-sm border border-slate-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-amber-300 font-mono font-semibold">{companion.cost.toLocaleString()} Credits</span>
                      <Button className="tech-button" variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Recruit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Advice Tab */}
          <TabsContent value="advice" className="space-y-6">
            <Card className="tech-panel border-purple-500/30">
              <div className="p-6">
                <h3 className="text-lg font-bold text-purple-300 mb-4">Proactive Advice</h3>
                <div className="space-y-4">
                  {companions.map((companion) => (
                    <div key={companion.id} className="p-4 bg-slate-900 rounded-sm border border-slate-700">
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-purple-300 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-100">{companion.name}</p>
                          <p className="text-sm text-slate-400 mt-1">{companion.advice}</p>
                        </div>
                      </div>
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
