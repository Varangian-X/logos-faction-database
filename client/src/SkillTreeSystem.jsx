// Skill Tree System - Defines skills, perks, and progression

export const SKILL_TREES = {
  combat: {
    name: 'Combat',
    icon: '⚔️',
    color: 'red',
    description: 'Master the art of warfare',
    skills: [
      {
        id: 'basic_combat',
        name: 'Combat Training',
        tier: 1,
        cost: 1,
        prerequisites: [],
        description: 'Foundational combat techniques',
        bonuses: { damage: 10, accuracy: 5 },
        unlocks: ['dialogue_intimidate']
      },
      {
        id: 'advanced_combat',
        name: 'Advanced Tactics',
        tier: 2,
        cost: 2,
        prerequisites: ['basic_combat'],
        description: 'Complex combat maneuvers',
        bonuses: { damage: 20, crit_chance: 10 },
        unlocks: ['ability_power_strike']
      },
      {
        id: 'master_combatant',
        name: 'Master Combatant',
        tier: 3,
        cost: 3,
        prerequisites: ['advanced_combat'],
        description: 'Ultimate warrior prowess',
        bonuses: { damage: 35, crit_chance: 20, counter_chance: 15 },
        unlocks: ['ability_devastate', 'dialogue_combat_legend']
      }
    ]
  },
  
  negotiation: {
    name: 'Negotiation',
    icon: '🗣️',
    color: 'blue',
    description: 'Persuade and manipulate others',
    skills: [
      {
        id: 'basic_persuasion',
        name: 'Silver Tongue',
        tier: 1,
        cost: 1,
        prerequisites: [],
        description: 'Basic persuasion techniques',
        bonuses: { negotiation_bonus: 15 },
        unlocks: ['dialogue_persuade', 'quest_diplomatic_solutions']
      },
      {
        id: 'master_negotiator',
        name: 'Master Diplomat',
        tier: 2,
        cost: 2,
        prerequisites: ['basic_persuasion'],
        description: 'Expert at reading people and situations',
        bonuses: { negotiation_bonus: 30, faction_gain_multiplier: 1.5 },
        unlocks: ['dialogue_manipulate', 'ability_sway_crowd']
      },
      {
        id: 'legendary_diplomat',
        name: 'Legendary Diplomat',
        tier: 3,
        cost: 3,
        prerequisites: ['master_negotiator'],
        description: 'Can negotiate impossible deals',
        bonuses: { negotiation_bonus: 50, faction_gain_multiplier: 2.0, trade_discount: 20 },
        unlocks: ['dialogue_legendary_persuasion', 'quest_impossible_negotiations']
      }
    ]
  },
  
  investigation: {
    name: 'Investigation',
    icon: '🔍',
    color: 'purple',
    description: 'Uncover secrets and gather intelligence',
    skills: [
      {
        id: 'keen_eye',
        name: 'Keen Eye',
        tier: 1,
        cost: 1,
        prerequisites: [],
        description: 'Notice hidden details',
        bonuses: { intel_gain: 25 },
        unlocks: ['discover_hidden_clues']
      },
      {
        id: 'master_detective',
        name: 'Master Detective',
        tier: 2,
        cost: 2,
        prerequisites: ['keen_eye'],
        description: 'Deduce truth from evidence',
        bonuses: { intel_gain: 50, quest_success: 15 },
        unlocks: ['dialogue_deduce', 'reveal_conspiracies']
      },
      {
        id: 'omniscient_investigator',
        name: 'Omniscient Investigator',
        tier: 3,
        cost: 3,
        prerequisites: ['master_detective'],
        description: 'Nothing escapes your notice',
        bonuses: { intel_gain: 100, quest_success: 30, reveal_all_secrets: true },
        unlocks: ['dialogue_see_through_lies', 'auto_reveal_hidden']
      }
    ]
  },
  
  espionage: {
    name: 'Espionage',
    icon: '🕵️',
    color: 'violet',
    description: 'Operate in the shadows',
    skills: [
      {
        id: 'shadow_operative',
        name: 'Shadow Operative',
        tier: 1,
        cost: 1,
        prerequisites: [],
        description: 'Basic covert operations',
        bonuses: { stealth: 20, detection_resistance: 15 },
        unlocks: ['covert_missions']
      },
      {
        id: 'master_spy',
        name: 'Master Spy',
        tier: 2,
        cost: 2,
        prerequisites: ['shadow_operative'],
        description: 'Elite espionage capabilities',
        bonuses: { stealth: 40, detection_resistance: 30, sabotage_success: 25 },
        unlocks: ['dialogue_secret_signal', 'elite_espionage_missions']
      },
      {
        id: 'ghost',
        name: 'Ghost',
        tier: 3,
        cost: 3,
        prerequisites: ['master_spy'],
        description: 'Unseen, unheard, unstoppable',
        bonuses: { stealth: 70, detection_resistance: 50, sabotage_success: 50, auto_escape: true },
        unlocks: ['impossible_infiltrations', 'dialogue_ghost_protocol']
      }
    ]
  },
  
  engineering: {
    name: 'Engineering',
    icon: '⚙️',
    color: 'green',
    description: 'Master technology and crafting',
    skills: [
      {
        id: 'tech_savvy',
        name: 'Tech Savvy',
        tier: 1,
        cost: 1,
        prerequisites: [],
        description: 'Understand advanced technology',
        bonuses: { crafting_speed: 25, repair_efficiency: 20 },
        unlocks: ['basic_crafting']
      },
      {
        id: 'master_engineer',
        name: 'Master Engineer',
        tier: 2,
        cost: 2,
        prerequisites: ['tech_savvy'],
        description: 'Create advanced devices',
        bonuses: { crafting_speed: 50, repair_efficiency: 40, item_quality: 25 },
        unlocks: ['advanced_crafting', 'dialogue_tech_expert']
      },
      {
        id: 'technomagus',
        name: 'Technomagus',
        tier: 3,
        cost: 3,
        prerequisites: ['master_engineer'],
        description: 'Technology indistinguishable from magic',
        bonuses: { crafting_speed: 100, item_quality: 50, prototype_access: true },
        unlocks: ['legendary_crafting', 'dialogue_technomagus', 'prototype_missions']
      }
    ]
  },
  
  leadership: {
    name: 'Leadership',
    icon: '👑',
    color: 'amber',
    description: 'Inspire and command others',
    skills: [
      {
        id: 'natural_leader',
        name: 'Natural Leader',
        tier: 1,
        cost: 1,
        prerequisites: [],
        description: 'People follow your lead',
        bonuses: { companion_loyalty_gain: 25, influence_gain: 20 },
        unlocks: ['rally_companions']
      },
      {
        id: 'inspiring_commander',
        name: 'Inspiring Commander',
        tier: 2,
        cost: 2,
        prerequisites: ['natural_leader'],
        description: 'Your presence bolsters allies',
        bonuses: { companion_loyalty_gain: 50, influence_gain: 40, team_combat_bonus: 15 },
        unlocks: ['dialogue_inspire', 'commander_abilities']
      },
      {
        id: 'legendary_leader',
        name: 'Legendary Leader',
        tier: 3,
        cost: 3,
        prerequisites: ['inspiring_commander'],
        description: 'Nations rise and fall at your word',
        bonuses: { companion_loyalty_gain: 100, influence_gain: 80, team_combat_bonus: 30, max_companions: 2 },
        unlocks: ['dialogue_legendary_inspiration', 'faction_leadership']
      }
    ]
  }
};

