// Integration between Skills/Reputation and Quest System

import { getUnlockedDialogueOptions, calculateSkillBonuses } from './SkillTreeSystem';
import { hasReputationRequirement, getFactionBenefits } from '../reputation/EnhancedReputationSystem';

// Check if quest is available based on skills and reputation
export function isQuestAvailable(quest, gameState) {
  // Check reputation requirements
  if (quest.requirements?.min_reputation) {
    if ((gameState.reputation || 0) < quest.requirements.min_reputation) {
      return false;
    }
  }
  
  // Check faction reputation
  if (quest.requirements?.faction_reputation) {
    const hasRep = hasReputationRequirement(gameState, {
      faction: quest.faction_sponsor,
      min_standing: quest.requirements.faction_reputation
    });
    if (!hasRep) return false;
  }
  
  // Check skill requirements
  if (quest.requirements?.required_skills) {
    const unlockedSkills = gameState.unlocked_skills || [];
    const hasSkills = quest.requirements.required_skills.every(skillId => 
      unlockedSkills.includes(skillId)
    );
    if (!hasSkills) return false;
  }
  
  // Check skill level requirements
  if (quest.requirements?.min_skill_level) {
    const skills = gameState.skills || {};
    const hasLevel = Object.values(skills).some(skill => 
      skill.level >= quest.requirements.min_skill_level
    );
    if (!hasLevel) return false;
  }
  
  return true;
}

// Get quest success bonus from skills
export function getQuestSuccessBonus(quest, gameState) {
  const bonuses = calculateSkillBonuses(gameState);
  let totalBonus = 0;
  
  // General quest success bonus
  if (bonuses.quest_success) {
    totalBonus += bonuses.quest_success;
  }
  
  // Type-specific bonuses
  const questType = quest.quest_type || quest.type;
  
  if (questType === 'investigation' && bonuses.intel_gain) {
    totalBonus += Math.floor(bonuses.intel_gain / 10);
  }
  
  if (questType === 'combat' && bonuses.damage) {
    totalBonus += Math.floor(bonuses.damage / 5);
  }
  
  if (questType === 'diplomacy' && bonuses.negotiation_bonus) {
    totalBonus += bonuses.negotiation_bonus;
  }
  
  if (questType === 'sabotage' && bonuses.sabotage_success) {
    totalBonus += bonuses.sabotage_success;
  }
  
  // Faction benefits
  if (quest.faction_sponsor) {
    const benefits = getFactionBenefits(quest.faction_sponsor, 
      gameState.faction_relations?.[quest.faction_sponsor] || 0
    );
    
    // Each benefit tier adds success bonus
    totalBonus += benefits.length * 5;
  }
  
  return totalBonus;
}

// Get special quest options unlocked by skills
export function getSkillUnlockedQuestOptions(quest, gameState) {
  const unlockedDialogue = getUnlockedDialogueOptions(gameState);
  const options = [];
  
  // Check for skill-based alternatives
  if (unlockedDialogue.has('dialogue_persuade')) {
    options.push({
      id: 'persuade_alternative',
      text: '[Persuasion] Convince them peacefully',
      skill_based: true,
      bonus_success: 20,
      avoid_combat: true
    });
  }
  
  if (unlockedDialogue.has('dialogue_intimidate')) {
    options.push({
      id: 'intimidate_alternative',
      text: '[Combat Expert] Intimidate into submission',
      skill_based: true,
      bonus_success: 15,
      avoid_negotiation: true
    });
  }
  
  if (unlockedDialogue.has('dialogue_tech_expert')) {
    options.push({
      id: 'tech_alternative',
      text: '[Engineering] Use technology to solve this',
      skill_based: true,
      bonus_rewards: { intel: 20 },
      unique_solution: true
    });
  }
  
  if (unlockedDialogue.has('dialogue_ghost_protocol')) {
    options.push({
      id: 'stealth_alternative',
      text: '[Ghost] Complete mission without detection',
      skill_based: true,
      bonus_rewards: { intel: 30, reputation: 10 },
      perfect_execution: true
    });
  }
  
  return options;
}

// Award skill points based on quest completion
export function awardSkillPointsForQuest(quest, gameState, performance = 'normal') {
  const basePoints = {
    simple: 1,
    moderate: 2,
    complex: 3,
    high: 3,
    very_high: 4,
    epic: 5
  };
  
  let points = basePoints[quest.complexity] || 1;
  
  // Performance multiplier
  if (performance === 'perfect') points += 1;
  if (performance === 'excellent') points += 0.5;
  
  // First quest bonus
  if (!gameState.completed_quests || gameState.completed_quests.length === 0) {
    points += 1;
  }
  
  return Math.floor(points);
}