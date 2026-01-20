import React, { useState, useRef, useEffect } from "react";
import { mapLocations, mapRegions, tradeRoutes, getLocationById, MapLocation, TradeRoute } from "@/lib/mapData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ZoomIn, ZoomOut, RotateCcw, Clock, Activity, BrainCircuit } from "lucide-react";
import { TimeLapseControl } from "./TimeLapseControl";
import { PredictivePlanner } from "./PredictivePlanner";
import { useCampaign } from "@/contexts/CampaignContext";
import { calculateCampaignState } from "@/lib/factionDynamics";

interface ImperialMapProps {
  onLocationSelect?: (location: MapLocation) => void;
  currentYear?: number;
  onYearChange?: (year: number) => void;
}

export const ImperialMap: React.FC<ImperialMapProps> = ({ 
  onLocationSelect, 
  currentYear: propCurrentYear, 
  onYearChange 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<TradeRoute | null>(null);
  const [zoom, setZoom] = useState(2);
  const [pan, setPan] = useState({ x: 50, y: 50 });
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Time-lapse state
  const [internalCurrentYear, setInternalCurrentYear] = useState(30492);
  const currentYear = propCurrentYear ?? internalCurrentYear;
  const setCurrentYear = onYearChange ?? setInternalCurrentYear;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTimeLapse, setShowTimeLapse] = useState(false);
  const [showStrengthOverlay, setShowStrengthOverlay] = useState(false);
  const [showPredictiveOverlay, setShowPredictiveOverlay] = useState(false);
  
  const { savedScenarios, playerAssets } = useCampaign();
  const campaignState = calculateCampaignState(savedScenarios);
  const factionReputation = Object.fromEntries(
    Object.entries(campaignState.factionStandings).map(([k, v]) => [k, v.reputation])
  );

  // Time-lapse animation loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        // Handle both state setter and direct callback patterns
        if (onYearChange) {
          const nextYear = currentYear >= 30492 ? 30492 : currentYear + 1;
          if (nextYear === 30492) setIsPlaying(false);
          onYearChange(nextYear);
        } else {
          setInternalCurrentYear(prev => {
            if (prev >= 30492) {
              setIsPlaying(false);
              return 30492;
            }
            return prev + 1;
          });
        }
      }, 200); // 5 years per second
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Render the map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {

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

    // Draw trade routes
    const time = Date.now() / 1000;
    tradeRoutes.forEach(route => {
      // Check historical status
      let isActive = true;
      let intensity = route.intensity;
      
      if (showTimeLapse && route.history) {
        // Find closest historical record
        const years = Object.keys(route.history).map(Number).sort((a, b) => a - b);
        let record = null;
        for (const year of years) {
          if (year <= currentYear) {
            record = route.history[year];
          }
        }
        if (record) {
          isActive = record.active;
          intensity = record.intensity;
        }
      }

      if (!isActive) return;

      const source = getLocationById(route.source);
      const target = getLocationById(route.target);
      
      if (source && target) {
        const sourceX = source.x * zoom + pan.x;
        const sourceY = source.y * zoom + pan.y;
        const targetX = target.x * zoom + pan.x;
        const targetY = target.y * zoom + pan.y;

        // Draw route line
        const isRouteHovered = hoveredRoute === route.id;
        const isRouteSelected = selectedRoute?.id === route.id;
        
        ctx.beginPath();
        ctx.moveTo(sourceX, sourceY);
        ctx.lineTo(targetX, targetY);
        ctx.strokeStyle = isRouteHovered || isRouteSelected ? route.color + "80" : route.color + "20";
        ctx.lineWidth = isRouteHovered || isRouteSelected ? 3 : (intensity === "high" ? 2 : 1);
        ctx.setLineDash([]);
        ctx.stroke();

        // Draw animated particles
        const distance = Math.sqrt(Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2));
        const particleCount = Math.max(1, Math.floor(distance / 50));
        const speed = intensity === "high" ? 1.5 : intensity === "medium" ? 1 : 0.5;
        
        for (let i = 0; i < particleCount; i++) {
          const offset = (time * speed + i / particleCount) % 1;
          const particleX = sourceX + (targetX - sourceX) * offset;
          const particleY = sourceY + (targetY - sourceY) * offset;

          ctx.beginPath();
          ctx.arc(particleX, particleY, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = route.color;
          ctx.fill();
        }
      }
    });

    // Draw regions as background areas using bounds
    mapRegions.forEach(region => {
      const regionColor = region.color;
      ctx.fillStyle = regionColor + "08";
      ctx.strokeStyle = regionColor + "30";
      ctx.lineWidth = 2;

      const screenMinX = region.bounds.minX * zoom + pan.x;
      const screenMaxX = region.bounds.maxX * zoom + pan.x;
      const screenMinY = region.bounds.minY * zoom + pan.y;
      const screenMaxY = region.bounds.maxY * zoom + pan.y;

      ctx.fillRect(screenMinX, screenMinY, screenMaxX - screenMinX, screenMaxY - screenMinY);
      ctx.strokeRect(screenMinX, screenMinY, screenMaxX - screenMinX, screenMaxY - screenMinY);

      // Draw region label
      ctx.fillStyle = regionColor + "80";
      ctx.font = "bold 12px serif";
      ctx.textAlign = "center";
      ctx.fillText(region.name, (screenMinX + screenMaxX) / 2, screenMinY + 20);
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

      // Determine historical state
      let alignment = location.alignment;
      let strength = 100;
      
      // Dynamic territory control based on faction influence
      const controllingFaction = location.controllingFaction;
      const factionStanding = campaignState.factionStandings[controllingFaction];
      
      if (factionStanding) {
        // If faction influence is very high (>80), they project stronger control (larger node)
        if (factionStanding.influence > 80) {
          strength += 20;
        }
        // If faction is hostile and influence is low (<20), territory is contested (pulsing effect)
        if (factionStanding.status === 'hostile' && factionStanding.influence < 20) {
          strength -= 30;
        }
      }

      if (showTimeLapse && location.history) {
        const years = Object.keys(location.history).map(Number).sort((a, b) => a - b);
        let record = null;
        for (const year of years) {
          if (year <= currentYear) {
            record = location.history[year];
          }
        }
        if (record) {
          alignment = record.alignment;
          strength = record.strength;
        }
      }

      // Draw location node
      const nodeColor =
        alignment === "Stasis"
          ? "#D4AF37"
          : alignment === "Plasticity"
            ? "#FF3333"
            : alignment === "Anomalous"
              ? "#00E5FF"
              : "#888888";

      // Adjust node size based on strength/influence
      const influenceModifier = (strength - 100) / 20; // +1 size for every +20 strength
      const nodeSize = (isSelected ? 12 : isHovered ? 10 : 8) + Math.max(-2, influenceModifier);

      // Draw strength overlay
      if (showStrengthOverlay) {
        const strengthRadius = (strength / 100) * 40;
        const gradient = ctx.createRadialGradient(screenX, screenY, nodeSize, screenX, screenY, strengthRadius);
        gradient.addColorStop(0, nodeColor + "40");
        gradient.addColorStop(1, nodeColor + "00");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(screenX, screenY, strengthRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw strength ring
        ctx.strokeStyle = nodeColor + "20";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(screenX, screenY, strengthRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

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
    
    animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [zoom, pan, selectedLocation, hoveredLocation, currentYear, showTimeLapse, showStrengthOverlay]);

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

    setMousePos({ x: e.clientX, y: e.clientY });

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

    // Check if hovering over a trade route
    let foundRoute: string | null = null;
    if (!foundLocation) {
      for (const route of tradeRoutes) {
        const source = getLocationById(route.source);
        const target = getLocationById(route.target);
        if (source && target) {
          const x1 = source.x * zoom + pan.x;
          const y1 = source.y * zoom + pan.y;
          const x2 = target.x * zoom + pan.x;
          const y2 = target.y * zoom + pan.y;
          
          // Calculate distance from point to line segment
          const A = x - x1;
          const B = y - y1;
          const C = x2 - x1;
          const D = y2 - y1;
          const dot = A * C + B * D;
          const lenSq = C * C + D * D;
          let param = -1;
          if (lenSq !== 0) param = dot / lenSq;
          
          let xx, yy;
          if (param < 0) {
            xx = x1;
            yy = y1;
          } else if (param > 1) {
            xx = x2;
            yy = y2;
          } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
          }
          
          const dx = x - xx;
          const dy = y - yy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 5) {
            foundRoute = route.id;
            break;
          }
        }
      }
    }

    setHoveredLocation(foundLocation);
    setHoveredRoute(foundRoute);
    canvas.style.cursor = foundLocation || foundRoute ? "pointer" : "grab";
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
        setSelectedRoute(null);
        onLocationSelect?.(location);
        return;
      }
    }

    // Check if clicking on a trade route
    if (hoveredRoute) {
      const route = tradeRoutes.find(r => r.id === hoveredRoute);
      if (route) {
        setSelectedRoute(route);
        setSelectedLocation(null);
        return;
      }
    }

    // Start dragging
    setIsDragging(true);
    setDragStart({ x, y });
    setSelectedRoute(null);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(Math.max(0.5, Math.min(6, zoom * zoomFactor)));
  };

  const resetView = () => {
    setZoom(2);
    setPan({ x: 50, y: 50 });
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
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <Button
            variant={showPredictiveOverlay ? "default" : "outline"}
            size="icon"
            onClick={() => setShowPredictiveOverlay(!showPredictiveOverlay)}
            className={`border-white/20 ${showPredictiveOverlay ? 'bg-amber-600 text-white' : 'bg-black/60 text-white hover:bg-black/80'}`}
            title="Toggle Predictive Analysis Overlay"
          >
            <BrainCircuit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom(z => Math.min(z * 1.2, 5))}
            className="bg-black/60 border-white/20 text-white hover:bg-black/80"
          >
            <ZoomIn className="w-4 h-4" />
          </Button> <Button
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
        <Separator orientation="vertical" className="h-8 bg-white/20" />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowTimeLapse(!showTimeLapse)}
          className={cn(
            "bg-black/60 border-white/20 hover:bg-black/80",
            showTimeLapse && "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]"
          )}
          title="Toggle Time-Lapse"
        >
          <Clock className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowStrengthOverlay(!showStrengthOverlay)}
          className={cn(
            "bg-black/60 border-white/20 hover:bg-black/80",
            showStrengthOverlay && "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]"
          )}
          title="Toggle Strength Overlay"
        >
          <Activity className="w-4 h-4" />
        </Button>
      </div>

      {/* Time Lapse Control */}
      <AnimatePresence>
        {showTimeLapse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <TimeLapseControl
              currentYear={currentYear}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onYearChange={setCurrentYear}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trade Route Tooltip */}
      <AnimatePresence>
        {hoveredRoute && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed z-50 pointer-events-none"
            style={{ left: mousePos.x + 15, top: mousePos.y + 15 }}
          >
            <div className="bg-black/90 border border-[#D4AF37]/30 p-3 rounded-lg shadow-xl backdrop-blur-md min-w-[200px]">
              {(() => {
                const route = tradeRoutes.find(r => r.id === hoveredRoute);
                if (!route) return null;
                const source = getLocationById(route.source);
                const target = getLocationById(route.target);
                return (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Trade Route</span>
                      <Badge variant="outline" className="text-[10px] h-4 border-white/20" style={{ color: route.color }}>
                        {route.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-white/80">
                      <div className="flex justify-between">
                        <span className="text-white/50">Resource:</span>
                        <span className="font-mono">{route.resource}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Flow:</span>
                        <span>{source?.name.split(' ')[0]} → {target?.name.split(' ')[0]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Intensity:</span>
                        <span className={cn(
                          route.intensity === "high" ? "text-red-400" : 
                          route.intensity === "medium" ? "text-yellow-400" : "text-blue-400"
                        )}>
                          {route.intensity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm border border-[#D4AF37]/50 rounded-lg p-4 max-w-sm z-20 max-h-[80vh] overflow-y-auto custom-scrollbar"
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

              {showPredictiveOverlay && (
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-xs font-bold text-amber-500 mb-2 flex items-center gap-2">
                    <BrainCircuit className="w-3 h-3" />
                    STRATEGIC PREDICTION
                  </h4>
                  <PredictivePlanner 
                    mission={{
                      id: 'temp_prediction',
                      title: `Operation: ${selectedLocation.name}`,
                      description: `Hypothetical operation in ${selectedLocation.name}`,
                      type: 'Combat',
                      faction: selectedLocation.controllingFaction,
                      location: selectedLocation.name,
                      year: currentYear,
                      status: 'active',
                      objectives: [],
                      complications: [],
                      factionReputation: { [selectedLocation.controllingFaction]: 0 },
                      rewards: [],
                      createdAt: Date.now()
                    }}
                    currentReputation={factionReputation}
                  />
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
