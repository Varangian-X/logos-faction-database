import React, { useState } from "react";
import { mapRegions } from "@/lib/mapData";
import { MapLocation } from "@/lib/mapData";
import { SectorPanel } from "@/components/SectorPanel";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SectorOverviewProps {
  onLocationSelect?: (location: MapLocation) => void;
}

export const SectorOverview: React.FC<SectorOverviewProps> = ({ onLocationSelect }) => {
  return (
    <div className="w-full h-full flex flex-col bg-[#050505] border-l border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur-sm shrink-0">
        <h2 className="text-sm font-serif font-bold text-[#D4AF37] tracking-widest">SECTOR OVERVIEW</h2>
        <p className="text-[10px] font-mono text-white/40 mt-1">Imperial Geographic Zones</p>
      </div>

      {/* Sector Panels */}
      <ScrollArea className="flex-1 w-full">
        <div className="p-4 space-y-3 pr-4">
          {mapRegions.map(region => (
            <SectorPanel
              key={region.id}
              region={region}
              onLocationSelect={onLocationSelect}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SectorOverview;
