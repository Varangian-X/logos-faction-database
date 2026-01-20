import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, TrendingUp, AlertTriangle, Sparkles, ChevronRight, 
  Target, Shield, Coins, Users, Zap, Eye, ChevronDown, ChevronUp,
  Activity, Award, BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateAdvisorRecommendations } from './AIAdvisorSystem';

const categoryIcons = {
  economic: Coins,
  diplomatic: Users,
  companions: Shield,
  events: AlertTriangle,
  quests: Target,
  resources: Zap,
  intelligence: Eye
};

const categoryColors = {
  economic: 'text-amber-400',
  diplomatic: 'text-purple-400',
  companions: 'text-blue-400',
  events: 'text-red-400',
  quests: 'text-cyan-400',
  resources: 'text-green-400',
  intelligence: 'text-violet-400'
};

const impactConfig = {
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/20' },
  high: { label: 'High', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  medium: { label: 'Medium', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  low: { label: 'Low', color: 'text-gray-400', bg: 'bg-gray-500/20' }
};

export default function AIAdvisorHub({ 
  gameState, 
  factions = [], 
  companions = [], 
  activeEvents = [],
  marketState = {},
  quests = [],
  onActionClick 
}) {
  const [selectedView, setSelectedView] = useState('overview');
  const [expandedSection, setExpandedSection] = useState(null);

  const analysis = useMemo(() => 
    generateAdvisorRecommendations(gameState, factions, companions, activeEvents, marketState, quests),
    [gameState, factions, companions, activeEvents, marketState, quests]
  );

  return (
    <div className="bg-slate-900/90 rounded-xl border border-cyan-900/30 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
            <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-cyan-400 font-semibold uppercase tracking-wider text-sm">
              AI Strategic Advisor
            </h3>
            <p className="text-xs text-gray-500">Real-time analysis and recommendations</p>
          </div>
        </div>
        <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-xs">
          <Activity className="w-3 h-3 mr-1" />
          Active
        </Badge>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={selectedView === 'overview' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedView('overview')}
          className={cn(
            "flex-1 text-xs",
            selectedView === 'overview' && "bg-cyan-600/20 border-cyan-500/50"
          )}
        >
          <BarChart3 className="w-3 h-3 mr-1" />
          Overview
        </Button>
        <Button
          variant={selectedView === 'recommendations' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedView('recommendations')}
          className={cn(
            "flex-1 text-xs",
            selectedView === 'recommendations' && "bg-cyan-600/20 border-cyan-500/50"
          )}
        >
          <Target className="w-3 h-3 mr-1" />
          Actions
        </Button>
        <Button
          variant={selectedView === 'threats' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedView('threats')}
          className={cn(
            "flex-1 text-xs",
            selectedView === 'threats' && "bg-cyan-600/20 border-cyan-500/50"
          )}
        >
          <AlertTriangle className="w-3 h-3 mr-1" />
          Threats
        </Button>
        <Button
          variant={selectedView === 'opportunities' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedView('opportunities')}
          className={cn(
            "flex-1 text-xs",
            selectedView === 'opportunities' && "bg-cyan-600/20 border-cyan-500/50"
          )}
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Opportunities
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        <AnimatePresence mode="wait">
          {selectedView === 'overview' && (
            <StrategicOverview 
              overview={analysis.strategic_overview} 
              key="overview"
            />
          )}
          
          {selectedView === 'recommendations' && (
            <RecommendationsList 
              recommendations={analysis.top_recommendations}
              expandedSection={expandedSection}
              setExpandedSection={setExpandedSection}
              onActionClick={onActionClick}
              key="recommendations"
            />
          )}
          
          {selectedView === 'threats' && (
            <ThreatsList 
              threats={analysis.threats}
              expandedSection={expandedSection}
              setExpandedSection={setExpandedSection}
              key="threats"
            />
          )}
          
          {selectedView === 'opportunities' && (
            <OpportunitiesList 
              opportunities={analysis.opportunities}
              expandedSection={expandedSection}
              setExpandedSection={setExpandedSection}
              key="opportunities"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StrategicOverview({ overview }) {
  const metrics = overview.metrics;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Overall Status */}
      <Card className="bg-slate-800/50 border-cyan-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-cyan-300 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Strategic Position
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Overall Stability</span>
              <span className="text-lg font-bold text-cyan-400">{metrics.overall_stability}%</span>
            </div>
            <Progress 
              value={metrics.overall_stability} 
              className="h-2 bg-slate-700"
              indicatorClassName="bg-cyan-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/50">
            <div className="bg-slate-900/50 rounded p-2">
              <p className="text-[10px] text-gray-500 uppercase mb-1">Phase</p>
              <p className="text-xs text-cyan-300 font-semibold">{overview.phase}</p>
            </div>
            <div className="bg-slate-900/50 rounded p-2">
              <p className="text-[10px] text-gray-500 uppercase mb-1">Focus</p>
              <p className="text-xs text-cyan-300 font-semibold">{overview.strategic_focus?.split(' - ')[0]}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard 
          label="Economic Health"
          value={metrics.economic_health}
          icon={Coins}
          color="amber"
        />
        <MetricCard 
          label="Diplomatic Position"
          value={metrics.diplomatic_position}
          icon={Users}
          color="purple"
        />
        <MetricCard 
          label="Military Strength"
          value={metrics.military_strength}
          icon={Shield}
          color="red"
        />
        <MetricCard 
          label="Political Influence"
          value={metrics.political_influence}
          icon={TrendingUp}
          color="cyan"
        />
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-slate-800/50 border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-green-400">Key Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {overview.key_strengths.map((strength, i) => (
                <div key={i} className="text-xs text-green-300 flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-green-400" />
                  {strength}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-red-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-red-400">Key Weaknesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {overview.key_weaknesses.map((weakness, i) => (
                <div key={i} className="text-xs text-red-300 flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-red-400" />
                  {weakness}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Recommendation */}
      <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500/50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-cyan-300 mb-1">AI Recommendation</p>
              <p className="text-xs text-gray-300">{overview.strategic_focus}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MetricCard({ label, value, icon: Icon, color }) {
  const colorClasses = {
    amber: 'text-amber-400 border-amber-500/30',
    purple: 'text-purple-400 border-purple-500/30',
    red: 'text-red-400 border-red-500/30',
    cyan: 'text-cyan-400 border-cyan-500/30'
  };

  return (
    <Card className={cn("bg-slate-800/50 border", colorClasses[color])}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <Icon className={cn("w-4 h-4", colorClasses[color].split(' ')[0])} />
          <span className={cn("text-lg font-bold", colorClasses[color].split(' ')[0])}>
            {value}%
          </span>
        </div>
        <p className="text-[10px] text-gray-500 uppercase">{label}</p>
        <Progress 
          value={value} 
          className="h-1 mt-2 bg-slate-700"
          indicatorClassName={`bg-${color}-500`}
        />
      </CardContent>
    </Card>
  );
}

function RecommendationsList({ recommendations, expandedSection, setExpandedSection, onActionClick }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-2"
    >
      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">All systems optimal</p>
        </div>
      ) : (
        recommendations.map((rec, index) => (
          <RecommendationCard 
            key={rec.id}
            recommendation={rec}
            isExpanded={expandedSection === rec.id}
            onToggle={() => setExpandedSection(expandedSection === rec.id ? null : rec.id)}
            onActionClick={onActionClick}
            index={index}
          />
        ))
      )}
    </motion.div>
  );
}

function RecommendationCard({ recommendation, isExpanded, onToggle, onActionClick, index }) {
  const CategoryIcon = categoryIcons[recommendation.category] || Target;
  const categoryColor = categoryColors[recommendation.category] || 'text-gray-400';
  const impact = impactConfig[recommendation.impact] || impactConfig.medium;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50 transition-all cursor-pointer">
        <CardHeader className="pb-3" onClick={onToggle}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <CategoryIcon className={cn("w-5 h-5 mt-0.5", categoryColor)} />
              <div className="flex-1">
                <CardTitle className="text-sm text-gray-200">{recommendation.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={cn("text-[8px]", impact.bg, impact.color)}>
                    {impact.label} Impact
                  </Badge>
                  <Badge variant="outline" className="text-[8px] text-gray-400">
                    {recommendation.effort} Effort
                  </Badge>
                </div>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <CardContent>
                <p className="text-xs text-gray-400 mb-3">{recommendation.description}</p>
                <Button
                  size="sm"
                  onClick={() => onActionClick && onActionClick(recommendation)}
                  className="w-full bg-cyan-600/20 hover:bg-cyan-600/30 border-cyan-500/50 text-cyan-300"
                >
                  <ChevronRight className="w-3 h-3 mr-1" />
                  Take Action
                </Button>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

function ThreatsList({ threats, expandedSection, setExpandedSection }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-2"
    >
      {threats.length === 0 ? (
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No immediate threats detected</p>
        </div>
      ) : (
        threats.map((threat, index) => (
          <ThreatCard 
            key={threat.id}
            threat={threat}
            isExpanded={expandedSection === threat.id}
            onToggle={() => setExpandedSection(expandedSection === threat.id ? null : threat.id)}
            index={index}
          />
        ))
      )}
    </motion.div>
  );
}

function ThreatCard({ threat, isExpanded, onToggle, index }) {
  const CategoryIcon = categoryIcons[threat.category] || AlertTriangle;
  const severity = Math.min(10, Math.max(1, threat.severity));
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="bg-slate-800/50 border-red-500/30 hover:border-red-500/50 transition-all cursor-pointer">
        <CardHeader className="pb-3" onClick={onToggle}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="flex-1">
                <CardTitle className="text-sm text-red-200">{threat.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="text-[8px] bg-red-500/20 text-red-400 border-red-500/30">
                    Severity: {severity}/10
                  </Badge>
                  <CategoryIcon className="w-3 h-3 text-gray-500" />
                </div>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <CardContent>
                <p className="text-xs text-gray-400 mb-3">{threat.description}</p>
                {threat.actions && threat.actions.length > 0 && (
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase mb-2">Recommended Actions</p>
                    <div className="space-y-1">
                      {threat.actions.map((action, i) => (
                        <div key={i} className="text-xs text-red-300 flex items-center gap-2">
                          <ChevronRight className="w-3 h-3" />
                          {action}
                        </div>
                      ))}
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

function OpportunitiesList({ opportunities, expandedSection, setExpandedSection }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-2"
    >
      {opportunities.length === 0 ? (
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No special opportunities right now</p>
        </div>
      ) : (
        opportunities.map((opp, index) => (
          <OpportunityCard 
            key={opp.id}
            opportunity={opp}
            isExpanded={expandedSection === opp.id}
            onToggle={() => setExpandedSection(expandedSection === opp.id ? null : opp.id)}
            index={index}
          />
        ))
      )}
    </motion.div>
  );
}

function OpportunityCard({ opportunity, isExpanded, onToggle, index }) {
  const CategoryIcon = categoryIcons[opportunity.category] || Sparkles;
  const value = Math.min(10, Math.max(1, opportunity.value));
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="bg-slate-800/50 border-green-500/30 hover:border-green-500/50 transition-all cursor-pointer">
        <CardHeader className="pb-3" onClick={onToggle}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <Sparkles className="w-5 h-5 text-green-400 mt-0.5" />
              <div className="flex-1">
                <CardTitle className="text-sm text-green-200">{opportunity.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="text-[8px] bg-green-500/20 text-green-400 border-green-500/30">
                    Value: {value}/10
                  </Badge>
                  <CategoryIcon className="w-3 h-3 text-gray-500" />
                </div>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <CardContent>
                <p className="text-xs text-gray-400 mb-3">{opportunity.description}</p>
                {opportunity.actions && opportunity.actions.length > 0 && (
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase mb-2">How to Exploit</p>
                    <div className="space-y-1">
                      {opportunity.actions.map((action, i) => (
                        <div key={i} className="text-xs text-green-300 flex items-center gap-2">
                          <ChevronRight className="w-3 h-3" />
                          {action}
                        </div>
                      ))}
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