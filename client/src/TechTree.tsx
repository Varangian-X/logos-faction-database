import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lock, Check, Zap, Shield, Crosshair, Database, Cpu, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

// Tech Tree Data Structure
export const TECH_TREE_DATA = [
  // Tier 1 - Basic
  {
    id: 'basic_logistics',
    name: 'Basic Logistics',
    description: 'Optimized supply chains increase trade income.',
    cost: 300,
    tier: 1,
    icon: Database,
    position: { x: 50, y: 50 },
    dependencies: [],
    unlocks: ['adv_propulsion', 'economic_theory'],
    effect: 'Trade Income +10%'
  },
  {
    id: 'basic_defense',
    name: 'Hull Reinforcement',
    description: 'Standardized armor plating for all vessels.',
    cost: 400,
    tier: 1,
    icon: Shield,
    position: { x: 50, y: 250 },
    dependencies: [],
    unlocks: ['plasma_weaponry', 'adaptive_shields'],
    effect: 'Ship HP +15%'
  },
  
  // Tier 2 - Intermediate
  {
    id: 'adv_propulsion',
    name: 'Ion Drives',
    description: 'High-efficiency engines for faster travel.',
    cost: 800,
    tier: 2,
    icon: Rocket,
    position: { x: 250, y: 50 },
    dependencies: ['basic_logistics'],
    unlocks: ['warp_theory'],
    effect: 'Fleet Speed +20%'
  },
  {
    id: 'economic_theory',
    name: 'Macro-Economics',
    description: 'Advanced market prediction algorithms.',
    cost: 600,
    tier: 2,
    icon: Zap,
    position: { x: 250, y: 150 },
    dependencies: ['basic_logistics'],
    unlocks: ['quantum_banking'],
    effect: 'Market Intel +25%'
  },
  {
    id: 'plasma_weaponry',
    name: 'Plasma Tech',
    description: 'Superheated plasma containment fields.',
    cost: 1000,
    tier: 2,
    icon: Crosshair,
    position: { x: 250, y: 250 },
    dependencies: ['basic_defense'],
    unlocks: ['heavy_weapons'],
    effect: 'Unlock: Plasma Cannons'
  },
  {
    id: 'adaptive_shields',
    name: 'Adaptive Shields',
    description: 'Shields that modulate frequency based on incoming fire.',
    cost: 1200,
    tier: 2,
    icon: Shield,
    position: { x: 250, y: 350 },
    dependencies: ['basic_defense'],
    unlocks: ['stealth_systems'],
    effect: 'Shield Regen +10%'
  },

  // Tier 3 - Advanced
  {
    id: 'warp_theory',
    name: 'Warp Theory',
    description: 'Bending space-time for instantaneous travel.',
    cost: 2500,
    tier: 3,
    icon: Rocket,
    position: { x: 450, y: 50 },
    dependencies: ['adv_propulsion'],
    unlocks: ['jump_gates'],
    effect: 'Unlock: Warp Drive'
  },
  {
    id: 'quantum_banking',
    name: 'Quantum Banking',
    description: 'Instantaneous credit transfers across sectors.',
    cost: 2000,
    tier: 3,
    icon: Cpu,
    position: { x: 450, y: 150 },
    dependencies: ['economic_theory'],
    unlocks: [],
    effect: 'Passive Income +50/turn'
  },
  {
    id: 'heavy_weapons',
    name: 'Capital Weaponry',
    description: 'Massive batteries for capital ships.',
    cost: 3000,
    tier: 3,
    icon: Crosshair,
    position: { x: 450, y: 250 },
    dependencies: ['plasma_weaponry'],
    unlocks: ['planet_cracker'],
    effect: 'Unlock: Capital Ships'
  },
  {
    id: 'stealth_systems',
    name: 'Void Cloaking',
    description: 'Light-bending fields for stealth operations.',
    cost: 2800,
    tier: 3,
    icon: Shield,
    position: { x: 450, y: 350 },
    dependencies: ['adaptive_shields'],
    unlocks: [],
    effect: 'Ambush Chance +30%'
  },

  // Tier 4 - Ultimate
  {
    id: 'jump_gates',
    name: 'Jump Gate Network',
    description: 'Permanent stable wormholes between sectors.',
    cost: 5000,
    tier: 4,
    icon: Zap,
    position: { x: 650, y: 50 },
    dependencies: ['warp_theory'],
    unlocks: [],
    effect: 'Instant Travel'
  },
  {
    id: 'planet_cracker',
    name: 'Exterminatus',
    description: 'The ultimate sanction.',
    cost: 10000,
    tier: 4,
    icon: Crosshair,
    position: { x: 650, y: 250 },
    dependencies: ['heavy_weapons'],
    unlocks: [],
    effect: 'Unlock: Planet Killer'
  }
];

interface TechTreeProps {
  researchedTechs: string[];
  currentResearch: string | null;
  researchPoints: number;
  onStartResearch: (techId: string, cost: number) => void;
}

