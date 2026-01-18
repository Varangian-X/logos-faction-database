import { SavedScenario } from "@/contexts/CampaignContext";
import { jsPDF } from "jspdf";
import { format } from "date-fns";

interface CampaignEntity {
  name: string;
  type: 'faction' | 'npc';
  role: string;
  appearances: number;
}

interface Relationship {
  source: string;
  target: string;
  type: 'ally' | 'enemy' | 'neutral' | 'involved';
  strength: number; // 1-5
}

const extractEntitiesFromScenarios = (scenarios: SavedScenario[]): CampaignEntity[] => {
  const entities = new Map<string, CampaignEntity>();
  
  scenarios.forEach(scenario => {
    // Add faction
    const factionKey = `faction-${scenario.faction}`;
    if (!entities.has(factionKey)) {
      entities.set(factionKey, {
        name: scenario.faction,
        type: 'faction',
        role: 'Controlling Faction',
        appearances: 0
      });
    }
    const factionEntity = entities.get(factionKey)!;
    factionEntity.appearances += 1;
    
    // Extract NPCs from description and objectives
    const textToAnalyze = `${scenario.description} ${scenario.objectives.join(' ')} ${scenario.complications.join(' ')}`;
    
    // Simple NPC extraction - look for capitalized names
    const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:the|of|and)\s+[A-Z][a-z]+)*)/g;
    const matches = textToAnalyze.match(namePattern) || [];
    
    matches.forEach(match => {
      // Filter out common words and faction names
      if (!['The', 'A', 'An', 'And', 'Or', 'But', 'In', 'On', 'At', 'To', 'From', 'With', 'By', 'For'].includes(match) &&
          !scenario.faction.includes(match)) {
        const npcKey = `npc-${match}`;
        if (!entities.has(npcKey)) {
          entities.set(npcKey, {
            name: match,
            type: 'npc',
            role: 'Key NPC',
            appearances: 0
          });
        }
        const npcEntity = entities.get(npcKey)!;
        npcEntity.appearances += 1;
      }
    });
  });
  
  return Array.from(entities.values())
    .sort((a, b) => b.appearances - a.appearances)
    .slice(0, 30); // Limit to top 30 entities
};

const extractRelationships = (scenarios: SavedScenario[]): Relationship[] => {
  const relationships = new Map<string, Relationship>();
  
  scenarios.forEach(scenario => {
    // Extract entities from this scenario
    const textToAnalyze = `${scenario.description} ${scenario.objectives.join(' ')} ${scenario.complications.join(' ')}`;
    const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:the|of|and)\s+[A-Z][a-z]+)*)/g;
    const matches = textToAnalyze.match(namePattern) || [];
    
    const entities = new Set<string>();
    entities.add(scenario.faction);
    
    matches.forEach(match => {
      if (!['The', 'A', 'An', 'And', 'Or', 'But', 'In', 'On', 'At', 'To', 'From', 'With', 'By', 'For'].includes(match) &&
          !scenario.faction.includes(match)) {
        entities.add(match);
      }
    });
    
    // Create relationships between entities in this scenario
    const entitiesArray = Array.from(entities);
    for (let i = 0; i < entitiesArray.length; i++) {
      for (let j = i + 1; j < entitiesArray.length; j++) {
        const source = entitiesArray[i];
        const target = entitiesArray[j];
        const key = [source, target].sort().join('--');
        
        // Determine relationship type based on scenario type
        let relType: 'ally' | 'enemy' | 'neutral' | 'involved' = 'involved';
        if (scenario.type === 'Combat') {
          relType = 'enemy';
        } else if (scenario.type === 'Diplomacy') {
          relType = 'ally';
        }
        
        if (!relationships.has(key)) {
          relationships.set(key, {
            source: source < target ? source : target,
            target: source < target ? target : source,
            type: relType,
            strength: 1
          });
        } else {
          const rel = relationships.get(key)!;
          rel.strength = Math.min(5, rel.strength + 1);
        }
      }
    }
  });
  
  return Array.from(relationships.values())
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 20); // Limit to top 20 relationships
};

