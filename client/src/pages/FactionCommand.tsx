import React, { useState, useEffect } from 'react';
import { useGameState } from '@/contexts/GameStateContext';
import { useLocation } from 'wouter';
import { generateMission } from '@/lib/MissionGenerator';
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
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

// Faction Types
interface FactionStatus {
  id: string;
  name: string;
  status: 'Dominant' | 'Hidden' | 'Combat' | 'Neutral' | 'Ally';
  influence: number;
  color: string;
  description: string;
}

// Sector Types
interface SectorInfo {
  id: string;
  name: string;
  control: string;
  status: string;
  resources: 'High' | 'Medium' | 'Low';
  hazard: number;
}

const FactionCommand = () => {
  const [, setLocation] = useLocation();
  const { gameState } = useGameState();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "> SYSTEM INITIALIZED...",
    "> CONNECTING TO FACTION NET...",
    "> CONNECTION SECURE [VERMILION CLEARANCE]",
    "> WAITING FOR INPUT..."
  ]);
  const [commandInput, setCommandInput] = useState('');
  
  // Mandate Weaver State
  const [targetSystem, setTargetSystem] = useState('New Roma (Throne)');
  const [operationType, setOperationType] = useState('Data Extraction');

  // Mock Faction Data (would come from GameState in full implementation)
  const factions: FactionStatus[] = [
    { 
      id: 'neo-praetorians', 
      name: 'Neo-Praetorians', 
      status: 'Dominant', 
      influence: 85, 
      color: 'bg-yellow-500',
      description: 'The elite guard of the Chrysopolis. Heavily augmented and fanatically loyal.'
    },
    { 
      id: 'agentes', 
      name: 'Agentes en Rebus', 
      status: 'Hidden', 
      influence: 60, 
      color: 'bg-purple-500',
      description: 'The secret police and intelligence network. They see everything.'
    },
    { 
      id: 'varangians', 
      name: 'Neo-Varangians', 
      status: 'Combat', 
      influence: 45, 
      color: 'bg-red-500',
      description: 'Mercenary shock troops from the outer rim. Brutal but effective.'
    },
    { 
      id: 'logothetes', 
      name: 'Logothetes', 
      status: 'Neutral', 
      influence: 70, 
      color: 'bg-blue-500',
      description: 'The bureaucratic class managing the immense complexity of the Imperium.'
    }
  ];

  // Mock Sector Data
  const sectors: Record<string, SectorInfo> = {
    'chrysopolis': { 
      id: 'chrysopolis', 
      name: 'Chrysopolis', 
      control: 'Neo-Praetorians', 
      status: 'Secure', 
      resources: 'High',
      hazard: 10
    },
    'mese': { 
      id: 'mese', 
      name: 'The Mese', 
      control: 'Contested', 
      status: 'Active Trading', 
      resources: 'Medium',
      hazard: 40
    },
    'cisterns': { 
      id: 'cisterns', 
      name: 'The Cisterns', 
      control: 'Anarchy', 
      status: 'Riot Protocols', 
      resources: 'Low',
      hazard: 90
    },
    'throne': {
      id: 'throne',
      name: 'Throne Room',
      control: 'The Logos',
      status: 'Restricted',
      resources: 'High',
      hazard: 99
    }
  };

  const handleSectorSelect = (sectorId: string) => {
    setSelectedSector(sectorId);
    const sector = sectors[sectorId];
    addToLog(`SCANNING SECTOR: ${sector.name.toUpperCase()}`);
    addToLog(`> CONTROL: ${sector.control}`);
    addToLog(`> STATUS: ${sector.status}`);
    addToLog(`> HAZARD RATING: ${sector.hazard}%`);
  };

  const addToLog = (text: string) => {
    setTerminalOutput(prev => [...prev, text]);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    addToLog(`> ${commandInput}`);
    
    // Simple command parser
    const cmd = commandInput.toLowerCase();
    if (cmd.includes('scan')) {
      addToLog("INITIATING DEEP SCAN...");
      setTimeout(() => addToLog("SCAN COMPLETE. NO ANOMALIES DETECTED."), 1000);
    } else if (cmd.includes('help')) {
      addToLog("AVAILABLE COMMANDS: SCAN, STATUS, DEPLOY, INTEL");
    } else {
      setTimeout(() => addToLog("COMMAND ACKNOWLEDGED. PROCESSING..."), 500);
    }

    setCommandInput('');
  };

  const handleGenerateMission = () => {
    addToLog(`> DECRYPTING MANDATE FOR ${targetSystem.toUpperCase()}...`);
    
    // In a real implementation, this would call the actual generator
    // For now, we simulate it
    setTimeout(() => {
      addToLog(`> MANDATE ACQUIRED: ${operationType.toUpperCase()} - ${targetSystem.toUpperCase()}`);
      addToLog(`> DIFFICULTY: HIGH`);
      addToLog(`> REWARD: 5000 CREDITS`);
      toast.success("New Mandate Added to Quest Log");
    }, 800);
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
      <header className="relative z-10 flex justify-between items-center mb-8 border-b border-yellow-500/30 pb-4">
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
            <h1 className="text-3xl font-bold text-yellow-500 tracking-widest flex items-center gap-3">
              <Globe className="h-8 w-8" />
              FACTION COMMAND
            </h1>
            <p className="text-cyan-500 text-sm tracking-[0.2em] mt-1">DIPLOMACY // ESPIONAGE // WARFARE</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{gameState.turn} <span className="text-xs text-gray-500">CYCLE</span></div>
          <div className="text-xs text-red-500 animate-pulse">VERMILION CLEARANCE ACTIVE</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Column: Faction Status */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-[#151e32]/80 border-gray-700 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-cyan-500 text-sm tracking-widest flex items-center gap-2">
                <Users className="h-4 w-4" /> ACTIVE FACTIONS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {factions.map(faction => (
                <div key={faction.id} className="space-y-2 group cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-300 group-hover:text-white transition-colors">{faction.name}</span>
                    <Badge variant="outline" className={`${
                      faction.status === 'Dominant' ? 'text-yellow-500 border-yellow-500' :
                      faction.status === 'Hidden' ? 'text-purple-500 border-purple-500' :
                      faction.status === 'Combat' ? 'text-red-500 border-red-500' :
                      'text-blue-500 border-blue-500'
                    }`}>
                      {faction.status}
                    </Badge>
                  </div>
                  <Progress value={faction.influence} className={`h-2 bg-gray-800`} indicatorClassName={faction.color} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Influence</span>
                    <span>{faction.influence}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Mission Generator (Mandate Weaver) */}
          <Card className="bg-[#151e32]/80 border-cyan-500/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm tracking-widest flex items-center gap-2">
                <ScrollText className="h-4 w-4 text-cyan-500" /> MANDATE WEAVER
              </CardTitle>
              <CardDescription className="text-xs">Procedural Contract Generator</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase">Target System</label>
                <select 
                  value={targetSystem}
                  onChange={(e) => setTargetSystem(e.target.value)}
                  className="w-full bg-black border border-gray-700 text-gray-300 text-xs p-2 rounded focus:border-cyan-500 outline-none"
                >
                  <option>New Roma (Throne)</option>
                  <option>Trebizond System</option>
                  <option>The Ister Rim</option>
                  <option>Avalon Anomaly</option>
                  <option>The Cisterns</option>
                  <option>The Mese</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase">Operation Type</label>
                <select 
                  value={operationType}
                  onChange={(e) => setOperationType(e.target.value)}
                  className="w-full bg-black border border-gray-700 text-gray-300 text-xs p-2 rounded focus:border-cyan-500 outline-none"
                >
                  <option>Data Extraction</option>
                  <option>Sanctioned Assassination</option>
                  <option>Riot Suppression</option>
                  <option>Heresy Investigation</option>
                </select>
              </div>
              <Button 
                onClick={handleGenerateMission}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-widest"
              >
                ✨ DECRYPT MANDATE
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: Sector Map */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-black border-yellow-500/50 h-full min-h-[500px] relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ 
                   backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px)', 
                   backgroundSize: '20px 20px' 
                 }}>
            </div>
            
            <CardHeader className="relative z-10 bg-black/80 border-b border-gray-800">
              <CardTitle className="text-yellow-500 text-center tracking-widest">SECTOR CONTROL GRID</CardTitle>
            </CardHeader>

            <CardContent className="relative z-10 p-6 h-full flex flex-col">
              <div className="grid grid-cols-2 gap-4 flex-1">
                {Object.values(sectors).map(sector => (
                  <motion.button
                    key={sector.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSectorSelect(sector.id)}
                    className={`
                      border p-4 flex flex-col items-center justify-center gap-2 transition-all
                      ${selectedSector === sector.id 
                        ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500' 
                        : 'border-gray-700 hover:border-cyan-500 hover:bg-cyan-500/5 text-gray-400 hover:text-cyan-500'}
                    `}
                  >
                    <Target className="h-6 w-6" />
                    <span className="font-bold uppercase text-sm">{sector.name}</span>
                    <span className="text-[10px] opacity-70">{sector.control}</span>
                  </motion.button>
                ))}
              </div>

              {selectedSector && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-gray-900/90 border border-gray-700 rounded"
                >
                  <h3 className="text-cyan-500 font-bold mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" /> SECTOR ANALYSIS
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500 block">Status</span>
                      <span className="text-white">{sectors[selectedSector].status}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Resources</span>
                      <span className={`${
                        sectors[selectedSector].resources === 'High' ? 'text-green-500' : 
                        sectors[selectedSector].resources === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {sectors[selectedSector].resources} Priority
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 block mb-1">Hazard Rating</span>
                      <Progress value={sectors[selectedSector].hazard} className="h-1.5 bg-gray-800" indicatorClassName="bg-red-500" />
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Terminal & Actions */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-[#0a0f14] border-gray-700 h-full flex flex-col">
            <CardHeader className="pb-2 border-b border-gray-800">
              <CardTitle className="text-red-500 text-sm tracking-widest flex items-center gap-2">
                <Terminal className="h-4 w-4" /> COMMAND LINE
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col min-h-[400px]">
              <ScrollArea className="flex-1 p-4 font-mono text-xs">
                <div className="space-y-1">
                  {terminalOutput.map((line, i) => (
                    <div key={i} className={`${
                      line.startsWith('>') ? 'text-green-500' : 'text-gray-400'
                    }`}>
                      {line}
                    </div>
                  ))}
                  <div ref={(el) => el?.scrollIntoView({ behavior: "smooth" })} />
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-gray-800 bg-black">
                <form onSubmit={handleCommandSubmit} className="flex gap-2">
                  <input 
                    type="text" 
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder="ENTER DIRECTIVE..." 
                    className="flex-1 bg-gray-900 border border-gray-700 text-white text-xs p-2 focus:outline-none focus:border-yellow-500 transition-colors"
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
    </div>
  );
};

export default FactionCommand;
