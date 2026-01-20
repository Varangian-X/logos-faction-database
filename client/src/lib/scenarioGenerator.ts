import { MapLocation } from "./mapData";
import { FactionResources } from "./factionDynamics";

export interface Scenario {
  id: string;
  title: string;
  type: "Combat" | "Diplomacy" | "Espionage" | "Exploration" | "Horror" | "Assassination" | "Hostage Rescue" | "Supply Run" | "Bounty Contract" | "Heist/Raid" | "Asset Capture";
  description: string;
  objectives: string[];
  complications: string[];
  rewards: string[];
  resourceCost?: Partial<FactionResources>;
}

const missionTemplates = {
  Stasis: [
    {
      title: "Protocol Enforcement",
      type: "Combat",
      desc: "Local authorities require assistance in suppressing a deviation from the Logos.",
      obj: ["Locate the source of the deviation", "Neutralize the agitators", "Restore order to the sector"],
      comp: ["The agitators are well-armed", "Local civilians are sympathetic to the cause", "A rival faction intervenes"],
    },
    {
      title: "Data Retrieval",
      type: "Espionage",
      desc: "A critical data packet has been misplaced or stolen. It must be recovered before it is decrypted.",
      obj: ["Infiltrate the target location", "Secure the data packet", "Exfiltrate without detection"],
      comp: ["The data is corrupted", "The target is a trap", "Time is running out"],
    },
    {
      title: "Silencing Protocol",
      type: "Assassination",
      desc: "A high-value target has been marked for elimination. The Logos demands their removal.",
      obj: ["Locate the target", "Eliminate the target discreetly", "Ensure no witnesses remain"],
      comp: ["The target is heavily guarded", "A rival faction is also hunting them", "The target is a decoy"],
    },
    {
      title: "Prisoner Exchange",
      type: "Hostage Rescue",
      desc: "A key operative has been captured. Retrieve them before interrogation reveals critical secrets.",
      obj: ["Locate the detention facility", "Breach security", "Extract the prisoner"],
      comp: ["The prisoner has been moved", "Reinforcements are incoming", "The prisoner is compromised"],
    },
  ],
  Plasticity: [
    {
      title: "Chaos Incursion",
      type: "Combat",
      desc: "Plasticity forces are breaching the perimeter. Hold the line until reinforcements arrive.",
      obj: ["Defend the perimeter", "Repel the attackers", "Protect the civilians"],
      comp: ["The attackers are mutated", "Reinforcements are delayed", "Environmental hazards"],
    },
    {
      title: "Smuggling Run",
      type: "Supply Run",
      desc: "A shipment of critical supplies needs to be moved through a blockade. High risk, high reward.",
      obj: ["Navigate the blockade", "Deliver the cargo intact", "Avoid patrols"],
      comp: ["The cargo is unstable", "A traitor is on board", "The buyer is a sting operation"],
    },
    {
      title: "Bounty Hunt",
      type: "Bounty Contract",
      desc: "A dangerous criminal has a price on their head. Bring them in alive or dead.",
      obj: ["Track down the target", "Capture or eliminate the target", "Claim the bounty"],
      comp: ["The target has allies", "Multiple hunters are competing", "The bounty is a trap"],
    },
    {
      title: "Pirate Interception",
      type: "Combat",
      desc: "Pirate vessels are raiding merchant convoys. Stop them before more ships are lost.",
      obj: ["Intercept the pirate fleet", "Disable their vessels", "Recover stolen cargo"],
      comp: ["The pirates have superior numbers", "Civilian ships are in the crossfire", "The pirates have advanced weapons"],
    },
  ],
  Anomalous: [
    {
      title: "Void Echoes",
      type: "Horror",
      desc: "Strange signals are emanating from a derelict station. Investigate the source.",
      obj: ["Board the station", "Locate the signal source", "Survive the encounter"],
      comp: ["The crew is missing", "Reality is distorting", "Something is hunting you"],
    },
    {
      title: "Xeno-Contact",
      type: "Diplomacy",
      desc: "First contact with a new xeno-species. Establish communication or assess the threat.",
      obj: ["Establish communication", "Gather intelligence", "Avoid hostilities"],
      comp: ["Translation failure", "The species is hostile", "A third party interferes"],
    },
    {
      title: "Artifact Heist",
      type: "Heist/Raid",
      desc: "A powerful xeno-artifact has been discovered in a rival faction vault. Retrieve it before they weaponize it.",
      obj: ["Infiltrate the vault", "Bypass security systems", "Exfiltrate with the artifact"],
      comp: ["The vault is a labyrinth", "Automated defenses are lethal", "The artifact is sentient"],
    },
  ],
  Neutral: [
    {
      title: "Diplomatic Summit",
      type: "Diplomacy",
      desc: "Tensions are high. Mediate a dispute between rival factions before war breaks out.",
      obj: ["Host the summit", "Negotiate a ceasefire", "Prevent assassination attempts"],
      comp: ["One side is negotiating in bad faith", "An assassin is present", "A riot breaks out outside"],
    },
    {
      title: "Mercenary Contract",
      type: "Combat",
      desc: "A wealthy patron needs a problem solved. No questions asked.",
      obj: ["Complete the objective", "Eliminate the target", "Collect the payment"],
      comp: ["The target is innocent", "The patron betrays you", "The job is a setup"],
    },
    {
      title: "Marked for Death",
      type: "Assassination",
      desc: "A contract has been issued. The target must be eliminated before they reach their destination.",
      obj: ["Identify the target", "Set up the kill zone", "Execute the contract"],
      comp: ["The target has bodyguards", "Another assassin is competing", "The contract is reversed"],
    },
    {
      title: "Rescue Operation",
      type: "Hostage Rescue",
      desc: "Innocent civilians have been taken hostage. Negotiate their release or extract them by force.",
      obj: ["Locate the hostages", "Establish communication with captors", "Secure the hostages safety"],
      comp: ["The captors are desperate", "Hostages are in multiple locations", "A deadline is approaching"],
    },
    {
      title: "Corporate Espionage",
      type: "Heist/Raid",
      desc: "A rival corporations research facility holds valuable secrets. Break in and steal what you can.",
      obj: ["Breach the facility", "Locate the target data", "Escape with the evidence"],
      comp: ["Security is state-of-the-art", "An insider is a double agent", "Law enforcement is responding"],
    },
  ],
};

