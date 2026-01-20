import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Swords, Handshake, TrendingUp, TrendingDown, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const factionData = {
  ecclesiarchy: { name: 'Ecclesiarchy', color: 'amber' },
  praetorians: { name: 'Neo-Praetorians', color: 'red' },
  varangians: { name: 'Varangian Guard', color: 'blue' },
  merchant_houses: { name: 'Merchant Houses', color: 'green' },
  agentes_in_rebus: { name: 'Agentes in Rebus', color: 'purple' },
  scrinium_barbarorum: { name: 'Scrinium Barbarorum', color: 'violet' }
};

export default function FactionDynamicsPanel({ factions = [] }) {
  const alliances = [];
  const wars = [];
  const proposals = [];
  
  factions.forEach(faction => {
    // Collect alliances
    (faction.alliances || []).forEach(ally => {
      if (!alliances.some(a => 
        (a.faction1 === faction.faction_id && a.faction2 === ally) ||
        (a.faction2 === faction.faction_id && a.faction1 === ally)
      )) {
        alliances.push({
          faction1: faction.faction_id,
          faction2: ally,
          strength: 'active'
        });
      }
    });
    
    // Collect wars
    (faction.rivalries || []).forEach(rival => {
      if (!wars.some(w => 
        (w.faction1 === faction.faction_id && w.faction2 === rival) ||
        (w.faction2 === faction.faction_id && w.faction1 === rival)
      )) {
        wars.push({
          faction1: faction.faction_id,
          faction2: rival,
          intensity: 'active'
        });
      }
    });
    
    // Collect pending diplomatic actions
    (faction.diplomatic_actions || [])
      .filter(a => a.status === 'pending')
      .forEach(action => {
        proposals.push({
          from: faction.faction_id,
          to: action.target_faction,
          type: action.action_type,
          terms: action.terms
        });
      });
  });
  
  return (
    <div className="bg-slate-900/80 rounded-xl border border-cyan-900/30 p-4">
      <h3 className="text-cyan-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4" />
        Faction Dynamics
      </h3>
      
      <div className="space-y-4">
        {/* Active Alliances */}
        {alliances.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Handshake className="w-3 h-3" />
              Alliances ({alliances.length})
            </p>
            <div className="space-y-2">
              {alliances.map((alliance, i) => (
                <div key={i} className="bg-green-900/10 rounded-lg border border-green-500/30 p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-300">
                      {factionData[alliance.faction1]?.name || alliance.faction1}
                    </span>
                    <Handshake className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-300">
                      {factionData[alliance.faction2]?.name || alliance.faction2}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Active Wars */}
        {wars.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Swords className="w-3 h-3" />
              Conflicts ({wars.length})
            </p>
            <div className="space-y-2">
              {wars.map((war, i) => (
                <div key={i} className="bg-red-900/10 rounded-lg border border-red-500/30 p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-red-300">
                      {factionData[war.faction1]?.name || war.faction1}
                    </span>
                    <Swords className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-red-300">
                      {factionData[war.faction2]?.name || war.faction2}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Pending Proposals */}
        {proposals.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Pending Diplomacy ({proposals.length})
            </p>
            <div className="space-y-2">
              {proposals.map((prop, i) => (
                <div key={i} className="bg-blue-900/10 rounded-lg border border-blue-500/30 p-2">
                  <div className="text-[10px] text-blue-300">
                    {factionData[prop.from]?.name || prop.from} → {factionData[prop.to]?.name || prop.to}
                  </div>
                  <div className="text-[9px] text-gray-500 mt-1">
                    {prop.type.replace(/_/g, ' ')}: {prop.terms}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {alliances.length === 0 && wars.length === 0 && proposals.length === 0 && (
          <p className="text-xs text-gray-600 text-center py-4">
            No major faction dynamics at this time
          </p>
        )}
      </div>
    </div>
  );
}