const generateRelationshipMapImage = (relationships: Relationship[], entities: CampaignEntity[]): string => {
  // Create a canvas-based relationship map
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Background
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Calculate positions for entities using simple force-directed layout
  const positions = new Map<string, { x: number; y: number }>();
  const topEntities = entities.slice(0, 15);
  
  topEntities.forEach((entity, index) => {
    const angle = (index / topEntities.length) * Math.PI * 2;
    const radius = 200;
    positions.set(entity.name, {
      x: canvas.width / 2 + Math.cos(angle) * radius,
      y: canvas.height / 2 + Math.sin(angle) * radius
    });
  });
  
  // Draw relationships (lines)
  relationships.forEach(rel => {
    const sourcePos = positions.get(rel.source);
    const targetPos = positions.get(rel.target);
    
    if (sourcePos && targetPos) {
      ctx.strokeStyle = rel.type === 'enemy' ? '#ff4444' : rel.type === 'ally' ? '#44ff44' : '#ffaa44';
      ctx.lineWidth = rel.strength;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  });
  
  // Draw entities (nodes)
  topEntities.forEach(entity => {
    const pos = positions.get(entity.name);
    if (pos) {
      const radius = 20 + (entity.appearances * 3);
      
      // Node circle
      ctx.fillStyle = entity.type === 'faction' ? '#d4af37' : '#4488ff';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Node border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Label
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const shortName = entity.name.length > 15 ? entity.name.substring(0, 12) + '...' : entity.name;
      ctx.fillText(shortName, pos.x, pos.y);
    }
  });
  
  return canvas.toDataURL('image/png');
};

export const exportCampaignToJSON = (scenarios: SavedScenario[]) => {
  const dataStr = JSON.stringify(scenarios, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `logos-campaign-log-${format(new Date(), 'yyyy-MM-dd')}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const exportCampaignToPDF = (scenarios: SavedScenario[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;
  
  // Extract entities for Dramatis Personae
  const entities = extractEntitiesFromScenarios(scenarios);
  
  // Extract relationships
  const relationships = extractRelationships(scenarios);
  
  // Generate relationship map image
  const relationshipMapImage = generateRelationshipMapImage(relationships, entities);

  // Title Page
  doc.setFillColor(5, 5, 5); // Black background
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(212, 175, 55); // Gold text
  doc.setFont("times", "bold");
  doc.setFontSize(32);
  doc.text("LOGOS IMPERIUM", pageWidth / 2, pageHeight / 2 - 20, { align: "center" });
  
  doc.setFontSize(16);
  doc.setFont("courier", "normal");
  doc.text("CAMPAIGN LOG ARCHIVE", pageWidth / 2, pageHeight / 2, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(`EXPORT DATE: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, pageWidth / 2, pageHeight / 2 + 20, { align: "center" });
  doc.text(`TOTAL MISSIONS: ${scenarios.length}`, pageWidth / 2, pageHeight / 2 + 28, { align: "center" });

  doc.addPage();

  // Dramatis Personae Page
  doc.setFillColor(5, 5, 5);
  doc.rect(0, yPos - 10, pageWidth, pageHeight - (yPos - 10), 'F');
  
  doc.setTextColor(212, 175, 55);
  doc.setFont("times", "bold");
  doc.setFontSize(20);
  doc.text("DRAMATIS PERSONAE", pageWidth / 2, yPos, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont("courier", "normal");
  doc.text(`KEY ACTORS IN THIS CAMPAIGN // ${entities.length} ENTITIES IDENTIFIED`, pageWidth / 2, yPos + 10, { align: "center" });
  
  yPos += 25;
  
  // Factions Section
  const factions = entities.filter(e => e.type === 'faction');
  if (factions.length > 0) {
    doc.setTextColor(212, 175, 55);
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.text("FACTIONS", margin, yPos);
    yPos += 8;
    
    factions.forEach(faction => {
      doc.setTextColor(255, 255, 255);
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.text(`${faction.name}`, margin + 5, yPos);
      
      doc.setFont("courier", "normal");
      doc.setFontSize(8);
      doc.setTextColor(200, 200, 200);
      doc.text(`Appearances: ${faction.appearances}`, margin + 80, yPos);
      
      yPos += 6;
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
      }
    });
    yPos += 5;
  }
  
  // NPCs Section
  const npcs = entities.filter(e => e.type === 'npc');
  if (npcs.length > 0) {
    doc.setTextColor(212, 175, 55);
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.text("KEY NPCS & ENTITIES", margin, yPos);
    yPos += 8;
    
    npcs.forEach(npc => {
      doc.setTextColor(255, 255, 255);
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.text(`${npc.name}`, margin + 5, yPos);
      
      doc.setFont("courier", "normal");
      doc.setFontSize(8);
      doc.setTextColor(200, 200, 200);
      doc.text(`Appearances: ${npc.appearances}`, margin + 80, yPos);
      
      yPos += 6;
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
      }
    });
  }
  
  doc.addPage();
  yPos = margin;
  
  // Relationship Map Page
  doc.setFillColor(5, 5, 5);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(212, 175, 55);
  doc.setFont("times", "bold");
  doc.setFontSize(20);
  doc.text("RELATIONSHIP MAP", pageWidth / 2, yPos, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont("courier", "normal");
  doc.text(`CONNECTIONS BETWEEN KEY ACTORS // ${relationships.length} RELATIONSHIPS IDENTIFIED`, pageWidth / 2, yPos + 10, { align: "center" });
  
  // Add relationship map image
  if (relationshipMapImage) {
    doc.addImage(relationshipMapImage, 'PNG', margin, yPos + 20, pageWidth - (margin * 2), pageHeight - (yPos + 60));
  }
  
  // Legend
  yPos = pageHeight - 30;
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text('Legend: Gold = Faction | Blue = NPC | Red Line = Enemy | Green Line = Ally | Orange Line = Involved', margin, yPos);
  
  doc.addPage();
  yPos = margin;

  // Content Pages
  scenarios.forEach((scenario, index) => {
    // Check if we need a new page
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = margin;
    }

    // Header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 10, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.text(`MISSION #${scenarios.length - index}: ${scenario.title.toUpperCase()}`, margin + 2, yPos + 7);
    
    yPos += 18;

    // Metadata
    doc.setTextColor(50, 50, 50);
    doc.setFont("courier", "normal");
    doc.setFontSize(9);
    doc.text(`LOCATION: ${scenario.location}`, margin, yPos);
    doc.text(`FACTION:  ${scenario.faction}`, margin + 80, yPos);
    yPos += 5;
    doc.text(`YEAR:     ${scenario.year} AD`, margin, yPos);
    doc.text(`TYPE:     ${scenario.type}`, margin + 80, yPos);
    yPos += 10;

    // Description
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    const splitDesc = doc.splitTextToSize(scenario.description, pageWidth - (margin * 2));
    doc.text(splitDesc, margin, yPos);
    yPos += (splitDesc.length * 5) + 5;

    // Objectives
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.setTextColor(212, 175, 55); // Gold
    doc.text("OBJECTIVES:", margin, yPos);
    yPos += 5;
    doc.setFont("times", "normal");
    doc.setTextColor(0, 0, 0);
    scenario.objectives.forEach(obj => {
      doc.text(`• ${obj}`, margin + 5, yPos);
      yPos += 5;
    });
    yPos += 2;

    // Complications
    doc.setFont("times", "bold");
    doc.setTextColor(200, 50, 50); // Red
    doc.text("COMPLICATIONS:", margin, yPos);
    yPos += 5;
    doc.setFont("times", "normal");
    doc.setTextColor(0, 0, 0);
    scenario.complications.forEach(comp => {
      doc.text(`• ${comp}`, margin + 5, yPos);
      yPos += 5;
    });
    yPos += 2;

    // Rewards
    doc.setFont("times", "bold");
    doc.setTextColor(50, 100, 200); // Blue
    doc.text("REWARDS:", margin, yPos);
    yPos += 5;
    doc.setFont("times", "normal");
    doc.setTextColor(0, 0, 0);
    const rewardsStr = scenario.rewards.join(", ");
    const splitRewards = doc.splitTextToSize(rewardsStr, pageWidth - (margin * 2) - 5);
    doc.text(splitRewards, margin + 5, yPos);
    yPos += (splitRewards.length * 5) + 5;

    // Notes
    if (scenario.notes) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPos, pageWidth - (margin * 2), 20, 'F');
      doc.setFont("courier", "normal");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text("GM NOTES:", margin + 2, yPos + 5);
      
      const splitNotes = doc.splitTextToSize(scenario.notes, pageWidth - (margin * 2) - 4);
      doc.text(splitNotes, margin + 2, yPos + 10);
      yPos += Math.max(25, (splitNotes.length * 4) + 15);
    } else {
      yPos += 10;
    }

    // Separator
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
  });

  doc.save(`logos-campaign-log-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
