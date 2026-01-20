import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Book, Swords, Users, Shield, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const HOUSE_FACILITIES = {
  training_grounds: {
    name: 'Training Grounds',
    icon: Swords,
    cost: 8000,
    buildTime: 3,
    benefits: 'Members train 50% faster, +10% military competence',
    effect: { training_speed: 1.5, military_bonus: 10 }
  },
  grand_library: {
    name: 'Grand Library',
    icon: Book,
    cost: 10000,
    buildTime: 4,
    benefits: '+2 intel per turn, members gain insight faster',
    effect: { intel_per_turn: 2, insight_bonus: 15 }
  },
  council_chamber: {
    name: 'Council Chamber',
    icon: Crown,
    cost: 12000,
    buildTime: 4,
    benefits: 'Unlock house decisions, +1 influence per turn',
    effect: { influence_per_turn: 1, unlocks_decisions: true }
  },
  security_complex: {
    name: 'Security Complex',
    icon: Shield,
    cost: 7000,
    buildTime: 3,
    benefits: 'Reduces intrigue detection risk by 15%, protects family',
    effect: { counter_intel: 15, protection: 20 }
  },
  meditation_sanctum: {
    name: 'Meditation Sanctum',
    icon: Users,
    cost: 6000,
    buildTime: 2,
    benefits: 'Increases member loyalty by 5% per turn',
    effect: { loyalty_boost: 5 }
  }
};

export default function HouseInfrastructurePanel({
  houseFacilities = [],
  resources,
  onBuildFacility,
  onUpgradeFacility,
  isProcessing
}) {
  const activeFacilities = houseFacilities.filter(f => f.status === 'active');
  const buildingFacilities = houseFacilities.filter(f => f.status === 'building');
  
  return (
    <div className="space-y-4">
      <Card className="bg-slate-900/80 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            House Facilities ({activeFacilities.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Active Facilities */}
          {activeFacilities.map((facility, i) => {
            const type = HOUSE_FACILITIES[facility.type];
            const Icon = type.icon;
            
            return (
              <div key={facility.id || i} className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/30">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="text-xs font-bold text-cyan-300">{type.name}</p>
                      <p className="text-[10px] text-gray-500">Level {facility.level || 1}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 text-[9px]">Active</Badge>
                </div>
                
                <p className="text-[10px] text-gray-400 mb-2">{type.benefits}</p>
                
                <Button
                  onClick={() => onUpgradeFacility(facility.id)}
                  disabled={isProcessing || (resources?.credits || 0) < 5000}
                  size="sm"
                  className="w-full bg-purple-600 hover:bg-purple-700 h-6 text-xs"
                >
                  Upgrade (5000₵) +20% effectiveness
                </Button>
              </div>
            );
          })}
          
          {/* Building Facilities */}
          {buildingFacilities.map((facility, i) => {
            const type = HOUSE_FACILITIES[facility.type];
            const Icon = type.icon;
            const progress = ((type.buildTime - facility.turns_remaining) / type.buildTime) * 100;
            
            return (
              <div key={facility.id || i} className="bg-slate-800/50 rounded-lg p-3 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-amber-400" />
                  <p className="text-xs font-bold text-amber-300">{type.name}</p>
                  <Badge className="ml-auto bg-amber-500/20 text-amber-300 text-[9px]">
                    {facility.turns_remaining}t
                  </Badge>
                </div>
                <Progress value={progress} className="h-1" />
              </div>
            );
          })}
        </CardContent>
      </Card>
      
      {/* Build New Facilities */}
      <Card className="bg-slate-900/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm">Construct Facility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(HOUSE_FACILITIES).map(([key, type]) => {
            const hasBuilding = houseFacilities.some(f => f.type === key);
            const canAfford = (resources?.credits || 0) >= type.cost;
            const Icon = type.icon;
            
            return (
              <div
                key={key}
                className={cn(
                  "bg-slate-800/50 rounded-lg p-3 border",
                  hasBuilding ? "border-green-500/30 opacity-60" : "border-slate-700"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-gray-200">{type.name}</span>
                  </div>
                  <span className="text-xs text-purple-400">{type.cost}₵</span>
                </div>
                
                <p className="text-[10px] text-gray-400 mb-2">{type.benefits}</p>
                <p className="text-[10px] text-gray-500">Build time: {type.buildTime} turns</p>
                
                {!hasBuilding && (
                  <Button
                    onClick={() => onBuildFacility(key)}
                    disabled={isProcessing || !canAfford}
                    size="sm"
                    className="w-full mt-2 bg-purple-600 hover:bg-purple-700 h-6 text-xs"
                  >
                    {canAfford ? 'Construct' : 'Insufficient Credits'}
                  </Button>
                )}
                
                {hasBuilding && (
                  <Badge className="w-full justify-center mt-2 bg-green-500/20 text-green-400 text-[9px]">
                    Already Built
                  </Badge>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}