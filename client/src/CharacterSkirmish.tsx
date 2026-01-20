/**
 * CharacterSkirmish.tsx - Ground combat system
 * 
 * Design Philosophy: Tactical RPG Interface
 * - Distinct from fleet battles: focus on individual characters
 * - Turn-based squad combat
 * - Visual emphasis on character portraits and abilities
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGameState } from '@/contexts/GameStateContext';
import { Swords, Shield, Crosshair, Zap, Skull, ArrowLeft, Flame, Box } from 'lucide-react';
import { toast } from 'sonner';

interface Combatant {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  ap: number;
  maxAp: number;
  initiative: number;
  isPlayer: boolean;
  portrait?: string;
  class?: 'Vanguard' | 'Sniper' | 'Medic';
  status?: 'normal' | 'cover' | 'stunned' | 'burning';
}

interface BattlefieldObject {
  id: string;
  name: string;
  type: 'barrel' | 'cover';
  hp: number;
  maxHp: number;
  effect?: string;
}

export default function CharacterSkirmish() {
  const [, setLocation] = useLocation();
  const { gameState } = useGameState();
  const [combatLog, setCombatLog] = useState<string[]>(['Encounter started: Pirate Boarding Party']);
  
  // Mock combat state
  const [playerTeam, setPlayerTeam] = useState<Combatant[]>([
    { id: 'p1', name: 'Commander', hp: 100, maxHp: 100, ap: 3, maxAp: 3, initiative: 10, isPlayer: true, class: 'Vanguard' },
    { id: 'p2', name: 'Dr. Aris', hp: 80, maxHp: 80, ap: 3, maxAp: 3, initiative: 8, isPlayer: true, class: 'Medic' },
    { id: 'p3', name: 'Operative Kael', hp: 70, maxHp: 70, ap: 3, maxAp: 3, initiative: 9, isPlayer: true, class: 'Sniper' },
  ]);

  const [enemyTeam, setEnemyTeam] = useState<Combatant[]>([
    { id: 'e1', name: 'Pirate Raider', hp: 60, maxHp: 60, ap: 2, maxAp: 2, initiative: 6, isPlayer: false },
    { id: 'e2', name: 'Pirate Raider', hp: 60, maxHp: 60, ap: 2, maxAp: 2, initiative: 5, isPlayer: false },
    { id: 'e3', name: 'Pirate Captain', hp: 120, maxHp: 120, ap: 4, maxAp: 4, initiative: 7, isPlayer: false },
  ]);

  const [battlefieldObjects, setBattlefieldObjects] = useState<BattlefieldObject[]>([]);

  // Procedural Battlefield Generation
  useEffect(() => {
    const generateBattlefield = () => {
      const objects: BattlefieldObject[] = [];
      const objectCount = Math.floor(Math.random() * 3) + 2; // 2-4 objects

      for (let i = 0; i < objectCount; i++) {
        const isBarrel = Math.random() > 0.6; // 40% chance for barrel
        if (isBarrel) {
          objects.push({
            id: `obj-${i}`,
            name: 'Explosive Barrel',
            type: 'barrel',
            hp: 20,
            maxHp: 20,
            effect: 'Explodes for 30 DMG'
          });
        } else {
          objects.push({
            id: `obj-${i}`,
            name: 'Reinforced Crate',
            type: 'cover',
            hp: 50,
            maxHp: 50,
            effect: 'Provides Cover'
          });
        }
      }
      setBattlefieldObjects(objects);
    };

    generateBattlefield();
  }, []);

  const [activeUnitId, setActiveUnitId] = useState<string>('p1');
  const [turnQueue, setTurnQueue] = useState<string[]>([]);
  const [isAiTurn, setIsAiTurn] = useState(false);

  // Initialize turn queue
  useState(() => {
    const allUnits = [...playerTeam, ...enemyTeam].sort((a, b) => b.initiative - a.initiative);
    setTurnQueue(allUnits.map(u => u.id));
    setActiveUnitId(allUnits[0].id);
  });

  const addToLog = (message: string) => {
    setCombatLog(prev => [message, ...prev].slice(0, 10));
  };

  // AI Logic Effect
  useEffect(() => {
    const currentUnit = [...playerTeam, ...enemyTeam].find(u => u.id === activeUnitId);
    if (currentUnit && !currentUnit.isPlayer && !isAiTurn) {
      setIsAiTurn(true);
      setTimeout(() => executeAiTurn(currentUnit), 1000);
    }
  }, [activeUnitId, playerTeam, enemyTeam]);

  const executeAiTurn = (aiUnit: Combatant) => {
    // 1. Identify potential targets (all living player units)
    const targets = playerTeam.filter(u => u.hp > 0);
    if (targets.length === 0) return;

    // 2. Evaluate best target (lowest HP % is prioritized)
    const bestTarget = targets.reduce((prev, curr) => {
      const prevHpPct = prev.hp / prev.maxHp;
      const currHpPct = curr.hp / curr.maxHp;
      return currHpPct < prevHpPct ? curr : prev;
    });

    // 3. Decide action
    const hpRatio = aiUnit.hp / aiUnit.maxHp;
    
    // Check for tactical environmental opportunities (Barrels)
    const explosiveBarrel = battlefieldObjects.find(obj => obj.type === 'barrel');
    
    // 10% chance to shoot a barrel if it exists (chaos factor)
    if (explosiveBarrel && Math.random() > 0.9) {
      addToLog(`${aiUnit.name} targets the explosive barrel!`);
      // @ts-ignore - reusing performAttack for object
      performAttack(aiUnit, explosiveBarrel, 1.0);
    }
    // Defensive Behavior: If HP is critical (< 30%), prioritize cover or defense
    else if (hpRatio < 0.3) {
      const coverAvailable = battlefieldObjects.some(obj => obj.type === 'cover');
      
      if (coverAvailable && Math.random() > 0.3) {
        addToLog(`${aiUnit.name} scrambles for cover!`);
        setEnemyTeam(prev => prev.map(u => u.id === aiUnit.id ? { ...u, status: 'cover' as const } : u));
        endTurn();
      } else {
        // Desperate Attack
        performAttack(aiUnit, bestTarget, 1.2); // 20% bonus damage on desperate attack
      }
    } 
    // Aggressive Behavior: If target is vulnerable (< 50% HP), focus fire
    else if (bestTarget.hp / bestTarget.maxHp < 0.5) {
      addToLog(`${aiUnit.name} spots a weakness in ${bestTarget.name}!`);
      performAttack(aiUnit, bestTarget, 1.0);
    }
    // Standard Behavior
    else {
      performAttack(aiUnit, bestTarget, 1.0);
    }
  };

  const performAttack = (attacker: Combatant, target: Combatant | BattlefieldObject, multiplier: number) => {
    const baseDamage = Math.floor(Math.random() * 15) + 8;
    const finalDamage = Math.floor(baseDamage * multiplier);
    
    // Check if target is a player unit
    if ('isPlayer' in target) {
      setPlayerTeam(prev => prev.map(u => {
        if (u.id === target.id) {
          // Apply Cover Mitigation
          let actualDamage = finalDamage;
          if (u.status === 'cover') {
            actualDamage = Math.floor(finalDamage * 0.5);
            addToLog(`${u.name} mitigates damage via cover! (-50%)`);
          }

          const newHp = Math.max(0, u.hp - actualDamage);
          addToLog(`${attacker.name} attacks ${u.name} for ${actualDamage} damage!`);
          if (newHp === 0) addToLog(`${u.name} has been incapacitated!`);
          return { ...u, hp: newHp, status: 'normal' as const }; // Cover breaks after being hit
        }
        return u;
      }));
    } 
    // Check if target is an object
    else {
      setBattlefieldObjects(prev => prev.map(obj => {
        if (obj.id === target.id) {
          const newHp = Math.max(0, obj.hp - finalDamage);
          addToLog(`${attacker.name} shoots ${obj.name} for ${finalDamage} damage!`);
          
          if (newHp === 0) {
            addToLog(`${obj.name} destroyed!`);
            if (obj.type === 'barrel') {
              triggerExplosion();
            }
          }
          return { ...obj, hp: newHp };
        }
        return obj;
      }).filter(obj => obj.hp > 0));
    }

    setIsAiTurn(false);
    endTurn();
  };

  const handleTakeCover = () => {
    const attacker = [...playerTeam, ...enemyTeam].find(u => u.id === activeUnitId);
    if (!attacker || attacker.id !== activeUnitId) return;

    // Check if cover object exists
    const coverObject = battlefieldObjects.find(obj => obj.type === 'cover');
    if (!coverObject) {
      toast.error("No cover available!");
      return;
    }

    addToLog(`${attacker.name} takes cover behind ${coverObject.name}!`);
    
    // Apply cover status
    if (attacker.isPlayer) {
      setPlayerTeam(prev => prev.map(u => u.id === attacker.id ? { ...u, status: 'cover' as const } : u));
    } else {
      setEnemyTeam(prev => prev.map(u => u.id === attacker.id ? { ...u, status: 'cover' as const } : u));
    }

    endTurn();
  };

  const handleAbility = () => {
    const attacker = [...playerTeam, ...enemyTeam].find(u => u.id === activeUnitId);
    if (!attacker || attacker.id !== activeUnitId) return;

    if (attacker.class === 'Medic') {
      // Field Heal: Heal lowest HP ally
      const team = attacker.isPlayer ? playerTeam : enemyTeam;
      const target = team.reduce((prev, curr) => (curr.hp / curr.maxHp < prev.hp / prev.maxHp) ? curr : prev);
      
      const healAmount = 30;
      const newHp = Math.min(target.maxHp, target.hp + healAmount);
      
      if (attacker.isPlayer) {
        setPlayerTeam(prev => prev.map(u => u.id === target.id ? { ...u, hp: newHp } : u));
      } else {
        setEnemyTeam(prev => prev.map(u => u.id === target.id ? { ...u, hp: newHp } : u));
      }
      addToLog(`${attacker.name} uses Field Heal on ${target.name} (+${healAmount} HP)`);
    } 
    else if (attacker.class === 'Sniper') {
      // Precision Shot: High damage to random enemy
      const targets = attacker.isPlayer ? enemyTeam : playerTeam;
      const validTargets = targets.filter(u => u.hp > 0);
      if (validTargets.length === 0) return;
      
      const target = validTargets[Math.floor(Math.random() * validTargets.length)];
      addToLog(`${attacker.name} takes a Precision Shot at ${target.name}!`);
      performAttack(attacker, target, 2.0); // 2x Damage
      return; // performAttack handles endTurn
    }
    else {
      // Vanguard / Default: Rally (Gain AP or small heal)
      addToLog(`${attacker.name} uses Rally! (+10 HP)`);
      const newHp = Math.min(attacker.maxHp, attacker.hp + 10);
      if (attacker.isPlayer) {
        setPlayerTeam(prev => prev.map(u => u.id === attacker.id ? { ...u, hp: newHp } : u));
      } else {
        setEnemyTeam(prev => prev.map(u => u.id === attacker.id ? { ...u, hp: newHp } : u));
      }
    }

    endTurn();
  };

  const handleAttack = (targetId: string) => {
    const attacker = [...playerTeam, ...enemyTeam].find(u => u.id === activeUnitId);
    if (!attacker || attacker.id !== activeUnitId) return; // Prevent acting out of turn

    // Simple damage calculation
    let damage = Math.floor(Math.random() * 20) + 10;
    
    if (enemyTeam.some(u => u.id === targetId)) {
      setEnemyTeam(prev => prev.map(u => {
        if (u.id === targetId) {
          // Apply Cover Mitigation
          let finalDamage = damage;
          if (u.status === 'cover') {
            finalDamage = Math.floor(damage * 0.5);
            addToLog(`${u.name} mitigates damage via cover! (-50%)`);
          }

          const newHp = Math.max(0, u.hp - finalDamage);
          addToLog(`${attacker.name} hits ${u.name} for ${finalDamage} damage!`);
          if (newHp === 0) addToLog(`${u.name} was defeated!`);
          return { ...u, hp: newHp, status: 'normal' as const }; // Cover breaks after being hit (simplified)
        }
        return u;
      }).filter(u => u.hp > 0));
    } else if (battlefieldObjects.some(obj => obj.id === targetId)) {
      // Handle Object Damage
      setBattlefieldObjects(prev => prev.map(obj => {
        if (obj.id === targetId) {
          const newHp = Math.max(0, obj.hp - damage);
          addToLog(`${attacker.name} hits ${obj.name} for ${damage} damage!`);
          
          if (newHp === 0) {
            addToLog(`${obj.name} destroyed!`);
            if (obj.type === 'barrel') {
              triggerExplosion();
            }
          }
          return { ...obj, hp: newHp };
        }
        return obj;
      }).filter(obj => obj.hp > 0));
    }

    endTurn();
  };

  const triggerExplosion = () => {
    addToLog(`💥 BARREL EXPLODES! Area damage triggered!`);
    const explosionDamage = 30;
    
    // Damage everyone (simplified AoE)
    setPlayerTeam(prev => prev.map(u => ({ ...u, hp: Math.max(0, u.hp - explosionDamage) })));
    setEnemyTeam(prev => prev.map(u => ({ ...u, hp: Math.max(0, u.hp - explosionDamage) })).filter(u => u.hp > 0));
  };

  const endTurn = () => {
    const allUnits = [...playerTeam, ...enemyTeam];
    const currentIndex = turnQueue.indexOf(activeUnitId);
    let nextIndex = (currentIndex + 1) % turnQueue.length;
    
    // Skip dead units
    let nextUnitId = turnQueue[nextIndex];
    let attempts = 0;
    while (!allUnits.find(u => u.id === nextUnitId) && attempts < turnQueue.length) {
      nextIndex = (nextIndex + 1) % turnQueue.length;
      nextUnitId = turnQueue[nextIndex];
      attempts++;
    }

    setActiveUnitId(nextUnitId);
    // addToLog(`Turn passed to ${allUnits.find(u => u.id === nextUnitId)?.name}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 grid-bg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/game')}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-orange-500 flex items-center gap-3">
              <Swords className="w-8 h-8" />
              Tactical Skirmish
            </h1>
            <p className="text-slate-400">Squad Combat Interface</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-orange-500 font-mono">Turn 1</p>
          <p className="text-xs text-slate-500">Phase: Player Action</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Player Team */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-cyan-300 mb-4">Away Team</h2>
          {playerTeam.map(unit => (
            <Card 
              key={unit.id} 
              className={`p-4 border-l-4 ${unit.id === activeUnitId ? 'border-l-cyan-400 bg-cyan-950/20' : 'border-l-cyan-800 bg-slate-900'} border-y-slate-800 border-r-slate-800`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{unit.name}</h3>
                  <p className="text-xs text-slate-400">Level 1 Officer</p>
                </div>
                {unit.id === activeUnitId && <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">Active</span>}
              </div>

              {/* Status Indicators */}
              <div className="flex gap-2 mb-2">
                {unit.class && (
                  <span className="text-[10px] uppercase tracking-wider bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
                    {unit.class}
                  </span>
                )}
                {unit.status === 'cover' && (
                  <span className="text-[10px] uppercase tracking-wider bg-blue-900/50 px-1.5 py-0.5 rounded text-blue-300 border border-blue-700 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Cover
                  </span>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>HP</span>
                  <span>{unit.hp}/{unit.maxHp}</span>
                </div>
                <Progress value={(unit.hp / unit.maxHp) * 100} className="h-2 bg-slate-800" indicatorClassName="bg-cyan-500" />
                
                <div className="flex justify-between text-xs mt-2">
                  <span>AP</span>
                  <span>{unit.ap}/{unit.maxAp}</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(unit.maxAp)].map((_, i) => (
                    <div key={i} className={`h-2 w-4 rounded-sm ${i < unit.ap ? 'bg-yellow-500' : 'bg-slate-700'}`} />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Battlefield / Actions */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <Card className="flex-1 bg-slate-900/50 border-slate-800 p-4 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10 pointer-events-none">
              {[...Array(64)].map((_, i) => (
                <div key={i} className="border border-slate-500" />
              ))}
            </div>
            
            {/* Environmental Objects Display */}
            <div className="z-10 w-full space-y-2">
              {battlefieldObjects.map(obj => (
                <div 
                  key={obj.id}
                  className={`p-2 border rounded cursor-pointer hover:bg-slate-800 transition-colors flex items-center justify-between ${
                    obj.type === 'barrel' ? 'border-red-500/50 bg-red-900/20' : 'border-amber-500/50 bg-amber-900/20'
                  }`}
                  onClick={() => handleAttack(obj.id)}
                >
                  <div className="flex items-center gap-2">
                    {obj.type === 'barrel' ? <Flame className="w-4 h-4 text-red-500" /> : <Box className="w-4 h-4 text-amber-500" />}
                    <span className="text-sm font-bold">{obj.name}</span>
                  </div>
                  <div className="text-xs">
                    HP: {obj.hp}/{obj.maxHp}
                  </div>
                </div>
              ))}
              {battlefieldObjects.length === 0 && (
                <p className="text-slate-500 italic text-center">No interactive objects remaining.</p>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-2">
            <Button 
              className="h-12 bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 text-red-300"
              onClick={() => handleAttack(enemyTeam[0]?.id)}
              disabled={enemyTeam.length === 0}
            >
              <Crosshair className="w-4 h-4 mr-2" />
              Attack
            </Button>
            <Button 
              className="h-12 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-500/30 text-blue-300"
              onClick={handleTakeCover}
              disabled={!battlefieldObjects.some(obj => obj.type === 'cover')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Take Cover
            </Button>
            <Button 
              className="h-12 bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-500/30 text-yellow-300"
              onClick={handleAbility}
            >
              <Zap className="w-4 h-4 mr-2" />
              {activeUnitId.startsWith('p') && playerTeam.find(u => u.id === activeUnitId)?.class === 'Medic' ? 'Field Heal' : 
               activeUnitId.startsWith('p') && playerTeam.find(u => u.id === activeUnitId)?.class === 'Sniper' ? 'Precision Shot' : 'Rally'}
            </Button>
            <Button className="h-12 bg-slate-800 hover:bg-slate-700 border border-slate-600" onClick={endTurn}>
              Skip Turn
            </Button>
          </div>
        </div>

        {/* Enemy Team */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-red-400 mb-4">Hostiles</h2>
          {enemyTeam.map(unit => (
            <Card 
              key={unit.id} 
              className="p-4 border-l-4 border-l-red-800 bg-slate-900 border-y-slate-800 border-r-slate-800 opacity-90 hover:opacity-100 cursor-pointer transition-opacity"
              onClick={() => handleAttack(unit.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-red-200">{unit.name}</h3>
                  <p className="text-xs text-slate-400">Enemy Unit</p>
                </div>
                <Skull className="w-4 h-4 text-red-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>HP</span>
                  <span>{unit.hp}/{unit.maxHp}</span>
                </div>
                <Progress value={(unit.hp / unit.maxHp) * 100} className="h-2 bg-slate-800" indicatorClassName="bg-red-600" />
              </div>
            </Card>
          ))}
          {enemyTeam.length === 0 && (
            <div className="p-8 text-center border border-dashed border-slate-700 rounded-lg">
              <p className="text-green-400 font-bold">All hostiles eliminated!</p>
              <Button className="mt-4" onClick={() => setLocation('/game')}>Return to Command</Button>
            </div>
          )}
        </div>
      </div>

      {/* Combat Log */}
      <Card className="mt-8 bg-slate-950 border-slate-800 p-4 h-48 overflow-y-auto font-mono text-sm">
        <h3 className="text-slate-500 uppercase text-xs tracking-widest mb-2 sticky top-0 bg-slate-950 pb-2">Combat Log</h3>
        <div className="space-y-1">
          {combatLog.map((log, i) => (
            <p key={i} className="text-slate-300 border-b border-slate-900 pb-1">
              <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
              {log}
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
}
