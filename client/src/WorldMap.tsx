import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Map as MapIcon, ArrowLeft, Compass, Navigation, 
  Shield, AlertTriangle, Search, Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGameState } from '@/contexts/GameStateContext';
// @ts-ignore
import { generateLocationCluster } from '@/components/ProceduralLocationGenerator';
import { toast } from 'sonner';

export default function WorldMap() {
  const [, setLocation] = useLocation();
  const { gameState, setGameState, logResourceChange } = useGameState();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentLocationId, setCurrentLocationId] = useState<string | null>(null);

  // Initialize locations
  useEffect(() => {
    const newLocations = generateLocationCluster(6, gameState);
    setLocations(newLocations);
  }, []);

  const handleScan = () => {
    if (gameState.energy < 50) {
      toast.error("Insufficient Energy for Scan");
      return;
    }

    setIsScanning(true);
    const newEnergy = gameState.energy - 50;
    setGameState(prev => ({ ...prev, energy: newEnergy }));
    logResourceChange('energy', -50, newEnergy, 'Sector Scan', 'Deep space scan initiated');

    setTimeout(() => {
      const newLocation = generateLocationCluster(1, gameState)[0];
      setLocations(prev => [...prev, newLocation]);
      setIsScanning(false);
      toast.success("New Sector Discovered: " + newLocation.name);
    }, 2000);
  };

  const handleTravel = (location: any) => {
    if (gameState.energy < 20) {
      toast.error("Insufficient Energy for Travel");
      return;
    }

    const newEnergy = gameState.energy - 20;
    setGameState(prev => ({ ...prev, energy: newEnergy }));
    logResourceChange('energy', -20, newEnergy, 'Fleet Travel', `Warped to ${location.name}`);
    setCurrentLocationId(location.id);
    toast.success(`Fleet arrived at ${location.name}`);
  };

  const handleExplore = (location: any) => {
    // This represents the "Away Team" movement
    const encounterChance = Math.random();
    
    if (encounterChance > 0.7) {
      toast.warning("Hostiles detected! Prepare for combat.");
      setTimeout(() => setLocation('/game/combat'), 1500);
    } else {
      const reward = Math.floor(Math.random() * 100) + 50;
      const newCredits = gameState.credits + reward;
      setGameState(prev => ({ ...prev, credits: newCredits }));
      logResourceChange('credits', reward, newCredits, 'Exploration', `Found resources at ${location.name}`);
      toast.success(`Exploration successful. Found ${reward} credits.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/game')}
              className="text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/30"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 tracking-widest uppercase flex items-center gap-3">
                <MapIcon className="w-8 h-8" />
                Stellar Cartography
              </h1>
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                Sector Scan // Navigation // Exploration
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 bg-slate-900/80 border border-slate-700 px-6 py-3 rounded-lg">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase">Fuel Cells</p>
              <p className="text-2xl font-bold text-cyan-400 font-mono">
                {gameState.energy} / 1000
              </p>
            </div>
            <Button 
              onClick={handleScan} 
              disabled={isScanning || gameState.energy < 50}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isScanning ? 'Scanning...' : 'Scan Sector (50E)'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Map View */}
          <Card className="lg:col-span-2 bg-slate-900/90 border-cyan-900/50 relative overflow-hidden">
            <div className="absolute inset-0 p-8">
              {locations.map((loc, i) => (
                <motion.div
                  key={loc.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`absolute cursor-pointer group`}
                  style={{ 
                    left: `${loc.coordinates.x}%`, 
                    top: `${loc.coordinates.y}%` 
                  }}
                  onClick={() => setSelectedLocation(loc)}
                >
                  <div className={`w-4 h-4 rounded-full ${
                    selectedLocation?.id === loc.id ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]' : 
                    loc.type === 'station' ? 'bg-green-500' :
                    loc.type === 'planet' ? 'bg-blue-500' :
                    'bg-slate-500'
                  } transition-all duration-300`} />
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 px-2 py-1 rounded border border-slate-700 text-xs z-10">
                    {loc.name}
                  </div>
                </motion.div>
              ))}
              
              {/* Radar Sweep Animation */}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[100%] h-[100%] border-2 border-cyan-500/30 rounded-full animate-ping" />
                </div>
              )}
            </div>
          </Card>

          {/* Location Details */}
          <Card className="bg-slate-900/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-cyan-400 uppercase tracking-wider text-sm flex items-center gap-2">
                <Compass className="w-4 h-4" />
                Location Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLocation ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{selectedLocation.name}</h3>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-900">
                      {selectedLocation.type.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-slate-300">
                    <p>{selectedLocation.description}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-slate-800/50 p-2 rounded">
                        <span className="text-xs text-slate-500 block">Sector</span>
                        {selectedLocation.sector}
                      </div>
                      <div className="bg-slate-800/50 p-2 rounded">
                        <span className="text-xs text-slate-500 block">Atmosphere</span>
                        <span className="capitalize">{selectedLocation.atmosphere}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs uppercase text-slate-500 font-bold">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocation.features.map((f: any) => (
                        <Badge key={f.id} variant="secondary" className="bg-slate-800 text-slate-300">
                          {f.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs uppercase text-slate-500 font-bold">Threat Assessment</h4>
                    {selectedLocation.dangers.length > 0 ? (
                      <div className="space-y-1">
                        {selectedLocation.dangers.map((d: string) => (
                          <div key={d} className="flex items-center gap-2 text-red-400 text-xs">
                            <AlertTriangle className="w-3 h-3" />
                            <span className="capitalize">{d.replace(/_/g, ' ')}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-green-400 text-xs flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        Sector Secure
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-cyan-600 hover:bg-cyan-700"
                      onClick={() => handleTravel(selectedLocation)}
                      disabled={gameState.energy < 20}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Warp Fleet (20E)
                    </Button>
                    
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      onClick={() => handleExplore(selectedLocation)}
                      disabled={currentLocationId !== selectedLocation.id}
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Deploy Away Team
                    </Button>
                    {currentLocationId !== selectedLocation.id && (
                      <p className="text-xs text-center text-slate-500">Fleet must be in orbit to deploy team.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 opacity-50">
                  <Search className="w-12 h-12" />
                  <p>Select a system to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
