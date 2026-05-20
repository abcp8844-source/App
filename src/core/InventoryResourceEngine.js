class InventoryResourceEngine {
  constructor() {
    this.maxPocketWeight = 120; // Hard limit before player gets encumbered and slows down
    this.resourceWeights = { wood: 0.2, stone: 0.5, iron: 1.2, fuel: 2.0, rareParts: 0.1 };
  }

  // 1. Calculate drop rates dynamically based on the geographic location of harvest
  executeHarvestNode(currentZoneId, harvestType) {
    let yieldAmount = Math.floor(Math.random() * 15) + 5;
    let materialOutput = 'wood';

    if (currentZoneId === 'ZONE_FOREST') {
      materialOutput = harvestType === 'ROCK' ? 'stone' : 'wood';
    } else if (currentZoneId === 'ZONE_VILLAGE') {
      // Village spawns structural resources and early mechanical items
      materialOutput = Math.random() > 0.75 ? 'fuel' : 'stone';
    } else if (currentZoneId === 'ZONE_CITY') {
      // High tier zones provide heavy component metals for building military steel bases
      materialOutput = Math.random() > 0.4 ? 'iron' : 'rareParts';
      yieldAmount = Math.floor(Math.random() * 5) + 2; // Scarce resource limits
    }

    return { type: materialOutput, count: yieldAmount };
  }

  // 2. Safe transactional injection validating weight limits before saving to profile
  addLootToInventory(playerInventory, resourceType, count) {
    const currentWeight = this.calculateCurrentWeight(playerInventory);
    const addedWeight = (this.resourceWeights[resourceType] || 0) * count;

    if (currentWeight + addedWeight > this.maxPocketWeight) {
      return { success: false, reason: 'INVENTORY_OVERWEIGHT_LIMIT' };
    }

    if (!playerInventory[resourceType]) playerInventory[resourceType] = 0;
    playerInventory[resourceType] += count;

    return {
      success: true,
      updatedInventory: playerInventory,
      newWeight: currentWeight + addedWeight
    };
  }

  calculateCurrentWeight(inventory) {
    let weight = 0;
    for (let key in this.resourceWeights) {
      if (inventory[key]) {
        weight += inventory[key] * this.resourceWeights[key];
      }
    }
    return weight;
  }
}

const inventoryResourceInstance = new InventoryResourceEngine();
export default inventoryResourceInstance;
