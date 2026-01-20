import React from 'react';
import { useGameState } from '@/contexts/GameStateContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Shield, 
  Brain, 
  Coins, 
  Eye, 
  Activity,
  MapPin,
  Fingerprint,
  Terminal,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

const CitizenProfile = () => {
  const [, setLocation] = useLocation();
  const { gameState } = useGameState();
  const { stressTracks } = gameState;

  // Helper to determine status color based on value
  const getStatusColor = (value: number, inverse = false) => {
    if (inverse) {
      // For Shadow/Heat: Low is good, High is bad
      if (value < 30) return 'text-green-500';
      if (value < 70) return 'text-yellow-500';
      return 'text-red-500';
    }
    // For Health/Mind: High is good, Low is bad
    if (value > 70) return 'text-green-500';
    if (value > 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusText = (track: string, value: number) => {
    if (track === 'blood') {
      if (value > 80) return 'Optimal';
      if (value > 50) return 'Stable';
      if (value > 20) return 'Critical';
      return 'Near Death';
    }
    if (track === 'mind') {
      if (value > 80) return 'Lucid';
      if (value > 50) return 'Stressed';
      if (value > 20) return 'Unstable';
      return 'Psychotic Break';
    }
    if (track === 'shadow') {
      if (value < 20) return 'Ghost';
      if (value < 50) return 'Monitored';
      if (value < 80) return 'Wanted';
      return 'Kill on Sight';
    }
    return 'Unknown';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 p-6 font-mono relative overflow-hidden">
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10" 
           style={{ 
             backgroundImage: 'linear-gradient(transparent 50%, rgba(255, 215, 0, 0.1) 50%)',
             backgroundSize: '100% 4px'
           }}>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-start mb-8 border-t-4 border-yellow-500 pt-4 bg-[#0a0f14]/80 backdrop-blur p-4 rounded-b-lg shadow-[0_0_15px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col gap-4">
          <Button 
            variant="ghost" 
            className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 w-fit pl-0"
            onClick={() => setLocation('/game')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Command
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-yellow-500 tracking-widest uppercase flex items-center gap-3">
              <Fingerprint className="h-8 w-8" />
              Logos Imperium
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-cyan-400 tracking-widest">CONN_ESTABLISHED // {gameState.playerHouse.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 uppercase">Current Date</div>
          <div className="text-xl text-white font-bold">30,492 AD</div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Column: Identity Card */}
        <div className="md:col-span-12 lg:col-span-12">
          <Card className="bg-[#0a0f14]/90 border-l-4 border-l-yellow-500 border-y-0 border-r-0 rounded-none">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                <h2 className="text-yellow-500 font-bold uppercase tracking-wider flex items-center gap-2">
                  <User className="h-4 w-4" /> Citizen Identification
                </h2>
                <Badge variant="outline" className="bg-gray-900 text-gray-400 border-gray-700 font-mono">
                  ID: {gameState.playerId.toUpperCase()}
                </Badge>
              </div>
              
              {/* Warrant Progression */}
              <div className="mb-6 bg-gray-900/50 p-4 rounded border border-gray-800">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="text-xs text-cyan-500 uppercase tracking-widest font-bold">Warrant of Agency</span>
                    <div className="text-2xl text-white font-bold">Level {gameState.warrantLevel}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 uppercase">Clearance XP</span>
                    <div className="text-sm text-cyan-400 font-mono">
                      {gameState.warrantXp} / {gameState.warrantNextLevelXp}
                    </div>
                  </div>
                </div>
                <Progress 
                  value={(gameState.warrantXp / gameState.warrantNextLevelXp) * 100} 
                  className="h-3 bg-gray-950 border border-gray-800" 
                  indicatorClassName="bg-cyan-500" 
                />
                <div className="mt-2 flex justify-between text-[10px] text-gray-500 uppercase tracking-wider">
                  <span>Current Clearance: {gameState.warrantLevel === 1 ? 'Probationary' : gameState.warrantLevel === 2 ? 'Operative' : gameState.warrantLevel === 3 ? 'Agent' : 'Master Agent'}</span>
                  <span>Next: {gameState.warrantLevel === 1 ? 'Operative' : gameState.warrantLevel === 2 ? 'Agent' : gameState.warrantLevel === 3 ? 'Master Agent' : 'Max Level'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <span className="block text-xs text-gray-500 uppercase mb-1">Name</span>
                  <span className="text-xl text-white block font-bold">{gameState.playerName}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 uppercase mb-1">House Affiliation</span>
                  <span className="text-lg text-cyan-400 block">{gameState.playerHouse}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 uppercase mb-1">Current Location</span>
                  <span className="text-white block flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    The Chrysopolis
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 uppercase mb-1">Social Credit</span>
                  <span className="text-yellow-500 block font-bold text-xl">{gameState.reputation} / 1000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stress Tracks Section */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Blood (Physical) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0a0f14]/80 border border-gray-800 p-4 rounded relative overflow-hidden group hover:border-red-900/50 transition-colors"
          >
            <div className="absolute right-0 top-0 p-2 opacity-10 text-6xl font-serif text-red-900 group-hover:opacity-20 transition">I</div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-500" />
                <span className="text-red-400 font-bold uppercase text-sm">Blood (Physical)</span>
              </div>
              <span className={`font-mono font-bold ${getStatusColor(stressTracks.blood)}`}>
                {stressTracks.blood}%
              </span>
            </div>
            <Progress value={stressTracks.blood} className="h-2 bg-gray-900" indicatorClassName="bg-red-600" />
            <p className="text-[10px] text-gray-500 mt-2 flex justify-between">
              <span>Status: {getStatusText('blood', stressTracks.blood)}</span>
              <span>Integrity</span>
            </p>
          </motion.div>

          {/* Mind (Cognitive) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0a0f14]/80 border border-gray-800 p-4 rounded relative overflow-hidden group hover:border-blue-900/50 transition-colors"
          >
            <div className="absolute right-0 top-0 p-2 opacity-10 text-6xl font-serif text-blue-900 group-hover:opacity-20 transition">II</div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-500" />
                <span className="text-blue-400 font-bold uppercase text-sm">Mind (Cognitive)</span>
              </div>
              <span className={`font-mono font-bold ${getStatusColor(stressTracks.mind)}`}>
                {stressTracks.mind}%
              </span>
            </div>
            <Progress value={stressTracks.mind} className="h-2 bg-gray-900" indicatorClassName="bg-blue-500" />
            <p className="text-[10px] text-gray-500 mt-2 flex justify-between">
              <span>Status: {getStatusText('mind', stressTracks.mind)}</span>
              <span>Stability</span>
            </p>
          </motion.div>

          {/* Silver (Financial) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0a0f14]/80 border border-gray-800 p-4 rounded relative overflow-hidden group hover:border-yellow-900/50 transition-colors"
          >
            <div className="absolute right-0 top-0 p-2 opacity-10 text-6xl font-serif text-yellow-900 group-hover:opacity-20 transition">III</div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-yellow-500" />
                <span className="text-yellow-500 font-bold uppercase text-sm">Silver (Resource)</span>
              </div>
              <span className="font-mono font-bold text-yellow-500">
                {gameState.credits.toLocaleString()} ₵
              </span>
            </div>
            <Progress value={Math.min(100, (gameState.credits / 20000) * 100)} className="h-2 bg-gray-900" indicatorClassName="bg-yellow-500" />
            <p className="text-[10px] text-gray-500 mt-2 flex justify-between">
              <span>Credit Standing: Solvent</span>
              <span>Liquidity</span>
            </p>
          </motion.div>

          {/* Shadow (Heat) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#0a0f14]/80 border border-gray-800 p-4 rounded relative overflow-hidden group hover:border-purple-900/50 transition-colors"
          >
            <div className="absolute right-0 top-0 p-2 opacity-10 text-6xl font-serif text-purple-900 group-hover:opacity-20 transition">IV</div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-purple-500" />
                <span className="text-purple-400 font-bold uppercase text-sm">Shadow (Heat)</span>
              </div>
              <span className={`font-mono font-bold ${getStatusColor(stressTracks.shadow, true)}`}>
                {stressTracks.shadow}%
              </span>
            </div>
            <Progress value={stressTracks.shadow} className="h-2 bg-gray-900" indicatorClassName="bg-purple-600" />
            <p className="text-[10px] text-gray-500 mt-2 flex justify-between">
              <span>Alert Level: {getStatusText('shadow', stressTracks.shadow)}</span>
              <span>Visibility</span>
            </p>
          </motion.div>

        </div>

        {/* Asset Manifest */}
        <div className="md:col-span-12">
          <Card className="bg-[#0a0f14]/80 border border-gray-800">
            <CardHeader className="pb-2 border-b border-gray-800">
              <CardTitle className="text-gray-400 text-xs uppercase tracking-widest flex items-center gap-2">
                <Activity className="h-4 w-4" /> Asset Manifest
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-800 text-sm">
                <div className="p-3 flex justify-between items-center hover:bg-gray-900/50 transition">
                  <span className="text-gray-300">Indulgences (Class A)</span>
                  <span className="text-yellow-500 font-mono">x 2</span>
                </div>
                <div className="p-3 flex justify-between items-center hover:bg-gray-900/50 transition">
                  <span className="text-gray-300">Adamantine Plating</span>
                  <span className="text-yellow-500 font-mono">x {gameState.metal} kg</span>
                </div>
                <div className="p-3 flex justify-between items-center hover:bg-gray-900/50 transition">
                  <span className="text-gray-300">Energy Cells</span>
                  <span className="text-cyan-500 font-mono">x {gameState.energy} units</span>
                </div>
                <div className="p-3 flex justify-between items-center hover:bg-gray-900/50 transition">
                  <span className="text-gray-400 italic">Raw Plasma</span>
                  <span className="text-red-500 font-mono text-xs">DEPLETED</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Terminal Section */}
        <div className="md:col-span-12">
          <Card className="bg-black border border-gray-700">
            <CardHeader className="pb-2 border-b border-gray-800">
              <CardTitle className="text-yellow-500 text-xs uppercase tracking-widest flex items-center gap-2">
                <Terminal className="h-4 w-4" /> Command Line Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 font-mono text-xs">
              <div className="h-32 overflow-y-auto text-green-500 mb-3 space-y-1 border-l border-green-900 pl-2">
                <p className="opacity-50">{'>'} BOOT_SEQUENCE_INIT...</p>
                <p className="opacity-50">{'>'} CONNECTING TO MANUS_CORE via MCP...</p>
                <p className="opacity-50">{'>'} CONNECTION SECURE.</p>
                <p className="opacity-50">{'>'} RETRIEVING SECTOR DATA: THRACE...</p>
                <p className="text-white">{'>'} SYSTEM READY. AWAITING INPUT.</p>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 bg-gray-900 border border-gray-700 text-white p-2 focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="Enter command..."
                />
                <button className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold px-4 py-2 uppercase text-xs transition-colors">
                  Execute
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default CitizenProfile;
