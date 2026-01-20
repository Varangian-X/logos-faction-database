import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Zap, Eye } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function AIEventGenerator({ gameState, factions, onEventGenerated, houses }) {
  const [generating, setGenerating] = useState(false);
  const [generatedEvent, setGeneratedEvent] = useState(null);
  const [eventType, setEventType] = useState('general');

  const generateDynamicEvent = async (type = 'general') => {
    setGenerating(true);
    setGeneratedEvent(null);
    setEventType(type);

    try {
      const activeFactions = factions.filter(f => 
        Math.abs(gameState.faction_relations?.[f.faction_id] || 0) > 30
      );
      
      const rivalHouses = (houses || []).filter(h => 
        h.player_house_relation < -20 || h.rivalries?.includes(gameState.house_id)
      );

      const recentEvents = (gameState.game_log || []).slice(-10).join('; ');
      
      let prompt;
      
      if (type === 'intrigue') {
        prompt = `You are the Logos AI generating a HOUSE INTRIGUE EVENT for the Cyber-Byzantine Imperium.

CURRENT GAME STATE:
- Turn: ${gameState.turn_number}, Year: ${gameState.year}
- Player: ${gameState.character_name}, House ${gameState.house_name}
- House Capabilities: Muscle ${gameState.house_health?.muscle || 50}, Streets ${gameState.house_health?.streets || 50}, Intel ${gameState.house_health?.intel || 50}
- Intel Resources: ${gameState.intel}

RIVAL HOUSES:
${rivalHouses.map(h => `- ${h.house_name}: Power ${h.power_level}, Relation ${h.player_house_relation}`).join('\n') || 'None yet'}

HOUSE RELATIONS:
${(houses || []).map(h => `- ${h.house_name}: ${h.player_house_relation > 0 ? '+' : ''}${h.player_house_relation}`).join('\n')}

RECENT ACTIONS:
${recentEvents || 'Early game'}

Generate a HOUSE INTRIGUE event involving:
1. Covert operations (espionage, sabotage, assassination attempts)
2. Rival house actions against the player
3. Intelligence gathering opportunities
4. Street-level underworld conflicts
5. Secrets and betrayals between houses

The event should:
- Focus on house-vs-house intrigue and covert warfare
- Provide choices for different intrigue approaches (stealth, force, manipulation)
- Have consequences affecting house capabilities (Streets, Intel, Muscle)
- Potentially trigger counter-operations or escalation
- Include intelligence report elements

Return ONLY valid JSON.`;
      } else {
        prompt = `You are the Logos AI generating a DYNAMIC WORLD EVENT for the Cyber-Byzantine Imperium.

CURRENT GAME STATE:
- Turn: ${gameState.turn_number}, Year: ${gameState.year}
- Player: ${gameState.character_name}, House ${gameState.house_name}
- Tier: ${gameState.tier}
- Location: ${gameState.current_location}
- Reputation: ${gameState.reputation}
- Credits: ${gameState.credits}, Influence: ${gameState.influence}, Intel: ${gameState.intel}

FACTION RELATIONS (player perspective):
${Object.entries(gameState.faction_relations || {})
  .map(([f, v]) => `- ${f}: ${v > 0 ? '+' : ''}${v}`)
  .join('\n')}

ACTIVE WORLD EVENTS:
${(gameState.active_world_events || []).map(e => e.name).join(', ') || 'None'}

RECENT PLAYER ACTIONS:
${recentEvents || 'Early game'}

Generate a contextual world event that:
1. Responds to player's recent actions and faction standings
2. Creates meaningful choices with different faction impacts
3. Has potential to trigger new quests or diplomatic scenarios
4. Affects the game world in interesting ways
5. Feels natural and emergent from current state

The event should have:
- Compelling narrative description (3-4 sentences)
- 3-4 player choice options with clear faction/resource impacts
- Potential triggers for follow-up quests or NPC interactions
- Duration of 3-7 turns
- High stakes that matter to player's position

Return ONLY valid JSON.`;
      }

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            event_type: { 
              type: "string",
              enum: ["crisis", "opportunity", "faction_conflict", "political_shift"]
            },
            choices: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  faction_impact: {
                    type: "object",
                    additionalProperties: { type: "integer" }
                  },
                  resource_changes: {
                    type: "object",
                    properties: {
                      credits: { type: "integer" },
                      influence: { type: "integer" },
                      intel: { type: "integer" },
                      reputation: { type: "integer" }
                    }
                  },
                  triggers_quest: { type: "boolean" },
                  unlocks_location: { type: "string" },
                  narrative_consequence: { type: "string" }
                }
              }
            },
            turns_duration: { type: "integer" },
            urgency: {
              type: "string",
              enum: ["low", "medium", "high", "critical"]
            }
          }
        }
      });

      result.triggered_turn = gameState.turn_number;
      result.location = gameState.current_location;
      result.isIntrigue = type === 'intrigue';

      setGeneratedEvent(result);
      toast.success(type === 'intrigue' ? 'Intrigue event generated!' : 'Dynamic event generated by Logos!');
    } catch (error) {
      console.error('Event generation failed:', error);
      toast.error('Failed to commune with Logos');
    } finally {
      setGenerating(false);
    }
  };

  const handleApplyEvent = async () => {
    if (!generatedEvent) return;

    try {
      await base44.entities.NarrativeEvent.create({
        event_id: generatedEvent.id,
        title: generatedEvent.name,
        description: generatedEvent.description,
        event_type: 'passive',
        location: generatedEvent.location,
        choices: generatedEvent.choices,
        is_repeatable: false
      });

      const activeEvents = gameState.active_world_events || [];
      await base44.entities.GameState.update(gameState.id, {
        active_world_events: [
          ...activeEvents,
          {
            id: generatedEvent.id,
            name: generatedEvent.name,
            turns_remaining: generatedEvent.turns_duration,
            triggered_turn: gameState.turn_number
          }
        ]
      });

      toast.success('Event activated in game world!');
      setGeneratedEvent(null);
      if (onEventGenerated) onEventGenerated();
    } catch (error) {
      console.error('Failed to apply event:', error);
      toast.error('Failed to activate event');
    }
  };

  return (
    <Card className="bg-slate-900/80 border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI Dynamic Event Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-gray-400">
          The Logos analyzes current game state, faction dynamics, and player actions to generate 
          contextual world events that respond to the evolving narrative.
        </p>

        <div className="flex gap-2">
          <Button
            onClick={() => generateDynamicEvent('general')}
            disabled={generating}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700"
          >
            {generating && eventType === 'general' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            General Event
          </Button>
          
          <Button
            onClick={() => generateDynamicEvent('intrigue')}
            disabled={generating}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {generating && eventType === 'intrigue' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Eye className="w-4 h-4 mr-2" />
            )}
            Intrigue Event
          </Button>
        </div>

        {generatedEvent && (
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-lg font-bold text-amber-300">{generatedEvent.name}</h4>
                <Badge className="mt-1 bg-cyan-500/20 text-cyan-400 text-[9px]">
                  {generatedEvent.event_type}
                </Badge>
                <Badge className="mt-1 ml-2 bg-red-500/20 text-red-400 text-[9px]">
                  {generatedEvent.urgency} urgency
                </Badge>
              </div>
            </div>

            <p className="text-sm text-gray-300">{generatedEvent.description}</p>

            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-semibold">Player Choices:</p>
              {generatedEvent.choices?.map((choice, i) => (
                <div key={i} className="bg-slate-900/50 rounded p-2 text-xs">
                  <p className="text-gray-300 mb-1">{choice.text}</p>
                  {choice.faction_impact && Object.keys(choice.faction_impact).length > 0 && (
                    <p className="text-[10px] text-amber-400">
                      Faction Impact: {Object.entries(choice.faction_impact)
                        .map(([f, v]) => `${f} ${v > 0 ? '+' : ''}${v}`)
                        .join(', ')}
                    </p>
                  )}
                  {choice.narrative_consequence && (
                    <p className="text-[10px] text-purple-400 mt-1">{choice.narrative_consequence}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleApplyEvent}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Zap className="w-3 h-3 mr-2" />
                Activate Event
              </Button>
              <Button
                onClick={() => setGeneratedEvent(null)}
                variant="outline"
                className="flex-1"
              >
                Discard
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}