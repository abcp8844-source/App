class BuildManager {
  constructor() {
    this.structureSize = 40; // 40x40 pixel grid structures
    this.recipes = {
      WALL: { wood: 20, stone: 10, maxHealth: 200 },
      TOWER: { wood: 50, stone: 30, maxHealth: 500 }
    };
  }

  // 1. Validate if the placement spot is clean and within boundaries
  canPlaceStructure(x, y, structures, currentResources, type) {
    const recipe = this.recipes[type];
    if (!recipe) return { valid: false, reason: 'INVALID_TYPE' };

    // Check if player has enough collected materials
    if (currentResources.wood < recipe.wood || currentResources.stone < recipe.stone) {
      return { valid: false, reason: 'INSUFFICIENT_RESOURCES' };
    }

    // AABB Collision overlap check with existing buildings
    for (let struct of structures) {
      if (
        x < struct.x + this.structureSize &&
        x + this.structureSize > struct.x &&
        y < struct.y + this.structureSize &&
        y + this.structureSize > struct.y
      ) {
        return { valid: false, reason: 'SPACE_OCCUPIED' };
      }
    }

    return { valid: true, recipe };
  }

  // 2. Execute building placement logic and deduct resources
  createStructure(x, y, type, structures, playerInventory) {
    const validation = this.canPlaceStructure(x, y, structures, playerInventory, type);
    
    if (!validation.valid) {
      return { success: false, reason: validation.reason };
    }

    // Deduct the recipe materials from player inventory
    playerInventory.wood -= validation.recipe.wood;
    playerInventory.stone -= validation.recipe.stone;

    const newStructure = {
      id: `struct_${type.toLowerCase()}_${Date.now()}`,
      type: type,
      x: Math.floor(x / 40) * 40, // Snap to clean grid system
      y: Math.floor(y / 40) * 40,
      health: validation.recipe.maxHealth,
      maxHealth: validation.recipe.maxHealth
    };

    return {
      success: true,
      structure: newStructure,
      updatedInventory: playerInventory
    };
  }
}

const buildInstance = new BuildManager();
export default buildInstance;