// Get all unlocked skills for player
export function getUnlockedSkills(gameState) {
  const unlocked = new Set();
  
  Object.values(SKILL_TREES).forEach(tree => {
    tree.skills.forEach(skill => {
      if (gameState.unlocked_skills?.includes(skill.id)) {
        unlocked.add(skill.id);
      }
    });
  });
  
  return unlocked;
}

// Check if skill can be unlocked
export function canUnlockSkill(skill, gameState) {
  // Check if already unlocked
  if (gameState.unlocked_skills?.includes(skill.id)) return false;
  
  // Check skill points
  const availablePoints = gameState.skill_points || 0;
  if (availablePoints < skill.cost) return false;
  
  // Check prerequisites
  const unlockedSkills = gameState.unlocked_skills || [];
  return skill.prerequisites.every(prereq => unlockedSkills.includes(prereq));
}

// Unlock a skill
export function unlockSkill(skillId, gameState) {
  const skill = findSkillById(skillId);
  if (!skill || !canUnlockSkill(skill, gameState)) return null;
  
  const newState = {
    ...gameState,
    skill_points: (gameState.skill_points || 0) - skill.cost,
    unlocked_skills: [...(gameState.unlocked_skills || []), skillId]
  };
  
  return {
    newState,
    message: `Unlocked ${skill.name}!`,
    bonuses: skill.bonuses,
    unlocks: skill.unlocks
  };
}

// Find skill by ID
export function findSkillById(skillId) {
  for (const tree of Object.values(SKILL_TREES)) {
    const skill = tree.skills.find(s => s.id === skillId);
    if (skill) return skill;
  }
  return null;
}

// Calculate total bonuses from unlocked skills
export function calculateSkillBonuses(gameState) {
  const bonuses = {};
  const unlockedSkills = gameState.unlocked_skills || [];
  
  unlockedSkills.forEach(skillId => {
    const skill = findSkillById(skillId);
    if (skill) {
      Object.entries(skill.bonuses).forEach(([key, value]) => {
        bonuses[key] = (bonuses[key] || 0) + value;
      });
    }
  });
  
  return bonuses;
}

// Get unlocked dialogue options
export function getUnlockedDialogueOptions(gameState) {
  const options = new Set();
  const unlockedSkills = gameState.unlocked_skills || [];
  
  unlockedSkills.forEach(skillId => {
    const skill = findSkillById(skillId);
    if (skill) {
      skill.unlocks?.forEach(unlock => {
        if (unlock.startsWith('dialogue_')) {
          options.add(unlock);
        }
      });
    }
  });
  
  return options;
}

// Award skill points
export function awardSkillPoints(gameState, amount, reason) {
  return {
    ...gameState,
    skill_points: (gameState.skill_points || 0) + amount,
    skill_points_earned: (gameState.skill_points_earned || 0) + amount,
    skill_point_log: [
      ...(gameState.skill_point_log || []),
      { amount, reason, turn: gameState.turn_number }
    ]
  };
}