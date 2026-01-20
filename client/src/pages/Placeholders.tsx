import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from 'wouter';
import { ArrowLeft, Construction } from 'lucide-react';

const PlaceholderPage = ({ title }: { title: string }) => {
  const [, setLocation] = useLocation();
  
  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 p-8 flex items-center justify-center">
      <Card className="max-w-md w-full bg-[#151e32] border-yellow-500/50">
        <CardHeader>
          <CardTitle className="text-yellow-500 flex items-center gap-2">
            <Construction className="h-6 w-6" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400">
            This module is currently under development or restricted by Vermilion Clearance protocols.
          </p>
          <Button 
            variant="outline" 
            className="w-full border-gray-600 hover:bg-gray-800"
            onClick={() => setLocation('/game')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Command
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const CompanionPanelPage = () => <PlaceholderPage title="Companion Roster" />;
export const IntelAnalytics = () => <PlaceholderPage title="Intel Analytics" />;
export const WorldMap = () => <PlaceholderPage title="World Map" />;
export const CitizenProfile = () => <PlaceholderPage title="Citizen Database" />;
export const CharacterSheet = () => <PlaceholderPage title="Character Sheet" />;
export const TacticalBattle = () => <PlaceholderPage title="Tactical Battle" />;
export const CharacterSkirmish = () => <PlaceholderPage title="Character Skirmish" />;
export const FleetManagement = () => <PlaceholderPage title="Fleet Management" />;
