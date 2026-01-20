import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Globe, Shield, Swords, Users, Play, Settings, BookOpen } from 'lucide-react';

export default function MainMenu() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-black to-black" />
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%)',
               backgroundSize: '100% 4px'
             }} 
        />
      </div>

      <div className="relative z-10 max-w-4xl w-full p-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Title Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-serif text-[#D4AF37] tracking-tighter mb-2">
              LOGOS
            </h1>
            <h2 className="text-4xl md:text-6xl font-serif text-white/90 tracking-widest mb-6">
              IMPERIUM
            </h2>
            <div className="h-1 w-32 bg-[#D4AF37] mb-6" />
            <p className="text-lg text-gray-400 max-w-md leading-relaxed">
              Command the factions. Navigate the intrigue. Shape the destiny of the Chrysopolis in a universe of digital divinity.
            </p>
          </motion.div>
        </div>

        {/* Menu Options */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4"
          >
            <Button 
              className="w-full h-16 text-lg bg-[#D4AF37] hover:bg-[#B59530] text-black font-bold tracking-widest transition-all hover:scale-105"
              onClick={() => setLocation('/game')}
            >
              <Play className="mr-3 h-6 w-6" /> ENTER SIMULATION
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-12 border-white/20 hover:bg-white/10 hover:border-[#D4AF37] transition-colors"
                onClick={() => setLocation('/faction-command')}
              >
                <Shield className="mr-2 h-4 w-4" /> FACTIONS
              </Button>
              <Button 
                variant="outline" 
                className="h-12 border-white/20 hover:bg-white/10 hover:border-[#D4AF37] transition-colors"
                onClick={() => setLocation('/game/battle')}
              >
                <Swords className="mr-2 h-4 w-4" /> SKIRMISH
              </Button>
            </div>

            <Button 
              variant="ghost" 
              className="w-full text-gray-500 hover:text-white hover:bg-white/5"
            >
              <Settings className="mr-2 h-4 w-4" /> SYSTEM CONFIGURATION
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-8 text-xs text-gray-600 font-mono">
        v0.9.4 [VERMILION CLEARANCE REQUIRED]
      </div>
    </div>
  );
}
