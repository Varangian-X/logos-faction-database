import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Wrench, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const slotPositions = {
  head: { top: '5%', left: '50%', transform: 'translateX(-50%)' },
  torso: { top: '30%', left: '50%', transform: 'translateX(-50%)' },
  left_arm: { top: '35%', left: '15%' },
  right_arm: { top: '35%', right: '15%' },
  left_leg: { top: '65%', left: '35%' },
  right_leg: { top: '65%', right: '35%' },
  accessory_1: { bottom: '15%', left: '20%' },
  accessory_2: { bottom: '15%', right: '20%' }
};

const slotLabels = {
  head: 'Head',
  torso: 'Torso',
  left_arm: 'L-Arm',
  right_arm: 'R-Arm',
  left_leg: 'L-Leg',
  right_leg: 'R-Leg',
  accessory_1: 'Acc 1',
  accessory_2: 'Acc 2'
};

export default function HumanoidGearDisplay({ 
  gameState, 
  injuries = [],
  onUnequip,
  onRepair,
  compact = false 
}) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const inventory = gameState.gear_inventory || {};
  
  const getInjuryForSlot = (slot) => {
    const bodyPartMap = {
      head: 'head',
      torso: 'torso',
      left_arm: 'left_arm',
      right_arm: 'right_arm',
      left_leg: 'left_leg',
      right_leg: 'right_leg'
    };
    
    return injuries.find(inj => inj.body_part === bodyPartMap[slot]);
  };

  return (
    <Card className="bg-slate-900/80 border-cyan-900/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 uppercase tracking-wider text-sm flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Gear & Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Humanoid Display */}
        <div className="relative w-full aspect-[3/4] bg-slate-800/50 rounded-lg border border-slate-700/50 mb-4">
          {/* Humanoid silhouette SVG */}
          <svg 
            viewBox="0 0 200 300" 
            className="absolute inset-0 w-full h-full opacity-20"
          >
            {/* Head */}
            <circle cx="100" cy="30" r="20" fill="currentColor" className="text-cyan-500/30" />
            {/* Neck */}
            <rect x="95" y="48" width="10" height="15" fill="currentColor" className="text-cyan-500/30" />
            {/* Torso */}
            <rect x="75" y="63" width="50" height="70" rx="5" fill="currentColor" className="text-cyan-500/30" />
            {/* Left Arm */}
            <rect x="45" y="70" width="28" height="60" rx="5" fill="currentColor" className="text-cyan-500/30" />
            {/* Right Arm */}
            <rect x="127" y="70" width="28" height="60" rx="5" fill="currentColor" className="text-cyan-500/30" />
            {/* Left Leg */}
            <rect x="75" y="135" width="20" height="80" rx="5" fill="currentColor" className="text-cyan-500/30" />
            {/* Right Leg */}
            <rect x="105" y="135" width="20" height="80" rx="5" fill="currentColor" className="text-cyan-500/30" />
          </svg>
          
          {/* Gear Slots */}
          {Object.entries(slotPositions).map(([slot, position]) => {
            const item = inventory[slot];
            const injury = getInjuryForSlot(slot);
            const hasIssue = item?.damaged || injury;
            
            return (
              <button
                key={slot}
                onClick={() => setSelectedSlot(selectedSlot === slot ? null : slot)}
                className={cn(
                  "absolute w-12 h-12 rounded-lg border-2 transition-all",
                  "flex items-center justify-center text-xs font-bold",
                  item 
                    ? hasIssue
                      ? "bg-red-900/50 border-red-500 text-red-300"
                      : "bg-cyan-900/50 border-cyan-500 text-cyan-300"
                    : "bg-slate-800/50 border-slate-600 text-gray-500",
                  selectedSlot === slot && "ring-2 ring-amber-400 scale-110"
                )}
                style={position}
              >
                {injury ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : item ? (
                  <Shield className="w-4 h-4" />
                ) : (
                  <span className="text-[8px]">{slotLabels[slot]}</span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Selected Slot Details */}
        {selectedSlot && (
          <div className="bg-slate-800/80 rounded-lg border border-cyan-500/30 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300">
                {slotLabels[selectedSlot]}
              </span>
              <button
                onClick={() => setSelectedSlot(null)}
                className="text-gray-500 hover:text-gray-300"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            
            {inventory[selectedSlot] ? (
              <>
                <div>
                  <p className="text-sm font-semibold text-gray-200">
                    {inventory[selectedSlot].name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[9px]">
                      Armor: {inventory[selectedSlot].armor_value}
                    </Badge>
                    {inventory[selectedSlot].damaged && (
                      <Badge className="text-[9px] bg-red-500/20 text-red-400 border-red-500/50">
                        Damaged
                      </Badge>
                    )}
                  </div>
                  {inventory[selectedSlot].special_effects?.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {inventory[selectedSlot].special_effects.map((effect, i) => (
                        <p key={i} className="text-[10px] text-cyan-400">• {effect}</p>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {inventory[selectedSlot].damaged && onRepair && (
                    <Button
                      size="sm"
                      onClick={() => onRepair(selectedSlot)}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 h-7 text-xs"
                    >
                      <Wrench className="w-3 h-3 mr-1" />
                      Repair (200₵)
                    </Button>
                  )}
                  {onUnequip && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUnequip(selectedSlot)}
                      className="flex-1 h-7 text-xs"
                    >
                      Unequip
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                {getInjuryForSlot(selectedSlot) ? (
                  <div className="bg-red-900/20 border border-red-500/30 rounded p-2">
                    <p className="text-xs text-red-300 font-semibold">
                      Injury: {getInjuryForSlot(selectedSlot).severity}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Heals in {getInjuryForSlot(selectedSlot).turns_to_heal} turns
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Empty slot - no gear equipped</p>
                )}
              </>
            )}
          </div>
        )}
        
        {/* Total Armor */}
        <div className="mt-4 pt-3 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Total Armor Value</span>
            <span className="text-cyan-300 font-bold">
              {Object.values(inventory).reduce((sum, item) => 
                sum + (item && !item.damaged ? item.armor_value || 0 : 0), 0
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}