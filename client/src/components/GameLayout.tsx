import React from 'react';
import { useGameState } from '@/contexts/GameStateContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward } from 'lucide-react';

interface GameLayoutProps {
  children: React.ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
  const { gameState, advanceTurn, togglePause } = useGameState();

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Top Bar */}
      <header className="h-16 border-b border-white/10 bg-black/90 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-serif text-[#D4AF37] tracking-widest">LOGOS IMPERIUM</h1>
          <div className="h-6 w-px bg-white/20 mx-2" />
          <div className="flex items-center gap-6 text-sm font-mono text-white/70">
            <span>CYCLE: {30492 + gameState.turn}</span>
            <span>CREDITS: {gameState.credits}</span>
            <span>METAL: {gameState.metal}</span>
            <span>ENERGY: {gameState.energy}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={togglePause}
            className="border-white/20 hover:bg-white/10"
          >
            {gameState.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={advanceTurn}
            className="border-white/20 hover:bg-white/10"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Next Turn
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
