import { FactionResources } from "./factionDynamics";

export interface ShipClass {
  id: string;
  name: string;
  type: "Corvette" | "Frigate" | "Destroyer" | "Cruiser" | "Battleship" | "Carrier" | "Dreadnought";
  cost: FactionResources;
  maintenance: FactionResources;
  combatPower: number;
  speed: number;
  cargoCapacity: number;
  description: string;
}

export interface Fleet {
  id: string;
  name: string;
  owner: string;
  location: string; // Sector ID
  ships: { shipClassId: string; count: number }[];
  status: "Idle" | "Patrolling" | "Moving" | "In Combat" | "Repairing";
  destination?: string;
  admiral?: string; // Governor ID
}

export const SHIP_CLASSES: ShipClass[] = [
  {
    id: "corvette_class",
    name: "Velox-Class Corvette",
    type: "Corvette",
    cost: { credits: 50, tech: 10, manpower: 20 },
    maintenance: { credits: 5, tech: 1, manpower: 5 },
    combatPower: 10,
    speed: 5,
    cargoCapacity: 50,
    description: "Fast, lightly armed patrol vessel. Ideal for scouting and anti-piracy.",
  },
  {
    id: "frigate_class",
    name: "Gladius-Class Frigate",
    type: "Frigate",
    cost: { credits: 100, tech: 25, manpower: 50 },
    maintenance: { credits: 10, tech: 2, manpower: 10 },
    combatPower: 25,
    speed: 4,
    cargoCapacity: 100,
    description: "Versatile escort ship with balanced weaponry and defenses.",
  },
  {
    id: "destroyer_class",
    name: "Hammer-Class Destroyer",
    type: "Destroyer",
    cost: { credits: 200, tech: 50, manpower: 100 },
    maintenance: { credits: 20, tech: 5, manpower: 20 },
    combatPower: 60,
    speed: 3,
    cargoCapacity: 150,
    description: "Heavy weapons platform designed to hunt capital ships.",
  },
  {
    id: "cruiser_class",
    name: "Aegis-Class Cruiser",
    type: "Cruiser",
    cost: { credits: 400, tech: 100, manpower: 250 },
    maintenance: { credits: 40, tech: 10, manpower: 50 },
    combatPower: 150,
    speed: 3,
    cargoCapacity: 300,
    description: "The backbone of any battlefleet. Durable and powerful.",
  },
  {
    id: "battleship_class",
    name: "Imperator-Class Battleship",
    type: "Battleship",
    cost: { credits: 1000, tech: 300, manpower: 800 },
    maintenance: { credits: 100, tech: 30, manpower: 150 },
    combatPower: 500,
    speed: 2,
    cargoCapacity: 500,
    description: "Massive capital ship capable of dominating entire sectors.",
  },
];

export function calculateFleetPower(fleet: Fleet): number {
  let power = 0;
  fleet.ships.forEach(stack => {
    const shipClass = SHIP_CLASSES.find(s => s.id === stack.shipClassId);
    if (shipClass) {
      power += shipClass.combatPower * stack.count;
    }
  });
  return power;
}

export function createFleet(name: string, owner: string, location: string): Fleet {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    owner,
    location,
    ships: [],
    status: "Idle",
  };
}
