import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

export default function RotatingRings({
  ringCount = 3,
  size = 200,
  thickness = 4,
  speed = 2,
  colors = ['#06b6d4', '#8b5cf6', '#f59e0b'],
  blur = false,
  className
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const rings = containerRef.current.querySelectorAll('.rotating-ring');
    
    rings.forEach((ring, index) => {
      // Each ring rotates on different axes for complex motion
      gsap.to(ring, {
        rotationX: 360,
        rotationY: 360 * (index % 2 === 0 ? 1 : -1),
        rotationZ: 360 * (index % 3 === 0 ? 1 : -1),
        duration: speed * (index + 1),
        repeat: -1,
        ease: 'none'
      });
    });
  }, [speed, ringCount]);

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{
        width: size,
        height: size,
        perspective: '1000px',
        perspectiveOrigin: 'center center'
      }}
    >
      {Array.from({ length: ringCount }).map((_, index) => {
        const scale = 1 - (index * 0.2);
        const delay = index * 0.2;
        const color = colors[index % colors.length];

        return (
          <div
            key={index}
            className="rotating-ring absolute inset-0"
            style={{
              transformStyle: 'preserve-3d',
              animation: `float-${index} ${3 + index}s ease-in-out infinite`,
              animationDelay: `${delay}s`
            }}
          >
            <div
              className={cn(
                'absolute inset-0 rounded-full border',
                blur && 'blur-sm'
              )}
              style={{
                borderWidth: thickness,
                borderColor: color,
                transform: `scale(${scale})`,
                boxShadow: `0 0 20px ${color}, inset 0 0 20px ${color}`
              }}
            />
          </div>
        );
      })}

      <style jsx>{`
        @keyframes float-0 {
          0%, 100% { transform: translateZ(0px); }
          50% { transform: translateZ(50px); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateZ(0px); }
          50% { transform: translateZ(-30px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateZ(0px); }
          50% { transform: translateZ(40px); }
        }
      `}</style>
    </div>
  );
}

// Preset variants
export function LoadingRings({ className }) {
  return (
    <RotatingRings
      ringCount={3}
      size={120}
      thickness={3}
      speed={1.5}
      colors={['#06b6d4', '#8b5cf6', '#f59e0b']}
      blur={false}
      className={className}
    />
  );
}

export function HeroRings({ className }) {
  return (
    <RotatingRings
      ringCount={5}
      size={400}
      thickness={6}
      speed={3}
      colors={['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444']}
      blur={true}
      className={className}
    />
  );
}

export function CompactRings({ className }) {
  return (
    <RotatingRings
      ringCount={2}
      size={60}
      thickness={2}
      speed={1}
      colors={['#06b6d4', '#8b5cf6']}
      className={className}
    />
  );
}

