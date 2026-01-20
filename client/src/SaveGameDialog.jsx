import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { saveGame, getSaveSlots } from './SaveGameManager';
import { toast } from 'sonner';

export default function SaveGameDialog({ 
  open, 
  onOpenChange, 
  gameState, 
  saveType = 'manual',
  onSaveComplete 
}) {
  const [saveName, setSaveName] = useState('');
  const [existingSave, setExistingSave] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (open) {
      loadExistingSave();
      if (saveType === 'manual') {
        setSaveName(`Save - Turn ${gameState?.turn_number || 1}`);
      }
    }
  }, [open, saveType, gameState]);

  const loadExistingSave = async () => {
    const slots = await getSaveSlots();
    const existing = saveType === 'manual' ? slots.manual : slots.auto;
    setExistingSave(existing);
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const result = await saveGame(gameState, saveType, saveType === 'manual' ? saveName : null);
      
      if (result.success) {
        toast.success(result.message);
        onSaveComplete?.(result);
        onOpenChange(false);
        setShowConfirm(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to save game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOverwrite = () => {
    setShowConfirm(false);
    handleSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-100">
            {saveType === 'manual' ? <Save className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            {saveType === 'manual' ? 'Save Game' : 'Auto-Save'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {saveType === 'manual' 
              ? `Choose a save slot (${existingSave?.length || 0}/3 used)`
              : 'Auto-saving your progress...'}
          </DialogDescription>
        </DialogHeader>

        <div>
            {saveType === 'manual' && (
              <>
                <div className="mb-4">
                  <label className="text-sm text-gray-400 mb-2 block">Save Name</label>
                  <Input
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder="Enter save name..."
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                
                {Array.isArray(existingSave) && existingSave.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Existing Saves:</p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {existingSave.map(save => (
                        <div key={save.id} className="bg-slate-800 rounded p-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-200">Slot {save.slot_number}</span>
                            <span className="text-gray-500">Turn {save.turn_number}</span>
                          </div>
                          <div className="text-gray-400 mt-1">{save.save_name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="bg-slate-800 rounded-lg p-3 mb-4">
              <div className="text-xs text-gray-400 mb-2">Current Progress:</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Character:</span>
                  <span className="text-gray-200 ml-2">{gameState?.character_name}</span>
                </div>
                <div>
                  <span className="text-gray-500">Turn:</span>
                  <span className="text-gray-200 ml-2">{gameState?.turn_number}</span>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <span className="text-gray-200 ml-2">{gameState?.current_location}</span>
                </div>
                <div>
                  <span className="text-gray-500">Credits:</span>
                  <span className="text-gray-200 ml-2">{gameState?.credits}₵</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-slate-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading || (saveType === 'manual' && !saveName.trim())}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {saveType === 'manual' ? 'Save Game' : 'Auto-Save Now'}
              </Button>
            </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}