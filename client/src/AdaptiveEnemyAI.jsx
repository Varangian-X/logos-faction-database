// Adaptive Enemy AI that learns from player behavior
import { enemyTypes, enemyAbilities } from './EnemyAI';

export class AdaptiveAIController {
  constructor(enemyType, encounterType = 'standard') {
    this.enemyType = enemyType;
    this.encounterType = encounterType;
    this.playerBehaviorProfile = {
      aggression_score: 0,
      defensive_score: 0,
      ability_usage: 0,
      pattern_consistency: 0,
      action_history: []
    };
    this.adaptations = new Set();
    this.turnsSinceLastAdaptation = 0;
  }

  recordPlayerAction(action, result) {
    this.playerBehaviorProfile.action_history.push({ action, result, turn: this.turnsSinceLastAdaptation });
    
    if (this.playerBehaviorProfile.action_history.length > 8) {
      this.playerBehaviorProfile.action_history.shift();
    }

    // Update behavior scores
    if (action.id === 'aggressive_strike') this.playerBehaviorProfile.aggression_score += 2;
    if (action.id === 'defensive_counter') this.playerBehaviorProfile.defensive_score += 2;
    if (action.id?.includes('ability') || action.id?.includes('augmentation')) this.playerBehaviorProfile.ability_usage += 1;

    // Decay scores over time
    this.playerBehaviorProfile.aggression_score *= 0.9;
    this.playerBehaviorProfile.defensive_score *= 0.9;

    this.turnsSinceLastAdaptation++;
  }

  shouldAdapt() {
    return this.turnsSinceLastAdaptation >= 3 && Math.random() < 0.6;
  }

  getAdaptiveAction(combat, availableActions) {
    const profile = this.analyzePlayerBehavior();
    
    // Boss fights adapt more aggressively
    const adaptChance = this.encounterType === 'boss' ? 0.8 : 0.5;
    
    if (this.shouldAdapt() && Math.random() < adaptChance) {
      const adaptation = this.selectAdaptation(profile, combat, availableActions);
      if (adaptation) {
        this.adaptations.add(adaptation.type);
        this.turnsSinceLastAdaptation = 0;
        return adaptation;
      }
    }

    return null;
  }

  analyzePlayerBehavior() {
    const history = this.playerBehaviorProfile.action_history;
    const recentActions = history.slice(-4);

    // Detect patterns
    const actionTypes = recentActions.map(h => h.action.id);
    const uniqueActions = new Set(actionTypes);
    const isRepetitive = uniqueActions.size <= 2 && recentActions.length >= 3;

    return {
      is_aggressive: this.playerBehaviorProfile.aggression_score > this.playerBehaviorProfile.defensive_score,
      is_defensive: this.playerBehaviorProfile.defensive_score > this.playerBehaviorProfile.aggression_score,
      uses_abilities_heavily: this.playerBehaviorProfile.ability_usage > 3,
      is_repetitive: isRepetitive,
      pattern: actionTypes,
      dominant_action: this.getMostFrequentAction(actionTypes)
    };
  }

  getMostFrequentAction(actions) {
    const counts = {};
    actions.forEach(a => counts[a] = (counts[a] || 0) + 1);
    return Object.entries(counts).reduce((max, [action, count]) => 
      count > max.count ? { action, count } : max, { action: null, count: 0 }
    ).action;
  }

  selectAdaptation(profile, combat, availableActions) {
    const adaptations = [];

    // Counter aggressive play
    if (profile.is_aggressive && !this.adaptations.has('defensive_stance')) {
      adaptations.push({
        type: 'defensive_stance',
        action: 'adapt_defensive',
        message: `${combat.enemy_name} recognizes your aggression and adopts a defensive stance!`,
        effects: { 
          defense_boost: 25, 
          counter_damage: 15,
          status_effect: 'counter_stance'
        }
      });
    }

    // Counter defensive play
    if (profile.is_defensive && !this.adaptations.has('armor_pierce')) {
      adaptations.push({
        type: 'armor_pierce',
        action: 'adapt_piercing',
        message: `${combat.enemy_name} adapts attacks to pierce your defenses!`,
        effects: { 
          ignore_armor: 50, 
          guaranteed_damage: 10,
          status_effect: 'armor_piercing'
        }
      });
    }

    // Counter ability spam
    if (profile.uses_abilities_heavily && !this.adaptations.has('ability_disrupt')) {
      adaptations.push({
        type: 'ability_disrupt',
        action: 'adapt_disruption',
        message: `${combat.enemy_name} deploys countermeasures against your augmentations!`,
        effects: { 
          ability_cost_increase: 2,
          status_effect: 'disrupted',
          duration: 3
        }
      });
    }

    // Exploit patterns
    if (profile.is_repetitive && profile.dominant_action && !this.adaptations.has('pattern_counter')) {
      adaptations.push({
        type: 'pattern_counter',
        action: 'adapt_pattern',
        message: `${combat.enemy_name} has learned your pattern and counters it!`,
        effects: { 
          evasion_vs_pattern: 40,
          counter_damage: 20,
          status_effect: 'pattern_read'
        }
      });
    }

    return adaptations.length > 0 ? adaptations[Math.floor(Math.random() * adaptations.length)] : null;
  }

  // Boss-specific adaptations
  getBossPhaseAdaptation(healthPercent, phase) {
    const phases = {
      2: { // 66% HP
        message: "Enemy enters Phase 2 - attacks become more aggressive!",
        effects: { 
          damage_boost: 25, 
          action_points_increase: 1,
          new_abilities: ['enrage', 'multi_strike']
        }
      },
      3: { // 33% HP
        message: "Enemy enters Phase 3 - desperate fury unleashed!",
        effects: { 
          damage_boost: 50, 
          speed_boost: 30,
          action_points_increase: 2,
          new_abilities: ['devastate', 'final_stand']
        }
      }
    };

    if (healthPercent <= 33 && phase < 3) return phases[3];
    if (healthPercent <= 66 && phase < 2) return phases[2];
    
    return null;
  }
}