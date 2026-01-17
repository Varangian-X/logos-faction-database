import { useState, useMemo } from "react";
import { factions } from "@/lib/factions";
import { timelineEvents, getFactionsInPeriod } from "@/lib/timeline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TimelinePage() {
  const [expandedTier, setExpandedTier] = useState<number | null>(null);
  const [selectedFactionId, setSelectedFactionId] = useState<string | null>(null);

  const selectedFaction = useMemo(
    () => factions.find(f => f.id === selectedFactionId),
    [selectedFactionId]
  );

  const toggleTier = (tier: number) => {
    setExpandedTier(expandedTier === tier ? null : tier);
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
            <h1 className="text-xl font-serif tracking-widest text-[#D4AF37]">FACTION TIMELINE</h1>
            <p className="text-[10px] font-mono text-white/50 tracking-[0.2em] uppercase">Historical Emergence // Tier-Based Chronology</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Timeline */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 w-full">
            <div className="p-8 space-y-6 pb-20">
              {/* Timeline Introduction */}
              <div className="max-w-3xl mx-auto mb-12">
                <div className="bg-black/40 border border-white/10 rounded-lg p-6">
                  <h2 className="text-2xl font-serif text-[#D4AF37] mb-4">The Seven Eras of the Logos Imperium</h2>
                  <p className="text-white/80 leading-relaxed">
                    The Logos Imperium evolved through distinct historical periods, each marked by the emergence of new factions and power structures. 
                    From the primordial existential entities to the emergent anomalies at reality's edge, the timeline reveals the hierarchical 
                    organization of Imperial society and the eternal tension between Stasis (order) and Plasticity (chaos).
                  </p>
                </div>
              </div>

              {/* Timeline Events */}
              <div className="max-w-3xl mx-auto space-y-4 w-full">
                {timelineEvents.map((event, idx) => {
                  const isExpanded = expandedTier === event.tier;
                  const factionsInEvent = getFactionsInPeriod(event.period);
                  const tierColor = event.tier === 1 ? "#00E5FF" : event.tier === 2 ? "#D4AF37" : "#888888";

                  return (
                    <motion.div
                      key={event.tier}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative"
                    >
                      {/* Timeline Connector */}
                      {idx < timelineEvents.length - 1 && (
                        <div className="absolute left-8 top-20 w-0.5 h-12 bg-gradient-to-b from-white/20 to-transparent" />
                      )}

                      {/* Timeline Node */}
                      <div className="flex gap-6">
                        {/* Left Marker */}
                        <div className="flex flex-col items-center pt-2">
                          <div
                            className="w-4 h-4 rounded-full border-2 border-white/30 relative z-10"
                            style={{ backgroundColor: tierColor }}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-8">
                          <button
                            onClick={() => toggleTier(event.tier)}
                            className="w-full text-left"
                          >
                            <div className={cn(
                              "border rounded-lg p-6 transition-all duration-300 cursor-pointer",
                              isExpanded
                                ? "border-[#D4AF37]/50 bg-black/60"
                                : "border-white/10 bg-black/40 hover:border-white/20 hover:bg-black/50"
                            )}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Badge className={cn(
                                      "rounded-sm px-2 py-0.5 text-xs font-bold uppercase",
                                      event.significance === "critical" ? "bg-[#00E5FF] text-black" :
                                      event.significance === "major" ? "bg-[#D4AF37] text-black" :
                                      "bg-white/20 text-white"
                                    )}>
                                      TIER {event.tier}
                                    </Badge>
                                    <span className="text-xs font-mono text-white/50">{event.significance.toUpperCase()}</span>
                                  </div>
                                  <h3 className="text-xl font-serif text-white mb-2">{event.period}</h3>
                                  <p className="text-sm text-white/70 leading-relaxed">{event.description}</p>
                                  <div className="mt-3 text-xs font-mono text-white/50">
                                    {factionsInEvent.length} factions emerged in this era
                                  </div>
                                </div>
                                <ChevronDown
                                  className={cn(
                                    "w-5 h-5 text-white/50 transition-transform duration-300 shrink-0 ml-4",
                                    isExpanded && "rotate-180"
                                  )}
                                />
                              </div>
                            </div>
                          </button>

                          {/* Expanded Content */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4"
                              >
                                <div className="bg-black/30 border border-white/5 rounded-lg p-6 space-y-4">
                                  <h4 className="text-sm font-mono text-[#D4AF37] uppercase">Factions of This Era</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {factionsInEvent.map(faction => (
                                      <button
                                        key={faction.factionId}
                                        onClick={() => setSelectedFactionId(faction.factionId)}
                                        className={cn(
                                          "text-left p-3 rounded border transition-all duration-200",
                                          selectedFactionId === faction.factionId
                                            ? "border-[#D4AF37] bg-[#D4AF37]/10"
                                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                                        )}
                                      >
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="font-serif text-white text-sm">{faction.factionName}</span>
                                          <span className="text-xs font-mono text-white/50">{faction.alignment}</span>
                                        </div>
                                        <div className="text-xs text-white/60">{faction.category}</div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Sidebar - Faction Details */}
        <div className="w-96 border-l border-white/10 bg-black/40 backdrop-blur-sm flex flex-col overflow-hidden">
          {selectedFaction ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-white/10 shrink-0">
                <Badge className={cn(
                  "rounded-sm px-2 py-0.5 text-xs font-bold uppercase mb-3",
                  selectedFaction.alignment === "Stasis" ? "bg-[#D4AF37] text-black" :
                  selectedFaction.alignment === "Plasticity" ? "bg-[#FF3333] text-white" :
                  selectedFaction.alignment === "Existential" ? "bg-[#00E5FF] text-black" :
                  "bg-white/20 text-white"
                )}>
                  {selectedFaction.alignment}
                </Badge>
                <h2 className="text-2xl font-serif text-white leading-tight">{selectedFaction.name}</h2>
                <p className="text-xs font-mono text-white/50 mt-2">TIER {selectedFaction.tier} • {selectedFaction.category}</p>
              </div>

              {/* Content */}
              <ScrollArea className="flex-1 w-full">
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-xs font-mono text-[#D4AF37] uppercase mb-3">Overview</h3>
                    <p className="text-sm text-white/80 leading-relaxed italic">{selectedFaction.description}</p>
                  </div>

                  <Separator className="bg-white/10" />

                  <div>
                    <h3 className="text-xs font-mono text-[#D4AF37] uppercase mb-3">Key Details</h3>
                    <div className="space-y-2">
                      {selectedFaction.keyDetails.map((detail, i) => (
                        <div key={i} className="text-sm text-white/70 flex gap-2">
                          <span className="text-[#D4AF37]">›</span>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(selectedFaction.allies || selectedFaction.enemies) && (
                    <>
                      <Separator className="bg-white/10" />
                      <div className="grid grid-cols-2 gap-4">
                        {selectedFaction.allies && (
                          <div>
                            <h4 className="text-xs font-mono text-green-400 uppercase mb-2">Allies</h4>
                            <ul className="text-xs text-white/70 space-y-1">
                              {selectedFaction.allies.map(a => (
                                <li key={a}>• {a}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {selectedFaction.enemies && (
                          <div>
                            <h4 className="text-xs font-mono text-red-400 uppercase mb-2">Enemies</h4>
                            <ul className="text-xs text-white/70 space-y-1">
                              {selectedFaction.enemies.map(e => (
                                <li key={e}>• {e}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <Separator className="bg-white/10" />

                  <div>
                    <h3 className="text-xs font-mono text-white/40 uppercase mb-2">Sources</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFaction.sources.map(source => (
                        <span key={source} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-white/50 border border-white/5">
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/30 font-mono text-sm p-4 text-center">
              Click on a faction to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
