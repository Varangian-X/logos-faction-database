import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { SectorEvent } from '@/lib/sectorWideEvents';

interface SectorEventsPanelProps {
  events: SectorEvent[];
  currentYear: number;
}

export function SectorEventsPanel({ events, currentYear }: SectorEventsPanelProps) {
  const activeEvents = events.filter(
    (event) => currentYear >= event.startYear && currentYear <= event.startYear + event.duration
  );

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Disaster':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'Opportunity':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'Conflict':
        return <Zap className="w-4 h-4 text-orange-500" />;
      case 'Anomaly':
        return <Zap className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Severe':
        return 'text-red-400 border-red-400/50';
      case 'Moderate':
        return 'text-yellow-400 border-yellow-400/50';
      case 'Minor':
        return 'text-green-400 border-green-400/50';
      default:
        return 'text-white/70 border-white/20';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-serif text-white">Sector-Wide Events</h3>

      {activeEvents.length === 0 ? (
        <Card className="bg-black/40 border-white/10">
          <CardContent className="p-8 text-center">
            <p className="text-white/50">No active events in this sector.</p>
          </CardContent>
        </Card>
      ) : (
        activeEvents.map((event) => {
          const yearsRemaining = event.startYear + event.duration - currentYear;
          const totalDuration = event.duration;
          const progressPercent = ((totalDuration - yearsRemaining) / totalDuration) * 100;

          return (
            <Card key={event.id} className="bg-black/40 border-white/10 hover:bg-white/5 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getEventIcon(event.type)}
                    <div>
                      <h4 className="font-serif text-white">{event.name}</h4>
                      <p className="text-xs text-white/50 mt-1">{event.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getSeverityColor(event.severity)}>
                    {event.severity}
                  </Badge>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>Duration</span>
                    <span>{yearsRemaining} years remaining</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#D4AF37] h-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Effects */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className={event.effects.creditsModifier < 0 ? 'text-red-400' : 'text-green-400'}>
                    <div className="text-white/50">Credits</div>
                    <div className="font-mono">{event.effects.creditsModifier > 0 ? '+' : ''}{event.effects.creditsModifier}%</div>
                  </div>
                  <div className={event.effects.techModifier < 0 ? 'text-red-400' : 'text-green-400'}>
                    <div className="text-white/50">Tech</div>
                    <div className="font-mono">{event.effects.techModifier > 0 ? '+' : ''}{event.effects.techModifier}%</div>
                  </div>
                  <div className={event.effects.manpowerModifier < 0 ? 'text-red-400' : 'text-green-400'}>
                    <div className="text-white/50">Manpower</div>
                    <div className="font-mono">{event.effects.manpowerModifier > 0 ? '+' : ''}{event.effects.manpowerModifier}%</div>
                  </div>
                </div>

                {/* Affected Regions */}
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-white/50 mb-2">Affected Regions:</p>
                  <div className="flex flex-wrap gap-1">
                    {event.affectedRegions.map((region) => (
                      <Badge key={region} variant="outline" className="text-white/70 border-white/20 text-[10px]">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
