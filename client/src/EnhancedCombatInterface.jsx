import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Users, Swords, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import DetailedCombatLog from './DetailedCombatLog';
import ShipDamageVisualizer, { FleetDamageOverview } from './ShipDamageVisualizer';
import { TARGETABLE_COMPONENTS } from './ComponentTargetingSystem';

export default function EnhancedCombatInterface({
  playerFleet,
  enemyFleet,
  combatLog,
  onAttack,
  onComponentTarget,
  onBoardingAction,
  onUseAbility,
  currentTurn,
  isPlayerTurn,
  isProcessing
}) {
  const [selectedPlayerShip, setSelectedPlayerShip] = useState(null);
  const [selectedEnemyShip, setSelectedEnemyShip] = useState(null);
  const [targetingMode, setTargetingMode] = useState('normal'); // normal, component, boarding

  const handleAttack = () => {
    if (!selectedPlayerShip || !selectedEnemyShip) return;

    if (targetingMode === 'normal') {
      onAttack(selectedPlayerShip, selectedEnemyShip);
    } else if (targetingMode === 'boarding') {
      onBoardingAction(selectedPlayerShip, selectedEnemyShip);
      setTargetingMode('normal');
    }
  };

  const handleComponentTarget = (component) => {
    if (!selectedPlayerShip || !selectedEnemyShip) return;
    onComponentTarget(selectedPlayerShip, selectedEnemyShip, component);
    setTargetingMode('normal');
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Player Fleet */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-cyan-400">Your Fleet</h4>
        <FleetDamageOverview fleet={playerFleet} />
        {playerFleet.ships.map(ship => (
          <motion.div key={ship.id} whileHover={{ scale: 1.02 }}>
            <Button
              variant="outline"
              onClick={() => setSelectedPlayerShip(ship)}
              className={cn(
                'w-full p-0 h-auto',
                selectedPlayerShip?.id === ship.id && 'ring-2 ring-cyan-500'
              )}
            >
              <ShipDamageVisualizer ship={ship} className="border-0 w-full" />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Combat Actions */}
      <div className="space-y-3">
        <Card className="bg-slate-900/90 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-sm text-amber-400">Combat Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Tabs value={targetingMode} onValueChange={setTargetingMode}>
              <TabsList className="grid grid-cols-3 bg-slate-800">
                <TabsTrigger value="normal" className="text-xs">
                  <Swords className="w-3 h-3 mr-1" />
                  Attack
                </TabsTrigger>