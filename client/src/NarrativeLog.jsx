import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollText, ChevronDown } from 'lucide-react';

export default function NarrativeLog({ logs = [] }) {
  const scrollRef = useRef(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-900/80 rounded-xl border border-amber-900/30 h-full flex flex-col">
      <div className="p-4 border-b border-amber-900/30 flex items-center gap-2">
        <ScrollText className="w-4 h-4 text-amber-400" />
        <h3 className="text-amber-400 font-semibold uppercase tracking-wider text-sm">
          Chronicle of Events
        </h3>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth"
        style={{ maxHeight: '400px' }}
      >
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <p className="text-gray-500 text-sm italic text-center py-8">
              The chronicle awaits your deeds...
            </p>
          ) : (
            logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {/* Timeline connector */}
                {index < logs.length - 1 && (
                  <div className="absolute left-1.5 top-6 bottom-0 w-px bg-amber-900/30" />
                )}
                
                <div className="flex gap-3">
                  {/* Timeline dot */}
                  <div className="w-3 h-3 rounded-full bg-amber-500/50 border border-amber-400/50 mt-1.5 flex-shrink-0" />
                  
                  {/* Log content */}
                  <div className="flex-1 bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {log}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      
      {/* Scroll indicator */}
      <div className="p-2 border-t border-slate-700/30 flex justify-center">
        <ChevronDown className="w-4 h-4 text-gray-600 animate-bounce" />
      </div>
    </div>
  );
}