import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import SaveGameDialog from './SaveGameDialog';

export default function SaveButton({ gameState, className = '' }) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  if (!gameState) return null;

  return (
    <>
      <Button
        size="sm"
        onClick={() => setShowSaveDialog(true)}
        className={`bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/50 text-amber-300 ${className}`}
      >
        <Save className="w-3 h-3 mr-1" />
        Save
      </Button>

      <SaveGameDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        gameState={gameState}
        saveType="manual"
      />
    </>
  );
}