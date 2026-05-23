class VehiclePhysicsController {
  constructor() {
    this.laneWidth = 40; // Assumed width of a traffic lane
    this.avoidanceDistance = 50; // How far ahead an AI car looks for obstacles
  }

  // New, implemented function to move player-controlled vehicle
  applyPlayerDrive(vehicle) {
    if (!vehicle) return;
    
    // Calculate velocity components based on heading and speed
    const vx = Math.cos(vehicle.heading) * vehicle.speed;
    const vy = Math.sin(vehicle.heading) * vehicle.speed;
    
    vehicle.x += vx * 0.1; // Using a time delta multiplier
    vehicle.y += vy * 0.1;
  }

  // Improved AI vehicle logic with collision avoidance
  updateAIVehiclePositions(vehicles, roadNetwork) {
    for (const id in vehicles) {
      const vehicle = vehicles[id];
      // Player-controlled cars are updated separately
      if (vehicle.isJacked) continue;

      const road = roadNetwork.find(r => r.id === vehicle.currentRoadId);
      if (!road) continue;

      // Simple Obstacle Avoidance: Look ahead for other cars
      let isObstacleAhead = false;
      for (const otherId in vehicles) {
        if (id === otherId) continue;
        const otherVehicle = vehicles[otherId];

        const dist = Math.hypot(vehicle.x - otherVehicle.x, vehicle.y - otherVehicle.y);
        if (dist < this.avoidanceDistance) {
          // Basic check: is the other vehicle roughly in front of us?
          const angleToOther = Math.atan2(otherVehicle.y - vehicle.y, otherVehicle.x - vehicle.x);
          const angleDiff = Math.abs(vehicle.heading - angleToOther);
          if (angleDiff < 0.5) { // Is it in a ~30-degree forward cone?
            isObstacleAhead = true;
            break;
          }
        }
      }

      // Adjust speed based on obstacles
      if (isObstacleAhead) {
        vehicle.speed = Math.max(0, vehicle.speed - 0.5); // Slow down
      } else {
        vehicle.speed = Math.min(vehicle.maxSpeed, vehicle.speed + 0.2); // Speed up
      }

      // Move vehicle along its heading
      const vx = Math.cos(vehicle.heading) * vehicle.speed;
      const vy = Math.sin(vehicle.heading) * vehicle.speed;
      vehicle.x += vx * 0.1;
      vehicle.y += vy * 0.1;

      // Crude logic to keep cars on their roads (would be replaced by pathfinding)
      if (vehicle.x > road.endX || vehicle.x < road.startX) {
        vehicle.heading += Math.PI; // Turn around
      }
    }
  }
}

const vehiclePhysicsInstance = new VehiclePhysicsController();
export default vehiclePhysicsInstance;
