class VehiclePhysicsController {
  constructor() {
    this.hijackRadius = 45; // Maximum distance to hijack an AI vehicle
  }

  // AI Logic for vehicles to auto-run and follow street paths smoothly
  updateTrafficFlow(vehicles, roadNetwork) {
    for (let id in vehicles) {
      const vehicle = vehicles[id];
      
      // If player has hijacked it, bypass automated AI traffic routing
      if (vehicle.isJacked || !vehicle.driverId) continue;

      const currentRoad = roadNetwork.find(r => r.id === vehicle.currentRoadId);
      if (currentRoad) {
        // Move vehicle along the road vectors
        if (currentRoad.startX !== currentRoad.endX) {
          vehicle.x += vehicle.maxSpeed * 0.5; // Smooth progression along horizontal road
          if (vehicle.x > currentRoad.endX) vehicle.x = currentRoad.startX; // Loop back traffic
        } else {
          vehicle.y += vehicle.maxSpeed * 0.5; // Smooth progression along vertical road
          if (vehicle.y > currentRoad.endY) vehicle.y = currentRoad.startY;
        }
      }
    }
    return vehicles;
  }

  // GTA Style Highjacking logic: Hijack vehicle from AI Driver
  attemptVehicleHijack(player, vehicles) {
    for (let id in vehicles) {
      const vehicle = vehicles[id];
      const distance = Math.hypot(vehicle.x - player.x, vehicle.y - player.y);

      // Check if player is close enough to pull the bot driver out
      if (distance <= this.hijackRadius) {
        const hijackedDriverId = vehicle.driverId;
        
        vehicle.driverId = null; // Eject bot driver
        vehicle.isJacked = true;
        player.isDriving = true;
        player.currentVehicleId = vehicle.id;

        return {
          success: true,
          vehicleId: vehicle.id,
          ejectedBotId: hijackedDriverId
        };
      }
    }
    return { success: false };
  }
}

const vehiclePhysicsInstance = new VehiclePhysicsController();
export default vehiclePhysicsInstance;
