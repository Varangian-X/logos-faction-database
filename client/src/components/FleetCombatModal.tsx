import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Swords, Shield, Skull } from 'lucide-react';
import { CombatResult } from '@/lib/fleetCombat';
import { SHIP_CLASSES } from '@/lib/fleetManagement';

interface FleetCombatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: CombatResult | null;
}

export function FleetCombatModal({ open, onOpenChange, result }: FleetCombatModalProps) {
  if (!result) return null;

  const getShipName = (id: string) => SHIP_CLASSES.find(s => s.id === id)?.name || id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-white/20 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-[#D4AF37] flex items-center gap-2">
            <Swords className="w-6 h-6" /> Combat Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Winner Banner */}
          <div className={`p-4 rounded-lg border text-center ${
            result.winner === 'Attacker' 
              ? 'bg-green-900/20 border-green-500/50 text-green-400' 
              : 'bg-red-900/20 border-red-500/50 text-red-400'
          }`}>
            <h3 className="text-xl font-bold uppercase tracking-widest">
              {result.winner === 'Attacker' ? 'Victory' : 'Defeat'}
            </h3>
            {result.loot && (
              <div className="mt-2 text-sm text-amber-400">
                Loot Secured: {result.loot.credits} Credits
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Attacker Losses */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white/60 uppercase flex items-center gap-2">
                <Swords className="w-4 h-4" /> Your Losses
              </h4>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10 min-h-[100px]">
                {result.attackerLosses.length === 0 ? (
                  <div className="text-green-400 text-sm">No casualties reported.</div>
                ) : (
                  result.attackerLosses.map((loss, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm mb-1">
                      <span className="text-white/80">{getShipName(loss.shipClassId)}</span>
                      <Badge variant="destructive" className="h-5 text-[10px]">
                        -{loss.count}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Defender Losses */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white/60 uppercase flex items-center gap-2">
                <Shield className="w-4 h-4" /> Enemy Losses
              </h4>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10 min-h-[100px]">
                {result.defenderLosses.length === 0 ? (
                  <div className="text-red-400 text-sm">Enemy sustained no damage.</div>
                ) : (
                  result.defenderLosses.map((loss, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm mb-1">
                      <span className="text-white/80">{getShipName(loss.shipClassId)}</span>
                      <Badge variant="destructive" className="h-5 text-[10px]">
                        -{loss.count}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Combat Log */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white/60 uppercase">Tactical Log</h4>
            <ScrollArea className="h-[150px] w-full rounded-md border border-white/10 bg-black/50 p-4">
              {result.log.map((entry, i) => (
                <div key={i} className="text-xs font-mono text-white/70 mb-1">
                  {`> ${entry}`}
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="bg-white/10 hover:bg-white/20 text-white">
            Dismiss
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
