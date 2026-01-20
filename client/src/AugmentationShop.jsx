import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Shield, Zap, Activity, Heart, ShoppingCart, Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const availableAugmentations = [
  {
    id: 'ocular_implants',
    name: 'Ocular Implants MK-IV',
    type: 'cognitive',
    icon: Eye,
    color: 'cyan',
    description: 'Advanced multi-spectrum visual enhancement with neural pattern recognition.',
    price: 800,
    effect: 'Improves Insight trait effectiveness by 15%',
    bonus: { insight_bonus: 15, investigation_xp_bonus: 10 }
  },
  {
    id: 'reinforced_endoskeleton',
    name: 'Reinforced Endoskeleton',
    type: 'combat',
    icon: Shield,
    color: 'blue',
    description: 'Titanium-ceramic bone reinforcement with shock absorption matrix.',
    price: 1200,
    effect: 'Increases max health by 25 and reduces damage taken by 10%',
    bonus: { max_health: 25, damage_reduction: 10 }
  },
  {
    id: 'neural_accelerator',
    name: 'Neural Accelerator',
    type: 'cognitive',
    icon: Zap,
    color: 'amber',
    description: 'Synaptic enhancement that accelerates neural processing speed.',
    price: 1500,
    effect: 'Grants first strike in combat and +15% all skill XP gain',
    bonus: { first_strike: true, xp_multiplier: 1.15 }
  },
  {
    id: 'subdermal_armor',
    name: 'Subdermal Armor Plates',
    type: 'combat',
    icon: Shield,
    color: 'red',
    description: 'Flexible armor weave integrated beneath the skin layer.',
    price: 1000,
    effect: 'Passive +20% combat defense and +10% combat skill bonus',
    bonus: { defense_bonus: 20, combat_skill_bonus: 10 }
  },
  {
    id: 'pain_suppressors',
    name: 'Pain Suppressor Network',
    type: 'utility',
    icon: Activity,
    color: 'violet',
    description: 'Neural dampeners that filter pain signals without affecting reflexes.',
    price: 700,
    effect: 'Reduces combat damage penalty by 50% and improves recovery',
    bonus: { pain_resistance: 50, health_regen: 5 }
  }
];

export default function AugmentationShop({ 
  credits = 0, 
  installedAugmentations = [], 
  onPurchase, 
  onClose 
}) {
  const [selectedAug, setSelectedAug] = useState(null);

  const isInstalled = (augId) => {
    return installedAugmentations.some(aug => aug.id === augId);
  };

  const canAfford = (price) => credits >= price;

  return (
    <div className="bg-slate-900/95 rounded-2xl border-2 border-amber-500/50 overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 p-6 border-b border-amber-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-amber-200 mb-1">Cybernetic Augmentation Clinic</h2>
            <p className="text-sm text-amber-400/70">
              "Transcend your limitations. Embrace the machine."
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Your Credits</p>
            <p className="text-2xl font-bold font-mono text-amber-400">{credits.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Augmentation Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {availableAugmentations.map((aug, index) => {
            const Icon = aug.icon;
            const installed = isInstalled(aug.id);
            const affordable = canAfford(aug.price);
            
            return (
              <motion.div
                key={aug.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !installed && setSelectedAug(aug)}
                className={cn(
                  "relative p-4 rounded-xl border-2 cursor-pointer transition-all",
                  installed 
                    ? "bg-green-500/5 border-green-500/30 cursor-not-allowed" 
                    : affordable
                    ? `bg-slate-800/50 border-${aug.color}-500/30 hover:border-${aug.color}-500/60 hover:bg-slate-800/70`
                    : "bg-slate-800/30 border-slate-600/30 cursor-not-allowed opacity-50",
                  selectedAug?.id === aug.id && "ring-2 ring-amber-500/50"
                )}
              >
                {installed && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Check className="w-3 h-3 mr-1" />
                      Installed
                    </Badge>
                  </div>
                )}
                
                {!affordable && !installed && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      <Lock className="w-3 h-3" />
                    </Badge>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-${aug.color}-500/10 flex items-center justify-center border border-${aug.color}-500/30 flex-shrink-0`}>
                    <Icon className={`w-6 h-6 text-${aug.color}-400`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-200 mb-1">{aug.name}</h3>
                    <p className="text-xs text-gray-400 mb-2">{aug.description}</p>
                    
                    <div className={`text-xs px-2 py-1 rounded bg-${aug.color}-500/10 text-${aug.color}-400 border border-${aug.color}-500/30 mb-2 inline-block`}>
                      {aug.effect}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold font-mono text-amber-400">
                        {aug.price.toLocaleString()}₡
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {aug.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Purchase Section */}
        <AnimatePresence>
          {selectedAug && !isInstalled(selectedAug.id) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-950/50 rounded-lg border border-amber-500/30 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Selected Augmentation</p>
                  <p className="text-lg font-semibold text-amber-200">{selectedAug.name}</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedAug(null)}
                    className="border-slate-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={!canAfford(selectedAug.price)}
                    onClick={() => {
                      onPurchase(selectedAug);
                      setSelectedAug(null);
                    }}
                    className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Install for {selectedAug.price.toLocaleString()}₡
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700/50 p-4 flex justify-end">
        <Button variant="outline" onClick={onClose} className="border-slate-600">
          Exit Clinic
        </Button>
      </div>
    </div>
  );
}