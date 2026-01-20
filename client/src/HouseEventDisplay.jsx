import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HouseEventDisplay({ 
  event, 
  members,
  gameState,
  onChoice, 
  isProcessing 
}) {
  if (!event) return null;
  
  return (
    <Card className="bg-gradient-to-br from-amber-900/40 to-purple-900/40 border-2 border-amber-500/50">
      <CardHeader>
        <CardTitle className="text-amber-300 flex items-center gap-2">
          <Crown className="w-5 h-5" />
          House Event: {event.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-200 leading-relaxed">
          {event.description}
        </p>
        
        <div className="space-y-2">
          {event.choices.map((choice, i) => {
            const canAfford = !choice.cost || Object.entries(choice.cost).every(([resource, amount]) => 
              (gameState[resource] || 0) >= amount
            );
            
            const meetsRequirements = !choice.required_trait || 
              (gameState.character_traits?.[choice.required_trait] || 3) >= (choice.required_value || 5);
            
            const canChoose = canAfford && meetsRequirements;
            
            return (
              <Button
                key={i}
                onClick={() => onChoice(choice, i)}
                disabled={isProcessing || !canChoose}
                className={cn(
                  "w-full text-left h-auto py-3 px-4 justify-start",
                  canChoose 
                    ? "bg-slate-800 hover:bg-slate-700 border-amber-500/30" 
                    : "bg-slate-900/50 opacity-50 cursor-not-allowed"
                )}
                variant="outline"
              >
                <div className="w-full">
                  <p className="text-sm text-gray-200 mb-2">{choice.text}</p>
                  
                  {/* Costs */}
                  {choice.cost && (
                    <div className="flex gap-2 mb-2">
                      {Object.entries(choice.cost).map(([resource, amount]) => (
                        <Badge key={resource} className="bg-red-500/20 text-red-300 text-[9px]">
                          -{amount} {resource}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Requirements */}
                  {choice.required_trait && (
                    <Badge className={cn(
                      "text-[9px] mb-2",
                      meetsRequirements ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    )}>
                      Requires {choice.required_trait} {choice.required_value}
                    </Badge>
                  )}
                  
                  {/* Effects */}
                  <div className="flex flex-wrap gap-1">
                    {choice.effects && Object.entries(choice.effects).map(([key, value]) => (
                      <Badge key={key} className={cn(
                        "text-[9px]",
                        value > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      )}>
                        {value > 0 ? '+' : ''}{value} {key.replace('_', ' ')}
                      </Badge>
                    ))}
                    
                    {choice.faction_impact && Object.entries(choice.faction_impact).map(([faction, value]) => (
                      <Badge key={faction} className={cn(
                        "text-[9px]",
                        value > 0 ? "bg-cyan-500/20 text-cyan-400" : "bg-red-500/20 text-red-400"
                      )}>
                        {value > 0 ? '+' : ''}{value} {faction}
                      </Badge>
                    ))}
                    
                    {choice.risk_conflict && (
                      <Badge className="bg-red-500/20 text-red-400 text-[9px]">
                        ⚠️ May cause conflict
                      </Badge>
                    )}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}