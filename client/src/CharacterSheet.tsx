/**
 * CharacterSheet.tsx - Player character progression and skills
 * 
 * Design Philosophy: Command Center Aesthetic
 * - Comprehensive character stats and progression tracking
 * - Skill tree with mastery perks
 * - Trait system affecting gameplay
 * - Achievement and milestone tracking
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameState } from '@/contexts/GameStateContext';
import { useLocation } from 'wouter';
import {
  Star,
  Award,
  Zap,
  Shield,
  Brain,
  Heart,
  ArrowLeft,
} from 'lucide-react';

export default function CharacterSheet() {
  const [, setLocation] = useLocation();
  const { gameState } = useGameState();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Mock character data
  const characterStats = {
    name: gameState.playerName,
    level: gameState.level,
    experience: gameState.experience,
    nextLevelExp: 5000,
    health: 100,
    stress: gameState.stress,
    morale: 75,
    reputation: gameState.reputation,
  };

  const skills = [
    {
      name: 'Tactics',
      level: 8,
      experience: 2400,
      nextLevel: 3000,
      bonus: '+15% Combat Effectiveness',
    },
    {
      name: 'Leadership',
      level: 7,
      experience: 1800,
      nextLevel: 2500,
      bonus: '+10% Morale Regeneration',
    },
    {
      name: 'Engineering',
      level: 6,
      experience: 1200,
      nextLevel: 2000,
      bonus: '+8% Ship Repair Speed',
    },
    {
      name: 'Diplomacy',
      level: 5,
      experience: 800,
      nextLevel: 1500,
      bonus: '+12% Trade Profit',
    },
    {
      name: 'Research',
      level: 7,
      experience: 1600,
      nextLevel: 2500,
      bonus: '+10% Research Speed',
    },
    {
      name: 'Espionage',
      level: 4,
      experience: 600,
      nextLevel: 1200,
      bonus: '+5% Intel Accuracy',
    },
  ];

  const traits = [
    { name: 'Strategic Mind', bonus: '+5% Planning Effectiveness', type: 'positive' },
    { name: 'Cautious', bonus: '-5% Risk Tolerance', type: 'neutral' },
    { name: 'Ambitious', bonus: '+10% Experience Gain', type: 'positive' },
    { name: 'Pragmatic', bonus: '+8% Economic Efficiency', type: 'positive' },
  ];

  const achievements = [
    { name: 'First Victory', description: 'Win your first combat encounter', unlocked: true },
    { name: 'Fleet Commander', description: 'Build a fleet of 10+ ships', unlocked: true },
    { name: 'Wealthy', description: 'Accumulate 100,000 credits', unlocked: false },
    { name: 'Diplomat', description: 'Recruit 5 companions', unlocked: false },
    { name: 'Explorer', description: 'Discover 20 locations', unlocked: true },
    { name: 'Legendary', description: 'Reach level 50', unlocked: false },
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
              <h1 className="text-2xl font-bold text-cyan-300">CHARACTER SHEET</h1>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Commander Profile</p>
            </div>
          </div>
          
          <div className="text-right text-sm">
            <p className="text-cyan-300 font-mono">Level {characterStats.level}</p>
            <p className="text-slate-400 text-xs">Reputation: {characterStats.reputation}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4 bg-slate-900 border border-slate-700 mb-8">
            <TabsTrigger value="overview" className="data-text">Overview</TabsTrigger>
            <TabsTrigger value="skills" className="data-text">Skills</TabsTrigger>
            <TabsTrigger value="traits" className="data-text">Traits</TabsTrigger>
            <TabsTrigger value="achievements" className="data-text">Achievements</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Character Header */}
            <Card className="tech-panel border-cyan-500/30">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-cyan-300 mb-2">{characterStats.name}</h2>
                    <p className="text-slate-400">Commander of the Imperial Fleet</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-cyan-300">{characterStats.level}</p>
                    <p className="text-xs text-slate-400 uppercase">Level</p>
                  </div>
                </div>

                {/* Experience Bar */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-400">Experience</span>
                    <span className="text-sm text-cyan-300 font-mono">{characterStats.experience} / {characterStats.nextLevelExp}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-sm h-3 overflow-hidden border border-slate-700">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full"
                      style={{ width: `${(characterStats.experience / characterStats.nextLevelExp) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="tech-panel border-slate-700">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    <p className="text-xs text-slate-400 uppercase">Health</p>
                  </div>
                  <p className="text-2xl font-bold text-red-300">{characterStats.health}%</p>
                </div>
              </Card>

              <Card className="tech-panel border-slate-700">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <p className="text-xs text-slate-400 uppercase">Stress</p>
                  </div>
                  <p className="text-2xl font-bold text-amber-300">{characterStats.stress}%</p>
                </div>
              </Card>

              <Card className="tech-panel border-slate-700">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    <p className="text-xs text-slate-400 uppercase">Morale</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-300">{characterStats.morale}%</p>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <Card
                  key={skill.name}
                  onClick={() => setSelectedSkill(skill.name)}
                  className={`tech-panel cursor-pointer transition-all duration-200 ${
                    selectedSkill === skill.name
                      ? 'border-cyan-400 glow-cyan'
                      : 'border-slate-700 hover:border-cyan-500/50'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-100">{skill.name}</h3>
                      <span className="text-lg font-bold text-cyan-300">{skill.level}</span>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between mb-1 text-xs">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-cyan-300">{skill.experience} / {skill.nextLevel}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-sm h-2 overflow-hidden border border-slate-700">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full"
                          style={{ width: `${(skill.experience / skill.nextLevel) * 100}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-green-300">{skill.bonus}</p>
                  </div>
                </Card>
              ))}
            </div>

            {selectedSkill && (
              <Card className="tech-panel border-cyan-500/30">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-cyan-300 mb-4">{selectedSkill} Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Rank:</span>
                      <span className="text-cyan-300 font-mono">Master (Level 8)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Next Rank:</span>
                      <span className="text-slate-300 font-mono">Legendary (Level 9)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Primary Bonus:</span>
                      <span className="text-green-300">+15% Combat Effectiveness</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Secondary Bonus:</span>
                      <span className="text-green-300">+5% Experience Gain</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Traits Tab */}
          <TabsContent value="traits" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {traits.map((trait) => (
                <Card key={trait.name} className={`tech-panel border-slate-700 ${
                  trait.type === 'positive' ? 'border-green-500/30' : 'border-slate-700'
                }`}>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className={`w-4 h-4 ${
                        trait.type === 'positive' ? 'text-green-400' : 'text-slate-400'
                      }`} />
                      <h3 className="font-semibold text-slate-100">{trait.name}</h3>
                    </div>
                    <p className={`text-sm ${
                      trait.type === 'positive' ? 'text-green-300' : 'text-slate-400'
                    }`}>{trait.bonus}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.name}
                  className={`tech-panel cursor-pointer transition-all duration-200 ${
                    achievement.unlocked
                      ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-600/5'
                      : 'border-slate-700 opacity-60'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 ${
                        achievement.unlocked
                          ? 'bg-amber-900/30 text-amber-300'
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-100">{achievement.name}</h3>
                        <p className="text-xs text-slate-400 mt-1">{achievement.description}</p>
                        {achievement.unlocked && (
                          <p className="text-xs text-amber-300 mt-2">✓ Unlocked</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
