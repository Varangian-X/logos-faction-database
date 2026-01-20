import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Lock, Target, AlertTriangle } from 'lucide-react';
import { EspionageMission, ESPIONAGE_MISSIONS, resolveEspionage } from '@/lib/espionageMissions';
import { toast } from 'sonner';

export function EspionagePanel() {
  const [activeMissions, setActiveMissions] = useState<{mission: EspionageMission, turnsLeft: number}[]>([]);
  const [logs, setLogs] = useState<{timestamp: string, message: string, success: boolean}[]>([]);

  const handleLaunchMission = (mission: EspionageMission) => {
    // In a real implementation, we would deduct resources here
    const result = resolveEspionage(mission);
    
    const newLog = {
      timestamp: new Date().toLocaleTimeString(),
      message: result.log,
      success: result.success
    };
    
    setLogs([newLog, ...logs]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Mission Selection */}
      <Card className="bg-black/40 border-white/10 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-serif text-[#D4AF37] flex items-center gap-2">
            <Eye className="w-5 h-5" /> Covert Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ESPIONAGE_MISSIONS.map(mission => (
              <div key={mission.id} className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">{mission.name}</h4>
                  <Badge variant="outline" className={`
                    ${mission.difficulty === 'Low' ? 'text-green-400 border-green-500/50' : ''}
                    ${mission.difficulty === 'Medium' ? 'text-yellow-400 border-yellow-500/50' : ''}
                    ${mission.difficulty === 'High' ? 'text-orange-400 border-orange-500/50' : ''}
                    ${mission.difficulty === 'Extreme' ? 'text-red-400 border-red-500/50' : ''}
                  `}>
                    {mission.difficulty}
                  </Badge>
                </div>
                <p className="text-xs text-white/60 mb-4 h-10">{mission.description}</p>
                
                <div className="flex justify-between items-center text-xs text-white/40 mb-4">
                  <span>Chance: {Math.round(mission.successChance * 100)}%</span>
                  <span>Duration: {mission.duration} turns</span>
                </div>
                
                <div className="flex justify-between items-center border-t border-white/10 pt-3">
                  <div className="text-xs">
                    <span className="text-amber-400 mr-2">{mission.cost.credits} CR</span>
                    <span className="text-cyan-400">{mission.cost.tech} TECH</span>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => handleLaunchMission(mission)}>
                    Launch
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Intelligence Logs */}
      <Card className="bg-black/40 border-white/10 md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-serif text-[#D4AF37] flex items-center gap-2">
            <Lock className="w-5 h-5" /> Intelligence Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-white/40 italic">
                  No active intelligence reports.
                </div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className={`p-3 rounded border text-xs ${
                    log.success 
                      ? 'bg-green-900/10 border-green-500/30 text-green-200' 
                      : 'bg-red-900/10 border-red-500/30 text-red-200'
                  }`}>
                    <div className="flex justify-between mb-1 opacity-50">
                      <span>{log.timestamp}</span>
                      <span>{log.success ? 'SUCCESS' : 'FAILURE'}</span>
                    </div>
                    <p>{log.message}</p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
