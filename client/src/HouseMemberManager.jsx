import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Crown, Shield, TrendingUp, AlertTriangle, Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROLE_ICONS = {
  diplomat: '🤝',
  military_commander: '⚔️',
  spymaster: '🕵️',
  treasurer: '💰',
  advisor: '📜',
  heir_apparent: '👑',
  none: '—'
};

const ROLE_BONUSES = {
  diplomat: { bonus: 'faction_relations', value: 5, description: '+5% to all faction gains' },
  military_commander: { bonus: 'fleet_power', value: 10, description: '+10% fleet combat power' },
  spymaster: { bonus: 'intel_income', value: 3, description: '+3 intel per turn' },
  treasurer: { bonus: 'credit_income', value: 500, description: '+500₵ per turn' },
  advisor: { bonus: 'skill_xp', value: 15, description: '+15% skill XP gain' },
  heir_apparent: { bonus: 'succession', value: 100, description: 'Designated successor' }
};

export default function HouseMemberManager({ 
  members = [], 
  houseId,
  onAssignRole,
  onDismissRole,
  onTrainMember,
  onMarryMember,
  onRecruitMember,
  isProcessing 
}) {
  const [selectedMember, setSelectedMember] = useState(null);
  
  const activeMembers = members.filter(m => m.status !== 'deceased');
  const heirs = activeMembers.filter(m => m.relation === 'heir' || m.role === 'heir_apparent');
  const assignedRoles = activeMembers.filter(m => m.role !== 'none');
  
  return (
    <div className="space-y-4">
      <Card className="bg-slate-900/80 border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-amber-400 text-sm flex items-center gap-2">
            <Users className="w-4 h-4" />
            Family Members ({activeMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-slate-800/50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-400">Heirs</p>
              <p className="text-lg font-bold text-amber-300">{heirs.length}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-400">Assigned</p>
              <p className="text-lg font-bold text-cyan-300">{assignedRoles.length}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-400">Training</p>
              <p className="text-lg font-bold text-purple-300">
                {activeMembers.filter(m => m.status === 'training').length}
              </p>
            </div>
          </div>
          
          {activeMembers.length === 0 && (
            <p className="text-xs text-gray-500 text-center py-4">
              No family members yet. Recruit or marry to grow your dynasty.
            </p>
          )}
          
          {/* Member List */}
          {activeMembers.map((member, i) => (
            <div
              key={member.id || i}
              className={cn(
                "bg-slate-800/50 rounded-lg p-3 border transition-all cursor-pointer",
                selectedMember?.id === member.id ? "border-amber-500" : "border-slate-700"
              )}
              onClick={() => setSelectedMember(member)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-bold text-gray-200">{member.member_name}</p>
                    {member.role === 'heir_apparent' && (
                      <Crown className="w-3 h-3 text-amber-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-500/20 text-purple-300 text-[9px]">
                      {member.relation}
                    </Badge>
                    <Badge className="bg-cyan-500/20 text-cyan-300 text-[9px]">
                      {member.role !== 'none' ? ROLE_ICONS[member.role] + ' ' + member.role.replace('_', ' ') : 'Unassigned'}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500">Age {member.age}</p>
                  <Badge className={cn(
                    "text-[9px]",
                    member.health === 'excellent' ? "bg-green-500/20 text-green-400" :
                    member.health === 'good' ? "bg-cyan-500/20 text-cyan-400" :
                    member.health === 'fair' ? "bg-amber-500/20 text-amber-400" :
                    "bg-red-500/20 text-red-400"
                  )}>
                    {member.health}
                  </Badge>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="text-center">
                  <p className="text-[10px] text-gray-500">Loyalty</p>
                  <Progress value={member.loyalty} className="h-1 mb-1" />
                  <p className="text-[9px] text-gray-400">{member.loyalty}%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-500">Ambition</p>
                  <Progress value={member.ambition} className="h-1 mb-1" />
                  <p className="text-[9px] text-gray-400">{member.ambition}%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-500">Competence</p>
                  <Progress value={member.competence} className="h-1 mb-1" />
                  <p className="text-[9px] text-gray-400">{member.competence}%</p>
                </div>
              </div>
              
              {/* Traits */}
              <div className="flex gap-2 text-[10px]">
                <span className="text-amber-400">R:{member.traits?.reach || 3}</span>
                <span className="text-cyan-400">G:{member.traits?.grasp || 3}</span>
                <span className="text-purple-400">I:{member.traits?.insight || 3}</span>
              </div>
              
              {member.status === 'training' && member.assigned_mission && (
                <p className="text-[10px] text-purple-400 mt-2 italic">
                  Training: {member.assigned_mission}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Member Management */}
      {selectedMember && (
        <Card className="bg-slate-900/80 border-amber-500/50">
          <CardHeader>
            <CardTitle className="text-amber-400 text-sm flex items-center justify-between">
              <span>Manage: {selectedMember.member_name}</span>
              <Button size="sm" variant="ghost" onClick={() => setSelectedMember(null)} className="h-6">
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Role Assignment */}
            <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
              <p className="text-xs text-gray-400 mb-2">Assign Role</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(ROLE_BONUSES).map(([role, data]) => {
                  const isAssigned = selectedMember.role === role;
                  const canAssign = selectedMember.competence >= 60 || role === 'heir_apparent';
                  
                  return (
                    <Button
                      key={role}
                      size="sm"
                      variant={isAssigned ? "default" : "outline"}
                      disabled={isProcessing || !canAssign || (role === 'heir_apparent' && selectedMember.relation !== 'heir' && selectedMember.relation !== 'child')}
                      onClick={() => onAssignRole(selectedMember.id, role)}
                      className={cn(
                        "text-xs h-auto py-2",
                        isAssigned && "bg-amber-600"
                      )}
                    >
                      <div className="text-center">
                        <div>{ROLE_ICONS[role]} {role.replace('_', ' ')}</div>
                        <div className="text-[9px] text-gray-400 mt-1">{data.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
              
              {selectedMember.role !== 'none' && (
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isProcessing}
                  onClick={() => onDismissRole(selectedMember.id)}
                  className="w-full mt-2"
                >
                  Dismiss from Role
                </Button>
              )}
            </div>
            
            {/* Training */}
            <Button
              onClick={() => onTrainMember(selectedMember.id, 'combat')}
              disabled={isProcessing || selectedMember.status === 'training'}
              size="sm"
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <TrendingUp className="w-3 h-3 mr-2" />
              Train Member (1000₵, 3 turns)
            </Button>
            
            {/* Potential Warnings */}
            {selectedMember.loyalty < 40 && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-2 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                <div className="text-xs text-red-300">
                  <p className="font-bold">Low Loyalty Warning</p>
                  <p className="text-[10px] text-red-400/80">
                    May cause internal conflict or betrayal
                  </p>
                </div>
              </div>
            )}
            
            {selectedMember.ambition > 80 && selectedMember.competence > 70 && selectedMember.role !== 'heir_apparent' && (
              <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-2 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                <div className="text-xs text-amber-300">
                  <p className="font-bold">High Ambition</p>
                  <p className="text-[10px] text-amber-400/80">
                    May seek more power or challenge succession
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Recruit New Member */}
      <Card className="bg-slate-900/80 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-sm">Expand Dynasty</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={() => onMarryMember()}
            disabled={isProcessing || members.some(m => m.relation === 'spouse')}
            size="sm"
            className="w-full bg-pink-600 hover:bg-pink-700"
          >
            <Heart className="w-3 h-3 mr-2" />
            Arrange Marriage (3000₵)
          </Button>
          
          <Button
            onClick={() => onRecruitMember('advisor')}
            disabled={isProcessing}
            size="sm"
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            <Star className="w-3 h-3 mr-2" />
            Recruit Advisor (2000₵)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}