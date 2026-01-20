import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Sparkles, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStressStatus, calculateTotalStress } from './StressMeterSystem';

const meterIcons = {
  heart: Heart,
  psyche: Brain,
  spirit: Sparkles,
  presence: Users,
  capital: DollarSign
};

const meterColors = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500'
};

const meterLabels = {
  heart: 'Heart',
  psyche: 'Psyche',
  spirit: 'Spirit',
  presence: 'Presence',
  capital: 'Capital'
};

export default function StressMeterUI({ gameState, compact = false }) {
  const meters = gameState.stress_meters || {};
  const totalStress = calculateTotalStress(meters);

  if (compact) {
    return (
      <Card className="bg-slate-900/80 border-red-900/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-400 text-xs uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-3 h-3" />
            Systemic Stress: {totalStress}%
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(meters).map(([meter, value]) => {
            const status = getStressStatus(meter, value);
            const Icon = meterIcons[meter];
            
            return (
              <div key={meter} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Icon className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-300">{meterLabels[meter]}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-[9px] px-1 py-0",
                      `border-${status.color}-500/50 text-${status.color}-400`
                    )}
                  >
                    {status.status}
                  </Badge>
                </div>
                <Progress 
                  value={value} 
                  className="h-1.5 bg-slate-800"
                  indicatorClassName={meterColors[status.color]}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/80 border-red-900/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-red-400 uppercase tracking-wider text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Stress Axis Monitor
          </CardTitle>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-300">{totalStress}%</div>
            <div className="text-[9px] text-gray-500 uppercase">Total Tension</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(meters).map(([meter, value]) => {
          const status = getStressStatus(meter, value);
          const Icon = meterIcons[meter];
          
          return (
            <div key={meter} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={cn("w-4 h-4", `text-${status.color}-400`)} />
                  <span className="text-sm font-semibold text-gray-200">
                    {meterLabels[meter]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{value}%</span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-[10px]",
                      `border-${status.color}-500/50 text-${status.color}-400`
                    )}
                  >
                    {status.status}
                  </Badge>
                </div>
              </div>
              <Progress 
                value={value} 
                className="h-2 bg-slate-800"
                indicatorClassName={meterColors[status.color]}
              />
              {status.penalty && (
                <div className="text-[9px] text-gray-500 ml-6">
                  {Object.entries(status.penalty).map(([key, val]) => (
                    <span key={key} className="mr-2">
                      {key}: {val}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        
        {totalStress >= 50 && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-2 mt-3">
            <p className="text-xs text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-3 h-3" />
              High stress! Risk of fallout consequences.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}