import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save } from 'lucide-react';
import { Milestone } from '@/lib/milestoneSystem';

interface CustomMilestoneCreatorProps {
  onAddMilestone: (milestone: Milestone) => void;
}

export function CustomMilestoneCreator({ onAddMilestone }: CustomMilestoneCreatorProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');
  const [icon, setIcon] = useState('Trophy');
  const [conditionType, setConditionType] = useState('manual');

  const handleSubmit = () => {
    const newMilestone: Milestone = {
      id: `custom_${Date.now()}`,
      title,
      description,
      reward,
      icon,
      unlocked: false,
      condition: () => false, // Custom milestones are manually toggled by GM
    };

    onAddMilestone(newMilestone);
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setReward('');
    setIcon('Trophy');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
          <Plus className="w-4 h-4 mr-2" />
          Create Custom Milestone
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 border-amber-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-amber-500 font-serif">Create Custom Milestone</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g., The Lost Artifact"
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe the achievement..."
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label>Reward</Label>
            <Input 
              value={reward} 
              onChange={(e) => setReward(e.target.value)} 
              placeholder="e.g., Unlocks Ancient Tech"
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/10">
                <SelectItem value="Trophy">Trophy</SelectItem>
                <SelectItem value="Sword">Sword</SelectItem>
                <SelectItem value="Scroll">Scroll</SelectItem>
                <SelectItem value="Skull">Skull</SelectItem>
                <SelectItem value="Ghost">Ghost</SelectItem>
                <SelectItem value="Coins">Coins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Milestone
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
