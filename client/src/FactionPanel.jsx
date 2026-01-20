import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Church, Sword, Anchor, Store, Eye, Scroll, ChevronDown, ChevronUp, Activity } from 'lucide-react';
import FactionDynamicsPanel from '@/components/factions/FactionDynamicsPanel';

const factionData = {
  ecclesiarchy: { 
    name: 'Ecclesiarchy', 
    icon: Church, 
    description: 'The keepers of the Logos and divine truth',
    color: 'violet'
  },
  praetorians: { 
    name: 'Neo-Praetorians', 
    icon: Sword, 
    description: 'The cybernetic elite guard of the Emperor',
    color: 'red'
  },
  varangians: { 
    name: 'Neo-Varangians', 
    icon: Anchor, 
    description: 'Barbarian mercenaries bound by honor',
    color: 'blue'
  },
  merchant_houses: { 
    name: 'Merchant Houses', 
    icon: Store, 
    description: 'Controllers of trade and commerce',
    color: 'amber'
  },
  agentes_in_rebus: { 
    name: 'Agentes in Rebus', 
    icon: Eye, 
    description: 'Imperial intelligence operatives',
    color: 'cyan'
  },
  scrinium_barbarorum: { 
    name: 'Scrinium Barbarorum', 
    icon: Scroll, 
    description: 'Shadow network of information brokers',
    color: 'emerald'
  }
};

export default function FactionPanel({ relations = {}, onSelectFaction = null, onDiplomacy = null, onIntrigue = null }) {
  const [expandedFaction, setExpandedFaction] = useState(null);
  const getRelationColor = (value) => {
    if (value >= 50) return 'text-emerald-400';
    if (value >= 20) return 'text-cyan-400';
    if (value >= -20) return 'text-gray-400';
    if (value >= -50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRelationLabel = (value) => {
    if (value >= 75) return 'Devoted';
    if (value >= 50) return 'Friendly';
    if (value >= 20) return 'Cordial';
    if (value >= -20) return 'Neutral';
    if (value >= -50) return 'Suspicious';
    if (value >= -75) return 'Hostile';
    return 'Enemy';
  };

  return (
    <div className="bg-slate-900/80 rounded-xl border border-amber-900/30 p-4">
      <h3 className="text-amber-400 font-semibold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
        <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
        Faction Relations
      </h3>
      
      <div className="space-y-3">
        {Object.entries(factionData).map(([key, faction], index) => {
          const value = relations[key] || 0;
          const Icon = faction.icon;
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70 transition-colors cursor-pointer"
              onClick={() => setExpandedFaction(expandedFaction === key ? null : key)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-${faction.color}-400/10 flex items-center justify-center border border-${faction.color}-400/30`}>
                  <Icon className={`w-4 h-4 text-${faction.color}-400`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-300 truncate">{faction.name}</span>
                    <span className={`text-xs font-mono ${getRelationColor(value)}`}>
                      {value > 0 ? '+' : ''}{value}
                    </span>
                  </div>
                  
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.abs(value) / 2 + 50}%` }}
                      className={`h-full rounded-full ${
                        value >= 0 
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-500' 
                          : 'bg-gradient-to-r from-red-500 to-orange-500'
                      }`}
                    />
                  </div>
                  
                  <span className={`text-[10px] ${getRelationColor(value)}`}>
                    {getRelationLabel(value)}
                  </span>
                </div>
                
                <button className="ml-auto">
                  {expandedFaction === key ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
              
              {expandedFaction === key && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-slate-700/50 space-y-3"
                >
                  <div className="text-[10px] text-gray-500 mb-2 flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    <span>Faction Health</span>
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    {onSelectFaction && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectFaction(key);
                        }}
                        className="flex-1 text-[10px] text-amber-400 hover:text-amber-300 transition-colors py-1 px-2 rounded border border-amber-500/30 hover:border-amber-500/50"
                      >
                        Influence
                      </button>
                    )}
                    {onDiplomacy && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDiplomacy(key);
                        }}
                        className="flex-1 text-[10px] text-purple-400 hover:text-purple-300 transition-colors py-1 px-2 rounded border border-purple-500/30 hover:border-purple-500/50"
                      >
                        Diplomacy
                      </button>
                    )}
                    {onIntrigue && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onIntrigue(key);
                        }}
                        className="flex-1 text-[10px] text-red-400 hover:text-red-300 transition-colors py-1 px-2 rounded border border-red-500/30 hover:border-red-500/50"
                      >
                        Intrigue
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}