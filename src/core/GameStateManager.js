import worldEngineInstance from './DynamicWorldEngine';
import vehiclePhysicsInstance from './VehiclePhysicsController';
import playerStateInstance from './PlayerStateController';
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

      this.activePlayer = userSnap.exists() ? userSnap.data() : {
        id: userId,
        x: 500, y: 500, health: 100,
        inventory: { wood: 50, stone: 20, iron: 0, fuel: 0, rareParts: 0 }
      };

      this.spawnMissionGuards();
      this.isRunning = true;
      return true;
    } catch (e) {
      this.isRunning = false;
      throw e;
    }
  }

  async saveGameState(userId) {
    try {
      await setDoc(doc(royalCloudDatabase, "users", userId), this.activePlayer, { merge: true });
    } catch (e) {
      console.error(e);
    }
  }

  spawnMissionGuards() {
    this.activeGuards = [];
    if (!this.runtimeWorldState?.worldMissions) return;
    
    this.runtimeWorldState.worldMissions.forEach((mission, idx) => {
      for (let i = 0; i < 3; i++) {
        this.activeGuards.push({ id: `g_${idx}_${i}`, x: mission.x, y: mission.y, health: 100 });
      }
    });
  }

  processFrameTick(joyX, joyY, run, interact) {
    if (!this.isRunning || !this.activePlayer) return null;

    playerStateInstance.updatePlayerFrame(this.activePlayer, joyX, joyY, run, 'STREET');
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
