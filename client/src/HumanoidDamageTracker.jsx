import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const BODY_PARTS = [
  { id: 'head', label: 'Head', x: 50, y: 15 },
  { id: 'torso', label: 'Torso', x: 50, y: 40 },
  { id: 'left_arm', label: 'L Arm', x: 25, y: 40 },
  { id: 'right_arm', label: 'R Arm', x: 75, y: 40 },
  { id: 'left_leg', label: 'L Leg', x: 40, y: 70 },
  { id: 'right_leg', label: 'R Leg', x: 60, y: 70 }
];

const SEVERITY_COLORS = {
  bruised: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  impaired: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  terminated: 'bg-red-900/40 text-red-300 border-red-700/50'
};

export default function HumanoidDamageTracker({ gameState }) {
  const injuries = gameState.injuries || [];
  const gearInventory = gameState.gear_inventory || {};

  const getPartStatus = (partId) => {
    const injury = injuries.find(i => i.body_part === partId);
    return injury?.severity || 'healthy';
  };

  const getPartGear = (partId) => {
    return gearInventory[partId];
  };

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Body Status & Equipment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Humanoid Display */}
          <div className="relative h-64 bg-slate-800/50 rounded-lg p-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Body outline */}
              <ellipse cx="50" cy="15" rx="8" ry="10" fill="none" stroke="rgb(148, 163, 184)" strokeWidth="1" />
              <rect x="42" y="25" width="16" height="25" rx="2" fill="none" stroke="rgb(148, 163, 184)" strokeWidth="1" />
              <line x1="42" y1="30" x2="25" y2="45" stroke="rgb(148, 163, 184)" strokeWidth="1" />
              <line x1="58" y1="30" x2="75" y2="45" stroke="rgb(148, 163, 184)" strokeWidth="1" />
              <line x1="45" y1="50" x2="40" y2="75" stroke="rgb(148, 163, 184)" strokeWidth="1" />
              <line x1="55" y1="50" x2="60" y2="75" stroke="rgb(148, 163, 184)" strokeWidth="1" />

              {/* Body part indicators */}
              {BODY_PARTS.map(part => {
                const status = getPartStatus(part.id);
                const isInjured = status !== 'healthy';
                return (
                  <circle
                    key={part.id}
                    cx={part.x}
                    cy={part.y}
                    r="5"
                    fill={isInjured ? 'rgb(239, 68, 68)' : 'rgb(34, 197, 94)'}
                    opacity={isInjured ? 0.8 : 0.5}
                  />
                );
              })}
            </svg>
          </div>

          {/* Status List */}
          <div className="space-y-2">
            {BODY_PARTS.map(part => {
              const injury = injuries.find(i => i.body_part === part.id);
              const gear = getPartGear(part.id);
              const status = getPartStatus(part.id);

              return (
                <div key={part.id} className="bg-slate-800/50 rounded p-2 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-300">{part.label}</span>
                    {status !== 'healthy' && (
                      <Badge className={cn("text-[8px] px-1 py-0", SEVERITY_COLORS[status])}>
                        {status}
                      </Badge>
                    )}
                  </div>
                  {gear ? (
                    <div className="text-[10px] text-cyan-400">
                      {gear.name || 'Equipped'}
                    </div>
                  ) : (
                    <div className="text-[10px] text-gray-600">No gear</div>
                  )}
                  {injury && injury.penalty && (
                    <div className="text-[9px] text-red-400 mt-1">
                      Penalty: {JSON.stringify(injury.penalty)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}