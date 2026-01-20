import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, Package, Trophy, Users, Wrench, TrendingUp,
  Plus, Lock, Star, Zap, Shield, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { housingTypes, housingModules, calculateHousingBenefits } from './HousingData';
import ResourceStoragePanel from './ResourceStoragePanel';
import TrophyDisplayPanel from './TrophyDisplayPanel';
import CompanionTrainingPanel from './CompanionTrainingPanel';
import CraftingStationPanel from './CraftingStationPanel';
import HousingCustomization from './HousingCustomization';

export default function PlayerHousingHub({ 
  housing, 
  gameState, 
  companions = [],
  onUpgrade,
  onCraft,
  onTrainCompanion,
  onStoreResource,
  onWithdrawResource
}) {
  const [selectedTab, setSelectedTab] = useState('overview');
  
  if (!housing) {
    return (
      <div className="bg-slate-900/90 rounded-xl border border-slate-700/50 p-8 text-center">
        <Home className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Housing Acquired</h3>
        <p className="text-sm text-gray-500 mb-4">
          Establish your base of operations to unlock storage, crafting, and training facilities.
        </p>
        <Button
          onClick={() => onUpgrade && onUpgrade('acquire', 'ship_interior')}
          className="bg-cyan-600/20 hover:bg-cyan-600/30 border-cyan-500/50 text-cyan-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Acquire Personal Starship (Free)
        </Button>
      </div>
    );
  }

  const housingType = housingTypes[housing.housing_type];
  const benefits = calculateHousingBenefits(housing);

  return (
    <div className="space-y-4">
      {/* Housing Header */}
      <Card className="bg-slate-900/90 border-cyan-900/30 overflow-hidden">
        <div className="relative h-32 overflow-hidden">
          {housingType.imageUrl && (
            <>
              <motion.img 
                src={housingType.imageUrl} 
                alt={housingType.name}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
              
              {/* Ambient particles */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-cyan-400/40"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.4
                    }}
                  />
                ))}
              </div>
            </>
          )}
          
          <div className="absolute bottom-3 left-4 z-10">
            <h2 className="text-2xl font-bold text-cyan-400 drop-shadow-lg">{housingType.name}</h2>
            <p className="text-sm text-gray-300 drop-shadow">Tier {housing.housing_tier}</p>
          </div>
          
          <div className="absolute top-3 right-4 z-10">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              <Home className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
        </div>

        <CardContent className="pt-4">
          {/* Benefits Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {benefits.passive_income > 0 && (
              <BenefitBadge icon={TrendingUp} label="Income" value={`+${benefits.passive_income}/turn`} color="amber" />
            )}
            {benefits.passive_intel > 0 && (
              <BenefitBadge icon={Zap} label="Intel" value={`+${benefits.passive_intel}/turn`} color="purple" />
            )}
            {benefits.passive_influence > 0 && (
              <BenefitBadge icon={Star} label="Influence" value={`+${benefits.passive_influence}/turn`} color="cyan" />
            )}
            {benefits.passive_reputation > 0 && (
              <BenefitBadge icon={Shield} label="Reputation" value={`+${benefits.passive_reputation}/turn`} color="green" />
            )}
          </div>

          {/* Active Modules */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Installed Modules</p>
              <p className="text-sm text-cyan-400">
                {housing.customizations?.installed_modules?.length || 0} / {housing.housing_tier * 3}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedTab('customize')}
              className="text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10"
            >
              <Plus className="w-3 h-3 mr-1" />
              Upgrade
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Housing Management Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-5 bg-slate-800/50">
          <TabsTrigger value="overview" className="text-xs">
            <Home className="w-3 h-3 mr-1" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="storage" className="text-xs">
            <Package className="w-3 h-3 mr-1" />
            Storage
          </TabsTrigger>
          <TabsTrigger value="trophies" className="text-xs">
            <Trophy className="w-3 h-3 mr-1" />
            Trophies
          </TabsTrigger>
          <TabsTrigger value="training" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            Training
          </TabsTrigger>
          <TabsTrigger value="crafting" className="text-xs">
            <Wrench className="w-3 h-3 mr-1" />
            Crafting
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="overview">
            <HousingCustomization
              housing={housing}
              gameState={gameState}
              onUpgrade={onUpgrade}
            />
          </TabsContent>

          <TabsContent value="storage">
            <ResourceStoragePanel
              housing={housing}
              gameState={gameState}
              onStore={onStoreResource}
              onWithdraw={onWithdrawResource}
            />
          </TabsContent>

          <TabsContent value="trophies">
            <TrophyDisplayPanel
              housing={housing}
              gameState={gameState}
            />
          </TabsContent>

          <TabsContent value="training">
            <CompanionTrainingPanel
              housing={housing}
              companions={companions}
              gameState={gameState}
              onTrain={onTrainCompanion}
            />
          </TabsContent>

          <TabsContent value="crafting">
            <CraftingStationPanel
              housing={housing}
              gameState={gameState}
              onCraft={onCraft}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function BenefitBadge({ icon: Icon, label, value, color }) {
  const colors = {
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    green: 'bg-green-500/10 text-green-400 border-green-500/30'
  };

  return (
    <div className={cn("flex items-center gap-2 p-2 rounded border", colors[color])}>
      <Icon className="w-4 h-4" />
      <div>
        <p className="text-[10px] text-gray-500 uppercase">{label}</p>
        <p className="text-xs font-semibold">{value}</p>
      </div>
    </div>
  );
}