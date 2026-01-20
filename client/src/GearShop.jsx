import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, Shield, Sparkles, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { gearDatabase } from './GearInventorySystem';

const rarityColors = {
  common: 'text-gray-400 border-gray-500/50',
  uncommon: 'text-green-400 border-green-500/50',
  rare: 'text-blue-400 border-blue-500/50',
  legendary: 'text-purple-400 border-purple-500/50'
};

export default function GearShop({ credits, currentGear = {}, onPurchase, onClose }) {
  const [selectedSlot, setSelectedSlot] = useState('all');
  
  const gearBySlot = {};
  Object.values(gearDatabase).forEach(gear => {
    if (!gearBySlot[gear.slot]) gearBySlot[gear.slot] = [];
    gearBySlot[gear.slot].push(gear);
  });
  
  const slots = ['all', 'head', 'torso', 'left_arm', 'right_arm', 'left_leg', 'right_leg', 'accessory_1'];
  const displayGear = selectedSlot === 'all' 
    ? Object.values(gearDatabase) 
    : gearBySlot[selectedSlot] || [];
  
  const isEquipped = (gearId) => {
    return Object.values(currentGear).some(item => item?.item_id === gearId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-cyan-500/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-cyan-400" />
              <div>
                <CardTitle className="text-cyan-400">Imperial Armory</CardTitle>
                <p className="text-xs text-gray-500">Credits: {credits}₵</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-gray-400">
              Close
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Slot Filter */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {slots.map(slot => (
              <Button
                key={slot}
                size="sm"
                variant={selectedSlot === slot ? 'default' : 'outline'}
                onClick={() => setSelectedSlot(slot)}
                className={cn(
                  "text-xs whitespace-nowrap",
                  selectedSlot === slot && "bg-cyan-600"
                )}
              >
                {slot === 'all' ? 'All' : slot.replace('_', ' ')}
              </Button>
            ))}
          </div>
          
          {/* Gear Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayGear.map((gear, i) => {
              const canAfford = credits >= gear.price;
              const equipped = isEquipped(gear.id);
              
              return (
                <motion.div
                  key={gear.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    "bg-slate-800/50 rounded-lg border p-3",
                    equipped ? "border-green-500/50" : "border-slate-700/50"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-200">{gear.name}</h4>
                      <Badge 
                        variant="outline" 
                        className={cn("text-[9px] mt-1", rarityColors[gear.rarity])}
                      >
                        {gear.rarity}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-400">
                        <DollarSign className="w-3 h-3" />
                        <span className="text-sm font-bold">{gear.price}</span>
                      </div>
                      {gear.armor_value > 0 && (
                        <div className="flex items-center gap-1 text-cyan-400 mt-1">
                          <Shield className="w-3 h-3" />
                          <span className="text-xs">{gear.armor_value}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    {gear.special_effects.map((effect, i) => (
                      <p key={i} className="text-[10px] text-cyan-300 flex items-center gap-1">
                        <Sparkles className="w-2 h-2" />
                        {effect}
                      </p>
                    ))}
                  </div>
                  
                  <Button
                    size="sm"
                    disabled={!canAfford || equipped}
                    onClick={() => onPurchase && onPurchase(gear)}
                    className={cn(
                      "w-full h-7 text-xs",
                      equipped 
                        ? "bg-green-600/50" 
                        : canAfford 
                          ? "bg-cyan-600 hover:bg-cyan-700"
                          : "bg-slate-700"
                    )}
                  >
                    {equipped ? 'Equipped' : canAfford ? 'Purchase' : 'Insufficient Credits'}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}