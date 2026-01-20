import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trophy, Skull, TrendingUp, Award } from 'lucide-react';

export default function CombatResult({ combat, rewards, onContinue }) {
  const isVictory = combat.status === 'victory';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900/90 rounded-2xl border-2 border-amber-500/50 overflow-hidden"
    >
      {/* Header */}
      <div className={`p-6 text-center ${
        isVictory 
          ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40' 
          : 'bg-gradient-to-r from-red-900/40 to-orange-900/40'
      }`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mx-auto w-20 h-20 rounded-full bg-slate-950/50 flex items-center justify-center mb-4"
        >
          {isVictory ? (
            <Trophy className="w-10 h-10 text-amber-400" />
          ) : (
            <Skull className="w-10 h-10 text-red-400" />
          )}
        </motion.div>
        
        <h2 className={`text-3xl font-bold mb-2 ${
          isVictory ? 'text-green-200' : 'text-red-200'
        }`}>
          {isVictory ? 'VICTORY' : 'DEFEAT'}
        </h2>
        
        <p className="text-gray-400 text-sm">
          {isVictory 
            ? `${combat.enemy_name} has been neutralized`
            : 'You have been overwhelmed. Retreat to fight another day.'
          }
        </p>
      </div>
      
      {/* Combat Summary */}
      <div className="p-6">
        <div className="bg-slate-950/50 rounded-lg border border-slate-700/50 p-4 mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Combat Summary</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Duration</p>
              <p className="text-gray-200 font-semibold">{combat.turn_number} turns</p>
            </div>
            <div>
              <p className="text-gray-500">Location</p>
              <p className="text-gray-200 font-semibold">{combat.location}</p>
            </div>
            <div>
              <p className="text-gray-500">Final HP</p>
              <p className="text-gray-200 font-semibold">{combat.player_health}/{combat.player_max_health}</p>
            </div>
            <div>
              <p className="text-gray-500">Enemy HP</p>
              <p className="text-gray-200 font-semibold">{combat.enemy_health}/{combat.enemy_max_health}</p>
            </div>
          </div>
        </div>
        
        {/* Rewards */}
        {isVictory && rewards && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 rounded-lg border border-amber-500/30 p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-amber-400" />
              <p className="text-xs text-amber-400 uppercase tracking-wider font-semibold">Rewards Earned</p>
            </div>
            
            <div className="space-y-2">
              {rewards.credits && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Credits</span>
                  <span className="text-amber-400 font-semibold">+{rewards.credits}</span>
                </div>
              )}
              {rewards.reputation && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Reputation</span>
                  <span className="text-cyan-400 font-semibold">+{rewards.reputation}</span>
                </div>
              )}
              {rewards.xp && Object.entries(rewards.xp).map(([skill, amount]) => (
                <div key={skill} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {skill.charAt(0).toUpperCase() + skill.slice(1)} XP
                  </span>
                  <span className="text-green-400 font-semibold">+{amount}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Continue Button */}
        <Button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
}