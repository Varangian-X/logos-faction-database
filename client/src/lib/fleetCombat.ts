import { Fleet, ShipClass, SHIP_CLASSES, calculateFleetPower } from "./fleetManagement";
import { FactionResources } from "./factionDynamics";

export interface CombatResult {
  winner: "Attacker" | "Defender";
  attackerLosses: { shipClassId: string; count: number }[];
  defenderLosses: { shipClassId: string; count: number }[];
  log: string[];
  loot?: Partial<FactionResources>;
}

export function resolveFleetCombat(attacker: Fleet, defender: Fleet): CombatResult {
  const attackerPower = calculateFleetPower(attacker);
  const defenderPower = calculateFleetPower(defender);
  
  // Random variance +/- 20%
  const attackerRoll = attackerPower * (0.8 + Math.random() * 0.4);
  const defenderRoll = defenderPower * (0.8 + Math.random() * 0.4);
  
  const winner = attackerRoll > defenderRoll ? "Attacker" : "Defender";
  const log: string[] = [];
  
  log.push(`Combat initiated between ${attacker.name} and ${defender.name}.`);
  log.push(`Attacker Power: ${Math.round(attackerPower)} (Roll: ${Math.round(attackerRoll)})`);
  log.push(`Defender Power: ${Math.round(defenderPower)} (Roll: ${Math.round(defenderRoll)})`);
  
  // Calculate losses based on power difference
  const powerRatio = winner === "Attacker" 
    ? defenderRoll / attackerRoll 
    : attackerRoll / defenderRoll;
    
  const loserLossRate = 0.5 + (1 - powerRatio) * 0.5; // 50% to 100% losses
  const winnerLossRate = 0.1 + powerRatio * 0.2; // 10% to 30% losses
  
  const attackerLosses = calculateLosses(attacker, winner === "Attacker" ? winnerLossRate : loserLossRate);
  const defenderLosses = calculateLosses(defender, winner === "Defender" ? winnerLossRate : loserLossRate);
  
  log.push(`Winner: ${winner}`);
  log.push(`Attacker lost ${countTotalShips(attackerLosses)} ships.`);
  log.push(`Defender lost ${countTotalShips(defenderLosses)} ships.`);
  
  return {
    winner,
    attackerLosses,
    defenderLosses,
    log,
    loot: winner === "Attacker" ? { credits: Math.floor(Math.random() * 500) } : undefined
  };
}

function calculateLosses(fleet: Fleet, rate: number): { shipClassId: string; count: number }[] {
  return fleet.ships.map(stack => ({
    shipClassId: stack.shipClassId,
    count: Math.floor(stack.count * rate * (0.8 + Math.random() * 0.4)) // Add some variance
  })).filter(l => l.count > 0);
}

function countTotalShips(losses: { shipClassId: string; count: number }[]): number {
  return losses.reduce((acc, curr) => acc + curr.count, 0);
}
