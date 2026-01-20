import { useState } from "react";
import { ArrowLeft, Trash2, Download, FileJson, BarChart3, List, Upload, GitBranch, Clock, Network, Trophy } from "lucide-react";
import { FileText } from "lucide-react";
import { useCampaign } from "@/contexts/CampaignContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { exportCampaignToJSON, exportCampaignToPDF } from "@/lib/campaignExport";
import { CampaignLog } from "@/components/CampaignLog";
import { CampaignStats } from "@/components/CampaignStats";
import { CampaignImport } from "@/components/CampaignImport";
import { CampaignBranching } from "@/components/CampaignBranching";
import { MissionTimeline } from "@/components/MissionTimeline";
import { FactionRelationshipNetwork } from "@/components/FactionRelationshipNetwork";
import { MilestoneTracker } from "@/components/MilestoneTracker";
import { CustomMilestoneCreator } from "@/components/CustomMilestoneCreator";
import { checkMilestones, CAMPAIGN_MILESTONES, Milestone } from "@/lib/milestoneSystem";
import { calculateCampaignState } from "@/lib/factionDynamics";

export default function CampaignPage() {
  const { savedScenarios, clearCampaign } = useCampaign();
  const [activeTab, setActiveTab] = useState<'log' | 'stats' | 'branching' | 'timeline' | 'network' | 'milestones'>('log');
  const [importOpen, setImportOpen] = useState(false);
  const [customMilestones, setCustomMilestones] = useState<Milestone[]>([]);

  const campaignState = calculateCampaignState(savedScenarios);
  const milestones = checkMilestones(savedScenarios, Object.fromEntries(
    Object.entries(campaignState.factionStandings).map(([k, v]) => [k, v.reputation])
  ), [...CAMPAIGN_MILESTONES, ...customMilestones]);

  const handleAddCustomMilestone = (milestone: Milestone) => {
    setCustomMilestones(prev => [...prev, milestone]);
  };

  return (
    <div className="h-screen w-full bg-[#050505] text-white overflow-hidden flex flex-col font-sans">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-black/60 backdrop-blur-md px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-serif tracking-widest text-[#D4AF37]">CAMPAIGN LOG</h1>
            <p className="text-[10px] font-mono text-white/50 tracking-[0.2em] uppercase">Mission Archive // Active Scenarios</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setImportOpen(true)}
            className="bg-white/5 hover:bg-white/10 text-white border-white/20"
            title="Import campaign from JSON"
          >
            <Upload className="w-3 h-3 mr-2" />
            Import
          </Button>
          {savedScenarios.length > 0 && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => exportCampaignToPDF(savedScenarios)}
                className="bg-white/5 hover:bg-white/10 text-white border-white/20"
                title="Export as PDF"
              >
                <Download className="w-3 h-3 mr-2" />
                PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => exportCampaignToJSON(savedScenarios)}
                className="bg-white/5 hover:bg-white/10 text-white border-white/20"
                title="Export as JSON"
              >
                <FileJson className="w-3 h-3 mr-2" />
                JSON
              </Button>
              <div className="w-px h-8 bg-white/10 mx-2" />
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={clearCampaign}
                className="bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50"
              >
                <Trash2 className="w-3 h-3 mr-2" />
                Clear Log
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Import Dialog */}
      <CampaignImport open={importOpen} onOpenChange={setImportOpen} />

      {/* Tabs */}
      {savedScenarios.length > 0 && (
        <div className="relative z-20 border-b border-white/10 bg-black/40 px-6 flex gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('log')}
            className={`py-3 px-4 font-mono text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
              activeTab === 'log'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <List className="w-4 h-4 inline mr-2" />
            Campaign Log
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-3 px-4 font-mono text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
              activeTab === 'stats'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('branching')}
            className={`py-3 px-4 font-mono text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
              activeTab === 'branching'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <GitBranch className="w-4 h-4 inline mr-2" />
            Campaign Chains
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 font-mono text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`py-3 px-4 font-mono text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
              activeTab === 'network'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <Network className="w-4 h-4 inline mr-2" />
            Factions
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`py-3 px-4 font-mono text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
              activeTab === 'milestones'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <Trophy className="w-4 h-4 inline mr-2" />
            Milestones
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative z-10">
        {savedScenarios.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/30 p-8">
            <FileText className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-xl font-serif mb-2">No Active Missions</h2>
            <p className="text-sm font-mono text-center max-w-md">
              Generate scenarios from the Imperial Map or Faction Timeline to populate your campaign log.
            </p>
            <div className="flex gap-4 mt-8">
              <Link href="/map">
                <Button variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10">
                  Go to Map
                </Button>
              </Link>
              <Link href="/timeline">
                <Button variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10">
                  Go to Timeline
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto custom-scrollbar p-8">
            <div className="max-w-6xl mx-auto pb-20">
              {activeTab === 'log' ? (
                <CampaignLog />
              ) : activeTab === 'stats' ? (
                <CampaignStats />
              ) : activeTab === 'branching' ? (
                <CampaignBranching missions={savedScenarios} />
              ) : activeTab === 'timeline' ? (
                <MissionTimeline missions={savedScenarios} />
              ) : activeTab === 'network' ? (
                <FactionRelationshipNetwork missions={savedScenarios} />
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-end">
                    <CustomMilestoneCreator onAddMilestone={handleAddCustomMilestone} />
                  </div>
                  <MilestoneTracker milestones={milestones} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
