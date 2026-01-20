import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Anchor, Rocket, Crosshair, Shield, Plus } from 'lucide-react';
import { Fleet, ShipClass, SHIP_CLASSES, createFleet, calculateFleetPower } from '@/lib/fleetManagement';

export function FleetPanel() {
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [selectedFleetId, setSelectedFleetId] = useState<string | null>(null);

  const handleCreateFleet = () => {
    const newFleet = createFleet(`Fleet ${fleets.length + 1}`, "Player", "Sector 001");
    setFleets([...fleets, newFleet]);
    setSelectedFleetId(newFleet.id);
  };

  const handleAddShip = (fleetId: string, shipClassId: string) => {
    setFleets(prev => prev.map(fleet => {
      if (fleet.id !== fleetId) return fleet;
      
      const existingStack = fleet.ships.find(s => s.shipClassId === shipClassId);
      let newShips;
      
      if (existingStack) {
        newShips = fleet.ships.map(s => 
          s.shipClassId === shipClassId ? { ...s, count: s.count + 1 } : s
        );
      } else {
        newShips = [...fleet.ships, { shipClassId, count: 1 }];
      }
      
      return { ...fleet, ships: newShips };
    }));
  };

  const selectedFleet = fleets.find(f => f.id === selectedFleetId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Fleet List */}
      <Card className="bg-black/40 border-white/10 md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-serif text-[#D4AF37] flex items-center gap-2">
            <Anchor className="w-5 h-5" /> Imperial Navy
          </CardTitle>
          <Button size="sm" onClick={handleCreateFleet} className="bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/40">
            <Plus className="w-4 h-4 mr-1" /> New Fleet
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <div className="space-y-1 p-4">
              {fleets.length === 0 ? (
                <div className="text-center py-8 text-white/40 italic">
                  No active fleets. Commission a new fleet to project power.
                </div>
              ) : (
                fleets.map(fleet => (
                  <div 
                    key={fleet.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedFleetId === fleet.id 
                        ? 'bg-white/10 border-white/30' 
                        : 'bg-black/20 border-transparent hover:bg-white/5'
                    }`}
                    onClick={() => setSelectedFleetId(fleet.id)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-white">{fleet.name}</span>
                      <Badge variant="outline" className="text-blue-400 border-blue-500/50 bg-blue-900/20">
                        {fleet.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <Crosshair className="w-3 h-3" /> {calculateFleetPower(fleet)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Rocket className="w-3 h-3" /> {fleet.ships.reduce((acc, s) => acc + s.count, 0)} Ships
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Fleet Details & Shipyard */}
      <Card className="bg-black/40 border-white/10 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-serif text-[#D4AF37] flex items-center gap-2">
            <Shield className="w-5 h-5" /> Fleet Command & Shipyard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedFleet ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <h3 className="text-xl font-serif text-white mb-1">{selectedFleet.name}</h3>
                  <p className="text-sm text-white/60">Location: {selectedFleet.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold text-white">
                    {calculateFleetPower(selectedFleet)}
                  </div>
                  <div className="text-xs text-white/40 uppercase tracking-wider">Combat Power</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white/80 uppercase tracking-wider">Current Composition</h4>
                  {selectedFleet.ships.length === 0 ? (
                    <div className="text-white/40 text-sm italic">No ships assigned.</div>
                  ) : (
                    selectedFleet.ships.map(stack => {
                      const shipClass = SHIP_CLASSES.find(s => s.id === stack.shipClassId);
                      return (
                        <div key={stack.shipClassId} className="flex justify-between items-center p-2 bg-white/5 rounded border border-white/5">
                          <span className="text-white">{shipClass?.name}</span>
                          <Badge variant="secondary">x{stack.count}</Badge>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white/80 uppercase tracking-wider">Available Blueprints</h4>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2 pr-4">
                      {SHIP_CLASSES.map(ship => (
                        <Button
                          key={ship.id}
                          variant="outline"
                          className="w-full justify-between h-auto py-2 border-white/10 hover:bg-white/5"
                          onClick={() => handleAddShip(selectedFleet.id, ship.id)}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{ship.name}</span>
                            <span className="text-xs text-white/50">{ship.type}</span>
                          </div>
                          <div className="text-right text-xs">
                            <div className="text-amber-400">{ship.cost.credits} CR</div>
                            <div className="text-blue-400">{ship.cost.manpower} MP</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/40 min-h-[300px]">
              <Rocket className="w-12 h-12 mb-4 opacity-20" />
              <p>Select a fleet to manage ships and orders</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
