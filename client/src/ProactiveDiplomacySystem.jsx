// Proactive Diplomacy System - Factions initiate diplomatic actions

// Generate proactive diplomatic proposals from factions
export function generateDiplomaticProposals(faction, allFactions, gameState, worldState) {
  const proposals = [];
  
  // Check each other faction for diplomatic opportunities
  allFactions.forEach(otherFaction => {
    if (otherFaction.faction_id === faction.faction_id) return;
    
    const relationship = (faction.relationships || {})[otherFaction.faction_id] || 0;
    const isAlly = faction.alliances?.includes(otherFaction.faction_id);
    const isRival = faction.rivalries?.includes(otherFaction.faction_id);
    
    // Alliance proposals (good relations, shared goals)
    if (!isAlly && !isRival && relationship > 40) {
      const sharedGoals = findSharedGoals(faction, otherFaction);
      if (sharedGoals.length > 0 && Math.random() > 0.7) {
        proposals.push({
          type: 'alliance_proposal',
          from: faction.faction_id,
          to: otherFaction.faction_id,
          reason: `Shared objective: ${sharedGoals[0].name}`,
          terms: 'Mutual defense and resource sharing',
          requirements: {
            player_reputation: 50,
            faction_standing: 40
          },
          benefits: {
            influence_gain: 30,
            faction_bonus: 20
          }
        });
      }
    }
    
    // Trade agreements (merchant houses especially)
    if (faction.faction_id === 'merchant_houses' && relationship > 20 && Math.random() > 0.6) {
      proposals.push({
        type: 'trade_agreement',
        from: faction.faction_id,
        to: otherFaction.faction_id,
        reason: 'Economic cooperation opportunity',
        terms: 'Reduced trade costs, shared market access',
        duration: 10,
        requirements: {
          credits: 1000,
          reputation: 30
        },
        benefits: {
          credits_per_turn: 100,
          market_bonus: 0.15
        }
      });
    }
    
    // Non-aggression pacts (when relations are tense but not hostile)
    if (relationship < 0 && relationship > -40 && !isRival && Math.random() > 0.75) {
      proposals.push({
        type: 'non_aggression_pact',
        from: faction.faction_id,
        to: otherFaction.faction_id,
        reason: 'Prevent further deterioration of relations',
        terms: 'Cease hostile actions for 10 turns',
        duration: 10,
        requirements: {
          reputation: 20
        },
        benefits: {
          stability_bonus: 5,
          reputation_improvement: 15
        }
      });
    }
    
    // Military support requests (faction under pressure)
    if (isAlly && faction.power_level < 40 && Math.random() > 0.8) {
      proposals.push({
        type: 'military_support_request',
        from: faction.faction_id,
        to: 'player',
        reason: `${faction.name} is under pressure and needs assistance`,
        terms: 'Deploy forces to defend faction territory',
        requirements: {
          faction_standing: 60,
          reputation: 50
        },
        rewards: {
          faction_bonus: 30,
          influence_gain: 40,
          credits: 2000
        },
        urgent: true
      });
    }
    
    // Tribute demands (powerful faction to weak player/faction)
    if (faction.power_level > 70 && relationship < -20 && gameState.reputation < 40 && Math.random() > 0.85) {
      proposals.push({
        type: 'tribute_demand',
        from: faction.faction_id,
        to: 'player',
        reason: `${faction.name} demands tribute to avoid hostile action`,
        terms: 'Pay regular tribute or face consequences',
        amount: 500,
        frequency: 5,
        consequences_if_refused: {
          faction_loss: 30,
          operations_against_player: true,
          reputation_loss: 20
        }
      });
    }
  });
  
  // World-state driven proposals
  if (worldState?.world_stability < 30 && Math.random() > 0.6) {
    proposals.push({
      type: 'stabilization_coalition',
      from: faction.faction_id,
      to: 'all',
      reason: 'The Imperium is collapsing - we must work together',
      terms: 'Temporary truce, joint efforts to restore order',
      duration: 8,
      requirements: {
        reputation: 40
      },
      benefits: {
        stability_bonus: 20,
        faction_relations_improve: 10
      }
    });
  }
  
  return proposals;
}

