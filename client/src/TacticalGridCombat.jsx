import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crosshair, Shield, Zap, Move, Eye, Target, 
  Heart, Flame, AlertTriangle, MapPin, Wind,
  ChevronRight, Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Grid-based tactical combat with movement, cover, and positioning
export default function TacticalGridCombat({
  combat,
  gameState,
  companions = [],
  onAction,
  onFlee,
  isProcessing
}) {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [gridSize] = useState({ width: 8, height: 6 });
  
  // Initialize positions if not present
  useEffect(() => {
    if (!combat.grid_positions) {
      initializeGridPositions();
    }
  }, []);

  const initializeGridPositions = () => {
    const positions = {
      player: { x: 1, y: 3 },
      enemies: [{ x: 6, y: 3, id: 'enemy_1', health: combat.enemy_health }],
      companions: [],
      allies: [],
      cover: generateCoverPositions(),
      hazards: generateEnvironmentalHazards()
    };

    // Position companions
    (combat.companions || []).forEach((comp, i) => {
      positions.companions.push({
        ...comp,
        x: 1,
        y: 2 + i,
        id: comp.id
      });
    });

    // Position NPC allies
    (combat.allies || []).forEach((ally, i) => {
      positions.allies.push({
        ...ally,
        x: 2,
        y: 2 + i,
        id: ally.id
      });
    });

    combat.grid_positions = positions;
  };

  const generateCoverPositions = () => {
    const cover = [];
    const coverCount = 4 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < coverCount; i++) {
      cover.push({
        x: 2 + Math.floor(Math.random() * 4),
        y: 1 + Math.floor(Math.random() * 4),
        type: Math.random() > 0.5 ? 'full' : 'half',
        health: Math.random() > 0.7 ? 'damaged' : 'intact'
      });
    }
    
    return cover;
  };

  const generateEnvironmentalHazards = () => {
    const location = combat.location || '';
    const hazards = [];

    if (location.includes('Cisterns')) {
      // Water hazards
      for (let i = 0; i < 3; i++) {
        hazards.push({
          x: 3 + Math.floor(Math.random() * 2),
          y: 1 + Math.floor(Math.random() * 4),
          type: 'water',
          effect: 'reduces_mobility'
        });
      }
    } else if (location.includes('Praetoria')) {
      // Fire zones
      hazards.push({
        x: 4,
        y: 3,
        type: 'fire',
        effect: 'damage_over_time'
      });
    }

    return hazards;
  };

  const getDistanceBetween = (pos1, pos2) => {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  };

  const isValidMove = (unit, targetX, targetY) => {
    if (targetX < 0 || targetX >= gridSize.width || targetY < 0 || targetY >= gridSize.height) {
      return false;
    }

    const distance = Math.abs(unit.x - targetX) + Math.abs(unit.y - targetY);
    const moveRange = unit.move_range || 2;

    if (distance > moveRange) return false;

    // Check if occupied
    const positions = combat.grid_positions;
    const isOccupied = 
      (positions.player.x === targetX && positions.player.y === targetY) ||
      positions.enemies.some(e => e.x === targetX && e.y === targetY) ||
      positions.companions.some(c => c.x === targetX && c.y === targetY) ||
      positions.allies.some(a => a.x === targetX && a.y === targetY);

    return !isOccupied;
  };

  const getCoverAtPosition = (x, y) => {
    return combat.grid_positions?.cover.find(c => c.x === x && c.y === y);
  };

  const getHazardAtPosition = (x, y) => {
    return combat.grid_positions?.hazards.find(h => h.x === x && h.y === y);
  };

  const handleCellClick = (x, y) => {
    if (!selectedUnit || isProcessing) return;

    if (selectedAbility) {
      handleAbilityTarget(x, y);
    } else {
      handleMove(x, y);
    }
  };

  const handleMove = (x, y) => {
    if (!isValidMove(selectedUnit, x, y)) return;

    const positions = combat.grid_positions;
    
    if (selectedUnit.isPlayer) {
      positions.player = { x, y };
    } else if (selectedUnit.type === 'companion') {
      const compIndex = positions.companions.findIndex(c => c.id === selectedUnit.id);
      if (compIndex >= 0) positions.companions[compIndex] = { ...positions.companions[compIndex], x, y };
    } else if (selectedUnit.type === 'ally') {
      const allyIndex = positions.allies.findIndex(a => a.id === selectedUnit.id);
      if (allyIndex >= 0) positions.allies[allyIndex] = { ...positions.allies[allyIndex], x, y };
    }

    combat.grid_positions = positions;
    setSelectedUnit(null);
  };

  const handleAbilityTarget = (x, y) => {
    const enemy = combat.grid_positions.enemies.find(e => e.x === x && e.y === y);
    
    if (enemy && selectedAbility) {
      const distance = getDistanceBetween(selectedUnit, { x, y });
      const range = selectedAbility.range || 1;

      if (distance <= range) {
        onAction(selectedAbility);
        setSelectedAbility(null);
        setSelectedUnit(null);
      }
    }
  };

  const renderCell = (x, y) => {
    const positions = combat.grid_positions || {};
    const isPlayer = positions.player?.x === x && positions.player?.y === y;
    const enemy = positions.enemies?.find(e => e.x === x && e.y === y);
    const companion = positions.companions?.find(c => c.x === x && c.y === y);
    const ally = positions.allies?.find(a => a.x === x && a.y === y);
    const cover = getCoverAtPosition(x, y);
    const hazard = getHazardAtPosition(x, y);
    const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;
    const canMove = selectedUnit && !selectedAbility && isValidMove(selectedUnit, x, y);
    const canTarget = selectedAbility && enemy && 
      getDistanceBetween(selectedUnit, { x, y }) <= (selectedAbility.range || 1);

    return (
      <motion.button
        key={`${x}-${y}`}
        onClick={() => handleCellClick(x, y)}
        onMouseEnter={() => setHoveredCell({ x, y })}
        onMouseLeave={() => setHoveredCell(null)}
        className={cn(
          'relative w-full aspect-square border transition-all',
          'bg-slate-900/40',
          isHovered && 'bg-cyan-500/10',
          canMove && 'border-cyan-500 bg-cyan-500/20 cursor-pointer',
          canTarget && 'border-red-500 bg-red-500/20 cursor-crosshair',
          !canMove && !canTarget && 'border-slate-700/50'
        )}
        whileHover={canMove || canTarget ? { scale: 1.05 } : {}}
      >
        {/* Cover */}
        {cover && (
          <div className={cn(
            'absolute inset-0 flex items-center justify-center',
            cover.type === 'full' ? 'bg-slate-700/60' : 'bg-slate-700/30'
          )}>
            <Shield className={cn(
              'w-4 h-4',
              cover.health === 'intact' ? 'text-gray-400' : 'text-gray-600'
            )} />
          </div>
        )}

        {/* Hazards */}
        {hazard && (
          <div className="absolute inset-0 flex items-center justify-center">
            {hazard.type === 'fire' && <Flame className="w-4 h-4 text-orange-500 animate-pulse" />}
            {hazard.type === 'water' && <Wind className="w-4 h-4 text-blue-400" />}
          </div>
        )}

        {/* Player */}
        {isPlayer && (
          <motion.div
            layoutId="player"
            className="absolute inset-0 flex items-center justify-center"
            animate={selectedUnit?.isPlayer ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-cyan-300 flex items-center justify-center">
              <Crosshair className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        )}

        {/* Enemies */}
        {enemy && (
          <motion.div
            layoutId={`enemy-${enemy.id}`}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-red-400 flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        )}

        {/* Companions */}
        {companion && (
          <motion.div
            layoutId={`companion-${companion.id}`}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-7 h-7 rounded-full bg-purple-600 border-2 border-purple-400 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
          </motion.div>
        )}

        {/* NPC Allies */}
        {ally && (
          <motion.div
            layoutId={`ally-${ally.id}`}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-6 h-6 rounded-full bg-green-600 border-2 border-green-400 flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
          </motion.div>
        )}

        {/* Movement/Target indicator */}
        {isHovered && canMove && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Move className="w-5 h-5 text-cyan-400" />
          </div>
        )}
        
        {isHovered && canTarget && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Crosshair className="w-5 h-5 text-red-400" />
          </div>
        )}
      </motion.button>
    );
  };

  const playerAbilities = [
    { id: 'strike', name: 'Precision Strike', damage: '20-35', accuracy: 85, range: 1, skillUsed: 'combat', xpGain: 15, icon: Crosshair },
    { id: 'suppressing_fire', name: 'Suppressing Fire', damage: '10-20', accuracy: 75, range: 3, skillUsed: 'combat', xpGain: 12, icon: Target },
    { id: 'tactical_move', name: 'Tactical Move', range: 3, skillUsed: 'combat', xpGain: 8, effect: 'move_extra', icon: Move }
  ];

  const positions = combat.grid_positions || {};

  return (
    <Card className="bg-slate-900/90 border-red-900/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-red-400 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Tactical Combat: {combat.location}
          </CardTitle>
          <Badge variant="outline" className="text-amber-400 border-amber-500/50">
            Turn {combat.turn_number}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Battlefield Grid */}
        <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
          <div 
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${gridSize.width}, 1fr)` }}
          >
            {Array.from({ length: gridSize.height }).map((_, y) =>
              Array.from({ length: gridSize.width }).map((_, x) => renderCell(x, y))
            )}
          </div>
        </div>

        {/* Unit Selection Panel */}
        <div className="grid grid-cols-2 gap-3">
          {/* Player */}
          <motion.button
            onClick={() => setSelectedUnit({ 
              isPlayer: true, 
              x: positions.player?.x, 
              y: positions.player?.y,
              move_range: 2
            })}
            className={cn(
              'p-3 rounded-lg border-2 text-left transition-all',
              selectedUnit?.isPlayer 
                ? 'bg-cyan-900/30 border-cyan-500' 
                : 'bg-slate-800/50 border-slate-700 hover:border-cyan-500/50'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-cyan-500" />
              <div>
                <p className="text-xs font-bold text-cyan-300">{gameState.character_name}</p>
                <p className="text-[9px] text-gray-500">Player</p>
              </div>
            </div>
            <Progress value={(combat.player_health / combat.player_max_health) * 100} className="h-1" />
            <p className="text-[10px] text-gray-400 mt-1">
              {combat.player_health}/{combat.player_max_health} HP
            </p>
          </motion.button>

          {/* Companions */}
          {positions.companions?.map((comp, i) => (
            <motion.button
              key={comp.id}
              onClick={() => setSelectedUnit({ 
                ...comp, 
                type: 'companion',
                move_range: 2
              })}
              className={cn(
                'p-3 rounded-lg border-2 text-left transition-all',
                selectedUnit?.id === comp.id 
                  ? 'bg-purple-900/30 border-purple-500' 
                  : 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-purple-600" />
                <div>
                  <p className="text-xs font-bold text-purple-300">{comp.name}</p>
                  <p className="text-[9px] text-gray-500">{comp.combat_role}</p>
                </div>
              </div>
              <Progress value={(comp.health / comp.max_health) * 100} className="h-1" />
              <p className="text-[10px] text-gray-400 mt-1">
                {comp.health}/{comp.max_health} HP
              </p>
            </motion.button>
          ))}
        </div>

        {/* Selected Unit Actions */}
        {selectedUnit && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 rounded-lg p-4 border border-cyan-500/30"
          >
            <h4 className="text-sm font-bold text-cyan-300 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {selectedUnit.isPlayer ? 'Your Actions' : `${selectedUnit.name} Actions`}
            </h4>

            <div className="space-y-2">
              {/* Move button */}
              <Button
                variant="outline"
                className="w-full justify-start border-cyan-500/30 hover:bg-cyan-900/20"
                onClick={() => {
                  setSelectedAbility(null);
                  // Unit stays selected for movement
                }}
              >
                <Move className="w-4 h-4 mr-2 text-cyan-400" />
                <span className="text-sm">Move (Range: {selectedUnit.move_range || 2})</span>
              </Button>

              {/* Abilities */}
              {selectedUnit.isPlayer && playerAbilities.map(ability => {
                const AbilityIcon = ability.icon;
                return (
                  <Button
                    key={ability.id}
                    variant="outline"
                    disabled={isProcessing}
                    className="w-full justify-between border-red-500/30 hover:bg-red-900/20"
                    onClick={() => {
                      if (ability.effect === 'move_extra') {
                        selectedUnit.move_range = 4;
                        setSelectedAbility(null);
                      } else {
                        setSelectedAbility(ability);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <AbilityIcon className="w-4 h-4 text-red-400" />
                      <div className="text-left">
                        <p className="text-sm font-semibold">{ability.name}</p>
                        <p className="text-[10px] text-gray-500">
                          {ability.damage || 'Support'} • Range: {ability.range}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                );
              })}

              {/* Companion abilities */}
              {selectedUnit.type === 'companion' && selectedUnit.combat_abilities?.map((ability, i) => (
                <Button
                  key={i}
                  variant="outline"
                  disabled={isProcessing || selectedUnit.cooldowns?.[ability.id]}
                  className="w-full justify-between border-purple-500/30 hover:bg-purple-900/20"
                  onClick={() => setSelectedAbility({ ...ability, range: ability.range || 2 })}
                >
                  <div className="text-left">
                    <p className="text-sm font-semibold text-purple-300">{ability.name}</p>
                    <p className="text-[10px] text-gray-500">
                      {ability.damage ? `Dmg: [${ability.damage}]` : ability.effect}
                    </p>
                  </div>
                  {selectedUnit.cooldowns?.[ability.id] ? (
                    <Lock className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Combat Info */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-slate-800/50 rounded p-2 border border-slate-700">
            <p className="text-gray-500 mb-1">Enemies</p>
            <p className="font-bold text-red-400">{positions.enemies?.length || 1}</p>
          </div>
          <div className="bg-slate-800/50 rounded p-2 border border-slate-700">
            <p className="text-gray-500 mb-1">Allies</p>
            <p className="font-bold text-green-400">
              {1 + (positions.companions?.length || 0) + (positions.allies?.length || 0)}
            </p>
          </div>
          <div className="bg-slate-800/50 rounded p-2 border border-slate-700">
            <p className="text-gray-500 mb-1">Cover</p>
            <p className="font-bold text-gray-400">{positions.cover?.length || 0}</p>
          </div>
        </div>

        {/* Environmental Info */}
        {positions.hazards && positions.hazards.length > 0 && (
          <div className="bg-orange-900/20 rounded-lg p-3 border border-orange-500/30">
            <div className="flex items-center gap-2 text-xs text-orange-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Environmental Hazards Active</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setSelectedUnit(null);
              setSelectedAbility(null);
            }}
            variant="outline"
            className="flex-1"
            disabled={!selectedUnit}
          >
            Cancel Selection
          </Button>
          <Button
            onClick={onFlee}
            disabled={isProcessing}
            variant="destructive"
            className="flex-1"
          >
            Retreat
          </Button>
        </div>

        {/* Combat Log (last 3 entries) */}
        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
          <h4 className="text-xs font-bold text-gray-400 mb-2">Combat Log</h4>
          <div className="space-y-1 text-xs text-gray-500 max-h-24 overflow-y-auto">
            {combat.combat_log?.slice(-3).map((log, i) => (
              <p key={i}>{log}</p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Environmental interaction effects
export function applyEnvironmentalEffect(unit, position, combat) {
  const hazard = combat.grid_positions?.hazards?.find(h => h.x === position.x && h.y === position.y);
  const cover = combat.grid_positions?.cover?.find(c => c.x === position.x && c.y === position.y);

  const effects = [];

  if (hazard) {
    if (hazard.type === 'fire') {
      const damage = 5;
      unit.health -= damage;
      effects.push({ message: `${unit.name || 'Unit'} takes ${damage} fire damage!`, type: 'damage' });
    } else if (hazard.type === 'water') {
      unit.move_range = Math.max(1, (unit.move_range || 2) - 1);
      effects.push({ message: `${unit.name || 'Unit'} movement slowed by water`, type: 'debuff' });
    }
  }

  if (cover) {
    const bonus = cover.type === 'full' ? 30 : 15;
    effects.push({ 
      message: `${unit.name || 'Unit'} gained ${bonus} defense from cover`, 
      type: 'buff',
      defense_bonus: bonus
    });
  }

  return effects;
}