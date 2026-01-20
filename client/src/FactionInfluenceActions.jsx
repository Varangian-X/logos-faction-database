import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Gift, Briefcase, UserPlus, Bomb, FileText, Coins } from 'lucide-react';

const influenceActions = [
  {
    id: 'send_gift',
    name: 'Send Gift',
    description: 'Offer a generous donation to curry favor',
    icon: Gift,
    cost: { credits: 300 },
    effect: { standing: 8 },
    cooldown: 3
  },
  {
    id: 'complete_contract',
    name: 'Fulfill Contract',
    description: 'Complete a minor task for the faction',
    icon: Briefcase,
    cost: { credits: 200 },
    effect: { standing: 12 },
    cooldown: 5
  },
  {
    id: 'sponsor_member',
    name: 'Sponsor Member',
    description: 'Fund a faction member\'s advancement',
    icon: UserPlus,
    cost: { credits: 500, influence: 5 },
    effect: { standing: 20 },
    cooldown: 8
  },
  {
    id: 'share_intel',
    name: 'Share Intelligence',
    description: 'Provide valuable information',
    icon: FileText,
    cost: { intel: 10 },
    effect: { standing: 15 },
    cooldown: 4
  },
  {
    id: 'sabotage_rival',
    name: 'Sabotage Rival',
    description: 'Disrupt a faction\'s enemy operations',
    icon: Bomb,
    cost: { credits: 400, intel: 5 },
    effect: { standing: 18, rival_standing: -15 },
    cooldown: 10,
    risky: true
  },
  {
    id: 'fund_project',
    name: 'Fund Project',
    description: 'Bankroll a faction initiative',
    icon: Coins,
    cost: { credits: 800 },
    effect: { standing: 30 },
    cooldown: 12
  }
];

export default function FactionInfluenceActions({ 
  selectedFaction,
  gameState,
  onAction,
  isProcessing
}) {
  if (!selectedFaction) {
    return (
      <div className="bg-slate-900/80 rounded-xl border border-amber-900/30 p-4 text-center">
        <p className="text-sm text-gray-500">Select a faction to see influence actions</p>
      </div>
    );
  }
  
  const canAfford = (cost) => {
    if (cost.credits && gameState.credits < cost.credits) return false;
    if (cost.influence && (gameState.influence || 0) < cost.influence) return false;
    if (cost.intel && (gameState.intel || 0) < cost.intel) return false;
    return true;
  };
  
  return (
    <div className="bg-slate-900/80 rounded-xl border border-amber-900/30 p-4">
      <h3 className="text-amber-400 font-semibold uppercase tracking-wider text-sm mb-4">
        Influence {selectedFaction.replace('_', ' ')}
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {influenceActions.map((action, index) => {
          const Icon = action.icon;
          const affordable = canAfford(action.cost);
          
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant="outline"
                disabled={!affordable || isProcessing}
                onClick={() => onAction && onAction(action, selectedFaction)}
                className={`w-full h-auto py-3 px-3 flex flex-col items-center gap-2 ${
                  action.risky 
                    ? 'bg-red-500/5 border-red-500/30 hover:bg-red-500/10'
                    : 'bg-slate-800/50 border-slate-600/50 hover:bg-slate-800/70'
                } transition-all group`}
              >
                <div className={`w-10 h-10 rounded-lg ${
                  action.risky ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'
                } flex items-center justify-center border`}>
                  <Icon className={`w-5 h-5 ${action.risky ? 'text-red-400' : 'text-amber-400'}`} />
                </div>
                
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-200">{action.name}</p>
                  <p className="text-[9px] text-gray-500 mt-0.5">{action.description}</p>
                </div>
                
                <div className="text-center space-y-0.5">
                  <p className="text-[9px] text-gray-600">
                    {action.cost.credits && `${action.cost.credits}₡`}
                    {action.cost.influence && ` ${action.cost.influence} inf`}
                    {action.cost.intel && ` ${action.cost.intel} intel`}
                  </p>
                  <p className="text-[9px] text-green-400">+{action.effect.standing} standing</p>
                  {action.risky && <p className="text-[9px] text-red-400">⚠ Risky</p>}
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}