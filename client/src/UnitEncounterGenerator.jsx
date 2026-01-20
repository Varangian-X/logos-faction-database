// Generate appropriate unit encounters based on location, faction relations, and game state

import { imperialUnitTypes, getRandomFactionUnit, getFactionUnits } from './ImperialUnitTypes';

// Determine which units might appear based on game state
export function generateUnitEncounter(gameState, location, triggeredBy = 'explore') {
  const factionRelations = gameState.faction_relations || {};
  const reputation = gameState.reputation || 50;
  const turn = gameState.turn_number || 1;
  
  // Determine threat level based on progression
  const threatLevel = Math.min(5, Math.floor(turn / 10) + 1);
  
  // Check for hostile factions
  const hostileFactions = Object.entries(factionRelations)
    .filter(([faction, standing]) => standing < -20)
    .map(([faction]) => faction);
  
  // Determine encounter type
  let encounterPool = [];
  
  // Hostile faction units have priority
  if (hostileFactions.length > 0) {
    const randomHostileFaction = hostileFactions[Math.floor(Math.random() * hostileFactions.length)];
    const factionUnits = getFactionUnits(randomHostileFaction);
    
    if (factionUnits.length > 0) {
      encounterPool = factionUnits;
    }
  }
  
  // Location-based encounters
  if (encounterPool.length === 0) {
    if (location.includes('Chrysopolis')) {
      encounterPool = [
        imperialUnitTypes.cataphract_gilded,
        imperialUnitTypes.excubitor_sentinel
      ];
    } else if (location.includes('Cisterns')) {
      encounterPool = [
        imperialUnitTypes.glitch_berserker,
        imperialUnitTypes.cipher_ghost,
        imperialUnitTypes.huscarl_breacher
      ];
    } else if (location.includes('Cathedral') || location.includes('Shrine')) {
      encounterPool = [
        imperialUnitTypes.algorithm_paladin,
        imperialUnitTypes.excubitor_sentinel
      ];
    } else if (location.includes('Market') || location.includes('Trade')) {
      encounterPool = [
        imperialUnitTypes.debt_enforcer,
        imperialUnitTypes.cipher_ghost
      ];
    } else {
      // Default pool - mix of common units
      encounterPool = [
        imperialUnitTypes.huscarl_breacher,
        imperialUnitTypes.cipher_ghost,
        imperialUnitTypes.excubitor_sentinel
      ];
    }
  }
  
  // Select unit
  const selectedUnit = encounterPool[Math.floor(Math.random() * encounterPool.length)];
  
  if (!selectedUnit) {
    return null;
  }
  
  // Find unit key
  const unitKey = Object.entries(imperialUnitTypes).find(([key, unit]) => 
    unit.name === selectedUnit.name
  )?.[0];
  
  // Scale health based on threat level
  const scaledHealth = Math.floor(selectedUnit.maxHealth * (1 + (threatLevel - 1) * 0.2));
  
  return {
    unitType: unitKey,
    name: selectedUnit.name,
    description: selectedUnit.description,
    health: scaledHealth,
    faction: selectedUnit.faction,
    threatLevel
  };
}

// Generate flavor text for unit encounter
export function getEncounterFlavorText(unit, location) {
  const flavorTexts = {
    excubitor_sentinel: [
      'A golden colossus steps from the shadows. Seven feet of silent, psycho-conditioned death.',
      'The polished faceplate reflects your own terrified expression. The Sentinel does not speak.',
      'Hydraulic joints hiss. The Solar-Glaive ignites with plasma heat. This will not be easy.'
    ],
    huscarl_breacher: [
      'The stench hits first: animal musk, ozone, old blood. Then the roar.',
      'Pneumatic pistons hiss along massive limbs. The Huscarl revs their chain-axe with anticipation.',
      'A Varangian berserker blocks your path. They smile, exposing chrome teeth. "Finally, worthy prey."'
    ],
    cipher_ghost: [
      'Movement in your peripheral vision. When you turn, nothing. When you blink—they\'re closer.',
      'The air shimmers. A glitch-mask flickers between faces: your mother, your mentor, your fear.',
      'An Agentes operative materializes from active camouflage. The neural-needler is already aimed.'
    ],
    cataphract_gilded: [
      'Twelve feet of gilded perfection strides into view. The pilot looks down with bored contempt.',
      'The Volkite Culverin hums to life. You\'ve seen what it does to flesh. You don\'t want to see it again.',
      'A Cataphract-Gilded. Each one is worth more than your entire House. The pilot doesn\'t care.'
    ],
    scalpel_wraith: [
      'The smell of antiseptic and copper blood announces their presence before they float into view.',
      'Surgical manipulators twitch with autonomous anticipation. The Scalpel-Wraith regards you as... material.',
      'A low-frequency hum induces immediate nausea. The Wraith drifts closer, evaluating harvest potential.'
    ],
    algorithm_paladin: [
      'Holy scripture made manifest. The Paladin\'s armor glows with divine algorithms.',
      'They speak not with voice but with broadcasted prayer. The Firewall aura shimmers around them.',
      'A warrior of the Ecclesiarchy bars your path. Their faith is a weapon sharper than any blade.'
    ],
    glitch_berserker: [
      'The thing that was once human twitches toward you. Corrupted code pulses through necrotic flesh.',
      'Red sparks cascade from failing augmentations. You realize with horror—it\'s still screaming.',
      'A Glitch-Berserker. The God-Rot has already claimed them. Now it wants you.'
    ],
    debt_enforcer: [
      'The automaton\'s optical sensors scan you, calculating net worth to the credit. You are... acceptable collateral.',
      'Merciless. Incorruptible. The Debt-Collector\'s voice is emotionless: "Payment is due."',
      'Banking algorithms made combat-ready. It doesn\'t want to kill you. It wants to repossess you.'
    ],
    xeno_analyzer: [
      'Strange symbols flicker across their armor. Xenotech you don\'t recognize—can\'t recognize.',
      'The Xeno-Analyst tilts their head at an inhuman angle. They\'ve studied the unknowable. Now they test it.',
      'Alien frequencies buzz in your teeth. The Scrinium operative speaks in translated nightmares.'
    ]
  };
  
  const texts = flavorTexts[unit.unitType] || [
    `A hostile ${unit.name} blocks your path. Combat is inevitable.`
  ];
  
  return texts[Math.floor(Math.random() * texts.length)];
}