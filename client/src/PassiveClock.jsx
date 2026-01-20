import React from 'react';
import { motion } from 'framer-motion';

export default function PassiveClock({ segments = 0, maxSegments = 12 }) {
  const radius = 45;
  const centerX = 50;
  const centerY = 50;
  
  const createSegmentPath = (index) => {
    const startAngle = (index * 30 - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * 30 - 90) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="relative">
      <svg viewBox="0 0 100 100" className="w-32 h-32">
        {/* Background ring */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="rgba(212, 175, 55, 0.2)"
          strokeWidth="2"
        />
        
        {/* Segments */}
        {Array.from({ length: maxSegments }).map((_, i) => (
          <motion.path
            key={i}
            d={createSegmentPath(i)}
            fill={i < segments ? 'rgba(212, 175, 55, 0.8)' : 'rgba(30, 30, 40, 0.6)'}
            stroke="rgba(212, 175, 55, 0.5)"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          />
        ))}
        
        {/* Center decoration */}
        <circle
          cx={centerX}
          cy={centerY}
          r="12"
          fill="rgba(20, 20, 30, 0.9)"
          stroke="rgba(212, 175, 55, 0.6)"
          strokeWidth="1"
        />
        
        {/* Inner glow */}
        <circle
          cx={centerX}
          cy={centerY}
          r="6"
          fill="rgba(212, 175, 55, 0.3)"
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-mono text-amber-400/80 mt-16">
          {segments}/{maxSegments}
        </span>
      </div>
      
      <p className="text-center text-xs text-amber-500/70 mt-1 uppercase tracking-widest">
        Passive Clock
      </p>
    </div>
  );
}