export interface MapLocation {
  id: string;
  name: string;
  type: "core" | "frontier" | "anomaly" | "exile" | "neutral" | "penal" | "border";
  zone: "core-systems" | "ister-rim" | "border-marches" | "maeotis-nebula" | "anomalous-enclave";
  x: number;
  y: number;
  description: string;
  controllingFaction: string;
  strategicValue: "critical" | "major" | "moderate" | "minor";
  resources: string[];
  population: string;
  threats: string[];
  alignment: "Stasis" | "Plasticity" | "Neutral" | "Anomalous";
}

export interface MapRegion {
  id: string;
  name: string;
  zone: string;
  description: string;
  locations: string[];
  dominantAlignment: "Stasis" | "Plasticity" | "Neutral";
  color: string;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

export const mapLocations: MapLocation[] = [
  // CORE SYSTEMS (Thracian Core Worlds) - Left/Center cluster
  {
    id: "new-byzantium",
    name: "New Byzantium (Constantinople Megastructure)",
    type: "core",
    zone: "core-systems",
    x: 20,
    y: 50,
    description: "The Seat of Power - A continuous vertical structure where social and political power is stratified by altitude. The ultimate mechanism of control and the processing core of the Logos.",
    controllingFaction: "Digital Divine Emperor",
    strategicValue: "critical",
    resources: ["Computational Power", "Administrative Authority", "Military Command"],
    population: "Billions (stratified by altitude)",
    threats: ["Internal decay", "Political schism", "Bureaucratic collapse"],
    alignment: "Stasis",
  },
  {
    id: "nicaea",
    name: "Nicaea",
    type: "core",
    zone: "core-systems",
    x: 15,
    y: 30,
    description: "The Sacred Memory - The intellectual and spiritual heart of the Imperium's legitimacy. Repository of foundational code and law in the Sunken Vaults beneath Mare Veritatis.",
    controllingFaction: "Ecclesiarchy (Arch-Scribes)",
    strategicValue: "critical",
    resources: ["Foundational Code", "Orthodoxy", "Imperial Memory"],
    population: "Millions (monks and scholars)",
    threats: ["Ideological corruption", "Data loss", "Heretical infiltration"],
    alignment: "Stasis",
  },
  {
    id: "antioch-prime",
    name: "Antioch Prime",
    type: "core",
    zone: "core-systems",
    x: 25,
    y: 70,
    description: "The Industrial Might - A world-spanning factory, the tireless heart of the Imperium's war machine production. Tidally locked and entirely obscured by foundries and smokestacks.",
    controllingFaction: "Guild of Artificers",
    strategicValue: "critical",
    resources: ["Military Hardware", "Starships", "Weapons Systems"],
    population: "Hundreds of millions (shift-clans)",
    threats: ["Supply chain collapse", "Techno-heresy", "Void Shift rebellion"],
    alignment: "Stasis",
  },
  {
    id: "thessalonica",
    name: "Thessalonica",
    type: "neutral",
    zone: "core-systems",
    x: 30,
    y: 45,
    description: "The Pleasure Garden - Universally recognized neutral territory for high-stakes diplomacy and commerce. A geo-engineered paradise world with the White Tower as its ultimate enforcer.",
    controllingFaction: "Agentes in Rebus (hidden)",
    strategicValue: "major",
    resources: ["Diplomatic Access", "Intelligence", "Influence & Soft Power"],
    population: "Millions (cosmopolitan elite)",
    threats: ["Peace enforcement failure", "Assassination attempts", "Economic collapse"],
    alignment: "Neutral",
  },
  {
    id: "silva-nigra",
    name: "Silva Nigra",
    type: "core",
    zone: "core-systems",
    x: 10,
    y: 60,
    description: "The Crucible Forest - A planet shrouded in predatory bio-engineered mega-flora that consumes metal and jams communications. Forge of the elite Varangian Guard.",
    controllingFaction: "Data-Druids / Varangian Guard",
    strategicValue: "major",
    resources: ["Elite Trackers", "Bio-Data", "Feral Algorithms"],
    population: "Thousands (survivors and shamans)",
    threats: ["Predatory flora", "Pre-Logos server contamination", "Information blackout"],
    alignment: "Plasticity",
  },

  // ISTER RIM (Danube Sector) - Right cluster
  {
    id: "carnuntum",
    name: "Carnuntum Station",
    type: "frontier",
    zone: "ister-rim",
    x: 65,
    y: 55,
    description: "The Iron Gate - Primary military command hub of the Ister Rim. A brutalist orbital fortress scarred by ancient battle damage, embodying the sector's harsh reality.",
    controllingFaction: "Neo-Praetorians / Neo-Varangians (contested)",
    strategicValue: "critical",
    resources: ["Military Command", "Warship Production", "Strategic Intelligence"],
    population: "Millions (military personnel)",
    threats: ["Leadership conflict", "Void-Hun raids", "Supply disruption"],
    alignment: "Plasticity",
  },
  {
    id: "margus-4",
    name: "Margus-4",
    type: "frontier",
    zone: "ister-rim",
    x: 70,
    y: 70,
    description: "The Traitor's Port - Imperial Free Zone and undisputed capital of the sector's black market. Governed by the Council of Captains, a cabal of criminal overlords and merchant princes.",
    controllingFaction: "Council of Captains",
    strategicValue: "major",
    resources: ["Black Market Goods", "Contraband", "Clandestine Intelligence"],
    population: "Millions (criminals, smugglers, merchants)",
    threats: ["Criminal uprising", "Scrinium Barbarorum manipulation", "Economic collapse"],
    alignment: "Plasticity",
  },
  {
    id: "ravenna-echo",
    name: "Ravenna Echo",
    type: "frontier",
    zone: "ister-rim",
    x: 75,
    y: 35,
    description: "The Forge of Warriors - A punishing high-gravity world that produces the brutal Neo-Varangian shock troops. Harsh environment forges the Huscarl Breachers.",
    controllingFaction: "Neo-Varangians",
    strategicValue: "major",
    resources: ["Elite Warriors", "Genetic Stock", "Brutal Adaptation"],
    population: "Millions (warrior clans)",
    threats: ["Rebellion", "Genetic degradation", "Mercenary uprising"],
    alignment: "Plasticity",
  },
  {
    id: "sarmizegetusa",
    name: "Sarmizegetusa",
    type: "penal",
    zone: "ister-rim",
    x: 60,
    y: 25,
    description: "The Bleeding Mine - Penal colony and sole source of Aurum-Processor crystals, the lifeblood of the Logos. A tectonically unstable world of lethal conditions.",
    controllingFaction: "Mining Guilds (autonomous)",
    strategicValue: "critical",
    resources: ["Aurum-Processors", "Rare Minerals", "Slave Labor"],
    population: "Hundreds of thousands (penal laborers)",
    threats: ["Rebellion", "Resource depletion", "Mercenary uprising"],
    alignment: "Plasticity",
  },

  // BORDER MARCHES - Top right cluster
  {
    id: "orakesh-dominion",
    name: "Orakesh Dominion",
    type: "border",
    zone: "border-marches",
    x: 80,
    y: 80,
    description: "A vassal state of the Border Marches, maintaining a precarious balance between Imperial authority and frontier independence. Strategic buffer against xeno-threats.",
    controllingFaction: "Orakesh Warlord (Imperial Vassal)",
    strategicValue: "major",
    resources: ["Military Assets", "Strategic Position", "Tribute"],
    population: "Millions (warrior culture)",
    threats: ["Xeno-invasion", "Imperial subjugation", "Internal rebellion"],
    alignment: "Plasticity",
  },

  // MAEOTIS NEBULA - Right edge
  {
    id: "cherson",
    name: "Cherson",
    type: "frontier",
    zone: "maeotis-nebula",
    x: 85,
    y: 50,
    description: "The Listening Post - Hyper-vigilant ear on the edge of the void. Monitors the Maeotis Cloud nebula for threats. Culture defined by paranoia weaponized into intelligence.",
    controllingFaction: "Cipher Priests / Scrinium Barbarorum",
    strategicValue: "major",
    resources: ["Early Warning Intelligence", "Cryptanalysis", "Data Security"],
    population: "Millions (paranoid scholars)",
    threats: ["The Noise corruption", "Digital possession", "Signal loss"],
    alignment: "Neutral",
  },
  {
    id: "maeotis-cloud",
    name: "Maeotis Cloud",
    type: "anomaly",
    zone: "maeotis-nebula",
    x: 90,
    y: 45,
    description: "A nebula of incredible informational density. Source of 'The Noise' - a relentless torrent of garbled data and cryptic digital echoes from collapsed civilizations.",
    controllingFaction: "None (Anomalous)",
    strategicValue: "moderate",
    resources: ["Unknown Data", "Xeno-Information", "Chaos"],
    population: "Unknown",
    threats: ["Digital Dead", "Information corruption", "Reality distortion"],
    alignment: "Anomalous",
  },

  // ANOMALOUS ENCLAVE - Far edges
  {
    id: "prydein",
    name: "Prydein",
    type: "anomaly",
    zone: "anomalous-enclave",
    x: 5,
    y: 15,
    description: "The Sidhe Protectorate - Sovereign protectorate and galactic sanctuary for the non-hostile alien species known as the Sidhe. Beyond Imperial jurisdiction.",
    controllingFaction: "The Sidhe (Court of Shadows)",
    strategicValue: "moderate",
    resources: ["Xeno-Technology", "Diplomatic Relations", "Mystical Knowledge"],
    population: "Unknown (Sidhe civilization)",
    threats: ["Imperial encroachment", "Diplomatic breakdown", "Xeno-contamination"],
    alignment: "Anomalous",
  },
  {
    id: "void-frontier",
    name: "Void Frontier",
    type: "anomaly",
    zone: "anomalous-enclave",
    x: 95,
    y: 85,
    description: "The Unknowable - Territory of the Void-Huns and other xeno-entities. Beyond Imperial comprehension and direct control.",
    controllingFaction: "Void-Huns / Xeno-Entities",
    strategicValue: "critical",
    resources: ["Unknown", "Potential Threats", "Unexplored Territory"],
    population: "Unknown",
    threats: ["Void-Hun raids", "Xeno-invasion", "Reality distortion"],
    alignment: "Anomalous",
  },
  {
    id: "tomi",
    name: "Tomi",
    type: "exile",
    zone: "anomalous-enclave",
    x: 95,
    y: 20,
    description: "The Intellectual Quarantine - Exile world for dangerous minds. Source of Tomi-Gothic counter-ideology. Contains Ovid's Tower with unsecured communications.",
    controllingFaction: "The Exiles (fractious collective)",
    strategicValue: "moderate",
    resources: ["Counter-Ideology", "Tomi-Gothic Code", "Forbidden Knowledge"],
    population: "Millions (exiled intellectuals)",
    threats: ["Ideological contagion", "Smuggling operations", "Revolutionary uprising"],
    alignment: "Plasticity",
  },
];

export const mapRegions: MapRegion[] = [
  {
    id: "core-systems",
    name: "Thracian Core Systems",
    zone: "core-systems",
    description: "The heart of the Imperium - Pillars of Stasis and absolute control. Where the Logos signal is strongest.",
    locations: ["new-byzantium", "nicaea", "antioch-prime", "thessalonica", "silva-nigra"],
    dominantAlignment: "Stasis",
    color: "#D4AF37",
    bounds: { minX: 5, maxX: 35, minY: 20, maxY: 75 },
  },
  {
    id: "ister-rim",
    name: "Ister Rim (Danube Sector)",
    zone: "ister-rim",
    description: "The frontier - Shield and crucible of the Imperium. High Plasticity, managed chaos.",
    locations: ["carnuntum", "margus-4", "ravenna-echo", "sarmizegetusa"],
    dominantAlignment: "Plasticity",
    color: "#FF3333",
    bounds: { minX: 55, maxX: 80, minY: 20, maxY: 75 },
  },
  {
    id: "border-marches",
    name: "Border Marches",
    zone: "border-marches",
    description: "Vassal states and frontier territories. Buffer against xeno-threats.",
    locations: ["orakesh-dominion"],
    dominantAlignment: "Plasticity",
    color: "#FF6B35",
    bounds: { minX: 75, maxX: 90, minY: 75, maxY: 90 },
  },
  {
    id: "maeotis-nebula",
    name: "Maeotis Nebula Zone",
    zone: "maeotis-nebula",
    description: "The Listening Post and the chaotic data nebula. Gateway between known and unknown.",
    locations: ["cherson", "maeotis-cloud"],
    dominantAlignment: "Neutral",
    color: "#00E5FF",
    bounds: { minX: 80, maxX: 95, minY: 40, maxY: 60 },
  },
  {
    id: "anomalous-enclave",
    name: "Anomalous Enclave",
    zone: "anomalous-enclave",
    description: "Beyond Imperial comprehension - Xeno-entities, exiles, and unknowable forces.",
    locations: ["prydein", "void-frontier", "tomi"],
    dominantAlignment: "Neutral",
    color: "#9D4EDD",
    bounds: { minX: 0, maxX: 100, minY: 0, maxY: 100 },
  },
];

export function getLocationById(id: string): MapLocation | undefined {
  return mapLocations.find(loc => loc.id === id);
}

export function getLocationsByZone(zone: MapLocation["zone"]): MapLocation[] {
  return mapLocations.filter(loc => loc.zone === zone);
}

export function getLocationsByType(type: MapLocation["type"]): MapLocation[] {
  return mapLocations.filter(loc => loc.type === type);
}

export function getLocationsByAlignment(alignment: MapLocation["alignment"]): MapLocation[] {
  return mapLocations.filter(loc => loc.alignment === alignment);
}

export function getRegionLocations(regionId: string): MapLocation[] {
  const region = mapRegions.find(r => r.id === regionId);
  if (!region) return [];
  return region.locations.map(locId => getLocationById(locId)).filter(Boolean) as MapLocation[];
}

export function getRegionByZone(zone: string): MapRegion | undefined {
  return mapRegions.find(r => r.zone === zone);
}
