// Save Game Manager - Handle save and load operations
import { base44 } from '@/api/base44Client';

export async function saveGame(gameState, saveType = 'manual', saveName = null, slotNumber = null) {
  try {
    const existingSaves = await base44.entities.SaveGame.filter({ save_type: saveType });
    
    let targetSlot = slotNumber;
    
    if (!targetSlot) {
      if (saveType === 'manual') {
        // Find first available slot (1-3) or use slot 1
        const usedSlots = existingSaves.map(s => s.slot_number);
        targetSlot = [1, 2, 3].find(slot => !usedSlots.includes(slot)) || 1;
      } else {
        // Auto-save: rotate through slots 1-3, overwriting oldest
        if (existingSaves.length < 3) {
          targetSlot = existingSaves.length + 1;
        } else {
          // Find oldest save
          const oldest = existingSaves.sort((a, b) => 
            new Date(a.updated_date) - new Date(b.updated_date)
          )[0];
          targetSlot = oldest.slot_number;
        }
      }
    }

    const saveData = {
      save_type: saveType,
      slot_number: targetSlot,
      game_state_id: gameState.id,
      save_name: saveName || `${saveType === 'auto' ? 'Auto-Save' : 'Manual Save'} ${targetSlot} - Turn ${gameState.turn_number}`,
      character_name: gameState.character_name,
      house_name: gameState.house_name,
      turn_number: gameState.turn_number,
      location: gameState.current_location,
      snapshot: {
        credits: gameState.credits,
        reputation: gameState.reputation,
        tier: gameState.tier
      }
    };

    const existingSlotSave = existingSaves.find(s => s.slot_number === targetSlot);
    
    if (existingSlotSave) {
      await base44.entities.SaveGame.update(existingSlotSave.id, saveData);
      return { success: true, message: `Saved to ${saveType} slot ${targetSlot}`, saveId: existingSlotSave.id };
    } else {
      const newSave = await base44.entities.SaveGame.create(saveData);
      return { success: true, message: `Saved to ${saveType} slot ${targetSlot}`, saveId: newSave.id };
    }
  } catch (error) {
    console.error('Save failed:', error);
    return { success: false, message: 'Failed to save game', error };
  }
}

export async function loadGame(saveId) {
  try {
    const save = await base44.entities.SaveGame.filter({ id: saveId });
    if (!save || save.length === 0) {
      return { success: false, message: 'Save not found' };
    }

    const gameState = await base44.entities.GameState.filter({ id: save[0].game_state_id });
    if (!gameState || gameState.length === 0) {
      return { success: false, message: 'Game state not found' };
    }

    return { success: true, gameStateId: save[0].game_state_id, gameState: gameState[0], save: save[0] };
  } catch (error) {
    console.error('Load failed:', error);
    return { success: false, message: 'Failed to load game', error };
  }
}

export async function getSaveSlots() {
  try {
    const saves = await base44.entities.SaveGame.list();
    return {
      manual: saves.filter(s => s.save_type === 'manual').sort((a, b) => a.slot_number - b.slot_number),
      auto: saves.filter(s => s.save_type === 'auto').sort((a, b) => a.slot_number - b.slot_number)
    };
  } catch (error) {
    console.error('Failed to get save slots:', error);
    return { manual: [], auto: [] };
  }
}

export async function deleteSave(saveId) {
  try {
    await base44.entities.SaveGame.delete(saveId);
    return { success: true, message: 'Save deleted successfully' };
  } catch (error) {
    console.error('Delete failed:', error);
    return { success: false, message: 'Failed to delete save', error };
  }
}