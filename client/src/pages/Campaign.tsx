import { useState } from "react";
import { useCampaign, SavedScenario } from "@/contexts/CampaignContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "wouter";
import { ArrowLeft, Trash2, MapPin, Calendar, Flag, Target, AlertTriangle, Gift, FileText, Download, FileJson } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { exportCampaignToJSON, exportCampaignToPDF } from "@/lib/campaignExport";

export default function CampaignPage() {
  const { savedScenarios, deleteScenario, updateScenarioNotes, clearCampaign } = useCampaign();
  const [editingNotes, setEditingNotes] = useState<string | null>(null);

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
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
              {savedScenarios.map((scenario) => (
                <Card key={scenario.id} className="bg-black/40 border-white/10 flex flex-col">
                  <CardHeader className="pb-3 border-b border-white/5">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px] border-[#D4AF37]/30 text-[#D4AF37]">
                            {scenario.type}
                          </Badge>
                          <span className="text-[10px] font-mono text-white/30">
                            {format(scenario.createdAt, 'yyyy-MM-dd HH:mm')}
                          </span>
                        </div>
                        <CardTitle className="text-lg text-white">{scenario.title}</CardTitle>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteScenario(scenario.id)}
                        className="h-6 w-6 text-white/30 hover:text-red-400 hover:bg-red-900/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-white/50 mt-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {scenario.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Flag className="w-3 h-3" /> {scenario.faction}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {scenario.year} AD
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 py-4 space-y-4">
                    <p className="text-sm text-white/80 italic border-l-2 border-white/10 pl-3">
                      "{scenario.description}"
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase">
                          <Target className="w-3 h-3" /> Objectives
                        </div>
                        <ul className="list-disc list-inside text-white/70 text-xs space-y-1 ml-1">
                          {scenario.objectives.map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase">
                          <AlertTriangle className="w-3 h-3" /> Complications
                        </div>
                        <ul className="list-disc list-inside text-white/70 text-xs space-y-1 ml-1">
                          {scenario.complications.map((comp, i) => (
                            <li key={i}>{comp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase">
                        <Gift className="w-3 h-3" /> Rewards
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {scenario.rewards.map((reward, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] border-white/10 text-white/60">
                            {reward}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="bg-white/5 border-t border-white/5 p-4 flex-col items-stretch gap-2">
                    <div className="text-xs font-mono text-white/40 uppercase">Campaign Notes</div>
                    <Textarea 
                      placeholder="Add mission notes, outcomes, or GM details..."
                      className="bg-black/20 border-white/10 text-xs min-h-[60px] focus:border-[#D4AF37]/50"
                      value={scenario.notes || ""}
                      onChange={(e) => updateScenarioNotes(scenario.id, e.target.value)}
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
