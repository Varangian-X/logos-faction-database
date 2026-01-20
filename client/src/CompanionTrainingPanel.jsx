import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Dumbbell, Brain, Shield, Star, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { companionTrainingTypes } from './HousingData';

export default function CompanionTrainingPanel({ housing, companions, gameState, onTrain }) {
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [selectedTraining, setSelectedTraining] = useState(null);
  
  const facilities = housing.companion_facilities || {};
  const trainingLevel = facilities.training_room_level || 0;
  const activeTraining = facilities.active_training || [];
  const maxTrainingSlots = 1 + trainingLevel;
  
  const availableCompanions = companions.filter(c => 
    c.is_recruited && !activeTraining.find(t => t.companion_id === c.id)
  );

  const availableTraining = Object.values(companionTrainingTypes).filter(training =>
    !training.requires_level || trainingLevel >= training.requires_level
  );

  const handleStartTraining = () => {
    if (!selectedCompanion || !selectedTraining) return;
    onTrain && onTrain(selectedCompanion.id, selectedTraining.id);
    setSelectedCompanion(null);
    setSelectedTraining(null);
  };

  return (
    <div className="space-y-4">
      {/* Training Facility Overview */}
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-cyan-400" />
            Training Facilities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Training Level</p>
              <p className="text-lg font-bold text-cyan-400">{trainingLevel}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Active Training</p>
              <p className="text-lg font-bold text-purple-400">{activeTraining.length} / {maxTrainingSlots}</p>
            </div>
          </div>
          
          {trainingLevel === 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <p className="text-xs text-amber-400 flex items-center gap-2">
                <AlertCircle className="w-3 h-3" />
                Install a Training Hall module to unlock companion training
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Training Sessions */}
      {activeTraining.length > 0 && (
        <Card className="bg-slate-900/80 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-sm text-purple-400">Active Training</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeTraining.map((training, i) => {
              const companion = companions.find(c => c.id === training.companion_id);
              const trainingData = companionTrainingTypes[training.training_type];
              if (!companion || !trainingData) return null;
              
              return (
                <ActiveTrainingCard
                  key={training.companion_id}
                  companion={companion}
                  training={trainingData}
                  turnsRemaining={training.turns_remaining}
                  index={i}
                />
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Start New Training */}
      {trainingLevel > 0 && activeTraining.length < maxTrainingSlots && (
        <Card className="bg-slate-900/80 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-sm text-cyan-400">Start Training</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Select Companion */}
            <div>
              <p className="text-xs text-gray-500 uppercase mb-2">Select Companion</p>
              <div className="grid gap-2">
                {availableCompanions.length === 0 ? (
                  <p className="text-xs text-gray-600 text-center py-4">
                    No companions available for training
                  </p>
                ) : (
                  availableCompanions.map((companion, i) => (
                    <CompanionSelectCard
                      key={companion.id}
                      companion={companion}
                      isSelected={selectedCompanion?.id === companion.id}
                      onClick={() => setSelectedCompanion(companion)}
                      index={i}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Select Training Type */}
            {selectedCompanion && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-xs text-gray-500 uppercase mb-2">Select Training</p>
                <div className="grid gap-2">
                  {availableTraining.map((training, i) => (
                    <TrainingTypeCard
                      key={training.id}
                      training={training}
                      isSelected={selectedTraining?.id === training.id}
                      onClick={() => setSelectedTraining(training)}
                      gameState={gameState}
                      index={i}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Confirm Button */}
            {selectedCompanion && selectedTraining && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button
                  onClick={handleStartTraining}
                  disabled={(gameState.credits || 0) < selectedTraining.cost}
                  className="w-full bg-cyan-600/20 hover:bg-cyan-600/30 border-cyan-500/50 text-cyan-300"
                >
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Start Training ({selectedTraining.cost} Credits)
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ActiveTrainingCard({ companion, training, turnsRemaining, index }) {
  const progress = ((training.duration - turnsRemaining) / training.duration) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-slate-800/50 rounded-lg border border-purple-500/30 p-3"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-purple-200">{companion.name}</p>
          <p className="text-xs text-gray-400">{training.name}</p>
        </div>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">
          <Clock className="w-3 h-3 mr-1" />
          {turnsRemaining} turns
        </Badge>
      </div>
      
      <Progress value={progress} className="h-1.5" indicatorClassName="bg-purple-500" />
      
      <div className="mt-2 flex flex-wrap gap-1">
        {Object.entries(training.effects).map(([key, value]) => (
          <Badge key={key} variant="outline" className="text-[9px] text-gray-400">
            {key.replace(/_/g, ' ')}: +{value}
          </Badge>
        ))}
      </div>
    </motion.div>
  );
}

function CompanionSelectCard({ companion, isSelected, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
          isSelected 
            ? "bg-cyan-500/20 border-cyan-500/50" 
            : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
        )}
      >
        <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
          <Users className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-200">{companion.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge className="text-[9px] bg-pink-500/20 text-pink-400 border-pink-500/30">
              Loyalty: {companion.loyalty}
            </Badge>
            <Badge className="text-[9px] bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              Trust: {companion.trust}
            </Badge>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

function TrainingTypeCard({ training, isSelected, onClick, gameState, index }) {
  const canAfford = (gameState.credits || 0) >= training.cost;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <button
        onClick={onClick}
        disabled={!canAfford}
        className={cn(
          "w-full p-3 rounded-lg border transition-all text-left",
          isSelected 
            ? "bg-cyan-500/20 border-cyan-500/50" 
            : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600",
          !canAfford && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-200">{training.name}</p>
          <Badge variant="outline" className="text-[10px] text-amber-400">
            {training.cost} Credits
          </Badge>
        </div>
        <p className="text-xs text-gray-400 mb-2">{training.description}</p>
        <div className="flex items-center gap-2">
          <Badge className="text-[9px] bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Clock className="w-2 h-2 mr-1" />
            {training.duration} turns
          </Badge>
          {Object.entries(training.effects).slice(0, 2).map(([key, value]) => (
            <Badge key={key} variant="outline" className="text-[9px] text-gray-400">
              +{value}
            </Badge>
          ))}
        </div>
      </button>
    </motion.div>
  );
}