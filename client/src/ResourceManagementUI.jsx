import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp, Factory, Users, PiggyBank, FileText, MapPin,
  Ship, Anchor, Eye, Beaker, Radio, Store, Swords, Home,
  Map, Lightbulb, Coins, DollarSign, ArrowUpCircle, ArrowDownCircle,
  Lock, Unlock, Power, PowerOff, Plus, Minus, CheckCircle2, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  incomeSourceTypes,
  assetTypes,
  allocationOptions,
  calculateTotalIncome,
  calculateTotalUpkeep,
  calculateNetIncome
} from './ResourceManagementSystem';

const iconMap = {
  TrendingUp, Factory, Users, PiggyBank, FileText, MapPin,
  Ship, Anchor, Eye, Beaker, Radio, Store, Swords, Home,
  Map, Lightbulb, Coins
};

export default function ResourceManagementUI({ 
  gameState, 
  onToggleIncomeSource,
  onPurchaseAsset,
  onUpgradeAllocation,
  isProcessing 
}) {
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const resourceData = gameState.resource_management || {};
  const incomeSources = resourceData.income_sources || {};
  const assets = resourceData.assets || [];
  const allocations = resourceData.allocations || {};
  
  const totalIncome = calculateTotalIncome(gameState);
  const totalUpkeep = calculateTotalUpkeep(gameState);
  const netIncome = calculateNetIncome(gameState);
  
  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <CardTitle className="text-lg text-amber-300 flex items-center gap-2">
          <Coins className="w-5 h-5" />
          Resource Management
        </CardTitle>
        
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-500/30">
            <div className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">Income</div>
            <div className="text-lg font-bold text-emerald-300 flex items-center gap-1">
              <ArrowUpCircle className="w-4 h-4" />
              +{totalIncome}₵
            </div>
          </div>
          
          <div className="bg-red-900/20 rounded-lg p-3 border border-red-500/30">
            <div className="text-[10px] text-red-400 uppercase tracking-wider mb-1">Upkeep</div>
            <div className="text-lg font-bold text-red-300 flex items-center gap-1">
              <ArrowDownCircle className="w-4 h-4" />
              -{totalUpkeep}₵
            </div>
          </div>
          
          <div className={cn(
            "rounded-lg p-3 border",
            netIncome >= 0 
              ? "bg-cyan-900/20 border-cyan-500/30" 
              : "bg-orange-900/20 border-orange-500/30"
          )}>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Net/Turn</div>
            <div className={cn(
              "text-lg font-bold flex items-center gap-1",
              netIncome >= 0 ? "text-cyan-300" : "text-orange-300"
            )}>
              <DollarSign className="w-4 h-4" />
              {netIncome > 0 ? '+' : ''}{netIncome}₵
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="allocations">Allocations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div>
              <h4 className="text-sm font-semibold text-amber-300 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Income Sources
              </h4>
              
              <div className="grid gap-2">
                {Object.entries(incomeSourceTypes).map(([key, source]) => {
                  const sourceData = incomeSources[key];
                  const isActive = sourceData?.active;
                  const level = sourceData?.level || 1;
                  const income = level * source.baseIncome;
                  const Icon = iconMap[source.icon];
                  const req = source.unlockRequirement;
                  
                  const isUnlocked = 
                    (!req.reputation || gameState.reputation >= req.reputation) &&
                    (!req.influence || (gameState.influence || 0) >= req.influence) &&
                    (!req.credits || gameState.credits >= req.credits);
                  
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "p-3 rounded-lg border transition-all",
                        isActive 
                          ? "bg-emerald-900/20 border-emerald-500/30" 
                          : "bg-slate-800/50 border-slate-700/50"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center border",
                            isActive 
                              ? "bg-emerald-400/10 border-emerald-400/30" 
                              : "bg-slate-700/50 border-slate-600"
                          )}>
                            <Icon className={cn("w-4 h-4", isActive ? "text-emerald-400" : "text-gray-500")} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-200">{source.name}</span>
                              {isActive && (
                                <Badge className="bg-emerald-500/20 text-emerald-400 text-[9px]">
                                  Active
                                </Badge>
                              )}
                              {!isUnlocked && (
                                <Lock className="w-3 h-3 text-red-400" />
                              )}
                            </div>
                            
                            <p className="text-[10px] text-gray-500 mb-2">{source.description}</p>
                            
                            {isActive && (
                              <div className="flex items-center gap-2 text-xs text-emerald-300">
                                <span>Income: +{income}₵/turn</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => onToggleIncomeSource(key, level)}
                          disabled={!isUnlocked || isProcessing}
                          className={cn(
                            "min-w-[80px]",
                            isActive 
                              ? "bg-red-600 hover:bg-red-700" 
                              : "bg-emerald-600 hover:bg-emerald-700"
                          )}
                        >
                          {isActive ? (
                            <>
                              <PowerOff className="w-3 h-3 mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Power className="w-3 h-3 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="assets" className="space-y-4 mt-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                  <Ship className="w-4 h-4" />
                  Your Assets ({assets.filter(a => a.active).length})
                </h4>
                <div className="text-xs text-gray-500">
                  Total Upkeep: -{totalUpkeep}₵/turn
                </div>
              </div>
              
              {assets.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  <Ship className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  No assets acquired yet
                </div>
              ) : (
                <div className="grid gap-2 mb-4">
                  {assets.map((asset, index) => {
                    const assetType = assetTypes[asset.asset_id];
                    const Icon = iconMap[assetType.icon];
                    
                    return (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-cyan-400" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-200">{assetType.name}</div>
                            <div className="text-[10px] text-gray-500">
                              Upkeep: -{assetType.upkeep}₵/turn
                            </div>
                          </div>
                          
                          <Badge className={cn(
                            "text-[9px]",
                            asset.active ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"
                          )}>
                            {asset.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="border-t border-slate-700 pt-4">
                <h5 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                  Available Assets
                </h5>
                
                <div className="grid gap-2">
                  {Object.entries(assetTypes).map(([assetId, assetType]) => {
                    const owned = assets.some(a => a.asset_id === assetId);
                    const Icon = iconMap[assetType.icon];
                    const purchaseCost = assetType.upkeep * 10;
                    
                    return (
                      <div
                        key={assetId}
                        className={cn(
                          "p-3 rounded-lg border",
                          owned 
                            ? "bg-slate-800/30 border-slate-700/30 opacity-60" 
                            : "bg-slate-800/50 border-slate-700/50"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-8 h-8 rounded-lg bg-purple-400/10 border border-purple-400/30 flex items-center justify-center">
                              <Icon className="w-4 h-4 text-purple-400" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-200">{assetType.name}</span>
                                {owned && (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                )}
                              </div>
                              
                              <p className="text-[10px] text-gray-500 mb-2">{assetType.description}</p>
                              
                              <div className="flex items-center gap-3 text-[10px]">
                                <span className="text-amber-400">Cost: {purchaseCost}₵</span>
                                <span className="text-red-400">Upkeep: {assetType.upkeep}₵/turn</span>
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            onClick={() => onPurchaseAsset(assetId)}
                            disabled={owned || gameState.credits < purchaseCost || isProcessing}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            {owned ? 'Owned' : 'Acquire'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="allocations" className="space-y-4 mt-4">
            <div>
              <h4 className="text-sm font-semibold text-amber-300 mb-3 flex items-center gap-2">
                <Map className="w-4 h-4" />
                Strategic Allocations
              </h4>
              
              <div className="grid gap-3">
                {Object.entries(allocationOptions).map(([key, option]) => {
                  const currentAlloc = allocations[key];
                  const currentLevel = currentAlloc?.level || 0;
                  const Icon = iconMap[option.icon];
                  const nextLevel = currentLevel + 1;
                  const cost = option.costPerLevel * nextLevel;
                  const canUpgrade = nextLevel <= option.maxLevel;
                  
                  return (
                    <Card key={key} className="bg-slate-800/50 border-slate-700">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-400/10 border border-indigo-400/30 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-indigo-400" />
                            </div>
                            
                            <div>
                              <CardTitle className="text-sm text-gray-200">{option.name}</CardTitle>
                              <p className="text-[10px] text-gray-500 mt-1">{option.description}</p>
                            </div>
                          </div>
                          
                          <Badge className={cn(
                            "text-[9px]",
                            currentLevel > 0 ? "bg-indigo-500/20 text-indigo-400" : "bg-gray-500/20 text-gray-400"
                          )}>
                            Level {currentLevel}/{option.maxLevel}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        {currentLevel > 0 && (
                          <div className="bg-slate-900/50 rounded-lg p-2 text-[10px] text-gray-400">
                            <div className="font-semibold text-indigo-300 mb-1">Current Benefits:</div>
                            {Object.entries(option.effects[currentLevel]).map(([key, value], i) => (
                              <div key={i} className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                {key.replace(/_/g, ' ')}: {typeof value === 'number' ? (value > 1 ? value : `${value * 100}%`) : 'Yes'}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {canUpgrade && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-400">Next Level Benefits:</span>
                            </div>
                            
                            <div className="bg-indigo-900/20 rounded-lg p-2 text-[10px] text-gray-400 mb-3">
                              {Object.entries(option.effects[nextLevel]).map(([key, value], i) => (
                                <div key={i} className="flex items-center gap-1">
                                  <Plus className="w-3 h-3 text-indigo-400" />
                                  {key.replace(/_/g, ' ')}: {typeof value === 'number' ? (value > 1 ? value : `${value * 100}%`) : 'Yes'}
                                </div>
                              ))}
                            </div>
                            
                            <Button
                              onClick={() => onUpgradeAllocation(key, nextLevel)}
                              disabled={gameState.credits < cost || isProcessing}
                              className="w-full bg-indigo-600 hover:bg-indigo-700"
                            >
                              Upgrade to Level {nextLevel} ({cost}₵)
                            </Button>
                          </div>
                        )}
                        
                        {!canUpgrade && currentLevel > 0 && (
                          <div className="flex items-center gap-2 text-xs text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            Maximum level reached
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}