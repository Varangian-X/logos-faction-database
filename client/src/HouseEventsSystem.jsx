// House-specific events and decisions system

export const HOUSE_EVENTS = {
  ambitious_heir: {
    id: 'ambitious_heir',
    title: 'Ambitious Heir',
    description: 'One of your heirs has begun gathering supporters, challenging your authority subtly.',
    trigger: (gameState, members) => {
      return members.some(m => 
        (m.relation === 'heir' || m.relation === 'child') && 
        m.ambition > 75 && 
        m.competence > 65 &&
        m.loyalty < 60
      );
    },
    choices: [
      {
        text: 'Reassure them - promise greater responsibilities',
        effects: { member_loyalty: 15, member_ambition: -10 },
        cost: { influence: 5 }
      },
      {
        text: 'Confront directly - assert your authority',
        effects: { member_loyalty: -20, house_reputation: 5 },
        risk_conflict: true
      },
      {
        text: 'Assign them a critical mission - prove their worth',
        effects: { member_competence: 10, member_loyalty: 10 },
        cost: { credits: 2000 }
      }
    ]
  },
  
  dynastic_marriage_proposal: {
    id: 'dynastic_marriage_proposal',
    title: 'Marriage Proposal',
    description: 'A rival house offers a marriage alliance to strengthen ties and share resources.',
    trigger: (gameState, members, houses) => {
      return members.some(m => m.relation === 'child' && m.age >= 18) && 
             gameState.turn_number > 10;
    },
    choices: [
      {
        text: 'Accept - forge alliance through marriage',
        effects: { influence: 15, credits_per_turn: 200 },
        faction_impact: { merchant_houses: 10 }
      },
      {
        text: 'Decline respectfully - maintain independence',
        effects: { reputation: 5 }
      },
      {
        text: 'Negotiate better terms - demand dowry',
        effects: { credits: 5000, influence: 10 },
        required_trait: 'reach',
        required_value: 6
      }
    ]
  },
  
  succession_crisis: {
    id: 'succession_crisis',
    title: 'Succession Crisis',
    description: 'With no clear heir designated, family members vie for position, creating internal tension.',
    trigger: (gameState, members) => {
      const heirs = members.filter(m => m.relation === 'heir' || m.relation === 'child');
      const designated = members.find(m => m.role === 'heir_apparent');
      return heirs.length >= 2 && !designated && gameState.turn_number > 15;
    },
    choices: [
      {
        text: 'Designate the most competent heir',
        effects: { house_stability: 15 },
        assigns_role: 'heir_apparent'
      },
      {
        text: 'Let them compete for the position',
        effects: { house_stability: -10, member_ambition: 20 },
        triggers_event: 'heir_competition'
      },
      {
        text: 'Name yourself eternal leader - enhance augmentations',
        effects: { house_stability: -20, credits: -10000 },
        required_trait: 'grasp',
        required_value: 8
      }
    ]
  },
  
  family_scandal: {
    id: 'family_scandal',
    title: 'Family Scandal',
    description: 'A family member has been caught in a compromising situation that threatens the house reputation.',
    trigger: (gameState, members) => {
      return members.some(m => m.loyalty < 50 && m.competence < 40) && 
             Math.random() > 0.85;
    },
    choices: [
      {
        text: 'Cover it up - use your influence',
        effects: { reputation: -5 },
        cost: { influence: 10, credits: 3000 }
      },
      {
        text: 'Disown the member - cut ties publicly',
        effects: { reputation: 10, member_loyalty: -50 },
        removes_member: true
      },
      {
        text: 'Use it to your advantage - leak rival secrets in response',
        effects: { intel: 20, reputation: -10 },
        faction_impact: { agentes_in_rebus: 15 }
      }
    ]
  },
  
  talented_child: {
    id: 'talented_child',
    title: 'Prodigy Child',
    description: 'One of your children shows exceptional talent in a specific area, attracting attention.',
    trigger: (gameState, members) => {
      return members.some(m => m.relation === 'child' && m.age < 16) && 
             gameState.turn_number > 8;
    },
    choices: [
      {
        text: 'Send to Imperial Academy - best education',
        effects: { member_competence: 25, member_traits: { insight: 2 } },
        cost: { credits: 5000 }
      },
      {
        text: 'Hire private tutors - keep them close',
        effects: { member_competence: 15, member_loyalty: 10 },
        cost: { credits: 3000 }
      },
      {
        text: 'Let them learn through experience',
        effects: { member_competence: 8, credits: 1000 }
      }
    ]
  },
  
  elder_passing: {
    id: 'elder_passing',
    title: 'Elder Passing',
    description: 'An elder family member nears the end, imparting final wisdom and bequests.',
    trigger: (gameState, members) => {
      return members.some(m => m.age > 70 && m.health === 'poor');
    },
    choices: [
      {
        text: 'Honor their legacy - grand funeral',
        effects: { reputation: 10, influence: 5 },
        cost: { credits: 2000 }
      },
      {
        text: 'Private ceremony - conserve resources',
        effects: { member_loyalty: -5 }
      },
      {
        text: 'Preserve their knowledge - record their wisdom',
        effects: { intel: 15, unlocks_lore: true }
      }
    ]
  }
};

