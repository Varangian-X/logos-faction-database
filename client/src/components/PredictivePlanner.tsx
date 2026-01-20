import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SavedScenario } from '@/contexts/CampaignContext';
import { predictMissionOutcome, PredictionResult } from '@/lib/predictiveAnalysis';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PredictivePlannerProps {
  mission: SavedScenario;
  currentReputation: Record<string, number>;
}

export function PredictivePlanner({ mission, currentReputation }: PredictivePlannerProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<'success' | 'failure'>('success');
  
  const predictions = predictMissionOutcome(mission, currentReputation, selectedOutcome);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  const getRiskBg = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-900/20 border-red-900/50';
      case 'high': return 'bg-orange-900/20 border-orange-900/50';
      case 'medium': return 'bg-yellow-900/20 border-yellow-900/50';
      default: return 'bg-green-900/20 border-green-900/50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-amber-100">Predictive Analysis: "What-If" Planner</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={selectedOutcome === 'success' ? 'default' : 'outline'}
            onClick={() => setSelectedOutcome('success')}
            className={selectedOutcome === 'success' ? 'bg-green-600 hover:bg-green-700' : 'border-green-600/50 text-green-500'}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Success Scenario
          </Button>
          <Button
            size="sm"
            variant={selectedOutcome === 'failure' ? 'destructive' : 'outline'}
            onClick={() => setSelectedOutcome('failure')}
            className={selectedOutcome === 'failure' ? 'bg-red-600 hover:bg-red-700' : 'border-red-600/50 text-red-500'}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Failure Scenario
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {predictions.map((pred, idx) => (
          <Card key={idx} className={`p-4 border ${getRiskBg(pred.riskLevel)}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-amber-100">{pred.faction}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded border ${getRiskBg(pred.riskLevel)} ${getRiskColor(pred.riskLevel)} uppercase tracking-wider`}>
                    {pred.riskLevel} Risk
                  </span>
                </div>
                
                <p className="text-sm text-white/70 mb-3">{pred.consequence}</p>
                
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex flex-col">
                    <span className="text-white/40">Current Rep</span>
                    <span className={pred.currentRep > 0 ? 'text-green-400' : pred.currentRep < 0 ? 'text-red-400' : 'text-white/60'}>
                      {pred.currentRep > 0 ? '+' : ''}{pred.currentRep}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-white/20">
                    {pred.change > 0 ? <TrendingUp className="w-4 h-4" /> : pred.change < 0 ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-white/40">Predicted Rep</span>
                    <span className={`font-bold ${pred.predictedRep > 0 ? 'text-green-400' : pred.predictedRep < 0 ? 'text-red-400' : 'text-white/60'}`}>
                      {pred.predictedRep > 0 ? '+' : ''}{pred.predictedRep}
                    </span>
                  </div>
                  
                  <div className="flex flex-col ml-4">
                    <span className="text-white/40">Net Change</span>
                    <span className={pred.change > 0 ? 'text-green-400' : pred.change < 0 ? 'text-red-400' : 'text-white/60'}>
                      {pred.change > 0 ? '+' : ''}{pred.change}
                    </span>
                  </div>
                </div>
              </div>
              
              {pred.riskLevel === 'critical' && (
                <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
              )}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="text-xs text-white/40 italic border-t border-white/10 pt-4">
        * Predictions are estimates based on current intelligence. Actual outcomes may vary due to unforeseen complications or hidden faction agendas.
      </div>
    </div>
  );
}
