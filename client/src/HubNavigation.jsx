import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '../../utils';
import { Home, Building2, Users as UsersIcon, Crown, Shield, Telescope } from 'lucide-react';
import { cn } from '@/lib/utils';

const HUBS = [
  { id: 'main', label: 'Main Game', icon: Home, page: 'GamePlay', color: 'cyan' },
  { id: 'fleet', label: 'Fleet & Economy', icon: Crown, page: 'FleetHub', color: 'amber' },
  { id: 'diplomacy', label: 'Factions', icon: Shield, page: 'DiplomacyHub', color: 'purple' },
  { id: 'dynasty', label: 'House & Family', icon: Crown, page: 'HouseManagement', color: 'amber' },
  { id: 'housing', label: 'Housing', icon: Building2, page: 'PlayerHousing', color: 'cyan' },
  { id: 'exploration', label: 'Science', icon: Telescope, page: 'ExplorationHub', color: 'purple' },
  { id: 'companions', label: 'Companions', icon: UsersIcon, page: 'CompanionHub', color: 'purple' }
];

export default function HubNavigation({ gameStateId, currentPage }) {
  const location = useLocation();
  
  return (
    <div className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-amber-900/30">
      <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto">
        {HUBS.map(hub => {
          const Icon = hub.icon;
          const isActive = currentPage === hub.page;
          const url = createPageUrl(hub.page) + (gameStateId && hub.page === 'GamePlay' ? `?id=${gameStateId}` : '');
          
          return (
            <Link key={hub.id} to={url}>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "flex items-center gap-2",
                  isActive 
                    ? `bg-${hub.color}-500/20 text-${hub.color}-300 hover:bg-${hub.color}-500/30` 
                    : `text-${hub.color}-400 hover:text-${hub.color}-300 hover:bg-${hub.color}-500/10`
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{hub.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}