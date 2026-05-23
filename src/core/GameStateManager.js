import dynamicWorldInstance from './DynamicWorldEngine';
import playerStateInstance from './PlayerStateController';
import vehiclePhysicsInstance from './VehiclePhysicsController';
import marineAviationInstance from './MarineAviationFleetController';
import soundEngineInstance from './SoundFXDynamicEngine';
import enemyAIInstance from '../ai/EnemyCombatAI';
import missionControllerInstance from './MissionController';

class GameStateManager {
  constructor() {
    this.runtimeWorldState = dynamicWorldInstance.generateWorldInfrastructure();
    this.runtimeWorldState.worldMissions = dynamicWorldInstance.generateInitialMissions();
    this.activePlayer = { x: 2500, y: 2500, health: 100, cash: 500 };
    this.joyX = 0;
    this.joyY = 0;
    this.run = false;
    this.drivingControls = { throttle: false, brake: false, steer: 0 };
    this.subscribers = [];
    this.activeMissionId = null;
  }

  // Game Loop
  update() {
    const playerVehicle = this.activePlayer.currentVehicleId ? this.runtimeWorldState.vehicles[this.activePlayer.currentVehicleId] : null;
    
    playerStateInstance.updatePlayerFrame(this.activePlayer, this.joyX, this.joyY, this.run, playerVehicle, this.drivingControls);

    vehiclePhysicsInstance.updateAIVehiclePositions(this.runtimeWorldState.vehicles, this.runtimeWorldState.roadNetwork);
    marineAviationInstance.updateFleet(this.runtimeWorldState.marineAviation);

    const worldGrid = this.runtimeWorldState.grid;
    this.runtimeWorldState.guards.forEach(guard => {
      enemyAIInstance.executeTacticalBrain(guard, this.activePlayer, worldGrid);
    });

    missionControllerInstance.update(this.getFullState());
    
    soundEngineInstance.processAudioFrame(this.getFullState());
    
    this.notifySubscribers();
    requestAnimationFrame(() => this.update());
  }

  startMission(missionId) {
    const mission = this.runtimeWorldState.worldMissions.find(m => m.id === missionId);
    if (mission && mission.status === 'AVAILABLE') {
      this.activeMissionId = missionId;
      mission.status = 'ACTIVE';
      console.log(`[GameState] Mission started: ${mission.title}`);
    }
  }

  setJoystick(x, y) {
    this.joyX = x;
    this.joyY = y;
  }

  setRun(isRunning) {
    this.run = isRunning;
  }

  setDrivingControls(controls) {
    this.drivingControls = controls;
  }

  getFullState() {
    return {
      player: this.activePlayer,
      vehicles: this.runtimeWorldState.vehicles,
      worldMissions: this.runtimeWorldState.worldMissions,
      activeMissionId: this.activeMissionId,
      world: this.runtimeWorldState,
      marineAviation: this.runtimeWorldState.marineAviation,
      guards: this.runtimeWorldState.guards
    };
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  notifySubscribers() {
    const fullState = this.getFullState();
    this.subscribers.forEach(callback => callback(fullState));
  }
  
  async initializeGame() {
    await soundEngineInstance.initializeAudioEngine();
    this.runtimeWorldState.guards = [ { id: 'g1', x: 2250, y: 1850, health: 100 } ];
    this.update();
  }
}

const gameStateInstance = new GameStateManager();
gameStateInstance.initializeGame();
export default gameStateInstance;
