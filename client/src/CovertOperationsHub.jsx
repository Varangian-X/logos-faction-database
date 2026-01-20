import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, Target, Bomb, Users, FileText, Zap, 
  AlertTriangle, Lock, CheckCircle2, TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

const COVERT_OPERATIONS = {
  intelligence_gathering: {
    id: 'intelligence_gathering',
    name: 'Intelligence Gathering',
    icon: Eye,
    description: 'Deploy agents to uncover faction secrets, operations, and weaknesses',
    duration: 2,
    cost: { intel: 15, credits: 300 },
    requirements: { espionage: 2 },
    effects: {
      reveal_operations: true,
      intel_gain: 30,
      faction_standing: -10
    },
    success_base: 70,
    detection_risk: 20
  },
  sabotage_operations: {
    id: 'sabotage_operations',
    name: 'Sabotage Operations',
    icon: Bomb,
    description: 'Disrupt faction operations, destroy resources, and delay their plans',
    duration: 3,
    cost: { intel: 25, credits: 500 },
    requirements: { espionage: 4, hacking: 3 },
    effects: {
      power_damage: 20,
      resource_damage: 800,
      faction_standing: -30,
      reputation: 5
    },
    success_base: 55,
    detection_risk: 40
  },
  political_manipulation: {
    id: 'political_manipulation',
    name: 'Political Manipulation',
    icon: Users,
    description: 'Influence faction leadership, sow internal discord, and manipulate policies',
    duration: 4,
    cost: { intel: 30, influence: 20, credits: 700 },
    requirements: { espionage: 5, negotiation: 4 },
    effects: {
      morale_damage: 25,
      faction_standing: -20,
      influence_gain: 15,
      create_internal_conflict: true
    },
    success_base: 50,
    detection_risk: 35
  },
  propaganda_campaign: {
    id: 'propaganda_campaign',
    name: 'Propaganda Campaign',
    icon: FileText,
    description: 'Launch disinformation campaigns to damage faction reputation',
    duration: 2,
    cost: { intel: 10, credits: 400 },
    requirements: { negotiation: 3 },
    effects: {
      reputation_damage: 20,
      faction_standing: -15,
      reputation_gain: 10
    },
    success_base: 65,
    detection_risk: 25
  },
  asset_recruitment: {
    id: 'asset_recruitment',
    name: 'Asset Recruitment',
    icon: Users,
    description: 'Recruit faction members as informants and double agents',
    duration: 3,
    cost: { intel: 20, credits: 600 },
    requirements: { espionage: 3, negotiation: 3 },
    effects: {
      passive_intel: 10,
      faction_standing: -15,
      duration: 10
    },
    success_base: 60,
    detection_risk: 30
  },
  cyber_warfare: {
    id: 'cyber_warfare',
    name: 'Cyber Warfare',
    icon: Zap,
    description: 'Hack faction systems, steal data, and plant backdoors',
    duration: 2,
    cost: { intel: 20, credits: 500 },
    requirements: { hacking: 5, espionage: 2 },
    effects: {
      tech_advantage: true,
      intel_gain: 40,
      faction_standing: -25,
      credits_gain: 500
    },
    success_base: 60,
    detection_risk: 45
  },
  assassination: {
    id: 'assassination',
    name: 'Targeted Assassination',
    icon: Target,
    description: 'Eliminate key faction leaders or operatives (HIGH RISK)',
    duration: 4,
    cost: { intel: 50, credits: 1500 },
    requirements: { espionage: 7, combat: 5 },
    effects: {
      power_damage: 40,
      morale_damage: 35,
      faction_standing: -70,
      reputation: -20,
      triggers_investigation: true
    },
    success_base: 40,
    detection_risk: 70
  },
  economic_disruption: {
    id: 'economic_disruption',
    name: 'Economic Disruption',
    icon: TrendingDown,
    description: 'Manipulate markets and trade routes to damage faction economy',
    duration: 3,
    cost: { intel: 25, influence: 15, credits: 600 },
    requirements: { espionage: 4, negotiation: 4 },
    effects: {
      resource_damage: 1200,
      faction_standing: -25,
      credits_gain: 800
    },
    success_base: 55,
    detection_risk: 35
  }
};

