import { MapLocation } from "./mapData";
import { FactionResources } from "./factionDynamics";

export interface ResourceTransferMission {
  id: string;
  type: "Trade Convoy" | "Tech Transfer" | "Manpower Deployment";
  title: string;
  description: string;
  sourceFaction: string;
  targetFaction: string;
  sourceLocation: string;
  targetLocation: string;
  resourceType: keyof FactionResources;
  amount: number;
  difficulty: "Easy" | "Medium" | "Hard";
  objectives: string[];
  complications: string[];
  rewards: string[];
  riskLevel: number; // 0-100, affects success probability
}

const tradeConvoyTemplates = [
  {
    title: "Secure Trade Route",
    desc: "Establish a protected corridor for merchant convoys carrying valuable cargo.",
    obj: ["Clear the route of hostiles", "Establish supply depots", "Protect merchant vessels"],
    comp: ["Pirates intercept the convoy", "Environmental hazards", "Political interference"],
  },
  {
    title: "Diplomatic Trade Mission",
    desc: "Negotiate and escort a high-value trade delegation to strengthen economic ties.",
    obj: ["Negotiate trade terms", "Escort the delegation", "Secure the cargo"],
    comp: ["Negotiations break down", "Assassination attempt", "Third-party sabotage"],
  },
  {
    title: "Black Market Exchange",
    desc: "Move contraband goods through restricted space without detection.",
    obj: ["Avoid customs checkpoints", "Deliver the cargo", "Eliminate witnesses"],
    comp: ["Customs patrol detected", "Informant betrayal", "Rival smugglers interfere"],
  },
];

const techTransferTemplates = [
  {
    title: "Secure Data Transfer",
    desc: "Transport encrypted research data to allied faction research facility.",
    obj: ["Retrieve the data", "Secure transmission", "Prevent interception"],
    comp: ["Data is corrupted", "Cyber attack", "Physical theft attempt"],
  },
  {
    title: "Technology Exchange",
    desc: "Facilitate exchange of advanced technology between allied powers.",
    obj: ["Authenticate technology", "Complete transfer", "Verify functionality"],
    comp: ["Technology is counterfeit", "Espionage detected", "Transfer interrupted"],
  },
  {
    title: "Research Collaboration",
    desc: "Establish joint research initiative by transferring scientific expertise.",
    obj: ["Recruit research team", "Transport equipment", "Establish lab"],
    comp: ["Team defection", "Equipment sabotage", "Facility lockdown"],
  },
];

const manpowerDeploymentTemplates = [
  {
    title: "Military Reinforcement",
    desc: "Deploy elite military units to reinforce allied faction defenses.",
    obj: ["Mobilize troops", "Secure transport", "Establish defensive positions"],
    comp: ["Troop mutiny", "Transport intercepted", "Ambush en route"],
  },
  {
    title: "Specialist Training",
    desc: "Send elite instructors to train allied faction's military forces.",
    obj: ["Assemble training cadre", "Reach training site", "Establish curriculum"],
    comp: ["Instructors captured", "Training sabotaged", "Political opposition"],
  },
  {
    title: "Covert Operative Insertion",
    desc: "Insert special operations team into allied faction territory.",
    obj: ["Infiltrate target area", "Establish safe house", "Begin operations"],
    comp: ["Cover blown", "Local resistance", "Friendly fire incident"],
  },
];

export function generateResourceTransferMission(
  sourceFaction: string,
  targetFaction: string,
  sourceLocation: MapLocation,
  targetLocation: MapLocation,
  resourceType: keyof FactionResources,
  amount: number
): ResourceTransferMission {
  let templates: typeof tradeConvoyTemplates;
  let missionType: "Trade Convoy" | "Tech Transfer" | "Manpower Deployment";

  if (resourceType === "credits") {
    templates = tradeConvoyTemplates;
    missionType = "Trade Convoy";
  } else if (resourceType === "tech") {
    templates = techTransferTemplates;
    missionType = "Tech Transfer";
  } else {
    templates = manpowerDeploymentTemplates;
    missionType = "Manpower Deployment";
  }

  const template = templates[Math.floor(Math.random() * templates.length)];

  // Calculate difficulty based on amount
  let difficulty: "Easy" | "Medium" | "Hard" = "Medium";
  if (amount > 50) difficulty = "Hard";
  if (amount < 20) difficulty = "Easy";

  // Calculate risk level based on distance and faction relations
  const distance = Math.sqrt(
    Math.pow(targetLocation.x - sourceLocation.x, 2) +
    Math.pow(targetLocation.y - sourceLocation.y, 2)
  );
  const baseRisk = (distance / 100) * 30 + amount * 0.5;
  const riskLevel = Math.min(100, baseRisk);

  return {
    id: Math.random().toString(36).substr(2, 9),
    type: missionType,
    title: template.title,
    description: `Transfer ${amount} ${resourceType} from ${sourceFaction} to ${targetFaction}. ${template.desc}`,
    sourceFaction,
    targetFaction,
    sourceLocation: sourceLocation.id,
    targetLocation: targetLocation.id,
    resourceType,
    amount,
    difficulty,
    objectives: template.obj,
    complications: [template.comp[Math.floor(Math.random() * template.comp.length)]],
    rewards: [
      `${amount} ${resourceType} transferred`,
      "Faction Relations +10",
      "Trade Route Established",
    ],
    riskLevel,
  };
}

export function calculateTransferSuccess(
  mission: ResourceTransferMission,
  playerSkill: number = 50 // 0-100
): { success: boolean; resourcesTransferred: number; consequences: string[] } {
  const baseSuccessChance = 100 - mission.riskLevel;
  const skillModifier = (playerSkill - 50) * 0.5; // +/- 25% based on skill
  const successChance = Math.max(10, Math.min(90, baseSuccessChance + skillModifier));

  const roll = Math.random() * 100;
  const success = roll < successChance;

  const consequences: string[] = [];
  let resourcesTransferred = mission.amount;

  if (success) {
    consequences.push(`Successfully transferred ${mission.amount} ${mission.resourceType}`);
    consequences.push("Allied faction reputation increased");
  } else {
    // Partial success or failure
    resourcesTransferred = Math.floor(mission.amount * (Math.random() * 0.5 + 0.25)); // 25-75% loss
    consequences.push(
      `Transfer compromised! Only ${resourcesTransferred}/${mission.amount} ${mission.resourceType} delivered`
    );
    consequences.push("Faction relations strained");

    if (Math.random() > 0.7) {
      consequences.push("Enemies gained intelligence on faction capabilities");
    }
  }

  return { success, resourcesTransferred, consequences };
}
