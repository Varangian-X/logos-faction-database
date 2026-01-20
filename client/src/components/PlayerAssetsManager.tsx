import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Coins, Cpu, Users, TrendingUp, Zap, Building2, Plus } from 'lucide-react';
import { PlayerAsset, calculateAssetNetProduction, assetTemplates, assetTierNames } from '@/lib/playerAssets';
import { mapLocations } from '@/lib/mapData';

interface PlayerAssetsManagerProps {
  assets: PlayerAsset[];
  onAddAsset: (asset: PlayerAsset) => void;
  onUpgradeAsset: (assetId: string) => void;
  currentYear: number;
}

export function PlayerAssetsManager({
  assets,
  onAddAsset,
  onUpgradeAsset,
  currentYear,
}: PlayerAssetsManagerProps) {
  const [selectedAsset, setSelectedAsset] = useState<PlayerAsset | null>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);

  // Calculate total production
  const totalProduction = assets.reduce((acc, asset) => {
    const net = calculateAssetNetProduction(asset);
    return {
      credits: (acc.credits || 0) + (net.credits || 0),
      tech: (acc.tech || 0) + (net.tech || 0),
      manpower: (acc.manpower || 0) + (net.manpower || 0),
    };
  }, { credits: 0, tech: 0, manpower: 0 });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-500" />
              Total Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{assets.length}</div>
            <p className="text-xs text-white/50 mt-1">Player-owned facilities</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" />
              Credits/Year
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProduction.credits >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalProduction.credits > 0 ? '+' : ''}{totalProduction.credits}
            </div>
            <p className="text-xs text-white/50 mt-1">Net production</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" />
              Tech/Year
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProduction.tech >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalProduction.tech > 0 ? '+' : ''}{totalProduction.tech}
            </div>
            <p className="text-xs text-white/50 mt-1">Net production</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Users className="w-4 h-4 text-red-500" />
              Manpower/Year
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProduction.manpower >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalProduction.manpower > 0 ? '+' : ''}{totalProduction.manpower}
            </div>
            <p className="text-xs text-white/50 mt-1">Net production</p>
          </CardContent>
        </Card>
      </div>

      {/* Assets List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-serif text-white">Your Assets</h3>
          <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/50">
                <Plus className="w-4 h-4 mr-2" />
                Purchase Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Purchase New Asset</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {Object.entries(assetTemplates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => {
                      // This would be connected to actual purchase logic
                      setShowPurchaseDialog(false);
                    }}
                    className="p-3 text-left rounded border border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-serif text-white">{template.name}</h4>
                        <p className="text-xs text-white/50 mt-1">{template.description}</p>
                      </div>
                      <Badge variant="outline" className="text-amber-500 border-amber-500/50">
                        {template.purchasePrice} Credits
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {assets.length === 0 ? (
          <Card className="bg-black/40 border-white/10">
            <CardContent className="p-8 text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-white/20" />
              <p className="text-white/50">No assets owned yet. Purchase or capture assets to generate passive income.</p>
            </CardContent>
          </Card>
        ) : (
          assets.map((asset) => {
            const net = calculateAssetNetProduction(asset);
            return (
              <Card
                key={asset.id}
                className="bg-black/40 border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => setSelectedAsset(asset)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-serif text-lg text-white">{asset.tierName || asset.name}</h4>
                      <p className="text-xs text-white/50">{asset.locationName} • {asset.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-white/70 border-white/20">
                        Level {asset.level}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          asset.status === 'Active'
                            ? 'text-green-400 border-green-400/50'
                            : 'text-red-400 border-red-400/50'
                        }
                      >
                        {asset.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-white/70">
                        <Coins className="w-4 h-4" /> Credits
                      </div>
                      <div className={`text-sm font-mono ${(net.credits || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {(net.credits || 0) > 0 ? '+' : ''}{net.credits || 0}/yr
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-white/70">
                        <Cpu className="w-3 h-3" /> Tech
                      </div>
                      <div className={`text-sm font-mono ${(net.tech || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {(net.tech || 0) > 0 ? '+' : ''}{net.tech || 0}/yr
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-white/70">
                        <Users className="w-3 h-3" /> Manpower
                      </div>
                      <div className={`text-sm font-mono ${(net.manpower || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {(net.manpower || 0) > 0 ? '+' : ''}{net.manpower || 0}/yr
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpgradeAsset(asset.id);
                      }}
                      disabled={asset.level >= 3}
                      className="text-xs"
                      title={asset.level >= 3 ? "Max Level Reached" : `Upgrade to ${assetTierNames[asset.type][asset.level]}`}
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      {asset.level >= 3 ? "Max Level" : "Upgrade"}
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs flex-1">
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Asset Details Modal */}
      {selectedAsset && (
        <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
          <DialogContent className="bg-black/90 border-white/10 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedAsset.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/50 mb-1">Location</p>
                  <p className="text-white">{selectedAsset.locationName}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Owner</p>
                  <p className="text-white">{selectedAsset.owner}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Acquisition Method</p>
                  <p className="text-white">{selectedAsset.acquisitionMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Year Acquired</p>
                  <p className="text-white">{selectedAsset.yearAcquired}</p>
                </div>
              </div>
              <p className="text-sm text-white/70">{selectedAsset.description}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
