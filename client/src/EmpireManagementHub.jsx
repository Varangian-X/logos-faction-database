import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Crown, Globe, FileText, TrendingUp, AlertCircle, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ColonyManagementUI from './ColonyManagementUI';
import { EMPIRE_POLICIES, canEnactPolicy, calculatePolicyEffects } from './EmpirePolicySystem';

export default function EmpireManagementHub({ 
  gameState, 
  colonies = [],
  onBuildStructure,
  onEnactPolicy,
  onRepealPolicy,
  onColonizePlanet,
  isProcessing 
}) {
  const [selectedColony, setSelectedColony] = useState(colonies[0]);
  const [selectedTab, setSelectedTab] = useState('colonies');

  const empirePolicies = gameState.empire_policies || { active_policies: [], policy_slots: 3 };
  const policyEffects = calculatePolicyEffects(gameState);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Empire Header */}
        <Card className="bg-slate-900/90 border-amber-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-amber-400 flex items-center gap-2">
                <Crown className="w-6 h-6" />
                Empire Management - House {gameState.house_name}
              </CardTitle>
              <div className="flex gap-2">
                <Badge className="bg-cyan-500/20 text-cyan-400">
                  {colonies.length} Colonies
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400">
                  {empirePolicies.active_policies.length}/{empirePolicies.policy_slots} Policies
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <EmpireStatCard 
                label="Total Population" 
                value={colonies.reduce((sum, c) => sum + c.population.current, 0).toLocaleString()} 
                icon={Globe}
              />
              <EmpireStatCard 
                label="Total Production" 
                value={colonies.reduce((sum, c) => sum + c.resources.production.output, 0)} 
                icon={TrendingUp}
              />
              <EmpireStatCard 
                label="Total Research" 
                value={colonies.reduce((sum, c) => sum + c.resources.research.output, 0)} 
                icon={TrendingUp}
              />
              <EmpireStatCard 
                label="Credits/Turn" 
                value={colonies.reduce((sum, c) => sum + c.resources.credits_income, 0) - policyEffects.total_upkeep}
                icon={TrendingUp}
                suffix="₡"
              />
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-2 bg-slate-800">
            <TabsTrigger value="colonies">
              <Globe className="w-4 h-4 mr-2" />
              Colonies
            </TabsTrigger>
            <TabsTrigger value="policies">
              <FileText className="w-4 h-4 mr-2" />
              Empire Policies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colonies">
            <div className="grid grid-cols-3 gap-4">
              {/* Colony List */}
              <Card className="bg-slate-900/90 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-sm text-cyan-400">Your Colonies</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-2">
                      {colonies.map(colony => (
                        <ColonyListItem
                          key={colony.id}
                          colony={colony}
                          isSelected={selectedColony?.id === colony.id}
                          onSelect={() => setSelectedColony(colony)}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Colony Details */}
              <div className="col-span-2">
                {selectedColony ? (
                  <ColonyManagementUI
                    colony={selectedColony}
                    gameState={gameState}
                    onBuildStructure={(structureId) => onBuildStructure(selectedColony.id, structureId)}
                    isProcessing={isProcessing}
                  />
                ) : (
                  <Card className="bg-slate-900/90 border-slate-700">
                    <CardContent className="flex items-center justify-center h-96">
                      <p className="text-gray-500">Select a colony to manage</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="policies">
            <div className="grid grid-cols-2 gap-4">
              {/* Active Policies */}
              <Card className="bg-slate-900/90 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Active Policies ({empirePolicies.active_policies.length}/{empirePolicies.policy_slots})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {empirePolicies.active_policies.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-8">No policies enacted</p>
                  ) : (
                    <div className="space-y-2">
                      {empirePolicies.active_policies.map(policyId => (
                        <ActivePolicyCard
                          key={policyId}
                          policy={EMPIRE_POLICIES[policyId]}
                          onRepeal={() => onRepealPolicy(policyId)}
                          isProcessing={isProcessing}
                        />
                      ))}
                    </div>
                  )}

                  {/* Policy Effects Summary */}
                  {policyEffects.total_upkeep > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <h5 className="text-xs font-semibold text-gray-400 mb-2">Combined Effects:</h5>
                      <div className="space-y-1 text-xs">
                        {Object.entries(policyEffects).map(([key, value]) => {
                          if (key === 'total_upkeep' || value === 0) return null;
                          return (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-gray-500">{key.replace(/_/g, ' ')}:</span>
                              <span className={value > 0 ? 'text-green-400' : 'text-red-400'}>
                                {value > 0 ? '+' : ''}{value}{key.includes('modifier') ? '%' : ''}
                              </span>
                            </div>
                          );
                        })}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                          <span className="text-gray-400 font-semibold">Total Upkeep:</span>
                          <span className="text-red-400 font-semibold">{policyEffects.total_upkeep}₡/turn</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Available Policies */}
              <Card className="bg-slate-900/90 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-400">Available Policies</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-2">
                      {Object.values(EMPIRE_POLICIES).map(policy => {
                        const check = canEnactPolicy(policy.id, gameState);
                        const isActive = empirePolicies.active_policies.includes(policy.id);
                        
                        if (isActive) return null;
                        
                        return (
                          <PolicyOption
                            key={policy.id}
                            policy={policy}
                            canEnact={check.can_enact}
                            reason={check.reason}
                            onEnact={() => onEnactPolicy(policy.id)}
                            isProcessing={isProcessing}
                          />
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EmpireStatCard({ label, value, icon: Icon, suffix = '' }) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-cyan-400" />
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <p className="text-lg font-bold text-gray-200">{value}{suffix}</p>
    </div>
  );
}

function ColonyListItem({ colony, isSelected, onSelect }) {
  return (
    <motion.button
      onClick={onSelect}
      className={cn(
        'w-full p-3 rounded-lg border-2 text-left transition-all',
        isSelected ? 'bg-cyan-900/30 border-cyan-500' : 'bg-slate-800/50 border-slate-700 hover:border-cyan-500/50'
      )}
      whileHover={{ x: 2 }}
    >
      <h5 className="text-sm font-bold text-gray-200 mb-1">{colony.name}</h5>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>{colony.type}</span>
        <span>•</span>
        <span>{colony.population.current.toLocaleString()} pop</span>
      </div>
    </motion.button>
  );
}

function ActivePolicyCard({ policy, onRepeal, isProcessing }) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/30">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h5 className="text-sm font-bold text-purple-300">{policy.name}</h5>
          <Badge className="text-[9px] bg-slate-700 text-gray-400 mt-1">{policy.category}</Badge>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onRepeal}
          disabled={isProcessing}
          className="h-6 text-xs text-red-400 hover:text-red-300"
        >
          Repeal
        </Button>
      </div>
      <p className="text-xs text-gray-400">{policy.description}</p>
    </div>
  );
}

function PolicyOption({ policy, canEnact, reason, onEnact, isProcessing }) {
  return (
    <motion.button
      onClick={canEnact ? onEnact : undefined}
      disabled={!canEnact || isProcessing}
      className={cn(
        'w-full p-3 rounded-lg border-2 text-left transition-all',
        canEnact 
          ? 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50' 
          : 'bg-slate-800/30 border-slate-800 opacity-50'
      )}
      whileHover={canEnact ? { x: 4 } : {}}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h5 className="text-sm font-bold text-gray-200">{policy.name}</h5>
          <Badge className="text-[9px] bg-slate-700 text-gray-400 mt-1">{policy.category}</Badge>
        </div>
        <Badge className="text-[9px] bg-red-500/20 text-red-400">
          {policy.cost_per_turn}₡/turn
        </Badge>
      </div>

      <p className="text-xs text-gray-400 mb-2">{policy.description}</p>

      {!canEnact && (
        <div className="flex items-center gap-1 text-xs text-red-400">
          <AlertCircle className="w-3 h-3" />
          {reason}
        </div>
      )}
    </motion.button>
  );
}