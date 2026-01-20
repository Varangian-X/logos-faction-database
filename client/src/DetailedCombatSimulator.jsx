// Detailed combat simulation with unit composition, terrain, and positioning

const TERRAIN_MODIFIERS = {
  space: { fleet_bonus: 0, ground_penalty: -999 },
  orbital: { fleet_bonus: 10, ground_bonus: 5 },
  urban: { ground_bonus: 15, armor_penalty: -10 },
  plains: { armor_bonus: 20, infantry_penalty: -5 },
  mountains: { infantry_bonus: 15, armor_penalty: -15 },
  forest: { infantry_bonus: 10, special_forces_bonus: 20 }
};

const UNIT_STRENGTHS = {
  // Fleet
  corvette: { vs_fighter: 20, vs_frigate: -10 },
  frigate: { vs_corvette: 10, vs_destroyer: -10 },
  destroyer: { vs_cruiser: -15, vs_frigate: 15 },
  cruiser: { vs_destroyer: 15, vs_battleship: -20 },
  battleship: { vs_cruiser: 20, vs_carrier: 10 },
  carrier: { vs_corvette: 15, vs_battleship: -10 },
  
  // Ground
  infantry: { vs_infantry: 0, vs_armor: -20 },
  mechanized: { vs_infantry: 10, vs_armor: -10 },
  armor: { vs_infantry: 20, vs_armor: 0, vs_artillery: 15 },
  artillery: { vs_infantry: 15, vs_armor: -15 },
  special_forces: { vs_all: 10 },
  drop_troops: { first_strike: true, vs_all: 5 }
};

export function analyzeComposition(units) {
  const composition = { fleet: {}, ground: {} };
  
  units.forEach(unit => {
    const type = unit.class || unit.type;
    if (unit.class) {
      composition.fleet[type] = (composition.fleet[type] || 0) + 1;
    } else {
      composition.ground[type] = (composition.ground[type] || 0) + 1;
    }
  });
  
  return composition;
}

export function calculatePositioningBonus(attackerComp, defenderComp, isDefender) {
  let bonus = 0;
  
  // Defender advantage
  if (isDefender) bonus += 15;
  
  // Composition synergies
  const totalFleet = Object.values(attackerComp.fleet).reduce((a, b) => a + b, 0);
  const totalGround = Object.values(attackerComp.ground).reduce((a, b) => a + b, 0);
  
  // Combined arms bonus
  if (totalFleet > 0 && totalGround > 0) bonus += 10;
  
  // Fleet composition
  if (attackerComp.fleet.carrier && attackerComp.fleet.battleship) bonus += 8;
  if (attackerComp.fleet.destroyer && attackerComp.fleet.corvette) bonus += 5;
  
  // Ground composition
  if (attackerComp.ground.armor && attackerComp.ground.mechanized) bonus += 8;
  if (attackerComp.ground.artillery && attackerComp.ground.infantry) bonus += 6;
  if (attackerComp.ground.special_forces) bonus += attackerComp.ground.special_forces * 3;
  
  return bonus;
}

export function calculateUnitDamage(unit, opposingComp, terrain) {
  const unitType = unit.class || unit.type;
  const isFleet = !!unit.class;
  
  let baseDamage = isFleet ? 
    { corvette: 8, frigate: 20, destroyer: 40, cruiser: 80, battleship: 200, carrier: 120 }[unitType] :
    { infantry: 4, mechanized: 10, armor: 20, artillery: 25, special_forces: 35, drop_troops: 30 }[unitType];
  
  // Veterancy multiplier
  const veterancyBonus = 1 + ((unit.experience || 0) / 100);
  baseDamage *= veterancyBonus;
  
  // Terrain modifiers
  if (terrain && !isFleet) {
    const terrainMod = TERRAIN_MODIFIERS[terrain];
    if (terrainMod) {
      if (terrainMod[`${unitType}_bonus`]) baseDamage *= (1 + terrainMod[`${unitType}_bonus`] / 100);
      if (terrainMod[`${unitType}_penalty`]) baseDamage *= (1 + terrainMod[`${unitType}_penalty`] / 100);
      if (terrainMod.ground_bonus) baseDamage *= (1 + terrainMod.ground_bonus / 100);
    }
  }
  
  // Type effectiveness
  const strengths = UNIT_STRENGTHS[unitType] || {};
  let effectivenessMultiplier = 1;
  
  Object.entries(opposingComp.fleet).forEach(([oppType, count]) => {
    if (strengths[`vs_${oppType}`]) {
      effectivenessMultiplier += (strengths[`vs_${oppType}`] / 100) * (count / 10);
    }
  });
  
  Object.entries(opposingComp.ground).forEach(([oppType, count]) => {
    if (strengths[`vs_${oppType}`]) {
      effectivenessMultiplier += (strengths[`vs_${oppType}`] / 100) * (count / 10);
    }
  });
  
  if (strengths.vs_all) effectivenessMultiplier += strengths.vs_all / 100;
  
  return baseDamage * effectivenessMultiplier;
}

