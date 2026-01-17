import { useState, useMemo } from "react";
import { factions, Faction, FactionAlignment, FactionCategory, FactionTier } from "@/lib/factions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, Shield, Skull, Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useFactionNavigation, exportFactionToPDF } from "@/hooks/useFactionNavigation";

// --- Components ---

const FactionCard = ({ faction, onClick, isSelected }: { faction: Faction; onClick: () => void; isSelected: boolean }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={cn(
        "cursor-pointer relative overflow-hidden rounded-lg border p-4 transition-all duration-300",
        isSelected 
          ? "border-[#D4AF37] bg-[#0A0E17]/90 shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
          : "border-white/10 bg-black/40 hover:border-[#D4AF37]/50 hover:bg-black/60"
      )}
    >
      {/* Holographic Scan Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none translate-y-[-100%] hover:translate-y-[100%]" style={{ transitionDuration: '1.5s' }} />

      <div className="flex justify-between items-start mb-2">
        <Badge variant="outline" className={cn(
          "text-xs font-mono uppercase tracking-wider border-opacity-50",
          faction.alignment === "Stasis" ? "text-[#D4AF37] border-[#D4AF37]" :
          faction.alignment === "Plasticity" ? "text-[#FF3333] border-[#FF3333]" :
          faction.alignment === "Existential" ? "text-[#00E5FF] border-[#00E5FF]" :
          "text-white/70 border-white/30"
        )}>
          {faction.alignment}
        </Badge>
        <span className="text-[10px] text-white/40 font-mono">TIER {faction.tier}</span>
      </div>
      
      <h3 className={cn(
        "font-serif text-lg leading-tight mb-2",
        isSelected ? "text-[#D4AF37]" : "text-white/90"
      )}>
        {faction.name}
      </h3>
      
      <div className="flex flex-wrap gap-1 mt-3">
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/60 border border-white/10">
          {faction.category}
        </span>
      </div>
    </motion.div>
  );
};

const DetailPanel = ({ faction, onClose, onExport }: { faction: Faction; onClose: () => void; onExport: () => void }) => {
  if (!faction) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="h-full flex flex-col bg-[#0A0E17]/95 border-l border-[#D4AF37]/30 backdrop-blur-xl relative overflow-hidden"
    >
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'url("/images/faction-card-bg.jpg")', backgroundSize: 'cover' }} />
      
      {/* Header Image */}
      <div className="h-48 w-full relative shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] to-transparent z-10" />
        <img 
          src={faction.imageUrl || "/images/faction-card-bg.jpg"} 
          alt={faction.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onExport}
            className="text-white/70 hover:text-white hover:bg-black/50"
            title="Export to HTML"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-black/50"
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 w-full">
        <div className="space-y-6 pb-10 px-6 py-4 relative z-10">
          {/* Title Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={cn(
                "rounded-sm px-2 py-0.5 text-xs font-bold uppercase",
                faction.alignment === "Stasis" ? "bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90" :
                faction.alignment === "Plasticity" ? "bg-[#FF3333] text-white hover:bg-[#FF3333]/90" :
                faction.alignment === "Existential" ? "bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90" :
                "bg-white/20 text-white hover:bg-white/30"
              )}>
                {faction.alignment}
              </Badge>
              <span className="text-xs font-mono text-[#D4AF37]/80">TIER {faction.tier} // {faction.category.toUpperCase()}</span>
            </div>
            <h1 className="text-3xl font-serif text-white mb-4 leading-none tracking-wide">{faction.name}</h1>
            <p className="text-white/80 leading-relaxed font-light border-l-2 border-[#D4AF37]/50 pl-4 italic">
              {faction.description}
            </p>
          </div>

          <Separator className="bg-white/10" />

          {/* Key Details */}
          <div>
            <h3 className="text-sm font-mono text-[#D4AF37] uppercase mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> System Data
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {faction.keyDetails.map((detail, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded px-3 py-2 text-sm text-white/90 flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">›</span> {detail}
                </div>
              ))}
            </div>
          </div>

          {/* Relations */}
          {(faction.allies || faction.enemies) && (
            <div className="grid grid-cols-2 gap-4">
              {faction.allies && (
                <div>
                  <h3 className="text-xs font-mono text-green-400 uppercase mb-2 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Allies
                  </h3>
                  <ul className="text-sm text-white/70 space-y-1">
                    {faction.allies.map(a => <li key={a}>• {a}</li>)}
                  </ul>
                </div>
              )}
              {faction.enemies && (
                <div>
                  <h3 className="text-xs font-mono text-red-400 uppercase mb-2 flex items-center gap-1">
                    <Skull className="w-3 h-3" /> Hostiles
                  </h3>
                  <ul className="text-sm text-white/70 space-y-1">
                    {faction.enemies.map(e => <li key={e}>• {e}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          <Separator className="bg-white/10" />

          {/* Sources */}
          <div>
            <h3 className="text-xs font-mono text-white/40 uppercase mb-2">Source Verification</h3>
            <div className="flex flex-wrap gap-2">
              {faction.sources.map(source => (
                <span key={source} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-white/50 border border-white/5">
                  REF: {source.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
};

// --- Main Page ---

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlignment, setSelectedAlignment] = useState<FactionAlignment | "All">("All");
  const [selectedTier, setSelectedTier] = useState<FactionTier | "All">("All");
  const [selectedFactionId, setSelectedFactionId] = useState<string | null>(null);

  const filteredFactions = useMemo(() => {
    return factions.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            f.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAlignment = selectedAlignment === "All" || f.alignment === selectedAlignment;
      const matchesTier = selectedTier === "All" || f.tier === selectedTier;
      return matchesSearch && matchesAlignment && matchesTier;
    });
  }, [searchQuery, selectedAlignment, selectedTier]);

  const selectedFaction = useMemo(() => 
    factions.find(f => f.id === selectedFactionId), 
  [selectedFactionId]);

  // Keyboard navigation hook
  useFactionNavigation(filteredFactions, selectedFactionId, setSelectedFactionId);

  const handleExport = () => {
    if (selectedFaction) {
      exportFactionToPDF(selectedFaction);
    }
  };

  return (
    <div className="h-screen w-full bg-[#050505] text-white overflow-hidden flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[1] bg-[length:100%_2px,3px_100%] pointer-events-none" />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-black/60 backdrop-blur-md px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37] flex items-center justify-center">
            <img src="/images/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-serif tracking-widest text-[#D4AF37]">LOGOS IMPERIUM</h1>
            <p className="text-[10px] font-mono text-white/50 tracking-[0.2em] uppercase">Faction Database // Access Level: Vermilion</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-xs font-mono text-white/40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>SYSTEM ONLINE</span>
          </div>
          <div>Factions: {factions.length} // Cycle: 30,492 AD</div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Sidebar / List View */}
        <div className={cn(
          "flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-500 ease-in-out overflow-hidden",
          selectedFactionId ? "w-full md:w-[450px]" : "w-full max-w-5xl mx-auto border-r-0"
        )}>
          
          {/* Filters */}
          <div className="p-6 space-y-4 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input 
                placeholder="Search database..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 h-12 font-mono text-sm"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select 
                className="bg-black/50 border border-white/10 rounded px-3 py-1.5 text-xs text-white/70 focus:border-[#D4AF37] outline-none"
                value={selectedAlignment}
                onChange={(e) => setSelectedAlignment(e.target.value as any)}
              >
                <option value="All">All Alignments</option>
                <option value="Stasis">Stasis (Order)</option>
                <option value="Plasticity">Plasticity (Chaos)</option>
                <option value="Neutral">Neutral</option>
                <option value="Existential">Existential</option>
              </select>

              <select 
                className="bg-black/50 border border-white/10 rounded px-3 py-1.5 text-xs text-white/70 focus:border-[#D4AF37] outline-none"
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value === "All" ? "All" : Number(e.target.value) as any)}
              >
                <option value="All">All Tiers</option>
                <option value="1">Tier 1 (Existential)</option>
                <option value="2">Tier 2 (Core)</option>
                <option value="3">Tier 3 (Dynastic)</option>
                <option value="4">Tier 4 (Frontier)</option>
                <option value="5">Tier 5 (Underworld)</option>
                <option value="6">Tier 6 (Xenos)</option>
                <option value="7">Tier 7 (Emergent)</option>
              </select>
              
              <div className="ml-auto text-xs font-mono text-white/30 self-center">
                {filteredFactions.length} ENTITIES FOUND
              </div>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full">
              <div className={cn(
                "grid gap-4 pb-20 px-6",
                selectedFactionId ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              )}>
                <AnimatePresence>
                  {filteredFactions.map((faction) => (
                    <FactionCard 
                      key={faction.id} 
                      faction={faction} 
                      isSelected={selectedFactionId === faction.id}
                      onClick={() => setSelectedFactionId(faction.id)}
                    />
                  ))}
                </AnimatePresence>
                
                {filteredFactions.length === 0 && (
                  <div className="col-span-full text-center py-20 text-white/30 font-mono">
                    NO RECORDS FOUND IN ARCHIVE
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Detail View (Desktop) */}
        <AnimatePresence mode="wait">
          {selectedFactionId && (
            <div className="hidden md:block flex-1 h-full relative z-20 shadow-2xl">
              <DetailPanel 
                faction={selectedFaction!} 
                onClose={() => setSelectedFactionId(null)}
                onExport={handleExport}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Mobile Detail Overlay */}
        <AnimatePresence>
          {selectedFactionId && (
            <motion.div 
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              className="md:hidden fixed inset-0 z-50 bg-black"
            >
              <DetailPanel 
                faction={selectedFaction!} 
                onClose={() => setSelectedFactionId(null)}
                onExport={handleExport}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Keyboard Help Hint */}
      <div className="fixed bottom-4 right-4 z-30 text-xs font-mono text-white/30 bg-black/60 px-3 py-2 rounded border border-white/10 hidden lg:block">
        ↑↓ Navigate • ⏠⏡ Select • ⌘+E Export
      </div>
    </div>
  );
}