export function checkHouseEvents(gameState, members, houses) {
  const availableEvents = [];
  
  Object.values(HOUSE_EVENTS).forEach(event => {
    if (event.trigger(gameState, members, houses)) {
      availableEvents.push(event);
    }
  });
  
  return availableEvents.length > 0 ? availableEvents[0] : null;
}

export default function HouseInfrastructurePanel({
  houseFacilities = [],
  houseResources,
  onBuildFacility,
  onUpgradeFacility,
  isProcessing
}) {
  const activeFacilities = houseFacilities.filter(f => f.status === 'active');
  const buildingFacilities = houseFacilities.filter(f => f.status === 'building');
  
  // Calculate total bonuses
  const totalBonuses = activeFacilities.reduce((acc, f) => {
    const type = HOUSE_FACILITIES[f.type];
    if (type?.effect) {
      Object.entries(type.effect).forEach(([key, value]) => {
        if (typeof value === 'number') {
          acc[key] = (acc[key] || 0) + value * (f.level || 1);
        } else {
          acc[key] = value;
        }
      });
    }
    return acc;
  }, {});
  
  return (
    <Card className="bg-slate-900/80 border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          House Infrastructure
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Active Bonuses */}
        {Object.keys(totalBonuses).length > 0 && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-2">
            <p className="text-xs text-green-400 font-bold mb-1">Active Bonuses</p>
            <div className="grid grid-cols-2 gap-1 text-[10px] text-green-300">
              {totalBonuses.intel_per_turn && <span>+{totalBonuses.intel_per_turn} intel/turn</span>}
              {totalBonuses.influence_per_turn && <span>+{totalBonuses.influence_per_turn} influence/turn</span>}
              {totalBonuses.training_speed && <span>Training {((totalBonuses.training_speed - 1) * 100).toFixed(0)}% faster</span>}
              {totalBonuses.counter_intel && <span>-{totalBonuses.counter_intel}% detection risk</span>}
              {totalBonuses.loyalty_boost && <span>+{totalBonuses.loyalty_boost}% member loyalty/turn</span>}
            </div>
          </div>
        )}
        
        {activeFacilities.length === 0 && buildingFacilities.length === 0 && (
          <p className="text-xs text-gray-500 text-center py-4">
            No house facilities yet. Invest in your dynasty's future.
          </p>
        )}
        
        {/* Building Progress */}
        {buildingFacilities.map((facility, i) => {
          const type = HOUSE_FACILITIES[facility.type];
          const progress = ((type.buildTime - facility.turns_remaining) / type.buildTime) * 100;
          
          return (
            <div key={facility.id || i} className="bg-slate-800/50 rounded-lg p-2 border border-amber-500/30">
              <p className="text-xs text-amber-300 mb-1">{type.name} - Under Construction</p>
              <Progress value={progress} className="h-1" />
              <p className="text-[10px] text-gray-500 mt-1">{facility.turns_remaining} turns remaining</p>
            </div>
          );
        })}
        
        {/* Available to Build */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {Object.entries(HOUSE_FACILITIES).map(([key, type]) => {
            const hasBuilding = houseFacilities.some(f => f.type === key);
            if (hasBuilding) return null;
            
            const canAfford = (houseResources?.credits || 0) >= type.cost;
            const Icon = type.icon;
            
            return (
              <div key={key} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-gray-200">{type.name}</span>
                  </div>
                  <span className="text-xs text-purple-400">{type.cost}₵</span>
                </div>
                
                <p className="text-[10px] text-gray-400 mb-2">{type.benefits}</p>
                
                <Button
                  onClick={() => onBuildFacility(key)}
                  disabled={isProcessing || !canAfford}
                  size="sm"
                  className="w-full bg-purple-600 hover:bg-purple-700 h-6 text-xs"
                >
                  {canAfford ? `Build (${type.buildTime}t)` : 'Insufficient Credits'}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}