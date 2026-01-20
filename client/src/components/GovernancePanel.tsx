import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Scroll, MapPin, Plus } from 'lucide-react';
import { Governor, Edict, generateGovernor, EDICTS } from '@/lib/planetaryGovernance';
import { useCampaign } from '@/contexts/CampaignContext';

export function GovernancePanel() {
  const [governors, setGovernors] = useState<Governor[]>([]);
  const [activeEdicts, setActiveEdicts] = useState<{edictId: string, sectorId: string}[]>([]);

  const handleRecruitGovernor = () => {
    const newGovernor = generateGovernor();
    setGovernors([...governors, newGovernor]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Governors List */}
      <Card className="bg-black/40 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-serif text-[#D4AF37] flex items-center gap-2">
            <User className="w-5 h-5" /> Imperial Governors
          </CardTitle>
          <Button size="sm" onClick={handleRecruitGovernor} className="bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/40">
            <Plus className="w-4 h-4 mr-1" /> Recruit
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {governors.length === 0 ? (
                <div className="text-center py-8 text-white/40 italic">
                  No governors recruited. Recruit administrators to manage your sectors.
                </div>
              ) : (
                governors.map(gov => (
                  <div key={gov.id} className="p-3 rounded-lg border border-white/10 bg-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-white">{gov.title} {gov.name}</h4>
                        <div className="flex gap-2 mt-1">
                          {gov.traits.map(trait => (
                            <Badge key={trait} variant="outline" className="text-xs border-white/20 text-white/70">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge className={gov.assignedSectorId ? "bg-green-900/50 text-green-400" : "bg-yellow-900/50 text-yellow-400"}>
                        {gov.assignedSectorId ? "Assigned" : "Available"}
                      </Badge>
                    </div>
                    <div className="text-xs text-white/50 flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {gov.assignedSectorId ? `Governing Sector ${gov.assignedSectorId}` : "Awaiting Assignment"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Edicts Panel */}
      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-serif text-[#D4AF37] flex items-center gap-2">
            <Scroll className="w-5 h-5" /> Imperial Edicts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {EDICTS.map(edict => (
                <div key={edict.id} className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-medium text-white">{edict.name}</h4>
                    <span className="text-xs text-amber-400">{edict.cost.credits} CR</span>
                  </div>
                  <p className="text-xs text-white/60 mb-2">{edict.description}</p>
                  <div className="flex justify-between items-center text-xs text-white/40">
                    <span>Duration: {edict.duration} cycles</span>
                    <Button size="sm" variant="outline" className="h-6 text-xs border-white/20">
                      Enact
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
