import React, { useState, useMemo } from 'react';
import { useCampaign, SavedScenario } from '@/contexts/CampaignContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { MissionOutcomeRecorder } from './MissionOutcomeRecorder';
import { PredictivePlanner } from './PredictivePlanner';
import { calculateCampaignState } from '@/lib/factionDynamics';

export function CampaignLog() {
  const { savedScenarios, deleteScenario, updateScenarioStatus, updateScenarioNotes } = useCampaign();
  const campaignState = useMemo(() => calculateCampaignState(savedScenarios), [savedScenarios]);
  const factionReputation = useMemo(() => Object.fromEntries(
    Object.entries(campaignState.factionStandings).map(([k, v]) => [k, v.reputation])
  ), [campaignState]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'failed'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [factionFilter, setFactionFilter] = useState<string>('all');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const types = useMemo(() => {
    const unique = new Set(savedScenarios.map(s => s.type));
    return Array.from(unique).sort();
  }, [savedScenarios]);

  const factions = useMemo(() => {
    const unique = new Set(savedScenarios.map(s => s.faction));
    return Array.from(unique).sort();
  }, [savedScenarios]);

  const filteredScenarios = useMemo(() => {
    return savedScenarios.filter(scenario => {
      const matchesSearch = 
        scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scenario.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scenario.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || scenario.status === statusFilter;
      const matchesType = typeFilter === 'all' || scenario.type === typeFilter;
      const matchesFaction = factionFilter === 'all' || scenario.faction === factionFilter;

      return matchesSearch && matchesStatus && matchesType && matchesFaction;
    });
  }, [savedScenarios, searchTerm, statusFilter, typeFilter, factionFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'active':
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      case 'active':
      default:
        return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <Input
          placeholder="Search scenarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-background border-border"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-2 py-1 bg-card border border-border rounded text-sm"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-2 py-1 bg-card border border-border rounded text-sm"
            >
              <option value="all">All</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Faction</label>
            <select
              value={factionFilter}
              onChange={(e) => setFactionFilter(e.target.value)}
              className="w-full px-2 py-1 bg-card border border-border rounded text-sm"
            >
              <option value="all">All</option>
              {factions.map(faction => (
                <option key={faction} value={faction}>{faction}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
                setFactionFilter('all');
              }}
              className="w-full"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredScenarios.length} of {savedScenarios.length} scenarios
      </div>

      {/* Scenarios List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-4">
        {filteredScenarios.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No scenarios match your filters
          </div>
        ) : (
          filteredScenarios.map(scenario => (
            <div key={scenario.id} className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(scenario.status)}
                    <h3 className="font-semibold text-foreground">{scenario.title}</h3>
                    <Badge className={getStatusColor(scenario.status)}>
                      {scenario.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteScenario(scenario.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-1 text-foreground">{scenario.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Faction:</span>
                  <span className="ml-1 text-foreground">{scenario.faction}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <span className="ml-1 text-foreground">{scenario.location}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Year:</span>
                  <span className="ml-1 text-foreground">{scenario.year}</span>
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={scenario.status === 'active' ? 'default' : 'outline'}
                  onClick={() => updateScenarioStatus(scenario.id, 'active')}
                >
                  Active
                </Button>
                <Button
                  size="sm"
                  variant={scenario.status === 'completed' ? 'default' : 'outline'}
                  onClick={() => updateScenarioStatus(scenario.id, 'completed')}
                >
                  Completed
                </Button>
                <Button
                  size="sm"
                  variant={scenario.status === 'failed' ? 'default' : 'outline'}
                  onClick={() => updateScenarioStatus(scenario.id, 'failed')}
                >
                  Failed
                </Button>
              </div>

              {/* Outcome Recorder for Active Missions */}
              {scenario.status === 'active' && (
                <div className="space-y-4">
                  <MissionOutcomeRecorder mission={scenario} />
                  <PredictivePlanner mission={scenario} currentReputation={factionReputation} />
                </div>
              )}

              {/* Show Branched Missions */}
              {scenario.outcome && (
                <div className="bg-blue-900/20 border border-blue-700/50 rounded p-3">
                  <p className="text-xs text-blue-300 mb-2">Mission Outcome: {scenario.outcome.outcome.toUpperCase()}</p>
                  {scenario.outcome.consequences.length > 0 && (
                    <div className="text-xs text-blue-200/80 space-y-1">
                      {scenario.outcome.consequences.map((c, i) => (
                        <p key={i}>• {c}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              <div className="bg-background rounded p-2">
                {editingNotes === scenario.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add GM notes..."
                      className="w-full px-2 py-1 bg-card border border-border rounded text-sm text-foreground"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          updateScenarioNotes(scenario.id, noteText);
                          setEditingNotes(null);
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingNotes(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setEditingNotes(scenario.id);
                      setNoteText(scenario.notes || '');
                    }}
                    className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                  >
                    {scenario.notes ? (
                      <p>{scenario.notes}</p>
                    ) : (
                      <p className="italic">Click to add GM notes...</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
