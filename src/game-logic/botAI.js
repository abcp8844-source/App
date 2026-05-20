class BotAI {
  constructor(id, name, startX, startY) {
    this.id = id;
    this.name = name;
    this.x = startX;
    this.y = startY;
    this.speed = 3.5; // Slightly slower than real players for balance
    this.targetX = startX;
    this.targetY = startY;
    this.state = 'WANDERING'; // WANDERING, GATHERING, ATTACKING
    this.detectionRadius = 150;
    this.lastDecisionTime = 0;
  }

  // Update bot position and logic on every frame tick (90 FPS sync)
  update(mapWidth, mapHeight, realPlayers, resources, currentTime) {
    // Make a new tactical decision every 2 seconds to reduce CPU load
    if (currentTime - this.lastDecisionTime > 2000) {
      this.makeDecision(mapWidth, mapHeight, realPlayers, resources);
      this.lastDecisionTime = currentTime;
    }

    this.moveTowardsTarget();
  }

  // Strategic decision making algorithm
  makeDecision(mapWidth, mapHeight, realPlayers, resources) {
    // 1. Check for nearby real players to engage or flee
    for (let player of realPlayers) {
      const dist = Math.hypot(player.x - this.x, player.y - this.y);
      if (dist < this.detectionRadius) {
        this.state = 'ATTACKING';
        this.targetX = player.x;
        this.targetY = player.y;
        return;
      }
    }

    // 2. If no players, search for resources to simulate survival behavior
    if (resources && resources.length > 0) {
      let closestResource = resources[0];
      let minDist = Math.hypot(closestResource.x - this.x, closestResource.y - this.y);

      for (let res of resources) {
        const dist = Math.hypot(res.x - this.x, res.y - this.y);
        if (dist < minDist) {
          minDist = dist;
          closestResource = res;
        }
      }

      if (minDist < this.detectionRadius * 1.5) {
        this.state = 'GATHERING';
        this.targetX = closestResource.x;
        this.targetY = closestResource.y;
        return;
      }
    }

    // 3. Default state: Idle wandering inside boundaries
    this.state = 'WANDERING';
    this.targetX = Math.max(50, Math.min(mapWidth - 50, this.x + (Math.random() * 200 - 100)));
    this.targetY = Math.max(50, Math.min(mapHeight - 50, this.y + (Math.random() * 200 - 100)));
  }

  // Smooth linear interpolation for movement vectors
  moveTowardsTarget() {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance > 5) {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }

  // Get synchronized state pack to send to the UI layer
  getSerializedState() {
    return {
      id: this.id,
      name: this.name,
      x: this.x,
      y: this.y,
      state: this.state
    };
  }
}

export default BotAI;