// Advanced 3D Ring System with particles
export function AdvancedRotatingRings({
  className,
  size = 300,
  interactive = false
}) {
  const containerRef = useRef(null);
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rings = container.querySelectorAll('.advanced-ring');

    rings.forEach((ring, index) => {
      const tl = gsap.timeline({ repeat: -1 });
      
      tl.to(ring, {
        rotationX: 360,
        duration: 4 + index,
        ease: 'none'
      });
      
      tl.to(ring, {
        rotationY: 360,
        duration: 3 + index,
        ease: 'none'
      }, 0);
      
      tl.to(ring, {
        rotationZ: 360,
        duration: 5 + index,
        ease: 'none'
      }, 0);
    });
  }, []);

  const handleMouseMove = (e) => {
    if (!interactive || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    
    setRotation({ x: y * 30, y: x * 30 });
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{
        width: size,
        height: size,
        perspective: '1200px',
        perspectiveOrigin: 'center center'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => interactive && setRotation({ x: 0, y: 0 })}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        {/* Main Rings */}
        {[
          { color: '#06b6d4', scale: 1, opacity: 0.8, thickness: 4 },
          { color: '#8b5cf6', scale: 0.85, opacity: 0.7, thickness: 3 },
          { color: '#f59e0b', scale: 0.7, opacity: 0.6, thickness: 3 },
          { color: '#10b981', scale: 0.55, opacity: 0.5, thickness: 2 },
          { color: '#ef4444', scale: 0.4, opacity: 0.4, thickness: 2 }
        ].map((ring, index) => (
          <div
            key={index}
            className="advanced-ring absolute inset-0"
            style={{
              transformStyle: 'preserve-3d'
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: `${ring.thickness}px solid ${ring.color}`,
                transform: `scale(${ring.scale})`,
                opacity: ring.opacity,
                boxShadow: `
                  0 0 20px ${ring.color},
                  0 0 40px ${ring.color}40,
                  inset 0 0 20px ${ring.color}40
                `,
                filter: 'blur(1px)'
              }}
            />
            
            {/* Orbital particles */}
            {Array.from({ length: 8 }).map((_, pIndex) => {
              const angle = (pIndex / 8) * Math.PI * 2;
              const radius = (size / 2) * ring.scale;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <div
                  key={pIndex}
                  className="absolute"
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: ring.color,
                    left: '50%',
                    top: '50%',
                    transform: `translate(${x}px, ${y}px)`,
                    boxShadow: `0 0 10px ${ring.color}`,
                    animation: `pulse-${index}-${pIndex} ${2 + index * 0.3}s ease-in-out infinite`,
                    animationDelay: `${pIndex * 0.1}s`
                  }}
                />
              );
            })}
          </div>
        ))}

        {/* Center glow */}
        <div
          className="absolute inset-0 m-auto rounded-full"
          style={{
            width: '20%',
            height: '20%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)',
            animation: 'pulse-glow 2s ease-in-out infinite'
          }}
        />
      </motion.div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
          }
          50% { 
            transform: scale(1.2);
            opacity: 1;
          }
        }

        ${Array.from({ length: 5 }).map((_, ringIndex) => 
          Array.from({ length: 8 }).map((_, pIndex) => `
            @keyframes pulse-${ringIndex}-${pIndex} {
              0%, 100% { 
                transform: translate(${Math.cos((pIndex / 8) * Math.PI * 2) * (size / 2) * (1 - ringIndex * 0.2)}px, ${Math.sin((pIndex / 8) * Math.PI * 2) * (size / 2) * (1 - ringIndex * 0.2)}px) scale(1);
                opacity: 0.8;
              }
              50% { 
                transform: translate(${Math.cos((pIndex / 8) * Math.PI * 2) * (size / 2) * (1 - ringIndex * 0.2)}px, ${Math.sin((pIndex / 8) * Math.PI * 2) * (size / 2) * (1 - ringIndex * 0.2)}px) scale(1.5);
                opacity: 1;
              }
            }
          `).join('\n')
        ).join('\n')}
      `}</style>
    </div>
  );
}

// Orbital Ring System - Multiple rings orbiting around center
export function OrbitalRings({ className, size = 250 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const orbits = containerRef.current.querySelectorAll('.orbit');
    
    orbits.forEach((orbit, index) => {
      gsap.to(orbit, {
        rotation: 360,
        duration: 3 + index * 0.5,
        repeat: -1,
        ease: 'none'
      });

      const ring = orbit.querySelector('.orbit-ring');
      gsap.to(ring, {
        rotationX: 360,
        rotationY: 360,
        duration: 2 + index * 0.3,
        repeat: -1,
        ease: 'none'
      });
    });
  }, []);

  const orbitConfigs = [
    { radius: 0.8, color: '#06b6d4', thickness: 3, tilt: 0 },
    { radius: 0.65, color: '#8b5cf6', thickness: 3, tilt: 60 },
    { radius: 0.5, color: '#f59e0b', thickness: 2, tilt: 120 }
  ];

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{
        width: size,
        height: size,
        perspective: '1000px'
      }}
    >
      <div
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {orbitConfigs.map((config, index) => (
          <div
            key={index}
            className="orbit absolute inset-0"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${config.tilt}deg)`
            }}
          >
            <div
              className="orbit-ring absolute inset-0 rounded-full"
              style={{
                transformStyle: 'preserve-3d',
                border: `${config.thickness}px solid ${config.color}`,
                transform: `scale(${config.radius})`,
                boxShadow: `0 0 15px ${config.color}, inset 0 0 15px ${config.color}40`
              }}
            />
          </div>
        ))}

        {/* Center core */}
        <div
          className="absolute inset-0 m-auto rounded-full"
          style={{
            width: '15%',
            height: '15%',
            background: 'radial-gradient(circle, #fff 0%, #06b6d4 50%, transparent 100%)',
            boxShadow: '0 0 30px #06b6d4',
            animation: 'pulse-core 2s ease-in-out infinite'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes pulse-core {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.8;
          }
          50% { 
            transform: scale(1.3);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// Interlocked Rings - Multiple rings interlocked in 3D space
export function InterlockedRings({ className, size = 200 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const rings = containerRef.current.querySelectorAll('.interlocked-ring');
    
    rings.forEach((ring, index) => {
      gsap.to(ring, {
        rotationY: 360,
        duration: 3 + index * 0.5,
        repeat: -1,
        ease: 'none'
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{
        width: size,
        height: size,
        perspective: '800px'
      }}
    >
      <div
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Ring 1 - Vertical */}
        <div
          className="interlocked-ring absolute inset-0 rounded-full"
          style={{
            transformStyle: 'preserve-3d',
            border: '4px solid #06b6d4',
            boxShadow: '0 0 20px #06b6d4',
            transform: 'rotateY(0deg)'
          }}
        />

        {/* Ring 2 - Horizontal */}
        <div
          className="interlocked-ring absolute inset-0 rounded-full"
          style={{
            transformStyle: 'preserve-3d',
            border: '4px solid #8b5cf6',
            boxShadow: '0 0 20px #8b5cf6',
            transform: 'rotateX(90deg)'
          }}
        />

        {/* Ring 3 - Diagonal */}
        <div
          className="interlocked-ring absolute inset-0 rounded-full"
          style={{
            transformStyle: 'preserve-3d',
            border: '4px solid #f59e0b',
            boxShadow: '0 0 20px #f59e0b',
            transform: 'rotateZ(45deg) rotateX(45deg)'
          }}
        />
      </div>
    </div>
  );
}