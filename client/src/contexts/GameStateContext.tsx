import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';

// Define GameState interface
export interface GameState {
  turn: number;
  daysPassed: number;
  credits: number;
  metal: number;
  energy: number;
  stress: number;
  stressTracks: {
    shadow: number;
    mental: number;
    physical: number;
  };
  infrastructure: any[];
  tradeRoutes: any[];
  maxTradeRoutes: number;
  isPaused: boolean;
}

// Initial state
const initialGameState: GameState = {
  turn: 1,
  daysPassed: 0,
  credits: 1000,
  metal: 500,
  energy: 500,
  stress: 0,
  stressTracks: {
    shadow: 0,
    mental: 0,
    physical: 0,
  },
  infrastructure: [],
  tradeRoutes: [],
  maxTradeRoutes: 3,
  isPaused: false,
};

interface GameStateContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  advanceTurn: () => void;
  togglePause: () => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const advanceTurn = useCallback(() => {
    setGameState((prev) => {
      // Calculate trade route income
      const tradeRouteIncome = prev.tradeRoutes
        .filter(route => route.status === 'active')
        .reduce((total, route) => total + (route.income || route.value || 0), 0);
      
      // Calculate infrastructure income/upkeep
      let infrastructureIncome = 0;
      let infrastructureUpkeep = 0;
      prev.infrastructure.forEach(building => {
        if (building.status === 'active') {
          if (building.type === 'trade_hub') infrastructureIncome += 100;
          if (building.type === 'mining_facility') infrastructureIncome += 150;
          if (building.type === 'research_lab') infrastructureIncome += 50;
          
          infrastructureUpkeep += 50; // Base upkeep per building
        }
      });
      
      const totalIncome = 500 + tradeRouteIncome + infrastructureIncome - infrastructureUpkeep;
      
      const newState = {
        ...prev,
        turn: prev.turn + 1,
        daysPassed: prev.daysPassed + 1,
        credits: prev.credits + totalIncome,
        metal: prev.metal + 50,
        energy: prev.energy + 30,
        stress: Math.min(100, prev.stress + 2),
        stressTracks: {
          ...prev.stressTracks,
          shadow: Math.max(0, prev.stressTracks.shadow - 5)
        },
      };
      
      if (tradeRouteIncome > 0 || infrastructureIncome > 0) {
        toast.info(`Turn Advanced | Income: ${totalIncome}₵ (Base: 500 + Trade: ${tradeRouteIncome} + Infrastructure: ${infrastructureIncome} - Upkeep: ${infrastructureUpkeep})`);
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

  return (
    <GameStateContext.Provider value={{ gameState, setGameState, advanceTurn, togglePause }}>
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
