import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Book, Search, MapPin, Users, Target, Zap, Scroll, Cpu,
  Shield, ChevronRight, Star, AlertTriangle, Info, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ENCYCLOPEDIA_CATEGORIES } from './EncyclopediaSystem';

const categoryConfig = {
  [ENCYCLOPEDIA_CATEGORIES.LOCATIONS]: {
    icon: MapPin,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/30'
  },
  [ENCYCLOPEDIA_CATEGORIES.FACTIONS]: {
    icon: Users,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/30'
  },
  [ENCYCLOPEDIA_CATEGORIES.NPCS]: {
    icon: Users,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30'
  },
  [ENCYCLOPEDIA_CATEGORIES.QUESTS]: {
    icon: Target,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/30'
  },
  [ENCYCLOPEDIA_CATEGORIES.EVENTS]: {
    icon: Zap,
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    border: 'border-red-500/30'
  },
  [ENCYCLOPEDIA_CATEGORIES.LORE]: {
    icon: Scroll,
    color: 'text-violet-400',
    bg: 'bg-violet-500/20',
    border: 'border-violet-500/30'
  },
  [ENCYCLOPEDIA_CATEGORIES.TECHNOLOGY]: {
    icon: Cpu,
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    border: 'border-green-500/30'
  },
  [ENCYCLOPEDIA_CATEGORIES.COMPANIONS]: {
    icon: Shield,
    color: 'text-pink-400',
    bg: 'bg-pink-500/20',
    border: 'border-pink-500/30'
  }
};

const importanceConfig = {
  low: { color: 'text-gray-400', label: 'Minor' },
  normal: { color: 'text-blue-400', label: 'Notable' },
  high: { color: 'text-amber-400', label: 'Important' },
  critical: { color: 'text-red-400', label: 'Critical' }
};

