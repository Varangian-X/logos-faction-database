import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export function calculateSuccessionScore(member) {
  let score = 0;
  
  // Base factors
  score += (member.competence || 50) * 0.5;
  score += (member.loyalty || 50) * 0.3;
  score += ((member.traits?.reach || 3) + (member.traits?.grasp || 3) + (member.traits?.insight || 3)) * 3;
  
  // Role bonus
  if (member.role !== 'none' && member.role !== 'heir_apparent') score += 20;
  if (member.role === 'military_commander') score += 15;
  if (member.role === 'diplomat') score += 10;
  
  // Achievements
  score += (member.achievements || []).length * 5;
  
  // Age factor (prefer 25-50)
  if (member.age >= 25 && member.age <= 50) score += 15;
  else if (member.age < 25) score -= 10;
  else if (member.age > 60) score -= 20;
  
  // Health penalty
  if (member.health === 'poor' || member.health === 'critical') score -= 30;
  
  // High ambition + low loyalty = dangerous
  if (member.ambition > 70 && member.loyalty < 50) score -= 25;
  
  return Math.max(0, score);
}

export function detectSuccessionThreat(members) {
  const designated = members.find(m => m.role === 'heir_apparent');
  
  if (!designated) return { threat: false, reason: 'No heir designated' };
  
  // Check for rival claimants
  const rivals = members.filter(m => 
    m.id !== designated.id &&
    (m.relation === 'heir' || m.relation === 'child') &&
    m.ambition > 70 &&
    m.competence > designated.competence &&
    m.loyalty < 60
  );
  
  if (rivals.length > 0) {
    return {
      threat: true,
      level: rivals.length > 1 ? 'high' : 'moderate',
      rivals: rivals.map(r => r.member_name),
      reason: `${rivals.length} ambitious ${rivals.length > 1 ? 'members challenge' : 'member challenges'} designated heir`
    };
  }
  
  return { threat: false };
}

export default function SuccessionManager({
  members = [],
  currentLeader,
  onDesignateHeir,
  onResolveConflict,
  isProcessing
}) {
  const heirs = members.filter(m => 
    (m.relation === 'heir' || m.relation === 'child') && 
    m.status === 'active' &&
    m.age >= 18
  );
  
  const designated = members.find(m => m.role === 'heir_apparent');
  const threat = detectSuccessionThreat(members);
  
  // Score all potential heirs
  const scoredHeirs = heirs.map(h => ({
    ...h,
    successionScore: calculateSuccessionScore(h)
  })).sort((a, b) => b.successionScore - a.successionScore);
  
  return (
    <div className="space-y-4">
      <Card className="bg-slate-900/80 border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-amber-400 text-sm flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Line of Succession
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Current Designation */}
          {designated ? (
            <div className="bg-amber-900/20 border border-amber-500/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <p className="text-sm font-bold text-amber-300">Heir Apparent</p>
              </div>
              <p className="text-xs text-gray-200 mb-2">{designated.member_name}</p>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div>
                  <span className="text-gray-500">Loyalty:</span>
                  <span className={cn(
                    "ml-1 font-bold",
                    designated.loyalty >= 75 ? "text-green-400" :
                    designated.loyalty >= 50 ? "text-amber-400" : "text-red-400"
                  )}>{designated.loyalty}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Competence:</span>
                  <span className="ml-1 font-bold text-cyan-400">{designated.competence}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Score:</span>
                  <span className="ml-1 font-bold text-purple-400">
                    {calculateSuccessionScore(designated).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <p className="text-xs text-red-300">No heir designated - succession uncertain</p>
              </div>
            </div>
          )}
          
          {/* Succession Threat */}
          {threat.threat && (
            <div className={cn(
              "border rounded-lg p-3",
              threat.level === 'high' ? "bg-red-900/30 border-red-500/50" : "bg-amber-900/30 border-amber-500/50"
            )}>
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className={cn(
                  "w-4 h-4",
                  threat.level === 'high' ? "text-red-400" : "text-amber-400"
                )} />
                <div>
                  <p className="text-xs font-bold text-red-300">Succession Threat Detected</p>
                  <p className="text-[10px] text-gray-400 mt-1">{threat.reason}</p>
                  {threat.rivals && (
                    <p className="text-[10px] text-red-300 mt-1">
                      Rivals: {threat.rivals.join(', ')}
                    </p>
                  )}
                </div>
              </div>
              
              {onResolveConflict && (
                <Button
                  onClick={() => onResolveConflict(threat)}
                  disabled={isProcessing}
                  size="sm"
                  className="w-full bg-red-600 hover:bg-red-700 h-6 text-xs mt-2"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Resolve Conflict
                </Button>
              )}
            </div>
          )}
          
          {/* Potential Heirs */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-bold">Potential Heirs</p>
            {scoredHeirs.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-2">
                No eligible heirs. Grow your family.
              </p>
            )}
            
            {scoredHeirs.map((heir, i) => (
              <div
                key={heir.id || i}
                className={cn(
                  "bg-slate-800/50 rounded-lg p-2 border",
                  heir.id === designated?.id ? "border-amber-500/50" : "border-slate-700"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs font-bold text-gray-200">{heir.member_name}</p>
                    <p className="text-[10px] text-gray-500">{heir.relation} • Age {heir.age}</p>
                  </div>
                  <Badge className={cn(
                    "text-[9px]",
                    heir.successionScore >= 80 ? "bg-green-500/20 text-green-400" :
                    heir.successionScore >= 60 ? "bg-cyan-500/20 text-cyan-400" :
                    heir.successionScore >= 40 ? "bg-amber-500/20 text-amber-400" :
                    "bg-red-500/20 text-red-400"
                  )}>
                    Score: {heir.successionScore.toFixed(0)}
                  </Badge>
                </div>
                
                <div className="flex gap-2 text-[10px] mb-2">
                  <span className="text-gray-500">Loyalty: <span className="text-green-400">{heir.loyalty}%</span></span>
                  <span className="text-gray-500">Competence: <span className="text-cyan-400">{heir.competence}%</span></span>
                  <span className="text-gray-500">Ambition: <span className="text-amber-400">{heir.ambition}%</span></span>
                </div>
                
                {heir.id !== designated?.id && (
                  <Button
                    onClick={() => onDesignateHeir(heir.id)}
                    disabled={isProcessing}
                    size="sm"
                    className="w-full bg-amber-600 hover:bg-amber-700 h-6 text-xs"
                  >
                    <Crown className="w-3 h-3 mr-1" />
                    Designate as Heir
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}