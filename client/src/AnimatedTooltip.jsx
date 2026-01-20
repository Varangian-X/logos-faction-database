import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AnimatedTooltip({ 
  children, 
  content, 
  position = 'top',
  delay = 0.3,
  className 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay * 1000);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionVariants = {
    top: {
      initial: { opacity: 0, y: 5, scale: 0.9 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 5, scale: 0.9 },
      className: 'bottom-full left-1/2 -translate-x-1/2 mb-2'
    },
    bottom: {
      initial: { opacity: 0, y: -5, scale: 0.9 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -5, scale: 0.9 },
      className: 'top-full left-1/2 -translate-x-1/2 mt-2'
    },
    left: {
      initial: { opacity: 0, x: 5, scale: 0.9 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 5, scale: 0.9 },
      className: 'right-full top-1/2 -translate-y-1/2 mr-2'
    },
    right: {
      initial: { opacity: 0, x: -5, scale: 0.9 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: -5, scale: 0.9 },
      className: 'left-full top-1/2 -translate-y-1/2 ml-2'
    }
  };

  const arrowPositions = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 rotate-180',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1 -rotate-90',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1 rotate-90'
  };

  const variant = positionVariants[position];

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
              mass: 0.5
            }}
            className={cn(
              "absolute z-50 pointer-events-none whitespace-nowrap",
              variant.className
            )}
          >
            <div className={cn(
              "px-3 py-2 rounded-lg text-xs font-medium shadow-xl",
              "bg-slate-800 border border-cyan-500/50 text-cyan-100",
              "backdrop-blur-sm",
              className
            )}>
              {content}
              
              {/* Arrow */}
              <div className={cn(
                "absolute w-2 h-2 bg-slate-800 border-cyan-500/50",
                "rotate-45",
                position === 'top' && "border-r border-b",
                position === 'bottom' && "border-l border-t",
                position === 'left' && "border-t border-r",
                position === 'right' && "border-b border-l",
                arrowPositions[position]
              )} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Convenience wrapper for different tooltip styles
export function InfoTooltip({ children, content, ...props }) {
  return (
    <AnimatedTooltip 
      content={content} 
      className="bg-blue-900 border-blue-500/50 text-blue-100"
      {...props}
    >
      {children}
    </AnimatedTooltip>
  );
}

export function WarningTooltip({ children, content, ...props }) {
  return (
    <AnimatedTooltip 
      content={content} 
      className="bg-amber-900 border-amber-500/50 text-amber-100"
      {...props}
    >
      {children}
    </AnimatedTooltip>
  );
}

export function ErrorTooltip({ children, content, ...props }) {
  return (
    <AnimatedTooltip 
      content={content} 
      className="bg-red-900 border-red-500/50 text-red-100"
      {...props}
    >
      {children}
    </AnimatedTooltip>
  );
}

export function SuccessTooltip({ children, content, ...props }) {
  return (
    <AnimatedTooltip 
      content={content} 
      className="bg-green-900 border-green-500/50 text-green-100"
      {...props}
    >
      {children}
    </AnimatedTooltip>
  );
}