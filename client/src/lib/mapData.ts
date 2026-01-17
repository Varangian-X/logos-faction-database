export interface MapLocation {
  id: string;
  name: string;
  type: "core" | "frontier" | "anomaly" | "exile" | "neutral" | "penal";
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
  description: string;
  locations: string[];
  dominantAlignment: "Stasis" | "Plasticity" | "Neutral";
  color: string;
}

export const mapLocations: MapLocation[] = [
  // Core Worlds
  {
    id: "constantinople",
    name: "Constantinople Megastructure",
    type: "core",
    x: 50,
    y: 50,
    description: "The Seat of Power - A continuous vertical structure where social and political power is stratified by altitude. The ultimate mechanism of control.",
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
    x: 60,
    y: 40,
    description: "The Sacred Memory - The intellectual and spiritual heart of the Imperium's legitimacy. Repository of foundational code and law.",
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
    x: 45,
    y: 55,
    description: "The Industrial Might - A world-spanning factory, the tireless heart of the Imperium's war machine production.",
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
    x: 55,
    y: 45,
    description: "The Enforced Neutral Ground - Universally recognized neutral territory for high-stakes diplomacy and commerce.",
    controllingFaction: "White Tower Authority",
    strategicValue: "major",
    resources: ["Diplomatic Access", "Intelligence", "Commerce"],
    population: "Millions (cosmopolitan)",
    threats: ["Peace enforcement failure", "Assassination attempts", "Economic collapse"],
    alignment: "Neutral",
  },

  // Frontier Worlds
  {
    id: "carnuntum",
    name: "Carnuntum Station",
    type: "frontier",
    x: 70,
    y: 60,
    description: "The Iron Gate - Primary military command hub of the Ister Rim. A brutalist fortress embodying the sector's harsh reality.",
    controllingFaction: "Neo-Praetorians / Neo-Varangians (contested)",
    strategicValue: "critical",
    resources: ["Military Command", "Warship Production", "Strategic Intelligence"],
    population: "Millions (military personnel)",
    threats: ["Leadership conflict", "Void-Hun raids", "Supply disruption"],
    alignment: "Plasticity",
  },
  {
    id: "sarmizegetusa",
    name: "Sarmizegetusa",
    type: "penal",
    x: 75,
    y: 55,
    description: "The Bleeding Mine - Penal colony and sole source of Aurum-Processor crystals, the lifeblood of the Logos.",
    controllingFaction: "Mining Guilds (autonomous)",
    strategicValue: "critical",
    resources: ["Aurum-Processors", "Rare Minerals", "Slave Labor"],
    population: "Hundreds of thousands (penal laborers)",
    threats: ["Rebellion", "Resource depletion", "Mercenary uprising"],
    alignment: "Plasticity",
  },
  {
    id: "cherson",
    name: "Cherson",
    type: "frontier",
    x: 80,
    y: 50,
    description: "The Listening Post - Hyper-vigilant ear on the edge of the void. Monitors the Maeotis Cloud nebula for threats.",
    controllingFaction: "Cipher Priests / Scrinium Barbarorum",
    strategicValue: "major",
    resources: ["Early Warning Intelligence", "Cryptanalysis", "Data Security"],
    population: "Millions (paranoid scholars)",
    threats: ["The Noise corruption", "Digital possession", "Signal loss"],
    alignment: "Neutral",
  },
  {
    id: "tomi",
    name: "Tomi",
    type: "exile",
    x: 85,
    y: 45,
    description: "The Intellectual Quarantine - Exile world for dangerous minds. Source of Tomi-Gothic counter-ideology.",
    controllingFaction: "The Exiles (fractious collective)",
    strategicValue: "moderate",
    resources: ["Counter-Ideology", "Tomi-Gothic Code", "Forbidden Knowledge"],
    population: "Millions (exiled intellectuals)",
    threats: ["Ideological contagion", "Smuggling operations", "Revolutionary uprising"],
    alignment: "Plasticity",
  },

  // Anomalous Zones
  {
    id: "prydein",
    name: "Prydein",
    type: "anomaly",
    x: 40,
    y: 65,
    description: "The Sidhe Protectorate - Sovereign protectorate and galactic sanctuary for the non-hostile alien species known as the Sidhe.",
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
    x: 90,
    y: 70,
    description: "The Unknowable - Territory of the Void-Huns and other xeno-entities. Beyond Imperial comprehension.",
    controllingFaction: "Void-Huns / Xeno-Entities",
    strategicValue: "critical",
    resources: ["Unknown", "Potential Threats", "Unexplored Territory"],
    population: "Unknown",
    threats: ["Void-Hun raids", "Xeno-invasion", "Reality distortion"],
    alignment: "Anomalous",
  },
  {
    id: "under-spire",
    name: "Under-Spire (Constantinople)",
    type: "core",
    x: 50,
    y: 48,
    description: "The Foundation of the Capital - Forgotten foundation serving as thermodynamic and digital waste receptacle. Home to the Dead Wood and Neo-Varangians.",
    controllingFaction: "Neo-Varangians / Dead Wood (contested)",
    strategicValue: "moderate",
    resources: ["Mercenary Forces", "Black Market Goods", "Hidden Infrastructure"],
    population: "Millions (disenfranchised)",
    threats: ["Criminal uprising", "Varangian rebellion", "System collapse"],
    alignment: "Plasticity",
  },
];

export const mapRegions: MapRegion[] = [
  {
    id: "core-worlds",
    name: "Imperial Core",
    description: "The heart of the Imperium - Pillars of Stasis and control",
    locations: ["constantinople", "nicaea", "antioch-prime", "thessalonica", "under-spire"],
    dominantAlignment: "Stasis",
    color: "#D4AF37",
  },
  {
    id: "ister-rim",
    name: "Ister Rim (Danube Sector)",
    description: "The frontier - Shield and crucible of the Imperium",
    locations: ["carnuntum", "sarmizegetusa", "cherson", "tomi"],
    dominantAlignment: "Plasticity",
    color: "#FF3333",
  },
  {
    id: "anomaly-zone",
    name: "Anomalous Territories",
    description: "Beyond Imperial comprehension - Xeno-entities and unknowable forces",
    locations: ["prydein", "void-frontier"],
    dominantAlignment: "Neutral",
    color: "#00E5FF",
  },
];

export function getLocationById(id: string): MapLocation | undefined {
  return mapLocations.find(loc => loc.id === id);
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
