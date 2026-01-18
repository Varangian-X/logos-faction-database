import React, { createContext, useContext, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

export interface MissionOutcome {
  id: string;
  missionId: string;
  outcome: 'success' | 'partial' | 'failure';
  factionEffects: Record<string, number>; // faction name -> reputation change
  consequences: string[];
  nextMissionIds: string[];
  completedAt: number;
}

export interface BranchingPath {
  id: string;
  parentMissionId: string;
  condition: 'success' | 'partial' | 'failure';
  nextMissionId: string;
  description: string;
}

export interface SavedScenario {
  id: string;
  title: string;
  type: string;
  description: string;
  location: string;
  faction: string;
  year: number;
  objectives: string[];
  complications: string[];
  rewards: string[];
  createdAt: number;
  notes?: string;
  status: 'active' | 'completed' | 'failed';
  parentMissionId?: string; // Links to previous mission in chain
  outcome?: MissionOutcome;
  factionReputation?: Record<string, number>; // Cumulative faction standing
  branchingPaths?: BranchingPath[];
}

interface CampaignContextType {
  savedScenarios: SavedScenario[];
  saveScenario: (scenario: Omit<SavedScenario, 'id' | 'createdAt' | 'status'>) => void;
  deleteScenario: (id: string) => void;
  updateScenarioNotes: (id: string, notes: string) => void;
  updateScenarioStatus: (id: string, status: 'active' | 'completed' | 'failed') => void;
  clearCampaign: () => void;
  importCampaign: (scenarios: SavedScenario[], merge: boolean) => void;
  getStatistics: () => {
    total: number;
    active: number;
    completed: number;
    failed: number;
    byType: Record<string, number>;
    byFaction: Record<string, number>;
  };
  recordMissionOutcome: (missionId: string, outcome: 'success' | 'partial' | 'failure', factionEffects: Record<string, number>, consequences: string[]) => void;
  getAvailableBranches: (missionId: string) => SavedScenario[];
  getFactionReputation: (missionId: string) => Record<string, number>;
  generateBranchedMission: (parentMissionId: string, outcome: 'success' | 'partial' | 'failure') => SavedScenario | null;
  getMissionChain: (missionId: string) => SavedScenario[];
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: React.ReactNode }) {
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>(() => {
    const saved = localStorage.getItem('logos-campaign-scenarios');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('logos-campaign-scenarios', JSON.stringify(savedScenarios));
  }, [savedScenarios]);

  const saveScenario = (scenario: Omit<SavedScenario, 'id' | 'createdAt' | 'status'>) => {
    const newScenario: SavedScenario = {
      ...scenario,
      id: nanoid(),
      createdAt: Date.now(),
      status: 'active',
    };
    setSavedScenarios(prev => [newScenario, ...prev]);
  };

  const deleteScenario = (id: string) => {
    setSavedScenarios(prev => prev.filter(s => s.id !== id));
  };

  const updateScenarioNotes = (id: string, notes: string) => {
    setSavedScenarios(prev => prev.map(s => 
      s.id === id ? { ...s, notes } : s
    ));
  };

  const updateScenarioStatus = (id: string, status: 'active' | 'completed' | 'failed') => {
    setSavedScenarios(prev => prev.map(s =>
      s.id === id ? { ...s, status } : s
    ));
  };

  const clearCampaign = () => {
    if (window.confirm('Are you sure you want to clear all saved scenarios? This cannot be undone.')) {
      setSavedScenarios([]);
    }
  };

  const importCampaign = (scenarios: SavedScenario[], merge: boolean) => {
    if (merge) {
      // Merge with existing scenarios - regenerate IDs to avoid conflicts
      const importedScenarios = scenarios.map(s => ({
        ...s,
        id: nanoid(),
        createdAt: s.createdAt || Date.now(),
      }));
      setSavedScenarios(prev => [...importedScenarios, ...prev]);
    } else {
      // Replace existing scenarios
      const importedScenarios = scenarios.map(s => ({
        ...s,
        id: nanoid(),
        createdAt: s.createdAt || Date.now(),
      }));
      setSavedScenarios(importedScenarios);
    }
  };

  const recordMissionOutcome = (missionId: string, outcome: 'success' | 'partial' | 'failure', factionEffects: Record<string, number>, consequences: string[]) => {
    setSavedScenarios(prev => prev.map(s => {
      if (s.id === missionId) {
        const currentReputation = s.factionReputation || {};
        const updatedReputation = { ...currentReputation };
        Object.entries(factionEffects).forEach(([faction, change]) => {
          updatedReputation[faction] = (updatedReputation[faction] || 0) + change;
        });
        return {
          ...s,
          status: outcome === 'failure' ? 'failed' : 'completed',
          outcome: {
            id: nanoid(),
            missionId,
            outcome,
            factionEffects,
            consequences,
            nextMissionIds: [],
            completedAt: Date.now(),
          },
          factionReputation: updatedReputation,
        };
      }
      return s;
    }));
  };

  const getFactionReputation = (missionId: string): Record<string, number> => {
    const mission = savedScenarios.find(s => s.id === missionId);
    return mission?.factionReputation || {};
  };

  const getMissionChain = (missionId: string): SavedScenario[] => {
    const chain: SavedScenario[] = [];
    let current = savedScenarios.find(s => s.id === missionId);
    
    while (current) {
      chain.unshift(current);
      if (current.parentMissionId) {
        current = savedScenarios.find(s => s.id === current!.parentMissionId);
      } else {
        break;
      }
    }
    return chain;
  };

  const getAvailableBranches = (missionId: string): SavedScenario[] => {
    return savedScenarios.filter(s => s.parentMissionId === missionId && s.status === 'active');
  };

  const generateBranchedMission = (parentMissionId: string, outcome: 'success' | 'partial' | 'failure'): SavedScenario | null => {
    const parentMission = savedScenarios.find(s => s.id === parentMissionId);
    if (!parentMission) return null;

    // Determine reputation modifiers based on outcome
    const repModifier = outcome === 'success' ? 1 : outcome === 'partial' ? 0.5 : -1;
    const currentRep = parentMission.factionReputation || {};

    // Generate branched mission based on outcome and faction standing
    const branchedMission: SavedScenario = {
      id: nanoid(),
      title: `${parentMission.title} - Aftermath`,
      type: parentMission.type,
      description: `Consequences of your previous mission. Outcome: ${outcome}`,
      location: parentMission.location,
      faction: parentMission.faction,
      year: parentMission.year + 1,
      objectives: [`Handle the aftermath of your ${outcome} mission`],
      complications: outcome === 'failure' ? ['Enemies are emboldened', 'Resources are depleted'] : ['New opportunities emerge'],
      rewards: outcome === 'success' ? ['Increased faction favor', 'Strategic advantage'] : ['Redemption opportunity'],
      createdAt: Date.now(),
      status: 'active',
      parentMissionId,
      factionReputation: currentRep,
    };

    setSavedScenarios(prev => [branchedMission, ...prev]);
    return branchedMission;
  };

  const getStatistics = () => {
    const stats = {
      total: savedScenarios.length,
      active: 0,
      completed: 0,
      failed: 0,
      byType: {} as Record<string, number>,
      byFaction: {} as Record<string, number>,
    };

    savedScenarios.forEach(scenario => {
      if (scenario.status === 'active') stats.active++;
      else if (scenario.status === 'completed') stats.completed++;
      else if (scenario.status === 'failed') stats.failed++;

      stats.byType[scenario.type] = (stats.byType[scenario.type] || 0) + 1;
      stats.byFaction[scenario.faction] = (stats.byFaction[scenario.faction] || 0) + 1;
    });

    return stats;
  };

  return (
    <CampaignContext.Provider value={{ 
      savedScenarios, 
      saveScenario, 
      deleteScenario, 
      updateScenarioNotes,
      updateScenarioStatus,
      clearCampaign,
      importCampaign,
      getStatistics,
      recordMissionOutcome,
      getAvailableBranches,
      getFactionReputation,
      generateBranchedMission,
      getMissionChain,
    }}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
}

export function validateCampaignJSON(data: unknown): data is SavedScenario[] {
  if (!Array.isArray(data)) return false;
  return data.every(item => 
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'title' in item &&
    'type' in item &&
    'description' in item &&
    'location' in item &&
    'faction' in item &&
    'year' in item &&
    'objectives' in item &&
    'complications' in item &&
    'rewards' in item
  );
}

export function calculateFactionInfluence(scenario: SavedScenario): Record<string, number> {
  const influence: Record<string, number> = {};
  
  // Base influence from faction
  influence[scenario.faction] = scenario.status === 'completed' ? 10 : scenario.status === 'failed' ? -5 : 0;
  
  // Outcome modifiers
  if (scenario.outcome) {
    Object.entries(scenario.outcome.factionEffects).forEach(([faction, effect]) => {
      influence[faction] = (influence[faction] || 0) + effect;
    });
  }
  
  return influence;
}
