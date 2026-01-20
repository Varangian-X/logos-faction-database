import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, AlertTriangle, TrendingUp, FileText, RefreshCw, Loader2 } from 'lucide-react';
import { generateIntelReport } from './HouseIntrigueSystem';

export default function IntelReportsPanel({ gameState, playerHouseId }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (playerHouseId && gameState) {
      loadReport();
    }
  }, [playerHouseId, gameState?.turn_number]);
  
  const loadReport = async () => {
    setLoading(true);
    const intelReport = await generateIntelReport(playerHouseId, gameState);
    setReport(intelReport);
    setLoading(false);
  };
  
  if (!report && !loading) return null;
  
  return (
    <Card className="bg-slate-900/80 border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Intelligence Report
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={loadReport}
            disabled={loading}
            className="h-6 text-cyan-400 hover:text-cyan-300"
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <Loader2 className="w-6 h-6 text-cyan-400 mx-auto animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="threats" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800">
              <TabsTrigger value="threats" className="text-[10px]">
                Threats ({report?.threats?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="opportunities" className="text-[10px]">
                Opportunities ({report?.opportunities?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="intel" className="text-[10px]">
                House Intel ({report?.house_movements?.length || 0})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="threats" className="space-y-2 mt-3">
              {report?.threats?.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No immediate threats detected</p>
              ) : (
                report?.threats?.map((threat, i) => (
                  <div key={i} className="bg-red-900/20 rounded-lg p-3 border border-red-500/30">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-red-300">{threat.house_name}</p>
                        <Badge className="mt-1 bg-red-500/20 text-red-400 text-[9px]">
                          {threat.threat_level} threat
                        </Badge>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-300 mb-1">{threat.reason}</p>
                    <p className="text-[9px] text-amber-400 italic">→ {threat.recommended_action}</p>
                  </div>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="opportunities" className="space-y-2 mt-3">
              {report?.opportunities?.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No opportunities identified</p>
              ) : (
                report?.opportunities?.map((opp, i) => (
                  <div key={i} className="bg-green-900/20 rounded-lg p-3 border border-green-500/30">
                    <div className="flex items-start gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-green-300">{opp.house_name}</p>
                        <p className="text-[10px] text-gray-300 mt-1">{opp.opportunity}</p>
                      </div>
                    </div>
                    <p className="text-[9px] text-cyan-400 italic">{opp.details}</p>
                  </div>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="intel" className="space-y-2 mt-3">
              {report?.house_movements?.length === 0 ? (
                <div className="text-center py-4">
                  <Eye className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">No active spy networks</p>
                  <p className="text-[10px] text-gray-600 mt-1">
                    Plant spies to gather house intelligence
                  </p>
                </div>
              ) : (
                report?.house_movements?.map((intel, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/30">
                    <div className="flex items-start gap-2 mb-2">
                      <Eye className="w-4 h-4 text-cyan-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-cyan-300">{intel.house_name}</p>
                        <Badge className="mt-1 bg-cyan-500/20 text-cyan-400 text-[9px]">
                          Active Surveillance
                        </Badge>
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-300 space-y-1">
                      <p>{intel.intelligence}</p>
                      <p className="text-amber-400">
                        Alliances: {intel.alliances} | Rivalries: {intel.rivalries}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
        
        <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between text-[10px]">
          <span className="text-gray-500">Turn {report?.turn}</span>
          <div className="flex items-center gap-3 text-cyan-400">
            <span>Intel: {report?.intel_available || 0}</span>
            <span>Active Ops: {report?.active_operations || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}