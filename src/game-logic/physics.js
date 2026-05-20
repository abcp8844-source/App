class PhysicsEngine {
  constructor() {
    // Defines the physical size of objects for collision checking
    this.playerRadius = 15;
    this.resourceRadius = 20;
    this.structureSize = 40; // Size of built walls/towers
  }

  // 1. Constrain entity inside the main map boundaries
  clampToMap(entity, mapWidth, mapHeight) {
    let corrected = false;
    
    if (entity.x < this.playerRadius) {
      entity.x = this.playerRadius;
      corrected = true;
    } else if (entity.x > mapWidth - this.playerRadius) {
      entity.x = mapWidth - this.playerRadius;
      corrected = true;
    }

    if (entity.y < this.playerRadius) {
      entity.y = this.playerRadius;
      corrected = true;
    } else if (entity.y > mapHeight - this.playerRadius) {
      entity.y = mapHeight - this.playerRadius;
      corrected = true;
    }

    return corrected;
  }

  // 2. Check and resolve collision between two circle entities (Player vs Player/Bot/Resource)
  checkCircleCollision(entityA, entityB, radiusA = this.playerRadius, radiusB = this.playerRadius) {
    const dx = entityB.x - entityA.x;
    const dy = entityB.y - entityA.y;
    const distance = Math.hypot(dx, dy);
    const minDist = radiusA + radiusB;

    if (distance < minDist) {
      // Calculate overlap distance
      const overlap = minDist - distance;
      const nx = dx / distance;
      const ny = dy / distance;

      // Push them apart equally to resolve stuck positions
      entityA.x -= nx * (overlap * 0.5);
      entityA.y -= ny * (overlap * 0.5);
      entityB.x += nx * (overlap * 0.5);
      entityB.y += ny * (overlap * 0.5);
      
      return true;
    }
    return false;
  }

  // 3. Check collision between a moving entity and a static square structure (Building Walls)
  checkStructureCollision(entity, structure) {
    // Find the closest point on the square structure to the circle entity
    const closestX = Math.max(structure.x, Math.min(entity.x, structure.x + this.structureSize));
    const closestY = Math.max(structure.y, Math.min(entity.y, structure.y + this.structureSize));

    const dx = entity.x - closestX;
    const dy = entity.y - closestY;
    const distance = Math.hypot(dx, dy);

    if (distance < this.playerRadius) {
      const overlap = this.playerRadius - distance;
      
      // If distance is 0, prevent division by zero
      if (distance === 0) return true;

      // Push the entity away from the structure surface
      entity.x += (dx / distance) * overlap;
      entity.y += (dy / distance) * overlap;
      return true;
    }
    return false;
  }
}

const physicsInstance = new PhysicsEngine();
export default physicsInstance;
