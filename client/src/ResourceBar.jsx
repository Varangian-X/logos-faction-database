import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Zap, Eye, Shield } from 'lucide-react';

export default function ResourceBar({ credits, influence, intel, reputation }) {
  const resources = [
    { 
      label: 'Credits', 
      value: credits, 
      icon: Coins, 
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      borderColor: 'border-amber-400/30'
    },
    { 
      label: 'Influence', 
      value: influence, 
      icon: Zap, 
      color: 'text-violet-400',
      bgColor: 'bg-violet-400/10',
      borderColor: 'border-violet-400/30'
    },
    { 
      label: 'Intel', 
      value: intel, 
      icon: Eye, 
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      borderColor: 'border-cyan-400/30'
    },
    { 
      label: 'Reputation', 
      value: reputation, 
      icon: Shield, 
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      borderColor: 'border-emerald-400/30'
    }
  ];

  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {resources.map((resource, index) => (
        <motion.div
          key={resource.label}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${resource.bgColor} ${resource.borderColor}`}
        >
          <resource.icon className={`w-4 h-4 ${resource.color}`} />
          <div className="flex flex-col">
            <span className={`text-sm font-bold font-mono ${resource.color}`}>
              {typeof resource.value === 'number' ? resource.value.toLocaleString() : resource.value}
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
              {resource.label}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}