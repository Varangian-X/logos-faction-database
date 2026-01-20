import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Zap, Users as UsersIcon, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

const STRESS_METERS = [
  { key: 'heart', label: 'Heart', icon: Heart, color: 'red', description: 'Physical Health' },
  { key: 'psyche', label: 'Psyche', icon: Brain, color: 'purple', description: 'Mental State' },
  { key: 'spirit', label: 'Spirit', icon: Zap, color: 'cyan', description: 'Emotional Well-being' },
  { key: 'presence', label: 'Presence', icon: UsersIcon, color: 'amber', description: 'Social Standing' },
  { key: 'capital', label: 'Capital', icon: Coins, color: 'green', description: 'Financial Health' }
];

function ClockMeter({ value, max = 100, color, label }) {
  const segments = 12;
  const filledSegments = Math.round((value / max) * segments);
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {Array.from({ length: segments }).map((_, i) => {
            const angle = (i * 360) / segments;
            const isFilled = i < filledSegments;
            const x1 = 50 + 40 * Math.cos((angle * Math.PI) / 180);
            const y1 = 50 + 40 * Math.sin((angle * Math.PI) / 180);
            const x2 = 50 + 48 * Math.cos((angle * Math.PI) / 180);
            const y2 = 50 + 48 * Math.sin((angle * Math.PI) / 180);
            
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isFilled ? `rgb(var(--color-${color}))` : 'rgb(71, 85, 105)'}
                strokeWidth="3"
                strokeLinecap="round"
                opacity={isFilled ? 1 : 0.3}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("text-2xl font-bold", `text-${color}-400`)}>
            {value}
          </span>
        </div>
      </div>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

export default function PlayerHealthPanel({ gameState }) {
  const stressMeters = gameState.stress_meters || {
    heart: 0,
    psyche: 0,
    spirit: 0,
    presence: 0,
    capital: 0
  };

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-cyan-400 text-sm">Operative Health Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-center gap-6">
          {STRESS_METERS.map(meter => {
            const Icon = meter.icon;
            return (
              <div key={meter.key} className="flex flex-col items-center">
                <ClockMeter
                  value={stressMeters[meter.key]}
                  max={100}
                  color={meter.color}
                  label={meter.label}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}