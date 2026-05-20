class TrafficBotController {
  constructor() {
    this.BEHAVIOR_CRUISE = 'CRUISE';
    this.BEHAVIOR_PANIC = 'PANIC';
    this.detectionRadius = 150; // Distance to detect gunshots or hijack attempts
  }

  // 1. Process behavioral updates for all deployed road bots based on environment threats
  evaluateBotBrainStates(vehicles, playerCoordinates, activeThreats) {
    for (let id in vehicles) {
      const vehicle = vehicles[id];

      // Skip processing if the vehicle is hijacked or empty
      if (vehicle.isJacked || !vehicle.driverId) continue;

      // Check distance to real-world threats (e.g., player gunshots or proximity)
      const distanceToPlayer = Math.hypot(vehicle.x - playerCoordinates.x, vehicle.y - playerCoordinates.y);
      const isThreatNearby = activeThreats.some(threat => 
        Math.hypot(vehicle.x - threat.x, vehicle.y - threat.y) <= this.detectionRadius
      );

      if (isThreatNearby || (playerCoordinates.isAttacking && distanceToPlayer <= this.detectionRadius)) {
        vehicle.behaviorMode = this.BEHAVIOR_PANIC;
      } else if (!vehicle.behaviorMode) {
        vehicle.behaviorMode = this.BEHAVIOR_CRUISE;
      }

      this.executeSteeringLogic(vehicle, distanceToPlayer);
    }
    return vehicles;
  }

  // 2. Adjust vehicle acceleration vectors based on emotional behavior profile
  executeSteeringLogic(vehicle, distanceToPlayer) {
    if (vehicle.behaviorMode === this.BEHAVIOR_PANIC) {
      // Evasive Maneuver: Max out speed and break standard traffic flow laws
      vehicle.speed = vehicle.maxSpeed * 1.5; 
      
      // If the player gets too close during a carjack, the bot attempts to run them over or swerve
      if (distanceToPlayer < 60) {
        vehicle.x += (Math.random() - 0.5) * 15; // Swerving vector offsets
        vehicle.y += (Math.random() - 0.5) * 15;
      }
    } else {
      // Normal Behavior: Maintain safe cruising speeds matching the road limits
      if (vehicle.speed < vehicle.maxSpeed) {
        vehicle.speed += 0.5; // Smooth incremental acceleration acceleration
      } else {
        vehicle.speed = vehicle.maxSpeed;
      }
    }
  }

  // 3. Collision avoidance loop: Stops bots from clipping into player-built concrete houses blocking roads
  handleIntersectionAndObstacles(vehicle, staticStructures) {
    for (let struct of staticStructures) {
      const distanceToStructure = Math.hypot(vehicle.x - struct.x, vehicle.y - struct.y);
      
      // If a player built a reinforced concrete wall across the street, force the bot to slam brakes
      if (distanceToStructure < 75) {
        vehicle.speed = 0; // Emergency brake threshold to prevent structural clipping
        
        // If panicked, force the AI to reverse out of the dead-end street block
        if (vehicle.behaviorMode === this.BEHAVIOR_PANIC) {
          vehicle.x -= 10; 
          vehicle.y -= 10;
        }
        break;
      }
    }
  }
}

const trafficBotInstance = new TrafficBotController();
export default trafficBotInstance;
