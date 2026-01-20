import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, AlertTriangle } from 'lucide-react';
import { GovernorEvent } from '@/lib/governorEvents';

interface GovernorEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: GovernorEvent | null;
  onChoice: (choiceIndex: number) => void;
}

export function GovernorEventModal({ open, onOpenChange, event, onChoice }: GovernorEventModalProps) {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-white/20 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-[#D4AF37] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Governance Dilemma
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <User className="w-6 h-6 text-white/70" />
            </div>
            <div>
              <h3 className="font-medium text-white">{event.title}</h3>
              <p className="text-xs text-white/50">Triggered by {event.triggerTrait} Trait</p>
            </div>
          </div>

          <p className="text-sm text-white/80 leading-relaxed">
            {event.description}
          </p>

          <div className="space-y-3 mt-4">
            {event.choices.map((choice, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="w-full justify-between h-auto py-3 border-white/10 hover:bg-white/5 hover:border-[#D4AF37]/50 group"
                onClick={() => onChoice(idx)}
              >
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium text-white group-hover:text-[#D4AF37] transition-colors">
                    {choice.text}
                  </span>
                  <span className="text-xs text-white/50 mt-1">
                    {choice.effectDescription}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
