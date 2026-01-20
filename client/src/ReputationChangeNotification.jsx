import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReputationChangeNotification({ changes, onComplete }) {
  if (!changes || changes.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onAnimationComplete={() => setTimeout(onComplete, 3000)}
        className="fixed top-24 right-6 z-50 space-y-2"
      >
        {changes.map((change, index) => {
          const Icon = change.value > 0 ? TrendingUp : TrendingDown;
          const isPositive = change.value > 0;
          
          return (
            <motion.div
              key={`${change.faction}-${index}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "bg-slate-900/95 border rounded-lg p-3 shadow-lg backdrop-blur-sm min-w-64",
                isPositive ? "border-green-500/50" : "border-red-500/50"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className={cn("w-4 h-4", isPositive ? "text-green-400" : "text-red-400")} />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    {change.faction.replace('_', ' ')}
                  </p>
                  <p className={cn("text-sm font-semibold", isPositive ? "text-green-400" : "text-red-400")}>
                    {isPositive ? '+' : ''}{change.value} Reputation
                  </p>
                </div>
              </div>
              
              {change.tierChanged && (
                <div className="mt-2 pt-2 border-t border-slate-700/50">
                  <div className="flex items-center gap-1 text-[10px] text-amber-400">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Standing: {change.oldTier} → {change.newTier}</span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}