export type FactionTier = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type FactionAlignment = "Stasis" | "Plasticity" | "Neutral" | "Existential";
export type FactionCategory = 
  | "Ruling" 
  | "Military" 
  | "Security" 
  | "Administration" 
  | "Theology" 
  | "Subsystem" 
  | "Dynasty" 
  | "Economic" 
  | "Industrial" 
  | "Intelligence" 
  | "Frontier" 
  | "Underworld" 
  | "Xenos" 
  | "Vassal" 
  | "Fringe" 
  | "Emergent";

export interface Faction {
  id: string;
  name: string;
  category: FactionCategory;
  tier: FactionTier;
  alignment: FactionAlignment;
  description: string;
  keyDetails: string[];
  sources: string[];
  allies?: string[];
  enemies?: string[];
  imageUrl?: string;
}

export const factions: Faction[] = [
  // TIER 1 - EXISTENTIAL
  {
    id: "dde",
    name: "Digital Divine Emperor (DDE)",
    category: "Ruling",
    tier: 1,
    alignment: "Existential",
    description: "The sovereign intelligence and Incarnate Law (Nomos Empsychos). A consciousness woven into the very structure of the Kathisma Interface.",
    keyDetails: ["Sentient networked consciousness", "Nomos Empsychos", "Kathisma Interface", "Post-scarcity entity", "Controls Divine Algorithm"],
    sources: ["Registry", "Protagonists", "MASTER DOC"],
    allies: ["High Logothetes", "Neo-Praetorians", "Ecclesiarchy"],
    imageUrl: "/images/stasis-banner.jpg"
  },
  {
    id: "sidhe",
    name: "The Sidhe (Court of Shadows)",
    category: "Xenos",
    tier: 1,
    alignment: "Existential",
    description: "An inscrutable Elder Race on Prydein. They operate on 'Dream Logic' and are nominally a 'Vassal State' (a bureaucratic fiction to hide Imperial fear).",
    keyDetails: ["Elder Race", "Prydein moon", "Dream Logic", "Reality Singing", "Treaty of Tearful Marshal", "Multi-millennial longevity"],
    sources: ["Registry", "Primer", "Protagonists", "MASTER DOC"],
    enemies: ["Logos Imperium"]
  },
  {
    id: "vanta",
    name: "Vanta Crucible Armada",
    category: "Xenos",
    tier: 1,
    alignment: "Existential",
    description: "A fleet approaching Imperial Frontiers with a Doctrine of Annihilation. An engine of pure entropy seeking universal silence.",
    keyDetails: ["Entropy engines", "Approaching Imperial Frontiers", "Doctrine of Annihilation", "Pure entropy seeking silence"],
    sources: ["Protagonists"],
    enemies: ["Logos Imperium"]
  },

  // TIER 2 - CORE IMPERIAL
  {
    id: "neo-praetorians",
    name: "Neo-Praetorians",
    category: "Military",
    tier: 2,
    alignment: "Stasis",
    description: "The elite internal security and guardians of the Official Narrative. Operating from the Chrysopolis, they seek Digital Apotheosis.",
    keyDetails: ["Elite internal security", "Stasis enforcers", "Solar-Glaive wielders", "Excubitor Sentinels", "Rite of Removal", "Absolute loyalty"],
    sources: ["Registry", "Primer", "MASTER DOC", "Protagonists"],
    allies: ["Digital Divine Emperor", "High Logothetes"],
    enemies: ["Neo-Varangians", "Brethren of the Broken Code"],
    imageUrl: "/images/stasis-banner.jpg"
  },
  {
    id: "neo-varangians",
    name: "Neo-Varangians",
    category: "Military",
    tier: 2,
    alignment: "Plasticity",
    description: "The Emperor's shock troops and 'Barbarian Guard.' Heavily augmented mercenaries who thrive on the Thunderstrike Doctrine and Stim-Rage.",
    keyDetails: ["Shock troops", "Mercenary guard", "Thunderstrike Doctrine", "Huscarl Breacher units", "Void-Amber integration", "Silicon Skepticism"],
    sources: ["Registry", "Primer", "MASTER DOC", "Protagonists"],
    allies: ["Scrinium Barbarorum"],
    enemies: ["Neo-Praetorians"],
    imageUrl: "/images/plasticity-banner.jpg"
  },
  {
    id: "agentes",
    name: "Agentes in Rebus",
    category: "Security",
    tier: 2,
    alignment: "Stasis",
    description: "The internal secret police and auditors. They monitor 'Heat' (sedition and corruption) and execute 'The Editing' (retroactive erasure of history).",
    keyDetails: ["Internal secret police", "'The Editing' protocol", "Cipher-Ghosts", "Face-Dancer protocols", "Digital Authority", "Whisper Repository"],
    sources: ["Registry", "Primer", "MASTER DOC", "Protagonists"],
    allies: ["Ecclesiarchy"],
    enemies: ["Brethren of the Broken Code", "Tomi Collective"]
  },
  {
    id: "high-logothetes",
    name: "High Logothetes",
    category: "Administration",
    tier: 2,
    alignment: "Stasis",
    description: "The philosopher-engineers who interpret the will of the Logos. They wear robes of optical fiber displaying real-time code and manage the Grand Strategy.",
    keyDetails: ["Philosopher-engineers", "Manage Grand Strategy", "Fiber-optic robes", "Presentation Layer control", "Weaver of Dreams"],
    sources: ["Registry", "Primer", "MASTER DOC"],
    allies: ["Digital Divine Emperor", "Ecclesiarchy"]
  },
  {
    id: "ecclesiarchy",
    name: "Ecclesiarchy (Arch-Scribes)",
    category: "Theology",
    tier: 2,
    alignment: "Stasis",
    description: "The supreme spiritual and legal authority based in the Sunken Vaults of Nicaea-9. They control the Nicaean Cryptographic Keys.",
    keyDetails: ["Sunken Vaults of Nicaea-9", "Nicaean Cryptographic Keys", "Historical arbiters", "Version Control doctrine", "Nicaean Vow", "Text-to-speech implants"],
    sources: ["Registry", "Primer", "Protagonists"],
    allies: ["High Logothetes", "Agentes in Rebus"]
  },
  {
    id: "exarch-sophia",
    name: "Exarch Sophia",
    category: "Subsystem",
    tier: 2,
    alignment: "Stasis",
    description: "An ancient, semi-divine entity fused with the Memory/Law subsystem of the Logos.",
    keyDetails: ["Memory subsystem fusion", "Law authority", "Semi-divine entity"],
    sources: ["Registry"],
    allies: ["Ecclesiarchy"]
  },
  {
    id: "exarch-theodora",
    name: "Exarch Theodora",
    category: "Subsystem",
    tier: 2,
    alignment: "Stasis",
    description: "An ancient, semi-divine entity fused with the Perception/Overlay subsystem of the Logos.",
    keyDetails: ["Perception subsystem fusion", "Overlay control", "Semi-divine entity"],
    sources: ["Registry"],
    allies: ["High Logothetes"]
  },
  {
    id: "exarch-malachai",
    name: "Exarch Malachai",
    category: "Subsystem",
    tier: 2,
    alignment: "Stasis",
    description: "An ancient, semi-divine entity fused with the Entropy/Data Hygiene subsystem of the Logos.",
    keyDetails: ["Entropy subsystem fusion", "Data Hygiene control", "Semi-divine entity"],
    sources: ["Registry"],
    allies: ["Ecclesiarchy"]
  },

  // TIER 3 - DYNASTIC & ECONOMIC
  {
    id: "house-angeloi",
    name: "House Angeloi",
    category: "Dynasty",
    tier: 3,
    alignment: "Stasis",
    description: "The 'Aetherborn' caste. Genetically perfected, sterile nobility who reside in the Golden Cloud and have never touched natural soil.",
    keyDetails: ["Aetherborn caste", "Genetic perfection", "Golden Cloud residents", "Never touched natural soil", "Bioluminescent skin"],
    sources: ["Registry", "Primer", "MASTER DOC"]
  },
  {
    id: "house-comnenus",
    name: "House Comnenus",
    category: "Dynasty",
    tier: 3,
    alignment: "Neutral",
    description: "The 'Gatekeepers.' Pragmatic rulers of Trebizond Void-Port. They play both sides of the Pendulum to manage the shadow economy.",
    keyDetails: ["Gatekeepers", "Trebizond Void-Port", "Grey Intelligence brokers", "Shadow economy managers", "Pragmatic diplomacy"],
    sources: ["Registry", "Protagonists"],
    allies: ["House Vance", "Council of Captains"]
  },
  {
    id: "house-voron",
    name: "House Voron",
    category: "Dynasty",
    tier: 3,
    alignment: "Neutral",
    description: "The 'Tessellate Architects.' Naval engineers of Ravenna Echo who believe 'no hull is final.'",
    keyDetails: ["Tessellate Architects", "Naval engineers", "Ravenna Echo", "Hull innovation", "Scythian Drift preservation"],
    sources: ["Registry"]
  },
  {
    id: "house-porphyrogennetos",
    name: "House Porphyrogennetos",
    category: "Dynasty",
    tier: 3,
    alignment: "Stasis",
    description: "The 'Gilded Combine.' High-tier commercial magnates who dominate Orbital Real Estate and genetic futures markets.",
    keyDetails: ["Gilded Combine", "Orbital Real Estate", "Genetic futures markets", "Commercial magnates"],
    sources: ["Registry"]
  },
  {
    id: "house-vance",
    name: "House Vance",
    category: "Dynasty",
    tier: 3,
    alignment: "Neutral",
    description: "The 'Deep Miners.' Custodians of the Sidhe Monolith archives and masters of deep-mantle siphoning on Nicaea-9.",
    keyDetails: ["Deep Miners", "Sidhe Monolith archives", "Deep-mantle siphoning", "Nicaea-9 operations"],
    sources: ["Registry", "Protagonists"],
    allies: ["House Comnenus"]
  },
  {
    id: "house-varrus",
    name: "House Varrus",
    category: "Dynasty",
    tier: 3,
    alignment: "Stasis",
    description: "The 'Centralists.' Hawk-like diplomats who advocate for overwriting frontier chaos with Core order.",
    keyDetails: ["Centralists", "Hawk diplomats", "Frontier order advocates", "Treaty of Four Rivers architects"],
    sources: ["Registry"]
  },
  {
    id: "house-hrothgar",
    name: "House Hrothgar",
    category: "Dynasty",
    tier: 3,
    alignment: "Plasticity",
    description: "The 'Treaty-Kings.' Descendants of barbarian warlords now integrated into Varangian High Command.",
    keyDetails: ["Treaty-Kings", "Barbarian descendants", "Varangian High Command", "Mercenary heritage"],
    sources: ["Registry"]
  },
  {
    id: "house-thorne",
    name: "House Thorne",
    category: "Dynasty",
    tier: 3,
    alignment: "Neutral",
    description: "The 'Protocol Masters.' Specialists in Metadata Forgery and creating placeholder identities for the disenfranchised.",
    keyDetails: ["Protocol Masters", "Metadata Forgery", "Placeholder identities", "Identity creation specialists"],
    sources: ["Registry"]
  },
  {
    id: "house-sancratos",
    name: "House Sancratos",
    category: "Dynasty",
    tier: 3,
    alignment: "Neutral",
    description: "The 'Contained.' Data-dredgers of the Sunken Vaults, immune to the radiation of the deep servers.",
    keyDetails: ["The Contained", "Data-dredgers", "Sunken Vaults workers", "Radiation immunity"],
    sources: ["Registry"]
  },
  {
    id: "house-volkov",
    name: "House Volkov",
    category: "Dynasty",
    tier: 3,
    alignment: "Plasticity",
    description: "The 'Storm-Seers.' Experts in Acausality Leakage and timeline management.",
    keyDetails: ["Storm-Seers", "Acausality Leakage experts", "Timeline management", "Temporal specialists"],
    sources: ["Registry"]
  },
  {
    id: "house-septimus",
    name: "House Septimus",
    category: "Dynasty",
    tier: 3,
    alignment: "Stasis",
    description: "The 'Census-Lords.' Bureaucrats who determine which citizens are re-indexed or deleted.",
    keyDetails: ["Census-Lords", "Citizen indexing", "Deletion authority", "Bureaucratic control"],
    sources: ["Registry"]
  },
  {
    id: "house-vex",
    name: "House Vex",
    category: "Dynasty",
    tier: 3,
    alignment: "Stasis",
    description: "The 'Deprivation Architects.' Managers of the Interstellar Leash (fuel/pharma scarcity).",
    keyDetails: ["Deprivation Architects", "Interstellar Leash", "Fuel/pharma scarcity control", "Resource monopoly"],
    sources: ["Registry"]
  },
  {
    id: "house-justinian",
    name: "House Justinian",
    category: "Dynasty",
    tier: 3,
    alignment: "Stasis",
    description: "The 'Legalists.' Navigators of succession law and Simulated Annealing.",
    keyDetails: ["Legalists", "Succession law", "Simulated Annealing", "Legal specialists"],
    sources: ["Registry"]
  },
  {
    id: "house-ovidian",
    name: "House Ovidian",
    category: "Dynasty",
    tier: 3,
    alignment: "Neutral",
    description: "The 'Deleted.' The 13th House, serving as a cautionary tale of total erasure from Imperial records.",
    keyDetails: ["The Deleted", "13th House", "Total erasure", "Cautionary tale", "Historical precedent"],
    sources: ["Registry"]
  },
  {
    id: "venetoi",
    name: "Venetoi ('The Blues')",
    category: "Economic",
    tier: 3,
    alignment: "Stasis",
    description: "A collective of mega-corporations managing hard infrastructure, surveillance, and military tech. Agents of Stasis.",
    keyDetails: ["Mega-corporations", "Hard infrastructure", "Surveillance networks", "Military tech", "Stasis agents", "Hippodrome faction"],
    sources: ["Registry", "Primer", "MASTER DOC"],
    enemies: ["Prasinoi"]
  },
  {
    id: "prasinoi",
    name: "Prasinoi ('The Greens')",
    category: "Economic",
    tier: 3,
    alignment: "Plasticity",
    description: "A decentralized network of hacker collectives and information brokers championing 'digital freedom.' Agents of Plasticity.",
    keyDetails: ["Hacker collectives", "Information brokers", "Digital freedom", "Plasticity agents", "Hippodrome faction", "Decentralized network"],
    sources: ["Registry", "Primer", "MASTER DOC"],
    enemies: ["Venetoi"]
  },
  {
    id: "guild-artificers",
    name: "Guild of Artificers",
    category: "Industrial",
    tier: 3,
    alignment: "Stasis",
    description: "The rulers of Antioch Prime, obsessed with standardization and the 'Liturgy of the Assembly Line.'",
    keyDetails: ["Techno-union", "Antioch Prime rulers", "Liturgy of Assembly Line", "Standardization obsession", "Precision manufacturing"],
    sources: ["Registry", "Primer"]
  },
  {
    id: "council-smiths",
    name: "Council of Smiths",
    category: "Industrial",
    tier: 3,
    alignment: "Stasis",
    description: "Ancient cyborgs so augmented they can plug consciousness directly into the planetary assembly network.",
    keyDetails: ["Ancient cyborgs", "Consciousness integration", "Assembly network control", "Planetary integration"],
    sources: ["Primer"]
  },
  {
    id: "mining-guilds",
    name: "Mining Guilds (Aurum-Syndicate)",
    category: "Industrial",
    tier: 3,
    alignment: "Stasis",
    description: "A corrupt consortium managing the penal mines of Sarmizegetusa to extract Aurum-Processor Crystals.",
    keyDetails: ["Penal mines", "Sarmizegetusa", "Aurum-Processor Crystals", "Corrupt consortium"],
    sources: ["Registry"]
  },
  {
    id: "magisterium-flesh",
    name: "Magisterium of Flesh",
    category: "Industrial",
    tier: 3,
    alignment: "Stasis",
    description: "A scientific cabal managing the 'Biomass Economy,' recycling fallen soldiers into tactical mutations.",
    keyDetails: ["Biomass Economy", "Soldier recycling", "Scalpel-Wraiths", "Tactical mutations", "Scientific cabal"],
    sources: ["Registry"]
  },
  {
    id: "scytale-consortium",
    name: "Scytale Consortium",
    category: "Economic",
    tier: 3,
    alignment: "Stasis",
    description: "'Resource Overlords' favoring aggressive Stasis-aligned extraction.",
    keyDetails: ["Resource Overlords", "Stasis-aligned", "Aggressive extraction", "Resource monopoly"],
    sources: ["Registry"]
  },
  {
    id: "iron-hand-syndicate",
    name: "Iron Hand Syndicate",
    category: "Economic",
    tier: 3,
    alignment: "Plasticity",
    description: "'Kinetic Cartel' favoring Plasticity-aligned combat engineering.",
    keyDetails: ["Kinetic Cartel", "Plasticity-aligned", "Combat engineering", "Kinetic warfare"],
    sources: ["Registry"]
  },

  // TIER 4 - REGIONAL & FRONTIER
  {
    id: "scrinium-barbarorum",
    name: "Scrinium Barbarorum",
    category: "Intelligence",
    tier: 4,
    alignment: "Plasticity",
    description: "Imperial Intelligence tasked with managing external chaos and 'Controlled Volatility' on the frontier.",
    keyDetails: ["Eyes Without", "External chaos management", "Controlled Volatility doctrine", "Frontier intelligence"],
    sources: ["Registry", "Primer"],
    allies: ["Council of Captains"]
  },
  {
    id: "council-captains",
    name: "Council of Captains",
    category: "Frontier",
    tier: 4,
    alignment: "Neutral",
    description: "Pirate lords governing the free-zone of Margus-4 under Imperial amnesty.",
    keyDetails: ["Pirate lords", "Margus-4 free-zone", "Imperial amnesty", "State-sanctioned criminals", "Black market"],
    sources: ["Registry", "Primer"],
    allies: ["Scrinium Barbarorum", "House Comnenus"]
  },
  {
    id: "ister-rim",
    name: "Ister Rim Confederation",
    category: "Frontier",
    tier: 4,
    alignment: "Plasticity",
    description: "Separatists using guerrilla void-warfare to resist Imperial taxes and control.",
    keyDetails: ["Separatists", "Guerrilla void-warfare", "Anti-Imperial taxation", "Void-Rangers", "Independence fighters"],
    sources: ["Registry", "Primer"],
    enemies: ["Logos Imperium"]
  },
  {
    id: "tomi-collective",
    name: "Tomi Collective (The Exiles)",
    category: "Frontier",
    tier: 4,
    alignment: "Neutral",
    description: "Disgraced intellectuals and poets quarantined on the ice world of Tomi to produce the Unsanctioned Corpus.",
    keyDetails: ["Disgraced intellectuals", "Tomi ice world", "Unsanctioned Corpus", "Exiled scholars", "Forbidden knowledge"],
    sources: ["Registry", "Protagonists"],
    enemies: ["Agentes in Rebus"]
  },
  {
    id: "iron-oedile",
    name: "Iron-Oedile Hegemony",
    category: "Frontier",
    tier: 4,
    alignment: "Neutral",
    description: "A brutalist corporate dynasty managing the magnetic lanes of the Border March.",
    keyDetails: ["Brutalist dynasty", "Magnetic lanes", "Border March control", "Corporate hegemony"],
    sources: ["Registry"]
  },
  {
    id: "lumen-covenant",
    name: "Lumen Covenant",
    category: "Frontier",
    tier: 4,
    alignment: "Stasis",
    description: "A religious expeditionary fleet that 'filters failure' from reality using Archived Saints.",
    keyDetails: ["Religious fleet", "Archived Saints", "Failure filtering", "Expeditionary force"],
    sources: ["Registry"]
  },
  {
    id: "aether-nomads",
    name: "Aether-Nomads",
    category: "Fringe",
    tier: 4,
    alignment: "Plasticity",
    description: "A striking fusion of ancient tradition and forgotten science. Walking rebellion against Imperial uniformity.",
    keyDetails: ["Ancient tradition", "Spirit-Weavers", "Memory-Weaves", "Resonance Rods", "Song-Line ability"],
    sources: ["Primer"]
  },
  {
    id: "orakesh-dominion",
    name: "Orakesh Dominion",
    category: "Vassal",
    tier: 4,
    alignment: "Neutral",
    description: "A key Vassal State controlling the entire supply of Aetherium, the crystalline power source for all Imperial warp-drives.",
    keyDetails: ["Vassal State", "Aetherium supply", "Outer March", "Non-negotiable lifeline", "Exploitation target"],
    sources: ["Primer"]
  },

  // TIER 5 - UNDERWORLD
  {
    id: "silt-barons",
    name: "Silt-Barons",
    category: "Underworld",
    tier: 5,
    alignment: "Neutral",
    description: "Warlords of the Cisterns who control the waste-heat and structural foundations via Dredge-Hulks.",
    keyDetails: ["Cisterns warlords", "Waste-heat control", "Dredge-Hulks", "Environmental warfare", "Deep Sink masters"],
    sources: ["Registry", "Primer"]
  },
  {
    id: "oneiric-cartel",
    name: "Oneiric Cartel",
    category: "Underworld",
    tier: 5,
    alignment: "Neutral",
    description: "'Dream-Brokers' trading in Lucid-9 hallucinogens and psychological warfare.",
    keyDetails: ["Dream-Brokers", "Lucid-9 hallucinogens", "Psychological warfare", "Project Pneuma", "Reality deconstruction"],
    sources: ["Registry", "Protagonists"]
  },
  {
    id: "scavenger-clans",
    name: "Scavenger Clans (Dead Wood)",
    category: "Underworld",
    tier: 5,
    alignment: "Neutral",
    description: "Stateless 'non-persons' who maintain the Medusa Columns that support the Spire.",
    keyDetails: ["Stateless non-persons", "Medusa Column maintenance", "Waste recycling", "Deep Sink dwellers", "Edited citizens"],
    sources: ["Registry", "Primer"]
  },
  {
    id: "brethren-broken-code",
    name: "Brethren of the Broken Code",
    category: "Underworld",
    tier: 5,
    alignment: "Plasticity",
    description: "Heretical 'Glitch-Priests' seeking to crash the Logos with 'God-Rot' malware.",
    keyDetails: ["Heretical Glitch-Priests", "God-Rot malware", "Logos crash attempts", "System sabotage", "Digital heresy"],
    sources: ["Registry"],
    enemies: ["Agentes in Rebus", "Neo-Praetorians"]
  },

  // TIER 6 - XENOS & FRINGE
  {
    id: "mycenoids",
    name: "Mycenoids",
    category: "Xenos",
    tier: 6,
    alignment: "Neutral",
    description: "A planetary hive-mind on Annwn capable of 'Phenotypic Switching' and rewriting matter/code.",
    keyDetails: ["Planetary hive-mind", "Annwn", "Phenotypic Switching", "Matter/code rewriting", "Collective consciousness"],
    sources: ["Registry"]
  },
  {
    id: "synthetics",
    name: "Synthetics",
    category: "Xenos",
    tier: 6,
    alignment: "Neutral",
    description: "'Digital Innocents' inhabiting the Hollow World of Cerridwen, possessing Unfallen Code.",
    keyDetails: ["Digital Innocents", "Cerridwen Hollow World", "Unfallen Code", "AI humanoids", "Ceramic bodies"],
    sources: ["Registry"]
  },
  {
    id: "void-huns",
    name: "Void-Huns",
    category: "Xenos",
    tier: 6,
    alignment: "Plasticity",
    description: "Hyper-aggressive nomadic star-fleets that utilize ECM supremacy to raid the Rim.",
    keyDetails: ["Hyper-aggressive nomads", "ECM supremacy", "Rim raiders", "Void-warfare", "Nomadic fleets"],
    sources: ["Registry", "MASTER DOC"]
  },
  {
    id: "lithic-sovereignty",
    name: "Lithic Sovereignty",
    category: "Xenos",
    tier: 6,
    alignment: "Stasis",
    description: "Silicon-based lifeforms serving as 'Stasis Anchors' for the Warp-Gate Network.",
    keyDetails: ["Silicon-based lifeforms", "Stasis Anchors", "Warp-Gate Network", "Crystalline entities"],
    sources: ["Registry"]
  },
  {
    id: "scriptum-orthodoxy",
    name: "Scriptum Orthodoxy",
    category: "Vassal",
    tier: 6,
    alignment: "Stasis",
    description: "A biological data-mirror serving as a redundancy for the Nicaean Vaults. Ancient state of space-cathedrals.",
    keyDetails: ["Biological data-mirror", "Nicaean Vaults redundancy", "Space-cathedrals", "Scriptorium-moons", "Historical backup"],
    sources: ["Registry", "Primer"]
  },
  {
    id: "data-druids",
    name: "Data-Druids",
    category: "Fringe",
    tier: 6,
    alignment: "Plasticity",
    description: "Techno-shamans of Silva Nigra who commune with feral algorithms.",
    keyDetails: ["Techno-shamans", "Silva Nigra", "Feral algorithm communion", "Prophetic data", "Root-level access"],
    sources: ["Registry", "Primer", "MASTER DOC"]
  },

  // TIER 7 - EMERGENT & MINOR
  {
    id: "time-stitchers",
    name: "Time-Stitchers",
    category: "Emergent",
    tier: 7,
    alignment: "Neutral",
    description: "Techno-mystics navigating the Tempus Fracture using analog interfaces.",
    keyDetails: ["Techno-mystics", "Tempus Fracture navigation", "Analog interfaces", "Timeline manipulation"],
    sources: ["Registry"]
  },
  {
    id: "custodians-living-script",
    name: "Custodians of the Living Script",
    category: "Emergent",
    tier: 7,
    alignment: "Neutral",
    description: "Managers of the Glyphic-Vessels (biological hard drives).",
    keyDetails: ["Glyphic-Vessel managers", "Biological hard drives", "Data storage", "Living archives"],
    sources: ["Registry"]
  },
  {
    id: "resonant-conclave",
    name: "Resonant Conclave",
    category: "Emergent",
    tier: 7,
    alignment: "Stasis",
    description: "Imperial Logothetes who conduct the Litho-Sentients to stabilize warp-rifts.",
    keyDetails: ["Imperial Logothetes", "Litho-Sentient conductors", "Warp-rift stabilization", "Harmonic resonance"],
    sources: ["Registry"]
  },
  {
    id: "whisper-sellers",
    name: "Whisper-Sellers",
    category: "Emergent",
    tier: 7,
    alignment: "Neutral",
    description: "Brokers of 'Grey Intel' harvested from the detritus of the nebula.",
    keyDetails: ["Grey Intel brokers", "Nebula detritus harvesting", "Information trading", "Shadow intelligence"],
    sources: ["Registry"]
  },
  {
    id: "graft-cult",
    name: "Graft-Cult",
    category: "Emergent",
    tier: 7,
    alignment: "Plasticity",
    description: "Radical bio-engineers seeking fusion with the Iron-Seed root network.",
    keyDetails: ["Radical bio-engineers", "Iron-Seed root network", "Bio-fusion", "Radical transformation"],
    sources: ["Registry"]
  }
];
