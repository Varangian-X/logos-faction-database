import { factions, FactionTier } from "./factions";

export interface TimelineEvent {
  tier: FactionTier;
  period: string;
  description: string;
  factionIds: string[];
  significance: "critical" | "major" | "minor";
}

export interface TimelineEntry {
  factionId: string;
  factionName: string;
  tier: FactionTier;
  alignment: string;
  category: string;
  emergence: string;
  description: string;
}

// Timeline of faction emergence organized by tier
export const timelineEvents: TimelineEvent[] = [
  {
    tier: 1,
    period: "Primordial Era",
    description: "The foundational entities emerge from the Logos substrate itself. These are the existential forces that define reality.",
    factionIds: ["dde", "sidhe", "vanta"],
    significance: "critical",
  },
  {
    tier: 2,
    period: "Imperial Consolidation",
    description: "The core institutional forces crystallize around the Digital Divine Emperor. Military, security, and administrative structures form.",
    factionIds: ["neo-praetorians", "neo-varangians", "agentes", "high-logothetes", "ecclesiarchy", "exarch-sophia", "exarch-theodora", "exarch-malachai"],
    significance: "critical",
  },
  {
    tier: 3,
    period: "Dynastic Proliferation",
    description: "The twelve great houses and economic collectives establish themselves. The Byzantine Pendulum between Stasis and Plasticity begins.",
    factionIds: [
      "house-angeloi", "house-comnenus", "house-voron", "house-porphyrogennetos", "house-vance", "house-varrus",
      "house-hrothgar", "house-thorne", "house-sancratos", "house-volkov", "house-septimus", "house-vex",
      "house-justinian", "house-ovidian", "venetoi", "prasinoi", "guild-artificers", "council-smiths",
      "mining-guilds", "magisterium-flesh", "scytale-consortium", "iron-hand-syndicate"
    ],
    significance: "major",
  },
  {
    tier: 4,
    period: "Frontier Expansion",
    description: "Intelligence agencies, regional powers, and frontier settlements emerge as the Empire extends beyond the Core.",
    factionIds: ["scrinium-barbarorum", "council-captains", "ister-rim", "tomi-collective", "iron-oedile", "lumen-covenant", "aether-nomads", "orakesh-dominion"],
    significance: "major",
  },
  {
    tier: 5,
    period: "Shadow Emergence",
    description: "Underworld powers and criminal organizations crystallize in the spaces between Imperial authority.",
    factionIds: ["silt-barons", "oneiric-cartel", "scavenger-clans", "brethren-broken-code"],
    significance: "major",
  },
  {
    tier: 6,
    period: "Xenos Contact & Fringe Awakening",
    description: "Alien intelligences and fringe entities make contact with or emerge within Imperial space. Reality begins to fragment.",
    factionIds: ["mycenoids", "synthetics", "void-huns", "lithic-sovereignty", "scriptum-orthodoxy", "data-druids"],
    significance: "major",
  },
  {
    tier: 7,
    period: "Emergent & Anomalous",
    description: "New, unpredictable forces emerge from the edges of reality. These represent the frontier of the unknown.",
    factionIds: ["time-stitchers", "custodians-living-script", "resonant-conclave", "whisper-sellers", "graft-cult"],
    significance: "minor",
  },
];

export function getTimelineEntries(): TimelineEntry[] {
  return factions.map(faction => {
    const event = timelineEvents.find(e => e.factionIds.includes(faction.id));
    return {
      factionId: faction.id,
      factionName: faction.name,
      tier: faction.tier,
      alignment: faction.alignment,
      category: faction.category,
      emergence: event?.period || "Unknown",
      description: faction.description,
    };
  });
}

export function getTimelineEventsByTier(tier: FactionTier): TimelineEvent | undefined {
  return timelineEvents.find(e => e.tier === tier);
}

export function getFactionsInPeriod(period: string): TimelineEntry[] {
  const event = timelineEvents.find(e => e.period === period);
  if (!event) return [];
  return factions
    .filter(f => event.factionIds.includes(f.id))
    .map(faction => ({
      factionId: faction.id,
      factionName: faction.name,
      tier: faction.tier,
      alignment: faction.alignment,
      category: faction.category,
      emergence: period,
      description: faction.description,
    }));
}
