import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Swords, Shield, TrendingUp, Eye, Users, 
  AlertTriangle, Clock, Target, ChevronDown, ChevronUp, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import FactionHealthUI from '@/components/stress/FactionHealthUI';

const operationIcons = {
  military: Swords,
  espionage: Eye,
  economic: TrendingUp,
  diplomatic: Users,
  sabotage: AlertTriangle,
  recruitment: Target
};

const operationColors = {
  military: 'red',
  espionage: 'purple',
  economic: 'green',
  diplomatic: 'blue',
  sabotage: 'orange',
  recruitment: 'cyan'
};

export default function FactionOperationsPanel({ factions = [], compact = false }) {
  const [expandedFaction, setExpandedFaction] = useState(null);
  
  const activeOperations = factions.flatMap(faction => 
    (faction.active_operations || []).map(op => ({
      ...op,
      faction_name: faction.name,
      faction_id: faction.faction_id
    }))
  );
  
  if (activeOperations.length === 0) {
    return null;
  }
  
  if (compact) {
    return (
      <div className="bg-slate-900/80 rounded-xl border border-red-900/30 p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-red-400 font-semibold uppercase tracking-wider text-xs flex items-center gap-2">
            <AlertTriangle className="w-3 h-3" />
            Faction Operations
          </h3>
          <span className="text-[10px] text-gray-500">
            Active: {activeOperations.length}
          </span>
        </div>
        
        <div className="space-y-2">
          {activeOperations.slice(0, 3).map((op, i) => {
            const OpIcon = operationIcons[op.operation_type] || Swords;
            const color = operationColors[op.operation_type];
            
            return (
              <div key={i} className="text-xs bg-slate-800/50 rounded p-2 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <OpIcon className={`w-3 h-3 text-${color}-400`} />
                  <span className="text-gray-300 text-[10px] flex-1 truncate">{op.operation_name}</span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-gray-500">
                  <span>{op.faction_name}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-2 h-2" />
                    {op.turns_remaining}T
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-slate-900/80 rounded-xl border border-red-900/30 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-red-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Active Faction Operations
        </h3>
        <span className="text-xs text-gray-500">
          {activeOperations.length} ongoing
        </span>
      </div>
      
      <div className="space-y-3">
        {activeOperations.map((op, index) => {
          const OpIcon = operationIcons[op.operation_type] || Swords;
          const color = operationColors[op.operation_type];
          const progress = ((3 - op.turns_remaining) / 3) * 100; // Assuming 3 turn ops
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-3 cursor-pointer"
              onClick={() => setExpandedFaction(expandedFaction === op.faction_id ? null : op.faction_id)}
            >
              <div className="flex items-start gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg bg-${color}-500/20 flex items-center justify-center border border-${color}-500/30 flex-shrink-0`}>
                  <OpIcon className={`w-4 h-4 text-${color}-400`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-gray-200">{op.operation_name}</h4>
                    <Badge className={`text-[8px] bg-${color}-500/20 text-${color}-400 border-${color}-500/30`}>
                      {op.operation_type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    {op.faction_name} targeting {op.target}
                  </p>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {op.turns_remaining} turns remaining
                      </span>
                      <span className={`text-${color}-400`}>
                        {op.success_chance}% success
                      </span>
                    </div>
                    <Progress 
                      value={progress} 
                      className="h-1 bg-slate-950/50"
                      indicatorClassName={`bg-${color}-500`}
                    />
                  </div>
                </div>
                
                <button className="ml-auto">
                  {expandedFaction === op.faction_id ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
              
              {expandedFaction === op.faction_id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-slate-700/50"
                >
                  <div className="text-[10px] text-gray-500 mb-2 flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    <span>Faction Capabilities</span>
                  </div>
                  <FactionHealthUI 
                    faction={factions.find(f => f.faction_id === op.faction_id) || { faction_health: {} }}
                    compact={true}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}