// Generate faction demands based on goals and power
export function generateFactionDemands(faction, gameState, worldState) {
  const demands = [];
  
  const playerRelation = (gameState.faction_relations || {})[faction.faction_id] || 0;
  const playerPower = gameState.reputation + gameState.influence;
  
  // Powerful factions make demands
  if (faction.power_level > 65 && playerRelation < 20) {
    
    // Territory/influence demands
    if (gameState.influence > 50 && Math.random() > 0.7) {
      demands.push({
        type: 'influence_demand',
        from: faction.faction_id,
        demand: 'Reduce your influence in our territory',
        compliance_cost: {
          influence: -20
        },
        refusal_consequences: {
          faction_loss: 25,
          hostile_operations: true
        },
        deadline: 3
      });
    }
    
    // Cease operations demands
    const playerOperations = gameState.active_operations?.filter(op => 
      op.target_faction === faction.faction_id
    );
    if (playerOperations?.length > 0 && Math.random() > 0.6) {
      demands.push({
        type: 'cease_operations_demand',
        from: faction.faction_id,
        demand: 'Stop all covert operations against us',
        compliance_cost: {
          active_operations: 'cancel_all_vs_faction'
        },
        refusal_consequences: {
          faction_loss: 30,
          counter_espionage: true
        },
        deadline: 2
      });
    }
  }
  
  // Ally demands for support
  if (faction.alliances?.includes('player') && faction.power_level < 50 && Math.random() > 0.75) {
    demands.push({
      type: 'ally_support_demand',
      from: faction.faction_id,
      demand: 'We need your support against our enemies',
      compliance_options: [
        {
          type: 'military',
          cost: { reputation: 10 },
          benefit: { faction_gain: 25 }
        },
        {
          type: 'financial',
          cost: { credits: 1500 },
          benefit: { faction_gain: 20 }
        },
        {
          type: 'diplomatic',
          cost: { influence: 15 },
          benefit: { faction_gain: 15 }
        }
      ],
      refusal_consequences: {
        loyalty_questioned: true,
        faction_loss: 20
      }
    });
  }
  
  return demands;
}

// Check if player meets proposal requirements
export function checkProposalRequirements(proposal, gameState) {
  const requirements = proposal.requirements || {};
  const failures = [];
  
  if (requirements.player_reputation && gameState.reputation < requirements.player_reputation) {
    failures.push(`Requires ${requirements.player_reputation} reputation`);
  }
  
  if (requirements.faction_standing) {
    const standing = (gameState.faction_relations || {})[proposal.from] || 0;
    if (standing < requirements.faction_standing) {
      failures.push(`Requires ${requirements.faction_standing} standing with ${proposal.from}`);
    }
  }
  
  if (requirements.credits && gameState.credits < requirements.credits) {
    failures.push(`Requires ${requirements.credits} credits`);
  }
  
  if (requirements.influence && gameState.influence < requirements.influence) {
    failures.push(`Requires ${requirements.influence} influence`);
  }
  
  if (requirements.reputation && gameState.reputation < requirements.reputation) {
    failures.push(`Requires ${requirements.reputation} reputation`);
  }
  
  return {
    meets_requirements: failures.length === 0,
    failures
  };
}

// Find shared goals between factions
function findSharedGoals(faction1, faction2) {
  const goals1 = faction1.long_term_goals || [];
  const goals2 = faction2.long_term_goals || [];
  
  const shared = [];
  
  goals1.forEach(g1 => {
    goals2.forEach(g2 => {
      // Same type and synergizes
      if (g1.synergizes_with?.includes(g2.type) || g2.synergizes_with?.includes(g1.type)) {
        shared.push(g1);
      }
      // Same goal type
      if (g1.type === g2.type && !g1.conflicts_with?.includes(g2.subtype)) {
        shared.push(g1);
      }
    });
  });
  
  return shared;
}