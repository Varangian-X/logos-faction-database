import { useState, useMemo } from "react";
import { factions, FactionAlignment, FactionTier } from "@/lib/factions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FactionNetwork } from "@/components/FactionNetwork";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NetworkPage() {
  const [selectedFactionId, setSelectedFactionId] = useState<string | null>(null);
  const [selectedAlignments, setSelectedAlignments] = useState<FactionAlignment[]>([]);
  const [selectedTiers, setSelectedTiers] = useState<FactionTier[]>([]);

  const selectedFaction = useMemo(
    () => factions.find(f => f.id === selectedFactionId),
    [selectedFactionId]
  );

  const toggleAlignment = (alignment: FactionAlignment) => {
    setSelectedAlignments(prev =>
      prev.includes(alignment)
        ? prev.filter(a => a !== alignment)
        : [...prev, alignment]
    );
  };

  const toggleTier = (tier: FactionTier) => {
    setSelectedTiers(prev =>
      prev.includes(tier)
        ? prev.filter(t => t !== tier)
        : [...prev, tier]
    );
  };

  return (
    <div className="h-screen w-full bg-[#050505] text-white overflow-hidden flex flex-col font-sans">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-black/60 backdrop-blur-md px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-serif tracking-widest text-[#D4AF37]">FACTION NETWORK</h1>
            <p className="text-[10px] font-mono text-white/50 tracking-[0.2em] uppercase">Relationship Graph // Real-time Visualization</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Graph */}
        <div className="flex-1 flex flex-col p-4">
          <FactionNetwork
            onNodeClick={setSelectedFactionId}
            highlightedFactionId={selectedFactionId}
            selectedAlignments={selectedAlignments}
            selectedTiers={selectedTiers}
          />
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-white/10 bg-black/40 backdrop-blur-sm flex flex-col overflow-hidden">
          {/* Filters */}
          <div className="p-6 space-y-4 shrink-0 border-b border-white/10">
            <div>
              <h3 className="text-xs font-mono text-[#D4AF37] uppercase mb-3">Alignment Filter</h3>
              <div className="flex flex-wrap gap-2">
                {(["Stasis", "Plasticity", "Neutral", "Existential"] as FactionAlignment[]).map(alignment => (
                  <Button
                    key={alignment}
                    variant={selectedAlignments.includes(alignment) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAlignment(alignment)}
                    className={selectedAlignments.includes(alignment) ? "bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90" : ""}
                  >
                    {alignment}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono text-[#D4AF37] uppercase mb-3">Tier Filter</h3>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map(tier => (
                  <Button
                    key={tier}
                    variant={selectedTiers.includes(tier as FactionTier) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTier(tier as FactionTier)}
                    className={selectedTiers.includes(tier as FactionTier) ? "bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90" : ""}
                  >
                    T{tier}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedAlignments([]);
                setSelectedTiers([]);
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>

          {/* Selected Faction Details */}
          {selectedFaction && (
            <ScrollArea className="flex-1 w-full h-full">
            <div className="p-6 space-y-4">
              <div>
                <Badge className={`rounded-sm px-2 py-0.5 text-xs font-bold uppercase ${
                  selectedFaction.alignment === "Stasis" ? "bg-[#D4AF37] text-black" :
                  selectedFaction.alignment === "Plasticity" ? "bg-[#FF3333] text-white" :
                  selectedFaction.alignment === "Existential" ? "bg-[#00E5FF] text-black" :
                  "bg-white/20 text-white"
                }`}>
                  {selectedFaction.alignment}
                </Badge>
                <h2 className="text-xl font-serif text-white mt-2">{selectedFaction.name}</h2>
                <p className="text-xs font-mono text-white/50 mt-1">TIER {selectedFaction.tier} • {selectedFaction.category}</p>
              </div>

              <p className="text-sm text-white/80 leading-relaxed italic">
                {selectedFaction.description}
              </p>

              {selectedFaction.allies && selectedFaction.allies.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono text-green-400 uppercase mb-2">Allies</h3>
                  <div className="space-y-1">
                    {selectedFaction.allies.map(ally => (
                      <div key={ally} className="text-sm text-white/70">• {ally}</div>
                    ))}
                  </div>
                </div>
              )}

              {selectedFaction.enemies && selectedFaction.enemies.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono text-red-400 uppercase mb-2">Enemies</h3>
                  <div className="space-y-1">
                    {selectedFaction.enemies.map(enemy => (
                      <div key={enemy} className="text-sm text-white/70">• {enemy}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </ScrollArea>
          )}

          {!selectedFaction && (
            <div className="flex-1 flex items-center justify-center text-white/30 font-mono text-sm p-4 text-center">
              Click a node to view faction details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
