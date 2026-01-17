import React, { useRef, useEffect, useState, useCallback } from "react";
import { buildGraphData, GraphData, GraphNode } from "@/lib/networkGraph";
import { factions } from "@/lib/factions";

interface FactionNetworkProps {
  onNodeClick?: (factionId: string) => void;
  highlightedFactionId?: string | null;
  selectedAlignments?: string[];
  selectedTiers?: number[];
}

interface SimulationNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number;
  fy?: number;
}

export const FactionNetwork: React.FC<FactionNetworkProps> = ({
  onNodeClick,
  highlightedFactionId,
  selectedAlignments = [],
  selectedTiers = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const nodesRef = useRef<Map<string, SimulationNode>>(new Map());
  const animationRef = useRef<number | null>(null);

  // Build graph data based on filters
  useEffect(() => {
    let filteredFactions = factions;

    if (selectedAlignments.length > 0) {
      filteredFactions = filteredFactions.filter(f => selectedAlignments.includes(f.alignment));
    }

    if (selectedTiers.length > 0) {
      filteredFactions = filteredFactions.filter(f => selectedTiers.includes(f.tier));
    }

    const data = buildGraphData(filteredFactions.map(f => f.id));
    setGraphData(data);

    // Initialize nodes with random positions
    const nodesMap = new Map<string, SimulationNode>();
    data.nodes.forEach(node => {
      nodesMap.set(node.id, {
        ...node,
        x: Math.random() * 400 - 200,
        y: Math.random() * 400 - 200,
        vx: 0,
        vy: 0,
      });
    });
    nodesRef.current = nodesMap;
  }, [selectedAlignments, selectedTiers]);

  // Physics simulation
  const simulate = useCallback(() => {
    const nodes = Array.from(nodesRef.current.values());
    const alpha = 0.1;
    const charge = -300;
    const linkDistance = 80;

    // Apply forces
    nodes.forEach((node, i) => {
      // Charge force (repulsion)
      nodes.forEach((other, j) => {
        if (i !== j) {
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (charge / (distance * distance)) * alpha;
          node.vx -= (force * dx) / distance;
          node.vy -= (force * dy) / distance;
        }
      });

      // Link force (attraction)
      graphData.links.forEach(link => {
        if (link.source === node.id) {
          const target = nodesRef.current.get(link.target as string);
          if (target) {
            const dx = target.x - node.x;
            const dy = target.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = ((distance - linkDistance) / distance) * alpha * 0.5;
            node.vx += force * dx;
            node.vy += force * dy;
          }
        } else if (link.target === node.id) {
          const source = nodesRef.current.get(link.source as string);
          if (source) {
            const dx = source.x - node.x;
            const dy = source.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = ((distance - linkDistance) / distance) * alpha * 0.5;
            node.vx += force * dx;
            node.vy += force * dy;
          }
        }
      });

      // Center force
      node.vx -= node.x * 0.01;
      node.vy -= node.y * 0.01;

      // Damping
      node.vx *= 0.95;
      node.vy *= 0.95;

      // Update position
      node.x += node.vx;
      node.y += node.vy;
    });
  }, [graphData]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const render = () => {
      // Clear canvas
      ctx.fillStyle = "#0A0E17";
      ctx.fillRect(0, 0, width, height);

      // Draw links
      graphData.links.forEach(link => {
        const source = nodesRef.current.get(link.source as string);
        const target = nodesRef.current.get(link.target as string);
        if (source && target) {
          ctx.strokeStyle = link.type === "ally" ? "rgba(0, 255, 65, 0.2)" : "rgba(255, 51, 51, 0.2)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(centerX + source.x, centerY + source.y);
          ctx.lineTo(centerX + target.x, centerY + target.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      const nodes = Array.from(nodesRef.current.values());
      nodes.forEach(node => {
        const isHighlighted = highlightedFactionId === node.id;
        const isHovered = hoveredNodeId === node.id;

        ctx.fillStyle = isHighlighted ? "#FFD700" : node.color;
        ctx.globalAlpha = isHovered || isHighlighted ? 1 : 0.8;
        ctx.beginPath();
        ctx.arc(centerX + node.x, centerY + node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Draw label
        if (isHighlighted || isHovered) {
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "11px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(node.name, centerX + node.x, centerY + node.y - node.size - 10);
        }
      });

      simulate();
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [graphData, highlightedFactionId, hoveredNodeId, simulate]);

  // Handle mouse events
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - canvas.width / 2;
      const y = e.clientY - rect.top - canvas.height / 2;

      let foundNode: string | null = null;
      const nodes = Array.from(nodesRef.current.values());
      
      for (const node of nodes) {
        const dx = node.x - x;
        const dy = node.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < node.size + 5) {
          foundNode = node.id;
          break;
        }
      }

      setHoveredNodeId(foundNode);
      if (foundNode) {
        canvas.style.cursor = "pointer";
      } else {
        canvas.style.cursor = "grab";
      }
    },
    []
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - canvas.width / 2;
      const y = e.clientY - rect.top - canvas.height / 2;

      const nodes = Array.from(nodesRef.current.values());
      for (const node of nodes) {
        const dx = node.x - x;
        const dy = node.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < node.size + 5) {
          onNodeClick?.(node.id);
          break;
        }
      }
    },
    [onNodeClick]
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[#0A0E17] relative rounded-lg overflow-hidden border border-white/10"
      style={{ minHeight: "600px" }}
    >
      <canvas
        ref={canvasRef}
        width={containerRef.current?.clientWidth || 800}
        height={containerRef.current?.clientHeight || 600}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        className="w-full h-full"
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm border border-white/10 rounded p-3 text-xs font-mono text-white/70 space-y-1">
        <div className="text-[#D4AF37] font-bold mb-2">LEGEND</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#00FF41" }}></div>
          <span>Allies</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#FF3333" }}></div>
          <span>Enemies</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#D4AF37" }}></div>
          <span>Stasis</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#FF3333" }}></div>
          <span>Plasticity</span>
        </div>
      </div>

      {/* Controls Hint */}
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm border border-white/10 rounded p-2 text-xs font-mono text-white/50">
        <div>Hover to highlight</div>
        <div>Click node to select</div>
      </div>
    </div>
  );
};

export default FactionNetwork;
