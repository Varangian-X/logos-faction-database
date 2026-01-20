import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Shield, Zap, Activity, Heart, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

const augmentationIcons = {
  ocular_implants: Eye,
  reinforced_endoskeleton: Shield,
  neural_accelerator: Zap,
  subdermal_armor: Shield,
  pain_suppressors: Activity
};

const augmentationColors = {
  combat: 'red',
  cognitive: 'cyan',
  utility: 'violet',
  social: 'emerald'
};

export default function AugmentationDisplay({ augmentations = [], compact = false }) {
  if (!augmentations || augmentations.length === 0) {
    return (
      <div className="bg-slate-900/80 rounded-xl border border-amber-900/30 p-4">
        <h3 className="text-amber-400 font-semibold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
          <Cpu className="w-3 h-3" />
          Augmentations
        </h3>
        <p className="text-xs text-gray-500 italic">No augmentations installed</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {augmentations.map((aug, i) => {
          const Icon = augmentationIcons[aug.id] || Cpu;
          const color = augmentationColors[aug.type] || 'gray';
          
          return (
            <div
              key={i}
              className={cn(
                "px-2 py-1 rounded border text-xs flex items-center gap-1",
                `bg-${color}-500/10 text-${color}-400 border-${color}-500/30`
              )}
            >
              <Icon className="w-3 h-3" />
              <span className="truncate max-w-[100px]">{aug.name}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 rounded-xl border border-amber-900/30 p-4">
      <h3 className="text-amber-400 font-semibold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
        <Cpu className="w-4 h-4" />
        Cybernetic Augmentations
      </h3>
      
      <div className="space-y-3">
        {augmentations.map((aug, index) => {
          const Icon = augmentationIcons[aug.id] || Cpu;
          const color = augmentationColors[aug.type] || 'gray';
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
            >
              <div className={`w-10 h-10 rounded-lg bg-${color}-500/10 flex items-center justify-center border border-${color}-500/30 flex-shrink-0`}>
                <Icon className={`w-5 h-5 text-${color}-400`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-semibold text-gray-200">{aug.name}</h4>
                  <span className={cn(
                    "text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider",
                    `bg-${color}-500/10 text-${color}-400 border border-${color}-500/30`
                  )}>
                    {aug.type}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{aug.effect}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-700/50">
        <p className="text-[10px] text-gray-500">
          {augmentations.length} augmentation{augmentations.length !== 1 ? 's' : ''} installed
        </p>
      </div>
    </div>
  );
}