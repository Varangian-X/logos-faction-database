import { useState } from "react";
import { useCampaign } from "@/contexts/CampaignContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, Trash2, Download, FileJson, BarChart3, List } from "lucide-react";
import { FileText } from "lucide-react";
import { exportCampaignToJSON, exportCampaignToPDF } from "@/lib/campaignExport";
import { CampaignLog } from "@/components/CampaignLog";
import { CampaignStats } from "@/components/CampaignStats";

export default function CampaignPage() {
  const { savedScenarios, clearCampaign } = useCampaign();
  const [activeTab, setActiveTab] = useState<'log' | 'stats'>('log');

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
        {savedScenarios.length > 0 && (
          <div className="flex gap-2">
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
          </div>
        )}
      </header>

      {/* Tabs */}
      {savedScenarios.length > 0 && (
        <div className="relative z-20 border-b border-white/10 bg-black/40 px-6 flex gap-4">
          <button
            onClick={() => setActiveTab('log')}
            className={`py-3 px-4 font-mono text-xs uppercase tracking-widest transition-colors ${
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
            className={`py-3 px-4 font-mono text-xs uppercase tracking-widest transition-colors ${
              activeTab === 'stats'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Statistics
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
              ) : (
                <CampaignStats />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
