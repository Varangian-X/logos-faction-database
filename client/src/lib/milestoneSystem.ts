import { SavedScenario } from '../contexts/CampaignContext';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  condition: (missions: SavedScenario[], factionReputation: Record<string, number>) => boolean;
  reward: string;
  unlocked: boolean;
  icon: string;
}

export const CAMPAIGN_MILESTONES: Milestone[] = [
  {
    id: 'first_blood',
    title: 'First Blood',
    description: 'Complete your first combat mission successfully.',
    condition: (missions) => missions.some(m => m.type === 'Combat' && m.status === 'completed'),
    reward: 'Unlocks "Veteran Mercenary" contact',
    unlocked: false,
    icon: 'Sword'
  },
  {
    id: 'diplomat',
    title: 'Silver Tongue',
    description: 'Complete 3 Diplomacy missions successfully.',
    condition: (missions) => missions.filter(m => m.type === 'Diplomacy' && m.status === 'completed').length >= 3,
    reward: 'Unlocks "High Council Access"',
    unlocked: false,
    icon: 'Scroll'
  },
  {
    id: 'broker_peace',
    title: 'Broker Peace',
    description: 'Achieve Allied status (50+ rep) with two opposing factions.',
    condition: (_, factionRep) => {
      const allies = Object.values(factionRep).filter(rep => rep >= 50).length;
      return allies >= 2;
    },
    reward: 'Unlocks "Peace Summit" special mission',
    unlocked: false,
    icon: 'Handshake'
  },
  {
    id: 'warlord',
    title: 'Become Warlord',
    description: 'Achieve Hostile status (-50 rep) with three major factions.',
    condition: (_, factionRep) => {
      const enemies = Object.values(factionRep).filter(rep => rep <= -50).length;
      return enemies >= 3;
    },
    reward: 'Unlocks "Total War" campaign arc',
    unlocked: false,
    icon: 'Skull'
  },
  {
    id: 'shadow_operative',
    title: 'Shadow Operative',
    description: 'Complete 5 Espionage or Assassination missions without failure.',
    condition: (missions) => {
      const stealthMissions = missions.filter(m => (m.type === 'Espionage' || m.type === 'Assassination'));
      return stealthMissions.length >= 5 && stealthMissions.every(m => m.status === 'completed');
    },
    reward: 'Unlocks "Ghost Protocol" equipment',
    unlocked: false,
    icon: 'Ghost'
  },
  {
    id: 'wealth_accumulator',
    title: 'Tycoon',
    description: 'Complete 5 Supply Run or Heist missions.',
    condition: (missions) => missions.filter(m => (m.type === 'Supply Run' || m.type === 'Heist/Raid') && m.status === 'completed').length >= 5,
    reward: 'Unlocks "Black Market" access',
    unlocked: false,
    icon: 'Coins'
  }
];

export function checkMilestones(
  missions: SavedScenario[], 
  factionReputation: Record<string, number>,
  currentMilestones: Milestone[] = CAMPAIGN_MILESTONES
): Milestone[] {
  return currentMilestones.map(milestone => {
    if (milestone.unlocked) return milestone;
    
    const isUnlocked = milestone.condition(missions, factionReputation);
    return isUnlocked ? { ...milestone, unlocked: true } : milestone;
  });
}

export function getNewlyUnlockedMilestones(
  oldMilestones: Milestone[],
  newMilestones: Milestone[]
): Milestone[] {
  return newMilestones.filter(newM => {
    const oldM = oldMilestones.find(m => m.id === newM.id);
    return newM.unlocked && (!oldM || !oldM.unlocked);
  });
}
