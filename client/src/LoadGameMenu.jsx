import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, Trash2, Clock, MapPin, Coins, TrendingUp, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';

export default function LoadGameMenu({ onLoad, onClose }) {
  const [selectedSave, setSelectedSave] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { data: saves = [], isLoading, refetch } = useQuery({
    queryKey: ['saves'],
    queryFn: async () => {
      const allSaves = await base44.entities.SaveGame.list('-updated_date');
      return allSaves;
    }
  });
  
  const handleDelete = async (saveId) => {
    if (!confirm('Delete this save?')) return;
    
    setIsDeleting(true);
    try {
      await base44.entities.SaveGame.delete(saveId);
      await refetch();
    } catch (error) {
      console.error('Delete failed:', error);
    }
    setIsDeleting(false);
  };
  
  const manualSaves = saves.filter(s => s.save_type === 'manual');
  const autoSaves = saves.filter(s => s.save_type === 'auto');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
    >
      <Card className="w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-slate-900 border-cyan-500/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Save className="w-5 h-5" />
              Load Game
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            </div>
          )}
          
          {/* Manual Saves */}
          {manualSaves.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Manual Saves
              </h3>
              <div className="space-y-2">
                {manualSaves.map((save, i) => (
                  <SaveSlot
                    key={save.id}
                    save={save}
                    index={i}
                    onLoad={() => onLoad(save.id)}
                    onDelete={() => handleDelete(save.id)}
                    isDeleting={isDeleting}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Auto Saves */}
          {autoSaves.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Auto Saves
              </h3>
              <div className="space-y-2">
                {autoSaves.map((save, i) => (
                  <SaveSlot
                    key={save.id}
                    save={save}
                    index={i}
                    onLoad={() => onLoad(save.id)}
                    isAuto
                  />
                ))}
              </div>
            </div>
          )}
          
          {saves.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              No saved games found
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SaveSlot({ save, index, onLoad, onDelete, isDeleting, isAuto }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 hover:bg-slate-800/70 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-semibold text-gray-200">
              {save.save_name || `${save.character_name} - ${save.house_name || 'Unnamed'}`}
            </h4>
            {isAuto && (
              <Badge className="text-[9px] bg-amber-500/20 text-amber-400 border-amber-500/50">
                Auto
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {save.location || 'Unknown'}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Turn {save.turn_number || 1}
            </div>
            {save.snapshot && (
              <>
                <div className="flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  {save.snapshot.credits || 0}₵
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Rep: {save.snapshot.reputation || 0}
                </div>
              </>
            )}
          </div>
          
          <div className="text-[10px] text-gray-600 mt-2">
            {format(new Date(save.updated_date || save.created_date), 'MMM d, yyyy HH:mm')}
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            onClick={onLoad}
            className="bg-cyan-600 hover:bg-cyan-700 h-8 px-3"
          >
            Load
          </Button>
          {!isAuto && onDelete && (
            <Button
              size="sm"
              variant="outline"
              onClick={onDelete}
              disabled={isDeleting}
              className="h-8 px-3 border-red-500/50 text-red-400 hover:bg-red-900/20"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}