// Different combat encounter types with unique mechanics

export const ENCOUNTER_TYPES = {
  standard: {
    id: 'standard',
    name: 'Standard Encounter',
    description: 'A typical combat encounter',
    enemy_count: 1,
    environmental_hazards: false,
    reinforcements: false,
    time_limit: null
  },
  
  ambush: {
    id: 'ambush',
    name: 'Ambush',
    description: 'Enemy gets first strike advantage',
    enemy_count: 2,
    player_starts_prone: true,
    enemy_first_strike: true,
    player_ap_penalty_first_turn: 2,
    surprise_damage: [10, 20],
    environmental_cover: 'limited'
  },
  
  boss: {
    id: 'boss',
    name: 'Boss Fight',
    description: 'A powerful unique enemy',
    enemy_count: 1,
    boss_health_multiplier: 2.5,
    boss_damage_multiplier: 1.5,
    phase_system: true,
    phases: [
      { hp_threshold: 66, name: 'Phase 2', buff: 'empowered' },
      { hp_threshold: 33, name: 'Phase 3', buff: 'enraged' }
    ],
    environmental_hazards: true,
    unique_mechanics: true
  },
  
  elite: {
    id: 'elite',
    name: 'Elite Encounter',
    description: 'Highly skilled enemies',
    enemy_count: 1,
    elite_abilities: true,
    enemy_ap_bonus: 1,
    improved_ai: true,
    better_loot: true
  },
  
  horde: {
    id: 'horde',
    name: 'Horde',
    description: 'Wave after wave of enemies',
    enemy_count: 3,
    waves: 3,
    wave_delay: 2,
    enemies_per_wave: 2,
    wave_escalation: true
  },
  
  siege: {
    id: 'siege',
    name: 'Defensive Siege',
    description: 'Hold position against waves',
    objective_defense: true,
    objective_health: 100,
    enemy_count: 2,
    reinforcements: true,
    reinforcement_turns: [3, 6, 9],
    time_limit: 15
  },
  
  assassination: {
    id: 'assassination',
    name: 'Assassination',
    description: 'Eliminate target before escape',
    enemy_count: 3,
    primary_target: true,
    target_flees_at_turn: 10,
    bodyguards: 2,
    stealth_option: true
  },
  
  duel: {
    id: 'duel',
    name: 'Honor Duel',
    description: 'One on one combat',
    enemy_count: 1,
    no_companions: true,
    no_items: false,
    honor_rules: true,
    reputation_on_win: 25,
    special_rewards: true
  },
  
  survival: {
    id: 'survival',
    name: 'Survival',
    description: 'Survive for a number of turns',
    enemy_count: 2,
    continuous_spawns: true,
    spawn_rate: 2, // turns between spawns
    survival_turns: 12,
    cannot_flee: true,
    escalating_difficulty: true
  },
  
  escort: {
    id: 'escort',
    name: 'Escort Mission',
    description: 'Protect an ally to the exit',
    enemy_count: 2,
    escort_npc: true,
    npc_health: 50,
    npc_cannot_fight: true,
    objective_distance: 10,
    ambush_points: [3, 7]
  }
};

export function initializeEncounter(type, enemyType, gameState) {
  const encounterConfig = ENCOUNTER_TYPES[type] || ENCOUNTER_TYPES.standard;
  
  const encounter = {
    encounter_type: type,
    ...encounterConfig,
    turn_number: 1,
    current_phase: 1,
    enemies_defeated: 0,
    waves_completed: 0,
    objective_status: 'active',
    environmental_effects: [],
    special_conditions: {}
  };

  // Apply type-specific initialization
  if (type === 'ambush') {
    encounter.player_surprised = true;
    encounter.surprise_round = true;
  }

  if (type === 'boss') {
    encounter.boss_phase = 1;
    encounter.phase_transitions = [];
  }

  if (type === 'horde' || type === 'survival') {
    encounter.spawn_queue = [];
    encounter.next_spawn_turn = encounterConfig.spawn_rate || 3;
  }

  if (type === 'siege' || type === 'escort') {
    encounter.objective_health = encounterConfig.objective_health || 100;
    encounter.objective_max_health = encounterConfig.objective_health || 100;
  }

  return encounter;
}

export function updateEncounterState(encounter, combat, gameState) {
  const updates = {};

  // Boss phase transitions
  if (encounter.encounter_type === 'boss' && encounter.phase_system) {
    const healthPercent = (combat.enemy_health / combat.enemy_max_health) * 100;
    
    encounter.phases?.forEach(phase => {
      if (healthPercent <= phase.hp_threshold && encounter.boss_phase < (phase.hp_threshold / 33)) {
        updates.phase_transition = {
          new_phase: Math.floor(phase.hp_threshold / 33) + 1,
          name: phase.name,
          buff: phase.buff,
          message: `${combat.enemy_name} transitions to ${phase.name}!`
        };
        encounter.boss_phase = updates.phase_transition.new_phase;
      }
    });
  }

  // Horde wave spawning
  if (encounter.encounter_type === 'horde' && encounter.turn_number >= encounter.next_spawn_turn) {
    if (encounter.waves_completed < encounter.waves) {
      updates.spawn_wave = {
        wave_number: encounter.waves_completed + 1,
        enemy_count: encounter.enemies_per_wave,
        escalation: encounter.wave_escalation
      };
      encounter.waves_completed++;
      encounter.next_spawn_turn = encounter.turn_number + encounter.wave_delay;
    }
  }

  // Survival spawning
  if (encounter.encounter_type === 'survival' && encounter.turn_number >= encounter.next_spawn_turn) {
    updates.spawn_enemy = true;
    encounter.next_spawn_turn = encounter.turn_number + encounter.spawn_rate;
  }

  // Time limit checks
  if (encounter.time_limit && encounter.turn_number >= encounter.time_limit) {
    updates.time_expired = true;
    updates.result = encounter.encounter_type === 'survival' ? 'victory' : 'defeat';
  }

  // Assassination target escape
  if (encounter.encounter_type === 'assassination') {
    if (encounter.turn_number >= encounter.target_flees_at_turn && !encounter.target_eliminated) {
      updates.target_escaped = true;
      updates.result = 'defeat';
    }
  }

  encounter.turn_number++;
  
  return updates;
}

export function getEncounterRewards(encounter, performance) {
  const baseRewards = {
    credits: 100,
    intel: 10,
    reputation: 5,
    xp: 50
  };

  const typeMultipliers = {
    standard: 1.0,
    ambush: 1.2,
    boss: 2.5,
    elite: 1.8,
    horde: 1.5,
    siege: 1.6,
    assassination: 1.7,
    duel: 1.4,
    survival: 2.0,
    escort: 1.3
  };

  const multiplier = typeMultipliers[encounter.encounter_type] || 1.0;

  // Performance bonuses
  let perfBonus = 1.0;
  if (performance.turns_taken <= 5) perfBonus += 0.3;
  if (performance.damage_taken < 30) perfBonus += 0.2;
  if (performance.perfect_victory) perfBonus += 0.5;

  const finalRewards = Object.entries(baseRewards).reduce((acc, [key, value]) => {
    acc[key] = Math.floor(value * multiplier * perfBonus);
    return acc;
  }, {});

  // Special rewards
  if (encounter.encounter_type === 'boss') {
    finalRewards.special_loot = true;
    finalRewards.reputation += 15;
  }

  if (encounter.encounter_type === 'duel' && encounter.honor_rules) {
    finalRewards.reputation += encounter.reputation_on_win || 25;
  }

  return finalRewards;
}