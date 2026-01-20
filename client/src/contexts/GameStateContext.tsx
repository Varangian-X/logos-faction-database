import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Fleet, SHIP_CLASSES, calculateFleetUpkeep } from '@/lib/fleetManagement';

// Resource Change Log Entry
export interface ResourceChangeLog {
  id: string;
  timestamp: number;
  resourceType: 'credits' | 'metal' | 'energy' | 'tech' | 'manpower' | 'stress';
  changeAmount: number;
  newTotal: number;
  source: string;
  description?: string;
}

// Diplomacy Types
export interface DiplomaticRelation {
  factionId: string;
  factionName: string;
  standing: number; // -100 to 100
  status: 'War' | 'Hostile' | 'Neutral' | 'Friendly' | 'Allied';
  treaties: string[];
  lastInteraction: number;
}

export interface DiplomaticAction {
  id: string;
  type: 'embassy' | 'trade_deal' | 'alliance' | 'denounce' | 'declare_war' | 'peace_offer';
  targetFaction: string;
  cost: { credits: number; influence?: number };
  duration?: number;
  effects: string[];
}

// Espionage Types
export interface EspionageAgent {
  id: string;
  name: string;
  codename: string;
  skill: number; // 1-100
  status: 'Available' | 'Deployed' | 'Compromised' | 'Eliminated';
  location?: string;
  mission?: string;
  loyalty: number;
}

export interface EspionageOperation {
  id: string;
  type: 'infiltrate' | 'sabotage' | 'steal_tech' | 'assassinate' | 'counter_intel' | 'propaganda';
  targetFaction: string;
  targetLocation?: string;
  agentId: string;
  status: 'Planning' | 'Active' | 'Complete' | 'Failed' | 'Compromised';
  progress: number;
  cost: { credits: number; stress?: number };
  risk: number;
  reward?: any;
  startTurn: number;
  duration: number;
}

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
    mind: number;
    blood: number;
    silver: number;
  };
  infrastructure: any[];
  tradeRoutes: any[];
  maxTradeRoutes: number;
  fleets: Fleet[];
  isPaused: boolean;
  // Diplomacy State
  diplomacy: {
    relations: DiplomaticRelation[];
    activeActions: DiplomaticAction[];
    influence: number;
  };
  // Espionage State
  espionage: {
    agents: EspionageAgent[];
    operations: EspionageOperation[];
    networkStrength: number;
    counterIntelLevel: number;
  };
}

// Initial Diplomatic Relations
const initialDiplomacy = {
  relations: [
    { factionId: 'neo-praetorians', factionName: 'Neo-Praetorians', standing: 20, status: 'Neutral' as const, treaties: [], lastInteraction: 0 },
    { factionId: 'agentes', factionName: 'Agentes en Rebus', standing: -10, status: 'Hostile' as const, treaties: [], lastInteraction: 0 },
    { factionId: 'varangians', factionName: 'Neo-Varangians', standing: 0, status: 'Neutral' as const, treaties: [], lastInteraction: 0 },
    { factionId: 'logothetes', factionName: 'Logothetes', standing: 30, status: 'Friendly' as const, treaties: [], lastInteraction: 0 },
    { factionId: 'ecclesiarchy', factionName: 'Ecclesiarchy', standing: 10, status: 'Neutral' as const, treaties: [], lastInteraction: 0 },
  ],
  activeActions: [],
  influence: 50,
};

// Initial Espionage State
const initialEspionage = {
  agents: [
    { id: 'agent-1', name: 'Marcus Valerius', codename: 'SHADOW-7', skill: 65, status: 'Available' as const, loyalty: 80 },
    { id: 'agent-2', name: 'Elena Komnenos', codename: 'VIPER', skill: 78, status: 'Available' as const, loyalty: 90 },
  ],
  operations: [],
  networkStrength: 40,
  counterIntelLevel: 30,
};

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
    mind: 80,
    blood: 100,
    silver: 50,
  },
  infrastructure: [],
  tradeRoutes: [],
  maxTradeRoutes: 3,
  fleets: [],
  isPaused: false,
  diplomacy: initialDiplomacy,
  espionage: initialEspionage,
};

