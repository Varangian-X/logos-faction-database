/**
 * MainMenu.tsx - Game initialization and main menu
 * 
 * Design Philosophy: Command Center Aesthetic
 * - Dramatic hero section with sci-fi styling
 * - Clear navigation to game start, load, and settings
 * - Immersive atmosphere with glowing elements
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Zap, Play, Upload, Settings, Volume2 } from 'lucide-react';
import { useGameState } from '@/contexts/GameStateContext';

export default function MainMenu() {
  const [, setLocation] = useLocation();
  const { startNewGame } = useGameState();
  const [showNewGame, setShowNewGame] = useState(false);
  const [showLoadGame, setShowLoadGame] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerHouse, setPlayerHouse] = useState('House Imperium');

  const handleNewGame = () => {
    if (playerName.trim()) {
      startNewGame(playerName, playerHouse);
      setShowNewGame(false);
      setLocation('/game');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 grid-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-sm glow-cyan flex items-center justify-center">
              <Zap className="w-10 h-10 text-slate-900" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-500 mb-2 tracking-tight">
            LOGOS IMPERIUM
          </h1>
          <p className="text-lg text-slate-400 uppercase tracking-widest">Strategic Command Experience</p>
        </div>

        {/* Main Menu Buttons */}
        <div className="w-full max-w-md space-y-4 mb-12">
          <Button
            onClick={() => setShowNewGame(true)}
            className="w-full h-14 tech-button text-lg"
            variant="outline"
          >
            <Play className="w-5 h-5 mr-3" />
            New Game
          </Button>

          <Button
            onClick={() => {
              const savedGame = localStorage.getItem('logos_imperium_save');
              if (savedGame) {
                const parsed = JSON.parse(savedGame);
                // In a real app, we'd show a list of saves. For now, we just confirm loading the single slot.
                if (confirm(`Load game for Commander ${parsed.playerName}?`)) {
                  // We need to initialize the context with the loaded data
                  // Since we are outside the provider here (or rather, the provider is up the tree but we want to navigate)
                  // We'll just navigate to /game and let the provider load from local storage on mount
                  setLocation('/game');
                }
              } else {
                alert('No saved games found.');
              }
            }}
            className="w-full h-14 tech-button text-lg"
            variant="outline"
          >
            <Upload className="w-5 h-5 mr-3" />
            Load Game
          </Button>

          <Button
            className="w-full h-14 tech-button text-lg"
            variant="outline"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Button>
        </div>

        {/* Game Info Cards */}
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="tech-panel border-cyan-500/30 text-center p-4">
            <p className="text-xs uppercase text-slate-400 tracking-widest mb-2">Fleet Command</p>
            <p className="text-2xl font-bold text-cyan-300">Build & Battle</p>
          </Card>
          <Card className="tech-panel border-purple-500/30 text-center p-4">
            <p className="text-xs uppercase text-slate-400 tracking-widest mb-2">Deep Economy</p>
            <p className="text-2xl font-bold text-purple-300">Trade & Thrive</p>
          </Card>
          <Card className="tech-panel border-amber-500/30 text-center p-4">
            <p className="text-xs uppercase text-slate-400 tracking-widest mb-2">Procedural World</p>
            <p className="text-2xl font-bold text-amber-300">Infinite Content</p>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 uppercase tracking-widest">
          <p>© 2025 Logos Imperium | Strategic Command Interface v1.0</p>
        </div>
      </div>

      {/* New Game Dialog */}
      <Dialog open={showNewGame} onOpenChange={setShowNewGame}>
        <DialogContent className="bg-slate-900 border border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-cyan-300 text-xl">Initialize New Game</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 uppercase tracking-widest mb-2 block">Commander Name</label>
              <Input
                placeholder="Enter your commander name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300 uppercase tracking-widest mb-2 block">House/Faction</label>
              <select
                value={playerHouse}
                onChange={(e) => setPlayerHouse(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-sm px-3 py-2 text-slate-100"
              >
                <option>House Imperium</option>
                <option>House Zenith</option>
                <option>House Vortex</option>
                <option>House Eclipse</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300 uppercase tracking-widest mb-2 block">Difficulty</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-sm px-3 py-2 text-slate-100">
                <option>Normal</option>
                <option>Hard</option>
                <option>Insane</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleNewGame}
                className="flex-1 tech-button"
                variant="outline"
              >
                Start Game
              </Button>
              <Button
                onClick={() => setShowNewGame(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Load Game Dialog */}
      <Dialog open={showLoadGame} onOpenChange={setShowLoadGame}>
        <DialogContent className="bg-slate-900 border border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-cyan-300 text-xl">Load Game</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-slate-400 text-sm">No saved games found. Start a new game to begin.</p>
            <Button
              onClick={() => setShowLoadGame(false)}
              variant="outline"
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
