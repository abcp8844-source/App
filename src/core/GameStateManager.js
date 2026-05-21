import worldEngineInstance from './DynamicWorldEngine';
import vehiclePhysicsInstance from './VehiclePhysicsController';
import playerStateInstance from './PlayerStateController';
import trafficBotInstance from '../ai/TrafficBotController';
import combatSystemInstance from './CombatSystemEngine';
import enemyCombatAIInstance from '../ai/EnemyCombatAI';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { royalCloudDatabase } from '../network/FirebaseConfig';

class GameStateManager {
  constructor() {
    this.isRunning = false;
    this.runtimeWorldState = null;
    this.activePlayer = null;
    this.activeGuards = [];
  }

  async bootUpEngine(userId) {
    try {
      this.runtimeWorldState = worldEngineInstance.generateWorldInfrastructure();
      
      const userRef = doc(royalCloudDatabase, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        this.activePlayer = userSnap.data();
      } else {
        this.activePlayer = {
          id: userId,
          x: 500,
          y: 500,
          rotation: 0,
          health: 100,
          inventory: { wood: 50, stone: 20, iron: 0, fuel: 0, rareParts: 0 },
          vitals: { hunger: 100, thirst: 100 }
        };
      }

      this.spawnMissionGuards();
      this.isRunning = true;
      console.log('Engine successfully booted with synced state.');
    } catch (error) {
      console.error('Engine Boot Error:', error);
    }
  }

  async saveGameState(userId) {
    try {
      const userRef = doc(royalCloudDatabase, "users", userId);
      await setDoc(userRef, this.activePlayer, { merge: true });
    } catch (error) {
      console.error('Sync Error:', error);
    }
  }

  spawnMissionGuards() {
    this.runtimeWorldState.worldMissions.forEach((mission, idx) => {
      for (let i = 0; i < 3; i++) {
        this.activeGuards.push({
          id: `guard_${idx}_${i}`,
          x: mission.x + (i * 40) - 60,
          y: mission.y + (i * 40) - 60,
          health: 100,
          currentAIState: 'PATROL'
        });
      }
    });
  }

  processFrameTick(joystickX, joystickY, runButtonPressed, interactActionTriggered) {
    if (!this.isRunning) return null;

    const currentZone = worldEngineInstance.zones;
    let surfaceType = 'OFF_ROAD';
    if (this.activePlayer.x > currentZone.VILLAGE.minX) surfaceType = 'DIRT_ROAD';
    if (this.activePlayer.x > currentZone.CITY.minX) surfaceType = 'STREET';

    if (interactActionTriggered) {
      playerStateInstance.handleVehicleInteraction(this.activePlayer, this.runtimeWorldState.vehicles);
    }
    
    playerStateInstance.updatePlayerFrame(this.activePlayer, joystickX, joystickY, runButtonPressed, surfaceType);
    vehiclePhysicsInstance.updateTrafficFlow(this.runtimeWorldState.vehicles, this.runtimeWorldState.roadNetwork);
    
    this.activeGuards.forEach(guard => {
      enemyCombatAIInstance.executeTacticalBrain(guard, this.activePlayer, []);
    });

    return {
      player: this.activePlayer,
      vehicles: this.runtimeWorldState.vehicles,
      guards: this.activeGuards
    };
  }
}

const gameStateInstance = new GameStateManager();
export default gameStateInstance;
