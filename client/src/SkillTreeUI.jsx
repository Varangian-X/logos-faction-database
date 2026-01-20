import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, Check, Star, Zap, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SKILL_TREES, canUnlockSkill, findSkillById } from './SkillTreeSystem';

export default function SkillTreeUI({ gameState, onUnlockSkill }) {
  const [selectedTree, setSelectedTree] = useState(Object.keys(SKILL_TREES)[0]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  
  const tree = SKILL_TREES[selectedTree];
  const availablePoints = gameState.skill_points || 0;
  const unlockedSkills = gameState.unlocked_skills || [];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-amber-300">
              <Star className="w-6 h-6" />
              Skill Tree
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Available Points:</span>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-lg px-3">
                {availablePoints}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tree Selection */}
        <div className="space-y-2">
          {Object.entries(SKILL_TREES).map(([key, treeData]) => {
            const unlockedCount = treeData.skills.filter(s => 
              unlockedSkills.includes(s.id)
            ).length;
            
            return (
              <Button
                key={key}
                variant={selectedTree === key ? 'default' : 'outline'}
                className="w-full justify-start h-auto py-3"
                onClick={() => {
                  setSelectedTree(key);
                  setSelectedSkill(null);
                }}
              >
                <div className="flex items-center gap-3 w-full">
                  <span className="text-2xl">{treeData.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">{treeData.name}</p>
                    <p className="text-xs text-gray-500">
                      {unlockedCount}/{treeData.skills.length}
                    </p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Skill Tree Display */}
        <div className="lg:col-span-3">
          <Card className="bg-slate-900/80 border-slate-700/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{tree.icon}</span>
                <div>
                  <CardTitle className="text-xl text-gray-200">{tree.name}</CardTitle>
                  <p className="text-sm text-gray-500">{tree.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[1, 2, 3].map(tier => {
                  const tierSkills = tree.skills.filter(s => s.tier === tier);
                  
                  return (
                    <div key={tier}>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline" className="text-xs">
                          Tier {tier}
                        </Badge>
                        <div className="flex-1 h-px bg-slate-700" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tierSkills.map(skill => {
                          const isUnlocked = unlockedSkills.includes(skill.id);
                          const canUnlock = canUnlockSkill(skill, gameState);
                          const isSelected = selectedSkill?.id === skill.id;
                          
                          return (
                            <SkillNode
                              key={skill.id}
                              skill={skill}
                              isUnlocked={isUnlocked}
                              canUnlock={canUnlock}
                              isSelected={isSelected}
                              onClick={() => setSelectedSkill(skill)}
                              onUnlock={() => onUnlockSkill(skill.id)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Skill Detail Panel */}
      {selectedSkill && (
        <SkillDetailPanel
          skill={selectedSkill}
          isUnlocked={unlockedSkills.includes(selectedSkill.id)}
          canUnlock={canUnlockSkill(selectedSkill, gameState)}
          onUnlock={() => onUnlockSkill(selectedSkill.id)}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </div>
  );
}

function SkillNode({ skill, isUnlocked, canUnlock, isSelected, onClick, onUnlock }) {
  return (
    <motion.div
      whileHover={!isUnlocked ? { scale: 1.02 } : {}}
      whileTap={!isUnlocked ? { scale: 0.98 } : {}}
    >
      <Card
        className={cn(
          "cursor-pointer transition-all relative overflow-hidden",
          isUnlocked && "bg-green-900/20 border-green-500/50",
          canUnlock && !isUnlocked && "bg-amber-900/20 border-amber-500/50 hover:border-amber-500",
          !canUnlock && !isUnlocked && "bg-slate-800/50 border-slate-700/50 opacity-60",
          isSelected && "ring-2 ring-cyan-500"
        )}
        onClick={onClick}
      >
        {isUnlocked && (
          <div className="absolute top-2 right-2">
            <Check className="w-5 h-5 text-green-400" />
          </div>
        )}
        
        {!isUnlocked && !canUnlock && (
          <div className="absolute top-2 right-2">
            <Lock className="w-4 h-4 text-gray-600" />
          </div>
        )}
        
        <CardContent className="p-4">
          <h3 className={cn(
            "font-semibold mb-2",
            isUnlocked ? "text-green-300" : canUnlock ? "text-amber-300" : "text-gray-500"
          )}>
            {skill.name}
          </h3>
          
          <p className="text-xs text-gray-400 mb-3 line-clamp-2">
            {skill.description}
          </p>
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-[10px]">
              Cost: {skill.cost} point{skill.cost > 1 ? 's' : ''}
            </Badge>
            
            {canUnlock && !isUnlocked && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onUnlock();
                }}
                className="h-7 text-xs"
              >
                Unlock
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SkillDetailPanel({ skill, isUnlocked, canUnlock, onUnlock, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 p-6"
    >
      <Card className="max-w-4xl mx-auto bg-slate-900 border-cyan-500/50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-cyan-300 mb-2">{skill.name}</h2>
              <p className="text-gray-400">{skill.description}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bonuses */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Bonuses</h3>
              <div className="space-y-1">
                {Object.entries(skill.bonuses).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span className="text-gray-300">
                      {key.replace(/_/g, ' ')}: +{value}{typeof value === 'number' && value < 10 ? '%' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Unlocks */}
            {skill.unlocks && skill.unlocks.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Unlocks</h3>
                <div className="space-y-1">
                  {skill.unlocks.map(unlock => (
                    <div key={unlock} className="flex items-center gap-2 text-sm">
                      <Star className="w-3 h-3 text-cyan-400" />
                      <span className="text-gray-300">
                        {unlock.replace(/_/g, ' ').replace(/^dialogue /, 'Dialogue: ').replace(/^ability /, 'Ability: ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Prerequisites */}
          {skill.prerequisites.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Prerequisites</h3>
              <div className="flex gap-2">
                {skill.prerequisites.map(prereqId => {
                  const prereq = findSkillById(prereqId);
                  return (
                    <Badge key={prereqId} variant="outline" className="text-xs">
                      {prereq?.name || prereqId}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Action Button */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Cost: {skill.cost} skill point{skill.cost > 1 ? 's' : ''}
            </div>
            
            {isUnlocked ? (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Check className="w-4 h-4 mr-1" />
                Unlocked
              </Badge>
            ) : canUnlock ? (
              <Button onClick={onUnlock} className="bg-amber-600 hover:bg-amber-700">
                <Star className="w-4 h-4 mr-2" />
                Unlock Skill
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Requirements not met</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}