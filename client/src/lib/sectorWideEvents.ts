import { MapRegion } from "./mapData";

export interface SectorEvent {
  id: string;
  name: string;
  description: string;
  type: "Disaster" | "Opportunity" | "Conflict" | "Anomaly";
  affectedRegions: string[];
  duration: number; // in years
  startYear: number;
  effects: {
    creditsModifier: number; // -50 to +50 (percentage)
    techModifier: number;
    manpowerModifier: number;
    missionAvailability: string[]; // mission types that become available/unavailable
  };
  severity: "Minor" | "Moderate" | "Severe";
}

const eventTemplates = {
  Disaster: [
    {
      name: "Warp Storm",
      desc: "Catastrophic spatial distortion disrupts trade and communication across the sector.",
      effects: {
        creditsModifier: -40,
        techModifier: -30,
        manpowerModifier: -20,
        missionAvailability: ["Supply Run", "Rescue Operation"],
      },
      severity: "Severe" as const,
    },
    {
      name: "Economic Collapse",
      desc: "Market crash devastates faction economies and disrupts supply chains.",
      effects: {
        creditsModifier: -60,
        techModifier: -10,
        manpowerModifier: 0,
        missionAvailability: ["Bounty Contract", "Mercenary Contract"],
      },
      severity: "Severe" as const,
    },
    {
      name: "Plague Outbreak",
      desc: "Biological crisis decimates population and military forces across the region.",
      effects: {
        creditsModifier: -20,
        techModifier: 0,
        manpowerModifier: -50,
        missionAvailability: ["Rescue Operation", "Supply Run"],
      },
      severity: "Severe" as const,
    },
  ],
  Opportunity: [
    {
      name: "Trade Boom",
      desc: "Unexpected market surge creates lucrative trading opportunities.",
      effects: {
        creditsModifier: +50,
        techModifier: +10,
        manpowerModifier: 0,
        missionAvailability: ["Trade Convoy", "Diplomatic Summit"],
      },
      severity: "Moderate" as const,
    },
    {
      name: "Tech Discovery",
      desc: "Ancient xeno-technology discovered, sparking research frenzy.",
      effects: {
        creditsModifier: +20,
        techModifier: +60,
        manpowerModifier: 0,
        missionAvailability: ["Heist/Raid", "Espionage"],
      },
      severity: "Moderate" as const,
    },
    {
      name: "Population Influx",
      desc: "Mass migration brings new workers and soldiers to the sector.",
      effects: {
        creditsModifier: +10,
        techModifier: 0,
        manpowerModifier: +40,
        missionAvailability: ["Manpower Deployment", "Combat"],
      },
      severity: "Moderate" as const,
    },
  ],
  Conflict: [
    {
      name: "Border War",
      desc: "Escalating territorial disputes consume resources and attention.",
      effects: {
        creditsModifier: -30,
        techModifier: -20,
        manpowerModifier: -40,
        missionAvailability: ["Combat", "Assassination", "Hostage Rescue"],
      },
      severity: "Severe" as const,
    },
    {
      name: "Pirate Surge",
      desc: "Increased piracy disrupts trade and destabilizes the region.",
      effects: {
        creditsModifier: -35,
        techModifier: 0,
        manpowerModifier: -15,
        missionAvailability: ["Bounty Contract", "Supply Run"],
      },
      severity: "Moderate" as const,
    },
    {
      name: "Insurgency",
      desc: "Rebel movements challenge faction authority and drain resources.",
      effects: {
        creditsModifier: -25,
        techModifier: -10,
        manpowerModifier: -30,
        missionAvailability: ["Assassination", "Rescue Operation"],
      },
      severity: "Moderate" as const,
    },
  ],
  Anomaly: [
    {
      name: "Void Rift",
      desc: "Mysterious spatial anomaly opens, revealing unknown territories.",
      effects: {
        creditsModifier: 0,
        techModifier: +40,
        manpowerModifier: 0,
        missionAvailability: ["Exploration", "Horror"],
      },
      severity: "Moderate" as const,
    },
    {
      name: "Temporal Distortion",
      desc: "Time anomaly creates unpredictable effects on faction operations.",
      effects: {
        creditsModifier: -20,
        techModifier: +30,
        manpowerModifier: -10,
        missionAvailability: ["Espionage", "Heist/Raid"],
      },
      severity: "Moderate" as const,
    },
  ],
};

export function generateSectorEvent(
  affectedRegions: string[],
  currentYear: number
): SectorEvent {
  const eventType = Object.keys(eventTemplates)[
    Math.floor(Math.random() * Object.keys(eventTemplates).length)
  ] as keyof typeof eventTemplates;

  const templates = eventTemplates[eventType];
  const template = templates[Math.floor(Math.random() * templates.length)];

  const duration = template.severity === "Severe" ? 10 : template.severity === "Moderate" ? 5 : 2;

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: template.name,
    description: template.desc,
    type: eventType as "Disaster" | "Opportunity" | "Conflict" | "Anomaly",
    affectedRegions,
    duration,
    startYear: currentYear,
    effects: template.effects,
    severity: template.severity,
  };
}

export function applyEventEffects(
  baseResources: Record<string, number>,
  event: SectorEvent,
  currentYear: number
): Record<string, number> {
  // Check if event is still active
  if (currentYear < event.startYear || currentYear > event.startYear + event.duration) {
    return baseResources;
  }

  return {
    credits: Math.max(0, baseResources.credits + (baseResources.credits * event.effects.creditsModifier) / 100),
    tech: Math.max(0, baseResources.tech + (baseResources.tech * event.effects.techModifier) / 100),
    manpower: Math.max(0, baseResources.manpower + (baseResources.manpower * event.effects.manpowerModifier) / 100),
  };
}

export function getActiveEvents(events: SectorEvent[], currentYear: number): SectorEvent[] {
  return events.filter(
    (event) => currentYear >= event.startYear && currentYear <= event.startYear + event.duration
  );
}
