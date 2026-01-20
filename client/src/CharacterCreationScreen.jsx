import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sword, Book, Coins, Eye, Shield, Cpu, Crown, ChevronRight, ChevronLeft } from 'lucide-react';
import { BACKGROUNDS, COSMETIC_OPTIONS, STARTING_TIER_OPTIONS } from './CharacterCustomizationData';
import SmartFileDrop from '@/components/ui/SmartFileDrop';

const backgroundIcons = {
  sword: Sword,
  book: Book,
  coins: Coins,
  eye: Eye,
  shield: Shield,
  cpu: Cpu,
  crown: Crown
};

export default function CharacterCreationScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [customization, setCustomization] = useState({
    character_name: '',
    house_name: '',
    background: 'military_officer',
    tier: 'mese',
    portrait: 'imperial_officer',
    color: 'imperial_gold',
    sigil: 'eagle',
    motto: 'Honor Above All',
    customPortraitUrl: null
  });

  const steps = [
    { title: 'Identity', subtitle: 'Name your character and dynasty' },
    { title: 'Background', subtitle: 'Choose your origin story' },
    { title: 'Starting Tier', subtitle: 'Select your social standing' },
    { title: 'Appearance', subtitle: 'Customize your dynasty' }
  ];

  const handleComplete = () => {
    if (!customization.character_name || !customization.house_name) {
      return;
    }
    onComplete(customization);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  i <= step ? 'border-amber-500 bg-amber-500/20 text-amber-300' : 'border-slate-700 text-slate-600'
                }`}>
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-amber-500' : 'bg-slate-700'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-amber-400">{steps[step].title}</h2>
            <p className="text-sm text-gray-500">{steps[step].subtitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-amber-900/30 p-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="identity"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm text-amber-400 mb-2">Character Name</label>
                  <Input
                    value={customization.character_name}
                    onChange={(e) => setCustomization({...customization, character_name: e.target.value})}
                    placeholder="Enter your operative's name"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-amber-400 mb-2">House/Dynasty Name</label>
                  <Input
                    value={customization.house_name}
                    onChange={(e) => setCustomization({...customization, house_name: e.target.value})}
                    placeholder="Enter your dynasty name"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="mt-8 p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                  <p className="text-sm text-cyan-300">
                    Your name will be remembered across the Imperium. Choose wisely, as it will influence how factions perceive you.
                  </p>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="background"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-2 gap-4"
              >
                {Object.entries(BACKGROUNDS).map(([key, bg]) => {
                  const Icon = backgroundIcons[bg.icon];
                  const isSelected = customization.background === key;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => setCustomization({...customization, background: key})}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-500/10' 
                          : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-amber-500/20' : 'bg-slate-700'
                        }`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-400' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold mb-1 ${isSelected ? 'text-amber-300' : 'text-gray-300'}`}>
                            {bg.name}
                          </h3>
                          <p className="text-xs text-gray-500">{bg.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400">+{bg.starting_resources.credits} Credits</span>
                          {bg.starting_resources.influence && (
                            <span className="text-purple-400">+{bg.starting_resources.influence} Influence</span>
                          )}
                        </div>
                        <div className="text-cyan-400">
                          Trait: {bg.trait.replace(/_/g, ' ')}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="tier"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {Object.entries(STARTING_TIER_OPTIONS).map(([key, tier]) => {
                  const isSelected = customization.tier === key;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => setCustomization({...customization, tier: key})}
                      className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-500/10' 
                          : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                      }`}
                    >
                      <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-amber-300' : 'text-gray-300'}`}>
                        {tier.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">{tier.description}</p>
                      
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500">Reputation:</span>
                          <div className="text-amber-400 font-semibold">{tier.modifiers.starting_reputation}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Credits:</span>
                          <div className="text-emerald-400 font-semibold">{tier.modifiers.starting_credits}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Influence:</span>
                          <div className="text-purple-400 font-semibold">{tier.modifiers.starting_influence}</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <span className="text-xs text-gray-500">{tier.requirements}</span>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="appearance"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm text-amber-400 mb-3">Dynasty Color</label>
                  <div className="grid grid-cols-6 gap-2">
                    {COSMETIC_OPTIONS.appearance.colors.map(color => (
                      <button
                        key={color.id}
                        onClick={() => setCustomization({...customization, color: color.id})}
                        className={`h-12 rounded-lg border-2 transition-all ${
                          customization.color === color.id ? 'border-white scale-110' : 'border-slate-700'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-amber-400 mb-3">Dynasty Sigil</label>
                  <div className="grid grid-cols-3 gap-3">
                    {COSMETIC_OPTIONS.appearance.sigils.map(sigil => (
                      <button
                        key={sigil.id}
                        onClick={() => setCustomization({...customization, sigil: sigil.id})}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          customization.sigil === sigil.id 
                            ? 'border-amber-500 bg-amber-500/10' 
                            : 'border-slate-700 bg-slate-800/50'
                        }`}
                      >
                        <div className="font-semibold text-sm mb-1">{sigil.name}</div>
                        <div className="text-xs text-gray-500">{sigil.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-amber-400 mb-3">Character Portrait</label>
                  <SmartFileDrop
                    label="Upload Character Image"
                    description="Drag & drop your character portrait"
                    onUploadComplete={(url) => {
                      setCustomization({ ...customization, customPortraitUrl: url });
                    }}
                    maxSize={5 * 1024 * 1024}
                    showPreview={true}
                  />
                </div>

                <div>
                  <label className="block text-sm text-amber-400 mb-3">Dynasty Motto</label>
                  <select
                    value={customization.motto}
                    onChange={(e) => setCustomization({...customization, motto: e.target.value})}
                    className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    {COSMETIC_OPTIONS.dynasty_motto.map(motto => (
                      <option key={motto} value={motto}>{motto}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            variant="outline"
            className="border-slate-700"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {step < steps.length - 1 ? (
            <Button
              onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
              disabled={step === 0 && (!customization.character_name || !customization.house_name)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Begin Journey
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}