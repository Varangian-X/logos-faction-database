import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Eye, Shield, Ban, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const actionIcons = {
  espionage: Eye,
  sabotage: Flame,
  assassination: Flame,
  counter_intelligence: Shield,
  propaganda: Flame,
  bribery: Eye
};

export default function CovertActionManager({ 
  activeOperations = [],
  onCancelOperation,
  onViewDetails,
  isProcessing 
}) {
  if (activeOperations.length === 0) {
    return (
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-gray-400 text-sm">Ongoing Operations</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <Shield className="w-12 h-12 text-gray-700 mx-auto mb-2" />
          <p className="text-xs text-gray-500">No active covert operations</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-slate-900/80 border-red-500/30">
      <CardHeader>
        <CardTitle className="text-red-400 text-sm flex items-center gap-2">
          <Flame className="w-4 h-4" />
          Ongoing Operations ({activeOperations.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeOperations.map(op => {
          const Icon = actionIcons[op.type] || Flame;
          const progress = ((op.duration - op.turns_remaining) / op.duration) * 100;
          
          return (
            <div key={op.operation_id} className="bg-slate-800/50 rounded-lg p-3 border border-red-500/20">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2 flex-1">
                  <Icon className="w-4 h-4 text-red-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-red-300 capitalize">
                      {op.type.replace('_', ' ')}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Target: {op.target_house_name}
                    </p>
                  </div>
                </div>
                
                <Badge className="bg-amber-500/20 text-amber-400 text-[9px]">
                  {op.turns_remaining}t left
                </Badge>
              </div>
              
              <div className="space-y-1 mb-2">
                <div className="flex justify-between text-[9px] text-gray-500">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1 bg-slate-900" />
              </div>
              
              {op.intel_per_turn && (
                <p className="text-[10px] text-cyan-400 mb-2">
                  Generating: +{op.intel_per_turn} intel/turn
                </p>
              )}
              
              <div className="flex gap-2">
                <Button
                  onClick={() => onViewDetails(op)}
                  size="sm"
                  variant="ghost"
                  className="flex-1 h-7 text-[10px] text-gray-400 hover:text-gray-300"
                >
                  <ChevronRight className="w-3 h-3 mr-1" />
                  Details
                </Button>
                <Button
                  onClick={() => onCancelOperation(op.operation_id)}
                  disabled={isProcessing}
                  size="sm"
                  variant="ghost"
                  className="flex-1 h-7 text-[10px] text-red-400 hover:text-red-300"
                >
                  <Ban className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}