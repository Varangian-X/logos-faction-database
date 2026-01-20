import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Sword, Users, Globe, Coins, Target, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trophyCategories } from './HousingData';

const categoryIcons = {
  combat: Sword,
  diplomatic: Users,
  exploration: Globe,
  economic: Coins,
  quest: Target
};

const rarityConfig = {
  common: { color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30', label: 'Common' },
  uncommon: { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30', label: 'Uncommon' },
  rare: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', label: 'Rare' },
  legendary: { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30', label: 'Legendary' }
};

export default function TrophyDisplayPanel({ housing, gameState }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const trophies = housing.trophies || [];
  const maxSlots = 10 + (housing.customizations?.installed_modules?.find(m => m.module_id === 'trophy_hall')?.level || 0) * 5;
  
  const filteredTrophies = selectedCategory === 'all' 
    ? trophies 
    : trophies.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-4">
      {/* Trophy Hall Header */}
      <Card className="bg-gradient-to-br from-amber-900/20 to-yellow-900/20 border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
            <Trophy className="w-4 h-4" />
            Trophy Hall
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-amber-400">{trophies.length}</p>
              <p className="text-xs text-gray-500">Achievements Unlocked</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">{trophies.length} / {maxSlots} Slots</p>
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] mt-1">
                {trophies.filter(t => t.rarity === 'legendary').length} Legendary
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <FilterButton
          label="All"
          active={selectedCategory === 'all'}
          onClick={() => setSelectedCategory('all')}
          count={trophies.length}
        />
        {Object.entries(trophyCategories).map(([key, cat]) => (
          <FilterButton
            key={key}
            label={cat.name}
            active={selectedCategory === key}
            onClick={() => setSelectedCategory(key)}
            count={trophies.filter(t => t.category === key).length}
          />
        ))}
      </div>

      {/* Trophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredTrophies.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No trophies in this category yet</p>
            <p className="text-xs text-gray-600 mt-1">Complete quests and achievements to earn trophies</p>
          </div>
        ) : (
          filteredTrophies.map((trophy, index) => (
            <TrophyCard key={trophy.trophy_id} trophy={trophy} index={index} />
          ))
        )}
        
        {/* Empty slots */}
        {Array.from({ length: Math.max(0, maxSlots - trophies.length) }).slice(0, 4).map((_, i) => (
          <EmptySlot key={`empty-${i}`} index={filteredTrophies.length + i} />
        ))}
      </div>
    </div>
  );
}

function FilterButton({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg border text-xs transition-all",
        active 
          ? "bg-amber-500/20 border-amber-500/50 text-amber-400" 
          : "bg-slate-800/50 border-slate-700/50 text-gray-400 hover:border-slate-600"
      )}
    >
      {label} {count > 0 && <span className="ml-1">({count})</span>}
    </button>
  );
}

function TrophyCard({ trophy, index }) {
  const rarity = rarityConfig[trophy.rarity] || rarityConfig.common;
  const CategoryIcon = categoryIcons[trophy.category] || Star;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={cn("bg-slate-800/50 border hover:shadow-lg transition-all relative overflow-hidden", rarity.border)}>
        {/* Rarity glow effect */}
        <motion.div
          className={cn("absolute inset-0 opacity-5", rarity.bg)}
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={cn("w-12 h-12 rounded-lg border flex items-center justify-center", rarity.bg, rarity.border)}>
                <CategoryIcon className={cn("w-6 h-6", rarity.color)} />
              </div>
              <div className="flex-1">
                <CardTitle className="text-sm text-gray-200">{trophy.name}</CardTitle>
                <Badge className={cn("text-[9px] mt-1", rarity.bg, rarity.color, rarity.border)}>
                  {rarity.label}
                </Badge>
              </div>
            </div>
            
            {/* Shine effect for legendary */}
            {trophy.rarity === 'legendary' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </motion.div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-xs text-gray-400 mb-2">{trophy.description}</p>
          <p className="text-[10px] text-gray-600">Acquired Turn {trophy.acquired_turn}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EmptySlot({ index }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="bg-slate-900/50 border-slate-700/30 border-dashed">
        <CardContent className="py-8 text-center">
          <Lock className="w-8 h-8 text-gray-700 mx-auto mb-2" />
          <p className="text-xs text-gray-600">Empty Slot</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}