export function distributeIncomingDamage(units, totalDamage, opposingComp) {
  const casualties = [];
  const damaged = [];
  let remainingDamage = totalDamage;
  
  // Sort by vulnerability (lowest health/defense first)
  const sortedUnits = [...units].sort((a, b) => {
    const aHealth = a.current_health || 100;
    const bHealth = b.current_health || 100;
    return aHealth - bHealth;
  });
  
  sortedUnits.forEach(unit => {
    if (remainingDamage <= 0) return;
    
    const unitHealth = unit.current_health || 100;
    const unitType = unit.class || unit.type;
    
    // Defense value
    const defense = unit.class ? 
      { corvette: 5, frigate: 10, destroyer: 20, cruiser: 35, battleship: 50, carrier: 30 }[unitType] :
      { infantry: 3, mechanized: 8, armor: 15, artillery: 5, special_forces: 20, drop_troops: 12 }[unitType];
    
    const damageReduction = defense * (1 + (unit.experience || 0) / 200);
    const effectiveDamage = Math.max(1, remainingDamage / 10 - damageReduction);
    
    const newHealth = unitHealth - effectiveDamage;
    
    if (newHealth <= 0) {
      casualties.push(unit);
      remainingDamage -= unitHealth;
    } else {
      damaged.push({ ...unit, current_health: newHealth, damage_taken: effectiveDamage });
      remainingDamage -= effectiveDamage;
    }
  });
  
  return { casualties, damaged, overkill: Math.max(0, remainingDamage) };
}

export function simulateDetailedCombat(attackerFleet, attackerForces, defenderFleet, defenderForces, attackerHouse, defenderHouse, terrain = 'space') {
  // Initialize health for all units
  const initUnits = (units) => units.map(u => ({ ...u, current_health: u.current_health || 100 }));
  
  let atkFleet = initUnits(attackerFleet);
  let atkForces = initUnits(attackerForces);
  let defFleet = initUnits(defenderFleet);
  let defForces = initUnits(defenderForces);
  
  const atkComp = analyzeComposition([...atkFleet, ...atkForces]);
  const defComp = analyzeComposition([...defFleet, ...defForces]);
  
  const atkPositioning = calculatePositioningBonus(atkComp, defComp, false);
  const defPositioning = calculatePositioningBonus(defComp, atkComp, true);
  
  const rounds = [];
  let roundNum = 1;
  
  // Combat rounds (max 5)
  while (roundNum <= 5 && (atkFleet.length + atkForces.length > 0) && (defFleet.length + defForces.length > 0)) {
    const roundLog = { round: roundNum, events: [] };
    
    // Calculate total damage per side
    const atkFleetDamage = atkFleet.reduce((sum, ship) => sum + calculateUnitDamage(ship, defComp, terrain), 0);
    const atkForceDamage = atkForces.reduce((sum, unit) => sum + calculateUnitDamage(unit, defComp, terrain), 0);
    const atkTotalDamage = (atkFleetDamage + atkForceDamage) * (1 + atkPositioning / 100);
    
    const defFleetDamage = defFleet.reduce((sum, ship) => sum + calculateUnitDamage(ship, atkComp, terrain), 0);
    const defForceDamage = defForces.reduce((sum, unit) => sum + calculateUnitDamage(unit, atkComp, terrain), 0);
    const defTotalDamage = (defFleetDamage + defForceDamage) * (1 + defPositioning / 100);
    
    // Apply damage to defender
    const defFleetResult = distributeIncomingDamage(defFleet, atkFleetDamage * 0.6, atkComp);
    const defForceResult = distributeIncomingDamage(defForces, atkForceDamage + (atkFleetDamage * 0.4), atkComp);
    
    defFleet = defFleetResult.damaged;
    defForces = defForceResult.damaged;
    
    roundLog.events.push(`Attacker dealt ${Math.round(atkTotalDamage)} damage`);
    roundLog.events.push(`Defender lost ${defFleetResult.casualties.length} ships, ${defForceResult.casualties.length} units`);
    
    // Apply damage to attacker
    const atkFleetResult = distributeIncomingDamage(atkFleet, defFleetDamage * 0.6, defComp);
    const atkForceResult = distributeIncomingDamage(atkForces, defForceDamage + (defFleetDamage * 0.4), defComp);
    
    atkFleet = atkFleetResult.damaged;
    atkForces = atkForceResult.damaged;
    
    roundLog.events.push(`Defender dealt ${Math.round(defTotalDamage)} damage`);
    roundLog.events.push(`Attacker lost ${atkFleetResult.casualties.length} ships, ${atkForceResult.casualties.length} units`);
    
    rounds.push(roundLog);
    roundNum++;
  }
  
  const attackerSurvived = atkFleet.length + atkForces.length;
  const defenderSurvived = defFleet.length + defForces.length;
  const victory = attackerSurvived > defenderSurvived;
  
  // Grant veterancy to survivors
  const xpGain = victory ? 20 : 10;
  atkFleet = atkFleet.map(u => ({ ...u, experience: (u.experience || 0) + xpGain }));
  atkForces = atkForces.map(u => ({ ...u, experience: (u.experience || 0) + xpGain }));
  defFleet = defFleet.map(u => ({ ...u, experience: (u.experience || 0) + (victory ? 5 : 15) }));
  defForces = defForces.map(u => ({ ...u, experience: (u.experience || 0) + (victory ? 5 : 15) }));
  
  return {
    victory,
    rounds,
    attackerSurvivors: { fleet: atkFleet, forces: atkForces },
    defenderSurvivors: { fleet: defFleet, forces: defForces },
    attackerLosses: {
      fleet: attackerFleet.length - atkFleet.length,
      forces: attackerForces.length - atkForces.length
    },
    defenderLosses: {
      fleet: defenderFleet.length - defFleet.length,
      forces: defenderForces.length - defForces.length
    },
    terrain,
    positioning: { attacker: atkPositioning, defender: defPositioning }
  };
}