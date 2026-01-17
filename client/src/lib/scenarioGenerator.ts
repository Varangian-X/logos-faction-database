import { MapLocation } from "./mapData";

export interface Scenario {
  id: string;
  title: string;
  type: "Combat" | "Diplomacy" | "Espionage" | "Exploration" | "Horror";
  description: string;
  objectives: string[];
  complications: string[];
  rewards: string[];
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
      type: "Exploration",
      desc: "A shipment of contraband needs to be moved through a blockade. High risk, high reward.",
      obj: ["Navigate the blockade", "Deliver the cargo", "Avoid patrols"],
      comp: ["The cargo is unstable", "A traitor is on board", "The buyer is a sting operation"],
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
  ],
};

export function generateScenario(location: MapLocation, year: number): Scenario {
  const alignment = location.alignment;
  const templates = missionTemplates[alignment] || missionTemplates["Neutral"];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Customize based on location and year
  const customizedDesc = template.desc.replace("Local authorities", location.controllingFaction);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    title: template.title,
    type: template.type as any,
    description: customizedDesc,
    objectives: template.obj,
    complications: [template.comp[Math.floor(Math.random() * template.comp.length)]],
    rewards: ["Credits", "Faction Reputation", "Rare Tech"],
  };
}
