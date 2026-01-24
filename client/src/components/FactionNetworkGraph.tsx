import { useEffect, useRef } from 'react';
import { topFactions, getFactionRelationship } from '@/lib/factionMetrics';

interface Node {
  id: string;
  label: string;
  power: number;
  alignment: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Link {
  source: string;
  target: string;
  type: 'ally' | 'enemy' | 'neutral';
}

export function FactionNetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Initialize nodes
    const nodes: Node[] = topFactions.map((faction, idx) => ({
      id: faction.factionId,
      label: faction.factionName,
      power: faction.totalPowerScore,
      alignment: faction.alignment,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    }));

    // Initialize links
    const links: Link[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const relationship = getFactionRelationship(nodes[i].id, nodes[j].id);
        links.push({
          source: nodes[i].id,
          target: nodes[j].id,
          type: relationship,
        });
      }
    }

    // Physics simulation
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(10, 14, 23, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply forces
      for (let i = 0; i < nodes.length; i++) {
        let fx = 0;
        let fy = 0;

        // Repulsion from other nodes
        for (let j = 0; j < nodes.length; j++) {
          if (i !== j) {
            const dx = nodes[j].x - nodes[i].x;
            const dy = nodes[j].y - nodes[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy) + 1;
            const force = 100 / (dist * dist);
            fx -= (dx / dist) * force;
            fy -= (dy / dist) * force;
          }
        }

        // Attraction to links
        links.forEach((link) => {
          if (link.source === nodes[i].id) {
            const target = nodes.find((n) => n.id === link.target);
            if (target) {
              const dx = target.x - nodes[i].x;
              const dy = target.y - nodes[i].y;
              const dist = Math.sqrt(dx * dx + dy * dy) + 1;
              const force = dist * 0.1;
              fx += (dx / dist) * force;
              fy += (dy / dist) * force;
            }
          } else if (link.target === nodes[i].id) {
            const source = nodes.find((n) => n.id === link.source);
            if (source) {
              const dx = source.x - nodes[i].x;
              const dy = source.y - nodes[i].y;
              const dist = Math.sqrt(dx * dx + dy * dy) + 1;
              const force = dist * 0.1;
              fx += (dx / dist) * force;
              fy += (dy / dist) * force;
            }
          }
        });

        // Damping
        nodes[i].vx = (nodes[i].vx + fx * 0.01) * 0.95;
        nodes[i].vy = (nodes[i].vy + fy * 0.01) * 0.95;

        // Update position
        nodes[i].x += nodes[i].vx;
        nodes[i].y += nodes[i].vy;

        // Boundary conditions
        if (nodes[i].x < 30) nodes[i].x = 30;
        if (nodes[i].x > canvas.width - 30) nodes[i].x = canvas.width - 30;
        if (nodes[i].y < 30) nodes[i].y = 30;
        if (nodes[i].y > canvas.height - 30) nodes[i].y = canvas.height - 30;
      }

      // Draw links
      links.forEach((link) => {
        const source = nodes.find((n) => n.id === link.source);
        const target = nodes.find((n) => n.id === link.target);
        if (!source || !target) return;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        if (link.type === 'ally') {
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
          ctx.lineWidth = 2;
        } else if (link.type === 'enemy') {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
        } else {
          ctx.strokeStyle = 'rgba(107, 114, 128, 0.2)';
          ctx.lineWidth = 1;
        }
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw nodes
      nodes.forEach((node) => {
        const radius = 5 + (node.power / 25) * 10;

        // Node glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 2);
        if (node.alignment === 'Stasis') {
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        } else if (node.alignment === 'Plasticity') {
          gradient.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(
          node.x - radius * 2,
          node.y - radius * 2,
          radius * 4,
          radius * 4
        );

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        if (node.alignment === 'Stasis') {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
        } else if (node.alignment === 'Plasticity') {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
        } else {
          ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
        }
        ctx.fill();

        // Node border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label.split(' ')[0], node.x, node.y);
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className="w-full h-full rounded border border-gray-700 overflow-hidden bg-[#0a0f14]">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      <div className="absolute bottom-4 left-4 text-xs text-gray-500 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Stasis Alignment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>Plasticity Alignment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Allied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>Enemies</span>
        </div>
      </div>
    </div>
  );
}
