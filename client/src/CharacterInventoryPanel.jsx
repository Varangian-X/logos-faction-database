import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Package, Zap, Shield, Swords, Heart, Cpu, Droplet, 
  Star, Brain, FileText, Sparkles, User, Crown, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
  sparkles: Sparkles,
  brain: Brain,
  zap: Zap,
  shield: Shield,
  cpu: Cpu,
  droplet: Droplet,
  'file-text': FileText,
  star: Star
};

const rarityColors = {
  common: 'gray',
  uncommon: 'cyan',
  rare: 'purple',
  legendary: 'amber'
};

export default function CharacterInventoryPanel({ gameState, compact = false }) {
  const resources = gameState.resources || {};
  const equipment = gameState.equipment || [];
  const consumables = gameState.consumables || {};
  const augmentations = gameState.augmentations || [];
  const fleet = gameState.fleet || [];
  const groundForces = gameState.ground_forces || [];
  const infrastructure = gameState.infrastructure || [];
  
  const resourceCount = Object.values(resources).reduce((sum, amt) => sum + amt, 0);
  const consumableCount = Object.values(consumables).reduce((sum, amt) => sum + amt, 0);
  
  const stats = [
    { label: 'Resources', value: resourceCount, icon: Package, color: 'cyan' },
    { label: 'Equipment', value: equipment.length, icon: Swords, color: 'blue' },
    { label: 'Augmentations', value: augmentations.length, icon: Cpu, color: 'purple' },
    { label: 'Consumables', value: consumableCount, icon: Heart, color: 'green' },
    { label: 'Fleet Ships', value: fleet.length, icon: Zap, color: 'amber' },
    { label: 'Ground Forces', value: groundForces.length, icon: Shield, color: 'red' },
    { label: 'Infrastructure', value: infrastructure.filter(i => i.status === 'active').length, icon: Star, color: 'violet' }
  ];
  
  if (compact) {
    return (
      <Card className="bg-slate-900/80 border-amber-900/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-amber-400 flex items-center gap-2">
            <User className="w-4 h-4" />
            Inventory Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {stats.slice(0, 4).map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-slate-800/50 rounded-lg p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-3 h-3 text-${stat.color}-400`} />
                    <span className="text-[10px] text-gray-400">{stat.label}</span>
                  </div>
                  <p className={`text-lg font-bold text-${stat.color}-300`}>{stat.value}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-slate-900/80 border-amber-900/30">
      <CardHeader>
        <CardTitle className="text-amber-400 flex items-center gap-2">
          <Crown className="w-5 h-5" />
          Complete Inventory & Assets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-${stat.color}-900/20 rounded-lg p-3 border border-${stat.color}-500/30`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 text-${stat.color}-400`} />
                  <span className="text-xs text-gray-400">{stat.label}</span>
                </div>
                <p className={`text-2xl font-bold text-${stat.color}-300`}>{stat.value}</p>
              </motion.div>
            );
          })}
        </div>
        
        {/* Character Stats */}
        <div className="pt-4 border-t border-slate-700/50">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Character Status
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Reputation</span>
                <span className="text-sm font-bold text-cyan-300">{gameState.reputation}/100</span>
              </div>
              <Progress value={gameState.reputation} className="h-2" />
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Credits</span>
                <span className="text-sm font-bold text-amber-300">{gameState.credits}₵</span>
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Intel</span>
                <span className="text-sm font-bold text-purple-300">{gameState.intel || 0}</span>
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Influence</span>
                <span className="text-sm font-bold text-violet-300">{gameState.influence || 0}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Live Tracking Indicator */}
        <div className="flex items-center gap-2 text-xs text-green-400 bg-green-900/20 rounded-lg p-2 border border-green-500/30">
          <TrendingUp className="w-3 h-3" />
          <span>All metrics updating live • Turn {gameState.turn_number}</span>
        </div>
      </CardContent>
    </Card>
  );
}