/**
 * MissionGenerator.ts
 * Client-side adaptation of the "Logos Engine" for procedural mission generation.
 */

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'Data Extraction' | 'Sanctioned Assassination' | 'Riot Suppression' | 'Heresy Investigation';
  targetSystem: string;
  difficulty: 'Low' | 'Medium' | 'High' | 'Extreme';
  rewards: {
    credits: number;
    reputation: number; // General reputation
    factionReputation: Record<string, number>; // Specific faction changes
    intel?: number;
  };
  status: 'Active' | 'Completed' | 'Failed';
  expirationTurn: number;
}

const MISSION_TEMPLATES = {
  'Data Extraction': [
    "Retrieve encrypted drive from {target} server farm.",
    "Intercept courier drone in {target} orbit.",
    "Hack into {target} local comms relay.",
  ],
  'Sanctioned Assassination': [
    "Eliminate rogue operative in {target}.",
    "Silence the heretic preacher of {target}.",
    "Terminate contract with extreme prejudice in {target}.",
  ],
  'Riot Suppression': [
    "Quell civil unrest in {target} hab-blocks.",
    "Enforce curfew protocols in {target}.",
    "Disperse unauthorized gathering in {target} plaza.",
  ],
  'Heresy Investigation': [
    "Investigate reports of forbidden tech in {target}.",
    "Audit {target} local administration for corruption.",
    "Interrogate suspected cultists in {target}.",
  ]
};

const TARGET_MODIFIERS = {
  'New Roma (Throne)': { difficulty: 'Extreme', rewardMult: 2.5 },
  'Trebizond System': { difficulty: 'High', rewardMult: 1.8 },
  'The Ister Rim': { difficulty: 'Medium', rewardMult: 1.2 },
  'Avalon Anomaly': { difficulty: 'Extreme', rewardMult: 3.0 },
  'The Cisterns': { difficulty: 'Low', rewardMult: 0.8 },
  'The Mese': { difficulty: 'Medium', rewardMult: 1.0 },
};

// Define faction impacts based on mission type
const FACTION_IMPACTS = {
  'Data Extraction': {
    'agentes_en_rebus': 15, // Spies love data
    'merchant_houses': -5,  // Merchants hate leaks
    'neo_praetorians': 0
  },
  'Sanctioned Assassination': {
    'neo_praetorians': 15,  // Military loves order
    'agentes_en_rebus': 5,
    'merchant_houses': -10  // Bad for business
  },
  'Riot Suppression': {
    'neo_praetorians': 20,  // Law and order
    'merchant_houses': 10,  // Stability is profit
    'agentes_en_rebus': -5  // Less chaos to exploit
  },
  'Heresy Investigation': {
    'agentes_en_rebus': 10,
    'neo_praetorians': 10,
    'merchant_houses': -15  // Disruption of trade
  }
};

export function generateMission(
  type: keyof typeof MISSION_TEMPLATES,
  targetSystem: string,
  currentTurn: number
): Mission {
  const templates = MISSION_TEMPLATES[type];
  const template = templates[Math.floor(Math.random() * templates.length)];
  const description = template.replace('{target}', targetSystem);
  
  const modifier = TARGET_MODIFIERS[targetSystem as keyof typeof TARGET_MODIFIERS] || { difficulty: 'Medium', rewardMult: 1.0 };
  
  const baseCredits = 1000;
  const baseRep = 10;
  
  // Calculate faction reputation changes
  const baseImpacts = FACTION_IMPACTS[type];
  const factionReputation: Record<string, number> = {};
  
  Object.entries(baseImpacts).forEach(([faction, value]) => {
    factionReputation[faction] = Math.floor(value * modifier.rewardMult);
  });
  
  return {
    id: `mission_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    title: `${type}: ${targetSystem}`,
    description: description,
    type: type,
    targetSystem: targetSystem,
    difficulty: modifier.difficulty as any,
    rewards: {
      credits: Math.floor(baseCredits * modifier.rewardMult),
      reputation: Math.floor(baseRep * modifier.rewardMult),
      factionReputation,
      intel: Math.random() > 0.5 ? Math.floor(5 * modifier.rewardMult) : 0
    },
    status: 'Active',
    expirationTurn: currentTurn + 10
  };
}
