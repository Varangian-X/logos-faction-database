import React, { useState, useEffect } from 'react';
import { useGameState, DiplomaticRelation, DiplomaticAction, EspionageAgent, EspionageOperation } from '@/contexts/GameStateContext';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Shield, 
  Eye, 
  Swords, 
  Globe, 
  Terminal, 
  Activity,
  Users,
  Target,
  ScrollText,
  ArrowLeft,
  Handshake,
  AlertTriangle,
  UserX,
  Send,
  Crosshair,
  Skull,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FactionCommand = () => {
  const [, setLocation] = useLocation();
  const { 
    gameState, 
    updateDiplomaticRelation, 
    executeDiplomaticAction,
    deployAgent,
    recallAgent,
    processOperations,
    logResourceChange
  } = useGameState();
  
  const [activeTab, setActiveTab] = useState('diplomacy');
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "> FACTION COMMAND INITIALIZED...",
    "> SECURE CHANNEL ESTABLISHED",
    "> CLEARANCE: VERMILION",
    "> AWAITING DIRECTIVES..."
  ]);
  const [commandInput, setCommandInput] = useState('');

  // Process operations on turn change
  useEffect(() => {
    processOperations();
  }, [gameState.turn, processOperations]);

  const addToLog = (text: string) => {
    setTerminalOutput(prev => [...prev, text]);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    addToLog(`> ${commandInput}`);
    
    const cmd = commandInput.toLowerCase();
    if (cmd.includes('status')) {
      addToLog(`DIPLOMATIC INFLUENCE: ${gameState.diplomacy.influence}`);
      addToLog(`ACTIVE AGENTS: ${gameState.espionage.agents.filter(a => a.status === 'Available').length}/${gameState.espionage.agents.length}`);
      addToLog(`NETWORK STRENGTH: ${gameState.espionage.networkStrength}%`);
    } else if (cmd.includes('help')) {
      addToLog("COMMANDS: STATUS, SCAN [FACTION], DEPLOY, RECALL");
    } else {
      addToLog("PROCESSING DIRECTIVE...");
    }

    setCommandInput('');
  };

  const getStatusColor = (status: DiplomaticRelation['status']) => {
    switch (status) {
      case 'Allied': return 'text-green-400 border-green-400';
      case 'Friendly': return 'text-cyan-400 border-cyan-400';
      case 'Neutral': return 'text-gray-400 border-gray-400';
      case 'Hostile': return 'text-orange-400 border-orange-400';
      case 'War': return 'text-red-500 border-red-500';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStandingColor = (standing: number) => {
    if (standing >= 50) return 'bg-green-500';
    if (standing >= 0) return 'bg-cyan-500';
    if (standing >= -50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handleDiplomaticAction = (type: DiplomaticAction['type'], targetFaction: string) => {
    const costs: Record<string, { credits: number; influence?: number }> = {
      'embassy': { credits: 200, influence: 10 },
      'trade_deal': { credits: 500, influence: 15 },
      'alliance': { credits: 1000, influence: 30 },
      'denounce': { credits: 100 },
      'declare_war': { credits: 0 },
      'peace_offer': { credits: 300, influence: 20 },
    };

    const action: DiplomaticAction = {
      id: `action-${Date.now()}`,
      type,
      targetFaction,
      cost: costs[type],
      effects: [],
    };

    const success = executeDiplomaticAction(action);
    if (success) {
      addToLog(`> DIPLOMATIC ACTION: ${type.toUpperCase()} - ${targetFaction}`);
      addToLog(`> COST: ${action.cost.credits}₵ ${action.cost.influence ? `| ${action.cost.influence} INFLUENCE` : ''}`);
    }
  };

  const handleDeployAgent = (agentId: string, operationType: EspionageOperation['type'], targetFaction: string) => {
    const operationCosts: Record<string, { credits: number; stress?: number; duration: number; risk: number }> = {
      'infiltrate': { credits: 300, duration: 3, risk: 30 },
      'sabotage': { credits: 500, stress: 5, duration: 2, risk: 50 },
      'steal_tech': { credits: 400, duration: 4, risk: 40 },
      'assassinate': { credits: 800, stress: 15, duration: 1, risk: 70 },
      'counter_intel': { credits: 200, duration: 5, risk: 20 },
      'propaganda': { credits: 250, stress: 3, duration: 3, risk: 25 },
    };

    const config = operationCosts[operationType];
    const success = deployAgent(agentId, {
      type: operationType,
      targetFaction,
      cost: { credits: config.credits, stress: config.stress },
      risk: config.risk,
      duration: config.duration,
    });

    if (success) {
      const agent = gameState.espionage.agents.find(a => a.id === agentId);
      addToLog(`> AGENT ${agent?.codename} DEPLOYED`);
      addToLog(`> MISSION: ${operationType.toUpperCase()}`);
      addToLog(`> TARGET: ${targetFaction}`);
      addToLog(`> ESTIMATED DURATION: ${config.duration} CYCLES`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 p-6 font-mono relative overflow-hidden">
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10" 
           style={{ 
             backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%)',
             backgroundSize: '100% 4px'
           }}>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-yellow-500/30 pb-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-yellow-400 hover:bg-yellow-950/30"
            onClick={() => setLocation('/game')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-yellow-500 tracking-widest flex items-center gap-3">
              <Globe className="h-7 w-7" />
              FACTION COMMAND
            </h1>
            <p className="text-cyan-500 text-xs tracking-[0.2em] mt-1">DIPLOMACY // ESPIONAGE // COVERT OPS</p>
          </div>
        </div>
        <div className="text-right flex items-center gap-6">
          <div className="text-xs">
            <div className="text-gray-500">INFLUENCE</div>
            <div className="text-cyan-400 font-bold">{gameState.diplomacy.influence}</div>
          </div>
          <div className="text-xs">
            <div className="text-gray-500">NETWORK</div>
            <div className="text-purple-400 font-bold">{gameState.espionage.networkStrength}%</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white">{gameState.turn} <span className="text-xs text-gray-500">CYCLE</span></div>
            <div className="text-xs text-red-500 animate-pulse">VERMILION CLEARANCE</div>
          </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="relative z-10">
        <TabsList className="bg-black/50 border border-gray-700 mb-6">
          <TabsTrigger value="diplomacy" className="data-[state=active]:bg-cyan-900/50 data-[state=active]:text-cyan-400">
            <Handshake className="w-4 h-4 mr-2" /> Diplomacy
          </TabsTrigger>
          <TabsTrigger value="espionage" className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-400">
            <Eye className="w-4 h-4 mr-2" /> Espionage
          </TabsTrigger>
          <TabsTrigger value="operations" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-red-400">
            <Target className="w-4 h-4 mr-2" /> Active Ops
          </TabsTrigger>
        </TabsList>

        {/* DIPLOMACY TAB */}
        <TabsContent value="diplomacy">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Faction Relations */}
            <div className="lg:col-span-5">
              <Card className="bg-[#151e32]/80 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-cyan-500 text-sm tracking-widest flex items-center gap-2">
                    <Users className="h-4 w-4" /> FACTION RELATIONS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {gameState.diplomacy.relations.map(relation => (
                    <motion.div 
                      key={relation.factionId}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedFaction(relation.factionId)}
                      className={`p-3 rounded border cursor-pointer transition-all ${
                        selectedFaction === relation.factionId 
                          ? 'border-cyan-500 bg-cyan-500/10' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-200">{relation.factionName}</span>
                        <Badge variant="outline" className={getStatusColor(relation.status)}>
                          {relation.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Standing</span>
                          <span className={relation.standing >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {relation.standing > 0 ? '+' : ''}{relation.standing}
                          </span>
                        </div>
                        <Progress 
                          value={(relation.standing + 100) / 2} 
                          className="h-1.5 bg-gray-800" 
                          indicatorClassName={getStandingColor(relation.standing)} 
                        />
                      </div>
                      {relation.treaties.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {relation.treaties.map(treaty => (
                            <Badge key={treaty} variant="secondary" className="text-[10px] bg-gray-800">
                              {treaty.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Diplomatic Actions */}
            <div className="lg:col-span-4">
              <Card className="bg-[#151e32]/80 border-gray-700 h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-yellow-500 text-sm tracking-widest flex items-center gap-2">
                    <ScrollText className="h-4 w-4" /> DIPLOMATIC ACTIONS
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {selectedFaction 
                      ? `Actions for ${gameState.diplomacy.relations.find(r => r.factionId === selectedFaction)?.factionName}`
                      : 'Select a faction to view actions'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedFaction ? (
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10"
                        onClick={() => handleDiplomaticAction('embassy', selectedFaction)}
                      >
                        <Send className="w-4 h-4 mr-2" /> Establish Embassy (200₵)
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-green-400 border-green-400/30 hover:bg-green-400/10"
                        onClick={() => handleDiplomaticAction('trade_deal', selectedFaction)}
                      >
                        <Handshake className="w-4 h-4 mr-2" /> Propose Trade Deal (500₵)
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-blue-400 border-blue-400/30 hover:bg-blue-400/10"
                        onClick={() => handleDiplomaticAction('alliance', selectedFaction)}
                      >
                        <Shield className="w-4 h-4 mr-2" /> Form Alliance (1000₵)
                      </Button>
                      <Separator className="my-3 bg-gray-700" />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-orange-400 border-orange-400/30 hover:bg-orange-400/10"
                        onClick={() => handleDiplomaticAction('denounce', selectedFaction)}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" /> Public Denouncement (100₵)
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-red-500 border-red-500/30 hover:bg-red-500/10"
                        onClick={() => handleDiplomaticAction('declare_war', selectedFaction)}
                      >
                        <Swords className="w-4 h-4 mr-2" /> Declare War (0₵)
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Select a faction to view available diplomatic actions</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Terminal */}
            <div className="lg:col-span-3">
              <Card className="bg-[#0a0f14] border-gray-700 h-full flex flex-col">
                <CardHeader className="pb-2 border-b border-gray-800">
                  <CardTitle className="text-red-500 text-sm tracking-widest flex items-center gap-2">
                    <Terminal className="h-4 w-4" /> COMMAND LINE
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 flex flex-col">
                  <ScrollArea className="flex-1 p-4 font-mono text-xs max-h-[300px]">
                    <div className="space-y-1">
                      {terminalOutput.slice(-20).map((line, i) => (
                        <div key={i} className={line.startsWith('>') ? 'text-green-500' : 'text-gray-400'}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <div className="p-3 border-t border-gray-800 bg-black">
                    <form onSubmit={handleCommandSubmit} className="flex gap-2">
                      <input 
                        type="text" 
                        value={commandInput}
                        onChange={(e) => setCommandInput(e.target.value)}
                        placeholder="DIRECTIVE..." 
                        className="flex-1 bg-gray-900 border border-gray-700 text-white text-xs p-2 focus:outline-none focus:border-yellow-500"
                      />
                      <Button type="submit" size="sm" className="bg-gray-800 hover:bg-gray-700">
                        EXEC
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ESPIONAGE TAB */}
        <TabsContent value="espionage">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Agent Roster */}
            <div className="lg:col-span-5">
              <Card className="bg-[#151e32]/80 border-purple-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-purple-400 text-sm tracking-widest flex items-center gap-2">
                    <Eye className="h-4 w-4" /> AGENT ROSTER
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {gameState.espionage.agents.map(agent => (
                    <motion.div 
                      key={agent.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedAgent(agent.id)}
                      className={`p-3 rounded border cursor-pointer transition-all ${
                        selectedAgent === agent.id 
                          ? 'border-purple-500 bg-purple-500/10' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-bold text-gray-200 text-sm">{agent.codename}</span>
                          <span className="text-gray-500 text-xs ml-2">({agent.name})</span>
                        </div>
                        <Badge variant="outline" className={
                          agent.status === 'Available' ? 'text-green-400 border-green-400' :
                          agent.status === 'Deployed' ? 'text-yellow-400 border-yellow-400' :
                          agent.status === 'Compromised' ? 'text-red-400 border-red-400' :
                          'text-gray-400 border-gray-400'
                        }>
                          {agent.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Skill</span>
                          <Progress value={agent.skill} className="h-1 bg-gray-800 mt-1" indicatorClassName="bg-purple-500" />
                        </div>
                        <div>
                          <span className="text-gray-500">Loyalty</span>
                          <Progress value={agent.loyalty} className="h-1 bg-gray-800 mt-1" indicatorClassName="bg-cyan-500" />
                        </div>
                      </div>
                      {agent.mission && (
                        <div className="mt-2 text-xs text-yellow-400">
                          Mission: {agent.mission}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Mission Planning */}
            <div className="lg:col-span-4">
              <Card className="bg-[#151e32]/80 border-gray-700 h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-red-400 text-sm tracking-widest flex items-center gap-2">
                    <Crosshair className="h-4 w-4" /> MISSION PLANNING
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {selectedAgent 
                      ? `Deploy ${gameState.espionage.agents.find(a => a.id === selectedAgent)?.codename}`
                      : 'Select an available agent'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedAgent && gameState.espionage.agents.find(a => a.id === selectedAgent)?.status === 'Available' ? (
                    <div className="space-y-2">
                      <div className="text-xs text-gray-400 mb-3">Select target faction:</div>
                      {gameState.diplomacy.relations.map(rel => (
                        <div key={rel.factionId} className="space-y-1 mb-3">
                          <div className="text-xs text-gray-300 font-bold">{rel.factionName}</div>
                          <div className="flex flex-wrap gap-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-[10px] h-7 text-purple-400 border-purple-400/30"
                              onClick={() => handleDeployAgent(selectedAgent, 'infiltrate', rel.factionId)}
                            >
                              <Eye className="w-3 h-3 mr-1" /> Infiltrate
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-[10px] h-7 text-orange-400 border-orange-400/30"
                              onClick={() => handleDeployAgent(selectedAgent, 'sabotage', rel.factionId)}
                            >
                              <AlertTriangle className="w-3 h-3 mr-1" /> Sabotage
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-[10px] h-7 text-cyan-400 border-cyan-400/30"
                              onClick={() => handleDeployAgent(selectedAgent, 'steal_tech', rel.factionId)}
                            >
                              <Radio className="w-3 h-3 mr-1" /> Steal Tech
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-[10px] h-7 text-red-500 border-red-500/30"
                              onClick={() => handleDeployAgent(selectedAgent, 'assassinate', rel.factionId)}
                            >
                              <Skull className="w-3 h-3 mr-1" /> Assassinate
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : selectedAgent ? (
                    <div className="text-center text-gray-500 py-8">
                      <UserX className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Agent is not available for deployment</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4 text-yellow-400"
                        onClick={() => recallAgent(selectedAgent)}
                      >
                        Recall Agent
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Eye className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Select an agent to plan operations</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Network Status */}
            <div className="lg:col-span-3">
              <Card className="bg-[#0a0f14] border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-cyan-400 text-sm tracking-widest flex items-center gap-2">
                    <Activity className="h-4 w-4" /> NETWORK STATUS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Network Strength</span>
                      <span className="text-purple-400">{gameState.espionage.networkStrength}%</span>
                    </div>
                    <Progress value={gameState.espionage.networkStrength} className="h-2 bg-gray-800" indicatorClassName="bg-purple-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Counter-Intel</span>
                      <span className="text-cyan-400">{gameState.espionage.counterIntelLevel}%</span>
                    </div>
                    <Progress value={gameState.espionage.counterIntelLevel} className="h-2 bg-gray-800" indicatorClassName="bg-cyan-500" />
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Available Agents</span>
                      <span className="text-green-400">{gameState.espionage.agents.filter(a => a.status === 'Available').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Deployed Agents</span>
                      <span className="text-yellow-400">{gameState.espionage.agents.filter(a => a.status === 'Deployed').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Active Operations</span>
                      <span className="text-red-400">{gameState.espionage.operations.filter(o => o.status === 'Active').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ACTIVE OPERATIONS TAB */}
        <TabsContent value="operations">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Operations */}
            <Card className="bg-[#151e32]/80 border-red-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-400 text-sm tracking-widest flex items-center gap-2">
                  <Target className="h-4 w-4" /> ACTIVE OPERATIONS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {gameState.espionage.operations.filter(op => op.status === 'Active').length > 0 ? (
                    <div className="space-y-3">
                      {gameState.espionage.operations.filter(op => op.status === 'Active').map(op => {
                        const agent = gameState.espionage.agents.find(a => a.id === op.agentId);
                        return (
                          <div key={op.id} className="p-3 rounded border border-gray-700 bg-black/30">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-yellow-400 uppercase text-sm">{op.type.replace('_', ' ')}</span>
                              <Badge variant="outline" className="text-red-400 border-red-400">
                                {op.risk}% Risk
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-400 mb-2">
                              Agent: <span className="text-purple-400">{agent?.codename}</span> | 
                              Target: <span className="text-cyan-400">{op.targetFaction}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Progress</span>
                                <span>{Math.round(op.progress)}%</span>
                              </div>
                              <Progress value={op.progress} className="h-1.5 bg-gray-800" indicatorClassName="bg-yellow-500" />
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              ETA: {op.duration - (gameState.turn - op.startTurn)} cycles remaining
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <ShieldCheck className="w-16 h-16 mx-auto mb-3 opacity-30" />
                      <p>No active operations</p>
                      <p className="text-xs mt-2">Deploy agents from the Espionage tab</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Operation History */}
            <Card className="bg-[#151e32]/80 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-400 text-sm tracking-widest flex items-center gap-2">
                  <ScrollText className="h-4 w-4" /> OPERATION HISTORY
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {gameState.espionage.operations.filter(op => op.status !== 'Active' && op.status !== 'Planning').length > 0 ? (
                    <div className="space-y-2">
                      {gameState.espionage.operations
                        .filter(op => op.status !== 'Active' && op.status !== 'Planning')
                        .slice(-10)
                        .reverse()
                        .map(op => {
                          const agent = gameState.espionage.agents.find(a => a.id === op.agentId);
                          return (
                            <div key={op.id} className={`p-2 rounded border text-xs ${
                              op.status === 'Complete' ? 'border-green-500/30 bg-green-500/5' :
                              op.status === 'Failed' ? 'border-red-500/30 bg-red-500/5' :
                              'border-gray-700'
                            }`}>
                              <div className="flex justify-between">
                                <span className="uppercase">{op.type.replace('_', ' ')}</span>
                                <Badge variant="outline" className={
                                  op.status === 'Complete' ? 'text-green-400 border-green-400' :
                                  'text-red-400 border-red-400'
                                }>
                                  {op.status}
                                </Badge>
                              </div>
                              <div className="text-gray-500 mt-1">
                                {agent?.codename} → {op.targetFaction}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <ScrollText className="w-16 h-16 mx-auto mb-3 opacity-30" />
                      <p>No operation history</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FactionCommand;
