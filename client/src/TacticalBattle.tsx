import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Swords, Shield, Target, AlertTriangle, TrendingUp, 
  Zap, Users, Clock, ChevronRight, RotateCcw, Flag, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameState } from '@/contexts/GameStateContext';
import { simulateDetailedCombat } from '@/components/DetailedCombatSimulator';
import { TacticalCombatManager, calculateMorale } from '@/components/TacticalCombatSystem';

/**
 * Tactical Battle Interface
 * Integrates DetailedCombatSimulator and TacticalCombatSystem for fleet combat
 * 
 * Design: Brutalist Sci-Fi - Monospace fonts, sharp borders, tactical grid overlay
 */

interface Ship {
  id: string;
  name: string;
  class: string;
  current_health: number;
  max_health: number;
  experience: number;
}

interface BattleResult {
  victory: boolean;
  playerShipsLost: number;
  enemyShipsLost: number;
  creditsEarned: number;
  experienceGained: number;
}

export default function TacticalBattle() {
  const [, setLocation] = useLocation();
  const { gameState } = useGameState();

  // Combat state
  const [battleState, setBattleState] = useState<'setup' | 'active' | 'ended'>('setup');
  const [currentRound, setCurrentRound] = useState(0);
  const [combatLog, setCombatLog] = useState<Array<{ message: string; type: string; round: number }>>([]);
  const [tacticalManager] = useState(() => new TacticalCombatManager());
  
  // Mock fleet data
  const [playerFleet, setPlayerFleet] = useState({
    ships: [
      { id: 'p1', name: 'Executor', class: 'battleship', current_health: 100, max_health: 100, experience: 45 },
      { id: 'p2', name: 'Vanguard', class: 'destroyer', current_health: 100, max_health: 100, experience: 30 },
      { id: 'p3', name: 'Swift', class: 'corvette', current_health: 100, max_health: 100, experience: 20 },
    ]
  });

  const [enemyFleet, setEnemyFleet] = useState({
    ships: [
      { id: 'e1', name: 'Dread Reaper', class: 'cruiser', current_health: 100, max_health: 100, experience: 35 },
      { id: 'e2', name: 'Void Stalker', class: 'frigate', current_health: 100, max_health: 100, experience: 25 },
      { id: 'e3', name: 'Shadow', class: 'corvette', current_health: 100, max_health: 100, experience: 15 },
    ]
  });

  const [selectedPlayerShip, setSelectedPlayerShip] = useState<Ship | null>(null);
  const [selectedEnemyShip, setSelectedEnemyShip] = useState<Ship | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [morale, setMorale] = useState({ player_morale: 50, enemy_morale: 50, player_effects: {}, enemy_effects: {} });
  const [isSimulating, setIsSimulating] = useState(false);

  // Calculate morale based on current fleet state
  useEffect(() => {
    const newMorale = calculateMorale(
      { turn_number: currentRound, allies_lost: 0, enemies_defeated: 0, player_health: 100, enemy_health: 100, enemy_max_health: 100 },
      playerFleet.ships,
      enemyFleet.ships
    );
    setMorale(newMorale);
  }, [currentRound, playerFleet, enemyFleet]);

  const startBattle = () => {
    setBattleState('active');
    setCurrentRound(1);
    setCombatLog([]);
    addCombatLog('Battle initiated. Engaging enemy fleet.', 'system');
  };

  const addCombatLog = (message: string, type = 'event') => {
    setCombatLog(prev => [...prev, { message, type, round: currentRound }]);
  };

  const simulateRound = async () => {
    if (!selectedPlayerShip || !selectedEnemyShip) {
      addCombatLog('ERROR: Select both player and enemy ship to attack.', 'error');
      return;
    }

    setIsSimulating(true);

    // Simulate the combat round
    const result = simulateDetailedCombat(
      [selectedPlayerShip],
      [],
      [selectedEnemyShip],
      [],
      'player',
      'enemy',
      'space'
    );

    // Update fleets based on simulation
    if (result.rounds.length > 0) {
      const roundData = result.rounds[0];
      roundData.events.forEach((event: string) => {
        addCombatLog(event, 'combat');
      });

      // Update ship health
      const updatedPlayerFleet = {
        ...playerFleet,
        ships: playerFleet.ships.map(ship => {
          const survivor = (result.attackerSurvivors.fleet as any[]).find((s: any) => s.id === ship.id);
          return survivor || ship;
        }).filter(ship => !(result.attackerSurvivors.fleet as any[]).every((s: any) => s.id !== ship.id))
      };

      const updatedEnemyFleet = {
        ...enemyFleet,
        ships: enemyFleet.ships.map(ship => {
          const survivor = (result.defenderSurvivors.fleet as any[]).find((s: any) => s.id === ship.id);
          return survivor || ship;
        }).filter(ship => !(result.defenderSurvivors.fleet as any[]).every((s: any) => s.id !== ship.id))
      };

      setPlayerFleet(updatedPlayerFleet);
      setEnemyFleet(updatedEnemyFleet);
    }

    // Check battle end conditions
    if (enemyFleet.ships.length === 0) {
      endBattle(true);
    } else if (playerFleet.ships.length === 0) {
      endBattle(false);
    } else {
      setCurrentRound(prev => prev + 1);
    }

    setIsSimulating(false);
  };

  const endBattle = (playerVictory: boolean) => {
    setBattleState('ended');
    setBattleResult({
      victory: playerVictory,
      playerShipsLost: 3 - playerFleet.ships.length,
      enemyShipsLost: 3 - enemyFleet.ships.length,
      creditsEarned: playerVictory ? 50000 : 10000,
      experienceGained: playerVictory ? 500 : 200
    });
    addCombatLog(
      playerVictory ? 'VICTORY: Enemy fleet destroyed!' : 'DEFEAT: Retreat initiated.',
      playerVictory ? 'victory' : 'defeat'
    );
  };

  const resetBattle = () => {
    setBattleState('setup');
    setCurrentRound(0);
    setCombatLog([]);
    setSelectedPlayerShip(null);
    setSelectedEnemyShip(null);
    setBattleResult(null);
    setPlayerFleet({
      ships: [
        { id: 'p1', name: 'Executor', class: 'battleship', current_health: 100, max_health: 100, experience: 45 },
        { id: 'p2', name: 'Vanguard', class: 'destroyer', current_health: 100, max_health: 100, experience: 30 },
        { id: 'p3', name: 'Swift', class: 'corvette', current_health: 100, max_health: 100, experience: 20 },
      ]
    });
    setEnemyFleet({
      ships: [
        { id: 'e1', name: 'Dread Reaper', class: 'cruiser', current_health: 100, max_health: 100, experience: 35 },
        { id: 'e2', name: 'Void Stalker', class: 'frigate', current_health: 100, max_health: 100, experience: 25 },
        { id: 'e3', name: 'Shadow', class: 'corvette', current_health: 100, max_health: 100, experience: 15 },
      ]
    });
  };

  const ShipCard = ({ ship, isEnemy = false, isSelected = false }: { ship: Ship; isEnemy?: boolean; isSelected?: boolean }) => {
    const healthPercent = (ship.current_health / ship.max_health) * 100;
    const healthColor = healthPercent > 50 ? 'text-cyan-400' : healthPercent > 25 ? 'text-amber-500' : 'text-red-500';

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => isEnemy ? setSelectedEnemyShip(ship) : setSelectedPlayerShip(ship)}
        className={`p-4 border-2 cursor-pointer transition-all ${
          isSelected ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-sm font-bold uppercase text-slate-100">{ship.name}</div>
            <div className="text-[10px] text-slate-400">{ship.class}</div>
          </div>
          <div className="text-right">
            <div className={`text-xs font-bold ${healthColor}`}>{Math.round(ship.current_health)}%</div>
            <div className="text-[8px] text-slate-500">EXP: {ship.experience}</div>
          </div>
        </div>
        
        {/* Health Bar */}
        <div className="h-2 bg-slate-800 border border-slate-700 relative overflow-hidden">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${healthPercent}%` }}
            className={`h-full ${healthPercent > 50 ? 'bg-cyan-500' : healthPercent > 25 ? 'bg-amber-500' : 'bg-red-500'}`}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_2px] opacity-20" />
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/game')}
              className="text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-cyan-400 tracking-widest uppercase">
              Tactical Battle Simulator
            </h1>
          </div>
          <div className="flex gap-2">
            {battleState === 'setup' && (
              <Button
                onClick={startBattle}
                className="bg-cyan-600 hover:bg-cyan-700 text-slate-900 font-bold"
              >
                <Swords className="w-4 h-4 mr-2" />
                Engage
              </Button>
            )}
            {battleState === 'active' && (
              <Button
                onClick={simulateRound}
                disabled={isSimulating || !selectedPlayerShip || !selectedEnemyShip}
                className="bg-cyan-600 hover:bg-cyan-700 text-slate-900 font-bold disabled:opacity-50"
              >
                <Zap className="w-4 h-4 mr-2" />
                Execute Round
              </Button>
            )}
            {battleState === 'ended' && (
              <Button
                onClick={resetBattle}
                className="bg-cyan-600 hover:bg-cyan-700 text-slate-900 font-bold"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Battle
              </Button>
            )}
          </div>
        </div>

        {/* Battle Status Bar */}
        {battleState !== 'setup' && (
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 uppercase">Round</span>
                  <span className="text-lg font-bold text-cyan-400">{currentRound}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 uppercase">Player Morale</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 bg-slate-800 border border-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 transition-all"
                        style={{ width: `${morale.player_morale}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold">{Math.round(morale.player_morale)}%</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 uppercase">Enemy Morale</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 bg-slate-800 border border-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-red-500 transition-all"
                        style={{ width: `${morale.enemy_morale}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold">{Math.round(morale.enemy_morale)}%</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 uppercase">Status</span>
                  <span className={`text-xs font-bold ${battleState === 'active' ? 'text-cyan-400 animate-pulse' : 'text-amber-500'}`}>
                    {battleState === 'active' ? 'COMBAT ACTIVE' : 'COMBAT ENDED'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Fleet */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold uppercase text-cyan-400">Your Fleet</h2>
              <span className="text-[10px] text-slate-500 ml-auto">{playerFleet.ships.length} Ships</span>
            </div>
            <div className="space-y-3">
              {playerFleet.ships.map(ship => (
                <ShipCard
                  key={ship.id}
                  ship={ship}
                  isSelected={selectedPlayerShip?.id === ship.id}
                />
              ))}
            </div>
          </div>

          {/* Tactical Display */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold uppercase text-cyan-400">Tactical Map</h2>
            </div>

            {/* Tactical Grid */}
            <Card className="bg-slate-900/80 border-slate-700 min-h-[400px] flex flex-col">
              <CardContent className="flex-1 p-0 relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-none">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-cyan-500/10" />
                  ))}
                </div>
                
                {/* Battle Status Info */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
                  {battleState === 'setup' && (
                    <div className="text-center">
                      <div className="text-cyan-400 text-sm font-bold mb-2">READY FOR ENGAGEMENT</div>
                      <div className="text-[10px] text-slate-400">Select ships and initiate combat</div>
                    </div>
                  )}
                  {battleState === 'active' && selectedPlayerShip && selectedEnemyShip && (
                    <div className="text-center">
                      <div className="text-cyan-400 text-xs font-bold mb-1">{selectedPlayerShip.name}</div>
                      <div className="text-slate-500 text-[10px] mb-3">vs</div>
                      <div className="text-red-500 text-xs font-bold">{selectedEnemyShip.name}</div>
                    </div>
                  )}
                  {battleState === 'ended' && (
                    <div className="text-center">
                      <div className={`text-lg font-bold mb-2 ${battleResult?.victory ? 'text-cyan-400' : 'text-red-500'}`}>
                        {battleResult?.victory ? 'VICTORY' : 'DEFEAT'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {battleResult?.playerShipsLost} ships lost, {battleResult?.enemyShipsLost} enemy destroyed
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              {/* Action Buttons */}
              {battleState === 'active' && (
                <div className="flex gap-2 p-4 border-t border-slate-700">
                  <Button
                    onClick={() => setSelectedPlayerShip(null)}
                    variant="outline"
                    className="flex-1 text-slate-400 border-slate-700 hover:border-slate-600"
                  >
                    Clear Selection
                  </Button>
                  <Button
                    onClick={simulateRound}
                    disabled={isSimulating || !selectedPlayerShip || !selectedEnemyShip}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-slate-900 font-bold disabled:opacity-50"
                  >
                    {isSimulating ? 'Simulating...' : 'Fire!'}
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Enemy Fleet */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h2 className="text-sm font-bold uppercase text-red-500">Enemy Fleet</h2>
              <span className="text-[10px] text-slate-500 ml-auto">{enemyFleet.ships.length} Ships</span>
            </div>
            <div className="space-y-3">
              {enemyFleet.ships.map(ship => (
                <ShipCard
                  key={ship.id}
                  ship={ship}
                  isEnemy={true}
                  isSelected={selectedEnemyShip?.id === ship.id}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Combat Log */}
        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm text-cyan-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Combat Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
              <AnimatePresence>
                {combatLog.length === 0 ? (
                  <div className="text-center text-slate-500 text-xs py-8">
                    [ AWAITING COMBAT ORDERS ]
                  </div>
                ) : (
                  combatLog.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-xs font-mono p-2 border-l-2 ${
                        log.type === 'system' ? 'border-cyan-500 text-cyan-400' :
                        log.type === 'combat' ? 'border-amber-500 text-amber-500' :
                        log.type === 'error' ? 'border-red-500 text-red-500' :
                        log.type === 'victory' ? 'border-cyan-500 text-cyan-400' :
                        log.type === 'defeat' ? 'border-red-500 text-red-500' :
                        'border-slate-600 text-slate-400'
                      }`}
                    >
                      <span className="text-[8px] text-slate-600">[R{log.round}]</span> {log.message}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Battle Result Summary */}
        {battleState === 'ended' && battleResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border-2 p-6 ${battleResult.victory ? 'border-cyan-500 bg-cyan-500/10' : 'border-red-500 bg-red-500/10'}`}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 uppercase">Result</span>
                <span className={`text-lg font-bold ${battleResult.victory ? 'text-cyan-400' : 'text-red-500'}`}>
                  {battleResult.victory ? 'VICTORY' : 'DEFEAT'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 uppercase">Ships Lost</span>
                <span className="text-lg font-bold text-amber-500">{battleResult.playerShipsLost}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 uppercase">Enemy Destroyed</span>
                <span className="text-lg font-bold text-cyan-400">{battleResult.enemyShipsLost}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 uppercase">Credits Earned</span>
                <span className="text-lg font-bold text-cyan-400">₪ {battleResult.creditsEarned.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
