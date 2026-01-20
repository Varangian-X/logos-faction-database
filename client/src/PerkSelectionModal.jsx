import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Zap, Star, Lock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PerkSelectionModal({ 
  skillName, 
  availablePerks, 
  selectedPerks = [],
  onSelectPerk, 
  onClose 
}) {
  const [hoveredPerk, setHoveredPerk] = useState(null);
  
  const tierColors = {
    tier1: 'cyan',
    tier2: 'purple',
    tier3: 'amber',
    tier4: 'red'
  };
  
  const tierNames = {
    tier1: 'Apprentice',
    tier2: 'Adept',
    tier3: 'Expert',
    tier4: 'Master'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 rounded-2xl border-2 border-amber-500/50 w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900/40 to-amber-800/30 p-4 border-b border-amber-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/40">
                <Star className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-100">Select Perk</h3>
                <p className="text-xs text-amber-400/70">{skillName} Mastery Perks</p>
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
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {availablePerks.length === 0 ? (
            <div className="text-center py-12">
              <Lock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No perks available to unlock</p>
              <p className="text-xs text-gray-600 mt-2">Level up this skill to unlock more perks</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(
                availablePerks.reduce((acc, perk) => {
                  if (!acc[perk.tier]) acc[perk.tier] = [];
                  acc[perk.tier].push(perk);
                  return acc;
                }, {})
              ).map(([tier, perks]) => {
                const tierColor = tierColors[tier];
                
                return (
                  <div key={tier}>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={`bg-${tierColor}-500/20 text-${tierColor}-400 border-${tierColor}-500/30`}>
                        {tierNames[tier]}
                      </Badge>
                      <div className={`flex-1 h-px bg-${tierColor}-500/20`} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {perks.map((perk) => {
                        const isSelected = selectedPerks.includes(perk.id);
                        const isUltimate = perk.ultimate;
                        
                        return (
                          <motion.div
                            key={perk.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onHoverStart={() => setHoveredPerk(perk.id)}
                            onHoverEnd={() => setHoveredPerk(null)}
                          >
                            <Button
                              variant="outline"
                              disabled={isSelected}
                              onClick={() => onSelectPerk(perk)}
                              className={cn(
                                "w-full h-auto p-4 text-left relative overflow-hidden",
                                "bg-slate-800/50 border-slate-600/50",
                                !isSelected && `hover:bg-${tierColor}-500/10 hover:border-${tierColor}-500/50`,
                                isSelected && "bg-green-900/20 border-green-500/50",
                                isUltimate && "border-2"
                              )}
                            >
                              {isUltimate && (
                                <div className={`absolute inset-0 bg-gradient-to-r from-${tierColor}-500/10 to-transparent pointer-events-none`} />
                              )}
                              
                              {isSelected && (
                                <div className="absolute top-2 right-2">
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                </div>
                              )}
                              
                              <div className="relative">
                                <div className="flex items-start gap-3 mb-2">
                                  <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center border flex-shrink-0",
                                    isUltimate 
                                      ? `bg-${tierColor}-500/30 border-${tierColor}-500/50` 
                                      : `bg-${tierColor}-500/10 border-${tierColor}-500/30`
                                  )}>
                                    <Zap className={`w-5 h-5 text-${tierColor}-400`} />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className={cn(
                                      "font-bold text-sm mb-1",
                                      isUltimate ? `text-${tierColor}-200` : "text-gray-200"
                                    )}>
                                      {perk.name}
                                      {isUltimate && (
                                        <Badge className={`ml-2 text-[8px] bg-${tierColor}-500/30 text-${tierColor}-300`}>
                                          ULTIMATE
                                        </Badge>
                                      )}
                                    </h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                      {perk.description}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 mt-3">
                                  {perk.passive && (
                                    <Badge variant="outline" className="text-[9px] text-green-400 border-green-500/30">
                                      Passive
                                    </Badge>
                                  )}
                                  {perk.active && (
                                    <Badge variant="outline" className="text-[9px] text-cyan-400 border-cyan-500/30">
                                      Active
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="text-[9px] text-gray-500">
                                    Level {perk.requirements.level}+
                                  </Badge>
                                </div>
                              </div>
                            </Button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}