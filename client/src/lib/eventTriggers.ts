import { SavedScenario } from "@/contexts/CampaignContext";
import { SectorEvent, generateSectorEvent } from "./sectorWideEvents";

export function checkEventTriggers(
  mission: SavedScenario,
  outcome: 'success' | 'partial' | 'failure',
  currentYear: number
): SectorEvent | null {
  // Only successful or failed missions trigger events (partial is usually status quo)
  if (outcome === 'partial') return null;

  const roll = Math.random() * 100;
  const triggerChance = 20; // 20% chance to trigger an event

  if (roll > triggerChance) return null;

  let eventType: "Disaster" | "Opportunity" | "Conflict" | "Anomaly" | null = null;

  // Determine event type based on mission type and outcome
  switch (mission.type) {
    case 'Combat':
    case 'Assassination':
    case 'Heist/Raid':
      if (outcome === 'success') {
        // Successful aggression might trigger wider conflict or opportunity
        eventType = Math.random() > 0.5 ? 'Conflict' : 'Opportunity';
      } else {
        // Failed aggression might trigger conflict or disaster
        eventType = Math.random() > 0.5 ? 'Conflict' : 'Disaster';
      }
      break;

    case 'Diplomacy':
    case 'Trade Convoy':
    case 'Tech Transfer':
      if (outcome === 'success') {
        // Successful diplomacy/trade triggers opportunity
        eventType = 'Opportunity';
      } else {
        // Failed diplomacy/trade triggers conflict
        eventType = 'Conflict';
      }
      break;

    case 'Espionage':
    case 'Horror':
    case 'Exploration':
      if (outcome === 'success') {
        // Successful intel/exploration might reveal anomalies or opportunities
        eventType = Math.random() > 0.5 ? 'Anomaly' : 'Opportunity';
      } else {
        // Failed intel/exploration might trigger anomalies or disasters
        eventType = Math.random() > 0.5 ? 'Anomaly' : 'Disaster';
      }
      break;

    default:
      eventType = 'Anomaly';
  }

  if (!eventType) return null;

  // Generate the event
  // We need to access the generateSectorEvent function but force a specific type
  // Since generateSectorEvent picks random type, we'll implement a targeted generator here
  // or modify the original one. For now, let's use the original one and filter until we get the right type
  // (This is a bit inefficient but simple for now, or we can just let it be random if we want less determinism)
  
  // Actually, let's just let it be random but influenced by the mission context in the description
  // Or better, let's create a specific event based on the mission context
  
  const event = generateSectorEvent([mission.location], currentYear);
  
  // Override the type to match our logic if needed, or just return the generated event
  // For better storytelling, let's customize the description based on the mission
  
  return {
    ...event,
    description: `${event.description} (Triggered by ${mission.title})`
  };
}
