import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Hammer, X, Star, Zap, Shield, Brain, Droplet, 
  Sparkles, FileText, Cpu, Lock, CheckCircle, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { craftingRecipes, resources, canCraftRecipe } from './CraftingData';

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

const typeColors = {
  augmentation: 'red',
  equipment: 'blue',
  consumable: 'green'
};

export default function CraftingInterface({ gameState, onCraft, onClose }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filter, setFilter] = useState('all');
  
  const playerResources = gameState.resources || {};
  
  const filteredRecipes = Object.values(craftingRecipes).filter(recipe => {
    if (filter === 'all') return true;
    return recipe.type === filter;
  });
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 rounded-2xl border-2 border-amber-500/50 w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900/40 to-orange-800/30 p-4 border-b border-amber-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/40">
                <Hammer className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-100">Crafting Workshop</h3>
                <p className="text-xs text-amber-400/70">Create augmentations, equipment, and items</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4">
            {['all', 'augmentation', 'equipment', 'consumable'].map(type => (
              <Button
                key={type}
                variant={filter === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(type)}
                className={cn(
                  "text-xs",
                  filter === type ? "bg-amber-600 hover:bg-amber-700" : "bg-slate-800/50"
                )}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex h-[calc(90vh-140px)]">
          {/* Recipe List */}
          <div className="w-1/2 border-r border-slate-700/50 p-4 overflow-y-auto">
            <div className="space-y-2">
              {filteredRecipes.map((recipe) => {
                const craftCheck = canCraftRecipe(recipe, gameState);
                const typeColor = typeColors[recipe.type];
                
                return (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => setSelectedRecipe(recipe)}
                      className={cn(
                        "w-full h-auto p-3 text-left",
                        "bg-slate-800/50 border-slate-600/50",
                        selectedRecipe?.id === recipe.id && "bg-amber-500/10 border-amber-500/50",
                        !craftCheck.canCraft && "opacity-60"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-${typeColor}-500/20 flex items-center justify-center border border-${typeColor}-500/30 flex-shrink-0`}>
                          <Hammer className={`w-5 h-5 text-${typeColor}-400`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-200">{recipe.name}</h4>
                            {!craftCheck.canCraft && (
                              <Lock className="w-3 h-3 text-red-400" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mb-2">{recipe.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-[8px] bg-${typeColor}-500/20 text-${typeColor}-400 border-${typeColor}-500/30`}>
                              {recipe.type}
                            </Badge>
                            {recipe.crafting_time && (
                              <Badge variant="outline" className="text-[8px] text-gray-500">
                                <Clock className="w-2 h-2 mr-1" />
                                {recipe.crafting_time}T
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {/* Recipe Details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selectedRecipe ? (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-amber-100 mb-2">{selectedRecipe.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{selectedRecipe.description}</p>
                  
                  {/* Result Preview */}
                  <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Crafts:</p>
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg bg-${typeColors[selectedRecipe.type]}-500/20 flex items-center justify-center border border-${typeColors[selectedRecipe.type]}-500/30`}>
                        <Star className={`w-6 h-6 text-${typeColors[selectedRecipe.type]}-400`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-200 mb-1">
                          {selectedRecipe.result.name}
                        </h4>
                        <p className="text-xs text-gray-400 mb-2">{selectedRecipe.result.effect}</p>
                        {selectedRecipe.result.bonus && (
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(selectedRecipe.result.bonus).map(([key, value]) => (
                              <Badge key={key} variant="outline" className="text-[8px] text-green-400 border-green-500/30">
                                +{typeof value === 'number' ? value : 'YES'} {key.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Requirements */}
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Requirements:</p>
                    
                    {/* Resources */}
                    {selectedRecipe.requirements.resources && (
                      <div>
                        <p className="text-xs text-gray-400 mb-2">Resources:</p>
                        <div className="space-y-2">
                          {Object.entries(selectedRecipe.requirements.resources).map(([resourceId, amount]) => {
                            const resource = resources[resourceId];
                            const playerAmount = playerResources[resourceId] || 0;
                            const hasEnough = playerAmount >= amount;
                            const ResourceIcon = iconMap[resource.icon];
                            
                            return (
                              <div key={resourceId} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded bg-${rarityColors[resource.rarity]}-500/10 flex items-center justify-center border border-${rarityColors[resource.rarity]}-500/30`}>
                                    <ResourceIcon className={`w-3 h-3 text-${rarityColors[resource.rarity]}-400`} />
                                  </div>
                                  <span className="text-xs text-gray-300">{resource.name}</span>
                                </div>
                                <span className={cn(
                                  "text-xs font-semibold",
                                  hasEnough ? "text-green-400" : "text-red-400"
                                )}>
                                  {playerAmount} / {amount}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Skills */}
                    {selectedRecipe.requirements.skill && (
                      <div>
                        <p className="text-xs text-gray-400 mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(selectedRecipe.requirements.skill).map(([skill, level]) => {
                            const playerLevel = gameState.skills?.[skill]?.level || 0;
                            const hasLevel = playerLevel >= level;
                            
                            return (
                              <Badge 
                                key={skill}
                                className={cn(
                                  "text-[9px]",
                                  hasLevel 
                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                                )}
                              >
                                {skill} {level}+ {hasLevel && <CheckCircle className="w-2 h-2 ml-1" />}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Perks */}
                    {selectedRecipe.requirements.perk && (
                      <div>
                        <p className="text-xs text-gray-400 mb-2">Required Perk:</p>
                        <Badge className="text-[9px] bg-purple-500/20 text-purple-400 border-purple-500/30">
                          {selectedRecipe.requirements.perk}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Craft Button */}
                <Button
                  onClick={() => onCraft(selectedRecipe)}
                  disabled={!canCraftRecipe(selectedRecipe, gameState).canCraft}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  <Hammer className="w-4 h-4 mr-2" />
                  Craft {selectedRecipe.name}
                </Button>
                
                {!canCraftRecipe(selectedRecipe, gameState).canCraft && (
                  <p className="text-xs text-red-400 text-center mt-2">
                    {canCraftRecipe(selectedRecipe, gameState).reason}
                  </p>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Hammer className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Select a recipe to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}