import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, MessageSquare, Swords, Search, Eye, Wrench, TrendingUp, Lock, Star, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getMasteryRank, getAvailablePerks } from '@/components/skills/MasteryPerksData';
import PerkSelectionModal from '@/components/skills/PerkSelectionModal';

const skillConfig = {
  hacking: {
    name: 'Hacking',
    icon: Terminal,
    color: 'cyan',
    description: 'Breach systems and manipulate data'
  },
  negotiation: {
    name: 'Negotiation',
    icon: MessageSquare,
    color: 'violet',
    description: 'Influence and persuade others'
  },
  combat: {
    name: 'Combat',
    icon: Swords,
    color: 'red',
    description: 'Direct confrontation and tactics'
  },
  investigation: {
    name: 'Investigation',
    icon: Search,
    color: 'amber',
    description: 'Uncover secrets and analyze clues'
  },
  espionage: {
    name: 'Espionage',
    icon: Eye,
    color: 'emerald',
    description: 'Infiltration and covert operations'
  },
  engineering: {
    name: 'Engineering',
    icon: Wrench,
    color: 'blue',
    description: 'Modify and repair technology'
  }
};

const getXpForLevel = (level) => {
  return Math.floor(100 * Math.pow(1.5, level));
};

const getSkillBonus = (level) => {
  if (level === 0) return 0;
  if (level <= 2) return 10;
  if (level <= 4) return 20;
  if (level <= 6) return 35;
  return 50 + (level - 6) * 10;
};

export default function SkillsPanel({ skills = {}, selectedPerks = {}, onSelectPerk, compact = false }) {
  const [showPerkModal, setShowPerkModal] = useState(null);
  const totalSkillLevel = Object.values(skills).reduce((sum, skill) => sum + (skill?.level || 0), 0);

  if (compact) {
    return (
      <div className="bg-slate-900/80 rounded-xl border border-amber-900/30 p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-amber-400 font-semibold uppercase tracking-wider text-xs flex items-center gap-2">
            <TrendingUp className="w-3 h-3" />
            Skills
          </h3>
          <span className="text-[10px] text-gray-500">
            Total Level: {totalSkillLevel}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(skillConfig).map(([key, config]) => {
            const skill = skills[key] || { level: 0, xp: 0 };
            const Icon = config.icon;
            
            return (
              <div
                key={key}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className={`w-6 h-6 rounded bg-${config.color}-500/10 flex items-center justify-center border border-${config.color}-500/30`}>
                  <Icon className={`w-3 h-3 text-${config.color}-400`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-300 truncate">{config.name}</span>
                    <span className={`text-[10px] font-mono font-bold text-${config.color}-400`}>
                      {skill.level}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 rounded-xl border border-amber-900/30 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-amber-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Specialized Skills
        </h3>
        <span className="text-xs text-gray-500">
          Total Level: {totalSkillLevel}
        </span>
      </div>
      
      <div className="space-y-3">
        {Object.entries(skillConfig).map(([key, config], index) => {
          const skill = skills[key] || { level: 0, xp: 0 };
          const Icon = config.icon;
          const xpRequired = getXpForLevel(skill.level);
          const xpProgress = skill.level === 0 && skill.xp === 0 ? 0 : (skill.xp / xpRequired) * 100;
          const bonus = getSkillBonus(skill.level);
          const masteryRank = getMasteryRank(skill.level);
          const availablePerks = getAvailablePerks(key, skill.level, selectedPerks[key] || []);
          const skillPerks = selectedPerks[key] || [];
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${config.color}-500/10 flex items-center justify-center border border-${config.color}-500/30 flex-shrink-0`}>
                  <Icon className={`w-5 h-5 text-${config.color}-400`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-200 font-medium">{config.name}</span>
                        {skill.level >= 3 && (
                          <Badge className={`text-[8px] bg-${masteryRank.color}-500/20 text-${masteryRank.color}-400 border-${masteryRank.color}-500/30`}>
                            {masteryRank.name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500">{config.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className={`text-lg font-bold font-mono text-${config.color}-400`}>
                        {skill.level}
                      </span>
                      {bonus > 0 && (
                        <p className="text-[9px] text-green-400">+{bonus}% success</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Active Perks */}
                  {skillPerks.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {skillPerks.slice(0, 3).map((perkId, i) => (
                        <Badge key={i} variant="outline" className="text-[8px] text-purple-400 border-purple-500/30">
                          <Zap className="w-2 h-2 mr-1" />
                          Perk {i + 1}
                        </Badge>
                      ))}
                      {skillPerks.length > 3 && (
                        <Badge variant="outline" className="text-[8px] text-gray-500">
                          +{skillPerks.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* Unlock Perk Button */}
                  {availablePerks.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPerkModal(key)}
                      className="h-6 text-[10px] px-2 mb-2 bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      Unlock Perk ({availablePerks.length})
                    </Button>
                  )}
                  
                  {/* XP Progress Bar */}
                  {skill.level > 0 || skill.xp > 0 ? (
                    <div className="space-y-1">
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${xpProgress}%` }}
                          className={`h-full rounded-full bg-gradient-to-r from-${config.color}-500 to-${config.color}-400`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-gray-500">
                          {skill.xp} / {xpRequired} XP
                        </span>
                        {skill.level < 10 && (
                          <span className={`text-${config.color}-400`}>
                            Next: Level {skill.level + 1}
                          </span>
                        )}
                        {skill.level >= 10 && (
                          <span className="text-amber-400 flex items-center gap-1">
                            <Lock className="w-2 h-2" />
                            Max Level
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-600 italic">Untrained</p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Skills Legend */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <p className="text-[10px] text-gray-500 leading-relaxed">
          Skills improve through use. Reach mastery levels to unlock powerful perks that enhance your abilities.
        </p>
      </div>
      
      {/* Perk Selection Modal */}
      <AnimatePresence>
        {showPerkModal && (
          <PerkSelectionModal
            skillName={skillConfig[showPerkModal].name}
            availablePerks={getAvailablePerks(showPerkModal, skills[showPerkModal]?.level || 0, selectedPerks[showPerkModal] || [])}
            selectedPerks={selectedPerks[showPerkModal] || []}
            onSelectPerk={(perk) => {
              onSelectPerk && onSelectPerk(showPerkModal, perk.id);
              setShowPerkModal(null);
            }}
            onClose={() => setShowPerkModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}