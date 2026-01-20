
import { CombatTacticalState, AI_DIFFICULTY } from './AdvancedEnemyAI';
import { CompanionCoordination } from './EnhancedCompanionAI';

export class TacticalCombatManager {
  constructor(difficulty = AI_DIFFICULTY.NORMAL) {
    this.enemyTacticalState = new CombatTacticalState(difficulty);
    this.companionCoordination = new CompanionCoordination();
    this.combatHistory = [];