import gameStateInstance from '../core/GameStateManager';

class PlayerActions {
  // 1. Analyze the game state to determine what actions are currently possible
  getAvailableActions(fullGameState) {
    if (!fullGameState?.player) return [];

    const available = [];
    const player = fullGameState.player;

    // Check for nearby vehicles to enter
    const closestVehicle = this.findClosestEntity(player, fullGameState.vehicles, 15);
    if (closestVehicle) {
      available.push({
        id: 'ENTER_VEHICLE',
        label: 'Enter Vehicle',
        targetId: closestVehicle.id
      });
    }

    // Check for nearby missions to start
    const closestMission = this.findClosestEntity(player, fullGameState.worldMissions, 20);
    if (closestMission && !closestMission.isDone) {
      available.push({
        id: 'START_MISSION',
        label: 'Begin Mission',
        targetId: closestMission.id
      });
    }

    return available;
  }

  // 2. Execute a specific action requested by the player UI
  triggerAction(actionId, targetId) {
    if (!actionId || !targetId) return;

    console.log(`[PlayerActions] Triggering action: ${actionId} for target: ${targetId}`);

    switch (actionId) {
      case 'ENTER_VEHICLE':
        // This logic should ideally be in a dedicated controller,
        // but for now, we directly manipulate the game state.
        if (gameStateInstance.runtimeWorldState.vehicles[targetId]) {
          // Mark the vehicle as jacked by the player
          gameStateInstance.runtimeWorldState.vehicles[targetId].isJacked = true;
          // Associate the player with the vehicle
          gameStateInstance.activePlayer.currentVehicleId = targetId;
          console.log(`[PlayerActions] Player has entered vehicle ${targetId}.`);
        }
        break;
      case 'START_MISSION':
        const mission = gameStateInstance.runtimeWorldState.worldMissions.find(m => m.id === targetId);
        if (mission) {
          // For now, we'll just log it. A real implementation would change the mission state.
          console.log(`[PlayerActions] Player has started mission: ${mission.title}`);
          // Example: mission.status = 'IN_PROGRESS';
        }
        break;
      default:
        console.warn(`[PlayerActions] Unknown action: ${actionId}`);
    }
  }

  // Helper function to find the closest entity to the player within a given radius
  findClosestEntity(player, entityDict, radius) {
    let closest = null;
    let minDistance = radius;

    for (const id in entityDict) {
      const entity = entityDict[id];
      // Ensure the entity has a position before calculating distance
      if (entity.x && entity.y) {
        const distance = Math.hypot(player.x - entity.x, player.y - entity.y);
        if (distance < minDistance) {
          minDistance = distance;
          closest = entity;
        }
      }
    }
    return closest;
  }
}

const playerActionsInstance = new PlayerActions();
export default playerActionsInstance;
