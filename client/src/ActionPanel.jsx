import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Search, MessageSquare, Swords, ShoppingBag, 
  Users, FileSearch, ArrowRight, Sparkles, Cpu, Hammer 
} from 'lucide-react';

const actions = [
  {
    id: 'explore',
    name: 'Explore',
    description: 'Search for new locations and secrets',
    icon: Search,
    color: 'purple',
    traitRequired: 'insight',
    skillUsed: 'investigation',
    xpGain: 20,
    canDiscoverLocations: true
  },
  {
    id: 'investigate',
    name: 'Investigate',
    description: 'Gather intel about the local area',
    icon: FileSearch,
    color: 'cyan',
    traitRequired: 'insight',
    skillUsed: 'investigation',
    xpGain: 15
  },
  {
    id: 'negotiate',
    name: 'Negotiate',
    description: 'Engage in diplomatic discussions',
    icon: MessageSquare,
    color: 'violet',
    traitRequired: 'reach',
    skillUsed: 'negotiation',
    xpGain: 15
  },
  {
    id: 'confront',
    name: 'Confront',
    description: 'Take direct action against a threat',
    icon: Swords,
    color: 'red',
    traitRequired: 'grasp',
    skillUsed: 'combat',
    xpGain: 20
  },
  {
    id: 'trade',
    name: 'Trade',
    description: 'Buy, sell, or exchange goods',
    icon: ShoppingBag,
    color: 'amber',
    traitRequired: null,
    skillUsed: 'negotiation',
    xpGain: 10
  },
  {
    id: 'network',
    name: 'Network',
    description: 'Build connections with factions',
    icon: Users,
    color: 'emerald',
    traitRequired: 'reach',
    skillUsed: 'negotiation',
    xpGain: 12
  },
  {
    id: 'research',
    name: 'Research',
    description: 'Study archives and data',
    icon: FileSearch,
    color: 'blue',
    traitRequired: 'insight',
    skillUsed: 'investigation',
    xpGain: 12
  },
  {
    id: 'craft_items',
    name: 'Crafting',
    description: 'Create items and augmentations',
    icon: Hammer,
    color: 'orange',
    traitRequired: null,
    skillUsed: 'engineering',
    xpGain: 15
  },
  {
    id: 'espionage_ops',
    name: 'Espionage',
    description: 'Covert operations against factions',
    icon: Cpu,
    color: 'purple',
    traitRequired: 'insight',
    skillUsed: 'espionage',
    xpGain: 25
  },
  {
    id: 'access_market',
    name: 'Market',
    description: 'Trade and manipulate resources',
    icon: ShoppingBag,
    color: 'green',
    traitRequired: null,
    skillUsed: 'negotiation',
    xpGain: 10
  }
];

export default function ActionPanel({ onAction, disabled = false }) {
  return (
    <div className="bg-slate-900/80 rounded-xl border border-amber-900/30 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-amber-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Available Actions
        </h3>
        <span className="text-xs text-gray-500">
          Select an action to proceed
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant="outline"
                disabled={disabled}
                onClick={() => onAction && onAction(action)}
                className={`w-full h-auto py-4 px-3 flex flex-col items-center gap-2 bg-slate-800/50 border-slate-600/50 hover:bg-${action.color}-500/10 hover:border-${action.color}-500/50 transition-all group`}
              >
                <div className={`w-10 h-10 rounded-lg bg-${action.color}-500/10 flex items-center justify-center border border-${action.color}-500/30 group-hover:bg-${action.color}-500/20`}>
                  <Icon className={`w-5 h-5 text-${action.color}-400`} />
                </div>
                
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-200 group-hover:text-white">
                    {action.name}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {action.description}
                  </p>
                </div>
                
                <div className="flex flex-col items-center gap-0.5">
                  {action.traitRequired && (
                    <span className="text-[9px] text-gray-600 uppercase tracking-wider">
                      {action.traitRequired}
                    </span>
                  )}
                  {action.skillUsed && (
                    <span className={`text-[9px] text-${action.color}-400 uppercase tracking-wider`}>
                      +{action.xpGain} {action.skillUsed} XP
                    </span>
                  )}
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>
      
      {/* End Turn Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 pt-4 border-t border-slate-700/50"
      >
        <Button
          variant="default"
          disabled={disabled}
          onClick={() => onAction && onAction({ id: 'end_turn', name: 'End Turn' })}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white flex items-center justify-center gap-2"
        >
          <span>End Turn & Advance Time</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
}