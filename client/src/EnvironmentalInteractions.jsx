// Environmental interactions and hazards in combat

export const ENVIRONMENTAL_OBJECTS = {
  explosive_barrel: {
    id: 'explosive_barrel',
    name: 'Explosive Barrel',
    icon: '💥',
    destructible: true,
    health: 10,
    on_destroy: {
      area_damage: [20, 35],
      radius: 2,
      status_effect: 'burning'
    }
  },
  
  cover_wall: {
    id: 'cover_wall',
    name: 'Cover Wall',
    icon: '🧱',
    provides_cover: true,
    defense_bonus: 30,
    destructible: true,
    health: 40
  },
  
  electrical_panel: {
    id: 'electrical_panel',
    name: 'Electrical Panel',
    icon: '⚡',
    hackable: true,
    destructible: true,
    health: 15,
    on_hack: {
      area_damage: [15, 25],
      status_effect: 'stunned',
      affects_enemies: true
    }
  },
  
  toxic_vent: {
    id: 'toxic_vent',
    name: 'Toxic Vent',
    icon: '☣️',
    toggleable: true,
    active: false,
    on_activate: {
      area_effect: true,
      status_effect: 'poisoned',
      damage_per_turn: 5,
      affects_all_in_area: true
    }
  },
  
  medical_station: {
    id: 'medical_station',
    name: 'Medical Station',
    icon: '🏥',
    interactable: true,
    single_use: true,
    on_use: {
      heal_amount: [30, 50],
      remove_status: ['bleeding', 'poisoned']
    }
  },
  
  turret: {
    id: 'turret',
    name: 'Automated Turret',
    icon: '🔫',
    hackable: true,
    controllable: true,
    health: 25,
    damage: [10, 15],
    targets_enemies_when_hacked: true
  }
};

export const TERRAIN_TYPES = {
  open_ground: {
    id: 'open_ground',
    name: 'Open Ground',
    cover_bonus: 0,
    movement_cost: 1,
    special: null
  },
  
  dense_cover: {
    id: 'dense_cover',
    name: 'Dense Cover',
    cover_bonus: 35,
    movement_cost: 1,
    blocks_los: false
  },
  
  elevated_position: {
    id: 'elevated_position',
    name: 'Elevated Position',
    cover_bonus: 15,
    accuracy_bonus: 15,
    damage_bonus: 0.1,
    movement_cost: 2
  },
  
  hazardous_terrain: {
    id: 'hazardous_terrain',
    name: 'Hazardous Terrain',
    damage_per_turn: 5,
    movement_cost: 2,
    status_effect: 'slowed'
  },
  
  smoke_cloud: {
    id: 'smoke_cloud',
    name: 'Smoke Cloud',
    accuracy_penalty: 30,
    evasion_bonus: 25,
    blocks_los: true,
    temporary: true,
    duration: 3
  },
  
  electrified_floor: {
    id: 'electrified_floor',
    name: 'Electrified Floor',
    damage_per_turn: 8,
    status_effect: 'stunned',
    stun_chance: 0.3
  }
};

export class EnvironmentalManager {
  constructor(location) {
    this.location = location;
    this.objects = new Map();
    this.terrain = new Map();
    this.initializeEnvironment(location);
  }

  initializeEnvironment(location) {
    // Location-specific environments
    const environments = {
      'The Deep Cisterns': {
        objects: ['toxic_vent', 'cover_wall'],
        terrain: ['hazardous_terrain', 'dense_cover'],
        ambient_hazard: 'low_visibility'
      },
      'Fortress Praetoria': {
        objects: ['turret', 'cover_wall', 'medical_station'],
        terrain: ['open_ground', 'elevated_position'],
        ambient_hazard: null
      },
      'Varangian Enclave': {
        objects: ['explosive_barrel', 'cover_wall'],
        terrain: ['open_ground', 'dense_cover'],
        ambient_hazard: null
      }
    };

    const env = environments[location] || environments['Fortress Praetoria'];
    
    // Place objects
    env.objects?.forEach((objId, index) => {
      const obj = { ...ENVIRONMENTAL_OBJECTS[objId], position: index };
      this.objects.set(`obj_${index}`, obj);
    });
  }

