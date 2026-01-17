import React, { useState } from "react";
import { MapLocation, MapRegion, mapLocations } from "@/lib/mapData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, Zap, Shield, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ScenarioGenerator } from "./ScenarioGenerator";

interface SectorPanelProps {
  region: MapRegion;
  onLocationSelect?: (location: MapLocation) => void;
  currentYear?: number;
}

export const SectorPanel: React.FC<SectorPanelProps> = ({ region, onLocationSelect, currentYear = 30492 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  // Get all locations in this region
  const regionLocations = region.locations
    .map(locId => mapLocations.find(loc => loc.id === locId))
    .filter(Boolean) as MapLocation[];

  // Group locations by controlling faction
  const locationsByFaction = regionLocations.reduce((acc, loc) => {
    const faction = loc.controllingFaction;
    if (!acc[faction]) {
      acc[faction] = [];
    }
    acc[faction].push(loc);
    return acc;
  }, {} as Record<string, MapLocation[]>);

  // Aggregate resources
  const allResources = regionLocations.flatMap(loc => loc.resources);
  const uniqueResources = Array.from(new Set(allResources));

  // Get critical locations
  const criticalLocations = regionLocations.filter(loc => loc.strategicValue === "critical");

  const regionColor = region.color;

  return (
    <div className="bg-black/40 border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: regionColor }}
          />
          <div className="text-left">
            <h3 className="font-serif text-base font-bold text-white">{region.name}</h3>
            <p className="text-xs text-white/50">{regionLocations.length} locations • {Object.keys(locationsByFaction).length} factions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-mono",
              region.dominantAlignment === "Stasis"
                ? "border-[#D4AF37] text-[#D4AF37]"
                : region.dominantAlignment === "Plasticity"
                  ? "border-[#FF3333] text-[#FF3333]"
                  : "border-[#00E5FF] text-[#00E5FF]"
            )}
          >
            {region.dominantAlignment}
          </Badge>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-white/50" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/50" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Separator className="bg-white/5" />

            <div className="px-4 py-3 space-y-4">
              {/* Description */}
              <p className="text-xs text-white/60 leading-relaxed">{region.description}</p>

              {/* Critical Locations */}
              {criticalLocations.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-3 h-3 text-red-400" />
                    <span className="text-xs font-mono text-red-400 uppercase">Critical Assets</span>
                  </div>
                  <div className="space-y-1">
                    {criticalLocations.map(loc => (
                      <button
                        key={loc.id}
                        onClick={() => {
                          setSelectedLocation(loc);
                          onLocationSelect?.(loc);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-red-300">{loc.name}</span>
                          <span className="text-[10px] text-red-400/70">{loc.controllingFaction}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Faction Control */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-3 h-3 text-[#D4AF37]" />
                  <span className="text-xs font-mono text-[#D4AF37] uppercase">Faction Control</span>
                </div>
                <div className="space-y-2">
                  {Object.entries(locationsByFaction).map(([faction, locations]) => (
                    <div key={faction} className="bg-white/5 rounded p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-white/80">{faction}</span>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                          {locations.length}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {locations.map(loc => (
                          <button
                            key={loc.id}
                            onClick={() => {
                              setSelectedLocation(loc);
                              onLocationSelect?.(loc);
                            }}
                            className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                          >
                            {loc.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              {uniqueResources.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-3 h-3 text-[#00E5FF]" />
                    <span className="text-xs font-mono text-[#00E5FF] uppercase">Resources</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {uniqueResources.map(resource => (
                      <Badge
                        key={resource}
                        variant="outline"
                        className="text-[10px] border-[#00E5FF]/30 text-[#00E5FF]"
                      >
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Resource Flow Visualization */}
              <div>
                <span className="text-xs font-mono text-white/50 uppercase block mb-2">Resource Flow</span>
                <div className="bg-gradient-to-r from-[#D4AF37]/10 via-transparent to-[#FF3333]/10 rounded p-2 border border-white/5">
                  <div className="flex items-center justify-between text-[10px] text-white/60">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      Imports
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF3333]" />
                      Exports
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                      Internal
                    </span>
                  </div>
                  <div className="mt-2 h-1 bg-gradient-to-r from-[#D4AF37] via-[#00E5FF] to-[#FF3333] rounded-full opacity-50" />
                </div>
              </div>

              {/* Threats */}
              {regionLocations.some(loc => loc.threats.length > 0) && (
                <div>
                  <span className="text-xs font-mono text-red-400 uppercase block mb-2">Sector Threats</span>
                  <div className="space-y-1">
                    {Array.from(new Set(regionLocations.flatMap(loc => loc.threats))).map(threat => (
                      <div key={threat} className="text-[10px] text-red-400/70 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-red-400" />
                        {threat}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scenario Generator */}
              {selectedLocation && (
                <ScenarioGenerator location={selectedLocation} year={currentYear} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SectorPanel;
