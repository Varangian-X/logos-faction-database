/**
 * DetailedCombatSimulator - Combat simulation module
 * Provides detailed round-by-round combat resolution
 */

export interface CombatUnit {
  id: string;
  name: string;
  health?: number;
  current_health?: number;
  maxHealth?: number;
  max_health?: number;
  attack?: number;
  defense?: number;
  speed?: number;
  morale?: number;
  class?: string;
  experience?: number;
}

export interface RoundData {
  events: string[];
  attackerDamage: number;
  defenderDamage: number;
}

export interface CombatResult {
  victory: boolean;
  rounds: RoundData[];
  playerCasualties: number;
  enemyCasualties: number;
  log: string[];
  attackerSurvivors: { fleet: CombatUnit[] };
  defenderSurvivors: { fleet: CombatUnit[] };
}

export function simulateDetailedCombat(
  attackerShips: CombatUnit[],
  attackerSupport: CombatUnit[],
  defenderShips: CombatUnit[],
  defenderSupport: CombatUnit[],
  attackerName: string,
  defenderName: string,
  terrain?: string
): CombatResult {
  const log: string[] = [];
  const rounds: RoundData[] = [];
  
  // Clone ships to track health
  const attackerFleet = attackerShips.map(s => ({
    ...s,
    current_health: s.current_health || s.health || 100,
    max_health: s.max_health || s.maxHealth || 100
  }));
  
  const defenderFleet = defenderShips.map(s => ({
    ...s,
    current_health: s.current_health || s.health || 100,
    max_health: s.max_health || s.maxHealth || 100
  }));
  
  let roundCount = 0;
  const maxRounds = 10;
  
  while (attackerFleet.length > 0 && defenderFleet.length > 0 && roundCount < maxRounds) {
    roundCount++;
    const events: string[] = [];
    
    // Calculate damage
    const attackerPower = attackerFleet.reduce((sum, s) => sum + (s.attack || 10), 0);
    const defenderPower = defenderFleet.reduce((sum, s) => sum + (s.defense || 10), 0);
    
    const attackerDamage = Math.floor(Math.random() * attackerPower * 0.5) + 5;
    const defenderDamage = Math.floor(Math.random() * defenderPower * 0.5) + 5;
    
    events.push(`Round ${roundCount}: ${attackerName} attacks for ${attackerDamage} damage`);
    events.push(`Round ${roundCount}: ${defenderName} retaliates for ${defenderDamage} damage`);
    
    // Apply damage to defender
    if (defenderFleet.length > 0) {
      const target = defenderFleet[0];
      target.current_health = (target.current_health || 100) - attackerDamage;
      if (target.current_health <= 0) {
        events.push(`${target.name} destroyed!`);
        defenderFleet.shift();
      }
    }
    
    // Apply damage to attacker
    if (attackerFleet.length > 0) {
      const target = attackerFleet[0];
      target.current_health = (target.current_health || 100) - defenderDamage;
      if (target.current_health <= 0) {
        events.push(`${target.name} destroyed!`);
        attackerFleet.shift();
      }
    }
    
    rounds.push({ events, attackerDamage, defenderDamage });
    log.push(...events);
  }
  
  const victory = attackerFleet.length > 0 && defenderFleet.length === 0;
  
  return {
    victory,
    rounds,
    playerCasualties: attackerShips.length - attackerFleet.length,
    enemyCasualties: defenderShips.length - defenderFleet.length,
    log,
    attackerSurvivors: { fleet: attackerFleet },
    defenderSurvivors: { fleet: defenderFleet }
  };
}

export default { simulateDetailedCombat };
