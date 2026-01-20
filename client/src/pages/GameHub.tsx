import React from 'react';
import { useLocation } from 'wouter';
import { useGameState } from '@/contexts/GameStateContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Shield, 
  Swords, 
  TrendingUp, 
  Users, 
  Activity,
  Map,
  Database,
  Terminal
} from 'lucide-react';

export default function GameHub() {
  const [, setLocation] = useLocation();
  const { gameState } = useGameState();

  const modules = [
    {
      title: "Faction Command",
      description: "Manage diplomatic relations and covert operations",
      icon: <Shield className="h-8 w-8 text-yellow-500" />,
      path: "/faction-command",
      color: "border-yellow-500/50"
    },
    {
      title: "Economic Dashboard",
      description: "Monitor resources, trade routes, and infrastructure",
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      path: "/game/economy",
      color: "border-green-500/50"
    },
    {
      title: "Tactical Operations",
      description: "Deploy fleets and manage military engagements",
      icon: <Swords className="h-8 w-8 text-red-500" />,
      path: "/game/battle",
      color: "border-red-500/50"
    },
    {
      title: "Intel Analytics",
      description: "Review espionage reports and sector analysis",
      icon: <Activity className="h-8 w-8 text-purple-500" />,
      path: "/game/intel",
      color: "border-purple-500/50"
    },
    {
      title: "World Map",
      description: "Strategic overview of the Chrysopolis sector",
      icon: <Map className="h-8 w-8 text-cyan-500" />,
      path: "/game/world",
      color: "border-cyan-500/50"
    },
    {
      title: "Citizen Database",
      description: "Manage personnel and governor assignments",
      icon: <Users className="h-8 w-8 text-blue-500" />,
      path: "/citizen-profile",
      color: "border-blue-500/50"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 p-8">
      <header className="flex justify-between items-center mb-12 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-widest flex items-center gap-4">
            <Globe className="h-10 w-10 text-cyan-500" />
            CENTRAL COMMAND
          </h1>
          <p className="text-gray-500 mt-2 font-mono">CYCLE {gameState.turn} // {gameState.credits} CREDITS // STATUS: ACTIVE</p>
        </div>
        <Button 
          variant="outline" 
          className="border-red-500 text-red-500 hover:bg-red-950/30"
          onClick={() => setLocation('/')}
        >
          LOGOUT
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Card 
            key={index}
            className={`bg-[#151e32]/80 border ${module.color} hover:bg-[#1a2540] transition-all cursor-pointer group`}
            onClick={() => setLocation(module.path)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-4 text-white group-hover:text-cyan-400 transition-colors">
                {module.icon}
                {module.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">{module.description}</p>
              <div className="mt-4 flex justify-end">
                <Terminal className="h-4 w-4 text-gray-600 group-hover:text-cyan-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
