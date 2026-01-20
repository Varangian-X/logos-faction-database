import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Swords, Shield, Target, AlertTriangle, TrendingUp, 
  Zap, Users, Clock, ChevronRight, RotateCcw, Flag
} from 'lucide-react';
import { simulateDetailedCombat } from '../components/DetailedCombatSimulator';
import { TacticalCombatManager, calculateMorale } from '../components/TacticalCombatSystem';

/**
 * Tactical Battle Interface
 * Integrates DetailedCombatSimulator and TacticalCombatSystem for fleet combat
 * 
 * Design: Brutalist Sci-Fi - Monospace fonts, sharp borders, tactical grid overlay
 */

export default function TacticalBattle() {
  // Combat state
  const [battleState, setBattleState] = useState('setup'); // setup, active, ended
  const [currentRound, setCurrentRound] = useState(0);
  const [combatLog, setCombatLog] = useState([]);
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

  const [selectedPlayerShip, setSelectedPlayerShip] = useState(null);
  const [selectedEnemyShip, setSelectedEnemyShip] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [morale, setMorale] = useState({ player_morale: 50, enemy_morale: 50 });
  const [isSimulating, setIsSimulating] = useState(false);

  // Calculate morale based on current fleet state
  useEffect(() => {
    const newMorale = calculateMorale(
      { turn_number: currentRound, allies_lost: 0, enemies_defeated: 0 },
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

  const addCombatLog = (message, type = 'event') => {
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
      roundData.events.forEach(event => {
        addCombatLog(event, 'combat');
      });

      // Update ship health
      const updatedPlayerFleet = {
        ...playerFleet,
        ships: playerFleet.ships.map(ship => {
          const survivor = result.attackerSurvivors.fleet.find(s => s.id === ship.id);
          return survivor || ship;
        }).filter(ship => !result.attackerSurvivors.fleet.every(s => s.id !== ship.id))
      };

      const updatedEnemyFleet = {
        ...enemyFleet,
        ships: enemyFleet.ships.map(ship => {
          const survivor = result.defenderSurvivors.fleet.find(s => s.id === ship.id);
          return survivor || ship;
        }).filter(ship => !result.defenderSurvivors.fleet.every(s => s.id !== ship.id))
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

  const endBattle = (playerVictory) => {
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

  const ShipCard = ({ ship, isEnemy = false, isSelected = false }) => {
    const healthPercent = (ship.current_health / ship.max_health) * 100;
    const healthColor = healthPercent > 50 ? 'text-primary' : healthPercent > 25 ? 'text-amber-500' : 'text-destructive';

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => isEnemy ? setSelectedEnemyShip(ship) : setSelectedPlayerShip(ship)}
        className={`panel cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-primary shadow-[0_0_15px_rgba(0,255,65,0.4)]' : ''
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-sm font-bold uppercase">{ship.name}</div>
            <div className="text-[10px] text-muted-foreground">{ship.class}</div>
          </div>
          <div className="text-right">
            <div className={`text-xs font-bold ${healthColor}`}>{Math.round(ship.current_health)}%</div>
            <div className="text-[8px] text-muted-foreground">EXP: {ship.experience}</div>
          </div>
        </div>
        
        {/* Health Bar */}
        <div className="h-2 bg-black/50 border border-border relative overflow-hidden">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${healthPercent}%` }}
            className={`h-full ${healthPercent > 50 ? 'bg-primary' : healthPercent > 25 ? 'bg-amber-500' : 'bg-destructive'}`}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary tracking-widest uppercase border-l-4 border-primary pl-4">
            Tactical Battle Simulator
          </h1>
          <div className="flex gap-2">
            {battleState === 'setup' && (
              <button
                onClick={startBattle}
                className="px-4 py-2 bg-primary/20 border border-primary text-primary text-xs uppercase hover:bg-primary/30 transition-colors font-bold"
              >
                <Swords className="w-4 h-4 inline mr-2" />
                Engage
              </button>
            )}
            {battleState === 'active' && (
              <button
                onClick={simulateRound}
                disabled={isSimulating || !selectedPlayerShip || !selectedEnemyShip}
                className="px-4 py-2 bg-primary/20 border border-primary text-primary text-xs uppercase hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
              >
                <Zap className="w-4 h-4 inline mr-2" />
                Execute Round
              </button>
            )}
            {battleState === 'ended' && (
              <button
                onClick={resetBattle}
                className="px-4 py-2 bg-primary/20 border border-primary text-primary text-xs uppercase hover:bg-primary/30 transition-colors font-bold"
              >
                <RotateCcw className="w-4 h-4 inline mr-2" />
                New Battle
              </button>
            )}
          </div>
        </div>

        {/* Battle Status Bar */}
        {battleState !== 'setup' && (
          <div className="panel grid grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground uppercase">Round</span>
              <span className="text-lg font-bold text-primary">{currentRound}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground uppercase">Player Morale</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-20 bg-black/50 border border-border overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${morale.player_morale}%` }}
                  />
                </div>
                <span className="text-xs font-bold">{Math.round(morale.player_morale)}%</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground uppercase">Enemy Morale</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-20 bg-black/50 border border-border overflow-hidden">
                  <div
                    className="h-full bg-destructive transition-all"
                    style={{ width: `${morale.enemy_morale}%` }}
                  />
                </div>
                <span className="text-xs font-bold">{Math.round(morale.enemy_morale)}%</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground uppercase">Status</span>
              <span className={`text-xs font-bold ${battleState === 'active' ? 'text-primary animate-pulse' : 'text-amber-500'}`}>
                {battleState === 'active' ? 'COMBAT ACTIVE' : 'COMBAT ENDED'}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Fleet */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <Shield className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold uppercase text-primary">Your Fleet</h2>
              <span className="text-[10px] text-muted-foreground ml-auto">{playerFleet.ships.length} Ships</span>
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
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <Target className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold uppercase text-primary">Tactical Map</h2>
            </div>

            {/* Tactical Grid */}
            <div className="panel min-h-[400px] flex flex-col gap-4">
              <div className="flex-1 bg-black/50 border border-border/50 relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-none">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-primary/10" />
                  ))}
                </div>
                
                {/* Battle Status Info */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
                  {battleState === 'setup' && (
                    <div className="text-center">
                      <div className="text-primary text-sm font-bold mb-2">READY FOR ENGAGEMENT</div>
                      <div className="text-[10px] text-muted-foreground">Select ships and initiate combat</div>
                    </div>
                  )}
                  {battleState === 'active' && selectedPlayerShip && selectedEnemyShip && (
                    <div className="text-center">
                      <div className="text-primary text-xs font-bold mb-1">{selectedPlayerShip.name}</div>
                      <div className="text-muted-foreground text-[10px] mb-3">vs</div>
                      <div className="text-destructive text-xs font-bold">{selectedEnemyShip.name}</div>
                    </div>
                  )}
                  {battleState === 'ended' && (
                    <div className="text-center">
                      <div className={`text-lg font-bold mb-2 ${battleResult?.victory ? 'text-primary' : 'text-destructive'}`}>
                        {battleResult?.victory ? 'VICTORY' : 'DEFEAT'}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {battleResult?.playerShipsLost} ships lost, {battleResult?.enemyShipsLost} enemy destroyed
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {battleState === 'active' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPlayerShip(null)}
                    className="flex-1 px-3 py-2 bg-border/20 border border-border text-muted-foreground text-xs uppercase hover:bg-border/40 transition-colors"
                  >
                    Clear Selection
                  </button>
                  <button
                    onClick={simulateRound}
                    disabled={isSimulating || !selectedPlayerShip || !selectedEnemyShip}
                    className="flex-1 px-3 py-2 bg-primary/20 border border-primary text-primary text-xs uppercase hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                  >
                    {isSimulating ? 'Simulating...' : 'Fire!'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Enemy Fleet */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <h2 className="text-sm font-bold uppercase text-destructive">Enemy Fleet</h2>
              <span className="text-[10px] text-muted-foreground ml-auto">{enemyFleet.ships.length} Ships</span>
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
        <div className="panel">
          <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
            <Clock className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold uppercase text-primary">Combat Log</h2>
          </div>
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            <AnimatePresence>
              {combatLog.length === 0 ? (
                <div className="text-center text-muted-foreground text-xs py-8">
                  [ AWAITING COMBAT ORDERS ]
                </div>
              ) : (
                combatLog.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-xs font-mono p-2 border-l-2 ${
                      log.type === 'system' ? 'border-primary text-primary' :
                      log.type === 'combat' ? 'border-amber-500 text-amber-500' :
                      log.type === 'error' ? 'border-destructive text-destructive' :
                      log.type === 'victory' ? 'border-primary text-primary' :
                      log.type === 'defeat' ? 'border-destructive text-destructive' :
                      'border-muted-foreground text-muted-foreground'
                    }`}
                  >
                    <span className="text-[8px] text-muted-foreground">[R{log.round}]</span> {log.message}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Battle Result Summary */}
        {battleState === 'ended' && battleResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`panel border-2 ${battleResult.victory ? 'border-primary' : 'border-destructive'}`}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase">Result</span>
                <span className={`text-lg font-bold ${battleResult.victory ? 'text-primary' : 'text-destructive'}`}>
                  {battleResult.victory ? 'VICTORY' : 'DEFEAT'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase">Ships Lost</span>
                <span className="text-lg font-bold text-amber-500">{battleResult.playerShipsLost}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase">Enemy Destroyed</span>
                <span className="text-lg font-bold text-primary">{battleResult.enemyShipsLost}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase">Credits Earned</span>
                <span className="text-lg font-bold text-primary">₪ {battleResult.creditsEarned.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}
