class EnemyCombatAI {
  constructor() {
    this.STATE_PATROL = 'PATROL';
    this.STATE_ENGAGE = 'ENGAGE';
    this.STATE_SEEK_COVER = 'SEEK_COVER';
    
    this.combatRadius = 250; // Distance to engage the real player
  }

  // 1. Core behavior selector evaluating player distance and local environmental grid
  executeTacticalBrain(guardBot, player, staticStructures) {
    const distanceToPlayer = Math.hypot(guardBot.x - player.x, guardBot.y - player.y);

    // If guard bot is dead, terminate state immediately
    if (guardBot.health <= 0) return guardBot;

    switch (guardBot.currentAIState) {
      case this.STATE_PATROL:
        // Walk in a localized loop guarding the objective point
        this.performAreaPatrol(guardBot);
        if (distanceToPlayer <= this.combatRadius && !player.isDriving) {
          guardBot.currentAIState = this.STATE_SEEK_COVER;
        }
        break;

      case this.STATE_SEEK_COVER:
        // Scan the map array for nearest wall/structure to take defensive cover
        const nearestCover = this.findNearestStructuralCover(guardBot, staticStructures);
        if (nearestCover) {
          guardBot.x = nearestCover.x;
          guardBot.y = nearestCover.y;
          guardBot.isCoverActive = true;
          guardBot.currentAIState = this.STATE_ENGAGE; // Shift to offensive fire loop
        } else {
          guardBot.currentAIState = this.STATE_ENGAGE; // No cover found, fight in open ground
        }
        break;

      case this.STATE_ENGAGE:
        // Tactical offensive loop
        if (distanceToPlayer > this.combatRadius + 100) {
          guardBot.currentAIState = this.STATE_PATROL; // Target lost, drop back to patrol
          guardBot.isCoverActive = false;
        } else {
          this.aimAndFireAtTarget(guardBot, player);
        }
        break;
    }

    return guardBot;
  }

  performAreaPatrol(guardBot) {
    // Smooth ping-pong movement along their assigned guard sector
    guardBot.patrolTick += 0.02;
    guardBot.x += Math.sin(guardBot.patrolTick) * 1.5;
  }

  findNearestStructuralCover(guardBot, staticStructures) {
    let closestWall = null;
    let minDistance = 9999;

    staticStructures.forEach(struct => {
      const dist = Math.hypot(struct.x - guardBot.x, struct.y - guardBot.y);
      if (dist < minDistance && dist < 120) {
        minDistance = dist;
        closestWall = struct;
      }
    });

    return closestWall;
  }

  aimAndFireAtTarget(guardBot, player) {
    guardBot.rotation = Math.atan2(player.y - guardBot.y, player.x - guardBot.x);
    
    // Controlled burst fire to simulate a realistic military guard behavior
    const currentTime = Date.now();
    if (!guardBot.lastShotTime || currentTime - guardBot.lastShotTime > 800) {
      guardBot.isShooting = true;
      guardBot.lastShotTime = currentTime;
      
      // Inflict structural damage payload on player health
      player.health -= 8; 
    } else {
      guardBot.isShooting = false;
    }
  }
}

const enemyCombatAIInstance = new EnemyCombatAI();
export default enemyCombatAIInstance;
