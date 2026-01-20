import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Eye, Hand, TrendingUp, Lock, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const traitConfig = {
  reach: {
    name: 'Reach',
    icon: TrendingUp,
    color: 'violet',
    description: 'Influence and connections across the Imperium',
    bonuses: 'Unlocks diplomatic options, improves negotiation success'
  },
  grasp: {
    name: 'Grasp',
    icon: Hand,
    color: 'red',
    description: 'Physical capability and direct action',
    bonuses: 'Unlocks combat options, improves damage and accuracy'
  },
  insight: {
    name: 'Insight',
    icon: Eye,
    color: 'cyan',
    description: 'Perception, analysis, and understanding',
    bonuses: 'Unlocks investigation options, improves hacking and research'
  }
};

const getTraitBonus = (level) => {
  if (level <= 2) return 5;
  if (level <= 4) return 10;
  if (level <= 6) return 20;
  if (level <= 8) return 30;
  return 40 + (level - 8) * 5;
};

export default function TraitPanel({ traits = {}, onUpgrade, canUpgrade = false, upgradeCost = 500 }) {
  const { reach = 3, grasp = 3, insight = 3 } = traits;
  
  return (
    <div className="bg-slate-900/80 rounded-xl border border-amber-900/30 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-amber-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Core Traits
        </h3>
        {canUpgrade && (
          <span className="text-xs text-gray-500">
            Upgrade: {upgradeCost}₡
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        {Object.entries(traitConfig).map(([key, config], index) => {
          const Icon = config.icon;
          const level = traits[key] || 3;
          const bonus = getTraitBonus(level);
          const maxLevel = 10;
          const progress = (level / maxLevel) * 100;
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-2"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${config.color}-500/10 flex items-center justify-center border border-${config.color}-500/30 flex-shrink-0`}>
                  <Icon className={`w-5 h-5 text-${config.color}-400`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-sm text-gray-200 font-medium">{config.name}</span>
                      <p className="text-[10px] text-gray-500">{config.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xl font-bold font-mono text-${config.color}-400`}>
                        {level}
                      </span>
                      {bonus > 0 && (
                        <p className="text-[9px] text-green-400">+{bonus}% bonus</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className={`h-full rounded-full bg-gradient-to-r from-${config.color}-500 to-${config.color}-400`}
                      />
                    </div>
                    <p className="text-[9px] text-gray-600">{config.bonuses}</p>
                  </div>
                  
                  {/* Upgrade Button */}
                  {canUpgrade && level < maxLevel && onUpgrade && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpgrade(key)}
                      className={`mt-2 h-7 text-xs border-${config.color}-500/30 text-${config.color}-400 hover:bg-${config.color}-500/10`}
                    >
                      Upgrade to {level + 1}
                    </Button>
                  )}
                  
                  {level >= maxLevel && (
                    <div className="mt-2 flex items-center gap-1 text-[9px] text-amber-400">
                      <Lock className="w-3 h-3" />
                      <span>Max Level</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-700/50">
        <p className="text-[10px] text-gray-500 leading-relaxed">
          Traits unlock special choices in events and provide passive bonuses to related actions.
        </p>
      </div>
    </div>
  );
}