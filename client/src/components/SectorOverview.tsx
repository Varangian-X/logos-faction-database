import React, { useState } from "react";
import { mapRegions } from "@/lib/mapData";
import { MapLocation } from "@/lib/mapData";
import { SectorPanel } from "@/components/SectorPanel";

interface SectorOverviewProps {
  onLocationSelect?: (location: MapLocation) => void;
  currentYear?: number;
}

export const SectorOverview: React.FC<SectorOverviewProps> = ({ onLocationSelect, currentYear = 30492 }) => {
  return (
    <div className="w-full h-full flex flex-col bg-[#050505] border-l border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur-sm shrink-0">
        <h2 className="text-sm font-serif font-bold text-[#D4AF37] tracking-widest">SECTOR OVERVIEW</h2>
        <p className="text-[10px] font-mono text-white/40 mt-1">Imperial Geographic Zones</p>
      </div>

      {/* Sector Panels */}
      <div className="flex-1 w-full overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-3">
          {mapRegions.map(region => (
            <SectorPanel
              key={region.id}
              region={region}
              onLocationSelect={onLocationSelect}
              currentYear={currentYear}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectorOverview;
