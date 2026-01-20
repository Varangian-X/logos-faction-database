import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, UserX, AlertTriangle, Radio, Skull,
  Lock, DollarSign, Brain, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const espionageActions = [
  {
    id: 'steal_secrets',
    name: 'Steal Secrets',
    description: 'Infiltrate faction networks and steal classified intel',
    icon: Eye,
    color: 'purple',
    cost: { intel: 15, credits: 200 },
    skillUsed: 'espionage',
    riskLevel: 'medium',
    effects: '+40 intel, reveals operations, -20 faction standing'
  },
  {
    id: 'plant_agent',
    name: 'Plant Deep Cover Agent',
    description: 'Insert a spy into faction leadership for long-term intelligence',
    icon: UserX,
    color: 'violet',
    cost: { intel: 30, credits: 500 },
    skillUsed: 'espionage',
    riskLevel: 'medium',
    effects: '+10 intel per turn for 5 turns, -10 faction standing'
  },
  {
    id: 'sabotage_operations',
    name: 'Sabotage Operations',
    description: 'Disrupt active faction military or economic operations',
    icon: AlertTriangle,
    color: 'orange',
    cost: { intel: 25, credits: 400 },
    skillUsed: 'hacking',
    riskLevel: 'high',
    effects: 'Cancels operations, -15 power, -30 faction standing'
  },
  {
    id: 'spread_propaganda',
    name: 'Spread Propaganda',
    description: 'Undermine faction morale through information warfare',
    icon: Radio,
    color: 'cyan',
    cost: { intel: 10, influence: 15 },
    skillUsed: 'negotiation',
    riskLevel: 'low',
    effects: '-20 morale, +10 reputation, -15 faction standing'
  },
  {
    id: 'assassinate_leader',
    name: 'Assassinate Leadership',
    description: 'Eliminate key faction figures - extremely dangerous',
    icon: Skull,
    color: 'red',
    cost: { intel: 50, credits: 1000 },
    skillUsed: 'espionage',
    riskLevel: 'extreme',
    effects: '-30 power, -60 faction standing, triggers investigation'
  }
];

export default function EspionageActionsPanel({ 
  gameState, 
  selectedFaction,
  onExecute, 
  onCancel,
  isProcessing = false 
}) {
  const [selectedAction, setSelectedAction] = useState(null);
  
  const canAfford = (action) => {
    if (action.cost.credits && (gameState.credits || 0) < action.cost.credits) return false;
    if (action.cost.intel && (gameState.intel || 0) < action.cost.intel) return false;
    if (action.cost.influence && (gameState.influence || 0) < action.cost.influence) return false;
    return true;
  };
  
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'orange';
      case 'extreme': return 'red';
      default: return 'gray';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/90 rounded-2xl border-2 border-purple-500/50 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-purple-900/40 to-violet-900/40 p-4 border-b border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/40">
              <Eye className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-purple-200 font-bold text-lg">Espionage Operations</h3>
              <p className="text-xs text-purple-400/70">Target: {selectedFaction?.replace('_', ' ')}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
          >
            Cancel
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Select Operation:</p>
        
        <div className="grid gap-3 mb-6">
          {espionageActions.map((action) => {
            const Icon = action.icon;
            const affordable = canAfford(action);
            const riskColor = getRiskColor(action.riskLevel);
            
            return (
              <Button
                key={action.id}
                variant="outline"
                disabled={!affordable || isProcessing}
                onClick={() => setSelectedAction(selectedAction?.id === action.id ? null : action)}
                className={cn(
                  "h-auto py-4 px-4 text-left",
                  "bg-slate-800/50 border-slate-600/50 hover:bg-purple-500/10 hover:border-purple-500/50",
                  selectedAction?.id === action.id && "bg-purple-500/20 border-purple-500/50",
                  !affordable && "opacity-50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-${action.color}-500/20 flex items-center justify-center border border-${action.color}-500/30 flex-shrink-0`}>
                    <Icon className={`w-5 h-5 text-${action.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold text-gray-200">{action.name}</h4>
                      <Badge className={`text-[8px] bg-${riskColor}-500/20 text-${riskColor}-400 border-${riskColor}-500/30`}>
                        {action.riskLevel} risk
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">{action.description}</p>
                    
                    <div className="flex items-center gap-3 text-[10px]">
                      <div className="flex items-center gap-4">
                        {action.cost.credits && (
                          <span className={cn(
                            "flex items-center gap-1",
                            (gameState.credits || 0) >= action.cost.credits ? "text-gray-500" : "text-red-400"
                          )}>
                            <DollarSign className="w-3 h-3" />
                            {action.cost.credits}
                          </span>
                        )}
                        {action.cost.intel && (
                          <span className={cn(
                            "flex items-center gap-1",
                            (gameState.intel || 0) >= action.cost.intel ? "text-gray-500" : "text-red-400"
                          )}>
                            <Brain className="w-3 h-3" />
                            {action.cost.intel}
                          </span>
                        )}
                        {action.cost.influence && (
                          <span className={cn(
                            "flex items-center gap-1",
                            (gameState.influence || 0) >= action.cost.influence ? "text-gray-500" : "text-red-400"
                          )}>
                            <Zap className="w-3 h-3" />
                            {action.cost.influence}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-[9px] text-gray-600 mt-2">{action.effects}</p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
        
        {selectedAction && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={() => onExecute(selectedAction)}
              disabled={isProcessing}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Execute {selectedAction.name}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}