import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { Fleet, SHIP_CLASSES, calculateFleetUpkeep } from '@/lib/fleetManagement';

// Define GameState interface
export interface GameState {
  turn: number;
  daysPassed: number;
  credits: number;
  metal: number;
  energy: number;
  tech: number;
  manpower: number;
  stress: number;
  stressTracks: {
    shadow: number;
    mental: number;
    physical: number;
  };
  infrastructure: any[];
  tradeRoutes: any[];
  maxTradeRoutes: number;
  fleets: Fleet[];
  isPaused: boolean;
}

// Initial state
const initialGameState: GameState = {
  turn: 1,
  daysPassed: 0,
  credits: 1000,
  metal: 500,
  energy: 500,
  tech: 100,
  manpower: 200,
  stress: 0,
  stressTracks: {
    shadow: 0,
    mental: 0,
    physical: 0,
  },
  infrastructure: [],
  tradeRoutes: [],
  maxTradeRoutes: 3,
  fleets: [],
  isPaused: false,
};

interface GameStateContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  advanceTurn: () => void;
  togglePause: () => void;
  addFleet: (fleet: Fleet) => void;
  updateFleet: (fleetId: string, updates: Partial<Fleet>) => void;
  removeFleet: (fleetId: string) => void;
  constructShip: (fleetId: string, shipClassId: string) => boolean;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('logos-game-state');
    return saved ? JSON.parse(saved) : initialGameState;
  });

  useEffect(() => {
    localStorage.setItem('logos-game-state', JSON.stringify(gameState));
  }, [gameState]);

  const advanceTurn = useCallback(() => {
    setGameState((prev) => {
      // Calculate trade route income
      const tradeRouteIncome = prev.tradeRoutes
        .filter(route => route.status === 'active')
        .reduce((total, route) => total + (route.income || route.value || 0), 0);
      
      // Calculate infrastructure income/upkeep
      let infrastructureIncome = 0;
      let infrastructureUpkeep = 0;
      let metalIncome = 0;
      let techIncome = 0;
      
      prev.infrastructure.forEach(building => {
        if (building.status === 'active') {
          if (building.type === 'trade_hub') infrastructureIncome += 100;
          if (building.type === 'mining_facility') metalIncome += 50;
          if (building.type === 'research_lab') techIncome += 10;
          
          infrastructureUpkeep += 50; // Base upkeep per building
        }
      });

      // Calculate fleet upkeep
      let fleetUpkeep = 0;
      prev.fleets.forEach(fleet => {
        fleetUpkeep += calculateFleetUpkeep(fleet);
      });
      
      const totalIncome = 500 + tradeRouteIncome + infrastructureIncome - infrastructureUpkeep - fleetUpkeep;
      
      const newState = {
        ...prev,
        turn: prev.turn + 1,
        daysPassed: prev.daysPassed + 1,
        credits: prev.credits + totalIncome,
        metal: prev.metal + 50 + metalIncome,
        energy: prev.energy + 30,
        tech: prev.tech + 5 + techIncome,
        manpower: prev.manpower + 10,
        stress: Math.min(100, prev.stress + 2),
        stressTracks: {
          ...prev.stressTracks,
          shadow: Math.max(0, prev.stressTracks.shadow - 5)
        },
      };
      
      if (tradeRouteIncome > 0 || infrastructureIncome > 0 || fleetUpkeep > 0) {
        toast.info(`Turn Advanced | Income: ${totalIncome}₵ (Base: 500 + Trade: ${tradeRouteIncome} + Infra: ${infrastructureIncome} - Upkeep: ${infrastructureUpkeep + fleetUpkeep})`);
      } else {
        toast.info(`Turn Advanced | Income: ${totalIncome}₵`);
      }
      
      return newState;
    });
  }, []);

  const togglePause = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  const addFleet = useCallback((fleet: Fleet) => {
    setGameState(prev => ({
      ...prev,
      fleets: [...prev.fleets, fleet]
    }));
  }, []);

  const updateFleet = useCallback((fleetId: string, updates: Partial<Fleet>) => {
    setGameState(prev => ({
      ...prev,
      fleets: prev.fleets.map(f => f.id === fleetId ? { ...f, ...updates } : f)
    }));
  }, []);

  const removeFleet = useCallback((fleetId: string) => {
    setGameState(prev => ({
      ...prev,
      fleets: prev.fleets.filter(f => f.id !== fleetId)
    }));
  }, []);

  const constructShip = useCallback((fleetId: string, shipClassId: string) => {
    let success = false;
    setGameState(prev => {
      const shipClass = SHIP_CLASSES.find(s => s.id === shipClassId);
      if (!shipClass) return prev;

      // Check resources
      if (prev.credits < shipClass.cost.credits || 
          prev.tech < shipClass.cost.tech || 
          prev.manpower < shipClass.cost.manpower) {
        toast.error("Insufficient resources to construct ship");
        return prev;
      }

      const fleetIndex = prev.fleets.findIndex(f => f.id === fleetId);
      if (fleetIndex === -1) {
        // Create new fleet if none exists
        const newFleet: Fleet = {
            id: fleetId,
            name: "New Fleet",
            owner: "player",
            location: "Sector 1",
            ships: [{ shipClassId, count: 1 }],
            status: "Idle"
        };
        
        success = true;
        toast.success(`Constructed ${shipClass.name}`);
        
        return {
            ...prev,
            credits: prev.credits - shipClass.cost.credits,
            tech: prev.tech - shipClass.cost.tech,
            manpower: prev.manpower - shipClass.cost.manpower,
            fleets: [...prev.fleets, newFleet]
        };
      }

      const updatedFleets = [...prev.fleets];
      const fleet = { ...updatedFleets[fleetIndex] };
      const existingStack = fleet.ships.find(s => s.shipClassId === shipClassId);

      if (existingStack) {
        existingStack.count++;
      } else {
        fleet.ships.push({ shipClassId, count: 1 });
      }
      updatedFleets[fleetIndex] = fleet;

      success = true;
      toast.success(`Constructed ${shipClass.name}`);

      return {
        ...prev,
        credits: prev.credits - shipClass.cost.credits,
        tech: prev.tech - shipClass.cost.tech,
        manpower: prev.manpower - shipClass.cost.manpower,
        fleets: updatedFleets
      };
    });
    return success;
  }, []);

  return (
    <GameStateContext.Provider value={{ 
      gameState, 
      setGameState, 
      advanceTurn, 
      togglePause,
      addFleet,
      updateFleet,
      removeFleet,
      constructShip
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
