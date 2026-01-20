// Player Trait Effects - Apply trait bonuses and faction AI modifications

import { BACKGROUNDS, TRAITS, generatePlayerProfile } from './CharacterCustomizationData';

// Apply starting bonuses to game state
export function applyStartingBonuses(gameState, customization) {
  const background = BACKGROUNDS[customization.background];
  if (!background) return gameState;

  const updated = { ...gameState };

  // Apply skill bonuses
  Object.entries(background.bonuses).forEach(([key, value]) => {
    if (key.includes('_skill')) {
      const skillName = key.replace('_skill', '');
      if (updated.skills[skillName]) {
        updated.skills[skillName].level += value;
      }
    }
  });

  // Apply resource bonuses
  updated.credits += background.starting_resources.credits || 0;
  updated.influence += background.starting_resources.influence || 0;
  updated.intel += background.starting_resources.intel || 0;

  // Apply reputation bonus
  updated.reputation += background.bonuses.starting_reputation || 0;

  // Apply faction relations
  Object.entries(background.bonuses.faction_relations || {}).forEach(([faction, value]) => {
    updated.faction_relations[faction] = (updated.faction_relations[faction] || 0) + value;
  });

  // Store player profile
  updated.player_profile = generatePlayerProfile(customization);

  return updated;
}

// Modify faction AI behavior based on player traits
export function modifyFactionAIInteraction(faction, action, playerProfile) {
  if (!playerProfile || !playerProfile.interaction_modifiers) return action;

  const modifier = playerProfile.interaction_modifiers[faction.faction_id] || 0;

  // Apply interaction modifiers
  if (action.type === 'faction_proposal' || action.type === 'diplomatic_action') {
    // Factions with positive modifiers are more friendly
    if (modifier > 0) {
      action.acceptance_chance = (action.acceptance_chance || 0.5) + modifier;
      action.relationship_bonus = Math.round((action.relationship_bonus || 0) * (1 + modifier));
    }
  }

  if (action.type === 'faction_reaction') {
    // Traits affect faction reactions
    if (playerProfile.trait === 'warriors_honor' && faction.faction_id === 'varangians') {
      action.respect_bonus = 20;
      action.message = `${faction.name} deeply respects your warrior's honor`;
    }

    if (playerProfile.trait === 'shadow_operative' && faction.faction_id === 'agentes_in_rebus') {
      action.unique_missions_unlocked = true;
    }
  }

  return action;
}

// Apply combat trait bonuses
export function applyCombatTraitBonus(combatState, playerProfile) {
  if (!playerProfile || !playerProfile.special_abilities) return combatState;

  const abilities = playerProfile.special_abilities;

  // Combat bonus
  if (abilities.combat_bonus) {
    combatState.player_damage_mod = (combatState.player_damage_mod || 1.0) * (1 + abilities.combat_bonus);
  }

  // Combat damage bonus
  if (abilities.combat_damage_bonus) {
    combatState.player_damage_mod = (combatState.player_damage_mod || 1.0) * (1 + abilities.combat_damage_bonus);
  }

  // Cannot flee
  if (abilities.cannot_flee) {
    combatState.flee_disabled = true;
  }

  return combatState;
}

// Apply skill check trait bonuses
export function applySkillCheckBonus(checkType, baseChance, playerProfile) {
  if (!playerProfile || !playerProfile.special_abilities) return baseChance;

  const abilities = playerProfile.special_abilities;

  switch (checkType) {
    case 'negotiation':
      return baseChance + (abilities.negotiation_bonus || 0);
    
    case 'espionage':
      return baseChance + (abilities.espionage_bonus || 0);
    
    case 'hacking':
      return baseChance + (abilities.hacking_bonus || 0);
    
    default:
      return baseChance;
  }
}

// Generate faction-specific dialogue based on traits
export function generateTraitDialogue(faction, playerProfile) {
  if (!playerProfile) return null;

  const trait = playerProfile.trait;
  const background = playerProfile.background;

  const dialogues = {
    varangians: {
      warriors_honor: "Your honor speaks louder than words, warrior. The Varangian Guard welcomes you.",
      military_officer: "A former Praetorian... interesting. Prove your worth in battle.",
      varangian_exile: "A returning exile. Your deeds will determine if you've earned redemption."
    },
    
    ecclesiarchy: {
      theological_insight: "Your understanding of the Logos is profound. The Church has need of such wisdom.",
      ecclesiarch_scholar: "A fellow scholar of divine truth. May the Logos guide your path.",
      default: "Serve the divine will, and you shall be rewarded."
    },
    
    merchant_houses: {
      silver_tongue: "A natural negotiator. We could do much business together.",
      merchant_scion: "One of our own! Your family's legacy opens many doors.",
      default: "Credits speak louder than words, friend."
    },
    
    agentes_in_rebus: {
      shadow_operative: "A fellow operative. Your skills could prove... useful to us.",
      intelligence_operative: "You know the game. Let's discuss opportunities.",
      default: "Everyone has secrets. What are yours?"
    }
  };

  return dialogues[faction.faction_id]?.[trait] || 
         dialogues[faction.faction_id]?.[background] ||
         dialogues[faction.faction_id]?.default;
}

// Unlock unique missions based on traits
export function checkTraitMissionUnlocks(faction, playerProfile) {
  const unlocks = [];

  if (!playerProfile) return unlocks;

  if (playerProfile.trait === 'shadow_operative' && faction.faction_id === 'agentes_in_rebus') {
    unlocks.push({
      mission_id: 'deep_cover_operation',
      name: 'Deep Cover Operation',
      description: 'Only available to those who understand the shadows',
      trait_exclusive: true
    });
  }

  if (playerProfile.trait === 'theological_insight' && faction.faction_id === 'ecclesiarchy') {
    unlocks.push({
      mission_id: 'theological_debate',
      name: 'Theological Debate',
      description: 'Defend the Logos against heretical doctrine',
      trait_exclusive: true
    });
  }

  if (playerProfile.trait === 'tech_genius') {
    unlocks.push({
      mission_id: 'quantum_encryption_breach',
      name: 'Quantum Encryption Breach',
      description: 'Hack the unhackable',
      trait_exclusive: true
    });
  }

  return unlocks;
}