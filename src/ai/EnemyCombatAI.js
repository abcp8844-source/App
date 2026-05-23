import pathfindingInstance from './Pathfinding';

class EnemyCombatAI {
  constructor() {
    this.detectionRadius = 150;
    this.attackRadius = 10;
    this.movementSpeed = 2.5;
    this.attackDamage = 5;
    this.attackCooldown = 60;
  }

  executeTacticalBrain(guard, player, worldGrid) {
    if (!guard || !player || guard.health <= 0) {
      if (guard) guard.behaviorState = 'INACTIVE';
      return;
    }

    if (!guard.spawnPoint) guard.spawnPoint = { x: guard.x, y: guard.y };
    if (guard.attackTimer === undefined) guard.attackTimer = 0;
    if (guard.attackTimer > 0) guard.attackTimer--;

    const distToPlayer = Math.hypot(guard.x - player.x, guard.y - player.y);

    if (distToPlayer <= this.attackRadius) {
      guard.behaviorState = 'ATTACKING';
      this.attackPlayer(guard, player);
    } else if (distToPlayer <= this.detectionRadius) {
      guard.behaviorState = 'ENGAGING';
      this.chasePlayer(guard, player, worldGrid);
    } else {
      this.returnToPost(guard, worldGrid);
    }
  }

  attackPlayer(guard, player) {
    if (guard.attackTimer <= 0) {
      console.log(`[EnemyAI] Guard ${guard.id} attacks player!`);
      player.health -= this.attackDamage;
      if (player.health < 0) player.health = 0;
      guard.attackTimer = this.attackCooldown;
    }
  }

  chasePlayer(guard, player, grid) {
    const start = { x: Math.floor(guard.x / 10), y: Math.floor(guard.y / 10) };
    const end = { x: Math.floor(player.x / 10), y: Math.floor(player.y / 10) };
    const path = pathfindingInstance.findPath(grid, start, end);

    if (path && path.length > 1) {
      const nextStep = path[1];
      const targetX = nextStep.x * 10;
      const targetY = nextStep.y * 10;
      const angle = Math.atan2(targetY - guard.y, targetX - guard.x);
      guard.x += Math.cos(angle) * this.movementSpeed;
      guard.y += Math.sin(angle) * this.movementSpeed;
    } else {
      // No path, stand still
    }
  }

  returnToPost(guard, grid) {
     const start = { x: Math.floor(guard.x / 10), y: Math.floor(guard.y / 10) };
     const end = { x: Math.floor(guard.spawnPoint.x / 10), y: Math.floor(guard.spawnPoint.y / 10) };
     const path = pathfindingInstance.findPath(grid, start, end);

    if (path && path.length > 1) {
      const nextStep = path[1];
      const targetX = nextStep.x * 10;
      const targetY = nextStep.y * 10;
      const angle = Math.atan2(targetY - guard.y, targetX - guard.x);
      guard.x += Math.cos(angle) * this.movementSpeed;
      guard.y += Math.sin(angle) * this.movementSpeed;
    } else {
      guard.behaviorState = 'IDLE';
    }
  }
}

const enemyCombatAIInstance = new EnemyCombatAI();
export default enemyCombatAIInstance;
