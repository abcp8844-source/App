class SurvivalSystem {
  constructor() {
    this.maxHealth = 100;
    this.safeZoneRadius = 1000; // Shrinking zone dynamic logic like PUBG
    this.dayDuration = 60000;   // 1 minute of daytime
    this.nightDuration = 40000; // 40 seconds of hardcore nighttime
  }

  // 1. Process damage and health calculation for entities (Players/Bots)
  applyDamage(entity, amount) {
    if (!entity.health) entity.health = this.maxHealth;
    
    entity.health -= amount;
    if (entity.health <= 0) {
      entity.health = 0;
      entity.isDead = true;
    }
    return entity.isDead;
  }

  // 2. Resource gathering calculation logic (Mining Trees or Rocks)
  gatherResource(player, resource) {
    if (resource.health <= 0) return null;

    const damageToResource = player.toolPower || 20;
    resource.health -= damageToResource;

    const reward = {
      type: resource.type,
      amount: resource.amount
    };

    if (resource.health <= 0) {
      resource.isDestroyed = true;
    }

    return reward;
  }

  // 3. Monitor Day/Night cycle ticks to scale up difficulty
  getEnvironmentState(elapsedTime) {
    const totalCycle = this.dayDuration + this.nightDuration;
    const currentCycleTime = elapsedTime % totalCycle;

    if (currentCycleTime < this.dayDuration) {
      return {
        phase: 'DAY',
        visibility: 1.0,
        hazardLevel: 'LOW'
      };
    } else {
      return {
        phase: 'NIGHT',
        visibility: 0.3, // Dark environment for premium hardcore feel
        hazardLevel: 'HIGH' // Bots become more aggressive
      };
    }
  }

  // 4. Shrink Blue Zone logic over time
  updateSafeZone(elapsedTime) {
    // Every 2 minutes, shrink the outer boundary of the map
    const shrinkFactor = Math.floor(elapsedTime / 120000);
    const currentRadius = Math.max(200, this.safeZoneRadius - shrinkFactor * 150);
    
    return {
      centerX: 1000,
      centerY: 1000,
      radius: currentRadius
    };
  }
}

const survivalInstance = new SurvivalSystem();
export default survivalInstance;