export default function TechTree({ 
  researchedTechs = [], 
  currentResearch = null, 
  researchPoints = 0,
  onStartResearch 
}: TechTreeProps) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Helper to check if a tech is unlocked (all dependencies met)
  const isUnlocked = (tech: any) => {
    if (tech.dependencies.length === 0) return true;
    return tech.dependencies.every((depId: string) => researchedTechs.includes(depId));
  };

  // Helper to check if a tech is researched
  const isResearched = (techId: string) => researchedTechs.includes(techId);

  // Draw connection lines
  const renderConnections = () => {
    return TECH_TREE_DATA.map(tech => {
      return tech.dependencies.map(depId => {
        const depNode = TECH_TREE_DATA.find(t => t.id === depId);
        if (!depNode) return null;

        const isPathActive = isResearched(depId);
        
        return (
          <svg 
            key={`${depId}-${tech.id}`} 
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
          >
            <path
              d={`M ${depNode.position.x + 24} ${depNode.position.y + 24} 
                 C ${depNode.position.x + 100} ${depNode.position.y + 24},
                   ${tech.position.x - 50} ${tech.position.y + 24},
                   ${tech.position.x + 24} ${tech.position.y + 24}`}
              fill="none"
              stroke={isPathActive ? "#06b6d4" : "#334155"}
              strokeWidth={isPathActive ? 2 : 1}
              strokeDasharray={isPathActive ? "none" : "5,5"}
              className="transition-colors duration-500"
            />
          </svg>
        );
      });
    });
  };

  return (
    <div className="relative w-full h-[500px] bg-slate-950/50 rounded-lg border border-slate-800 overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Connections Layer */}
      <div className="absolute inset-0">
        {renderConnections()}
      </div>

      {/* Nodes Layer */}
      <div className="absolute inset-0 p-8 overflow-auto">
        <div className="relative min-w-[800px] min-h-[450px]">
          {TECH_TREE_DATA.map((tech) => {
            const researched = isResearched(tech.id);
            const unlocked = isUnlocked(tech);
            const researching = currentResearch === tech.id;
            const Icon = tech.icon;

            return (
              <TooltipProvider key={tech.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      className={cn(
                        "absolute w-12 h-12 rounded-full flex items-center justify-center border-2 cursor-pointer transition-all z-10",
                        researched ? "bg-cyan-900/80 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]" :
                        researching ? "bg-amber-900/80 border-amber-400 text-amber-400 animate-pulse" :
                        unlocked ? "bg-slate-800 border-slate-500 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300" :
                        "bg-slate-900 border-slate-800 text-slate-700 opacity-50 cursor-not-allowed"
                      )}
                      style={{ left: tech.position.x, top: tech.position.y }}
                      whileHover={unlocked ? { scale: 1.1 } : {}}
                      onClick={() => unlocked && setSelectedTech(tech.id)}
                    >
                      {researched ? <Check className="w-6 h-6" /> : 
                       !unlocked ? <Lock className="w-5 h-5" /> :
                       <Icon className="w-6 h-6" />}
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-slate-900 border-slate-700">
                    <p className="font-bold text-cyan-400">{tech.name}</p>
                    <p className="text-xs text-slate-400">{tech.effect}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>

      {/* Detail Panel Overlay */}
      {selectedTech && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 right-4 w-64 bg-slate-900/95 border border-cyan-500/30 rounded-lg p-4 shadow-xl z-20 backdrop-blur-sm"
        >
          {(() => {
            const tech = TECH_TREE_DATA.find(t => t.id === selectedTech);
            if (!tech) return null;
            
            const researched = isResearched(tech.id);
            const canAfford = researchPoints >= tech.cost;

            return (
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-cyan-400">{tech.name}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 text-slate-500 hover:text-slate-300"
                    onClick={() => setSelectedTech(null)}
                  >
                    ×
                  </Button>
                </div>
                
                <p className="text-sm text-slate-300">{tech.description}</p>
                
                <div className="bg-slate-800/50 p-2 rounded border border-slate-700">
                  <p className="text-xs text-slate-400 uppercase mb-1">Effect</p>
                  <p className="text-sm font-mono text-green-400">{tech.effect}</p>
                </div>

                {!researched && (
                  <div className="pt-2 border-t border-slate-800">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-slate-400">Cost</span>
                      <span className={cn("font-mono font-bold", canAfford ? "text-amber-400" : "text-red-400")}>
                        {tech.cost} RP
                      </span>
                    </div>
                    <Button 
                      className="w-full bg-cyan-600 hover:bg-cyan-700"
                      disabled={!canAfford || currentResearch !== null}
                      onClick={() => {
                        onStartResearch(tech.id, tech.cost);
                        setSelectedTech(null);
                      }}
                    >
                      {currentResearch ? 'Research Busy' : 'Start Research'}
                    </Button>
                  </div>
                )}
                
                {researched && (
                  <div className="pt-2 border-t border-slate-800 text-center">
                    <span className="text-sm font-bold text-green-500 flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> Researched
                    </span>
                  </div>
                )}
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}
