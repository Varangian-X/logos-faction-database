import React from 'react';
import { motion } from 'framer-motion';

export default function TurnClock({ turn = 1, year = 30492 }) {
  return (
    <div className="relative">
      <div className="w-32 h-32 relative">
        {/* Outer ring */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="turnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.8)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.8)" />
            </linearGradient>
          </defs>
          
          {/* Background hexagon pattern */}
          <polygon
            points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
            fill="rgba(20, 20, 35, 0.8)"
            stroke="url(#turnGradient)"
            strokeWidth="2"
          />
          
          {/* Inner hexagon */}
          <polygon
            points="50,20 75,35 75,65 50,80 25,65 25,35"
            fill="none"
            stroke="rgba(6, 182, 212, 0.3)"
            strokeWidth="1"
          />
        </svg>
        
        {/* Turn number display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-cyan-400 font-mono">
            {String(turn).padStart(2, '0')}
          </span>
          <span className="text-[10px] text-cyan-500/60 uppercase tracking-wider">
            Turn
          </span>
        </div>
      </div>
      
      <motion.div 
        className="text-center mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-xs text-violet-400/80 font-mono">
          {year} AD
        </p>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
          Imperial Calendar
        </p>
      </motion.div>
    </div>
  );
}