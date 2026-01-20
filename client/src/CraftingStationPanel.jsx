import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wrench, Clock, Package, Zap, AlertCircle, ChevronRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { craftingRecipes, canCraftRecipe } from './HousingData';

export default function CraftingStationPanel({ housing, gameState, onCraft }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  const craftingStation = housing.crafting_station || {};
  const stationLevel = craftingStation.level || 0;
  const unlockedRecipes = craftingStation.unlocked_recipes || [];
  const activeCrafts = craftingStation.active_crafts || [];
  
  const availableRecipes = Object.values(craftingRecipes).filter(recipe => 
    !recipe.requires_module || 
    housing.customizations?.installed_modules?.find(m => 
      m.module_id === recipe.requires_module && m.level >= (recipe.requires_level || 1)
    )
  );

  const playerResources = {
    credits: gameState.credits || 0,
    tech_parts: housing.resource_storage?.stored_resources?.tech_parts || 0,
    chemicals: housing.resource_storage?.stored_resources?.chemicals || 0,
    rare_tech: housing.resource_storage?.stored_resources?.rare_tech || 0,
    neural_tissue: housing.resource_storage?.stored_resources?.neural_tissue || 0,
    combat_data: housing.resource_storage?.stored_resources?.combat_data || 0
  };

  const handleCraft = () => {
    if (!selectedRecipe) return;
    onCraft && onCraft(selectedRecipe.id);
    setSelectedRecipe(null);
  };

  return (
    <div className="space-y-4">
      {/* Crafting Station Overview */}
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            Crafting Station
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Station Level</p>
              <p className="text-lg font-bold text-amber-400">{stationLevel}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Active Crafts</p>
              <p className="text-lg font-bold text-cyan-400">{activeCrafts.length}</p>
            </div>
          </div>
          
          {stationLevel === 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <p className="text-xs text-amber-400 flex items-center gap-2">
                <AlertCircle className="w-3 h-3" />
                Install crafting modules to unlock item creation
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Crafting */}
      {activeCrafts.length > 0 && (
        <Card className="bg-slate-900/80 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-sm text-cyan-400">Crafting in Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeCrafts.map((craft, i) => {
              const recipe = craftingRecipes[craft.recipe_id];
              if (!recipe) return null;
              
              return (
                <ActiveCraftCard
                  key={craft.recipe_id}
                  recipe={recipe}
                  turnsRemaining={craft.turns_remaining}
                  index={i}
                />
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Recipe List */}
      {stationLevel > 0 && (
        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-sm text-gray-300">Available Recipes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableRecipes.length === 0 ? (
              <p className="text-xs text-gray-600 text-center py-4">
                No recipes available. Upgrade crafting facilities.
              </p>
            ) : (
              availableRecipes.map((recipe, i) => {
                const craftCheck = canCraftRecipe(recipe, housing, playerResources);
                
                return (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isSelected={selectedRecipe?.id === recipe.id}
                    onClick={() => setSelectedRecipe(recipe)}
                    canCraft={craftCheck.canCraft}
                    reason={craftCheck.reason}
                    playerResources={playerResources}
                    index={i}
                  />
                );
              })
            )}

            {/* Craft Button */}
            {selectedRecipe && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button
                  onClick={handleCraft}
                  disabled={!canCraftRecipe(selectedRecipe, housing, playerResources).canCraft}
                  className="w-full bg-amber-600/20 hover:bg-amber-600/30 border-amber-500/50 text-amber-300"
                >
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Start Crafting
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ActiveCraftCard({ recipe, turnsRemaining, index }) {
  const progress = ((recipe.craft_time - turnsRemaining) / recipe.craft_time) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-slate-800/50 rounded-lg border border-cyan-500/30 p-3"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-cyan-200">{recipe.name}</p>
          <Badge className="text-[9px] bg-gray-500/20 text-gray-400 border-gray-500/30 mt-1">
            {recipe.category}
          </Badge>
        </div>
        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-[10px]">
          <Clock className="w-3 h-3 mr-1" />
          {turnsRemaining} turns
        </Badge>
      </div>
      
      <Progress value={progress} className="h-1.5" indicatorClassName="bg-cyan-500" />
    </motion.div>
  );
}

function RecipeCard({ recipe, isSelected, onClick, canCraft, reason, playerResources, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <button
        onClick={onClick}
        disabled={!canCraft}
        className={cn(
          "w-full p-3 rounded-lg border transition-all text-left",
          isSelected 
            ? "bg-amber-500/20 border-amber-500/50" 
            : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600",
          !canCraft && "opacity-50"
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-200">{recipe.name}</p>
            <Badge className="text-[9px] bg-gray-500/20 text-gray-400 border-gray-500/30 mt-1">
              {recipe.category}
            </Badge>
          </div>
          {!canCraft && (
            <Lock className="w-4 h-4 text-red-400" />
          )}
        </div>
        
        <p className="text-xs text-gray-400 mb-2">{recipe.description}</p>
        
        {/* Ingredients */}
        <div className="space-y-1 mb-2">
          <p className="text-[10px] text-gray-500 uppercase">Ingredients:</p>
          {Object.entries(recipe.ingredients).map(([resource, amount]) => {
            const has = playerResources[resource] || 0;
            const sufficient = has >= amount;
            
            return (
              <div key={resource} className="flex items-center justify-between text-xs">
                <span className={cn("text-gray-400", !sufficient && "text-red-400")}>
                  {resource.replace('_', ' ')}: {amount}
                </span>
                <span className={cn("text-gray-500", !sufficient && "text-red-400")}>
                  ({has} available)
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className="text-[9px] bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
            <Clock className="w-2 h-2 mr-1" />
            {recipe.craft_time} turns
          </Badge>
          {recipe.output && (
            <Badge variant="outline" className="text-[9px] text-green-400">
              <Zap className="w-2 h-2 mr-1" />
              {recipe.output.type}
            </Badge>
          )}
        </div>
        
        {!canCraft && reason && (
          <p className="text-[10px] text-red-400 mt-2">{reason}</p>
        )}
      </button>
    </motion.div>
  );
}