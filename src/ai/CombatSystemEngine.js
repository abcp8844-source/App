class CombatSystemEngine {
  constructor() {
    // Ballistic profiling for high-end weapon categories
    this.weaponProfiles = {
      TACTICAL_PISTOL: { damage: 22, velocity: 350, range: 150, penetrationPower: 1 },
      ASSAULT_RIFLE:  { damage: 36, velocity: 720, range: 600, penetrationPower: 4 },
      HEAVY_SNIPER:   { damage: 84, velocity: 890, range: 1200, penetrationPower: 8 }
    };
  }

  // 1. Process bullet path propagation ticks and check for impact vectors
  executeProjectileFlight(bulletInstance, targetEntities, staticStructures) {
    // Advance bullet position based on velocity vector and delta time
    bulletInstance.currentX += bulletInstance.vectorX * (bulletInstance.profile.velocity * 0.016);
    bulletInstance.currentY += bulletInstance.vectorY * (bulletInstance.profile.velocity * 0.016);
    
    // Calculate total flight distance traveled to enforce max range limits
    const distanceTraveled = Math.hypot(bulletInstance.currentX - bulletInstance.startX, bulletInstance.currentY - bulletInstance.startY);
    if (distanceTraveled > bulletInstance.profile.range) {
      bulletInstance.isDead = true;
      return { hitDetected: false, reason: 'RANGE_EXPIRATION' };
    }

    // 2. Structural Penetration Check (Walls/Bases)
    for (let struct of staticStructures) {
      const distanceToWall = Math.hypot(bulletInstance.currentX - struct.x, bulletInstance.currentY - struct.y);
      if (distanceToWall <= 40 && !bulletInstance.impactedIds.has(struct.id)) {
        bulletInstance.impactedIds.add(struct.id);
        
        // Structural damage calculations
        struct.currentHealth -= bulletInstance.profile.damage * 2.5; 
        
        // Deduct penetration power; bullet dies if structure absorbs all kinetic energy
        bulletInstance.currentPenetration -= struct.type === 'MILITARY_STEEL' ? 6 : 3;
        if (bulletInstance.currentPenetration <= 0) {
          bulletInstance.isDead = true;
          return { hitDetected: true, hitType: 'STRUCTURE_IMPACT', objectId: struct.id };
        }
      }
    }

    // 3. Entity & Vehicle Hitbox Registration Loop
    for (let entity of targetEntities) {
      if (entity.id === bulletInstance.ownerId) continue;

      const distanceToTarget = Math.hypot(bulletInstance.currentX - entity.x, bulletInstance.currentY - entity.y);
      if (distanceToTarget <= 32) { // Hitbox radius threshold
        bulletInstance.isDead = true;
        this.applyDamagePayload(entity, bulletInstance.profile.damage);
        return { hitDetected: true, hitType: 'ENTITY_IMPACT', targetId: entity.id };
      }
    }

    return { hitDetected: false };
  }

  applyDamagePayload(entity, rawDamage) {
    if (entity.type === 'VEHICLE') {
      entity.health -= rawDamage * 0.75; // Vehicles have innate structural defense armor
      if (entity.health <= 0) entity.speed = 0; // Disable vehicle components on destruction
    } else {
      // Player / AI Bot damage calculation
      entity.health -= rawDamage;
    }
  }
}

const combatSystemInstance = new CombatSystemEngine();
export default combatSystemInstance;
