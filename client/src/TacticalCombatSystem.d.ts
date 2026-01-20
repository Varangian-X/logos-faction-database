export interface CombatState {
  turn_number: number;
  allies_lost: number;
  enemies_defeated: number;
  player_health: number;
  enemy_health: number;
  enemy_max_health: number;
}

export interface Unit {
  id?: string;
  health?: number;
  max_health?: number;
  combat_role?: string;
  loyalty?: number;
  is_recruited?: boolean;
}

export interface MoraleState {
  player_morale: number;
  enemy_morale: number;
  player_effects: any;
  enemy_effects: any;
}

export class TacticalCombatManager {
  constructor(difficulty?: string);
  processCombatRound(combat: CombatState, player: any, companions: Unit[], enemies: Unit[]): any;
  getCombatRecommendations(combat: CombatState, companions: Unit[], enemies: Unit[]): any[];
  resetCombat(): void;
}

export function calculatePositionModifiers(attacker: any, defender: any, combat: CombatState): any;
export function getEnvironmentalFactors(location: string, weather?: string): any;
export function calculateMorale(combat: CombatState, allies: Unit[], enemies: Unit[]): MoraleState;
