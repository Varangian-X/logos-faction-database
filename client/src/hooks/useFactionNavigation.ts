import { useEffect, useCallback } from "react";
import { Faction } from "@/lib/factions";

export function useFactionNavigation(
  filteredFactions: Faction[],
  selectedFactionId: string | null,
  onSelectFaction: (id: string) => void
) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (filteredFactions.length === 0) return;

      const currentIndex = filteredFactions.findIndex(
        (f) => f.id === selectedFactionId
      );

      let nextIndex = currentIndex;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          nextIndex = currentIndex === -1 ? 0 : Math.min(currentIndex + 1, filteredFactions.length - 1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          nextIndex = currentIndex === -1 ? filteredFactions.length - 1 : Math.max(currentIndex - 1, 0);
          break;
        case "Home":
          e.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          e.preventDefault();
          nextIndex = filteredFactions.length - 1;
          break;
        default:
          return;
      }

      if (nextIndex !== currentIndex || selectedFactionId === null) {
        onSelectFaction(filteredFactions[nextIndex].id);
      }
    },
    [filteredFactions, selectedFactionId, onSelectFaction]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

export function exportFactionToPDF(faction: Faction): void {
  // Create a simple HTML representation
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${faction.name}</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          background: #050505;
          color: #F5F5F5;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          border-bottom: 2px solid #D4AF37;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        h1 {
          color: #D4AF37;
          margin: 0;
          font-size: 32px;
        }
        .meta {
          display: flex;
          gap: 20px;
          margin-top: 10px;
          font-size: 12px;
          color: #888;
        }
        .badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: bold;
          margin-right: 8px;
        }
        .stasis { background: #D4AF37; color: #000; }
        .plasticity { background: #FF3333; color: #fff; }
        .neutral { background: #666; color: #fff; }
        .existential { background: #00E5FF; color: #000; }
        
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          color: #D4AF37;
          font-size: 14px;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 12px;
          border-left: 3px solid #D4AF37;
          padding-left: 10px;
        }
        .description {
          line-height: 1.6;
          margin-bottom: 20px;
          font-style: italic;
        }
        .details-list {
          list-style: none;
          padding: 0;
        }
        .details-list li {
          padding: 8px 0;
          border-bottom: 1px solid #333;
        }
        .details-list li:before {
          content: "▸ ";
          color: #D4AF37;
          margin-right: 8px;
        }
        .relations {
          display: flex;
          gap: 30px;
        }
        .relation-group {
          flex: 1;
        }
        .relation-group h4 {
          color: #D4AF37;
          font-size: 12px;
          margin-bottom: 8px;
        }
        .relation-list {
          list-style: none;
          padding: 0;
          font-size: 12px;
        }
        .relation-list li {
          padding: 4px 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #333;
          font-size: 10px;
          color: #666;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${faction.name}</h1>
        <div class="meta">
          <span class="badge ${faction.alignment.toLowerCase()}">${faction.alignment}</span>
          <span>TIER ${faction.tier}</span>
          <span>${faction.category}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Overview</div>
        <p class="description">${faction.description}</p>
      </div>

      <div class="section">
        <div class="section-title">System Data</div>
        <ul class="details-list">
          ${faction.keyDetails.map((detail) => `<li>${detail}</li>`).join("")}
        </ul>
      </div>

      ${
        faction.allies || faction.enemies
          ? `
        <div class="section">
          <div class="section-title">Relations</div>
          <div class="relations">
            ${
              faction.allies
                ? `
              <div class="relation-group">
                <h4>Allies</h4>
                <ul class="relation-list">
                  ${faction.allies.map((a) => `<li>• ${a}</li>`).join("")}
                </ul>
              </div>
            `
                : ""
            }
            ${
              faction.enemies
                ? `
              <div class="relation-group">
                <h4>Hostiles</h4>
                <ul class="relation-list">
                  ${faction.enemies.map((e) => `<li>• ${e}</li>`).join("")}
                </ul>
              </div>
            `
                : ""
            }
          </div>
        </div>
      `
          : ""
      }

      <div class="section">
        <div class="section-title">Sources</div>
        <p style="font-size: 12px; color: #888;">
          ${faction.sources.map((s) => `REF: ${s.toUpperCase()}`).join(" • ")}
        </p>
      </div>

      <div class="footer">
        <p>Logos Imperium Faction Database • Generated on ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `;

  // Create a blob and download
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${faction.name.replace(/\s+/g, "_")}_Faction_Profile.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
