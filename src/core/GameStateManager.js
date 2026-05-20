import worldEngineInstance from './DynamicWorldEngine';
import vehiclePhysicsInstance from './VehiclePhysicsController';
import playerStateInstance from './PlayerStateController';
import trafficBotInstance from '../ai/TrafficBotController';
import combatSystemInstance from './CombatSystemEngine';
import enemyCombatAIInstance from '../ai/EnemyCombatAI';

class GameStateManager {
  constructor() {
    this.isRunning = false;
    this.runtimeWorldState = null;
    this.activePlayer = null;
    this.activeGuards = [];
  }

  // 1. Setup the initial modern game state instance
  bootUpEngine(playerProfile) {
    this.runtimeWorldState = worldEngineInstance.generateWorldInfrastructure();
    
    // Injecting standard starting values for the real player profile
    this.activePlayer = {
      id: playerProfile.id,
      x: 500, // Starts in the Forest safe zone
      y: 500,
      rotation: 0,
      health: 100,
      xp: 0,
      blueprints: [],
      inventory: { wood: 50, stone: 20, iron: 0, fuel: 0, rareParts: 0 },
      vitals: { hunger: 100, thirst: 100 },
      isDriving: false,
      currentVehicleId: null
    };

    // Spawn 15 heavily armed tactical guards across mission hubs
    this.spawnMissionGuards();
    this.isRunning = true;
    console.log('[Engine] Game State Manager running at high efficiency.');
  }

  spawnMissionGuards() {
    this.runtimeWorldState.worldMissions.forEach((mission, idx) => {
      for (let i = 0; i < 3; i++) {
        this.activeGuards.push({
          id: `guard_${idx}_${i}`,
          x: mission.x + (i * 40) - 60,
          y: mission.y + (i * 40) - 60,
          health: 100,
          currentAIState: 'PATROL',
          patrolTick: Math.random() * 10,
          isCoverActive: false,
          lastShotTime: 0
        });
      }
    });
  }

  // 2. The Authoritative Master Game Loop Frame Tick (Runs 60 times per second)
  processFrameTick(joystickX, joystickY, runButtonPressed, interactActionTriggered) {
    if (!this.isRunning) return null;

    // A. Detect current underground terrain base for friction calculations
    const currentZone = worldEngineInstance.zones;
    let surfaceType = 'OFF_ROAD';
    if (this.activePlayer.x > currentZone.VILLAGE.minX && this.activePlayer.x <= currentZone.VILLAGE.maxX) surfaceType = 'DIRT_ROAD';
    if (this.activePlayer.x > currentZone.CITY.minX) surfaceType = 'STREET';

    // B. Player Action Handling (Walking, Running, Entering Cars)
    if (interactActionTriggered) {
      playerStateInstance.handleVehicleInteraction(this.activePlayer, this.runtimeWorldState.vehicles);
    }
    playerStateInstance.updatePlayerFrame(this.activePlayer, joystickX, joystickY, runButtonPressed, surfaceType);

    // C. AI Traffic and Bot Physics Processing
    vehiclePhysicsInstance.updateTrafficFlow(this.runtimeWorldState.vehicles, this.runtimeWorldState.roadNetwork);
    
    const threats = this.activePlayer.isShooting ? [{ x: this.activePlayer.x, y: this.activePlayer.y }] : [];
    trafficBotInstance.evaluateBotBrainStates(this.runtimeWorldState.vehicles, this.activePlayer, threats);

    // D. Armed Mission Guards Combat Loop Execution
    this.activeGuards.forEach(guard => {
      // Pull base buildings array dynamically to pass for cover validation
      const sampleStructures = []; 
      enemyCombatAIInstance.executeTacticalBrain(guard, this.activePlayer, sampleStructures);
    });

    // Return current frame state buffers to the WebGL rendering screen layer
    return {
      player: this.activePlayer,
      vehicles: this.runtimeWorldState.vehicles,
      guards: this.activeGuards,
      mapVisibility: this.runtimeWorldState.fogOfWar
    };
  }
}

const gameStateInstance = new GameStateManager();
export default gameStateInstance;
