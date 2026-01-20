import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Clock, Zap } from 'lucide-react';

export default function PathFlowVisualizer({ 
  steps = [],
  currentStep = 0,
  onStepClick,
  orientation = 'vertical', // vertical or horizontal
  animated = true,
  showProgress = true,
  className
}) {
  const svgRef = useRef(null);
  const pathRefs = useRef([]);
  const [hoveredStep, setHoveredStep] = useState(null);

  useEffect(() => {
    if (!animated || !svgRef.current) return;

    // Animate all paths up to current step
    pathRefs.current.forEach((path, index) => {
      if (!path) return;

      const pathLength = path.getTotalLength();
      
      // Set initial state
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength
      });

      if (index < currentStep) {
        // Animate completed paths
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.8,
          delay: index * 0.2,
          ease: "power2.inOut"
        });
      }
    });
  }, [currentStep, animated]);

  // Generate path data between nodes
  const generatePath = (index, isVertical) => {
    const spacing = 120;
    const offset = 60;
    
    if (isVertical) {
      const y1 = offset + index * spacing;
      const y2 = offset + (index + 1) * spacing;
      const x = 50;
      const controlY = (y1 + y2) / 2;
      
      return `M ${x} ${y1} C ${x} ${controlY}, ${x} ${controlY}, ${x} ${y2}`;
    } else {
      const x1 = offset + index * spacing;
      const x2 = offset + (index + 1) * spacing;
      const y = 50;
      const controlX = (x1 + x2) / 2;
      
      return `M ${x1} ${y} C ${controlX} ${y}, ${controlX} ${y}, ${x2} ${y}`;
    }
  };

  const isVertical = orientation === 'vertical';
  const svgWidth = isVertical ? 100 : steps.length * 120 + 60;
  const svgHeight = isVertical ? steps.length * 120 + 60 : 100;

  return (
    <div className={cn("relative", className)}>
      {/* SVG Paths */}
      <svg
        ref={svgRef}
        className="absolute inset-0 pointer-events-none"
        width={svgWidth}
        height={svgHeight}
        style={{ 
          left: isVertical ? '0' : '0',
          top: isVertical ? '0' : '0'
        }}
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(139, 92, 246)" stopOpacity="0.8" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {steps.slice(0, -1).map((step, index) => (
          <path
            key={index}
            ref={el => pathRefs.current[index] = el}
            d={generatePath(index, isVertical)}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="2"
            filter="url(#glow)"
            opacity={index < currentStep ? 1 : 0.2}
          />
        ))}
      </svg>

      {/* Step Nodes */}
      <div className={cn(
        "relative flex gap-4",
        isVertical ? "flex-col" : "flex-row items-center"
      )}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;
          const isClickable = onStepClick && (isCompleted || isCurrent);

          return (
            <motion.div
              key={step.id || index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
              className={cn(
                "relative group",
                isVertical ? "ml-0" : "mt-0"
              )}
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <motion.button
                onClick={() => isClickable && onStepClick(step, index)}
                disabled={!isClickable}
                className={cn(
                  "relative rounded-xl p-4 transition-all duration-300",
                  "min-w-[240px] text-left",
                  isCompleted && "bg-green-900/20 border-2 border-green-500/50 cursor-pointer hover:bg-green-900/30 hover:border-green-400",
                  isCurrent && "bg-cyan-900/30 border-2 border-cyan-500 shadow-lg shadow-cyan-500/20",
                  isUpcoming && "bg-slate-900/40 border-2 border-slate-700/50",
                  !isClickable && "cursor-default"
                )}
                whileHover={isClickable ? { scale: 1.02, y: -2 } : {}}
                whileTap={isClickable ? { scale: 0.98 } : {}}
              >
                {/* Icon/Status Indicator */}
                <div className="flex items-start gap-3">
                  <motion.div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      isCompleted && "bg-green-500/20 border border-green-500/50",
                      isCurrent && "bg-cyan-500/20 border border-cyan-500/50",
                      isUpcoming && "bg-slate-700/20 border border-slate-600/50"
                    )}
                    animate={isCurrent ? {
                      boxShadow: [
                        "0 0 0px rgba(6, 182, 212, 0)",
                        "0 0 20px rgba(6, 182, 212, 0.4)",
                        "0 0 0px rgba(6, 182, 212, 0)"
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : isCurrent ? (
                      <Zap className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500" />
                    )}
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    {/* Step Number */}
                    <div className={cn(
                      "text-[10px] uppercase tracking-wider font-semibold mb-1",
                      isCompleted && "text-green-400",
                      isCurrent && "text-cyan-400",
                      isUpcoming && "text-slate-600"
                    )}>
                      Step {index + 1}
                    </div>

                    {/* Title */}
                    <h4 className={cn(
                      "font-bold mb-1 text-sm",
                      isCompleted && "text-green-300",
                      isCurrent && "text-cyan-300",
                      isUpcoming && "text-slate-500"
                    )}>
                      {step.title}
                    </h4>

                    {/* Description */}
                    {step.description && (
                      <p className={cn(
                        "text-xs leading-relaxed",
                        isCompleted && "text-gray-400",
                        isCurrent && "text-gray-300",
                        isUpcoming && "text-gray-600"
                      )}>
                        {step.description}
                      </p>
                    )}

                    {/* Progress/Status */}
                    {showProgress && step.progress !== undefined && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="text-gray-500">Progress</span>
                          <span className={cn(
                            "font-semibold",
                            isCompleted && "text-green-400",
                            isCurrent && "text-cyan-400",
                            isUpcoming && "text-slate-600"
                          )}>
                            {step.progress}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className={cn(
                              "h-full rounded-full",
                              isCompleted && "bg-gradient-to-r from-green-500 to-emerald-500",
                              isCurrent && "bg-gradient-to-r from-cyan-500 to-blue-500",
                              isUpcoming && "bg-slate-700"
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${step.progress || 0}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    {step.metadata && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {step.metadata.duration && (
                          <div className="flex items-center gap-1 text-[10px] text-gray-500">
                            <Clock className="w-3 h-3" />
                            {step.metadata.duration}
                          </div>
                        )}
                        {step.metadata.tags?.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[9px] bg-slate-800 text-gray-400 border border-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Glow Effect */}
                {hoveredStep === index && isClickable && (
                  <motion.div
                    layoutId="stepHover"
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 pointer-events-none"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Specialized variant for quest progression
export function QuestFlowVisualizer({ quest, currentStage, onStageClick }) {
  const steps = (quest?.stages || []).map((stage, index) => ({
    id: stage.stage_id,
    title: `Stage ${stage.stage_id + 1}`,
    description: stage.description,
    progress: index < currentStage ? 100 : index === currentStage ? 50 : 0,
    metadata: {
      tags: stage.objectives?.slice(0, 2) || []
    }
  }));

  return (
    <PathFlowVisualizer
      steps={steps}
      currentStep={currentStage}
      onStepClick={onStageClick}
      showProgress={true}
    />
  );
}

// Specialized variant for intrigue operations
export function IntrigueFlowVisualizer({ operation, currentPhase, onPhaseClick }) {
  const steps = (operation?.phases || []).map((phase, index) => ({
    id: phase.id,
    title: phase.name,
    description: phase.description,
    progress: index < currentPhase ? 100 : index === currentPhase ? phase.risk_level || 0 : 0,
    metadata: {
      duration: `${phase.choices?.length || 0} choices`,
      tags: [`Risk: ${phase.risk_level || 0}%`]
    }
  }));

  return (
    <PathFlowVisualizer
      steps={steps}
      currentStep={currentPhase}
      onStepClick={onPhaseClick}
      showProgress={true}
      className="max-w-md mx-auto"
    />
  );
}

// Specialized variant for multi-stage events
export function EventFlowVisualizer({ event, currentStage, flags = [] }) {
  const eventData = event?.stages || [];
  
  const steps = eventData.map((stage, index) => ({
    id: stage.stage_id,
    title: stage.title,
    description: stage.description?.substring(0, 80) + '...',
    progress: index < currentStage ? 100 : index === currentStage ? 60 : 0,
    metadata: {
      tags: stage.is_combat_stage ? ['Combat'] : stage.is_conclusion ? ['Finale'] : []
    }
  }));

  return (
    <PathFlowVisualizer
      steps={steps}
      currentStep={currentStage}
      showProgress={true}
      className="max-w-md mx-auto"
    />
  );
}

// Animated connection paths with particles
export function AnimatedFlowPath({ 
  fromX, 
  fromY, 
  toX, 
  toY, 
  active = false,
  particles = 3 
}) {
  const pathRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!active || !pathRef.current) return;

    const path = pathRef.current;
    const pathLength = path.getTotalLength();

    // Animate path drawing
    gsap.fromTo(path,
      { strokeDashoffset: pathLength },
      { 
        strokeDashoffset: 0,
        duration: 1.2,
        ease: "power2.out"
      }
    );

    // Animate particles along path
    particlesRef.current.forEach((particle, i) => {
      if (!particle) return;
      
      gsap.fromTo(particle,
        { offsetDistance: "0%" },
        {
          offsetDistance: "100%",
          duration: 2,
          delay: i * 0.4,
          repeat: -1,
          ease: "none"
        }
      );
    });
  }, [active]);

  const controlX = (fromX + toX) / 2;
  const controlY = (fromY + toY) / 2;
  const pathD = `M ${fromX} ${fromY} Q ${controlX} ${controlY}, ${toX} ${toY}`;

  return (
    <g>
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="url(#flowGradient)"
        strokeWidth="2"
        strokeDasharray={pathRef.current?.getTotalLength() || 0}
        filter="url(#glow)"
      />
      
      {active && [...Array(particles)].map((_, i) => (
        <circle
          key={i}
          ref={el => particlesRef.current[i] = el}
          r="3"
          fill="rgb(6, 182, 212)"
          style={{
            offsetPath: `path('${pathD}')`,
            offsetDistance: "0%"
          }}
        >
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="1s"
            repeatCount="indefinite"
            begin={`${i * 0.4}s`}
          />
        </circle>
      ))}
    </g>
  );
}

// Timeline visualizer with branching paths
export function BranchingPathFlow({ 
  nodes = [], 
  connections = [], 
  activeNodeId,
  onNodeClick 
}) {
  const containerRef = useRef(null);
  const pathRefs = useRef([]);

  useEffect(() => {
    // Animate active paths
    connections.forEach((conn, index) => {
      const path = pathRefs.current[index];
      if (!path) return;

      const pathLength = path.getTotalLength();
      
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength
      });

      if (conn.active) {
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1,
          delay: conn.delay || index * 0.15,
          ease: "power2.inOut"
        });
      }
    });
  }, [connections]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px]">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(6, 182, 212)" />
            <stop offset="100%" stopColor="rgb(139, 92, 246)" />
          </linearGradient>
          
          <filter id="pathGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {connections.map((conn, index) => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          
          if (!fromNode || !toNode) return null;

          const controlX = (fromNode.x + toNode.x) / 2;
          const controlY = Math.min(fromNode.y, toNode.y) - 50;

          return (
            <path
              key={index}
              ref={el => pathRefs.current[index] = el}
              d={`M ${fromNode.x} ${fromNode.y} Q ${controlX} ${controlY}, ${toNode.x} ${toNode.y}`}
              fill="none"
              stroke={conn.active ? "url(#branchGradient)" : "rgba(100, 116, 139, 0.3)"}
              strokeWidth={conn.active ? "3" : "2"}
              filter={conn.active ? "url(#pathGlow)" : "none"}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, index) => {
        const isActive = node.id === activeNodeId;
        const isClickable = onNodeClick && node.clickable !== false;

        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            style={{
              position: 'absolute',
              left: node.x - 60,
              top: node.y - 30
            }}
            className="w-32"
          >
            <motion.button
              onClick={() => isClickable && onNodeClick(node)}
              disabled={!isClickable}
              className={cn(
                "w-full p-3 rounded-lg border-2 text-center transition-all",
                isActive && "bg-cyan-500/20 border-cyan-500 shadow-lg shadow-cyan-500/30",
                !isActive && node.completed && "bg-green-500/10 border-green-500/50",
                !isActive && !node.completed && "bg-slate-800/50 border-slate-700",
                isClickable && "cursor-pointer hover:scale-105"
              )}
              whileHover={isClickable ? { y: -2 } : {}}
            >
              <div className="text-xs font-bold text-cyan-300 truncate">
                {node.label}
              </div>
              {node.subtitle && (
                <div className="text-[10px] text-gray-500 mt-1">
                  {node.subtitle}
                </div>
              )}
            </motion.button>
          </motion.div>
        );
      })}
    </div>
  );
}