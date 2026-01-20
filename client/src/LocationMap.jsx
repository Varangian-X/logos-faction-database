import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Rocket, AlertTriangle, Lock, Eye, Sparkles, Star, Zap } from 'lucide-react';
import { locations, canDiscoverLocation, isLocationRevealed } from '@/components/exploration/LocationData';

const locationsList = Object.values(locations);

const tierColors = {
  mese: 'text-cyan-400 bg-cyan-400',
  chrysopolis: 'text-amber-400 bg-amber-400',
  cisterns: 'text-violet-400 bg-violet-400'
};

export default function LocationMap({ currentLocation, onTravel, gameState }) {
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [particles, setParticles] = useState([]);
  
  const discoveredLocations = gameState?.discovered_locations || ['new_roma'];
  
  // Generate ambient particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="bg-slate-900/80 rounded-xl border border-amber-900/30 p-4 relative">
      <h3 className="text-amber-400 font-semibold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        Imperial Cartography
      </h3>
      
      {/* Map Container */}
      <div className="relative w-full aspect-video bg-slate-950/80 rounded-lg border border-slate-700/50 overflow-hidden">
        {/* Animated background nebula effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-amber-900/20 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute inset-0 bg-gradient-to-tl from-violet-900/20 via-blue-900/20 to-cyan-900/20 animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-cyan-400/30"
              style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-amber-500" />
          </svg>
        </div>
        
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full">
          {locationsList.map((loc, i) => 
            locationsList.slice(i + 1).map((loc2, j) => {
              const revealed1 = isLocationRevealed(loc, gameState);
              const revealed2 = isLocationRevealed(loc2, gameState);
              if (!revealed1 || !revealed2) return null;
              
              const distance = Math.sqrt(
                Math.pow(loc.coordinates.x - loc2.coordinates.x, 2) + Math.pow(loc.coordinates.y - loc2.coordinates.y, 2)
              );
              if (distance < 40) {
                return (
                  <line
                    key={`${loc.id}-${loc2.id}`}
                    x1={`${loc.coordinates.x}%`}
                    y1={`${loc.coordinates.y}%`}
                    x2={`${loc2.coordinates.x}%`}
                    y2={`${loc2.coordinates.y}%`}
                    stroke="rgba(212, 175, 55, 0.2)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              }
              return null;
            })
          )}
        </svg>
        
        {/* Location markers */}
        {locationsList.map((location) => {
          const isRevealed = isLocationRevealed(location, gameState);
          const canDiscover = canDiscoverLocation(location, gameState);
          const isDiscovered = discoveredLocations.includes(location.id);
          const isHidden = location.hidden && !isDiscovered;
          const isCurrentLocation = currentLocation === location.name;
          const colorClass = tierColors[location.tier] || tierColors.mese;
          
          // Don't show if not revealed
          if (!isRevealed) return null;
          
          return (
            <motion.div
              key={location.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 ${
                isHidden ? 'opacity-40' : 'cursor-pointer'
              }`}
              style={{ left: `${location.coordinates.x}%`, top: `${location.coordinates.y}%` }}
              onHoverStart={() => !isHidden && setHoveredLocation(location)}
              onHoverEnd={() => setHoveredLocation(null)}
              onClick={() => !isHidden && setSelectedLocation(location)}
              whileHover={!isHidden ? { scale: 1.2 } : {}}
            >
              <div className="relative">
                {/* Pulsing rings for current location */}
                {isCurrentLocation && (
                  <>
                    <motion.div
                      className={`absolute inset-0 w-8 h-8 -left-2 -top-2 rounded-full ${colorClass.split(' ')[1]} opacity-20`}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                      className={`absolute inset-0 w-8 h-8 -left-2 -top-2 rounded-full ${colorClass.split(' ')[1]} opacity-20`}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    />
                  </>
                )}
                
                {/* Outer glow */}
                <div className={`absolute inset-0 w-6 h-6 rounded-full ${colorClass.split(' ')[1]} opacity-30 blur-sm`} />
                
                {/* Marker */}
                {isHidden ? (
                  <div className="w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center relative overflow-hidden">
                    <Eye className="w-2 h-2 text-slate-500" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                ) : (
                  <div className={`w-4 h-4 rounded-full border-2 ${colorClass.split(' ')[0]} ${
                    isCurrentLocation 
                      ? colorClass.split(' ')[1] 
                      : 'bg-slate-900'
                  } border-current flex items-center justify-center relative overflow-hidden`}>
                    {/* Shimmer effect on hover */}
                    {hoveredLocation?.id === location.id && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                      />
                    )}
                    
                    {/* Discovery indicator */}
                    {!isDiscovered && canDiscover && (
                      <div className="absolute -top-1 -right-1 w-2 h-2">
                        <Sparkles className="w-2 h-2 text-cyan-400 animate-pulse" />
                        <motion.div
                          className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-400"
                          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    )}
                    
                    {/* Star particles for special locations */}
                    {location.uniqueEvents && location.uniqueEvents.length > 0 && isDiscovered && (
                      <>
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                              x: [0, Math.cos(i * 120 * Math.PI / 180) * 8, 0],
                              y: [0, Math.sin(i * 120 * Math.PI / 180) * 8, 0]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.3
                            }}
                          >
                            <Star className="w-1 h-1 text-amber-400 fill-amber-400" />
                          </motion.div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Label */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className={`text-[10px] ${isHidden ? 'text-slate-600' : colorClass.split(' ')[0]} drop-shadow-lg`}>
                  {isHidden ? '???' : location.name}
                </span>
              </div>
            </motion.div>
          );
        })}
        
        {/* Hover tooltip */}
        {hoveredLocation && !hoveredLocation.hidden && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute z-20 bg-slate-900/95 border border-amber-500/30 rounded-lg overflow-hidden max-w-xs pointer-events-none backdrop-blur-sm"
            style={{
              left: `${Math.min(Math.max(hoveredLocation.coordinates.x, 20), 80)}%`,
              top: `${hoveredLocation.coordinates.y + 8}%`,
              transform: 'translateX(-50%)',
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)'
            }}
          >
            {hoveredLocation.imageUrl && (
              <div className="relative h-24 overflow-hidden">
                <img 
                  src={hoveredLocation.imageUrl} 
                  alt={hoveredLocation.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                {/* Animated scan line effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent h-8"
                  animate={{ y: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            )}
            <div className="p-3 relative">
              {/* Ambient glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
              <p className="text-amber-400 font-semibold text-sm">
                {hoveredLocation.name}
                {!discoveredLocations.includes(hoveredLocation.id) && (
                  <span className="ml-2 text-[10px] text-cyan-400">● New</span>
                )}
              </p>
              <p className="text-gray-500 text-[10px] uppercase">{hoveredLocation.sector}</p>
              <p className="text-gray-300 text-xs mt-1">{hoveredLocation.description}</p>
            
            {hoveredLocation.npcs && hoveredLocation.npcs.length > 0 && (
              <div className="mt-2 text-[10px] text-gray-500">
                NPCs: {hoveredLocation.npcs.slice(0, 2).join(', ')}
              </div>
            )}
            
            {hoveredLocation.factionPresence && hoveredLocation.factionPresence.length > 0 && (
              <div className="mt-1 flex gap-1 flex-wrap">
                {hoveredLocation.factionPresence.map(f => (
                  <span key={f} className="text-[9px] px-1 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    {f.replace('_', ' ')}
                  </span>
                ))}
              </div>
            )}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Travel Button */}
      <AnimatePresence>
        {selectedLocation && selectedLocation.name !== currentLocation && !selectedLocation.hidden && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 rounded-lg border border-cyan-500/30 overflow-hidden relative"
            style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)' }}
          >
            {selectedLocation.imageUrl && (
              <div className="relative h-32 overflow-hidden">
                <motion.img 
                  src={selectedLocation.imageUrl} 
                  alt={selectedLocation.name}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                
                {/* Animated scan lines */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-16"
                  animate={{ y: ['-100%', '200%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
                
                {/* Energy particles */}
                <div className="absolute inset-0">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full bg-cyan-400"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                        y: [0, -20]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4
                      }}
                    />
                  ))}
                </div>
                
                <div className="absolute bottom-2 left-3 z-10">
                  <motion.p 
                    className="text-cyan-400 font-semibold text-lg drop-shadow-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {selectedLocation.name}
                  </motion.p>
                  <motion.p 
                    className="text-gray-300 text-xs drop-shadow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {selectedLocation.sector}
                  </motion.p>
                </div>
              </div>
            )}
          <div className="p-3 bg-slate-800/50">
            <p className="text-xs text-gray-400 mb-2">{selectedLocation.description}</p>
            
            {selectedLocation.resources && (
              <div className="mt-2">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Resources:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedLocation.resources.map(r => (
                    <span key={r} className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {r.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {selectedLocation.npcs && (
              <div className="mt-2">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Notable NPCs:</p>
                <p className="text-xs text-gray-400">{selectedLocation.npcs.join(', ')}</p>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-slate-800/50 border-t border-slate-700/50 relative">
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 to-transparent pointer-events-none" />
            
            <motion.button
              onClick={() => {
                onTravel && onTravel(selectedLocation);
                setSelectedLocation(null);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 text-sm transition-all relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Button shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              
              <Rocket className="w-4 h-4 relative z-10" />
              <span className="relative z-10">
                {discoveredLocations.includes(selectedLocation.id) ? 'Travel Here' : 'Discover & Travel'}
              </span>
              
              {/* Sparkle effect on hover */}
              <motion.div
                className="absolute right-2 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: 1, scale: 1 }}
              >
                <Zap className="w-3 h-3 text-cyan-400" />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}