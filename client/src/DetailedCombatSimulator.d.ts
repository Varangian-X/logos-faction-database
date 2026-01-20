export interface Unit {
  id?: string;
  name?: string;
  class?: string;
  type?: string;
  current_health?: number;
  max_health?: number;
  experience?: number;
}

export interface CombatResult {
  victory: boolean;
  rounds: Array<{
    round: number;
    events: string[];
  }>;
  attackerSurvivors: {
    fleet: Unit[];
    forces: Unit[];
  };
  defenderSurvivors: {
    fleet: Unit[];
    forces: Unit[];
  };
  attackerLosses: {
    fleet: number;
    forces: number;
  };
  defenderLosses: {
    fleet: number;
    forces: number;
  };
  terrain: string;
  positioning: {
    attacker: number;
    defender: number;
  };
}

export function analyzeComposition(units: Unit[]): any;
export function calculatePositioningBonus(attackerComp: any, defenderComp: any, isDefender: boolean): number;
export function calculateUnitDamage(unit: Unit, opposingComp: any, terrain: string): number;
export function distributeIncomingDamage(units: Unit[], totalDamage: number, opposingComp: any): any;
export function simulateDetailedCombat(
  attackerFleet: Unit[],
  attackerForces: Unit[],
  defenderFleet: Unit[],
  defenderForces: Unit[],
  attackerHouse: string,
  defenderHouse: string,
  terrain?: string
): CombatResult;
