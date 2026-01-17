import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, X } from "lucide-react";
import { ImperialMap } from "@/components/ImperialMap";
import { SectorOverview } from "@/components/SectorOverview";
import { MapLocation } from "@/lib/mapData";

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [showSectorPanel, setShowSectorPanel] = useState(false);

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
            <h1 className="text-xl font-serif tracking-widest text-[#D4AF37]">IMPERIAL CARTOGRAPHY</h1>
            <p className="text-[10px] font-mono text-white/50 tracking-[0.2em] uppercase">Strategic Map // Faction Territories & Assets</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Map */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ImperialMap onLocationSelect={setSelectedLocation} />
          
          {/* Toggle Sector Panel Button */}
          <button
            onClick={() => setShowSectorPanel(!showSectorPanel)}
            className="absolute bottom-4 left-4 z-30 p-2 bg-black/60 border border-white/20 rounded hover:bg-black/80 transition-colors"
            title="Toggle Sector Overview"
          >
            {showSectorPanel ? (
              <X className="w-4 h-4 text-white" />
            ) : (
              <Menu className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Sector Overview Panel */}
        {showSectorPanel && (
          <div className="w-80 border-l border-white/10 overflow-hidden">
            <SectorOverview onLocationSelect={setSelectedLocation} />
          </div>
        )}
      </div>
    </div>
  );
}
