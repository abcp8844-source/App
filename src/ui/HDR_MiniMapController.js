class HDRMiniMapController {
  constructor() {
    this.radarRadius = 300; // Visible radar detection bounds around the player in real-time
    this.uiScaleFactor = 0.15; // Precision scaling matrix converting world coordinates to mini UI coordinates
  }

  // 1. Calculate and map active runtime entities onto the mini radar overlay
  compileRadarSnapshot(player, worldState) {
    const playerX = player.x;
    const playerY = player.y;
    const currentZone = worldState.currentZoneId;

    const visibleBlips = {
      playerHeading: player.rotation,
      localRoads: [],
      enemyVehicles: [],
      activeObjectivePoints: []
    };

    // 2. Filter and project nearby interconnected roads onto the radar mesh
    worldState.roadNetwork.forEach(road => {
      const isNearStart = Math.hypot(road.startX - playerX, road.startY - playerY) <= this.radarRadius;
      const isNearEnd = Math.hypot(road.endX - playerX, road.endY - playerY) <= this.radarRadius;

      if (isNearStart || isNearEnd) {
        visibleBlips.localRoads.push({
          id: road.id,
          type: road.type,
          renderX1: (road.startX - playerX) * this.uiScaleFactor,
          renderY1: (road.startY - playerY) * this.uiScaleFactor,
          renderX2: (road.endX - playerX) * this.uiScaleFactor,
          renderY2: (road.endY - playerY) * this.uiScaleFactor
        });
      }
    });

    // 3. Populate real-time vehicular coordinates and traffic bot vectors
    for (let id in worldState.vehicles) {
      const vehicle = worldState.vehicles[id];
      const distance = Math.hypot(vehicle.x - playerX, vehicle.y - playerY);

      if (distance <= this.radarRadius && !vehicle.isJacked) {
        visibleBlips.enemyVehicles.push({
          id: vehicle.id,
          type: vehicle.type,
          isPanicking: vehicle.behaviorMode === 'PANIC',
          offsetX: (vehicle.x - playerX) * this.uiScaleFactor,
          offsetY: (vehicle.y - playerY) * this.uiScaleFactor
        });
      }
    }

    // 4. Inject storyline campaign landmarks through the dynamic Fog of War layer
    worldState.worldMissions.forEach(mission => {
      const isZoneLocked = !worldState.fogOfWar[mission.zone].isUnlocked;
      
      visibleBlips.activeObjectivePoints.push({
        id: mission.id,
        title: mission.title,
        isObscuredByFog: isZoneLocked, // Tells the UI to blur the icon if the region is locked
        offsetX: (mission.x - playerX) * this.uiScaleFactor,
        offsetY: (mission.y - playerY) * this.uiScaleFactor
      });
    });

    return visibleBlips;
  }
}

const miniMapInstance = new HDRMiniMapController();
export default miniMapInstance;
