import React, { createContext, useContext, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

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
