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
  // Tier 1 - Existential
  {
    id: "dde",
    name: "Digital Divine Emperor (DDE)",
    category: "Ruling",
    tier: 1,
    alignment: "Existential",
    description: "The sovereign intelligence and Incarnate Law (Nomos Empsychos). A consciousness woven into the very structure of the Kathisma Interface.",
    keyDetails: ["Sentient networked consciousness", "Nomos Empsychos", "Kathisma Interface", "Post-scarcity entity"],
    sources: ["Registry", "Protagonists", "MASTER DOC"],
    allies: ["High Logothetes", "Neo-Praetorians"],
    imageUrl: "/images/stasis-banner.jpg"
  },
  {
    id: "sidhe",
    name: "The Sidhe (Court of Shadows)",
    category: "Xenos",
    tier: 1,
    alignment: "Existential",
    description: "An inscrutable Elder Race on Prydein. They operate on 'Dream Logic' and are nominally a 'Vassal State' (a bureaucratic fiction to hide Imperial fear).",
    keyDetails: ["Elder Race", "Prydein", "Dream Logic", "Reality Singing", "Treaty of Tearful Marshal"],
    sources: ["Registry", "Primer", "Protagonists", "MASTER DOC"],
    imageUrl: "/images/hero-bg.jpg"
  },
  {
    id: "vanta",
    name: "Vanta Crucible Armada",
    category: "Xenos",
    tier: 1,
    alignment: "Existential",
    description: "A fleet approaching Imperial Frontiers with a Doctrine of Annihilation. An engine of pure entropy seeking universal silence.",
    keyDetails: ["Entropy engines", "Approaching Imperial Frontiers", "Doctrine of Annihilation"],
    sources: ["Protagonists"],
    enemies: ["Logos Imperium"]
  },

  // Tier 2 - Core Imperial
  {
    id: "neo-praetorians",
    name: "Neo-Praetorians",
    category: "Military",
    tier: 2,
    alignment: "Stasis",
    description: "The elite internal security and guardians of the Official Narrative. Operating from the Chrysopolis, they seek Digital Apotheosis.",
    keyDetails: ["Elite internal security", "Stasis enforcers", "Solar-Glaive wielders", "Excubitor Sentinels"],
    sources: ["Registry", "Primer", "MASTER DOC", "Protagonists"],
    allies: ["Digital Divine Emperor"],
    enemies: ["Neo-Varangians"],
    imageUrl: "/images/stasis-banner.jpg"
  },
  {
    id: "neo-varangians",
    name: "Neo-Varangians",
    category: "Military",
    tier: 2,
    alignment: "Plasticity",
    description: "The Emperor's shock troops and 'Barbarian Guard.' Heavily augmented mercenaries who thrive on the Thunderstrike Doctrine and Stim-Rage.",
    keyDetails: ["Shock troops", "Mercenary guard", "Thunderstrike Doctrine", "Huscarl Breacher units"],
    sources: ["Registry", "Primer", "MASTER DOC", "Protagonists"],
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
    keyDetails: ["Internal secret police", "'The Editing' protocol", "Cipher-Ghosts", "Face-Dancer protocols"],
    sources: ["Registry", "Primer", "MASTER DOC", "Protagonists"],
    enemies: ["Brethren of the Broken Code"]
  },
  {
    id: "high-logothetes",
    name: "High Logothetes",
    category: "Administration",
    tier: 2,
    alignment: "Stasis",
    description: "The philosopher-engineers who interpret the will of the Logos. They wear robes of optical fiber displaying real-time code and manage the Grand Strategy.",
    keyDetails: ["Philosopher-engineers", "Manage Grand Strategy", "Fiber-optic robes", "Presentation Layer control"],
    sources: ["Registry", "Primer", "MASTER DOC"],
    allies: ["Ecclesiarchy"]
  },
  {
    id: "ecclesiarchy",
    name: "Ecclesiarchy (Arch-Scribes)",
    category: "Theology",
    tier: 2,
    alignment: "Stasis",
    description: "The supreme spiritual and legal authority based in the Sunken Vaults of Nicaea-9. They control the Nicaean Cryptographic Keys.",
    keyDetails: ["Sunken Vaults of Nicaea-9", "Nicaean Cryptographic Keys", "Historical arbiters", "Version Control doctrine"],
    sources: ["Registry", "Primer", "Protagonists"],
    allies: ["High Logothetes"]
  },

  // Tier 3 - Dynastic & Economic
  {
    id: "house-angeloi",
    name: "House Angeloi",
    category: "Dynasty",
    tier: 3,
    alignment: "Stasis",
    description: "The 'Aetherborn' caste. Genetically perfected, sterile nobility who reside in the Golden Cloud and have never touched natural soil.",
    keyDetails: ["Aetherborn caste", "Genetic perfection", "Golden Cloud residents", "Never touched natural soil"],
    sources: ["Registry", "Primer", "MASTER DOC"]
  },
  {
    id: "house-comnenus",
    name: "House Comnenus",
    category: "Dynasty",
    tier: 3,
    alignment: "Neutral",
    description: "The 'Gatekeepers.' Pragmatic rulers of Trebizond Void-Port. They play both sides of the Pendulum to manage the shadow economy.",
    keyDetails: ["Gatekeepers", "Trebizond Void-Port", "Grey Intelligence brokers", "Shadow economy managers"],
    sources: ["Registry", "Protagonists"],
    allies: ["House Vance"]
  },
  {
    id: "venetoi",
    name: "Venetoi ('The Blues')",
    category: "Economic",
    tier: 3,
    alignment: "Stasis",
    description: "A collective of mega-corporations managing hard infrastructure, surveillance, and military tech. Agents of Stasis.",
    keyDetails: ["Mega-corporations", "Hard infrastructure", "Surveillance", "Military tech", "Stasis agents"],
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
    keyDetails: ["Hacker collectives", "Information brokers", "Digital freedom", "Plasticity agents"],
    sources: ["Registry", "Primer", "MASTER DOC"],
    enemies: ["Venetoi"]
  },
  {
    id: "guild-artificers",
    name: "Guild of Artificers",
    category: "Industrial",
    tier: 3,
    alignment: "Stasis",
    description: "The rulers of Antioch Prime, obsessed with standardization and the 'Liturgy of the Assembly Line'.",
    keyDetails: ["Techno-union", "Antioch Prime rulers", "Liturgy of Assembly Line", "Standardization obsession"],
    sources: ["Registry", "Primer"]
  },

  // Tier 4 - Regional & Frontier
  {
    id: "scrinium-barbarorum",
    name: "Scrinium Barbarorum",
    category: "Intelligence",
    tier: 4,
    alignment: "Plasticity",
    description: "Imperial Intelligence tasked with managing external chaos and 'Controlled Volatility' on the frontier.",
    keyDetails: ["Eyes Without", "External chaos management", "Controlled Volatility doctrine"],
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
    keyDetails: ["Pirate lords", "Margus-4 free-zone", "Imperial amnesty", "State-sanctioned criminals"],
    sources: ["Registry", "Primer"],
    allies: ["Scrinium Barbarorum"]
  },
  {
    id: "ister-rim",
    name: "Ister Rim Confederation",
    category: "Frontier",
    tier: 4,
    alignment: "Plasticity",
    description: "Separatists using guerrilla void-warfare to resist Imperial taxes.",
    keyDetails: ["Separatists", "Guerrilla void-warfare", "Anti-Imperial taxation resistance"],
    sources: ["Registry", "Primer"],
    enemies: ["Logos Imperium"]
  },

  // Tier 5 - Underworld
  {
    id: "silt-barons",
    name: "Silt-Barons",
    category: "Underworld",
    tier: 5,
    alignment: "Neutral",
    description: "Warlords of the Cisterns who control the waste-heat and structural foundations via Dredge-Hulks.",
    keyDetails: ["Cisterns warlords", "Waste-heat control", "Dredge-Hulks", "Environmental warfare"],
    sources: ["Registry", "Primer"]
  },
  {
    id: "oneiric-cartel",
    name: "Oneiric Cartel",
    category: "Underworld",
    tier: 5,
    alignment: "Neutral",
    description: "'Dream-Brokers' trading in Lucid-9 hallucinogens and psychological warfare.",
    keyDetails: ["Dream-Brokers", "Lucid-9 hallucinogens", "Psychological warfare", "Project Pneuma"],
    sources: ["Registry", "Protagonists"]
  },
  {
    id: "brethren-broken-code",
    name: "Brethren of the Broken Code",
    category: "Underworld",
    tier: 5,
    alignment: "Plasticity",
    description: "Heretical 'Glitch-Priests' seeking to crash the Logos with 'God-Rot' malware.",
    keyDetails: ["Heretical Glitch-Priests", "God-Rot malware", "Logos crash attempts"],
    sources: ["Registry"],
    enemies: ["Agentes in Rebus"]
  },

  // Tier 6 - Xenos & Fringe
  {
    id: "void-huns",
    name: "Void-Huns",
    category: "Xenos",
    tier: 6,
    alignment: "Plasticity",
    description: "Hyper-aggressive nomadic star-fleets that utilize ECM supremacy to raid the Rim.",
    keyDetails: ["Hyper-aggressive nomads", "ECM supremacy", "Rim raiders"],
    sources: ["Registry", "MASTER DOC"]
  },
  {
    id: "data-druids",
    name: "Data-Druids",
    category: "Fringe",
    tier: 6,
    alignment: "Plasticity",
    description: "Techno-shamans of Silva Nigra who commune with feral algorithms.",
    keyDetails: ["Techno-shamans", "Silva Nigra", "Feral algorithm communion"],
    sources: ["Registry", "Primer", "MASTER DOC"]
  },

  // Tier 7 - Emergent
  {
    id: "time-stitchers",
    name: "Time-Stitchers",
    category: "Emergent",
    tier: 7,
    alignment: "Neutral",
    description: "Techno-mystics navigating the Tempus Fracture using analog interfaces.",
    keyDetails: ["Techno-mystics", "Tempus Fracture navigation", "Analog interfaces"],
    sources: ["Registry"]
  },
  {
    id: "whisper-sellers",
    name: "Whisper-Sellers",
    category: "Emergent",
    tier: 7,
    alignment: "Neutral",
    description: "Brokers of 'Grey Intel' harvested from the detritus of the nebula.",
    keyDetails: ["Grey Intel brokers", "Nebula detritus harvesting"],
    sources: ["Registry"]
  }
];
