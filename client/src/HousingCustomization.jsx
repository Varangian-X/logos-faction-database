import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Plus, TrendingUp, Lock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { housingModules, calculateModuleCost } from './HousingData';

export default function HousingCustomization({ housing, gameState, onUpgrade }) {
  const [selectedModule, setSelectedModule] = useState(null);
  
  const installedModules = housing.customizations?.installed_modules || [];
  const maxModules = housing.housing_tier * 3;
  
  const availableModules = Object.values(housingModules).filter(module => {
    const installed = installedModules.find(m => m.module_id === module.id);
    if (!installed) return true;
    return installed.level < module.max_level;
  });

  const handleInstallUpgrade = () => {
    if (!selectedModule) return;
    const installed = installedModules.find(m => m.module_id === selectedModule.id);
    const level = installed ? installed.level : 0;
    onUpgrade && onUpgrade('module', selectedModule.id, level + 1);
    setSelectedModule(null);
  };

  return (
    <div className="space-y-4">
      {/* Module Capacity */}
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Home className="w-4 h-4 text-cyan-400" />
            Module Capacity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-cyan-400">{installedModules.length} / {maxModules}</p>
              <p className="text-xs text-gray-500">Modules Installed</p>
            </div>
            {installedModules.length >= maxModules && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                At Capacity
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Installed Modules */}
      {installedModules.length > 0 && (
        <Card className="bg-slate-900/80 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-sm text-cyan-400">Installed Modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {installedModules.map((module, i) => {
              const moduleData = housingModules[module.module_id];
              if (!moduleData) return null;
              
              return (
                <InstalledModuleCard
                  key={module.module_id}
                  module={moduleData}
                  level={module.level}
                  index={i}
                />
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Available Modules */}
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-sm text-gray-300">Available Upgrades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {availableModules.length === 0 ? (
            <p className="text-xs text-gray-600 text-center py-4">
              All modules at maximum level
            </p>
          ) : (
            <>
              {availableModules.map((module, i) => {
                const installed = installedModules.find(m => m.module_id === module.id);
                const currentLevel = installed ? installed.level : 0;
                const cost = calculateModuleCost(module, currentLevel);
                const canAfford = (gameState.credits || 0) >= cost;
                const hasSpace = installedModules.length < maxModules || installed;
                
                return (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    currentLevel={currentLevel}
                    cost={cost}
                    isSelected={selectedModule?.id === module.id}
                    onClick={() => setSelectedModule(module)}
                    canAfford={canAfford}
                    hasSpace={hasSpace}
                    index={i}
                  />
                );
              })}

              {selectedModule && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button
                    onClick={handleInstallUpgrade}
                    disabled={
                      (gameState.credits || 0) < calculateModuleCost(
                        selectedModule,
                        installedModules.find(m => m.module_id === selectedModule.id)?.level || 0
                      ) ||
                      (!installedModules.find(m => m.module_id === selectedModule.id) && 
                       installedModules.length >= maxModules)
                    }
                    className="w-full bg-cyan-600/20 hover:bg-cyan-600/30 border-cyan-500/50 text-cyan-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Install/Upgrade Module
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InstalledModuleCard({ module, level, index }) {
  const typeColors = {
    storage: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    companion: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    crafting: 'text-green-400 border-green-500/30 bg-green-500/10',
    utility: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn("p-3 rounded-lg border", typeColors[module.type])}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{module.name}</p>
          <Badge className="text-[9px] mt-1">Level {level}</Badge>
        </div>
        <TrendingUp className="w-4 h-4" />
      </div>
    </motion.div>
  );
}

function ModuleCard({ module, currentLevel, cost, isSelected, onClick, canAfford, hasSpace, index }) {
  const isUpgrade = currentLevel > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <button
        onClick={onClick}
        disabled={!canAfford || !hasSpace}
        className={cn(
          "w-full p-3 rounded-lg border transition-all text-left",
          isSelected 
            ? "bg-cyan-500/20 border-cyan-500/50" 
            : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600",
          (!canAfford || !hasSpace) && "opacity-50"
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-200">{module.name}</p>
            <Badge className="text-[9px] bg-gray-500/20 text-gray-400 border-gray-500/30 mt-1">
              {module.type}
            </Badge>
          </div>
          <div className="text-right">
            {cost && (
              <Badge variant="outline" className={cn("text-[10px]", canAfford ? "text-amber-400" : "text-red-400")}>
                {cost} Credits
              </Badge>
            )}
            {!hasSpace && (
              <Lock className="w-4 h-4 text-red-400 mt-1" />
            )}
          </div>
        </div>
        
        <p className="text-xs text-gray-400 mb-2">{module.description}</p>
        
        {currentLevel > 0 && (
          <p className="text-[10px] text-cyan-400 mb-1">Current Level: {currentLevel}</p>
        )}
        
        <div className="flex items-center gap-2 flex-wrap">
          {module.capacity_bonus && (
            <Badge variant="outline" className="text-[9px] text-green-400">
              +{module.capacity_bonus * (currentLevel + 1)} capacity
            </Badge>
          )}
          {module.passive_income && (
            <Badge variant="outline" className="text-[9px] text-amber-400">
              +{module.passive_income * (currentLevel + 1)} income/turn
            </Badge>
          )}
          {module.training_speed && (
            <Badge variant="outline" className="text-[9px] text-purple-400">
              {(module.training_speed * 100 - 100).toFixed(0)}% faster training
            </Badge>
          )}
        </div>
      </button>
    </motion.div>
  );
}