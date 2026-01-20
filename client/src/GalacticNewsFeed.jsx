import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Radio, AlertTriangle, TrendingUp, Sparkles, Users, 
  Coins, Target, Home, Globe, Zap, Filter, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { aggregateNews, analyzeNewsImpact, NEWS_CATEGORIES, NEWS_PRIORITY } from './GalacticNewsSystem';

const categoryConfig = {
  [NEWS_CATEGORIES.FACTION]: { icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' },
  [NEWS_CATEGORIES.ECONOMIC]: { icon: Coins, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
  [NEWS_CATEGORIES.EVENT]: { icon: Zap, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  [NEWS_CATEGORIES.QUEST]: { icon: Target, color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30' },
  [NEWS_CATEGORIES.HOUSING]: { icon: Home, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
  [NEWS_CATEGORIES.DIPLOMATIC]: { icon: Users, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
  [NEWS_CATEGORIES.EXPLORATION]: { icon: Globe, color: 'text-violet-400', bg: 'bg-violet-500/20', border: 'border-violet-500/30' }
};

const priorityConfig = {
  [NEWS_PRIORITY.CRITICAL]: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50', label: 'CRITICAL' },
  [NEWS_PRIORITY.HIGH]: { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30', label: 'HIGH' },
  [NEWS_PRIORITY.MEDIUM]: { color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30', label: 'MEDIUM' },
  [NEWS_PRIORITY.LOW]: { color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30', label: 'LOW' }
};

export default function GalacticNewsFeed({ 
  gameState, 
  factions = [], 
  marketState = {}, 
  activeEvents = [], 
  quests = [],
  housing = null,
  previousState = {},
  compact = false
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAnalysis, setShowAnalysis] = useState(true);
  
  const newsItems = useMemo(() => 
    aggregateNews(gameState, factions, marketState, activeEvents, quests, housing, previousState),
    [gameState, factions, marketState, activeEvents, quests, housing, previousState]
  );
  
  const analysis = useMemo(() => 
    analyzeNewsImpact(newsItems),
    [newsItems]
  );
  
  const filteredNews = selectedCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  if (compact) {
    return (
      <Card className="bg-slate-900/80 border-cyan-900/30">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs text-cyan-400">Galactic Feed</span>
            </div>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[9px]">
              {newsItems.filter(n => n.priority === NEWS_PRIORITY.CRITICAL).length} CRITICAL
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Feed Header */}
      <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500/50 overflow-hidden relative">
        {/* Animated scan line */}
        <motion.div
          className="absolute inset-0 h-1 bg-cyan-400/30"
          animate={{ y: [0, '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2 text-cyan-400">
              <Radio className="w-4 h-4 animate-pulse" />
              Galactic News Feed
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-[9px]">
                LIVE
              </Badge>
            </CardTitle>
            <Badge variant="outline" className="text-[10px] text-gray-400">
              {newsItems.length} Updates
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-2 text-xs text-cyan-300">
            <Sparkles className="w-3 h-3" />
            <p className="flex-1">{analysis.summary}</p>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Panel */}
      {showAnalysis && (analysis.major_threats.length > 0 || analysis.major_opportunities.length > 0) && (
        <Card className="bg-slate-900/80 border-violet-500/30">
          <CardHeader className="pb-3 cursor-pointer" onClick={() => setShowAnalysis(!showAnalysis)}>
            <CardTitle className="text-xs flex items-center gap-2 text-violet-400">
              <Sparkles className="w-3 h-3" />
              AI Analysis
              <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 text-[9px] ml-auto">
                Urgency: {analysis.urgency_score}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.major_threats.length > 0 && (
              <div>
                <p className="text-[10px] text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Major Threats Detected
                </p>
                <div className="space-y-1">
                  {analysis.major_threats.slice(0, 3).map((threat, i) => (
                    <div key={i} className="text-xs text-red-300 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-red-400" />
                      {threat.headline} (Level {threat.threat_level})
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {analysis.major_opportunities.length > 0 && (
              <div>
                <p className="text-[10px] text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Major Opportunities
                </p>
                <div className="space-y-1">
                  {analysis.major_opportunities.slice(0, 3).map((opp, i) => (
                    <div key={i} className="text-xs text-green-300 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-green-400" />
                      {opp.headline} (Value {opp.opportunity_value})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Category Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3 h-3 text-gray-500" />
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
          className={cn("text-xs h-7", selectedCategory === 'all' && "bg-cyan-600/20 border-cyan-500/50")}
        >
          All ({newsItems.length})
        </Button>
        {Object.entries(NEWS_CATEGORIES).map(([key, value]) => {
          const count = newsItems.filter(n => n.category === value).length;
          if (count === 0) return null;
          return (
            <Button
              key={value}
              variant={selectedCategory === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(value)}
              className={cn("text-xs h-7", selectedCategory === value && "bg-cyan-600/20 border-cyan-500/50")}
            >
              {key} ({count})
            </Button>
          );
        })}
      </div>

      {/* News Feed */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
        <AnimatePresence mode="popLayout">
          {filteredNews.length === 0 ? (
            <div className="text-center py-8">
              <Radio className="w-12 h-12 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No news in this category</p>
            </div>
          ) : (
            filteredNews.map((item, index) => (
              <NewsItem key={item.id} item={item} index={index} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NewsItem({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  const categoryConf = categoryConfig[item.category] || categoryConfig[NEWS_CATEGORIES.EVENT];
  const priorityConf = priorityConfig[item.priority] || priorityConfig[NEWS_PRIORITY.MEDIUM];
  const CategoryIcon = categoryConf.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card className={cn(
        "bg-slate-800/50 border hover:shadow-lg transition-all cursor-pointer",
        priorityConf.border,
        item.priority === NEWS_PRIORITY.CRITICAL && "animate-pulse"
      )}>
        <CardHeader className="pb-2" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-start gap-3">
            <div className={cn("w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0", categoryConf.bg, categoryConf.border)}>
              <CategoryIcon className={cn("w-4 h-4", categoryConf.color)} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-sm font-semibold text-gray-200 leading-tight">{item.headline}</h4>
                <ChevronDown className={cn(
                  "w-4 h-4 text-gray-400 transition-transform flex-shrink-0",
                  expanded && "rotate-180"
                )} />
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={cn("text-[9px]", priorityConf.bg, priorityConf.color, priorityConf.border)}>
                  {priorityConf.label}
                </Badge>
                {item.affects_player && (
                  <Badge className="text-[9px] bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    AFFECTS YOU
                  </Badge>
                )}
                <span className="text-[10px] text-gray-600">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <CardContent className="pt-2">
                <p className="text-xs text-gray-400 mb-3">{item.content}</p>
                
                {item.impact && (
                  <div className="flex items-center gap-4 text-[10px]">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      <span className="text-gray-500">Threat:</span>
                      <span className="text-red-400 font-semibold">{item.impact.threat_level}/10</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-gray-500">Opportunity:</span>
                      <span className="text-green-400 font-semibold">{item.impact.opportunity}/10</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}