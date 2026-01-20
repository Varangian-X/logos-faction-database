import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InfiniteFractal({
  width = 800,
  height = 600,
  type = 'mandelbrot', // mandelbrot, julia, burning_ship
  speed = 0.02,
  maxIterations = 100,
  colorScheme = 'cosmic',
  className
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const zoomRef = useRef({ level: 1, centerX: -0.5, centerY: 0 });
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);

    const colorSchemes = {
      cosmic: (iter, max) => {
        const t = iter / max;
        const r = Math.floor(9 * (1 - t) * t * t * t * 255);
        const g = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255);
        const b = Math.floor(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255);
        return [r, g, b];
      },
      fire: (iter, max) => {
        const t = iter / max;
        const r = Math.floor(255 * t);
        const g = Math.floor(255 * t * t);
        const b = Math.floor(255 * t * t * t);
        return [r, g, b];
      },
      ocean: (iter, max) => {
        const t = iter / max;
        const r = Math.floor(50 * t);
        const g = Math.floor(150 * t);
        const b = Math.floor(255 * (1 - t * 0.5));
        return [r, g, b];
      },
      psychedelic: (iter, max) => {
        const t = iter / max;
        const r = Math.floor(127 + 127 * Math.sin(t * Math.PI * 2));
        const g = Math.floor(127 + 127 * Math.sin(t * Math.PI * 2 + 2));
        const b = Math.floor(127 + 127 * Math.sin(t * Math.PI * 2 + 4));
        return [r, g, b];
      }
    };

    const getColor = colorSchemes[colorScheme] || colorSchemes.cosmic;

    const mandelbrot = (x0, y0) => {
      let x = 0, y = 0;
      let iteration = 0;

      while (x * x + y * y <= 4 && iteration < maxIterations) {
        const xTemp = x * x - y * y + x0;
        y = 2 * x * y + y0;
        x = xTemp;
        iteration++;
      }

      return iteration;
    };

    const julia = (x0, y0, cX = -0.7, cY = 0.27015) => {
      let x = x0, y = y0;
      let iteration = 0;

      while (x * x + y * y <= 4 && iteration < maxIterations) {
        const xTemp = x * x - y * y + cX;
        y = 2 * x * y + cY;
        x = xTemp;
        iteration++;
      }

      return iteration;
    };

    const burningShip = (x0, y0) => {
      let x = 0, y = 0;
      let iteration = 0;

      while (x * x + y * y <= 4 && iteration < maxIterations) {
        const xTemp = x * x - y * y + x0;
        y = Math.abs(2 * x * y) + y0;
        x = Math.abs(xTemp);
        iteration++;
      }

      return iteration;
    };

    const fractalFunctions = {
      mandelbrot,
      julia,
      burning_ship: burningShip
    };

    const render = () => {
      const { level, centerX, centerY } = zoomRef.current;
      const fractalFunc = fractalFunctions[type] || mandelbrot;

      const zoom = 1 / level;
      const offsetX = centerX;
      const offsetY = centerY;

      for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
          const x0 = (px / width - 0.5) * 4 * zoom + offsetX;
          const y0 = (py / height - 0.5) * 3 * zoom + offsetY;

          const iteration = fractalFunc(x0, y0);
          const pixelIndex = (py * width + px) * 4;

          if (iteration === maxIterations) {
            imageData.data[pixelIndex] = 0;
            imageData.data[pixelIndex + 1] = 0;
            imageData.data[pixelIndex + 2] = 0;
          } else {
            const [r, g, b] = getColor(iteration, maxIterations);
            imageData.data[pixelIndex] = r;
            imageData.data[pixelIndex + 1] = g;
            imageData.data[pixelIndex + 2] = b;
          }
          imageData.data[pixelIndex + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const animate = () => {
      if (!isPlaying) return;

      zoomRef.current.level *= (1 + speed);
      
      // Interesting zoom targets for different fractals
      const targets = {
        mandelbrot: { x: -0.7453, y: 0.1127 },
        julia: { x: 0, y: 0 },
        burning_ship: { x: -1.75, y: -0.03 }
      };

      const target = targets[type] || targets.mandelbrot;
      zoomRef.current.centerX += (target.x - zoomRef.current.centerX) * 0.01;
      zoomRef.current.centerY += (target.y - zoomRef.current.centerY) * 0.01;

      render();

      // Reset zoom after reaching deep level
      if (zoomRef.current.level > 1e14) {
        gsap.to(zoomRef.current, {
          level: 1,
          duration: 2,
          ease: 'power2.inOut',
          onUpdate: render
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    render();
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, type, speed, maxIterations, colorScheme, isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    zoomRef.current = { level: 1, centerX: type === 'burning_ship' ? -0.5 : -0.5, centerY: 0 };
  };

  return (
    <div className={cn('relative', className)}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-lg border border-cyan-500/30 shadow-2xl"
        style={{
          background: '#000',
          imageRendering: 'pixelated'
        }}
      />
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <Button
          size="sm"
          onClick={handlePlayPause}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button
          size="sm"
          onClick={handleReset}
          variant="outline"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-cyan-400 border border-cyan-500/30">
        Zoom: {zoomRef.current.level.toExponential(2)}
      </div>
    </div>
  );
}

// Preset variants
export function MandelbrotZoom({ className }) {
  return (
    <InfiniteFractal
      width={600}
      height={400}
      type="mandelbrot"
      speed={0.03}
      colorScheme="cosmic"
      className={className}
    />
  );
}

export function JuliaZoom({ className }) {
  return (
    <InfiniteFractal
      width={600}
      height={400}
      type="julia"
      speed={0.025}
      colorScheme="psychedelic"
      className={className}
    />
  );
}

export function BurningShipZoom({ className }) {
  return (
    <InfiniteFractal
      width={600}
      height={400}
      type="burning_ship"
      speed={0.02}
      colorScheme="fire"
      className={className}
    />
  );
}

// Dual Fractal View - Side by side comparison
export function DualFractalView({ className }) {
  return (
    <div className={cn('flex gap-4', className)}>
      <InfiniteFractal
        width={400}
        height={300}
        type="mandelbrot"
        speed={0.02}
        colorScheme="cosmic"
      />
      <InfiniteFractal
        width={400}
        height={300}
        type="julia"
        speed={0.02}
        colorScheme="ocean"
      />
    </div>
  );
}

// Interactive Fractal Explorer
export function InteractiveFractalExplorer({ className }) {
  const [config, setConfig] = useState({
    type: 'mandelbrot',
    colorScheme: 'cosmic',
    speed: 0.02
  });

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex gap-2">
        <select
          value={config.type}
          onChange={(e) => setConfig({ ...config, type: e.target.value })}
          className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-sm text-gray-200"
        >
          <option value="mandelbrot">Mandelbrot</option>
          <option value="julia">Julia</option>
          <option value="burning_ship">Burning Ship</option>
        </select>

        <select
          value={config.colorScheme}
          onChange={(e) => setConfig({ ...config, colorScheme: e.target.value })}
          className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-sm text-gray-200"
        >
          <option value="cosmic">Cosmic</option>
          <option value="fire">Fire</option>
          <option value="ocean">Ocean</option>
          <option value="psychedelic">Psychedelic</option>
        </select>

        <input
          type="range"
          min="0.01"
          max="0.05"
          step="0.001"
          value={config.speed}
          onChange={(e) => setConfig({ ...config, speed: parseFloat(e.target.value) })}
          className="w-32"
        />
      </div>

      <InfiniteFractal
        width={800}
        height={600}
        type={config.type}
        speed={config.speed}
        colorScheme={config.colorScheme}
      />
    </div>
  );
}