export function generateScenario(location: MapLocation, year: number, factionResources?: FactionResources, playerAssets?: any[]): Scenario | null {
  const alignment = location.alignment;
  let templates = [...(missionTemplates[alignment] || []), ...missionTemplates["Neutral"]];
  
  // Add Asset Capture missions if applicable
  // 10% chance to generate an Asset Capture mission if not in player territory
  if (Math.random() < 0.1) {
    templates.push({
      title: "Asset Seizure",
      type: "Asset Capture",
      desc: "A valuable enemy asset has been identified. Seize control of it to expand your influence.",
      obj: ["Locate the asset", "Neutralize defenses", "Establish control"],
      comp: ["Asset is rigged to blow", "Enemy reinforcements inbound", "Asset is damaged"],
    });
  }

  // Filter templates based on resource availability and asset dependencies
  const availableTemplates = templates.filter(t => {
    // Resource Dependency Chains: Check if player has required assets for certain missions
    if (playerAssets) {
      if (t.type === 'Trade Convoy' || t.type === 'Supply Run') {
        // Need Trade Hub or Spaceport for trade missions
        const hasTradeAsset = playerAssets.some(a => a.type === 'Trade Hub' || a.type === 'Spaceport');
        if (!hasTradeAsset && Math.random() > 0.3) return false; // 70% chance to require asset
      }
      if (t.type === 'Combat' || t.type === 'Assassination') {
        // Need Military Base for advanced combat missions
        const hasMilitaryAsset = playerAssets.some(a => a.type === 'Military Base');
        if (!hasMilitaryAsset && Math.random() > 0.3) return false;
      }
    }

    if (!factionResources) return true;
    
    // Define resource costs for mission types
    const costs: Partial<FactionResources> = {};
    if (t.type === 'Combat') costs.manpower = 10;
    if (t.type === 'Espionage') costs.tech = 10;
    if (t.type === 'Heist/Raid') costs.credits = 10;
    if (t.type === 'Asset Capture') costs.manpower = 20; // High cost for capture
    
    // Check if faction has enough resources
    if (costs.manpower && factionResources.manpower < costs.manpower) return false;
    if (costs.tech && factionResources.tech < costs.tech) return false;
    if (costs.credits && factionResources.credits < costs.credits) return false;
    
    return true;
  });

  if (availableTemplates.length === 0) return null;

  const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
  
  // Customize based on location and year
  const customizedDesc = template.desc.replace("Local authorities", location.controllingFaction);
  
  // Generate dynamic rewards based on mission type
  const rewardMap: Record<string, string[]> = {
    "Assassination": ["Blood Payment", "Faction Favor", "Classified Intel"],
    "Hostage Rescue": ["Rescued Asset", "Faction Debt", "Safe House Access"],
    "Supply Run": ["Cargo Delivery Bonus", "Trade Route Access", "Supplier Contacts"],
    "Bounty Contract": ["Bounty Reward", "Wanted Poster Removal", "Criminal Network Intel"],
    "Heist/Raid": ["Stolen Goods", "Vault Access", "Security Bypass Tech"],
    "Asset Capture": ["New Asset Acquired", "Territory Control", "Resource Production Boost"],
  };
  
  const baseRewards = ["Credits", "Faction Reputation", "Rare Tech"];
  const typeRewards = rewardMap[template.type] || baseRewards;
  const rewards = [
    typeRewards[Math.floor(Math.random() * typeRewards.length)],
    baseRewards[Math.floor(Math.random() * baseRewards.length)],
  ];
  
  // Calculate resource cost
  const resourceCost: Partial<FactionResources> = {};
  if (template.type === 'Combat') resourceCost.manpower = 10;
  if (template.type === 'Espionage') resourceCost.tech = 10;
  if (template.type === 'Heist/Raid') resourceCost.credits = 10;
  if (template.type === 'Asset Capture') resourceCost.manpower = 20;

  return {
    id: Math.random().toString(36).substr(2, 9),
    title: template.title,
    type: template.type as any,
    description: customizedDesc,
    objectives: template.obj,
    complications: [template.comp[Math.floor(Math.random() * template.comp.length)]],
    rewards: rewards,
    resourceCost,
  };
}