interface GameStateContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  advanceTurn: () => void;
  togglePause: () => void;
  // Fleet Management
  addFleet: (fleet: Fleet) => void;
  updateFleet: (fleetId: string, updates: Partial<Fleet>) => void;
  removeFleet: (fleetId: string) => void;
  constructShip: (fleetId: string, shipClassId: string) => boolean;
  // Diplomacy
  updateDiplomaticRelation: (factionId: string, standingChange: number, newStatus?: DiplomaticRelation['status']) => void;
  executeDiplomaticAction: (action: DiplomaticAction) => boolean;
  // Espionage
  deployAgent: (agentId: string, operation: Omit<EspionageOperation, 'id' | 'agentId' | 'status' | 'progress' | 'startTurn'>) => boolean;
  recallAgent: (agentId: string) => void;
  processOperations: () => void;
  // Resource Tracking
  resourceChangeLogs: ResourceChangeLog[];
  logResourceChange: (resourceType: ResourceChangeLog['resourceType'], changeAmount: number, newTotal: number, source: string, description?: string) => void;
  clearResourceLogs: () => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('logos-game-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure diplomacy and espionage exist
      return {
        ...initialGameState,
        ...parsed,
        diplomacy: parsed.diplomacy || initialDiplomacy,
        espionage: parsed.espionage || initialEspionage,
      };
    }
    return initialGameState;
  });

  const [resourceChangeLogs, setResourceChangeLogs] = useState<ResourceChangeLog[]>([]);

  useEffect(() => {
    localStorage.setItem('logos-game-state', JSON.stringify(gameState));
  }, [gameState]);

  const logResourceChange = useCallback((
    resourceType: ResourceChangeLog['resourceType'],
    changeAmount: number,
    newTotal: number,
    source: string,
    description?: string
  ) => {
    const log: ResourceChangeLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      resourceType,
      changeAmount,
      newTotal,
      source,
      description,
    };
    setResourceChangeLogs(prev => [log, ...prev].slice(0, 100)); // Keep last 100 logs
  }, []);

  const clearResourceLogs = useCallback(() => {
    setResourceChangeLogs([]);
  }, []);

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
          infrastructureUpkeep += 50;
        }
      });

      // Calculate fleet upkeep
      let fleetUpkeep = 0;
      prev.fleets.forEach(fleet => {
        fleetUpkeep += calculateFleetUpkeep(fleet);
      });

      // Calculate espionage costs
      let espionageCosts = 0;
      prev.espionage.operations.filter(op => op.status === 'Active').forEach(op => {
        espionageCosts += Math.floor(op.cost.credits / op.duration);
      });

      // Calculate diplomatic maintenance
      let diplomaticCosts = 0;
      prev.diplomacy.relations.forEach(rel => {
        if (rel.treaties.includes('trade_deal')) diplomaticCosts -= 50; // Trade deals generate income
        if (rel.treaties.includes('alliance')) diplomaticCosts += 20; // Alliances cost maintenance
      });
      
      const totalIncome = 500 + tradeRouteIncome + infrastructureIncome - infrastructureUpkeep - fleetUpkeep - espionageCosts + diplomaticCosts;
      
      const newCredits = prev.credits + totalIncome;
      const newMetal = prev.metal + 50 + metalIncome;
      const newEnergy = prev.energy + 30;
      const newTech = prev.tech + 5 + techIncome;
      const newManpower = prev.manpower + 10;
      const newStress = Math.min(100, prev.stress + 2);

      // Log resource changes
      if (totalIncome !== 0) {
        logResourceChange('credits', totalIncome, newCredits, 'Turn Income', 
          `Base: 500 | Trade: ${tradeRouteIncome} | Infra: ${infrastructureIncome} | Upkeep: -${infrastructureUpkeep + fleetUpkeep + espionageCosts}`);
      }
      
      const newState = {
        ...prev,
        turn: prev.turn + 1,
        daysPassed: prev.daysPassed + 1,
        credits: newCredits,
        metal: newMetal,
        energy: newEnergy,
        tech: newTech,
        manpower: newManpower,
        stress: newStress,
        stressTracks: {
          ...prev.stressTracks,
          shadow: Math.max(0, prev.stressTracks.shadow - 5)
        },
      };
      
      toast.info(`Turn ${newState.turn} | Net Income: ${totalIncome >= 0 ? '+' : ''}${totalIncome}₵`);
      
      return newState;
    });
  }, [logResourceChange]);

  const togglePause = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  // Fleet Management
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

      if (prev.credits < shipClass.cost.credits || 
          prev.tech < shipClass.cost.tech || 
          prev.manpower < shipClass.cost.manpower) {
        toast.error("Insufficient resources to construct ship");
        return prev;
      }

      const newCredits = prev.credits - shipClass.cost.credits;
      const newTech = prev.tech - shipClass.cost.tech;
      const newManpower = prev.manpower - shipClass.cost.manpower;

      logResourceChange('credits', -shipClass.cost.credits, newCredits, 'Ship Construction', `Built ${shipClass.name}`);
      logResourceChange('tech', -shipClass.cost.tech, newTech, 'Ship Construction', `Built ${shipClass.name}`);
      logResourceChange('manpower', -shipClass.cost.manpower, newManpower, 'Ship Construction', `Built ${shipClass.name}`);

      const fleetIndex = prev.fleets.findIndex(f => f.id === fleetId);
      if (fleetIndex === -1) {
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
          credits: newCredits,
          tech: newTech,
          manpower: newManpower,
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
        credits: newCredits,
        tech: newTech,
        manpower: newManpower,
        fleets: updatedFleets
      };
    });
    return success;
  }, [logResourceChange]);

  // Diplomacy Functions
  const updateDiplomaticRelation = useCallback((factionId: string, standingChange: number, newStatus?: DiplomaticRelation['status']) => {
    setGameState(prev => {
      const relations = prev.diplomacy.relations.map(rel => {
        if (rel.factionId === factionId) {
          const newStanding = Math.max(-100, Math.min(100, rel.standing + standingChange));
          let status = newStatus || rel.status;
          
          // Auto-calculate status based on standing if not provided
          if (!newStatus) {
            if (newStanding <= -75) status = 'War';
            else if (newStanding <= -25) status = 'Hostile';
            else if (newStanding < 25) status = 'Neutral';
            else if (newStanding < 75) status = 'Friendly';
            else status = 'Allied';
          }
          
          return { ...rel, standing: newStanding, status, lastInteraction: prev.turn };
        }
        return rel;
      });
      
      return {
        ...prev,
        diplomacy: { ...prev.diplomacy, relations }
      };
    });
  }, []);

  const executeDiplomaticAction = useCallback((action: DiplomaticAction) => {
    let success = false;
    setGameState(prev => {
      if (prev.credits < action.cost.credits) {
        toast.error("Insufficient credits for diplomatic action");
        return prev;
      }
      if (action.cost.influence && prev.diplomacy.influence < action.cost.influence) {
        toast.error("Insufficient influence for diplomatic action");
        return prev;
      }

      const newCredits = prev.credits - action.cost.credits;
      const newInfluence = prev.diplomacy.influence - (action.cost.influence || 0);

      logResourceChange('credits', -action.cost.credits, newCredits, 'Diplomacy', `${action.type} with ${action.targetFaction}`);

      // Apply diplomatic effects
      let standingChange = 0;
      let newTreaties: string[] = [];
      
      switch (action.type) {
        case 'embassy':
          standingChange = 15;
          break;
        case 'trade_deal':
          standingChange = 20;
          newTreaties = ['trade_deal'];
          break;
        case 'alliance':
          standingChange = 40;
          newTreaties = ['alliance'];
          break;
        case 'denounce':
          standingChange = -30;
          break;
        case 'declare_war':
          standingChange = -100;
          break;
        case 'peace_offer':
          standingChange = 25;
          break;
      }

      const relations = prev.diplomacy.relations.map(rel => {
        if (rel.factionId === action.targetFaction) {
          const newStanding = Math.max(-100, Math.min(100, rel.standing + standingChange));
          let status: DiplomaticRelation['status'] = rel.status;
          
          if (newStanding <= -75) status = 'War';
          else if (newStanding <= -25) status = 'Hostile';
          else if (newStanding < 25) status = 'Neutral';
          else if (newStanding < 75) status = 'Friendly';
          else status = 'Allied';
          
          return { 
            ...rel, 
            standing: newStanding, 
            status, 
            treaties: [...rel.treaties, ...newTreaties],
            lastInteraction: prev.turn 
          };
        }
        return rel;
      });

      success = true;
      toast.success(`Diplomatic action executed: ${action.type}`);

      return {
        ...prev,
        credits: newCredits,
        diplomacy: {
          ...prev.diplomacy,
          relations,
          influence: newInfluence,
          activeActions: [...prev.diplomacy.activeActions, action]
        }
      };
    });
    return success;
  }, [logResourceChange]);

  // Espionage Functions
  const deployAgent = useCallback((agentId: string, operation: Omit<EspionageOperation, 'id' | 'agentId' | 'status' | 'progress' | 'startTurn'>) => {
    let success = false;
    setGameState(prev => {
      const agent = prev.espionage.agents.find(a => a.id === agentId);
      if (!agent || agent.status !== 'Available') {
        toast.error("Agent not available for deployment");
        return prev;
      }

      if (prev.credits < operation.cost.credits) {
        toast.error("Insufficient credits for operation");
        return prev;
      }

      const newCredits = prev.credits - operation.cost.credits;
      const newStress = prev.stress + (operation.cost.stress || 0);

      logResourceChange('credits', -operation.cost.credits, newCredits, 'Espionage', `${operation.type} operation`);
      if (operation.cost.stress) {
        logResourceChange('stress', operation.cost.stress, newStress, 'Espionage', `${operation.type} operation stress`);
      }

      const newOperation: EspionageOperation = {
        ...operation,
        id: `op-${Date.now()}`,
        agentId,
        status: 'Active',
        progress: 0,
        startTurn: prev.turn,
      };

      const agents = prev.espionage.agents.map(a => 
        a.id === agentId ? { ...a, status: 'Deployed' as const, mission: operation.type } : a
      );

      success = true;
      toast.success(`Agent ${agent.codename} deployed on ${operation.type} mission`);

      return {
        ...prev,
        credits: newCredits,
        stress: Math.min(100, newStress),
        espionage: {
          ...prev.espionage,
          agents,
          operations: [...prev.espionage.operations, newOperation]
        }
      };
    });
    return success;
  }, [logResourceChange]);

  const recallAgent = useCallback((agentId: string) => {
    setGameState(prev => {
      const agents = prev.espionage.agents.map(a => 
        a.id === agentId ? { ...a, status: 'Available' as const, mission: undefined, location: undefined } : a
      );
      
      const operations = prev.espionage.operations.map(op => 
        op.agentId === agentId && op.status === 'Active' ? { ...op, status: 'Failed' as const } : op
      );

      toast.info("Agent recalled from mission");

      return {
        ...prev,
        espionage: { ...prev.espionage, agents, operations }
      };
    });
  }, []);

  const processOperations = useCallback(() => {
    setGameState(prev => {
      const operations = prev.espionage.operations.map(op => {
        if (op.status !== 'Active') return op;

        const turnsElapsed = prev.turn - op.startTurn;
        const progress = Math.min(100, (turnsElapsed / op.duration) * 100);

        if (progress >= 100) {
          // Operation complete - determine success based on agent skill and risk
          const agent = prev.espionage.agents.find(a => a.id === op.agentId);
          const successChance = agent ? (agent.skill - op.risk) / 100 : 0.5;
          const succeeded = Math.random() < successChance;

          if (succeeded) {
            toast.success(`Operation ${op.type} completed successfully!`);
            return { ...op, status: 'Complete' as const, progress: 100 };
          } else {
            toast.error(`Operation ${op.type} failed!`);
            return { ...op, status: 'Failed' as const, progress: 100 };
          }
        }

        return { ...op, progress };
      });

      // Update agent statuses for completed operations
      const completedOps = operations.filter(op => op.status === 'Complete' || op.status === 'Failed');
      const agents = prev.espionage.agents.map(a => {
        const completedOp = completedOps.find(op => op.agentId === a.id);
        if (completedOp) {
          return { ...a, status: 'Available' as const, mission: undefined };
        }
        return a;
      });

      return {
        ...prev,
        espionage: { ...prev.espionage, operations, agents }
      };
    });
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
      constructShip,
      updateDiplomaticRelation,
      executeDiplomaticAction,
      deployAgent,
      recallAgent,
      processOperations,
      resourceChangeLogs,
      logResourceChange,
      clearResourceLogs,
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
