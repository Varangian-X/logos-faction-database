import React from 'react';
import { motion } from 'framer-motion';
import { User, Swords, Brain, Target, ChevronUp, ChevronDown } from 'lucide-react';

const tierInfo = {
  chrysopolis: {
    name: 'The Chrysopolis',
    subtitle: 'The Golden Cloud',
    description: 'Realm of Perfect Logic',
    color: 'amber'
  },
  mese: {
    name: 'The Mese',
    subtitle: 'The Middle Street',
    description: 'Crucible of Ambition',
    color: 'cyan'
  },
  cisterns: {
    name: 'The Cisterns',
    subtitle: 'The Deep Code',
    description: 'Realm of Waste and Heresy',
    color: 'violet'
  }
};

export default function CharacterSheet({ gameState }) {
  if (!gameState) return null;
  
  const tier = tierInfo[gameState.tier] || tierInfo.mese;
  const traits = gameState.character_traits || { reach: 3, grasp: 3, insight: 3 };

  const traitConfig = [
    { 
      key: 'reach', 
      label: 'Reach', 
      icon: Target, 
      description: 'Influence others',
      color: 'violet'
    },
    { 
      key: 'grasp', 
      label: 'Grasp', 
      icon: Swords, 
      description: 'Physical capabilities',
      color: 'red'
    },
    { 
      key: 'insight', 
      label: 'Insight', 
      icon: Brain, 
      description: 'Knowledge and analysis',
      color: 'cyan'
    }
  ];

  return (
    <div className="bg-slate-900/80 rounded-xl border border-amber-900/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/30 to-violet-900/30 p-4 border-b border-amber-900/30">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-slate-800 border-2 border-amber-500/50 flex items-center justify-center">
            <User className="w-8 h-8 text-amber-400" />
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-bold text-amber-100">
              {gameState.character_name || 'Unnamed Operative'}
            </h2>
            <p className="text-sm text-amber-500/70">
              House {gameState.house_name || 'Unknown'}
            </p>
            
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full bg-${tier.color}-500/20 text-${tier.color}-400 border border-${tier.color}-500/30`}>
                {tier.name}
              </span>
              <span className="text-[10px] text-gray-500">
                {tier.subtitle}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Traits */}
      <div className="p-4">
        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Core Traits
        </h3>
        
        <div className="space-y-3">
          {traitConfig.map((trait) => (
            <div key={trait.key} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-${trait.color}-500/10 flex items-center justify-center border border-${trait.color}-500/30`}>
                <trait.icon className={`w-4 h-4 text-${trait.color}-400`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">{trait.label}</span>
                  <span className={`text-sm font-bold font-mono text-${trait.color}-400`}>
                    {traits[trait.key]}
                  </span>
                </div>
                
                {/* Trait bar */}
                <div className="flex gap-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        i < traits[trait.key]
                          ? `bg-${trait.color}-400`
                          : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Specializations */}
      {gameState.specializations && gameState.specializations.length > 0 && (
        <div className="px-4 pb-4">
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Specializations
          </h3>
          <div className="flex flex-wrap gap-2">
            {gameState.specializations.map((spec, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Location */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Current Location:</span>
          <span className="text-amber-400">{gameState.current_location || 'New Roma'}</span>
        </div>
      </div>
      
      {/* Tier Movement Indicator */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-emerald-400">
            <ChevronUp className="w-3 h-3" />
            <span>Ascend</span>
          </div>
          <span className="text-gray-500">{tier.description}</span>
          <div className="flex items-center gap-1 text-red-400">
            <span>Descend</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}