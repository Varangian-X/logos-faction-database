import { Governor } from "./planetaryGovernance";
import { FactionResources } from "./factionDynamics";

export interface GovernorEvent {
  id: string;
  title: string;
  description: string;
  triggerTrait: string; // The trait that triggers this event
  choices: {
    text: string;
    effectDescription: string;
    effect: (governor: Governor, resources: FactionResources) => Partial<FactionResources>;
  }[];
}

export const GOVERNOR_EVENTS: GovernorEvent[] = [
  {
    id: "industrial_accident",
    title: "Industrial Catastrophe",
    description: "A massive failure in the sector's primary manufactory has halted production. Your Industrialist governor proposes a ruthless solution.",
    triggerTrait: "Industrialist",
    choices: [
      {
        text: "Force workers to repair it immediately (High Risk)",
        effectDescription: "Gain 100 Credits, Lose 20 Manpower",
        effect: () => ({ credits: 100, manpower: -20 }),
      },
      {
        text: "Invest in safer equipment",
        effectDescription: "Lose 50 Credits, Gain 10 Reputation",
        effect: () => ({ credits: -50 }),
      },
    ],
  },
  {
    id: "heretical_research",
    title: "Forbidden Knowledge",
    description: "Your Technocrat governor has discovered a cache of pre-Collapse data. It borders on heresy.",
    triggerTrait: "Technocrat",
    choices: [
      {
        text: "Authorize the research",
        effectDescription: "Gain 50 Tech, Lose 10 Reputation",
        effect: () => ({ tech: 50 }),
      },
      {
        text: "Burn the data",
        effectDescription: "Gain 10 Reputation",
        effect: () => ({}),
      },
    ],
  },
  {
    id: "border_skirmish",
    title: "Border Provocation",
    description: "Enemy patrols are testing our defenses. Your Warlord governor demands a show of force.",
    triggerTrait: "Warlord",
    choices: [
      {
        text: "Launch a counter-attack",
        effectDescription: "Lose 10 Manpower, Gain 20 Reputation",
        effect: () => ({ manpower: -10 }),
      },
      {
        text: "Hold the line",
        effectDescription: "No change",
        effect: () => ({}),
      },
    ],
  },
];

export function checkGovernorEvents(governors: Governor[]): GovernorEvent | null {
  if (Math.random() > 0.3) return null; // 30% chance of event per turn
  
  const activeGovernor = governors[Math.floor(Math.random() * governors.length)];
  if (!activeGovernor) return null;
  
  const possibleEvents = GOVERNOR_EVENTS.filter(e => activeGovernor.traits.includes(e.triggerTrait));
  if (possibleEvents.length === 0) return null;
  
  return possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
}