export default function EncyclopediaUI({ encyclopediaManager, onGenerateSummary }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const stats = useMemo(() => 
    encyclopediaManager.getStatistics(),
    [encyclopediaManager]
  );

  const filteredEntries = useMemo(() => {
    if (searchQuery) {
      return encyclopediaManager.searchEntries(searchQuery);
    }
    if (selectedCategory) {
      return encyclopediaManager.getEntriesByCategory(selectedCategory);
    }
    return Array.from(encyclopediaManager.entries.values());
  }, [searchQuery, selectedCategory, encyclopediaManager]);

  const handleGenerateSummary = async (entry) => {
    setGeneratingSummary(true);
    try {
      if (onGenerateSummary) {
        await onGenerateSummary(entry);
      }
    } finally {
      setGeneratingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="bg-gradient-to-br from-violet-900/30 to-blue-900/30 border-violet-500/50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-violet-300">
              <Book className="w-8 h-8" />
              Imperial Encyclopedia
              <Badge className="ml-auto bg-violet-500/20 text-violet-300 border-violet-500/30">
                {stats.total} Entries
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Search */}
            <Card className="bg-slate-900/80 border-slate-700/50">
              <CardContent className="pt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Search encyclopedia..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedCategory(null);
                    }}
                    className="pl-10 bg-slate-800 border-slate-700"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-slate-900/80 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <Button
                    variant={!selectedCategory && !searchQuery ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery('');
                    }}
                  >
                    <Book className="w-4 h-4 mr-2" />
                    All Entries
                    <Badge variant="outline" className="ml-auto">
                      {stats.total}
                    </Badge>
                  </Button>

                  {Object.entries(ENCYCLOPEDIA_CATEGORIES).map(([key, value]) => {
                    const config = categoryConfig[value];
                    const Icon = config.icon;
                    const count = stats[value] || 0;

                    if (count === 0) return null;

                    return (
                      <Button
                        key={value}
                        variant={selectedCategory === value ? 'default' : 'ghost'}
                        className={cn(
                          "w-full justify-start",
                          selectedCategory === value && config.bg
                        )}
                        onClick={() => {
                          setSelectedCategory(value);
                          setSearchQuery('');
                          setSelectedEntry(null);
                        }}
                      >
                        <Icon className={cn("w-4 h-4 mr-2", config.color)} />
                        {key.charAt(0) + key.slice(1).toLowerCase()}
                        <Badge variant="outline" className="ml-auto">
                          {count}
                        </Badge>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {selectedEntry ? (
              <EntryDetailView
                entry={selectedEntry}
                onBack={() => setSelectedEntry(null)}
                onGenerateSummary={handleGenerateSummary}
                generatingSummary={generatingSummary}
              />
            ) : (
              <EntryListView
                entries={filteredEntries}
                onSelectEntry={setSelectedEntry}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EntryListView({ entries, onSelectEntry, searchQuery, selectedCategory }) {
  const sortedEntries = useMemo(() => 
    [...entries].sort((a, b) => {
      // Sort by importance first
      const importanceOrder = { critical: 4, high: 3, normal: 2, low: 1 };
      const importanceDiff = importanceOrder[b.importance] - importanceOrder[a.importance];
      if (importanceDiff !== 0) return importanceDiff;
      
      // Then by discovery date (newest first)
      return b.discovered_date - a.discovered_date;
    }),
    [entries]
  );

  return (
    <Card className="bg-slate-900/80 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-lg text-gray-300">
          {searchQuery ? `Search Results (${entries.length})` :
           selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} (${entries.length})` :
           `All Entries (${entries.length})`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <AnimatePresence mode="popLayout">
            {sortedEntries.length === 0 ? (
              <div className="text-center py-12">
                <Info className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">No entries found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedEntries.map((entry, i) => (
                  <EntryCard
                    key={`${entry.category}_${entry.id}`}
                    entry={entry}
                    onClick={() => onSelectEntry(entry)}
                    index={i}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function EntryCard({ entry, onClick, index }) {
  const config = categoryConfig[entry.category];
  const Icon = config?.icon || Book;
  const importanceConf = importanceConfig[entry.importance] || importanceConfig.normal;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.02 }}
    >
      <Card
        className={cn(
          "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01]",
          config?.border,
          "bg-slate-800/50"
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", config?.bg)}>
              <Icon className={cn("w-5 h-5", config?.color)} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-gray-200 leading-tight">{entry.title}</h3>
                <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
              </div>
              
              <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                {entry.summary || 'No summary available'}
              </p>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={cn("text-[9px]", config?.bg, config?.color, config?.border)}>
                  {entry.category}
                </Badge>
                {entry.importance !== 'normal' && (
                  <Badge className={cn("text-[9px]", importanceConf.color)}>
                    {importanceConf.label}
                  </Badge>
                )}
                {entry.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-[9px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EntryDetailView({ entry, onBack, onGenerateSummary, generatingSummary }) {
  const config = categoryConfig[entry.category];
  const Icon = config?.icon || Book;
  const importanceConf = importanceConfig[entry.importance] || importanceConfig.normal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className={cn("bg-slate-900/80", config?.border)}>
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              ← Back
            </Button>
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", config?.bg)}>
              <Icon className={cn("w-6 h-6", config?.color)} />
            </div>
          </div>
          
          <CardTitle className="text-2xl text-gray-200 mb-3">{entry.title}</CardTitle>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn(config?.bg, config?.color, config?.border)}>
              {entry.category}
            </Badge>
            {entry.importance !== 'normal' && (
              <Badge className={cn(importanceConf.color)}>
                <Star className="w-3 h-3 mr-1" />
                {importanceConf.label}
              </Badge>
            )}
            {entry.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Summary */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Summary</h3>
              {!entry.summary?.includes('AI-generated') && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onGenerateSummary(entry)}
                  disabled={generatingSummary}
                  className="text-xs"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {generatingSummary ? 'Generating...' : 'Enhance with AI'}
                </Button>
              )}
            </div>
            <p className="text-gray-300 leading-relaxed">
              {entry.summary || 'No summary available for this entry.'}
            </p>
          </div>

          {/* Details */}
          {entry.details && Object.keys(entry.details).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Details</h3>
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                {Object.entries(entry.details).map(([key, value]) => {
                  if (value === null || value === undefined) return null;
                  
                  const displayValue = Array.isArray(value) ? value.join(', ') :
                                     typeof value === 'object' ? JSON.stringify(value) :
                                     String(value);
                  
                  return (
                    <div key={key} className="flex gap-2 text-sm">
                      <span className="text-gray-500 min-w-[120px]">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                      </span>
                      <span className="text-gray-300">{displayValue}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Related Entries */}
          {entry.related_entries && entry.related_entries.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Related</h3>
              <div className="flex flex-wrap gap-2">
                {entry.related_entries.map(relatedId => (
                  <Badge key={relatedId} variant="outline" className="text-xs">
                    {relatedId.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Discovery Info */}
          <div className="pt-4 border-t border-slate-700">
            <p className="text-xs text-gray-500">
              Discovered on turn {entry.discovered_turn} • Last updated {new Date(entry.last_updated).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}