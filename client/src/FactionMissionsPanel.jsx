import React from 'react';
import { getReputationTier, canAccessFactionContent } from '@/components/reputation/ReputationSystem';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scroll, Swords, Package, Eye, Shield, Sparkles, ChevronRight, Lock } from 'lucide-react';

const factionMissions = {
  ecclesiarchy: [
    {
      id: 'ecclesiarchy_recover_relic',
      title: 'Recover Sacred Datacore',
      description: 'A holy relic containing ancient algorithms has been stolen by heretics.',
      required_standing: 10,
      rewards: { credits: 800, reputation: 15, faction_ecclesiarchy: 25 },
      icon: Scroll,
      difficulty: 'Medium'
    },
    {
      id: 'ecclesiarchy_convert',
      title: 'Convert the Unbelievers',
      description: 'Spread the word of the Logos to a resistant district.',
      required_standing: 30,
      rewards: { credits: 500, influence: 10, faction_ecclesiarchy: 20 },
      icon: Sparkles,
      difficulty: 'Easy'
    }
  ],
  praetorians: [
    {
      id: 'praetorian_patrol',
      title: 'Joint Security Patrol',
      description: 'Assist Praetorian forces in maintaining order in contested sectors.',
      required_standing: 15,
      rewards: { credits: 700, reputation: 10, faction_praetorians: 20 },
      icon: Shield,
      difficulty: 'Medium'
    },
    {
      id: 'praetorian_traitor',
      title: 'Hunt the Traitor',
      description: 'Track down a rogue Praetorian who has betrayed the Imperium.',
      required_standing: 40,
      rewards: { credits: 1200, reputation: 20, faction_praetorians: 35 },
      icon: Swords,
      difficulty: 'Hard'
    }
  ],
  varangians: [
    {
      id: 'varangian_honor_duel',
      title: 'Trial of Honor',
      description: 'Prove your worth in the combat arenas of the Varangian Enclave.',
      required_standing: 20,
      rewards: { credits: 600, reputation: 15, faction_varangians: 25 },
      icon: Swords,
      difficulty: 'Hard'
    }
  ],
  merchant_houses: [
    {
      id: 'merchant_escort',
      title: 'Escort Trade Convoy',
      description: 'Protect a valuable shipment from pirates and rival houses.',
      required_standing: 10,
      rewards: { credits: 1000, intel: 5, faction_merchant_houses: 20 },
      icon: Package,
      difficulty: 'Medium'
    },
    {
      id: 'merchant_sabotage',
      title: 'Corporate Sabotage',
      description: 'Disrupt a rival trading house\'s operations without being traced.',
      required_standing: 35,
      rewards: { credits: 1500, intel: 15, faction_merchant_houses: 30 },
      icon: Eye,
      difficulty: 'Hard'
    }
  ],
  agentes_in_rebus: [
    {
      id: 'agentes_spy',
      title: 'Intelligence Gathering',
      description: 'Infiltrate a target location and extract sensitive information.',
      required_standing: 25,
      rewards: { credits: 900, intel: 20, faction_agentes_in_rebus: 25 },
      icon: Eye,
      difficulty: 'Hard'
    }
  ],
  scrinium_barbarorum: [
    {
      id: 'scrinium_decode',
      title: 'Decode Xeno Transmission',
      description: 'Analyze alien communications intercepted at the frontier.',
      required_standing: 30,
      rewards: { credits: 1100, intel: 25, faction_scrinium_barbarorum: 30 },
      icon: Sparkles,
      difficulty: 'Hard'
    }
  ]
};

const difficultyColors = {
  Easy: 'text-green-400 border-green-500/30',
  Medium: 'text-amber-400 border-amber-500/30',
  Hard: 'text-red-400 border-red-500/30'
};

export default function FactionMissionsPanel({ 
  factionRelations = {}, 
  onAcceptMission,
  completedMissions = []
}) {
  const availableMissions = [];
  
  Object.entries(factionRelations).forEach(([factionKey, standing]) => {
    const missions = factionMissions[factionKey] || [];
    const tier = getReputationTier(standing);
    
    missions.forEach(mission => {
      if (!completedMissions.includes(mission.id)) {
        // Hard missions require Honored standing or higher
        const canAccess = mission.difficulty === 'Hard' 
          ? canAccessFactionContent(standing, 'HONORED')
          : standing >= mission.required_standing;
        
        availableMissions.push({
          ...mission,
          faction: factionKey,
          isUnlocked: canAccess,
          reputationTier: tier.label
        });
      }
    });
  });
  
  // Sort by unlocked first, then by difficulty
  availableMissions.sort((a, b) => {
    if (a.isUnlocked !== b.isUnlocked) return b.isUnlocked ? 1 : -1;
    return a.required_standing - b.required_standing;
  });
  
  if (availableMissions.length === 0) {
    return (
      <div className="bg-slate-900/80 rounded-xl border border-amber-900/30 p-4 text-center">
        <p className="text-sm text-gray-500">No faction missions available</p>
      </div>
    );
  }
  
  return (
    <div className="bg-slate-900/80 rounded-xl border border-amber-900/30 p-4">
      <h3 className="text-amber-400 font-semibold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
        <Scroll className="w-4 h-4" />
        Faction Contracts
      </h3>
      
      <div className="space-y-3">
        {availableMissions.slice(0, 4).map((mission, index) => {
          const Icon = mission.icon;
          
          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-lg border ${
                mission.isUnlocked 
                  ? 'bg-slate-800/50 border-slate-700/50 hover:border-amber-500/50 cursor-pointer'
                  : 'bg-slate-800/30 border-slate-700/30 opacity-60'
              } transition-all`}
              onClick={() => mission.isUnlocked && onAcceptMission && onAcceptMission(mission)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/30 flex-shrink-0">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-semibold text-gray-200">{mission.title}</h4>
                    {!mission.isUnlocked && <Lock className="w-4 h-4 text-red-400" />}
                  </div>
                  
                  <p className="text-xs text-gray-400 mb-2">{mission.description}</p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={`text-[10px] ${difficultyColors[mission.difficulty]}`}>
                      {mission.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] text-cyan-400 border-cyan-500/30">
                      {mission.faction.replace('_', ' ')}
                    </Badge>
                    {!mission.isUnlocked && (
                      <span className="text-[10px] text-red-400">
                        Requires {mission.required_standing} standing
                      </span>
                    )}
                  </div>
                  
                  {mission.isUnlocked && (
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-amber-400">
                        +{mission.rewards.credits}₡ +{mission.rewards.faction_ecclesiarchy || mission.rewards.faction_praetorians || mission.rewards.faction_varangians || mission.rewards.faction_merchant_houses || mission.rewards.faction_agentes_in_rebus || mission.rewards.faction_scrinium_barbarorum} standing
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}