class BorderControlWaterEngine {
  constructor() {
    this.INNER_MAP_LIMIT = 5000; // Original core island layout
    this.TOTAL_WORLD_LIMIT = 5600; // Extended world size with endless water simulation
    this.CRITICAL_CRASH_ZONE = 5550; // The hard boundary loop where vehicle crashes trigger
  }

  // 1. Live Vector Intersection Loop tracking all entity coordinates
  processBoundaryPhysicsCheck(entityNode, isPlayerControlled) {
    const absX = Math.abs(entityNode.x);
    const absY = Math.abs(entityNode.y);

    // Identify if entity is inside the newly allocated 600m open ocean belt
    const isInsideWaterZone = entityNode.x < 0 || entityNode.x > this.INNER_MAP_LIMIT ||
                              entityNode.y < 0 || entityNode.y > this.INNER_MAP_LIMIT;

    if (isInsideWaterZone) {
      entityNode.currentSurfaceContext = 'DEEP_OCEAN_WATER';
    }

    // 2. Authoritative Elimination / Crash Loop Loophole
    if (entityNode.x > this.CRITICAL_CRASH_ZONE || entityNode.x < (5000 - this.CRITICAL_CRASH_ZONE) ||
        entityNode.y > this.CRITICAL_CRASH_ZONE || entityNode.y < (5000 - this.CRITICAL_CRASH_ZONE)) {
      
      if (isPlayerControlled) {
        // Player triggers a total vehicle write-off loop
        entityNode.health = 0;
        entityNode.speed = 0;
        console.log("[BoundaryGuard] Player exceeded global marine territory coordinates. Vehicle engine critical failure triggered.");
        return { action: 'PLAYER_VEHICLE_CRASHED', deadFlag: true };
      } else {
        // Enemy AI bots safely erase from memory to avoid performance leaks on mobile RAM
        entityNode.isActiveInFrame = false;
        console.log(`[BoundaryGuard] Enemy bot ${entityNode.id} despawned successfully outside perimeter matrix.`);
        return { action: 'ENEMY_DESPAWNED', deadFlag: false };
      }
    }

    return { action: 'PROCEED_NORMAL_NAVIGATION', deadFlag: false };
  }
}

const borderControlWaterInstance = new BorderControlWaterEngine();
export default borderControlWaterInstance;
