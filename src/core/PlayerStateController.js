import fleetRegistryInstance from './VehicleFleetRegistry';

class PlayerStateController {
  constructor() {
    this.WALK_SPEED = 4;
    this.RUN_SPEED = 7;
    this.interactionRadius = 50; // Distance required to enter a vehicle
  }

  // 1. Process standard player physics frames (Walking, Running, Survival Vitals)
  updatePlayerFrame(player, joystickX, joystickY, isRunning, currentSurface) {
    // Prevent standard walking updates if the player is currently driving a vehicle
    if (player.isDriving && player.currentVehicleId) return player;

    const baseSpeed = isRunning ? this.RUN_SPEED : this.WALK_SPEED;
    
    // Mud or off-road grass slows down the player's running speed naturally
    const surfaceModifier = currentSurface === 'OFF_ROAD' ? 0.7 : 1.0;
    const finalSpeed = baseSpeed * surfaceModifier;

    // Translate joystick vectors directly to modern world coordinates
    player.x += joystickX * finalSpeed;
    player.y += joystickY * finalSpeed;

    if (joystickX !== 0 || joystickY !== 0) {
      player.rotation = Math.atan2(joystickY, joystickX); // Face movement direction smoothly
    }

    // Core survival drains over time to keep player engaged in the loop
    player.vitals.hunger -= 0.002;
    player.vitals.thirst -= 0.003;

    if (player.vitals.hunger <= 0 || player.vitals.thirst <= 0) {
      player.health -= 0.1; // Health deprecation due to starvation
    }

    return player;
  }

  // 2. High-end transaction handling mounting and dismounting the multi-car network fleet
  handleVehicleInteraction(player, globalVehicles) {
    if (player.isDriving && player.currentVehicleId) {
      // EXIT ACTION: Dismount vehicle safely onto the street
      const currentVehicle = globalVehicles[player.currentVehicleId];
      if (currentVehicle) {
        currentVehicle.isJacked = player.isDriving = false;
        currentVehicle.speed = 0;
        
        // Position player safely slightly to the left of the exited vehicle door
        player.x = currentVehicle.x - 45;
        player.y = currentVehicle.y;
        player.currentVehicleId = null;
      }
      return { action: 'EXIT_SUCCESS' };
    }

    // ENTER/HIJACK ACTION: Scan for closest available vehicle configuration within range
    for (let id in globalVehicles) {
      const vehicle = globalVehicles[id];
      const distance = Math.hypot(vehicle.x - player.x, vehicle.y - player.y);

      if (distance <= this.interactionRadius) {
        const vehicleSpecs = fleetRegistryInstance.getVehicleSpecs(vehicle.modelId);
        
        vehicle.isJacked = true;
        vehicle.driverId = null; // Eject AI traffic driver out if present
        
        player.isDriving = true;
        player.currentVehicleId = vehicle.id;

        return {
          action: 'ENTER_SUCCESS',
          vehicleId: vehicle.id,
          specs: vehicleSpecs
        };
      }
    }

    return { action: 'NO_VEHICLE_IN_RANGE' };
  }
}

const playerStateInstance = new PlayerStateController();
export default playerStateInstance;
