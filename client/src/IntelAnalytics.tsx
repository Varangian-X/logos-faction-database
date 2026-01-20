import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  ArrowLeft, Activity, Database, Map as MapIcon, 
  ShieldAlert, Users, Layers, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameState } from '@/contexts/GameStateContext';
import { TechTreePanel as TechTree } from '@/components/TechTreePanel';
import { toast } from 'sonner';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
  BubbleController
} from 'chart.js';
import { Radar, Bar, Scatter, Bubble } from 'react-chartjs-2';

// Plotly import
import Plot from 'react-plotly.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  BubbleController,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Intel & Analytics Dashboard
 * Visualizes game world data using Chart.js and Plotly
 */
export default function IntelAnalytics() {
  const [, setLocation] = useLocation();
  const { gameState, setGameState, logResourceChange } = useGameState();
  const [activeTab, setActiveTab] = useState('hierarchy');

  // --- CHART CONFIGURATIONS ---

  // 1. Hierarchy Funnel Data (Plotly)
  const funnelData = [
    {
      type: 'funnel',
      y: ['The Chrysopolis', 'The Mese', 'The Cisterns', 'The Undercity', 'The Waste'],
      x: [5000, 25000, 150000, 800000, 2500000],
      textinfo: "value+percent initial",
      marker: {
        color: ["#fbbf24", "#06b6d4", "#a855f7", "#64748b", "#334155"],
        line: { width: 1, color: "#1e293b" }
      },
      connector: { line: { color: "#475569", dash: "dot", width: 1 } }
    }
  ];

  const funnelLayout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Rajdhani, sans-serif', color: '#94a3b8' },
    margin: { l: 150, r: 20, t: 20, b: 20 },
    height: 350,
    showlegend: false
  };

  // 2. Imperial Trinity Radar (Chart.js)
  const radarData = {
    labels: ['Military Might', 'Economic Reach', 'Technological Grasp', 'Political Influence', 'Espionage Capability', 'Cultural Sway'],
    datasets: [
      {
        label: 'House Imperium',
        data: [85, 60, 75, 90, 45, 80],
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        borderColor: '#06b6d4',
        borderWidth: 2,
        pointBackgroundColor: '#06b6d4',
      },
      {
        label: 'Rival Faction',
        data: [65, 90, 50, 60, 85, 40],
        backgroundColor: 'rgba(251, 191, 36, 0.2)',
        borderColor: '#fbbf24',
        borderWidth: 2,
        pointBackgroundColor: '#fbbf24',
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: '#334155' },
        grid: { color: '#334155' },
        pointLabels: { color: '#e2e8f0', font: { size: 12 } },
        ticks: { display: false, backdropColor: 'transparent' }
      }
    },
    plugins: {
      legend: { labels: { color: '#e2e8f0' } }
    },
    maintainAspectRatio: false
  };

  // 3. Navigation Bubble Chart (Chart.js)
  const bubbleData = {
    datasets: [{
      label: 'System Analysis',
      data: [
        { x: 10, y: 10, r: 15, system: 'New Roma' }, // Capital
        { x: 35, y: 80, r: 25, system: 'Iron Gates' }, // Choke Point
        { x: 60, y: 90, r: 10, system: 'Singidunum' }, // Combat Zone
        { x: 85, y: 40, r: 20, system: 'Thessaly' }, // Data Vaults
        { x: 95, y: 95, r: 30, system: 'Avalon Anomaly' } // Unknown/High Value
      ],
      backgroundColor: (context: any) => {
        const r = context.raw?.r;
        if(r > 20) return 'rgba(251, 191, 36, 0.8)'; // High Value - Gold
        return 'rgba(6, 182, 212, 0.6)'; // Std Value - Cyan
      },
      borderColor: '#fff',
      borderWidth: 1
    }]
  };

  const bubbleOptions = {
    scales: {
      x: {
        title: { display: true, text: 'Distance from Core (Light Years)', color: '#e2e8f0' },
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        title: { display: true, text: 'Hazard Rating (%)', color: '#e2e8f0' },
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.raw.system + ' (Val: ' + context.raw.r + ')';
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  // 4. Intrigue Scatter Plot (Chart.js)
  const scatterData = {
    datasets: [{
      label: 'Covert Operations',
      data: [
        { x: 10, y: 10, name: 'Gather Rumors' },
        { x: 30, y: 25, name: 'Bribe Official' },
        { x: 50, y: 45, name: 'Spread Disinfo' },
        { x: 80, y: 50, name: 'Incite Unrest' },
        { x: 60, y: 60, name: 'Sabotage Infra' },
        { x: 100, y: 75, name: 'Assassination' }
      ],
      backgroundColor: (context: any) => {
        const v = context.raw?.y;
        if(v > 60) return '#ef4444'; // High Risk
        if(v > 40) return '#fbbf24'; // Med Risk
        return '#06b6d4'; // Low Risk
      },
      pointRadius: 8,
      pointHoverRadius: 12
    }]
  };

  const scatterOptions = {
    scales: {
      x: {
        title: { display: true, text: 'Intel Cost', color: '#e2e8f0' },
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        title: { display: true, text: 'Detection Probability (%)', color: '#e2e8f0' },
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.raw.name + ': ' + context.raw.x + ' Intel / ' + context.raw.y + '% Risk';
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/game')}
              className="text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 tracking-widest uppercase flex items-center gap-3">
                <Activity className="w-8 h-8" />
                Intel & Analytics
              </h1>
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                Strategic Compendium // Cartography // Hierarchy
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-slate-900/80 border border-cyan-500/30 px-4 py-2 rounded text-center">
              <span className="block text-[10px] text-slate-400 uppercase">Intel Level</span>
              <span className="block font-bold text-cyan-400">High Clearance</span>
            </div>
            <div className="bg-slate-900/80 border border-amber-500/30 px-4 py-2 rounded text-center">
              <span className="block text-[10px] text-slate-400 uppercase">Data Integrity</span>
              <span className="block font-bold text-amber-400">98.4%</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900 border border-slate-700 mb-6">
            <TabsTrigger value="hierarchy" className="data-text flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Hierarchy
            </TabsTrigger>
            <TabsTrigger value="factions" className="data-text flex items-center gap-2">
              <Users className="w-4 h-4" />
              Factions
            </TabsTrigger>
            <TabsTrigger value="navigation" className="data-text flex items-center gap-2">
              <MapIcon className="w-4 h-4" />
              Navigation
            </TabsTrigger>
            <TabsTrigger value="intrigue" className="data-text flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Intrigue
            </TabsTrigger>
            <TabsTrigger value="research" className="data-text flex items-center gap-2">
              <Database className="w-4 h-4" />
              Research
            </TabsTrigger>
          </TabsList>

          {/* Research Tab */}
          <TabsContent value="research" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-slate-900/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-cyan-400 uppercase tracking-wider text-sm">
                    Research Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <TechTree 
                    // @ts-ignore
                    researchedTechs={gameState.researchedTechs || []}
                    // @ts-ignore
                    currentResearch={gameState.currentResearch}
                    researchPoints={gameState.tech}
                    onStartResearch={(techId: string, cost: number) => {
                      // In a real implementation, this would start a timer or deduct points over time
                      // For this demo, we'll use tech points from GameState
                      if (gameState.tech >= cost) {
                        const newTech = gameState.tech - cost;
                        setGameState(prev => ({
                          ...prev,
                          tech: newTech
                        }));
                        logResourceChange('tech', -cost, newTech, 'Research', `Researched ${techId}`);
                        toast.success("Research Completed!");
                      } else {
                        toast.error("Insufficient Tech Points");
                      }
                    }}
                  />
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-slate-900/80 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-sm text-slate-300 uppercase">Research Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <p className="text-4xl font-bold text-cyan-400 font-mono">{gameState.tech}</p>
                      <p className="text-xs text-slate-500 uppercase mt-1">Points Available</p>
                    </div>
                    <div className="space-y-2 mt-4 pt-4 border-t border-slate-800">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Base Output</span>
                        <span className="text-slate-200">+10/turn</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Labs</span>
                        <span className="text-slate-200">+5/turn</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Scientists</span>
                        <span className="text-slate-200">+2/turn</span>
                      </div>
                      <div className="flex justify-between text-xs pt-2 border-t border-slate-800 font-bold">
                        <span className="text-cyan-400">Total</span>
                        <span className="text-cyan-400">+17/turn</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 1. Hierarchy Tab */}
          <TabsContent value="hierarchy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-slate-900/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-amber-400 uppercase tracking-wider text-sm">
                    The Vertical Axis (Population Density)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                  <Plot
                    data={funnelData as any}
                    layout={funnelLayout}
                    config={{ displayModeBar: false, responsive: true }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </CardContent>
              </Card>
              
              <div className="space-y-4">
                <Card className="bg-slate-900/80 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-sm text-slate-300 uppercase flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Structure Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-slate-400">
                    <p>
                      <strong className="text-amber-400">The Chrysopolis:</strong> The "Golden City." The upper spires where the air is scrubbed and sunlight is real. Home to the High Families.
                    </p>
                    <p>
                      <strong className="text-cyan-400">The Mese:</strong> The "Middle Way." A chaotic zone of commerce, bureaucracy, and diplomacy.
                    </p>
                    <p>
                      <strong className="text-purple-400">The Cisterns:</strong> The industrial underbelly. Essential infrastructure and secret meetings.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 2. Factions Tab */}
          <TabsContent value="factions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-cyan-400 uppercase tracking-wider text-sm">
                    The Imperial Trinity
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <Radar data={radarData} options={radarOptions} />
                </CardContent>
              </Card>
              
              <Card className="bg-slate-900/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-sm text-slate-300 uppercase">Faction Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded border-l-2 border-cyan-500">
                    <h4 className="text-cyan-400 font-bold mb-1">House Imperium</h4>
                    <p className="text-xs text-slate-400">
                      Dominant in political influence and military might. Weakness lies in espionage capability compared to shadow factions.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded border-l-2 border-amber-500">
                    <h4 className="text-amber-400 font-bold mb-1">Rival Faction</h4>
                    <p className="text-xs text-slate-400">
                      Economic powerhouse with deep espionage networks. Lacks the raw military projection of the Imperium.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 3. Navigation Tab */}
          <TabsContent value="navigation" className="space-y-6">
            <Card className="bg-slate-900/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-cyan-400 uppercase tracking-wider text-sm">
                  System Hazard Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[500px]">
                <Bubble data={bubbleData} options={bubbleOptions} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 4. Intrigue Tab */}
          <TabsContent value="intrigue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-slate-900/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-purple-400 uppercase tracking-wider text-sm">
                    Shadow Operations Risk Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <Scatter data={scatterData} options={scatterOptions} />
                </CardContent>
              </Card>
              
              <div className="space-y-4">
                <Card className="bg-slate-900/80 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-sm text-slate-300 uppercase">Operation Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-xs p-2 bg-slate-800/50 rounded">
                      <span className="text-slate-300">Gather Rumors</span>
                      <span className="text-cyan-400">Low Risk</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 bg-slate-800/50 rounded">
                      <span className="text-slate-300">Bribe Official</span>
                      <span className="text-amber-400">Medium Risk</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 bg-slate-800/50 rounded">
                      <span className="text-slate-300">Assassination</span>
                      <span className="text-red-400 font-bold">EXTREME RISK</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
