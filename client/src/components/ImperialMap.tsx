import React, { useState, useRef, useEffect } from "react";
import { mapLocations, mapRegions, getLocationById, MapLocation } from "@/lib/mapData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ImperialMapProps {
  onLocationSelect?: (location: MapLocation) => void;
}

export const ImperialMap: React.FC<ImperialMapProps> = ({ onLocationSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Render the map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, width, height);

    // Draw background grid
    ctx.strokeStyle = "rgba(212, 175, 55, 0.05)";
    ctx.lineWidth = 1;
    const gridSize = 50 * zoom;
    for (let x = pan.x % gridSize; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = pan.y % gridSize; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw regions as background areas
    mapRegions.forEach(region => {
      const regionColor = region.color;
      ctx.fillStyle = regionColor + "08";
      ctx.strokeStyle = regionColor + "20";
      ctx.lineWidth = 2;

      // Draw region boundary (simplified)
      const regionLocations = region.locations
        .map(locId => getLocationById(locId))
        .filter(Boolean) as MapLocation[];

      if (regionLocations.length > 0) {
        const minX = Math.min(...regionLocations.map(l => l.x)) - 15;
        const maxX = Math.max(...regionLocations.map(l => l.x)) + 15;
        const minY = Math.min(...regionLocations.map(l => l.y)) - 15;
        const maxY = Math.max(...regionLocations.map(l => l.y)) + 15;

        const screenMinX = minX * zoom + pan.x;
        const screenMaxX = maxX * zoom + pan.x;
        const screenMinY = minY * zoom + pan.y;
        const screenMaxY = maxY * zoom + pan.y;

        ctx.fillRect(screenMinX, screenMinY, screenMaxX - screenMinX, screenMaxY - screenMinY);
        ctx.strokeRect(screenMinX, screenMinY, screenMaxX - screenMinX, screenMaxY - screenMinY);

        // Draw region label
        ctx.fillStyle = regionColor + "60";
        ctx.font = "bold 14px serif";
        ctx.textAlign = "center";
        ctx.fillText(region.name, (screenMinX + screenMaxX) / 2, screenMinY - 10);
      }
    });

    // Draw locations
    mapLocations.forEach(location => {
      const screenX = location.x * zoom + pan.x;
      const screenY = location.y * zoom + pan.y;
      const isSelected = selectedLocation?.id === location.id;
      const isHovered = hoveredLocation === location.id;

      // Draw connection lines to related locations
      if (isSelected || isHovered) {
        ctx.strokeStyle = location.alignment === "Stasis" ? "#D4AF37" : location.alignment === "Plasticity" ? "#FF3333" : "#00E5FF";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        // Draw lines to nearby locations
        mapLocations.forEach(other => {
          if (other.id !== location.id) {
            const dx = other.x - location.x;
            const dy = other.y - location.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 30) {
              const otherScreenX = other.x * zoom + pan.x;
              const otherScreenY = other.y * zoom + pan.y;
              ctx.beginPath();
              ctx.moveTo(screenX, screenY);
              ctx.lineTo(otherScreenX, otherScreenY);
              ctx.stroke();
            }
          }
        });
        ctx.setLineDash([]);
      }

      // Draw location node
      const nodeColor =
        location.alignment === "Stasis"
          ? "#D4AF37"
          : location.alignment === "Plasticity"
            ? "#FF3333"
            : location.alignment === "Anomalous"
              ? "#00E5FF"
              : "#888888";

      const nodeSize = isSelected ? 12 : isHovered ? 10 : 8;

      ctx.fillStyle = nodeColor;
      ctx.globalAlpha = isSelected ? 1 : isHovered ? 0.9 : 0.7;
      ctx.beginPath();
      ctx.arc(screenX, screenY, nodeSize, 0, Math.PI * 2);
      ctx.fill();

      // Draw glow for critical locations
      if (location.strategicValue === "critical") {
        ctx.strokeStyle = nodeColor + "40";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(screenX, screenY, nodeSize + 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      // Draw label
      if (isSelected || isHovered) {
        ctx.fillStyle = nodeColor;
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.fillText(location.name, screenX, screenY - nodeSize - 15);
      }
    });
  }, [zoom, pan, selectedLocation, hoveredLocation]);

  // Handle mouse events
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      setPan({
        x: pan.x + (x - dragStart.x),
        y: pan.y + (y - dragStart.y),
      });
      setDragStart({ x, y });
      return;
    }

    // Check if hovering over a location
    let foundLocation: string | null = null;
    for (const location of mapLocations) {
      const screenX = location.x * zoom + pan.x;
      const screenY = location.y * zoom + pan.y;
      const dx = x - screenX;
      const dy = y - screenY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 15 * zoom) {
        foundLocation = location.id;
        break;
      }
    }

    setHoveredLocation(foundLocation);
    canvas.style.cursor = foundLocation ? "pointer" : "grab";
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a location
    for (const location of mapLocations) {
      const screenX = location.x * zoom + pan.x;
      const screenY = location.y * zoom + pan.y;
      const dx = x - screenX;
      const dy = y - screenY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 15 * zoom) {
        setSelectedLocation(location);
        onLocationSelect?.(location);
        return;
      }
    }

    // Start dragging
    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(Math.max(0.5, Math.min(3, zoom * zoomFactor)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedLocation(null);
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col bg-[#0A0E17] relative rounded-lg overflow-hidden border border-white/10">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={containerRef.current?.clientWidth || 800}
        height={containerRef.current?.clientHeight || 600}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="flex-1 cursor-grab active:cursor-grabbing"
      />

      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setZoom(Math.min(3, zoom * 1.2))}
          className="bg-black/60 border-white/20 hover:bg-black/80"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setZoom(Math.max(0.5, zoom * 0.8))}
          className="bg-black/60 border-white/20 hover:bg-black/80"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={resetView}
          className="bg-black/60 border-white/20 hover:bg-black/80"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm border border-white/10 rounded p-3 text-xs font-mono text-white/70 space-y-1 z-20">
        <div className="text-[#D4AF37] font-bold mb-2">LEGEND</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#D4AF37" }}></div>
          <span>Stasis (Order)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#FF3333" }}></div>
          <span>Plasticity (Chaos)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#00E5FF" }}></div>
          <span>Anomalous</span>
        </div>
      </div>

      {/* Info Panel */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm border border-[#D4AF37]/50 rounded-lg p-4 max-w-sm z-20"
          >
            <div className="space-y-3">
              <div>
                <Badge className={cn(
                  "rounded-sm px-2 py-0.5 text-xs font-bold uppercase mb-2",
                  selectedLocation.alignment === "Stasis" ? "bg-[#D4AF37] text-black" :
                  selectedLocation.alignment === "Plasticity" ? "bg-[#FF3333] text-white" :
                  "bg-[#00E5FF] text-black"
                )}>
                  {selectedLocation.type.toUpperCase()}
                </Badge>
                <h3 className="text-lg font-serif text-white">{selectedLocation.name}</h3>
              </div>

              <p className="text-xs text-white/70 leading-relaxed">{selectedLocation.description}</p>

              <Separator className="bg-white/10" />

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-white/50">Controlling Faction</span>
                  <p className="text-white/90 font-mono">{selectedLocation.controllingFaction}</p>
                </div>
                <div>
                  <span className="text-white/50">Strategic Value</span>
                  <p className="text-white/90 font-mono uppercase">{selectedLocation.strategicValue}</p>
                </div>
              </div>

              {selectedLocation.resources.length > 0 && (
                <div>
                  <span className="text-white/50 text-xs">Resources</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedLocation.resources.map(r => (
                      <span key={r} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/70 border border-white/10">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedLocation.threats.length > 0 && (
                <div>
                  <span className="text-red-400 text-xs font-mono">THREATS</span>
                  <ul className="text-xs text-white/70 space-y-0.5 mt-1">
                    {selectedLocation.threats.map(t => (
                      <li key={t}>• {t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      <div className="absolute top-4 left-4 text-xs font-mono text-white/40 z-20">
        Drag to pan • Scroll to zoom • Click to select
      </div>
    </div>
  );
};

export default ImperialMap;
