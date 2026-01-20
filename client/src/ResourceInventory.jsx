import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Package, Sparkles, Brain, Zap, Shield, Cpu, Droplet, FileText, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { resources } from './CraftingData';

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

export default function ResourceInventory({ playerResources = {}, compact = false }) {
  const resourceEntries = Object.entries(resources).map(([id, resource]) => ({
    ...resource,
    amount: playerResources[id] || 0
  }));
  
  const totalResources = Object.values(playerResources).reduce((sum, amount) => sum + amount, 0);
  
  if (compact) {
    return (
      <div className="bg-slate-900/80 rounded-xl border border-amber-900/30 p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-amber-400 font-semibold uppercase tracking-wider text-xs flex items-center gap-2">
            <Package className="w-3 h-3" />
            Resources
          </h3>
          <span className="text-[10px] text-gray-500">
            Total: {totalResources}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {resourceEntries.slice(0, 4).map((resource) => {
            const ResourceIcon = iconMap[resource.icon];
            const rarityColor = rarityColors[resource.rarity];
            
            return (
              <div
                key={resource.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className={`w-6 h-6 rounded bg-${rarityColor}-500/10 flex items-center justify-center border border-${rarityColor}-500/30`}>
                  <ResourceIcon className={`w-3 h-3 text-${rarityColor}-400`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-300 truncate">{resource.name}</span>
                    <span className={`text-[10px] font-mono font-bold text-${rarityColor}-400`}>
                      {resource.amount}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {totalResources > 0 && (
          <p className="text-[9px] text-gray-600 mt-2 text-center">
            {resourceEntries.filter(r => r.amount > 0).length} different resources
          </p>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-slate-900/80 rounded-xl border border-amber-900/30 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-amber-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
          <Package className="w-4 h-4" />
          Crafting Resources
        </h3>
        <span className="text-xs text-gray-500">
          Total: {totalResources}
        </span>
      </div>
      
      <div className="space-y-2">
        {resourceEntries.map((resource, index) => {
          const ResourceIcon = iconMap[resource.icon];
          const rarityColor = rarityColors[resource.rarity];
          
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "p-3 rounded-lg border transition-all",
                resource.amount > 0 
                  ? "bg-slate-800/50 border-slate-700/50" 
                  : "bg-slate-800/20 border-slate-700/30 opacity-50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${rarityColor}-500/10 flex items-center justify-center border border-${rarityColor}-500/30 flex-shrink-0`}>
                  <ResourceIcon className={`w-5 h-5 text-${rarityColor}-400`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-200 font-medium">{resource.name}</span>
                      <Badge className={`text-[8px] bg-${rarityColor}-500/20 text-${rarityColor}-400 border-${rarityColor}-500/30`}>
                        {resource.rarity}
                      </Badge>
                    </div>
                    <span className={`text-lg font-bold font-mono text-${rarityColor}-400`}>
                      {resource.amount}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">{resource.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {totalResources === 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <p className="text-[10px] text-gray-500 text-center leading-relaxed">
            No resources yet. Explore, fight, and scavenge to find crafting materials.
          </p>
        </div>
      )}
    </div>
  );
}