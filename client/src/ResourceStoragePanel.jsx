import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Package, ArrowDown, ArrowUp, Coins, Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ResourceStoragePanel({ housing, gameState, onStore, onWithdraw }) {
  const [selectedResource, setSelectedResource] = useState(null);
  const [amount, setAmount] = useState('');
  
  const storage = housing.resource_storage || {};
  const capacity = storage.capacity || 1000;
  const storedResources = storage.stored_resources || {};
  const totalStored = Object.values(storedResources).reduce((sum, val) => sum + (val || 0), 0);
  const usedPercentage = (totalStored / capacity) * 100;

  const resources = [
    { id: 'credits', name: 'Credits', icon: Coins, color: 'amber', current: gameState.credits || 0, stored: storage.credits_stash || 0 },
    { id: 'intel', name: 'Intel', icon: Zap, color: 'purple', current: gameState.intel || 0, stored: storage.intel_cache || 0 },
    { id: 'tech_parts', name: 'Tech Parts', icon: Package, color: 'cyan', stored: storedResources.tech_parts || 0 },
    { id: 'chemicals', name: 'Chemicals', icon: Package, color: 'green', stored: storedResources.chemicals || 0 },
    { id: 'rare_tech', name: 'Rare Tech', icon: Package, color: 'violet', stored: storedResources.rare_tech || 0 }
  ];

  const handleStore = () => {
    if (!selectedResource || !amount) return;
    onStore && onStore(selectedResource.id, parseInt(amount));
    setAmount('');
    setSelectedResource(null);
  };

  const handleWithdraw = () => {
    if (!selectedResource || !amount) return;
    onWithdraw && onWithdraw(selectedResource.id, parseInt(amount));
    setAmount('');
    setSelectedResource(null);
  };

  return (
    <div className="space-y-4">
      {/* Storage Overview */}
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Package className="w-4 h-4 text-cyan-400" />
            Storage Capacity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Used</span>
              <span className="text-sm font-semibold text-cyan-400">{totalStored} / {capacity}</span>
            </div>
            <Progress value={usedPercentage} className="h-2" indicatorClassName={cn(
              usedPercentage > 90 ? "bg-red-500" : usedPercentage > 70 ? "bg-amber-500" : "bg-cyan-500"
            )} />
            {usedPercentage > 90 && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-2">
                <AlertTriangle className="w-3 h-3" />
                Storage nearly full! Upgrade capacity or withdraw resources.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resource List */}
      <div className="grid gap-3">
        {resources.map((resource, index) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            isSelected={selectedResource?.id === resource.id}
            onClick={() => setSelectedResource(resource)}
            index={index}
          />
        ))}
      </div>

      {/* Transfer Panel */}
      {selectedResource && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/50">
            <CardHeader>
              <CardTitle className="text-sm text-cyan-300">
                Transfer {selectedResource.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1"
                  min="0"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleStore}
                  disabled={!amount || (selectedResource.current || 0) < parseInt(amount)}
                  className="bg-green-600/20 hover:bg-green-600/30 border-green-500/50 text-green-300"
                >
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Store
                </Button>
                <Button
                  onClick={handleWithdraw}
                  disabled={!amount || selectedResource.stored < parseInt(amount)}
                  className="bg-amber-600/20 hover:bg-amber-600/30 border-amber-500/50 text-amber-300"
                >
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>Available to store: {selectedResource.current || 0}</p>
                <p>Stored in vault: {selectedResource.stored}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function ResourceCard({ resource, isSelected, onClick, index }) {
  const Icon = resource.icon;
  const colors = {
    amber: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    purple: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    green: 'text-green-400 border-green-500/30 bg-green-500/10',
    violet: 'text-violet-400 border-violet-500/30 bg-violet-500/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className={cn(
          "bg-slate-800/50 border-slate-700/50 cursor-pointer transition-all",
          isSelected && "border-cyan-500/50 ring-2 ring-cyan-500/20"
        )}
        onClick={onClick}
      >
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-lg border flex items-center justify-center", colors[resource.color])}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-200">{resource.name}</p>
                <p className="text-xs text-gray-500">Vault Storage</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-cyan-400">{resource.stored}</p>
              {resource.current !== undefined && (
                <p className="text-xs text-gray-500">+{resource.current} available</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}