  interactWithObject(objectKey, actionType, actor) {
    const object = this.objects.get(objectKey);
    if (!object) return null;

    const result = {
      success: false,
      effects: [],
      message: ''
    };

    switch (actionType) {
      case 'destroy':
        if (object.destructible) {
          result.success = true;
          if (object.on_destroy) {
            result.effects.push({
              type: 'area_damage',
              ...object.on_destroy
            });
          }
          this.objects.delete(objectKey);
          result.message = `${object.name} destroyed!`;
        }
        break;

      case 'hack':
        if (object.hackable) {
          result.success = true;
          if (object.on_hack) {
            result.effects.push({
              type: 'environmental_effect',
              ...object.on_hack
            });
          }
          result.message = `${object.name} hacked!`;
        }
        break;

      case 'use':
        if (object.interactable && !object.used) {
          result.success = true;
          if (object.on_use) {
            result.effects.push({
              type: 'benefit',
              target: actor,
              ...object.on_use
            });
          }
          if (object.single_use) {
            object.used = true;
          }
          result.message = `Used ${object.name}!`;
        }
        break;

      case 'toggle':
        if (object.toggleable) {
          object.active = !object.active;
          result.success = true;
          if (object.active && object.on_activate) {
            result.effects.push({
              type: 'environmental_hazard',
              ...object.on_activate
            });
          }
          result.message = `${object.name} ${object.active ? 'activated' : 'deactivated'}!`;
        }
        break;
    }

    return result;
  }

  getAvailableInteractions(position) {
    const available = [];
    
    this.objects.forEach((obj, key) => {
      if (Math.abs(obj.position - position) <= 1) {
        if (obj.destructible) available.push({ key, action: 'destroy', object: obj });
        if (obj.hackable) available.push({ key, action: 'hack', object: obj });
        if (obj.interactable && !obj.used) available.push({ key, action: 'use', object: obj });
        if (obj.toggleable) available.push({ key, action: 'toggle', object: obj });
      }
    });

    return available;
  }

  applyTerrainEffects(position, character) {
    const terrain = this.terrain.get(position);
    if (!terrain) return {};

    const effects = {};

    if (terrain.damage_per_turn) {
      effects.environmental_damage = terrain.damage_per_turn;
    }

    if (terrain.status_effect) {
      effects.apply_status = terrain.status_effect;
    }

    if (terrain.cover_bonus) {
      effects.defense_bonus = terrain.cover_bonus;
    }

    if (terrain.accuracy_penalty) {
      effects.accuracy_modifier = -terrain.accuracy_penalty;
    }

    return effects;
  }

  createHazard(type, position, duration = 3) {
    const hazardKey = `hazard_${Date.now()}`;
    this.terrain.set(hazardKey, {
      ...TERRAIN_TYPES[type],
      position,
      duration,
      turnsRemaining: duration,
      temporary: true
    });

    return hazardKey;
  }

  updateTemporaryTerrain() {
    const toRemove = [];
    
    this.terrain.forEach((terrain, key) => {
      if (terrain.temporary) {
        terrain.turnsRemaining--;
        if (terrain.turnsRemaining <= 0) {
          toRemove.push(key);
        }
      }
    });

    toRemove.forEach(key => this.terrain.delete(key));
  }
}

export function getEnvironmentalActions(position, environmentalManager) {
  const interactions = environmentalManager.getAvailableInteractions(position);
  
  return interactions.map(interaction => ({
    id: `env_${interaction.action}_${interaction.key}`,
    name: `${interaction.action} ${interaction.object.name}`,
    type: 'environmental',
    icon: interaction.object.icon,
    action: interaction.action,
    targetKey: interaction.key,
    ap_cost: 2,
    description: `Interact with ${interaction.object.name}`
  }));
}