export default function CovertOperationsHub({
  gameState,
  selectedFaction,
  activeOperations = [],
  onLaunchOperation,
  onCancelOperation,
  isProcessing
}) {
  const [selectedOperation, setSelectedOperation] = useState(null);

  const playerSkills = gameState.skills || {};
  const playerResources = {
    intel: gameState.intel || 0,
    credits: gameState.credits || 0,
    influence: gameState.influence || 0
  };

  const canLaunchOperation = (operation) => {
    // Check skill requirements
    const meetsSkills = Object.entries(operation.requirements).every(([skill, level]) => {
      return (playerSkills[skill]?.level || 0) >= level;
    });

    // Check resource costs
    const canAfford = Object.entries(operation.cost).every(([resource, amount]) => {
      return (playerResources[resource] || 0) >= amount;
    });

    return meetsSkills && canAfford;
  };

  const calculateSuccessChance = (operation) => {
    let chance = operation.success_base;
    
    // Skill bonuses
    if (operation.requirements.espionage) {
      const espionageLevel = playerSkills.espionage?.level || 0;
      chance += espionageLevel * 3;
    }
    if (operation.requirements.hacking) {
      const hackingLevel = playerSkills.hacking?.level || 0;
      chance += hackingLevel * 2;
    }
    
    return Math.min(95, Math.max(10, chance));
  };

  return (
    <Card className="bg-slate-900/80 border-red-900/30">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Covert Operations
        </CardTitle>
        {selectedFaction && (
          <p className="text-xs text-gray-400 mt-1">
            Target: {selectedFaction.name}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {/* Active Operations */}
        {activeOperations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-red-300 uppercase mb-2">
              Active Operations
            </h3>
            <div className="space-y-2">
              {activeOperations.map(op => (
                <ActiveOperationCard
                  key={op.id}
                  operation={op}
                  onCancel={() => onCancelOperation(op.id)}
                  isProcessing={isProcessing}
                />
              ))}
            </div>
          </div>
        )}

        {/* Available Operations */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-red-300 uppercase mb-2">
            Available Operations
          </h3>
          {!selectedFaction ? (
            <div className="text-center py-8 bg-slate-800/50 rounded-lg border border-slate-700">
              <Target className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Select a target faction first</p>
            </div>
          ) : (
            Object.values(COVERT_OPERATIONS).map(operation => {
              const canLaunch = canLaunchOperation(operation);
              const successChance = calculateSuccessChance(operation);
              const Icon = operation.icon;

              return (
                <motion.div
                  key={operation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-3 rounded-lg border transition-all",
                    canLaunch 
                      ? "bg-slate-800/50 border-slate-700 hover:border-red-500/50 cursor-pointer"
                      : "bg-slate-800/30 border-red-500/20 opacity-60"
                  )}
                  onClick={() => canLaunch && setSelectedOperation(operation)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-200">{operation.name}</h4>
                        <p className="text-xs text-gray-400 mt-1">{operation.description}</p>
                      </div>
                    </div>
                    {!canLaunch && <Lock className="w-4 h-4 text-red-400" />}
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline" className="text-[9px]">
                      {operation.duration} turns
                    </Badge>
                    <Badge className={cn(
                      "text-[9px]",
                      successChance >= 70 ? "bg-green-500/20 text-green-400" :
                      successChance >= 50 ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    )}>
                      {successChance}% success
                    </Badge>
                    <Badge className="text-[9px] bg-amber-500/20 text-amber-400">
                      {operation.detection_risk}% detection
                    </Badge>
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    Cost: {Object.entries(operation.cost).map(([k, v]) => `${v} ${k}`).join(', ')}
                  </div>

                  {canLaunch && selectedOperation?.id === operation.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-slate-700"
                    >
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLaunchOperation(operation.id, selectedFaction.faction_id);
                          setSelectedOperation(null);
                        }}
                        disabled={isProcessing}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        <Target className="w-3 h-3 mr-1" />
                        Launch Operation
                      </Button>
                    </motion.div>
                  )}

                  {!canLaunch && (
                    <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Requirements not met
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ActiveOperationCard({ operation, onCancel, isProcessing }) {
  const operationData = COVERT_OPERATIONS[operation.operation_id];
  const Icon = operationData?.icon || Eye;
  const progress = ((operationData.duration - operation.turns_remaining) / operationData.duration) * 100;

  return (
    <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/30">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-2 flex-1">
          <Icon className="w-4 h-4 text-red-400 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-200">{operationData?.name}</h4>
            <p className="text-xs text-gray-400">
              Target: {operation.target_faction}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onCancel}
          disabled={isProcessing}
          className="h-6 px-2 text-red-400 hover:text-red-300"
        >
          Cancel
        </Button>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Progress</span>
          <span className="text-red-400">
            Turn {operationData.duration - operation.turns_remaining} / {operationData.duration}
          </span>
        </div>
        <Progress value={progress} className="h-1.5 bg-slate-800" indicatorClassName="bg-red-500" />
      </div>

      <div className="mt-2 flex items-center gap-1 text-xs text-amber-400">
        <AlertTriangle className="w-3 h-3" />
        Detection Risk: {operation.detection_risk}%
      </div>
    </div>
  );
}