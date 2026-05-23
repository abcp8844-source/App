
class MissionController {

  // Main update loop for checking mission progress
  update(gameState) {
    if (!gameState.activeMissionId) return;

    const mission = gameState.worldMissions.find(m => m.id === gameState.activeMissionId);
    if (!mission || mission.status !== 'ACTIVE') return;

    let allObjectivesComplete = true;

    // Check each objective's completion status
    mission.objectives.forEach(obj => {
      if (obj.status === 'COMPLETE') return;

      const isComplete = this.checkObjectiveCompletion(obj, gameState);
      if (isComplete) {
        obj.status = 'COMPLETE';
        console.log(`[MissionCtrl] Objective completed: ${obj.description}`);
      } else {
        allObjectivesComplete = false;
      }
    });

    // If all objectives are done, complete the mission
    if (allObjectivesComplete) {
      this.completeMission(mission, gameState);
    }
  }

  checkObjectiveCompletion(objective, gameState) {
    const { player, vehicles } = gameState;
    switch (objective.type) {
      case 'GOTO_LOCATION':
        const dist = Math.hypot(player.x - objective.target.x, player.y - objective.target.y);
        return dist < objective.radius;
      case 'STEAL_VEHICLE':
        const vehicle = vehicles[objective.targetId];
        return vehicle && vehicle.isJacked && player.currentVehicleId === objective.targetId;
      case 'NEUTRALIZE_TARGET':
          const target = gameState.guards.find(g => g.id === objective.targetId);
          return target && target.health <= 0;
      default:
        return false;
    }
  }

  completeMission(mission, gameState) {
    console.log(`[MissionCtrl] Mission complete: ${mission.title}`);
    mission.status = 'COMPLETE';
    
    // Grant rewards to the player
    if (mission.rewards.cash) {
      gameState.player.cash += mission.rewards.cash;
      console.log(`[MissionCtrl] Player earned ${mission.rewards.cash} RC$`);
    }

    // Reset active mission
    gameState.activeMissionId = null;
  }
}

const missionControllerInstance = new MissionController();
export default missionControllerInstance;
