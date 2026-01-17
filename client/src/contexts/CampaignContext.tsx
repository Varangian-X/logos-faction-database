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
}

interface CampaignContextType {
  savedScenarios: SavedScenario[];
  saveScenario: (scenario: Omit<SavedScenario, 'id' | 'createdAt'>) => void;
  deleteScenario: (id: string) => void;
  updateScenarioNotes: (id: string, notes: string) => void;
  clearCampaign: () => void;
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

  const saveScenario = (scenario: Omit<SavedScenario, 'id' | 'createdAt'>) => {
    const newScenario: SavedScenario = {
      ...scenario,
      id: nanoid(),
      createdAt: Date.now(),
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

  const clearCampaign = () => {
    if (window.confirm('Are you sure you want to clear all saved scenarios? This cannot be undone.')) {
      setSavedScenarios([]);
    }
  };

  return (
    <CampaignContext.Provider value={{ 
      savedScenarios, 
      saveScenario, 
      deleteScenario, 
      updateScenarioNotes,
      clearCampaign 
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
