import { SavedScenario } from "@/contexts/CampaignContext";
import { jsPDF } from "jspdf";
import { format } from "date-fns";

interface CampaignEntity {
  name: string;
  type: 'faction' | 'npc';
  role: string;
  appearances: number;
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
